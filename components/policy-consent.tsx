"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PolicyConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = localStorage.getItem("policyConsentAccepted");
    if (!accepted) {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("policyConsentAccepted", "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-2 max-w-md rounded-lg bg-[#0c1734] p-6 text-white shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">We value your privacy</h2>
        <p className="mb-4 text-gray-300">
          By using this site you agree to our&nbsp;
          <Link href="/cookie-policy" className="text-teal-400 underline">
            Cookie Policy
          </Link>
          ,&nbsp;
          <Link href="/privacy-policy" className="text-teal-400 underline">
            Privacy Policy
          </Link>
          , and&nbsp;
          <Link href="/terms-of-service" className="text-teal-400 underline">
            Terms of Service
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="rounded bg-teal-500 px-4 py-2 font-medium text-white hover:bg-teal-600"
        >
          I Agree
        </button>
      </div>
    </div>
  );
}
