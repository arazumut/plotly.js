'use strict';

var Lib = require('../lib');
var Template = require('../plot_api/plot_template');

/** Dizi konteyner mantığını DRY ve tutarlı hale getirmek için kolaylık sağlayan sarmalayıcı
 *
 * @param {object} parentObjIn
 *  Konteynerin bağlandığı kullanıcı girdi nesnesi
 *  (örneğin, bir kullanıcı iz nesnesi veya kullanıcı düzen nesnesi)
 *
 * @param {object} parentObjOut
 *  Koerced konteynerin bağlanacağı tam nesne
 *  (örneğin, tam bir iz nesnesi veya tam düzen nesnesi)
 *
 * @param {object} opts
 *  seçenekler nesnesi:
 *   - name {string}
 *      Konteynerin bağlandığı anahtarın adı
 *   - inclusionAttr {string}
 *      Dahil etme/çıkartma için öğe özniteliğinin adı. Varsayılan 'visible' (görünür).
 *      Dahil etme doğru olduğundan, 'disabled' yerine örneğin 'enabled' kullanın.
 *   - handleItemDefaults {function}
 *      Dizideki her öğe üzerinde çağrılacak varsayılanlar yöntemi
 *
 *      Argümanları şunlardır:
 *          - itemIn {object} kullanıcı düzenindeki öğe
 *          - itemOut {object} tam düzen nesnesindeki öğe
 *          - parentObj {object} (closure'daki gibi)
 *          - opts {object} (closure'daki gibi)
 * N.B.
 *
 *  - opts handleItemDefaults'a geçirildiğinden, ek verilere bağlantılar da saklayabilir
 *    (örneğin, düzen bileşenleri için fullData)
 *
 */
module.exports = function handleArrayContainerDefaults(parentObjIn, parentObjOut, opts) {
    var name = opts.name;
    var inclusionAttr = opts.inclusionAttr || 'visible';

    var previousContOut = parentObjOut[name];

    var contIn = Lib.isArrayOrTypedArray(parentObjIn[name]) ? parentObjIn[name] : [];
    var contOut = parentObjOut[name] = [];
    var templater = Template.arrayTemplater(parentObjOut, name, inclusionAttr);
    var i, itemOut;

    for(i = 0; i < contIn.length; i++) {
        var itemIn = contIn[i];

        if(!Lib.isPlainObject(itemIn)) {
            itemOut = templater.newItem({});
            itemOut[inclusionAttr] = false;
        } else {
            itemOut = templater.newItem(itemIn);
        }

        itemOut._index = i;

        if(itemOut[inclusionAttr] !== false) {
            opts.handleItemDefaults(itemIn, itemOut, parentObjOut, opts);
        }

        contOut.push(itemOut);
    }

    var defaultItems = templater.defaultItems();
    for(i = 0; i < defaultItems.length; i++) {
        itemOut = defaultItems[i];
        itemOut._index = contOut.length;
        opts.handleItemDefaults({}, itemOut, parentObjOut, opts, {});
        contOut.push(itemOut);
    }

    // Bu dizinin varsayılanları tüm düzen bağımsız olarak yeniden oluşturulursa,
    // özel anahtarları sadece bu dizi için yeniden bağlayın.
    if(Lib.isArrayOrTypedArray(previousContOut)) {
        var len = Math.min(previousContOut.length, contOut.length);
        for(i = 0; i < len; i++) {
            Lib.relinkPrivateKeys(contOut[i], previousContOut[i]);
        }
    }

    return contOut;
};
