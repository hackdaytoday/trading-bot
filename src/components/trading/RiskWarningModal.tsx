import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

interface RiskWarningModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  strategy: string;
}

export const RiskWarningModal = ({ isOpen, onAccept, onDecline, strategy }: RiskWarningModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-dark-card rounded-lg p-6 m-4 border border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-accent-red" />
          <h2 className="text-2xl font-bold text-accent-red">Risk Warning</h2>
        </div>

        <div className="space-y-6">
          {/* Main Warning */}
          <div className="p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg">
            <p className="text-accent-red font-medium">
              Trading with automated systems involves substantial risk of loss and is not suitable for everyone.
            </p>
          </div>

          {/* Strategy Warning */}
          <div className="p-4 bg-accent-gold/10 border border-accent-gold/20 rounded-lg">
            <p className="text-accent-gold font-medium">
              You are about to start automated trading using the <span className="font-bold">{strategy}</span> strategy.
            </p>
          </div>

          {/* Risk Points */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-accent-gold" />
              Important Risk Disclosures
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <p className="text-gray-300">This trading bot is experimental software and comes with NO GUARANTEES of profit or performance.</p>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <p className="text-gray-300">Past performance does not indicate future results. The strategy may fail under different market conditions.</p>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <p className="text-gray-300">You can lose some or all of your investment. Never trade with money you cannot afford to lose.</p>
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
                <p className="text-gray-300">The developers and providers of this software accept NO RESPONSIBILITY for any financial losses incurred through its use.</p>
              </li>
            </ul>
          </div>

          {/* Acknowledgment */}
          <div className="p-4 bg-dark rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm">
              By clicking "Accept & Start Trading", you acknowledge that you understand and accept all risks associated with automated trading, and that you are solely responsible for any losses incurred.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              onClick={onDecline}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium border border-gray-800 hover:bg-dark-hover text-gray-300 transition-colors"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Decline & Close
            </button>
            <button
              onClick={onAccept}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-accent-green text-dark hover:bg-accent-green/90 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Accept & Start Trading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};