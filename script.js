/* =========================================================
   EARNLINK
   YouTube Content Review Task System
   ========================================================= */

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

/* =========================================================
   TASKS
   ========================================================= */

const tasks = channels.map((url, index) => ({
  id: index + 1,
  name: `YOUTUBE ${index + 1}`,
  platform: "YouTube",
  reward: 10,
  url: url,

  instructions:
    "OPEN THE YOUTUBE CHANNEL BELOW.\n" +
    "REVIEW THE ASSIGNED CONTENT.\n" +
    "RECORD YOUR SCREEN WHILE COMPLETING THE REVIEW.\n" +
    "UPLOAD YOUR RECORDING AS PROOF FOR REVIEW."
}));

/* =========================================================
   STORAGE
   ========================================================= */

function getUser() {
  try {
    return JSON.parse(
      localStorage.getItem("earnlinkUser") || "null"
    );
  } catch (error) {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem(
    "earnlinkUser",
    JSON.stringify(user)
  );
}

function getSubmissions() {
  try {
    return JSON.parse(
      localStorage.getItem("earnlinkSubmissions") || "[]"
    );
  } catch (error) {
    return [];
  }
}

function saveSubmissions(submissions) {
  localStorage.setItem(
    "earnlinkSubmissions",
    JSON.stringify(submissions)
  );
}

/* =========================================================
   AUTHENTICATION
   ========================================================= */

function logout() {
  localStorage.removeItem("earnlinkUser");
  window.location.href = "login.html";
}

function isLoggedIn() {
  return !!getUser();
}

function protectPage() {
  const page =
    window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();

  const publicPages = [
    "",
    "login.html",
    "signup.html"
  ];

  if (
    !publicPages.includes(page) &&
    !isLoggedIn()
  ) {
    window.location.href = "login.html";
  }
}

function initAuth() {

  /* LOGIN */

  const loginForm =
    document.getElementById("loginForm");

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      function(event) {

        event.preventDefault();

        const phone =
          document
            .getElementById("phone")
            ?.value
            .trim();

        const password =
          document
            .getElementById("password")
            ?.value;

        const message =
          document.getElementById("msg");

        if (!phone || !password) {

          if (message) {
            message.textContent =
              "Please enter your phone number and password.";
          }

          return;
        }

        saveUser({
          phone: phone
        });

        window.location.href =
          "index.html";
      }
    );
  }

  /* SIGN UP */

  const registerForm =
    document.getElementById(
      "registerForm"
    );

  if (registerForm) {

    registerForm.addEventListener(
      "submit",
      function(event) {

        event.preventDefault();

        const phone =
          document
            .getElementById("phone")
            ?.value
            .trim();

        const password =
          document
            .getElementById("password")
            ?.value;

        const message =
          document.getElementById("msg");

        if (!phone || !password) {

          if (message) {
            message.textContent =
              "Please fill in all required fields.";
          }

          return;
        }

        saveUser({
          phone: phone
        });

        window.location.href =
          "index.html";
      }
    );
  }
}

/* =========================================================
   TASK LIST
   ========================================================= */

function renderTasks() {

  const taskList =
    document.getElementById(
      "taskList"
    );

  if (!taskList) {
    return;
  }

  taskList.innerHTML = "";

  tasks.forEach(function(task) {

    const card =
      document.createElement("div");

    card.className =
      "task-card";

    card.innerHTML = `
      <h3>${task.name}</h3>

      <p>
        ${task.platform} Content Review
      </p>

      <p class="task-reward">
        Reward: KSh ${task.reward}
      </p>

      <p>
        Review duration: 10 seconds
      </p>

      <a
        class="btn"
        href="task.html?id=${task.id}"
      >
        Start Task
      </a>
    `;

    taskList.appendChild(card);
  });
}

/* =========================================================
   TASK DETAILS
   ========================================================= */

function initTask() {

  const taskName =
    document.getElementById(
      "taskName"
    );

  if (!taskName) {
    return;
  }

  const params =
    new URLSearchParams(
      window.location.search
    );

  const taskId =
    Number(
      params.get("id")
    );

  const task =
    tasks.find(function(item) {
      return item.id === taskId;
    });

  if (!task) {

    taskName.textContent =
      "Task not found";

    return;
  }

  const reward =
    document.getElementById(
      "reward"
    );

  const instructions =
    document.getElementById(
      "instructions"
    );

  const target =
    document.getElementById(
      "target"
    );

  const timer =
    document.getElementById(
      "timer"
    );

  const proof =
    document.getElementById(
      "proof"
    );

  const submitButton =
    document.getElementById(
      "submitTask"
    );

  const taskMsg =
    document.getElementById(
      "taskMsg"
    );

  taskName.textContent =
    task.name;

  if (reward) {
    reward.textContent =
      `KSh ${task.reward}`;
  }

  if (instructions) {
    instructions.textContent =
      task.instructions;
  }

  if (target) {

    target.href =
      task.url;

    target.target =
      "_blank";

    target.rel =
      "noopener noreferrer";
  }

  /* ---------------------------------------------------------
     TIMER
     --------------------------------------------------------- */

  const duration =
    10000;

  const timerKey =
    `earnlink_timer_${task.id}`;

  let startTime =
    sessionStorage.getItem(
      timerKey
    );

  if (!startTime) {

    startTime =
      Date.now();

    sessionStorage.setItem(
      timerKey,
      String(startTime)
    );

  } else {

    startTime =
      Number(startTime);
  }

  let timerInterval = null;

  function updateTimer() {

    const elapsed =
      Date.now() -
      startTime;

    const remaining =
      Math.max(
        0,
        duration - elapsed
      );

    if (timer) {

      if (remaining > 0) {

        timer.textContent =
          `${Math.ceil(
            remaining / 1000
          )}s`;

      } else {

        timer.textContent =
          "Completed";
      }
    }

    if (remaining <= 0) {

      if (timerInterval) {
        clearInterval(
          timerInterval
        );
      }

      if (taskMsg) {

        taskMsg.textContent =
          "Review completed. Upload your proof to submit.";
      }

      if (submitButton) {
        submitButton.disabled =
          false;
      }
    }
  }

  if (submitButton) {
    submitButton.disabled =
      true;
  }

  updateTimer();

  timerInterval =
    setInterval(
      updateTimer,
      100
    );

  /* ---------------------------------------------------------
     PROOF FILE
     --------------------------------------------------------- */

  if (proof) {

    proof.addEventListener(
      "change",
      function() {

        if (!proof.files.length) {

          if (taskMsg) {
            taskMsg.textContent =
              "No proof selected.";
          }

          return;
        }

        const file =
          proof.files[0];

        const maxSize =
          100 * 1024 * 1024;

        if (file.size > maxSize) {

          proof.value =
            "";

          if (taskMsg) {
            taskMsg.textContent =
              "The recording must be smaller than 100 MB.";
          }

          return;
        }

        if (
          !file.type.startsWith(
            "video/"
          )
        ) {

          proof.value =
            "";

          if (taskMsg) {
            taskMsg.textContent =
              "Please select a video recording.";
          }

          return;
        }

        if (taskMsg) {

          taskMsg.textContent =
            `Selected: ${file.name}`;
        }
      }
    );
  }

  /* ---------------------------------------------------------
     SUBMIT TASK
     --------------------------------------------------------- */

  if (submitButton) {

    submitButton.addEventListener(
      "click",
      function() {

        const elapsed =
          Date.now() -
          startTime;

        if (elapsed < duration) {

          if (taskMsg) {
            taskMsg.textContent =
              "Please complete the review timer first.";
          }

          return;
        }

        if (
          !proof ||
          !proof.files ||
          !proof.files.length
        ) {

          if (taskMsg) {
            taskMsg.textContent =
              "Please select your screen recording proof.";
          }

          return;
        }

        const user =
          getUser();

        if (!user) {

          window.location.href =
            "login.html";

          return;
        }

        const file =
          proof.files[0];

        const submissions =
          getSubmissions();

        /* Prevent duplicate pending submission */

        const duplicate =
          submissions.some(
            function(item) {

              return (
                item.taskId === task.id &&
                item.userPhone === user.phone &&
                item.status ===
                  "Pending review"
              );
            }
          );

        if (duplicate) {

          if (taskMsg) {
            taskMsg.textContent =
              "You already have a pending submission for this task.";
          }

          return;
        }

        const submission = {

          id:
            Date.now(),

          taskId:
            task.id,

          taskName:
            task.name,

          platform:
            task.platform,

          reward:
            task.reward,

          userPhone:
            user.phone,

          proofFileName:
            file.name,

          proofFileSize:
            file.size,

          submittedAt:
            new Date().toISOString(),

          status:
            "Pending review"
        };

        submissions.push(
          submission
        );

        saveSubmissions(
          submissions
        );

        sessionStorage.removeItem(
          timerKey
        );

        if (submitButton) {
          submitButton.disabled =
            true;
        }

        if (timerInterval) {
          clearInterval(
            timerInterval
          );
        }

        if (taskMsg) {

          taskMsg.textContent =
            "Submission successful! Your task is pending review.";
        }

        setTimeout(
          function() {

            window.location.href =
              "wallet.html";

          },
          1000
        );
      }
    );
  }
}

/* =========================================================
   WALLET
   ========================================================= */

function initWallet() {

  const availableBalance =
    document.getElementById(
      "availableBalance"
    );

  const pendingBalance =
    document.getElementById(
      "pendingBalance"
    );

  const totalEarned =
    document.getElementById(
      "totalEarned"
    );

  const transactionHistory =
    document.getElementById(
      "transactionHistory"
    );

  if (
    !availableBalance &&
    !pendingBalance &&
    !totalEarned &&
    !transactionHistory
  ) {
    return;
  }

  const user =
    getUser();

  if (!user) {
    return;
  }

  const submissions =
    getSubmissions();

  const userSubmissions =
    submissions.filter(
      function(item) {

        return (
          item.userPhone ===
          user.phone
        );
      }
    );

  let pending =
    0;

  let approved =
    0;

  userSubmissions.forEach(
    function(item) {

      const reward =
        Number(item.reward) || 0;

      if (
        item.status ===
        "Pending review"
      ) {

        pending +=
          reward;
      }

      if (
        item.status ===
        "Approved"
      ) {

        approved +=
          reward;
      }
    }
  );

  if (availableBalance) {

    availableBalance.textContent =
      `KSh ${approved.toFixed(2)}`;
  }

  if (pendingBalance) {

    pendingBalance.textContent =
      `KSh ${pending.toFixed(2)}`;
  }

  if (totalEarned) {

    totalEarned.textContent =
      `KSh ${approved.toFixed(2)}`;
  }

  /* ---------------------------------------------------------
     TRANSACTION HISTORY
     --------------------------------------------------------- */

  if (transactionHistory) {

    if (!userSubmissions.length) {

      transactionHistory.innerHTML =
        `<p class="muted">No transactions yet.</p>`;

    } else {

      transactionHistory.innerHTML =
        userSubmissions
          .slice()
          .reverse()
          .map(function(item) {

            const date =
              new Date(
                item.submittedAt
              ).toLocaleString();

            return `
              <div class="transaction">
                <strong>
                  ${item.taskName}
                </strong>

                <p>
                  Reward: KSh
                  ${Number(item.reward).toFixed(2)}
                </p>

                <p>
                  Status:
                  ${item.status}
                </p>

                <small>
                  ${date}
                </small>
              </div>
            `;

          })
          .join("");
    }
  }

  /* ---------------------------------------------------------
     WITHDRAWAL
     --------------------------------------------------------- */

  const withdrawForm =
    document.getElementById(
      "withdrawForm"
    );

  const withdrawMessage =
    document.getElementById(
      "withdrawMessage"
    );

  if (withdrawForm) {

    withdrawForm.addEventListener(
      "submit",
      function(event) {

        event.preventDefault();

        const mpesaNumber =
          document.getElementById(
            "mpesaNumber"
          )?.value.trim();

        const amount =
          Number(
            document.getElementById(
              "withdrawAmount"
            )?.value
          );

        if (!mpesaNumber) {

          if (withdrawMessage) {
            withdrawMessage.textContent =
              "Please enter your M-PESA number.";
          }

          return;
        }

        if (!amount || amount <= 0) {

          if (withdrawMessage) {
            withdrawMessage.textContent =
              "Please enter a valid amount.";
          }

          return;
        }

        if (amount > approved) {

          if (withdrawMessage) {
            withdrawMessage.textContent =
              "Insufficient available balance.";
          }

          return;
        }

        /*
          This records the request locally.

          Real M-PESA payment processing should
          be connected to a secure backend.
        */

        const withdrawals =
          JSON.parse(
            localStorage.getItem(
              "earnlinkWithdrawals"
            ) || "[]"
          );

        withdrawals.push({

          id:
            Date.now(),

          userPhone:
            user.phone,

          mpesaNumber:
            mpesaNumber,

          amount:
            amount,

          requestedAt:
            new Date().toISOString(),

          status:
            "Pending"
        });

        localStorage.setItem(
          "earnlinkWithdrawals",
          JSON.stringify(
            withdrawals
          )
        );

        if (withdrawMessage) {

          withdrawMessage.textContent =
            "Withdrawal request submitted successfully. Processing requires backend integration.";
        }

        withdrawForm.reset();
      }
    );
  }
}

/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    protectPage();

    initAuth();

    renderTasks();

    initTask();

    initWallet();

  }
);
