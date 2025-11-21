import React from 'react';
import HomepageNavbar from '../Dashboard2/elements/HomepageNavbar';
import HomepageFooter from '../Dashboard2/elements/HomepageFooter';

const PrivacyPolicy = () => {
   
  return (
    <div className="relative z-10 bg-transparent h-full w-full">
      <HomepageNavbar/>
      <div className="max-w-4xl mx-auto px-4 py-6 pt-21">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">Privacy Policy</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">1. Introduction</h2>
          <p className="text-gray-700">
            Rasiratech Pvt Ltd (“we”, “us”, or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [website URL]. Please read this policy carefully.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">2. Information We Collect</h2>
          <p className="text-gray-700">
            We may collect information about you in a variety of ways, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li><strong>Personal Data:</strong> Information that can be used to identify you, such as your name, email address, and phone number, which you voluntarily give us when you register or use our services.</li>
            <li><strong>Usage Data:</strong> Information about your interaction with our website, such as IP address, browser type, operating system, pages viewed, and the dates/times of your visits.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">3. How We Use Your Information</h2>
          <p className="text-gray-700">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Provide, operate, and maintain our website and services</li>
            <li>Improve, personalize, and expand our website and services</li>
            <li>Communicate with you, including for customer service, updates, and marketing</li>
            <li>Analyze how users interact with our website to improve our services</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">4. Sharing Your Information</h2>
          <p className="text-gray-700">
            We do not sell, trade, or otherwise transfer your personal information to outside parties, except:
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>With your consent</li>
            <li>To trusted third parties who assist us in operating our website and conducting our business, provided they agree to keep your information confidential</li>
            <li>When required by law or to protect our rights, property, or safety</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">5. Cookies and Tracking Technologies</h2>
          <p className="text-gray-700">
            Our website may use cookies and similar tracking technologies to enhance your experience. You can control the use of cookies through your browser settings, but disabling cookies may affect your ability to use certain features of our website.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">6. Data Security</h2>
          <p className="text-gray-700">
            We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, please be aware that no method of transmitting data over the Internet or electronic storage is completely secure.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">7. Your Rights</h2>
          <p className="text-gray-700">
            Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. To exercise these rights, please contact us at [contact email].
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">8. Changes to This Privacy Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated “Effective Date.” We encourage you to review this policy periodically.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">9. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <address className="text-gray-700">
            <p><strong>Rasira Tech Pvt Ltd</strong></p>
            <p>426 A, Orbit Plaza</p>
            <p>Crossing Republik Ghaziabad</p>
            <p><strong>Effective Date:</strong> 18th Jan 2024</p>
          </address>
        </section>

        <section className="mt-12 text-center">
          <p className="text-sm text-gray-600">© 2025 ROOTBIX INFOTECH PVT LTD</p>
        </section>
      </div>
       <HomepageFooter/>
    </div>
  );
};

export default PrivacyPolicy;
