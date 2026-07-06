(function () {
  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function setText(selector, value, root = document) {
    const el = q(selector, root);
    if (el && typeof value === 'string') el.textContent = value;
  }

  function setHref(selector, href, root = document) {
    const el = q(selector, root);
    if (el && href) el.setAttribute('href', href);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function withBreaks(value) {
    return escapeHtml(value).replace(/\n/g, '<br>');
  }

  function applyContent(data) {
    if (!data) return;

    if (data.seo) {
      if (data.seo.title) document.title = data.seo.title;
      const desc = q('meta[name="description"]');
      if (desc && data.seo.description) desc.setAttribute('content', data.seo.description);
    }

    setText('.nav-cta', data.navigation?.cta);

    setText('.hero .eyebrow', data.hero?.eyebrow);
    setText('.hero h1', data.hero?.title);
    setText('.hero .lead', data.hero?.subtitle);
    setText('.hero-actions .btn-gold', data.hero?.primary_button);
    setText('.hero-actions .btn-outline', data.hero?.secondary_button);

    const heroPoints = q('.hero-points');
    if (heroPoints && Array.isArray(data.hero?.points)) {
      heroPoints.innerHTML = data.hero.points.map(item => `<li>${escapeHtml(item)}</li>`).join('');
    }

    const valueArticles = qa('.value-grid article');
    if (Array.isArray(data.values)) {
      data.values.forEach((item, index) => {
        const article = valueArticles[index];
        if (!article) return;
        setText('h2', item.title, article);
        const p = q('p', article);
        if (p) p.textContent = item.description || '';
      });
    }

    const intro = q('#uslugi .section-head');
    if (intro && data.services_intro) {
      q('.eyebrow', intro).textContent = data.services_intro.eyebrow || '';
      q('h2', intro).textContent = data.services_intro.title || '';
      const p = q('p:last-child', intro);
      if (p) p.textContent = data.services_intro.description || '';
    }

    const cardsWrap = q('#uslugi .cards');
    if (cardsWrap && Array.isArray(data.services)) {
      cardsWrap.innerHTML = data.services.map((service, i) => `
        <article class="card reveal show">
          <div class="icon">${escapeHtml(service.icon || '•')}</div>
          <h3>${escapeHtml(service.title)}</h3>
          <p>${escapeHtml(service.description)}</p>
        </article>
      `).join('');
    }

    if (data.realizations) {
      setText('#realizacje .eyebrow', data.realizations.eyebrow);
      setText('#realizacje h2', data.realizations.title);
      const desc = q('#realizacje .featured-copy > p:not(.eyebrow)');
      if (desc) desc.textContent = data.realizations.description || '';
      const list = q('#realizacje .check-list');
      if (list && Array.isArray(data.realizations.bullets)) {
        list.innerHTML = data.realizations.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join('');
      }
    }

    if (data.expertise) {
      setText('#ekspertyza .eyebrow', data.expertise.eyebrow);
      setText('#ekspertyza h2', data.expertise.title);
      const p = q('#ekspertyza .expertise-copy > p:not(.eyebrow)');
      if (p) p.textContent = data.expertise.description || '';
      const mini = q('#ekspertyza .mini-grid');
      if (mini && Array.isArray(data.expertise.items)) {
        mini.innerHTML = data.expertise.items.map(item => `
          <div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.description)}</span></div>
        `).join('');
      }
    }

    if (data.contact) {
      setText('#kontakt .eyebrow', data.contact.eyebrow);
      setText('#kontakt h2', data.contact.title);
      const cp = q('#kontakt .contact-grid > div:first-child > p:not(.eyebrow)');
      if (cp) cp.textContent = data.contact.description || '';
      const phoneHref = `tel:${data.contact.phone_href || data.contact.phone_display || ''}`;
      const mailHref = `mailto:${data.contact.email || ''}`;
      setText('#kontakt .contact-actions .btn-gold', data.contact.phone_display);
      setHref('#kontakt .contact-actions .btn-gold', phoneHref);
      setText('#kontakt .contact-actions .btn-outline', data.contact.email);
      setHref('#kontakt .contact-actions .btn-outline', mailHref);

      const items = qa('#kontakt .contact-item');
      if (items[0]) items[0].innerHTML = `<span>${escapeHtml(data.contact.company)}</span>`;
      if (items[1]) items[1].innerHTML = `<span>${withBreaks(data.contact.address)}</span>`;
      if (items[2]) items[2].innerHTML = `<span>NIP ${escapeHtml(data.contact.nip)}</span><span><a href="${escapeHtml(phoneHref)}">${escapeHtml(data.contact.phone_display)}</a></span>`;
      if (items[3]) items[3].innerHTML = `<span><a href="${escapeHtml(mailHref)}">${escapeHtml(data.contact.email)}</a></span>`;
    }

    const footerP = q('.footer-copy p');
    if (footerP && data.footer?.description) footerP.textContent = data.footer.description;

    if (data.cookies) {
      setText('#cookieBanner strong', data.cookies.title);
      const cp = q('#cookieBanner p');
      if (cp) cp.innerHTML = `${escapeHtml(data.cookies.description)} Szczegóły znajdziesz w <a href="cookies.html">Polityce cookies</a>.`;
      setText('.js-cookie-settings', data.cookies.settings_button);
      setText('.js-cookie-reject', data.cookies.reject_button);
      setText('#cookieBanner .js-cookie-accept', data.cookies.accept_button);
    }
  }

  fetch('content/site.json', { cache: 'no-cache' })
    .then(res => res.ok ? res.json() : null)
    .then(applyContent)
    .catch(() => {});
})();
