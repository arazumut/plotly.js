'use strict';

module.exports = {
    axisRefDescription: function(axisname, lower, upper) {
        return [
            'Eğer bir', axisname, 'ekseni kimliği (örneğin *' + axisname + '* veya',
            '*' + axisname + '2*) olarak ayarlanırsa, `' + axisname + '` pozisyonu bir',
            axisname, 'koordinatına atıfta bulunur. Eğer *paper* olarak ayarlanırsa, `' + axisname + '`',
            'pozisyonu, çizim alanının', lower, 'kısmından normalize edilmiş koordinatlarda',
            'uzaklığı ifade eder, burada *0* (*1*)', lower, '(' + upper + ') ile',
            'eşleşir. Eğer bir', axisname, 'ekseni kimliği ve ardından *domain* (boşluk ile ayrılmış)',
            'olarak ayarlanırsa, pozisyon *paper* gibi davranır, ancak o eksenin',
            'domain uzunluğunun kesirleri cinsinden', lower, 'kısmından uzaklığı ifade eder:',
            'örneğin, *' + axisname + '2 domain* ikinci', axisname, 'ekseninin domainine atıfta bulunur ve',
            '0.5 pozisyonu, o eksenin domaininin', lower, 've', upper, 'arasında kalan',
            'noktayı ifade eder.',
        ].join(' ');
    }
};
