'use strict';

/*
 * Bir iz (trace) verildiğinde, halı eksenini (carpet axis) halıya göre bulur.
 */
module.exports = function(gd, trace) {
    var n = gd._fullData.length;
    var ilkEksen;
    for(var i = 0; i < n; i++) {
        var muhtemelHali = gd._fullData[i];

        if(muhtemelHali.index === trace.index) continue;

        if(muhtemelHali.type === 'carpet') {
            if(!ilkEksen) {
                ilkEksen = muhtemelHali;
            }

            if(muhtemelHali.carpet === trace.carpet) {
                return muhtemelHali;
            }
        }
    }

    return ilkEksen;
};
