'use strict';

var KayıtDefteri = require('../../registry');
var yardımcılar = require('./helpers');

module.exports = function efsaneVerileriniAl(hesapVerileri, seçenekler, birdenFazlaEfsaneVarMı) {
    var hoverda = seçenekler._inHover;
    var gruplandırılmış = yardımcılar.gruplandırılmışMı(seçenekler);
    var tersineÇevrilmiş = yardımcılar.tersineÇevrilmişMı(seçenekler);

    var grupİzlerineEfsane = {};
    var gruplar = [];
    var birBoşOlmayanGrupVar = false;
    var dilimlerGösterildi = {};
    var grupIndex = 0;
    var maxİsimUzunluğu = 0;
    var i, j;

    function birÖğeEkle(efsaneId, efsaneGrubu, efsaneÖğesi) {
        if(seçenekler.visible === false) return;
        if(birdenFazlaEfsaneVarMı && efsaneId !== seçenekler._id) return;

        // her '' efsane grubu ayrı bir grup olarak ele alınır
        if(efsaneGrubu === '' || !yardımcılar.gruplandırılmışMı(seçenekler)) {
            var benzersizGrup = '~~i' + grupIndex;
            gruplar.push(benzersizGrup);
            grupİzlerineEfsane[benzersizGrup] = [efsaneÖğesi];
            grupIndex++;
        } else if(gruplar.indexOf(efsaneGrubu) === -1) {
            gruplar.push(efsaneGrubu);
            birBoşOlmayanGrupVar = true;
            grupİzlerineEfsane[efsaneGrubu] = [efsaneÖğesi];
        } else {
            grupİzlerineEfsane[efsaneGrubu].push(efsaneÖğesi);
        }
    }

    // bir { efsaneGrubu: [cd0, cd0], ... } nesnesi oluştur
    for(i = 0; i < hesapVerileri.length; i++) {
        var cd = hesapVerileri[i];
        var cd0 = cd[0];
        var iz = cd0.iz;
        var efsaneId = iz.efsane;
        var efsaneGrubu = iz.efsaneGrubu;

        if(!hoverda && (!iz.visible || !iz.showlegend)) continue;

        if(KayıtDefteri.izMi(iz, 'pie-like')) {
            if(!dilimlerGösterildi[efsaneGrubu]) dilimlerGösterildi[efsaneGrubu] = {};

            for(j = 0; j < cd.length; j++) {
                var etiketj = cd[j].etiket;

                if(!dilimlerGösterildi[efsaneGrubu][etiketj]) {
                    birÖğeEkle(efsaneId, efsaneGrubu, {
                        etiket: etiketj,
                        renk: cd[j].renk,
                        i: cd[j].i,
                        iz: iz,
                        noktalar: cd[j].noktalar
                    });

                    dilimlerGösterildi[efsaneGrubu][etiketj] = true;
                    maxİsimUzunluğu = Math.max(maxİsimUzunluğu, (etiketj || '').length);
                }
            }
        } else {
            birÖğeEkle(efsaneId, efsaneGrubu, cd0);
            maxİsimUzunluğu = Math.max(maxİsimUzunluğu, (iz.isim || '').length);
        }
    }

    // bu durumda bir efsane çizmeyecek
    if(!gruplar.length) return [];

    // tüm grupları birleştir eğer tüm gruplar boşsa
    var birleştirmeliMi = !birBoşOlmayanGrupVar || !gruplandırılmış;

    var efsaneVerileri = [];
    for(i = 0; i < gruplar.length; i++) {
        var t = grupİzlerineEfsane[gruplar[i]];
        if(birleştirmeliMi) {
            efsaneVerileri.push(t[0]);
        } else {
            efsaneVerileri.push(t);
        }
    }
    if(birleştirmeliMi) efsaneVerileri = [efsaneVerileri];

    for(i = 0; i < efsaneVerileri.length; i++) {
        // grup içindeki minimum rütbeyi bul
        var grupMinRütbe = Infinity;
        for(j = 0; j < efsaneVerileri[i].length; j++) {
            var rütbe = efsaneVerileri[i][j].iz.efsaneRütbesi;
            if(grupMinRütbe > rütbe) grupMinRütbe = rütbe;
        }

        // ilk grup elemanına kaydet
        efsaneVerileri[i][0]._grupMinRütbe = grupMinRütbe;
        efsaneVerileri[i][0]._önceGrupSıralama = i;
    }

    var sıralamaFn1 = function(a, b) {
        return (
            (a[0]._grupMinRütbe - b[0]._grupMinRütbe) ||
            (a[0]._önceGrupSıralama - b[0]._önceGrupSıralama)
        );
    };

    var sıralamaFn2 = function(a, b) {
        return (
            (a.iz.efsaneRütbesi - b.iz.efsaneRütbesi) ||
            (a._önceSıralama - b._önceSıralama)
        );
    };

    // minimum grup efsane rütbesini dikkate alarak sırala
    efsaneVerileri.forEach(function(a, k) { a[0]._önceGrupSıralama = k; });
    efsaneVerileri.sort(sıralamaFn1);
    for(i = 0; i < efsaneVerileri.length; i++) {
        // iz.efsaneRütbesi ve efsane.izSıralaması dikkate alarak sırala
        efsaneVerileri[i].forEach(function(a, k) { a._önceSıralama = k; });
        efsaneVerileri[i].sort(sıralamaFn2);

        var ilkÖğeİzi = efsaneVerileri[i][0].iz;

        var grupBaşlığı = null;
        // grup başlığı metnini al
        for(j = 0; j < efsaneVerileri[i].length; j++) {
            var gb = efsaneVerileri[i][j].iz.efsaneGrupBaşlığı;
            if(gb && gb.text) {
                grupBaşlığı = gb;
                if(hoverda) gb.font = seçenekler._grupBaşlıkFontu;
                break;
            }
        }

        // sırayı tersine çevir
        if(tersineÇevrilmiş) efsaneVerileri[i].reverse();

        if(grupBaşlığı) {
            var pieBenzeriVar = false;
            for(j = 0; j < efsaneVerileri[i].length; j++) {
                if(KayıtDefteri.izMi(efsaneVerileri[i][j].iz, 'pie-like')) {
                    pieBenzeriVar = true;
                    break;
                }
            }

            // grup başlığı metnini ayarla
            efsaneVerileri[i].unshift({
                i: -1,
                grupBaşlığı: grupBaşlığı,
                tıklamaYok: pieBenzeriVar,
                iz: {
                    showlegend: ilkÖğeİzi.showlegend,
                    efsaneGrubu: ilkÖğeİzi.efsaneGrubu,
                    visible: seçenekler.grupTıklama === 'toggleitem' ? true : ilkÖğeİzi.visible
                }
            });
        }

        // grupİzlerineEfsane'yi d3 dostu bir dizi dizisi haline getir
        for(j = 0; j < efsaneVerileri[i].length; j++) {
            efsaneVerileri[i][j] = [
                efsaneVerileri[i][j]
            ];
        }
    }

    // efsane gruplarının sayısı - legend/draw.js'de gerekli
    seçenekler._gruplarUzunluğu = efsaneVerileri.length;
    // maksimum isim/etiket uzunluğu - legend/draw.js'de gerekli
    seçenekler._maxİsimUzunluğu = maxİsimUzunluğu;

    return efsaneVerileri;
};
