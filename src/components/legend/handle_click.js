'use strict';

var Registry = require('../../registry');
var Lib = require('../../lib');
var pushUnique = Lib.pushUnique;

var GOSTERIZOLASYONTIP = true;

module.exports = function handleClick(g, gd, numClicks) {
    var tamYerlesim = gd._fullLayout;

    if(gd._dragged || gd._editing) return;

    var ogeTiklama = tamYerlesim.legend.itemclick;
    var ogeCiftTiklama = tamYerlesim.legend.itemdoubleclick;
    var grupTiklama = tamYerlesim.legend.groupclick;

    if(numClicks === 1 && ogeTiklama === 'toggle' && ogeCiftTiklama === 'toggleothers' &&
        GOSTERIZOLASYONTIP && gd.data && gd._context.showTips
    ) {
        Lib.notifier(Lib._(gd, 'Bir izi izole etmek için lejant üzerine çift tıklayın'), 'long');
        GOSTERIZOLASYONTIP = false;
    } else {
        GOSTERIZOLASYONTIP = false;
    }

    var mod;
    if(numClicks === 1) mod = ogeTiklama;
    else if(numClicks === 2) mod = ogeCiftTiklama;
    if(!mod) return;

    var grupToggle = grupTiklama === 'togglegroup';

    var gizliDilimler = tamYerlesim.hiddenlabels ?
        tamYerlesim.hiddenlabels.slice() :
        [];

    var legendOgesi = g.data()[0][0];
    if(legendOgesi.groupTitle && legendOgesi.noClick) return;

    var tamVeri = gd._fullData;
    var lejantliSekiller = (tamYerlesim.shapes || []).filter(function(d) { return d.showlegend; });
    var tumLegendOgesi = tamVeri.concat(lejantliSekiller);

    var tamIz = legendOgesi.trace;
    if(tamIz._isShape) {
        tamIz = tamIz._fullInput;
    }

    var legendGrubu = tamIz.legendgroup;

    var i, j, kcont, key, keys, val;
    var veriGuncelleme = {};
    var veriIndeksleri = [];
    var carrs = [];
    var carrIdx = [];

    function veriGuncellemeEkle(izIndeksi, deger) {
        var attrIndex = veriIndeksleri.indexOf(izIndeksi);
        var degerDizisi = veriGuncelleme.visible;
        if(!degerDizisi) {
            degerDizisi = veriGuncelleme.visible = [];
        }

        if(veriIndeksleri.indexOf(izIndeksi) === -1) {
            veriIndeksleri.push(izIndeksi);
            attrIndex = veriIndeksleri.length - 1;
        }

        degerDizisi[attrIndex] = deger;

        return attrIndex;
    }

    var guncellenmisSekiller = (tamYerlesim.shapes || []).map(function(d) {
        return d._input;
    });

    var sekillerGuncellendi = false;

    function sekilGuncellemeEkle(sekilIndeksi, deger) {
        guncellenmisSekiller[sekilIndeksi].visible = deger;
        sekillerGuncellendi = true;
    }

    function gorunurlukAyarla(tamIz, gorunurluk) {
        if(legendOgesi.groupTitle && !grupToggle) return;

        var tamGirdi = tamIz._fullInput || tamIz;
        var sekilMi = tamGirdi._isShape;
        var indeks = tamGirdi.index;
        if(indeks === undefined) indeks = tamGirdi._index;

        if(Registry.hasTransform(tamGirdi, 'groupby')) {
            var kcont = carrs[indeks];
            if(!kcont) {
                var groupbyIndeksleri = Registry.getTransformIndices(tamGirdi, 'groupby');
                var sonGroupbyIndeksi = groupbyIndeksleri[groupbyIndeksleri.length - 1];
                kcont = Lib.keyedContainer(tamGirdi, 'transforms[' + sonGroupbyIndeksi + '].styles', 'target', 'value.visible');
                carrs[indeks] = kcont;
            }

            var mevcutDurum = kcont.get(tamIz._group);

            if(mevcutDurum === undefined) {
                mevcutDurum = true;
            }

            if(mevcutDurum !== false) {
                kcont.set(tamIz._group, gorunurluk);
            }
            carrIdx[indeks] = veriGuncellemeEkle(indeks, tamGirdi.visible === false ? false : true);
        } else {
            var sonrakiGorunurluk = tamGirdi.visible === false ? false : gorunurluk;

            if(sekilMi) {
                sekilGuncellemeEkle(indeks, sonrakiGorunurluk);
            } else {
                veriGuncellemeEkle(indeks, sonrakiGorunurluk);
            }
        }
    }

    var buLegend = tamIz.legend;

    var tamGirdi = tamIz._fullInput;
    var sekilMi = tamGirdi && tamGirdi._isShape;

    if(!sekilMi && Registry.traceIs(tamIz, 'pie-like')) {
        var buEtiket = legendOgesi.label;
        var buEtiketIndeksi = gizliDilimler.indexOf(buEtiket);

        if(mod === 'toggle') {
            if(buEtiketIndeksi === -1) gizliDilimler.push(buEtiket);
            else gizliDilimler.splice(buEtiketIndeksi, 1);
        } else if(mod === 'toggleothers') {
            var degisti = buEtiketIndeksi !== -1;
            var gizliListesi = [];
            for(i = 0; i < gd.calcdata.length; i++) {
                var cdi = gd.calcdata[i];
                for(j = 0; j < cdi.length; j++) {
                    var d = cdi[j];
                    var dEtiket = d.label;

                    if(buLegend === cdi[0].trace.legend) {
                        if(buEtiket !== dEtiket) {
                            if(gizliDilimler.indexOf(dEtiket) === -1) degisti = true;
                            pushUnique(gizliDilimler, dEtiket);
                            gizliListesi.push(dEtiket);
                        }
                    }
                }
            }

            if(!degisti) {
                for(var q = 0; q < gizliListesi.length; q++) {
                    var pos = gizliDilimler.indexOf(gizliListesi[q]);
                    if(pos !== -1) {
                        gizliDilimler.splice(pos, 1);
                    }
                }
            }
        }

        Registry.call('_guiRelayout', gd, 'hiddenlabels', gizliDilimler);
    } else {
        var legendGrubuVarMi = legendGrubu && legendGrubu.length;
        var gruptakiIzIndeksleri = [];
        var izIndeksi;
        if(legendGrubuVarMi) {
            for(i = 0; i < tumLegendOgesi.length; i++) {
                izIndeksi = tumLegendOgesi[i];
                if(!izIndeksi.visible) continue;
                if(izIndeksi.legendgroup === legendGrubu) {
                    gruptakiIzIndeksleri.push(i);
                }
            }
        }

        if(mod === 'toggle') {
            var sonrakiGorunurluk;

            switch(tamIz.visible) {
                case true:
                    sonrakiGorunurluk = 'legendonly';
                    break;
                case false:
                    sonrakiGorunurluk = false;
                    break;
                case 'legendonly':
                    sonrakiGorunurluk = true;
                    break;
            }

            if(legendGrubuVarMi) {
                if(grupToggle) {
                    for(i = 0; i < tumLegendOgesi.length; i++) {
                        var oge = tumLegendOgesi[i];
                        if(oge.visible !== false && oge.legendgroup === legendGrubu) {
                            gorunurlukAyarla(oge, sonrakiGorunurluk);
                        }
                    }
                } else {
                    gorunurlukAyarla(tamIz, sonrakiGorunurluk);
                }
            } else {
                gorunurlukAyarla(tamIz, sonrakiGorunurluk);
            }
        } else if(mod === 'toggleothers') {
            var tiklananMi, gruptaMi, legenddeDegil, digerDurum, _oge;
            var izoleMi = true;
            for(i = 0; i < tumLegendOgesi.length; i++) {
                _oge = tumLegendOgesi[i];
                tiklananMi = _oge === tamIz;
                legenddeDegil = _oge.showlegend !== true;
                if(tiklananMi || legenddeDegil) continue;

                gruptaMi = (legendGrubuVarMi && _oge.legendgroup === legendGrubu);

                if(!gruptaMi && _oge.legend === buLegend && _oge.visible === true && !Registry.traceIs(_oge, 'notLegendIsolatable')) {
                    izoleMi = false;
                    break;
                }
            }

            for(i = 0; i < tumLegendOgesi.length; i++) {
                _oge = tumLegendOgesi[i];

                if(_oge.visible === false || _oge.legend !== buLegend) continue;

                if(Registry.traceIs(_oge, 'notLegendIsolatable')) {
                    continue;
                }

                switch(tamIz.visible) {
                    case 'legendonly':
                        gorunurlukAyarla(_oge, true);
                        break;
                    case true:
                        digerDurum = izoleMi ? true : 'legendonly';
                        tiklananMi = _oge === tamIz;
                        legenddeDegil = (_oge.showlegend !== true && !_oge.legendgroup);
                        gruptaMi = tiklananMi || (legendGrubuVarMi && _oge.legendgroup === legendGrubu);
                        gorunurlukAyarla(_oge, (gruptaMi || legenddeDegil) ? true : digerDurum);
                        break;
                }
            }
        }

        for(i = 0; i < carrs.length; i++) {
            kcont = carrs[i];
            if(!kcont) continue;
            var guncelleme = kcont.constructUpdate();

            var guncellemeAnahtarlari = Object.keys(guncelleme);
            for(j = 0; j < guncellemeAnahtarlari.length; j++) {
                key = guncellemeAnahtarlari[j];
                val = veriGuncelleme[key] = veriGuncelleme[key] || [];
                val[carrIdx[i]] = guncelleme[key];
            }
        }

        keys = Object.keys(veriGuncelleme);
        for(i = 0; i < keys.length; i++) {
            key = keys[i];
            for(j = 0; j < veriIndeksleri.length; j++) {
                if(!veriGuncelleme[key].hasOwnProperty(j)) {
                    veriGuncelleme[key][j] = undefined;
                }
            }
        }

        if(sekillerGuncellendi) {
            Registry.call('_guiUpdate', gd, veriGuncelleme, {shapes: guncellenmisSekiller}, veriIndeksleri);
        } else {
            Registry.call('_guiRestyle', gd, veriGuncelleme, veriIndeksleri);
        }
    }
};
