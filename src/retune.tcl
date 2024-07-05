set data {
}

proc fixit {notes o1 o2 o3} {
    # first o1 elements become last o1 elements
    # middle o2 elements become middle o2 elements
    # last o3 elements become first o3 elements
    # hmm, just reverse the entire list
    return [lreverse $notes]
}

puts [join [fixit [split G3,A3,B3,C4,D4,E4,F4,G4,A4,A♯4,C5,C♯4,D4,E4,F♯4,G4,A4,B4,C5,D5,E5,F5,G5,G♯4,A4,B4,C♯5,D5,E5,F♯5,G5,A5,B5,C6,D6 ,] 11 12 12] ,]
puts [join [fixit [split G3,A3,B3,C4,D4,E4,F4,G4,A4,A♯4,C5,D5,C♯4,D4,E4,F♯4,G4,A4,B4,C5,D5,E5,F5,G5,A5,G♯4,A4,B4,C♯5,D5,E5,F♯5,G5,A5,B5,C6,D6,E6 ,] 12 13 13] ,]
puts [join [fixit [split D3,E3,F♯3,G3,A3,B3,C4,D4,E4,F4,G4,A4,A♯4,C5,G♯3,A3,B3,C♯4,D4,E4,F♯4,G4,A4,B4,C5,D5,E5,F5,G5,D♯4,E4,F♯4,G♯4,A4,B4,C♯5,D5,E5,F♯5,G5,A5,B5,C6,D6 ,] 14 15 15] ,]
puts [join [fixit [split D3,E3,F♯3,G3,A3,B3,C4,D4,E4,F4,G4,A4,A♯4,C♯5,D♯5,G♯3,A3,B3,C♯4,D4,E4,F♯4,G4,A4,B4,C5,D5,E5,F5,G♯5,A♯5,D♯4,E4,F♯4,G♯4,A4,B4,C♯5,D5,E5,F♯5,G5,A5,B5,C6,D6,E6 ,] 15 16 16] ,]

D6,C6,B5,A5,G5,F♯5,E5,D5,C♯5,B4,A4,G♯4,G5,F5,E5,D5,C5,B4,A4,G4,F♯4,E4,D4,C♯4,C5,A♯4,A4,G4,F4,E4,D4,C4,B3,A3,G3
E6,D6,C6,B5,A5,G5,F♯5,E5,D5,C♯5,B4,A4,G♯4,A5,G5,F5,E5,D5,C5,B4,A4,G4,F♯4,E4,D4,C♯4,D5,C5,A♯4,A4,G4,F4,E4,D4,C4,B3,A3,G3
D6,C6,B5,A5,G5,F♯5,E5,D5,C♯5,B4,A4,G♯4,F♯4,E4,D♯4,G5,F5,E5,D5,C5,B4,A4,G4,F♯4,E4,D4,C♯4,B3,A3,G♯3,C5,A♯4,A4,G4,F4,E4,D4,C4,B3,A3,G3,F♯3,E3,D3
E6,D6,C6,B5,A5,G5,F♯5,E5,D5,C♯5,B4,A4,G♯4,F♯4,E4,D♯4,A♯5,G♯5,F5,E5,D5,C5,B4,A4,G4,F♯4,E4,D4,C♯4,B3,A3,G♯3,D♯5,C♯5,A♯4,A4,G4,F4,E4,D4,C4,B3,A3,G3,F♯3,E3,D3
