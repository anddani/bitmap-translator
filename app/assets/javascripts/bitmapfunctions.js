$(document).ready(function() {

$("#description").text("jQuery works!");

// The clear button empties the inputbox and removes the error
// message
$(".clear").click(function(){
    var type = $(this).attr("id").split("-")[1];
    console.log(type);
    $("#inputbox-" + type).val("");
    $("#error-" + type).text("");
});

// When the translate button is clicked, the inputbox
// will change its value to the sequence of bits
$("#translate").unbind("click").on('click', function() {
    console.log("translate button clicked");

    // Remove newline and take the first 32 characters
    var userString = $("#inputbox-translate").val().replace(/^\s+|\s+$/g, '');
    var inputArray = userString.split('\n');

    // Build string from two lines if there were
    // two lines in the inputbox
    if (inputArray.length > 1) {
        userString = flattenStringArray(inputArray);
    }

    // The longest format of the string is 32 characters
    userString = userString.substring(0,32);

    // Regular expression for cheching whether the string is valid
    // for secondary bitmap or not.
    var validRegex = /^[8-9A-F][A-F0-9]{31,}$|^[0-7][A-F0-9]{15,}$/;
    console.log("size: " + userString.length);

    // If string is in HEX-format and at least 16 characters
    if ( validRegex.test(userString) ){
        console.log("VALID STRING");
        $("#error-translate").text("");
        $("#inputbox-translate").val(getBitmap(userString));
    } else {
        console.log("BAD STRING");
        $("#error-translate").text("Not valid string");
    }
});

// Functionality for hex conversion
$("#convert").unbind("click").on('click', function() {
    console.log("Convert clicked");
    
    var userString = $("#inputbox-convert").val().replace(/^\s+|\s+$/g, '');
    var inputArray = userString.split('\n');
    var retString = "";

    // hex -> dec
    if (inputArray.length > 1) {
        userString = flattenStringArray(inputArray);
        userString = userString.substring(0, userString.search(/[cCdD]/) + 1);
        var positive = /^[0-9]+[cC]$/;
        var negative = /^[0-9]+[dD]$/;
        if (positive.test(userString)) {
            console.log("POSITIVE STRING");

            userString = userString.slice(0, -1);

            $("#error-convert").text("");
            $("#inputbox-convert").val(userString.replace(/^0+/,''));
        } else if (negative.test(userString)) {
            console.log("NEGATIVE STRING");

            userString = userString.slice(0, -1);

            $("#error-convert").text("");
            $("#inputbox-convert").val("-".concat(userString.replace(/^0+/,'')));
        } else {
            console.log("BAD STRING");
            $("#error-convert").text("Not valid string");
        }
    } else {
    // dec -> hex
        console.log("bla");

        var sign = "";
        var positive = /^\+?[0-9]+$/;
        var negative = /^-[0-9]+$/;
        var valid
        if (positive.test(userString)) {
            console.log("POSITIVE STRING");
            if (userString.charAt(0) == '+') {
                userString = userString.substring(1);
            }
            sign = 'C';

        } else if (negative.test(userString)) {
            console.log("NEGATIVE STRING");
            userString = userString.substring(1);
            sign = 'D';
        }

        // If invalid number
        if (sign == "") {
            console.log("BAD STRING");
            $("#error-convert").text("Not valid string");
        } else {
            var len = userString.length;
            if (len % 2 == 0) {
                userString = "0".concat(userString);
            }

            for (var i = 0; i < 2; i++) {
                for (var j = i; j < userString.length; j+=2) {
                    retString = retString.concat(userString.charAt(j));
                }
                if (i == 0) {
                    retString = retString.concat("\n");
                }
            }
        }
        retString = retString.concat(sign);
        $("#error-convert").text("");
        $("#inputbox-convert").val(retString);
    }
    
});

// Button for copying the contents of the input box to the clipboard
$(".copy").click(function() {
    var type = $(this).attr("id").split("-")[1];
    console.log("copy button clicked");
    $("#description-" + type).text("copy works");

    if ( $("#inputbox-" + type).val().length > 0 ) {
        window.prompt("Copy to clipboard: Ctrl-C", $("#inputbox-" + type).val());
    }
});

// Converts HEX string and returns the bit sequence
function getBitmap (text) {
    var secondaryBitmap = (hexToBinary(text.charAt(0)).charAt(0) == 1);
    console.log("secondary bitmap: " + secondaryBitmap + " firstchar: " + hexToBinary(text.charAt(0)).charAt(0));

    var binary = hexToBinary(text);
    var returnString = "";

    var numIter = (secondaryBitmap == true) ? 128 : 64;
    numIter = (text.length < secondaryBitmap) ? text.length : numIter;
    console.log("numiter: " + numIter);
    $("#debug-translate").text(text.substring(0,numIter/4));

    for (var i = 0; i < numIter; i++) {
        if (binary.charAt(i) == "1") {
            returnString = returnString + (i+1) + " ";
        }
    };
    console.log("returnString: " + returnString);
    return returnString.substring(0,returnString.length-1);
}

function flattenStringArray(inputArray) {
    for (var i = 0, l = inputArray.length; i < l; i++) {
        inputArray[i] = inputArray[i].substring(0,16);
    }
    var minLength = Math.min(inputArray[0].length, inputArray[1].length);
    var retString = "";
    for (var i = 0; i < minLength; i++) {
        retString = retString.concat(inputArray[0].charAt(i));
        retString = retString.concat(inputArray[1].charAt(i));
    }
    return retString;
}

// A hexadecimal character as input, returns the corresponding
// bit value as string
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

