(function () {
  const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  const lang = browserLang.startsWith('fr') ? 'fr' : 'en';
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  window.__I18N_LANG = lang;

  window.getCharHTML = function (ch) {
    if (ch === ' ') return '&nbsp;';
    if (ch === '🡲' || ch === '🡺') return '<svg style="width: 1.25em; height: 1.25em; vertical-align: -0.25em;" viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/></svg>';
    if (ch === '🡼') return '<svg style="width: 1.25em; height: 1.25em; vertical-align: -0.25em;" viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-135 42 42.5)"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/></g></svg>';
    if (ch === '🞣') return '<svg style="width: 0.9em; height: 0.9em; vertical-align: -0.1em; transform: translateY(-0.1em);" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"/></svg>';
    return ch;
  };

  if (lang === 'fr') {
    window.__t = function (key) { return null; };
    return;
  }

  const T = {
    'meta.description': 'Aspiring Product Designer with a background in Computer Science, focused on user research, prototyping and intuitive digital experiences.',

    'index.title': 'Aditya Sharma, Product Designer',
    'index.h1': 'Aditya Sharma, aspiring Product Designer with a Computer Science background, focused on user research, prototyping and intuitive digital experiences.',
    'index.hero.tagline': 'Curious and creative, <span class="other-accent">I design digital experiences</span>,<br>that feel simple, intuitive and purposeful.',
    'index.about.text': 'As an aspiring<span class="other-accent"> Product Designer</span>, I turn complex problems into <span class="other-accent">simple, intuitive</span> digital experiences.',
    'index.about.sub': "My name is Aditya. A Computer Science graduate with a strong interest in product thinking, I design solutions that are simple, intuitive and genuinely useful, from research to final prototype.",
    'index.cg.phrase': "Each project is a chance to <span class=\"other-accent\">learn</span>, <span class=\"other-accent\">experiment</span> and push my limits.",
    'index.skills.subtitle': 'Skills & Tech Stack',
    'index.skills.text': 'A UI/UX designer and front-end developer creating thoughtful, accessible digital products from research to polished implementation.',
    'index.skills.frontend': 'Frontend',
    'index.skills.animation': 'Animation & 3D',
    'index.skills.backend': 'Backend',
    'index.skills.database': 'Databases',
    'index.skills.devops': 'DevOps & Tools',
    'index.skills.security': 'System & Security',
    'index.skills.design': 'Design',
    'index.contact.title': 'Contact',
    'index.contact.dispo1': "Looking for <span class=\"other-accent\">Product Design opportunities</span>. Eager to join an innovative team and contribute to impactful products.",
    'index.contact.dispo2': "I'm available for<span class=\"other-accent\"> freelance design work</span>, on<span class=\"other-accent\"> your ambitious products</span> and collaborations worldwide.",
    'index.proj.label': 'Preview',
    'index.detail.back': '🡼BACK',

    'info.title': 'Info, Aditya Sharma',
    'info.eyebrow': 'About',
    'info.role': 'Aspiring Product Designer with a Computer Science background, focused on user-centered digital experiences.',
    'info.desc': "I enjoy understanding how people interact with products, identifying friction in those experiences, and designing solutions that feel simple, intuitive and purposeful. I focus on making products that are genuinely useful and easy to navigate, from research and user journeys to wireframes, prototypes and <span class=\"other-accent\">polished interfaces</span>.",
    'info.meta.based': 'Based in',
    'info.meta.status': 'Status',
    'info.meta.based.value': 'Mumbai, India',
    'info.meta.status.value': 'Open to Product Design opportunities',
    'info.skills.frontend': 'Frontend',
    'info.skills.animation': 'Animation & 3D',
    'info.skills.backend': 'Backend',
    'info.skills.security': 'Security & Tools',

    'contact.title': 'Contact, Aditya Sharma',
    'contact.panel.title': "Let's talk about your project.",
    'contact.panel.copy': "I respond quickly to opportunities, freelance work and collaborations around product design.",
    'contact.meta.base': 'Based in',
    'contact.meta.status': 'Status',
    'contact.meta.delay': 'Avg. response',
    'contact.meta.base.value': 'Mumbai, India',
    'contact.meta.status.value': 'Student / Open to opportunities',
    'contact.meta.delay.value': '48h',
    'contact.eyebrow': 'Contact',
    'contact.role': 'Aspiring Product Designer, focused on research-driven, user-centered design.',
    'contact.desc': "If you have a project in mind, an ambitious idea, I'd be glad to discuss it with you and explore a potential collaboration.",
    'contact.shortcuts': 'Shortcuts',
    'contact.brief': 'Brief format',
    'contact.maildirect': 'Direct mail',
    'contact.brief.product': 'Product goal',
    'contact.brief.deadline': 'Target deadline',
    'contact.brief.stack': 'Tech stack',
    'contact.brief.deliverables': 'Expected deliverables',

    'works.title': 'Work, Aditya Sharma',
    'works.h1': 'Projects, Aditya Sharma, aspiring Product Designer. Discover my work across product and UX design.',

    'common.aria.back': 'Back to home',
    'common.aria.menu': 'Main navigation',
    'common.aria.social': 'Social links',
    'common.aria.footer': 'Footer navigation',

    '404.title': '404 — Aditya Sharma',
    '404.subtitle': 'This page got lost in the void.<br><span class="subtitle-dim">It doesn\'t exist, or no longer does.</span>',
    '404.ticker': '— PAGE NOT FOUND — SIGNAL LOST — ERROR 0x404 — THIS PAGE DOESN\'T EXIST — COORDINATES: NULL — UNKNOWN DESTINATION — ',
    '404.aria.back': 'Back to home',
  };

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const key = el.getAttribute('data-i18n');
    if (T[key] != null) el.innerHTML = T[key];
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    el.getAttribute('data-i18n-attr').split('|').forEach(function (pair) {
      const idx = pair.indexOf(':');
      if (idx < 0) return;
      const attr = pair.slice(0, idx).trim();
      const key = pair.slice(idx + 1).trim();
      if (T[key] != null) el.setAttribute(attr, T[key]);
    });
  });

  const titleKey = document.documentElement.getAttribute('data-i18n-title');
  if (titleKey && T[titleKey]) document.title = T[titleKey];

  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta && T['meta.description']) descMeta.setAttribute('content', T['meta.description']);

  window.__t = function (key) { return T[key]; };
})();
