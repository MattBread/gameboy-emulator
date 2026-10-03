const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

const romInput = document.getElementById("romInput");
const status = document.getElementById("status");

const WIDTH = 160;
const HEIGHT = 144;

const colors = [
    "#0f380f",
    "#306230",
    "#8bac0f",
    "#9bbc0f"
];


// Draw the Game Boy screen
function drawScreen() {

    ctx.fillStyle = colors[3];

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );

    ctx.fillStyle = colors[0];

    ctx.font = "16px monospace";

    ctx.textAlign = "center";

    ctx.fillText(
        "GAME BOY",
        WIDTH / 2,
        55
    );

    ctx.font = "8px monospace";

    ctx.fillText(
        "READY",
        WIDTH / 2,
        75
    );
}


// Start the screen
drawScreen();


// ----------------------------------------
// ROM LOADING
// ----------------------------------------

romInput.addEventListener(
    "change",
    function(event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        status.textContent =
            "Loading: " + file.name;

        const reader = new FileReader();

        reader.onload = function() {

            const rom = new Uint8Array(
                reader.result
            );

            console.log(
                "ROM loaded:",
                file.name
            );

            console.log(
                "ROM size:",
                rom.length,
                "bytes"
            );

            status.textContent =
                "ROM loaded: " +
                file.name;

            inspectROM(rom);
        };

        reader.onerror = function() {

            status.textContent =
                "Unable to read ROM.";
        };

        reader.readAsArrayBuffer(file);
    }
);


// ----------------------------------------
// READ ROM INFORMATION
// ----------------------------------------

function inspectROM(rom) {

    if (rom.length < 0x150) {

        console.log(
            "ROM is too small."
        );

        return;
    }

    const titleBytes =
        rom.slice(0x134, 0x144);

    let title = "";

    for (const byte of titleBytes) {

        if (byte === 0) {
            break;
        }

        title += String.fromCharCode(byte);
    }

    console.log(
        "Game title:",
        title
    );
}


// ----------------------------------------
// KEYBOARD CONTROLS
// ----------------------------------------

const keys = {

    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",

    z: "b",
    x: "a",

    Enter: "start",
    Shift: "select"
};


document.addEventListener(
    "keydown",
    function(event) {

        const key = keys[event.key];

        if (!key) {
            return;
        }

        event.preventDefault();

        console.log(
            "Game Boy button:",
            key
        );
    }
);


// ----------------------------------------
// ON-SCREEN BUTTONS
// ----------------------------------------

document
    .querySelectorAll("[data-key]")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                const key =
                    button.dataset.key;

                console.log(
                    "Game Boy button:",
                    key
                );
            }
        );

    });
