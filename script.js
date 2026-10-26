/* ===== DATA YANG MUDAH DIGANTI ===== */
const NAMA = "Neysya Jihan Fiorenza Setiawan";
const NAMA_PANGGILAN = "Neysya";   // dipakai di teks hujan digital
const PENGIRIM = "142078";
const FOTO_1 = "foto 11.jpeg", FOTO_2 = "foto 22.jpeg";     // isi alamat gambar / data base64; kosong = bingkai kosong
const LAGU = "Nadin Amizah - Semua Aku Dirayakan (Official Music Video).mp3";           // nama file lagu mp3 (satu folder dengan index.html), contoh: "lagu.mp3". Kosong = musik bawaan
const LAGU_VOLUME = 0.6;    // volume lagu, 0 sampai 1
const ISI_SURAT = `Untuk ${NAMA},

Selamat ulang tahun, Neysya! Semoga di hari spesialmu ini kamu bahagia banget, banyak ketawa, dan dikelilingi hal-hal indah.

Dari jauh, aku cuma mau bilang semoga di umur yang baru ini semua mimpimu pelan-pelan kesampaian, aamiin.

Aku doain kamu selalu sehat, semua urusanmu lancar, dan selalu dikelilingi orang-orang yang tulus sayang sama kamu. Semoga hatimu selalu tenang dan nggak ada lagi hal yang bikin kamu sedih, aamiin.

Semoga kamu selalu bahagia, di mana pun kamu berada. 

Dari seseorang yang diam-diam selalu doain yang terbaik buat kamu.`;
/* =================================== */

const $=s=>document.querySelector(s),RM=matchMedia('(prefers-reduced-motion:reduce)').matches,
rnd=(a,b)=>a+Math.random()*(b-a),T=(ms,f)=>setTimeout(f,RM?ms*.6:ms),
COL=['#ff6fa5','#ffd84d','#7dffc8','#7fd4ff','#ff9a3c'],clamp=x=>Math.max(0,Math.min(1,x));
let W,H,DPR,Q=1,AC,mg,bus,scene=null,skyOn=true;
const RZ=[];
function rs(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;RZ.forEach(f=>f())}
addEventListener('resize',()=>{clearTimeout(rs.t);rs.t=setTimeout(rs,120)});
function show(id){document.querySelectorAll('.sl').forEach(s=>s.classList.toggle('on',s.id==id))}
function flash(){const f=$('#fl');f.classList.remove('f');void f.offsetWidth;f.classList.add('f')}
function burst(x,y,ch,n,d){for(let i=0;i<n;i++){const e=document.createElement('span'),a=rnd(0,6.28),r=d*rnd(.5,1);e.className='bs';e.textContent=ch[i%ch.length];e.style.cssText=`left:${x}px;top:${y}px;color:${COL[i%5]};font-size:${rnd(14,22)}px;--dx:${Math.cos(a)*r}px;--dy:${Math.sin(a)*r-d*.4}px`;document.body.appendChild(e);setTimeout(()=>e.remove(),1300)}}

/* ===== LANGIT BINTANG ===== */
const sky=$('#sky'),sx=sky.getContext('2d');let stars=[],shoot=null,sNext=3;
RZ.push(()=>{sky.width=W*DPR;sky.height=H*DPR;sx.setTransform(DPR,0,0,DPR,0,0);stars=[];const k=W*H/380000;
[[70,.8,2],[32,1.3,5],[10,2,9]].forEach(([n,r,s],L)=>{for(let i=0;i<Math.ceil(n*k);i++)stars.push({x:rnd(0,W),y:rnd(0,H),r:r*rnd(.7,1.2),L,s,ph:rnd(0,6.3),sp:rnd(.6,2)})})});
function drawSky(dt,t){sx.clearRect(0,0,W,H);sx.fillStyle='#fff';sx.strokeStyle='#fff';sx.lineWidth=.6;
for(const s of stars){if(!RM){s.y+=s.s*dt;if(s.y>H)s.y=0}sx.globalAlpha=RM?.8:.4+.6*Math.sin(t*s.sp+s.ph)**2;sx.beginPath();sx.arc(s.x,s.y,s.r,0,6.3);sx.fill();
if(s.L==2){sx.beginPath();sx.moveTo(s.x-s.r*4,s.y);sx.lineTo(s.x+s.r*4,s.y);sx.moveTo(s.x,s.y-s.r*4);sx.lineTo(s.x,s.y+s.r*4);sx.stroke()}}
if(!RM){sNext-=dt;if(sNext<0&&!shoot){shoot={x:rnd(W*.3,W),y:rnd(0,H*.35),l:0};sNext=rnd(4,8)}
if(shoot){const s=shoot;s.l+=dt*1.1;s.x-=dt*520;s.y+=dt*260;sx.globalAlpha=Math.max(0,1-s.l);sx.lineWidth=2;sx.beginPath();sx.moveTo(s.x,s.y);sx.lineTo(s.x+70,s.y-35);sx.stroke();sx.lineWidth=.6;if(s.l>1)shoot=null}}
sx.globalAlpha=1}
let last=0,tm=0,fa=0,fc=0;
function loop(ts){requestAnimationFrame(loop);const dt=Math.min((ts-last)/1000,.1);last=ts;tm+=dt;fa+=dt;
if(++fc==90){if(fa/90>.026&&Q>.4)Q-=.2;fa=0;fc=0}
if(document.hidden)return;if(skyOn)drawSky(dt,tm);scene&&scene(dt)}

/* ===== MUSIK (Web Audio) ===== */
const BT=60/70,CH=[[57,60,64,69],[53,57,60,65],[60,64,67,72],[55,59,62,67]],MEL=[[76,69],[77,72],[76,79],[74,71]],fq=m=>440*2**((m-69)/12);
let nt=0,bar=0,tmr;
function note(m,t,d,v){const o=AC.createOscillator(),o2=AC.createOscillator(),g=AC.createGain(),g2=AC.createGain(),lp=AC.createBiquadFilter();
o.type='sine';o2.type='triangle';o.frequency.value=fq(m);o2.frequency.value=fq(m)*2;g2.gain.value=.22;lp.type='lowpass';lp.frequency.value=2200;
o.connect(g);o2.connect(g2);g2.connect(g);g.connect(lp);lp.connect(bus);
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);
o.start(t);o2.start(t);o.stop(t+d+.05);o2.stop(t+d+.05)}
function pad(ms,t,d){ms.forEach((m,i)=>{const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();o.type='sawtooth';o.frequency.value=fq(m-12);o.detune.value=i*5-6;
lp.type='lowpass';lp.frequency.value=520;o.connect(lp);lp.connect(g);g.connect(bus);
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.011,t+1.1);g.gain.setValueAtTime(.011,t+d-.1);g.gain.linearRampToValueAtTime(0,t+d+1.3);o.start(t);o.stop(t+d+1.4)})}
function sched(){while(nt<AC.currentTime+2){const c=CH[bar%4],t=nt,m=MEL[bar%4];pad(c.slice(0,3),t,4*BT);note(c[0]-12,t,3*BT,.16);
[0,1,2,3,2,1,2,1].forEach((x,i)=>note(c[x],t+i*BT/2,1.4,.075));
note(m[0],t,2*BT,.1);note(m[1],t+2*BT,2*BT,.09);nt+=4*BT;bar++}}
function startAudio(){try{AC=new(window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();bus=AC.createGain();
const d=AC.createDelay(),fb=AC.createGain(),wet=AC.createGain();d.delayTime.value=.43;fb.gain.value=.38;wet.gain.value=.35;
bus.connect(mg);bus.connect(d);d.connect(fb);fb.connect(d);d.connect(wet);wet.connect(mg);mg.connect(AC.destination);
mg.gain.setValueAtTime(0,AC.currentTime);mg.gain.linearRampToValueAtTime(.5,AC.currentTime+5);
if(LAGU){startLagu();return}startSynth()}catch(e){AC=null}}
function startSynth(){nt=AC.currentTime+.1;sched();tmr=setInterval(sched,500)}
let au=null,aut;
function startLagu(){au=new Audio(LAGU);au.loop=true;au.volume=0;au.addEventListener('error',()=>{au=null;startSynth()});const p=au.play();if(p&&p.catch)p.catch(()=>{});let v=0;clearInterval(aut);aut=setInterval(()=>{v=Math.min(LAGU_VOLUME,v+LAGU_VOLUME/50);if(au)au.volume=v;if(v>=LAGU_VOLUME)clearInterval(aut)},100)}
function fadeOut(){if(au){clearInterval(aut);const a=au;let v=a.volume;const st=Math.max(v,.01)/18;aut=setInterval(()=>{v=Math.max(0,v-st);a.volume=v;if(v<=0){clearInterval(aut);a.pause();if(au===a)au=null}},100)}if(!AC)return;clearInterval(tmr);mg.gain.cancelScheduledValues(AC.currentTime);mg.gain.setValueAtTime(mg.gain.value,AC.currentTime);mg.gain.linearRampToValueAtTime(0,AC.currentTime+1.8)}
document.addEventListener('visibilitychange',()=>{if(au){document.hidden?au.pause():au.play().catch(()=>{})}if(!AC)return;document.hidden?AC.suspend():AC.resume()});
function tone(f,d,ty,v){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime;o.type=ty||'sine';o.frequency.value=f;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.start(t);o.stop(t+d)}
function boom(v){if(!AC)return;const n=AC.sampleRate*.6|0,b=AC.createBuffer(1,n,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n)**3;
const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=b;f.type='lowpass';f.frequency.value=700;g.gain.value=v;s.connect(f);f.connect(g);g.connect(AC.destination);s.start()}

/* ===== SLIDE 1A: HAPPY BIRTHDAY + BONEKA ===== */
const doll=$('#doll'),dw=$('#dw'),bub=$('#bub');let tapN=0,bt;
function gaze(e){const r=$('#dd').getBoundingClientRect(),dx=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/(W/3))),dy=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height*.4)/(H/3)));
['iL','iR'].forEach(i=>$('#'+i).setAttribute('transform',`translate(${dx*2.8} ${dy*2.4})`))}
addEventListener('pointermove',gaze);addEventListener('pointerdown',gaze);
function dollTap(){dw.classList.remove('jump');void dw.offsetWidth;dw.classList.add('jump');bub.textContent=['Hai!','Selamat ya!'][tapN++%2];bub.classList.add('on');clearTimeout(bt);bt=setTimeout(()=>bub.classList.remove('on'),1500);
const r=dw.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height*.3,['♥'],5,80);tone(700+tapN%2*200,.15,'sine',.05)}
dw.addEventListener('pointerdown',dollTap);
function blink(){const e=$('#eyes');e.style.transform='scaleY(.08)';setTimeout(()=>e.style.transform='',130);setTimeout(blink,rnd(1800,4500))}
function decor(){const f=$('#fd');for(let i=0;i<(RM?6:16);i++){const e=document.createElement('i'),ty=i%4;e.className='fd t'+ty;e.textContent=ty==1?'♥':ty==3?'✦':'';
e.style.cssText=`left:${rnd(2,96)}%;top:${rnd(8,92)}%;animation-delay:${-rnd(0,6)}s;animation-duration:${rnd(5,9)}s;color:${COL[i%5]};background:${ty%2?'none':COL[(i+2)%5]}`;f.appendChild(e)}}
function runDoll(){$('#a').classList.remove('gone');$('#a').classList.add('st');const hb=$('#hb'),ls=[];let k=0;
['HAPPY','BIRTHDAY'].forEach(w=>{const r=document.createElement('div');r.className='row';[...w].forEach(ch=>{const s=document.createElement('span');s.className='lt';s.style.color=COL[k++%5];s.innerHTML='<b class="cd"><i class="fm"></i></b>'+ch;r.appendChild(s);ls.push(s)});hb.appendChild(r)});
decor();setTimeout(blink,2500);
setInterval(()=>{if($('#a').classList.contains('gone')||doll.classList.contains('cheer'))return;doll.classList.add('wave');setTimeout(()=>doll.classList.remove('wave'),1900);
const r=dw.getBoundingClientRect();burst(r.left+r.width/2,r.top,['▪','✦','•'],8,70)},6000);
ls.forEach((s,i)=>{T(700+i*180,()=>s.classList.add('in'));T(3300+i*110,()=>{s.querySelector('.fm').classList.add('lit');if(i%3==0)tone(880+i*30,.15,'sine',.03)})});
T(5700,()=>doll.classList.add('blow'));
T(6100,()=>{ls.forEach(s=>s.querySelector('.fm').classList.add('out'));doll.classList.remove('blow');doll.classList.add('cheer');boom(.12)});
T(7000,flash);
T(7700,()=>{$('#a').classList.add('gone');show('s2');runS2()})}

/* ===== SLIDE 1B: HUJAN DIGITAL ===== */
const mx=$('#mx'),mc=mx.getContext('2d'),CS='0123456789ABCDEFGHKMNPRSTXYZ+-=*<>/|{}$%&@#?!',rc=()=>Math.random()<.04?'♥':CS[Math.random()*CS.length|0],
LS=[{sz:9,v:[50,100],p:1,a:.45,ln:[12,20]},{sz:13,v:[120,220],p:.9,a:.8,ln:[15,26]},{sz:17,v:[230,380],p:.6,a:1,ln:[18,30]}],pal=[];
for(let i=0;i<31;i++)pal.push(`hsl(${340+i*.4},100%,${Math.max(24,74-i*1.7)}%)`);
let dr=[[],[],[]],cw=13,cols,gs,gW,gH,mk=null,cells=[],mt=0,lit=0,spd=1,idx=-2,rip=[],shake=0,mDone=0,rise=0,items=[];const D=RM?1.2:1.85;
RZ.push(()=>{mx.width=W*DPR;mx.height=H*DPR;mc.setTransform(DPR,0,0,DPR,0,0);cw=W/Math.round(W/13);cols=Math.ceil(W/cw);gs=W<700?cw/2:cw*.7;gW=Math.ceil(W/gs);gH=Math.ceil(H/gs);
dr=[[],[],[]];for(let c=0;c<cols;c++)LS.forEach((l,li)=>{if(Math.random()<l.p){const n=rnd(l.ln[0],l.ln[1])|0;dr[li].push({x:c*cw+cw/2+rnd(-2,2),y:rnd(-H,H),v:rnd(...l.v),n,ch:Array.from({length:n},rc)})}});
dr.forEach(a=>a.sort(()=>Math.random()-.5));if(idx>=0)setMask(items[idx])});
const FONT='"Arial Rounded MT Bold",Nunito,"Varela Round","Trebuchet MS",system-ui,sans-serif';let pp=0,TX=null,mTot=0;
function setMask(it){const o=document.createElement('canvas');o.width=gW;o.height=gH;const c=o.getContext('2d'),F='900 100px '+FONT;c.font=F;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';
const ln=it.l2||[it.t],w=Math.max(...ln.map(s=>c.measureText(s).width)),sz=Math.min(gW*(it.l2?.75:.6)/w*100,gH*(it.big?.38:.22)/ln.length);
c.font=F.replace('100px',sz+'px');TX={ln,sz:sz*gs};ln.forEach((s,i)=>c.fillText(s,gW/2,gH/2+(i-(ln.length-1)/2)*sz*1.05));
const d=c.getImageData(0,0,gW,gH).data;mk=new Uint8Array(gW*gH);cells=[];for(let i=0;i<gW*gH;i++)if(d[i*4+3]>110){mk[i]=1;cells.push(i)}}
function drawDrops(dt){const sg=rise>0?-1:1;
for(let li=0;li<3;li++){const A=dr[li],m=Math.ceil(A.length*Q),l=LS[li];mc.font=l.sz+'px monospace';mc.textAlign='center';mc.textBaseline='top';
for(let j=0;j<m;j++){const d=A[j];let v=d.v*spd;
if(mk&&lit>0){const gx=d.x/gs|0,gy=d.y/gs|0;if(gx>=0&&gx<gW&&gy>=0&&gy<gH&&mk[gy*gW+gx])v*=1-.88*lit}
d.y+=sg*v*(1+rise*2)*dt;const st=l.sz*1.05;
if(sg>0){if(d.y-d.n*st>H)d.y=rnd(-120,0)}else if(d.y+d.n*st<0)d.y=H+rnd(0,H*.3);
d.ch[Math.random()*d.n|0]=rc();
for(let i=d.n-1;i>=0;i--){const y=d.y-sg*i*st;if(y<-st||y>H+st)continue;mc.globalAlpha=l.a*(1-i/d.n)**1.5;
if(i==0){mc.fillStyle='#fff4f8';if(li>0&&Q>.6){mc.shadowBlur=12;mc.shadowColor='#ff5c9a'}mc.globalAlpha=l.a;mc.fillText(d.ch[0],d.x,y);mc.shadowBlur=0}
else{mc.fillStyle=pal[Math.min(30,i)];mc.fillText(d.ch[i],d.x,y)}}}}
mc.globalAlpha=1}
function drawText(){if(!TX||lit<=0)return;const e=clamp(pp/.22),b=e-1,sc=1+2.70158*b*b*b+1.70158*b*b;
mc.save();mc.translate(W/2,H/2);mc.scale(sc,sc);mc.font='900 '+TX.sz+'px '+FONT;mc.textAlign='center';mc.textBaseline='middle';
mc.globalAlpha=Math.min(1,lit*1.4);mc.shadowColor='#ff3d7f';mc.shadowBlur=24;mc.lineWidth=TX.sz*.06;mc.lineJoin='round';mc.strokeStyle='rgba(60,0,30,.55)';mc.fillStyle='#ff74b8';
TX.ln.forEach((t,i)=>{const y=(i-(TX.ln.length-1)/2)*TX.sz*1.05+TX.sz*.04;mc.strokeText(t,0,y);mc.fillText(t,0,y)});mc.restore();mc.globalAlpha=1}
function mScene(dt){mt+=dt;let k=-1,p=0;const end=3.5+mTot;
if(mt>=3.5&&mt<end){let e=mt-3.5;k=0;while(e>=items[k].d){e-=items[k].d;k++}p=e/items[k].d}
if(k!=idx){idx=k;if(k>=0){setMask(items[k]);if(items[k].big){rip.push({r:0})}}else mk=null}
lit=k<0?0:p<.2?p/.2:p>.8?(1-p)/.2:1;shake=0;pp=p;
const tg=1+(k>=4?(k-3)*.9:0)+(mt>=end?1:0);spd+=(tg-spd)*Math.min(1,dt*2);rise=mt>=end?Math.min(1,(mt-end)/2.6):0;
mc.globalAlpha=1;mc.fillStyle='#08020e';mc.fillRect(0,0,W,H);drawDrops(dt);drawText();
const mxr=Math.max(W,H)*.6;mc.strokeStyle='#ff8fb8';mc.lineWidth=3;
for(const q of rip){q.r+=dt*mxr;mc.globalAlpha=Math.max(0,.8-q.r/mxr);mc.beginPath();mc.arc(W/2,H/2,q.r,0,6.3);mc.stroke()}rip=rip.filter(q=>q.r<mxr);
if(rise>0){mc.globalAlpha=rise*rise*.92;mc.fillStyle='#ffe6f0';mc.fillRect(0,0,W,H)}mc.globalAlpha=1;
if(mt>=end+2.7&&!mDone){mDone=1;flash();T(400,()=>{skyOn=true;mx.classList.remove('on');runDoll();setTimeout(()=>{scene=null},1200)})}}
function startMatrix(){const NP=NAMA_PANGGILAN.toUpperCase();items=[...['HAPPY','BIRTHDAY','TO',NP].map(t=>({t,d:RM?1.1:1.7})),...[3,2,1].map(n=>({t:''+n,big:1,d:RM?1.1:1.5}))];mTot=items.reduce((a,b)=>a+b.d,0);skyOn=false;mx.classList.add('on');scene=mScene}

/* ===== SLIDE 2: SURAT ===== */
function runS2(){const env=$('#env'),paper=$('#paper'),pc=$('#pc'),pet=$('#pet'),cs=[];
for(let i=0;i<(RM?6:14);i++){const e=document.createElement('span');e.className='pt';e.textContent=['✿','♥','❀'][i%3];e.style.cssText=`left:${rnd(0,96)}%;color:${COL[0]};opacity:${rnd(.4,.8)};font-size:${rnd(14,26)}px;animation-duration:${rnd(9,16)}s;animation-delay:${-rnd(0,12)}s`;pet.appendChild(e)}
pc.innerHTML='';ISI_SURAT.trim().split(/\n+/).forEach(p=>{const d=document.createElement('p');[...p].forEach((ch,i,a)=>{const s=document.createElement('span');s.className='c';s.textContent=ch;if(i==a.length-1)s.dataset.p=650;d.appendChild(s);cs.push(s)});pc.appendChild(d)});
const sg=document.createElement('div');sg.className='sg';[[',',1],[PENGIRIM+' ♥',0]].forEach(([t,br])=>{[...t].forEach((ch,i)=>{const s=document.createElement('span');s.className='c';s.textContent=ch;if(!cs.some(x=>x.dataset.sg)&&!i&&br){s.dataset.p=1500;s.dataset.first=1}s.dataset.sg=1;sg.appendChild(s);cs.push(s)});if(br)sg.appendChild(document.createElement('br'))});const ph=document.createElement('div');ph.className='ph';[FOTO_1,FOTO_2].forEach(u=>{const f=document.createElement('div');f.className='pf';if(u){const im=new Image();im.src=u;im.alt='';f.appendChild(im)}else{const q=document.createElement('i');q.textContent='♥';f.appendChild(q)}ph.appendChild(f)});pc.appendChild(ph);pc.appendChild(sg);
function fit(){let k=1;for(let t=0;t<12;t++){pc.style.setProperty('--ph',(pc.clientHeight*.32*k)+'px');let lo=9,hi=22;for(let i=0;i<9;i++){const m=(lo+hi)/2;pc.style.fontSize=m+'px';pc.scrollHeight<=pc.clientHeight+1?lo=m:hi=m}pc.style.fontSize=lo+'px';if(pc.scrollHeight<=pc.clientHeight+1)break;k*=.85}}
RZ.push(fit);let i=0,fast=0,done=0,ready=0,go=0;
function end(){if(done)return;done=1;setTimeout(()=>{ready=1},700)}
function type(){if(fast){cs.forEach(s=>s.classList.add('v'));ph.classList.add('v');return end()}if(i>=cs.length)return end();const s=cs[i++],ch=s.textContent;if(s.dataset.first)ph.classList.add('v');s.classList.add('v');
setTimeout(type,rnd(55,70)+(+s.dataset.p||('.!?'.includes(ch)?380:',;'.includes(ch)?160:0)))}
paper.onclick=()=>{fast=1};
env.onclick=()=>{if(env.dataset.o)return;env.dataset.o=1;env.classList.add('crack');tone(320,.12,'triangle',.05);
T(500,()=>env.classList.add('open'));
T(1300,()=>{const r=env.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2,['♥','✦','♥'],16,130);env.classList.add('out');fit();paper.classList.add('show');T(1300,type)})};
function goNext(){if(!env.dataset.o){env.click();return}if(!ready||go)return;go=1;show('s3');runS3()}
$('#s2').onclick=goNext;window.s2next=goNext}
addEventListener('keydown',e=>{if(['ArrowRight','Enter',' '].includes(e.key)&&$('#s2').classList.contains('on')&&window.s2next)window.s2next()});

/* ===== SLIDE TERAKHIR: PARTIKEL MEMBENTUK HATI ===== */
const fx=$('#fx'),g=fx.getContext('2d'),HP=['#ffc2dc','#ff8fb8','#ff5c9a','#ffe3ef','#ff77b7','#ffffff'];
let N3=0,t3=0,SX,SY,HX,HY,DL,SZ,SW,mini=[],ended=0,hsc=1;const TEND=12.2;
RZ.push(()=>{fx.width=W*DPR;fx.height=H*DPR;g.setTransform(DPR,0,0,DPR,0,0);g.fillStyle='#04051a';g.fillRect(0,0,W,H)});
function runS3(){skyOn=false;t3=0;ended=0;mini=[];N3=RM?900:W<700?1800:3200;const n=N3,cx=W/2,cy=H/2,sc=hsc=Math.min(W*.8/34,H*.58/32),R=Math.max(W,H)*.6;
[SX,SY,HX,HY,DL,SZ,SW]=Array.from({length:7},()=>new Float32Array(n));
for(let i=0;i<n;i++){const th=rnd(0,6.283),f=Math.random()<.4?1:Math.sqrt(Math.random()),a=rnd(0,6.283),r=R*rnd(.5,1.1);
HX[i]=cx+16*Math.sin(th)**3*f*sc;HY[i]=cy+(-(13*Math.cos(th)-5*Math.cos(2*th)-2*Math.cos(3*th)-Math.cos(4*th))*f-2.5)*sc;
SX[i]=cx+Math.cos(a)*r;SY[i]=cy+Math.sin(a)*r;DL[i]=Math.random();SZ[i]=f==1?rnd(1.6,2.6):rnd(.9,1.8);SW[i]=rnd(.5,1.2)*(Math.random()<.5?1:-1)}
scene=s3Scene}
function s3Scene(dt){t3+=dt;const cx=W/2,cy=H/2,n=Math.floor(N3*Q),fa=1-clamp((t3-TEND)/2.2);
g.globalCompositeOperation='source-over';g.globalAlpha=1;g.fillStyle='rgba(4,5,26,.28)';g.fillRect(0,0,W,H);g.globalCompositeOperation='lighter';
const pp=t3-7.2,m=pp%1.2,pl=pp>0?.06*(Math.exp(-(((m-.1)/.08)**2))+.7*Math.exp(-(((m-.38)/.08)**2))):0,gl=clamp(t3/6)*(.5+pl*4);
const gr=g.createRadialGradient(cx,cy,0,cx,cy,hsc*24);gr.addColorStop(0,'rgba(255,110,170,'+(.22*gl*fa)+')');gr.addColorStop(1,'rgba(255,60,130,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);
for(let c=0;c<6;c++){g.fillStyle=HP[c];for(let i=c;i<n;i+=6){const e0=clamp((t3-.3-DL[i]*3.2)/3.6),e=e0*e0*(3-2*e0),dx=HX[i]-SX[i],dy=HY[i]-SY[i],o=Math.sin(Math.PI*e)*SW[i]*.3;
let x=SX[i]+dx*e-dy*o,y=SY[i]+dy*e+dx*o;const s=1+pl*e;x=cx+(x-cx)*s;y=cy+(y-cy)*s;
g.globalAlpha=(.25+.75*clamp(e*2.5))*fa;const z=SZ[i]*(.75+.45*Math.sin(t3*4+i));g.fillRect(x-z/2,y-z/2,z,z)}}
g.globalCompositeOperation='source-over';
if(t3>7.5&&mini.length<14&&Math.random()<dt*5)mini.push({x:cx+rnd(-.6,.6)*hsc*14,y:cy+rnd(-.2,.7)*hsc*10,vy:rnd(25,55),l:1,s:rnd(10,18),c:HP[Math.random()*3|0]});
g.textAlign='center';g.textBaseline='middle';
for(let i=mini.length-1;i>=0;i--){const q=mini[i];q.y-=q.vy*dt;q.l-=dt*.35;if(q.l<=0){mini.splice(i,1);continue}g.globalAlpha=q.l*.8*fa;g.fillStyle=q.c;g.font=q.s+'px sans-serif';g.fillText('♥',q.x,q.y)}
g.globalAlpha=1;
if(t3>=TEND&&!ended){ended=1;fadeOut();$('#blk').classList.add('on');setTimeout(()=>{try{window.close()}catch(e){}scene=null;document.querySelectorAll('.sl,#sky').forEach(s=>s.style.display='none')},2400)}}

/* ===== MULAI ===== */
$('#go').onclick=()=>{startAudio();show('s1');startMatrix()};
rs();requestAnimationFrame(loop);