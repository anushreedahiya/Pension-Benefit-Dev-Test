import UnauthenticatedNavbar from "@/components/UnauthenticatedNavbar";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <UnauthenticatedNavbar />

      {/* FAQ Content */}
      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-green-800 mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions about pension planning and our services
            </p>
          </div>

          <div className="space-y-8">
            {/* FAQ Item 1 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What is Pension Planner Pro and how does it work?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Pension Planner Pro is a comprehensive platform that helps you track, manage, and plan your pension. 
                  We provide tools to monitor your pension balance, calculate retirement needs, and guide you through 
                  the claim process. Simply sign up, connect your pension accounts, and start planning your retirement journey.
                </p>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Is my pension information secure on your platform?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Absolutely! We use bank-level encryption and security measures to protect your sensitive financial information. 
                  Your data is encrypted both in transit and at rest, and we never share your personal information with third parties 
                  without your explicit consent.
                </p>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How accurate are the retirement calculations?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our retirement calculator uses industry-standard formulas and considers factors like inflation, taxes, 
                  and market performance. While we provide estimates based on current data, actual results may vary due to 
                  market conditions and personal circumstances. We recommend consulting with a financial advisor for personalized advice.
                </p>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I track multiple pension schemes?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! You can track multiple pension schemes from different providers in one place. Our platform consolidates 
                  all your pension information, giving you a complete overview of your retirement savings regardless of how 
                  many different schemes you have.
                </p>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What happens if I need help with the claim process?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We provide step-by-step guidance throughout the entire claim process. If you encounter any issues or 
                  have questions, our support team is available 24/7 to help. We also offer document checklists and 
                  progress tracking to ensure you don&apos;t miss any important steps.
                </p>
              </div>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Is there a cost to use Pension Planner Pro?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We offer both free and premium plans. The free plan includes basic pension tracking and retirement calculations. 
                  Our premium plan offers advanced features like detailed analytics, priority support, and personalized recommendations. 
                  You can upgrade or downgrade your plan at any time.
                </p>
              </div>
            </div>

            {/* FAQ Item 7 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How often is my pension information updated?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Pension information is typically updated in real-time or within 24 hours, depending on your pension provider. 
                  Some providers update more frequently than others. You can also manually refresh your data at any time 
                  to ensure you have the most current information.
                </p>
              </div>
            </div>

            {/* FAQ Item 8 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I export my pension data for tax purposes?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes, you can export your pension data in various formats (PDF, CSV, Excel) for tax reporting and record-keeping. 
                  Our platform also provides tax summaries and contribution reports that can be directly shared with your 
                  accountant or tax advisor.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="mt-16 text-center bg-green-50 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
            </p>
            <a
              href="/contact" 
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-6 md:mb-0">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">Terms of Service</a>
            </div>
            <div className="text-center">
              <p className="text-gray-600">© 2024 Pension Planner Pro. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 