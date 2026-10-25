
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    nav.id = "main-navigation";
    toggle.setAttribute("aria-controls", nav.id);
    const setMenu = open => {
      nav.classList.toggle("show", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    };
    setMenu(false);
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("show")));
    nav.addEventListener("click", e => {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && nav.classList.contains("show")) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!motionPreference.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".section-heading, .grid > *, .split > *, .stat, .gallery-item, .cta-inner").forEach(element => {
      element.classList.add("reveal");
      if (element.parentElement.matches(".grid, .stats")) {
        const index = Array.from(element.parentElement.children).indexOf(element);
        element.style.setProperty("--reveal-delay", `${(index % 4) * 80}ms`);
      }
      observer.observe(element);
    });
    motionPreference.addEventListener("change", e => {
      if (e.matches) observer.disconnect();
    });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll(".nav-links a[data-page]").forEach(link => {
    if (link.dataset.page === page) link.classList.add("active");
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const form = document.querySelector("#contactForm");
  const notice = document.querySelector("#formNotice");
  if (form && notice) {
    let submitting = false;
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (submitting || !form.reportValidity()) return;
      submitting = true;
      const button = form.querySelector('button[type="submit"]');
      const originalLabel = button.textContent;
      button.disabled = true;
      button.textContent = "Sending…";
      form.setAttribute("aria-busy", "true");
      notice.style.display = "block";
      notice.classList.remove("notice-error");
      notice.textContent = "Sending your enquiry…";
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) throw new Error("Submission failed");
        notice.textContent = "Thank you! Your enquiry has been sent. Our team will get in touch soon.";
        form.reset();
      } catch (error) {
        notice.classList.add("notice-error");
        notice.textContent = "We couldn’t confirm your enquiry was sent. Your details are still here. Please try again or call +91 73002 46233.";
      } finally {
        submitting = false;
        button.disabled = false;
        button.textContent = originalLabel;
        form.removeAttribute("aria-busy");
      }
    });
  }
});
