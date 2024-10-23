'use strict';

var overrideAll = require('../../../plot_api/edit_types').overrideAll;
var basePlotAttributes = require('../../../plots/attributes');
var fontAttrs = require('../../../plots/font_attributes');
var dash = require('../../drawing/attributes').dash;
var extendFlat = require('../../../lib/extend').extendFlat;
var shapeTexttemplateAttrs = require('../../../plots/template_attributes').shapeTexttemplateAttrs;
var shapeLabelTexttemplateVars = require('../label_texttemplate');

module.exports = overrideAll({
    yenisekil: {
        gorunur: extendFlat({}, basePlotAttributes.visible, {
            description: [
                'Yeni şeklin görünür olup olmadığını belirler.',
                '*legendonly* ise, şekil çizilmez,',
                'ancak efsane öğesi olarak görünebilir',
                '(efsane kendisi görünürse).'
            ].join(' ')
        }),

        efsanegoster: {
            valType: 'boolean',
            dflt: false,
            description: [
                'Yeni şeklin efsanede gösterilip gösterilmeyeceğini belirler.'
            ].join(' ')
        },

        efsane: extendFlat({}, basePlotAttributes.legend, {
            description: [
                'Yeni şekli göstermek için bir efsaneye referans ayarlar.',
                'Bu efsanelere referanslar *legend*, *legend2*, *legend3*, vb. şeklindedir.',
                'Bu efsanelerin ayarları, düzen içinde,',
                '`layout.legend`, `layout.legend2`, vb. altında ayarlanır.'
            ].join(' ')
        }),

        efsanegrubu: extendFlat({}, basePlotAttributes.legendgroup, {
            description: [
                'Yeni şekil için efsane grubunu ayarlar.',
                'Aynı efsane grubunun parçası olan izler ve şekiller,',
                'efsane öğelerini değiştirirken aynı anda gizlenir/gösterilir.'
            ].join(' ')
        }),

        efsanegrububasligi: {
            text: extendFlat({}, basePlotAttributes.legendgrouptitle.text, {
            }),
            font: fontAttrs({
                description: [
                    'Bu efsane grubunun başlık yazı tipini ayarlar.'
                ].join(' '),
            })
        },

        efsanesirasi: extendFlat({}, basePlotAttributes.legendrank, {
            description: [
                'Yeni şekil için efsane sırasını ayarlar.',
                'Küçük sıralara sahip öğeler ve gruplar üstte/sol tarafta sunulurken,',
                '*ters* `legend.traceorder` ile altta/sağ tarafta sunulurlar.',
                'Varsayılan efsane sırası 1000\'dir,',
                'bu nedenle belirli öğeleri tüm sıralanmamış öğelerden önce yerleştirmek için 1000\'den küçük sıralar,',
                've tüm sıralanmamış öğelerden sonra gitmek için 1000\'den büyük sıralar kullanabilirsiniz.'
            ].join(' ')
        }),

        efsanegenisligi: extendFlat({}, basePlotAttributes.legendwidth, {
            description: 'Yeni şekil için efsanenin genişliğini (px veya kesir olarak) ayarlar.',
        }),

        cizgi: {
            renk: {
                valType: 'color',
                description: [
                    'Çizgi rengini ayarlar.',
                    'Varsayılan olarak, arka plan rengiyle kontrastı artırmak için',
                    'ya koyu gri ya da beyaz kullanılır.'
                ].join(' ')
            },
            genislik: {
                valType: 'number',
                min: 0,
                dflt: 4,
                description: 'Çizgi genişliğini (px olarak) ayarlar.'
            },
            cizgiStili: extendFlat({}, dash, {
                dflt: 'solid',
            })
        },
        dolguRengi: {
            valType: 'color',
            dflt: 'rgba(0,0,0,0)',
            description: [
                'Yeni şekillerin içini dolduran rengi ayarlar.',
                'Lütfen alfa değeri yarıdan fazla olan bir dolgu rengi kullanıyorsanız,',
                'aktif şeklin içindeki sürükleme altındaki şekli hareket ettirmeye başlar,',
                'aksi takdirde yeni bir şekil başlatılabilir.'
            ].join(' ')
        },
        dolguKuralı: {
            valType: 'enumerated',
            values: ['evenodd', 'nonzero'],
            dflt: 'evenodd',
            description: [
                'Yolun içini belirler.',
                'Daha fazla bilgi için lütfen https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-rule adresini ziyaret edin.'
            ].join(' ')
        },
        opaklık: {
            valType: 'number',
            min: 0,
            max: 1,
            dflt: 1,
            description: 'Yeni şekillerin opaklığını ayarlar.'
        },
        katman: {
            valType: 'enumerated',
            values: ['below', 'above', 'between'],
            dflt: 'above',
            description: [
                'Yeni şekillerin ızgara çizgilerinin altında (*below*),',
                'ızgara çizgileri ve izler arasında (*between*) veya izlerin üstünde (*above*) çizilip çizilmeyeceğini belirtir.'
            ].join(' ')
        },
        cizimYonu: {
            valType: 'enumerated',
            values: ['ortho', 'horizontal', 'vertical', 'diagonal'],
            dflt: 'diagonal',
            description: [
                '`dragmode` *drawrect*, *drawline* veya *drawcircle* olarak ayarlandığında,',
                'bu sürüklemeyi yatay, dikey veya çapraz olarak sınırlar.',
                '*diagonal* kullanıldığında, herhangi bir yönde çizim yapmada sınır yoktur.',
                '*ortho* çizimi yatay veya dikey olarak sınırlar.',
                '*horizontal* yatay genişlemeye izin verir.',
                '*vertical* dikey genişlemeye izin verir.'
            ].join(' ')
        },

        isim: extendFlat({}, basePlotAttributes.name, {
            description: [
                'Yeni şekil adını ayarlar.',
                'Ad, efsane öğesi olarak görünür.'
            ].join(' ')
        }),

        etiket: {
            metin: {
                valType: 'string',
                dflt: '',
                description: [
                    'Yeni şekille görüntülenecek metni ayarlar.',
                    'Eğer `isim` sağlanmamışsa, efsane öğesi için de kullanılır.'
                ].join(' ')
            },
            metinSablonu: shapeTexttemplateAttrs({newshape: true}, {keys: Object.keys(shapeLabelTexttemplateVars)}),
            font: fontAttrs({
                description: 'Yeni şekil etiket metin yazı tipini ayarlar.'
            }),
            metinPozisyonu: {
                valType: 'enumerated',
                values: [
                    'top left', 'top center', 'top right',
                    'middle left', 'middle center', 'middle right',
                    'bottom left', 'bottom center', 'bottom right',
                    'start', 'middle', 'end',
                ],
                description: [
                    'Yeni şekle göre etiket metninin pozisyonunu ayarlar.',
                    'Dikdörtgenler, daireler ve yollar için desteklenen değerler',
                    '*top left*, *top center*, *top right*, *middle left*,',
                    '*middle center*, *middle right*, *bottom left*, *bottom center*,',
                    've *bottom right* şeklindedir.',
                    'Çizgiler için desteklenen değerler *start*, *middle*, ve *end* şeklindedir.',
                    'Dikdörtgenler, daireler ve yollar için varsayılan: *middle center*; çizgiler için *middle*.'
                ].join(' ')
            },
            metinAcisi: {
                valType: 'angle',
                dflt: 'auto',
                description: [
                    'Etiket metninin yataya göre çizildiği açıyı ayarlar.',
                    'Çizgiler için, açı *auto* çizgiyle aynı açıdır.',
                    'Diğer tüm şekiller için, açı *auto* yataydır.'
                ].join(' ')
            },
            xCapa: {
                valType: 'enumerated',
                values: ['auto', 'left', 'center', 'right'],
                dflt: 'auto',
                description: [
                    'Etiketin yatay pozisyon çapası',
                    'Bu çapa, belirtilen `metinPozisyonu`nu etiket metninin *sol*, *orta*',
                    'veya *sağ* kısmına bağlar.',
                    'Örneğin, `metinPozisyonu` *top right* olarak ayarlanmışsa ve',
                    '`xCapa` *right* olarak ayarlanmışsa, etiket metninin',
                    'sağ kenarı yeni şeklin sağ kenarıyla hizalanır.'
                ].join(' '),
            },
            yCapa: {
                valType: 'enumerated',
                values: ['top', 'middle', 'bottom'],
                description: [
                    'Etiketin dikey pozisyon çapası',
                    'Bu çapa, belirtilen `metinPozisyonu`nu etiket metninin *üst*, *orta*',
                    'veya *alt* kısmına bağlar.',
                    'Örneğin, `metinPozisyonu` *top right* olarak ayarlanmışsa ve',
                    '`yCapa` *top* olarak ayarlanmışsa, etiket metninin',
                    'üst kenarı yeni şeklin üst kenarıyla hizalanır.'
                ].join(' ')
            },
            dolgu: {
                valType: 'number',
                dflt: 3,
                min: 0,
                description: 'Etiketin kenarı ile yeni şeklin kenarı arasındaki dolgu (px olarak) ayarlanır.'
            }
        }
    },

    aktifSekil: {
        dolguRengi: {
            valType: 'color',
            dflt: 'rgb(255,0,255)',
            description: 'Aktif şeklin içini dolduran rengi ayarlar.'
        },
        opaklık: {
            valType: 'number',
            min: 0,
            max: 1,
            dflt: 0.5,
            description: 'Aktif şeklin opaklığını ayarlar.'
        }
    }
}, 'none', 'from-root');
