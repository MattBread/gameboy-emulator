// ==========================================
// GAME BOY MEMORY SYSTEM
// ==========================================

class GameBoyMemory {

    constructor() {

        // 64 KB address space
        this.memory = new Uint8Array(0x10000);

        // Game cartridge ROM
        this.rom = null;

        // Working RAM
        this.wram = new Uint8Array(0x2000);

        // Video RAM
        this.vram = new Uint8Array(0x2000);

        // High RAM
        this.hram = new Uint8Array(0x7F);

        // Joypad register
        this.joypad = 0xFF;

        // Interrupt Enable register
        this.interruptEnable = 0;

        // Interrupt Flags
        this.interruptFlags = 0;
    }


    // ======================================
    // LOAD ROM
    // ======================================

    loadROM(romData) {

        this.rom =
            new Uint8Array(romData);

        console.log(
            "ROM loaded:",
            this.rom.length,
            "bytes"
        );
    }


    // ======================================
    // READ BYTE
    // ======================================

    read8(address) {

        address &=
            0xFFFF;


        // Cartridge ROM
        if (address < 0x8000) {

            if (
                this.rom &&
                address < this.rom.length
            ) {

                return this.rom[address];
            }

            return 0xFF;
        }


        // Video RAM
        if (
            address >= 0x8000 &&
            address <= 0x9FFF
        ) {

            return this.vram[
                address - 0x8000
            ];
        }


        // Working RAM
        if (
            address >= 0xC000 &&
            address <= 0xDFFF
        ) {

            return this.wram[
                address - 0xC000
            ];
        }


        // Echo RAM
        if (
            address >= 0xE000 &&
            address <= 0xFDFF
        ) {

            return this.wram[
                address - 0xE000
            ];
        }


        // Joypad
        if (address === 0xFF00) {

            return this.joypad;
        }


        // Interrupt flags
        if (address === 0xFF0F) {

            return this.interruptFlags;
        }


        // High RAM
        if (
            address >= 0xFF80 &&
            address <= 0xFFFE
        ) {

            return this.hram[
                address - 0xFF80
            ];
        }


        // Interrupt enable
        if (address === 0xFFFF) {

            return this.interruptEnable;
        }


        return this.memory[address];
    }


    // ======================================
    // WRITE BYTE
    // ======================================

    write8(address, value) {

        address &=
            0xFFFF;

        value &=
            0xFF;


        // Cartridge ROM cannot be
        // directly written to.
        if (address < 0x8000) {

            return;
        }


        // Video RAM
        if (
            address >= 0x8000 &&
            address <= 0x9FFF
        ) {

            this.vram[
                address - 0x8000
            ] = value;

            return;
        }


        // Working RAM
        if (
            address >= 0xC000 &&
            address <= 0xDFFF
        ) {

            this.wram[
                address - 0xC000
            ] = value;

            return;
        }


        // Echo RAM
        if (
            address >= 0xE000 &&
            address <= 0xFDFF
        ) {

            this.wram[
                address - 0xE000
            ] = value;

            return;
        }


        // Joypad
        if (address === 0xFF00) {

            this.joypad = value;

            return;
        }


        // Interrupt flags
        if (address === 0xFF0F) {

            this.interruptFlags =
                value;

            return;
        }


        // High RAM
        if (
            address >= 0xFF80 &&
            address <= 0xFFFE
        ) {

            this.hram[
                address - 0xFF80
            ] = value;

            return;
        }


        // Interrupt enable
        if (address === 0xFFFF) {

            this.interruptEnable =
                value;

            return;
        }


        this.memory[address] =
            value;
    }


    // ======================================
    // READ 16-BIT VALUE
    // ======================================

    read16(address) {

        const low =
            this.read8(address);

        const high =
            this.read8(
                address + 1
            );

        return (
            low |
            (high << 8)
        );
    }


    // ======================================
    // WRITE 16-BIT VALUE
    // ======================================

    write16(address, value) {

        this.write8(
            address,
            value & 0xFF
        );

        this.write8(
            address + 1,
            (value >> 8) & 0xFF
        );
    }
}
