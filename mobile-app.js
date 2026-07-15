(() => {
  "use strict";

  const scrollEl = document.getElementById("phoneScroll");
  const screens = [...document.querySelectorAll("[data-screen]")];
  const navItems = [...document.querySelectorAll(".bottom-nav__item")];

  const screenNavMap = {
    home: "home",
    book: "book",
    appointments: "book",
    journey: "journey",
    gallery: "home",
    messages: "messages",
    profile: "profile",
  };

  const setActiveNav = () => {
    if (!scrollEl || !screens.length) return;
    const scrollTop = scrollEl.scrollTop;
    const offset = 80;
    let current = screens[0].dataset.screen;

    for (const screen of screens) {
      const top = screen.offsetTop - scrollEl.offsetTop;
      if (scrollTop >= top - offset) current = screen.dataset.screen;
    }

    const navKey = screenNavMap[current] || current;
    navItems.forEach((item) => {
      item.classList.toggle("bottom-nav__item--active", item.dataset.nav === navKey);
    });
  };

  scrollEl?.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  /* Tabs */
  document.querySelectorAll(".tabs").forEach((group) => {
    const tabs = group.querySelectorAll(".tab");
    const section = group.closest(".screen");
    const panels = section?.querySelectorAll(".tab-panel") || [];

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        tabs.forEach((t) => t.classList.toggle("tab--active", t === tab));
        panels.forEach((panel) => {
          panel.classList.toggle("tab-panel--hidden", panel.dataset.panel !== target);
        });
      });
    });
  });

  /* Treatment cards */
  document.querySelectorAll(".treatment-grid").forEach((grid) => {
    grid.querySelectorAll(".treatment-card").forEach((card) => {
      card.addEventListener("click", () => {
        grid.querySelectorAll(".treatment-card").forEach((c) => c.classList.remove("treatment-card--active"));
        card.classList.add("treatment-card--active");
      });
    });
  });

  /* Dentist cards */
  document.querySelectorAll(".dentist-list").forEach((list) => {
    list.querySelectorAll(".dentist-card").forEach((card) => {
      card.addEventListener("click", () => {
        list.querySelectorAll(".dentist-card").forEach((c) => c.classList.remove("dentist-card--active"));
        card.classList.add("dentist-card--active");
      });
    });
  });

  /* Calendar */
  document.querySelectorAll(".calendar__grid").forEach((grid) => {
    grid.querySelectorAll(".cal-day:not(.cal-day--empty)").forEach((day) => {
      day.addEventListener("click", () => {
        grid.querySelectorAll(".cal-day").forEach((d) => d.classList.remove("cal-day--selected"));
        day.classList.add("cal-day--selected");
      });
    });
  });

  /* Time slots */
  document.querySelectorAll(".time-slots").forEach((group) => {
    group.querySelectorAll(".time-slot").forEach((slot) => {
      slot.addEventListener("click", () => {
        group.querySelectorAll(".time-slot").forEach((s) => s.classList.remove("time-slot--active"));
        slot.classList.add("time-slot--active");
      });
    });
  });

  /* Gallery filters */
  document.querySelectorAll(".gallery-filters").forEach((group) => {
    group.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        group.querySelectorAll(".chip").forEach((c) => c.classList.remove("chip--active"));
        chip.classList.add("chip--active");
      });
    });
  });

  /* Quick replies */
  const chatInput = document.getElementById("chatInput");
  document.querySelectorAll(".quick-reply").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chatInput) {
        chatInput.value = chip.textContent.trim();
        chatInput.focus();
      }
    });
  });

  /* Toast */
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("toast--visible");
    setTimeout(() => toast.classList.remove("toast--visible"), 2800);
  };

  document.querySelector(".confirm-btn")?.addEventListener("click", () => {
    showToast("Booking confirmed! See you soon ✨");
  });

  document.querySelector(".logout-btn")?.addEventListener("click", () => {
    showToast("Signed out successfully");
  });

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#screen-"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (target && scrollEl) {
        e.preventDefault();
        const top = target.offsetTop - scrollEl.offsetTop;
        scrollEl.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
})();
