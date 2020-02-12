/* 
    Toni Henriksson
 */
/*
1 Laske käsin
- 130695-122N: järjestysnumero parillinen=nainen, ikä=24, syntymäpäivä muodollisesti oikein, tarkistusmerkki on oikein
- 130699+1099: järjestysnumero pariton=mies, ikä=120, syntymäpäivä muodollisesti oikein, tarkistusmerkki on oikein
- 130605A245D: järjestysnumero pariton=mies, ikä=14, syntymäpäivä muodollisesti oikein, tarkistusmerkki on oikein
- 130699A1099: järjestysnumero pariton=mies, ikä=ei syntynyt, syntymäpäivä muodollisesti oikein, tarkistusmerkki on oikein
- 130610A122K: järjestysnumero parillinen=nainen, ikä=9, syntymäpäivä muodollisesti oikein, tarkistusmerkki on väärin (oikea = R)
*/

function check() {
    let henkkari = document.getElementById("idcode").value;
    let str = henkkari.toString();
    if (str.length < 11 || str.length > 11) {
        document.getElementById("error").innerHTML = "Id code must have 11 characters.";
        return;
    }
    let henkkari_alku = str.substring(0, 6);
    if (isNaN(henkkari_alku) === true) {
        document.getElementById("error").innerHTML = "Id code must have 6 numbers at first.";
        return;
    }    
    let vuosisatamerkki = str.substring(6,7);
    if (vuosisatamerkki !== "+" && vuosisatamerkki !== "-" && vuosisatamerkki !== "A") {
        document.getElementById("error").innerHTML = "The century mark must be +, - or A.";
        return;        
    }    
    let henkkari_nnn = str.substring(7,10);
    if (isNaN(henkkari_nnn) === true) {
        document.getElementById("error").innerHTML = "Order number must be a number.";
        return;
    }

    let viesti = checkDate(henkkari_alku, vuosisatamerkki);
    if (viesti !== "") {
        document.getElementById("error").innerHTML = viesti;
        return;
    }
    let ikä = calculateAge(henkkari_alku, vuosisatamerkki);
    if (ikä !== "") {
        document.getElementById("age").innerHTML = ikä;

    }
    let sukupuoli = findSex(henkkari_nnn);
    if (sukupuoli !== "") {
        document.getElementById("sex").innerHTML = sukupuoli;
    }
    
    let tarkastusmerkki = str.substring(10,11);
    let tarkastusmerkki_1 = calculateCheckMark(henkkari_alku, henkkari_nnn);
    if (tarkastusmerkki === tarkastusmerkki_1) {
        document.getElementById("result").innerHTML = "Identification code is right.";
    } else {
        document.getElementById("result").innerHTML = "Identification code is not right. Calculated control character is " + tarkastusmerkki_1;
    } 

}
   
/**
 * Checks that te given date is right. Returns an error message or empty string 
 * which means that the date is right
 * 
 * @param {string} value    the date as format ddmmyy
 * @param {string} century  is + - or A    
 * @returns {string} value  an error message or empty string
 */
function checkDate(value, century) {
    let str = value.toString();
    let dd = Number(str.substring(0, 2));
    let mm = Number(str.substring(2, 4));
    let yy = Number(str.substring(4, 6));
    let viesti = "";

    if (dd < 1 || dd >31) {
        viesti = "Day must be 1 ... 31.";
    }
    if (mm < 1 || mm >12) {
        viesti = "Month must be 1 ... 12.";      
    }        
    if (century === "A") {
        syntymävuosi = 2000 + yy;        
        let today = new Date();
        let year = today.getFullYear();
        if (syntymävuosi > year) {
            viesti = "Year is too big.";
        }
    }
    return viesti;    
}

/**
 * Calculates person's age based on a year.
 * 
 * @param {string} value    the date as format ddmmyy
 * @param {string} century  is + - or A    
 * @returns {number}        the calculated age
 * laske ikä jotta palauttaa iän  
 */
function calculateAge(value, century) {
    let str = value.toString();
    let yy = Number(str.substring(4, 6));
    let today = new Date();
    let year = today.getFullYear();
    let ikä = "";
    
    if (century === "+") {
        vuosi = yy + 1800;
        ikä = year - vuosi;
    } else if (century === "-") {
        vuosi = yy + 1900;
        ikä = year - vuosi;
    } else {
        vuosi = yy + 2000;
        ikä = year - vuosi;
    }
    return ikä;
}

/**
 * Finds out the sex of a person
 * @param {string} value    order number in the personal identification code 
 * @returns {string}        female or male 
 */
function findSex(value) {
    let nnn = Number(value);
    let sukupuoli = "";
    
    if (nnn % 2 === 0) {
        sukupuoli = "female";
    } else {
        sukupuoli = "male";
    }
    return sukupuoli;
}

/**
 * Calculates the control character of the personal identification code
 * 
 * @param {string} value1    ddmmyy part of the identification code
 * @param {string} value2  order number part of the identification code  
 * @returns {number}        the calculated control character
 */
function calculateCheckMark(value1, value2) {
    let checkMarks = "0123456789ABCDEFHJKLMNPRSTUVWXY";
    let summa = value1 + value2;
    let jakojäännös = summa % 31;
    let tarkastusmerkki = checkMarks[jakojäännös];    
    return tarkastusmerkki;
}
