'use strict';

/*
 * sayaç kimliklerini/isimlerini eşleştirmek için bir regex oluşturur, örneğin xaxis, xaxis2, xaxis10...
 *
 * @param {string} bas: desenin başı, örneğin 'x' 'x', 'x2', 'x10' vb. eşleşir.
 *      'xy' kartezyen alt grafikler için özel bir durumdur: 'x2y3' vb. eşleşir
 * @param {Optional(string)} son: kimlikten sonra sabit bir parça
 *      örneğin counterRegex('scene', '.annotations') için scene2.annotations vb.
 * @param {boolean} acikUclu: true ise, dize eşleşmeden sonra devam edebilir.
 * @param {boolean} baslangiciEsles: false ise, dize eşleşmeden önce başlayabilir.
 */
exports.sayaç = function(bas, son, acikUclu, baslangiciEsles) {
    var tamSon = (son || '') + (acikUclu ? '' : '$');
    var baslangicIle = baslangiciEsles === false ? '' : '^';
    if(bas === 'xy') {
        return new RegExp(baslangicIle + 'x([2-9]|[1-9][0-9]+)?y([2-9]|[1-9][0-9]+)?' + tamSon);
    }
    return new RegExp(baslangicIle + bas + '([2-9]|[1-9][0-9]+)?' + tamSon);
};
