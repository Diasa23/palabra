import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ORIGINAL_READINGS } from './reading-seeds.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const snapshot=path.join(root,'reading-melo-source.json');
const levels=['A1','A2','B1','B2','C1'];
const licenseUrl='https://creativecommons.org/licenses/by-nc/4.0/';

// To refresh the reproducible attribution-aware snapshot:
// node build-readings.mjs --refresh-melo /path/to/downloaded/stories.json
// Dataset: https://github.com/MeloLingua/melolingua-language-stories-dataset
// Its 24 Spanish stories are CC BY-NC 4.0 (non-commercial educational use only).
if(process.argv[2]==='--refresh-melo'){
  const input=process.argv[3];
  if(!input)throw Error('Provide the local MeloLingua stories.json download path.');
  const stories=JSON.parse(fs.readFileSync(input,'utf8')).filter(s=>s.language?.code==='es');
  if(stories.length!==24)throw Error(`Expected 24 licensed Spanish stories; found ${stories.length}`);
  const themesOf=s=>{
    const tags=[...(s.themes||[]),...(s.setting_tags||[])].join(' ').toLowerCase();
    if(/food|gastro|coffee|cafe|bread|market|panader|churros|cena/.test(tags))return 'Food & drink';
    if(/travel|train|vuelo|station|trip|transport/.test(tags))return 'Travel';
    if(/work|business|office|entrevista|empleo/.test(tags))return 'Work & study';
    if(/famil|friend|neighbor|vecin|relationship/.test(tags))return 'People & animals';
    if(/culture|book|bibliotec|literature|art/.test(tags))return 'Culture & leisure';
    return 'Everyday life';
  };
  const records=stories.map(s=>({
    id:`melo-${s.id}`,level:s.cefr_level,title:s.title,theme:themesOf(s),genre:'Graded story',
    summary:s.summary,text:s.sentences.map(x=>x.text.trim()).reduce((paragraphs,line,i)=>{
      if(i%3===0)paragraphs.push(line);else paragraphs[paragraphs.length-1]+=' '+line;return paragraphs;
    },[]).join('\n\n'),
    source:{name:'MeloLingua',url:s.canonical_url,license:'CC BY-NC 4.0',licenseUrl},
  }));
  fs.writeFileSync(snapshot,JSON.stringify(records,null,2)+'\n');
  console.log(`Saved ${records.length} attributed MeloLingua stories to reading-melo-source.json.`);
}

if(!fs.existsSync(snapshot))throw Error('MeloLingua snapshot missing. Run --refresh-melo with the licensed source download.');
const licensed=JSON.parse(fs.readFileSync(snapshot,'utf8'));
const original=ORIGINAL_READINGS.map(entry=>({
  ...entry,source:{name:'Palabra original',license:'Original learning material'},
}));
const readings=[...original,...licensed].map(r=>{
  const words=r.text.trim().split(/\s+/).length;
  const speeds={A1:90,A2:110,B1:135,B2:150,C1:170};
  return {...r,words,minutes:Math.max(1,Math.ceil(words/speeds[r.level]))};
});
const ids=new Set();
for(const r of readings){
  if(!r.id||ids.has(r.id)||!levels.includes(r.level)||!r.title||!r.summary||!r.theme||!r.text||r.words<55||!r.source?.name)throw Error(`Invalid reading: ${r.id}`);
  if(r.source.name==='MeloLingua'&&(!r.source.url||r.source.license!=='CC BY-NC 4.0'))throw Error(`Missing attribution: ${r.id}`);
  ids.add(r.id);
}
if(readings.length<70||levels.some(l=>readings.filter(r=>r.level===l).length<10))throw Error('Insufficient graded reading coverage.');
fs.writeFileSync(path.join(root,'public','readings.json'),JSON.stringify(readings));
console.log(`Built ${readings.length} graded readings: ${levels.map(l=>`${l} ${readings.filter(r=>r.level===l).length}`).join(' · ')}.`);
