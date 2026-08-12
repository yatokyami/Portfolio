(function () {
  var game = document.getElementById("footer-skate-game");
  var footer = document.getElementById("footer");
  if (!game || !footer) return;

  var course = game.querySelector(".skate-game__course");
  var obstacleLayer = game.querySelector(".skate-game__obstacles");
  var scoreEl = game.querySelector("[data-skate-score]");
  var bestEl = game.querySelector("[data-skate-best]");
  var statusEl = game.querySelector("[data-skate-status]");
  var startButton = game.querySelector("[data-skate-start]");
  var reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  var active = false;
  var running = false;
  var crashed = false;
  var petReady = !!window.SitePet;
  var jumpHeight = 0;
  var velocityY = 0;
  var speed = 285;
  var score = 0;
  var best = Number(localStorage.getItem("aditya-skate-best") || 0);
  var obstacles = [];
  var spawnDistance = 520;
  var lastTime = 0;
  var grinding = null;
  var gameX = 0;
  var baseLift = 42;
  var obstacleIndex = 0;
  var obstaclePattern = ["low", "ramp", "rail", "low", "low", "ramp", "rail"];

  bestEl.textContent = String(best).padStart(4, "0");

  function petApi() {
    return window.SitePet || null;
  }

  function setPet(mode) {
    var api = petApi();
    if (!api) return;
    api.setGameState({
      active: active,
      x: gameX,
      lift: baseLift + jumpHeight,
      dir: 1,
      mode: mode || (running ? "skating" : "skating"),
    });
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function createObstacle(type, initialX) {
    var config = type === "ramp"
      ? { width: 94, height: 48, label: "launch ramp" }
      : type === "rail"
        ? { width: 154, height: 36, label: "grind rail" }
        : { width: 34, height: 27, label: "low obstacle" };
    var element = document.createElement("div");
    element.className = "skate-obstacle skate-obstacle--" + type;
    element.setAttribute("aria-label", config.label);
    element.innerHTML = type === "rail"
      ? '<span class="skate-obstacle__bar"></span><span class="skate-obstacle__leg skate-obstacle__leg--a"></span><span class="skate-obstacle__leg skate-obstacle__leg--b"></span><span class="skate-obstacle__sparks"></span>'
      : type === "low"
        ? '<span></span><span></span><span></span>'
        : '<span class="skate-obstacle__ramp-line"></span>';
    obstacleLayer.appendChild(element);
    obstacles.push({
      type: type,
      x: initialX,
      width: config.width,
      height: config.height,
      element: element,
      handled: false,
      passed: false,
    });
  }

  function clearObstacles() {
    obstacles.forEach(function (obstacle) { obstacle.element.remove(); });
    obstacles = [];
    grinding = null;
  }

  function resetGame(startNow) {
    clearObstacles();
    score = 0;
    speed = reducedMotion.matches ? 220 : 285;
    jumpHeight = 0;
    velocityY = 0;
    spawnDistance = Math.max(470, innerWidth * 0.48);
    obstacleIndex = 0;
    crashed = false;
    running = !!startNow;
    game.classList.toggle("is-running", running);
    game.classList.remove("is-crashed", "is-grinding");
    scoreEl.textContent = "0000";
    startButton.textContent = running ? "OLLIE" : "DROP IN";
    setStatus(running ? "Run started. Ollie with Space, ↑, W, or tap." : "Press Space or tap Drop in to skate.");
    if (running) {
      createObstacle("low", innerWidth + 220);
      if (petApi()) petApi().say("let’s roll!", 1200);
    }
    setPet("skating");
  }

  function startOrJump() {
    if (!active) return;
    if (!running || crashed) {
      resetGame(true);
      return;
    }
    if (grinding) {
      grinding = null;
      game.classList.remove("is-grinding");
      velocityY = 430;
      jumpHeight += 5;
      setPet("ollie");
      return;
    }
    if (jumpHeight <= 3) {
      velocityY = 545;
      setPet("ollie");
    }
  }

  function crash() {
    if (crashed) return;
    crashed = true;
    running = false;
    grinding = null;
    game.classList.remove("is-running", "is-grinding");
    game.classList.add("is-crashed");
    best = Math.max(best, Math.floor(score));
    localStorage.setItem("aditya-skate-best", String(best));
    bestEl.textContent = String(best).padStart(4, "0");
    startButton.textContent = "TRY AGAIN";
    setStatus("Bail! Score " + Math.floor(score) + ". Press Space or Try again.");
    setPet("crashed");
    if (petApi()) petApi().say("I meant to do that.", 1800);
  }

  function updateVisibility() {
    var visible = getComputedStyle(footer).visibility !== "hidden";
    if (visible === active) return;
    active = visible;
    game.classList.toggle("is-active", active);
    if (active) {
      gameX = Math.max(58, Math.min(170, innerWidth * 0.14));
      baseLift = innerWidth < 700 ? 36 : 42;
      resetGame(false);
    } else {
      running = false;
      clearObstacles();
      var api = petApi();
      if (api) api.setGameState({ active: false, x: gameX, lift: 0, mode: "skating", dir: 1 });
    }
  }

  function obstacleGap(type) {
    var widthFactor = Math.min(innerWidth, 1200) / 1200;
    if (type === "rail") return 400 + 130 * widthFactor;
    if (type === "ramp") return 370 + 100 * widthFactor;
    return 300 + 110 * widthFactor;
  }

  function update(delta) {
    if (!active || !running || crashed) return;

    score += delta * speed * 0.042;
    speed = Math.min(430, 285 + score * 0.28);
    scoreEl.textContent = String(Math.floor(score)).padStart(4, "0");

    if (!grinding) {
      velocityY -= 1480 * delta;
      jumpHeight += velocityY * delta;
      if (jumpHeight <= 0) {
        jumpHeight = 0;
        velocityY = 0;
      }
    }

    spawnDistance -= speed * delta;
    if (spawnDistance <= 0) {
      var type = obstaclePattern[obstacleIndex % obstaclePattern.length];
      obstacleIndex += 1;
      createObstacle(type, innerWidth + 70);
      spawnDistance = obstacleGap(type) + Math.random() * 150;
    }

    var petFront = gameX + 40;
    var petBack = gameX + 5;

    obstacles.forEach(function (obstacle) {
      obstacle.x -= speed * delta;
      obstacle.element.style.transform = "translate3d(" + obstacle.x + "px,0,0)";

      var overlaps = obstacle.x < petFront && obstacle.x + obstacle.width > petBack;

      if (obstacle.type === "ramp" && overlaps && !obstacle.handled && jumpHeight < 12) {
        obstacle.handled = true;
        velocityY = 665;
        jumpHeight = 5;
        setPet("launching");
        if (petApi()) petApi().say("air time!", 850);
      }

      if (obstacle.type === "rail" && overlaps && !obstacle.handled && jumpHeight < obstacle.height + 24) {
        obstacle.handled = true;
        grinding = obstacle;
        jumpHeight = obstacle.height;
        velocityY = 0;
        game.classList.add("is-grinding");
        obstacle.element.classList.add("is-grinding");
        setPet("grinding");
        if (petApi()) petApi().say("grind!", 700);
      }

      if (obstacle.type === "low" && overlaps && jumpHeight < obstacle.height - 4) crash();

      if (!obstacle.passed && obstacle.x + obstacle.width < petBack) {
        obstacle.passed = true;
        if (obstacle.type === "low") score += 12;
      }
    });

    if (crashed) return;

    if (grinding) {
      jumpHeight = grinding.height;
      if (grinding.x + grinding.width < petBack || grinding.x > petFront) {
        grinding.element.classList.remove("is-grinding");
        grinding = null;
        game.classList.remove("is-grinding");
        velocityY = 100;
        setPet("skating");
      }
    }

    obstacles = obstacles.filter(function (obstacle) {
      if (obstacle.x + obstacle.width < -80) {
        obstacle.element.remove();
        return false;
      }
      return true;
    });

    var petMode = grinding ? "grinding" : jumpHeight > 5 ? (velocityY > 0 ? "launching" : "ollie") : "skating";
    setPet(petMode);
  }

  function frame(time) {
    updateVisibility();
    var delta = Math.min((time - (lastTime || time)) / 1000, 0.034);
    lastTime = time;
    update(delta);
    requestAnimationFrame(frame);
  }

  document.addEventListener("keydown", function (event) {
    if (!active || event.target.matches("input, textarea, select")) return;
    if (["Space", "ArrowUp", "KeyW"].indexOf(event.code) > -1) {
      event.preventDefault();
      startOrJump();
    }
  });

  course.addEventListener("pointerdown", function (event) {
    if (event.target.closest("a, button")) return;
    startOrJump();
  });

  startButton.addEventListener("click", function (event) {
    event.stopPropagation();
    startOrJump();
  });

  window.addEventListener("resize", function () {
    gameX = Math.max(58, Math.min(170, innerWidth * 0.14));
    baseLift = innerWidth < 700 ? 36 : 42;
  });

  window.addEventListener("sitepetready", function () {
    petReady = true;
    if (active) setPet("skating");
  });

  requestAnimationFrame(frame);
})();
