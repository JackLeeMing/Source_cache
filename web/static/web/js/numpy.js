function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum); 
        break; 
        default: 
            return 0; 
        break; 
    } 
};

function getaddnum(list,n){
    var temp = [];
    var result = [];
    for (var i=0;i<list.length;i++){
        if (i == 0){
            temp.push(list[0]);
            continue;
        }
        _num = (temp[i-1]+list[i]);
        temp.push(_num);;
    };

    for (var i= 0;i<temp.length;i++){
        result.push(temp[i]/n)
    }
    return result;

}
