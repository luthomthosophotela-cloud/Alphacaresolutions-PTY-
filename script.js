/* =========================================================
   AlphaCare Solutions — Site behaviour
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile hamburger menu ---------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      hamburgerBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close mobile menu when a link is tapped
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------- Service card "Learn more" accordions ---------- */
  document.querySelectorAll('.service-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(targetId);
      if (!panel) return;

      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      btn.innerHTML = expanded
        ? 'Learn more <span class="chev" aria-hidden="true">›</span>'
        : 'Show less <span class="chev" aria-hidden="true">›</span>';
    });
  });

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleVisibility = () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    };
    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Contact form handling (Formspree-ready) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      const action = form.getAttribute('action') || '';

      // If the Formspree endpoint hasn't been configured yet, fall back to
      // a mailto draft so the enquiry is never silently lost.
      if (action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const service = form.service.value;
        const message = form.message.value.trim();

        const subject = encodeURIComponent(`Website enquiry: ${service || 'General'}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nMessage:\n${message}`
        );

        if (status) {
          status.textContent = 'Opening your email client to send this enquiry (set up Formspree to submit directly from the page instead).';
        }
        window.location.href = `mailto:info@alphacaresolutions.co.za?subject=${subject}&body=${body}`;
        return;
      }

      // Formspree endpoint is configured — submit via fetch for a smooth,
      // no-reload confirmation message.
      e.preventDefault();
      if (status) status.textContent = 'Sending your enquiry…';

      try {
        const response = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          if (status) status.textContent = 'Thank you — your enquiry has been sent. We will be in touch shortly.';
          form.reset();
        } else {
          if (status) status.textContent = 'Something went wrong sending your enquiry. Please email info@alphacaresolutions.co.za directly.';
        }
      } catch (err) {
        if (status) status.textContent = 'Something went wrong sending your enquiry. Please email info@alphacaresolutions.co.za directly.';
      }
    });
  }

});
