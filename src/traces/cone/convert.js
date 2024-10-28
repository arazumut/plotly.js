'use strict';

// Gerekli modülleri içe aktar
var koniGrafik = require('../../../stackgl_modules').gl_cone3d;
var koniMeshOlustur = require('../../../stackgl_modules').gl_cone3d.createConeMesh;

var basitHarita = require('../../lib').simpleMap;
var renkSkalasiCoz = require('../../lib/gl_format_color').parseColorScale;
var renkSkalasiSecenekleri = require('../../components/colorscale').extractOpts;
var diziVeyaTypedArrayMi = require('../../lib').isArrayOrTypedArray;
var zip3 = require('../../plots/gl3d/zip3');

// Koni sınıfı tanımla
function Koni(scene, uid) {
    this.scene = scene;
    this.uid = uid;
    this.mesh = null;
    this.data = null;
}

var proto = Koni.prototype;

// Seçimi işle fonksiyonu
proto.secimiIsle = function(selection) {
    if(selection.object === this.mesh) {
        var secimIndeksi = selection.index = selection.data.index;
        var xx = this.data.x[secimIndeksi];
        var yy = this.data.y[secimIndeksi];
        var zz = this.data.z[secimIndeksi];
        var uu = this.data.u[secimIndeksi];
        var vv = this.data.v[secimIndeksi];
        var ww = this.data.w[secimIndeksi];

        selection.traceCoordinate = [
            xx, yy, zz,
            uu, vv, ww,
            Math.sqrt(uu * uu + vv * vv + ww * ww)
        ];

        var text = this.data.hovertext || this.data.text;
        if(diziVeyaTypedArrayMi(text) && text[secimIndeksi] !== undefined) {
            selection.textLabel = text[secimIndeksi];
        } else if(text) {
            selection.textLabel = text;
        }

        return true;
    }
};

// Eksen adı ve ölçek indeksi eşleştirmeleri
var eksenAdi2olcekIndeksi = {xaxis: 0, yaxis: 1, zaxis: 2};
var anchor2konikOffset = {tip: 1, tail: 0, cm: 0.25, center: 0.5};
var anchor2konikSpan = {tip: 1, tail: 1, cm: 0.75, center: 0.5};

// Dönüştür fonksiyonu
function donustur(scene, trace) {
    var sceneLayout = scene.fullSceneLayout;
    var dataScale = scene.dataScale;
    var konikOpts = {};

    function veriKoordinatlarinaCevir(arr, eksenAdi) {
        var ax = sceneLayout[eksenAdi];
        var scale = dataScale[eksenAdi2olcekIndeksi[eksenAdi]];
        return basitHarita(arr, function(v) { return ax.d2l(v) * scale; });
    }

    konikOpts.vectors = zip3(
        veriKoordinatlarinaCevir(trace.u, 'xaxis'),
        veriKoordinatlarinaCevir(trace.v, 'yaxis'),
        veriKoordinatlarinaCevir(trace.w, 'zaxis'),
        trace._len
    );

    konikOpts.positions = zip3(
        veriKoordinatlarinaCevir(trace.x, 'xaxis'),
        veriKoordinatlarinaCevir(trace.y, 'yaxis'),
        veriKoordinatlarinaCevir(trace.z, 'zaxis'),
        trace._len
    );

    var cOpts = renkSkalasiSecenekleri(trace);
    konikOpts.colormap = renkSkalasiCoz(trace);
    konikOpts.vertexIntensityBounds = [cOpts.min / trace._normMax, cOpts.max / trace._normMax];
    konikOpts.coneOffset = anchor2konikOffset[trace.anchor];

    var sizemode = trace.sizemode;
    if(sizemode === 'scaled') {
        konikOpts.coneSize = trace.sizeref || 0.5;
    } else if(sizemode === 'absolute') {
        konikOpts.coneSize = trace.sizeref && trace._normMax ?
            trace.sizeref / trace._normMax :
            0.5;
    } else if(sizemode === 'raw') {
        konikOpts.coneSize = trace.sizeref;
    }
    konikOpts.coneSizemode = sizemode;

    var meshData = koniGrafik(konikOpts);

    var lp = trace.lightposition;
    meshData.lightPosition = [lp.x, lp.y, lp.z];
    meshData.ambient = trace.lighting.ambient;
    meshData.diffuse = trace.lighting.diffuse;
    meshData.specular = trace.lighting.specular;
    meshData.roughness = trace.lighting.roughness;
    meshData.fresnel = trace.lighting.fresnel;
    meshData.opacity = trace.opacity;

    trace._pad = anchor2konikSpan[trace.anchor] * meshData.vectorScale * meshData.coneScale * trace._normMax;

    return meshData;
}

// Güncelle fonksiyonu
proto.update = function(data) {
    this.data = data;

    var meshData = donustur(this.scene, data);
    this.mesh.update(meshData);
};

// Temizle fonksiyonu
proto.dispose = function() {
    this.scene.glplot.remove(this.mesh);
    this.mesh.dispose();
};

// Koni iz oluştur fonksiyonu
function konikIzOlustur(scene, data) {
    var gl = scene.glplot.gl;

    var meshData = donustur(scene, data);
    var mesh = koniMeshOlustur(gl, meshData);

    var konik = new Koni(scene, data.uid);
    konik.mesh = mesh;
    konik.data = data;
    mesh._trace = konik;

    scene.glplot.add(mesh);

    return konik;
}

module.exports = konikIzOlustur;
