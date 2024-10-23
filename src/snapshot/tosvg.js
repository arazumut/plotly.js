'use strict';

var d3 = require('@plotly/d3');

var Lib = require('../lib');
var Drawing = require('../components/drawing');
var Color = require('../components/color');

var xmlnsNamespaces = require('../constants/xmlns_namespaces');
var DOUBLEQUOTE_REGEX = /"/g;
var DUMMY_SUB = 'TOBESTRIPPED';
var DUMMY_REGEX = new RegExp('("' + DUMMY_SUB + ')|(' + DUMMY_SUB + '")', 'g');

function htmlEntityDecode(s) {
    var gizliDiv = d3.select('body').append('div').style({display: 'none'}).html('');
    var degistirilmis = s.replace(/(&[^;]*;)/gi, function(d) {
        if(d === '&lt;') { return '&#60;'; } // köşeli parantezler için özel işlem
        if(d === '&rt;') { return '&#62;'; }
        if(d.indexOf('<') !== -1 || d.indexOf('>') !== -1) { return ''; }
        return gizliDiv.html(d).text(); // diğer her şey için tarayıcının unicode'a çevirmesine izin ver
    });
    gizliDiv.remove();
    return degistirilmis;
}

function xmlEntityEncode(str) {
    return str.replace(/&(?!\w+;|\#[0-9]+;| \#x[0-9A-F]+;)/g, '&amp;');
}

module.exports = function toSVG(gd, format, scale) {
    var tamLayout = gd._fullLayout;
    var svg = tamLayout._paper;
    var ustKagit = tamLayout._toppaper;
    var genislik = tamLayout.width;
    var yukseklik = tamLayout.height;
    var i;

    // arka plan rengini svg'de bir dikdörtgen yap, sonra kazıdıktan sonra geri al
    svg.insert('rect', ':first-child')
        .call(Drawing.setRect, 0, 0, genislik, yukseklik)
        .call(Color.fill, tamLayout.paper_bgcolor);

    // alt grafiklere özgü SVG'ye dönüştürme yöntemleri
    var temelGrafikModulleri = tamLayout._basePlotModules || [];
    for(i = 0; i < temelGrafikModulleri.length; i++) {
        var _modul = temelGrafikModulleri[i];

        if(_modul.toSVG) _modul.toSVG(gd);
    }

    // üst öğeleri ekle
    if(ustKagit) {
        var dugumler = ustKagit.node().childNodes;

        // düğümlerin kopyasını yap
        var ustGruplar = Array.prototype.slice.call(dugumler);

        for(i = 0; i < ustGruplar.length; i++) {
            var ustGrup = ustGruplar[i];

            if(ustGrup.childNodes.length) svg.node().appendChild(ustGrup);
        }
    }

    // Adobe Illustrator uyumluluğu için sürükleme katmanını kaldır
    if(tamLayout._draggers) {
        tamLayout._draggers.remove();
    }

    // svg öğesinin açık bir arka plan rengi varsa, bunu kaldır
    svg.node().style.background = '';

    svg.selectAll('text')
        .attr({'data-unformatted': null, 'data-math': null})
        .each(function() {
            var txt = d3.select(this);

            // gizli metin, mathjax'ı önceden biçimlendiriyor, tarayıcı bunu görmezden geliyor
            if(this.style.visibility === 'hidden' || this.style.display === 'none') {
                txt.remove();
                return;
            } else {
                // diğer görünürlük/görüntüleme değerlerini varsayılan olarak temizle
                txt.style({visibility: null, display: null});
            }

            // Yazı tipi ailesi stilleri tırnak işaretleri nedeniyle sorun çıkarır,
            // bu yüzden SVG DOM'u bir dizeye serileştirildikten sonra bunları kaldırmalıyız
            var ff = this.style.fontFamily;
            if(ff && ff.indexOf('"') !== -1) {
                txt.style('font-family', ff.replace(DOUBLEQUOTE_REGEX, DUMMY_SUB));
            }

            // Normal yazı tipi ağırlığını, stilini ve varyantını düşür
            var fw = this.style.fontWeight;
            if(fw && (fw === 'normal' || fw === '400')) {
                txt.style('font-weight', undefined);
            }
            var fs = this.style.fontStyle;
            if(fs && fs === 'normal') {
                txt.style('font-style', undefined);
            }
            var fv = this.style.fontVariant;
            if(fv && fv === 'normal') {
                txt.style('font-variant', undefined);
            }
        });

    svg.selectAll('.gradient_filled,.pattern_filled').each(function() {
        var pt = d3.select(this);

        // benzer şekilde, SVG DOM'u serileştirildikten sonra " işaretlerini kaldırmalıyız
        var fill = this.style.fill;
        if(fill && fill.indexOf('url(') !== -1) {
            pt.style('fill', fill.replace(DOUBLEQUOTE_REGEX, DUMMY_SUB));
        }

        var stroke = this.style.stroke;
        if(stroke && stroke.indexOf('url(') !== -1) {
            pt.style('stroke', stroke.replace(DOUBLEQUOTE_REGEX, DUMMY_SUB));
        }
    });

    if(format === 'pdf' || format === 'eps') {
        // bu formatlar bazı durumlarda semboller etrafındaki ekstra çizgiyi çok kalın gösterir
        svg.selectAll('#MathJax_SVG_glyphs path')
            .attr('stroke-width', 0);
    }

    // IE ad alanı tuhaflığı için düzeltme
    svg.node().setAttributeNS(xmlnsNamespaces.xmlns, 'xmlns', xmlnsNamespaces.svg);
    svg.node().setAttributeNS(xmlnsNamespaces.xmlns, 'xmlns:xlink', xmlnsNamespaces.xlink);

    if(format === 'svg' && scale) {
        svg.attr('width', scale * genislik);
        svg.attr('height', scale * yukseklik);
        svg.attr('viewBox', '0 0 ' + genislik + ' ' + yukseklik);
    }

    var s = new window.XMLSerializer().serializeToString(svg.node());
    s = htmlEntityDecode(s);
    s = xmlEntityEncode(s);

    // Yazı tipi dizeleri ve gradyan URL'leri etrafındaki tırnak işaretlerini düzelt
    s = s.replace(DUMMY_REGEX, '\'');

    // IE için temizleme işlemi
    if(Lib.isIE()) {
        s = s.replace(/"/gi, '\'');
        s = s.replace(/(\('#)([^']*)('\))/gi, '(\"#$2\")');
        s = s.replace(/(\\')/gi, '\"');
    }

    return s;
};
