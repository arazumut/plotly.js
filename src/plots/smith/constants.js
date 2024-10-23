'use strict';

module.exports = {
    attr: 'altgrafik',
    name: 'smith',

    eksenIsimleri: [
        'gerçekEksen',
        'hayaliEksen' // hayali eksen burada ikinci olmalı ki `tickvals` varsayılanları gerçek eksenden miras alınabilsin
    ],
    eksenIsmi2veriDizisi: {hayaliEksen: 'hayali', gerçekEksen: 'gerçek'},
};
