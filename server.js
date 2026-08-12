const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
app.use(express.static(path.join(__dirname)));
app.get('/debug', (req, res) => {
  const fs = require('fs');
  try {
    const files = fs.readdirSync(__dirname);
    res.type('text/plain').send('Dossier __dirname : ' + __dirname + '\n\nFichiers trouvés :\n' + files.join('\n'));
  } catch (e) {
    res.type('text/plain').send('Erreur : ' + e.message);
  }
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;

/* ================= DONNÉES DU JEU ================= */
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const VOWELS = ['A','E','I','O','U','Y'];
const SEGS = [
  { v: 100, c: '#378ADD' }, { v: 250, c: '#1D9E75' }, { v: 'BANQUEROUTE', c: '#E24B4A' }, { v: 150, c: '#BA7517' },
  { v: 400, c: '#7F77DD' }, { v: 200, c: '#D85A30' }, { v: 'PASSE', c: '#888780' }, { v: 300, c: '#378ADD' },
  { v: 150, c: '#1D9E75' }, { v: 500, c: '#D4537E' }, { v: 200, c: '#BA7517' }, { v: 350, c: '#7F77DD' }
];
function segsForRound(round){
  const mult = round===3 ? 2 : (round===2 ? 1.5 : 1);
  return SEGS.map(s=> typeof s.v==='number' ? { ...s, v: Math.round(s.v*mult/50)*50 } : s);
}
const PHRASES = [
  { p: "LUNE DE MIEL", h: "💬 Expression", lvl: 1 },
  { p: "SAPIN DE NOEL", h: "🎉 Fête", lvl: 1 },
  { p: "NUIT ETOILEE", h: "🌳 Nature", lvl: 1 },
  { p: "CREPES AU SUCRE", h: "🍰 Dessert", lvl: 1 },
  { p: "PARTIE DE CARTES", h: "🎉 Fête", lvl: 1 },
  { p: "PHOTO DE CLASSE", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "COURSE DE VELO", h: "⚽ Sport", lvl: 1 },
  { p: "CADEAU DE NOEL", h: "🎉 Fête", lvl: 1 },
  { p: "BALADE A VELO", h: "💬 Expression", lvl: 1 },
  { p: "TOUR DE MANEGE", h: "🎉 Fête", lvl: 1 },
  { p: "COUCHER DE SOLEIL", h: "🌳 Nature", lvl: 1 },
  { p: "COURS DE DANSE", h: "🎉 Fête", lvl: 1 },
  { p: "JOUR DE PLUIE", h: "🌳 Nature", lvl: 1 },
  { p: "PANNE DE COURANT", h: "💬 Expression", lvl: 1 },
  { p: "RETARD DE TRAIN", h: "💬 Expression", lvl: 1 },
  { p: "PAUSE DEJEUNER", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "LISTE DE COURSES", h: "🏠 Objet", lvl: 1 },
  { p: "SIESTE APRES MIDI", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "CAFE DU MATIN", h: "🥤 Boisson", lvl: 1 },
  { p: "DOUCHE FROIDE", h: "💬 Expression", lvl: 1 },
  { p: "LAVAGE DE VOITURE", h: "🚗 Voiture", lvl: 1 },
  { p: "PROMENADE DU CHIEN", h: "🐶 Animal", lvl: 1 },
  { p: "VISITE CHEZ LE DENTISTE", h: "💼 Métier", lvl: 1 },
  { p: "ATTENTE A LA CAISSE", h: "💬 Expression", lvl: 1 },
  { p: "EMBOUTEILLAGE DU SOIR", h: "🚗 Voiture", lvl: 1 },
  { p: "REVEIL MATINAL", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "LUNDI MATIN", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "VENDREDI SOIR", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "JOUR DE CONGE", h: "🎉 Fête", lvl: 1 },
  { p: "DINER AUX CHANDELLES", h: "❤️ Amour", lvl: 1 },
  { p: "PETIT DEJEUNER AU LIT", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "BAIN MOUSSANT", h: "🏠 Objet", lvl: 1 },
  { p: "LESSIVE DU WEEK END", h: "🏠 Objet", lvl: 1 },
  { p: "REPASSAGE DU LINGE", h: "🏠 Objet", lvl: 1 },
  { p: "COURSES AU MARCHE", h: "💬 Expression", lvl: 1 },
  { p: "VISITE AU ZOO", h: "🐶 Animal", lvl: 1 },
  { p: "SORTIE A LA PISCINE", h: "⚽ Sport", lvl: 1 },
  { p: "PARTIE DE PECHE", h: "⚽ Sport", lvl: 1 },
  { p: "TOURNOI DE PETANQUE", h: "⚽ Sport", lvl: 1 },
  { p: "MATCH DE TENNIS", h: "⚽ Sport", lvl: 1 },
  { p: "COURS DE NATATION", h: "⚽ Sport", lvl: 1 },
  { p: "LECON DE PIANO", h: "💬 Expression", lvl: 1 },
  { p: "DEVOIRS DU SOIR", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "CARTABLE OUBLIE", h: "💬 Expression", lvl: 1 },
  { p: "BUS SCOLAIRE", h: "🏠 Objet", lvl: 1 },
  { p: "RECREATION A L ECOLE", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "CANTINE DE L ECOLE", h: "🍕 Plat", lvl: 1 },
  { p: "SORTIE SCOLAIRE", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "CARTE POSTALE", h: "🏠 Objet", lvl: 1 },
  { p: "ALBUM PHOTO", h: "👨‍👩‍👧‍👦 Famille", lvl: 1 },
  { p: "PETIT A PETIT L OISEAU FAIT SON NID", h: "💬 Expression", lvl: 2 },
  { p: "QUI VIVRA VERRA", h: "💬 Expression", lvl: 2 },
  { p: "APRES LA PLUIE LE BEAU TEMPS", h: "💬 Expression", lvl: 2 },
  { p: "LOIN DES YEUX LOIN DU COEUR", h: "💬 Expression", lvl: 2 },
  { p: "QUI NE RISQUE RIEN N A RIEN", h: "💬 Expression", lvl: 2 },
  { p: "MIEUX VAUT TARD QUE JAMAIS", h: "💬 Expression", lvl: 2 },
  { p: "L HABIT NE FAIT PAS LE MOINE", h: "💬 Expression", lvl: 2 },
  { p: "CHAT ECHAUDE CRAINT L EAU FROIDE", h: "💬 Expression", lvl: 2 },
  { p: "IMPOSSIBLE N EST PAS FRANCAIS", h: "🗣️ Citation", lvl: 2 },
  { p: "QUI SEME LE VENT RECOLTE LA TEMPETE", h: "💬 Expression", lvl: 2 },
  { p: "LES BONS COMPTES FONT LES BONS AMIS", h: "💬 Expression", lvl: 2 },
  { p: "PIERRE QUI ROULE N AMASSE PAS MOUSSE", h: "💬 Expression", lvl: 2 },
  { p: "TOUT VIENT A POINT A QUI SAIT ATTENDRE", h: "💬 Expression", lvl: 2 },
  { p: "QUAND LE CHAT N EST PAS LA LES SOURIS DANSENT", h: "💬 Expression", lvl: 2 },
  { p: "IL NE FAUT PAS VENDRE LA PEAU DE L OURS", h: "💬 Expression", lvl: 2 },
  { p: "LES MURS ONT DES OREILLES", h: "💬 Expression", lvl: 2 },
  { p: "QUI DORT DINE", h: "💬 Expression", lvl: 2 },
  { p: "L UNION FAIT LA FORCE", h: "🗣️ Citation", lvl: 2 },
  { p: "LA GRANDE VADROUILLE", h: "🎬 Film", lvl: 2 },
  { p: "BIENVENUE CHEZ LES CH TIS", h: "🎬 Film", lvl: 2 },
  { p: "LE PERE NOEL EST UNE ORDURE", h: "🎬 Film", lvl: 2 },
  { p: "LA CITE DE LA PEUR", h: "🎬 Film", lvl: 2 },
  { p: "LES BRONZES FONT DU SKI", h: "🎬 Film", lvl: 2 },
  { p: "LA GUERRE DES BOUTONS", h: "🎬 Film", lvl: 2 },
  { p: "LE PETIT NICOLAS", h: "🎬 Film", lvl: 2 },
  { p: "LES VISITEURS", h: "🎬 Film", lvl: 2 },
  { p: "LA SOUPE AUX CHOUX", h: "🎬 Film", lvl: 2 },
  { p: "LE DINER DE CONS", h: "🎬 Film", lvl: 2 },
  { p: "RIDICULE", h: "🎬 Film", lvl: 2 },
  { p: "TAXI", h: "🎬 Film", lvl: 2 },
  { p: "THRILLER MICHAEL JACKSON", h: "🎵 Chanson", lvl: 2 },
  { p: "IMAGINE JOHN LENNON", h: "🎵 Chanson", lvl: 2 },
  { p: "LA VIE EN ROSE EDITH PIAF", h: "🎵 Chanson", lvl: 2 },
  { p: "BILLIE JEAN MICHAEL JACKSON", h: "🎵 Chanson", lvl: 2 },
  { p: "NE ME QUITTE PAS JACQUES BREL", h: "🎵 Chanson", lvl: 2 },
  { p: "HOTEL CALIFORNIA EAGLES", h: "🎵 Chanson", lvl: 2 },
  { p: "BOHEMIAN RHAPSODY QUEEN", h: "🎵 Chanson", lvl: 2 },
  { p: "NON JE NE REGRETTE RIEN EDITH PIAF", h: "🎵 Chanson", lvl: 2 },
  { p: "LA BOHEME CHARLES AZNAVOUR", h: "🎵 Chanson", lvl: 2 },
  { p: "AUX CHAMPS ELYSEES JOE DASSIN", h: "🎵 Chanson", lvl: 2 },
  { p: "LA TOUR EIFFEL A PARIS", h: "🗿 Monument", lvl: 2 },
  { p: "LE MONT BLANC EN FRANCE", h: "🗿 Monument", lvl: 2 },
  { p: "LE LOUVRE A PARIS", h: "🗿 Monument", lvl: 2 },
  { p: "LA GRANDE MURAILLE DE CHINE", h: "🗿 Monument", lvl: 2 },
  { p: "LES PYRAMIDES D EGYPTE", h: "🗿 Monument", lvl: 2 },
  { p: "LA STATUE DE LA LIBERTE A NEW YORK", h: "🗿 Monument", lvl: 2 },
  { p: "LE COLISEE DE ROME", h: "🗿 Monument", lvl: 2 },
  { p: "LA JOCONDE DE VINCI", h: "🧠 Culture générale", lvl: 2 },
  { p: "LE TOUR DE FRANCE CYCLISTE", h: "⚽ Sport", lvl: 2 },
  { p: "LES JEUX OLYMPIQUES", h: "⚽ Sport", lvl: 2 },
  { p: "LA PRISE DE LA BASTILLE EN 1789", h: "📖 Histoire", lvl: 3 },
  { p: "LA CHUTE DU MUR DE BERLIN", h: "📖 Histoire", lvl: 3 },
  { p: "LE DEBARQUEMENT DE NORMANDIE", h: "📖 Histoire", lvl: 3 },
  { p: "LA REVOLUTION FRANCAISE", h: "📖 Histoire", lvl: 3 },
  { p: "LA DECLARATION DES DROITS DE L HOMME", h: "📖 Histoire", lvl: 3 },
  { p: "LE TRAITE DE VERSAILLES", h: "📖 Histoire", lvl: 3 },
  { p: "LA DECOUVERTE DE L AMERIQUE", h: "📖 Histoire", lvl: 3 },
  { p: "LE COURONNEMENT DE NAPOLEON", h: "📖 Histoire", lvl: 3 },
  { p: "LA SIGNATURE DE L ARMISTICE", h: "📖 Histoire", lvl: 3 },
  { p: "LA CONSTRUCTION DE LA TOUR EIFFEL", h: "📖 Histoire", lvl: 3 },
  { p: "LE PREMIER PAS SUR LA LUNE", h: "🔬 Science", lvl: 3 },
  { p: "LA CHUTE DE L EMPIRE ROMAIN", h: "📖 Histoire", lvl: 3 },
  { p: "LA PESTE NOIRE AU MOYEN AGE", h: "📖 Histoire", lvl: 3 },
  { p: "LA GUERRE DE CENT ANS", h: "📖 Histoire", lvl: 3 },
  { p: "LE SIEGE DE TROIE", h: "📖 Histoire", lvl: 3 },
  { p: "LA BATAILLE DE WATERLOO", h: "📖 Histoire", lvl: 3 },
  { p: "LA CONQUETE SPATIALE", h: "🔬 Science", lvl: 3 },
  { p: "L INVENTION DE L IMPRIMERIE", h: "📖 Histoire", lvl: 3 },
  { p: "LA RENAISSANCE ITALIENNE", h: "📖 Histoire", lvl: 3 },
  { p: "LA CHUTE DE CONSTANTINOPLE EN 1453", h: "📖 Histoire", lvl: 3 },
  { p: "TOMBER DANS LES POMMES", h: "💬 Expression", lvl: 3 },
  { p: "AVOIR LE COEUR SUR LA MAIN", h: "💬 Expression", lvl: 3 },
  { p: "POSER UN LAPIN A QUELQU UN", h: "💬 Expression", lvl: 3 },
  { p: "METTRE LA CHARRUE AVANT LES BOEUFS", h: "💬 Expression", lvl: 3 },
  { p: "AVOIR UN CHAT DANS LA GORGE", h: "💬 Expression", lvl: 3 },
  { p: "DONNER SA LANGUE AU CHAT", h: "💬 Expression", lvl: 3 },
  { p: "COUPER LES CHEVEUX EN QUATRE", h: "💬 Expression", lvl: 3 },
  { p: "TOURNER AUTOUR DU POT", h: "💬 Expression", lvl: 3 },
  { p: "AVOIR LE CAFARD", h: "💬 Expression", lvl: 3 },
  { p: "PASSER UNE NUIT BLANCHE", h: "💬 Expression", lvl: 3 },
  { p: "ETRE DANS LA LUNE", h: "💬 Expression", lvl: 3 },
  { p: "FAIRE LA GRASSE MATINEE", h: "💬 Expression", lvl: 3 },
  { p: "PRENDRE SES JAMBES A SON COU", h: "💬 Expression", lvl: 3 },
  { p: "AVOIR LA CHAIR DE POULE", h: "💬 Expression", lvl: 3 },
  { p: "METTRE LA PUCE A L OREILLE", h: "💬 Expression", lvl: 3 },
  { p: "LES FEUILLES MORTES YVES MONTAND", h: "🎵 Chanson", lvl: 3 },
  { p: "COMME D HABITUDE CLAUDE FRANCOIS", h: "🎵 Chanson", lvl: 3 },
  { p: "LE TEMPS DES CERISES", h: "🎵 Chanson", lvl: 3 },
  { p: "L HYMNE A L AMOUR EDITH PIAF", h: "🎵 Chanson", lvl: 3 },
  { p: "QUE JE T AIME JOHNNY HALLYDAY", h: "🎵 Chanson", lvl: 3 },
  { p: "DESENCHANTEE MYLENE FARMER", h: "🎵 Chanson", lvl: 3 },
  { p: "FORMIDABLE STROMAE", h: "🎵 Chanson", lvl: 3 },
  { p: "LE FLEUVE AMAZONE EN AMERIQUE DU SUD", h: "🌳 Nature", lvl: 3 },
  { p: "LE DESERT DU SAHARA EN AFRIQUE", h: "🌳 Nature", lvl: 3 },
  { p: "LA GRANDE BARRIERE DE CORAIL EN AUSTRALIE", h: "🌳 Nature", lvl: 3 },
  { p: "LE MONT EVEREST EN HIMALAYA", h: "🌳 Nature", lvl: 3 },
  { p: "LA FORET AMAZONIENNE", h: "🌳 Nature", lvl: 3 },
  { p: "LE CERCLE POLAIRE ARCTIQUE", h: "🌳 Nature", lvl: 3 },
  { p: "LA FOSSE DES MARIANNES", h: "🌳 Nature", lvl: 3 },
  { p: "LE SAHARA OCCIDENTAL EN AFRIQUE", h: "🌍 Pays", lvl: 3 },
  { p: "BERGER ALLEMAND", h: "🐶 Animal", lvl: 3 },
  { p: "GOLDEN RETRIEVER", h: "🐶 Animal", lvl: 3 }
];
const WORDS = ["ORDINATEUR","ANNIVERSAIRE","PARAPLUIE","BIBLIOTHEQUE","TELEPHONE","MONTAGNE","AEROPORT","RESTAURANT","FRIGIDAIRE","ASPIRATEUR","CALENDRIER","GYMNASTIQUE","PATISSERIE","DECOUVERTE","CHOCOLATINE"];
const FINALE_AMOUNTS = [5000,8000,10000,15000,20000];

let usedGlobal = { 1: new Set(), 2: new Set(), 3: new Set() };
function pickTwoPhrases(lvl){
  let pool = PHRASES.filter(x=> x.lvl===lvl && !usedGlobal[lvl].has(x.p));
  if(pool.length < 2){
    usedGlobal[lvl] = new Set();
    pool = PHRASES.filter(x=> x.lvl===lvl);
  }
  pool = [...pool];
  const i1 = Math.floor(Math.random()*pool.length);
  const first = pool.splice(i1,1)[0];
  if(pool.length === 0){
    usedGlobal[lvl] = new Set([first.p]);
    pool = PHRASES.filter(x=> x.lvl===lvl && x.p!==first.p);
  }
  const i2 = Math.floor(Math.random()*pool.length);
  const second = pool.splice(i2,1)[0];
  usedGlobal[lvl].add(first.p);
  usedGlobal[lvl].add(second.p);
  return [first, second];
}
function randCode(len, chars){ let c=''; for(let i=0;i<len;i++) c+=chars[Math.floor(Math.random()*chars.length)]; return c; }
function normalize(str){
  return (str||'')
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toUpperCase()
    .replace(/['''`´]/g,' ')
    .replace(/[^A-Z0-9 ]/g,' ')
    .trim()
    .replace(/\s+/g,' ');
}
function shuffledPositions(phrase){
  const positions = [...phrase].map((c,i)=> c!==' ' ? i : null).filter(x=>x!==null);
  for(let i=positions.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [positions[i],positions[j]]=[positions[j],positions[i]]; }
  return positions;
}
function landedSegmentFromRotation(rot){
  const n=SEGS.length, step=360/n; const norm=((360-(rot%360))%360); return SEGS[Math.floor(norm/step)%n];
}
function landedSegmentForRound(rot, round){
  const segs = segsForRound(round||1);
  const n=segs.length, step=360/n; const norm=((360-(rot%360))%360); return segs[Math.floor(norm/step)%n];
}

/* ================= PARTIES EN MÉMOIRE ================= */
const games = {};
const room = (code) => `room_${code}`;

function pub(g){
  const { _buzzTimer, _finaleTimer, ...rest } = g;
  return rest;
}
function broadcast(code){
  const g = games[code]; if(!g) return;
  io.to(room(code)).emit('state', pub(g));
}
function clearTimers(g){
  if(g._buzzTimer) clearInterval(g._buzzTimer);
  if(g._finaleTimer) clearInterval(g._finaleTimer);
  g._buzzTimer = null; g._finaleTimer = null;
}

function beginBuzzPhase(code){
  const g = games[code]; if(!g) return;
  clearTimers(g);
  g.phase='buzz';
  g.revealOrder = shuffledPositions(g.phraseA);
  g.revealedCount = 0;
  g.runningA = false; g.eliminated=[]; g.buzzedBy=null;
  g.buzzReady = false;
  g.buzzRevealAt = Date.now();
  g.buzzRevealMs = 5000;
  g.status = 'La phrase apparaît...';
  broadcast(code);
  setTimeout(()=>{
    const g0 = games[code]; if(!g0 || g0.phase!=='buzz') return;
    g0.buzzReady = true; g0.runningA = true;
    g0.status = 'Les lettres apparaissent...';
    broadcast(code);
    g0._buzzTimer = setInterval(()=>{
      const gg = games[code]; if(!gg || gg.phase!=='buzz' || !gg.runningA) return;
      if(gg.revealedCount < gg.revealOrder.length){ gg.revealedCount++; broadcast(code); }
      else {
        gg.runningA = false;
        const pool = gg.players.filter(p=>!gg.eliminated.includes(p.id));
        const winners = pool.length ? pool : gg.players;
        const winner = winners[Math.floor(Math.random()*winners.length)];
        gg.status = "Personne n'a trouvé à temps. " + (winner?winner.name:'?') + ' prend la main au hasard !';
        broadcast(code);
        clearTimers(gg);
        setTimeout(()=> beginWheelPhase(code, winner.id), 1600);
      }
    }, 1000);
  }, 5000);
}

function beginWheelPhase(code, startPlayerId){
  const g = games[code]; if(!g) return;
  clearTimers(g);
  g.phase='wheel'; g.revealedB=[]; g.usedLetters=[]; g.activePlayerId=startPlayerId;
  g.pots={}; g.players.forEach(p=> g.pots[p.id]=0);
  g.streak=0; g.spin=null; g.pendingLetterMode=null; g.wheelVisible=false; g.lastLetter=null;
  g.wheelReady = false;
  g.wheelRevealAt = Date.now();
  g.wheelRevealMs = 3000;
  g.status = 'La phrase apparaît...';
  broadcast(code);
  setTimeout(()=>{
    const g0 = games[code]; if(!g0 || g0.phase!=='wheel') return;
    g0.wheelReady = true;
    const p = g0.players.find(pl=>pl.id===startPlayerId);
    g0.status = (p?p.name:'?') + ' a la main. Choisis la vitesse de la roue.';
    broadcast(code);
  }, 3000);
}

function endRound(code, winnerId){
  const g = games[code]; if(!g) return;
  if(winnerId){ g.totals[winnerId] = (g.totals[winnerId]||0) + (g.pots[winnerId]||0); }
  g.phase = 'roundend';
  broadcast(code);
}

function startNextRoundOrFinale(code){
  const g = games[code]; if(!g) return;
  if(g.round < 3){
    g.round++;
    const [firstPh, secondPh] = pickTwoPhrases(g.round);
    g.phraseA = firstPh.p; g.hintA = firstPh.h; g.phraseB = secondPh.p; g.hintB = secondPh.h;
    g.phase='ready'; g.readyAt = Date.now();
    broadcast(code);
  } else {
    let bestId=null, bestVal=-1;
    g.players.forEach(p=>{ const v=g.totals[p.id]||0; if(v>bestVal){ bestVal=v; bestId=p.id; } });
    g.finaleWinnerId = bestId;
    g.phase = 'finale-intro';
    broadcast(code);
  }
}

function startFinale(code){
  const g = games[code]; if(!g) return;
  const word = WORDS[Math.floor(Math.random()*WORDS.length)];
  g.finaleWord = word;
  g.finaleAmount = FINALE_AMOUNTS[Math.floor(Math.random()*FINALE_AMOUNTS.length)];
  const letters = [...new Set([...word])];
  const cons = letters.filter(l=>!VOWELS.includes(l));
  const vow = letters.filter(l=>VOWELS.includes(l));
  const autoRevealed = [...cons].sort(()=>Math.random()-0.5).slice(0,3);
  if(vow.length) autoRevealed.push(vow[Math.floor(Math.random()*vow.length)]);
  let revealed = [];
  [...word].forEach((c,i)=>{ if(autoRevealed.includes(c)) revealed.push(i); });
  g.finaleRevealed = revealed;
  g.finaleAutoLetters = autoRevealed;
  g.finalePlayerLetters = [];
  g.finaleRemaining = 15000;
  g.finaleRunning = false;
  g.finaleAnswering = false;
  g.phase = 'finale-pick';
  g.status = "Choisis 3 consonnes et 1 voyelle.";
  broadcast(code);
}

function startFinaleTimer(code){
  const g = games[code]; if(!g) return;
  clearTimers(g);
  g._finaleTimer = setInterval(()=>{
    const gg = games[code]; if(!gg || gg.phase!=='finale' || !gg.finaleRunning) return;
    gg.finaleRemaining -= 200;
    if(gg.finaleRemaining <= 0){
      gg.finaleRemaining = 0; gg.finaleRunning = false;
      const w = gg.players.find(p=>p.id===gg.finaleWinnerId);
      gg.status = "Temps écoulé ! " + (w?w.name:'?') + ' repart avec son total des 3 manches.';
      broadcast(code);
      clearTimers(gg);
      setTimeout(()=> endGame(code), 2500);
    } else broadcast(code);
  }, 200);
}

function endGame(code){
  const g = games[code]; if(!g) return;
  clearTimers(g);
  const winner = g.players.find(p=>p.id===g.finaleWinnerId);
  g.status = winner ? (winner.name + ' termine la partie !') : 'Partie terminée.';
  g.phase = 'ended';
  broadcast(code);
}

function revealSequence(code, matches, k, mode, playerId){
  const g = games[code]; if(!g) return;
  if(k >= matches.length){
    if(mode==='spin' && matches.length>0){ g.pots[playerId] = (g.pots[playerId]||0) + g.currentGain*matches.length; }
    const doneCount = g.phraseB.split('').filter((c,i)=> c!==' ' && !g.revealedB.includes(i)).length;
    if(doneCount===0){
      const p = g.players.find(pl=>pl.id===playerId);
      g.status = (p?p.name:'?') + ' a fini la phrase et remporte sa cagnotte de ' + (g.pots[playerId]||0) + ' € !';
      g.activePlayerId = null;
      broadcast(code);
      setTimeout(()=> endRound(code, playerId), 1800);
      return;
    }
    if(mode==='buy'){ g.status='Voyelle achetée. Choisis la vitesse de la roue ou rachète une voyelle.'; broadcast(code); return; }
    if(matches.length>0){
      g.streak++;
      if(g.streak>=3){ g.status="3 bonnes lettres d'affilée ! Main au joueur suivant."; broadcast(code); setTimeout(()=>passHand(code),1500); }
      else { g.status='Bonne lettre (+'+(g.currentGain*matches.length)+' €). Retourne la roue.'; broadcast(code); }
    } else {
      g.status='Mauvaise lettre. Main au joueur suivant, immédiatement.'; broadcast(code); setTimeout(()=>passHand(code),1500);
    }
    return;
  }
  g.revealedB.push(matches[k]);
  broadcast(code);
  setTimeout(()=> revealSequence(code, matches, k+1, mode, playerId), 500);
}

function passHand(code){
  const g = games[code]; if(!g || g.activePlayerId===null) return;
  const ids = g.players.map(p=>p.id);
  const cur = ids.indexOf(g.activePlayerId);
  const next = ids[(cur+1)%ids.length];
  g.activePlayerId = next; g.streak=0; g.pendingLetterMode=null; g.lastLetter=null;
  const np = g.players.find(p=>p.id===next);
  g.status = (np?np.name:'?') + ' a la main. Choisis la vitesse de la roue.';
  broadcast(code);
}

/* ================= SOCKET.IO ================= */
let lastGameCode = null;

io.on('connection', (socket)=>{

  socket.on('host:create', (cb)=>{
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code; do { code = randCode(6, chars); } while(games[code]);
    const tvCode = randCode(5, chars);
    const [firstPh, secondPh] = pickTwoPhrases(1);
    games[code] = {
      code, tvCode, phase:'lobby', round:1, players:[], totals:{},
      phraseA:firstPh.p, hintA:firstPh.h, revealOrder:[], revealedCount:0, runningA:true, eliminated:[], buzzedBy:null,
      phraseB:secondPh.p, hintB:secondPh.h, revealedB:[], usedLetters:[], activePlayerId:null, pots:{}, streak:0,
      spin:null, wheelVisible:false, lastLetter:null, pendingLetterMode:null, currentGain:0, status:'',
      introAt:null, readyAt:null, buzzRevealAt:null, buzzRevealMs:5000, wheelRevealAt:null, wheelRevealMs:3000,
      retryAt:null, retryMs:5000,
      finaleWinnerId:null, finaleWord:null, finaleRevealed:[], finaleAutoLetters:[], finalePlayerLetters:[],
      finaleAmount:0, finaleRemaining:15000, finaleRunning:false, finaleAnswering:false,
      _buzzTimer:null, _finaleTimer:null
    };
    lastGameCode = code;
    socket.join(room(code));
    socket.data.code = code; socket.data.role = 'host';
    if(cb) cb({ ok:true, code, tvCode });
    broadcast(code);
  });

  socket.on('player:join', ({code, name}, cb)=>{
    code = (code||'').toUpperCase().trim();
    const g = games[code];
    if(!g){ if(cb) cb({ok:false, error:"Aucune partie trouvée."}); return; }
    const playerId = 'p_' + Math.random().toString(36).slice(2,9);
    g.players.push({id:playerId, name: name||'Joueur', ready:false});
    g.totals[playerId] = 0;
    socket.join(room(code));
    socket.data.code = code; socket.data.role='player'; socket.data.playerId = playerId;
    if(cb) cb({ok:true, playerId});
    broadcast(code);
  });

  socket.on('tv:join', ({tvCode}, cb)=>{
    tvCode = (tvCode||'').toUpperCase().trim();
    const entry = Object.values(games).find(g=> g.tvCode===tvCode);
    if(!entry){ if(cb) cb({ok:false, error:"Code télé invalide."}); return; }
    socket.join(room(entry.code));
    socket.data.code = entry.code; socket.data.role='tv';
    if(cb) cb({ok:true});
    broadcast(entry.code);
  });

  socket.on('tv:joinLatest', (cb)=>{
    if(!lastGameCode || !games[lastGameCode]){ if(cb) cb({ok:false, error:"Aucune partie en cours."}); return; }
    socket.join(room(lastGameCode));
    socket.data.code = lastGameCode; socket.data.role='tv';
    if(cb) cb({ok:true});
    broadcast(lastGameCode);
  });

  socket.on('player:ready', ()=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g) return;
    const p = g.players.find(pl=>pl.id===playerId);
    if(p){ p.ready = !p.ready; broadcast(code); }
  });

  socket.on('host:launch', ()=>{
    const {code} = socket.data; const g = games[code]; if(!g) return;
    if(g.players.length===0 || !g.players.every(p=>p.ready)) return;
    g.phase='intro'; g.introAt = Date.now();
    broadcast(code);
  });
  socket.on('host:skipIntro', ()=>{
    const {code} = socket.data; const g = games[code]; if(!g) return;
    g.phase='ready'; g.readyAt = Date.now();
    broadcast(code);
  });
  socket.on('host:introEnded', ()=>{
    const {code} = socket.data; const g = games[code]; if(!g) return;
    if(g.phase!=='intro') return;
    g.phase='ready'; g.readyAt = Date.now();
    broadcast(code);
  });
  socket.on('host:startEnigme', ()=>{
    const {code} = socket.data;
    beginBuzzPhase(code);
  });
  socket.on('host:nextRound', ()=>{
    const {code} = socket.data;
    startNextRoundOrFinale(code);
  });
  socket.on('host:launchFinale', ()=>{
    const {code} = socket.data;
    startFinale(code);
  });

  socket.on('player:buzz', ()=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g) return;
    if(g.buzzedBy || !g.runningA) return;
    g.buzzedBy = playerId; g.runningA = false;
    const p = g.players.find(pl=>pl.id===playerId);
    g.status = (p?p.name:'?') + ' a pris le buzzer !';
    broadcast(code);
  });

  socket.on('player:answer', ({answer})=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g || g.buzzedBy!==playerId) return;
    const p = g.players.find(pl=>pl.id===playerId);
    if(normalize(answer) === normalize(g.phraseA)){
      g.revealedCount = g.revealOrder.length;
      g.status = (p?p.name:'?') + ' PREND LA MAIN !';
      broadcast(code);
      clearTimers(g);
      setTimeout(()=> beginWheelPhase(code, playerId), 1400);
    } else {
      g.eliminated.push(playerId); g.buzzedBy = null;
      g.status = 'Mauvaise réponse pour ' + (p?p.name:'?') + '. Reprise dans 5s...';
      g.retryAt = Date.now(); g.retryMs = 5000;
      broadcast(code);
      setTimeout(()=>{
        const gg = games[code]; if(!gg) return;
        gg.retryAt = null;
        if(gg.eliminated.length >= gg.players.length){
          const pool = gg.players;
          const winner = pool[Math.floor(Math.random()*pool.length)];
          gg.status = "Personne n'a trouvé. " + winner.name + ' prend la main au hasard !';
          broadcast(code);
          setTimeout(()=> beginWheelPhase(code, winner.id), 1600);
          return;
        }
        gg.runningA = true;
        gg.status = "Les lettres continuent d'apparaître...";
        broadcast(code);
      }, 5000);
    }
  });

  socket.on('player:spin', ({turns, dur})=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g || g.activePlayerId!==playerId || !g.wheelReady) return;
    g.wheelVisible = true; g.status = 'La roue arrive...';
    broadcast(code);
    setTimeout(()=>{
      const g1 = games[code]; if(!g1) return;
      const base = g1.spin ? g1.spin.rotation : 0;
      const rotation = base + 360*turns + Math.random()*360;
      g1.spin = {rotation, duration:dur}; g1.status = 'La roue tourne...';
      broadcast(code);
      setTimeout(()=>{
        const g2 = games[code]; if(!g2) return;
        const landed = landedSegmentForRound(g2.spin.rotation, g2.round);
        g2.status = (typeof landed.v==='number') ? ('Roue : '+landed.v+' €') : landed.v;
        broadcast(code);
        setTimeout(()=>{
          const g3 = games[code]; if(!g3) return;
          g3.wheelVisible = false;
          if(landed.v==='BANQUEROUTE'){
            g3.pots[playerId]=0;
            const p = g3.players.find(pl=>pl.id===playerId);
            g3.status = 'Banqueroute ! ' + (p?p.name:'?') + ' perd sa cagnotte. Main au suivant.';
            broadcast(code); setTimeout(()=>passHand(code),1500);
          } else if(landed.v==='PASSE'){
            g3.status = 'Passe ! Main au joueur suivant.';
            broadcast(code); setTimeout(()=>passHand(code),1500);
          } else {
            g3.currentGain = landed.v; g3.status = 'Roue : '+landed.v+' € ! Propose une lettre.'; g3.pendingLetterMode='spin';
            broadcast(code);
          }
        }, 2000);
      }, dur*1000+150);
    }, 2000);
  });

  socket.on('player:buyVowel', ()=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g || g.activePlayerId!==playerId || !g.wheelReady) return;
    if((g.pots[playerId]||0) < 250){ g.status="Pas assez d'argent pour acheter une voyelle."; broadcast(code); return; }
    g.pots[playerId] -= 250; g.pendingLetterMode='buy'; g.status='Choisis la voyelle à acheter.';
    broadcast(code);
  });

  socket.on('player:pickLetter', ({letter})=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g || g.activePlayerId!==playerId || !g.pendingLetterMode) return;
    g.usedLetters.push(letter); g.lastLetter = letter;
    const mode = g.pendingLetterMode; g.pendingLetterMode = null; g.status='Révélation...';
    broadcast(code);
    const matches = [];
    [...g.phraseB].forEach((c,i)=>{ if(c===letter) matches.push(i); });
    revealSequence(code, matches, 0, mode, playerId);
  });

  socket.on('player:giveWord', ({guess})=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g || g.activePlayerId!==playerId) return;
    const p = g.players.find(pl=>pl.id===playerId);
    if(normalize(guess) === normalize(g.phraseB)){
      g.revealedB = g.phraseB.split('').map((_,k)=>k);
      g.status = (p?p.name:'?') + ' a trouvé et remporte sa cagnotte de ' + (g.pots[playerId]||0) + ' € !';
      g.activePlayerId = null;
      broadcast(code);
      setTimeout(()=> endRound(code, playerId), 1800);
    } else {
      g.status = 'Mauvaise réponse ! Main au joueur suivant.';
      broadcast(code);
      setTimeout(()=>passHand(code),1200);
    }
  });

  socket.on('player:finaleLetter', ({letter})=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g || g.finaleWinnerId!==playerId || g.phase!=='finale-pick') return;
    g.finalePlayerLetters = g.finalePlayerLetters || [];
    if(g.finalePlayerLetters.includes(letter) || g.finaleAutoLetters.includes(letter)) return;
    const consChosen = g.finalePlayerLetters.filter(l=>!VOWELS.includes(l)).length;
    const vowChosen = g.finalePlayerLetters.filter(l=>VOWELS.includes(l)).length;
    if(VOWELS.includes(letter) && vowChosen>=1) return;
    if(!VOWELS.includes(letter) && consChosen>=3) return;
    g.finalePlayerLetters.push(letter);
    [...g.finaleWord].forEach((c,i)=>{ if(c===letter && !g.finaleRevealed.includes(i)) g.finaleRevealed.push(i); });
    const cc = g.finalePlayerLetters.filter(l=>!VOWELS.includes(l)).length;
    const vc = g.finalePlayerLetters.filter(l=>VOWELS.includes(l)).length;
    if(cc>=3 && vc>=1){
      g.phase='finale'; g.finaleRunning=true; g.status='Le temps tourne, buzze si tu penses avoir trouvé !';
      startFinaleTimer(code);
    }
    broadcast(code);
  });

  socket.on('player:finaleBuzz', ()=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g || g.finaleWinnerId!==playerId || g.phase!=='finale') return;
    const p = g.players.find(pl=>pl.id===playerId);
    g.finaleRunning=false; g.finaleAnswering=true; g.status = (p?p.name:'?') + ' buzze !';
    broadcast(code);
  });

  socket.on('player:finaleAnswer', ({guess})=>{
    const {code, playerId} = socket.data; const g = games[code]; if(!g || g.finaleWinnerId!==playerId || !g.finaleAnswering) return;
    const p = g.players.find(pl=>pl.id===playerId);
    if(normalize(guess) === normalize(g.finaleWord)){
      g.finaleRevealed = g.finaleWord.split('').map((_,k)=>k);
      g.status = (p?p.name:'?') + ' a trouvé ! Il/elle remporte ' + g.finaleAmount + ' € !';
      g.finaleAnswering=false; g.finaleRunning=false;
      clearTimers(g);
      broadcast(code);
      setTimeout(()=> endGame(code), 2500);
    } else {
      g.status = 'Mauvaise réponse, le temps reprend...';
      g.finaleAnswering=false; g.finaleRunning=true;
      broadcast(code);
    }
  });

  socket.on('disconnect', ()=>{ /* les joueurs restent dans la partie pour permettre la reconnexion */ });
});

server.listen(PORT, ()=> console.log('Serveur La Roue de la Fortune sur le port ' + PORT));
