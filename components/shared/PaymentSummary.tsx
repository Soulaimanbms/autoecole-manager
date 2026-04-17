"use client";

import { formatMAD } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { PaymentStatus } from "@/types";

interface PaymentSummaryProps {
  totalPrice: number;
  amountPaid: number;
  remainingBalance: number;
  paymentStatus: PaymentStatus;
  onRecordPayment?: () => void;
}

export function PaymentSummary({
  totalPrice,
  amountPaid,
  remainingBalance,
  paymentStatus,
  onRecordPayment,
}: PaymentSummaryProps) {
  const pct = totalPrice > 0 ? Math.round((amountPaid / totalPrice) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">Total formation</span>
        <span className="text-sm font-semibold text-text-primary">
          {formatMAD(totalPrice)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">Payé</span>
        <span className="text-sm font-semibold text-success-text">
          {formatMAD(amountPaid)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">Reste</span>
        <span className="text-sm font-semibold text-error-text">
          {formatMAD(remainingBalance)}
        </span>
      </div>

      <div className="h-1.5 w-full bg-bg-hover rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <StatusBadge status={paymentStatus} variant="payment" />
        {onRecordPayment && remainingBalance > 0 && (
          <button onClick={onRecordPayment} className="btn-primary text-[10px]">
            Enregistrer paiement
          </button>
        )}
      </div>
    </div>
  );
}
