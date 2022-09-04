class Tier{
    static rowHeight = 150;
    static buttonSize = 30;
    static startFrom = 60;
    constructor(name,color){
        this.name = name;
        this.cards = [];
        this.color = color;
    }
    rowCount(canvasWidth){
        let w = canvasWidth - Tier.startFrom;
        let count = 1;
        for(let i = 0; i < this.cards.length; i++){
            if(w - this.cards[i].size.x < 0){
                count++;
                w = canvasWidth;
            }
            w -= this.cards[i].size.x + 2*Card.padding;
        }
        return count;
    }
    height(canvasWidth){
        return this.rowCount(canvasWidth) * Tier.rowHeight;
    }
    getSpawnLocation(canvasWidth, cardSize){
        let w = canvasWidth - Tier.startFrom;
        let count = 0;
        for(let i = 0; i < this.cards.length; i++){
            w -= this.cards[i].size.x + 2*Card.padding;
            if(w < 0){
                count++;
                w = canvasWidth - (this.cards[i].size.x + 2*Card.padding);
            }
        }
        if(w - (cardSize.x + 2*Card.padding) < 0){
            return new Location(0, (Tier.rowHeight * (count + 1)) + 3.5 );
        }else{
            return new Location(canvasWidth - w, (Tier.rowHeight * count) + 3.4);
        }
    }
    placeCards(canvasWidth, tierLocation){
        let w = canvasWidth - Tier.startFrom;
        let count = 0;
        for(let i = 0; i < this.cards.length; i++){
            let card = this.cards[i];
            let hadjust = (card.size.y - Tier.rowHeight) / 2
            if(w - card.size.x < 0){
                count++;
                let lc = (new Location(0, (Tier.rowHeight * (count)) - hadjust))
                this.cards[i].location = lc.add(tierLocation);
                w = canvasWidth;
            }else { 
                let lc = (new Location(canvasWidth - w, (Tier.rowHeight * count) - hadjust))
                this.cards[i].location = lc.add(tierLocation);
            }
            w -= this.cards[i].size.x + 2*Card.padding;
        }
    }
    removeCard(card){
        let index = this.cards.indexOf(card);
        if(index > -1){
            this.cards.splice(index, 1);
        }
    }
    getLocationIndex(canvasWidth, loc){
        let w2 = Tier.startFrom;
        let count2 = 0;
        let wh = loc.y;
        while(wh > Tier.rowHeight){
            wh -= Tier.rowHeight;
            count2++;
        }
        let w = canvasWidth - Tier.startFrom;
        let count = 0;
        for(let i = 0; i < this.cards.length; i++){
            let card = this.cards[i];
            let hadjust = (card.size.y - Tier.rowHeight) / 2
            if(w - card.size.x < 0){
                count++;
                let lc = (new Location(0, (Tier.rowHeight * count + 1) - hadjust))
                w = canvasWidth;
                if(count2 == count){
                        if(loc.x > lc.x && loc.x < lc.x + cards[i].size.x + 2*Card.padding){
                            return i;
                        }else{
                            if(i == this.cards.length - 1){
                                return this.cards.length;
                            }
                        }
                    
                }
            }else { 
                let lc = (new Location(canvasWidth - w, (Tier.rowHeight * count) - hadjust))
                if(count2 == count){
                        if(loc.x > lc.x && loc.x < lc.x + cards[i].size.x + 2*Card.padding){
                            return i;
                        }else{
                            if(i == this.cards.length - 1){
                                return this.cards.length;
                            }
                        }
                }
            }
            w -= this.cards[i].size.x + 2*Card.padding;
        }
        return this.cards.length;
    }
}