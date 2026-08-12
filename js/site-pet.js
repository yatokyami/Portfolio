(function () {
  var root;
  var x = 40;
  var lift = 0;
  var dir = 1;
  var dragging = false;
  var ox = 0;
  var oy = 0;
  var moved = false;
  var hat = "sprout";
  var bubbleTimer;
  var mode = "walking";
  var gameActive = false;

  var hats = {
    none: "∅",
    bucket: "▰",
    cap: "⌒",
    sprout: "♧",
    party: "▲",
    skateboard: "▱",
  };
  var home = ["welcome!", "check out the projects!", "curious about me?\nvisit about.", "there’s lots to explore."];
  var about = ["so this is the about page!", "nice to meet you!", "fun facts live here."];
  var other = ["hi there!", "just walking", "dum de dum", "try dragging me\nsomewhere!", "need a hand?"];

  function choose(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function say(text, duration) {
    if (!root) return;
    clearTimeout(bubbleTimer);
    root.querySelector(".site-pet__bubble").textContent = text;
    bubbleTimer = setTimeout(function () {
      root.querySelector(".site-pet__bubble").textContent = "";
    }, duration || 2600);
  }

  function render() {
    root.style.setProperty("--pet-x", x + "px");
    root.style.setProperty("--pet-lift", lift + "px");
    root.style.setProperty("--pet-flip", dir);
    root.dataset.mode = mode;
    root.dataset.hat = hat;
    root.classList.toggle("site-pet--in-game", gameActive);
  }

  function updateHeroVisibility() {
    root.classList.toggle("site-pet--hidden", !gameActive && !!window.__hideSitePet);
  }

  function phrase() {
    return location.pathname.toLowerCase().indexOf("/info") > -1 ? choose(about) : choose(other.concat(home));
  }

  function sprite() {
    return '<svg class="site-pet__svg" width="44" height="56" viewBox="0 0 44 56" fill="none" aria-hidden="true"><ellipse class="site-pet__shadow" cx="22" cy="53.5" rx="14" ry="1.8" fill="#000" opacity=".28"/><rect class="site-pet__body" x="4" y="6" width="36" height="38" rx="5" fill="#efefef"/><rect x="4" y="6" width="36" height="2" rx="1" fill="#fff" opacity=".65"/><g class="site-pet__eyes"><g class="site-pet__eye-track"><rect x="14" y="22" width="4" height="5" rx="1" fill="#111"/><rect x="26" y="22" width="4" height="5" rx="1" fill="#111"/></g></g><rect class="site-pet__leg" x="10" y="42" width="8" height="10" rx="1.5" fill="#efefef"/><rect class="site-pet__leg site-pet__leg--right" x="26" y="42" width="8" height="10" rx="1.5" fill="#efefef"/><g class="pet-hat pet-hat--bucket"><rect x="10" y="-7" width="24" height="10" rx="3" fill="#e8c84a"/><rect x="-1" y="0" width="46" height="6" rx="3" fill="#e8c84a"/></g><g class="pet-hat pet-hat--top"><rect x="13" y="-11" width="18" height="14" rx="2.5" fill="#111"/><rect x="4" y="1" width="36" height="5" rx="2.5" fill="#111"/></g><g class="pet-hat pet-hat--cap"><rect x="8" y="-4" width="28" height="10" rx="4" fill="#168b9d"/><rect x="22" y="4" width="20" height="5" rx="2.5" fill="#168b9d"/></g><g class="pet-hat pet-hat--sprout"><rect x="21" y="-6" width="2" height="12" fill="#2a8f50"/><ellipse cx="17" cy="-7" rx="5" ry="2.8" fill="#3ca564" transform="rotate(28 17 -7)"/><ellipse cx="27" cy="-7" rx="5" ry="2.8" fill="#3ca564" transform="rotate(-28 27 -7)"/></g><g class="pet-hat pet-hat--party"><polygon points="22.5,-8 14,4 31,4" fill="#bf5a7a"/></g><g class="pet-board"><path d="M2 54h40c-2.2 5-7.8 6-20 6S4.2 59 2 54Z" fill="#c96536"/><path d="M7 55h30" stroke="#f3a568" stroke-width="1.4"/><circle cx="10" cy="61" r="2.2" fill="#202020"/><circle cx="34" cy="61" r="2.2" fill="#202020"/></g></svg>';
  }

  function setGameState(state) {
    gameActive = !!state.active;
    if (typeof state.x === "number") x = state.x;
    if (typeof state.lift === "number") lift = state.lift;
    if (typeof state.dir === "number") dir = state.dir;
    if (state.mode) mode = state.mode;
    if (gameActive) hat = "skateboard";
    render();
    updateHeroVisibility();
  }

  function init() {
    root = document.createElement("div");
    root.className = "site-pet";
    root.innerHTML = '<div class="site-pet__bubble" aria-live="polite"></div><div class="site-pet__hat-rack"><button class="site-pet__hat-toggle" aria-label="Choose the pet hat" aria-expanded="false">♧</button><div class="site-pet__hat-menu" hidden></div></div><button class="site-pet__hit" aria-label="Pet the mascot"><span class="site-pet__bob">' + sprite() + "</span></button>";
    document.body.appendChild(root);

    var menu = root.querySelector(".site-pet__hat-menu");
    var toggle = root.querySelector(".site-pet__hat-toggle");
    var hit = root.querySelector(".site-pet__hit");

    window.SitePet = {
      setGameState: setGameState,
      say: say,
      element: root,
      isGameActive: function () { return gameActive; },
    };
    window.dispatchEvent(new CustomEvent("sitepetready"));

    Object.keys(hats).forEach(function (key) {
      var button = document.createElement("button");
      button.className = "site-pet__hat-option site-pet__hat-option--" + key;
      button.textContent = hats[key];
      button.title = key + " hat";
      button.onclick = function () {
        hat = key;
        mode = key === "skateboard" ? "skating" : "walking";
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        say(key === "skateboard" ? "skate mode!" : key === "none" ? "no hat!" : key + " hat!");
        if (key === "skateboard") setTimeout(function () { say("weeeee!"); }, 800);
        render();
      };
      menu.appendChild(button);
    });

    toggle.onclick = function () {
      menu.hidden = !menu.hidden;
      toggle.setAttribute("aria-expanded", String(!menu.hidden));
    };

    hit.onpointerdown = function (event) {
      if (gameActive) return;
      hit.setPointerCapture(event.pointerId);
      dragging = true;
      moved = false;
      var rect = root.getBoundingClientRect();
      ox = event.clientX - rect.left;
      oy = event.clientY - rect.top;
      mode = "dragging";
      render();
    };

    hit.onpointermove = function (event) {
      if (!dragging || gameActive) return;
      x = Math.max(8, Math.min(innerWidth - 68, event.clientX - ox));
      lift = Math.max(0, Math.min(innerHeight - 68, innerHeight - 68 - (event.clientY - oy)));
      moved = true;
      render();
    };

    function release() {
      if (!dragging || gameActive) return;
      dragging = false;
      lift = 0;
      if (moved) {
        say("back to it");
      } else {
        mode = hat === "skateboard" ? "skating" : "hop";
        say(choose(["heya!", "oh hi", "still here", "okay okay"]));
        setTimeout(function () {
          if (gameActive) return;
          mode = hat === "skateboard" ? "skating" : "walking";
          render();
        }, 500);
      }
      render();
    }

    hit.onpointerup = release;
    hit.onpointercancel = release;

    document.addEventListener("mousemove", function (event) {
      var rect = root.getBoundingClientRect();
      var eyeX = Math.max(-1.35, Math.min(1.35, (event.clientX - (rect.left + rect.width / 2)) / 90));
      var eyeY = Math.max(-0.9, Math.min(0.9, (event.clientY - (rect.top + 28)) / 110));
      root.style.setProperty("--eye-x", eyeX + "px");
      root.style.setProperty("--eye-y", eyeY + "px");
    });

    render();
    updateHeroVisibility();
    setTimeout(function () { if (!gameActive) say(choose(["oh hey!", "hi, welcome!", "hello there!"])); }, 1800);
    setInterval(function () { if (!gameActive) say(phrase()); }, 13000);

    var last = 0;
    function loop(now) {
      updateHeroVisibility();
      var dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      if (!gameActive && !dragging && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        var right = innerWidth - 80;
        x += dir * (hat === "skateboard" ? 58 : 34) * dt;
        if (x <= 8 || x >= right) {
          x = Math.max(8, Math.min(x, right));
          dir *= -1;
          mode = "bump";
          say(choose(["ow!", "oof", "ouch!"]));
          setTimeout(function () {
            if (gameActive) return;
            mode = hat === "skateboard" ? "skating" : "walking";
            render();
          }, 400);
        }
        render();
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
