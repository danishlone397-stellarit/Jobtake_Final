"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Users, MoreVertical, MoreHorizontal, Pencil, Trash2, Star, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function JobRowActions({
  jobId,
  jobTitle,
  featured = false,
  compact = false,
}: {
  jobId: string;
  jobTitle: string;
  featured?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [paying, setPaying] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleDelete() {
    if (!confirm(`Delete "${jobTitle}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch {
      alert("Failed to delete job. Please try again.");
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  }

  async function handleFeature() {
    setPaying(true);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) throw new Error("Failed to load payment gateway");

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Failed to create order");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Jobtake",
        description: `Feature job: ${order.jobTitle}`,
        order_id: order.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(response),
          });
          if (verifyRes.ok) {
            router.refresh();
          } else {
            alert("Payment verification failed. Please contact support if the amount was deducted.");
          }
          setPaying(false);
        },
        modal: { ondismiss: () => setPaying(false) },
        theme: { color: "#2563eb" },
      });
      rzp.open();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
      setPaying(false);
    }
    setOpen(false);
  }

  const btnSize = compact ? "h-7 w-7" : "h-8 w-8";
  const iconSize = compact ? "h-3.5 w-3.5" : "h-4 w-4";
  const btnClass = compact
    ? `${btnSize} rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors`
    : `${btnSize} rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors`;
  const MoreIcon = compact ? MoreHorizontal : MoreVertical;

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-2"} relative`} ref={menuRef}>
      <Link href={`/employer/jobs/${jobId}/preview`} title="Preview" className={btnClass}>
        <Eye className={`${iconSize} text-zinc-400`} />
      </Link>
      <Link href={`/employer/jobs/${jobId}/applicants`} title="Applicants" className={btnClass}>
        <Users className={`${iconSize} text-zinc-400`} />
      </Link>
      <button title="More" onClick={() => setOpen(v => !v)} className={btnClass}>
        <MoreIcon className={`${iconSize} text-zinc-400`} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-10 w-48 rounded-xl border border-zinc-200 bg-white shadow-lg py-1">
          <Link
            href={`/employer/jobs/${jobId}/preview`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            onClick={() => setOpen(false)}
          >
            <Eye className="h-4 w-4 text-zinc-400" /> Preview Job
          </Link>
          <Link
            href={`/employer/jobs/${jobId}/edit`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            onClick={() => setOpen(false)}
          >
            <Pencil className="h-4 w-4 text-zinc-400" /> Edit Job
          </Link>
          {featured ? (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> Featured
            </div>
          ) : (
            <button
              onClick={handleFeature}
              disabled={paying}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 disabled:opacity-50"
            >
              {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />} Feature Job (₹499)
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" /> {deleting ? "Deleting..." : "Delete Job"}
          </button>
        </div>
      )}
    </div>
  );
}
