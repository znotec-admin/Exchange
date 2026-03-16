import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
}
export function formatNumber(num) {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
}
export function formatANX(amount) {
    return `${amount.toLocaleString()} ANX`;
}
export function calculateTotal(amount, pricePerAnx, networkFee = 0.01) {
    const subtotal = amount * pricePerAnx;
    return subtotal * (1 + networkFee);
}
export function truncateAddress(address, chars = 6) {
    if (address.length <= chars * 2)
        return address;
    return `${address.slice(0, chars)}...${address.slice(-3)}`;
}
