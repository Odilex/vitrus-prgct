import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#000423] text-white py-16 px-4">
      <div className="container mx-auto max-w-3xl bg-[#0c1734] rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-gray-300">Vitrus is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc ml-6 text-gray-300">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and any other information you provide via our contact or newsletter forms.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, such as IP address, browser type, and pages visited.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc ml-6 text-gray-300">
            <li>To provide and improve our services.</li>
            <li>To respond to your inquiries and requests.</li>
            <li>To send newsletters and updates if you subscribe.</li>
            <li>To analyze website usage and improve user experience.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
          <p className="text-gray-300">We do not sell or rent your personal information. We may share information with trusted third parties who assist us in operating our website and services, provided they agree to keep this information confidential.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
          <p className="text-gray-300">We use cookies and similar technologies to enhance your experience on our website. You can control cookies through your browser settings.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
          <p className="text-gray-300">We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
          <p className="text-gray-300">We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. International Transfers</h2>
          <p className="text-gray-300">Your information may be transferred to and maintained on servers located outside your country. By using our services, you consent to such transfers.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Children's Privacy</h2>
          <p className="text-gray-300">Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Your Rights</h2>
          <p className="text-gray-300">You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <a href="mailto:contact@vitrus.rw" className="text-teal-400 underline">contact@vitrus.rw</a>.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">11. Policy Updates</h2>
          <p className="text-gray-300">We may update this Privacy Policy from time to time. Changes will be posted on this page. Continued use of the website constitutes acceptance of the new policy.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
          <p className="text-gray-300">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact@vitrus.rw" className="text-teal-400 underline">contact@vitrus.rw</a>.</p>
        </section>
        <div className="mt-8 text-center">
          <Link href="/" className="text-teal-400 underline">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}