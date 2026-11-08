
const tasks = [
  {
    id: 1,
    name: "YouTube Channel Research #01",
    platform: "YouTube",
    reward: 50,
    username: "Enter YouTube username",
    url: "https://www.youtube.com/results?search_query=YouTube+channels",
    instructions: "Search for the supplied YouTube username. Review 10 relevant channels. Record their names and the type of content they publish. Choose one video and analyse its content."
  },
  {
    id: 2,
    name: "YouTube Channel Research #02",
    platform: "YouTube",
    reward: 50,
    username: "Enter YouTube username",
    url: "https://www.youtube.com/results?search_query=YouTube+channel+research",
    instructions: "Research 10 YouTube channels. Compare their video titles, thumbnails and content topics. Write a short report about what makes their content different."
  },
  {
    id: 3,
    name: "YouTube Content Analysis #03",
    platform: "YouTube",
    reward: 75,
    username: "Enter YouTube username",
    url: "https://www.youtube.com/results?search_query=YouTube+content+analysis",
    instructions: "Review 10 channels and analyse their content styles. Watch a relevant video and write down its main points."
  },
  {
    id: 4,
    name: "YouTube Content Analysis #04",
    platform: "YouTube",
    reward: 75,
    username: "Enter YouTube username",
    url: "https://www.youtube.com/results?search_query=YouTube+video+research",
    instructions: "Research 10 channels, compare their video presentation and prepare a brief content research report."
  }
];

function logout() {
  localStorage.removeItem("earnlink_logged_in");
  location.href = "login.html";
}

function initAuth() {
  const path = location.pathname.split("/").pop();

  const protectedPages = [
    "index.html",
    "tasks.html",
    "task.html",
    "verification.html",
    "wallet.html"
  ];

  if (
    protectedPages.includes(path) &&
    !localStorage.getItem("earnlink_logged_in")
  ) {
    location.href = "login.html";
  }
}

function setupForms() {
  const signup = document.getElementById("signupForm");

  if (signup) {
    signup.onsubmit = e => {
      e.preventDefault();

      const password = document.getElementById("password");
      const confirm = document.getElementById("confirm");
      const msg = document.getElementById("msg");

      if (password && confirm && password.value !== confirm.value) {
        if (msg) msg.textContent = "Passwords do not match.";
        return;
      }

      localStorage.setItem("earnlink_logged_in", "1");
      location.href = "index.html";
    };
  }

  const login = document.getElementById("loginForm");

  if (login) {
    login.onsubmit = e => {
      e.preventDefault();
      localStorage.setItem("earnlink_logged_in", "1");
      location.href = "index.html";
    };
  }
}

function renderTasks() {
  const box = document.getElementById("taskList");
  if (!box) return;

  box.innerHTML = tasks.map(t => `
    <article class="task-card">
      <p class="eyebrow">${t.platform}</p>
      <h2>${t.name}</h2>
      <p class="meta">Channel research • 10 channels • Proof required</p>
      <div class="reward">KSh ${t.reward}</div>
      <a class="btn full" href="task.html?id=${t.id}">
        Start Task →
      </a>
    </article>
  `).join("");
}

function initTask() {
  const box = document.getElementById("taskName");
  if (!box) return;

  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id")) || 1;
  const task = tasks.find(t => t.id === id) || tasks[0];

  const reward = document.getElementById("reward");
  const instructions = document.getElementById("instructions");
  const target = document.getElementById("target");
  const timer = document.getElementById("timer");
  const submitButton = document.getElementById("submitTask");
  const taskMsg = document.getElementById("taskMsg");

  box.textContent = task.name;

  if (reward) reward.textContent = `KSh ${task.reward}`;
  if (instructions) instructions.textContent = task.instructions;

  if (target) {
    target.href = task.url;
    target.target = "_blank";
    target.rel = "noopener noreferrer";
    target.textContent = "Search on YouTube →";
  }

  let seconds = 3600;
  let interval = null;
  let started = false;

  function updateTimer() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (timer) {
      timer.textContent = [hours, minutes, remainingSeconds]
        .map(value => String(value).padStart(2, "0"))
        .join(":");
    }
  }

  updateTimer();

  const startButton = document.getElementById("startTimer");

  if (startButton) {
    startButton.onclick = () => {
      if (started) return;

      started = true;
      startButton.disabled = true;
      startButton.textContent = "Timer Running";

      interval = setInterval(() => {
        if (seconds > 0) {
          seconds--;
          updateTimer();
        } else {
          clearInterval(interval);
          if (taskMsg) {
            taskMsg.textContent =
              "Research time completed. You can now submit your proof.";
          }
        }
      }, 1000);
    };
  }

  if (submitButton) {
    submitButton.onclick = () => {
      const proof = document.getElementById("proof");

      if (seconds > 0) {
        if (taskMsg) {
          taskMsg.textContent =
            "Please complete the one-hour research timer first.";
        }
        return;
      }

      if (!proof || !proof.files || !proof.files[0]) {
        if (taskMsg) {
          taskMsg.textContent = "Please upload your proof file.";
        }
        return;
      }

      const submissions = JSON.parse(
        localStorage.getItem("earnlink_submissions") || "[]"
      );

      submissions.push({
        taskId: task.id,
        taskName: task.name,
        reward: task.reward,
        proofName: proof.files[0].name,
        submittedAt: new Date().toISOString(),
        status: "Pending verification"
      });

      localStorage.setItem(
        "earnlink_submissions",
        JSON.stringify(submissions)
      );

      if (taskMsg) {
        taskMsg.textContent =
          "Submitted successfully. Your task is pending verification.";
      }

      submitButton.disabled = true;
      if (interval) clearInterval(interval);
    };
  }
}

initAuth();
setupForms();
renderTasks();
initTask();
