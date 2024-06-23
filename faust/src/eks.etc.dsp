//  <: 
//	vgroup("[3]Output",)

// Effects

// parameters
// equalizer
b100 = vslider("100 Hz", 0, -6, +6, 0.1);
b350 = vslider("350 Hz", 0, -6, +6, 0.1);
b760 = vslider("760 Hz", 0, -6, +6, 0.1);
b1600 = vslider("1600 Hz", 0, -6, +6, 0.1);
b3500 = vslider("3500 Hz", 0, -6, +6, 0.1);

// volume
vol = vslider("Volume", 0.5, 0, 1, 0.01);

// Spatial "width" (not in original EKS, but only costs "one tap"):
W = hslider("center-panned spatial width", 0.5, 0, 1, 0.01);
A = hslider("pan angle", 0.5, 0, 1, 0.01);

// computation
equalize = <:
	(fi.low_shelf(b100, 100),
	 fi.peakeq(b350, 350, 700),
	 fi.peakeq(b760, 760, 1520),
	 fi.peakeq(b1600, 1600, 3200),
	 fi.high_shelf(b3500, 3500)) :> * (volume);

// reverb
reverb = dm.zita_light;

// Second output decorrelated somewhat for spatial diversity over imaging:
widthdelay = _,delay(Pmax,W*P/2);

// Assumes an optionally spatialized mono signal, centrally panned:
stereopanner(A) = (_,_) : *(1.0-A), *(A);

spatialize = widthdelay : stereopanner(A);

effect = equalize : reverb <: spatialize;
