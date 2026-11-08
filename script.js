
const taskNote = `PLEASE SCREEN RECORD YOUR SCREEN TO SHOW YOUR COMPLETION.
ONCE DONE, SUBMIT YOUR PROOF FOR REVIEW.
`;

const channels = [
  "https://www.youtube.com/@kenyanationaltv",
  "https://www.youtube.com/@EPICGRAMke002",
  "https://www.youtube.com/@epicgramke3",
  "https://www.youtube.com/@EPICGRAMKE001",
  "https://www.youtube.com/@EPICGRAMART",
  "https://www.youtube.com/@RANDOMWITHGRAM",
  "https://www.youtube.com/@gramadvantures",
  "https://www.youtube.com/@equitableparty",
  "https://www.youtube.com/@IsaacMabeya-x8t",
  "https://www.youtube.com/@TRACIEVLOGS"
];

const tasks = channels.map((url, index) => ({
  id: index + 1,
  name: `YOUTUBE ${index + 1}`,
  platform: "YouTube",
  reward: 10,
  url,
  instructions: taskNote
}));

// -----------------------------
// GENERAL FUNCTIONS
// -----------------------------

function logout() {
  localStorage.removeItem("earnlinkUser");
  window.location.href = "login.html";
}

function initAuth() {
  const user = localStorage.getItem("earnlinkUser");

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email")?.value.trim();
      const password = document.getElementById("password")?.value;

      if (!email || !password) {
        alert("Please enter your email and password.");
        return;
      }

      localStorage.setItem(
        "earnlinkUser",
        JSON.stringify({ email })
      );

      window.location.href = "index.html";
    });
  }

  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.getElementById("email")?.value.trim();
      const password = document.getElementById("password")?.value;

      if (!email || !password) {
        alert("Please fill in all required fields.");
        return;
      }

      localStorage.setItem(
        "earnlinkUser",
        JSON.stringify({ email })
      );

      window.location.href = "index.html";
    });
  }
}

// -----------------------------
// TASK LIST
// -----------------------------

function renderTasks() {
  const taskContainer = document.getElementById("taskList");

  if (!taskContainer) return;

  taskContainer.innerHTML = "";

  tasks.forEach(task => {
    const card = document.createElement("div");

    card.className = "task-card";

    card.innerHTML = `
      <h3>${task.name}</h3>
      <p>${task.platform} Content Review</p>
      <p class="task-reward">Reward: KSh ${task.reward}</p>
      <p>Duration: 20 minutes</p>
      <a class="btn" href="task.html?id=${task.id}">
        Start Task
      </a>
    `;

    taskContainer.appendChild(card);
  });
}

// -----------------------------
// TASK DETAILS AND TIMER
// -----------------------------

function initTask() {
  const taskName = document.getElementById("taskName");

  if (!taskName) return;

  const params = new URLSearchParams(window.location.search);
  const taskId = Number(params.get("id"));

  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    taskName.textContent = "Task not found";
    return;
  }

  const reward = document.getElementById("reward");
  const instructions = document.getElementById("instructions");
  const target = document.getElementById("target");
  const timer = document.getElementById("timer");
  const proof = document.getElementById("proof");
  const submitButton = document.getElementById("submitTask");
  const taskMsg = document.getElementById("taskMsg");

  taskName.textContent = task.name;

  if (reward) {
    reward.textContent = `KSh ${task.reward}`;
  }

  if (instructions) {
    instructions.textContent = task.instructions;
  }

  if (target) {
    target.href = task.url;
    target.target = "_blank";
    target.rel = "noopener noreferrer";
  }

  // -----------------------------
  // 20-MINUTE TIMER
  // -----------------------------

  const duration = 20 * 60 * 1000;
  const timerKey = `earnlink_timer_${task.id}`;

  let startTime = sessionStorage.getItem(timerKey);

  if (!startTime) {
    startTime = Date.now();
    sessionStorage.setItem(timerKey, startTime);
  } else {
    startTime = Number(startTime);
  }

  let timerInterval;

  function updateTimer() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, duration - elapsed);

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    if (timer) {
      timer.textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
    }

    if (remaining <= 0) {
      clearInterval(timerInterval);

      if (timer) {
        timer.textContent = "20:00 completed";
      }

      if (taskMsg) {
        taskMsg.textContent =
          "Review period completed. You can now submit your proof.";
      }

      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  }

  if (submitButton) {
    submitButton.disabled = true;
  }

  updateTimer();

  timerInterval = setInterval(updateTimer, 1000);

  // -----------------------------
  // PROOF FILE SELECTION
  // -----------------------------

  if (proof) {
    proof.addEventListener("change", function () {
      if (taskMsg) {
        taskMsg.textContent = proof.files.length
          ? `Selected: ${proof.files[0].name}`
          : "No proof selected.";
      }
    });
  }

  // -----------------------------
  // SUBMIT TASK
  // -----------------------------

  if (submitButton) {
    submitButton.addEventListener("click", function () {
      const elapsed = Date.now() - startTime;

      if (elapsed < duration) {
        if (taskMsg) {
          taskMsg.textContent =
            "Please complete the 20-minute review period first.";
        }
        return;
      }

      if (!proof || !proof.files || proof.files.length === 0) {
        if (taskMsg) {
          taskMsg.textContent =
            "Please select your screen recording proof.";
        }
        return;
      }

      const user = JSON.parse(
        localStorage.getItem("earnlinkUser") || "{}"
      );

      const submissions = JSON.parse(
        localStorage.getItem("earnlinkSubmissions") || "[]"
      );

      submissions.push({
        taskId: task.id,
        taskName: task.name,
        reward: task.reward,
        userEmail: user.email || "Guest",
        proofFileName: proof.files[0].name,
        submittedAt: new Date().toISOString(),
        status: "Pending review"
      });

      localStorage.setItem(
        "earnlinkSubmissions",
        JSON.stringify(submissions)
      );

      if (taskMsg) {
        taskMsg.textContent =
          "Your submission has been recorded and is pending review.";
      }

      submitButton.disabled = true;
      clearInterval(timerInterval);
    });
  }
}

// -----------------------------
// INITIALIZE WEBSITE
// -----------------------------

document.addEventListener("DOMContentLoaded", function () {
  initAuth();
  renderTasks();
  initTask();
});
