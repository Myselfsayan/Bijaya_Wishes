// Single-unique wish (seeded by name) + extra animations + low-opacity firecrackers
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const landing = document.getElementById('landing');
  const dash = document.getElementById('dash');
  const form = document.getElementById('startForm');
  const nameInput = document.getElementById('name');
  const helloName = document.getElementById('helloName');
  const wishEl = document.getElementById('wish');
  const wishCard = document.getElementById('wishCard');
  const backBtn = document.getElementById('back');

  // ---------- Low-opacity fireworks background ----------
  const bg = document.getElementById('bg');
  const bctx = bg.getContext('2d',{alpha:true});
  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio||1));
  function fit(){
    bg.width = Math.floor(window.innerWidth*DPR);
    bg.height = Math.floor(window.innerHeight*DPR);
    bg.style.width = window.innerWidth+'px';
    bg.style.height = window.innerHeight+'px';
    bctx.setTransform(DPR,0,0,DPR,0,0);
  }
  fit(); window.addEventListener('resize', fit);

  const rockets=[], sparks=[];
  function launch(){
    const x = 40 + Math.random()*(window.innerWidth-80);
    const y = window.innerHeight + 10;
    const tx = 80 + Math.random()*(window.innerWidth-160);
    const ty = 80 + Math.random()*(window.innerHeight*0.45);
    rockets.push({ x,y, tx,ty, vx:(tx-x)/44, vy:(ty-y)/44, life:44, hue:(10+Math.random()*60)|0 });
  }
  function burst(x,y,hue){
    const n = 36 + (Math.random()*20|0);
    for(let i=0;i<n;i++){
      const a = Math.random()*Math.PI*2;
      const sp = 1.3 + Math.random()*1.9;
      sparks.push({ x,y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, life:82+(Math.random()*30|0), hue, size:1+Math.random()*0.8 });
    }
  }
  function step(){
    bctx.globalCompositeOperation='source-over';
    // stronger fade to keep very dim
    bctx.fillStyle='rgba(11,15,26,0.36)';
    bctx.fillRect(0,0,window.innerWidth,window.innerHeight);

    // rockets
    for(let i=rockets.length-1;i>=0;i--){
      const r=rockets[i];
      r.x+=r.vx; r.y+=r.vy; r.life--;
      bctx.globalCompositeOperation='lighter';
      bctx.globalAlpha=0.10; // dim trail
      bctx.fillStyle=`hsl(${r.hue} 90% 60%)`;
      bctx.beginPath(); bctx.arc(r.x,r.y,1.3,0,Math.PI*2); bctx.fill();
      if(r.life<=0){ burst(r.x,r.y,r.hue); rockets.splice(i,1); }
    }
    // sparks
    for(let i=sparks.length-1;i>=0;i--){
      const s=sparks[i];
      s.x+=s.vx; s.y+=s.vy; s.vy+=0.013; s.life--;
      bctx.globalCompositeOperation='lighter';
      bctx.globalAlpha=Math.max(0, Math.min(0.07, (s.life/82)*0.07));
      bctx.fillStyle=`hsl(${s.hue} 90% 60%)`;
      bctx.beginPath(); bctx.arc(s.x,s.y,s.size,0,Math.PI*2); bctx.fill();
      if(s.life<=0) sparks.splice(i,1);
    }
    if(Math.random()<0.014) launch();
    requestAnimationFrame(step);
  }
  step();

  // ---------- Floating petals (soft confetti) ----------
  const petals = document.getElementById('petals');
  const pctx = petals.getContext('2d');
  function fitPetals(){
    petals.width = window.innerWidth;
    petals.height = window.innerHeight;
  }
  fitPetals(); window.addEventListener('resize', fitPetals);

  const flakes=[];
  function spawnPetal(){
    flakes.push({
      x: Math.random()*petals.width,
      y: -20,
      r: 5+Math.random()*9,
      vx: -0.4 + Math.random()*0.8,
      vy: 0.9 + Math.random()*1.0,
      rot: Math.random()*Math.PI*2,
      vr: -0.02 + Math.random()*0.04,
      hue: 20 + Math.random()*35
    });
  }
  (function petalsLoop(){
    pctx.clearRect(0,0,petals.width,petals.height);
    if(Math.random()<0.22) spawnPetal();
    for(const f of flakes){
      f.x+=f.vx; f.y+=f.vy; f.rot+=f.vr;
      if(f.y>petals.height+24){ f.y=-20; f.x=Math.random()*petals.width; }
      pctx.save();
      pctx.translate(f.x,f.y); pctx.rotate(f.rot);
      pctx.fillStyle=`hsla(${f.hue},90%,62%,0.35)`; // soft
      pctx.beginPath();
      const r=f.r;
      pctx.moveTo(0,-r);
      pctx.quadraticCurveTo(r,-r, r, 0);
      pctx.quadraticCurveTo(r, r, 0, r);
      pctx.quadraticCurveTo(-r, r, -r, 0);
      pctx.quadraticCurveTo(-r,-r, 0,-r);
      pctx.fill();
      pctx.restore();
    }
    requestAnimationFrame(petalsLoop);
  })();

  // ---------- Unique-feel wish set (seeded by name) ----------
  const wishes = [
    "প্রিয় {name}, আলোর প্রদীপে উজ্জ্বল হোক আশা ও আনন্দ—শুভ বিজয়া! 🪔",
    "প্রিয় {name}, শান্তি, সুস্বাস্থ্য ও সাফল্যে ভরে উঠুক প্রতিটি প্রহর—শুভ বিজয়া! 🌼",
    "প্রিয় {name}, নতুন প্রেরণায় সাহসী হোক পথচলা, মঙ্গলময় হোক জীবন—শুভ বিজয়া! 🎇",
    "প্রিয় {name}, মা দুর্গার কৃপায় ঘরে-ঘরে আসুক সমৃদ্ধির হাওয়া—শুভ বিজয়া! 🎊",
    "প্রিয় {name}, হাসির ঝরনায় ধুয়ে যাক ক্লান্তি, ফুটে উঠুক সুখের রং—শুভ বিজয়া! 🌟",
    "প্রিয় {name}, শুভক্ষণে শুভ ভাবনায় পরিপূর্ণ হোক দিন—শুভ বিজয়া! ✨",
    "প্রিয় {name}, প্রিয়জনের সান্নিধ্যে বাড়ুক ভালোবাসা আর শান্তি—শুভ বিজয়া! 💐",
    "প্রিয় {name}, স্বপ্ন দেখার সাহস আর পূরণের শক্তি থাকুক হৃদয়ে—শুভ বিজয়া! 🎉",
    "প্রিয় {name}, উদিত সূর্যের মতো উজ্জ্বল হোক ভবিষ্যৎ—শুভ বিজয়া! 🌅",
    "প্রিয় {name}, মঙ্গলদীপ জ্বেলে দূর হোক সব আঁধার—শুভ বিজয়া! 🕯️",
    "প্রিয় {name}, কর্মে প্রজ্ঞা, মনে স্থিরতা, জীবনে সমৃদ্ধি—শুভ বিজয়া! 🌼",
    "প্রিয় {name}, হাসিখুশি মুহূর্তে রাঙা থাকুক দিনকাল—শুভ বিজয়া! 🎈",
    "প্রিয় {name}, শুভ চিন্তায় নতুন পথ উন্মুক্ত হোক—শুভ বিজয়া! 🌠",
    "প্রিয় {name}, আনন্দের স্রোতে ভিজে উঠুক মন—শুভ বিজয়া! 💫",
    "প্রিয় {name}, শক্তি, শান্তি ও শ্রী—তিনেই ভরে উঠুক জীবন—শুভ বিজয়া! 🪔"
  ];

  // Simple name hash → stable index
  function hashName(s){
    s = (s||'').trim().toLowerCase();
    let h=2166136261>>>0; // FNV-1a base
    for(let i=0;i<s.length;i++){
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h>>>0;
  }

  function pickWishFor(name){
    const h = hashName(name);
    const idx = h % wishes.length;
    let line = wishes[idx].replace("{name}", name||"অতিথি");
    // Safety: ensure compulsory phrase
    if(!line.includes("শুভ বিজয়া")) line += " শুভ বিজয়া!";
    return line;
  }

  // ---------- Typing + post-typing shine & celebration ----------
  function typeText(el, text, done){
    el.textContent = "";
    el.classList.remove('shine');
    let i=0;
    (function tick(){
      if(i<=text.length){
        el.textContent = text.slice(0,i);
        i += Math.max(1, Math.round(Math.random()*2));
        setTimeout(tick, 26 + Math.random()*38);
      } else {
        // add shimmer and a few celebratory bursts
        el.classList.add('shine');
        for(let k=0;k<3;k++){
          setTimeout(()=>fireCelebrate(), 120*k);
        }
        done && done();
      }
    })();
  }

  function fireCelebrate(){
    // trigger a brighter-but-still-limited local burst
    const x = 80 + Math.random()*(window.innerWidth-160);
    const y = 80 + Math.random()*(window.innerHeight*0.4);
    const hue = (10+Math.random()*60)|0;
    // Inject sparks directly (low alpha rendering keeps it subtle)
    burst(x,y,hue);
  }

  // ---------- Screen flow ----------
  function toDash(name){
    landing.classList.remove('active');
    setTimeout(()=>{ landing.hidden=true; dash.hidden=false; dash.classList.add('active'); }, 160);
    helloName.textContent = name ? `প্রিয় ${name}` : 'প্রিয় অতিথি';
    const line = pickWishFor(name);
    setTimeout(()=> typeText(wishEl, line, ()=>{}), 260);
    // subtle 3D pulse on the card
    wishCard.classList.remove('pop-in'); void wishCard.offsetWidth; wishCard.classList.add('pop-in');
  }
  function toLanding(){
    dash.classList.remove('active');
    setTimeout(()=>{ dash.hidden=true; landing.hidden=false; landing.classList.add('active'); },160);
  }

  // ---------- Events ----------
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const n=(nameInput.value||"").trim();
    if(!n){ nameInput.focus(); return; }
    // Persist chosen index for name so it feels uniquely assigned
    const key = "bijoya_idx:"+n.toLowerCase();
    if(localStorage.getItem(key)===null){
      // Assign based on hash to keep consistent across devices too
      const idx = hashName(n) % wishes.length;
      localStorage.setItem(key, String(idx));
    }
    toDash(n);
  });
  backBtn.addEventListener('click', toLanding);

  // Prefill name if previously used
  const saved = localStorage.getItem('bijoya_name');
  if(saved) nameInput.value = saved;
});
