'use strict';

var Lib = require('../lib');
var toImage = require('../plot_api/to_image');
var fileSaver = require('./filesaver');
var helpers = require('./helpers');

/**
 * Plotly.indirResim
 *
 * @param {object | string | HTML div} gd
 *   veri/düzen/konfigürasyon nesnesi
 *   veya mevcut bir grafik <div>
 *   veya mevcut bir grafik <div> id'si olabilir
 * @param {object} opts (../plot_api/to_image içindeki Plotly.toImage'a bakın)
 * @return {promise}
 */
function indirResim(gd, opts) {
    var _gd;
    if(!Lib.isPlainObject(gd)) _gd = Lib.getGraphDiv(gd);

    opts = opts || {};
    opts.format = opts.format || 'png';
    opts.width = opts.width || null;
    opts.height = opts.height || null;
    opts.imageDataOnly = true;

    return new Promise(function(resolve, reject) {
        if(_gd && _gd._snapshotInProgress) {
            reject(new Error('Anlık görüntü alma işlemi zaten devam ediyor.'));
        }

        // svgtoimg içindeki yorumlara bakın
        //   IE ile ilgili sorunların tartışması
        //   artık canvas'a çizebilir, ancak CORS ile kirlenmiş canvas
        //   toDataURL'e izin vermez
        //   svg formatı ise çalışır
        if(Lib.isIE() && opts.format !== 'svg') {
            reject(new Error(helpers.MSG_IE_BAD_FORMAT));
        }

        if(_gd) _gd._snapshotInProgress = true;
        var promise = toImage(gd, opts);

        var dosyaAdi = opts.filename || gd.fn || 'yenigrafik';
        dosyaAdi += '.' + opts.format.replace('-', '.');

        promise.then(function(result) {
            if(_gd) _gd._snapshotInProgress = false;
            return fileSaver(result, dosyaAdi, opts.format);
        }).then(function(name) {
            resolve(name);
        }).catch(function(err) {
            if(_gd) _gd._snapshotInProgress = false;
            reject(err);
        });
    });
}

module.exports = indirResim;
