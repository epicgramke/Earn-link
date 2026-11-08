
// =====================================
// EARNLINK - MAIN SCRIPT
// VERSION 2.0
// =====================================

const taskNote = `CLICK OPEN YOUTUBE AND COMPLETE THE 30 SECONDS CONTENT REVIEW!

PLEASE SCREEN RECORD YOUR SCREEN TO SHOW YOUR COMPLETION.
ONCE DONE, SELECT YOUR MP4 PROOF VIDEO AND CLICK NEXT.

THANK YOU FOR PARTICIPATING! ❤️`;

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

const TIMER_DURATION = 30 * 1000;

// =====================================
// STORAGE HELPERS
// =====================================

function getStoredJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function getCurrentUser() {
  return getStoredJSON("earnlinkUser", {});
}

function getUserKey() {
  return (getCurrentUser().email || "guest")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");
}

function getTimerKey(taskId) {
  return `earnlink_timer_v4_${getUserKey()}_${taskId}`;
}

function getSubmissions() {
  return getStoredJSON("earnlinkSubmissions", []);
}

// =====================================
// LOGOUT
// =====================================

function logout() {
  localStorage.removeItem("earnlinkUser");
  window.location.href = "login.html";
}

// =====================================
// LOGIN AND REGISTRATION
// =====================================

function initAuth() {

  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const email = document.getElementById("email")?.value.trim();
      const password = document.getElementById("password")?.value;

      if (!email || !password) {
        alert("PLEASE ENTER YOUR EMAIL AND PASSWORD.");
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
    registerForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const email = document.getElementById("email")?.value.trim();
      const password = document.getElementById("password")?.value;

      if (!email || !password) {
        alert("PLEASE FILL IN ALL REQUIRED FIELDS.");
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

// =====================================
// DISPLAY TASKS
// =====================================

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
      <p class="task-reward">
        REWARD: KSh ${task.reward}
      </p>
      <p>DURATION: 30 SECONDS</p>
      <a class="btn" href="task.html?id=${task.id}">
        START TASK →
      </a>
    `;

    taskContainer.appendChild(card);
  });
}

// =====================================
// INDIVIDUAL TASK PAGE
// =====================================

function initTask() {

  const taskName = document.getElementById("taskName");

  if (!taskName) return;

  const params = new URLSearchParams(window.location.search);

  const taskId = Number(params.get("id"));

  const task = tasks.find(item => item.id === taskId);

  if (!task) {
    taskName.textContent = "TASK NOT FOUND";
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

  // =====================================
  // YOUTUBE LINK
  // =====================================

  const timerKey = getTimerKey(task.id);

  let startTime = Number(localStorage.getItem(timerKey)) || 0;

  if (target) {

    target.href = task.url;
    target.target = "_blank";
    target.rel = "noopener noreferrer";
    target.textContent = "OPEN YOUTUBE →";

    target.addEventListener("click", function() {

      // START TIMER ONLY ON FIRST YOUTUBE CLICK

      if (!startTime) {
        startTime = Date.now();

        localStorage.setItem(timerKey, String(startTime));

        updateTimer();
      }

    });
  }

  // =====================================
  // TIMER DISPLAY
  // =====================================

  if (timer) {
    timer.style.color = "red";
    timer.style.borderColor = "red";
    timer.style.fontWeight = "bold";
  }

  let timerInterval = null;

  let timerFinished = false;
  let validProof = false;

  function updateButton() {

    if (submitButton) {
      submitButton.disabled =
        !(timerFinished && validProof);
    }
  }

  // =====================================
  // 30-SECOND COUNTDOWN
  // =====================================

  function updateTimer() {

    if (!startTime) {

      if (timer) {
        timer.textContent = "00:30";
      }

      timerFinished = false;
      updateButton();

      return;
    }

    const elapsed = Date.now() - startTime;

    const remaining = Math.max(
      0,
      TIMER_DURATION - elapsed
    );

    const seconds = Math.ceil(remaining / 1000);

    if (timer) {
      timer.textContent =
        `00:${String(seconds).padStart(2, "0")}`;
    }

    if (remaining <= 0) {

      timerFinished = true;

      if (timer) {
        timer.textContent = "00:00";
      }

      if (taskMsg) {
        taskMsg.textContent =
          "30-SECOND REVIEW COMPLETED. SELECT YOUR MP4 PROOF VIDEO.";
      }

      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    updateButton();
  }

  if (startTime) {
    updateTimer();
    timerInterval = setInterval(updateTimer, 250);
  } else {
    updateTimer();
  }

  // =====================================
  // MP4 PROOF SELECTION
  // =====================================

  if (proof) {

    proof.setAttribute("accept", ".mp4,video/mp4");

    proof.addEventListener("change", function() {

      validProof = false;

      const file = proof.files?.[0];

      if (!file) {

        if (taskMsg) {
          taskMsg.textContent = "NO PROOF SELECTED.";
        }

        updateButton();
        return;
      }

      const isMP4 = file.name.toLowerCase().endsWith(".mp4");

      if (!isMP4) {

        alert("ONLY MP4 VIDEO FILES ARE ACCEPTED.");

        proof.value = "";

        if (taskMsg) {
          taskMsg.textContent =
            "PLEASE SELECT AN MP4 VIDEO.";
        }

        updateButton();
        return;
      }

      validProof = true;

      if (taskMsg) {
        taskMsg.textContent =
          `MP4 SELECTED: ${file.name}`;
      }

      updateButton();

      if (!timerFinished && taskMsg) {
        taskMsg.textContent +=
          " WAITING FOR TIMER TO FINISH.";
      }

    });
  }

  // =====================================
  // PREVENT DUPLICATE SUBMISSIONS
  // =====================================

  const user = getCurrentUser();

  const submissions = getSubmissions();

  const alreadySubmitted = submissions.some(item =>
    item.taskId === task.id &&
    item.userEmail === (user.email || "Guest")
  );

  if (alreadySubmitted) {

    if (taskMsg) {
      taskMsg.textContent =
        "YOU HAVE ALREADY SUBMITTED THIS TASK. STATUS: PENDING VERIFICATION.";
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    return;
  }

  // =====================================
  // SUBMIT TASK
  // =====================================

  if (submitButton) {

    submitButton.disabled = true;
    submitButton.textContent = "NEXT →";

    submitButton.addEventListener("click", function() {

      // CHECK TIMER

      const elapsed = startTime
        ? Date.now() - startTime
        : 0;

      if (elapsed < TIMER_DURATION) {

        if (taskMsg) {
          taskMsg.textContent =
            "PLEASE COMPLETE THE 30-SECOND REVIEW FIRST.";
        }

        return;
      }

      // CHECK MP4

      const file = proof?.files?.[0];

      if (!file || !file.name.toLowerCase().endsWith(".mp4")) {

        if (taskMsg) {
          taskMsg.textContent =
            "PLEASE SELECT A VALID MP4 VIDEO.";
        }

        return;
      }

      // CHECK DUPLICATES AGAIN

      const currentSubmissions = getSubmissions();

      const duplicate = currentSubmissions.some(item =>
        item.taskId === task.id &&
        item.userEmail === (user.email || "Guest")
      );

      if (duplicate) {

        if (taskMsg) {
          taskMsg.textContent =
            "THIS TASK HAS ALREADY BEEN SUBMITTED.";
        }

        submitButton.disabled = true;

        return;
      }

      // RECORD SUBMISSION

      const submission = {

        taskId: task.id,

        taskName: task.name,

        platform: task.platform,

        reward: task.reward,

        userEmail: user.email || "Guest",

        proofFileName: file.name,

        submittedAt: new Date().toISOString(),

        status: "Pending Verification"

      };

      currentSubmissions.push(submission);

      localStorage.setItem(
        "earnlinkSubmissions",
        JSON.stringify(currentSubmissions)
      );

      // SUCCESS MESSAGE

      if (taskMsg) {
        taskMsg.textContent =
          "SUCCESS! YOUR SUBMISSION HAS BEEN RECORDED. STATUS: PENDING VERIFICATION.";
      }

      submitButton.disabled = true;

      submitButton.textContent = "SUBMITTED ✓";

      validProof = false;

      if (proof) {
        proof.disabled = true;
      }

      if (timerInterval) {
        clearInterval(timerInterval);
      }

    });
  }
}

// =====================================
// INITIALIZE WEBSITE
// =====================================

document.addEventListener("DOMContentLoaded", function() {

  initAuth();

  renderTasks();

  initTask();

});
