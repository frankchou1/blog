
function dateFormate(value) {
    console.log(value)
    if(value-0==value) return value
    var date = new Date(value);
    var Y = date.getFullYear();
    var M = (date.getMonth()+1)<10?('0'+date.getMonth()):(date.getMonth()+1);
    var D = date.getDate()<10?('0'+date.getDate()):date.getDate();

    return Y+M+D
}

export default {
    dateFormate
}