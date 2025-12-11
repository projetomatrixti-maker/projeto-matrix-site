// ============================================
// COMPONENTES (HEADER & FOOTER)
// ============================================

async function loadComponent(id, file, callback) {
  const container = document.getElementById(id)

  if (!container) return

  try {
    const response = await fetch(file)
    const html = await response.text()
    container.innerHTML = html

    if (callback) callback()
  } catch (err) {
    console.error("Erro ao carregar componente:", file, err)
  }
}

// ============================================
// FUNÇÃO PARA ATIVAR MENU MOBILE
// ============================================

function initMenuMobile() {
  const menuToggle = document.querySelector(".menu-toggle")
  const navMenu = document.querySelector(".nav-menu")

  if (!menuToggle || !navMenu) return

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })
}

// ============================================
// CARREGAR HEADER E FOOTER
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "components/header.html", () => {
    initMenuMobile()
    initHeaderScroll()
    marcarLinkAtivo()  // ⭐ ADICIONE ISSO
  })

  loadComponent("footer", "components/footer.html")
})

function marcarLinkAtivo() {
  const links = document.querySelectorAll(".nav-menu a")
  const paginaAtual = window.location.pathname.split("/").pop()

  links.forEach(link => {
    const linkHref = link.getAttribute("href")

    if (linkHref === paginaAtual) {
      link.classList.add("active")
    } else {
      link.classList.remove("active")
    }
  })
}

// ============================================
// SLIDER DA HOME
// ============================================

const slides = document.querySelectorAll(".slide")
const dots = document.querySelectorAll(".slider-dot")
const prevBtn = document.getElementById("prev")
const nextBtn = document.getElementById("next")

let currentSlide = 0
let slideInterval

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index)
    dots[i].classList.toggle("active", i === index)
  })
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length
  showSlide(currentSlide)
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length
  showSlide(currentSlide)
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 6000)
}

function stopAutoSlide() {
  clearInterval(slideInterval)
}

if (nextBtn && prevBtn && slides.length > 0) {
  nextBtn.addEventListener("click", () => {
    nextSlide()
    stopAutoSlide()
    startAutoSlide()
  })

  prevBtn.addEventListener("click", () => {
    prevSlide()
    stopAutoSlide()
    startAutoSlide()
  })

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      currentSlide = i
      showSlide(i)
      stopAutoSlide()
      startAutoSlide()
    })
  })

  const hero = document.querySelector(".hero-section")
  if (hero) {
    hero.addEventListener("mouseenter", stopAutoSlide)
    hero.addEventListener("mouseleave", startAutoSlide)
  }

  showSlide(currentSlide)
  startAutoSlide()
}


// ============================================
// CONTADOR ANIMADO (Estatísticas)
// ============================================

const statNumbers = document.querySelectorAll(".stat-number")

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-target"))
  const duration = 2000
  const increment = target / (duration / 16)
  let current = 0

  const updateCounter = () => {
    current += increment
    if (current < target) {
      element.textContent = Math.floor(current)
      requestAnimationFrame(updateCounter)
    } else {
      element.textContent = target + "+"
    }
  }

  updateCounter()
}

if (statNumbers.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
          entry.target.classList.add("animated")
          animateCounter(entry.target)
        }
      })
    },
    { threshold: 0.5 }
  )

  statNumbers.forEach((stat) => observer.observe(stat))
}


// ============================================
// SCROLL SUAVE
// ============================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href")
    if (href !== "#" && href !== "") {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  })
})


// ============================================
// DONATION MODAL
// ============================================

const donationModal = document.getElementById("donationModal")

function showDonationModal() {
  if (donationModal) {
    donationModal.classList.add("open")
    document.body.style.overflow = "hidden"
  }
}

function closeDonationModal() {
  if (donationModal) {
    donationModal.classList.remove("open")
    document.body.style.overflow = "auto"
  }
}

if (donationModal) {
  donationModal.addEventListener("click", (e) => {
    if (e.target === donationModal) closeDonationModal()
  })
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && donationModal?.classList.contains("open")) {
    closeDonationModal()
  }
})


// ============================================
// SELEÇÃO DE VALOR DE DOAÇÃO
// ============================================

const amountButtons = document.querySelectorAll(".amount-btn")

function selectAmount(amount) {
  amountButtons.forEach((btn) => btn.classList.remove("selected"))
  event.target.classList.add("selected")

  if (amount === 0) {
    const customAmount = prompt("Digite o valor que deseja doar (R$):")
    if (customAmount && !isNaN(customAmount)) {
      console.log(`Valor personalizado: R$ ${customAmount}`)
    }
  } else {
    console.log(`Valor selecionado: R$ ${amount}`)
  }
}


// ============================================
// COPIA DE CHAVE PIX
// ============================================

function copyPix() {
  const pixKey = "60.999.222/0001-91"

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(pixKey)
      .then(() => showCopyFeedback("Chave PIX copiada!"))
      .catch(() => fallbackCopyPix(pixKey))
  } else {
    fallbackCopyPix(pixKey)
  }
}

function fallbackCopyPix(text) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.left = "-999999px"
  document.body.appendChild(textArea)
  textArea.select()

  try {
    document.execCommand("copy")
    showCopyFeedback("Chave PIX copiada!")
  } catch {
    showCopyFeedback("Erro ao copiar. Chave: " + text)
  }

  document.body.removeChild(textArea)
}

function showCopyFeedback(message) {
  const feedback = document.createElement("div")
  feedback.textContent = message
  feedback.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    background-color: #25D366;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 9999;
  `
  document.body.appendChild(feedback)

  setTimeout(() => {
    feedback.style.opacity = "0"
    feedback.style.transition = "opacity 0.3s"
    setTimeout(() => feedback.remove(), 300)
  }, 3000)
}


// ============================================
// COPIA DE DADOS BANCÁRIOS
// ============================================

function copyDadosBancarios() {
  const dadosBancarios = "Agência: 0001, Conta: 6045849-7, Banco: 403 - Cora SCFI, Nome da Empresa: Associação Projeto Matrix, CNPJ: 60.999.222/0001-91"
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(dadosBancarios)
      .then(() => showCopyFeedback("Dados bancários copiados!"))
      .catch(() => fallbackCopyPix(dadosBancarios))
  } else {
    fallbackCopyPix(dadosBancarios)
  }
}

function fallbackCopyDadosBancarios(text) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.left = "-999999px"
  document.body.appendChild(textArea)
  textArea.select()

  try {
    document.execCommand("copy")
    showCopyFeedback("Dados bancários copiados!")
  } catch {
    showCopyFeedback("Erro ao copiar. Dados bancários: " + text)
  }

  document.body.removeChild(textArea)
}

function showCopyFeedback(message) {
  const feedback = document.createElement("div")
  feedback.textContent = message
  feedback.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    background-color: #25D366;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 9999;
  `
  document.body.appendChild(feedback)

  setTimeout(() => {
    feedback.style.opacity = "0"
    feedback.style.transition = "opacity 0.3s"
    setTimeout(() => feedback.remove(), 300)
  }, 3000)
}

// ============================================
// CARROSSEL DE DEPOIMENTOS
// ============================================
// Carrossel de depoimentos (Vozes que Nos Inspiram)

document.addEventListener('DOMContentLoaded', () => {
  const inspSlides = document.querySelectorAll(".inspiration-slide");
  const inspDots = document.querySelectorAll(".inspiration-dot");
  const inspPrev = document.querySelector(".inspiration-arrow.left");
  const inspNext = document.querySelector(".inspiration-arrow.right");

  let inspCurrent = 0;
  let inspIntervalId = null;
  const INSP_INTERVAL_TIME = 7000; // 7 segundos

  function updateInspirationCarousel(index) {
    inspSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    inspDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function nextInspiration() {
    inspCurrent = (inspCurrent + 1) % inspSlides.length;
    updateInspirationCarousel(inspCurrent);
  }

  function startInspirationAutoplay() {
    if (inspIntervalId) return;
    inspIntervalId = setInterval(nextInspiration, INSP_INTERVAL_TIME);
  }

  function stopInspirationAutoplay() {
    if (!inspIntervalId) return;
    clearInterval(inspIntervalId);
    inspIntervalId = null;
  }

  if (inspSlides.length > 0 && inspPrev && inspNext && inspDots.length > 0) {
    // Botão voltar
    inspPrev.addEventListener("click", () => {
      stopInspirationAutoplay();
      inspCurrent = (inspCurrent - 1 + inspSlides.length) % inspSlides.length;
      updateInspirationCarousel(inspCurrent);
      startInspirationAutoplay();
    });

    // Botão avançar
    inspNext.addEventListener("click", () => {
      stopInspirationAutoplay();
      nextInspiration();
      startInspirationAutoplay();
    });

    // Dots clicáveis
    inspDots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        stopInspirationAutoplay();
        inspCurrent = i;
        updateInspirationCarousel(inspCurrent);
        startInspirationAutoplay();
      });
    });

    // Pausa ao passar mouse
    const inspCarousel = document.querySelector(".inspiration-carousel");
    if (inspCarousel) {
      inspCarousel.addEventListener("mouseenter", stopInspirationAutoplay);
      inspCarousel.addEventListener("mouseleave", startInspirationAutoplay);
    }

    // Inicializa
    updateInspirationCarousel(inspCurrent);
    startInspirationAutoplay();
  }
});

// ============================================
// ANIMAÇÕES AO SCROLL
// ============================================

function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".testimonial-card, .team-card, .value-card, .work-card, .deliverable-card, .future-card"
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }, index * 100)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  )

  elements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity .5s, transform .5s"
    observer.observe(el)
  })
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", animateOnScroll)
  : animateOnScroll()


// ============================================
// HEADER SCROLL EFFECT
// ============================================

function initHeaderScroll() {
  const header = document.querySelector(".header")
  if (!header) return

  window.addEventListener("scroll", () => {
    const scroll = window.pageYOffset
    header.style.boxShadow =
      scroll <= 0
        ? "0 2px 10px rgba(0,0,0,0.1)"
        : "0 4px 20px rgba(0,0,0,0.15)"
  })
}

//MODAL FRENTES DE ATUAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  const features = document.querySelectorAll(".project-features .feature");
  const paragraphs = document.querySelectorAll(".project-features p");

  // Esconde todos os parágrafos
  paragraphs.forEach(p => p.style.display = "none");

  // Modal
  const modal = document.getElementById("modal-feature");
  const modalTitle = document.getElementById("modal-title");
  const modalText = document.getElementById("modal-text");
  const closeBtn = document.querySelector(".close-modal");

  features.forEach((feature, index) => {
    feature.style.cursor = "pointer";

    feature.addEventListener("click", () => {
      // PEGAR O TÍTULO DO SPAN
      const titulo = feature.querySelector("span:nth-child(2)")?.innerText || "";

      // PEGAR O TEXTO DO PARÁGRAFO
      const texto = paragraphs[index].innerHTML;

      modalTitle.innerText = titulo;
      modalText.innerHTML = texto;

      modal.style.display = "flex";
    });
  });

  // Fechar modal
  closeBtn?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});

//MODAL PROXIMOS PASSOS
document.addEventListener("DOMContentLoaded", () => {
  const titles = document.querySelectorAll(".open-info");
  const modal = document.getElementById("modal-overlay");
  const modalContent = document.getElementById("modal-content");
  const closeBtn = document.getElementById("modal-close");

  titles.forEach((title) => {
    title.addEventListener("click", () => {
      const paragraph = title.nextElementSibling;

      if (!paragraph || !paragraph.classList.contains("hidden-info")) return;

      modalContent.innerHTML = paragraph.innerHTML;
      modal.style.display = "flex";
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});

// --- MODAL TIME ---

const modal = document.getElementById("modalTeam");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

// Adiciona botões "Ver mais" automaticamente
document.querySelectorAll(".team-card").forEach(card => {
  const bio = card.querySelector(".team-bio");

  if (bio) {
    // cria o botão
    const btn = document.createElement("button");
    btn.classList.add("more-info-btn");
    btn.textContent = "Ver mais";

    // insere ele no card
    card.appendChild(btn);

    // clique abre modal
    btn.addEventListener("click", () => {
      modalContent.innerHTML = `
        <h3>${card.querySelector("h3").textContent}</h3>
        <p style="margin-top:10px;">${bio.textContent}</p>
      `;
      modal.style.display = "flex";
    });
  }
});

// fechar modal
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// fechar clicando fora
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});



// ============================================
// LOG
// ============================================

console.log("%c🎓 MATRIX - carregado com sucesso!", "color: #3D4899; font-size: 16px; font-weight: bold;")
console.log("%cEnsinar as pessoas a aprender", "color: #E94F21; font-size: 14px;")
