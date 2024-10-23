'use strict';

var Registry = require('../registry');
var SUBPLOT_PATTERN = require('./cartesian/constants').SUBPLOT_PATTERN;

/**
 * Belirli bir alt grafikle ilişkili calcdata izlerini al
 *
 * @param {array} calcData: gd.calcdata'daki gibi
 * @param {string} type: alt grafik türü
 * @param {string} subplotId: aranacak alt grafik kimliği
 *
 * @return {array} calcdata izlerinin dizisi
 */
exports.getSubplotCalcData = function(calcData, type, subplotId) {
    var basePlotModule = Registry.subplotsRegistry[type];
    if(!basePlotModule) return [];

    var attr = basePlotModule.attr;
    var subplotCalcData = [];

    for(var i = 0; i < calcData.length; i++) {
        var calcTrace = calcData[i];
        var trace = calcTrace[0].trace;

        if(trace[attr] === subplotId) subplotCalcData.push(calcTrace);
    }

    return subplotCalcData;
};

/**
 * Belirli bir modülle çizilebilecek calcdata izlerini al
 * NOT: Bu, mutlaka tam olarak eşleşen iz türü değildir,
 * birden fazla iz türü aynı çizim rutinini kullanıyorsa, burada toplanacaktır.
 * Aynı şeyi birden fazla kez çizmeyi önlemek için, iki dizi döndürürüz,
 * bu modülle çizeceğimiz calcdata ve çizmeyeceğimiz calcdata.
 *
 * @param {array} calcdata: gd.calcdata'daki gibi
 * @param {object|string|fn} arg1:
 *  çizim modülü, adı veya çizim yöntemi
 * @param {int} arg2: (isteğe bağlı) zorder'a göre filtreleme
 * @return {array[array]} [bulunanCalcdata, kalanCalcdata]
 */
exports.getModuleCalcData = function(calcdata, arg1, arg2) {
    var moduleCalcData = [];
    var remainingCalcData = [];

    var plotMethod;
    if(typeof arg1 === 'string') {
        plotMethod = Registry.getModule(arg1).plot;
    } else if(typeof arg1 === 'function') {
        plotMethod = arg1;
    } else {
        plotMethod = arg1.plot;
    }
    if(!plotMethod) {
        return [moduleCalcData, calcdata];
    }
    var zorder = arg2;

    for(var i = 0; i < calcdata.length; i++) {
        var cd = calcdata[i];
        var trace = cd[0].trace;
        var filterByZ = (trace.zorder !== undefined);
        // NOT:
        // - 'legendonly' izleri buradan geçmez
        // - hesap dönüşümleri sırasında tamamen kırpılan 'visible' izleri atla
        if(trace.visible !== true || trace._length === 0) continue;

        // calcdata izini 'modül' yerine (bu işlevin adı önerdiği gibi),
        // 'modül çizim yöntemi' ile gruplandırın, böylece bazı izler
        // aynı modül çizim yöntemini paylaşıyorsa (örneğin bar ve histogram),
        // sadece bir kez çağırırız!
        if(trace._module && trace._module.plot === plotMethod && (!filterByZ || trace.zorder === zorder)) {
            moduleCalcData.push(cd);
        } else {
            remainingCalcData.push(cd);
        }
    }

    return [moduleCalcData, remainingCalcData];
};

/**
 * Belirli bir alt grafikle ilişkili veri izlerini al.
 *
 * @param {array} data  plotly tam veri dizisi.
 * @param {string} type aranacak alt grafik türü.
 * @param {string} subplotId aranacak alt grafik kimliği.
 *
 * @return {array} iz nesnelerinin listesi.
 *
 */
exports.getSubplotData = function getSubplotData(data, type, subplotId) {
    if(!Registry.subplotsRegistry[type]) return [];

    var attr = Registry.subplotsRegistry[type].attr;
    var subplotData = [];
    var trace;

    for(var i = 0; i < data.length; i++) {
        trace = data[i];

        if(trace[attr] === subplotId) subplotData.push(trace);
    }

    return subplotData;
};
