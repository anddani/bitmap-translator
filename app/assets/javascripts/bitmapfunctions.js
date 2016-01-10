$(document).ready(function() {

$("#description").text("jQuery works!");

$("#translate").unbind("click").on('click', function(){
    console.log("translate button clicked");
    // Remove newline and take the first 32 characters
    var userString = $("#inputbox").val().replace(/^\s+|\s+$/g, '');
    var inputArray = userString.split('\n');
    for (var i = 0, l = inputArray.length; i < l; i++) {
        console.log(i + ": " + inputArray[i]);
    }
    if (inputArray.length > 1) {
        var minLength = Math.min(inputArray[0].length, inputArray[1].length);
        var tempString = "";
        for (var i = 0; i < minLength; i++) {
            tempString = tempString.concat(inputArray[0].charAt(i));
            tempString = tempString.concat(inputArray[1].charAt(i));
        }
        userString = tempString;
    }
    console.log(userString);
    userString = userString.substring(0,32);
    console.log(userString);
    var validRegex = /^[A-F][A-F0-9]{31,}$|^[0-9][A-F0-9]{15,}$/;

    // If string is in HEX-format and at least 16 characters
    if ( validRegex.test(userString) ){
        console.log("OK STRING");
        $("#error").text("");
        $("#inputbox").val(getBitmap(userString));
    } else {
        console.log("BAD STRING");
        $("#error").text("Not valid string");
    }
});

$("#copy").click(function() {
    console.log("copy button clicked");
    $("#description").text("copy works");

    if ( $("#inputbox").val().length > 0 ) {
        window.prompt("Copy to clipboard: Ctrl-C", $("#inputbox").val());
    }
});

function getBitmap (text) {
    var secondaryBitmap = (hexToBinary(text.charAt(0)).charAt(0) == 1);
    console.log("secondary bitmap: " + secondaryBitmap + " firstchar: " + hexToBinary(text.charAt(0)).charAt(0));

    var binary = hexToBinary(text);
    var returnString = "";

    var numIter = (secondaryBitmap == true) ? 128 : 64;
    numIter = (text.length < secondaryBitmap) ? text.length : numIter;
    console.log("numiter: " + numIter);

    for (var i = 0; i < numIter; i++) {
        if (binary.charAt(i) == "1") {
            returnString = returnString + (i+1) + " ";
        }
    };
    console.log("returnString: " + returnString);
    return returnString.substring(0,returnString.length-1);
}

function hexToBinary(s) {
    var i, k, part, ret = '';
    var lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
        'E': '1110', 'F': '1111'
    };
    for (i = 0; i < s.length; i += 1) {
        ret += lookupTable[s[i]];
    }
    return ret;
}

});
