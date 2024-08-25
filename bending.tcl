#
# work out the functional form of the note bending displacement
#
# ${nu_f = sqrt(T / mu) / (2*l)}
#	${nu_f} fundamental frequency of vibrating string
#	${T} string tension
#	${mu} string mass per unit length
#	${l} string length
# so frequency increases as sqrt(T), as sqrt(1 / mu), and as (1 /(2 * l)).
#
# ${nu_B = sqrt((EA + cos(theta) * (T - EA)) / mu_nought) / ( 2 * l )}
#	${mu_B} fundamental frequency of bent string
#	${EA} product of (${E} Young's modulus and ${A} cross section area) of string
#	${theta} string angular bend (generally no more than 1 to 1.5 degree
#	${mu_nought} string mass per unit length at zero tension
#	${T} string tension
#	${l} string length at ${T}
#
# scale lengths
#	violin 12.8 inches
#	double bass 41.3 to 43.3 inches
#	classical guitar 25.6 inches, now 26 inches
#	steel-string acoustic 24 to 25.5 inches
#	electric guitar 24 to 25.5 inches
#	electric bass guitar 30 to 34 inches
#	mandolin 13-14 inches
#	ukulele 14.75 inches
#	banjo 26.25 inches
#
# a standard guitar is tuned to E2,A2,D3,G3,B3,E4
# midi notes 40,45,50,55,59,64
# hertz 82.41,110.00,146.83,196.00,246.94,329.63
#
# the different strings are tuned, at least roughly, to the same tension.
# they also have the same length at any fret.
# and fretting does not change the tension
#
# typical guitar string tension is 18 lbs.
#
# so I can take the open tones on the guitar, fix a scale length, assume
# a tension and compute the string mass that makes it work.
# then compute the fret positions of the other notes on the same string.
# then for each fret position compute the angles and displacements that
# produce semi-tone and whole-tone bends
#
