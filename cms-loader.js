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

  function setSectionHead(selector, data) {
    const root = q(selector);
    if (!root || !data) return;
    setText('.eyebrow', data.eyebrow, root);
    setText('h2', data.title, root);
    const p = q('p:last-child', root);
    if (p && data.description) p.textContent = data.description;
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
    setHref('.hero-actions .btn-gold', '#kontakt');
    setHref('.hero-actions .btn-outline', '#proces');

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
          ${service.link_text ? `<a href="${escapeHtml(service.link_href || '#kontakt')}">${escapeHtml(service.link_text)}</a>` : ''}
        </article>
      `).join('');
    }

    if (data.why) {
      setSectionHead('#dlaczego .section-head', data.why);
      const wrap = q('#dlaczego .reason-grid');
      if (wrap && Array.isArray(data.why.items)) {
        wrap.innerHTML = data.why.items.map(item => `
          <article><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>
        `).join('');
      }
    }

    if (data.owner) {
      setText('#onas .eyebrow', data.owner.eyebrow);
      setText('#onas h2', data.owner.title);
      const p = q('#onas .owner-panel p:not(.eyebrow)');
      if (p) p.textContent = data.owner.description || '';
      const list = q('#onas .owner-list');
      if (list && Array.isArray(data.owner.points)) {
        list.innerHTML = data.owner.points.map(item => `<li>${escapeHtml(item)}</li>`).join('');
      }
    }

    if (data.process) {
      setSectionHead('#proces .section-head', data.process);
      const wrap = q('#proces .process-grid');
      if (wrap && Array.isArray(data.process.items)) {
        wrap.innerHTML = data.process.items.map((item, index) => `
          <article class="process-step reveal show">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `).join('');
      }
    }

    if (data.investment_types) {
      setSectionHead('#inwestycje .section-head', data.investment_types);
      const list = q('#inwestycje .tag-list');
      if (list && Array.isArray(data.investment_types.items)) {
        list.innerHTML = data.investment_types.items.map(item => `<span>${escapeHtml(item)}</span>`).join('');
      }
    }

    if (data.climate) {
      setText('#klimatyzacja .eyebrow', data.climate.eyebrow);
      setText('#klimatyzacja h2', data.climate.title);
      const p = q('#klimatyzacja .climate-copy p:not(.eyebrow)');
      if (p) p.textContent = data.climate.description || '';
      setText('#klimatyzacja .btn', data.climate.button);
      const panel = q('#klimatyzacja .technical-panel');
      if (panel && Array.isArray(data.climate.items)) {
        panel.innerHTML = data.climate.items.map(item => `<span>${escapeHtml(item)}</span>`).join('');
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

    if (data.problems) {
      setSectionHead('#problemy .section-head', data.problems);
      const list = q('#problemy .problem-list');
      if (list && Array.isArray(data.problems.items)) {
        list.innerHTML = data.problems.items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
      }
    }

    if (data.testimonials) {
      setSectionHead('#opinie .section-head', data.testimonials);
      const wrap = q('#opinie .testimonial-grid');
      if (wrap && Array.isArray(data.testimonials.items)) {
        wrap.innerHTML = data.testimonials.items.map(item => `
          <figure class="testimonial reveal show">
            <blockquote>${escapeHtml(item.quote)}</blockquote>
            <figcaption>${escapeHtml(item.author)}</figcaption>
          </figure>
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
