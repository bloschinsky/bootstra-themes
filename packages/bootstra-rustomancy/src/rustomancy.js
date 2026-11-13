/*!
 * RUSTOMANCY 0.2 - post-atomic pixel-art theme for Bootstrap 5.3
 * Pixel engine: procedural textures, sprites, pixel text, photo frames, theme switches.
 * MIT License
 */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
const store=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const load=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const PX=2;

/* =================== PIXEL ENGINE =================== */
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const hex=h=>{h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
const BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>v/16-.47);
const bay=(i,j)=>BAYER[(j&3)*4+(i&3)];
let seedV=1;const rnd=()=>(seedV=(seedV*16807)%2147483647)/2147483647;
function vnoise(w,h,cell,seed){seedV=seed;const gw=Math.round(w/cell),gh=Math.round(h/cell),g=[];for(let i=0;i<gw*gh;i++)g.push(rnd());
  const v=(i,j)=>g[((j%gh)+gh)%gh*gw+((i%gw)+gw)%gw];
  return(x,y)=>{const fx=x/cell,fy=y/cell,x0=Math.floor(fx),y0=Math.floor(fy),tx=fx-x0,ty=fy-y0,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);
    const a=v(x0,y0)+(v(x0+1,y0)-v(x0,y0))*sx,b=v(x0,y0+1)+(v(x0+1,y0+1)-v(x0,y0+1))*sx;return a+(b-a)*sy}}
function fbm(w,h,cells,seed){const ns=cells.map((c,i)=>vnoise(w,h,c,seed+i*977));let t=0;cells.forEach((_,i)=>t+=1/(i+1));return(x,y)=>{let s=0;ns.forEach((n,i)=>s+=n(x,y)/(i+1));return s/t}}
function paint(w,h,fn){const c=cv(w,h),x=c.getContext('2d'),d=x.createImageData(w,h);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){const p=fn(i,j);if(!p)continue;const k=(j*w+i)*4;d.data[k]=p[0];d.data[k+1]=p[1];d.data[k+2]=p[2];d.data[k+3]=p[3]===undefined?255:p[3]}
  x.putImageData(d,0,0);return c}
const fromRamp=(r,v,i,j)=>{v=Math.max(0,Math.min(.9999,v+bay(i,j)/r.length*1.6));return r[Math.floor(v*r.length)]};
function crunch(c,pal,noise=0){const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height),P=pal.map(hex);
  for(let k=0;k<d.data.length;k+=4){if(d.data[k+3]<120){d.data[k+3]=0;continue}d.data[k+3]=255;
    const p=k/4,i=p%c.width,j=(p/c.width)|0,n=noise?(bay(i,j)*noise+(Math.random()-.5)*noise*.6):0;
    const r=d.data[k]+n,g=d.data[k+1]+n,b=d.data[k+2]+n;let best=0,bd=1e9;
    P.forEach((q,ix)=>{const dd=(r-q[0])**2*.3+(g-q[1])**2*.59+(b-q[2])**2*.11;if(dd<bd){bd=dd;best=ix}});
    d.data[k]=P[best][0];d.data[k+1]=P[best][1];d.data[k+2]=P[best][2]}
  x.putImageData(d,0,0);return c}
function sprite(rows,map){const h=rows.length,w=rows[0].length;return paint(w,h,(i,j)=>{const ch=rows[j][i];return map[ch]?[...hex(map[ch])]:null})}
const url=c=>`url(${c.toDataURL()})`;
const setVar=(n,c)=>root.style.setProperty(n,url(c));
function svgImg(svg){return new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)})}

/* ---- textures ---- */
const METAL=['#1f1814','#30261f','#43362c','#54453a','#655446','#7a6755'].map(hex);
const RUST=['#2e160b','#4d2511','#6e3615','#8f4b1c','#ad6326','#c47f3a'].map(hex);
function rustTile(seed,dark){const W=128,grain=fbm(W,W,[16,8,4,2],seed),blot=fbm(W,W,[64,32,16,8],seed+50),scr=vnoise(W,W,2,seed+9);
  const c=paint(W,W,(i,j)=>{const g=grain(i,j),b=blot(i,j);let col;
    if(b>.56){col=fromRamp(RUST,(g-.25)*1.4+(b-.56)*1.2,i,j)}
    else{col=fromRamp(METAL,(g-.2)*1.2+(dark?-.18:.08),i,j)}
    if(scr(i,j)>.93)col=METAL[0];return col.slice()});
  const x=c.getContext('2d');seedV=seed+3;
  for(let s=0;s<9;s++){const x0=rnd()*W|0,y0=rnd()*W|0,len=6+rnd()*22|0,dx=rnd()>.5?1:0;x.fillStyle=rnd()>.5?'#8a7660':'#151009';for(let t=0;t<len;t++)x.fillRect((x0+t)%W,(y0+(dx?t>>2:0))%W,1,1)}
  return c}
function paperTile(){const W=160,h=fbm(W,W,[40,20,10,5],7);
  const lv=[[0,0,0,70],[0,0,0,42],[0,0,0,18],null,[255,255,240,30],[255,255,240,60]];
  return paint(W,W,(i,j)=>{const s=(h(i+1,j)-h(i-1,j))*6+(h(i,j+1)-h(i,j-1))*6;let v=.5+s+bay(i,j)*.22;
    v=Math.max(0,Math.min(.999,v));const p=lv[Math.floor(v*lv.length)];
    if(Math.random()<.004)return[70,45,20,90];return p})}
function woodTile(w,h,seed){const n=fbm(w*4,h,[32,16,8],seed);const R=['#1d0f07','#2c170b','#3d2110','#4f2c15','#5e371b'].map(hex);
  return paint(w,h,(i,j)=>{let v=n(i*4,j);v=(v*7)%1*.7+n(i*4+3,j*2%h)*.3;return fromRamp(R,v,i,j).slice()})}
function stickyTile(){const n=fbm(24,24,[12,6,3],4);const R=['#bfbb33','#ceca3b','#dcd83e','#e7e35e'].map(hex);
  return paint(24,24,(i,j)=>{const c=fromRamp(R,n(i,j),i,j);return[...c,90]})}
function hazardTile(col){const A=hex('#120d08'),B=hex(col);return paint(8,8,(i,j)=>((i+j)%8<4?A:B).slice())}
function wornTile(){return paint(32,32,()=>[0,0,0,Math.random()<.16?0:255])}

function sandTile(){const W=128,wp=fbm(W,W,[32,16,8],61);
  const lv=[[70,35,0,80],[70,35,0,48],[70,35,0,20],null,[255,240,200,40],[255,240,200,80]];
  return paint(W,W,(i,j)=>{const r=Math.sin(2*Math.PI*(5*i+2*j)/W+wp(i,j)*7);const crest=r>.55?.22:0;
    let v=.45+.28*r+crest+(wp(i,j)-.5)*.6+bay(i,j)*.22;
    if(Math.random()<.035)return Math.random()<.5?[60,30,5,110]:[255,245,215,110];
    v=Math.max(0,Math.min(.999,v));return lv[Math.floor(v*lv.length)]})}
function crackTile(){const W=168,N=4,cs=W/N,pts=[];seedV=77;
  for(let a=0;a<N;a++)for(let b=0;b<N;b++)pts.push([(a+.15+rnd()*.7)*cs,(b+.15+rnd()*.7)*cs,rnd()]);
  const tone=fbm(W,W,[42,21,7],79),hair=fbm(W,W,[24,12],83);
  const lv=[[45,22,5,85],[45,22,5,50],[45,22,5,22],null,[255,238,200,38],[255,238,200,70]];
  return paint(W,W,(i,j)=>{let d1=1e9,d2=1e9,id=0;
    for(const p of pts)for(let ox=-W;ox<=W;ox+=W)for(let oy=-W;oy<=W;oy+=W){const dx=i-p[0]-ox,dy=j-p[1]-oy;if(Math.abs(dx)>cs*2||Math.abs(dy)>cs*2)continue;const d=Math.hypot(dx,dy);if(d<d1){d2=d1;d1=d;id=p[2]}else if(d<d2)d2=d}
    const e=d2-d1;
    if(e<1.6)return[22,10,3,150];
    if(e<3)return[30,14,4,55];
    if(e<4.4)return[255,236,195,50];
    if(Math.abs(hair(i,j)-.5)<.006)return[30,14,4,70];
    let v=.5+(tone(i,j)-.5)*1.3+(id-.5)*.35+Math.min(e/cs,.5)*.25+bay(i,j)*.22;
    if(Math.random()<.01)return[40,20,5,90];
    v=Math.max(0,Math.min(.999,v));return lv[Math.floor(v*lv.length)]})}

/* ---- sprites ---- */
const rivet=sprite(['.dddd.','dhllmd','dlmmmd','dmmmsd','dmmssd','.dddd.'],{d:'#0e0a07',h:'#e2d2b0',l:'#ad967a',m:'#776451',s:'#45382d'});
function led(n,body,hi,mid,dark){const c=n/2-.5;return paint(n,n,(i,j)=>{const d=Math.hypot(i-c,j-c);
  if(d>n/2)return null;if(d>n/2-1)return hex('#0b0705');if(d>n/2-2.2)return hex('#6e5c4a');
  const e=Math.hypot(i-c+1.3,j-c+1.3);return hex(e<1?hi:e<2.2?mid:d>n/2-3.2?dark:body)})}
const xSpr=paint(10,10,(i,j)=>(i>0&&i<9&&j>0&&j<9&&(Math.abs(i-j)<=1||Math.abs(i+j-9)<=1))?hex(((i+j)%3)?'#e0281c':'#8e1408'):null);
function knob(a){const n=26,c=12.5;const k=paint(n,n,(i,j)=>{const d=Math.hypot(i-c,j-c);if(d>12.6)return null;if(d>11.6)return hex('#000');
  if(d>9.4){const ang=Math.atan2(j-c,i-c);return hex(Math.floor((ang+Math.PI)/(Math.PI/10))%2?'#2a221c':'#57483c')}
  return fromRamp(['#16110e','#241c17','#3a2f27','#54453a'].map(hex),.85-(j/n)*.8,i,j).slice()});
  const x=k.getContext('2d');const r=(a-90)*Math.PI/180;for(let t=2;t<10;t++){x.fillStyle='#f0d38b';x.fillRect(Math.round(c+Math.cos(r)*t-.5),Math.round(c+Math.sin(r)*t-.5),2,2)}return k}

/* ---- sigil (hand in a gear) ---- */
const SIGIL=`<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='47' fill='#1a120a'/><circle cx='50' cy='50' r='42' fill='#7e6a4c' stroke='#2a1d10' stroke-width='8' stroke-dasharray='7 5'/><circle cx='50' cy='50' r='34' fill='#a08a62'/><circle cx='40' cy='38' r='22' fill='#c9b07c'/><g fill='#1b130b'><rect x='35' y='44' width='31' height='30' rx='11'/><rect x='35' y='24' width='8' height='27' rx='4'/><rect x='44' y='20' width='8' height='29' rx='4'/><rect x='53' y='21' width='8' height='28' rx='4'/><rect x='61' y='27' width='7' height='24' rx='3.5'/><rect x='23' y='47' width='9' height='21' rx='4.5' transform='rotate(-38 28 58)'/></g><ellipse cx='50' cy='59' rx='10' ry='6' fill='#e3c98e'/><circle cx='50' cy='59' r='3.5' fill='#1b130b'/></svg>`;
const SIGPAL=['#0c0805','#1b130b','#2a1d10','#5c4a30','#7e6a4c','#a08a62','#c9b07c','#e3c98e'];
async function sigil(n){const im=await svgImg(SIGIL);const c=cv(n,n);if(im)c.getContext('2d').drawImage(im,0,0,n,n);return crunch(c,SIGPAL)}

/* ---- scenes for photos ---- */
const SC={
vault:`<rect width='160' height='110' fill='#22302f'/><rect y='78' width='160' height='32' fill='#3a3a32'/><circle cx='80' cy='54' r='40' fill='#5b6866' stroke='#2c3534' stroke-width='10' stroke-dasharray='8 6'/><circle cx='80' cy='54' r='25' fill='#77837f'/><circle cx='80' cy='54' r='9' fill='#2c3534'/><path d='M80 29v50M55 54h50' stroke='#2c3534' stroke-width='5'/><rect x='118' y='14' width='26' height='14' fill='#c9a04a'/><rect x='12' y='20' width='8' height='58' fill='#c9a04a'/>`,
dunes:`<rect width='160' height='110' fill='#c9893f'/><rect width='160' height='40' fill='#d9a35a'/><circle cx='118' cy='30' r='15' fill='#f1cf7a'/><path d='M0 70q40-22 80 0t80-6v46H0z' fill='#9d5f2a'/><path d='M0 88q50-20 100 2t60-8v28H0z' fill='#6f3f1c'/><rect x='30' y='62' width='40' height='14' fill='#2b1d12'/><rect x='38' y='56' width='20' height='8' fill='#3a2716'/><circle cx='38' cy='78' r='5' fill='#120c07'/><circle cx='62' cy='78' r='5' fill='#120c07'/><path d='M128 70v-24m-7 7h14' stroke='#2b1d12' stroke-width='4'/>`,
tower:`<rect width='160' height='110' fill='#3b2440'/><rect y='40' width='160' height='30' fill='#7a3a3a'/><rect y='62' width='160' height='30' fill='#c0603a'/><path d='M80 12L60 92h40z' fill='none' stroke='#1a0f0f' stroke-width='4'/><path d='M70 50h20M66 70h28M74 32h12M67 60l26 20M93 60L67 80' stroke='#1a0f0f' stroke-width='3'/><circle cx='80' cy='12' r='4' fill='#ff4b33'/><rect y='90' width='160' height='20' fill='#1a0f0f'/>`,
market:`<rect width='160' height='110' fill='#14151d'/><path d='M8 84l26-30 26 30zM56 84l30-36 30 36zM104 84l26-28 26 28z' fill='#6b3c22'/><path d='M56 84l30-36 30 36' fill='none' stroke='#b07a3f' stroke-width='3'/><rect y='84' width='160' height='26' fill='#2a2018'/><g fill='#ffd36b'><circle cx='20' cy='40' r='3.5'/><circle cx='45' cy='36' r='3.5'/><circle cx='72' cy='30' r='3.5'/><circle cx='100' cy='32' r='3.5'/><circle cx='128' cy='38' r='3.5'/><circle cx='150' cy='44' r='3.5'/></g><circle cx='86' cy='76' r='7' fill='#f08a2a'/>`,
crew:`<rect width='160' height='110' fill='#7c7f86'/><rect y='80' width='160' height='30' fill='#4a4c52'/><g fill='#1c1e24'><circle cx='22' cy='44' r='9'/><rect x='10' y='54' width='24' height='40' rx='8'/><circle cx='48' cy='40' r='9'/><rect x='36' y='50' width='24' height='44' rx='8'/><circle cx='74' cy='42' r='9'/><rect x='62' y='52' width='24' height='42' rx='8' fill='#e8e4da'/><circle cx='100' cy='40' r='9'/><rect x='88' y='50' width='24' height='44' rx='8'/><circle cx='126' cy='43' r='9'/><rect x='114' y='53' width='24' height='41' rx='8' fill='#2d3c5c'/><circle cx='148' cy='46' r='8'/></g>`,
duo:`<rect width='160' height='110' fill='#b9b09a'/><rect width='160' height='50' fill='#d9d1bd'/><g fill='#2a221b'><circle cx='52' cy='46' r='20'/><rect x='24' y='66' width='56' height='44' rx='18'/><circle cx='112' cy='50' r='18'/><rect x='86' y='68' width='52' height='42' rx='18'/></g><rect x='38' y='42' width='28' height='6' fill='#5a4a3a'/>`};
const SCPAL=['#0e0a07','#1a0f0f','#1c1e24','#2a2018','#2c3534','#3a2716','#3b2440','#4a4c52','#5b6866','#6b3c22','#6f3f1c','#7a3a3a','#77837f','#7c7f86','#9d5f2a','#b07a3f','#b9b09a','#c0603a','#c9893f','#c9a04a','#d9a35a','#d9d1bd','#e8e4da','#f1cf7a','#ffd36b','#ff4b33','#f08a2a','#2d3c5c','#5a4a3a'];
async function photo(el){const w=+el.dataset.w,h=+el.dataset.h,F=4;
  const im=await svgImg(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='110' viewBox='0 0 160 110' preserveAspectRatio='xMidYMid slice'>${SC[el.dataset.scene]}</svg>`);
  const sc=cv(w,h);if(im)sc.getContext('2d').drawImage(im,0,0,w,h);crunch(sc,SCPAL,26);
  el.width=w+F*2;el.height=h+F*2;const x=el.getContext('2d');
  const torn=paint(w+F*2,h+F*2,(i,j)=>{const e=Math.min(i,j,w+F*2-1-i,h+F*2-1-j);const lim=(Math.sin(i*1.7+j*2.3)*.5+.5)*2|0;
    if(e<lim)return null;return hex(Math.random()<.06?'#cfc6b0':'#efe9da')});
  x.drawImage(torn,0,0);x.drawImage(sc,F,F);
  const cor=(ox,oy,sx,sy)=>{for(let a=0;a<9;a++)for(let b=0;b<9-a;b++){x.fillStyle=(a+b===8)?'#6a5236':'#2b1d10';x.fillRect(ox+sx*a-(sx<0?1:0),oy+sy*b-(sy<0?1:0),1,1)}};
  cor(F-2,F-2,1,1);cor(w+F+2,F-2,-1,1);cor(F-2,h+F+2,1,-1);cor(w+F+2,h+F+2,-1,-1);
  el.style.width=(w+F*2)*PX+'px';el.setAttribute('aria-hidden','true');el.parentElement.classList.contains('rm-entry')||el.classList.add('rm-photo');
  el.style.filter='drop-shadow(4px 4px 0 rgba(0,0,0,.45))'}

/* ---- pixel text ---- */
function pxText(el){const cs=getComputedStyle(el);const size=parseFloat(cs.fontSize);const TS=1;const fs=Math.max(6,Math.round(size/TS));
  if(el._fs===fs&&el.querySelector('canvas'))return;el._fs=fs;
  const raw=el.dataset.text||el.textContent.trim();el.dataset.text=raw;const lines=raw.split('|');
  const font=`${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
  const m=cv(1,1).getContext('2d');m.font=font;const lh=Math.ceil(fs*1.25);
  const w=Math.ceil(Math.max(...lines.map(l=>m.measureText(l).width)))+6,h=lh*lines.length+Math.ceil(fs*.25)+2;
  const c=cv(w,h),x=c.getContext('2d');x.font=font;x.fillStyle=cs.color;x.textBaseline='top';x.textAlign='center';
  lines.forEach((l,i)=>x.fillText(l,w/2,2+i*lh));
  const d=x.getImageData(0,0,w,h);for(let k=3;k<d.data.length;k+=4){const a=d.data[k],p=(k-3)/4,i=p%w,j=(p/w)|0;d.data[k]=a>120?255:(a>45&&((i+j)&1))?255:0}x.putImageData(d,0,0);
  c.style.width=w*TS+'px';c.setAttribute('aria-hidden','true');
  el.innerHTML='';const sr=document.createElement('span');sr.className='visually-hidden';sr.textContent=lines.join(' ');el.append(sr,c)}


/* ---- boot ---- */
let ready=false;
async function boot(){
  setVar('--tx-rust',rustTile(11,false));setVar('--tx-rust-dark',rustTile(23,true));
  setVar('--tx-paper',paperTile());setVar('--tx-sticky',stickyTile());setVar('--tx-sand',sandTile());setVar('--tx-crack',crackTile());
  setVar('--tx-hazard',hazardTile('#c9a04a'));setVar('--tx-hazard-red',hazardTile('#c8281a'));setVar('--tx-worn',wornTile());
  setVar('--sp-rivet',rivet);setVar('--sp-led',led(11,'#d62414','#ffd2c4','#ff6a52','#7d1209'));setVar('--sp-x',xSpr);
  setVar('--sp-ap',led(5,'#36d24a','#e0ffd8','#7af08a','#0b5a18'));setVar('--sp-ap-off',led(5,'#173019','#2c4a2e','#203a22','#0b160c'));
  [0,1,2].forEach(i=>setVar('--k'+i,knob([-60,0,60][i])));
  const sp=woodTile(56,66,5),sx=sp.getContext('2d');const sg=await sigil(42);
  const sh=cv(42,42),shx=sh.getContext('2d');shx.drawImage(sg,0,0);shx.globalCompositeOperation='source-in';shx.fillStyle='rgba(0,0,0,.6)';shx.fillRect(0,0,42,42);
  sx.drawImage(sh,9,14);sx.drawImage(sg,7,12);setVar('--tx-spine',sp);
  try{await Promise.all(['24px "Permanent Marker"','24px "Reenie Beanie"','24px "Jersey 15"','8px Silkscreen'].map(f=>document.fonts.load(f)))}catch(e){}
  await document.fonts.ready;
  $$('.px').forEach(pxText);
  for(const el of $$('canvas.px-photo'))await photo(el);
  tearNote();ready=true;
  document.dispatchEvent(new CustomEvent('rustomancy:ready'));
}
function tearNote(){$$('.rm-note').forEach(tear)}
function tear(n){const h=n.offsetHeight,w=n.offsetWidth;const pts=['0 0',`${w}px 0`];let y=h-8;
  for(let xx=w;xx>=0;xx-=4){y=Math.max(h-18,Math.min(h,y+((Math.random()*3|0)-1)*2));pts.push(`${xx}px ${y}px`,`${Math.max(0,xx-4)}px ${y}px`)}
  n.style.clipPath=`polygon(${pts.join(',')})`}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!ready)return;$$('.px').forEach(pxText);tearNote()},200)});

/* =================== THEME =================== */
function setPhos(p){root.dataset.phosphor=p;$$('[data-set-phos]').forEach(b=>b.classList.toggle('active',b.dataset.setPhos===p));store('rm-phos',p)}
function setTheme(t){if(t==='auto')delete root.dataset.theme;else root.dataset.theme=t;$$('[data-set-theme]').forEach(b=>b.classList.toggle('active',b.dataset.setTheme===t));store('rm-theme',t)}
$$('[data-set-phos]').forEach(b=>b.onclick=()=>setPhos(b.dataset.setPhos));
$$('[data-set-theme]').forEach(b=>b.onclick=()=>setTheme(b.dataset.setTheme));
setPhos(load('rm-phos')||'green');setTheme(load('rm-theme')||'auto');
function setGround(g){if(g==='paper')delete root.dataset.ground;else root.dataset.ground=g;$$('[data-set-ground]').forEach(b=>b.classList.toggle('active',b.dataset.setGround===g));store('rm-ground',g)}
function setScan(v){root.dataset.scan=v;$$('[data-set-scan]').forEach(b=>b.classList.toggle('active',b.dataset.setScan===v));store('rm-scan',v)}
$$('[data-set-ground]').forEach(b=>b.onclick=()=>setGround(b.dataset.setGround));
$$('[data-set-scan]').forEach(b=>b.onclick=()=>setScan(b.dataset.setScan));
setGround(load('rm-ground')||'paper');setScan(load('rm-scan')||'on');


/* =================== PUBLIC API =================== */
function drum(el,val,len){len=len||2;const s=String(Math.max(0,Math.round(val))).padStart(len,'0');el.innerHTML=[...s].map(d=>'<span>'+d+'</span>').join('')}
window.Rustomancy={
  version:'0.2.0',PX,
  get ready(){return ready},
  drum,pxText,photo,tearNote,setPhos,setTheme,setGround,setScan,
  SCENES:SC,
  /* low-level helpers for custom pixel art */
  cv,hex,bay,vnoise,fbm,paint,fromRamp,crunch,sprite,svgImg,
  rustTile,paperTile,sandTile,crackTile,woodTile,hazardTile,sigil,rivet
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
