(() => {
  "use strict";

  /* ----- Header scroll state ----- */
  const header = document.getElementById("header");
  const onScrollHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ----- Mobile nav ----- */
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  const closeNav = () => {
    nav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  navToggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(!!open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  /* ----- Active nav link on scroll ----- */
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav__list a")];

  const setActiveNav = () => {
    const y = window.scrollY + 120;
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.offsetTop <= y) current = section.id;
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("is-active", href === current);
    });
  };
  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  /* ----- Before / After sliders ----- */
  const syncBeforeImageWidth = (slider) => {
    const beforeImg = slider.querySelector(".ba-slider__before img, .ba-split__before img");
    if (beforeImg) {
      beforeImg.style.setProperty("--ba-full-width", `${slider.offsetWidth}px`);
      beforeImg.style.width = `${slider.offsetWidth}px`;
    }
  };

  const setSliderPosition = (slider, percent) => {
    const clamped = Math.min(100, Math.max(0, percent));
    const before = slider.querySelector(".ba-slider__before, .ba-split__before");
    const handle = slider.querySelector(".ba-slider__handle");
    if (before) before.style.width = `${clamped}%`;
    if (handle) {
      handle.style.left = `${clamped}%`;
      handle.setAttribute("aria-valuenow", String(Math.round(clamped)));
    }
  };

  const initBaSlider = (slider) => {
    syncBeforeImageWidth(slider);
    setSliderPosition(slider, 50);

    let dragging = false;

    const updateFromClientX = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setSliderPosition(slider, percent);
    };

    const start = (clientX) => {
      dragging = true;
      slider.classList.add("is-dragging");
      updateFromClientX(clientX);
    };

    const move = (clientX) => {
      if (!dragging) return;
      updateFromClientX(clientX);
    };

    const end = () => {
      dragging = false;
      slider.classList.remove("is-dragging");
    };

    slider.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      slider.setPointerCapture?.(e.pointerId);
      start(e.clientX);
    });

    slider.addEventListener("pointermove", (e) => move(e.clientX));
    slider.addEventListener("pointerup", end);
    slider.addEventListener("pointercancel", end);
    slider.addEventListener("lostpointercapture", end);

    const handle = slider.querySelector(".ba-slider__handle");
    handle?.addEventListener("keydown", (e) => {
      const current = Number(handle.getAttribute("aria-valuenow") || 50);
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSliderPosition(slider, current - 5);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSliderPosition(slider, current + 5);
      } else if (e.key === "Home") {
        e.preventDefault();
        setSliderPosition(slider, 0);
      } else if (e.key === "End") {
        e.preventDefault();
        setSliderPosition(slider, 100);
      }
    });
  };

  const baSliders = [...document.querySelectorAll("[data-ba-slider]")];
  baSliders.forEach(initBaSlider);

  window.addEventListener(
    "resize",
    () => {
      baSliders.forEach((slider) => {
        syncBeforeImageWidth(slider);
        const handle = slider.querySelector(".ba-slider__handle");
        const current = Number(handle?.getAttribute("aria-valuenow") || 50);
        setSliderPosition(slider, current);
      });
    },
    { passive: true }
  );

  /* ----- Testimonials carousel ----- */
  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const track = carousel.querySelector("[data-carousel-track]");
    const slides = [...(track?.children || [])];
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    let index = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Go to review ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap?.appendChild(dot);
    });

    const dots = [...(dotsWrap?.children || [])];

    const goTo = (i) => {
      index = (i + slides.length) % slides.length;
      if (window.matchMedia("(max-width: 768px)").matches) {
        track.style.transform = `translateX(-${index * 100}%)`;
      } else {
        track.style.transform = "";
      }
      dots.forEach((dot, di) => dot.classList.toggle("is-active", di === index));
    };

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    let autoTimer;
    const startAuto = () => {
      stopAuto();
      autoTimer = setInterval(() => {
        if (window.matchMedia("(max-width: 768px)").matches) goTo(index + 1);
      }, 5500);
    };
    const stopAuto = () => clearInterval(autoTimer);

    carousel.addEventListener("pointerenter", stopAuto);
    carousel.addEventListener("pointerleave", startAuto);
    window.addEventListener("resize", () => goTo(index), { passive: true });
    startAuto();
  }

  /* ----- Contact form ----- */
  const form = document.getElementById("consultForm");
  const status = document.getElementById("formStatus");

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    status?.classList.remove("is-success", "is-error");

    if (!form.checkValidity()) {
      form.reportValidity();
      if (status) {
        status.textContent = "Please fill in all required fields.";
        status.classList.add("is-error");
      }
      return;
    }

    if (status) {
      status.textContent = "Thank you! Your consultation request was received. We'll be in touch within one business day.";
      status.classList.add("is-success");
    }
    form.reset();
  });

  /* ----- Footer year ----- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----- Scroll reveal ----- */
  const revealTargets = document.querySelectorAll(
    ".section__header, .service-card, .why-card, .ba-card, .testimonial, .feature-day__content, .feature-day__visual, .contact__info, .contact__form, .cta-banner__inner"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
})();
