import { cn } from "@/lib/utils";

const steps = [
  { key: "cart", label: "Cart" },
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "review", label: "Confirmation" },
] as const;

export type CheckoutStep = typeof steps[number]["key"];

export default function CheckoutProgress({ current }: { current: CheckoutStep }) {
  return (
    <nav className="mx-auto w-full max-w-md">
      <ol className="flex items-center justify-between gap-2">
        {steps.map((s, idx) => {
          const active = steps.findIndex(st => st.key === current) >= idx;
          return (
            <li key={s.key} className="flex flex-1 items-center">
              <div className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                active ? "border-amber-400 text-amber-600 bg-amber-50" : "border-purple-200 text-purple-500 bg-white"
              )}>
                <span className={cn(
                  "inline-flex h-4 w-4 items-center justify-center rounded-full border",
                  active ? "border-amber-400 bg-amber-300" : "border-purple-300"
                )}></span>
                <span className="font-medium">{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="mx-1 h-px flex-1 bg-gradient-to-r from-purple-200 to-amber-300" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
