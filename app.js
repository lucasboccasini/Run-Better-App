(() => {
  const date = document.getElementById("today-date");
  date.textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  const workouts = [
    { title: "Easy neighborhood run", category: "Running", level: "Beginner", time: "20 min", detail: "A gentle loop to get some fresh air.", icon: "↗" },
    { title: "Leg day basics", category: "Strength", level: "Beginner", time: "18 min", detail: "Simple lower body lifts to build a base.", icon: "⟷" },
    { title: "Stretch and reset", category: "Mobility", level: "Beginner", time: "12 min", detail: "Loosen up and make space to breathe.", icon: "✳" },
    { title: "Steady trail miles", category: "Running", level: "Experienced", time: "35 min", detail: "Find a steady rhythm on rolling ground.", icon: "⌁" },
    { title: "Full body strength", category: "Strength", level: "Experienced", time: "30 min", detail: "A balanced session with room to progress.", icon: "⟷" },
    { title: "Easy spin", category: "Cycling", level: "Beginner", time: "25 min", detail: "An easy ride to build your engine.", icon: "◉" },
    { title: "Tempo ride", category: "Cycling", level: "Experienced", time: "40 min", detail: "A focused ride with a few stronger efforts.", icon: "◉" },
    { title: "After-sport mobility", category: "Mobility", level: "Experienced", time: "16 min", detail: "A thoughtful cooldown for hard-working legs.", icon: "✳" }
  ];
  const list = document.getElementById("workout-list");
  const empty = document.getElementById("empty-state");
  const search = document.getElementById("activity-search");
  const categoryButtons = Array.from(document.querySelectorAll(".activity-tile"));
  const levelButtons = Array.from(document.querySelectorAll(".level-button"));
  let activeCategory = "all";
  let activeLevel = "Beginner";

  const drawWorkouts = () => {
    const term = search.value.trim().toLowerCase();
    const shown = workouts.filter(item =>
      item.level === activeLevel &&
      (activeCategory === "all" || item.category === activeCategory) &&
      (term === "" || (item.title + " " + item.category + " " + item.detail).toLowerCase().includes(term))
    );
    list.innerHTML = shown.map(item =>
      '<button class="workout-card" type="button" data-title="' + item.title + '" data-category="' + item.category + '">' +
        '<span class="workout-top"><span class="workout-tag">' + item.category + '</span><span class="workout-time">' + item.time + '</span></span>' +
        '<strong>' + item.title + '</strong><small>' + item.detail + '</small><span class="workout-arrow" aria-hidden="true">↗</span>' +
      '</button>'
    ).join("");
    empty.hidden = shown.length > 0;
    list.querySelectorAll(".workout-card").forEach(card => card.addEventListener("click", () => openTimer(card.dataset.title, card.dataset.category)));
  };

  categoryButtons.forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;
    categoryButtons.forEach(item => item.classList.toggle("selected", item === button));
    drawWorkouts();
  }));
  levelButtons.forEach(button => button.addEventListener("click", () => {
    activeLevel = button.dataset.level;
    levelButtons.forEach(item => item.classList.toggle("active", item === button));
    drawWorkouts();
  }));
  search.addEventListener("input", drawWorkouts);

  const modal = document.getElementById("run-modal");
  const closeRun = document.getElementById("close-run");
  const timerToggle = document.getElementById("timer-toggle");
  const finishRun = document.getElementById("finish-run");
  const timerDisplay = document.getElementById("run-timer");
  const hint = document.getElementById("run-hint");
  const modalCategory = document.getElementById("modal-category");
  const modalTitle = document.getElementById("run-title");
  let interval = null, seconds = 0, running = false;

  const formatTime = value => Math.floor(value / 60).toString().padStart(2, "0") + ":" + (value % 60).toString().padStart(2, "0");
  const renderTimer = () => { timerDisplay.textContent = formatTime(seconds); };
  const openTimer = (title, category) => {
    modalTitle.textContent = title || "Ready when you are.";
    modalCategory.textContent = category ? category.toUpperCase() + " · YOUR TIME" : "A LITTLE TIME FOR YOU";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeRun.focus();
  };
  const closeModal = () => {
    if (running) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  const stopTimer = () => {
    clearInterval(interval);
    interval = null;
    running = false;
    timerToggle.querySelector("span:last-child").textContent = "Resume";
    timerToggle.querySelector(".play-icon").textContent = "▶";
  };

  closeRun.addEventListener("click", closeModal);
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  timerToggle.addEventListener("click", () => {
    if (running) {
      stopTimer();
      hint.textContent = "Paused. Take a moment if you need one.";
      return;
    }
    running = true;
    timerToggle.querySelector("span:last-child").textContent = "Pause";
    timerToggle.querySelector(".play-icon").textContent = "Ⅱ";
    hint.textContent = "You’re doing great. Keep your own pace.";
    interval = setInterval(() => { seconds += 1; renderTimer(); }, 1000);
  });
  finishRun.addEventListener("click", () => {
    stopTimer();
    const duration = formatTime(seconds);
    hint.textContent = seconds > 0 ? "Lovely work showing up. Time: " + duration + "." : "Whenever you’re ready, your next session is waiting.";
    timerToggle.querySelector("span:last-child").textContent = "Begin again";
    seconds = 0;
    renderTimer();
  });
  drawWorkouts();
})();