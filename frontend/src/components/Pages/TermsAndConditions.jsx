import React from 'react';
import HomepageFooter from '../Dashboard2/elements/HomepageFooter';
import HomepageNavbar from '../Dashboard2/elements/HomepageNavbar';

const TermsAndConditions = () => {
  return (
      <div className="relative z-10 bg-transparent h-full w-full">
      <HomepageNavbar/>
    <div className="max-w-4xl mx-auto pt-15 px-4 py-6">
        
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">Terms and Conditions</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">1. Introduction</h2>
        <p className="text-gray-700">
          Welcome to Rootbix Info Tech Pvt Ltd. By accessing our website or using our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">2. Services Provided</h2>
        <p className="text-gray-700">
          Rootbix Info Tech Pvt Ltd offers Web Development / Online Marketing / SAP Services / Cloud services. We reserve the right to modify or discontinue any part of our services without notice.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">3. User Responsibilities</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Users must provide accurate and complete information when registering for our services.</li>
          <li>Users are responsible for maintaining the confidentiality of their account information.</li>
          <li>Use of our services must be in compliance with all applicable laws and regulations.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">4. Intellectual Property</h2>
        <p className="text-gray-700">
          All content, including text, graphics, logos, and software, is the property of Rasiratech Pvt Ltd or its licensors and is protected by intellectual property laws. Unauthorized use is prohibited.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">5. Limitation of Liability</h2>
        <p className="text-gray-700">
          Rootbix Info Tech Pvt Ltd is not liable for any direct, indirect, incidental, or consequential damages arising from the use of our services. This includes, but is not limited to, loss of data or profits.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">6. Privacy Policy</h2>
        <p className="text-gray-700">
          Your privacy is important to us. Please refer to our <a href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</a> for detailed information on how we collect, use, and protect your personal data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">7. Changes to Terms and Conditions</h2>
        <p className="text-gray-700">
          We reserve the right to update these terms and conditions at any time. Changes will be effective immediately upon posting. It is your responsibility to review these terms regularly.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">8. Governing Law</h2>
        <p className="text-gray-700">
          These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Ghaziabad.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">9. Contact Information</h2>
        <p className="text-gray-700">
          For any questions or concerns regarding these terms and conditions, please contact us at: <br />
          <a href="mailto:info@rootbix.com" className="text-blue-500 hover:underline">info@rootbix.com</a>
        </p>
      </section>

      <section className="mt-12 text-center">
        <p className="text-sm text-gray-600">© 2025 ROOTBIX INFOTECH PVT LTD</p>
      </section>
    </div>
    <HomepageFooter/>
    </div>
  );
};

export default TermsAndConditions;
