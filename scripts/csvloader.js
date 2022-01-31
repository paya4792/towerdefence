var UNIT_LIST = [];

function convertCSVtoArray(str){
    var tmp = str.split("\n");
 
    for(var i=0;i<tmp.length;++i){
        UNIT_LIST[i] = tmp[i].split(',');
    }
}