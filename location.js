class Location{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    diff(other){
        return new Location(this.x - other.x, this.y - other.y);
    }
    distance(other){
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
    add(x,y){
        if(x instanceof Location){
            return new Location(this.x + x.x, this.y + x.y);
        }
        return new Location(this.x + x, this.y + y);
    }
}
