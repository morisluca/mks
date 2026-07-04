const STORAGE_KEY = "preferred_language";

const languages = [
  { label: "English", code: "en" },
  { label: "French", code: "fr" },
  { label: "Spanish", code: "es" },
  { label: "German", code: "de" },
  { label: "Arabic", code: "ar" },

  // Major global languages
  { label: "Portuguese", code: "pt" },
  { label: "Portuguese (Brazil)", code: "pt-BR" },
  { label: "Hindi", code: "hi" },
  { label: "Chinese (Simplified)", code: "zh-CN" },
  { label: "Chinese (Traditional)", code: "zh-TW" },
  { label: "Japanese", code: "ja" },
  { label: "Korean", code: "ko" },
  { label: "Russian", code: "ru" },
  { label: "Italian", code: "it" },
  { label: "Dutch", code: "nl" },
  { label: "Turkish", code: "tr" },
  { label: "Polish", code: "pl" },
  { label: "Swedish", code: "sv" },
  { label: "Greek", code: "el" },
  { label: "Hebrew", code: "iw" },
  { label: "Thai", code: "th" },
  { label: "Vietnamese", code: "vi" },

  // African languages (useful for your region)
  { label: "Yoruba", code: "yo" },
  { label: "Igbo", code: "ig" },
  { label: "Hausa", code: "ha" },
  { label: "Swahili", code: "sw" },

  // Middle East / South Asia extras
  { label: "Urdu", code: "ur" },
  { label: "Bengali", code: "bn" },
];

function fadePage() {
  document.body.style.transition = "opacity 0.3s ease";
  document.body.style.opacity = "0.4";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 300);
}

export default function LanguageDropdown() {
  const changeLanguage = (lang: string) => {
    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;

    if (select) {
      fadePage();

      select.value = lang;
      select.dispatchEvent(new Event("change"));

      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      defaultValue={localStorage.getItem(STORAGE_KEY) || "en"}
      style={{
        padding: "4px 6px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        cursor: "pointer",
        background: "white",
        outline: "none",
      }}
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}