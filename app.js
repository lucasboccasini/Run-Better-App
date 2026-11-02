(() => {
  const modal = document.getElementById("run-modal");
  const startRun = document.getElementById("start-run");
  const closeRun = document.getElementById("close-run");
  const timerToggle = document.getElementById("timer-toggle");
  const finishRun = document.getElementById("finish-run");
  const timerDisplay = document.getElementById("run-timer");
  const hint = document.getElementById("run-hint");
  let interval = null;
  let seconds = 0;
  let running = false;

  const formatTime = value => {
    const minutes = Math.floor(value / 60).toString().padStart(2, "0");
    const remainder = (value % 60).toString().padStart(2, "0");
    return minutes + ":" + remainder;
  };

  const renderTimer = () => { timerDisplay.textContent = formatTime(seconds); };
  const openModal = () => {
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
    startRun.focus();
  };
  const stopTimer = () => {
    clearInterval(interval);
    interval = null;
    running = false;
    timerToggle.querySelector("span:last-child").textContent = "Resume run";
    timerToggle.querySelector(".play-icon").textContent = "▶";
  };

  startRun.addEventListener("click", openModal);
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
    timerToggle.querySelector("span:last-child").textContent = "Pause run";
    timerToggle.querySelector(".play-icon").textContent = "Ⅱ";
    hint.textContent = "You’re doing great. Keep your own pace.";
    interval = setInterval(() => { seconds += 1; renderTimer(); }, 1000);
  });

  finishRun.addEventListener("click", () => {
    stopTimer();
    const duration = formatTime(seconds);
    hint.textContent = seconds > 0 ? "Nice work showing up. Run time: " + duration + "." : "Whenever you’re ready, your next run is waiting.";
    timerToggle.querySelector("span:last-child").textContent = "Begin another run";
    seconds = 0;
    renderTimer();
  });
})();