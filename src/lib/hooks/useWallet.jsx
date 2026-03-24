"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
import { useAccount, useBalance, useConnect, useDisconnect, useChainId, useSignMessage, } from "wagmi";
import { SiweMessage } from "siwe";
import { formatEther } from "viem";
import { INITIAL_WALLET_STATE } from "../constants";
import { clearSessionToken, fetchAuthMe, fetchNonce, getSessionToken, getSiweDomain, getSiweUri, logoutSession, verifySiwe, } from "../auth";
const WalletContext = createContext(null);
function formatNativeBalance(value) {
    if (value === undefined)
        return "0.00";
    const n = Number(formatEther(value));
    if (!Number.isFinite(n))
        return "0.00";
    if (n >= 1000)
        return n.toFixed(2);
    if (n >= 1)
        return n.toFixed(4);
    return n.toFixed(6);
}
export function WalletProvider({ children }) {
    const { address, isConnected, connector, status } = useAccount();
    const chainId = useChainId();
    const { connectAsync, connectors, isPending, error: connectError, reset } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { signMessageAsync } = useSignMessage();
    const { data: balanceData, refetch: refetchBalance } = useBalance({
        address,
        query: { enabled: Boolean(address) },
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingConnectorId, setPendingConnectorId] = useState(null);
    const [localError, setLocalError] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const authInFlight = useRef(null);
    const lastAuthedAddress = useRef(null);
    const symbol = balanceData?.symbol ?? "ETH";
    const wallet = useMemo(() => isConnected && address
        ? {
            connected: true,
            address,
            balance: formatNativeBalance(balanceData?.value),
            balanceNanoErgs: balanceData?.value?.toString() ?? "0",
            chainId,
            connectorName: connector?.name,
            symbol,
        }
        : INITIAL_WALLET_STATE, [
        isConnected,
        address,
        balanceData?.value,
        chainId,
        connector?.name,
        symbol,
    ]);
    const error = localError ||
        (connectError
            ? connectError.message.includes("User rejected")
                ? "Connection rejected. Please try again."
                : connectError.message
            : null);
    const runSiweLogin = useCallback(async (addr, chain) => {
        if (authInFlight.current)
            return authInFlight.current;
        const task = (async () => {
            setIsAuthenticating(true);
            setLocalError(null);
            try {
                const existing = getSessionToken();
                if (existing && lastAuthedAddress.current === addr.toLowerCase()) {
                    const me = await fetchAuthMe();
                    if (me && me.address === addr.toLowerCase()) {
                        setIsAuthenticated(true);
                        return existing;
                    }
                }
                const nonce = await fetchNonce(addr);
                const message = new SiweMessage({
                    domain: getSiweDomain(),
                    address: addr,
                    statement: "Sign in to AlphaNex Exchange",
                    uri: getSiweUri(),
                    version: "1",
                    chainId: chain,
                    nonce,
                });
                const prepared = message.prepareMessage();
                const signature = await signMessageAsync({ message: prepared });
                const session = await verifySiwe({ message: prepared, signature });
                lastAuthedAddress.current = session.address;
                setIsAuthenticated(true);
                return session.token;
            }
            catch (err) {
                clearSessionToken();
                setIsAuthenticated(false);
                lastAuthedAddress.current = null;
                const message = err instanceof Error ? err.message : "SIWE sign-in failed";
                if (!message.toLowerCase().includes("rejected")) {
                    setLocalError(message);
                }
                else {
                    setLocalError("Sign-in rejected. Please try again.");
                }
                throw err;
            }
            finally {
                setIsAuthenticating(false);
                authInFlight.current = null;
            }
        })();
        authInFlight.current = task;
        return task;
    }, [signMessageAsync]);
    const ensureAuth = useCallback(async () => {
        if (!address || !isConnected) {
            throw new Error("Connect wallet first");
        }
        return runSiweLogin(address, chainId);
    }, [address, isConnected, chainId, runSiweLogin]);
    // After wallet connects, establish SIWE session
    useEffect(() => {
        if (!isConnected || !address) {
            setIsAuthenticated(false);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const me = await fetchAuthMe();
                if (cancelled)
                    return;
                if (me && me.address === address.toLowerCase()) {
                    lastAuthedAddress.current = me.address;
                    setIsAuthenticated(true);
                    return;
                }
                await runSiweLogin(address, chainId);
            }
            catch {
                /* error already surfaced */
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [isConnected, address, chainId, runSiweLogin]);
    useEffect(() => {
        if (isConnected && isModalOpen) {
            setIsModalOpen(false);
            setPendingConnectorId(null);
            reset();
        }
    }, [isConnected, isModalOpen, reset]);
    const openModal = useCallback(() => {
        setLocalError(null);
        reset();
        setIsModalOpen(true);
    }, [reset]);
    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setPendingConnectorId(null);
        setLocalError(null);
        reset();
    }, [reset]);
    const connect = useCallback(async () => {
        openModal();
    }, [openModal]);
    const connectWith = useCallback(async (selected) => {
        setLocalError(null);
        setPendingConnectorId(selected.uid);
        try {
            await connectAsync({ connector: selected });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to connect wallet";
            if (!message.toLowerCase().includes("rejected")) {
                setLocalError(message);
            }
            else {
                setLocalError("Connection rejected. Please try again.");
            }
        }
        finally {
            setPendingConnectorId(null);
        }
    }, [connectAsync]);
    const disconnect = useCallback(async () => {
        try {
            await logoutSession();
            lastAuthedAddress.current = null;
            setIsAuthenticated(false);
            await disconnectAsync();
            setLocalError(null);
            reset();
        }
        catch (err) {
            console.error("Wallet disconnect failed:", err);
        }
    }, [disconnectAsync, reset]);
    const refreshBalance = useCallback(async () => {
        if (!address)
            return;
        try {
            await refetchBalance();
        }
        catch (err) {
            console.warn("Failed to refresh balance:", err);
        }
    }, [address, refetchBalance]);
    const isWalletAvailable = connectors.length > 0;
    const isConnecting = isPending ||
        status === "connecting" ||
        Boolean(pendingConnectorId) ||
        isAuthenticating;
    const value = {
        wallet,
        isConnecting,
        isAuthenticating,
        isAuthenticated,
        error,
        connect,
        disconnect,
        refreshBalance,
        ensureAuth,
        isWalletAvailable,
        isNautilusAvailable: isWalletAvailable,
        connectors,
        connectWith,
        isModalOpen,
        openModal,
        closeModal,
        pendingConnectorId,
        chainId,
        connectorName: connector?.name,
        symbol,
    };
    return (<WalletContext.Provider value={value}>{children}</WalletContext.Provider>);
}
export function useWallet() {
    const ctx = useContext(WalletContext);
    if (!ctx) {
        throw new Error("useWallet must be used within WalletProvider");
    }
    return ctx;
}
