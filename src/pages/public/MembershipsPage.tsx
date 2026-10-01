import React, { useState, useEffect } from 'react';
import { CheckCircle, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { MembershipPlan } from '../../types';
import { apiService } from '../../services/api';
import { PaymentModal } from '../../components/common/PaymentModal';

export const MembershipsPage: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  useEffect(() => {
    apiService.getMemberships().then(setPlans).finally(() => setLoading(false));
  }, []);

  const faqs = [
    {
      q: 'Can I freeze or pause my membership if I travel?',
      a: 'Yes! Annual Championship and Elite tiers allow up to 30 days of complimentary membership freeze per calendar year.',
    },
    {
      q: 'Are locker and shower facilities included?',
      a: 'All memberships include complimentary daily day-use digital lockers and rain shower amenities.',
    },
    {
      q: 'How does the free trial work?',
      a: 'You can book a 1-day complimentary guest pass through our online booking tool to experience the gym floor and meet our coaching team.',
    },
    {
      q: 'Can I upgrade my plan mid-term?',
      a: 'Absolutely. Any unused balance on your current plan will be pro-rated and credited towards your upgraded tier.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
          MEMBERSHIP TIERS
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
          Invest in Uncompromising Health
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
          No sign-up penalties, no surprise annual renewal fees. Select a training tier calibrated for your schedule and ambitions.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
              plan.isPopular
                ? 'bg-gradient-to-b from-[#182033] to-[#101522] border-2 border-amber-500/80 shadow-2xl shadow-amber-500/10'
                : 'bg-[#101522] border border-neutral-800 hover:border-neutral-700'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white font-display">{plan.name}</h3>
                <p className="text-xs text-neutral-400">{plan.duration}</p>
              </div>

              <div className="pt-2 pb-2">
                <span className="text-3xl sm:text-4xl font-black text-white font-display font-mono tabular-nums">
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-neutral-400 ml-1">/ {plan.duration}</span>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed font-light">
                {plan.description}
              </p>

              <div className="pt-4 border-t border-neutral-800/80 space-y-2">
                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Included Privileges:
                </p>
                <ul className="space-y-2">
                  {plan.benefits.map((b, i) => (
                    <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setSelectedPlan(plan)}
                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  plan.isPopular
                    ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700'
                }`}
              >
                Join with {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="bg-[#101622] border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">Zero Commitment Risk</h4>
            <p className="text-xs text-neutral-400">
              Not completely satisfied in your first 7 days? We offer a 100% money-back satisfaction guarantee on all starter plans.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">FAQ</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-[#101522] border border-neutral-800 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-white font-display flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{f.q}</span>
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed pl-6">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <PaymentModal
        plan={selectedPlan}
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        onSuccess={() => {
          setSelectedPlan(null);
          alert('Membership activated! Welcome to the Fitzone family.');
        }}
      />
    </div>
  );
};
