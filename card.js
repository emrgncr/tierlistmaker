
class Card{
    static padding = 2;
    constructor(location,size,image){
        this.location = location;
        this.image = image;
        this.size = size;
        this.beingClicked = false;
        this.clickLocDiff = new Location(0,0);
        this.prevLocation = location;
        this.tier = null;
    }
    drawFromCenter(context){
        context.drawImage(this.image, this.location.x - this.size.x/2, this.location.y - this.size.y/2, this.size.x, this.size.y);
        context.strokeStyle = "black";
        context.strokeRect(this.location.x, this.location.y, this.size.x, this.size.y);
    }
    drawFromCorner(context){
        context.drawImage(this.image, this.location.x, this.location.y, this.size.x, this.size.y);
        context.strokeStyle = "black";
        context.strokeRect(this.location.x, this.location.y, this.size.x, this.size.y);
    }
    get center(){
        return new Location(this.location.x + this.size.x/2, this.location.y + this.size.y/2);
    }
}
