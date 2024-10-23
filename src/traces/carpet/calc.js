'use strict';

// Gerekli modülleri dahil et
var Axes = require('../../plots/cartesian/axes');
var isArray1D = require('../../lib').isArray1D;
var cheaterBasis = require('./cheater_basis');
var arrayMinmax = require('./array_minmax');
var calcGridlines = require('./calc_gridlines');
var calcLabels = require('./calc_labels');
var calcClipPath = require('./calc_clippath');
var clean2dArray = require('../heatmap/clean_2d_array');
var smoothFill2dArray = require('./smooth_fill_2d_array');
var convertColumnData = require('../heatmap/convert_column_xyz');
var setConvert = require('./set_convert');

module.exports = function hesapla(gd, iz) {
    var xa = Axes.getFromId(gd, iz.xaxis);
    var ya = Axes.getFromId(gd, iz.yaxis);
    var aax = iz.aaxis;
    var bax = iz.baxis;

    var x = iz.x;
    var y = iz.y;
    var kolonlar = [];
    if(x && isArray1D(x)) kolonlar.push('x');
    if(y && isArray1D(y)) kolonlar.push('y');

    if(kolonlar.length) {
        convertColumnData(iz, aax, bax, 'a', 'b', kolonlar);
    }

    var a = iz._a = iz._a || iz.a;
    var b = iz._b = iz._b || iz.b;
    x = iz._x || iz.x;
    y = iz._y || iz.y;

    var t = {};

    if(iz._cheater) {
        var avals = aax.cheatertype === 'index' ? a.length : a;
        var bvals = bax.cheatertype === 'index' ? b.length : b;
        x = cheaterBasis(avals, bvals, iz.cheaterslope);
    }

    iz._x = x = clean2dArray(x);
    iz._y = y = clean2dArray(y);

    // Tanımsız değerleri eliptik yumuşatma ile doldur. Bu, değerlerin aralığını dikkate almaz.
    smoothFill2dArray(x, a, b);
    smoothFill2dArray(y, a, b);

    setConvert(iz);

    // Verilere bağlı dönüşüm fonksiyonları oluştur
    iz.setScale();

    // Tüm verileri tarayarak doğru aralıkları elde et:
    var xrange = arrayMinmax(x);
    var yrange = arrayMinmax(y);

    var dx = 0.5 * (xrange[1] - xrange[0]);
    var xc = 0.5 * (xrange[1] + xrange[0]);

    var dy = 0.5 * (yrange[1] - yrange[0]);
    var yc = 0.5 * (yrange[1] + yrange[0]);

    // Eksenleri grafiğe sığacak şekilde genişlet, etiketleri dikkate alarak 1.3 faktörüyle büyüt.
    var buyut = 1.3;
    xrange = [xc - dx * buyut, xc + dx * buyut];
    yrange = [yc - dy * buyut, yc + dy * buyut];

    iz._extremes[xa._id] = Axes.findExtremes(xa, xrange, {padded: true});
    iz._extremes[ya._id] = Axes.findExtremes(ya, yrange, {padded: true});

    // Izgara çizgilerini hesapla ve iz nesnesine kaydet:
    calcGridlines(iz, 'a', 'b');
    calcGridlines(iz, 'b', 'a');

    // Her ana ızgara çizgisi için metin etiketlerini hesapla ve iz nesnesine kaydet:
    calcLabels(iz, aax);
    calcLabels(iz, bax);

    // Eksenleri sınırlayan dört segment için noktaları tabloya dök ve bir klip dikdörtgeni oluştur:
    t.clipsegments = calcClipPath(iz._xctrl, iz._yctrl, aax, bax);

    t.x = x;
    t.y = y;
    t.a = a;
    t.b = b;

    return [t];
};
