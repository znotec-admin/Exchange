import { AuthRequiredError, getSessionToken } from "./auth";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
async function request(path, options = {}) {
    const { auth = false, headers: initHeaders, ...rest } = options;
    const headers = new Headers(initHeaders);
    if (!headers.has("Content-Type") && rest.body) {
        headers.set("Content-Type", "application/json");
    }
    if (auth) {
        const token = getSessionToken();
        if (!token) {
            throw new AuthRequiredError("Authorization: Bearer <session token> required");
        }
        headers.set("Authorization", `Bearer ${token}`);
    }
    const res = await fetch(`${API_URL}${path}`, {
        ...rest,
        headers,
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) {
        throw new AuthRequiredError(data.error || "Session expired or invalid");
    }
    if (!res.ok) {
        throw new Error(data.error || `API ${res.status}`);
    }
    return data;
}
export async function fetchOffers() {
    const data = await request("/offers");
    return data.offers;
}
export async function fetchOffer(id) {
    const data = await request(`/offers/${id}`);
    return data.offer;
}
export async function createOffer(body) {
    const data = await request("/offers", {
        method: "POST",
        auth: true,
        body: JSON.stringify(body),
    });
    return data.offer;
}
export async function createTrade(body) {
    const data = await request("/trades", {
        method: "POST",
        auth: true,
        body: JSON.stringify(body),
    });
    return data.trade;
}
export async function fetchTrade(id) {
    const data = await request(`/trades/${id}`, {
        auth: true,
    });
    return data.trade;
}
export async function fetchMyTrades(role) {
    const qs = role ? `?role=${role}` : "";
    const data = await request(`/trades${qs}`, {
        auth: true,
    });
    return data.trades;
}
export async function markTradeFunded(tradeId, createTxHash) {
    const data = await request(`/trades/${tradeId}/funded`, {
        method: "POST",
        auth: true,
        body: JSON.stringify({ createTxHash }),
    });
    return data.trade;
}
export async function markTradePaid(tradeId) {
    const data = await request(`/trades/${tradeId}/paid`, {
        method: "POST",
        auth: true,
    });
    return data.trade;
}
export { API_URL };
