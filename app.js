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
  const builderForm=document.getElementById("builder-form");
  builderForm.innerHTML=`
    <div class="builder-fields">
      <label>What do you want to build?<select id="plan-type"><option value="Run">Run</option><option value="Lift">Lift</option></select></label>
      <label>Your experience<select id="plan-level"><option value="Beginner">Beginner</option><option value="Experienced">Experienced</option></select></label>
      <div class="builder-choice" id="run-options">
        <label>What kind of run?<select id="run-focus"><option value="easy">Easy run</option><option value="long">Long run</option><option value="intervals">Speed intervals</option><option value="tempo">Tempo run</option><option value="return">Getting back into running</option></select></label>
        <label>How long?<select id="run-duration"><option value="20">20 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option><option value="75">75 minutes</option></select></label>
      </div>
      <div class="builder-choice" id="lift-options" hidden>
        <label>What do you want to work on?<select id="lift-focus"><option value="upper">Upper body</option><option value="lower">Lower body</option><option value="full">Full body</option><option value="core">Core</option></select></label>
        <label>What equipment do you have?<select id="lift-equipment"><option value="bodyweight">No equipment</option><option value="dumbbells">Dumbbells</option><option value="gym">Full gym</option></select></label>
        <label>How long?<select id="lift-duration"><option value="20">20 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option></select></label>
      </div>
      <label>Pick a day<input id="plan-date" type="date" required></label>
      <button class="start-button builder-submit" id="generate-plan" type="button"><span class="play-icon">✳</span><span>Build my session</span><span class="button-arrow">↗</span></button>
      <p class="form-note" id="form-note" aria-live="polite">Your plan is made for your choices and saved on this device.</p>
    </div>
    <div id="generated-plan" class="generated-plan" hidden aria-live="polite"></div>`;
  const style=document.createElement("style");
  style.textContent=`
    .builder-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
    .builder-choice{display:contents}
    .builder-choice[hidden]{display:none}
    .generated-plan{margin-top:18px;padding:19px;border:1px solid #dfe7d7;border-radius:14px;background:linear-gradient(145deg,#f4f6ee,#fffefa)}
    .generated-plan[hidden]{display:none}
    .generated-plan h3{font:500 21px var(--serif);color:var(--forest);margin:7px 0}
    .generated-plan p{font-size:10px;color:#78847b;line-height:1.6}
    .plan-meta{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 14px}
    .plan-meta span{font-size:9px;border-radius:20px;background:#e7eddf;color:#5c734d;padding:6px 9px}
    .session-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:13px 0}
    .session-step{background:white;border:1px solid #e9ece4;border-radius:9px;padding:10px}
    .session-step strong{display:block;color:#365644;font-size:10px;margin-bottom:4px}
    .session-step span{font-size:9px;color:#7e8980;line-height:1.5}
    .plan-safety{font-size:9px!important;color:#899389!important}
    @media(max-width:760px){.builder-fields{gap:10px}.session-steps{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
  const planDate=document.getElementById("plan-date"), today=new Date();
  planDate.value=fmtDate(today);planDate.min=fmtDate(today);
  const typeSelect=document.getElementById("plan-type"), runOptions=document.getElementById("run-options"), liftOptions=document.getElementById("lift-options");
  typeSelect.addEventListener("change",()=>{const isRun=typeSelect.value==="Run";runOptions.hidden=!isRun;liftOptions.hidden=isRun;document.getElementById("generated-plan").hidden=true});
  let currentGenerated=null;
  const liftMoves={
    upper:{
      bodyweight:["Incline push-ups","Pike push-ups","Chair triceps dips","Prone Y-T raises"],
      dumbbells:["Dumbbell floor press","One-arm dumbbell row","Seated shoulder press","Dumbbell curls"],
      gym:["Chest press","Seated cable row","Lat pulldown","Machine shoulder press"]
    },
    lower:{
      bodyweight:["Chair squats","Glute bridges","Reverse lunges","Calf raises"],
      dumbbells:["Goblet squats","Dumbbell Romanian deadlifts","Reverse lunges","Calf raises"],
      gym:["Leg press","Seated hamstring curl","Leg extension","Calf raises"]
    },
    full:{
      bodyweight:["Chair squats","Incline push-ups","Glute bridges","Bird dogs"],
      dumbbells:["Goblet squats","Dumbbell floor press","One-arm dumbbell rows","Romanian deadlifts"],
      gym:["Leg press","Chest press","Seated cable row","Hip hinge with light bar"]
    },
    core:{
      bodyweight:["Dead bugs","Bird dogs","Knee side planks","Glute bridges"],
      dumbbells:["Dead bugs","Suitcase carry","Light dumbbell marches","Bird dogs"],
      gym:["Cable Pallof press","Dead bugs","Back extension (easy)","Suitcase carry"]
    }
  };
  const makeRun=(focus,level,minutes)=>{
    const beginner=level==="Beginner";
    const warm=4, cool=4, work=Math.max(8,minutes-warm-cool);
    const titles={easy:"Easy conversational run",long:"Comfortable long run",intervals:"Gentle speed intervals",tempo:"Steady tempo session",return:"Run-walk return session"};
    let steps=[];
    if(focus==="intervals"){
      const rounds=beginner?4:6, on=beginner?1:2, off=2;
      steps=[["Warm up",warm+" min brisk walk + easy jog"],["Repeat "+rounds+" times",on+" min quicker but controlled, then "+off+" min easy walk/jog"],["Easy finish",Math.max(3,work-rounds*(on+off))+" min relaxed jog or walk"],["Cool down",cool+" min easy walk + gentle calf/hip stretches"]];
    }else if(focus==="tempo"){
      steps=[["Warm up",warm+" min easy walk/jog"],["Steady effort",Math.max(5,Math.round(work*.55))+" min comfortably hard; you can speak a few words"],["Recover",Math.max(3,work-Math.max(5,Math.round(work*.55)))+" min very easy"],["Cool down",cool+" min walk"]];
    }else if(focus==="long"){
      steps=[["Warm up",warm+" min relaxed walking"],["Main run",work+" min at an easy, conversational pace; walk whenever you need"],["Cool down",cool+" min easy walking + water"]];
    }else if(focus==="return"){
      const rounds=Math.max(3,Math.floor(work/3));
      steps=[["Warm up",warm+" min brisk walk"],["Run-walk",rounds+" rounds: 1 min gentle jog + 2 min walk"],["Cool down",cool+" min easy walk"]];
    }else{
      steps=[["Warm up",warm+" min brisk walk + easy jog"],["Easy run",work+" min at a pace where you can talk"],["Cool down",cool+" min easy walk"]];
    }
    return {title:titles[focus],category:"Run",duration:minutes,steps,safety:"Keep the effort comfortable, and stop if you feel pain, dizziness, or unwell. If you are new to running, choose the run-walk option."};
  };
  const makeLift=(focus,equipment,level,minutes)=>{
    const names={upper:"Upper-body strength",lower:"Lower-body strength",full:"Full-body strength",core:"Core & stability"};
    const beginner=level==="Beginner", sets=beginner?2:3, reps=beginner?"8–10 controlled reps":"8–12 controlled reps";
    const moves=liftMoves[focus][equipment];
    const steps=[["Warm up","3–5 min easy marching, arm circles, and comfortable range-of-motion"],...moves.map((move,i)=>[move,sets+" sets × "+reps+" · rest 60–90 sec"+(equipment==="bodyweight"&&focus==="upper"&&i===0?" · use a wall or counter for incline push-ups":"")]),["Cool down","3–5 min gentle breathing and comfortable stretches"]];
    return {title:names[focus],category:"Lift",duration:minutes,steps,safety:"Choose a variation that feels controlled. Stop for sharp pain, and ask a qualified coach to check unfamiliar equipment or technique."};
  };
  const showGenerated=plan=>{
    currentGenerated=plan;
    const box=document.getElementById("generated-plan");
    box.innerHTML='<span class="workout-tag">'+plan.category.toUpperCase()+' · BUILT FOR YOU</span><h3>'+plan.title+'</h3><div class="plan-meta"><span>'+plan.duration+' minutes</span><span>'+document.getElementById("plan-level").value+'</span><span>'+new Intl.DateTimeFormat(undefined,{weekday:"long",month:"short",day:"numeric"}).format(new Date(planDate.value+"T12:00:00"))+'</span></div><div class="session-steps">'+plan.steps.map((step,i)=>'<div class="session-step"><strong>'+String(i+1).padStart(2,"0")+' · '+step[0]+'</strong><span>'+step[1]+'</span></div>').join("")+'</div><p class="plan-safety">'+plan.safety+'</p><button class="start-button" id="save-generated" type="button"><span class="play-icon">＋</span><span>Save this session to calendar</span><span class="button-arrow">↗</span></button>';
    box.hidden=false;
    document.getElementById("form-note").textContent="Your session is ready. Save it to add it to this week.";
    document.getElementById("save-generated").addEventListener("click",()=>{
      if(!currentGenerated||!planDate.value)return;
      const plan={type:currentGenerated.category,name:currentGenerated.title,duration:currentGenerated.duration,date:planDate.value,steps:currentGenerated.steps};
      plans.push(plan);
      try{localStorage.setItem(storageKey,JSON.stringify(plans));document.getElementById("form-note").textContent="Saved to your calendar on this device."}
      catch{document.getElementById("form-note").textContent="Added for this visit. Browser storage is unavailable."}
      renderCalendar();
      document.getElementById("save-generated").disabled=true;
      document.getElementById("save-generated").querySelector("span:last-child").textContent="Saved to calendar ✓";
    });
  };
  document.getElementById("generate-plan").addEventListener("click",()=>{
    const type=typeSelect.value,level=document.getElementById("plan-level").value;
    const plan=type==="Run"
      ?makeRun(document.getElementById("run-focus").value,level,Number(document.getElementById("run-duration").value))
      :makeLift(document.getElementById("lift-focus").value,document.getElementById("lift-equipment").value,level,Number(document.getElementById("lift-duration").value));
    showGenerated(plan);
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