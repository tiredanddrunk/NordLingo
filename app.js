const courses = {
 no: {
  title:"Norwegisch · Begrüßungen",
  words:[
   {de:"Hallo",native:"Hei",pron:"Ungefähr: „hei“"},
   {de:"Guten Morgen",native:"God morgen",pron:"Ungefähr: „gu mor'n“"},
   {de:"Wie geht es dir?",native:"Hvordan går det med deg?",pron:"Ungefähr: „vur-dan gor de me dai“"},
   {de:"Danke",native:"Takk",pron:"Ungefähr: „tak“"},
   {de:"Auf Wiedersehen",native:"Ha det",pron:"Ungefähr: „ha de“"}
  ],
  quiz:[
   {q:"Was bedeutet „Hei“?",opts:["Hallo","Danke","Gute Nacht"],answer:0,explain:"„Hei“ bedeutet „Hallo“."},
   {q:"Wie heißt „Danke“ auf Norwegisch?",opts:["Ha det","Takk","God morgen"],answer:1,explain:"„Takk“ bedeutet „Danke“."},
   {q:"Was bedeutet „Ha det“?",opts:["Wie geht's?","Guten Morgen","Auf Wiedersehen"],answer:2,explain:"„Ha det“ ist eine übliche Verabschiedung."}
  ]
 },
 is: {
  title:"Isländisch · Erste Wörter",
  words:[
   {de:"Hallo",native:"Halló",pron:"Ungefähr: „hat-loh“"},
   {de:"Guten Tag",native:"Góðan daginn",pron:"Ungefähr: „go-than dai-yin“"},
   {de:"Wie geht es dir?",native:"Hvernig hefurðu það?",pron:"Ungefähr: „kwer-nig he-ver-thu thah“"},
   {de:"Danke",native:"Takk",pron:"Ungefähr: „tak“"},
   {de:"Ja / Nein",native:"Já / Nei",pron:"Ungefähr: „yau / nei“"}
  ],
  quiz:[
   {q:"Was bedeutet „Takk“?",opts:["Danke","Hallo","Nein"],answer:0,explain:"„Takk“ bedeutet „Danke“."},
   {q:"Welcher Buchstabe gehört zum Isländischen?",opts:["Þ","Ł","ß"],answer:0,explain:"Þ heißt Thorn und steht für einen stimmlosen th-Laut."},
   {q:"Was bedeutet „Já“?",opts:["Nein","Ja","Bitte"],answer:1,explain:"„Já“ bedeutet „Ja“."}
  ]
 }
};
let language="no", wordIndex=0, quizIndex=0, answered=new Set();
const $=id=>document.getElementById(id);
function getProgress(){return Number(localStorage.getItem("nordlingo-progress")||0)}
function setProgress(n){localStorage.setItem("nordlingo-progress",String(n));renderProgress()}
function renderProgress(){let p=Math.min(100,Math.round(getProgress()/12*100));$("progressLabel").textContent=p+" %";$("progressBar").style.width=p+"%"}
function renderWord(){let c=courses[language],w=c.words[wordIndex];$("lessonTitle").textContent=c.title;$("wordGerman").textContent=w.de;$("wordNative").textContent=w.native;$("wordPronunciation").textContent=w.pron;$("wordCount").textContent=(wordIndex+1)+" / "+c.words.length;$("prevWord").disabled=wordIndex===0;$("nextWord").textContent=wordIndex===c.words.length-1?"Zum Quiz ↓":"Weiter →"}
function renderQuiz(){let q=courses[language].quiz[quizIndex];$("quizQuestion").textContent=q.q;$("quizFeedback").textContent="";$("nextQuiz").classList.add("hidden");$("quizOptions").innerHTML="";q.opts.forEach((opt,i)=>{let b=document.createElement("button");b.className="quiz-option";b.textContent=opt;b.onclick=()=>answerQuiz(i,b);$("quizOptions").appendChild(b)})}
function answerQuiz(i,button){let q=courses[language].quiz[quizIndex];document.querySelectorAll(".quiz-option").forEach((b,j)=>{b.disabled=true;if(j===q.answer)b.classList.add("correct")});if(i!==q.answer)button.classList.add("wrong");$("quizFeedback").textContent=(i===q.answer?"Richtig! ":"Noch nicht ganz. ")+q.explain;if(!answered.has(language+"-"+quizIndex)){answered.add(language+"-"+quizIndex);setProgress(getProgress()+1)}$("nextQuiz").classList.remove("hidden");$("nextQuiz").textContent=quizIndex===courses[language].quiz.length-1?"Lektion abschließen ✓":"Nächste Frage →"}
function speak(){let w=courses[language].words[wordIndex];if(!("speechSynthesis" in window)){alert("Die Sprachausgabe wird von diesem Browser nicht unterstützt.");return}speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(w.native);u.lang=language==="no"?"nb-NO":"is-IS";u.rate=.82;speechSynthesis.speak(u)}
document.querySelectorAll(".language-card").forEach(b=>b.addEventListener("click",()=>{language=b.dataset.language;document.querySelectorAll(".language-card").forEach(x=>x.classList.toggle("active",x===b));wordIndex=0;quizIndex=0;renderWord();renderQuiz()}));
$("startLesson").onclick=()=>{$("lessonPanel").classList.remove("hidden");renderWord();renderQuiz();$("lessonPanel").scrollIntoView({behavior:"smooth",block:"start"})};
$("closeLesson").onclick=()=>$("lessonPanel").classList.add("hidden");
$("speakWord").onclick=speak;
$("prevWord").onclick=()=>{wordIndex=Math.max(0,wordIndex-1);renderWord()};
$("nextWord").onclick=()=>{if(wordIndex<courses[language].words.length-1){wordIndex++;renderWord()}else{$("quizQuestion").scrollIntoView({behavior:"smooth",block:"center"})}};
$("nextQuiz").onclick=()=>{if(quizIndex<courses[language].quiz.length-1){quizIndex++;renderQuiz()}else{setProgress(Math.max(getProgress(),language==="no"?3:6));$("quizFeedback").textContent="Gut gemacht! Deine Lektion ist abgeschlossen. Wiederhole sie morgen noch einmal."; $("nextQuiz").classList.add("hidden")}};
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
renderProgress();