const mapImage = new Image();
mapImage.src = "img/tiles.png";

// Load mobile buttons
const leftImage = new Image();
leftImage.src = "img/left.png";
const rightImage = new Image();
rightImage.src = "img/right.png";
const upImage = new Image();
upImage.src = "img/up.png";
const dashImage = new Image();
dashImage.src = "img/dash.png";
const skinImage = new Image();
skinImage.src = "img/skin.png";
const taggedImage = new Image();
taggedImage.src = "img/tagged.png";

// Skins
let skinsNames = ["stonie", "energon", "barbarian", "ninja", "earthy", "bo"]
let skins = []
let skinsTagged = []
let i = 0
skinsNames.forEach(skin => {
    skins.push(new Image())
    skins[i].src = "img/" + skin + ".png";
    skinsTagged.push(new Image())
    skinsTagged[i].src = "img/" + skin + "Tagged.png";
    i ++
})

// Boosts
const invisibilityImage = new Image();
invisibilityImage.src = "img/invisibility.png";

const jumpboostImage = new Image();
jumpboostImage.src = "img/jumpboost.png";

const umbrellaImage = new Image();
umbrellaImage.src = "img/umbrella.png";

const speedboostImage = new Image();
speedboostImage.src = "img/speedboost.png";

const shieldImage = new Image();
shieldImage.src = "img/shield.png";

const portalImage = new Image();
portalImage.src = "img/portal.png";
