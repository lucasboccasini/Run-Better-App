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
  builderForm.innerHTML="\n    <div class=\"builder-fields\">\n      <label>What do you want to build?<select id=\"plan-type\"><option value=\"Run\">Run</option><option value=\"Lift\">Lift</option></select></label>\n      <label>Your experience<select id=\"plan-level\"><option value=\"Beginner\">Beginner</option><option value=\"Experienced\">Experienced / advanced</option></select></label>\n      <div class=\"builder-choice\" id=\"run-options\">\n        <label>What kind of run?<select id=\"run-focus\"><option value=\"easy\">Easy run</option><option value=\"long\">Long run</option><option value=\"intervals\">Speed intervals</option><option value=\"tempo\">Tempo run</option><option value=\"return\">Getting back into running</option></select></label>\n        <label>How long?<select id=\"run-duration\"></select></label>\n      </div>\n      <div class=\"builder-choice\" id=\"lift-options\" hidden>\n        <label>What are you training for?<select id=\"lift-goal\"><option value=\"general\">General strength</option><option value=\"powerlifting\">Powerlifting</option><option value=\"bodybuilding\">Bodybuilding</option><option value=\"crossfit\">CrossFit-style training</option></select></label>\n        <label>What do you want to work on?<select id=\"lift-focus\"><option value=\"full\">Full body</option><option value=\"upper\">Upper body</option><option value=\"lower\">Lower body</option><option value=\"core\">Core</option></select></label>\n        <label>What equipment do you have?<select id=\"lift-equipment\"><option value=\"bodyweight\">No equipment</option><option value=\"dumbbells\">Dumbbells</option><option value=\"gym\">Full gym / barbell</option></select></label>\n        <label>How long?<select id=\"lift-duration\"><option value=\"20\">20 minutes</option><option value=\"30\">30 minutes</option><option value=\"45\">45 minutes</option><option value=\"60\">1 hour</option><option value=\"75\">1 hour 15 minutes</option><option value=\"90\">1 hour 30 minutes</option><option value=\"120\">2 hours</option><option value=\"150\">2 hours 30 minutes</option><option value=\"180\">3 hours</option></select></label>\n      </div>\n      <p class=\"builder-level-note\" id=\"builder-level-note\">Beginner sessions teach the basics with lighter volume and simple progressions.</p>\n      <label>Pick a day<input id=\"plan-date\" type=\"date\" required></label>\n      <button class=\"start-button builder-submit\" id=\"generate-plan\" type=\"button\"><span class=\"play-icon\">✳</span><span>Build my session</span><span class=\"button-arrow\">↗</span></button>\n      <p class=\"form-note\" id=\"form-note\" aria-live=\"polite\">Choose a goal and get a session built around your experience, time, and equipment.</p>\n    </div>\n    <div id=\"generated-plan\" class=\"generated-plan\" hidden aria-live=\"polite\"></div>";
  const style=document.createElement("style");
  style.textContent=`
    .builder-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
    .builder-choice{display:contents}
    .builder-choice[hidden]{display:none}
    .builder-level-note{grid-column:1/-1;margin:-2px 0 0;padding:10px 12px;border-radius:8px;background:#f0f3e9;color:#67785f;font-size:10px;line-height:1.5}
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
  const runFocus=document.getElementById("run-focus"), runDuration=document.getElementById("run-duration");
  const runChoices={
    long:[[30,"30 minutes"],[45,"45 minutes"],[60,"1 hour"],[75,"1 hour 15 minutes"],[90,"1 hour 30 minutes"],[105,"1 hour 45 minutes"],[120,"2 hours"],[150,"2 hours 30 minutes"],[180,"3 hours"]],
    easy:[[20,"20 minutes"],[30,"30 minutes"],[45,"45 minutes"],[60,"1 hour"],[75,"1 hour 15 minutes"],[90,"1 hour 30 minutes"],[120,"2 hours"],[150,"2 hours 30 minutes"],[180,"3 hours"]],
    intervals:[[20,"20 minutes"],[30,"30 minutes"],[45,"45 minutes"],[60,"1 hour"],[75,"1 hour 15 minutes"]],
    tempo:[[20,"20 minutes"],[30,"30 minutes"],[45,"45 minutes"],[60,"1 hour"],[75,"1 hour 15 minutes"]],
    return:[[15,"15 minutes"],[20,"20 minutes"],[25,"25 minutes"],[30,"30 minutes"],[45,"45 minutes"],[60,"1 hour"],[75,"1 hour 15 minutes"],[90,"1 hour 30 minutes"]]
  };
  const setRunDurations=()=>{const choices=runChoices[runFocus.value],previous=Number(runDuration.value);runDuration.innerHTML=choices.map(item=>'<option value="'+item[0]+'">'+item[1]+'</option>').join("");runDuration.value=choices.some(item=>item[0]===previous)?String(previous):(runFocus.value==="long"?"45":String(choices[0][0]))};
  runFocus.addEventListener("change",setRunDurations);setRunDurations();
  const levelSelect=document.getElementById("plan-level"), levelNote=document.getElementById("builder-level-note");
  const updateLevelNote=()=>{levelNote.textContent=levelSelect.value==="Beginner"?"Beginner: simpler movements, lighter volume, technique practice, and clear rest.":"Experienced / advanced: heavier or more technical variations, more working sets, and goal-specific programming. Use loads you can control.";};
  levelSelect.addEventListener("change",updateLevelNote);
  typeSelect.addEventListener("change",()=>{const isRun=typeSelect.value==="Run";runOptions.hidden=!isRun;liftOptions.hidden=isRun;document.getElementById("generated-plan").hidden=true});
  let currentGenerated=null;
  const moveBank={
    upper:{bodyweight:["Wall or counter push-ups","Prone Y-T raises","Wall slides","Incline plank hold"],dumbbells:["Dumbbell floor press","One-arm dumbbell row","Seated shoulder press","Dumbbell curls","Lateral raises","Overhead triceps extensions"],gym:["Barbell or machine bench press","Chest-supported row","Overhead press","Lat pulldown","Incline dumbbell press","Cable triceps pressdown"]},
    lower:{bodyweight:["Chair or air squats","Glute bridges","Reverse lunges","Calf raises"],dumbbells:["Goblet squats","Dumbbell Romanian deadlifts","Reverse lunges","Calf raises","Step-ups","Hip thrusts"],gym:["Back squat or leg press","Romanian deadlift","Split squat","Hamstring curl","Hip thrust","Calf raise"]},
    full:{bodyweight:["Chair or air squats","Wall or counter push-ups","Glute bridges","Bird dogs"],dumbbells:["Goblet squats","Dumbbell floor press","One-arm dumbbell rows","Romanian deadlifts","Shoulder press","Farmer carry"],gym:["Back squat","Bench press","Deadlift variation","Barbell or cable row","Overhead press","Farmer carry"]},
    core:{bodyweight:["Dead bugs","Bird dogs","Side plank","Glute bridges"],dumbbells:["Dead bugs","Suitcase carry","Light dumbbell marches","Side plank","Bird dogs","Pallof press"],gym:["Cable Pallof press","Dead bugs","Back extension","Suitcase carry","Side plank","Cable chop"]}
  };
  const powerMoves=(focus,equipment)=>{
    const bank={
      upper:{bodyweight:["Incline push-ups","Backpack rows","Pike push-ups"],dumbbells:["Dumbbell floor press","One-arm dumbbell row","Dumbbell shoulder press"],gym:["Barbell bench press","Barbell row","Overhead press"]},
      lower:{bodyweight:["Tempo squat to a chair","Single-leg glute bridge","Split squat"],dumbbells:["Goblet squat","Dumbbell Romanian deadlift","Split squat"],gym:["Back squat","Deadlift","Paused squat"]},
      full:{bodyweight:["Tempo squat","Incline push-ups","Hip hinge drill"],dumbbells:["Goblet squat","Dumbbell floor press","Dumbbell Romanian deadlift"],gym:["Back squat","Bench press","Deadlift"]},
      core:{bodyweight:["Side plank","Dead bug","Bird dog"],dumbbells:["Suitcase carry","Side plank","Dead bug"],gym:["Pallof press","Suitcase carry","Back extension"]}
    };
    return bank[focus][equipment];
  };
  const bodybuildingMoves={
    upper:{bodyweight:["Slow wall push-ups","Prone Y-T raises","Pike push-ups","Close-grip incline push-ups"],dumbbells:["Dumbbell incline press","One-arm dumbbell row","Lateral raises","Dumbbell curls","Overhead triceps extensions","Rear-delt raises"],gym:["Machine chest press","Lat pulldown","Cable fly","Seated cable row","Lateral raises","Cable curls"]},
    lower:{bodyweight:["Tempo squats","Glute bridges","Reverse lunges","Single-leg calf raises"],dumbbells:["Goblet squat","Dumbbell Romanian deadlift","Bulgarian split squat","Hip thrust","Calf raises","Leg curl with sliders"],gym:["Leg press","Romanian deadlift","Leg extension","Seated leg curl","Hip thrust","Calf raise"]},
    full:{bodyweight:["Tempo squats","Slow wall push-ups","Glute bridges","Reverse lunges"],dumbbells:["Goblet squat","Dumbbell incline press","One-arm dumbbell row","Romanian deadlift","Lateral raise","Dumbbell curls"],gym:["Leg press","Machine chest press","Lat pulldown","Seated leg curl","Cable fly","Lateral raise"]},
    core:{bodyweight:["Crunch variation","Reverse crunch","Side plank","Dead bug"],dumbbells:["Weighted crunch","Suitcase carry","Reverse crunch","Side plank"],gym:["Cable crunch","Captain's chair knee raise","Pallof press","Back extension"]}
  };
  const crossfitMoves={
    upper:{bodyweight:["Incline or floor push-ups","Bear crawl","Inchworm walkouts","Plank shoulder taps"],dumbbells:["Dumbbell push press","Renegade row","Dumbbell thruster","Farmer carry"],gym:["Barbell push press","Ring row or pull-up","Wall-ball squat and throw","Farmer carry"]},
    lower:{bodyweight:["Air squats","Step-ups","Reverse lunges","Broad-jump practice"],dumbbells:["Dumbbell thruster","Dumbbell deadlift","Step-ups","Farmer carry"],gym:["Front squat","Deadlift","Box step-ups","Wall-ball squat and throw"]},
    full:{bodyweight:["Air squats","Incline or floor push-ups","Step-ups","Bear crawl"],dumbbells:["Dumbbell thruster","Dumbbell deadlift","Renegade row","Farmer carry"],gym:["Front squat","Barbell push press","Ring row or pull-up","Wall-ball squat and throw"]},
    core:{bodyweight:["Dead bug","Plank hold","Bear crawl","Mountain climber"],dumbbells:["Suitcase carry","Plank hold","Dumbbell march","Dead bug"],gym:["Hanging knee raise","Pallof press","Farmer carry","Plank hold"]}
  };
  const goalNames={powerlifting:"Powerlifting",bodybuilding:"Bodybuilding",crossfit:"CrossFit",recreational:"Recreational"};
  const movesForGoal=(goal,focus,equipment)=>{
    if(goal==="powerlifting")return powerMoves(focus,equipment);
    if(goal==="bodybuilding")return bodybuildingMoves[focus][equipment];
    if(goal==="crossfit")return crossfitMoves[focus][equipment];
    return moveBank[focus][equipment];
  };
  const makeRun=(focus,level,minutes)=>{
    const beginner=level==="Beginner",warm=5,cool=5,work=Math.max(5,minutes-warm-cool);
    const titles={easy:"Easy conversational run",long:"Long run",intervals:"Speed intervals",tempo:"Tempo run",return:"Run-walk return session"};
    let steps=[];
    if(focus==="intervals"){
      const rounds=beginner?4:6,on=beginner?1:2,off=2,fast=rounds*(on+off);
      steps=[["Warm up",warm+" min brisk walk + easy jog"],["Controlled intervals",rounds+" rounds: "+on+" min quicker but controlled, then "+off+" min easy jog/walk"],["Easy finish",Math.max(0,work-fast)+" min very easy running or walking"],["Cool down",cool+" min easy walk"]];
    }else if(focus==="tempo"){
      const steady=Math.max(5,Math.round(work*.35)),recover=Math.max(0,work-steady);
      steps=[["Warm up",warm+" min easy walk/jog"],["Steady effort",steady+" min comfortably hard; speak in short phrases"],["Easy running",recover+" min relaxed"],["Cool down",cool+" min walk"]];
    }else if(focus==="long"){
      steps=[["Warm up",warm+" min relaxed walking + gentle jog"],["Main run",work+" min at an easy conversational effort; take walk breaks and sip water as needed"],["Cool down",cool+" min easy walking"]];
    }else if(focus==="return"){
      const rounds=Math.max(3,Math.floor(work/3));
      steps=[["Warm up",warm+" min brisk walk"],["Run-walk",rounds+" rounds: 1 min gentle jog + 2 min walk"],["Cool down",cool+" min easy walk"]];
    }else{
      steps=[["Warm up",warm+" min brisk walk + easy jog"],["Easy run",work+" min at a pace where you can comfortably talk"],["Cool down",cool+" min easy walk"]];
    }
    return {title:titles[focus],category:"Run",duration:minutes,steps,safety:"Build duration gradually, especially for long runs. Keep the effort comfortable, take walk breaks, and stop if you feel pain, dizzy, or unwell."};
  };
  const makeLift=(focus,goal,equipment,level,minutes)=>{
    const beginner=level==="Beginner",body=equipment==="bodyweight",advanced=level!=="Beginner";
    const names={upper:"Upper body",lower:"Lower body",full:"Full body",core:"Core"};
    const moves=movesForGoal(goal,focus,equipment);
    let steps=[];
    if(goal==="powerlifting"){
      const main=moves[0],secondary=moves.slice(1);
      steps.push(["Warm up + technique",Math.max(8,Math.round(minutes*.08))+" min: easy cardio, joint prep, then several light ramp-up sets. Practice crisp reps."],["Main lift · "+main,beginner?"3–4 × 5 at a light-to-moderate load; finish each set with 3–4 good reps still possible.":"4–5 × 3–5 at a challenging but controlled effort (about 2 reps left in reserve); rest 2–4 min."],["Secondary strength",secondary.slice(0,2).join(" + ")+" · "+(beginner?"3 × 6–8 each, smooth technique":"3–4 × 5–8 each, rest 2–3 min")]);
      if(minutes>=60)steps.push(["Assistance work",moves[2]+" · "+(beginner?"2–3 × 8–10":"3 × 8–12")+"; keep it submaximal"]);
      if(minutes>=90)steps.push(["Extra practice / recovery",Math.max(10,minutes-75)+" min for long rests between quality sets, mobility, and optional light technique practice. Do not turn this into repeated max attempts."]);
      steps.push(["Cool down","5–10 min easy movement and comfortable mobility"]);
    }else if(goal==="bodybuilding"){
      const count=minutes>=90?moves.length:minutes>=45?Math.min(5,moves.length):Math.min(3,moves.length);
      const sets=beginner?"2–3":"3–4", reps=beginner?"8–12 controlled reps":"8–15 controlled reps";
      steps.push(["Warm up",Math.max(5,Math.round(minutes*.07))+" min easy movement + light warm-up sets"]);
      steps.push(["Hypertrophy work",moves.slice(0,count).map((m,i)=>(i+1)+". "+m+" — "+sets+" sets × "+reps+"; rest 60–120 sec").join(" · ")]);
      if(minutes>=60)steps.push(["Optional volume / rest",Math.max(10,minutes-Math.round(minutes*.65))+" min for longer rests and extra sets on 1–2 priority muscles. Stop sets with 1–3 good reps in reserve."]);
      steps.push(["Cool down","5–10 min easy movement; stretching is optional"]);
    }else if(goal==="crossfit"){
      const scaled=beginner?"Scale to smooth, repeatable reps; use step-ups, incline push-ups, and light loads.":"Use technically solid movements and a challenging pace you can sustain; leave room to recover.";
      steps.push(["Warm up",Math.max(8,Math.round(minutes*.08))+" min easy cardio + mobility"]);
      steps.push(["Strength / skill",moves.slice(0,2).join(" + ")+" · "+(beginner?"3 × 5–8 easy reps":"4 × 4–6 crisp reps")+"; practice before adding load"]);
      if(minutes>=60)steps.push(["Skill practice",Math.max(10,Math.round(minutes*.2))+" min on controlled technique (such as squat, hinge, press, or jump-rope basics); rest as needed"]);
      steps.push(["Conditioning workout",beginner?"8–12 min easy circuit: 6 controlled reps each of "+moves.slice(0,3).join(", ")+". Scale the movement and repeat smoothly.":"12–20 min controlled circuit: 8 controlled reps each of "+moves.slice(0,3).join(", ")+". Keep a steady pace, not an all-out sprint."]);
      if(minutes>=90)steps.push(["Easy aerobic / mobility",Math.max(15,minutes-60)+" min low-intensity walk/bike and mobility. Long sessions are not extra hours of high-intensity work."]);
      steps.push(["Cool down","5–10 min gentle walking and breathing"]);
      steps.push(["Scale it",scaled]);
    }else{
      const count=minutes>=90?moves.length:minutes>=45?Math.min(5,moves.length):Math.min(4,moves.length);
      const sets=beginner?"2–3":"3–4",reps=beginner?"8–12 controlled reps":"6–12 controlled reps";
      steps.push(["Warm up",Math.max(5,Math.round(minutes*.08))+" min easy movement and practice reps"]);
      steps.push(["Strength circuit",moves.slice(0,count).map((m,i)=>(i+1)+". "+m+" — "+sets+" sets × "+reps+"; rest "+(beginner?"60–90":"90–150")+" sec").join(" · ")]);
      if(minutes>=60)steps.push(["Extra sets / technique",Math.max(10,minutes-Math.round(minutes*.7))+" min: add a set to priority movements or practice easy technique. Keep form steady; do not rush to fill time."]);
      steps.push(["Cool down","5–10 min easy walking and comfortable mobility"]);
    }
    return {title:names[focus]+" · "+goalNames[goal],category:"Lift",duration:minutes,steps,safety:"Begin with a load and variation you can control. Stop for sharp pain or dizziness. Powerlifting and CrossFit-style sessions are educational templates, not a substitute for in-person coaching; avoid max attempts without qualified supervision."};
  };
  const showGenerated=plan=>{
    currentGenerated=plan;
    const box=document.getElementById("generated-plan");
    box.innerHTML='<span class="workout-tag">'+plan.category.toUpperCase()+' · BUILT FOR YOU</span><h3>'+plan.title+'</h3><div class="plan-meta"><span>'+plan.duration+' minutes</span><span>'+levelSelect.value+'</span><span>'+new Intl.DateTimeFormat(undefined,{weekday:"long",month:"short",day:"numeric"}).format(new Date(planDate.value+"T12:00:00"))+'</span></div><div class="session-steps">'+plan.steps.map((step,i)=>'<div class="session-step"><strong>'+String(i+1).padStart(2,"0")+' · '+step[0]+'</strong><span>'+step[1]+'</span></div>').join("")+'</div><p class="plan-safety">'+plan.safety+'</p><button class="start-button" id="save-generated" type="button"><span class="play-icon">＋</span><span>Save this session to calendar</span><span class="button-arrow">↗</span></button>';
    box.hidden=false;
    document.getElementById("form-note").textContent="Your session is ready. Save it to add it to your week.";
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
    const type=typeSelect.value,level=levelSelect.value;
    const plan=type==="Run"
      ?makeRun(runFocus.value,level,Number(runDuration.value))
      :makeLift(document.getElementById("lift-focus").value,document.getElementById("lift-goal").value,document.getElementById("lift-equipment").value,level,Number(document.getElementById("lift-duration").value));
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