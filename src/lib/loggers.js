'use strict';

/* eslint-disable no-console */

var varsayilanAyar = require('../plot_api/plot_config').dfltConfig;

var bildirim = require('./notifier');

var kayitlayicilar = module.exports = {};

/**
 * ------------------------------------------
 * hata ayıklama araçları
 * ------------------------------------------
 */

kayitlayicilar.log = function() {
    var i;

    if(varsayilanAyar.logging > 1) {
        var mesajlar = ['LOG:'];
        for(i = 0; i < arguments.length; i++) {
            mesajlar.push(arguments[i]);
        }
        console.trace.apply(console, mesajlar);
    }

    if(varsayilanAyar.notifyOnLogging > 1) {
        var satirlar = [];
        for(i = 0; i < arguments.length; i++) {
            satirlar.push(arguments[i]);
        }
        bildirim(satirlar.join('<br>'), 'uzun');
    }
};

kayitlayicilar.warn = function() {
    var i;

    if(varsayilanAyar.logging > 0) {
        var mesajlar = ['UYARI:'];
        for(i = 0; i < arguments.length; i++) {
            mesajlar.push(arguments[i]);
        }
        console.trace.apply(console, mesajlar);
    }

    if(varsayilanAyar.notifyOnLogging > 0) {
        var satirlar = [];
        for(i = 0; i < arguments.length; i++) {
            satirlar.push(arguments[i]);
        }
        bildirim(satirlar.join('<br>'), 'yapışkan');
    }
};

kayitlayicilar.error = function() {
    var i;

    if(varsayilanAyar.logging > 0) {
        var mesajlar = ['HATA:'];
        for(i = 0; i < arguments.length; i++) {
            mesajlar.push(arguments[i]);
        }
        console.error.apply(console, mesajlar);
    }

    if(varsayilanAyar.notifyOnLogging > 0) {
        var satirlar = [];
        for(i = 0; i < arguments.length; i++) {
            satirlar.push(arguments[i]);
        }
        bildirim(satirlar.join('<br>'), 'yapışkan');
    }
};
