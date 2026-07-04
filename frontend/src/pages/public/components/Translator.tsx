import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

interface Props {
  pageLanguage?: string;
}

export default function LazyTranslator({ pageLanguage = "en" }: Props) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (typeof window === "undefined") return;

    const init = () => {
      if (!window.google?.translate) return;

      new window.google.translate.TranslateElement(
        {
          pageLanguage,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    window.googleTranslateElementInit = init;

    // avoid duplicate script
    if (!document.querySelector("#google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      script.onerror = () =>
        console.error("Google Translate failed to load");

      document.body.appendChild(script);
    } else {
      init();
    }

    initialized.current = true;
  }, [pageLanguage]);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }} // hide default UI
    />
  );
}