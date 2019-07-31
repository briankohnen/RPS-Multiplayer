var firebaseConfig = {
    apiKey: "AIzaSyBHDizJfcjb7mmYH__vIWJuo8yJOCdxv1c",
    authDomain: "classproject-7a85e.firebaseapp.com",
    databaseURL: "https://classproject-7a85e.firebaseio.com",
    projectId: "classproject-7a85e",
    storageBucket: "",
    messagingSenderId: "475847005166",
    appId: "1:475847005166:web:72aefa2a4099570b"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// var wins = sessionStorage.getItem("wins");
// var myWinCount = 0;
// var losses = sessionStorage.getItem("losses");
// var myLossCount = 0;

// CURRENTLY;
// Game will break if a user does not reset their player one or player two status before closing the game window ->
// They will stay as that player in the database without the option to reset -> need to go into database and clear it if this happens
// User's wins and losses are not tracked

$(".bigwrap").hide();


if (sessionStorage.getItem("username") == null) {
    initialSignIn();
} else {
    populatePage();
}


function initialSignIn() {

            var storeInitInput = $("<div class='topper'>");
            var dynHeader = $("<h1>Good day!</h1>");
            var dynamicNameInput = $("<input type='text' id='dynUserName' placeholder='Thy Nameth'></input>")
            var dynamicNameButton = $("<button id='dynNameButton'>continueth</button>");
            var formToPressEnt = $("<form>" + dynamicNameInput + dynamicNameButton + "</form>");
            var directionsPara = $("<p>");
                directionsPara.html("What is thy nameth? Prithee typeth it above" + "<br>" + "Thy nameth cannot beest longeth'r than 12 charact'rs");
            formToPressEnt.html(dynamicNameInput).append(dynamicNameButton);
            
            storeInitInput.append(dynHeader, formToPressEnt, directionsPara);

            $("body").append(storeInitInput);

        $(document).on("click", "#dynNameButton", function(event) {
            
            event.preventDefault;

            if ($("#dynUserName").val().trim() !== "" && $("#dynUserName").val().trim().length <= 12) {

                var username = $("#dynUserName").val().trim();

                sessionStorage.setItem("username", username);

                var newUser = {
                    username: username
                };

                database.ref("newUser").set(newUser);
                
            }

            storeInitInput.style.display = "none";
            populatePage();

        });

    } 

function populatePage() {

    $(".bigwrap").show();

    $("#submitInput").on("click", function(event) {

        event.preventDefault();

        if ($("#userInput").val().trim() !== "") {

            var banter = $("#userInput").val().trim();

            var username = sessionStorage.getItem("username");

            var newBanter = {
                user: username,
                text: banter,
                time: firebase.database.ServerValue.TIMESTAMP
            };

            database.ref("messaging").push(newBanter);

            var inputField = document.getElementById("inpForm");
            inputField.reset();
        }
    });


    database.ref("messaging").on("child_added", function(snapshot) {
        
        var snap = snapshot.val();
        var textUser = snap.user;
        var textVal = snap.text;
        var textTime = moment(snap.time).format("LT");

        var newMessage = $("<p>");

        newMessage.text(textUser + " @ " + textTime + " : " + textVal);

        $(".messages").prepend(newMessage);
        
    });
}


database.ref("newUser").on("value", function(snapshot) {

        var snap = snapshot.val();
        var newUser = snap.username;

        var newMessage = $("<p>");

        newMessage.text(newUser + " just joined chat");

        $(".messages").prepend(newMessage);
    });

database.ref().on("value", function(snapshot) {

        var snap = snapshot.val();
        p1Playing = snap.p1Playing;
        p2Playing = snap.p2Playing;
        playerOne = snap.playerOne;
        playerTwo = snap.playerTwo;
        p1Pick = snap.p1pick;
        p2Pick = snap.p2pick;
        
        $("#p1Name").text(playerOne);
        $("#p2Name").text(playerTwo);

        if (!(p1Pick == "" && p2Pick == "")) {
            whoWins(p1Pick, p2Pick, playerOne, playerTwo);
        }

    });

$("#playerOne").on("click", function() {
    if (!(sessionStorage.getItem("myPlayNumber") == "two")) {

        if (p1Playing == false || p1Playing == undefined) {

            database.ref("playerOne").set(sessionStorage.getItem("username"));

            database.ref("p1Playing").set(true);

            sessionStorage.setItem("myPlayNumber", "one");

            var p1reset = $("<button class='p1reset'>Reset</button>");

            $(".p1Info").append(p1reset);

            makePlayButtons(1);
        }

    }
});

$("#playerTwo").on("click", function() {
    if (!(sessionStorage.getItem("myPlayNumber") == "one")) {

        if (p2Playing == false || p2Playing == undefined) {

            database.ref("playerTwo").set(sessionStorage.getItem("username"));

            database.ref("p2Playing").set(true);

            sessionStorage.setItem("myPlayNumber", "two");

            var p2reset = $("<button class='p2reset'>Reset</button>");

            $(".p2Info").append(p2reset);

            makePlayButtons(2);
        }

    }

});

$(document).on("click", ".p1reset", function () {

            database.ref("p1Playing").set(false);
            database.ref("playerOne").set("");
            sessionStorage.removeItem("myPlayNumber");
            $(".p1Info").empty();

        });

$(document).on("click", ".p2reset", function () {

            database.ref("p2Playing").set(false);
            database.ref("playerTwo").set("");
            sessionStorage.removeItem("myPlayNumber");
            $(".p2Info").empty();

        });

$(document).on("click", "#r", function () {

    if (sessionStorage.getItem("myPlayNumber") == "one") {
        database.ref("p1pick").set("cobblestone");
        $("#playbuttons").empty();

    } else if (sessionStorage.getItem("myPlayNumber") == "two") {
        database.ref("p2pick").set("cobblestone");
        $("#playbuttons").empty();

    }

});

$(document).on("click", "#p", function () {

    if (sessionStorage.getItem("myPlayNumber") == "one") {
        database.ref("p1pick").set("parchment");
        $("#playbuttons").empty();

    } else if (sessionStorage.getItem("myPlayNumber") == "two") {
        database.ref("p2pick").set("parchment");
        $("#playbuttons").empty();

    }

});

$(document).on("click", "#s", function () {

    if (sessionStorage.getItem("myPlayNumber") == "one") {
        database.ref("p1pick").set("shears");
        $("#playbuttons").empty();

    } else if (sessionStorage.getItem("myPlayNumber") == "two") {
        database.ref("p2pick").set("shears");
        $("#playbuttons").empty();

    }

});

function whoWins(p1pick, p2pick, p1name, p2name) {
    if (p1pick == "cobblestone" && p2pick == "shears" || p1pick == "parchment" && p2pick == "cobblestone" || p1pick == "shears" && p2pick == "parchment") {

        $(".topP").text(p1name + " just WONNETH. They pick'd " + p1pick.toUpperCase() + " and " + p2name + " pick'd " + p2pick.toUpperCase() + ". Maketh sure to click reset!");
        database.ref("p1pick").set("");
        database.ref("p2pick").set("");

    }else if (p1pick == "shears" && p2pick == "cobblestone" || p1pick == "cobblestone" && p2pick =="parchment" || p1pick == "parchment" && p2pick == "shears") {

        $(".topP").text(p2name + " just WONNETH. They pick'd " + p2pick.toUpperCase() + " and " + p1name + " pick'd " + p1pick.toUpperCase() + ". Maketh sure to click reset!");
        database.ref("p1pick").set("");
        database.ref("p2pick").set("");

    }else if (p1pick == "shears" && p2pick == "shears" || p1pick == "cobblestone" && p2pick =="cobblestone" || p1pick == "parchment" && p2pick == "parchment") {

        $(".topP").text("Thou has't pick'd the same item. Maketh sure to click reset!");
        database.ref("p1pick").set("");
        database.ref("p2pick").set("");
    }
}

function makePlayButtons(playNum) {
    var playButtons = $("<div id='playbuttons'>");
    var rokButton = $("<button id='r'>Cobblestone</button>");
    var papeButton = $("<button id='p'>Parchment</button>");
    var sizButton = $("<button id='s'>Shears</button>");

    playButtons.append(rokButton, papeButton, sizButton);
    $(".p" + playNum + "Info").append(playButtons);
}