'use strict';

var dokumanlar = require('../../constants/docs');
var FORMAT_LINK = dokumanlar.FORMAT_LINK;
var DATE_FORMAT_LINK = dokumanlar.DATE_FORMAT_LINK;

function eksenHoverFormat(x, tarihYok) {
    return {
        valType: 'string',
        dflt: '',
        editType: 'none',
        description: (
            tarihYok ? sadeceSayiAciklamasi : tarihliAciklama
        )('hover metni', x) + [
            'Varsayılan olarak değerler ' + (
                tarihYok ?
                    'genel sayı formatı' :
                    ('`' + x + 'ekseni.hoverformat`')
            ) + ' kullanılarak formatlanır.',
        ].join(' ')
    };
}

function sadeceSayiAciklamasi(etiket, x) {
    return [
        'Sets the ' + etiket + ' formatlama kuralı' + (x ? 'için `' + x + '` ' : ''),
        'd3 formatlama mini-dillerini kullanarak',
        'Python\'dakilere çok benzerdir. Sayılar için bkz: ' + FORMAT_LINK + '.'
    ].join(' ');
}

function tarihliAciklama(etiket, x) {
    return sadeceSayiAciklamasi(etiket, x) + [
        ' Ve tarihler için bkz: ' + DATE_FORMAT_LINK + '.',
        'd3\'ün tarih formatlayıcısına iki öğe ekliyoruz:',
        '*%h* yılın yarısı için ondalık sayı olarak ve',
        '*%{n}f* kesirli saniyeler',
        'n basamaklı. Örneğin, *2016-10-13 09:15:23.456* ile tickformat',
        '*%H~%M~%S.%2f* *09~15~23.46* olarak görüntülenir'
    ].join(' ');
}

module.exports = {
    eksenHoverFormat: eksenHoverFormat,
    sadeceSayiAciklamasi: sadeceSayiAciklamasi,
    tarihliAciklama: tarihliAciklama
};
