function readVar(name) {
    name = RegExp ('[?&]' + name.replace (/([[\]])/, '\\$1') + '=([^&#]*)');
    return (window.location.href.match (name) || ['', ''])[1];
  }
function readVarQuotes(name){
    name = readVar(name)
    return name.replace(/%22/g,'"')
    
}


function readJson(name){
    name = readVarQuotes(name)
    try{
    return JSON.parse(name)
    } catch{
        return undefined;
    }
}