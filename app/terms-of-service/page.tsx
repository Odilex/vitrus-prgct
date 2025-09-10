import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { baseMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'Terms of Service | Vitrus Rwanda',
  description: 'Review the terms and conditions for using Vitrus services and website.',
  openGraph: {
    ...baseMetadata.openGraph,
    title: 'Terms of Service | Vitrus Rwanda',
    description: 'Review the terms and conditions for using Vitrus services and website.',
    url: `${SITE_URL}/terms-of-service`,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: 'Terms of Service | Vitrus Rwanda',
    description: 'Review the terms and conditions for using Vitrus services and website.',
  },
  alternates: {
    canonical: '/terms-of-service',
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#000423] text-white py-16 px-4">
      <div className="container mx-auto max-w-3xl bg-[#0c1734] rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-300">By accessing or using the Vitrus website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, please do not use our website or services.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
          <p className="text-gray-300">You must be at least 18 years old or have the involvement of a parent or guardian to use our services. By using our site, you represent that you meet these requirements.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Services</h2>
          <p className="text-gray-300">Vitrus provides digital and virtual tour services for buildings and spaces. We reserve the right to modify or discontinue any service at any time without notice.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. User Responsibilities</h2>
          <ul className="list-disc ml-6 text-gray-300">
            <li>Provide accurate and current information when using our contact forms or services.</li>
            <li>Do not use our services for unlawful or prohibited purposes.</li>
            <li>Respect the intellectual property rights of Vitrus and third parties.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. User Content</h2>
          <p className="text-gray-300">If you submit or upload any content to our site, you grant Vitrus a non-exclusive, royalty-free license to use, reproduce, and display such content for the purpose of providing our services.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Third-Party Links</h2>
          <p className="text-gray-300">Our website may contain links to third-party websites. Vitrus is not responsible for the content or practices of these external sites. Access them at your own risk.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Intellectual Property</h2>
          <p className="text-gray-300">All content, trademarks, and materials on this website are the property of Vitrus or its licensors. You may not use, reproduce, or distribute any content without our written permission.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Termination</h2>
          <p className="text-gray-300">We reserve the right to terminate or suspend your access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or Vitrus.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Limitation of Liability</h2>
          <p className="text-gray-300">Vitrus is not liable for any damages arising from the use or inability to use our website or services. All services are provided &quot;as is&quot; without warranties of any kind.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>
          <p className="text-gray-300">These Terms are governed by the laws of Rwanda. Any disputes arising from these Terms or your use of the website will be subject to the exclusive jurisdiction of the courts of Rwanda.</p>
        </section>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">11. Changes to Terms</h2>
          <p className="text-gray-300">We may update these Terms of Service at any time. Changes will be posted on this page. Continued use of the website constitutes acceptance of the new terms.</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
          <p className="text-gray-300">If you have any questions about these Terms, please contact us at <a href="mailto:contact@vitrus.rw" className="text-teal-400 underline">contact@vitrus.rw</a>.</p>
        </section>
        <div className="mt-8 text-center">
          <Link href="/" className="text-teal-400 underline">&larr; Back to Home</Link>
        </div>
      </div>
    </div>
  );
}