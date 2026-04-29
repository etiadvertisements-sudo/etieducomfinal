import Link from 'next/link';
import { Shield, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for ETI Educom®. Learn how we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://www.etieducom.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16">
        <div className="container-main text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Last updated: December 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-6">
                ETI Educom® (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our website 
                etieducom.com, use our services, or interact with us in any way.
              </p>
              <p className="text-gray-600 mb-6">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                please do not access our website or use our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
              <p className="text-gray-600 mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Fill out forms on our website (enquiry forms, registration forms, counselling requests)</li>
                <li>Contact us via phone, email, or social media</li>
                <li>Register for our programs or courses</li>
                <li>Subscribe to our newsletter or updates</li>
                <li>Participate in surveys or promotional activities</li>
              </ul>
              <p className="text-gray-600 mb-6">
                This information may include: Name, Email address, Phone number, Educational qualifications, 
                Address, Date of birth, and other information relevant to our services.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
              <p className="text-gray-600 mb-6">
                When you visit our website, we may automatically collect certain information about your device, 
                including your IP address, browser type, operating system, referring URLs, and information about 
                how you interact with our website.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Provide, operate, and maintain our services</li>
                <li>Process your enquiries and registration requests</li>
                <li>Send you information about our programs, courses, and services</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Send you promotional communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li><strong>With Service Providers:</strong> We may share your information with third-party 
                service providers who perform services on our behalf (e.g., SMS/WhatsApp notification services).</li>
                <li><strong>For Business Transfers:</strong> In connection with any merger, sale of company assets, 
                or acquisition of all or a portion of our business.</li>
                <li><strong>With Your Consent:</strong> We may share your information with third parties when 
                you have given us your consent to do so.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information where required to do 
                so by law or in response to valid requests by public authorities.</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Data Security</h2>
              <p className="text-gray-600 mb-6">
                We implement appropriate technical and organizational security measures to protect your personal 
                information from unauthorized access, alteration, disclosure, or destruction. However, no method 
                of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee 
                absolute security.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Cookies</h2>
              <p className="text-gray-600 mb-6">
                We may use cookies and similar tracking technologies to track activity on our website and hold 
                certain information. You can instruct your browser to refuse all cookies or to indicate when a 
                cookie is being sent.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Third-Party Links</h2>
              <p className="text-gray-600 mb-6">
                Our website may contain links to third-party websites that are not operated by us. We have no 
                control over and assume no responsibility for the content, privacy policies, or practices of 
                any third-party sites or services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Children&apos;s Privacy</h2>
              <p className="text-gray-600 mb-6">
                Our services are not intended for individuals under the age of 13. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and you are aware 
                that your child has provided us with personal information, please contact us.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 mb-6">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11. Contact Us</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 mb-2"><strong>ETI Educom®</strong></p>
                <p className="text-gray-600">Jodhamal Colony, Dhangu Road, Pathankot, Punjab - 145001</p>
                <p className="text-gray-600">Email: helpdesk@etieducom.com</p>
                <p className="text-gray-600">Phone: +91 9646727676</p>
              </div>
            </div>

            {/* Back Link */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
