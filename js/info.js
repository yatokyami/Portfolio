(function () {
  'use strict';

  // ── Data ─────────────────────────────────────────────────────────────────
  const CATEGORIES = [
    {
      label: 'Games',
      items: [
        { title: 'Hollow Knight',          sub: '2017 · Team Cherry',           cover: '../assets/images/projects/Covers/Zenith.avif',        thought: 'Every room feels handcrafted. The silence teaches you more than any tutorial.' },
        { title: 'Ori & the Blind Forest', sub: '2015 · Moon Studios',          cover: '../assets/images/projects/Covers/Echo.avif',          thought: 'Proof that motion design and game feel are the same discipline.' },
        { title: 'Celeste',                sub: '2018 · Maddy Makes Games',     cover: '../assets/images/projects/Covers/Portfolio.jpg',      thought: "The hardest game I've finished. The story made it worth every death." },
        { title: 'Hades',                  sub: '2020 · Supergiant Games',      cover: '../assets/images/projects/Covers/cyberDiag_web.avif', thought: 'Loop design at its absolute peak. Every run teaches you something new.' },
      ],
    },
    {
      label: 'Anime',
      items: [
        { title: 'Mushishi',               sub: '2005 · Artland',               cover: '../assets/images/projects/Covers/Zenith.avif',        thought: 'Slow, quiet, and utterly beautiful. Resets your pace every episode.' },
        { title: 'Ping Pong the Animation',sub: '2014 · Tatsunoko',             cover: '../assets/images/projects/Covers/Echo.avif',          thought: "The most honest sports anime ever made. It's really about finding yourself." },
        { title: 'Vinland Saga',           sub: '2019 · Wit Studio',            cover: '../assets/images/projects/Covers/Portfolio.jpg',      thought: 'Started as action, became a meditation on violence and purpose.' },
        { title: 'Frieren',                sub: '2023 · Madhouse',              cover: '../assets/images/projects/Covers/cyberDiag_web.avif', thought: 'Grief and time handled better than most literary fiction.' },
      ],
    },
    {
      label: 'Manga',
      items: [
        { title: 'Berserk',                sub: 'Kentaro Miura',                cover: '../assets/images/projects/Covers/Zenith.avif',        thought: 'The panels alone are a masterclass in composition and negative space.' },
        { title: 'Vagabond',               sub: 'Takehiko Inoue',              cover: '../assets/images/projects/Covers/Echo.avif',          thought: 'Every page looks like it belongs in an art gallery.' },
        { title: 'Dungeon Meshi',          sub: 'Ryoko Kui',                   cover: '../assets/images/projects/Covers/Portfolio.jpg',      thought: 'Worldbuilding through food. Deceptively deep beneath its cozy surface.' },
        { title: 'Goodnight Punpun',       sub: 'Inio Asano',                  cover: '../assets/images/projects/Covers/cyberDiag_web.avif', thought: "The most uncomfortable thing I've ever read. Couldn't put it down." },
      ],
    },
    {
      label: 'Movies',
      items: [
        { title: 'Blade Runner 2049',      sub: '2017 · Denis Villeneuve',     cover: '../assets/images/projects/Covers/Zenith.avif',        thought: 'Roger Deakins framed every single shot like a painting. The pacing is a choice.' },
        { title: 'Spirited Away',          sub: '2001 · Hayao Miyazaki',       cover: '../assets/images/projects/Covers/Echo.avif',          thought: 'No movie has ever made me feel wonder like this one. Still holds up completely.' },
        { title: 'Parasite',               sub: '2019 · Bong Joon-ho',         cover: '../assets/images/projects/Covers/Portfolio.jpg',      thought: 'The architecture of the script mirrors the architecture of the house.' },
        { title: 'Perfect Blue',           sub: '1997 · Satoshi Kon',          cover: '../assets/images/projects/Covers/cyberDiag_web.avif', thought: 'Kon was playing with unreliable perception decades before it was trendy.' },
      ],
    },
    {
      label: 'Series',
      items: [
        { title: 'Breaking Bad',           sub: '2008–2013 · AMC',             cover: '../assets/images/projects/Covers/Zenith.avif',        thought: 'The only show where I was rooting against the protagonist by the end. Perfect arc.' },
        { title: 'Severance',              sub: '2022 · Apple TV+',            cover: '../assets/images/projects/Covers/Echo.avif',          thought: 'Production design as storytelling. Every frame says something about the concept.' },
        { title: 'Dark',                   sub: '2017–2020 · Netflix',         cover: '../assets/images/projects/Covers/Portfolio.jpg',      thought: "The most ambitious narrative structure I've seen on screen. German, obviously." },
        { title: 'Succession',             sub: '2018–2023 · HBO',             cover: '../assets/images/projects/Covers/cyberDiag_web.avif', thought: 'Dialogue so sharp it feels dangerous. Every character is irredeemable and fascinating.' },
      ],
    },
    {
      label: 'Books',
      items: [
        { title: 'Flowers for Algernon',         sub: 'Daniel Keyes',      cover: '../assets/images/projects/Covers/Zenith.avif',        thought: 'The prose structure itself tells the story. I think about it constantly.' },
        { title: 'The Design of Everyday Things', sub: 'Don Norman',       cover: '../assets/images/projects/Covers/Echo.avif',          thought: 'Made me unable to use a bad door handle without getting annoyed.' },
        { title: 'Never Let Me Go',               sub: 'Kazuo Ishiguro',   cover: '../assets/images/projects/Covers/Portfolio.jpg',      thought: 'So quiet and so devastating. The restraint is what makes it hit so hard.' },
        { title: 'Thinking, Fast and Slow',       sub: 'Daniel Kahneman',  cover: '../assets/images/projects/Covers/cyberDiag_web.avif', thought: 'Changed how I think about decision-making in design and in life.' },
      ],
    },
    {
      label: 'Songs',
      items: [
        { title: 'Motion Picture Soundtrack', sub: 'Radiohead · Kid A',          cover: '../assets/images/projects/Covers/Zenith.avif',        thought: "Sounds like the end of something. I've never heard silence used so well in music." },
        { title: 'Nude',                      sub: 'Radiohead · In Rainbows',    cover: '../assets/images/projects/Covers/Echo.avif',          thought: 'The bassline lives in my head permanently. Pure tension with no release.' },
        { title: "Comptine d'un autre été",   sub: 'Yann Tiersen',               cover: '../assets/images/projects/Covers/Portfolio.jpg',      thought: 'Learned this on piano. Some pieces just belong to certain hours of the day.' },
        { title: 'Redbone',                   sub: 'Childish Gambino · Awaken',  cover: '../assets/images/projects/Covers/cyberDiag_web.avif', thought: 'The production is so warm it feels physical. Nothing else sounds like this.' },
      ],
    },
  ];

  // ── DOM refs ─────────────────────────────────────────────────────────────
  const tabBar  = document.getElementById('fav-tabs');
  const grid    = document.getElementById('fav-grid');
  const catWord = document.querySelector('.fav-cat-word');

  if (!tabBar || !grid) return;

  let current = 0;

  // ── Build tab bar ────────────────────────────────────────────────────────
  CATEGORIES.forEach(function (cat, i) {
    const btn = document.createElement('button');
    btn.className = 'fav-tab' + (i === 0 ? ' fav-tab--active' : '');
    btn.textContent = cat.label;
    btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', function () { showCategory(i); });
    tabBar.appendChild(btn);
  });

  // ── Build a single card ───────────────────────────────────────────────────
  function buildCard(item, catLabel) {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.innerHTML =
      '<img src="' + item.cover + '" alt="' + item.title + '" loading="lazy" decoding="async">' +
      '<div class="fav-card-overlay"></div>' +
      '<span class="fav-card-label">' + catLabel + '</span>' +
      '<div class="fav-card-body">' +
        '<div class="fav-card-title">' + item.title +
          '<span class="fav-card-sub-title">' + item.sub + '</span>' +
        '</div>' +
        '<div class="fav-card-thought">' + item.thought + '</div>' +
      '</div>';
    return card;
  }

  // ── Render a category ────────────────────────────────────────────────────
  function showCategory(index) {
    if (index === current) return;

    // Update tabs
    const tabs = tabBar.querySelectorAll('.fav-tab');
    tabs[current].classList.remove('fav-tab--active');
    tabs[current].setAttribute('aria-pressed', 'false');
    tabs[index].classList.add('fav-tab--active');
    tabs[index].setAttribute('aria-pressed', 'true');

    // Fade grid out, swap content, fade back in — pure CSS class toggle
    grid.classList.add('fav-grid--out');

    // Wait for the CSS opacity transition (150 ms) then swap
    setTimeout(function () {
      renderGrid(index);
      grid.classList.remove('fav-grid--out');
      current = index;
    }, 150);
  }

  // ── Populate grid ─────────────────────────────────────────────────────────
  function renderGrid(index) {
    const cat = CATEGORIES[index];
    grid.innerHTML = '';
    cat.items.forEach(function (item) {
      grid.appendChild(buildCard(item, cat.label));
    });
    if (catWord) catWord.textContent = cat.label.toLowerCase() + '.';
  }

  // ── Keyboard navigation on the tab bar ───────────────────────────────────
  tabBar.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      showCategory((current + 1) % CATEGORIES.length);
      tabBar.querySelectorAll('.fav-tab')[current].focus();
    } else if (e.key === 'ArrowLeft') {
      showCategory((current - 1 + CATEGORIES.length) % CATEGORIES.length);
      tabBar.querySelectorAll('.fav-tab')[current].focus();
    }
  });

  // ── Initial render ────────────────────────────────────────────────────────
  renderGrid(0);

}());
