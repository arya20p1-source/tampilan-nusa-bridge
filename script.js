/**
 * NusaBridge - Landing Page Interactivity
 * Built for GTNIC 2026 Prototype
 * Fully Interactive: Incoterms Calculator, Dashboard Tabs, 
 * Workflow Navigator, Modals, and Trade Tools.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. MOBILE MENU TOGGLE ====================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // ==================== 2. ACTIVE NAV LINK ON SCROLL ====================
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    const navbar = document.querySelector('.navbar-header');
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // ==================== 3. MODAL UTILITY FUNCTIONS ====================
  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  const langToast = document.getElementById('langToast');
  function showToast(message) {
    if (!langToast) return;
    langToast.innerHTML = `<span>${message}</span>`;
    langToast.classList.add('show');
    clearTimeout(langToast._timer);
    langToast._timer = setTimeout(() => {
      langToast.classList.remove('show');
    }, 2400);
  }

  // ==================== 4. WORKFLOW STEP DATA & FUNCTIONS (DECLARED FIRST) ====================
  let currentWorkflowStep = 1;
  let currentLang = localStorage.getItem('nusabridge_lang') || 'id';

  const workflowStepItems = document.querySelectorAll('.workflow-step-item');
  const stepDetailBadge = document.getElementById('stepDetailBadge');
  const stepDetailTitle = document.getElementById('stepDetailTitle');
  const stepDetailDesc = document.getElementById('stepDetailDesc');
  const btnPrevStep = document.getElementById('btnPrevStep');
  const btnNextStep = document.getElementById('btnNextStep');
  const btnStepAction = document.getElementById('btnStepAction');

  const workflowStepsData = [
    {
      step: 1,
      titleId: "Validasi NIB & KBLI OSS",
      titleEn: "OSS Business ID & Tax Validation",
      descId: "Daftarkan entitas usaha UMKM Anda dengan format NIB (Nomor Induk Berusaha) berbasis OSS dan NPWP terdaftar. Sistem secara otomatis memverifikasi profil legalitas untuk meningkatkan kredibilitas Anda di mata buyer internasional.",
      descEn: "Register your SME entity with Risk-Based OSS NIB and registered Tax ID. The system validates your enterprise compliance to establish immediate trust with foreign buyers.",
      actionTextId: "Uji Coba Validasi NIB ↗",
      actionTextEn: "Test NIB Validation ↗",
      action: () => openKycModal()
    },
    {
      step: 2,
      titleId: "Analisis RFQ Buyer dengan AI",
      titleEn: "AI-Powered Buyer RFQ Analysis",
      descId: "Saat pembeli luar negeri mengirimkan permintaan kuotasi (RFQ), Asisten Ekspor NusaBridge membedah spesifikasi teknis, standar mutu (kadar air, grading), kuantitas, dan waktu pengiriman yang diminta.",
      descEn: "When global buyers send a Request for Quotation (RFQ), NusaBridge AI breaks down technical specs, quality grading, volume, and requested delivery lead times.",
      actionTextId: "Buka Analisis RFQ Kopi ↗",
      actionTextEn: "Analyze Coffee RFQ ↗",
      action: () => {
        handleAiQuery('Analisis permintaan RFQ buyer kopi dari Jerman');
        const dash = document.getElementById('dashboard');
        if (dash) dash.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      step: 3,
      titleId: "Negosiasi Harga & Incoterms 2020",
      titleEn: "Pricing Negotiation & Incoterms 2020",
      descId: "Tentukan pembagian tanggung jawab dan risiko pengiriman dengan Incoterms 2020 (EXW, FOB, atau CIF). AI memberikan batas toleransi harga penawaran yang tetap melindungi margin keuntungan UMKM.",
      descEn: "Determine risk and delivery responsibilities using Incoterms 2020 (EXW, FOB, CIF). AI recommends profitable price floors that safeguard SME margins.",
      actionTextId: "Buka Kalkulator Incoterms ↗",
      actionTextEn: "Open Incoterms Calculator ↗",
      action: () => {
        const calcSec = document.getElementById('kalkulator');
        if (calcSec) calcSec.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      step: 4,
      titleId: "Penerbitan Dokumen Resmi Otomatis",
      titleEn: "Automated Official Trade Documents",
      descId: "Hasilkan dokumen ekspor berstandar ICC secara instan: Proforma Invoice, Sales Contract, Packing List, serta permohonan Surat Keterangan Asal (e-SKA Kemendag) tanpa risiko salah ketik.",
      descEn: "Instantly generate ICC-compliant export documentation: Proforma Invoice, Sales Contract, Packing List, and Certificate of Origin (e-SKA) with zero typos.",
      actionTextId: "Pratinjau Proforma & COO ↗",
      actionTextEn: "Preview Proforma & COO ↗",
      action: () => openDocumentModal('proforma')
    },
    {
      step: 5,
      titleId: "Escrow Vault & Pelacakan Logistik",
      titleEn: "Escrow Vault & Real-Time Logistics",
      descId: "Pembayaran buyer diamankan di rekening penampung bersama (NusaBridge Escrow Vault). Lacak pergerakan kontainer di kapal laut melalui sinyal AIS satelit hingga tiba di pelabuhan tujuan.",
      descEn: "Buyer payments are secured in escrow vaults. Track container ship waypoints via satellite AIS until arrival at the destination port.",
      actionTextId: "Lacak Escrow & Kapal ↗",
      actionTextEn: "Track Escrow & Vessel ↗",
      action: () => openTransactionModal('TX-003')
    },
    {
      step: 6,
      titleId: "Pelepasan Dana & Ekspor Berhasil",
      titleEn: "Fund Release & Successful Export",
      descId: "Setelah Bill of Lading dan dokumen kepabeanan diverifikasi lengkap, sisa dana escrow otomatis dicairkan ke rekening bank UMKM Anda. Produk lokal Indonesia sukses mendunia!",
      descEn: "Once the Bill of Lading and customs clearance are confirmed, escrow balances are released directly to your bank. Authentic Indonesian products successfully reach global markets!",
      actionTextId: "Lihat Ringkasan Transaksi Sukses ↗",
      actionTextEn: "View Successful Trade Summary ↗",
      action: () => openTransactionModal('TX-001')
    }
  ];

  function updateWorkflowDrawer(stepNum) {
    currentWorkflowStep = stepNum;

    if (workflowStepItems && workflowStepItems.length > 0) {
      workflowStepItems.forEach(item => {
        const s = parseInt(item.getAttribute('data-step'), 10);
        if (s === stepNum) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    const data = workflowStepsData.find(d => d.step === stepNum) || workflowStepsData[0];
    const isEn = currentLang === 'en';

    if (stepDetailBadge) stepDetailBadge.textContent = isEn ? `Step ${data.step} of 6` : `Langkah ${data.step} dari 6`;
    if (stepDetailTitle) stepDetailTitle.textContent = isEn ? data.titleEn : data.titleId;
    if (stepDetailDesc) stepDetailDesc.textContent = isEn ? data.descEn : data.descId;
    if (btnStepAction) {
      btnStepAction.innerHTML = `<span>${isEn ? data.actionTextEn : data.actionTextId}</span>`;
      btnStepAction.onclick = data.action;
    }
  }

  // ==================== 5. LANGUAGE TRANSLATIONS ====================
  const translations = {
    id: {
      nav_home: "Beranda",
      nav_products: "Produk",
      nav_solutions: "Solusi Perdagangan",
      nav_calculator: "Kalkulator Ekspor",
      nav_workflow: "Alur Ekspor",
      nav_dashboard: "Dashboard",
      nav_about: "Tentang",
      btn_login: "Masuk",
      btn_register: "Daftar Gratis",
      hero_pill: "Platform Perdagangan Global UMKM Indonesia",
      hero_btn_export: "Mulai Ekspor Sekarang",
      hero_btn_demo: "Lihat Demo",
      hero_btn_calc: "Kalkulator Ekspor",
      toast_msg: "Bahasa diubah ke Bahasa Indonesia 🇮🇩"
    },
    en: {
      nav_home: "Home",
      nav_products: "Products",
      nav_solutions: "Trade Solutions",
      nav_calculator: "Export Calculator",
      nav_workflow: "Export Flow",
      nav_dashboard: "Dashboard",
      nav_about: "About Us",
      btn_login: "Log In",
      btn_register: "Sign Up Free",
      hero_pill: "Indonesian SME Global Trade Platform",
      hero_btn_export: "Start Exporting Now",
      hero_btn_demo: "Watch Demo",
      hero_btn_calc: "Export Calculator",
      toast_msg: "Language switched to English 🇬🇧"
    }
  };

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('nusabridge_lang', lang);
    document.documentElement.lang = lang;

    const currentLangLabel = document.getElementById('currentLangLabel');
    if (currentLangLabel) {
      currentLangLabel.textContent = lang.toUpperCase();
    }

    const dict = translations[lang] || translations.id;
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (dict[key].includes('<') && dict[key].includes('>')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    updateWorkflowDrawer(currentWorkflowStep);
  }

  // Language Dropdown Events
  const langDropdownWrapper = document.getElementById('langDropdownWrapper');
  const langSelectorBtn = document.getElementById('langSelectorBtn');
  const langOptionItems = document.querySelectorAll('.lang-option-item');

  if (langSelectorBtn && langDropdownWrapper) {
    langSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langDropdownWrapper.classList.toggle('open');
      langSelectorBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!langDropdownWrapper.contains(e.target)) {
        langDropdownWrapper.classList.remove('open');
        langSelectorBtn.setAttribute('aria-expanded', 'false');
      }
    });

    langOptionItems.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedLang = btn.getAttribute('data-lang');
        if (selectedLang) {
          applyLanguage(selectedLang);
          langDropdownWrapper.classList.remove('open');
          showToast(translations[selectedLang].toast_msg);
        }
      });
    });
  }

  // Initial apply
  applyLanguage(currentLang);

  // Workflow Nav buttons
  workflowStepItems.forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      if (step) updateWorkflowDrawer(step);
    });
  });

  if (btnPrevStep) {
    btnPrevStep.addEventListener('click', () => {
      let prev = currentWorkflowStep - 1;
      if (prev < 1) prev = 6;
      updateWorkflowDrawer(prev);
    });
  }

  if (btnNextStep) {
    btnNextStep.addEventListener('click', () => {
      let next = currentWorkflowStep + 1;
      if (next > 6) next = 1;
      updateWorkflowDrawer(next);
    });
  }

  // ==================== 6. DASHBOARD MOCKUP TABS SWITCHING (BERANDA, PRODUK, RFQ, DLL) ====================
  const mockupNavItems = document.querySelectorAll('.mockup-nav-item');
  const mockupViewPanes = document.querySelectorAll('.mockup-view-pane');

  function switchMockupTab(tabName) {
    if (!tabName) return;
    const cleanTab = tabName.toLowerCase().trim();

    // Update sidebar nav active state
    mockupNavItems.forEach(item => {
      const itemTab = (item.getAttribute('data-mockup-tab') || '').toLowerCase().trim();
      if (itemTab === cleanTab) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update view panes display
    mockupViewPanes.forEach(pane => {
      const paneId = pane.id.toLowerCase();
      if (paneId.includes(cleanTab)) {
        pane.classList.add('active');
        pane.style.display = 'flex';
      } else {
        pane.classList.remove('active');
        pane.style.display = 'none';
      }
    });
  }

  // Attach direct click to every sidebar tab
  mockupNavItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const tab = this.getAttribute('data-mockup-tab');
      if (tab) {
        switchMockupTab(tab);
      }
    });
  });

  // Attach click to quick stats badges inside Beranda
  document.querySelectorAll('[data-switch-tab]').forEach(el => {
    el.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-switch-tab');
      if (targetTab) switchMockupTab(targetTab);
    });
  });

  // Notification Popover
  const mockupNotifBtn = document.getElementById('mockupNotifBtn');
  const mockupNotifPopover = document.getElementById('mockupNotifPopover');
  const btnMarkAllRead = document.getElementById('btnMarkAllRead');

  if (mockupNotifBtn && mockupNotifPopover) {
    mockupNotifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mockupNotifPopover.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!mockupNotifPopover.contains(e.target)) {
        mockupNotifPopover.classList.remove('open');
      }
    });

    if (btnMarkAllRead) {
      btnMarkAllRead.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Semua notifikasi telah ditandai dibaca');
        mockupNotifPopover.classList.remove('open');
        const badge = mockupNotifBtn.querySelector('span');
        if (badge) badge.style.display = 'none';
      });
    }

    mockupNotifPopover.querySelectorAll('.popover-item').forEach(item => {
      item.addEventListener('click', function() {
        const act = this.getAttribute('data-action');
        mockupNotifPopover.classList.remove('open');
        if (act === 'rfq') {
          switchMockupTab('rfq');
          openRfqModal('RFQ-HAM');
        } else if (act === 'doc') {
          openDocumentModal('coo');
        } else if (act === 'escrow') {
          openTransactionModal('TX-001');
        }
      });
    });
  }

  // Real-Time Search Filter in Mockup
  const mockupSearchInput = document.getElementById('mockupSearchInput');
  if (mockupSearchInput) {
    mockupSearchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      const activePane = document.querySelector('.mockup-view-pane.active');
      if (!activePane) return;

      const rows = activePane.querySelectorAll('.mockup-data-row, .tx-row, .mstat-card');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = (!query || text.includes(query)) ? 'flex' : 'none';
      });
    });
  }

  // Mockup profile click
  const mockupProfileClick = document.getElementById('mockupProfileClick');
  if (mockupProfileClick) {
    mockupProfileClick.addEventListener('click', () => openKycModal());
  }

  // ==================== 7. SMART EXPORT CALCULATOR (LIVE SLIDER, INPUT & RECALCULATION) ====================
  const calcCommodity = document.getElementById('calcCommodity');
  const calcVolumeRange = document.getElementById('calcVolumeRange');
  const calcVolumeInput = document.getElementById('calcVolumeInput');
  const calcVolumeDisplay = document.getElementById('calcVolumeDisplay');
  const calcUnitBadge = document.getElementById('calcUnitBadge');
  const btnVolMinus = document.getElementById('btnVolMinus');
  const btnVolPlus = document.getElementById('btnVolPlus');
  const calcPresetBtns = document.querySelectorAll('.calc-preset-btn');
  const calcDestination = document.getElementById('calcDestination');
  const incoCardFOB = document.getElementById('incoCardFOB');
  const incoCardCIF = document.getElementById('incoCardCIF');

  const calcSummarySub = document.getElementById('calcSummarySub');
  const calcValFob = document.getElementById('calcValFob');
  const calcRowFreight = document.getElementById('calcRowFreight');
  const calcValFreight = document.getElementById('calcValFreight');
  const calcRowInsurance = document.getElementById('calcRowInsurance');
  const calcValInsurance = document.getElementById('calcValInsurance');
  const calcTotalIncoLabel = document.getElementById('calcTotalIncoLabel');
  const calcValTotal = document.getElementById('calcValTotal');
  const calcDocList = document.getElementById('calcDocList');
  const btnCalcDraftDoc = document.getElementById('btnCalcDraftDoc');

  let activeIncoterm = 'FOB';

  function updateVolumeTrack(volume) {
    if (!calcVolumeRange) return;
    const min = parseFloat(calcVolumeRange.min) || 100;
    const max = parseFloat(calcVolumeRange.max) || 20000;
    const pct = Math.max(0, Math.min(100, ((volume - min) / (max - min)) * 100));
    calcVolumeRange.style.background = `linear-gradient(to right, #0b6e4f ${pct}%, #e2e8f0 ${pct}%)`;
  }

  function syncPresetButtons(volume) {
    calcPresetBtns.forEach(btn => {
      const presetVol = parseFloat(btn.getAttribute('data-volume'));
      if (presetVol === volume) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function setVolume(newVolume, source) {
    let vol = parseFloat(newVolume) || 100;
    vol = Math.max(100, Math.min(50000, Math.round(vol / 50) * 50));

    if (calcVolumeRange && source !== 'range') {
      calcVolumeRange.value = Math.min(20000, vol);
    }
    if (calcVolumeInput && source !== 'input') {
      calcVolumeInput.value = vol;
    }
    updateVolumeTrack(vol);
    syncPresetButtons(vol);
    updateCalculator();
  }

  function updateCalculator() {
    if (!calcCommodity || !calcDestination) return;

    // Get selected commodity info
    const selectedOpt = calcCommodity.options[calcCommodity.selectedIndex];
    const basePrice = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-price')) || 8.50) : 8.50;
    const unit = selectedOpt ? (selectedOpt.getAttribute('data-unit') || 'Kg') : 'Kg';

    // Get volume
    const volume = calcVolumeRange ? (parseFloat(calcVolumeRange.value) || 1000) : 1000;

    // Live update unit badges and display
    if (calcUnitBadge) {
      calcUnitBadge.textContent = unit;
    }
    document.querySelectorAll('.preset-unit').forEach(el => {
      el.textContent = unit;
    });
    if (calcVolumeDisplay) {
      calcVolumeDisplay.textContent = `${volume.toLocaleString('en-US')} ${unit}`;
    }
    if (calcVolumeInput && document.activeElement !== calcVolumeInput) {
      calcVolumeInput.value = volume;
    }
    updateVolumeTrack(volume);

    // Get destination freight
    const destOpt = calcDestination.options[calcDestination.selectedIndex];
    const baseFreight = destOpt ? (parseFloat(destOpt.getAttribute('data-freight')) || 1200) : 1200;
    const destCountry = destOpt ? (destOpt.getAttribute('data-country') || 'Pelabuhan Tujuan') : 'Pelabuhan Tujuan';

    // Live math
    const fobTotal = volume * basePrice;
    const volumeFactor = Math.max(1, volume / 1000);
    const scaledFreight = baseFreight * Math.pow(volumeFactor, 0.65);
    const marineInsurance = (fobTotal + scaledFreight) * 0.0035 * 1.1;

    let finalTotal = fobTotal;
    if (activeIncoterm === 'CIF') {
      finalTotal = fobTotal + scaledFreight + marineInsurance;
    }

    // Update display outputs
    if (calcValFob) {
      calcValFob.textContent = `USD ${fobTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (calcValFreight) {
      calcValFreight.textContent = `+ USD ${scaledFreight.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (calcValInsurance) {
      calcValInsurance.textContent = `+ USD ${marineInsurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (calcValTotal) {
      calcValTotal.textContent = `USD ${finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (calcTotalIncoLabel) {
      calcTotalIncoLabel.textContent = activeIncoterm;
    }

    // Toggle CIF / FOB rows
    if (activeIncoterm === 'CIF') {
      if (calcRowFreight) calcRowFreight.style.display = 'flex';
      if (calcRowInsurance) calcRowInsurance.style.display = 'flex';
      if (calcSummarySub) calcSummarySub.textContent = `Kalkulasi Incoterms CIF ${destCountry}`;
      if (calcDocList) {
        calcDocList.innerHTML = `
          <span class="doc-tag">Commercial Invoice (CIF)</span>
          <span class="doc-tag">Packing List</span>
          <span class="doc-tag">Bill of Lading (B/L)</span>
          <span class="doc-tag">Polis Asuransi Maritim</span>
          <span class="doc-tag">COO (e-SKA Kemendag)</span>
          <span class="doc-tag">PEB Bea Cukai</span>
        `;
      }
    } else {
      if (calcRowFreight) calcRowFreight.style.display = 'none';
      if (calcRowInsurance) calcRowInsurance.style.display = 'none';
      if (calcSummarySub) calcSummarySub.textContent = `Kalkulasi Incoterms FOB Pelabuhan Indonesia`;
      if (calcDocList) {
        calcDocList.innerHTML = `
          <span class="doc-tag">Commercial Invoice</span>
          <span class="doc-tag">Packing List</span>
          <span class="doc-tag">PEB Bea Cukai (NPE)</span>
          <span class="doc-tag">Resi Muat (Mate's Receipt)</span>
        `;
      }
    }
  }

  // Bind live slider listeners
  if (calcVolumeRange) {
    ['input', 'change'].forEach(evt => {
      calcVolumeRange.addEventListener(evt, () => {
        setVolume(calcVolumeRange.value, 'range');
      });
    });
  }

  if (calcVolumeInput) {
    ['input', 'change', 'keyup'].forEach(evt => {
      calcVolumeInput.addEventListener(evt, () => {
        if (calcVolumeInput.value) {
          setVolume(calcVolumeInput.value, 'input');
        }
      });
    });
  }

  if (btnVolMinus) {
    btnVolMinus.addEventListener('click', () => {
      const current = parseFloat(calcVolumeRange ? calcVolumeRange.value : 1000);
      setVolume(Math.max(100, current - 500), 'button');
    });
  }

  if (btnVolPlus) {
    btnVolPlus.addEventListener('click', () => {
      const current = parseFloat(calcVolumeRange ? calcVolumeRange.value : 1000);
      setVolume(Math.min(20000, current + 500), 'button');
    });
  }

  calcPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const vol = parseFloat(btn.getAttribute('data-volume'));
      if (vol) setVolume(vol, 'preset');
    });
  });

  if (calcCommodity) {
    calcCommodity.addEventListener('change', () => {
      updateCalculator();
    });
  }

  if (calcDestination) {
    calcDestination.addEventListener('change', updateCalculator);
  }

  if (incoCardFOB && incoCardCIF) {
    incoCardFOB.addEventListener('click', () => {
      activeIncoterm = 'FOB';
      incoCardFOB.classList.add('active');
      incoCardCIF.classList.remove('active');
      updateCalculator();
    });

    incoCardCIF.addEventListener('click', () => {
      activeIncoterm = 'CIF';
      incoCardCIF.classList.add('active');
      incoCardFOB.classList.remove('active');
      updateCalculator();
    });
  }

  if (btnCalcDraftDoc) {
    btnCalcDraftDoc.addEventListener('click', () => openDocumentModal('proforma'));
  }

  // Initial calculation
  updateCalculator();

  // ==================== 8. PRODUCT CARDS & DETAIL MODAL ====================
  const productDetailModal = document.getElementById('productDetailModal');
  const closeProductDetailModal = document.getElementById('closeProductDetailModal');
  const productModalImage = document.getElementById('productModalImage');
  const productModalCategory = document.getElementById('productModalCategory');
  const productModalTitle = document.getElementById('productModalTitle');
  const productModalPrice = document.getElementById('productModalPrice');
  const productModalDesc = document.getElementById('productModalDesc');
  const productModalHs = document.getElementById('productModalHs');
  const productModalOrigin = document.getElementById('productModalOrigin');
  const productModalMoisture = document.getElementById('productModalMoisture');
  const productModalPackaging = document.getElementById('productModalPackaging');
  const productModalMoq = document.getElementById('productModalMoq');
  const productModalCert = document.getElementById('productModalCert');
  const btnModalCalcThisProduct = document.getElementById('btnModalCalcThisProduct');
  const btnModalRfqThisProduct = document.getElementById('btnModalRfqThisProduct');

  const productDataDictionary = {
    'kopi': {
      title: "Kopi Arabika Gayo Specialty Grade 1",
      category: "Komoditas Pertanian",
      price: "USD 9.20 / Kg (FOB Belawan)",
      desc: "Biji kopi Arabika organik dipetik merah dari dataran tinggi Gayo, Aceh. Diproses secara wet hulled dengan aroma floral, notes cokelat, dan tingkat keasaman seimbang.",
      hs: "0901.11.10",
      origin: "Takengon, Aceh Tengah",
      moisture: "Maksimal 12.5%",
      packaging: "Jute Bag 60 Kg + GrainPro Hermetic Liner",
      moq: "1.000 Kg (1 Metrik Ton)",
      cert: "USDA Organic, Fair Trade, Halal BPJPH, ICO Origin",
      image: "assets/tx-thumb-1.webp",
      calcKey: "kopi"
    },
    'kayu-manis': {
      title: "Kayu Manis Kerinci (Cinnamomum Burmannii)",
      category: "Rempah & Herbal",
      price: "USD 6.50 / Kg (FOB Teluk Bayur)",
      desc: "Batang kulit kayu manis berkualitas tinggi dari lereng Gunung Kerinci dengan aroma harum manis khas rempah tropis nusantara.",
      hs: "0906.11.00",
      origin: "Kabupaten Kerinci, Jambi",
      moisture: "Maksimal 13.0%",
      packaging: "Bale Press 50 Kg / Food Grade Carton",
      moq: "500 Kg",
      cert: "Phytosanitary Karantina, Halal BPJPH, Organic EU",
      image: "assets/tx-thumb-2.webp",
      calcKey: "kayu-manis"
    },
    'minyak-atsiri': {
      title: "Minyak Atsiri Nilam Aceh (Patchouli Oil)",
      category: "Minyak Atsiri & Farmasi",
      price: "USD 45.00 / Kg (FOB Belawan)",
      desc: "Minyak nilam murni hasil distilasi daun Pogostemon cablin dengan kadar patchouli alcohol (PA) minimal 32%.",
      hs: "3301.29.90",
      origin: "Aceh Selatan, Indonesia",
      moisture: "Kadar Air < 0.5% (High Purity)",
      packaging: "Drum Baja Khusus Food Grade 200 Kg",
      moq: "100 Kg",
      cert: "COA, GC-MS Lab Report, Halal",
      image: "assets/tx-thumb-2.webp",
      calcKey: "atsiri"
    },
    'tenun-ikat': {
      title: "Kain Tenun Ikat Tradisional Pewarna Alami NTT",
      category: "Kriya Tekstil Tradisional",
      price: "USD 85.00 / Pcs (FOB Tanjung Perak)",
      desc: "Kain tenun ikat autentik karya tangan perajin tenun Sumba dan Flores dengan pewarna alami akar mengkudu dan daun tarum.",
      hs: "5208.52.00",
      origin: "Sumba Timur, Nusa Tenggara Timur",
      moisture: "Standar Kain Kering",
      packaging: "Master Export Carton Box",
      moq: "50 Lembar (Pcs)",
      cert: "Geographical Indication (IG) Tenun Ikat NTT",
      image: "assets/tx-thumb-3.webp",
      calcKey: "tenun"
    }
  };

  let activeProductCalcKey = 'kopi';
  let currentDetailProductId = 'kopi';

  function openProductDetailModal(productId) {
    currentDetailProductId = productId;
    const data = productDataDictionary[productId] || productDataDictionary['kopi'];
    activeProductCalcKey = data.calcKey;

    if (productModalImage) productModalImage.src = data.image;
    if (productModalCategory) productModalCategory.textContent = data.category;
    if (productModalTitle) productModalTitle.textContent = data.title;
    if (productModalPrice) productModalPrice.innerHTML = `${data.price}`;
    if (productModalDesc) productModalDesc.textContent = data.desc;
    if (productModalHs) productModalHs.textContent = data.hs;
    if (productModalOrigin) productModalOrigin.textContent = data.origin;
    if (productModalMoisture) productModalMoisture.textContent = data.moisture;
    if (productModalPackaging) productModalPackaging.textContent = data.packaging;
    if (productModalMoq) productModalMoq.textContent = data.moq;
    if (productModalCert) productModalCert.textContent = data.cert;

    openModal(productDetailModal);
  }

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function() {
      const productId = this.getAttribute('data-product-id') || 'kopi';
      openProductDetailModal(productId);
    });
  });

  document.querySelectorAll('.interactive-product-row').forEach(row => {
    row.addEventListener('click', function() {
      const productId = this.getAttribute('data-product-id') || 'kopi';
      openProductDetailModal(productId);
    });
  });

  if (closeProductDetailModal) {
    closeProductDetailModal.addEventListener('click', () => closeModal(productDetailModal));
  }

  if (btnModalCalcThisProduct) {
    btnModalCalcThisProduct.addEventListener('click', () => {
      closeModal(productDetailModal);
      if (calcCommodity) {
        calcCommodity.value = activeProductCalcKey;
        const p = commodityPresets[activeProductCalcKey];
        if (p && calcBasePrice) calcBasePrice.value = p.basePrice.toFixed(2);
        if (p && calcQty) calcQty.value = p.minQty;
        updateCalculator();
      }
      const calcSection = document.getElementById('kalkulator');
      if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (btnModalRfqThisProduct) {
    btnModalRfqThisProduct.addEventListener('click', () => {
      closeModal(productDetailModal);
      openRfqModal(currentDetailProductId || 'RFQ-HAM');
    });
  }

  // ==================== 9. DOCUMENT MODAL (PROFORMA & COO) ====================
  const documentModal = document.getElementById('documentModal');
  const closeDocumentModal = document.getElementById('closeDocumentModal');
  const btnSwitchDocProforma = document.getElementById('btnSwitchDocProforma');
  const btnSwitchDocCoo = document.getElementById('btnSwitchDocCoo');
  const docViewFrameProforma = document.getElementById('docViewFrameProforma');
  const docViewFrameCoo = document.getElementById('docViewFrameCoo');
  const btnPrintDocument = document.getElementById('btnPrintDocument');

  function openDocumentModal(type) {
    if (type === 'coo') {
      if (docViewFrameProforma) docViewFrameProforma.style.display = 'none';
      if (docViewFrameCoo) docViewFrameCoo.style.display = 'block';
      if (btnSwitchDocCoo) { btnSwitchDocCoo.classList.add('btn-primary'); btnSwitchDocCoo.classList.remove('btn-outline-primary'); }
      if (btnSwitchDocProforma) { btnSwitchDocProforma.classList.add('btn-outline-primary'); btnSwitchDocProforma.classList.remove('btn-primary'); }
    } else {
      if (docViewFrameProforma) docViewFrameProforma.style.display = 'block';
      if (docViewFrameCoo) docViewFrameCoo.style.display = 'none';
      if (btnSwitchDocProforma) { btnSwitchDocProforma.classList.add('btn-primary'); btnSwitchDocProforma.classList.remove('btn-outline-primary'); }
      if (btnSwitchDocCoo) { btnSwitchDocCoo.classList.add('btn-outline-primary'); btnSwitchDocCoo.classList.remove('btn-primary'); }
    }
    openModal(documentModal);
  }

  if (btnSwitchDocProforma) btnSwitchDocProforma.addEventListener('click', () => openDocumentModal('proforma'));
  if (btnSwitchDocCoo) btnSwitchDocCoo.addEventListener('click', () => openDocumentModal('coo'));
  if (closeDocumentModal) closeDocumentModal.addEventListener('click', () => closeModal(documentModal));

  if (btnPrintDocument) {
    btnPrintDocument.addEventListener('click', () => {
      showToast('Menyiapkan berkas ekspor format PDF berstandar Kemendag... 📄');
    });
  }

  document.querySelectorAll('[data-open-doc]').forEach(btn => {
    btn.addEventListener('click', function() {
      openDocumentModal(this.getAttribute('data-open-doc') || 'proforma');
    });
  });

  const btnMockNewDoc = document.getElementById('btnMockNewDoc');
  if (btnMockNewDoc) {
    btnMockNewDoc.addEventListener('click', () => openDocumentModal('proforma'));
  }

  // ==================== 10. KYC OSS NIB VERIFICATION MODAL ====================
  const kycModal = document.getElementById('kycModal');
  const closeKycModal = document.getElementById('closeKycModal');
  const btnCloseKycModal = document.getElementById('btnCloseKycModal');
  const inputNibVerify = document.getElementById('inputNibVerify');
  const btnRunNibCheck = document.getElementById('btnRunNibCheck');
  const kycResultBox = document.getElementById('kycResultBox');
  const heroExporterCard = document.getElementById('heroVerifiedCard');

  function openKycModal() {
    openModal(kycModal);
  }

  if (heroExporterCard) heroExporterCard.addEventListener('click', openKycModal);
  const btnTriggerKycModal = document.getElementById('btnTriggerKycModal');
  if (btnTriggerKycModal) btnTriggerKycModal.addEventListener('click', openKycModal);
  if (closeKycModal) closeKycModal.addEventListener('click', () => closeModal(kycModal));
  if (btnCloseKycModal) btnCloseKycModal.addEventListener('click', () => closeModal(kycModal));

  if (btnRunNibCheck && inputNibVerify && kycResultBox) {
    btnRunNibCheck.addEventListener('click', () => {
      const nib = inputNibVerify.value.trim();
      if (!nib || nib.length < 9) {
        alert('Mohon masukkan 13 digit Nomor Induk Berusaha (NIB) yang valid');
        return;
      }

      btnRunNibCheck.textContent = 'Memverifikasi ke Server OSS...';
      btnRunNibCheck.disabled = true;

      setTimeout(() => {
        btnRunNibCheck.textContent = 'Verifikasi NIB Sekarang';
        btnRunNibCheck.disabled = false;
        kycResultBox.style.display = 'block';
        showToast('Legalitas NIB & NPWP Terverifikasi Aktif ✓');
      }, 700);
    });
  }

  // ==================== 11. ESCROW & TRANSACTION STATUS MODAL ====================
  const transactionModal = document.getElementById('transactionModal');
  const closeTxModal = document.getElementById('closeTxModal');
  const btnCloseTxModal = document.getElementById('btnCloseTxModal');
  const txModalContractNo = document.getElementById('txModalContractNo');
  const txModalValue = document.getElementById('txModalValue');
  const txModalBuyer = document.getElementById('txModalBuyer');
  const txModalIncoterm = document.getElementById('txModalIncoterm');

  const txDataRecords = {
    'TX-001': { contract: 'SC-2026-DE-049', val: 'USD 12,000', buyer: 'Hamburg Coffee Import GmbH (Jerman)', incoterm: 'FOB Belawan (IDBLW)' },
    'TX-002': { contract: 'SC-2026-JP-018', val: 'USD 8,750', buyer: 'Kyoto Spices Co., Ltd (Jepang)', incoterm: 'CIF Yokohama (JPYOK)' },
    'TX-003': { contract: 'SC-2026-EU-032', val: 'USD 24,000', buyer: 'Rotterdam Fragrance Oils (Belanda)', incoterm: 'CIF Rotterdam (NLRTM)' }
  };

  function openTransactionModal(txId) {
    const data = txDataRecords[txId] || txDataRecords['TX-001'];
    if (txModalContractNo) txModalContractNo.textContent = data.contract;
    if (txModalValue) txModalValue.textContent = data.val;
    if (txModalBuyer) txModalBuyer.textContent = data.buyer;
    if (txModalIncoterm) txModalIncoterm.textContent = data.incoterm;
    openModal(transactionModal);
  }

  document.querySelectorAll('.interactive-tx').forEach(row => {
    row.addEventListener('click', function() {
      const txId = this.getAttribute('data-tx-id') || 'TX-001';
      openTransactionModal(txId);
    });
  });

  if (closeTxModal) closeTxModal.addEventListener('click', () => closeModal(transactionModal));
  if (btnCloseTxModal) btnCloseTxModal.addEventListener('click', () => closeModal(transactionModal));

  // ==================== 11.5. RFQ STUDIO & ASISTEN PENAWARAN (LIVE GTNIC 2026) ====================
  const rfqModal = document.getElementById('rfqModal');
  const closeRfqModal = document.getElementById('closeRfqModal');
  const rfqModalIdBadge = document.getElementById('rfqModalIdBadge');
  const rfqBuyerName = document.getElementById('rfqBuyerName');
  const rfqBuyerLocation = document.getElementById('rfqBuyerLocation');
  const rfqBuyerRating = document.getElementById('rfqBuyerRating');
  const rfqCommodity = document.getElementById('rfqCommodity');
  const rfqHsCode = document.getElementById('rfqHsCode');
  const rfqVolume = document.getElementById('rfqVolume');
  const rfqPackaging = document.getElementById('rfqPackaging');
  const rfqSpecs = document.getElementById('rfqSpecs');
  const rfqLeadTime = document.getElementById('rfqLeadTime');
  const rfqAiTag = document.getElementById('rfqAiTag');
  const rfqAiInsight = document.getElementById('rfqAiInsight');

  const btnRfqIncoFob = document.getElementById('btnRfqIncoFob');
  const btnRfqIncoCif = document.getElementById('btnRfqIncoCif');
  const rfqMarginDisplay = document.getElementById('rfqMarginDisplay');
  const rfqMarginRange = document.getElementById('rfqMarginRange');

  const rfqPricePerUnit = document.getElementById('rfqPricePerUnit');
  const rfqFobSubtotal = document.getElementById('rfqFobSubtotal');
  const rfqFreightRow = document.getElementById('rfqFreightRow');
  const rfqFreightCost = document.getElementById('rfqFreightCost');
  const rfqInsuranceRow = document.getElementById('rfqInsuranceRow');
  const rfqInsuranceCost = document.getElementById('rfqInsuranceCost');
  const rfqTotalIncoBadge = document.getElementById('rfqTotalIncoBadge');
  const rfqEstimatedProfit = document.getElementById('rfqEstimatedProfit');
  const rfqTotalContractVal = document.getElementById('rfqTotalContractVal');
  const rfqSuccessAlert = document.getElementById('rfqSuccessAlert');
  const rfqSuccessDesc = document.getElementById('rfqSuccessDesc');

  const btnRfqAskAi = document.getElementById('btnRfqAskAi');
  const btnRfqGenerateProforma = document.getElementById('btnRfqGenerateProforma');
  const btnRfqSendQuotation = document.getElementById('btnRfqSendQuotation');
  const btnDemoSandboxRfq = document.getElementById('btnDemoSandboxRfq');

  const rfqDataDictionary = {
    'RFQ-HAM': {
      id: 'RFQ-2026-DE-088',
      buyer: 'Hamburg Coffee Import GmbH',
      country: 'Speicherstadt, Hamburg, Jerman 🇩🇪',
      port: 'Port of Hamburg (DEHAM)',
      rating: '4.9 ★ Verified EU Importer',
      commodity: 'Kopi Arabika Gayo Specialty Grade 1',
      hs: '0901.11.10',
      volume: 1000,
      unit: 'Kg',
      packaging: 'Jute Bag 60kg + GrainPro Hermetic',
      specs: 'Moisture max 12.5%, Defect < 5%, Screen size 16-18',
      leadTime: '14 Hari Pemuatan Pelabuhan Belawan',
      basePriceFob: 7.50,
      defaultMargin: 22.5,
      freightBase: 1200,
      insuranceRate: 0.0035,
      aiTag: 'Kepatuhan Regulasi EUDR Terpenuhi',
      aiInsight: 'Buyer memenuhi standar kualifikasi kepatuhan EU Deforestation Regulation (EUDR). Harga pasar terkini di Eropa berkisar USD 9.20 – 10.00 / Kg. Disarankan menawarkan opsi <strong>CIF Hamburg</strong> dengan margin laba bersih <strong>~18.5% – 22.5%</strong> untuk mengamankan kontrak dagang jangka panjang.',
      aiQuery: 'Analisis permintaan RFQ buyer kopi dari Jerman',
      contractNo: 'SC-2026-DE-049',
      invoiceNo: 'INV-2026-DE-049',
      portOfLoading: 'Pelabuhan Muat: Belawan (IDBLW), Indonesia',
      buyerAddress: 'Speicherstadt Block B, 20457 Hamburg, Germany'
    },
    'RFQ-TYO': {
      id: 'RFQ-2026-JP-034',
      buyer: 'Kyoto Spices Co., Ltd',
      country: 'Minato-ku, Yokohama, Jepang 🇯🇵',
      port: 'Port of Yokohama (JPYOK)',
      rating: '4.8 ★ Certified Asian Trade Partner',
      commodity: 'Kayu Manis Kerinci (Cinnamomum Burmannii)',
      hs: '0906.11.00',
      volume: 500,
      unit: 'Kg',
      packaging: 'Bale Press Food Grade Carton 25kg',
      specs: 'Volatile Oil min 2.5%, Moisture max 13%, Clean Cut Stick 8cm, No Mold',
      leadTime: '10 Hari Pemuatan Pelabuhan Teluk Bayur',
      basePriceFob: 5.20,
      defaultMargin: 25.0,
      freightBase: 750,
      insuranceRate: 0.0035,
      aiTag: 'Standar Karantina Jepang MAFF Terverifikasi',
      aiInsight: 'Permintaan rempah kayu manis memenuhi batas residu pestisida Positive List System Jepang. Harga pasar rata-rata CIF Yokohama USD 6.50 – 7.20 / Kg. Rekomendasi: sertakan Certificate of Analysis (COA) Sucofindo & COO Form IJ-EPA untuk tarif preferensial 0%.',
      aiQuery: 'Berapa rekomendasi harga aman FOB Belawan untuk Kopi Arabika?',
      contractNo: 'SC-2026-JP-034',
      invoiceNo: 'INV-2026-JP-034',
      portOfLoading: 'Pelabuhan Muat: Teluk Bayur (IDTBY), Indonesia',
      buyerAddress: '2-15 Nihon-Odori, Naka-ku, Yokohama 231-0021, Japan'
    },
    'RFQ-RTM': {
      id: 'RFQ-2026-NL-019',
      buyer: 'Rotterdam Fragrance Oils',
      country: 'Waalhaven, Rotterdam, Belanda 🇳🇱',
      port: 'Port of Rotterdam (NLRTM) / FOB Belawan',
      rating: '5.0 ★ Premium Cosmetic Supplier',
      commodity: 'Minyak Atsiri Nilam Aceh (Patchouli Oil)',
      hs: '3301.29.90',
      volume: 200,
      unit: 'Kg',
      packaging: 'Drum Baja Khusus Food Grade 25kg x 8',
      specs: 'Patchouli Alcohol (PA) min 32%, Kadar Air < 0.5%, Pure Steam Distilled',
      leadTime: '7 Hari Pemuatan Pelabuhan Belawan',
      basePriceFob: 36.00,
      defaultMargin: 25.0,
      freightBase: 1150,
      insuranceRate: 0.0035,
      aiTag: 'Sertifikasi MSDS & REACH EU Siap',
      aiInsight: 'Kadar Patchouli Alcohol 32% merupakan grade ekspor premium industri parfum Eropa. Buyer meminta opsi FOB Belawan dengan pembayaran L/C at sight. Margin optimal 25% (USD 45.00/kg) memberikan keuntungan bersih USD 1.800 tanpa beban risiko ongkos angkut kapal laut.',
      aiQuery: 'Bagaimana alur penerbitan Certificate of Origin (COO e-SKA)?',
      contractNo: 'SC-2026-NL-019',
      invoiceNo: 'INV-2026-NL-019',
      portOfLoading: 'Pelabuhan Muat: Belawan (IDBLW), Indonesia',
      buyerAddress: 'Waalhaven Oostzijde 14, 3089 KM Rotterdam, Netherlands'
    }
  };

  rfqDataDictionary['kopi'] = rfqDataDictionary['RFQ-HAM'];
  rfqDataDictionary['1'] = rfqDataDictionary['RFQ-HAM'];
  rfqDataDictionary['rempah'] = rfqDataDictionary['RFQ-TYO'];
  rfqDataDictionary['kayu-manis'] = rfqDataDictionary['RFQ-TYO'];
  rfqDataDictionary['2'] = rfqDataDictionary['RFQ-TYO'];
  rfqDataDictionary['atsiri'] = rfqDataDictionary['RFQ-RTM'];
  rfqDataDictionary['minyak-atsiri'] = rfqDataDictionary['RFQ-RTM'];
  rfqDataDictionary['3'] = rfqDataDictionary['RFQ-RTM'];
  rfqDataDictionary['tekstil'] = rfqDataDictionary['RFQ-HAM'];
  rfqDataDictionary['tenun-ikat'] = rfqDataDictionary['RFQ-HAM'];
  rfqDataDictionary['4'] = rfqDataDictionary['RFQ-HAM'];
  rfqDataDictionary['makanan'] = rfqDataDictionary['RFQ-HAM'];
  rfqDataDictionary['5'] = rfqDataDictionary['RFQ-HAM'];

  let activeRfqKey = 'RFQ-HAM';
  let activeRfqIncoterm = 'CIF';
  let lastCalculatedQuote = null;

  function updateRfqCalculation() {
    const data = rfqDataDictionary[activeRfqKey] || rfqDataDictionary['RFQ-HAM'];
    const marginPct = parseFloat(rfqMarginRange ? rfqMarginRange.value : data.defaultMargin) || 18.5;

    if (rfqMarginDisplay) rfqMarginDisplay.textContent = `${marginPct.toFixed(1)}%`;

    const unitPrice = data.basePriceFob * (1 + marginPct / 100);
    const fobSubtotal = data.volume * unitPrice;
    const baseCostTotal = data.volume * data.basePriceFob;
    const profit = fobSubtotal - baseCostTotal;

    const freight = (activeRfqIncoterm === 'CIF') ? data.freightBase : 0;
    const insurance = (activeRfqIncoterm === 'CIF') ? (fobSubtotal + freight) * data.insuranceRate * 1.1 : 0;
    const totalContract = fobSubtotal + freight + insurance;

    lastCalculatedQuote = {
      data,
      incoterm: activeRfqIncoterm,
      unitPrice,
      fobSubtotal,
      freight,
      insurance,
      totalContract,
      profit,
      marginPct
    };

    if (rfqPricePerUnit) {
      rfqPricePerUnit.textContent = `USD ${unitPrice.toFixed(2)} / ${data.unit}`;
    }
    if (rfqFobSubtotal) {
      rfqFobSubtotal.textContent = `USD ${fobSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (rfqFreightRow && rfqFreightCost) {
      if (activeRfqIncoterm === 'CIF') {
        rfqFreightRow.style.display = 'flex';
        rfqFreightCost.textContent = `+ USD ${freight.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        rfqFreightRow.style.display = 'none';
      }
    }
    if (rfqInsuranceRow && rfqInsuranceCost) {
      if (activeRfqIncoterm === 'CIF') {
        rfqInsuranceRow.style.display = 'flex';
        rfqInsuranceCost.textContent = `+ USD ${insurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else {
        rfqInsuranceRow.style.display = 'none';
      }
    }
    if (rfqTotalIncoBadge) {
      rfqTotalIncoBadge.textContent = activeRfqIncoterm;
    }
    if (rfqEstimatedProfit) {
      rfqEstimatedProfit.textContent = `Estimasi Laba Bersih Eksportir: USD ${profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (rfqTotalContractVal) {
      rfqTotalContractVal.textContent = `USD ${totalContract.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  function renderRfqModal(rfqKey) {
    const rawKey = rfqKey || 'RFQ-HAM';
    activeRfqKey = rfqDataDictionary[rawKey] ? rawKey : 'RFQ-HAM';
    const data = rfqDataDictionary[activeRfqKey];

    let tabKey = 'RFQ-HAM';
    if (activeRfqKey === 'RFQ-TYO' || activeRfqKey === 'rempah' || activeRfqKey === 'kayu-manis' || activeRfqKey === '2') {
      tabKey = 'RFQ-TYO';
    } else if (activeRfqKey === 'RFQ-RTM' || activeRfqKey === 'atsiri' || activeRfqKey === 'minyak-atsiri' || activeRfqKey === '3') {
      tabKey = 'RFQ-RTM';
    }

    document.querySelectorAll('[data-rfq-tab]').forEach(tab => {
      if (tab.getAttribute('data-rfq-tab') === tabKey) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    if (rfqModalIdBadge) rfqModalIdBadge.textContent = data.id;
    if (rfqBuyerName) rfqBuyerName.textContent = data.buyer;
    if (rfqBuyerLocation) rfqBuyerLocation.innerHTML = `${data.country} • Pelabuhan Tujuan: <strong>${data.port}</strong>`;
    if (rfqBuyerRating) rfqBuyerRating.textContent = data.rating;
    if (rfqCommodity) rfqCommodity.textContent = data.commodity;
    if (rfqHsCode) rfqHsCode.textContent = `HS Code: ${data.hs}`;
    if (rfqVolume) rfqVolume.textContent = `${data.volume.toLocaleString('en-US')} ${data.unit}`;
    if (rfqPackaging) rfqPackaging.textContent = `Kemasan: ${data.packaging}`;
    if (rfqSpecs) rfqSpecs.textContent = data.specs;
    if (rfqLeadTime) rfqLeadTime.textContent = data.leadTime;
    if (rfqAiTag) rfqAiTag.textContent = data.aiTag;
    if (rfqAiInsight) rfqAiInsight.innerHTML = data.aiInsight;

    activeRfqIncoterm = (tabKey === 'RFQ-RTM') ? 'FOB' : 'CIF';
    if (btnRfqIncoFob && btnRfqIncoCif) {
      if (activeRfqIncoterm === 'FOB') {
        btnRfqIncoFob.classList.add('active');
        btnRfqIncoCif.classList.remove('active');
      } else {
        btnRfqIncoCif.classList.add('active');
        btnRfqIncoFob.classList.remove('active');
      }
    }

    if (rfqMarginRange) {
      rfqMarginRange.value = data.defaultMargin;
    }

    if (rfqSuccessAlert) {
      rfqSuccessAlert.style.display = 'none';
    }

    updateRfqCalculation();
  }

  function openRfqModal(rfqKey) {
    renderRfqModal(rfqKey);
    openModal(rfqModal);
  }

  // Bind RFQ Studio interactive controls
  if (btnRfqIncoFob) {
    btnRfqIncoFob.addEventListener('click', () => {
      activeRfqIncoterm = 'FOB';
      btnRfqIncoFob.classList.add('active');
      if (btnRfqIncoCif) btnRfqIncoCif.classList.remove('active');
      updateRfqCalculation();
    });
  }

  if (btnRfqIncoCif) {
    btnRfqIncoCif.addEventListener('click', () => {
      activeRfqIncoterm = 'CIF';
      btnRfqIncoCif.classList.add('active');
      if (btnRfqIncoFob) btnRfqIncoFob.classList.remove('active');
      updateRfqCalculation();
    });
  }

  if (rfqMarginRange) {
    rfqMarginRange.addEventListener('input', updateRfqCalculation);
  }

  document.querySelectorAll('[data-rfq-tab]').forEach(tab => {
    tab.addEventListener('click', function() {
      const key = this.getAttribute('data-rfq-tab');
      if (key) renderRfqModal(key);
    });
  });

  if (closeRfqModal) {
    closeRfqModal.addEventListener('click', () => closeModal(rfqModal));
  }

  if (btnRfqGenerateProforma) {
    btnRfqGenerateProforma.addEventListener('click', () => {
      if (!lastCalculatedQuote) updateRfqCalculation();
      const q = lastCalculatedQuote;
      const data = q.data;

      const docInvoiceNo = document.getElementById('docProformaInvoiceNo');
      const docIncoterms = document.getElementById('docProformaIncoterms');
      const docBuyerName = document.getElementById('docProformaBuyerName');
      const docBuyerAddress = document.getElementById('docProformaBuyerAddress');
      const docPortLoading = document.getElementById('docProformaPortOfLoading');
      const docTableBody = document.getElementById('docProformaTableBody');
      const docTotalLabel = document.getElementById('docProformaTotalLabel');
      const docTotalAmount = document.getElementById('docProformaTotalAmount');

      if (docInvoiceNo) docInvoiceNo.textContent = `No: ${data.invoiceNo}`;
      if (docIncoterms) docIncoterms.textContent = `Incoterms: ${q.incoterm} ${data.port} (ICC Incoterms® 2020)`;
      if (docBuyerName) docBuyerName.textContent = data.buyer;
      if (docBuyerAddress) docBuyerAddress.textContent = data.buyerAddress;
      if (docPortLoading) docPortLoading.textContent = data.portOfLoading;

      if (docTableBody) {
        let rowsHtml = `
          <tr>
            <td>1</td>
            <td>${data.commodity} (${data.specs})</td>
            <td>${data.hs}</td>
            <td>${data.volume.toLocaleString('en-US')} ${data.unit}</td>
            <td>$ ${q.unitPrice.toFixed(2)}</td>
            <td>$ ${q.fobSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
          </tr>
        `;
        if (q.incoterm === 'CIF') {
          rowsHtml += `
            <tr>
              <td>2</td>
              <td>Ocean Freight (20ft FCL) ke ${data.port}</td>
              <td>-</td>
              <td>1 Kargo</td>
              <td>$ ${q.freight.toFixed(2)}</td>
              <td>$ ${q.freight.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Marine Cargo All Risks Insurance (110% Coverage)</td>
              <td>-</td>
              <td>1 Polis</td>
              <td>$ ${q.insurance.toFixed(2)}</td>
              <td>$ ${q.insurance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
          `;
        }
        docTableBody.innerHTML = rowsHtml;
      }

      if (docTotalLabel) docTotalLabel.textContent = `TOTAL ${q.incoterm} ${data.port.toUpperCase()} (USD):`;
      if (docTotalAmount) docTotalAmount.textContent = `$ ${q.totalContract.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      closeModal(rfqModal);
      openDocumentModal('proforma');
      showToast(`Proforma Invoice #${data.invoiceNo} berhasil diterbitkan dari RFQ Studio! 📄`);
    });
  }

  if (btnRfqSendQuotation) {
    btnRfqSendQuotation.addEventListener('click', () => {
      const origText = btnRfqSendQuotation.innerHTML;
      btnRfqSendQuotation.innerHTML = 'Mengirim Kuotasi... ⏳';
      btnRfqSendQuotation.disabled = true;

      setTimeout(() => {
        btnRfqSendQuotation.innerHTML = origText;
        btnRfqSendQuotation.disabled = false;
        if (rfqSuccessAlert) {
          const q = lastCalculatedQuote || {};
          const d = q.data || rfqDataDictionary['RFQ-HAM'];
          if (rfqSuccessDesc) {
            rfqSuccessDesc.textContent = `Draft Sales Contract #${d.contractNo} diterbitkan. Penawaran resmi senilai USD ${q.totalContract ? q.totalContract.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '10,439.50'} (${q.incoterm || 'CIF'}) terkirim ke ${d.buyer}. Escrow siap dibuka.`;
          }
          rfqSuccessAlert.style.display = 'block';
          rfqSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast('Kuotasi penawaran resmi berhasil dikirim ke buyer! 🚀');
      }, 450);
    });
  }

  if (btnRfqAskAi) {
    btnRfqAskAi.addEventListener('click', () => {
      closeModal(rfqModal);
      const d = (lastCalculatedQuote && lastCalculatedQuote.data) || rfqDataDictionary[activeRfqKey] || rfqDataDictionary['RFQ-HAM'];
      const dash = document.getElementById('dashboard');
      if (dash) dash.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        handleAiQuery(d.aiQuery || 'Analisis permintaan RFQ buyer kopi dari Jerman');
      }, 350);
    });
  }

  if (btnDemoSandboxRfq) {
    btnDemoSandboxRfq.addEventListener('click', () => {
      closeModal(demoModal);
      openRfqModal('RFQ-HAM');
    });
  }

  // Solutions Card Routing (Uji Coba RFQ Studio, Dokumen, KYC, Escrow)
  document.querySelectorAll('.solution-card[data-solution]').forEach(card => {
    card.addEventListener('click', function() {
      const sol = this.getAttribute('data-solution');
      if (sol === 'rfq' || sol === 'sol-rfq') {
        switchMockupTab('rfq');
        openRfqModal('RFQ-HAM');
      } else if (sol === 'docs' || sol === 'doc' || sol === 'sol-doc') {
        openDocumentModal('proforma');
      } else if (sol === 'kyc' || sol === 'sol-kyc') {
        openKycModal();
      } else if (sol === 'escrow' || sol === 'sol-escrow') {
        openTransactionModal('TX-001');
      }
    });
  });

  // RFQ Rows and Buttons in Dashboard Mockup
  document.querySelectorAll('.interactive-rfq-row').forEach(row => {
    row.addEventListener('click', function() {
      const rfqId = this.getAttribute('data-rfq-id') || 'RFQ-HAM';
      openRfqModal(rfqId);
    });
  });

  document.querySelectorAll('.btn-open-rfq-demo').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const parentRow = this.closest('.interactive-rfq-row');
      const rfqId = parentRow ? parentRow.getAttribute('data-rfq-id') : 'RFQ-HAM';
      openRfqModal(rfqId || 'RFQ-HAM');
    });
  });

  // ==================== 12. CHAT AGENT INTERACTION ====================
  const chatArea = document.getElementById('chatArea');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const suggestButtons = document.querySelectorAll('.chat-suggest-btn');

  const aiResponses = {
    'Analisis permintaan RFQ buyer kopi dari Jerman':
      '📊 **Analisis RFQ Berhasil!**\nBuyer dari Hamburg, Jerman meminta 1.000 kg Biji Kopi Arabika Gayo Grade 1 CIF Hamburg. Persyaratan: Moisture max 12.5%, Defect < 5%. Rekomendasi: Kemas dalam Jute Bag + GrainPro dan sertakan Certificate of Origin (COO Form A) untuk insentif bea masuk EU.',
    'Jelaskan perbedaan risiko FOB dan CIF dalam Incoterms 2020':
      '📑 **Ringkasan Incoterms 2020 untuk Eksportir:**\n• **FOB (Free on Board):** Tanggung jawab & risiko Anda selesai begitu barang melewati rel kapal di pelabuhan muat. Ongkos kapal & asuransi dibayar buyer.\n• **CIF (Cost, Insurance & Freight):** Anda menanggung ongkos kapal laut dan polis asuransi sampai pelabuhan tujuan buyer.',
    'Berapa rekomendasi harga aman FOB Belawan untuk Kopi Arabika?':
      '💡 **Kalkulasi Rekomendasi Harga:**\nHarga pokok petani: USD 7.50/kg. Biaya sortasi, packaging GrainPro, trucking & PEB pelabuhan: USD 0.35/kg. Rekomendasi harga aman: **USD 9.20 / Kg (FOB Belawan)**, margin laba bersih ~18.5%.',
    'Bagaimana alur penerbitan Certificate of Origin (COO e-SKA)?':
      '🏛️ **Alur Penerbitan COO (e-SKA Kemendag):**\n1. Validasi NIB eksportir dan data Packing List.\n2. Dokumen e-SKA diajukan secara elektronik ke Ditjen Perdagangan Luar Negeri.\n3. Instansi Penerbit SKA (IPSKA) menyetujui dalam 1–2 jam secara digital.'
  };

  function appendUserMessage(text) {
    if (!chatArea) return;
    const userRow = document.createElement('div');
    userRow.className = 'chat-bubble-row';
    userRow.innerHTML = `<div class="chat-bubble user-bubble">${text}</div>`;
    chatArea.appendChild(userRow);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function appendAgentMessage(text) {
    if (!chatArea) return;
    const agentRow = document.createElement('div');
    agentRow.className = 'chat-bubble-row';
    agentRow.innerHTML = `
      <div class="agent-avatar-icon">
        <img src="assets/icons/icon-1.webp" alt="AI Agent Icon">
      </div>
      <div class="chat-bubble agent-bubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
    `;
    chatArea.appendChild(agentRow);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function handleAiQuery(queryText) {
    appendUserMessage(queryText);
    setTimeout(() => {
      const response = aiResponses[queryText] || `Terima kasih! Terkait pertanyaan "${queryText}", sistem NusaBridge telah memverifikasi regulasi ekspor terkini. Anda dapat menerbitkan dokumen resmi atau mengkalkulasi tarif Incoterms 2020 langsung pada platform ini.`;
      appendAgentMessage(response);
    }, 450);
  }

  suggestButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const query = this.getAttribute('data-query');
      if (query) handleAiQuery(query);
    });
  });

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';
      handleAiQuery(text);
    });
  }

  // ==================== 13. AUTH & COMMON BUTTONS ====================
  const authModal = document.getElementById('authModal');
  const demoModal = document.getElementById('demoModal');
  const infoModal = document.getElementById('infoModal');

  const btnMasuk = document.getElementById('btnMasuk');
  const btnMasukMobile = document.getElementById('btnMasukMobile');
  const btnDaftar = document.getElementById('btnDaftar');
  const btnDaftarMobile = document.getElementById('btnDaftarMobile');
  const btnHeroExport = document.getElementById('btnHeroExport');
  const btnHeroDemo = document.getElementById('btnHeroDemo');
  const btnHeroCalc = document.getElementById('btnHeroCalc');
  const btnCtaDaftar = document.getElementById('btnCtaDaftar');
  const btnCtaContact = document.getElementById('btnCtaContact');

  [btnMasuk, btnMasukMobile].forEach(btn => {
    if (btn) btn.addEventListener('click', () => openModal(authModal));
  });

  [btnDaftar, btnDaftarMobile, btnHeroExport, btnCtaDaftar].forEach(btn => {
    if (btn) btn.addEventListener('click', () => openModal(authModal));
  });

  if (btnHeroDemo) btnHeroDemo.addEventListener('click', () => openModal(demoModal));
  if (btnHeroCalc) {
    btnHeroCalc.addEventListener('click', () => {
      const calcSec = document.getElementById('kalkulator');
      if (calcSec) calcSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  const closeAuthModal = document.getElementById('closeAuthModal');
  const closeDemoModal = document.getElementById('closeDemoModal');
  const closeInfoModal = document.getElementById('closeInfoModal');
  const btnOkInfo = document.getElementById('btnOkInfo');

  if (closeAuthModal) closeAuthModal.addEventListener('click', () => closeModal(authModal));
  if (closeDemoModal) closeDemoModal.addEventListener('click', () => closeModal(demoModal));
  if (closeInfoModal) closeInfoModal.addEventListener('click', () => closeModal(infoModal));
  if (btnOkInfo) btnOkInfo.addEventListener('click', () => closeModal(infoModal));

  [authModal, demoModal, infoModal, productDetailModal, documentModal, kycModal, transactionModal, rfqModal].forEach(m => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) closeModal(m);
      });
    }
  });

  // Auth Form
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Selamat datang! Login prototype berhasil. Mengarahkan Anda ke Dashboard...');
      closeModal(authModal);
      const dash = document.getElementById('dashboard');
      if (dash) dash.scrollIntoView({ behavior: 'smooth' });
    });
  }

});