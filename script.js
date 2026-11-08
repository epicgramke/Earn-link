const tasks = [
  {
    id: 1,
    name: "Campus Link KE Task #01",
    platform: "YouTube",
    reward: 50,
    url: "https://www.youtube.com/results?search_query=Campus+Link+KE",
    instructions: "Search for Campus Link KE on YouTube. Review its channel and prepare a short content research report."
  },
  {
    id: 2,
    name: "Campus Link KE Task #02",
    platform: "YouTube",
    reward: 50,
    url: "https://www.youtube.com/results?search_query=Campus+Link+KE",
    instructions: "Review Campus Link KE videos, titles and thumbnails. Prepare your findings."
  },
  {
    id: 3,
    name: "Campus Link KE Task #03",
    platform: "YouTube",
    reward: 75,
    url: "https://www.youtube.com/results?search_query=Campus+Link+KE",
    instructions: "Analyse the content style and presentation of Campus Link KE."
  },
  {
    id: 4,
    name: "Campus Link KE Task #04",
    platform: "YouTube",
    reward: 75,
    url: "https://www.youtube.com/results?search_query=Campus+Link+KE",
    instructions: "Review Campus Link KE content and prepare a short research report."
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
      <p class="meta">Campus Link KE • Research task</p>
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
    target.textContent = "Search Campus Link KE on YouTube →";
  }

  // Automatically start the one-hour timer.
  const startTime = Date.now();
  const endTime = startTime + 3600000;

  let completed = false;

  function updateTimer() {
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    if (timer) {
      timer.textContent = [hours, minutes, seconds]
        .map(value => String(value).padStart(2, "0"))
        .join(":");
    }

    if (remaining === 0 && !completed) {
      completed = true;
      clearInterval(interval);

      if (taskMsg) {
        taskMsg.textContent =
          "One-hour timer completed. You can now submit your proof.";
      }
    }
  }

  updateTimer();
  const interval = setInterval(updateTimer, 1000);

  if (submitButton) {
    submitButton.onclick = () => {
      if (!completed) {
        if (taskMsg) {
          taskMsg.textContent = "Please wait until the one-hour timer finishes.";
        }
        return;
      }

      const proof = document.getElementById("proof");

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
      clearInterval(interval);
    };
  }
}

initAuth();
setupForms();
renderTasks();
initTask();
