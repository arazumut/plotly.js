'use strict';

var Lib = require('../lib');
var dfltConfig = require('../plot_api/plot_config').dfltConfig;

/**
 * Argüman dizisini *undefined* değerleri nesnelerden çıkarmadan kopyala.
 *
 * @param gd
 * @param args
 * @returns {Array}
 */
function copyArgArray(gd, args) {
    var copy = [];
    var arg;

    for(var i = 0; i < args.length; i++) {
        arg = args[i];

        if(arg === gd) copy[i] = arg;
        else if(typeof arg === 'object') {
            copy[i] = Array.isArray(arg) ?
                Lib.extendDeep([], arg) :
                Lib.extendDeepAll({}, arg);
        } else copy[i] = arg;
    }

    

    return copy;
}


// -----------------------------------------------------
// Grafikler için Geri Alma/Yeniden Yapma kuyruğu
// -----------------------------------------------------


var queue = {};

// TODO: Geri al ve yeniden yap düğmelerini uygun şekilde devre dışı bırak/etkinleştir

/**
 * Bir grafikDiv için geri alma kuyruğuna bir öğe ekle
 *
 * @param gd
 * @param undoFunc Bu işlemi geri almak için fonksiyon
 * @param undoArgs undoFunc'a sağlanacak argümanlar
 * @param redoFunc Bu işlemi yeniden yapmak için fonksiyon
 * @param redoArgs redoFunc'a sağlanacak argümanlar
 */
queue.add = function(gd, undoFunc, undoArgs, redoFunc, redoArgs) {
    var queueObj,
        queueIndex;

    // Kuyruğu ve içindeki pozisyonumuzu kontrol et
    gd.undoQueue = gd.undoQueue || {index: 0, queue: [], sequence: false};
    queueIndex = gd.undoQueue.index;

    // Eğer zaten bir geri alma veya yeniden yapma işlemi oynatılıyorsa veya bu otomatik bir işlemse
    // (örneğin pencere boyutlandırma... başka var mı?) bu işlemi geri alma kuyruğuna kaydetmeyiz
    if(gd.autoplay) {
        if(!gd.undoQueue.inSequence) gd.autoplay = false;
        return;
    }

    // Eğer bir dizide değilsek veya yeni başlıyorsak, yeni bir kuyruk öğesine ihtiyacımız var
    if(!gd.undoQueue.sequence || gd.undoQueue.beginSequence) {
        queueObj = {undo: {calls: [], args: []}, redo: {calls: [], args: []}};
        gd.undoQueue.queue.splice(queueIndex, gd.undoQueue.queue.length - queueIndex, queueObj);
        gd.undoQueue.index += 1;
    } else {
        queueObj = gd.undoQueue.queue[queueIndex - 1];
    }
    gd.undoQueue.beginSequence = false;

    // Geri alma çağrılarını ileri bir döngüde işlemek için unshift kullanıyoruz
    if(queueObj) {
        queueObj.undo.calls.unshift(undoFunc);
        queueObj.undo.args.unshift(undoArgs);
        queueObj.redo.calls.push(redoFunc);
        queueObj.redo.args.push(redoArgs);
    }

    if(gd.undoQueue.queue.length > dfltConfig.queueLength) {
        gd.undoQueue.queue.shift();
        gd.undoQueue.index--;
    }
};

/**
 * Geri alma kuyruğu değişikliklerinin bir dizisini başlat
 *
 * @param gd
 */
queue.startSequence = function(gd) {
    gd.undoQueue = gd.undoQueue || {index: 0, queue: [], sequence: false};
    gd.undoQueue.sequence = true;
    gd.undoQueue.beginSequence = true;
};

/**
 * Geri alma kuyruğu değişikliklerinin bir dizisini durdur
 *
 * Bu işlemin geri alma zincirinin sona erdiğinden emin olduktan sonra çağır
 *
 * @param gd
 */
queue.stopSequence = function(gd) {
    gd.undoQueue = gd.undoQueue || {index: 0, queue: [], sequence: false};
    gd.undoQueue.sequence = false;
    gd.undoQueue.beginSequence = false;
};

/**
 * Geri alma kuyruğunda bir adım geri git ve oradaki nesneyi geri al.
 *
 * @param gd
 */
queue.undo = function undo(gd) {
    var queueObj, i;

    if(gd.undoQueue === undefined ||
            isNaN(gd.undoQueue.index) ||
            gd.undoQueue.index <= 0) {
        return;
    }

    // index bir sonraki *ileri* queueObj'yi işaret ediyor, geri aldığımızı işaret et
    gd.undoQueue.index--;

    // Geri alma talimatları için queueObj'yi al
    queueObj = gd.undoQueue.queue[gd.undoQueue.index];

    // Bu dizi, geri alma/yapma sırasında kuyruğa ekleme yapılmasını engeller
    gd.undoQueue.inSequence = true;
    for(i = 0; i < queueObj.undo.calls.length; i++) {
        queue.plotDo(gd, queueObj.undo.calls[i], queueObj.undo.args[i]);
    }
    gd.undoQueue.inSequence = false;
    gd.autoplay = false;
};

/**
 * Geri alma kuyruğundaki mevcut nesneyi yeniden yap, ardından kuyruğun ilerisine git.
 *
 * @param gd
 */
queue.redo = function redo(gd) {
    var queueObj, i;

    if(gd.undoQueue === undefined ||
            isNaN(gd.undoQueue.index) ||
            gd.undoQueue.index >= gd.undoQueue.queue.length) {
        return;
    }

    // Geri alma talimatları için queueObj'yi al
    queueObj = gd.undoQueue.queue[gd.undoQueue.index];

    // Bu dizi, geri alma/yapma sırasında kuyruğa ekleme yapılmasını engeller
    gd.undoQueue.inSequence = true;
    for(i = 0; i < queueObj.redo.calls.length; i++) {
        queue.plotDo(gd, queueObj.redo.calls[i], queueObj.redo.args[i]);
    }
    gd.undoQueue.inSequence = false;
    gd.autoplay = false;

    // index, yeniden yaptığımız şeyi işaret ediyor, onu hareket ettir
    gd.undoQueue.index++;
};

/**
 * Geri alma/yapma tarafından çağrılır ve gerçek değişiklikleri yapar.
 *
 * Genel olarak çağrılması amaçlanmamıştır, ancak testlerde taklit edilmek üzere dahil edilmiştir.
 *
 * @param gd
 * @param func
 * @param args
 */
queue.plotDo = function(gd, func, args) {
    gd.autoplay = true;

    // Bu *gd'yi* kopyalamaz ve `undefined` özelliklerini korur!
    args = copyArgArray(gd, args);

    // Sağlanan fonksiyonu çağır
    func.apply(null, args);
};

module.exports = queue;
