import { redirect } from "next/navigation";
/** Legacy path → query-based trade resume (static-export friendly). */
export function generateStaticParams() {
    return [{ id: "demo-1" }, { id: "demo-2" }, { id: "demo-3" }];
}
export default function LegacyTradeRedirect({ params, }) {
    redirect(`/trade/?tradeId=${encodeURIComponent(params.id)}`);
}
