const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const TOKEN_KEY = "alphanex_siwe_token";
export function getSessionToken() {
    if (typeof window === "undefined")
        return null;
    return localStorage.getItem(TOKEN_KEY);
}
export function setSessionToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}
export function clearSessionToken() {
    localStorage.removeItem(TOKEN_KEY);
}
export function getSiweDomain() {
    if (typeof window !== "undefined") {
        return window.location.host;
    }
    return "localhost:3000";
}
export function getSiweUri() {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }
    return "http://localhost:3000";
}
export async function fetchNonce(address) {
    const res = await fetch(`${API_URL}/auth/nonce?address=${encodeURIComponent(address)}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || `Nonce request failed (${res.status})`);
    }
    return data.nonce;
}
export async function verifySiwe(body) {
    const res = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || `SIWE verify failed (${res.status})`);
    }
    setSessionToken(data.token);
    return data;
}
export async function logoutSession() {
    const token = getSessionToken();
    clearSessionToken();
    if (!token)
        return;
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
    }
    catch {
        /* ignore network errors on logout */
    }
}
export async function fetchAuthMe() {
    const token = getSessionToken();
    if (!token)
        return null;
    const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
        clearSessionToken();
        return null;
    }
    return res.json();
}
export class AuthRequiredError extends Error {
    constructor(message = "Sign-in required") {
        super(message);
        this.name = "AuthRequiredError";
    }
}
