(function () {

    window.enableTranslation = function () {
      if (document.getElementById("google_translate_script")) return;
  
      const gtDiv = document.createElement("div");
      gtDiv.id = "google_translate_element";
      gtDiv.style.display = "none";
      document.body.appendChild(gtDiv);
  
      const script = document.createElement("script");
      script.id = "google_translate_script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateInit";
      document.body.appendChild(script);
    };
  
    window.googleTranslateInit = function () {
      new google.translate.TranslateElement(
        {
          pageLanguage: "de",
          autoDisplay: false
        },
        "google_translate_element"
      );
    };
  
    window.setLanguage = function (lang) {
      const select = document.querySelector(".goog-te-combo");
      if (!select) return;
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    };
  
    window.resetLanguage = function () {
      window.setLanguage("de");
    };
  
  })();