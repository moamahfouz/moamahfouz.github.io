var coPairs = document.cookie.split(";");
var coPair = [];
var index;

///////////////////// set new cookie///////////////////////
function setCookie(cookieName, cookieValue) {
    var date = new Date();
    date.setMonth(date.getMonth() + 1);

    try {
        if(cookieName==undefined || cookieValue==undefined)
            throw "You Must Pass Name & Value of cookie as parameters";
        document.cookie = "" + cookieName + "=" + cookieValue + ";expires=" + date;
    }catch(e){
        throw e;
    }
}


/////////////////////get cookie value ///////////////////////
function getCookie(cookieName) {
    

    try {
        var cookieValue;
        if (cookieName == undefined)
            throw "You must pass Name of cookie as parameter";

        for (var i = 0; i < coPairs.length; i++) {
            index = coPairs[i].split("=")[0].trim();
            coPair[index] = coPairs[i].split("=")[1];
            //cookieValue=coPair[i];

            if (index == cookieName) {
                cookieValue = coPair[index];
                break;
            } else
                throw cookieName + " cookie not exist";

        }
        return cookieValue;
    } catch (e) {
        throw (e);
    }

}

////////////////// get all stored cookie //////////////////
function allCookieList(){
    for(var i=0; i<coPairs.length; i++){
        index = coPairs[i].split("=")[0].trim();
        coPair[index] = coPairs[i].split("=")[1];
        
    }
    return coPair;
    
}


///////////////////// delete cookie ///////////////////////
function deleteCookie(cookieName){
    try {
        var cookies = allCookieList();
        if(cookieName == undefined)
            throw "You must pass Name of cookie as parameter";
        for (i in cookies) {
            if (cookieName == i) {
                document.cookie = i + "=;expires=1-1-2010";
                break;
            }
            else
                throw cookieName+" cookie not exist";
        }
    } catch(e) {
        throw e;

    }
    
}


////////////////// has cookie or not //////////////////////
function hasCookie(cookieName) {
    var cookies = allCookieList();

    try {
        if (cookieName == undefined)
            throw "You must pass Name of cookie as parameter";

        for (i in cookies) {
            if (i == cookieName) {
                return alert(cookieName + " has cookie");
                break;
            } else {
                return alert(cookieName + " has no cookie");
                break;
            }
        }
    } catch (e) {
        throw e;
    }
}


function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}


