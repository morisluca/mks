import { useGetPublicSettings } from "@/lib/api-client";
import { useState, useEffect } from "react";

export function Cookie() {
  const [visible, setVisible] = useState(false);
  const {data: settings} = useGetPublicSettings();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (type: any) => {
    localStorage.setItem("cookie-consent", type);
    setVisible(false);
  };

//   <img
//     src="/logo.png"
//     alt="Company logo"
//     className="h-10 mb-4"
//     />
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 relative">
        
        {/* Close button */}
        <button
          onClick={() => handleConsent("accepted")}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="mb-4"><h1 className="h-10 uppercase"> {settings?.siteName} </h1></div>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-3">
          We Value Your Privacy
        </h2>

        {/* Text */}
        <p className="text-gray-600 mb-6">
          This site uses cookies to enhance your experience, perform analytics,
          and support marketing efforts. Some cookies are necessary and cannot
          be disabled. You can accept all cookies, allow only necessary ones, or
          customize your preferences.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => alert("Open preferences modal")}
            className="w-full border border-gray-300 py-3 rounded-md font-semibold"
          >
            Customize Cookies
          </button>

          <button
            onClick={() => handleConsent("accepted")}
            className="w-full bg-black text-white py-3 rounded-md font-semibold"
          >
            Allow All
          </button>

          <button
            onClick={() => handleConsent("necessary")}
            className="w-full border border-gray-300 py-3 rounded-md font-semibold"
          >
            Necessary Only
          </button>
        </div>
      </div>
    </div>
  );
}