/* Shared Bilingual English / Hindi helper across Sadbhavna Mart */
(function (global) {
  var DICT = {
    en: {
      brandTitle: "🍟 Sadbhavna Mart",
      heroTitle: "Hostel Snacks Corner 😎",
      heroSub: "Order snacks instantly on WhatsApp • 10–15 min room delivery",
      searchPlaceholder: "Search snacks, noodles, pens...",
      catSearchPlaceholder: "Search in categories...",
      orderAgainTitle: "🔁 Order Again",
      reorderLastBtn: "🔁 Reorder Last",
      orderedTag: "Bought before",
      combosTitle: "⚡ Quick Hostel Combos (1-Tap Add)",
      comboAdd: "+ Add",
      filterAll: "All",
      filterSnacks: "🍪 Snacks",
      filterMeals: "🍜 Meals",
      filterDrinks: "☕ Drinks",
      filterPantry: "🧂 Pantry",
      filterStationery: "📚 Stationery",
      filterInStock: "✅ In Stock",
      catHeading: "🗂️ Categories",
      catTabAll: "All",
      catTabSnacks: "🍪 Biscuits & Snacks",
      catTabMeals: "🍜 Instant Meals",
      catTabDrinks: "☕ Beverages & Dairy",
      catTabPantry: "🧂 Daily Pantry",
      catTabStationery: "📚 Stationery",
      openNow: "🟢 Open Now • Till 3 AM",
      closedNow: "🔒 Store Closed • Opens at 10 AM",
      outOfStockBadge: "OUT OF STOCK",
      outOfStockText: "Out of Stock",
      onlyLeftPrefix: "Only ",
      onlyLeftSuffix: " left",
      cartTitle: "🛒 Your Cart",
      cartEmpty: "Your cart is empty",
      upsellTitle: "✨ Add with this",
      totalLabel: "Total",
      clearCart: "🗑️ Clear Cart",
      placeOrder: "Place Order",
      close: "Close",
      orderDetailsTitle: "🧾 Order Details",
      namePlaceholder: "Enter Your Name",
      roomPlaceholder: "Enter Room Number",
      hostelPlaceholder: "Enter Hostel Name",
      phonePlaceholder: "Enter Phone Number",
      notePlaceholder: "Delivery Note (Optional: e.g. Call at gate)",
      paymentChoose: "Choose Payment Mode",
      paymentCash: "Cash",
      paymentOnline: "Online",
      upiTitle: "⚡ Instant UPI Scan & Pay",
      upiPayNow: "📲 Pay with GPay / PhonePe / Paytm",
      upiCopy: "📋 Copy UPI ID",
      upiRefPlaceholder: "UPI Ref / Last 4 digits (Optional)",
      confirmOrder: "Confirm Order",
      receiptDone: "Order Confirmed!",
      receiptSub: "Sent to Sadbhavna Mart via WhatsApp",
      receiptTotal: "Total Payable",
      receiptWaBtn: "💬 Re-open WhatsApp",
      receiptCloseBtn: "Done",
      favTitle: "❤️ Favorites",
      favEmpty: "No favorites yet",
      notifTitle: "🔔 Notifications",
      notifEnable: "🔔 Enable Browser Alerts",
      notifClear: "🗑️ Clear All",
      notifEmpty: "No notifications",
      navHome: "Home",
      navCategory: "Category",
      navProfile: "Profile"
    },
    hi: {
      brandTitle: "🍟 सद्भावना मार्ट",
      heroTitle: "हॉस्टल स्नैक्स कॉर्नर 😎",
      heroSub: "व्हाट्सएप पर तुरंत ऑर्डर करें • 10–15 मिनट में रूम डिलीवरी",
      searchPlaceholder: "स्नैक्स, मैगी, पेन खोजें...",
      catSearchPlaceholder: "कैटेगरी में आइटम खोजें...",
      orderAgainTitle: "🔁 दोबारा ऑर्डर करें",
      reorderLastBtn: "🔁 पिछला ऑर्डर जोड़ें",
      orderedTag: "पहले मंगाया गया",
      combosTitle: "⚡ क्विक हॉस्टल कॉम्बो (1-टैप ऐड)",
      comboAdd: "+ जोड़ें",
      filterAll: "सभी",
      filterSnacks: "🍪 स्नैक्स",
      filterMeals: "🍜 नूडल्स",
      filterDrinks: "☕ ड्रिंक्स",
      filterPantry: "🧂 किराना",
      filterStationery: "📚 स्टेशनरी",
      filterInStock: "✅ उपलब्ध",
      catHeading: "🗂️ श्रेणियाँ",
      catTabAll: "सभी",
      catTabSnacks: "🍪 बिस्कुट और स्नैक्स",
      catTabMeals: "🍜 इंस्टेंट नूडल्स",
      catTabDrinks: "☕ चाय, कॉफी और ड्रिंक्स",
      catTabPantry: "🧂 दैनिक किराना",
      catTabStationery: "📚 स्टेशनरी",
      openNow: "🟢 स्टोर खुला है • रात 3 बजे तक",
      closedNow: "🔒 स्टोर बंद है • सुबह 10 बजे खुलेगा",
      outOfStockBadge: "स्टॉक खत्म",
      outOfStockText: "स्टॉक उपलब्ध नहीं",
      onlyLeftPrefix: "सिर्फ ",
      onlyLeftSuffix: " बचे",
      cartTitle: "🛒 आपका कार्ट",
      cartEmpty: "आपका कार्ट खाली है",
      upsellTitle: "✨ इसके साथ जोड़ें",
      totalLabel: "कुल बिल",
      clearCart: "🗑️ कार्ट खाली करें",
      placeOrder: "ऑर्डर करें",
      close: "बंद करें",
      orderDetailsTitle: "🧾 ऑर्डर विवरण",
      namePlaceholder: "अपना नाम लिखें",
      roomPlaceholder: "रूम नंबर लिखें",
      hostelPlaceholder: "हॉस्टल / ब्लॉक लिखें",
      phonePlaceholder: "मोबाइल नंबर लिखें",
      notePlaceholder: "डिलीवरी नोट (वैकल्पिक: गेट पर कॉल करें)",
      paymentChoose: "पेमेंट का तरीका चुनें",
      paymentCash: "कैश (COD)",
      paymentOnline: "ऑनलाइन / UPI",
      upiTitle: "⚡ तुरंत UPI स्कैन और पेमेंट",
      upiPayNow: "📲 GPay / PhonePe / Paytm से पे करें",
      upiCopy: "📋 UPI ID कॉपी करें",
      upiRefPlaceholder: "UPI रेफरेंस / आखिरी 4 अंक (वैकल्पिक)",
      confirmOrder: "ऑर्डर कन्फर्म करें",
      receiptDone: "ऑर्डर कन्फर्म हो गया!",
      receiptSub: "व्हाट्सएप पर सद्भावना मार्ट को भेज दिया गया",
      receiptTotal: "कुल देय राशि",
      receiptWaBtn: "💬 व्हाट्सएप दोबारा खोलें",
      receiptCloseBtn: "ठीक है",
      favTitle: "❤️ पसंदीदा",
      favEmpty: "कोई पसंदीदा आइटम नहीं",
      notifTitle: "🔔 नोटिफिकेशन",
      notifEnable: "🔔 ब्राउज़र अलर्ट चालू करें",
      notifClear: "🗑️ सब हटाएं",
      notifEmpty: "कोई नोटिफिकेशन नहीं",
      navHome: "होम",
      navCategory: "श्रेणी",
      navProfile: "प्रोफाइल"
    }
  };

  function getLang() {
    var l = localStorage.getItem("sadbhavna_lang") || "English";
    return l === "Hindi" ? "Hindi" : "English";
  }

  function t(key) {
    var pack = getLang() === "Hindi" ? DICT.hi : DICT.en;
    return pack[key] !== undefined ? pack[key] : (DICT.en[key] || "");
  }

  function applyCommonI18n() {
    var lang = getLang();
    var isHi = lang === "Hindi";
    document.documentElement.lang = isHi ? "hi" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n"));
      if (val) el.innerText = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n-placeholder"));
      if (val) el.setAttribute("placeholder", val);
    });
    document.querySelectorAll(".i18n").forEach(function (el) {
      var v = el.dataset[isHi ? "hi" : "en"];
      if (v) el.innerText = v;
    });

    // Bottom navigation translation across all pages
    var navLabels = document.querySelectorAll(".bottom-nav .nav-item span");
    if (navLabels.length >= 3) {
      navLabels[0].innerText = t("navHome");
      navLabels[1].innerText = t("navCategory");
      navLabels[2].innerText = t("navProfile");
    }

    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.innerText = isHi ? "हिं | EN" : "EN | हिं";
      btn.title = isHi ? "Switch to English" : "हिंदी में बदलें";
    });
  }

  function setLang(lang) {
    var normalized = lang === "Hindi" ? "Hindi" : "English";
    localStorage.setItem("sadbhavna_lang", normalized);
    applyCommonI18n();
    if (typeof global.onSadbhavnaLangChange === "function") {
      global.onSadbhavnaLangChange(normalized);
    }
  }

  function toggleLang() {
    setLang(getLang() === "Hindi" ? "English" : "Hindi");
    return getLang();
  }

  global.SadbhavnaI18n = {
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang,
    t: t,
    apply: applyCommonI18n
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyCommonI18n);
  } else {
    applyCommonI18n();
  }
})(window);
