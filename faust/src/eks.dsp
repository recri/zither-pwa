// third hack - drop the effects
declare name "EKS Electric Guitar Synth";
declare author "Julius Smith";
declare version "1.0"; // LAC-2008 version is 1.0
declare license "STK-4.3"; // Synthesis Tool Kit 4.3 (MIT style license)
declare copyright "Julius Smith";
declare reference "http://ccrma.stanford.edu/~jos/pasp/vegf.html";
// -> Virtual\_Electric\_Guitars\_Faust.html";

import("stdfaust.lib"); // for everything namespaced
import("music.lib");    // Define SR, delay
import("filter.lib");   // smooth, ffcombfilter,fdelay4
import("effect.lib");   // levelfilter

//==================== GUI SPECIFICATION ================

// standard MIDI voice parameters:
// augmented for bend, sustain, and volume control
// NOTE: The labels MUST be "freq", "gain", and "gate" for faust2pd
fbase = nentry("[1]freq", 440, 20, 7040, 1);  // Hz
fbend = ba.semi2ratio(hslider("[2]bend[midi:pitchwheel]",0,-2,2,0.01)) : si.polySmooth(gate,0.999,1);
freq = fbase * fbend;

gain = nentry("[3]gain", 1, 0, 10, 0.01);    // 0 to 1
master = hslider("master[mihhdi:ctrl 7]",0.5,0,1,0.01);

gsust = hslider("sustain[midi:ctrl 64]",0,0,1,1);
ggate = button("[4]gate");                    // 0 or 1
gate = gsust+ggate : min(1);

// Additional parameters (MIDI "controllers"):

// Dynamic level specified as dB level desired at Nyquist limit:
L = hslider("[4]dynamic_level", -10, -60, 0, 1) : db2linear;
// Note: A lively clavier is obtained by tying L to gain (MIDI velocity).

// String decay time in seconds:
t60 = hslider("[5]t60", 4, 0, 10, 0.01);  // -60db decay time (sec)

// Normalized brightness in [0,1]:
B = hslider("[6]brightness [midi:ctrl 0x74]", 0.5, 0, 1, 0.01);// 0-1
    // MIDI Controller 0x74 is often "brightness" 
    // (or VCF lowpass cutoff freq)

//==================== SIGNAL PROCESSING ================

//----------------------- noiseburst -------------------------
// White noise burst (adapted from Faust's karplus.dsp example)
// Requires music.lib (for noise)
noiseburst(gate,P) = noise : *(gate : trigger(P))
with {
  diffgtz(x) = (x-x') > 0;
  decay(n,x) = x - (x>0)/n;
  release(n) = + ~ decay(n);
  trigger(n) = diffgtz : release(n) : > (0.0);
};

P = SR/freq; // fundamental period in samples
Pmax = 4096; // maximum P (for delay-line allocation)

excitation = noiseburst(gate,P) : *(gain);

rho = pow(0.001,1.0/(freq*t60)); // multiplies loop-gain

// Original EKS damping filter:
b1 = 0.5*B; b0 = 1.0-b1; // S and 1-S
dampingfilter1(x) = rho * ((b0 * x) + (b1 * x'));

// Linear phase FIR3 damping filter:
h0 = (1.0 + B)/2; h1 = (1.0 - B)/4;
dampingfilter2(x) = rho * (h0 * x' + h1*(x+x''));

loopfilter = dampingfilter2; // or dampingfilter1

filtered_excitation = excitation : levelfilter(L,freq); // see filter.lib

stringloop = (+ : fdelay4(Pmax, P-2)) ~ (loopfilter);
//Adequate when when brightness or dynamic level are sufficiently low:
//stringloop = (+ : fdelay1(Pmax, P-2)) ~ (loopfilter);

process = hgroup("EKS",
	vgroup("[1]Excitation",filtered_excitation) : 
	vgroup("[2]String",stringloop * master));

effect = _ <: _,_;
