export const ESCROW_ADDRESS = (process.env.NEXT_PUBLIC_ESCROW_ADDRESS ??
    "0x0000000000000000000000000000000000000000");
export const ESCROW_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111);
export const p2pEscrowAbi = [
    {
        type: "function",
        name: "createTrade",
        stateMutability: "payable",
        inputs: [
            { name: "tradeId", type: "bytes32" },
            { name: "buyer", type: "address" },
            { name: "deadline", type: "uint64" },
        ],
        outputs: [],
    },
    {
        type: "function",
        name: "release",
        stateMutability: "nonpayable",
        inputs: [{ name: "tradeId", type: "bytes32" }],
        outputs: [],
    },
    {
        type: "function",
        name: "refund",
        stateMutability: "nonpayable",
        inputs: [{ name: "tradeId", type: "bytes32" }],
        outputs: [],
    },
    {
        type: "function",
        name: "trades",
        stateMutability: "view",
        inputs: [{ name: "", type: "bytes32" }],
        outputs: [
            { name: "seller", type: "address" },
            { name: "buyer", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "deadline", type: "uint64" },
            { name: "status", type: "uint8" },
        ],
    },
];
export function isEscrowConfigured() {
    return (Boolean(ESCROW_ADDRESS) &&
        ESCROW_ADDRESS !== "0x0000000000000000000000000000000000000000");
}
