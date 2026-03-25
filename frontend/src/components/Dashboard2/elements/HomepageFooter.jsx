import { Link } from "react-router-dom";
import { getPages } from "../../../firestore/dbOperations";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FaFacebook } from "react-icons/fa";
import { FaXTwitter, FaLinkedin, FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";

const HomepageFooter = () => {
  const { t } = useTranslation("common");

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ NEW STATE
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPages()
      .then((pages) => setPages(pages || []))
      .catch(() => setPages([]))
      .finally(() => setLoading(false));
  }, []);

  // ✅ BITRIX FUNCTION
  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "https://gtracademy.bitrix24.in/rest/1/ig9bb5odmrgj0qxj/crm.lead.add.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              Course: "Newsletter Subscription",
              SOURCE_ID: "Placement Newsletter ",
              EMAIL: [{ VALUE: email, VALUE_TYPE: "WORK" }],
            },
          }),
        }
      );

      const data = await response.json();
      console.log("Bitrix Response:", data);

      alert("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#2a2d35] via-[#252830] to-[#1a1c21] text-gray-300 pt-16 pb-8 mt-12 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">

          {/* ABOUT */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">
              {t("HomepageFooter.headings.aboutUs")}
            </h4>
            <p className="text-gray-400">
              {t("HomepageFooter.aboutText")}
            </p>
          </div>

          {/* LINKS */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">
              {t("HomepageFooter.headings.quickLinks")}
            </h4>

            <ul className="space-y-3">
              <li><Link to="/portfolio/builder">Portfolio Builder</Link></li>
              <li><Link to="/jobs/portal">Job Portal</Link></li>
              <li><Link to="/contact">Contact</Link></li>

              {pages.map((page) => (
                <li key={page.id}>
                  <Link to={"/p/" + page.id}>{page.id}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">
              {t("HomepageFooter.headings.stayUpdated")}
            </h4>

            <p className="text-gray-400">
              {t("HomepageFooter.newsletter.description")}
            </p>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("HomepageFooter.newsletter.placeholder")}
                className="w-full px-4 py-3 bg-[#1a1c21] rounded-xl"
              />

              <button
                onClick={handleSubscribe}
                disabled={submitting}
                className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-purple-600 text-white rounded-lg"
              >
                {submitting ? "Sending..." : t("HomepageFooter.newsletter.buttonText")}
              </button>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">
              Social Links
            </h4>

            <div className="flex gap-4">
              <a href="https://www.facebook.com/gtracademy.edu/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://www.linkedin.com/company/gtr-academy/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href="https://www.youtube.com/@GTR-Academy" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
              <a href="https://www.instagram.com/gtr_academy_trainings/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://x.com/GTR_Academy" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-center mt-10 text-gray-500">
          © {new Date().getFullYear()} Powered By GTR Academy
        </div>
      </div>
    </footer>
  );
};

export default HomepageFooter;