(() => {
  const date = document.getElementById("today-date");
  date.textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(new Date());

  const workouts = [
    { title:"Easy neighborhood run", category:"Running", level:"Beginner", time:"20 min", detail:"A gentle loop to get some fresh air." },
    { title:"Leg day basics", category:"Strength", level:"Beginner", time:"18 min", detail:"Simple lower body lifts to build a base." },
    { title:"Stretch and reset", category:"Mobility", level:"Beginner", time:"12 min", detail:"Loosen up and make space to breathe." },
    { title:"Steady trail miles", category:"Running", level:"Experienced", time:"35 min", detail:"Find a steady rhythm on rolling ground." },
    { title:"Full body strength", category:"Strength", level:"Experienced", time:"30 min", detail:"A balanced session with room to progress." },
    { title:"Easy spin", category:"Cycling", level:"Beginner", time:"25 min", detail:"An easy ride to build your engine." },
    { title:"Tempo ride", category:"Cycling", level:"Experienced", time:"40 min", detail:"A focused ride with a few stronger efforts." },
    { title:"After-sport mobility", category:"Mobility", level:"Experienced", time:"16 min", detail:"A thoughtful cooldown for hard-working legs." }
  ];
  const list=document.getElementById("workout-list"), empty=document.getElementById("empty-state"), search=document.getElementById("activity-search");
  const categoryButtons=Array.from(document.querySelectorAll(".activity-tile")), levelButtons=Array.from(document.querySelectorAll(".level-button"));
  let activeCategory="all", activeLevel="Beginner";
  const drawWorkouts=()=>{
    const term=search.value.trim().toLowerCase();
    const shown=workouts.filter(item=>item.level===activeLevel&&(activeCategory==="all"||item.category===activeCategory)&&(term===""||(item.title+" "+item.category+" "+item.detail).toLowerCase().includes(term)));
    list.innerHTML=shown.map(item=>'<button class="workout-card" type="button" data-title="'+item.title+'" data-category="'+item.category+'"><span class="workout-top"><span class="workout-tag">'+item.category+'</span><span class="workout-time">'+item.time+'</span></span><strong>'+item.title+'</strong><small>'+item.detail+'</small><span class="workout-arrow" aria-hidden="true">↗</span></button>').join("");
    empty.hidden=shown.length>0;
    list.querySelectorAll(".workout-card").forEach(card=>card.addEventListener("click",()=>openTimer(card.dataset.title,card.dataset.category)));
  };
  categoryButtons.forEach(button=>button.addEventListener("click",()=>{activeCategory=button.dataset.filter;categoryButtons.forEach(item=>item.classList.toggle("selected",item===button));drawWorkouts()}));
  levelButtons.forEach(button=>button.addEventListener("click",()=>{activeLevel=button.dataset.level;levelButtons.forEach(item=>item.classList.toggle("active",item===button));drawWorkouts()}));
  search.addEventListener("input",drawWorkouts);

  const storageKey="runBetterCalendar";
  const getPlans=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||"[]")}catch{return[]}};
  const plans=getPlans(), grid=document.getElementById("calendar-grid");
  const weekStart=new Date();weekStart.setHours(0,0,0,0);weekStart.setDate(weekStart.getDate()-((weekStart.getDay()+6)%7));
  const fmtDate=d=>{const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return y+"-"+m+"-"+day};
  const weekday=new Intl.DateTimeFormat(undefined,{weekday:"short"}), daynum=new Intl.DateTimeFormat(undefined,{day:"numeric"});
  const renderCalendar=()=>{
    grid.innerHTML="";
    for(let i=0;i<7;i++){
      const day=new Date(weekStart);day.setDate(weekStart.getDate()+i);const key=fmtDate(day);
      const section=document.createElement("article");section.className="calendar-day"+(key===fmtDate(new Date())?" today":"");
      const label=document.createElement("div");label.className="calendar-label";label.innerHTML="<span>"+weekday.format(day)+"</span><strong>"+daynum.format(day)+"</strong>";
      const events=document.createElement("div");events.className="calendar-events";
      plans.filter(plan=>plan.date===key).forEach(plan=>{const event=document.createElement("div");event.className="calendar-event "+(plan.type.toLowerCase()==="lift"?"lift":plan.type.toLowerCase()==="run"?"run":"");event.textContent=plan.name;const time=document.createElement("small");time.textContent=plan.type+" · "+plan.duration+" min";event.appendChild(time);events.appendChild(event)});
      if(!events.children.length){const none=document.createElement("div");none.className="empty-day";none.textContent="·";events.appendChild(none)}
      section.append(label,events);grid.appendChild(section);
    }
  };
  const planDate=document.getElementById("plan-date"), today=new Date();
  planDate.value=fmtDate(today);planDate.min=fmtDate(today);
  document.getElementById("builder-form").addEventListener("submit",event=>{
    event.preventDefault();
    const plan={type:document.getElementById("plan-type").value,name:document.getElementById("plan-name").value.trim(),duration:Number(document.getElementById("plan-duration").value),date:planDate.value};
    if(!plan.name||!plan.date)return;
    plans.push(plan);
    try{localStorage.setItem(storageKey,JSON.stringify(plans));document.getElementById("form-note").textContent="Added to your week. Saved on this device."}
    catch{document.getElementById("form-note").textContent="Added for this visit. Browser storage is unavailable."}
    renderCalendar();event.target.reset();planDate.value=fmtDate(today);planDate.min=fmtDate(today);
  });
  renderCalendar();drawWorkouts();

  const modal=document.getElementById("run-modal"), closeRun=document.getElementById("close-run"), toggle=document.getElementById("timer-toggle"), finish=document.getElementById("finish-run"), display=document.getElementById("run-timer"), hint=document.getElementById("run-hint"), modalCategory=document.getElementById("modal-category"), modalTitle=document.getElementById("run-title");
  let seconds=0,running=false,interval=null;
  const formatTime=value=>Math.floor(value/60).toString().padStart(2,"0")+":"+(value%60).toString().padStart(2,"0");
  const renderTimer=()=>{display.textContent=formatTime(seconds)};
  function openTimer(title,category){modalTitle.textContent=title||"Ready when you are.";modalCategory.textContent=category?category.toUpperCase()+" · YOUR TIME":"A LITTLE TIME FOR YOU";modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";closeRun.focus()}
  const closeModal=()=>{if(running)return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""};
  const stopTimer=()=>{clearInterval(interval);interval=null;running=false;toggle.querySelector("span:last-child").textContent="Resume";toggle.querySelector(".play-icon").textContent="▶"};
  document.querySelectorAll("[data-start]").forEach(button=>button.addEventListener("click",()=>openTimer(button.dataset.start,button.dataset.category)));
  closeRun.addEventListener("click",closeModal);modal.addEventListener("click",event=>{if(event.target===modal)closeModal()});
  document.addEventListener("keydown",event=>{if(event.key==="Escape"&&modal.classList.contains("open"))closeModal()});
  toggle.addEventListener("click",()=>{if(running){stopTimer();hint.textContent="Paused. Take a moment if you need one.";return}running=true;toggle.querySelector("span:last-child").textContent="Pause";toggle.querySelector(".play-icon").textContent="Ⅱ";hint.textContent="You’re doing great. Keep your own pace.";interval=setInterval(()=>{seconds++;renderTimer()},1000)});
  finish.addEventListener("click",()=>{stopTimer();hint.textContent=seconds>0?"Nice work showing up. Time: "+formatTime(seconds)+".":"Whenever you’re ready, your next session is waiting.";toggle.querySelector("span:last-child").textContent="Begin again";seconds=0;renderTimer()});
})();