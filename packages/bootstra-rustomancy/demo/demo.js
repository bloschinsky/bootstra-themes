/* RUSTOMANCY demo page logic: LIFE LINE logo, character sheet, HUD, palmist. */
(()=>{
const R=window.Rustomancy;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const {PX,cv,hex,fromRamp,rustTile,hazardTile,rivet,sigil,drum}=R;

/* ---- logo plate ---- */
async function logo(){const W=262,H=76,c=$('#logo');c.width=W;c.height=H;const x=c.getContext('2d');
  const rt=rustTile(31,false);const tex=cv(W,H);const tx=tex.getContext('2d');tx.fillStyle=tx.createPattern(rt,'repeat');tx.fillRect(0,0,W,H);
  x.fillStyle='#000';x.fillRect(0,0,W,H);x.drawImage(tex,2,2,W-4,H-4,2,2,W-4,H-4);
  x.fillStyle='rgba(255,228,190,.28)';x.fillRect(2,2,W-4,1);x.fillRect(2,2,1,H-4);x.fillStyle='rgba(0,0,0,.6)';x.fillRect(2,H-3,W-4,1);x.fillRect(W-3,2,1,H-4);
  const hz=hazardTile('#c9a04a');x.fillStyle=x.createPattern(hz,'repeat');x.fillRect(66,6,W-76,6);x.fillStyle='#000';x.fillRect(66,5,W-76,1);x.fillRect(66,12,W-76,1);
  [[4,4],[W-10,4],[4,H-10],[W-10,H-10]].forEach(([a,b])=>x.drawImage(rivet,a,b));
  x.drawImage(await sigil(52),8,12);
  const t=cv(W,H),tc=t.getContext('2d');let fz=46;do{tc.font=`400 ${fz}px "Jersey 15",Impact,sans-serif`;fz-=2}while(tc.measureText('LIFE LINE').width>W-80&&fz>18);tc.textBaseline='alphabetic';
  tc.fillStyle='#efd28a';tc.fillText('LIFE LINE',68,54);tc.globalCompositeOperation='source-over';
  const s=cv(W,H),sc2=s.getContext('2d');sc2.font=tc.font;sc2.fillStyle='#120c07';sc2.fillText('LIFE LINE',70,56);
  [s,t].forEach(cc=>{const g=cc.getContext('2d'),d=g.getImageData(0,0,W,H);for(let k=3;k<d.data.length;k+=4){d.data[k]=d.data[k]>110?255:0}g.putImageData(d,0,0)});
  x.drawImage(s,0,0);x.drawImage(s,1,0);
  const td=t.getContext('2d').getImageData(0,0,W,H);const G=['#6e521c','#a98535','#c9a04a','#e3c27a'].map(hex);
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const k=(j*W+i)*4;if(!td.data[k+3])continue;const v=1-(j-20)/36;const cc=Math.random()<.07?hex('#4d2511'):fromRamp(G,v,i,j);td.data[k]=cc[0];td.data[k+1]=cc[1];td.data[k+2]=cc[2]}
  t.getContext('2d').putImageData(td,0,0);x.drawImage(t,0,0);
  const sub=cv(W,12),sx=sub.getContext('2d');sx.font='8px Silkscreen,monospace';sx.fillStyle='#120c07';const ST='A POST-ATOMIC ROLE-PLAYING GAME';const sw=Math.ceil(sx.measureText(ST).width);sx.fillText(ST,0,9);
  const sd=sx.getImageData(0,0,W,12);for(let k=3;k<sd.data.length;k+=4)sd.data[k]=sd.data[k]>90?255:0;sx.putImageData(sd,0,0);
  const bw=Math.min(W-76,sw+8);x.fillStyle='rgba(239,210,138,.85)';x.fillRect(68,60,bw,11);x.fillStyle='#000';x.fillRect(68,59,bw,1);x.fillRect(68,71,bw,1);x.drawImage(sub,72,61);
  c.style.width=W*3+'px';c.style.maxWidth='100%'}


async function art(){
  await logo();
  const ps=$('#palm-sigil');const big=await sigil(40);ps.width=40;ps.height=40;ps.getContext('2d').drawImage(big,0,0);ps.style.width='80px';
}
if(R.ready)art();else document.addEventListener('rustomancy:ready',art,{once:true});

/* ---- demo ---- */
const STATS=[['life','LIF','Life line',6],['head','HED','Head line',7],['heart','HRT','Heart line',5],['fate','FAT','Fate line',4],['sun','SUN','Sun line',6],['mars','MRS','Mount of Mars',8],['venus','VEN','Mount of Venus',4]];
const WORDS=['','Awful','Bad','Weak','Meh','Average','Fair','Good','Great','Superb','Legend'];
const s={};STATS.forEach(q=>s[q[0]]=q[3]);let free=0;
const statsEl=$('#stats');
statsEl.innerHTML=STATS.map(([k,a,n])=>`<div class="rm-stat" data-k="${k}"><b class="rm-stat-key" title="${n}">${a}</b><span class="rm-drum"></span><span class="rm-crt rm-crt-chip"></span><span class="rm-stat-btns"><button class="btn btn-rm btn-rm-xs" data-d="1" aria-label="${n} up">+</button><button class="btn btn-rm btn-rm-xs" data-d="-1" aria-label="${n} down">-</button></span></div>`).join('');
statsEl.addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;const k=b.closest('.rm-stat').dataset.k,d=+b.dataset.d;
  if(d>0&&(free<=0||s[k]>=10))return;if(d<0&&s[k]<=1)return;s[k]+=d;free-=d;renderAll()});
const SKILLS=[
['Small Guns',q=>5+4*q.head,'Pistols, rifles, sawed-off water pipes. The clearer the head line, the steadier the hand.'],
['Big Guns',q=>2*q.mars+q.head,'Anything heavier than a bucket that still shoots. Needs a strong Mount of Mars and a stronger back.'],
['Energy Weapons',q=>2*q.head,'Lasers, plasma, gadgets running on trolleybus batteries.'],
['Melee',q=>20+2*(q.mars+q.life),'Knives, rebar, shovels. The most honest skill in the wasteland.'],
['Throwing',q=>4*q.head,'Grenades, rocks, hatchets and bad news.'],
['First Aid',q=>2*(q.head+q.heart),'Bandages, splints, alcohol inside and out.'],
['Doctor',q=>5+q.head+q.heart,'Surgery where the only sterile thing is the sand.'],
['Sneak',q=>5+3*q.fate,'Walk quiet, breathe rarely, never step on cans.'],
['Lockpick',q=>10+q.head+q.fate,'Locks, safes, bunker doors and guards\u2019 hearts.'],
['Steal',q=>3*q.fate,'Borrowing without returning. Your fate line knows when to stop.'],
['Traps',q=>10+q.head+q.fate,'Set, spot, disarm. Preferably in that order.'],
['Science',q=>4*q.head,'Terminals, reactors, manuals from pre-war cabinets.'],
['Repair',q=>3*q.head,'Blue tape, a hammer and faith.'],
['Speech',q=>5*q.sun,'Persuade, bargain for your own life, lie convincingly.'],
['Barter',q=>4*q.sun,'Buy low, sell high, live to see the next market.'],
['Gambling',q=>5*q.fate,'Dice, cards, roulette with chips that glow.'],
['Palmistry',q=>3*(q.fate+q.heart),'Reading palms. Your own, to know when to run. Others\u2019, to know who not to trust.'],
['Outdoorsman',q=>2*(q.venus+q.life),'Maps, stars and roads that haven\u2019t caved in yet.']];
let skillSel=16;const skillsEl=$('#skills');const pct=i=>Math.min(200,SKILLS[i][1](s));
function renderSkills(focus){skillsEl.innerHTML=SKILLS.map((sk,i)=>`<li role="option" tabindex="${i===skillSel?0:-1}" aria-selected="${i===skillSel}" class="${i===skillSel?'sel':''}" data-i="${i}"><span>${sk[0]}</span><span>${pct(i)}%</span></li>`).join('');
  const t=$('#dossier-title');t.dataset.text=SKILLS[skillSel][0];t._fs=0;if(R.ready)R.pxText(t);else t.textContent=SKILLS[skillSel][0];
  $('#dossier-val').textContent=pct(skillSel)+'%';$('#dossier-text').textContent=SKILLS[skillSel][2];
  if(focus)skillsEl.querySelector('.sel').focus()}
skillsEl.addEventListener('click',e=>{const li=e.target.closest('li');if(!li)return;skillSel=+li.dataset.i;renderSkills(true)});
skillsEl.addEventListener('keydown',e=>{if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;e.preventDefault();skillSel=(skillSel+(e.key==='ArrowDown'?1:-1)+SKILLS.length)%SKILLS.length;renderSkills(true)});
const TOOLS=[['Lockpick',8],['Steal',9],['Doctor',6],['Science',11],['Repair',12],['Palmistry',16]];
$('#tools').innerHTML=TOOLS.map(([n,i])=>`<div class="d-flex align-items-center gap-2"><button class="btn btn-rm flex-grow-1" data-skill="${i}">${n}</button><span class="rm-drum" data-tool="${i}"></span></div>`).join('');
$('#tools').addEventListener('click',e=>{const b=e.target.closest('[data-skill]');if(!b)return;skillSel=+b.dataset.skill;renderSkills();say('Using '+SKILLS[skillSel][0]+'...')});
function renderAll(){
  $$('.rm-stat',statsEl).forEach(row=>{const k=row.dataset.k;drum($('.rm-drum',row),s[k]);$('.rm-crt-chip',row).textContent=WORDS[s[k]]});
  drum($('#free'),free);const hp=15+s.life*3+s.mars*2;
  $('#status').innerHTML=`Hit Points ${hp}/${hp}<br><span class="dim">Poisoned<br>Radiated<br>Eye damage<br>Crippled right arm<br>Crippled left leg</span>`;
  $('#derived').innerHTML=[['Armor Class',s.sun],['Action Points',5+Math.floor(s.head/2)],['Carry Weight',25+s.mars*25],['Melee Damage',Math.max(1,s.mars-5)],['Poison Res.',s.venus*5+'%'],['Rad. Res.',s.venus*2+'%'],['Sequence',s.head*2],['Healing Rate',Math.max(1,Math.floor(s.venus/3))],['Critical',s.fate+'%']].map(([a,b])=>`<div class="d-flex justify-content-between"><span>${a}</span><span>${b}</span></div>`).join('');
  $('#lvl').innerHTML='Level: 3<br>Exp: 3,410<br>Next Level: 6,000';
  drum($('#hp'),hp,3);drum($('#ac'),s.sun,3);$$('[data-tool]').forEach(el=>drum(el,pct(+el.dataset.tool),3));renderSkills()}
renderAll();

const RES=['1920x1080','1760x990','1680x1050','1280x1024','1024x768','800x600','640x480'];let ri=0;
function renderRes(){$('#res-list').innerHTML=RES.map((r,i)=>`<li role="option" aria-selected="${i===ri}" class="${i===ri?'sel':''}" data-i="${i}"><span>${r}</span></li>`).join('');$('#res-mode').textContent=ri+1}
$('#res-list').addEventListener('click',e=>{const li=e.target.closest('li');if(li){ri=+li.dataset.i;renderRes()}});
$$('[data-res]').forEach(b=>b.onclick=()=>{ri=Math.min(RES.length-1,Math.max(0,ri+ +b.dataset.res));renderRes()});renderRes();
let ki=2;const knobEl=$('#knob');
function renderKnob(){knobEl.style.backgroundImage=`var(--k${ki})`;$$('#knob-wrap span').forEach(sp=>sp.classList.toggle('on',+sp.dataset.k===ki));knobEl.setAttribute('aria-label','Palette: '+[8,16,32][ki]+' bit. Click to switch')}
knobEl.onclick=()=>{ki=(ki+1)%3;renderKnob()};renderKnob();
const HZ=[60,75,85,100,120];let hi=0;const hzEl=$('#hz');drum(hzEl,HZ[hi],3);
$$('[data-hz]').forEach(b=>b.onclick=()=>{hi=Math.min(HZ.length-1,Math.max(0,hi+ +b.dataset.hz));drum(hzEl,HZ[hi],3)});

const log=$('#log'),lines=[];
function say(t){lines.push(t);while(lines.length>4)lines.shift();log.innerHTML=lines.map((l,i)=>`<div class="${i===lines.length-1?'rm-cursor':''}">&bull; ${l}</div>`).join('')}
let ap=10;const apEl=$('#ap');
function renderAP(){apEl.innerHTML=Array.from({length:10},(_,i)=>`<i class="${i<ap?'':'off'}"></i>`).join('');apEl.setAttribute('aria-label','Action points: '+ap)}renderAP();
const HITS=['You hit the giant rat for 7 damage.','You missed. The rat looks disappointed.','Critical hit! The raider reconsiders.','Click. The shotgun is empty.'];
$('#slot').onclick=()=>{if(ap<3){say('Not enough action points. Press Turn.');return}ap-=3;renderAP();say(pick(HITS))};
$('#end-turn').onclick=()=>{ap=10;renderAP();say('New turn. The wind carries ash from the east.')};
say('Welcome to Backwater.');say('The Geiger counter clicks softly.');

const toast=bootstrap.Toast.getOrCreateInstance($('#toast'),{delay:2600});
const notify=t=>{$('#toast-text').textContent=t;toast.show()};
$('#toast-btn').onclick=()=>notify('Signal received');
$('#save-btn').onclick=()=>{notify('Game saved');say('Game saved.')};
$('#f-send').onclick=()=>notify('Complaint sent');

const F={'LIFE LINE':['long, with a gap near the green lake. Don\u2019t drink there.','short but very eventful.','forked: in one version you\u2019re a trader, in the other a legend.'],
'HEART LINE':['someone in Backwater is still waiting for your letter.','loyal to a dog more than to people. Fair enough.','crosses your fate line: you\u2019ll meet someone at the radio tower.'],
'FATE LINE':['leads south, where the road hasn\u2019t caved in.','ends at the door of Bunker X-9. Don\u2019t knock.','promises a crate of ammo. There\u2019s a trap under it.'],
'MOUNT OF MARS':['two raiders will regret meeting you.','you\u2019ll win a fight you should have avoided.','strong hands, short on ammo. Count your shots.']};
function readPalm(){$('#fortune').innerHTML=Object.entries(F).map(([k,v])=>`<div class="mb-1">${k}: ${pick(v)}</div>`).join('')+'<hr><span class="dim">Reading fee: 5 caps</span>'}
$('#palm').addEventListener('show.bs.modal',readPalm);$('#reread').onclick=readPalm;

})();
