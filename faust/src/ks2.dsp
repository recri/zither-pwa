// Based on <faust-0.9.8.6>/faust-examples/faust/karplus.dsp
// hacked to make a ramp(n) like trigger(n)
// tried adding noise to ramp, signals went dc erratic
// now wanting to multiply ramps and other envelopes
// against the noise pulse

import("music.lib");

Pmax = 4096;
P = SR/freq;

// MIDI-driven parameters:
freq = nentry("freq", 440, 20, 20000, 1); // Hz
gain = nentry("gain", 1, 0, 10, 0.01);    // 0 to 1
gate = button("gate");                    // 0 or 1

// Excitation window (convert gate to a one-period pulse):
diffgtz(x) = (x-x') > 0;    // rising transition trigger
decay(n,x) = x - (x>0)/n;   // reduce initial signal by 1/n each step
release(n) = + ~ decay(n);  // latch initial trigger for n steps
trigger(n) = diffgtz : release(n) : > (0.0); // gating pulse for noise
ramp(n) = diffgtz : release(n) <: _, > (0.0) : * ; // ramp from 1 to 0 over n steps

blend(x,y,p) = x,y : *(p), *(1-p) :> _;

// Resonator:
average(x) = (x+x')/2;
resonator = (+ : delay(Pmax, P)) ~ (average);

noisepulse = noise : *(gate : trigger(P));
ramppulse = gate : ramp(P);

process =  *(noisepulse)(ramppulse)(gain) : resonator <: _,_;
