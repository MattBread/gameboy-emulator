// ==========================================
// GAME BOY CPU - LR35902
// ==========================================

class GameBoyCPU {

    constructor(memory) {

        this.memory = memory;

        // 8-bit registers
        this.A = 0;
        this.B = 0;
        this.C = 0;
        this.D = 0;
        this.E = 0;
        this.H = 0;
        this.L = 0;

        // Special registers
        this.F = 0;

        // Program counter
        this.PC = 0x0100;

        // Stack pointer
        this.SP = 0xFFFE;

        // CPU state
        this.halted = false;
        this.stopped = false;

        // Number of cycles executed
        this.cycles = 0;
    }


    // ======================================
    // 16-BIT REGISTER PAIRS
    // ======================================

    get AF() {

        return (this.A << 8) | this.F;
    }


    set AF(value) {

        this.A = (value >> 8) & 0xFF;

        // Lower four flag bits are always zero
        this.F = value & 0xF0;
    }


    get BC() {

        return (this.B << 8) | this.C;
    }


    set BC(value) {

        this.B = (value >> 8) & 0xFF;
        this.C = value & 0xFF;
    }


    get DE() {

        return (this.D << 8) | this.E;
    }


    set DE(value) {

        this.D = (value >> 8) & 0xFF;
        this.E = value & 0xFF;
    }


    get HL() {

        return (this.H << 8) | this.L;
    }


    set HL(value) {

        this.H = (value >> 8) & 0xFF;
        this.L = value & 0xFF;
    }


    // ======================================
    // FLAGS
    // ======================================

    getFlag(mask) {

        return (this.F & mask) !== 0;
    }


    setFlag(mask, value) {

        if (value) {

            this.F |= mask;

        } else {

            this.F &= ~mask;
        }


        this.F &= 0xF0;
    }


    get Z() {

        return this.getFlag(0x80);
    }


    set Z(value) {

        this.setFlag(0x80, value);
    }


    get N() {

        return this.getFlag(0x40);
    }


    set N(value) {

        this.setFlag(0x40, value);
    }


    get Hflag() {

        return this.getFlag(0x20);
    }


    set Hflag(value) {

        this.setFlag(0x20, value);
    }


    get Cflag() {

        return this.getFlag(0x10);
    }


    set Cflag(value) {

        this.setFlag(0x10, value);
    }


    // ======================================
    // MEMORY
    // ======================================

    read8(address) {

        return this.memory.read8(
            address & 0xFFFF
        );
    }


    write8(address, value) {

        this.memory.write8(
            address & 0xFFFF,
            value & 0xFF
        );
    }


    read16(address) {

        const low =
            this.read8(address);

        const high =
            this.read8(address + 1);

        return low | (high << 8);
    }


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


    // ======================================
    // STACK
    // ======================================

    push16(value) {

        this.SP =
            (this.SP - 2) & 0xFFFF;

        this.write16(
            this.SP,
            value
        );
    }


    pop16() {

        const value =
            this.read16(this.SP);

        this.SP =
            (this.SP + 2) & 0xFFFF;

        return value;
    }


    // ======================================
    // CPU STEP
    // ======================================

    step() {

        if (this.halted) {

            this.cycles += 4;

            return 4;
        }


        const opcode =
            this.read8(this.PC);

        this.PC =
            (this.PC + 1) & 0xFFFF;


        let cycles = 4;


        switch (opcode) {

            // NOP
            case 0x00:

                cycles = 4;

                break;


            // LD BC,d16
            case 0x01:

                this.C =
                    this.read8(this.PC);

                this.B =
                    this.read8(this.PC + 1);

                this.PC =
                    (this.PC + 2) & 0xFFFF;

                cycles = 12;

                break;


            // LD DE,d16
            case 0x11:

                this.E =
                    this.read8(this.PC);

                this.D =
                    this.read8(this.PC + 1);

                this.PC =
                    (this.PC + 2) & 0xFFFF;

                cycles = 12;

                break;


            // LD HL,d16
            case 0x21:

                this.L =
                    this.read8(this.PC);

                this.H =
                    this.read8(this.PC + 1);

                this.PC =
                    (this.PC + 2) & 0xFFFF;

                cycles = 12;

                break;


            // LD SP,d16
            case 0x31:

                this.SP =
                    this.read16(this.PC);

                this.PC =
                    (this.PC + 2) & 0xFFFF;

                cycles = 12;

                break;


            // LD A,d8
            case 0x3E:

                this.A =
                    this.read8(this.PC);

                this.PC =
                    (this.PC + 1) & 0xFFFF;

                cycles = 8;

                break;


            // XOR A
            case 0xAF:

                this.A ^= this.A;

                this.Z = this.A === 0;
                this.N = false;
                this.Hflag = false;
                this.Cflag = false;

                cycles = 4;

                break;


            // INC B
            case 0x04: {

                const old =
                    this.B;

                this.B =
                    (this.B + 1) & 0xFF;

                this.Z = this.B === 0;
                this.N = false;
                this.Hflag =
                    (old & 0x0F) === 0x0F;

                cycles = 4;

                break;
            }


            // DEC B
            case 0x05: {

                const old =
                    this.B;

                this.B =
                    (this.B - 1) & 0xFF;

                this.Z = this.B === 0;
                this.N = true;
                this.Hflag =
                    (old & 0x0F) === 0;

                cycles = 4;

                break;
            }


            // HALT
            case 0x76:

                this.halted = true;

                cycles = 4;

                break;


            // JP a16
            case 0xC3:

                this.PC =
                    this.read16(this.PC);

                cycles = 16;

                break;


            // CALL a16
            case 0xCD: {

                const address =
                    this.read16(this.PC);

                this.PC =
                    (this.PC + 2) & 0xFFFF;

                this.push16(this.PC);

                this.PC =
                    address;

                cycles = 24;

                break;
            }


            // RET
            case 0xC9:

                this.PC =
                    this.pop16();

                cycles = 16;

                break;


            default:

                console.warn(
                    "Unimplemented opcode:",
                    "0x" +
                    opcode
                        .toString(16)
                        .padStart(2, "0")
                );

                cycles = 4;

                break;
        }


        this.cycles += cycles;

        return cycles;
    }
}
