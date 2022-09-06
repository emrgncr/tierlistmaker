const canvas = document.getElementById('main');
const spawnButton = document.getElementById('btn');
const tierNameInput = document.getElementById('tierInput');
const tierColorInput = document.getElementById('tierColorInput');
const tierAddButton = document.getElementById('addTier');
const dropDiv = document.getElementById('dropper');
var maxsize = new Location(Tier.rowHeight - 7, Tier.rowHeight - 7);

var ghostcard = new Card(new Location(0,0), new Location(0,0), new Image());

const wpadding = 20;
const tiersPresetup = readJson("tiers")

var cards = [];
var tiers = []
if(tiersPresetup != undefined && tiersPresetup instanceof Array){
    //setup tiers by predefined setup
    for(let i = 0; i<tiersPresetup.length; i++){
        let stp = tiersPresetup[i];
        try{
         if(stp.n != "holdout")
            tiers.push(new Tier(stp.n, "#"+stp.c))   
        }catch{
            alert("Girdiğiniz veride hatalar var!")
        }
    }

    tiers.push(new Tier('holdout','darkgray'))
}else{
    var tiers = [new Tier('s','yellow'), new Tier('a','lime'), new Tier('b','green'), new Tier('c','orange'),
    new Tier('holdout','darkgray')];
}




var holdoutTier = tiers[tiers.length - 1];
var draggingCard = null;

// canvas.style.backgroundColor = 'black';

function getMousePosition(e) {
    var rect = canvas.getBoundingClientRect();
    return new Location(e.clientX - rect.left, e.clientY - rect.top);
}

function calculateHeight(){
    let height = 20;
    const tierWidth = canvas.width - wpadding - wpadding;
    for(let i = 0; i < tiers.length; i++){
        height += tiers[i].height(tierWidth);
        // console.log(tiers[i].height(tierWidth))
    }
    return height;
}

function getTierLocation(j){
    const w = canvas.width;
    const tierWidth = w - wpadding - wpadding;
    let untilheight = 10;
    for(let i = 0; i < tiers.length; i++){
        let height = tiers[i].height(tierWidth);
        if(j == i){
                return new Location(wpadding,untilheight);
        }
        untilheight += height;
    }
}

function mouseOnTier(evt){
    const mouse = getMousePosition(evt);
    const w = canvas.width;
    const tierWidth = w - wpadding - wpadding;
    for(let i = 0; i < tiers.length; i++){
        let loc = getTierLocation(i);
        if(Util.locationInRect(loc, new Location(tierWidth,tiers[i].height(tierWidth)),mouse)){
            return i;
        }
    }
    return -1;
}

function getTierButtonLocation(j){
    const w = canvas.width;
    const tierWidth = w - wpadding - wpadding;
    let untilheight = 10;
    for(let i = 0; i < tiers.length; i++){
        let height = tiers[i].height(tierWidth);
        if(j == i){
            return {
                loc: new Location( wpadding + tierWidth - Tier.buttonSize - 2,untilheight + 2),
                size: new Location(Tier.buttonSize, Tier.buttonSize)
            }
        }
        untilheight += height;
    }
}
function destroyTier(i){
    let tier = tiers[i];
    let holdout = holdoutTier;
    //move cards
    for(let j = 0; j<tier.cards.length; j++){
        holdout.cards.push(tier.cards[j]);
        tier.cards[j].tier = holdout;
        //TODO move cards
    }
    //remove tier
    tiers.splice(i, 1);
    canvasSetup();
}

/**
 * Assumes canvas is already cleared
 */
function setupTiers(){
    const w = canvas.width;
    const ctx = canvas.getContext('2d');;
    const tierWidth = w - wpadding - wpadding;
    let untilheight = 10;
    for(let i = 0; i < tiers.length; i++){
        let height = tiers[i].height(tierWidth);
        st = ctx.fillStyle;
        ctx.fillStyle = tiers[i].color;
        ctx.fillRect(wpadding, untilheight, tierWidth, height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(wpadding, untilheight, tierWidth, height);
        if(tiers[i].name != 'holdout'){
        let {loc, size} = getTierButtonLocation(i);
        ctx.fillStyle = "red";
        ctx.fillRect(loc.x, loc.y, size.x, size.y);
        ctx.strokeRect(loc.x, loc.y, size.x, size.y);
        ctx.fillStyle = "white";
        ctx.font = `${size.x - 4}px Arial`;
        ctx.fillText("X", loc.x + size.x/2 - 8, loc.y + size.y/2 + 8);
        ctx.font = "40px Arial bold";
        ctx.fillText(tiers[i].name.toUpperCase(),wpadding + 6, (untilheight + 40) - 20 + (Tier.rowHeight/2));
        ctx.strokeText(tiers[i].name.toUpperCase(),wpadding + 6, (untilheight + 40) - 20 + (Tier.rowHeight/2));
        }
        ctx.fillStyle = st;
        untilheight += height;
    }
}

function canvasSetup() {
    canvas.width = window.innerWidth * .98;
    // canvas.height = window.innerHeight * .98 * .9;
    canvas.height = calculateHeight();
    const w = canvas.width;
    const h = canvas.height;
    // maxsize = new Location(h/7 - 14, h/7 - 14);
    // cards.forEach(card => {
    //     let ratio = card.image.width / card.image.height;
    //     let size;
    //     if(ratio > 1){
    //         size = new Location(maxsize.x, maxsize.x / ratio);
    //     }else {
    //         size = new Location(maxsize.y * ratio, maxsize.y);
    //     }
    //     card.size = size;
    // });
    canvasUpdateFromClear();
}

function canvasUpdateFromClear(ignoring=[]){
    const w = canvas.width;
    const h = canvas.height;
    const tierWidth = w - wpadding - wpadding;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    setupTiers();
    for(let i = 0; i < tiers.length; i++){
        tiers[i].placeCards(tierWidth,getTierLocation(i));
    }
    cards.forEach(card => {
        if(!ignoring.includes(card)){
        card.drawFromCorner(ctx);
        }
    })
}

function cardsUpdate(mouseX, mouseY, click, relase){

}


window.onresize = () => {
    canvasSetup();
}
document.onresize = () => {
    canvasSetup();
}
canvasSetup();

function spawnCard(image){
    const w = canvas.width;
    const h = canvas.height;
    const tierWidth = w - wpadding - wpadding;
    let ratio = image.width / image.height;
    let size;
    if(ratio > 1){
        size = new Location(maxsize.x, maxsize.x / ratio);
    }else {
        size = new Location(maxsize.y * ratio, maxsize.y);
    }
    const card = new Card(new Location(0,0), size, image);
    card.tier = holdoutTier;
    cards.push(card);
    holdoutTier.cards.push(card);
    holdoutTier.placeCards(tierWidth,getTierLocation(tiers.length - 1));
    canvasSetup();
}

function spawnByFiles(files){
    if(files.length > 0){
        let l = files.length;
        let i = 0;
        let reader = new FileReader();
        const readerfn = (e) =>  {
            img = new Image();
            img.src = e.target.result;
            img.onload = () => {
            spawnCard(img);
            }
            if(i < l - 1){
                i ++;
                reader = new FileReader();
                reader.onload = readerfn;
                reader.readAsDataURL(files[i]);
            }
        }
        reader.onload = readerfn;
        reader.readAsDataURL(files[i]);
}
}


spawnButton.onclick = () => {
    let files = document.getElementById('file').files;
    spawnByFiles(files);
}

document.body.ondrop = (e) => {
    e.preventDefault();
    spawnByFiles(e.dataTransfer.files);
}
document.body.ondragover = (e) => {
    e.preventDefault();
}


tierAddButton.onclick = ()=> {
    let name = tierNameInput.value;
    let color = tierColorInput.value;
    let tier = new Tier(name, color);
    //insert tier to -1
    tiers.splice(tiers.length - 1, 0, tier);
    canvasSetup();
}

canvas.onmousedown = (evt) => {
    var mousePos = getMousePosition(evt);
    if(draggingCard != null){
        draggingCard.beingClicked = false;
        draggingCard = null;
    }
    for(let i = cards.length - 1; i >= 0; i--){
        let card = cards[i];
        if(Util.locationInRect(card.location, card.size, mousePos)){
            card.beingClicked = true;
            card.clickLocDiff = mousePos.diff(card.location);
            draggingCard = card;
            card.prevLocation = card.location;
            card.tier.removeCard(card);
            return;
        }
    }
    for(let i = 0; i < tiers.length; i++){
        let {loc, size} = getTierButtonLocation(i);
        if(Util.locationInRect(loc, size, mousePos)){
            destroyTier(i);
            return;
        }
    }
}

canvas.onmouseup = (evt) => {
    var mousePos = getMousePosition(evt);
    let tierind = mouseOnTier(evt)
    let tierWidth = canvas.width - wpadding - wpadding;
    let flag = false;
    for(let q = 0; q < tiers.length; q++){
        let ind = tiers[q].cards.indexOf(ghostcard)
        while(ind > -1){
            tiers[q].cards.splice(ind, 1);
            ind = tiers[q].cards.indexOf(ghostcard)
        }
    }
    if(draggingCard != null){
        draggingCard.beingClicked = false;

        if(tierind != -1){
            let onTier = tiers[tierind];
        if(onTier != null){
            let tierloc = getTierLocation(tierind)
            let tindex = onTier.getLocationIndex(tierWidth, mousePos.diff(tierloc));
            // console.log('tindex', tindex, 'len', onTier.cards.length);
            if(tindex == -1 || tindex == onTier.cards.length)
                onTier.cards.push(draggingCard);
            else
                onTier.cards.splice(tindex, 0, draggingCard);
            flag = true;
            draggingCard.tier = onTier;
        }
        }
        if(!flag){
        draggingCard.tier.cards.push(draggingCard);
        }
        canvasSetup();
        draggingCard = null;
        
    }
    //TODO snap mechanism
}

canvas.onmousemove = (evt) => {
    const tierWidth = canvas.width - wpadding - wpadding;
    var mousePos = getMousePosition(evt);
    let flag = false;
    let tierind = mouseOnTier(evt)
    // console.log(tierind);
    for(let i = 0; i< tiers.length; i++){
        if(i != tierind){
        tiers[i].removeCard(ghostcard);
        }
    }
    
    if(draggingCard != null){
        draggingCard.location = mousePos.diff(draggingCard.clickLocDiff);

        if(tierind != -1){
            let onTier = tiers[tierind];
        if(onTier != null){
            let tierloc = getTierLocation(tierind)
            let tindex = onTier.getLocationIndex(tierWidth, mousePos.diff(tierloc));
            // console.log(tindex)
            ghostcard.size = draggingCard.size;
            let gi = onTier.cards.indexOf(ghostcard);
            if(gi == -1){
                onTier.cards.splice(tindex, 0, ghostcard);
            }else{
                if(gi != tindex){
                    onTier.removeCard(ghostcard);
                    onTier.cards.splice(tindex, 0, ghostcard);
                }
            }
        }
        }
        flag = true;
    }
    if(!flag){
    for(let i = cards.length - 1; i >= 0; i--){
        let card = cards[i];
        if(Util.locationInRect(card.location, card.size, mousePos)){
            flag = true;
            break;
        }
    }
    }
    if(!flag){
        for(let i = 0; i < tiers.length; i++){
            let {loc, size} = getTierButtonLocation(i);
            if(Util.locationInRect(loc, size, mousePos)){
                flag = true;
                break;
            }
        }
    }
    if(flag){
        canvas.style.cursor='pointer';
    }else {
        canvas.style.cursor='default';
    }
    canvasSetup();
}



const urlImages = readJson("imgs")
console.log(urlImages)
if(urlImages != null && urlImages instanceof Array){
    for (let i = 0; i < urlImages.length; i++) {
        let e = urlImages[i];
        console.log(e)
        let img = new Image();
        img.src = e;
        img.onload = () => {
        spawnCard(img)
        }
    }
}