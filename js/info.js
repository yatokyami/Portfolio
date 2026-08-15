(function () {
  'use strict';

  // ── Data ─────────────────────────────────────────────────────────────────
  const CATEGORIES = [
    {
      label: 'Games',
      items: [
        {
          title: 'Final Fantasy VII',
          cover: '../assets/images/favourites/finalfantasy7.jpg',
          thought: 'The story that defined JRPGs forever. Midgar alone is a masterclass in world-building — every corner feels lived-in and political.'
        },
        {
          title: 'Final Fantasy XVI',
          cover: '../assets/images/favourites/finalfantasy16.jpg',
          thought: 'Yoshi-P took a massive swing going full action RPG and it mostly lands. Clive\'s arc is genuinely one of the best in the series.'
        },
        {
          title: 'Persona 3 Reload',
          cover: '../assets/images/favourites/persona3reload.jpg',
          thought: 'The remake we deserved. The themes of mortality hit completely different now. Strega was always underrated as antagonists.'
        },
        {
          title: 'Nier Automata',
          cover: '../assets/images/favourites/nierautomata.jpg',
          thought: 'Play it three times, cry three times. Yoko Taro uses the game format itself as a narrative weapon. Nothing else does this.'
        },
      ],
    },
    {
      label: 'Anime',
      items: [
        {
          title: 'One Piece',
          cover: '../assets/images/favourites/onepiece.jpg',
          thought: 'The most ambitious long-form story in any medium. Oda plants seeds 500 chapters before they bloom. The payoffs are unmatched.'
        },
        {
          title: 'Code Geass',
          cover: '../assets/images/favourites/codegeass.jpg',
          thought: 'Lelouch\'s ending is still the most emotionally gutting finale I\'ve ever watched. The chess metaphor is earned, not decorative.'
        },
        {
          title: 'Kaguya-sama',
          cover: '../assets/images/favourites/loveiswar.jpg',
          thought: 'Comedy that secretly morphs into one of the most wholesome love stories out there. Ishigami\'s arc in S3 is genuinely moving.'
        },
        {
          title: 'Steins;Gate',
          cover: '../assets/images/favourites/steinsgate.jpg',
          thought: 'The slow burn first half is intentional and essential. When the shift happens it\'s devastating. Okabe is one of the all-time greats.'
        },
      ],
    },
    {
      label: 'Manga',
      items: [
        {
          title: 'Sakamoto Days',
          cover: '../assets/images/favourites/sakamotodays.jpg',
          thought: 'Peak action comedy. The fight choreography on paper is absurdly good. Sakamoto communicating purely through expressions is genius.'
        },
        {
          title: 'Blue Lock',
          cover: '../assets/images/favourites/bluelock.jpg',
          thought: 'Recontextualises football through ego and philosophy. Every match is a character study. Isagi\'s growth is genuinely compelling.'
        },
        {
          title: 'Tokyo Ghoul',
          cover: '../assets/images/favourites/tokyoghoul.jpg',
          thought: 'The original manga is a masterpiece. Kaneki\'s identity crisis is handled with real depth — the themes of otherness still resonate hard.'
        },
        {
          title: 'Tokyo Revengers',
          cover: '../assets/images/favourites/tokyorevengers.jpg',
          thought: 'The time-loop mechanic used to explore trauma and regret is genuinely clever. The gang dynamics and loyalty themes hit surprisingly hard.'
        },
      ],
    },
    {
      label: 'Movies',
      items: [
        {
          title: 'Maze Runner',
          cover: '../assets/images/favourites/themazerunner.jpg',
          thought: 'The Glade as a self-contained society is a fascinating setup. The first film nails the tension of a world with rules you don\'t understand yet.'
        },
        {
          title: 'Harry Potter',
          cover: '../assets/images/favourites/harrypotter.jpg',
          thought: 'Prisoner of Azkaban remains the high point — Cuarón understood that the magic needed shadow. The time-turner sequence is perfect filmmaking.'
        },
        {
          title: 'Spider-Man: Into the Spider-Verse',
          cover: '../assets/images/favourites/spiderverse.jpg',
          thought: 'The most visually innovative animated film ever made, full stop. Every frame is a deliberate artistic choice. Changed what animation could be.'
        },
        {
          title: 'Star Wars',
          cover: '../assets/images/favourites/starwars.jpg',
          thought: 'Empire Strikes Back is the blueprint for a sequel that deepens rather than repeats. The father reveal still lands because Vader earned it.'
        },
      ],
    },
    {
      label: 'Series',
      items: [
        {
          title: 'Dark',
          cover: '../assets/images/favourites/dark.jpeg',
          thought: 'The most rigorously constructed sci-fi narrative on television. The family trees across three timelines reward obsessive attention.'
        },
        {
          title: 'Moon Knight',
          cover: '../assets/images/favourites/moonknight.jpeg',
          thought: 'Oscar Isaac carrying two personalities simultaneously is one of the great MCU performances. The Egyptian mythology is used with real care.'
        },
        {
          title: 'Outer Banks',
          cover: '../assets/images/favourites/outerbanks.jpg',
          thought: 'The only show where I was actively rooting against the protagonist by the end. The transformation is so gradual you miss the exact moment it happens.'
        },
        {
          title: 'Game of Thrones',
          cover: '../assets/images/favourites/gameofthrones.jpg',
          thought: 'Seasons 1–4 are some of the finest television ever made. The Red Wedding remains the most effective single episode of shock storytelling in TV history.'
        },
      ],
    },
    {
      label: 'Books',
      items: [
        {
          title: 'Yumi and the Nightmare Painter',
          cover: '../assets/images/favourites/yumiandthenightmarepainter.jpg',
          thought: 'Sanderson at his most intimate. The dual-world structure is elegant and the central relationship is the warmest thing he\'s ever written.'
        },
        {
          title: 'The Way of Kings',
          cover: '../assets/images/favourites/thewayofkings.jpg',
          thought: 'The worldbuilding density is staggering but it never feels like homework. Kaladin\'s arc in the first book alone justifies the length of the series.'
        },
        {
          title: 'The Design of Everyday Things',
          cover: '../assets/images/favourites/designofeverydaythings.jpg',
          thought: 'Made me unable to use a bad door handle without getting annoyed. Don Norman gave me a framework for frustration I use every single day as a designer.'
        },
        {
          title: 'Steal Like an Artist',
          cover: '../assets/images/favourites/steallikeanartist.jpg',
          thought: 'Short enough to read in one sitting, dense enough to change how you think about creativity. The permission it gives you is real and necessary.'
        },
      ],
    },
  ];

  // ── DOM refs ─────────────────────────────────────────────────────────────
  const sliderNav = document.getElementById('fav-slider-nav');
  const grid      = document.getElementById('fav-grid');
  const catWord   = document.querySelector('.fav-cat-word');
  const prevBtn   = document.getElementById('fav-prev');
  const nextBtn   = document.getElementById('fav-next');
  const catLabel  = document.getElementById('fav-cat-label');
  const catIndex  = document.getElementById('fav-cat-index');

  if (!grid || !prevBtn || !nextBtn) return;

  let current = 0;

  // ── Update nav state ─────────────────────────────────────────────────────
  function updateNav() {
    const cat = CATEGORIES[current];
    if (catLabel)  catLabel.textContent  = cat.label;
    if (catIndex)  catIndex.textContent  = (current + 1).toString().padStart(2, '0') + ' / ' + CATEGORIES.length.toString().padStart(2, '0');
    if (catWord)   catWord.textContent   = cat.label.toLowerCase() + '.';

    // Remove disabled states for circular navigation
    prevBtn.disabled = false;
    nextBtn.disabled = false;

    // Update dot indicators
    if (sliderNav) {
      sliderNav.querySelectorAll('.fav-dot').forEach(function (dot, i) {
        dot.classList.toggle('fav-dot--active', i === current);
      });
    }
  }

  // ── Build a single card ───────────────────────────────────────────────────
  function buildCard(item) {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.innerHTML =
      '<img src="' + item.cover + '" alt="' + item.title + '" loading="lazy" decoding="async">' +
      '<div class="fav-card-overlay"></div>' +
      '<div class="fav-card-title">' + item.title + '</div>' +
      '<div class="fav-card-thought">' +
        '<p>' + item.thought + '</p>' +
      '</div>';
    return card;
  }

  // ── Render a category ────────────────────────────────────────────────────
  function renderGrid(index) {
    const cat = CATEGORIES[index];
    grid.innerHTML = '';
    cat.items.forEach(function (item) {
      grid.appendChild(buildCard(item));
    });
  }

  // ── Switch category ──────────────────────────────────────────────────────
  function showCategory(index) {
    // Wrap around for circular navigation
    if (index < 0) {
      index = CATEGORIES.length - 1;
    } else if (index >= CATEGORIES.length) {
      index = 0;
    }

    grid.classList.add('fav-grid--out');

    setTimeout(function () {
      current = index;
      renderGrid(current);
      updateNav();
      grid.classList.remove('fav-grid--out');
    }, 160);
  }

  // ── Dot nav builder ───────────────────────────────────────────────────────
  if (sliderNav) {
    CATEGORIES.forEach(function (cat, i) {
      const dot = document.createElement('button');
      dot.className = 'fav-dot' + (i === 0 ? ' fav-dot--active' : '');
      dot.setAttribute('aria-label', cat.label);
      dot.setAttribute('title', cat.label);
      dot.addEventListener('click', function () { showCategory(i); });
      sliderNav.appendChild(dot);
    });
  }

  // ── Arrow buttons ─────────────────────────────────────────────────────────
  prevBtn.addEventListener('click', function () { showCategory(current - 1); });
  nextBtn.addEventListener('click', function () { showCategory(current + 1); });

  // ── Keyboard navigation ───────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    const favSection = document.querySelector('.about-favorites');
    if (!favSection) return;
    const rect = favSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === 'ArrowRight') showCategory(current + 1);
    if (e.key === 'ArrowLeft')  showCategory(current - 1);
  });

  // ── Initial render ────────────────────────────────────────────────────────
  renderGrid(0);
  updateNav();

  // ── Scroll-triggered animations ───────────────────────────────────────────
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const animationObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  // Observe sections for animations
  const manifestoSection = document.querySelector('.about-manifesto');
  const toolkitSection = document.querySelector('.about-toolkit');
  const favoritesSection = document.querySelector('.about-favorites');
  const favTitleRow = document.querySelector('.fav-title-row');

  if (manifestoSection) animationObserver.observe(manifestoSection);
  if (toolkitSection) animationObserver.observe(toolkitSection);
  if (favoritesSection) animationObserver.observe(favoritesSection);
  if (favTitleRow) animationObserver.observe(favTitleRow);

  // Add loaded class to back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    setTimeout(function() {
      backBtn.classList.add('loaded');
    }, 100);
  }

}());

// ── About hero: spotlight, word cycle, entrance animations ───────────────
(function () {
  'use strict';

  const section    = document.getElementById('about-intro');
  const spotlight  = document.getElementById('intro-spotlight');
  const roleWord   = document.getElementById('intro-role-word');

  if (!section) return;

  // ── Cursor spotlight ──────────────────────────────────────────────────────
  if (spotlight) {
    section.addEventListener('mousemove', function (e) {
      const r = section.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(2) + '%';
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(2) + '%';
      spotlight.style.setProperty('--mx', x);
      spotlight.style.setProperty('--my', y);
    });
  }

  // ── Role word cycling ─────────────────────────────────────────────────────
  const WORDS = ['curiosity.', 'intention.', 'obsession.', 'craft.'];
  let wi = 0;

  if (roleWord) {
    function nextWord() {
      // fade out
      roleWord.classList.add('role-out');
      setTimeout(function () {
        wi = (wi + 1) % WORDS.length;
        roleWord.textContent = WORDS[wi];
        roleWord.classList.remove('role-out');
        roleWord.classList.add('role-in');
        // tiny frame to let the browser paint the "in" state
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            roleWord.classList.remove('role-in');
          });
        });
      }, 380);
    }
    setInterval(nextWord, 2800);
  }

  // ── Entrance animations (GSAP if available, CSS fallback otherwise) ───────
  function runEntranceGSAP() {
    const tl = gsap.timeline({ delay: 0.55 });

    tl.to('.intro-eyebrow', {
      opacity: 1, y: 0, duration: .7, ease: 'power3.out'
    })
    .to('.intro-bio', {
      opacity: 1, y: 0, duration: .7, ease: 'power3.out'
    }, '<0.1')
    .to('.intro-name-label', {
      opacity: 1, y: 0, duration: .6, ease: 'power3.out'
    }, '-=0.4')
    .to('.intro-name', {
      opacity: 1, y: 0, duration: .9, ease: 'power3.out'
    }, '-=0.45')
    .to('.intro-meta', {
      opacity: 1, y: 0, duration: .7, ease: 'power3.out'
    }, '-=0.5');
  }

  function runEntranceCSS() {
    var els = ['.intro-eyebrow', '.intro-bio', '.intro-name-label',
               '.intro-name', '.intro-meta'];
    els.forEach(function (sel, i) {
      var el = document.querySelector(sel);
      if (!el) return;
      el.style.transition = 'opacity .7s ease ' + (0.55 + i * 0.1) + 's, transform .7s ease ' + (0.55 + i * 0.1) + 's';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  // Wait for page wipe to finish (~1.1 s) then trigger
  setTimeout(function () {
    if (window.gsap) {
      runEntranceGSAP();
    } else {
      runEntranceCSS();
    }
  }, 100);

}());
