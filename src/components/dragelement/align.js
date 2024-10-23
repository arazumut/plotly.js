'use strict';

// Sürükleme sırasında otomatik hizalama için, <1/3 sol hizalama,
// >2/3 sağ hizalama ve arası merkezdir. Bulunduğunuz yere göre doğru
// kesiri seçin ve nesne üzerindeki o konuma karşılık gelen kesiri döndürün.
module.exports = function hizala(v, dv, v0, v1, anchor) {
    var vmin = (v - v0) / (v1 - v0);
    var vmax = vmin + dv / (v1 - v0);
    var vc = (vmin + vmax) / 2;

    // Açıkça belirtilmiş anchor (çapa)
    if(anchor === 'left' || anchor === 'bottom') return vmin;
    if(anchor === 'center' || anchor === 'middle') return vc;
    if(anchor === 'right' || anchor === 'top') return vmax;

    // Konuma göre otomatik
    if(vmin < (2 / 3) - vc) return vmin;
    if(vmax > (4 / 3) - vc) return vmax;
    return vc;
};
