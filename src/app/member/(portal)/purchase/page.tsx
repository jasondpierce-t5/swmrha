import { getActiveFeeItems } from "@/lib/actions/fee-items";
import PurchaseFeeForm from "./PurchaseFeeForm";

export default async function MemberPurchasePage() {
  const result = await getActiveFeeItems();

  // Error fetching fee items
  if ("error" in result) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Purchase Fees
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Stall fees, banquet tickets, and event charges
          </p>
        </div>
        <div className="rounded-lg border border-red-700 bg-red-900/30 p-6">
          <p className="text-sm text-red-200">{result.error}</p>
        </div>
      </div>
    );
  }

  // No active fee items available
  if (result.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Purchase Fees
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Stall fees, banquet tickets, and event charges
          </p>
        </div>
        <div className="rounded-lg border border-navy-700 bg-navy-800 p-6">
          <div className="flex flex-col items-center py-8 text-center">
            <p className="text-sm text-gray-400">
              No fee items are currently available for purchase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">
          Purchase Fees
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          Stall fees, banquet tickets, and event charges
        </p>
      </div>

      <PurchaseFeeForm feeItems={result} />
    </div>
  );
}
