'use strict';

var carpetAttrs = require('./attributes');

var addOpacity = require('../../components/color').addOpacity;
var Registry = require('../../registry');
var Lib = require('../../lib');
var handleTickValueDefaults = require('../../plots/cartesian/tick_value_defaults');
var handleTickLabelDefaults = require('../../plots/cartesian/tick_label_defaults');
var handlePrefixSuffixDefaults = require('../../plots/cartesian/prefix_suffix_defaults');
var handleCategoryOrderDefaults = require('../../plots/cartesian/category_order_defaults');
var setConvert = require('../../plots/cartesian/set_convert');
var autoType = require('../../plots/cartesian/axis_autotype');

/**
 * Seçenekler: İçeren nesne:
 *
 *  letter: 'a' veya 'b'
 *  title: Varsayılan başlığa gidecek eksen adı (örneğin 'Colorbar')
 *  name: Eksen nesnesi adı (örneğin 'xaxis') eğer biri saklanacaksa
 *  font: Varsayılan olarak miras alınacak yazı tipi
 *  outerTicks: Boolean, tikler dışarıda mı olmalı?
 *  showGrid: Boolean, ızgara çizgileri varsayılan olarak gösterilmeli mi?
 *  data: Otomatik tür seçimi için kullanılacak grafik verisi
 *  bgColor: Varsayılan ızgara çizgisi renklerini hesaplamak için grafik arka plan rengi
 */
module.exports = function handleAxisDefaults(containerIn, containerOut, options) {
    var letter = options.letter;
    var font = options.font || {};
    var attributes = carpetAttrs[letter + 'axis'];

    function coerce(attr, dflt) {
        return Lib.coerce(containerIn, containerOut, attributes, attr, dflt);
    }

    function coerce2(attr, dflt) {
        return Lib.coerce2(containerIn, containerOut, attributes, attr, dflt);
    }

    // Bazı özel özellikleri ayarla
    if (options.name) {
        containerOut._name = options.name;
        containerOut._id = options.name;
    }

    // Şimdi türü belirleyin ve biraz daha başlatma yapın
    coerce('autotypenumbers', options.autotypenumbersDflt);
    var axType = coerce('type');
    if (axType === '-') {
        if (options.data) setAutoType(containerOut, options.data);

        if (containerOut.type === '-') {
            containerOut.type = 'linear';
        } else {
            // autoType'ı giriş eksenine geri kopyala
            axType = containerIn.type = containerOut.type;
        }
    }

    coerce('smoothing');
    coerce('cheatertype');

    coerce('showticklabels');
    coerce('labelprefix', letter + ' = ');
    coerce('labelsuffix');
    coerce('showtickprefix');
    coerce('showticksuffix');

    coerce('separatethousands');
    coerce('tickformat');
    coerce('exponentformat');
    coerce('minexponent');
    coerce('showexponent');
    coerce('categoryorder');

    coerce('tickmode');
    coerce('tickvals');
    coerce('ticktext');
    coerce('tick0');
    coerce('dtick');

    if (containerOut.tickmode === 'array') {
        coerce('arraytick0');
        coerce('arraydtick');
    }

    coerce('labelpadding');

    containerOut._hovertitle = letter;

    if (axType === 'date') {
        var handleCalendarDefaults = Registry.getComponentMethod('calendars', 'handleDefaults');
        handleCalendarDefaults(containerIn, containerOut, 'calendar', options.calendar);
    }

    // setConvert'in eklediği bazı diğer işlevlere ihtiyacımız var, ancak
    // yol bulma için, piksel ölçeklemeyi basit geçiş (kimlik) olarak geçersiz kılın
    setConvert(containerOut, options.fullLayout);
    containerOut.c2p = Lib.identity;

    var dfltColor = coerce('color', options.dfltColor);
    // Eğer eksen rengi sağlanmışsa, yazı tipleri için de kullanın; aksi takdirde,
    // sağlanmış olabilecek genel yazı tipi renginden miras alın.
    var dfltFontColor = (dfltColor === containerIn.color) ? dfltColor : font.color;

    var title = coerce('title.text');
    if (title) {
        Lib.coerceFont(coerce, 'title.font', font, { overrideDflt: {
            size: Lib.bigFont(font.size),
            color: dfltFontColor
        }});
        coerce('title.offset');
    }

    coerce('tickangle');

    var autoRange = coerce('autorange', !containerOut.isValidRange(containerIn.range));

    if (autoRange) coerce('rangemode');

    coerce('range');
    containerOut.cleanRange();

    coerce('fixedrange');

    handleTickValueDefaults(containerIn, containerOut, coerce, axType);
    handlePrefixSuffixDefaults(containerIn, containerOut, coerce, axType, options);
    handleTickLabelDefaults(containerIn, containerOut, coerce, axType, options);
    handleCategoryOrderDefaults(containerIn, containerOut, coerce, {
        data: options.data,
        dataAttr: letter
    });

    var gridColor = coerce2('gridcolor', addOpacity(dfltColor, 0.3));
    var gridWidth = coerce2('gridwidth');
    var gridDash = coerce2('griddash');
    var showGrid = coerce('showgrid');

    if (!showGrid) {
        delete containerOut.gridcolor;
        delete containerOut.gridwidth;
        delete containerOut.griddash;
    }

    var startLineColor = coerce2('startlinecolor', dfltColor);
    var startLineWidth = coerce2('startlinewidth', gridWidth);
    var showStartLine = coerce('startline', containerOut.showgrid || !!startLineColor || !!startLineWidth);

    if (!showStartLine) {
        delete containerOut.startlinecolor;
        delete containerOut.startlinewidth;
    }

    var endLineColor = coerce2('endlinecolor', dfltColor);
    var endLineWidth = coerce2('endlinewidth', gridWidth);
    var showEndLine = coerce('endline', containerOut.showgrid || !!endLineColor || !!endLineWidth);

    if (!showEndLine) {
        delete containerOut.endlinecolor;
        delete containerOut.endlinewidth;
    }

    if (!showGrid) {
        delete containerOut.gridcolor;
        delete containerOut.gridwidth;
        delete containerOut.griddash;
    } else {
        coerce('minorgridcount');
        coerce('minorgridwidth', gridWidth);
        coerce('minorgriddash', gridDash);
        coerce('minorgridcolor', addOpacity(gridColor, 0.06));

        if (!containerOut.minorgridcount) {
            delete containerOut.minorgridwidth;
            delete containerOut.minorgriddash;
            delete containerOut.minorgridcolor;
        }
    }

    if (containerOut.showticklabels === 'none') {
        delete containerOut.tickfont;
        delete containerOut.tickangle;
        delete containerOut.showexponent;
        delete containerOut.exponentformat;
        delete containerOut.minexponent;
        delete containerOut.tickformat;
        delete containerOut.showticksuffix;
        delete containerOut.showtickprefix;
    }

    if (!containerOut.showticksuffix) {
        delete containerOut.ticksuffix;
    }

    if (!containerOut.showtickprefix) {
        delete containerOut.tickprefix;
    }

    // Bu zorlanmalı, sonra yukarıdaki bir şey eksen kodunun derinliklerinde bunu geçersiz kılıyor,
    // ama hayır, *gerçekten* bunu zorlamak istiyoruz.
    coerce('tickmode');

    return containerOut;
};

function setAutoType(ax, data) {
    // yeni mantık: insanlar istedikleri herhangi bir türü belirtebilirler,
    // yalnızca tür '-' ise otomatik tür belirleme
    if (ax.type !== '-') return;

    var id = ax._id;
    var axLetter = id.charAt(0);

    var calAttr = axLetter + 'calendar';
    var calendar = ax[calAttr];

    ax.type = autoType(data, calendar, {
        autotypenumbers: ax.autotypenumbers
    });
}
