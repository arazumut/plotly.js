'use strict';

var d3 = require('@plotly/d3');
var Drawing = require('../drawing');
var Axes = require('../../plots/cartesian/axes');
var axisIds = require('../../plots/cartesian/axis_ids');
var xmlnsNamespaces = require('../../constants/xmlns_namespaces');

module.exports = function çiz(gd) {
    var tamYerleşim = gd._fullLayout;
    var üsttekiGörseller = [];
    var altGörsellerAltGrafik = {};
    var alttakiGörseller = [];
    var altGrafik;
    var i;

    // Üst, alt grafik ve alt katmanlara göre sıralama
    for(i = 0; i < tamYerleşim.images.length; i++) {
        var img = tamYerleşim.images[i];

        if(img.visible) {
            if(img.layer === 'below' && img.xref !== 'paper' && img.yref !== 'paper') {
                altGrafik = axisIds.ref2id(img.xref) + axisIds.ref2id(img.yref);

                var plotinfo = tamYerleşim._plots[altGrafik];

                if(!plotinfo) {
                    // İstenen alt grafik mevcut değilse _imageLowerLayer'a geri dön.
                    // Bu, görüntüyü x / y ekseni kombinasyonuna referans verirseniz
                    // ve katman aşağıdaysa olabilir.
                    alttakiGörseller.push(img);
                    continue;
                }

                if(plotinfo.mainplot) {
                    altGrafik = plotinfo.mainplot.id;
                }

                if(!altGörsellerAltGrafik[altGrafik]) {
                    altGörsellerAltGrafik[altGrafik] = [];
                }
                altGörsellerAltGrafik[altGrafik].push(img);
            } else if(img.layer === 'above') {
                üsttekiGörseller.push(img);
            } else {
                alttakiGörseller.push(img);
            }
        }
    }

    var sabitleyiciler = {
        x: {
            left: { boyutlandırma: 'xMin', ofset: 0 },
            center: { boyutlandırma: 'xMid', ofset: -1 / 2 },
            right: { boyutlandırma: 'xMax', ofset: -1 }
        },
        y: {
            top: { boyutlandırma: 'YMin', ofset: 0 },
            middle: { boyutlandırma: 'YMid', ofset: -1 / 2 },
            bottom: { boyutlandırma: 'YMax', ofset: -1 }
        }
    };

    // Görseller dışa aktarım için dataURL'lere dönüştürülmelidir.
    function görselAyarla(d) {
        var buGörsel = d3.select(this);

        if(this._imgSrc === d.source) {
            return;
        }

        buGörsel.attr('xmlns', xmlnsNamespaces.svg);

        if(!gd._context.staticPlot || (d.source && d.source.slice(0, 5) === 'data:')) {
            buGörsel.attr('xlink:href', d.source);
            this._imgSrc = d.source;
        } else {
            var görselVaadi = new Promise(function(resolve) {
                var img = new Image();
                this.img = img;

                // Ayarlanmazsa, `tainted canvas` hatası atılır
                img.setAttribute('crossOrigin', 'anonymous');
                img.onerror = hataYöneticisi;
                img.onload = function() {
                    var canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;

                    var ctx = canvas.getContext('2d', {willReadFrequently: true});
                    ctx.drawImage(this, 0, 0);

                    var dataURL = canvas.toDataURL('image/png');

                    buGörsel.attr('xlink:href', dataURL);

                    // IE11'i desteklemek için onload işleyicisinde vaadi çöz
                    // daha fazla ayrıntı için https://github.com/plotly/plotly.js/issues/1685
                    resolve();
                };

                buGörsel.on('error', hataYöneticisi);

                img.src = d.source;
                this._imgSrc = d.source;

                function hataYöneticisi() {
                    buGörsel.remove();
                    resolve();
                }
            }.bind(this));

            gd._promises.push(görselVaadi);
        }
    }

    function öznitelikleriUygula(d) {
        var buGörsel = d3.select(this);

        // Belirtilmiş eksenler
        var xa = Axes.getFromId(gd, d.xref);
        var ya = Axes.getFromId(gd, d.yref);
        var xAlanı = Axes.getRefType(d.xref) === 'domain';
        var yAlanı = Axes.getRefType(d.yref) === 'domain';

        var boyut = tamYerleşim._size;
        var genişlik, yükseklik;
        if(xa !== undefined) {
            genişlik = ((typeof(d.xref) === 'string') && xAlanı) ?
                xa._length * d.sizex :
                Math.abs(xa.l2p(d.sizex) - xa.l2p(0));
        } else {
            genişlik = d.sizex * boyut.w;
        }
        if(ya !== undefined) {
            yükseklik = ((typeof(d.yref) === 'string') && yAlanı) ?
                ya._length * d.sizey :
                Math.abs(ya.l2p(d.sizey) - ya.l2p(0));
        } else {
            yükseklik = d.sizey * boyut.h;
        }

        // Sabitleyici konumlandırma için ofsetler
        var xOfset = genişlik * sabitleyiciler.x[d.xanchor].ofset;
        var yOfset = yükseklik * sabitleyiciler.y[d.yanchor].ofset;

        var boyutlandırma = sabitleyiciler.x[d.xanchor].boyutlandırma + sabitleyiciler.y[d.yanchor].boyutlandırma;

        // Nihai pozisyonlar
        var xPos, yPos;
        if(xa !== undefined) {
            xPos = ((typeof(d.xref) === 'string') && xAlanı) ?
                xa._length * d.x + xa._offset :
                xa.r2p(d.x) + xa._offset;
        } else {
            xPos = d.x * boyut.w + boyut.l;
        }
        xPos += xOfset;
        if(ya !== undefined) {
            yPos = ((typeof(d.yref) === 'string') && yAlanı) ?
                // "paper" yref değeri ile tutarlı, burada pozitif değerler
                // sayfanın yukarısına hareket eder
                ya._length * (1 - d.y) + ya._offset :
                ya.r2p(d.y) + ya._offset;
        } else {
            yPos = boyut.h - d.y * boyut.h + boyut.t;
        }
        yPos += yOfset;

        // Uygun aspectRatio özniteliğini oluştur
        switch(d.sizing) {
            case 'fill':
                boyutlandırma += ' slice';
                break;

            case 'stretch':
                boyutlandırma = 'none';
                break;
        }

        buGörsel.attr({
            x: xPos,
            y: yPos,
            width: genişlik,
            height: yükseklik,
            preserveAspectRatio: boyutlandırma,
            opacity: d.opacity
        });

        // Görsellerde uygun kırpma ayarla
        var xId = xa && (Axes.getRefType(d.xref) !== 'domain') ? xa._id : '';
        var yId = ya && (Axes.getRefType(d.yref) !== 'domain') ? ya._id : '';
        var kırpEksenleri = xId + yId;

        Drawing.setClipUrl(
            buGörsel,
            kırpEksenleri ? ('clip' + tamYerleşim._uid + kırpEksenleri) : null,
            gd
        );
    }

    var altGörseller = tamYerleşim._imageLowerLayer.selectAll('image')
        .data(alttakiGörseller);
    var üstGörseller = tamYerleşim._imageUpperLayer.selectAll('image')
        .data(üsttekiGörseller);

    altGörseller.enter().append('image');
    üstGörseller.enter().append('image');

    altGörseller.exit().remove();
    üstGörseller.exit().remove();

    altGörseller.each(function(d) {
        görselAyarla.bind(this)(d);
        öznitelikleriUygula.bind(this)(d);
    });
    üstGörseller.each(function(d) {
        görselAyarla.bind(this)(d);
        öznitelikleriUygula.bind(this)(d);
    });

    var tümAltGrafikler = Object.keys(tamYerleşim._plots);
    for(i = 0; i < tümAltGrafikler.length; i++) {
        altGrafik = tümAltGrafikler[i];
        var altGrafikObj = tamYerleşim._plots[altGrafik];

        // üst üste binen grafikleri filtrele (görseller ana grafikte)
        if(!altGrafikObj.imagelayer) continue;

        var altGrafiktekiGörseller = altGrafikObj.imagelayer.selectAll('image')
            // bu alt grafikte görsel olmasa bile, enter ve exit'i çalıştırmamız gerekiyor
            // önceki görseller varsa
            .data(altGörsellerAltGrafik[altGrafik] || []);

        altGrafiktekiGörseller.enter().append('image');
        altGrafiktekiGörseller.exit().remove();

        altGrafiktekiGörseller.each(function(d) {
            görselAyarla.bind(this)(d);
            öznitelikleriUygula.bind(this)(d);
        });
    }
};
