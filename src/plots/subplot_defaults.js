'use strict';

var Lib = require('../lib');
var Template = require('../plot_api/plot_template');
var handleDomainDefaults = require('./domain').defaults;

/**
 * Belirli bir türdeki tüm alt grafiklere varsayılan değerleri bul ve uygula
 * Bu, bir konteyner içinde bulunan alt grafiklerle ilgilenir - yani
 * gl3d, geo, ternary... ancak ayrı x ve y eksenlerine sahip 2d eksenleri değil.
 * alt grafiklerini bulur, `domain` özniteliklerini zorlar, ardından
 * diğer her şeyi doldurmak için verilen handleDefaults işlevini çağırır.
 *
 * layoutIn: kullanıcı tarafından sağlanan tam giriş düzeni
 * layoutOut: tamamlanmış düzen
 * fullData: tamamlanmış veri dizisi, sadece alt grafik bulmak için kullanılır
 * opts: {
 *  type: alt grafik türü stringi
 *  attributes: alt grafik öznitelikleri nesnesi
 *  partition: 'x' veya 'y', varsayılan olarak domain alanını hangi yönde böleceği
 *      (varsayılan 'x', yani yan yana alt grafikler)
 *      TODO: bu seçenek sadece 3D ve geo bu konuda önceki seçimler yaptığı için burada
 *      ve bunu değiştirmek istemedim.
 *      Bunun yerine şunları yapmalıyız:
 *      - tutarlı bir şey
 *      - daha kare bir şey (4 kesim 2x2, 5/6 kesim 2x3, vb.)
 *      - şimdi birlikte sahip olabileceğimiz tüm alt grafik türlerini içeren bir şey!
 *  handleDefaults: (subplotLayoutIn, subplotLayoutOut, coerce, opts) işlevi
 *      bu opts nesnesi handleDefaults'a geçirilir, bu nedenle bu işlev tarafından
 *      ihtiyaç duyulan ek öğeleri buraya ekleyin
 * }
 */
module.exports = function handleSubplotDefaults(layoutIn, layoutOut, fullData, opts) {
    var subplotType = opts.type;
    var subplotAttributes = opts.attributes;
    var handleDefaults = opts.handleDefaults;
    var partition = opts.partition || 'x';

    var ids = layoutOut._subplots[subplotType];
    var idsLength = ids.length;

    var baseId = idsLength && ids[0].replace(/\d+$/, '');

    var subplotLayoutIn, subplotLayoutOut;

    function coerce(attr, dflt) {
        return Lib.coerce(subplotLayoutIn, subplotLayoutOut, subplotAttributes, attr, dflt);
    }

    for(var i = 0; i < idsLength; i++) {
        var id = ids[i];

        // ternary izleri ücretsiz olarak bir düzen ternary alır!
        if(layoutIn[id]) subplotLayoutIn = layoutIn[id];
        else subplotLayoutIn = layoutIn[id] = {};

        subplotLayoutOut = Template.newContainer(layoutOut, id, baseId);

        if(!opts.noUirevision) coerce('uirevision', layoutOut.uirevision);

        var dfltDomains = {};
        dfltDomains[partition] = [i / idsLength, (i + 1) / idsLength];
        handleDomainDefaults(subplotLayoutOut, layoutOut, coerce, dfltDomains);

        opts.id = id;
        handleDefaults(subplotLayoutIn, subplotLayoutOut, coerce, opts);
    }
};
