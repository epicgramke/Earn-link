const tasks=[
 {id:1,platform:"TikTok",icon:"♪",name:"Campus Connect Kenya",handle:"@campusconnectkenya",action:"Follow",reward:5},
 {id:2,platform:"TikTok",icon:"♪",name:"Trendy Vibes Kenya",handle:"@trendyvibeskenya",action:"Follow",reward:5},
 {id:3,platform:"Instagram",icon:"◎",name:"Kenya Lifestyle",handle:"@kenya_lifestyle",action:"Follow",reward:5},
 {id:4,platform:"YouTube",icon:"▶",name:"Tech & Gadgets Kenya",handle:"@techandgadgetskenya",action:"Subscribe",reward:10},
 {id:5,platform:"TikTok",icon:"♪",name:"Daily News Kenya",handle:"@dailynewsk",action:"Like",reward:5},
 {id:6,platform:"Facebook",icon:"f",name:"Kenya Trends",handle:"@kenyatrends254",action:"Follow",reward:5},
 {id:7,platform:"X",icon:"𝕏",name:"Hot Updates Kenya",handle:"@hotupdateskenya",action:"Follow",reward:5},
 {id:8,platform:"Telegram",icon:"➤",name:"Campus News KE",handle:"@campusnewske",action:"Join",reward:5},
 {id:9,platform:"Snapchat",icon:"👻",name:"Fun Zone Kenya",handle:"@funzonekenya",action:"Follow",reward:5},
 {id:10,platform:"Pinterest",icon:"P",name:"Fashion & Style KE",handle:"@fashionstyleke",action:"Follow",reward:5}
];
let completed=new Set();
let pending=0, earned=0, timerId=null;

const grid=document.getElementById("task-grid");
function render(){
 grid.innerHTML=tasks.map(t=>`
 <article class="task">
   <div class="task-head"><span class="task-number">${t.id}</span><span class="platform">${t.icon}</span></div>
   <h3>${t.platform} — ${t.name}</h3>
   <div class="handle">${t.handle}</div>
   <div class="task-bottom"><span class="reward">KSh ${t.reward.toFixed(2)}</span>
   <button class="${completed.has(t.id)?"done":""}" onclick="startTask(${t.id})">${completed.has(t.id)?"✓ Completed":"Start Task →"}</button></div>
 </article>`).join("");
 document.getElementById("completed").textContent=`${completed.size} / 10`;
 document.getElementById("earned").textContent=`KSh ${earned.toFixed(2)}`;
 document.getElementById("balance").textContent=`KSh ${earned.toFixed(2)}`;
 document.getElementById("pending").textContent=`KSh ${pending.toFixed(2)}`;
 document.getElementById("progress-bar").style.width=`${completed.size*10}%`;
 document.getElementById("progress-text").textContent=`${completed.size}/10 tasks completed.`;
}
function startTask(id){
 const t=tasks.find(x=>x.id===id); if(!t||completed.has(id)) return;
 let seconds=45;
 document.getElementById("task-modal").classList.remove("hidden");
 document.getElementById("modal-content").innerHTML=`
   <p class="eyebrow">TASK ${t.id} OF 10</p><h2>${t.action} ${t.platform}</h2>
   <p>Find <b>${t.name}</b> (${t.handle}), complete the required action, then return here.</p>
   <div class="timer" id="timer">00:45</div>
   <div class="instructions">
    1. Start your screen recording if proof is required.<br>
    2. Use the platform's search to find the account.<br>
    3. Complete the requested action.<br>
    4. Return here after the timer finishes.
   </div>
   <div class="proof"><b>Proof upload</b><br><small>Upload a recording only if your task requires proof.</small><br><br>
    <input class="file-input" id="proof-file" type="file" accept="video/*">
   </div>
   <button class="primary-btn" id="claim-btn" disabled onclick="claimTask(${t.id})">Claim KSh ${t.reward.toFixed(2)}</button>`;
 clearInterval(timerId);
 timerId=setInterval(()=>{
   seconds--; const el=document.getElementById("timer");
   if(el) el.textContent=`00:${String(seconds).padStart(2,"0")}`;
   if(seconds<=0){clearInterval(timerId); const b=document.getElementById("claim-btn"); if(b)b.disabled=false;}
 },1000);
}
function claimTask(id){
 const t=tasks.find(x=>x.id===id);
 // Demo only: production should verify proof server-side before awarding money.
 completed.add(id); pending+=t.reward; earned+=t.reward; closeModal(); render();
 setTimeout(()=>{pending-=t.reward; render();},2500);
}
function closeModal(){clearInterval(timerId);document.getElementById("task-modal").classList.add("hidden");}
function openWallet(){alert("Wallet and M-PESA withdrawal will be connected in the next step.");}
render();
