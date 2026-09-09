import sharp from 'sharp';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';

// Deterministic motion graphics: preserve the supplied brand artwork exactly.
const brands = [
  ['nie', 'nie.png', ['#5ddb9c','#7ddfff','#f2c77d']],
  ['amazon', 'amazon.svg', ['#ff9900','#ffe1a1','#ffffff']],
  ['wipro', 'wipro.svg', ['#713bb0','#008bcc','#2ec39d','#f6cf42','#ec4289']],
  ['acuver', 'acuver.png', ['#5b8def','#7ddfff','#b49aff']],
  ['dalhousie', 'dalhousie.svg', ['#ffcc00','#f2c77d','#fff0bd']],
];
const clamp = x => Math.max(0, Math.min(1, x));
const ease = x => 1 - Math.pow(1 - clamp(x), 3);
const fps = 30, duration = 3.6;
await mkdir('public/videos/journey', {recursive:true});
for (const [brand, file, palette] of brands) {
  if (process.argv[2] && process.argv[2] !== brand) continue;
  const source = sharp(`public/logos/${file}`);
  // The supplied Acuver bitmap has a cut-off slogan; keep its complete wordmark.
  if (brand === "acuver") source.extract({left:0,top:0,width:738,height:215});
  const png = await source.resize(250,230,{fit:"inside"}).png().toBuffer();
  const meta = await sharp(png).metadata();
  const img = `data:image/png;base64,${png.toString('base64')}`;
  const encoder = spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','slow','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',`public/videos/journey/${brand}.mp4`]);
  encoder.stderr.on('data', chunk => process.stderr.write(chunk));
  const done = once(encoder,'close');
  for (let frame=0; frame<fps*duration; frame++) {
    const t=frame/fps;
    const reveal=ease((t-.65)/1.25);
    const pop=1 + .055*Math.sin(clamp((t-.65)/1.5)*Math.PI);
    const scale=(.35+.65*reveal)*pop;
    const opacity=ease((t-.9)/.6);
    const dots=Array.from({length:72},(_,i)=>{
      const a=i*.38+t*.65*(1-reveal),r=(38+(i%12)*12)*(1-.12*reveal);
      const appear=ease((t-i*.009)/.65);
      const x=240+Math.cos(a)*r*appear,y=240+Math.sin(a)*r*appear;
      return `<circle cx="${x}" cy="${y}" r="${(1.8+(i%5)*.8)*appear}" fill="${palette[i%palette.length]}" opacity="${(1-ease((t-1.1)/.9))*.95}"/>`;
    }).join('');
    const sweep=clamp((t-.35)/1.3)*359;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480"><defs><radialGradient id="halo"><stop stop-color="${palette[0]}" stop-opacity=".26"/><stop offset="1" stop-color="${palette[0]}" stop-opacity="0"/></radialGradient></defs><rect width="480" height="480" fill="#090b12"/><circle cx="240" cy="240" r="232" fill="url(#halo)" opacity="${.5+.5*reveal}"/><circle cx="240" cy="240" r="193" fill="none" stroke="${palette[0]}" stroke-width="1" opacity="${.24*reveal}" stroke-dasharray="2 10"/><circle cx="240" cy="240" r="178" fill="none" stroke="${palette[1]}" stroke-width="2" pathLength="360" stroke-dasharray="${sweep} 360" transform="rotate(-90 240 240)" opacity="${(1-ease((t-1.5)/.7))*.8}"/>${dots}<g opacity="${opacity}" transform="translate(240 240) scale(${scale}) translate(-240 -240)"><rect x="83" y="83" width="314" height="314" rx="72" fill="#fff"/><rect x="83" y="83" width="314" height="314" rx="72" fill="none" stroke="${palette[0]}" stroke-width="7"/><image href="${img}" x="${240-meta.width/2}" y="${240-meta.height/2}" width="${meta.width}" height="${meta.height}"/></g></svg>`;
    const buffer=await sharp(Buffer.from(svg)).png().toBuffer();
    if(frame===fps*duration-1) await sharp(buffer).webp({quality:85}).toFile(`public/videos/journey/${brand}-poster.webp`);
    if(!encoder.stdin.write(buffer)) await once(encoder.stdin,'drain');
  }
  encoder.stdin.end();
  const [code]=await done;
  if(code!==0) throw new Error(`${brand} encoding failed: ${code}`);
  console.log(`Rendered ${brand}: ${duration}s / ${fps}fps`);
}
