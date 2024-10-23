'use strict';

module.exports = {
    xaxis: {
        valType: 'subplotid',
        dflt: 'x',
        editType: 'calc+clearAxisTypes',
        description: [
            'Bu izleme (trace) nesnesinin x koordinatları ile',
            '2D kartezyen x ekseni arasında bir referans ayarlar.',
            'Eğer *x* (varsayılan değer) ise, x koordinatları',
            '`layout.xaxis` ile ilişkilidir.',
            'Eğer *x2* ise, x koordinatları `layout.xaxis2` ile ilişkilidir ve bu şekilde devam eder.'
        ].join(' ')
    },
    yaxis: {
        valType: 'subplotid',
        dflt: 'y',
        editType: 'calc+clearAxisTypes',
        description: [
            'Bu izleme (trace) nesnesinin y koordinatları ile',
            '2D kartezyen y ekseni arasında bir referans ayarlar.',
            'Eğer *y* (varsayılan değer) ise, y koordinatları',
            '`layout.yaxis` ile ilişkilidir.',
            'Eğer *y2* ise, y koordinatları `layout.yaxis2` ile ilişkilidir ve bu şekilde devam eder.'
        ].join(' ')
    }
};
