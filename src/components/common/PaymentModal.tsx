import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, Smartphone, Building, Loader2 } from 'lucide-react';
import { MembershipPlan } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface PaymentModalProps {
  plan: MembershipPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ plan, isOpen, onClose, onSuccess }) => {
  const { user, refreshUser } = useAuth();
  const [method, setMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState(user?.email ? `${user.email.split('@')[0]}@okaxis` : 'fitmember@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const handlePay = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      // 1. Create order
      const orderRes = await apiService.createPaymentOrder(plan.id);
      
      // Simulate gateway latency
      await new Promise((r) => setTimeout(r, 1200));

      // 2. Verify payment
      const verifyRes = await apiService.verifyPayment(
        plan.id,
        `pay_${Math.random().toString(36).substring(2, 10)}`,
        orderRes.order.id
      );

      if (verifyRes.success) {
        await refreshUser();
        setSuccessReceipt(verifyRes);
      } else {
        setErrorMsg('Payment verification failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setSuccessReceipt(null);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111622] border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#0b0e17] px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-400 tracking-wider uppercase">Razorpay Secure Checkout</p>
              <h3 className="text-sm font-bold text-white font-display">FITZONE FITNESS</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {successReceipt ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-display">Payment Successful!</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Your <span className="text-amber-400 font-semibold">{plan.name}</span> membership is now officially active.
              </p>
            </div>

            <div className="bg-neutral-900/80 rounded-xl p-3 text-left text-xs space-y-1.5 border border-neutral-800">
              <div className="flex justify-between text-neutral-400">
                <span>Amount Paid</span>
                <span className="font-semibold text-white font-mono">₹{plan.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Plan Duration</span>
                <span className="text-neutral-200">{plan.duration}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Transaction Ref</span>
                <span className="font-mono text-[11px] text-neutral-300">{successReceipt.receipt?.paymentId}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-amber-500/15"
            >
              Go to Member Dashboard
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Plan Summary */}
            <div className="bg-neutral-900/60 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 uppercase font-medium">Selected Plan</p>
                <h4 className="text-base font-bold text-white">{plan.name}</h4>
                <p className="text-xs text-amber-400 font-medium">{plan.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-neutral-400">Total Due</p>
                <p className="text-xl font-extrabold text-white font-mono tabular-nums">
                  ₹{plan.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    method === 'upi'
                      ? 'border-sky-500 bg-sky-500/10 text-sky-400'
                      : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  UPI / QR
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    method === 'card'
                      ? 'border-sky-500 bg-sky-500/10 text-sky-400'
                      : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Debit/Credit
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('netbanking')}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                    method === 'netbanking'
                      ? 'border-sky-500 bg-sky-500/10 text-sky-400'
                      : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  NetBanking
                </button>
              </div>
            </div>

            {/* Method Inputs */}
            {method === 'upi' && (
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Virtual Payment Address (VPA / UPI ID)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
                />
                <p className="text-[11px] text-neutral-500">Google Pay, PhonePe, Paytm, or BHIM supported</p>
              </div>
            )}

            {method === 'card' && (
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Card Number: 4532 •••• •••• 8910"
                  defaultValue="4532 9821 7843 8910"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM / YY"
                    defaultValue="12/28"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="882"
                    maxLength={3}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            {method === 'netbanking' && (
              <div className="space-y-1.5 text-xs">
                <label className="text-xs text-neutral-400">Popular Banks</label>
                <select className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500">
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}

            {/* Pay CTA */}
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Securing Payment...
                </>
              ) : (
                <>
                  Pay ₹{plan.price.toLocaleString('en-IN')}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit SSL encrypted & Razorpay verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
