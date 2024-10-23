'use strict';

var Renk = require('../../components/color');
var Şablon = require('../../plot_api/plot_template');
var Lib = require('../../lib');

var AltGrafikVarsayılanlarınıEleAl = require('../subplot_defaults');
var EtiketVarsayılanlarınıEleAl = require('../cartesian/tick_label_defaults');
var ÖnEkSonEkVarsayılanlarınıEleAl = require('../cartesian/prefix_suffix_defaults');
var İşaretVarsayılanlarınıEleAl = require('../cartesian/tick_mark_defaults');
var DeğerVarsayılanlarınıEleAl = require('../cartesian/tick_value_defaults');
var ÇizgiIzgaraVarsayılanlarınıEleAl = require('../cartesian/line_grid_defaults');
var yerleşimÖznitelikleri = require('./layout_attributes');

var eksenAdları = ['aekseni', 'bekseni', 'cekseni'];

module.exports = function yerleşimVarsayılanlarınıSağla(yerleşimGirdi, yerleşimÇıktı, tamVeri) {
    AltGrafikVarsayılanlarınıEleAl(yerleşimGirdi, yerleşimÇıktı, tamVeri, {
        tür: 'üçlü',
        öznitelikler: yerleşimÖznitelikleri,
        varsayılanlarıEleAl: ÜçlüVarsayılanlarıEleAl,
        yazıtipi: yerleşimÇıktı.yazıtipi,
        kağıt_arkaplanrengi: yerleşimÇıktı.kağıt_arkaplanrengi
    });
};

function ÜçlüVarsayılanlarıEleAl(üçlüYerleşimGirdi, üçlüYerleşimÇıktı, zorla, seçenekler) {
    var arkaPlanRengi = zorla('arkaplanrengi');
    var toplam = zorla('toplam');
    seçenekler.arkaPlanRengi = Renk.birleştir(arkaPlanRengi, seçenekler.kağıt_arkaplanrengi);
    var eksenAdı, konteynerGirdi, konteynerÇıktı;

    // TODO: Çoğu (hatta tüm) eksen özniteliklerinin dış konteynerde ayarlanmasına ve
    // bireysel eksenlerde varsayılan olarak kullanılmasına izin ver?

    for(var j = 0; j < eksenAdları.length; j++) {
        eksenAdı = eksenAdları[j];
        konteynerGirdi = üçlüYerleşimGirdi[eksenAdı] || {};
        konteynerÇıktı = Şablon.yeniKonteyner(üçlüYerleşimÇıktı, eksenAdı);
        konteynerÇıktı._adı = eksenAdı;

        EksenVarsayılanlarınıEleAl(konteynerGirdi, konteynerÇıktı, seçenekler, üçlüYerleşimÇıktı);
    }

    // Eğer min değerler birbiriyle çelişiyorsa, hepsini varsayılan (0) olarak ayarla
    // ve *tüm* girdileri sil, böylece kullanıcı daha sonra birini değiştirip
    // hepsinin değiştiğini görüp kafası karışmaz.
    var aekseni = üçlüYerleşimÇıktı.aekseni;
    var bekseni = üçlüYerleşimÇıktı.bekseni;
    var cekseni = üçlüYerleşimÇıktı.cekseni;
    if(aekseni.min + bekseni.min + cekseni.min >= toplam) {
        aekseni.min = 0;
        bekseni.min = 0;
        cekseni.min = 0;
        if(üçlüYerleşimGirdi.aekseni) delete üçlüYerleşimGirdi.aekseni.min;
        if(üçlüYerleşimGirdi.bekseni) delete üçlüYerleşimGirdi.bekseni.min;
        if(üçlüYerleşimGirdi.cekseni) delete üçlüYerleşimGirdi.cekseni.min;
    }
}

function EksenVarsayılanlarınıEleAl(konteynerGirdi, konteynerÇıktı, seçenekler, üçlüYerleşimÇıktı) {
    var eksenÖznitelikleri = yerleşimÖznitelikleri[konteynerÇıktı._adı];

    function zorla(öznitelik, varsayılan) {
        return Lib.zorla(konteynerGirdi, konteynerÇıktı, eksenÖznitelikleri, öznitelik, varsayılan);
    }

    zorla('uirevision', üçlüYerleşimÇıktı.uirevision);

    konteynerÇıktı.tür = 'doğrusal'; // üçlü için başka türler izin verilmez

    var varsayılanRenk = zorla('renk');
    // Eğer eksen.renk sağlanmışsa, yazıtipleri için de kullan; aksi takdirde,
    // global yazıtipi renginden miras al, eğer sağlanmışsa.
    var varsayılanYazıtipiRengi = (varsayılanRenk !== eksenÖznitelikleri.renk.varsayılan) ? varsayılanRenk : seçenekler.yazıtipi.renk;

    var eksenAdı = konteynerÇıktı._adı;
    var harfBüyük = eksenAdı.charAt(0).toUpperCase();
    var varsayılanBaşlık = 'Bileşen ' + harfBüyük;

    var başlık = zorla('başlık.metin', varsayılanBaşlık);
    konteynerÇıktı._hoverbaşlık = başlık === varsayılanBaşlık ? başlık : harfBüyük;

    Lib.zorlaYazıtipi(zorla, 'başlık.yazıtipi', seçenekler.yazıtipi, { varsayılanıGeçersizKıl: {
        boyut: Lib.büyükYazıtipi(seçenekler.yazıtipi.boyut),
        renk: varsayılanYazıtipiRengi
    }});

    // aralık sadece 'min' ile ayarlanır - maksimum diğer eksenlerin min değerleriyle belirlenir
    zorla('min');

    handleTickValueDefaults(containerIn, containerOut, coerce, 'linear');
    handlePrefixSuffixDefaults(containerIn, containerOut, coerce, 'linear');
    handleTickLabelDefaults(containerIn, containerOut, coerce, 'linear', {
        noAutotickangles: true,
        noTicklabelshift: true,
        noTicklabelstandoff: true
    });
    handleTickMarkDefaults(containerIn, containerOut, coerce,
        { outerTicks: true });

    var showTickLabels = coerce('showticklabels');
    if(showTickLabels) {
        Lib.coerceFont(coerce, 'tickfont', options.font, { overrideDflt: {
            color: dfltFontColor
        }});
        coerce('tickangle');
        coerce('tickformat');
    }

    handleLineGridDefaults(containerIn, containerOut, coerce, {
        dfltColor: dfltColor,
        bgColor: options.bgColor,
        // default grid color is darker here (60%, vs cartesian default ~91%)
        // because the grid is not square so the eye needs heavier cues to follow
        blend: 60,
        showLine: true,
        showGrid: true,
        noZeroLine: true,
        attributes: axAttrs
    });

    coerce('hoverformat');
    coerce('layer');
}
