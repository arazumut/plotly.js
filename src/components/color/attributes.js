'use strict';

// ÖNEMLİ - varsayılan renkler uyumluluk için hex formatında olmalıdır
exports.defaults = [
    '#1f77b4',  // soluk mavi
    '#ff7f0e',  // güvenlik turuncusu
    '#2ca02c',  // pişmiş kuşkonmaz yeşili
    '#d62728',  // tuğla kırmızısı
    '#9467bd',  // soluk mor
    '#8c564b',  // kestane kahverengisi
    '#e377c2',  // ahududu yoğurt pembesi
    '#7f7f7f',  // orta gri
    '#bcbd22',  // köri sarı-yeşili
    '#17becf'   // mavi-yeşil
];

exports.defaultLine = '#444';  // varsayılan çizgi rengi

exports.lightLine = '#eee';  // açık çizgi rengi

exports.background = '#fff';  // arka plan rengi

exports.borderLine = '#BEC8D9';  // kenar çizgisi rengi

// axis.color ve Color.interp ile lightLine'ı artık kullanmıyoruz
// bunun yerine tinycolor.mix kullanarak axis.color ve arka plan rengi arasında geçiş yapıyoruz.
// lightFraction, diğer renkler varsayılan ise tam olarak lightLine'ı geri verir.
exports.lightFraction = 100 * (0xe - 0x4) / (0xf - 0x4);
