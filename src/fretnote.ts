export class FretNote {
    constructor(note, ismuted=false, iscovered=false) {
	this.packed = (iscovered ? 256 : 0) | (ismuted ? 128 : 0) | (note & 127);
    }

    private packed: number = 0;

    get note() { return this.packed&127; }

    set note(val) { this.packed = (this.packed & ~127) | (val & 127); }
		    
    get ismuted() { return (this.packed & 128) !== 0; }

    set ismuted(val) { this.packed = (this.packed & ~128) | (val ? 128 : 0); }

    get iscovered() { return (this.packed & 256) !== 0; }

    set iscovered(val) { this.packed = (this.packed & ~256) | (val ? 256 : 0); }
}
