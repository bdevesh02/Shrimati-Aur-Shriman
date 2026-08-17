(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    setupThemeToggle();
    setupScrollReveals();
    setupCountdowns();
    setupGallery();
  });

  function setupThemeToggle() {
    var button = document.querySelector(".theme-toggle");
    if (!button) return;

    var icon = button.querySelector(".theme-toggle-icon");
    var label = button.querySelector(".theme-toggle-label");

    function updateButton() {
      var dark = document.documentElement.dataset.theme === "dark";
      icon.textContent = dark ? "☀" : "☾";
      label.textContent = dark ? "Use light mode" : "Use dark mode";
      button.setAttribute("aria-label", label.textContent);
      button.setAttribute("title", label.textContent);
    }

    button.addEventListener("click", function () {
      var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("scrapbook-theme", next);
      } catch (error) {
        // The selected theme still works for this visit when storage is unavailable.
      }
      updateButton();
    });

    updateButton();
  }

  function setupScrollReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal-on-scroll"));
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

    items.forEach(function (item) { observer.observe(item); });
  }

  function setupCountdowns() {
    var countdowns = document.querySelectorAll("[data-countdown]");
    countdowns.forEach(function (countdown) {
      var rawDate = countdown.dataset.date;
      var repeatsYearly = countdown.dataset.yearly === "true";
      var parts = rawDate.split("-").map(Number);
      var target = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);

      function nextTarget(now) {
        if (!repeatsYearly) return target;
        var yearlyTarget = new Date(now.getFullYear(), parts[1] - 1, parts[2], 0, 0, 0);
        if (yearlyTarget.getTime() < now.getTime()) yearlyTarget.setFullYear(now.getFullYear() + 1);
        return yearlyTarget;
      }

      function render() {
        var now = new Date();
        var activeTarget = nextTarget(now);
        var distance = Math.max(0, activeTarget.getTime() - now.getTime());
        var days = Math.floor(distance / 86400000);
        var hours = Math.floor((distance % 86400000) / 3600000);
        var minutes = Math.floor((distance % 3600000) / 60000);
        var seconds = Math.floor((distance % 60000) / 1000);

        countdown.querySelector("[data-days]").textContent = days;
        countdown.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
        countdown.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
        countdown.querySelector("[data-seconds]").textContent = String(seconds).padStart(2, "0");
      }

      render();
      window.setInterval(render, 1000);
    });
  }

  function setupGallery() {
    var gallery = document.querySelector("[data-gallery]");
    var lightbox = document.querySelector("[data-lightbox]");
    if (!gallery || !lightbox) return;

    var cards = Array.prototype.slice.call(gallery.querySelectorAll(".gallery-card"));
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var image = lightbox.querySelector("[data-lightbox-image]");
    var caption = lightbox.querySelector("[data-lightbox-caption]");
    var date = lightbox.querySelector("[data-lightbox-date]");
    var closeButton = lightbox.querySelector("[data-lightbox-close]");
    var zoomButton = lightbox.querySelector("[data-lightbox-zoom]");
    var previousButton = lightbox.querySelector("[data-lightbox-prev]");
    var nextButton = lightbox.querySelector("[data-lightbox-next]");
    var activeIndex = 0;
    var lastFocused = null;
    var touchStartX = 0;

    function visibleOpeners() {
      return cards.filter(function (card) { return !card.hidden; }).map(function (card) {
        return card.querySelector(".gallery-open");
      });
    }

    filters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        var value = filter.dataset.filter;
        filters.forEach(function (item) {
          var active = item === filter;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        cards.forEach(function (card) {
          card.hidden = value !== "all" && card.dataset.album !== value;
        });
      });
    });

    function show(index) {
      var openers = visibleOpeners();
      if (!openers.length) return;
      activeIndex = (index + openers.length) % openers.length;
      var opener = openers[activeIndex];
      image.src = opener.dataset.full;
      image.alt = opener.dataset.alt;
      caption.textContent = opener.dataset.caption;
      date.textContent = opener.dataset.date;
      lightbox.classList.remove("is-zoomed");
      zoomButton.textContent = "+";
      zoomButton.setAttribute("aria-label", "Zoom photograph");
    }

    function open(opener) {
      var openers = visibleOpeners();
      lastFocused = opener;
      show(openers.indexOf(opener));
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      closeButton.focus();
    }

    function close() {
      lightbox.hidden = true;
      image.src = image.dataset.placeholder;
      document.body.classList.remove("lightbox-open");
      lightbox.classList.remove("is-zoomed");
      if (lastFocused) lastFocused.focus();
    }

    gallery.addEventListener("click", function (event) {
      var opener = event.target.closest(".gallery-open");
      if (opener) open(opener);
    });

    closeButton.addEventListener("click", close);
    previousButton.addEventListener("click", function () { show(activeIndex - 1); });
    nextButton.addEventListener("click", function () { show(activeIndex + 1); });
    zoomButton.addEventListener("click", function () {
      var zoomed = lightbox.classList.toggle("is-zoomed");
      zoomButton.textContent = zoomed ? "−" : "+";
      zoomButton.setAttribute("aria-label", zoomed ? "Reset photograph zoom" : "Zoom photograph");
    });
    image.addEventListener("click", function () { if (lightbox.classList.contains("is-zoomed")) zoomButton.click(); });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) close();
    });

    lightbox.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (event) {
      if (lightbox.classList.contains("is-zoomed")) return;
      var distance = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(distance) > 50) show(activeIndex + (distance < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(activeIndex - 1);
      if (event.key === "ArrowRight") show(activeIndex + 1);
      if (event.key === "Tab") keepFocusInside(event, lightbox);
    });
  }

  function keepFocusInside(event, container) {
    var focusable = Array.prototype.slice.call(container.querySelectorAll("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
})();
