// ==========================================
// GAME BOY PPU - GRAPHICS ENGINE
// ==========================================

class GameBoyPPU {

    constructor(memory) {

        this.memory = memory;

        // Game Boy screen resolution
        this.width = 160;
        this.height = 144;

        // Frame buffer
        this.frameBuffer =
            new Uint8Array(
                this.width * this.height
            );

        // PPU state
        this.scanline = 0;
        this.mode = 2;

        // Palette
        this.palette = [
            0,
            1,
            2,
            3
        ];
    }


    // ======================================
    // RESET
    // ======================================

    reset() {

        this.scanline = 0;

        this.mode = 2;

        this.frameBuffer.fill(0);
    }


    // ======================================
    // UPDATE PPU
    // ======================================

    step(cycles) {

        // Advance through the current
        // scanline.

        for (
            let i = 0;
            i < cycles;
            i++
        ) {

            this.updateCycle();
        }
    }


    // ======================================
    // PPU CYCLE
    // ======================================

    updateCycle() {

        // Simplified Game Boy timing.

        if (this.mode === 2) {

            this.mode = 3;

        }

        else if (this.mode === 3) {

            this.renderScanline();

            this.mode = 0;

        }

        else if (this.mode === 0) {

            this.scanline++;

            if (this.scanline >= 144) {

                this.mode = 1;

            }
            else {

                this.mode = 2;
            }

        }

        else if (this.mode === 1) {

            this.scanline++;

            if (this.scanline >= 154) {

                this.scanline = 0;

                this.mode = 2;
            }
        }
    }


    // ======================================
    // RENDER SCANLINE
    // ======================================

    renderScanline() {

        if (
            this.scanline < 0 ||
            this.scanline >= this.height
        ) {

            return;
        }


        const y =
            this.scanline;


        for (
            let x = 0;
            x < this.width;
            x++
        ) {

            const index =
                y * this.width + x;


            // Temporary background.
            //
            // This gives us a visible
            // graphics buffer while we
            // build the full tile system.

            const pattern =
                (
                    x +
                    y
                ) % 4;


            this.frameBuffer[index] =
                pattern;
        }
    }


    // ======================================
    // GET FRAME BUFFER
    // ======================================

    getFrameBuffer() {

        return this.frameBuffer;
    }
}
