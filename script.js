/**
 * ===================================================================
 * NURBEK DIGITAL — Asosiy JavaScript Mantig'i
 * Dasturchi: Nurbek Yandashov Sherali o'g'li
 * Telegram: @Nurbek_yandashov | Telefon: +998 94 683 49 86
 * ===================================================================
 */

// 1. SOZLAMALAR VA KONFIGURATSIYA (Administrator oson o'zgartirishi mumkin)
const CONFIG = {
  admin: {
    name: "Nurbek Yandashov Sherali o‘g‘li",
    phone: "+998 94 683 49 86",
    telegramUsername: "Nurbek_yandashov",
    telegramUrl: "https://t.me/Nurbek_yandashov"
  },
  // Valyuta kursi: Administrator bu yerni o'zgartirishi mumkin
  currency: {
    usdToUzsRate: 12800, // 1 USD = 12 800 UZS (o'zgartirish mumkin)
    currentDisplay: 'USD' // 'USD' yoki 'UZS'
  }
};

// 2. DOM ELEMENTLARI
const header = document.getElementById('header');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');
const menuBackdrop = document.getElementById('menuBackdrop');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('backToTopBtn');
const toastNotice = document.getElementById('toastNotice');
const toastMessage = document.getElementById('toastMessage');

// Modal elementlari
const orderModal = document.getElementById('orderModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalServiceTitle = document.getElementById('modalServiceTitle');
const modalServiceCategory = document.getElementById('modalServiceCategory');
const modalServicePrice = document.getElementById('modalServicePrice');
const modalPreviewText = document.getElementById('modalPreviewText');
const modalCopyBtn = document.getElementById('modalCopyBtn');
const modalTelegramBtn = document.getElementById('modalTelegramBtn');

// Qidiruv va Filtr elementlari
const serviceSearchInput = document.getElementById('serviceSearchInput');
const categoryTabs = document.querySelectorAll('.tab-btn');
const allServiceCards = document.querySelectorAll('.filterable-card');

// Valyuta tugmasi
const currencyToggleBtn = document.getElementById('currencyToggleBtn');
const currencyRateText = document.getElementById('currencyRateText');

// 3. MOBIL MENYU BOSHQARUVI
function toggleMobileMenu() {
  const isOpen = mainNav.classList.toggle('active');
  hamburgerBtn.classList.toggle('active', isOpen);
  menuBackdrop.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  mainNav.classList.remove('active');
  hamburgerBtn.classList.remove('active');
  menuBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', toggleMobileMenu);
}
if (menuBackdrop) {
  menuBackdrop.addEventListener('click', closeMobileMenu);
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
    // Nav active holatini yangilash
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// 4. HEADER VA BACK TO TOP SCROLL EFFEKTI
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (header) {
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (backToTopBtn) {
    if (scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// 5. TOAST BILDIRISHNOMASI
let toastTimeout;
function showToast(message = "Nusxalandi!") {
  if (!toastNotice) return;
  toastMessage.textContent = message;
  toastNotice.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 3000);
}

// 6. MATNNI BUFERGA NUSXALASH (CLIPBOARD)
async function copyToClipboard(text, customMessage = "Buyurtma matni nusxalandi!") {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Zaxira usul
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    showToast(customMessage);
  } catch (err) {
    console.error("Nusxalashda xatolik:", err);
    showToast("Nusxalandi!");
  }
}

// 7. INTERAKTIV BUYURTMA MODALI
let currentOrderDetails = {
  service: "",
  category: "",
  price: "",
  formattedText: ""
};

function openOrderModal(serviceName, categoryName, priceText) {
  currentOrderDetails.service = serviceName;
  currentOrderDetails.category = categoryName;
  currentOrderDetails.price = priceText;

  let extraPlayerInfo = "";
  if (categoryName.includes("PUBG")) {
    const pubgIdEl = document.getElementById("pubgPlayerIdInput");
    const pubgNickEl = document.getElementById("pubgPlayerNickInput");
    const pubgId = pubgIdEl ? pubgIdEl.value.trim() : "";
    const pubgNick = pubgNickEl ? pubgNickEl.value.trim() : "";
    if (pubgId) {
      extraPlayerInfo += `\n🎮 PUBG Player ID: ${pubgId}`;
    }
    if (pubgNick) {
      extraPlayerInfo += `\n👤 O‘yindagi Nickname: ${pubgNick}`;
    }
  }

  const formattedMsg = `Assalomu alaykum Nurbek!\nMen NURBEK DIGITAL sayti orqali buyurtma bermoqchiman:\n\n📌 Xizmat: ${serviceName}\n📁 Yo‘nalish: ${categoryName}\n💰 Narxi: ${priceText}${extraPlayerInfo}\n\nIltimos, tafsilotlarni kelishib olsak!`;

  currentOrderDetails.formattedText = formattedMsg;

  if (modalServiceTitle) modalServiceTitle.textContent = serviceName;
  if (modalServiceCategory) modalServiceCategory.textContent = categoryName;
  if (modalServicePrice) modalServicePrice.textContent = priceText;
  if (modalPreviewText) modalPreviewText.textContent = formattedMsg;

  // Telegram havola tugmasini yangilash
  if (modalTelegramBtn) {
    const encodedText = encodeURIComponent(formattedMsg);
    modalTelegramBtn.href = `${CONFIG.admin.telegramUrl}?text=${encodedText}`;
    modalTelegramBtn.target = "_blank";
  }

  if (orderModal) {
    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeOrderModal() {
  if (orderModal) {
    orderModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeOrderModal);
}

if (orderModal) {
  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      closeOrderModal();
    }
  });
}

if (modalCopyBtn) {
  modalCopyBtn.addEventListener('click', () => {
    copyToClipboard(currentOrderDetails.formattedText, "Buyurtma nusxalandi! Telegramga yuboring.");
  });
}

// Esc tugmasi bosilganda modalni yopish
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeOrderModal();
    closeMobileMenu();
  }
});

// 8. KARTALARNING BUYURTMA TUGMALARI BOSILISHINI TINGLASH
document.addEventListener('click', (e) => {
  // Buyurtma berish tugmasi
  const orderBtn = e.target.closest('.btn-order-trigger');
  if (orderBtn) {
    e.preventDefault();
    const service = orderBtn.getAttribute('data-service') || 'Raqamli xizmat';
    const category = orderBtn.getAttribute('data-category') || 'Umumiy';
    const price = orderBtn.getAttribute('data-price') || 'Kelishiladi';
    openOrderModal(service, category, price);
    return;
  }

  // Tezkor nusxalash tugmasi (masalan PUBG yoki Obunachi kartasidagi)
  const quickCopyBtn = e.target.closest('.btn-quick-copy');
  if (quickCopyBtn) {
    e.preventDefault();
    const service = quickCopyBtn.getAttribute('data-service') || 'Xizmat';
    const price = quickCopyBtn.getAttribute('data-price') || '';
    const textToCopy = `NURBEK DIGITAL Buyurtma: ${service} — ${price}`;
    copyToClipboard(textToCopy, `Nusxalandi: ${service}`);
    return;
  }
});

// 9. VALYUTA ALMASHTIRGICH (USD <-> UZS)
function updateWebPackagePrices() {
  const priceElements = document.querySelectorAll('.package-price[data-usd]');
  const isUSD = CONFIG.currency.currentDisplay === 'USD';

  priceElements.forEach(el => {
    const usdVal = parseInt(el.getAttribute('data-usd'), 10);
    const uzsVal = usdVal * CONFIG.currency.usdToUzsRate;

    if (isUSD) {
      el.textContent = `$${usdVal}`;
      const subPrice = el.closest('.package-card').querySelector('.package-uzs-price');
      if (subPrice) {
        subPrice.textContent = `(~ ${uzsVal.toLocaleString('uz-UZ')} so‘m)`;
      }
    } else {
      el.textContent = `${uzsVal.toLocaleString('uz-UZ')} so‘m`;
      const subPrice = el.closest('.package-card').querySelector('.package-uzs-price');
      if (subPrice) {
        subPrice.textContent = `($${usdVal} USD)`;
      }
    }
  });

  if (currencyToggleBtn) {
    currencyToggleBtn.textContent = isUSD ? "So‘mda ko‘rish (UZS)" : "Dollarda ko‘rish (USD)";
  }
}

if (currencyToggleBtn) {
  currencyToggleBtn.addEventListener('click', () => {
    CONFIG.currency.currentDisplay = CONFIG.currency.currentDisplay === 'USD' ? 'UZS' : 'USD';
    updateWebPackagePrices();
    showToast(`Narxlar ${CONFIG.currency.currentDisplay} formatida ko‘rsatildi`);
  });
}

// 10. FAQ ACCORDION FUNKSIYASI
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const questionBtn = item.querySelector('.faq-question');
  if (questionBtn) {
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Boshqalarini yopish
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove('active');
      });
      // Joriy savolni yoqish/o'chirish
      item.classList.toggle('active', !isActive);
    });
  }
});

// 11. QIDIRUV VA KATEGORIYALAR BO'YICHA FILTRLASH
function filterServices() {
  const query = (serviceSearchInput ? serviceSearchInput.value : "").trim().toLowerCase();
  const activeTab = document.querySelector('.tab-btn.active');
  const currentCategory = activeTab ? activeTab.getAttribute('data-filter') : 'all';

  allServiceCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category') || '';
    const cardText = card.textContent.toLowerCase();

    const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
    const matchesQuery = query === '' || cardText.includes(query);

    if (matchesCategory && matchesQuery) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

if (serviceSearchInput) {
  serviceSearchInput.addEventListener('input', filterServices);
}

categoryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    categoryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterServices();
  });
});

// 12. ALOQA BO'LIMIDAGI INTERAKTIV BUYURTMA KONSTRUKTORI
const customOrderForm = document.getElementById('customOrderForm');
const customServiceSelect = document.getElementById('customServiceSelect');
const customClientName = document.getElementById('customClientName');
const customClientContact = document.getElementById('customClientContact');
const customOrderSummary = document.getElementById('customOrderSummary');
const customCopyBtn = document.getElementById('customCopyBtn');
const customTelegramBtn = document.getElementById('customTelegramBtn');

function updateCustomOrderPreview() {
  if (!customOrderSummary) return;

  const selectedOption = customServiceSelect ? customServiceSelect.options[customServiceSelect.selectedIndex] : null;
  const serviceName = selectedOption ? selectedOption.text : 'Xizmat tanlanmagan';
  const nameVal = customClientName && customClientName.value.trim() ? customClientName.value.trim() : 'Mijoz';
  const contactVal = customClientContact && customClientContact.value.trim() ? customClientContact.value.trim() : 'Ko‘rsatilmagan';

  const previewText = `Assalomu alaykum Nurbek!\nMen NURBEK DIGITAL sayti orqali buyurtma qoldirmoqdaman:\n\n👤 Ismim: ${nameVal}\n📞 Aloqa: ${contactVal}\n🎯 Tanlangan xizmat: ${serviceName}\n\nIltimos, men bilan bog‘laning!`;

  customOrderSummary.textContent = previewText;

  if (customTelegramBtn) {
    const encoded = encodeURIComponent(previewText);
    customTelegramBtn.href = `${CONFIG.admin.telegramUrl}?text=${encoded}`;
  }
}

if (customServiceSelect) customServiceSelect.addEventListener('change', updateCustomOrderPreview);
if (customClientName) customClientName.addEventListener('input', updateCustomOrderPreview);
if (customClientContact) customClientContact.addEventListener('input', updateCustomOrderPreview);

if (customCopyBtn) {
  customCopyBtn.addEventListener('click', () => {
    if (customOrderSummary) {
      copyToClipboard(customOrderSummary.textContent, "Murojaat matni nusxalandi!");
    }
  });
}

// 13. INTERAKTIV SAYT KALKULYATORI MANTIG'I
function initWebCalculator() {
  const radioCards = document.querySelectorAll('.calc-radio-card');
  const checkboxCards = document.querySelectorAll('.calc-checkbox-card');
  const totalUsdEl = document.getElementById('calcTotalUsd');
  const totalUzsEl = document.getElementById('calcTotalUzs');
  const calcTelegramBtn = document.getElementById('calcTelegramBtn');

  if (!totalUsdEl || !radioCards.length) return;

  function calculateTotal() {
    let totalUsd = 0;
    let selectedTypeName = "Landing Page";
    let selectedTypePrice = 100;
    const selectedOptions = [];

    // Tanlangan sayt turini aniqlash
    radioCards.forEach(card => {
      if (card.classList.contains('selected')) {
        selectedTypePrice = parseInt(card.getAttribute('data-type-price'), 10) || 100;
        selectedTypeName = card.getAttribute('data-type-name') || "Veb-sayt";
        totalUsd += selectedTypePrice;
      }
    });

    // Tanlangan qo'shimcha imkoniyatlarni hisoblash
    checkboxCards.forEach(card => {
      if (card.classList.contains('selected')) {
        const optPrice = parseInt(card.getAttribute('data-opt-price'), 10) || 0;
        const optName = card.getAttribute('data-opt-name') || "";
        totalUsd += optPrice;
        selectedOptions.push(`• ${optName} (+$${optPrice})`);
      }
    });

    const totalUzs = totalUsd * CONFIG.currency.usdToUzsRate;

    totalUsdEl.textContent = `$${totalUsd} USD`;
    totalUzsEl.textContent = `~ ${totalUzs.toLocaleString('uz-UZ')} so‘m`;

    if (calcTelegramBtn) {
      const optionsText = selectedOptions.length ? selectedOptions.join('\n') : "• Asosiy standart to‘plam";
      const calcMsg = `Assalomu alaykum Nurbek!\nMen NURBEK DIGITAL sayti kalkulyatorida sayt hisobladim:\n\n🌐 Sayt turi: ${selectedTypeName} ($${selectedTypePrice})\n⚡ Qo‘shimcha modullar:\n${optionsText}\n\n💰 Jami taqribiy narx: $${totalUsd} USD (~ ${totalUzs.toLocaleString('uz-UZ')} so‘m)\n\nIltimos, ushbu loyihani muhokama qilsak!`;
      const encoded = encodeURIComponent(calcMsg);
      calcTelegramBtn.href = `${CONFIG.admin.telegramUrl}?text=${encoded}`;
    }
  }

  // Radio kartalar bosilganda
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      calculateTotal();
    });
  });

  // Chekboks kartalar bosilganda
  checkboxCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      calculateTotal();
    });
  });

  calculateTotal();
}

// 14. JONLI TELEGRAM VIDJETI MANTIG'I
function initLiveChatWidget() {
  const toggleBtn = document.getElementById('liveChatToggleBtn');
  const popover = document.getElementById('liveChatPopover');
  const closeBtn = document.getElementById('popoverCloseBtn');

  if (toggleBtn && popover) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      popover.classList.toggle('active');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (!popover.contains(e.target) && !toggleBtn.contains(e.target)) {
        popover.classList.remove('active');
      }
    });
  }
}

// 15. SAHIFA YUKLANGANDA DASTLABKI ISHLAR
document.addEventListener('DOMContentLoaded', () => {
  updateWebPackagePrices();
  updateCustomOrderPreview();
  initWebCalculator();
  initLiveChatWidget();
  console.log("NURBEK DIGITAL — Sayt barcha yangi funksiyalari bilan muvaffaqiyatli ishga tushirildi!");
});
