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
    <div className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out">
      <div className="bg-gradient-to-r from-[#0c1734] via-[#1a2332] to-[#0c1734] border-t border-gray-700/50 backdrop-blur-md shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">We value your privacy</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                By using this site you agree to our{" "}
                <Link href="/cookie-policy" className="text-teal-400 hover:text-teal-300 underline transition-colors">
                  Cookie Policy
                </Link>
                ,{" "}
                <Link href="/privacy-policy" className="text-teal-400 hover:text-teal-300 underline transition-colors">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/terms-of-service" className="text-teal-400 hover:text-teal-300 underline transition-colors">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={accept}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Accept All
              </button>
              <button
                onClick={accept}
                className="text-gray-400 hover:text-white px-4 py-2.5 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-200"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
