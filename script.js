const tasks=[
{id:1,name:"TikTok Channel Task #01",platform:"TikTok",reward:50,url:"https://www.tiktok.com/",instructions:"Open the assigned TikTok campaign and complete the required action while recording your screen."},
{id:2,name:"Instagram Channel Task #01",platform:"Instagram",reward:50,url:"https://www.instagram.com/",instructions:"Open the assigned Instagram campaign and complete the required action while recording your screen."},
{id:3,name:"TikTok Channel Task #02",platform:"TikTok",reward:75,url:"https://www.tiktok.com/",instructions:"Complete the assigned campaign and keep your screen recording running."},
{id:4,name:"Instagram Channel Task #02",platform:"Instagram",reward:75,url:"https://www.instagram.com/",instructions:"Complete the assigned campaign and keep your screen recording running."}
];

function logout(){localStorage.removeItem("earnlink_logged_in");location.href="login.html"}
function initAuth(){
 const path=location.pathname.split("/").pop();
 if((path==="index.html"||path==="tasks.html"||path==="task.html"||path==="verification.html"||path==="wallet.html")&&!localStorage.getItem("earnlink_logged_in")){location.href="login.html"}
}
function setupForms(){
 const signup=document.getElementById("signupForm");
 if(signup)signup.onsubmit=e=>{e.preventDefault();if(password.value!==confirm.value){msg.textContent="Passwords do not match.";return}localStorage.setItem("earnlink_logged_in","1");location.href="index.html"};
 const login=document.getElementById("loginForm");
 if(login)login.onsubmit=e=>{e.preventDefault();localStorage.setItem("earnlink_logged_in","1");location.href="index.html"};
}
function renderTasks(){
 const box=document.getElementById("taskList");if(!box)return;
 box.innerHTML=tasks.map(t=>`<article class="task-card"><p class="eyebrow">${t.platform}</p><h2>${t.name}</h2><p class="meta">1 hour required • Screen recording • Verification required</p><div class="reward">KSh ${t.reward}</div><a class="btn full" href="task.html?id=${t.id}">Open Task →</a></article>`).join("");
}
function initTask(){
 const box=document.getElementById("taskName");if(!box)return;
 const id=new URLSearchParams(location.search).get("id")||1;
 const t=tasks.find(x=>x.id==id)||tasks[0];
 box.textContent=t.name;document.getElementById("reward").textContent=`KSh ${t.reward}`;document.getElementById("instructions").textContent=t.instructions;document.getElementById("target").href=t.url;
 let seconds=3600, started=false;
 const timer=document.getElementById("timer");
 const tick=()=>{let h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=seconds%60;timer.textContent=[h,m,s].map(x=>String(x).padStart(2,"0")).join(":");if(seconds>0)seconds--};
 tick();const interval=setInterval(tick,1000);
 document.getElementById("submitTask").onclick=()=>{const file=document.getElementById("proof").files[0];if(seconds>0){taskMsg.textContent="Please complete the 1-hour timer before submitting.";return}if(!file){taskMsg.textContent="Please upload your screen recording.";return}localStorage.setItem("earnlink_pending","1");taskMsg.textContent="Submitted successfully. Your task is now pending verification.";clearInterval(interval)};
}
initAuth();setupForms();renderTasks();initTask();