'use strict';

var fontAttrs = require('../../plots/font_attributes');
var colorAttrs = require('../color/attributes');

module.exports = {
    _isSubplotObj: true,

    visible: {
        valType: 'boolean',
        dflt: true,
        editType: 'legend',
        description: 'Bu efsanenin görünür olup olmadığını belirler.'
    },

    bgcolor: {
        valType: 'color',
        editType: 'legend',
        description: 'Efsane arka plan rengini ayarlar. Varsayılan olarak `layout.paper_bgcolor` kullanılır.'
    },
    bordercolor: {
        valType: 'color',
        dflt: colorAttrs.defaultLine,
        editType: 'legend',
        description: 'Efsaneyi çevreleyen sınırın rengini ayarlar.'
    },
    borderwidth: {
        valType: 'number',
        min: 0,
        dflt: 0,
        editType: 'legend',
        description: 'Efsaneyi çevreleyen sınırın genişliğini (px cinsinden) ayarlar.'
    },
    font: fontAttrs({
        editType: 'legend',
        description: 'Efsane öğeleri için kullanılan yazı tipini ayarlar.'
    }),
    grouptitlefont: fontAttrs({
        editType: 'legend',
        description: 'Efsanedeki grup başlıkları için yazı tipini ayarlar. Varsayılan olarak `legend.font` kullanılır ve boyutu yaklaşık %10 artırılır.'
    }),
    orientation: {
        valType: 'enumerated',
        values: ['v', 'h'],
        dflt: 'v',
        editType: 'legend',
        description: 'Efsanenin yönünü ayarlar.'
    },
    traceorder: {
        valType: 'flaglist',
        flags: ['reversed', 'grouped'],
        extras: ['normal'],
        editType: 'legend',
        description: [
            'Efsane öğelerinin görüntülenme sırasını belirler.',
            '*normal* ise, öğeler giriş verileriyle aynı sırada yukarıdan aşağıya doğru görüntülenir.',
            '*reversed* ise, öğeler *normal* sıranın tersine görüntülenir.',
            '*grouped* ise, öğeler gruplar halinde görüntülenir (bir iz `legendgroup` sağlandığında).',
            '*grouped+reversed* ise, öğeler *grouped* sırasının tersine görüntülenir.'
        ].join(' ')
    },
    tracegroupgap: {
        valType: 'number',
        min: 0,
        dflt: 10,
        editType: 'legend',
        description: 'Efsane grupları arasındaki dikey boşluğu (px cinsinden) ayarlar.'
    },
    entrywidth: {
        valType: 'number',
        min: 0,
        editType: 'legend',
        description: [
            'Efsanenin genişliğini (px veya kesir olarak) ayarlar.',
            '`entrywidthmode` *pixels* olarak ayarlandığında, metin genişliğine göre giriş genişliğini ayarlamak için 0 kullanın.'
        ].join(' ')
    },
    entrywidthmode: {
        valType: 'enumerated',
        values: ['fraction', 'pixels'],
        dflt: 'pixels',
        editType: 'legend',
        description: 'entrywidth\'in ne anlama geldiğini belirler.'
    },
    indentation: {
        valType: 'number',
        min: -15,
        dflt: 0,
        editType: 'legend',
        description: 'Efsane girişlerinin girintisini (px cinsinden) ayarlar.'
    },
    itemsizing: {
        valType: 'enumerated',
        values: ['trace', 'constant'],
        dflt: 'trace',
        editType: 'legend',
        description: [
            'Efsane öğelerinin sembollerinin ilgili *iz* öznitelikleriyle ölçeklenip ölçeklenmeyeceğini veya grafikteki sembol boyutundan bağımsız olarak *sabit* kalıp kalmayacağını belirler.'
        ].join(' ')
    },
    itemwidth: {
        valType: 'number',
        min: 30,
        dflt: 30,
        editType: 'legend',
        description: 'Efsane öğesi sembollerinin genişliğini (px cinsinden) ayarlar (başlık metni dışındaki kısım).'
    },
    itemclick: {
        valType: 'enumerated',
        values: ['toggle', 'toggleothers', false],
        dflt: 'toggle',
        editType: 'legend',
        description: [
            'Efsane öğesi tıklama davranışını belirler.',
            '*toggle* grafikte tıklanan öğenin görünürlüğünü değiştirir.',
            '*toggleothers* tıklanan öğeyi grafikteki tek görünür öğe yapar.',
            '*false* efsane öğesi tıklama etkileşimlerini devre dışı bırakır.'
        ].join(' ')
    },
    itemdoubleclick: {
        valType: 'enumerated',
        values: ['toggle', 'toggleothers', false],
        dflt: 'toggleothers',
        editType: 'legend',
        description: [
            'Efsane öğesi çift tıklama davranışını belirler.',
            '*toggle* grafikte tıklanan öğenin görünürlüğünü değiştirir.',
            '*toggleothers* tıklanan öğeyi grafikteki tek görünür öğe yapar.',
            '*false* efsane öğesi çift tıklama etkileşimlerini devre dışı bırakır.'
        ].join(' ')
    },
    groupclick: {
        valType: 'enumerated',
        values: ['toggleitem', 'togglegroup'],
        dflt: 'togglegroup',
        editType: 'legend',
        description: [
            'Efsane grup öğesi tıklama davranışını belirler.',
            '*toggleitem* grafikte tıklanan bireysel öğenin görünürlüğünü değiştirir.',
            '*togglegroup* grafikte tıklanan öğeyle aynı legendgroup içindeki tüm öğelerin görünürlüğünü değiştirir.'
        ].join(' ')
    },
    x: {
        valType: 'number',
        editType: 'legend',
        description: [
            'Efsanenin `xref`e göre x konumunu (normalize edilmiş koordinatlarda) ayarlar.',
            '`xref` *paper* olduğunda, dikey efsaneler için varsayılan olarak *1.02* ve yatay efsaneler için varsayılan olarak *0* kullanılır.',
            '`xref` *container* olduğunda, dikey efsaneler için varsayılan olarak *1* ve yatay efsaneler için varsayılan olarak *0* kullanılır.',
            '`xref` *container* ise *0* ile *1* arasında olmalıdır.',
            '`xref` *paper* ise *-2* ile *3* arasında olmalıdır.'
        ].join(' ')
    },
    xref: {
        valType: 'enumerated',
        dflt: 'paper',
        values: ['container', 'paper'],
        editType: 'layoutstyle',
        description: [
            '`x`in atıfta bulunduğu konteyneri ayarlar.',
            '*container* grafiğin tüm `genişliğini` kapsar.',
            '*paper* yalnızca çizim alanının genişliğine atıfta bulunur.'
        ].join(' ')
    },
    xanchor: {
        valType: 'enumerated',
        values: ['auto', 'left', 'center', 'right'],
        dflt: 'left',
        editType: 'legend',
        description: [
            'Efsanenin yatay konum çapasını ayarlar.',
            'Bu çapa, `x` konumunu efsanenin *sol*, *orta* veya *sağ* kısmına bağlar.',
            '*auto* değeri, `x` değeri 2/3 veya daha büyük olduğunda efsaneleri sağa,',
            '`x` değeri 1/3 veya daha küçük olduğunda sola ve',
            'diğer durumlarda ortasına göre bağlar.'
        ].join(' ')
    },
    y: {
        valType: 'number',
        editType: 'legend',
        description: [
            'Efsanenin `yref`e göre y konumunu (normalize edilmiş koordinatlarda) ayarlar.',
            '`yref` *paper* olduğunda, dikey efsaneler için varsayılan olarak *1*,',
            'aralık kaydırıcıları olmayan grafiklerde yatay efsaneler için varsayılan olarak *-0.1* ve',
            'bir veya birden fazla aralık kaydırıcısı olan grafiklerde yatay efsaneler için varsayılan olarak *1.1* kullanılır.',
            '`yref` *container* olduğunda, varsayılan olarak *1* kullanılır.',
            '`yref` *container* ise *0* ile *1* arasında olmalıdır.',
            '`yref` *paper* ise *-2* ile *3* arasında olmalıdır.'
        ].join(' ')
    },
    yref: {
        valType: 'enumerated',
        dflt: 'paper',
        values: ['container', 'paper'],
        editType: 'layoutstyle',
        description: [
            '`y`in atıfta bulunduğu konteyneri ayarlar.',
            '*container* grafiğin tüm `yüksekliğini` kapsar.',
            '*paper* yalnızca çizim alanının yüksekliğine atıfta bulunur.'
        ].join(' ')
    },
    yanchor: {
        valType: 'enumerated',
        values: ['auto', 'top', 'middle', 'bottom'],
        editType: 'legend',
        description: [
            'Efsanenin dikey konum çapasını ayarlar.',
            'Bu çapa, `y` konumunu efsanenin *üst*, *orta* veya *alt* kısmına bağlar.',
            '*auto* değeri, `y` değeri 1/3 veya daha küçük olduğunda efsaneleri altına,',
            '`y` değeri 2/3 veya daha büyük olduğunda üstüne ve',
            'diğer durumlarda ortasına göre bağlar.'
        ].join(' ')
    },
    uirevision: {
        valType: 'any',
        editType: 'none',
        description: [
            'İz ve pasta etiketi görünürlüğündeki efsane kaynaklı değişikliklerin kalıcılığını kontrol eder. Varsayılan olarak `layout.uirevision` kullanılır.'
        ].join(' ')
    },
    valign: {
        valType: 'enumerated',
        values: ['top', 'middle', 'bottom'],
        dflt: 'middle',
        editType: 'legend',
        description: 'Sembollerin ilgili metinlerine göre dikey hizalamasını ayarlar.'
    },
    title: {
        text: {
            valType: 'string',
            dflt: '',
            editType: 'legend',
            description: 'Efsanenin başlığını ayarlar.'
        },
        font: fontAttrs({
            editType: 'legend',
            description: 'Bu efsanenin başlık yazı tipini ayarlar. Varsayılan olarak `legend.font` kullanılır ve boyutu yaklaşık %20 artırılır.'
        }),
        side: {
            valType: 'enumerated',
            values: ['top', 'left', 'top left', 'top center', 'top right'],
            editType: 'legend',
            description: [
                'Efsane başlığının konumunu belirler.',
                'Varsayılan olarak *top* kullanılır ve `orientation` *h* olduğunda,',
                'Varsayılan olarak *left* kullanılır ve `orientation` *v* olduğunda.',
                '*top left* seçeneği, efsane alanını hem x hem de y yönünde genişletmek için kullanılabilir.',
                'top center ve top right yatay hizalama içindir.'
            ].join(' ')
        },
        editType: 'legend'
    },
    editType: 'legend'
};
