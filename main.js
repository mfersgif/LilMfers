// MENU TOGGLE
const menuToggle = document.getElementById("menuToggle");
const navLinks   = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

/* ========== TRAIT DATA ========== */
const TRAITS = {
  Background: [
    "mustard.png","dark blue.png","glow pink.png","glow teal.png","glow grey.png",
    "glow yellow.png","glow blue.png","glow red.png","glow purple.png","glow lime.png",
    "glow orange.png","blue.png","green.png","pink.png","peach.png"
  ],

  Body: [
    "-","LM shirt black.png","LM shirt blue.png","LM shirt white.png","hoodie black.png",
    "hoodie orange.png","hoodie white.png","hoodie teal.png","baseball jersey.png",
    "tshirt black.png","tshirt white.png","tshirt yellow.png","tshirt red.png",
    "artist.png","florist.png","varsity jacket green.png","varsity jacket red.png",
    "varsity jacket black.png","track jacket white.png","track jacket blue.png",
    "track jacket yellow.png","astronaut suit.png","leader jacket.png","farmer.png",
    "haker.png","sweater.png","magician.png","suit.png","pajama blue.png","pajama pink.png"
  ],

  Costumes: [
    "-","cloak blue.png","cloak black.png","cloak red.png","bear.png","duck.png","shark.png","warplet.png","panda.png"
  ],

  Skin: [
    "-","halloween.png","ape.png","joker.png","plain.png","charcoal.png","brown.png","fair.png"
  ],

  Mouth: [
    "-","solid beard.png","epic beard.png","pipe.png","mustache.png","royale beard.png",
    "mask.png","gas mask.png","regular.png","cigar.png","chin strap beard.png"
  ],

  Eyes: [
    "-","right.png","sleepy.png","orange shades.png","blue shades.png","green shades.png",
    "shades.png","red shades.png","grey shades.png","bored.png","sad.png","surprised.png",
    "eye mask.png","rectangular glasses.png","left.png","up.png","vr.png",
    "round glasses.png","round glasses black.png"
  ],

  Head: [
    "-","bucket hat green.png","bucket hat black.png","bucket hat yellow.png","ski cap black.png",
    "ski cap blue.png","ski cap red.png","cowboy hat.png","baseball cap.png","pirate.png",
    "party hat.png","mushroom.png","cap white.png","cap black.png","cap red.png","cap teal.png",
    "city.png","pigtails.png","beanie green.png","beanie black.png","beanie red.png",
    "beanie blue.png","bunny white.png","bunny black.png","chef hat.png","cone hat.png",
    "cow hat.png","frog.png","tophat.png","whirly hat.png","wizard.png","horn.png",
    "halo.png","crown.png","tetris.png","umbrella hat.png","buzz cut.png","bandana.png",
    "punk.png","beaded dreads.png","pizza.png","flat hat.png","bowler hat.png","captain.png",
    "fox hat.png","short hair brown.png","short hair black.png","long hair.png","bald.png",
    "mohawk.png","multi hats.png","postman.png","headband.png","afro hair.png","straw boater.png",
    "ice cream cart.png","mcdonald.png","steampunk hat.png","jester hat.png","pajama hat blue.png","pajama hat pink.png"
  ],

  Headphones: [
    "-","yellow.png","blue.png","green.png","white.png","red.png"
  ],

  Accessories: [
    "-","alien.png","robot.png","teddybear.png","stove.png","bee.png","dog.png","earrings.png",
    "earring.png","ghost.png","blank.png","tv.png","penguin.png","cactus.png","sheep.png","cat.png"
  ]
};

/* ========== LAYER ORDER (bottom -> top) ========== */
const LAYER_ORDER = [
  "Background",
  "Accessories",
  "Skin",
  "Body",
  "Costumes",
  "Headphones",
  "Head",
  "Eyes",
  "Mouth"
];

/* ========== DOM REFS ========== */
const selects = {
  Background:   document.getElementById("BackgroundSelect"),
  Accessories:  document.getElementById("AccessoriesSelect"),
  Skin:         document.getElementById("SkinSelect"),
  Costumes:     document.getElementById("CostumesSelect"),
  Headphones:   document.getElementById("HeadphonesSelect"),
  Eyes:         document.getElementById("EyesSelect"),
  Head:         document.getElementById("HeadSelect"),
  Mouth:        document.getElementById("MouthSelect"),
  Body:         document.getElementById("BodySelect")
};

const counters = {
  Background:   document.getElementById("count-background"),
  Accessories:  document.getElementById("count-accessories"),
  Skin:         document.getElementById("count-skin"),
  Costumes:     document.getElementById("count-costumes"),
  Headphones:   document.getElementById("count-headphones"),
  Eyes:         document.getElementById("count-eyes"),
  Head:         document.getElementById("count-head"),
  Mouth:        document.getElementById("count-mouth"),
  Body:         document.getElementById("count-body")
};

const canvas        = document.getElementById("previewCanvas");
const ctx           = canvas.getContext("2d");
const randomBtn     = document.getElementById("randomBtn");
const downloadBtn   = document.getElementById("downloadBtn");
const loadIdBtn     = document.getElementById("loadIdBtn");
const tokenIdInput  = document.getElementById("tokenIdInput");

/* ============================================================
   IMAGE CACHE
   ============================================================ */

const layerCache = {};

function loadImageCached(src) {
  return new Promise((resolve) => {
    if (layerCache[src]) {
      resolve(layerCache[src]);
      return;
    }
    const img = new Image();
    img.onload = () => {
      layerCache[src] = img;
      resolve(img);
    };
    img.onerror = (err) => {
      console.warn("failed img:", src, err);
      resolve(null);
    };
    img.src = src;
  });
}

/*
 Preload everything once (except "-").
 After this finishes, randomize + redraw is instant.
*/
async function preloadAllTraitImages() {
  const promises = [];
  for (const layerName of Object.keys(TRAITS)) {
    const files = TRAITS[layerName];
    for (const file of files) {
      if (!file || file === "-") continue;
      const path = `traits/${layerName}/${file}`;
      promises.push(loadImageCached(path));
    }
  }
  await Promise.all(promises);
}

/* ============================================================
   DROPDOWNS INIT
   ============================================================ */

function initDropdowns() {
  Object.keys(selects).forEach(layer => {
    const sel  = selects[layer];
    const list = TRAITS[layer] || [];
    sel.innerHTML = "";

    list.forEach((f, i) => {
      const opt = document.createElement("option");
      opt.value = f;
      opt.textContent = (f === "-")
        ? "-"
        : f.replace(".png","").replace(/_/g," ");
      if (i === 0) opt.selected = true;
      sel.appendChild(opt);
    });

    if (counters[layer]) {
      const realCount = (list[0] === "-") ? list.length - 1 : list.length;
      counters[layer].textContent = realCount;
    }

    if (layer === "Skin") {
      sel.addEventListener("change", () => {
        handleSkinRules();
        requestCompositeDraw();
      });
    } else if (layer === "Costumes") {
      sel.addEventListener("change", () => {
        handleCostumeRules();
        requestCompositeDraw();
      });
    } else {
      sel.addEventListener("change", requestCompositeDraw);
    }
  });
}

/* ============================================================
   RULES / LOCKING
   ============================================================ */

// halloween / joker -> lock eyes + mouth
function handleSkinRules() {
  const val = selects.Skin.value;
  const special = ["halloween.png","joker.png"];
  const locked = special.includes(val);

  if (locked) {
    selects.Eyes.value = "-";
    selects.Mouth.value = "-";
    selects.Eyes.disabled = true;
    selects.Mouth.disabled = true;
  } else {
    selects.Eyes.disabled = false;
    selects.Mouth.disabled = false;
  }
}

// costumes -> lock head + body + headphones
function handleCostumeRules() {
  const val = selects.Costumes.value;
  const wearing = (val && val !== "-");

  if (wearing) {
    selects.Head.value = "-";
    selects.Body.value = "-";
    selects.Headphones.value = "-";

    selects.Head.disabled = true;
    selects.Body.disabled = true;
    selects.Headphones.disabled = true;
  } else {
    selects.Head.disabled = false;
    selects.Body.disabled = false;
    selects.Headphones.disabled = false;
  }
}

/* ============================================================
   DRAW LOGIC
   ============================================================ */

let drawRequested = false;

function requestCompositeDraw() {
  if (drawRequested) return;
  drawRequested = true;

  requestAnimationFrame(async () => {
    drawRequested = false;
    await drawComposite();
  });
}

async function drawComposite() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // list of layer image paths
  const layerPaths = [];
  for (const layer of LAYER_ORDER) {
    const file = selects[layer].value;
    if (!file || file === "-") continue;
    layerPaths.push(`traits/${layer}/${file}`);
  }

  // load all images first
  const imgs = await Promise.all(layerPaths.map(loadImageCached));

  // draw them in order
  imgs.forEach(img => {
    if (!img) return;
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
  });
}

/* ============================================================
   RANDOM HELPERS
   ============================================================ */

function getRandomTrait(list, allowDash) {
  if (!list || !list.length) return "-";
  if (allowDash) {
    return list[Math.floor(Math.random()*list.length)];
  } else {
    if (list.length === 1) return list[0];
    return list[1 + Math.floor(Math.random()*(list.length-1))];
  }
}

function randomize() {
  selects.Costumes.value = "-";
  handleCostumeRules();

  // pick skin (not "-")
  const skinList = TRAITS.Skin;
  selects.Skin.value = getRandomTrait(skinList, false);
  handleSkinRules();

  const special = ["halloween.png","joker.png"];
  const lockedFace = special.includes(selects.Skin.value);

  Object.keys(selects).forEach(layer => {
    if (layer === "Skin" || layer === "Costumes") return;

    const list = TRAITS[layer];
    if (!list || !list.length) return;

    if ((layer === "Eyes" || layer === "Mouth") && lockedFace) {
      selects[layer].value = "-";
      return;
    }

    selects[layer].value = getRandomTrait(list, false);
  });

  handleCostumeRules();
  requestCompositeDraw();
}

/* ============================================================
   DOWNLOAD
   ============================================================ */

function downloadPNG() {
  try {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "lil-mfer.png";
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Download blocked:", err);
  }
}

/* ============================================================
   RESPONSIVE CANVAS SIZE
   ============================================================ */
function resizeCanvas() {
  const maxSide = Math.min(window.innerWidth, window.innerHeight);
  const target  = maxSide * 0.6;
  const clamped = Math.min(target, 700);

  canvas.style.width  = clamped + "px";
  canvas.style.height = clamped + "px";
}

/* ============================================================
   SET SELECT TO LABEL
   ============================================================ */
function setSelectToLabel(selectEl, wantedLabel) {
  if (!selectEl) return;
  const opts = Array.from(selectEl.options);

  // try exact match
  let match = opts.find(o => o.textContent === wantedLabel);
  if (!match) {
    const lower = wantedLabel.toLowerCase();
    match = opts.find(o => o.textContent.toLowerCase() === lower);
  }

  if (match) {
    selectEl.value = match.value;
  } else {
    const dashOpt = opts.find(o => o.textContent === "-");
    if (dashOpt) {
      selectEl.value = dashOpt.value;
    }
  }
}

/* ============================================================
   APPLY TRAITS FROM JSON
   ============================================================ */
function applyTraitsFromJsonData(jsonData) {
  selects.Costumes.value = "-";
  handleCostumeRules();

  const seen = {};

  if (Array.isArray(jsonData.attributes)) {
    jsonData.attributes.forEach(attr => {
      const layerName = attr.trait_type; // ex "Head"
      const valLabel  = attr.value;      // ex "pigtails"
      seen[layerName] = valLabel;
    });
  }

  // sync dropdowns
  Object.keys(selects).forEach(layer => {
    const sel = selects[layer];
    if (!sel) return;

    if (seen[layer]) {
      setSelectToLabel(sel, seen[layer]);
    } else {
      setSelectToLabel(sel, "-");
    }
  });

  handleSkinRules();
  handleCostumeRules();
  requestCompositeDraw();
}

/* ============================================================
   LOAD BY ID
   ============================================================ */
async function loadTokenById(idNumber) {
  if (idNumber < 1 || idNumber > 3333) {
    return;
  }

  const url = `traits/jsons/${idNumber}.json`;

  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) {
      console.error("Metadata fetch failed:", res.status, res.statusText);
      return;
    }
    const data = await res.json();
    applyTraitsFromJsonData(data);
  } catch (err) {
    console.error("Error loading token metadata:", err);
  }
}

/* ============================================================
   INPUT HANDLERS
   ============================================================ */

let idTimer;
function debouncedLoadFromInput() {
  clearTimeout(idTimer);
  idTimer = setTimeout(() => {
    const val = parseInt(tokenIdInput.value, 10);
    if (!Number.isNaN(val)) {
      loadTokenById(val);
    }
  }, 300);
}

/* ============================================================
   INIT ON LOAD
   ============================================================ */
window.addEventListener("load", async () => {
  initDropdowns();

  // Preload all layer PNGs once
  await preloadAllTraitImages();

  // default view: random combo
  randomize();
  resizeCanvas();

  randomBtn.addEventListener("click", () => {
    randomize();
    resizeCanvas();
  });

  downloadBtn.addEventListener("click", downloadPNG);

  loadIdBtn.addEventListener("click", () => {
    const val = parseInt(tokenIdInput.value, 10);
    if (!Number.isNaN(val)) {
      loadTokenById(val);
    }
  });

  tokenIdInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = parseInt(tokenIdInput.value, 10);
      if (!Number.isNaN(val)) {
        loadTokenById(val);
      }
    }
  });

  // live preview on typing
  // tokenIdInput.addEventListener("input", debouncedLoadFromInput);

  window.addEventListener("resize", resizeCanvas);
});
