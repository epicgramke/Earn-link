
const taskNote = `CLICK NEXT AND WATCH THE YOUTUBE VIDEO FOR 20-MINUTES VIDEO!

PLEASE SCREEN RECORD YOUR SCREEN TO PROOF U FINISHED THE TASK 
ONCE DONE SUBMIT YOUR PROOF FOR REVIEW 
Thank you for participating! We hope you enjoy the task. ❤️

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

  box.innerHTML = tasks.map(task => `
    <article class="task-card">
      <p class="eyebrow">YOUTUBE TASK</p>
      <h2>${task.name}</h2>
      <p class="meta">Channel research • 20 minutes • Proof required</p>
      <div class="reward">KSh ${task.reward}</div>
      <a class="btn full" href="task.html?id=${task.id}">
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

  if (reward) {
    reward.textContent = `KSh ${task.reward}`;
  }

  if (instructions) {
    instructions.textContent = task.instructions;
    instructions.style.whiteSpace = "pre-line";
  }

  if (target) {
    target.href = task.url;
    target.target = "_blank";
    target.rel = "noopener noreferrer";
    target.textContent = "CLICK NEXT →";
  }

  // 20-minute demonstration timer
  const storageKey = `earnlink_task_${task.id}_start`;
  let startTime = Number(sessionStorage.getItem(storageKey));

  if (!startTime) {
    startTime = Date.now();
    sessionStorage.setItem(storageKey, String(startTime));
  }

  const endTime = startTime + 20 * 60 * 1000;
  let completed = false;

  function updateTimer() {
    const remaining = Math.max(
      0,
      Math.ceil((endTime - Date.now()) / 1000)
    );

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    if (timer) {
      timer.textContent =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`;
    }

    if (remaining === 0 && !completed) {
      completed = true;
      clearInterval(interval);

      if (taskMsg) {
        taskMsg.textContent =
          "Research time completed. You can now submit your proof.";
      }
    }
  }

  updateTimer();
  const interval = setInterval(updateTimer, 1000);

  if (submitButton) {
    submitButton.onclick = () => {
      if (!completed) {
        if (taskMsg) {
          taskMsg.textContent =
            "Please wait until the 20-minute timer finishes.";
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

      sessionStorage.removeItem(storageKey);

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
