'use strict';

/*
 * Konturların sonunu biraz hareket ettirmek için küçük yardımcı fonksiyon,
 * son konturun yuvarlama hatalarına kaybolmasını önlemek için
 */
module.exports = function sonArtı(contours) {
    return contours.end + contours.size / 1e6;
};
