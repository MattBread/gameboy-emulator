// ==========================================
// GAME BOY EMULATOR CONTROLLER
// ==========================================

class GameBoy {

    constructor() {

        // Create memory
        this.memory =
            new GameBoyMemory();


        // Create CPU
        this.cpu =
            new GameBoyCPU(
                this.memory
            );


        // Emulator state
        this.running = false;

        this.paused = false;

        this.frameCount = 0;

        this.totalCycles = 0;
    }


    // ======================================
    // LOAD CARTRIDGE
    // ======================================

    loadROM(romData) {

        this.memory.loadROM(
            romData
        );


        // Reset CPU
        this.cpu =
            new GameBoyCPU(
                this.memory
            );


        console.log(
            "Game Boy cartridge ready."
        );
    }


    // ======================================
    // START EMULATOR
    // ======================================

    start() {

        if (this.running) {
            return;
        }


        this.running = true;

        this.paused = false;


        console.log(
            "Game Boy started."
        );


        this.runFrame();
    }


    // ======================================
    // STOP EMULATOR
    // ======================================

    stop() {

        this.running = false;


        console.log(
            "Game Boy stopped."
        );
    }


    // ======================================
    // PAUSE
    // ======================================

    pause() {

        this.paused = true;


        console.log(
            "Game Boy paused."
        );
    }


    // ======================================
    // RESUME
    // ======================================

    resume() {

        if (!this.running) {
            return;
        }


        this.paused = false;


        this.runFrame();
    }


    // ======================================
    // RUN ONE FRAME
    // ======================================

    runFrame() {

        if (
            !this.running ||
            this.paused
        ) {

            return;
        }


        // A Game Boy runs at approximately
        // 4.19 million CPU cycles per second.
        //
        // At approximately 60 frames per
        // second, that is about 70,224 cycles
        // per frame.

        const cyclesPerFrame =
            70224;


        let cycles =
            0;


        while (
            cycles <
            cyclesPerFrame
        ) {

            cycles +=
                this.cpu.step();
        }


        this.totalCycles +=
            cycles;


        this.frameCount++;


        // Schedule next frame
        requestAnimationFrame(
            () => this.runFrame()
        );
    }
}


// ==========================================
// CREATE GLOBAL EMULATOR
// ==========================================

let gameBoy = null;


function createGameBoy() {

    gameBoy =
        new GameBoy();


    console.log(
        "Game Boy emulator created."
    );


    return gameBoy;
}
