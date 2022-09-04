class Util{
    static locationInRect(corner1, size, loc){
        return loc.x >= corner1.x && loc.x <= corner1.x + size.x && loc.y >= corner1.y && loc.y <= corner1.y + size.y;
    }
}