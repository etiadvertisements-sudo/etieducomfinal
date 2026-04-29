import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for ETI Educom®. Read our terms of service for using our website and educational services.',
  alternates: { canonical: 'https://www.etieducom.com/terms-and-conditions' },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16">
        <div className="container-main text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FileText className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing or using the services of ETI Educom® (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), 
                including our website at etieducom.com and all related services, you agree to be bound by these 
                Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">2. Description of Services</h2>
              <p className="text-gray-600 mb-6">
                ETI Educom® provides IT education and training services, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Computer training programs and courses</li>
                <li>Professional certification preparation</li>
                <li>Career counselling services</li>
                <li>Distance learning program facilitation (ETI EduConnect)</li>
                <li>Corporate training and workshops</li>
                <li>Summer training and internship programs</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">3. Eligibility</h2>
              <p className="text-gray-600 mb-6">
                To use our services, you must be at least 13 years of age. If you are under 18, you must have 
                parental or guardian consent to enroll in our programs. By using our services, you represent 
                that you meet these eligibility requirements.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">4. Registration and Enrollment</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Admission Process</h3>
              <p className="text-gray-600 mb-4">
                Enrollment in our programs is subject to availability and completion of the registration process, 
                including submission of required documents and payment of applicable fees.
              </p>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Accuracy of Information</h3>
              <p className="text-gray-600 mb-6">
                You agree to provide accurate, current, and complete information during registration and to 
                update such information to keep it accurate, current, and complete.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">5. Fees and Payment</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Course Fees</h3>
              <p className="text-gray-600 mb-4">
                All fees for programs and courses are as specified at the time of enrollment. Fees are subject 
                to change without prior notice for future enrollments.
              </p>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Payment Terms</h3>
              <p className="text-gray-600 mb-4">
                Payment can be made through cash, bank transfer, UPI, or EMI options where available. Full 
                payment or agreed installment must be completed as per the payment schedule.
              </p>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Refund Policy</h3>
              <p className="text-gray-600 mb-6">
                Refunds are processed as per our refund policy. Generally, fees paid are non-refundable once 
                the course has commenced. Partial refunds may be considered on a case-by-case basis for valid 
                reasons within the first week of the program.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">6. Intellectual Property</h2>
              <p className="text-gray-600 mb-6">
                All content on our website and course materials, including but not limited to text, graphics, 
                logos, images, videos, and software, is the property of ETI Educom® or its content suppliers 
                and is protected by intellectual property laws. You may not reproduce, distribute, modify, or 
                create derivative works without our express written permission.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">7. Student Conduct</h2>
              <p className="text-gray-600 mb-4">
                As a student, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
                <li>Attend classes regularly and complete assignments on time</li>
                <li>Behave professionally and respectfully towards staff and fellow students</li>
                <li>Not engage in any form of harassment, discrimination, or misconduct</li>
                <li>Not copy, share, or distribute course materials without authorization</li>
                <li>Maintain academic integrity and not engage in plagiarism or cheating</li>
                <li>Follow all rules and regulations of the institute</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">8. Certifications</h2>
              <p className="text-gray-600 mb-6">
                Upon successful completion of programs, students may receive certificates from ETI Educom® 
                and/or partner certification bodies (Microsoft, Adobe, EC-Council, etc.). Certification is 
                subject to meeting attendance requirements, completing assessments, and clearing examinations 
                where applicable.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">9. Placement Assistance</h2>
              <p className="text-gray-600 mb-6">
                We provide placement assistance to eligible students. However, we do not guarantee employment. 
                Placement depends on various factors including student performance, market conditions, and 
                employer requirements. Students must actively participate in placement activities and maintain 
                professional standards.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">10. Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                To the maximum extent permitted by law, ETI Educom® shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including without limitation, loss 
                of profits, data, or other intangible losses, resulting from your use or inability to use 
                our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">11. Indemnification</h2>
              <p className="text-gray-600 mb-6">
                You agree to indemnify, defend, and hold harmless ETI Educom®, its officers, directors, 
                employees, and agents from and against any claims, liabilities, damages, losses, or expenses 
                arising out of your violation of these terms or your use of our services.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">12. Modifications to Terms</h2>
              <p className="text-gray-600 mb-6">
                We reserve the right to modify these Terms and Conditions at any time. We will notify users 
                of any material changes by posting the updated terms on our website. Your continued use of 
                our services after such modifications constitutes acceptance of the updated terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">13. Governing Law</h2>
              <p className="text-gray-600 mb-6">
                These Terms and Conditions shall be governed by and construed in accordance with the laws 
                of India. Any disputes arising under these terms shall be subject to the exclusive 
                jurisdiction of the courts in Pathankot, Punjab.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">14. Severability</h2>
              <p className="text-gray-600 mb-6">
                If any provision of these Terms and Conditions is found to be unenforceable or invalid, 
                that provision shall be limited or eliminated to the minimum extent necessary, and the 
                remaining provisions shall remain in full force and effect.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">15. Contact Information</h2>
              <p className="text-gray-600 mb-6">
                For any questions about these Terms and Conditions, please contact us:
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
