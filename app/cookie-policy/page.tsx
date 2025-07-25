import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white py-16 px-2">
      <div className="container mx-auto max-w-3xl bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. What Are Cookies?</h2>
          <p className="text-gray-700">Cookies are small text files stored on your device by your browser when you visit a website. They help us enhance your experience and analyze site usage.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. How We Use Cookies</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>To remember your preferences and settings.</li>
            <li>To analyze website traffic and usage patterns.</li>
            <li>To improve our website and services.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Types of Cookies We Use</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Third-Party Cookies</h2>
          <p className="text-gray-700">Some cookies may be set by third-party services that appear on our pages. We do not control the use of these cookies and recommend you review the privacy policies of these third parties.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Managing Cookies</h2>
          <p className="text-gray-700">You can control and delete cookies through your browser settings. Disabling cookies may affect your experience on our website.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Changes to This Policy</h2>
          <p className="text-gray-700">We may update this Cookie Policy from time to time. Changes will be posted on this page. Continued use of the website constitutes acceptance of the new policy.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
          <p className="text-gray-700">If you have any questions about our Cookie Policy, please contact us at <a href="mailto:contact@vitrus.rw" className="text-blue-600 underline">contact@vitrus.rw</a>.</p>
        </section>
      </div>
    </div>
  );
} 