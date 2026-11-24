
// MOBİL MENÜ
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// MENÜ FİLTRELEME VE ARAMA
const filterButtons = document.querySelectorAll(".filter-btn");
const foodCards = document.querySelectorAll(".food-card");
const menuSearch = document.getElementById("menuSearch");
const noResults = document.getElementById("noResults");

let selectedCategory = "all";

function filterMenu() {
    const searchText = menuSearch.value
        .toLocaleLowerCase("tr-TR")
        .trim();

    let visibleCount = 0;

    foodCards.forEach(card => {
        const category = card.dataset.category;
        const name = card.dataset.name;

        const categoryMatches =
            selectedCategory === "all" || category === selectedCategory;

        const searchMatches = name.includes(searchText);
        const shouldShow = categoryMatches && searchMatches;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount++;
        }
    });

    noResults.hidden = visibleCount !== 0;
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(item => item.classList.remove("active"));

        button.classList.add("active");
        selectedCategory = button.dataset.filter;

        filterMenu();
    });
});

menuSearch.addEventListener("input", filterMenu);

// REZERVASYON TARİHİ: GEÇMİŞ TARİHLERİ ENGELLE
const dateInput = document.getElementById("tarih");

function getLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

dateInput.min = getLocalDateString();

// REZERVASYON FORMU
const reservationForm = document.getElementById("rezervasyonForm");
const formMessage = document.getElementById("formMessage");

reservationForm.addEventListener("submit", event => {
    event.preventDefault();

    formMessage.textContent = "";
    formMessage.className = "form-message";

    const name = document.getElementById("ad").value.trim();
    const phone = document.getElementById("telefon").value.trim();
    const people = document.getElementById("kisi").value;
    const date = dateInput.value;
    const time = document.getElementById("saat").value;
    const note = document.getElementById("not").value.trim();

    if (name.length < 2) {
        showFormMessage("Lütfen adınızı ve soyadınızı girin.", "error");
        return;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        showFormMessage("Lütfen geçerli bir telefon numarası girin.", "error");
        return;
    }

    if (!people || !date || !time) {
        showFormMessage("Lütfen tüm zorunlu alanları doldurun.", "error");
        return;
    }

    if (date < getLocalDateString()) {
        showFormMessage("Geçmiş bir tarih seçemezsiniz.", "error");
        return;
    }

    const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString("tr-TR");

    showFormMessage(
        `Talep özeti hazırlandı. ${name}, ${formattedDate} tarihinde saat ${time} için ${people} kişilik talebiniz ekranda oluşturuldu. Bu bilgi restorana gönderilmedi.`,
        "success"
    );

    console.log("Demo rezervasyon talebi:", {
        name,
        phone,
        people,
        date,
        time,
        note
    });

    reservationForm.reset();
    dateInput.min = getLocalDateString();
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

// SAYFA YILI
document.getElementById("year").textContent = new Date().getFullYear();

// YUKARI ÇIK BUTONU
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// SCROLL ANİMASYONLARI
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => observer.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("show"));
}

// AKTİF NAVİGASYON
const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navigationLinks.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            }
        });
    }, {
        rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach(section => sectionObserver.observe(section));
}
