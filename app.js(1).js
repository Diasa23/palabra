const STORAGE_KEY = 'palabra.progress.v1';
const $ = (selector) => document.querySelector(selector);
const TENSES = [
  ['present','Present'], ['preterite','Past (preterite)'], ['imperfect','Imperfect'],
  ['future','Future'], ['conditional','Conditional'], ['perfect','Present perfect']
];
const SUBJECTS = [
  {es:'yo',en:'I',be:'am',have:'have'},
  {es:'tú',en:'you',be:'are',have:'have'},
  {es:'él',en:'he',be:'is',have:'has'},
  {es:'nosotros',en:'we',be:'are',have:'have'},
  {es:'vosotros',en:'you all',be:'are',have:'have'},
  {es:'ellos',en:'they',be:'are',have:'have'}
];

// English infinitive, past simple, past participle, 3rd-person present.
const VERBS = [
 ['ser','be','was','been','is'],['estar','be','was','been','is'],['ir','go','went','gone','goes'],
 ['tener','have','had','had','has'],['hacer','do','did','done','does'],['poder','be able','was able','been able','is able'],
 ['querer','want','wanted','wanted','wants'],['decir','say','said','said','says'],['venir','come','came','come','comes'],
 ['dar','give','gave','given','gives'],['ver','see','saw','seen','sees'],['saber','know','knew','known','knows'],
 ['poner','put','put','put','puts'],['salir','leave','left','left','leaves'],['traer','bring','brought','brought','brings'],
 ['oír','hear','heard','heard','hears'],['leer','read','read','read','reads'],['dormir','sleep','slept','slept','sleeps'],
 ['pedir','ask for','asked for','asked for','asks for'],['jugar','play','played','played','plays'],
 ['empezar','start','started','started','starts'],['pensar','think','thought','thought','thinks'],
 ['sentir','feel','felt','felt','feels'],['conocer','meet','met','met','meets'],['conducir','drive','drove','driven','drives'],
 ['seguir','follow','followed','followed','follows'],['comer','eat','ate','eaten','eats'],['beber','drink','drank','drunk','drinks'],
 ['vivir','live','lived','lived','lives'],['hablar','speak','spoke','spoken','speaks'],['cantar','sing','sang','sung','sings'],
 ['trabajar','work','worked','worked','works'],['estudiar','study','studied','studied','studies'],['amar','love','loved','loved','loves'],
 ['esperar','wait','waited','waited','waits'],['viajar','travel','traveled','traveled','travels'],
 ['cocinar','cook','cooked','cooked','cooks'],['caminar','walk','walked','walked','walks'],
 ['comprar','buy','bought','bought','buys'],['escuchar','listen','listened','listened','listens'],
 ['bailar','dance','danced','danced','dances'],['nadar','swim','swam','swum','swims'],
 ['lavar','wash','washed','washed','washes'],['pagar','pay','paid','paid','pays'],
 ['llegar','arrive','arrived','arrived','arrives'],['tomar','take','took','taken','takes'],
 ['mirar','look','looked','looked','looks'],['abrir','open','opened','opened','opens'],
 ['escribir','write','wrote','written','writes'],['recibir','receive','received','received','receives'],
 ['decidir','decide','decided','decided','decides'],['subir','go up','went up','gone up','goes up'],
 ['buscar','search','searched','searched','searches'],['cambiar','change','changed','changed','changes'],
 ['ayudar','help','helped','helped','helps'],['aprender','learn','learned','learned','learns'],
 ['comprender','understand','understood','understood','understands'],['vender','sell','sold','sold','sells'],
 ['responder','answer','answered','answered','answers'],['perder','lose','lost','lost','loses'],
 ['volver','return','returned','returned','returns'],['recordar','remember','remembered','remembered','remembers'],
 ['contar','count','counted','counted','counts'],['morir','die','died','died','dies'],
 ['probar','try','tried','tried','tries'],['construir','build','built','built','builds'],
 ['elegir','choose','chose','chosen','chooses'],['caer','fall','fell','fallen','falls'],
 ['analizar','analyze','analyzed','analyzed','analyzes'],['investigar','investigate','investigated','investigated','investigates'],
 ['negociar','negotiate','negotiated','negotiated','negotiates'],['justificar','justify','justified','justified','justifies'],
 ['interpretar','interpret','interpreted','interpreted','interprets'],['abordar','address','addressed','addressed','addresses'],
 ['fomentar','encourage','encouraged','encouraged','encourages'],['plantear','propose','proposed','proposed','proposes'],
 ['afrontar','face','faced','faced','faces'],['superar','overcome','overcame','overcome','overcomes'],
 ['aportar','contribute','contributed','contributed','contributes'],['coordinar','coordinate','coordinated','coordinated','coordinates'],
 ['respaldar','support','supported','supported','supports'],['cuestionar','question','questioned','questioned','questions'],
 ['transformar','transform','transformed','transformed','transforms'],['determinar','determine','determined','determined','determines'],
 ['preservar','preserve','preserved','preserved','preserves'],['implementar','implement','implemented','implemented','implements'],
 ['fundamentar','substantiate','substantiated','substantiated','substantiates'],['conceptualizar','conceptualize','conceptualized','conceptualized','conceptualizes'],
 ['contextualizar','contextualize','contextualized','contextualized','contextualizes'],['articular','articulate','articulated','articulated','articulates'],
 ['sintetizar','synthesize','synthesized','synthesized','synthesizes'],['matizar','qualify','qualified','qualified','qualifies'],
 ['extrapolar','extrapolate','extrapolated','extrapolated','extrapolates'],['desentrañar','unravel','unraveled','unraveled','unravels'],
 ['refutar','refute','refuted','refuted','refutes'],['calibrar','calibrate','calibrated','calibrated','calibrates'],
 ['esgrimir','put forward','put forward','put forward','puts forward'],['dilucidar','elucidate','elucidated','elucidated','elucidates'],
 ['contrastar','contrast','contrasted','contrasted','contrasts'],['plasmar','express','expressed','expressed','expresses'],
 ['delimitar','delineate','delineated','delineated','delineates'],['profundizar','deepen','deepened','deepened','deepens']
].map(([es,en,past,participle,third])=>({es,en,past,participle,third}));
const CEFR_LEVELS=['A1','A2','B1','B2','C1'];
const VERB_LEVEL_GROUPS={
 A1:'ser estar ir tener hacer poder querer decir venir dar ver saber leer comer beber vivir hablar trabajar estudiar comprar escuchar dormir jugar cantar caminar bailar mirar abrir escribir llegar tomar ayudar aprender',
 A2:'poner salir traer oír pedir empezar pensar sentir conocer seguir viajar cocinar nadar lavar pagar esperar recibir decidir subir buscar cambiar vender responder',
 B1:'conducir comprender perder volver recordar contar morir probar construir elegir caer amar',
 B2:'analizar investigar negociar justificar interpretar abordar fomentar plantear afrontar superar aportar coordinar respaldar cuestionar transformar determinar preservar implementar',
 C1:'fundamentar conceptualizar contextualizar articular sintetizar matizar extrapolar desentrañar refutar calibrar esgrimir dilucidar contrastar plasmar delimitar profundizar'
};
const VERB_LEVEL_BY_ES=new Map(Object.entries(VERB_LEVEL_GROUPS).flatMap(([level,names])=>names.split(' ').map(es=>[es,level])));
for(const verb of VERBS)verb.level=VERB_LEVEL_BY_ES.get(verb.es)||'B1';
const VERB_MAP = new Map(VERBS.map(v=>[v.es,v]));

const PRESENT_OVERRIDES = {
 ser:['soy','eres','es','somos','sois','son'],estar:['estoy','estás','está','estamos','estáis','están'],ir:['voy','vas','va','vamos','vais','van'],
 tener:['tengo','tienes','tiene','tenemos','tenéis','tienen'],hacer:['hago','haces','hace','hacemos','hacéis','hacen'],
 poder:['puedo','puedes','puede','podemos','podéis','pueden'],querer:['quiero','quieres','quiere','queremos','queréis','quieren'],
 decir:['digo','dices','dice','decimos','decís','dicen'],venir:['vengo','vienes','viene','venimos','venís','vienen'],
 dar:['doy','das','da','damos','dais','dan'],ver:['veo','ves','ve','vemos','veis','ven'],
 saber:['sé','sabes','sabe','sabemos','sabéis','saben'],poner:['pongo','pones','pone','ponemos','ponéis','ponen'],
 salir:['salgo','sales','sale','salimos','salís','salen'],traer:['traigo','traes','trae','traemos','traéis','traen'],
 oír:['oigo','oyes','oye','oímos','oís','oyen'],leer:['leo','lees','lee','leemos','leéis','leen'],
 dormir:['duermo','duermes','duerme','dormimos','dormís','duermen'],pedir:['pido','pides','pide','pedimos','pedís','piden'],
 jugar:['juego','juegas','juega','jugamos','jugáis','juegan'],empezar:['empiezo','empiezas','empieza','empezamos','empezáis','empiezan'],
 pensar:['pienso','piensas','piensa','pensamos','pensáis','piensan'],sentir:['siento','sientes','siente','sentimos','sentís','sienten'],
 conocer:['conozco','conoces','conoce','conocemos','conocéis','conocen'],conducir:['conduzco','conduces','conduce','conducimos','conducís','conducen'],
 seguir:['sigo','sigues','sigue','seguimos','seguís','siguen'],perder:['pierdo','pierdes','pierde','perdemos','perdéis','pierden'],
 volver:['vuelvo','vuelves','vuelve','volvemos','volvéis','vuelven'],recordar:['recuerdo','recuerdas','recuerda','recordamos','recordáis','recuerdan'],
 contar:['cuento','cuentas','cuenta','contamos','contáis','cuentan'],morir:['muero','mueres','muere','morimos','morís','mueren'],
 probar:['pruebo','pruebas','prueba','probamos','probáis','prueban'],construir:['construyo','construyes','construye','construimos','construís','construyen'],
 elegir:['elijo','eliges','elige','elegimos','elegís','eligen'],caer:['caigo','caes','cae','caemos','caéis','caen']
};
const PRETERITE_OVERRIDES = {
 ser:['fui','fuiste','fue','fuimos','fuisteis','fueron'],ir:['fui','fuiste','fue','fuimos','fuisteis','fueron'],
 estar:['estuve','estuviste','estuvo','estuvimos','estuvisteis','estuvieron'],tener:['tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron'],
 hacer:['hice','hiciste','hizo','hicimos','hicisteis','hicieron'],poder:['pude','pudiste','pudo','pudimos','pudisteis','pudieron'],
 querer:['quise','quisiste','quiso','quisimos','quisisteis','quisieron'],decir:['dije','dijiste','dijo','dijimos','dijisteis','dijeron'],
 venir:['vine','viniste','vino','vinimos','vinisteis','vinieron'],dar:['di','diste','dio','dimos','disteis','dieron'],
 ver:['vi','viste','vio','vimos','visteis','vieron'],saber:['supe','supiste','supo','supimos','supisteis','supieron'],
 poner:['puse','pusiste','puso','pusimos','pusisteis','pusieron'],traer:['traje','trajiste','trajo','trajimos','trajisteis','trajeron'],
 oír:['oí','oíste','oyó','oímos','oísteis','oyeron'],leer:['leí','leíste','leyó','leímos','leísteis','leyeron'],
 dormir:['dormí','dormiste','durmió','dormimos','dormisteis','durmieron'],pedir:['pedí','pediste','pidió','pedimos','pedisteis','pidieron'],
 jugar:['jugué','jugaste','jugó','jugamos','jugasteis','jugaron'],empezar:['empecé','empezaste','empezó','empezamos','empezasteis','empezaron'],
 conducir:['conduje','condujiste','condujo','condujimos','condujisteis','condujeron'],
 seguir:['seguí','seguiste','siguió','seguimos','seguisteis','siguieron'],sentir:['sentí','sentiste','sintió','sentimos','sentisteis','sintieron'],
 llegar:['llegué','llegaste','llegó','llegamos','llegasteis','llegaron'],
 pagar:['pagué','pagaste','pagó','pagamos','pagasteis','pagaron'],
 buscar:['busqué','buscaste','buscó','buscamos','buscasteis','buscaron'],
 morir:['morí','moriste','murió','morimos','moristeis','murieron'],
 construir:['construí','construiste','construyó','construimos','construisteis','construyeron'],
 elegir:['elegí','elegiste','eligió','elegimos','elegisteis','eligieron'],
 caer:['caí','caíste','cayó','caímos','caísteis','cayeron']
};
const IMPERFECT_OVERRIDES = {
 ser:['era','eras','era','éramos','erais','eran'],ir:['iba','ibas','iba','íbamos','ibais','iban'],
 ver:['veía','veías','veía','veíamos','veíais','veían']
};
const FUTURE_ROOTS={tener:'tendr',hacer:'har',poder:'podr',querer:'querr',decir:'dir',venir:'vendr',saber:'sabr',poner:'pondr',salir:'saldr'};
const PARTICIPLES={abrir:'abierto',decir:'dicho',escribir:'escrito',hacer:'hecho',morir:'muerto',poner:'puesto',ver:'visto',volver:'vuelto',leer:'leído',oír:'oído',traer:'traído',caer:'caído'};
const ENDINGS={
 present:{ar:['o','as','a','amos','áis','an'],er:['o','es','e','emos','éis','en'],ir:['o','es','e','imos','ís','en']},
 preterite:{ar:['é','aste','ó','amos','asteis','aron'],er:['í','iste','ió','imos','isteis','ieron'],ir:['í','iste','ió','imos','isteis','ieron']},
 imperfect:{ar:['aba','abas','aba','ábamos','abais','aban'],er:['ía','ías','ía','íamos','íais','ían'],ir:['ía','ías','ía','íamos','íais','ían']},
 future:['é','ás','á','emos','éis','án'],conditional:['ía','ías','ía','íamos','íais','ían'],perfect:['he','has','ha','hemos','habéis','han']
};

function conjugate(es,tense,person){
  const group=es.endsWith('ír')?'ir':es.slice(-2),stem=es.slice(0,-2);
  if(tense==='present'&&PRESENT_OVERRIDES[es]) return PRESENT_OVERRIDES[es][person];
  if(tense==='preterite'&&PRETERITE_OVERRIDES[es]) return PRETERITE_OVERRIDES[es][person];
  if(tense==='imperfect'&&IMPERFECT_OVERRIDES[es]) return IMPERFECT_OVERRIDES[es][person];
  if(tense==='perfect')return `${ENDINGS.perfect[person]} ${PARTICIPLES[es]||stem+(group==='ar'?'ado':'ido')}`;
  if(tense==='future'||tense==='conditional')return (FUTURE_ROOTS[es]||es)+ENDINGS[tense][person];
  if(tense==='preterite'&&person===0&&group==='ar'){
    if(stem.endsWith('z'))return stem.slice(0,-1)+'cé';
    if(stem.endsWith('c'))return stem.slice(0,-1)+'qué';
    if(stem.endsWith('g'))return stem+'ué';
  }
  return stem+ENDINGS[tense][group][person];
}
function englishForm(verb,tense,person){
  const subject=SUBJECTS[person],en=verb.en;
  if(tense==='present'){
    if(en==='be')return `${subject.en} ${subject.be}`;
    if(en==='be able')return `${subject.en} can`;
    return `${subject.en} ${person===2?verb.third:en}`;
  }
  if(tense==='preterite')return `${subject.en} ${en==='be'?(person===0||person===2?'was':'were'):verb.past}`.replace('able to','able');
  if(tense==='imperfect')return `${subject.en} used to ${en}`;
  if(tense==='future')return `${subject.en} will ${en}`;
  if(tense==='conditional')return `${subject.en} would ${en}`;
  if(tense==='perfect')return `${subject.en} ${subject.have} ${verb.participle}`;
}
function spanishForm(verb,tense,person){return `${SUBJECTS[person].es} ${conjugate(verb.es,tense,person)}`;}
const shuffle=(array)=>{const a=[...array];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const unique=(list)=>[...new Set(list)];
const escapeRegExp=(value)=>String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const escapeHtml=(value)=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const EXERCISE_THEMES={
 food:{name:'Food & drink',emoji:'🥑',description:'Menus, meals and everyday flavors',color:'#f6eadb'},
 travel:{name:'Travel & places',emoji:'🧳',description:'Journeys, cities and getting around',color:'#e8eff1'},
 people:{name:'People & relationships',emoji:'💌',description:'Family, friendships and connection',color:'#f8e7e8'},
 work:{name:'Work & study',emoji:'📚',description:'School, careers and conversations',color:'#eae9f5'},
 daily:{name:'Everyday life',emoji:'☀️',description:'Home, time and daily routines',color:'#f6eedb'},
 shopping:{name:'Shopping & money',emoji:'🛍️',description:'Buying, paying and bargains',color:'#f2e8e1'},
 nature:{name:'Nature & weather',emoji:'🌿',description:'Weather, animals and the outdoors',color:'#e3f1e6'},
 health:{name:'Health & body',emoji:'🫶',description:'Wellness, people and the body',color:'#e6eff0'},
 culture:{name:'Culture & leisure',emoji:'🎶',description:'Music, sports and free time',color:'#eee8f4'}
};
const EXERCISE_LEVELS={all:'All difficulties',beginner:'Beginner · A1',elementary:'Elementary · A2',intermediate:'Intermediate · B1',advanced:'Advanced · B2+'};
const CURRICULUM_LEVEL_ICONS={A1:'🌱',A2:'🧭',B1:'🌿',B2:'✦',C1:'◆'};
function assignVocabularyLevels(words,curriculum){
  // The 900 term pairs in Nika's curriculum take precedence when the item is a single dictionary headword.
  const curated=new Map();
  for(const chapter of curriculum)for(const theme of chapter.themes)for(const term of theme.terms){
    const headword=term.es.toLocaleLowerCase('es').replace(/^(el|la|los|las|un|una)\s+/u,'');
    if(!curated.has(headword))curated.set(headword,chapter.id);
  }
  // For the remaining dictionary headwords, frequency gives an approximate learning order, not certified CEFR levels.
  const fallback=index=>index<450?'A1':index<1800?'A2':index<3800?'B1':index<5750?'B2':'C1';
  return words.map((word,index)=>({...word,level:curated.get(word.es)||fallback(index)}));
}
const getStored=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{};}catch{return {};}};
const saved=getStored();
const HOMEWORK_DRAFT_KEY='palabra.homework.drafts.v1';
let homeworkDrafts={};
try{homeworkDrafts=JSON.parse(localStorage.getItem(HOMEWORK_DRAFT_KEY))||{};}catch{homeworkDrafts={};}
const state={view:'home',mode:'vocabulary',direction:'es-en',answerFormat:'mixed',length:10,level:'A1',verbLevel:'A1',vocabularyFocus:'new',verbFocus:'new',tenses:['present'],libraryFilter:'all',libraryLevel:'all',search:'',page:0,words:[],wordMap:new Map(),exercises:[],exerciseMap:new Map(),exerciseTheme:'all',exerciseLevel:'beginner',exerciseStyle:'mixed',
 readings:[],readingMap:new Map(),readingLevel:'A1',readingTheme:'all',readingSearch:'',readingId:null,readingProgress:saved.readings||{},
 curriculum:[],curriculumThemeMap:new Map(),curriculumLevel:'A1',curriculumTheme:'a1-01',curriculumDirection:'mixed',
 grammar:[],grammarMap:new Map(),grammarLevel:'A1',grammarUnit:'a1-01',grammarStyle:'mixed',
 progress:saved.progress||{},sessions:saved.sessions||[],quiz:null,homework:[],homeworkLoading:false,homeworkError:'',homeworkWritingId:null,homeworkDrafts,homeworkSubmitBusy:false};
const save=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify({progress:state.progress,sessions:state.sessions.slice(-300),readings:state.readingProgress}));}catch{toast('Unable to save progress on this device.');}};
const record=id=>state.progress[id]||{correct:0,wrong:0,streak:0,reviewStreak:0,known:false};
const mistakeIds=()=>Object.keys(state.progress).filter(id=>{const r=record(id);return r.wrong>0&&r.reviewStreak<2;});
const hasStudied=r=>Boolean(r.lastSeen||r.correct||r.wrong||r.known||r.mastered);
const isKnown=r=>Boolean(r.known||r.mastered);
const isMastered=r=>r.mastered===true;
const knownWords=()=>state.words.filter(w=>isKnown(record('w:'+w.id))).length;
const masteredWords=()=>state.words.filter(w=>isMastered(record('w:'+w.id))).length;
function verbProgress(verb){
  let correct=0,forms=0,seen=false,markedKnown=false;const days=new Set();
  for(const [tense] of TENSES)for(let person=0;person<SUBJECTS.length;person++){
    const r=record(`v:${verb.es}:${tense}:${person}`);
    if(hasStudied(r))seen=true;
    if(r.known)markedKnown=true;
    correct+=r.correct||0;
    if(r.correct>0)forms++;
    for(const day of r.successDays||[])days.add(day);
  }
  return {seen,known:markedKnown||correct>=2,mastered:correct>=8&&forms>=4&&days.size>=2};
}
const knownVerbs=()=>VERBS.filter(v=>verbProgress(v).known).length;
const masteredVerbs=()=>VERBS.filter(v=>verbProgress(v).mastered).length;
const localISO=(d)=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const todayISO=()=>localISO(new Date());
const totalCorrect=()=>state.sessions.reduce((sum,x)=>sum+x.correct,0);
const totalAnswered=()=>state.sessions.reduce((sum,x)=>sum+x.total,0);
function learningStreak(){let dates=new Set(state.sessions.map(s=>s.date)),count=0,d=new Date();if(!dates.has(localISO(d)))d.setDate(d.getDate()-1);while(dates.has(localISO(d))){count++;d.setDate(d.getDate()-1);}return count;}
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>el.classList.remove('show'),2400);}

function questionFromWord(word,direction){
  const answer=direction==='es-en'?word.en:word.es;
  const prompt=direction==='es-en'?word.es:word.en;
  const sameLevel=state.words.filter(w=>w.level===word.level&&w.id!==word.id&&w.en.toLowerCase()!==word.en.toLowerCase());
  const nearby=sameLevel.filter(w=>w.pos===word.pos&&Math.abs(w.rank-word.rank)<1000);
  const source=nearby.length>=3?nearby:sameLevel;
  const pool=shuffle(source).map(w=>direction==='es-en'?w.en:w.es).filter(x=>x.toLowerCase()!==answer.toLowerCase());
  const options=shuffle([answer,...unique(pool).slice(0,3)]);
  return {id:'w:'+word.id,type:'vocabulary',prompt,answer,options,direction,word,detail:`${word.es} — ${word.en}`,caption:`${word.level} · Translate this word`};
}
function questionFromVerb(verb,tense,person,direction){
  const fromSpanish=direction==='es-en';
  const answer=fromSpanish?englishForm(verb,tense,person):spanishForm(verb,tense,person);
  const prompt=fromSpanish?spanishForm(verb,tense,person):englishForm(verb,tense,person);
  const distractors=shuffle(VERBS.filter(v=>v.es!==verb.es&&v.level===verb.level)).map(v=>fromSpanish?englishForm(v,tense,person):spanishForm(v,tense,person)).filter(v=>v!==answer);
  const options=shuffle([answer,...unique(distractors).slice(0,3)]);
  return {id:`v:${verb.es}:${tense}:${person}`,type:'verbs',prompt,answer,options,direction,verb,tense,person,detail:`${spanishForm(verb,tense,person)} — ${englishForm(verb,tense,person)}`,caption:`${verb.level} · ${verb.es} · ${TENSES.find(t=>t[0]===tense)?.[1]} · ${SUBJECTS[person].es}`};
}
function questionFromExercise(entry,variant='cloze'){
  if(variant==='dictation')return {id:`x:${entry.id}:dictation`,type:'exercise',variant,entry,
    prompt:'Listen and write what you hear',answer:entry.es,options:[],
    caption:'Listen to the Spanish audio and type the sentence.',detail:`${entry.es} — ${entry.en}`,
    speakText:entry.es,speakLang:'es-ES',direction:'en-es'};
  if(variant==='cloze'){
    const regex=new RegExp(`(?<![\\p{L}])${escapeRegExp(entry.target)}(?![\\p{L}])`,'iu');
    const prompt=entry.es.replace(regex,'________');
    const answer=entry.target;
    return {id:`x:${entry.id}:cloze`,type:'exercise',variant,entry,prompt,answer,options:shuffle([answer,...entry.distractors]),
      hint:entry.en,caption:`Complete the Spanish sentence · ${EXERCISE_LEVELS[entry.level]}`,detail:`${entry.es} — ${entry.en}`,speakText:entry.es,speakLang:'es-ES',direction:'en-es'};
  }
  const production=variant==='production';
  const pool=state.exercises.filter(e=>e.id!==entry.id&&e.theme===entry.theme&&e.level===entry.level&&(!entry.curated||e.curated)&&e.en.toLocaleLowerCase()!==entry.en.toLocaleLowerCase()&&e.es.toLocaleLowerCase()!==entry.es.toLocaleLowerCase());
  const nearby=pool.filter(e=>Math.abs(e.en.length-entry.en.length)<35);
  const choices=shuffle(nearby.length>=3?nearby:pool).map(e=>production?e.es:e.en);
  const answer=production?entry.es:entry.en;
  const options=shuffle([answer,...unique(choices).filter(x=>x!==answer).slice(0,3)]);
  return {id:`x:${entry.id}:${variant}`,type:'exercise',variant,entry,prompt:production?entry.en:entry.es,answer,options,
    caption:`${production?'Translate into Spanish':'Translate into English'} · ${EXERCISE_LEVELS[entry.level]}`,detail:`${entry.es} — ${entry.en}`,speakText:entry.es,speakLang:'es-ES',direction:production?'en-es':'es-en'};
}
function questionFromCurriculum(theme,index,direction){
  const item=theme.terms[index],fromSpanish=direction==='es-en';
  const answer=fromSpanish?item.en:item.es;
  const distractors=shuffle(theme.terms.filter((_,i)=>i!==index))
    .map(term=>fromSpanish?term.en:term.es).filter(value=>value!==answer);
  return {id:`c:${theme.id}:${index}:${direction}`,type:'curriculum',direction,theme,term:item,
    prompt:fromSpanish?item.es:item.en,answer,options:shuffle([answer,...unique(distractors).slice(0,3)]),
    caption:`${theme.level} · ${theme.title} · ${fromSpanish?'Spanish → English':'English → Spanish'}`,
    detail:`${item.es} — ${item.en}`,speakText:item.es,speakLang:'es-ES'};
}
function questionFromGrammar(entry,variant='cloze'){
  const sentence=entry.template.replace('____',entry.answer);
  const sentenceOptions=shuffle([sentence,...entry.distractors.map(option=>entry.template.replace('____',option))]);
  const useSentence=variant==='sentence';
  const prompt=useSentence?`Choose the sentence that means: ${entry.hint}`:variant==='meaning'?`How do you say: ${entry.hint}?`:entry.template;
  const detail=`${sentence} — ${entry.hint}`;
  return {id:`g:${entry.id}:${variant}`,type:'grammar',entry,variant,prompt,
    answer:useSentence?sentence:entry.answer,
    options:useSentence?sentenceOptions:shuffle([entry.answer,...entry.distractors]),
    hint:variant==='cloze'?entry.hint:entry.template,
    caption:`${entry.level} · ${entry.topic} · ${variant==='cloze'?'Fill the blank':variant==='sentence'?'Choose the full sentence':'Select the grammar form'}`,
    detail,speakText:sentence,speakLang:'es-ES',direction:'en-es'};
}
function questionForId(id){
  if(id.startsWith('w:')){const word=state.wordMap.get(id.slice(2));return word?questionFromWord(word,state.direction):null;}
  if(id.startsWith('x:')){const [,exerciseId,variant]=id.split(':');const entry=state.exerciseMap.get(exerciseId);return entry?questionFromExercise(entry,variant):null;}
  if(id.startsWith('c:')){const [,themeId,index,direction]=id.split(':');const theme=state.curriculumThemeMap.get(themeId);return theme?.terms[Number(index)]?questionFromCurriculum(theme,Number(index),direction):null;}
  if(id.startsWith('g:')){const [,key,variant]=id.split(':');const entry=state.grammarMap.get(key);return entry?questionFromGrammar(entry,variant):null;}
  const [_,es,tense,person]=id.split(':');const verb=VERB_MAP.get(es);
  return verb?questionFromVerb(verb,tense,Number(person),state.direction):null;
}
function startQuiz(review=false){
  let questions=[];
  if(review){questions=shuffle(mistakeIds()).slice(0,state.length).map(questionForId).filter(Boolean);}
  else if(state.mode==='vocabulary'){
    const pool=state.words.filter(w=>(state.level==='all'||w.level===state.level)&&(state.vocabularyFocus==='new'?!hasStudied(record('w:'+w.id)):hasStudied(record('w:'+w.id))));
    // In a new challenge, rotate the selected pool; same-set replay is handled separately.
    const rotating=shuffle(pool).sort((a,b)=>(record('w:'+a.id).lastSeen||0)-(record('w:'+b.id).lastSeen||0));
    questions=rotating.slice(0,state.length).map(w=>questionFromWord(w,state.direction));
  }else if(state.mode==='exercises'){
    const pool=state.exercises.filter(e=>(state.exerciseTheme==='all'||e.theme===state.exerciseTheme)&&(state.exerciseLevel==='all'||e.level===state.exerciseLevel)&&(state.exerciseLevel!=='beginner'||e.curated));
    const getVariant=(item,i)=>state.exerciseStyle==='mixed'?['cloze','translation','production'][i%3]:state.exerciseStyle;
    const prioritised=shuffle(pool).sort((a,b)=>{
      const score=e=>Math.max(record(`x:${e.id}:cloze`).streak,record(`x:${e.id}:translation`).streak,record(`x:${e.id}:production`).streak);
      return Number(score(b)>0)-Number(score(a)>0);
    });
    questions=prioritised.slice(0,state.length).map((e,i)=>questionFromExercise(e,getVariant(e,i)));
  }else if(state.mode==='grammar'){
    const candidates=shuffle(state.grammar.filter(e=>e.level===state.grammarLevel&&(state.grammarUnit==='all'||e.unitId===state.grammarUnit))
      .flatMap(e=>(state.grammarStyle==='mixed'?['cloze','meaning','sentence']:[state.grammarStyle]).map(variant=>({entry:e,variant}))));
    const score=c=>{const r=record(`g:${c.entry.id}:${c.variant}`);return r.known?2:r.streak>0?0:1;};
    questions=candidates.sort((a,b)=>score(a)-score(b)).slice(0,state.length).map(c=>questionFromGrammar(c.entry,c.variant));
  }else if(state.mode==='curriculum'){
    const level=state.curriculum.find(item=>item.id===state.curriculumLevel);
    const themes=level?.themes.filter(t=>state.curriculumTheme==='all'||t.id===state.curriculumTheme)||[];
    const dirs=state.curriculumDirection==='mixed'?['es-en','en-es']:[state.curriculumDirection];
    const candidates=shuffle(themes.flatMap(t=>t.terms.flatMap((_,i)=>dirs.map(dir=>({theme:state.curriculumThemeMap.get(t.id),index:i,dir})))));
    const score=c=>{const r=record(`c:${c.theme.id}:${c.index}:${c.dir}`);return r.known?2:r.streak>0?0:1;};
    questions=candidates.sort((a,b)=>score(a)-score(b)).slice(0,state.length).map(c=>questionFromCurriculum(c.theme,c.index,c.dir));
  }else{
    const verbs=VERBS.filter(verb=>(state.verbLevel==='all'||verb.level===state.verbLevel)&&(state.verbFocus==='new'?!verbProgress(verb).seen:verbProgress(verb).seen));
    // Spread questions across fresh verbs before asking a second form of the same verb.
    const forms=shuffle(state.tenses.flatMap(tense=>SUBJECTS.map((_,person)=>({tense,person}))));
    const ids=forms.flatMap(({tense,person})=>shuffle(verbs).map(verb=>({verb,tense,person})));
    const rotating=state.verbFocus==='review'?shuffle(ids).sort((a,b)=>(record(`v:${a.verb.es}:${a.tense}:${a.person}`).lastSeen||0)-(record(`v:${b.verb.es}:${b.tense}:${b.person}`).lastSeen||0)):ids;
    questions=rotating.slice(0,state.length).map(c=>questionFromVerb(c.verb,c.tense,c.person,state.direction));
  }
  if(!questions.length){toast(review?'No mistakes to review yet.':state.mode==='vocabulary'||state.mode==='verbs'?`No ${state.mode==='verbs'?'verbs':'words'} in this set yet. Switch between Learn new and Review & master.`:'No questions available for this selection.');return;}
  state.quiz={questions,index:0,correct:0,wrong:[],selected:null,review,answerFormat:state.answerFormat,overrideMode:null,draft:'',pendingReview:false,selfReview:[],started:Date.now()};
  state.view='quiz';render();window.scrollTo({top:0,behavior:'smooth'});
}
function replayQuiz(){
  const previous=state.quiz;if(!previous)return;
  // Same words/forms and translations, reshuffled so answer positions are not memorized.
  const questions=shuffle(previous.questions).map(q=>({...q,options:shuffle(q.options)}));
  state.quiz={questions,index:0,correct:0,wrong:[],selected:null,review:previous.review,
    answerFormat:previous.answerFormat,overrideMode:null,draft:'',pendingReview:false,selfReview:[],started:Date.now()};
  state.view='quiz';render();window.scrollTo({top:0,behavior:'smooth'});
}
function quizResponseMode(quiz){
  if(quiz.questions[quiz.index]?.variant==='dictation')return 'write';
  return quiz.overrideMode||(quiz.answerFormat==='mixed'?(quiz.index%3===1?'write':'choice'):quiz.answerFormat);
}
function normalizeAnswer(value){
  return String(value??'').trim().toLocaleLowerCase('es').replace(/[¿¡]/g,'').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
}
function accentFold(value){
  // Spanish ñ is a separate letter, not an optional accent.
  return value.normalize('NFD').replace(/([aeiou])\p{M}+/gu,'$1').normalize('NFC');
}
function typedAnswerMatch(q,value){
  const typed=normalizeAnswer(value),expected=normalizeAnswer(q.answer);
  const answers=[expected];
  if(q.type==='verbs'&&q.direction==='en-es')answers.push(expected.replace(/^(yo|tú|él|nosotros|vosotros|ellos) /,'').trim());
  if(q.direction==='es-en'&&expected.startsWith('to '))answers.push(expected.slice(3));
  if(answers.includes(typed))return {correct:true,accentTip:false};
  if(answers.some(a=>accentFold(a)===accentFold(typed)))return {correct:true,accentTip:true};
  return {correct:false,accentTip:false};
}
function needsTranslationReview(q){
  return q.type==='exercise'&&!['cloze','dictation'].includes(q.variant)||q.type==='grammar'&&q.variant==='sentence'||q.type==='curriculum'||q.type==='vocabulary'&&q.direction==='es-en';
}
function recordAnswer(correct,picked,{index=-1,selfChecked=false,accentTip=false}={}){
  const quiz=state.quiz,q=quiz?.questions[quiz.index];if(!q||quiz.selected!==null)return;
  quiz.selected=index;quiz.answerCorrect=correct;quiz.typedAnswer=picked;quiz.selfChecked=selfChecked;quiz.accentTip=accentTip;quiz.pendingReview=false;
  if(selfChecked)quiz.selfReview.push({prompt:q.prompt,given:picked,reference:q.answer,marked:correct?'correct':'needs review'});
  if(correct)quiz.correct++;else quiz.wrong.push({...q,picked});
  const prior=record(q.id);
  const successDays=Array.isArray(prior.successDays)?[...prior.successDays]:[];
  if(correct&&!successDays.includes(todayISO()))successDays.push(todayISO());
  const next={...prior,correct:prior.correct+(correct?1:0),wrong:prior.wrong+(correct?0:1),
    streak:correct?prior.streak+1:0,
    reviewStreak:correct?(prior.wrong>0?prior.reviewStreak+1:0):0,
    successDays:successDays.slice(-12),lastSeen:Date.now()};
  next.known=Boolean(prior.known||next.correct>=2);
  // Mastery is earned after repeated correct answers on at least two different days.
  next.mastered=Boolean(prior.mastered||(next.correct>=5&&next.streak>=3&&next.successDays.length>=2));
  state.progress[q.id]=next;save();renderQuiz();
}
function answerQuestion(index){
  const quiz=state.quiz,q=quiz?.questions[quiz.index];
  if(!q||quiz.selected!==null||quiz.pendingReview||quizResponseMode(quiz)==='write'||index<0||index>=q.options.length)return;
  recordAnswer(q.options[index]===q.answer,q.options[index],{index});
}
function submitTypedAnswer(){
  const quiz=state.quiz,q=quiz?.questions[quiz.index];if(!q||quiz.selected!==null||quiz.pendingReview)return;
  const value=String(quiz.draft||'').trim();if(!value){toast('Write your answer first.');return;}
  const match=typedAnswerMatch(q,value);
  if(match.correct){recordAnswer(true,value,{accentTip:match.accentTip});return;}
  if(needsTranslationReview(q)){quiz.pendingReview=true;renderQuiz();return;}
  recordAnswer(false,value);
}
function selfMarkTypedAnswer(correct){
  const quiz=state.quiz;if(!quiz?.pendingReview||quiz.selected!==null)return;
  recordAnswer(correct,quiz.draft,{selfChecked:true});
}
function nextQuestion(){
  const quiz=state.quiz;if(!quiz||quiz.selected===null)return;
  if(quiz.index+1>=quiz.questions.length){
    state.sessions.push({date:todayISO(),correct:quiz.correct,total:quiz.questions.length,mode:quiz.review?'review':state.mode});save();state.view='result';render();
    if(quiz.homeworkId)submitQuizHomework(quiz);
  }else{quiz.index++;quiz.selected=null;quiz.draft='';quiz.pendingReview=false;quiz.overrideMode=null;quiz.answerCorrect=null;quiz.selfChecked=false;quiz.accentTip=false;renderQuiz();window.scrollTo({top:0,behavior:'smooth'});}
}
function leaveQuiz(){if(state.quiz?.index>0||state.quiz?.selected!==null){if(!confirm('Leave this challenge? Your answered words are saved, but this session will end.'))return;}state.quiz=null;state.view='home';render();}
function setView(view){if(state.view==='quiz'&&view!=='quiz'){leaveQuiz();if(view!=='home'&&state.view==='home')state.view=view;}else state.view=view;state.page=0;render();if(view==='homework')loadHomework();window.scrollTo({top:0,behavior:'smooth'});}
function renderSidebar(){
  const match=state.view==='quiz'||state.view==='result'?'practice':state.view==='read'?'reading':state.view;
  document.querySelectorAll('[data-nav]').forEach(el=>el.classList.toggle('active',el.dataset.nav===match));
  document.querySelectorAll('[data-mode]').forEach(el=>el.classList.toggle('active',state.view==='practice'&&state.mode===el.dataset.mode));
  const explore=$('.nav-explore');if(explore&&['grammar','exercises','library'].includes(match))explore.open=true;
  $('#nav-mistakes').textContent=mistakeIds().length;
  const homeworkCount=$('#nav-homework-count');if(homeworkCount)homeworkCount.textContent=state.homework.filter(h=>h.status!=='completed').length;
  const title={home:'Learn',practice:'Practice',reading:'Reading',read:'Reading',exercises:'Context practice',curriculum:'My path',grammar:'Grammar topics',homework:'Tutor homework',mistakes:'Review',library:'Word library',quiz:'Challenge',result:'Results'};
  $('#breadcrumb-current').textContent=title[state.view]||'Learn';
  const topStreak=$('#top-streak'),topKnown=$('#top-known');if(topStreak)topStreak.textContent=learningStreak();if(topKnown)topKnown.textContent=knownWords().toLocaleString();
}
function render(){closeReadingPopup();renderSidebar();const root=$('#main-content');if(!state.words.length||!state.curriculum.length||!state.grammar.length||!state.readings.length){root.innerHTML='<div class="loading">Loading your Spanish library…</div>';return;}
  if(state.view==='home')renderHome();else if(state.view==='practice')renderPractice();else if(state.view==='reading')renderReading();else if(state.view==='read')renderRead();else if(state.view==='exercises')renderExercises();else if(state.view==='curriculum')renderCurriculum();else if(state.view==='grammar')renderGrammar();else if(state.view==='homework')renderHomework();else if(state.view==='mistakes')renderMistakes();else if(state.view==='library')renderLibrary();else if(state.view==='quiz')renderQuiz();else if(state.view==='result')renderResults();
}
function pathLessons(){
  const level=state.curriculum.find(l=>l.id==='A1');if(!level)return [];
  return Array.from({length:5},(_,i)=>[
    {kind:'grammar',id:`a1-${String(i+1).padStart(2,'0')}`,title:level.grammar[i]?.topic||'Grammar',number:i*2+1},
    {kind:'vocabulary',id:level.themes[i]?.id,title:level.themes[i]?.title||'Vocabulary',number:i*2+2},
  ]).flat();
}
function pathProgress(lesson){
  if(lesson.kind==='grammar'){
    const entries=state.grammar.filter(e=>e.unitId===lesson.id);
    const practiced=entries.filter(e=>['cloze','meaning','sentence'].some(v=>record(`g:${e.id}:${v}`).correct>0)).length;
    return {practiced,total:entries.length,target:Math.min(6,entries.length),done:entries.length>0&&practiced>=Math.min(6,entries.length)};
  }
  const theme=state.curriculumThemeMap.get(lesson.id);
  const practiced=theme?.terms.filter((_,i)=>record(`c:${theme.id}:${i}:es-en`).correct>0||record(`c:${theme.id}:${i}:en-es`).correct>0).length||0;
  return {practiced,total:theme?.terms.length||0,target:Math.min(8,theme?.terms.length||0),done:!!theme?.terms.length&&practiced>=Math.min(8,theme.terms.length)};
}
function startPathLesson(lesson){
  if(!lesson)return;
  state.length=10;
  if(lesson.kind==='grammar'){state.mode='grammar';state.grammarLevel='A1';state.grammarUnit=lesson.id;state.grammarStyle='mixed';}
  else{state.mode='curriculum';state.curriculumLevel='A1';state.curriculumTheme=lesson.id;state.curriculumDirection='mixed';}
  startQuiz(false);
}
function renderHome(){
  const lessons=pathLessons(),currentIndex=Math.max(0,lessons.findIndex(l=>!pathProgress(l).done));
  const current=lessons[currentIndex],doneCount=lessons.filter(l=>pathProgress(l).done).length;
  const answeredToday=state.sessions.filter(s=>s.date===todayISO()).reduce((sum,s)=>sum+s.total,0);
  const dailyGoal=20,goalPct=Math.min(100,Math.round(answeredToday/dailyGoal*100));
  const mistakes=mistakeIds().length,assigned=state.homework.filter(h=>h.status==='assigned').length;
  const lessonCards=lessons.map((l,i)=>{
    const p=pathProgress(l),active=i===currentIndex;
    return `<button class="lesson-tile ${p.done?'complete':''} ${active?'current':''}" data-lesson-kind="${l.kind}" data-lesson-id="${l.id}" aria-label="${escapeHtml(l.title)} · ${p.practiced} examples practiced">
      <span class="lesson-node">${p.done?'✓':l.kind==='grammar'?'✎':'Aa'}</span>
      <span class="lesson-copy"><span class="lesson-kicker">LESSON ${String(l.number).padStart(2,'0')} · ${l.kind==='grammar'?'GRAMMAR':'VOCABULARY'}</span><strong>${escapeHtml(l.title)}</strong><span class="lesson-sub">${p.done?'Checkpoint reached · revisit anytime':p.practiced?`${p.practiced} examples practiced · keep going`:'Ready when you are'}</span></span>
      <span class="lesson-trail">${active?'START':p.done?'✓':'→'}</span>
    </button>`;
  }).join('');
  $('#main-content').innerHTML=`<div class="learn-page"><div class="learn-layout"><div class="learn-main">
    <section class="learn-welcome"><div class="learn-welcome-copy"><div class="eyebrow">YOUR SPANISH JOURNEY · A1</div><h1>¡Vamos, Nika! <span>✳</span></h1><p>One small lesson at a time. You’ve got this.</p><button class="primary-btn learn-continue" data-continue-lesson>Continue learning <span>→</span></button></div><div class="welcome-art" aria-hidden="true"><span>¡</span><i>✦</i></div></section>
    <section class="learn-path-header"><div><span class="eyebrow">SECTION 01 · FOUNDATIONS</span><h2>Your learning path</h2><p>Grammar and vocabulary, side by side.</p></div><span class="path-progress-count">${doneCount}/${lessons.length} checkpoints</span></section>
    <div class="learn-progress-track" aria-label="${doneCount} of ${lessons.length} lesson checkpoints reached"><span style="width:${doneCount/Math.max(1,lessons.length)*100}%"></span></div>
    <div class="lesson-list">${lessonCards}</div>
    <button class="learn-more-path" data-nav="curriculum">Explore the full A1–C1 curriculum <span>→</span></button>
    </div><aside class="learn-rail">
      <div class="rail-card goal-card"><span class="rail-eyebrow">YOUR DAILY GOAL</span><div class="goal-orb" style="--goal-progress:${goalPct}%"><div><strong>${answeredToday}</strong><small>of ${dailyGoal}</small></div></div><h3>${answeredToday>=dailyGoal?'Goal complete!':'Keep your streak alive'}</h3><p>${answeredToday>=dailyGoal?'Beautiful work today. Come back tomorrow!':'A few questions every day make a real difference.'}</p></div>
      ${assigned?`<button class="rail-card rail-action homework-action" data-nav="homework"><span class="rail-emoji">✉</span><span><strong>${assigned} tutor assignment${assigned===1?'':'s'}</strong><small>Your homework is ready</small></span><b>→</b></button>`:`<button class="rail-card rail-action homework-action" data-nav="homework"><span class="rail-emoji">✉</span><span><strong>Tutor homework</strong><small>Lessons from your AI tutor</small></span><b>→</b></button>`}
      <button class="rail-card rail-action review-action" data-nav="mistakes"><span class="rail-emoji">↺</span><span><strong>${mistakes?`${mistakes} to review`:'Review mistakes'}</strong><small>${mistakes?'Turn tricky answers into strengths':'Your review queue is clear'}</small></span><b>→</b></button>
      <div class="rail-card rail-stats"><span class="rail-eyebrow">YOUR PROGRESS</span><div class="rail-progress-pair"><span><strong>${knownWords().toLocaleString()}</strong><small>Words known</small></span><span><strong>${masteredWords().toLocaleString()}</strong><small>Mastered ★</small></span></div><div><strong>${learningStreak()} 🔥</strong><small>Day streak</small></div><button data-nav="practice">Free practice →</button></div>
    </aside></div></div>`;
}
const masteredByTier=tier=>state.words.filter(w=>w.tier===tier&&record('w:'+w.id).known).length;
function stat(icon,bg,color,number,label,note){return `<div class="stat-card"><span class="stat-icon" style="background:${bg};color:${color}">${icon}</span><span class="mini-info">${escapeHtml(note)}</span><strong>${number}</strong><label>${label}</label></div>`;}
function answerFormatControl(){
  return `<div class="answer-format-panel"><div class="setup-label">How do you want to answer?</div><div class="answer-format-tabs">${[['mixed','✦ Mix it up'],['choice','◫ 4 choices'],['write','✎ Type myself']].map(([id,label])=>`<button class="${state.answerFormat===id?'active':''}" data-answer-format="${id}">${label}</button>`).join('')}</div><p>${state.answerFormat==='mixed'?'Every third question asks you to type an answer.':state.answerFormat==='write'?'Write answers yourself. Longer translations can be self-checked against a reference.':'Choose from four possible answers.'}</p></div>`;
}
function studyLevelControl(){
  if(!['vocabulary','verbs'].includes(state.mode))return '';
  const verbs=state.mode==='verbs',chosen=verbs?state.verbLevel:state.level;
  const count=verbs?VERBS.filter(v=>chosen==='all'||v.level===chosen).length:state.words.filter(w=>chosen==='all'||w.level===chosen).length;
  const descriptor=verbs?`${count} verbs · ${(count*state.tenses.length*SUBJECTS.length).toLocaleString()} forms across ${state.tenses.length} selected tense${state.tenses.length===1?'':'s'}`:`${count.toLocaleString()} words in this selection`;
  return `<div class="study-level-control"><div class="setup-label">Choose your level</div><div class="cefr-levels">${[...CEFR_LEVELS,'all'].map(level=>`<button class="cefr-chip ${chosen===level?'active':''}" aria-pressed="${chosen===level}" data-study-level="${level}">${level==='all'?'All':level}</button>`).join('')}</div><p>${descriptor} · Levels are approximate study groups, not official CEFR certifications.${verbs?' Verb level and tense difficulty are separate.':''}</p></div>`;
}
function studyFocusControl(){
  if(!['vocabulary','verbs'].includes(state.mode))return '';
  const verbs=state.mode==='verbs',focus=verbs?state.verbFocus:state.vocabularyFocus,level=verbs?state.verbLevel:state.level;
  const eligible=verbs?VERBS.filter(v=>level==='all'||v.level===level):state.words.filter(w=>level==='all'||w.level===level);
  const statuses=eligible.map(item=>({seen:verbs?verbProgress(item).seen:hasStudied(record('w:'+item.id)),
    known:verbs?verbProgress(item).known:isKnown(record('w:'+item.id)),
    mastered:verbs?verbProgress(item).mastered:isMastered(record('w:'+item.id))}));
  const fresh=statuses.filter(s=>!s.seen).length,reviewed=statuses.length-fresh;
  const known=statuses.filter(s=>s.known).length,mastered=statuses.filter(s=>s.mastered).length;
  const label=verbs?'verbs':'words',available=focus==='new'?fresh:reviewed;
  return `<div class="study-focus-panel"><div class="setup-label">What is your goal?</div><div class="study-focus-options">
    <button class="study-focus-option ${focus==='new'?'active':''}" data-study-focus="new" aria-pressed="${focus==='new'}"><strong>✦ Learn new</strong><span>${fresh.toLocaleString()} unseen ${label}</span></button>
    <button class="study-focus-option ${focus==='review'?'active':''}" data-study-focus="review" aria-pressed="${focus==='review'}"><strong>↺ Review & master</strong><span>${reviewed.toLocaleString()} studied ${label}</span></button></div>
    <div class="study-focus-footer"><span><b>${known.toLocaleString()}</b> Known</span><span><b>${mastered.toLocaleString()}</b> Mastered ★</span></div>
    ${available===0?`<p class="study-focus-hint">${focus==='new'?'No unseen items left at this level. Switch to Review & master.':'Nothing studied yet at this level. Try Learn new first.'}</p>`:''}
    <p class="study-focus-rule">${verbs?'Known after 2 correct answers. Mastered after 8 correct answers across 4 forms and 2+ days.':'Known after 2 correct answers (or mark it yourself). Mastered after 5 correct answers, a streak of 3 and 2+ days.'}</p></div>`;
}
function practiceBuilder(home=false){
  if(!['vocabulary','verbs','exercises'].includes(state.mode))state.mode='vocabulary';
  return `<div class="panel-head"><div><h2 class="section-title">What do you want to practice?</h2><p class="section-desc">Pick a skill. We’ll handle the rest.</p></div></div>
   <div class="mode-grid"><button class="mode-card ${state.mode==='vocabulary'?'selected':''}" data-select-mode="vocabulary"><span class="mode-icon">Aa</span><span><strong>Vocabulary</strong><small>Words, meanings & everyday Spanish</small></span></button>
   <button class="mode-card ${state.mode==='verbs'?'selected':''}" data-select-mode="verbs"><span class="mode-icon purple">⌁</span><span><strong>Verb lab</strong><small>Master verbs across six tenses</small></span></button>
   <button class="mode-card ${state.mode==='exercises'?'selected':''}" data-select-mode="exercises"><span class="mode-icon" style="background:#e9f1ed;color:#518271">▥</span><span><strong>Context drills</strong><small>Sentences by topic & difficulty</small></span></button>
   <button class="mode-card" data-nav="grammar"><span class="mode-icon" style="background:#f4eadc;color:#b37e55">✎</span><span><strong>Grammar topics ↗</strong><small>Learn each grammar rule</small></span></button></div>
   <details class="practice-advanced"><summary><span>⚙</span> Customize difficulty, direction & topics <b>⌄</b></summary><div class="practice-advanced-inner">
   ${state.mode!=='exercises'?`<div class="setup-row"><div class="setup-label">Translation direction</div><div class="segmented"><button class="segment ${state.direction==='es-en'?'active':''}" data-direction="es-en">🇪🇸 Spanish → English</button><button class="segment ${state.direction==='en-es'?'active':''}" data-direction="en-es">🇬🇧 English → Spanish</button></div></div>`:''}
   ${state.mode==='vocabulary'?'':
   state.mode==='verbs'?`<div class="setup-row"><div class="setup-label">Choose verb tenses <span style="font-weight:500;color:#9ca4a9">${state.tenses.length} selected</span></div><div class="tense-chips">${TENSES.map(([id,label])=>`<label class="tense-chip ${state.tenses.includes(id)?'selected':''}"><input type="checkbox" value="${id}" data-tense ${state.tenses.includes(id)?'checked':''}>${label}</label>`).join('')}</div></div>`:
   `<div class="setup-row"><div class="setup-label">Context theme</div><select class="level-select" id="exercise-theme-select"><option value="all">All nine themes</option>${Object.entries(EXERCISE_THEMES).map(([id,t])=>`<option value="${id}" ${state.exerciseTheme===id?'selected':''}>${t.name}</option>`).join('')}</select></div><div class="setup-row"><div class="setup-label">Difficulty</div><select class="level-select" id="exercise-level-select">${Object.entries(EXERCISE_LEVELS).map(([id,name])=>`<option value="${id}" ${state.exerciseLevel===id?'selected':''}>${name}</option>`).join('')}</select>${state.exerciseLevel==='beginner'?'<p class="beginner-note">✓ Short, hand-curated A1 sentences and present tense.</p>':''}</div><div class="setup-row"><div class="setup-label">Exercise format</div><div class="segmented">${[['mixed','Mixed'],['cloze','Fill blanks'],['translation','English meaning'],['production','Write in Spanish'],['dictation','Listen & type']].map(([id,label])=>`<button class="segment ${state.exerciseStyle===id?'active':''}" data-exercise-style="${id}">${label}</button>`).join('')}</div></div>`}</div></details>
   ${studyLevelControl()}
   ${studyFocusControl()}
   ${answerFormatControl()}
   <div class="setup-row"><div class="setup-label">How many questions? <span style="color:#9ea6aa">${state.length} selected</span></div><div class="lengths">${[10,20,30,50,100].map(n=>`<button class="length-btn ${n===state.length?'active':''}" data-length="${n}">${n}</button>`).join('')}<select class="level-select extra-length" id="practice-extra-length" aria-label="More question lengths"><option value="">More…</option>${[40,60,70,80,90].map(n=>`<option value="${n}" ${state.length===n?'selected':''}>${n} questions</option>`).join('')}</select></div></div>
   <button class="primary-btn start-btn" data-start>Start practice <span>→</span></button>`;
}
function renderPractice(){
  $('#main-content').innerHTML=`<div class="section-header"><div><div class="eyebrow">QUICK PRACTICE</div><h1 class="page-title">A little practice <em>goes a long way.</em></h1><p class="subtitle">Choose what to work on. You can adjust the details anytime.</p></div></div><div style="max-width:780px"><div class="panel"><div class="panel-body">${practiceBuilder()}</div></div></div>`;
}
const readingDone=id=>Boolean(state.readingProgress[id]?.completedAt);
function openReading(id){
  const entry=state.readingMap.get(id);if(!entry)return;
  state.readingId=id;state.readingLevel=entry.level;
  if(!state.readingProgress[id]?.openedAt){state.readingProgress[id]={...state.readingProgress[id],openedAt:Date.now()};save();}
  state.view='read';render();window.scrollTo({top:0,behavior:'smooth'});
}
function toggleReadingComplete(){
  const id=state.readingId;if(!id||!state.readingMap.has(id))return;
  const prior=state.readingProgress[id]||{};
  state.readingProgress[id]={...prior,completedAt:readingDone(id)?null:Date.now()};
  save();renderRead();
}
function renderReading(){
  loadExpandedReadingDictionary();
  const level=state.readingLevel;
  const all=state.readings.filter(r=>r.level===level);
  const completed=all.filter(r=>readingDone(r.id)).length;
  const term=state.readingSearch.toLocaleLowerCase('es').trim();
  const themes=[...new Set(state.readings.map(r=>r.theme))].sort();
  const filtered=all.filter(r=>(state.readingTheme==='all'||r.theme===state.readingTheme)&&(!term||`${r.title} ${r.summary} ${r.theme} ${r.text}`.toLocaleLowerCase('es').includes(term)));
  const ordered=[...filtered].sort((a,b)=>Number(readingDone(a.id))-Number(readingDone(b.id))||Number(a.source.name!=='Palabra original')-Number(b.source.name!=='Palabra original')||a.words-b.words);
  const cards=ordered.map(r=>`<button class="reading-card" data-reading-open="${escapeHtml(r.id)}" aria-label="Read ${escapeHtml(r.title)}">
    <span class="reading-card-top"><span class="reading-icon">${{Story:'✧',Dialogue:'”',Diary:'✎',Article:'▤',Essay:'◈',Reflection:'❧',Mystery:'⌕',Reportage:'◉',Opinion:'✦'}[r.genre]||'▤'}</span><span class="reading-card-status ${readingDone(r.id)?'done':''}">${readingDone(r.id)?'✓ Read':r.source.name==='MeloLingua'?'OPEN READER':'ORIGINAL'}</span></span>
    <span class="reading-card-category">${escapeHtml(r.theme)} · ${escapeHtml(r.genre)}</span><strong>${escapeHtml(r.title)}</strong><span class="reading-card-summary">${escapeHtml(r.summary)}</span><span class="reading-card-footer"><span>${r.words} words · ${r.minutes} min</span><b>${readingDone(r.id)?'Read again':'Read story'} →</b></span></button>`).join('');
  $('#main-content').innerHTML=`<div class="reading-hub"><div class="section-header reading-heading"><div><div class="eyebrow">YOUR SPANISH READING ROOM</div><h1 class="page-title">A little reading, <em>every day.</em></h1><p class="subtitle">Real stories and thoughtful articles, from your first Spanish sentences to advanced ideas.</p></div><div class="reading-overall"><strong>${state.readings.filter(r=>readingDone(r.id)).length}</strong><span>of ${state.readings.length} read</span></div></div>
    <div class="reading-level-tabs" role="group" aria-label="Reading level">${CEFR_LEVELS.map(l=>`<button class="reading-level-tab ${level===l?'active':''}" data-reading-level="${l}" aria-pressed="${level===l}"><strong>${l}</strong><small>${{A1:'First steps',A2:'Everyday stories',B1:'Growing confidence',B2:'Deeper reading',C1:'Advanced ideas'}[l]}</small></button>`).join('')}</div>
    <div class="reading-catalog-head"><div><h2>${{A1:'Beginner stories',A2:'Build your reading habit',B1:'Stories with a little more depth',B2:'Explore different perspectives',C1:'Read between the lines'}[level]}</h2><p>${all.length} readings at ${level} · ${completed} finished</p></div><div class="reading-progress-ring" aria-label="${completed} of ${all.length} completed">${completed}/${all.length}</div></div>
    <div class="reading-tools"><label class="search-box reading-search"><span>⌕</span><input id="reading-search" type="search" placeholder="Find a story or topic…" value="${escapeHtml(state.readingSearch)}" aria-label="Search readings"></label><select class="filter-select" id="reading-theme" aria-label="Filter reading theme"><option value="all">All topics</option>${themes.map(t=>`<option value="${escapeHtml(t)}" ${state.readingTheme===t?'selected':''}>${escapeHtml(t)}</option>`).join('')}</select></div>
    ${cards?`<div class="reading-grid">${cards}</div>`:`<div class="reading-empty"><h3>No readings match yet.</h3><p>Try another topic or clear your search.</p><button class="secondary-btn" data-reading-clear>Show all ${level} readings</button></div>`}
    <details class="reading-sources"><summary>Where do these readings come from?</summary><p>Palabra original graded texts are written for this learning path. Selected MeloLingua stories are shared under <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener">CC BY-NC 4.0</a>, with author, license and a source link shown on each reading. Level tags guide study; they are not official CEFR test results.</p><p>For more independently hosted reading, explore the <a href="https://digitallibrary.io/" target="_blank" rel="noopener">Global Digital Library</a> (early literacy books) or <a href="https://www.gutenberg.org/browse/languages/es" target="_blank" rel="noopener">Project Gutenberg in Spanish</a> (classic texts, usually harder). They use different reading-level systems, so we don't mix their books into the CEFR shelves automatically.</p></details></div>`;
}
// Read-only dictionary index: never writes to learning progress or vocabulary records.
function createReadingDictionary(words){
  const exact=new Map(),derived=new Map();
  const key=s=>s.normalize('NFC').toLocaleLowerCase('es');
  const add=(map,word,entry)=>{const k=key(word),list=map.get(k)||[];if(!list.some(e=>JSON.stringify(e)===JSON.stringify(entry)))list.push(entry);map.set(k,list);};
  const grammar={el:'the',la:'the; her / it (direct object)',los:'the; them (direct object)',las:'the; them (direct object)',lo:'it / him; the thing that',un:'a / an',una:'a / an; one',unos:'some',unas:'some',al:'to the (a + el)',del:'of / from the (de + el)',yo:'I',tú:'you (informal singular)',él:'he',ella:'she',usted:'you (formal singular)',ustedes:'you (plural)',nosotros:'we',nosotras:'we (feminine)',vosotros:'you (informal plural)',vosotras:'you (informal feminine plural)',ellos:'they',ellas:'they (feminine)',me:'me / to me; myself',te:'you / to you; yourself',se:'himself / herself / itself / themselves; impersonal or passive marker',nos:'us / to us; ourselves',os:'you / to you (plural); yourselves',le:'to him / her / you (formal)',les:'to them / you (plural)',mi:'my',mis:'my (plural noun)',tu:'your',tus:'your (plural noun)',su:'his / her / its / your / their',sus:'his / her / its / your / their (plural noun)',de:'of / from',a:'to / at',en:'in / on / at',por:'by / through / for / because of',para:'for / in order to',con:'with',sin:'without',sobre:'on / about / above; envelope',entre:'between / among',hasta:'until / up to / even',desde:'from / since',hacia:'toward',y:'and',e:'and (before an i sound)',o:'or',u:'or (before an o sound)',pero:'but',sino:'but rather / except',porque:'because',aunque:'although / even if',que:'that / which / who; than',qué:'what / which',si:'if / whether',sí:'yes; oneself',como:'as / like',cómo:'how',cuando:'when',cuándo:'when (question)',donde:'where',dónde:'where (question)',quien:'who / whoever',quién:'who (question)',no:'no / not',ya:'already / now / anymore',muy:'very',más:'more / most',menos:'less / fewer',también:'also / too',tampoco:'neither / not either',hay:'there is / there are',he:'I have (auxiliary: haber)',has:'you have (auxiliary: haber)',ha:'he / she / it has; you have (auxiliary: haber)',hemos:'we have (auxiliary: haber)',habéis:'you all have (auxiliary: haber)',han:'they / you all have (auxiliary: haber)',niña:'girl',niñas:'girls',niños:'boys / children',buena:'good',buenas:'good',buen:'good',gran:'great / big'};
  const names={n:'Noun',adj:'Adjective',adv:'Adverb',v:'Verb',prep:'Preposition',pron:'Pronoun',art:'Article',conj:'Conjunction'};
  const plural=s=>/[aeiouáéó]$/u.test(s)?s+'s':s.endsWith('z')?s.slice(0,-1)+'ces':/[óí]n$/u.test(s)?s.normalize('NFD').replace(/\u0301/g,'').normalize('NFC')+'es':s+'es';
  for(const w of words){
    add(exact,w.es,{meaning:w.en,detail:names[w.pos]||'Dictionary entry'});
    if(['n','adj'].includes(w.pos)&&!w.es.includes(' ')){
      add(derived,plural(w.es),{meaning:w.en,detail:`Plural of ${w.es}`});
      // Gender rules apply only to adjectives; do not turn arbitrary nouns into other nouns.
      if(w.pos==='adj'&&w.es.endsWith('o'))for(const form of [w.es.slice(0,-1)+'a',w.es.slice(0,-1)+'as'])add(derived,form,{meaning:w.en,detail:`${form.endsWith('as')?'Feminine plural':'Feminine'} of ${w.es}`});
    }
  }
  for(const [word,meaning] of Object.entries(grammar))exact.set(word,[{meaning,detail:'Common word'}]);
  // Reading-only supplements; the practice catalog and mastery IDs stay unchanged.
  const common={
    sábado:'Saturday',sábados:'Saturdays',
    dependiente:'shop assistant / clerk; dependent',dependienta:'shop assistant / saleswoman',dependientas:'shop assistants / saleswomen',
    madre:'mother',padre:'father',abuela:'grandmother',abuelas:'grandmothers',hermana:'sister',hermanas:'sisters',amiga:'friend (female)',amigas:'friends (female)',compañera:'companion / classmate / colleague (female)',compañeras:'companions / classmates / colleagues (female)',señora:'woman / lady; Mrs.',señoras:'women / ladies',profesora:'teacher (female)',profesoras:'teachers (female)',doctora:'doctor (female)',doctoras:'doctors (female)',
    todos:'all / everyone',todas:'all (feminine)',todo:'all / everything',otra:'another / other (feminine)',otras:'other / others (feminine plural)',otros:'other / others (plural)',esa:'that (feminine)',esas:'those (feminine)',ese:'that (masculine)',esos:'those (masculine)',eso:'that',esta:'this (feminine)',estas:'these (feminine)',este:'this (masculine)',estos:'these (masculine)',esto:'this',aquello:'that (over there)',aquella:'that (feminine, over there)',aquellas:'those (feminine, over there)',nuestra:'our (feminine)',nuestras:'our (feminine plural)',nuestros:'our (masculine plural)',algunas:'some (feminine plural)',algunos:'some (masculine plural)',varias:'several (feminine)',varios:'several (masculine)',muchos:'many / a lot',muchas:'many / a lot (feminine)',ni:'nor / neither / not even',quienes:'who / those who',así:'like this / that; so',además:'also / furthermore',cuánto:'how much',primer:'first (before a masculine noun)',buenos:'good (masculine plural)',sola:'alone (feminine)',plaza:'square / plaza; place / position',error:'error / mistake',final:'end / ending; final',útil:'useful',normalmente:'normally / usually',euros:'euros',jóvenes:'young; young people',árboles:'trees',embargo:'seizure / embargo; in “sin embargo”: however',
    había:'there was / there were; I / he / she / you (formal) had (auxiliary: haber)',habían:'they / you (plural) had (auxiliary: haber)',
    encontró:'he / she / you (formal) found (encontrar, simple past)',encuentro:'I find; meeting / encounter',encuentra:'he / she / you (formal) finds; find! (encontrar)',comenzó:'he / she / you (formal) began (comenzar, simple past)',sonrió:'he / she / you (formal) smiled (sonreír, simple past)',sonríe:'he / she / you (formal) smiles; smile! (sonreír)',exige:'he / she / you (formal) demands; demand! (exigir)',ofreció:'he / she / you (formal) offered (ofrecer, simple past)',propuso:'he / she / you (formal) proposed (proponer, simple past)',parece:'he / she / it seems; you (formal) seem (parecer)',parecía:'I / he / she / it seemed; you (formal) seemed (parecer)',cuesta:'it costs; slope / hill',sienta:'he / she / you (formal) seats; sit!; may feel (sentar / sentir)',sentó:'he / she / you (formal) seated (sentar, simple past)',mostró:'he / she / you (formal) showed (mostrar, simple past)'
  };
  for(const [word,meaning] of Object.entries(common))exact.set(word,[{meaning,detail:'Reading dictionary'}]);
  derived.delete('sábados');
  // Only vetted regular verbs are generated. Never assume every dictionary verb is regular.
  const regularReadingVerbs=[
    ['necesitar','need','needed','needed','needs'],['depender','depend','depended','depended','depends'],
    ['preguntar','ask','asked','asked','asks'],['llamar','call','called','called','calls'],['explicar','explain','explained','explained','explains'],
    ['guardar','keep','kept','kept','keeps'],['quedar','remain','remained','remained','remains'],['dejar','leave / let','left / let','left / let','leaves / lets'],
    ['aceptar','accept','accepted','accepted','accepts'],['llevar','carry / wear','carried / wore','carried / worn','carries / wears'],
    ['respirar','breathe','breathed','breathed','breathes'],['preparar','prepare','prepared','prepared','prepares'],
    ['pasar','pass / happen','passed / happened','passed / happened','passes / happens'],['entrar','enter','entered','entered','enters'],
    ['terminar','finish','finished','finished','finishes'],['usar','use','used','used','uses'],['visitar','visit','visited','visited','visits'],
    ['desayunar','have breakfast','had breakfast','had breakfast','has breakfast'],['cenar','have dinner','had dinner','had dinner','has dinner'],
    ['desear','want / wish','wanted / wished','wanted / wished','wants / wishes'],['gustar','please / be pleasing to','pleased / was pleasing to','pleased','pleases / is pleasing to'],
    ['intentar','try','tried','tried','tries'],['notar','notice','noticed','noticed','notices'],['preguntar','ask','asked','asked','asks'],
    ['observar','observe','observed','observed','observes'],['escapar','escape','escaped','escaped','escapes'],
    ['existir','exist','existed','existed','exists'],['compartir','share','shared','shared','shares'],['permitir','allow','allowed','allowed','allows'],
    ['ocurrir','happen','happened','happened','happens'],['recorrer','travel through','traveled through','traveled through','travels through'],
    ['comprender','understand','understood','understood','understands']
  ].map(([es,en,past,participle,third])=>({es,en,past,participle,third}));
  const tenses={present:'Presente (present)',preterite:'Pretérito indefinido (simple past)',imperfect:'Pretérito imperfecto (imperfect)',future:'Futuro simple (future)',conditional:'Condicional simple (conditional)'};
  for(const verb of [...VERBS,...regularReadingVerbs.filter(v=>!VERB_MAP.has(v.es))]){
    for(const [tense,label] of Object.entries(tenses))for(let person=0;person<6;person++){
      let meaning=englishForm(verb,tense,person);
      if(person===2)meaning=meaning.replace(/^he /,'he / she / you (formal) ');
      if(person===5)meaning=meaning.replace(/^they /,'they / you (plural) ');
      add(exact,conjugate(verb.es,tense,person),{meaning,verb:verb.es,tense:label});
    }
    const participle=conjugate(verb.es,'perfect',0).split(' ')[1];
    add(exact,participle,{meaning:verb.participle,verb:verb.es,tense:'Participio (past participle)'});
  }
  return word=>{const k=key(word);return [...(exact.get(k)||[]),...(derived.get(k)||[])].filter((entry,i,list)=>list.findIndex(e=>e.meaning===entry.meaning&&e.verb===entry.verb&&e.tense===entry.tense)===i);};
}
// Expanded definitions are separate from the practice deck and its progress IDs.
let expandedReadingDictionary=null,expandedReadingRequest=null,expandedReadingError=false;
const readingDictionaryShards=new Map();
function loadExpandedReadingDictionary(){
  if(expandedReadingDictionary)return Promise.resolve(expandedReadingDictionary);
  if(expandedReadingRequest)return expandedReadingRequest;
  expandedReadingError=false;
  expandedReadingRequest=fetch('./reading-dictionary.json').then(r=>{if(!r.ok)throw new Error('Dictionary unavailable');return r.json();}).then(data=>{expandedReadingDictionary=data;return data;}).catch(()=>{expandedReadingError=true;return null;}).finally(()=>{expandedReadingRequest=null;});
  return expandedReadingRequest;
}
async function loadReadingDictionaryWord(word){
  const data=await loadExpandedReadingDictionary();if(!data)return;
  const key=word.normalize('NFC').toLocaleLowerCase('es');
  if(Object.hasOwn(data.entries,key))return;
  const shard=String(key.codePointAt(0));
  if(!readingDictionaryShards.has(shard))readingDictionaryShards.set(shard,fetch(`./dictionary/${shard}.json`).then(r=>r.ok?r.json():{}).catch(()=>({})));
  const entries=await readingDictionaryShards.get(shard);
  if(Object.hasOwn(entries,key))data.entries[key]=entries[key];
}
function resolveReadingEntries(word,baseLookup,data=expandedReadingDictionary){
  const base=baseLookup(word),key=word.normalize('NFC').toLocaleLowerCase('es');
  const override=data?.overrides?.[key];
  const trusted=base.filter(e=>e.detail==='Common word'||e.detail==='Reading dictionary');
  if(!override&&trusted.length)return trusted.concat(base.filter(e=>e.verb));
  const raw=override||data?.entries?.[key];
  if(!raw)return base;
  const verbForms=override?[]:base.filter(e=>e.verb);
  const groups=new Map();
  for(const e of raw){
    if(verbForms.length&&e.pos==='v')continue;
    const group=e.lemma+'|'+e.pos;
    if(!groups.has(group))groups.set(group,{...e,meanings:[]});
    const meaning=e.meaning+(e.qualifier?` (${e.qualifier})`:'');
    if(!groups.get(group).meanings.includes(meaning))groups.get(group).meanings.push(meaning);
  }
  const labels={n:'Noun',v:'Verb',adj:'Adjective',adv:'Adverb',prop:'Proper name',det:'Determiner',pron:'Pronoun',prep:'Preposition',conj:'Conjunction',art:'Article',num:'Number',interj:'Interjection'};
  const expanded=[...groups.values()].map(e=>({meaning:e.meanings.slice(0,3).join('; '),detail:`${labels[e.pos]||'Dictionary entry'}${e.lemma.toLocaleLowerCase('es')!==key?' · form of '+e.lemma+' (base meaning)':''}`}));
  return [...verbForms,...expanded];
}
let readingLookup=null,readingPopup=null,readingAnchor=null;
function closeReadingPopup(restoreFocus=false){
  const anchor=readingAnchor;
  readingPopup?.remove();readingPopup=null;readingAnchor=null;
  anchor?.setAttribute('aria-expanded','false');anchor?.removeAttribute('aria-controls');
  if(restoreFocus&&anchor?.isConnected)anchor.focus({preventScroll:true});
}
function positionReadingPopup(){
  if(!readingPopup||!readingAnchor?.isConnected){closeReadingPopup();return;}
  const vv=window.visualViewport,leftEdge=vv?.offsetLeft||0,topEdge=vv?.offsetTop||0,width=vv?.width||window.innerWidth,height=vv?.height||window.innerHeight;
  const rect=readingAnchor.getBoundingClientRect(),gap=10,pad=12;
  if(rect.bottom<topEdge||rect.top>topEdge+height){closeReadingPopup();return;}
  readingPopup.style.maxHeight=Math.max(80,height-pad*2)+'px';
  const box=readingPopup.getBoundingClientRect();
  const above=rect.top-topEdge>=box.height+gap+pad;
  const top=above?rect.top-box.height-gap:Math.min(rect.bottom+gap,topEdge+height-box.height-pad);
  readingPopup.style.left=Math.max(leftEdge+pad,Math.min(rect.left+rect.width/2-box.width/2,leftEdge+width-box.width-pad))+'px';
  readingPopup.style.top=Math.max(topEdge+pad,top)+'px';
  readingPopup.dataset.placement=above?'above':'below';
}
function showReadingPopup(anchor,refresh=false){
  if(readingAnchor===anchor&&!refresh){closeReadingPopup();return;}
  closeReadingPopup();
  readingLookup ||= createReadingDictionary(state.words);
  const word=anchor.textContent,entries=resolveReadingEntries(word,readingLookup);
  readingAnchor=anchor;readingPopup=document.createElement('section');
  readingPopup.id='reading-dictionary-popup';readingPopup.className='reading-dictionary-popup';
  readingPopup.setAttribute('role','dialog');readingPopup.setAttribute('aria-modal','false');readingPopup.setAttribute('aria-labelledby','reading-dictionary-word');
  readingPopup.innerHTML=`<div class="reading-dictionary-head"><div><span>SPANISH → ENGLISH</span><h3 id="reading-dictionary-word" lang="es">${escapeHtml(word)}</h3></div><button type="button" class="reading-dictionary-close" aria-label="Close dictionary">×</button></div><div class="reading-dictionary-results">${entries.length?entries.map(e=>`<div class="reading-dictionary-entry"><p>${escapeHtml(e.meaning)}</p>${e.verb?`<small>Verb: <b lang="es">${escapeHtml(e.verb)}</b><br>Tense: ${escapeHtml(e.tense)}</small>`:`<small>${escapeHtml(e.detail||'')}</small>`}</div>`).join(''):`<p class="reading-dictionary-missing">${!expandedReadingDictionary&&!expandedReadingError?'Loading dictionary…':expandedReadingError?'Expanded dictionary unavailable. Close and tap the word to retry.':'Translation not available yet.'}</p>`}</div>${entries.length>1?'<footer>Possible meanings · choose the one that fits the sentence.</footer>':''}`;
  document.body.append(readingPopup);anchor.setAttribute('aria-expanded','true');anchor.setAttribute('aria-controls',readingPopup.id);
  readingPopup.querySelector('button').addEventListener('click',()=>closeReadingPopup(true));
  positionReadingPopup();readingPopup.querySelector('button').focus({preventScroll:true});
  if(!refresh)loadReadingDictionaryWord(word).then(()=>{if(readingAnchor===anchor)showReadingPopup(anchor,true);});
}
function readingWordLinks(text){
  return String(text??'').split(/(\p{L}[\p{L}\p{M}]*)/gu).map((part,index)=>index%2===0?escapeHtml(part):`<button type="button" class="reading-word" data-reading-word aria-haspopup="dialog" aria-expanded="false" aria-label="Translate ${escapeHtml(part)} into English">${escapeHtml(part)}</button>`).join('');
}
function renderRead(){
  loadExpandedReadingDictionary();
  closeReadingPopup();
  const r=state.readingMap.get(state.readingId);if(!r){state.view='reading';return renderReading();}
  const complete=readingDone(r.id);
  const next=state.readings.find(item=>item.level===r.level&&item.id!==r.id&&!readingDone(item.id));
  const paragraphs=r.text.split(/\n+/).map(s=>s.trim()).filter(Boolean).map(p=>`<p>${readingWordLinks(p)}</p>`).join('');
  const source=r.source.name==='MeloLingua'?`Adapted layout from <a href="${escapeHtml(r.source.url)}" target="_blank" rel="noopener">MeloLingua</a> · <a href="${escapeHtml(r.source.licenseUrl)}" target="_blank" rel="noopener">${escapeHtml(r.source.license)}</a> · Non-commercial educational use`:'Original Palabra reading, written for this learning path';
  $('#main-content').innerHTML=`<div class="reading-reader"><div class="reading-reader-back"><button class="ghost-btn" data-reading-back>← All ${r.level} readings</button><span>${r.words} words · About ${r.minutes} min</span></div>
    <article class="reading-page"><div class="reading-page-meta"><span class="reading-level-pill">${r.level}</span><span>${escapeHtml(r.theme)} · ${escapeHtml(r.genre)}</span>${complete?'<span class="reading-finished">✓ Finished</span>':''}</div><h1 lang="es">${readingWordLinks(r.title)}</h1><p class="reading-deck">${escapeHtml(r.summary)}</p><p class="reading-translate-hint">Tap any Spanish word for its English meaning.</p><div class="reading-article-text" lang="es">${paragraphs}</div>
      <div class="reading-end"><div class="reading-end-emblem">✦</div><h2 lang="es">¡${readingWordLinks("Muy bien")}!</h2><p>You reached the end. Small, consistent reading sessions build lasting fluency.</p><div class="reading-end-actions"><button class="primary-btn" data-reading-complete>${complete?'✓ Finished · Mark unfinished':'Mark as read ✓'}</button>${next?`<button class="secondary-btn" data-reading-open="${escapeHtml(next.id)}">Next ${r.level} reading →</button>`:''}</div></div>
      <p class="reading-source-credit">${source}<br>Expanded dictionary: <a href="https://en.wiktionary.org/" target="_blank" rel="noopener">Wiktionary contributors</a>, via <a href="https://github.com/doozan/spanish_data" target="_blank" rel="noopener">Jeff Doozan’s Spanish data</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>. Adapted for Palabra; <a href="./reading-dictionary-sources.md" target="_blank" rel="noopener">sources and changes</a>.</p></article></div>`;
}
function renderExercises(){
  const allowed=e=>(state.exerciseLevel==='all'||e.level===state.exerciseLevel)&&(state.exerciseTheme==='all'||e.theme===state.exerciseTheme)&&(state.exerciseLevel!=='beginner'||e.curated);
  const available=state.exercises.filter(allowed);
  const cards=Object.entries(EXERCISE_THEMES).map(([id,def])=>{
    const count=state.exercises.filter(e=>e.theme===id&&(state.exerciseLevel==='all'||e.level===state.exerciseLevel)&&(state.exerciseLevel!=='beginner'||e.curated)).length;
    return `<button class="exercise-topic ${state.exerciseTheme===id?'selected':''}" data-exercise-theme="${id}" style="--topic-bg:${def.color}"><span class="topic-glyph">${def.emoji}</span><h3>${def.name}</h3><p>${def.description}</p><div class="topic-bottom"><span>${count} sentence pairs</span><span class="topic-arrow">↗</span></div></button>`;
  }).join('');
  $('#main-content').innerHTML=`<div class="section-header"><div><div class="eyebrow">THE EXERCISE ATELIER · NEW</div><h1 class="page-title">Spanish, in <em>context.</em></h1><p class="subtitle">Real-life sentences become small, memorable practice sessions.</p></div></div>
  <div class="exercise-summary"><span>✦ <b>${state.exercises.length.toLocaleString()}</b> sentence pairs</span><span>◈ <b>9</b> everyday themes</span><span>▧ <b>4</b> estimated difficulties</span></div>
  <div class="exercise-controls"><div><div class="exercise-control-label">CHOOSE YOUR DIFFICULTY</div><div class="exercise-filter-row">${Object.entries(EXERCISE_LEVELS).map(([id,label])=>`<button class="exercise-filter ${state.exerciseLevel===id?'active':''}" data-exercise-level="${id}">${label}</button>`).join('')}</div></div>
  <div><div class="exercise-control-label">CHOOSE YOUR FORMAT</div><div class="exercise-filter-row">${[['mixed','Mixed'],['cloze','Fill blanks'],['translation','Spanish → English'],['production','English → Spanish'],['dictation','◖)) Listen & type']].map(([id,label])=>`<button class="exercise-filter ${state.exerciseStyle===id?'active':''}" data-exercise-style="${id}">${label}</button>`).join('')}</div></div></div>
  ${answerFormatControl()}
  <div class="featured-heading"><h2>Explore by theme</h2><button class="feature-link" data-exercise-theme="all">${state.exerciseTheme==='all'?'✓ All themes selected':'Select all themes ↗'}</button></div>
  <div class="exercise-grid">${cards}</div>
  <div class="exercise-bottom-bar"><div><h3>${state.exerciseTheme==='all'?'Your next context challenge':EXERCISE_THEMES[state.exerciseTheme].name}</h3><p>${available.length.toLocaleString()} sentences · ${EXERCISE_LEVELS[state.exerciseLevel]} · ${{mixed:'Three practice styles',cloze:'Fill in the blanks',translation:'Spanish → English',production:'English → Spanish',dictation:'Listen & type'}[state.exerciseStyle]}</p>${available.length<state.length?`<p class="exercise-limit">This selection contains ${available.length} distinct sentences; the challenge will stop there instead of repeating them.</p>`:''}</div><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><select class="level-select" id="exercise-length-select" aria-label="Challenge length" style="width:120px;background:#fffefa">${[10,20,30,40,50,60,70,80,90,100].map(n=>`<option value="${n}" ${state.length===n?'selected':''}>${n} questions</option>`).join('')}</select><button class="primary-btn" data-start-exercises ${available.length?'':'disabled'}>Start challenge →</button></div></div>
  <p class="explain-notice"><b>Beginner · A1</b> uses our short, hand-curated present-tense sentences. Higher difficulty labels are estimates based on the original sentence collection, not formal CEFR certification. Other exercises are adapted from <a href="https://tatoeba.org" target="_blank" rel="noopener">Tatoeba</a> sentences (CC BY 2.0 FR), via <a href="https://github.com/doozan/spanish_data" target="_blank" rel="noopener">spanish_data</a>.</p>`;
}
function renderCurriculum(){
  const level=state.curriculum.find(item=>item.id===state.curriculumLevel),selected=level.themes.filter(t=>state.curriculumTheme==='all'||t.id===state.curriculumTheme);
  const ways=state.curriculumDirection==='mixed'?2:1;
  const capacity=selected.reduce((sum,t)=>sum+t.terms.length*ways,0);
  const total=state.curriculum.reduce((sum,l)=>sum+l.themes.reduce((count,t)=>count+t.terms.length,0),0);
  const cards=level.themes.map((theme,i)=>{
    const mastered=theme.terms.filter((_,j)=>record(`c:${theme.id}:${j}:es-en`).known&&record(`c:${theme.id}:${j}:en-es`).known).length;
    const started=theme.terms.some((_,j)=>record(`c:${theme.id}:${j}:es-en`).correct+record(`c:${theme.id}:${j}:en-es`).correct>0);
    return `<button class="curriculum-card ${state.curriculumTheme===theme.id?'selected':''}" data-curriculum-theme="${theme.id}">
      <div class="curriculum-card-top"><span class="curriculum-number">${String(i+1).padStart(2,'0')}</span><span class="curriculum-status">${mastered===theme.terms.length?'✓ Mastered':started?'In progress':'Ready to practice'}</span></div>
      <h3>${escapeHtml(theme.title)}</h3><p>${escapeHtml(theme.coverage)}</p>
      <div class="curriculum-samples">${theme.terms.slice(0,3).map(t=>escapeHtml(t.es)).join(' · ')}</div>
      <div class="curriculum-card-bottom"><span>${mastered}/${theme.terms.length} terms mastered</span><span class="curriculum-arrow">↗</span></div>
      <div class="curriculum-meter"><span style="width:${mastered/theme.terms.length*100}%"></span></div>
    </button>`;
  }).join('');
  const chosen=state.curriculumTheme==='all'?'All 15 themes':selected[0]?.title||'Choose a theme';
  const unitList=level.grammar.map((g,i)=>`<button class="grammar-unit grammar-unit-link" data-open-grammar="${level.id.toLowerCase()}-${String(i+1).padStart(2,'0')}"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${escapeHtml(g.topic)}</strong><small>${escapeHtml(g.coverage)} · Start 24 drills ↗</small></div></button>`).join('');
  $('#main-content').innerHTML=`<div class="section-header"><div><div class="eyebrow">NIKA'S SPANISH LEARNING PATH · A1—C1</div><h1 class="page-title">A curriculum that's <em>yours.</em></h1><p class="subtitle">Your exact syllabus, now organized into focused vocabulary challenges.</p></div></div>
    <div class="exercise-summary curriculum-summary"><span>✦ <b>5</b> CEFR levels</span><span>◈ <b>75</b> vocabulary themes</span><span>▤ <b>100</b> grammar roadmap units</span><span>✳ <b>${total.toLocaleString()}</b> curated translations</span></div>
    <div class="curriculum-levels">${state.curriculum.map(l=>`<button class="curriculum-level ${state.curriculumLevel===l.id?'active':''}" data-curriculum-level="${l.id}"><span>${CURRICULUM_LEVEL_ICONS[l.id]}</span><strong>${l.id}</strong><small>${escapeHtml(l.name)}</small></button>`).join('')}</div>
    <div class="curriculum-level-intro"><div><span class="eyebrow">${level.label} · ${escapeHtml(level.name.toUpperCase())}</span><h2>${escapeHtml(level.description)}</h2><p>${escapeHtml(level.milestone)}</p></div><span class="curriculum-level-stamp">${level.id}</span></div>
    <div class="featured-heading curriculum-heading"><h2>Vocabulary themes <span class="curriculum-count">15 chapters</span></h2><button class="feature-link" data-curriculum-theme="all">${state.curriculumTheme==='all'?'✓ All themes selected':'Practice all 15 themes ↗'}</button></div>
    <div class="curriculum-grid">${cards}</div>
    <div class="curriculum-session"><div><span class="eyebrow">YOUR NEXT CHALLENGE</span><h3>${escapeHtml(chosen)}</h3><p>${capacity} distinct questions available in this selection. Every answer contributes to your personal progress.</p></div>
      <div class="curriculum-session-controls">${answerFormatControl()}<div class="curriculum-formats">${[['mixed','Mix both directions'],['es-en','Spanish → English'],['en-es','English → Spanish']].map(([id,label])=>`<button class="exercise-filter ${state.curriculumDirection===id?'active':''}" data-curriculum-direction="${id}">${label}</button>`).join('')}</div>
        <div class="curriculum-start"><label for="curriculum-length-select">Session length</label><select class="level-select" id="curriculum-length-select">${[10,20,30,40,50,60,70,80,90,100].map(n=>`<option value="${n}" ${state.length===n?'selected':''}>${n} questions</option>`).join('')}</select><button class="primary-btn" data-start-curriculum>Start this chapter →</button></div>
        ${capacity<state.length?`<small class="curriculum-limit">This selection contains ${capacity} unique questions, so your ${state.length}-question challenge will end after ${capacity}.</small>`:''}
      </div></div>
    <details class="grammar-roadmap"><summary><div><span class="eyebrow">ALSO IN YOUR SYLLABUS · NOW PLAYABLE</span><h3>Grammar roadmap <span>20 units</span></h3><p>Choose any of your ${level.id} grammar topics for 24 focused drills, or open the complete Grammar studio.</p></div><span class="roadmap-chevron">⌄</span></summary><div class="grammar-grid">${unitList}</div></details>
    <p class="explain-notice">Curriculum-level labels and topics follow your supplied A1–C1 syllabus. Vocabulary sets are curated for each theme; these exercises are not formal CEFR assessments. Your scores and mistakes remain on this device.</p>`;
}
function renderGrammar(){
  const level=state.curriculum.find(l=>l.id===state.grammarLevel);
  const formats=state.grammarStyle==='mixed'?3:1;
  const available=state.grammar.filter(e=>e.level===level.id&&(state.grammarUnit==='all'||e.unitId===state.grammarUnit));
  const capacity=available.length*formats;
  const selectedUnit=level.grammar.find((_,i)=>level.id.toLowerCase()+'-'+String(i+1).padStart(2,'0')===state.grammarUnit);
  const cards=level.grammar.map((unit,i)=>{
    const id=level.id.toLowerCase()+'-'+String(i+1).padStart(2,'0');
    const examples=state.grammar.filter(e=>e.unitId===id);
    const mastered=examples.filter(e=>record('g:'+e.id+':cloze').known).length;
    const started=examples.some(e=>['cloze','meaning','sentence'].some(v=>record('g:'+e.id+':'+v).correct>0));
    return `<button class="grammar-topic-card ${state.grammarUnit===id?'selected':''}" data-grammar-unit="${id}">
      <span class="grammar-topic-num">${String(i+1).padStart(2,'0')} <span>${mastered===examples.length?'✓ Mastered':started?'In progress':'Practice ready'}</span></span>
      <h3>${escapeHtml(unit.topic)}</h3><p>${escapeHtml(unit.coverage)}</p>
      <div class="grammar-topic-bottom"><span>24 question formats</span><span>${mastered}/8 examples mastered ↗</span></div>
      <div class="curriculum-meter"><span style="width:${mastered/Math.max(1,examples.length)*100}%"></span></div>
    </button>`;
  }).join('');
  const sample=available[0];
  $('#main-content').innerHTML=`<div class="section-header"><div><div class="eyebrow">PALABRA · THE GRAMMAR ATELIER</div><h1 class="page-title">Build your Spanish <em>foundation.</em></h1><p class="subtitle">Practice each grammar topic from your curriculum, with explanations, examples and instant feedback.</p></div></div>
    <div class="exercise-summary curriculum-summary"><span>✦ <b>100</b> syllabus grammar topics</span><span>◈ <b>800</b> original example sentences</span><span>✍ <b>2,400</b> multiple-choice practice formats</span></div>
    <div class="curriculum-levels">${state.curriculum.map(l=>`<button class="curriculum-level ${state.grammarLevel===l.id?'active':''}" data-grammar-level="${l.id}"><span>${CURRICULUM_LEVEL_ICONS[l.id]}</span><strong>${l.id}</strong><small>${escapeHtml(l.name)}</small></button>`).join('')}</div>
    <div class="grammar-heading"><div><span class="eyebrow">${level.id} · ${escapeHtml(level.name.toUpperCase())}</span><h2>Twenty grammar chapters, one step at a time.</h2><p>${escapeHtml(level.description)}</p></div><button class="secondary-btn" data-grammar-unit="all">${state.grammarUnit==='all'?'✓ All 20 selected':'Practice all 20 →'}</button></div>
    <div class="grammar-topics-grid">${cards}</div>
    <div class="grammar-exercise-panel"><div class="grammar-exercise-heading"><span class="eyebrow">YOUR GRAMMAR SESSION</span><h3>${escapeHtml(selectedUnit?.topic||'All 20 grammar topics')}</h3><p>${escapeHtml(selectedUnit?.coverage||'Mixed practice across every grammar chapter in this level.')}</p>
    ${sample?`<div class="grammar-example"><small>EXAMPLE · ${escapeHtml(sample.hint)}</small><strong>${escapeHtml(sample.template.replace('____','______'))}</strong></div>`:''}</div>
    <div class="grammar-exercise-controls">${answerFormatControl()}<div class="exercise-control-label">QUESTION FORMAT</div><div class="exercise-filter-row grammar-format-row">${[['mixed','Mixed (3 formats)'],['cloze','Fill in the blank'],['meaning','Meaning → form'],['sentence','Full sentence']].map(([id,label])=>`<button class="exercise-filter ${state.grammarStyle===id?'active':''}" data-grammar-style="${id}">${label}</button>`).join('')}</div>
    <div class="curriculum-start"><label for="grammar-length-select">Length</label><select class="level-select" id="grammar-length-select">${[10,20,30,40,50,60,70,80,90,100].map(n=>`<option value="${n}" ${state.length===n?'selected':''}>${n} questions</option>`).join('')}</select><button class="primary-btn" data-start-grammar>Start grammar challenge →</button></div>
    ${capacity<state.length?`<small class="curriculum-limit">This selection has ${capacity} question cards; the challenge will end after ${capacity} rather than repeat cards.</small>`:''}
    </div></div>
    <p class="explain-notice">Each chapter has eight original teaching examples practiced in three formats (24 possible cards). These questions follow your syllabus; the level labels indicate intended study progression and are not an official CEFR exam. Mistakes join your normal review queue.</p>`;
}
async function loadHomework(){
  if(state.homeworkLoading)return;
  state.homeworkLoading=true;state.homeworkError='';if(state.view==='homework')renderHomework();
  try{
    const response=await fetch('/api/homework',{credentials:'same-origin',cache:'no-store'});
    const body=await response.json();if(!response.ok)throw new Error(body.error||'Could not load homework.');
    state.homework=Array.isArray(body.homework)?body.homework:[];
  }catch(error){state.homeworkError=error.message||'Homework is temporarily unavailable.';}
  state.homeworkLoading=false;renderSidebar();if(state.view==='homework')renderHomework();else if(state.view==='home')renderHome();
}
function homeworkKindLabel(kind){return {grammar:'Grammar',vocabulary:'Vocabulary',context:'Context practice',writing:'Writing'}[kind]||'Practice';}
function formatHomeworkDate(date){if(!date)return '';const d=new Date(date);return Number.isNaN(d.getTime())?date:d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
function renderHomework(){
  const active=state.homework.filter(h=>h.status!=='completed'),completed=state.homework.filter(h=>h.status==='completed');
  const card=h=>{const done=h.status==='completed',writing=h.kind==='writing',editing=state.homeworkWritingId===h.id;
    return `<article class="homework-card ${done?'homework-done':''}"><div class="homework-card-top"><div class="homework-tags"><span class="homework-kind">${writing?'✍':'✦'} ${homeworkKindLabel(h.kind)}</span><span class="homework-level">${escapeHtml(h.level)}</span></div><span class="homework-status ${done?'complete':''}">${done?'✓ Completed':'○ To do'}</span></div>
      <h3>${escapeHtml(h.title)}</h3><p class="homework-instructions">${escapeHtml(h.instructions||'Practice this topic at your level. Every answer counts.')}</p>
      <div class="homework-metadata"><span>${writing?'Open response':`${h.questionCount} question${h.questionCount===1?'':'s'}`}</span>${h.dueDate?`<span>Due ${escapeHtml(h.dueDate)}</span>`:''}${done?`<span>Finished ${formatHomeworkDate(h.completedAt)}</span>`:''}</div>
      ${done?(writing?`<div class="homework-submission"><small>YOUR SUBMITTED SPANISH</small><p>${escapeHtml(h.responseText||'')}</p></div><p class="homework-note">Your tutor can now review this text in your Spanish learning chat.</p>`:`<div class="homework-score"><strong>${h.total?Math.round(h.correct/h.total*100):0}%</strong><span>${h.correct} of ${h.total} correct</span></div>${h.mistakes?.length?`<details class="homework-mistakes"><summary>Review ${h.mistakes.length} missed answer${h.mistakes.length===1?'':'s'}</summary>${h.mistakes.map(m=>`<div><strong>${escapeHtml(m.prompt)}</strong><span>You chose: ${escapeHtml(m.picked)} · Correct: ${escapeHtml(m.expected)}</span></div>`).join('')}</details>`:''}<p class="homework-note">Your tutor can see this score and your missed answers.</p>`):writing?(editing?`<div class="homework-editor"><label for="homework-response">Write your answer in Spanish</label><textarea id="homework-response" placeholder="Escribe tu respuesta aquí…" rows="9" maxlength="5000">${escapeHtml(state.homeworkDrafts[h.id]||'')}</textarea><div class="homework-editor-actions"><small>Draft saved on this device · ${String(state.homeworkDrafts[h.id]||'').length}/5000</small><button class="primary-btn" data-submit-writing="${escapeHtml(h.id)}" ${state.homeworkSubmitBusy?'disabled':''}>${state.homeworkSubmitBusy?'Submitting…':'Submit to my tutor →'}</button></div></div>`:`<button class="primary-btn" data-open-writing="${escapeHtml(h.id)}">Write my answer →</button>`):`<button class="primary-btn" data-start-homework="${escapeHtml(h.id)}">Start assigned practice →</button>`}
    </article>`;
  };
  $('#main-content').innerHTML=`<section class="homework-heading"><div class="eyebrow">YOUR LEARNING PLAN · CONNECTED TO PALABRA</div><h1 class="page-title">Homework from <em>your tutor.</em></h1><p class="subtitle">Your Spanish learning chat assigns the tasks. You complete them here, and your tutor can check your results and give feedback.</p><div class="homework-summary"><div><strong>${active.length}</strong><span>To complete</span></div><div><strong>${completed.length}</strong><span>Finished</span></div><button class="secondary-btn" data-refresh-homework>↻ Refresh tasks</button></div></section>
    ${state.homeworkError?`<div class="homework-alert">${escapeHtml(state.homeworkError)}<br><small>Check that you’re signed in and that the Palabra connection is enabled for your account.</small></div>`:''}
    ${state.homeworkLoading?'<div class="loading">Checking with your tutor’s homework list…</div>':''}
    ${active.length?`<div class="homework-section-label"><h2>Up next</h2><span>${active.length} assignment${active.length===1?'':'s'}</span></div><div class="homework-grid">${active.map(card).join('')}</div>`:!state.homeworkLoading&&!state.homeworkError?`<div class="homework-empty"><div class="homework-empty-icon">✉</div><h2>No homework waiting. ¡Muy bien!</h2><p>Ask your Spanish learning plan tutor to assign a Palabra grammar or vocabulary challenge, or a Spanish writing prompt. Then refresh this page.</p><button class="secondary-btn" data-refresh-homework>Check for assignments ↻</button></div>`:''}
    ${completed.length?`<div class="homework-section-label"><h2>Completed work</h2><span>Ready for tutor review</span></div><div class="homework-grid">${completed.map(card).join('')}</div>`:''}
    <div class="homework-how"><div><span class="eyebrow">HOW IT WORKS</span><h3>One learning plan, two spaces.</h3><p>In ChatGPT, ask your tutor to use the <strong>Palabra</strong> connection to assign homework. Your tasks arrive here. When you finish, ask your tutor to check your Palabra homework status and correct your writing or explain mistakes.</p></div><span>ChatGPT tutor <b>→</b> Palabra practice <b>→</b> Tutor feedback</span></div>`;
}
function startAssignedHomework(id){
  const h=state.homework.find(item=>item.id===id&&item.status==='assigned');if(!h){toast('This assignment is no longer available. Refresh your tasks.');return;}
  if(h.kind==='writing'){state.homeworkWritingId=h.id;renderHomework();return;}
  state.length=h.questionCount;
  if(h.kind==='grammar'){state.mode='grammar';state.grammarLevel=h.level;state.grammarUnit=h.topicId;state.grammarStyle='mixed';}
  else if(h.kind==='vocabulary'){state.mode='curriculum';state.curriculumLevel=h.level;state.curriculumTheme=h.topicId;state.curriculumDirection='mixed';}
  else if(h.kind==='context'){state.mode='exercises';state.exerciseTheme=h.topicId;state.exerciseLevel={A1:'beginner',A2:'elementary',B1:'intermediate',B2:'advanced',C1:'advanced'}[h.level];state.exerciseStyle='mixed';}
  startQuiz(false);
  if(state.quiz&&state.view==='quiz'){state.quiz.homeworkId=h.id;state.quiz.homeworkTitle=h.title;renderQuiz();}
}
async function postHomeworkCompletion(payload){
  const response=await fetch('/api/homework/complete',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
  const body=await response.json();if(!response.ok)throw new Error(body.error||'Could not submit your homework.');
  state.homework=state.homework.map(h=>h.id===body.homework.id?body.homework:h);renderSidebar();return body.homework;
}
async function submitQuizHomework(quiz){
  if(!quiz.homeworkId||quiz.homeworkSubmission==='saving')return;
  quiz.homeworkSubmission='saving';if(state.view==='result'&&state.quiz===quiz)renderResults();
  const reviewNotes=quiz.selfReview.map((entry,i)=>`${i+1}. Prompt: ${entry.prompt}\nMy answer: ${entry.given}\nReference: ${entry.reference}\nLearner marked: ${entry.marked}`).join('\n\n');
  try{await postHomeworkCompletion({assignmentId:quiz.homeworkId,correct:quiz.correct,total:quiz.questions.length,mistakes:quiz.wrong.map(q=>({questionId:q.id,prompt:q.prompt,expected:q.answer,picked:q.picked})),responseText:reviewNotes?`Self-reviewed translations (please check these):\n${reviewNotes}`:''});quiz.homeworkSubmission='saved';}
  catch(error){quiz.homeworkSubmission='failed';quiz.homeworkSubmitError=error.message||'Submission failed';}
  if(state.view==='result'&&state.quiz===quiz)renderResults();
}
async function submitWritingHomework(id){
  if(state.homeworkSubmitBusy)return;
  const answer=String(state.homeworkDrafts[id]||'').trim();if(answer.length<3){toast('Write a little Spanish before submitting.');return;}
  state.homeworkSubmitBusy=true;renderHomework();
  try{await postHomeworkCompletion({assignmentId:id,responseText:answer});delete state.homeworkDrafts[id];localStorage.setItem(HOMEWORK_DRAFT_KEY,JSON.stringify(state.homeworkDrafts));state.homeworkWritingId=null;toast('Your writing is ready for tutor feedback!');}
  catch(error){toast(error.message||'Could not submit writing. Try again.');}
  state.homeworkSubmitBusy=false;renderHomework();
}
function renderQuiz(){
  const quiz=state.quiz;if(!quiz)return setView('practice');
  const q=quiz.questions[quiz.index],selected=quiz.selected,done=selected!==null,mode=quizResponseMode(quiz),writing=mode==='write';
  const correct=done&&quiz.answerCorrect;
  const heading=quiz.homeworkId?'TUTOR HOMEWORK':quiz.review?'MISTAKE REVIEW':q.type==='grammar'?'GRAMMAR STUDIO':q.type==='curriculum'?'MY CURRICULUM':q.type==='exercise'?'CONTEXT STUDIO':q.type==='verbs'?'VERB LAB':'VOCABULARY CHALLENGE';
  const label=q.type==='grammar'?`${q.entry.level} · ${q.entry.topic}`.toUpperCase():q.type==='curriculum'?`${q.theme.level} · ${q.theme.title}`.toUpperCase():q.type==='exercise'?EXERCISE_THEMES[q.entry.theme].name.toUpperCase():q.direction==='es-en'?'SPANISH → ENGLISH':'ENGLISH → SPANISH';
  const prompt=((q.type==='exercise'&&q.variant==='cloze')||(q.type==='grammar'&&q.variant==='cloze'))?escapeHtml(q.prompt).replace(/_{4,8}/,'<span class="blank">______</span>'):escapeHtml(q.prompt);
  const showAudio=q.variant==='dictation'?true:q.type==='grammar'?done:q.type==='exercise'&&(q.variant==='cloze'||q.variant==='production')?done:q.type!=='curriculum'||q.direction==='es-en'||done;
  const answerUi=writing?`<div class="write-answer"><label for="typed-answer">${q.variant==='cloze'?'Type the missing word or phrase':'Write your own answer'}</label>
    ${q.answer.split(/\s+/).length>=5?`<textarea id="typed-answer" rows="3" maxlength="250" placeholder="Escribe tu respuesta…" ${done||quiz.pendingReview?'disabled':''}>${escapeHtml(quiz.draft||'')}</textarea>`:`<input id="typed-answer" type="text" maxlength="250" autocomplete="off" spellcheck="false" placeholder="Type your answer here…" value="${escapeHtml(quiz.draft||'')}" ${done||quiz.pendingReview?'disabled':''}>`}
    ${!done&&!quiz.pendingReview?'<button class="primary-btn check-typed" data-check-typed>Check my answer →</button>':''}
    ${quiz.pendingReview?`<div class="self-review"><strong>Compare your answer with our example.</strong><p><b>You wrote:</b> ${escapeHtml(quiz.draft)}</p><p><b>Reference:</b> ${escapeHtml(q.answer)}</p><small>Translations can have more than one correct wording. If yours means the same thing and is grammatically correct, mark it correct; otherwise send it to your mistake review.</small><div><button class="primary-btn" data-self-mark="correct">My answer is also correct ✓</button><button class="secondary-btn" data-self-mark="wrong">I need to review it</button></div></div>`:''}</div>`:
    `<div class="choices">${q.options.map((choice,i)=>`<button class="answer-choice ${done&&choice===q.answer?'correct':''} ${done&&selected===i&&!correct?'incorrect':''}" data-answer="${i}" ${done?'disabled':''}><span class="choice-key">${done&&choice===q.answer?'✓':done&&selected===i&&!correct?'×':i+1}</span>${escapeHtml(choice)}</button>`).join('')}</div>`;
  $('#main-content').innerHTML=`<div class="quiz-wrap"><div class="quiz-toolbar"><button class="ghost-btn" data-quit>← Exit challenge</button><span class="quiz-count">QUESTION <strong>${quiz.index+1} / ${quiz.questions.length}</strong></span></div><div class="quiz-progress"><span style="width:${(quiz.index+1)/quiz.questions.length*100}%"></span></div>
    <div class="white-card quiz-main"><div class="quiz-overline">${heading} · ${escapeHtml(label)}</div>
    ${q.variant==='dictation'?'<div class="dictation-badge">◖)) LISTENING CHALLENGE · TYPE WHAT YOU HEAR</div>':`<div class="answer-mode-switch"><span>ANSWER WITH</span><button class="${!writing?'active':''}" data-quiz-mode="choice" ${done||quiz.pendingReview?'disabled':''}>◫ Choices</button><button class="${writing?'active':''}" data-quiz-mode="write" ${done||quiz.pendingReview?'disabled':''}>✎ Type it</button></div>`}
    <h1 class="quiz-word ${['exercise','grammar'].includes(q.type)?'context-prompt':''}">${prompt}</h1><p class="quiz-subtitle">${escapeHtml(q.caption)}</p>${q.hint?`<div class="context-hint"><b>${q.type==='grammar'?'Clue:':'English meaning:'}</b> ${escapeHtml(q.hint)}</div>`:''}${showAudio?`<button class="speak-btn" data-speak="${escapeHtml(q.speakText||q.prompt)}" data-speak-lang="${q.speakLang||(q.direction==='es-en'?'es-ES':'en-US')}">◖)) Listen to this phrase</button>`:''}
    ${answerUi}
    ${done?`<div class="feedback ${correct?'good':'bad'}"><strong>${quiz.selfChecked?(correct?'✓ You marked this translation correct.':'↺ Added to your mistake review.'):correct?'✓ Nicely done!':'↺ Not quite — you’ll get it next time.'}</strong>${writing?`<div class="typed-compare">You wrote: <b>${escapeHtml(quiz.typedAnswer)}</b></div>`:''}${escapeHtml(q.detail)}${correct?'':` · Reference answer: ${escapeHtml(q.answer)}`}${quiz.accentTip?'<div class="accent-tip">Accent tip: check the accents in the reference spelling.</div>':''}</div>`:''}
    <div class="quiz-footer"><span class="quiz-help">${writing?'Enter to check · Add your own wording':`Use keys 1–4 to answer`} · Enter to continue</span><button class="primary-btn" data-next ${done?'':'disabled'}>${quiz.index+1===quiz.questions.length?'See my results':'Next question'} →</button></div>${q.type==='exercise'?`<details class="exercise-source"><summary>Sentence source: ${q.entry.curated?'Palabra · original A1 collection':'Tatoeba · CC BY 2.0 FR'}</summary>${q.entry.credit?`<p>${escapeHtml(q.entry.credit)}</p>`:''}</details>`:q.type==='grammar'?'<div class="exercise-source">Grammar practice · Palabra original examples</div>':''}</div></div>`;
}
function renderResults(){
  const quiz=state.quiz;if(!quiz)return setView('home');
  const percent=Math.round(quiz.correct/quiz.questions.length*100),errors=quiz.questions.length-quiz.correct;
  $('#main-content').innerHTML=`<div class="quiz-wrap"><div class="result-hero"><div class="result-medal">${percent>=90?'🏆':percent>=70?'🌟':'🌱'}</div><div class="eyebrow">CHALLENGE COMPLETE</div><h2>${percent>=90?'¡Increíble!':percent>=70?'¡Muy bien!':'Keep growing!'}</h2><p>Every answer brings you one step closer to fluency.</p><div class="result-score">${percent}%</div></div>
   <div class="result-metrics"><div class="result-metric"><strong>${quiz.correct}</strong><small>Correct answers</small></div><div class="result-metric"><strong>${errors}</strong><small>Missed answers</small></div><div class="result-metric"><strong>${quiz.questions.length}</strong><small>Questions practiced</small></div></div>
   ${quiz.selfReview?.length?`<p class="self-review-notice">✎ ${quiz.selfReview.length} open translation${quiz.selfReview.length===1?' was':'s were'} self-checked. Compare these with your tutor for confirmation.</p>`:''}
   <div class="white-card" style="padding:24px"><h3 class="section-title" style="font-size:18px;margin-bottom:12px">${errors?'Questions to revisit':'Fantastic work!'}</h3>${errors?`<div class="mistake-list">${quiz.wrong.slice(0,10).map(q=>`<div class="mistake-row"><strong class="mistake-es">${escapeHtml(q.type==='verbs'?q.verb.es:q.type==='grammar'?q.entry.template.replace('____',q.entry.answer):q.type==='exercise'?q.variant==='dictation'?q.entry.es:q.entry.target:q.type==='curriculum'?q.term.es:q.word.es)}</strong><span class="mistake-en">${escapeHtml(q.detail)}</span></div>`).join('')}</div>${errors>10?`<p style="color:#99a0a5;font-size:11px">+ ${errors-10} more in your review queue</p>`:''}`:'<p style="color:#8e969c">No mistakes this round. Come back tomorrow to strengthen what you know.</p>'}</div>
   ${quiz.homeworkId?`<div class="homework-result ${quiz.homeworkSubmission==='failed'?'error':''}">${quiz.homeworkSubmission==='saved'?'✓ Homework saved! Your tutor can see your score and mistakes.':quiz.homeworkSubmission==='failed'?`Your answers are saved on this device, but the tutor submission failed: ${escapeHtml(quiz.homeworkSubmitError)} <button class="secondary-btn" data-retry-homework>Try submitting again</button>`:'Saving your homework for your tutor…'}</div>`:''}
   <div class="result-actions">${quiz.homeworkId?'<button class="primary-btn" data-nav="homework">Back to tutor homework →</button>':'<button class="primary-btn" data-again>Practice same set again ↺</button>'}<button class="secondary-btn" data-nav="mistakes">Review mistakes (${mistakeIds().length})</button><button class="secondary-btn" data-nav="practice">New challenge →</button><button class="secondary-btn" data-nav="home">Dashboard</button></div></div>`;
}
function renderMistakes(){
  const ids=mistakeIds(),items=ids.map(id=>{
    if(id.startsWith('w:')){const w=state.wordMap.get(id.slice(2));return w?{id,es:w.es,en:w.en,type:'Vocabulary'}:null;}
    if(id.startsWith('x:')){const entry=state.exerciseMap.get(id.split(':')[1]);return entry?{id,es:entry.es,en:entry.en,type:'Context practice'}:null;}
    if(id.startsWith('c:')){const question=questionForId(id);return question?{id,es:question.term.es,en:question.term.en,type:`${question.theme.level} · ${question.theme.title}`}:null;}
    if(id.startsWith('g:')){const question=questionForId(id);return question?{id,es:question.entry.template.replace('____',question.entry.answer),en:question.entry.hint,type:`${question.entry.level} · ${question.entry.topic}`}:null;}
    const [,es,tense,p]=id.split(':'),verb=VERB_MAP.get(es);return verb?{id,es:spanishForm(verb,tense,Number(p)),en:englishForm(verb,tense,Number(p)),type:TENSES.find(t=>t[0]===tense)?.[1]}:null;
  }).filter(Boolean);
  $('#main-content').innerHTML=`<div class="section-header"><div><div class="eyebrow">YOUR SECOND CHANCE</div><h1 class="page-title">Mistakes make <em>masters.</em></h1><p class="subtitle">A mistake leaves your queue after two correct attempts.</p></div><button class="primary-btn" data-start-review ${items.length?'':'disabled'}>Review ${Math.min(items.length,state.length)} now →</button></div>
  ${items.length?`<div class="mistake-list">${items.slice(0,100).map(it=>`<div class="mistake-row"><strong class="mistake-es">${escapeHtml(it.es)}</strong><span class="mistake-en">${escapeHtml(it.en)}</span><span class="mistake-badge">${escapeHtml(it.type)}</span></div>`).join('')}</div>${items.length>100?`<p class="disclaimer">Showing the first 100. All ${items.length} missed cards are available in practice.</p>`:''}`:`<div class="empty-state"><div class="empty-illustration">🎉</div><h3>All caught up!</h3><p>Your review queue is empty. Try a new challenge and keep learning.</p><button class="primary-btn" data-nav="practice">Start practicing →</button></div>`}`;
}
function renderLibrary(){
  const term=state.search.trim().toLocaleLowerCase();
  const words=state.words.filter(w=>{
    const r=record('w:'+w.id);
    const status=state.libraryFilter==='all'||(state.libraryFilter==='known'?isKnown(r):state.libraryFilter==='mastered'?isMastered(r):state.libraryFilter==='review'?r.wrong>0&&r.reviewStreak<2:!isKnown(r));
    return (state.libraryLevel==='all'||w.level===state.libraryLevel)&&(!term||w.es.includes(term)||w.en.toLowerCase().includes(term))&&status;
  });
  const pages=Math.max(1,Math.ceil(words.length/25)),page=Math.min(state.page,pages-1);state.page=page;
  $('#main-content').innerHTML=`<div class="section-header"><div><div class="eyebrow">THE WORD COLLECTION</div><h1 class="page-title">Your word <em>library.</em></h1><p class="subtitle">Explore ${state.words.length.toLocaleString()} Spanish words. Mark the ones you already know.</p></div></div>
  <div class="library-tools"><label class="search-box"><span>⌕</span><input type="search" placeholder="Search Spanish or English…" id="word-search" value="${escapeHtml(state.search)}"></label>
  <select class="filter-select" id="library-level" aria-label="Filter word difficulty"><option value="all" ${state.libraryLevel==='all'?'selected':''}>All levels</option>${CEFR_LEVELS.map(level=>`<option value="${level}" ${state.libraryLevel===level?'selected':''}>${level}</option>`).join('')}</select>
  <select class="filter-select" id="library-filter"><option value="all" ${state.libraryFilter==='all'?'selected':''}>All words</option><option value="new" ${state.libraryFilter==='new'?'selected':''}>Still learning</option><option value="known" ${state.libraryFilter==='known'?'selected':''}>Known words</option><option value="mastered" ${state.libraryFilter==='mastered'?'selected':''}>★ Mastered</option><option value="review" ${state.libraryFilter==='review'?'selected':''}>Mistakes</option></select></div>
  <div class="white-card" style="overflow-x:auto"><table class="library-table"><thead><tr><th>SPANISH</th><th>ENGLISH</th><th>LEVEL</th><th>STATUS</th></tr></thead><tbody>${words.slice(page*25,(page+1)*25).map(w=>`<tr><td>${escapeHtml(w.es)}</td><td>${escapeHtml(w.en)}</td><td><span class="word-level">${w.level}</span></td><td><button class="known-btn ${isKnown(record('w:'+w.id))?'known':''}" data-known="${escapeHtml(w.id)}">${isKnown(record('w:'+w.id))?'✓ Known':'+ Mark known'}</button>${isMastered(record('w:'+w.id))?'<span class="mastered-tag">★ Mastered</span>':''}</td></tr>`).join('')||'<tr><td colspan="4" style="text-align:center;color:#9da4aa;padding:32px">No matching words found.</td></tr>'}</tbody></table></div>
  <div class="pagination"><span>${words.length?`${page*25+1}–${Math.min((page+1)*25,words.length)} of ${words.length.toLocaleString()}`:'0 words'}</span><div class="pager-buttons"><button data-page="${page-1}" ${page===0?'disabled':''}>← Previous</button><button data-page="${page+1}" ${page>=pages-1?'disabled':''}>Next →</button></div></div>
  <div class="disclaimer">Levels are approximate learning groups informed by your curriculum and word frequency; they are not official CEFR classifications. Dictionary data adapted from <a target="_blank" rel="noopener" href="https://github.com/mananoreboton/en-es-en-Dic">en-es-en-Dic</a> (Apache 2.0), via <a target="_blank" rel="noopener" href="https://github.com/fufu70/spanish-english-json">spanish-english-json</a>; frequency ordering from <a target="_blank" rel="noopener" href="https://github.com/doozan/spanish_data">spanish_data</a> (CC BY-SA). Some dictionary words have multiple possible translations: quizzes use one common sense. Progress lives in this browser.</div>`;
}
function updateKnown(id){const key='w:'+id,r=record(key),known=!isKnown(r);state.progress[key]={...r,known,mastered:known?isMastered(r):false};save();renderLibrary();renderSidebar();}
function onClick(event){
  const el=event.target.closest('button');if(!el)return;
  if(el.hasAttribute('data-continue-lesson')){const lessons=pathLessons();startPathLesson(lessons.find(l=>!pathProgress(l).done)||lessons[0]);return;}
  if(el.dataset.lessonKind){startPathLesson({kind:el.dataset.lessonKind,id:el.dataset.lessonId});return;}
  if(el.dataset.startHomework){startAssignedHomework(el.dataset.startHomework);return;}
  if(el.dataset.openWriting){state.homeworkWritingId=el.dataset.openWriting;renderHomework();$('#homework-response')?.focus();return;}
  if(el.dataset.submitWriting){submitWritingHomework(el.dataset.submitWriting);return;}
  if(el.hasAttribute('data-refresh-homework')){loadHomework();return;}
  if(el.hasAttribute('data-retry-homework')){submitQuizHomework(state.quiz);return;}
  if(el.dataset.readingOpen){openReading(el.dataset.readingOpen);return;}
  if(el.dataset.readingLevel){state.readingLevel=el.dataset.readingLevel;state.readingTheme='all';renderReading();return;}
  if(el.hasAttribute('data-reading-back')){setView('reading');return;}
  if(el.hasAttribute('data-reading-complete')){toggleReadingComplete();return;}
  if(el.hasAttribute('data-reading-clear')){state.readingSearch='';state.readingTheme='all';renderReading();return;}
  if(el.dataset.nav){state.quiz=null;setView(el.dataset.nav);$('#sidebar').classList.remove('open');return;}
  if(el.dataset.mode){state.mode=el.dataset.mode;setView('practice');$('#sidebar').classList.remove('open');return;}
  if(el.dataset.selectMode){state.mode=el.dataset.selectMode;render();return;}
  if(el.dataset.featureTheme){state.exerciseTheme=el.dataset.featureTheme;state.mode='exercises';setView('exercises');return;}
  if(el.dataset.openGrammar){state.grammarLevel=el.dataset.openGrammar.split('-')[0].toUpperCase();state.grammarUnit=el.dataset.openGrammar;setView('grammar');return;}
  if(el.dataset.grammarLevel){state.grammarLevel=el.dataset.grammarLevel;state.grammarUnit=state.grammarLevel.toLowerCase()+'-01';renderGrammar();return;}
  if(el.dataset.grammarUnit){state.grammarUnit=el.dataset.grammarUnit;renderGrammar();return;}
  if(el.dataset.grammarStyle){state.grammarStyle=el.dataset.grammarStyle;renderGrammar();return;}
  if(el.dataset.answerFormat){state.answerFormat=el.dataset.answerFormat;render();return;}
  if(el.dataset.studyLevel){if(state.mode==='verbs')state.verbLevel=el.dataset.studyLevel;else state.level=el.dataset.studyLevel;render();return;}
  if(el.dataset.studyFocus){if(state.mode==='verbs')state.verbFocus=el.dataset.studyFocus;else state.vocabularyFocus=el.dataset.studyFocus;render();return;}
  if(el.dataset.curriculumLevel){state.curriculumLevel=el.dataset.curriculumLevel;state.curriculumTheme=state.curriculumLevel.toLowerCase()+'-01';renderCurriculum();return;}
  if(el.dataset.curriculumTheme){state.curriculumTheme=el.dataset.curriculumTheme;renderCurriculum();return;}
  if(el.dataset.curriculumDirection){state.curriculumDirection=el.dataset.curriculumDirection;renderCurriculum();return;}
  if(el.dataset.exerciseTheme){state.exerciseTheme=el.dataset.exerciseTheme;state.mode='exercises';renderExercises();return;}
  if(el.dataset.exerciseLevel){state.exerciseLevel=el.dataset.exerciseLevel;renderExercises();return;}
  if(el.dataset.exerciseStyle){state.exerciseStyle=el.dataset.exerciseStyle;render();return;}
  if(el.dataset.direction){state.direction=el.dataset.direction;render();return;}
  if(el.dataset.length){state.length=Number(el.dataset.length);render();return;}
  if(el.hasAttribute('data-start-exercises')){state.mode='exercises';startQuiz(false);return;}
  if(el.hasAttribute('data-start-curriculum')){state.mode='curriculum';startQuiz(false);return;}
  if(el.hasAttribute('data-start-grammar')){state.mode='grammar';startQuiz(false);return;}
  if(el.hasAttribute('data-start')){startQuiz(false);return;}
  if(el.hasAttribute('data-start-review')){startQuiz(true);return;}
  if(el.dataset.quizMode){if(state.quiz?.selected===null&&!state.quiz.pendingReview){state.quiz.overrideMode=el.dataset.quizMode;renderQuiz();if(el.dataset.quizMode==='write')$('#typed-answer')?.focus();}return;}
  if(el.hasAttribute('data-check-typed')){submitTypedAnswer();return;}
  if(el.dataset.selfMark){selfMarkTypedAnswer(el.dataset.selfMark==='correct');return;}
  if(el.dataset.answer!==undefined){answerQuestion(Number(el.dataset.answer));return;}
  if(el.hasAttribute('data-next')){nextQuestion();return;}
  if(el.hasAttribute('data-quit')){leaveQuiz();return;}
  if(el.hasAttribute('data-again')){replayQuiz();return;}
  if(el.dataset.known){updateKnown(el.dataset.known);return;}
  if(el.dataset.page){state.page=Number(el.dataset.page);renderLibrary();window.scrollTo({top:0,behavior:'smooth'});return;}
  if(el.dataset.speak!==undefined){if(!('speechSynthesis' in window)){toast('Speech is unavailable in this browser.');return;}speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(el.dataset.speak);utterance.lang=el.dataset.speakLang;utterance.rate=.86;speechSynthesis.speak(utterance);return;}
  if(el.id==='mobile-menu'){$('#sidebar').classList.toggle('open');}
}
document.addEventListener('click',event=>{
  const word=event.target.closest('[data-reading-word]');
  if(word){showReadingPopup(word);return;}
  if(readingPopup&&!readingPopup.contains(event.target))closeReadingPopup();
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&readingPopup){event.preventDefault();closeReadingPopup(true);}});
window.addEventListener('resize',positionReadingPopup);
window.addEventListener('scroll',positionReadingPopup,true);
window.visualViewport?.addEventListener('resize',positionReadingPopup);
window.visualViewport?.addEventListener('scroll',positionReadingPopup);
document.addEventListener('click',onClick);
document.addEventListener('change',event=>{
  if(event.target.id==='reading-theme'){state.readingTheme=event.target.value;renderReading();}
  if(event.target.id==='practice-extra-length'&&event.target.value){state.length=Number(event.target.value);renderPractice();}
  if(event.target.id==='library-level'){state.libraryLevel=event.target.value;state.page=0;renderLibrary();}
  if(event.target.id==='library-filter'){state.libraryFilter=event.target.value;state.page=0;renderLibrary();}
  if(event.target.id==='exercise-theme-select'){state.exerciseTheme=event.target.value;render();}
  if(event.target.id==='exercise-level-select'){state.exerciseLevel=event.target.value;render();}
  if(event.target.id==='exercise-length-select'){state.length=Number(event.target.value);renderExercises();}
  if(event.target.id==='curriculum-length-select'){state.length=Number(event.target.value);renderCurriculum();}
  if(event.target.id==='grammar-length-select'){state.length=Number(event.target.value);renderGrammar();}
  if(event.target.matches('[data-tense]')){const tense=event.target.value;state.tenses=event.target.checked?unique([...state.tenses,tense]):state.tenses.filter(x=>x!==tense);render();}
});
document.addEventListener('input',event=>{
  if(event.target.id==='reading-search'){
    const cursor=event.target.selectionStart;state.readingSearch=event.target.value;renderReading();const input=$('#reading-search');input?.focus();input?.setSelectionRange(cursor,cursor);
  }
  if(event.target.id==='typed-answer'&&state.quiz)state.quiz.draft=event.target.value;
  if(event.target.id==='homework-response'){
    state.homeworkDrafts[state.homeworkWritingId]=event.target.value;
    try{localStorage.setItem(HOMEWORK_DRAFT_KEY,JSON.stringify(state.homeworkDrafts));}catch{/* Drafts still work until this page is closed. */}
    const counter=$('.homework-editor-actions small');if(counter)counter.textContent=`Draft saved on this device · ${event.target.value.length}/5000`;
  }
  if(event.target.id==='word-search'){
    const cursor=event.target.selectionStart;state.search=event.target.value;state.page=0;renderLibrary();const input=$('#word-search');input.focus();input.setSelectionRange(cursor,cursor);
  }
});
document.addEventListener('keydown',event=>{
  if(state.view!=='quiz')return;
  if(event.target.id==='typed-answer'){
    if(event.key==='Enter'&&(event.target.tagName==='INPUT'||event.ctrlKey||event.metaKey)){
      event.preventDefault();if(state.quiz?.selected!==null)nextQuestion();else submitTypedAnswer();
    }
    return;
  }
  if(/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))return;
  if(event.key==='Enter'&&state.quiz?.selected!==null){event.preventDefault();nextQuestion();}
  if(/^[1-4]$/.test(event.key)&&state.quiz?.selected===null&&quizResponseMode(state.quiz)==='choice'){event.preventDefault();answerQuestion(Number(event.key)-1);}
});
async function init(){
  try{const [vocabResponse,exerciseResponse,curriculumResponse,grammarResponse,beginnerResponse,readingResponse]=await Promise.all([fetch('./vocabulary.json'),fetch('./exercises.json'),fetch('./curriculum.json'),fetch('./grammar.json'),fetch('./beginner.json'),fetch('./readings.json')]);
    if([vocabResponse,exerciseResponse,curriculumResponse,grammarResponse,beginnerResponse,readingResponse].some(r=>!r.ok))throw new Error('Learning database unavailable');
    const [words,exercises,curriculum,grammar,beginner,readings]=await Promise.all([vocabResponse.json(),exerciseResponse.json(),curriculumResponse.json(),grammarResponse.json(),beginnerResponse.json(),readingResponse.json()]);
    state.words=assignVocabularyLevels(words,curriculum);state.exercises=[...exercises,...beginner];state.curriculum=curriculum;state.grammar=grammar;state.readings=readings;
    state.wordMap=new Map(state.words.map(w=>[w.id,w]));state.exerciseMap=new Map(state.exercises.map(e=>[e.id,e]));
    state.readingMap=new Map(state.readings.map(r=>[r.id,r]));
    state.curriculumThemeMap=new Map(state.curriculum.flatMap(level=>level.themes.map(theme=>[theme.id,{...theme,level:level.id}])));
    state.grammarMap=new Map(state.grammar.map(e=>[e.id,e]));
    if(location.hash==='#homework')state.view='homework';
    render();loadHomework();
  }catch(err){console.error(err);$('#main-content').innerHTML=`<div class="empty-state"><div class="empty-illustration">📚</div><h3>We couldn't load the dictionary</h3><p>Please refresh the page to try again.</p><button class="primary-btn" onclick="location.reload()">Try again</button></div>`;}
}
init();
