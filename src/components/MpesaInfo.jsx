import { useState } from 'react';
import toast from 'react-hot-toast';
import { PAYBILL, ACCOUNT_NUMBER } from '../config.js';

export default function MpesaInfo() {
  const copy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-bold text-slate-900">LOOP PAYMENT</h3>
      <p className="mt-1 text-sm text-slate-500">Pay conveniently via LOOP.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Paybill</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{PAYBILL}</p>
          <button
            onClick={() => copy(PAYBILL, 'Paybill')}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            <CopyIcon /> COPY PAYBILL
          </button>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Account Number</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{ACCOUNT_NUMBER}</p>
          <button
            onClick={() => copy(ACCOUNT_NUMBER, 'Account number')}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
          >
            <CopyIcon /> COPY ACCOUNT
          </button>
        </div>
      </div>
    </section>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}