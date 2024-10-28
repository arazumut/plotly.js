'use strict';

// Bu fonksiyon, verilen pathinfo ve contours (konturlar) bilgilerine göre sınırları kapatır.
module.exports = function(pathinfo, contours) {
    var pi0 = pathinfo[0];
    var z = pi0.z;
    var i;

    switch(contours.type) {
        case 'levels':
            // Neden sadece z[0][0] ve z[0][1] kullanılıyor?
            //
            // Not: Burada edgeVal2 yerine boundaryMin kullanmak
            //      `contour_scatter` testinin başarısız olmasına neden olur
            var edgeVal2 = Math.min(z[0][0], z[0][1]);

            for(i = 0; i < pathinfo.length; i++) {
                var pi = pathinfo[i];
                pi.prefixBoundary = !pi.edgepaths.length &&
                    (edgeVal2 > pi.level || pi.starts.length && edgeVal2 === pi.level);
            }
            break;
        case 'constraint':
            // convertToConstraints işleminden sonra, pathinfo uzunluğu 0 olur
            pi0.prefixBoundary = false;

            // edgepaths mevcut olduğunda joinAllPaths yeterince iş yapar
            if(pi0.edgepaths.length) return;

            var na = pi0.x.length;
            var nb = pi0.y.length;
            var boundaryMax = -Infinity;
            var boundaryMin = Infinity;

            for(i = 0; i < nb; i++) {
                boundaryMin = Math.min(boundaryMin, z[i][0]);
                boundaryMin = Math.min(boundaryMin, z[i][na - 1]);
                boundaryMax = Math.max(boundaryMax, z[i][0]);
                boundaryMax = Math.max(boundaryMax, z[i][na - 1]);
            }
            for(i = 1; i < na - 1; i++) {
                boundaryMin = Math.min(boundaryMin, z[0][i]);
                boundaryMin = Math.min(boundaryMin, z[nb - 1][i]);
                boundaryMax = Math.max(boundaryMax, z[0][i]);
                boundaryMax = Math.max(boundaryMax, z[nb - 1][i]);
            }

            var contoursValue = contours.value;
            var v1, v2;

            switch(contours._operation) {
                case '>':
                    if(contoursValue > boundaryMax) {
                        pi0.prefixBoundary = true;
                    }
                    break;
                case '<':
                    if(contoursValue < boundaryMin ||
                        (pi0.starts.length && contoursValue === boundaryMin)) {
                        pi0.prefixBoundary = true;
                    }
                    break;
                case '[]':
                    v1 = Math.min(contoursValue[0], contoursValue[1]);
                    v2 = Math.max(contoursValue[0], contoursValue[1]);
                    if(v2 < boundaryMin || v1 > boundaryMax ||
                        (pi0.starts.length && v2 === boundaryMin)) {
                        pi0.prefixBoundary = true;
                    }
                    break;
                case '][':
                    v1 = Math.min(contoursValue[0], contoursValue[1]);
                    v2 = Math.max(contoursValue[0], contoursValue[1]);
                    if(v1 < boundaryMin && v2 > boundaryMax) {
                        pi0.prefixBoundary = true;
                    }
                    break;
            }
            break;
    }
};
