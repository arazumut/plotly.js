'use strict';

var isNumeric = require('fast-isnumeric');
var isArrayOrTypedArray = require('./array').isArrayOrTypedArray;

/**
 * Bir dizeyi (örneğin 'xaxis.range[0]')
 * iç içe geçmiş bir nesnenin özelliğini temsil eden bir dizeyi set ve get yöntemlerine dönüştür
 * ayrıca dizeyi ve nesneyi döndür, böylece onları takip etmek zorunda kalmayız
 * bir dizinin tüm öğelerinin içinde bir özelliği ayarlamak için [-1] dizinini kullanmaya izin verir
 * örneğin obj = {arr: [{a: 1}, {a: 2}]} ise
 * p = nestedProperty(obj, 'arr[-1].a') yapabilirsiniz
 * ancak diziyi bu şekilde ayarlayamazsınız, bunu yapmak için
 * tüm diziyi ayarlayın.
 * örneğin obj = {arr: [1, 2, 3]} ise
 * nestedProperty(obj, 'arr[-1]').set(5) yapamazsınız
 * ancak nestedProperty(obj, 'arr').set([5, 5, 5]) yapabilirsiniz
 */
module.exports = function nestedProperty(container, propStr) {
    if(isNumeric(propStr)) propStr = String(propStr);
    else if(typeof propStr !== 'string' ||
            propStr.substr(propStr.length - 4) === '[-1]') {
        throw 'geçersiz özellik dizesi';
    }

    var propParts = propStr.split('.');
    var indexed;
    var indices;
    var i, j;

    for(j = 0; j < propParts.length; j++) {
        // __proto__ ve diğer dahili yapıların kirlenmesini önleyin
        if(String(propParts[j]).slice(0, 2) === '__') {
            throw 'geçersiz özellik dizesi';
        }
    }

    // sayılar olan iç içe hiyerarşi parçalarını kontrol edin (yani dizi öğeleri)
    j = 0;
    while(j < propParts.length) {
        // köşeli parantez blokları olan karakterler arayın
        indexed = String(propParts[j]).match(/^([^\[\]]*)((\[\-?[0-9]*\])+)$/);
        if(indexed) {
            if(indexed[1]) propParts[j] = indexed[1];
            // dizeyi köşeli parantezli dizi dizinleriyle başlatmaya izin ver
            else if(j === 0) propParts.splice(0, 1);
            else throw 'geçersiz özellik dizesi';

            indices = indexed[2]
                .substr(1, indexed[2].length - 2)
                .split('][');

            for(i = 0; i < indices.length; i++) {
                j++;
                propParts.splice(j, 0, Number(indices[i]));
            }
        }
        j++;
    }

    if(typeof container !== 'object') {
        return badContainer(container, propStr, propParts);
    }

    return {
        set: npSet(container, propParts, propStr),
        get: npGet(container, propParts),
        astr: propStr,
        parts: propParts,
        obj: container
    };
};

function npGet(cont, parts) {
    return function() {
        var curCont = cont;
        var curPart;
        var allSame;
        var out;
        var i;
        var j;

        for(i = 0; i < parts.length - 1; i++) {
            curPart = parts[i];
            if(curPart === -1) {
                allSame = true;
                out = [];
                for(j = 0; j < curCont.length; j++) {
                    out[j] = npGet(curCont[j], parts.slice(i + 1))();
                    if(out[j] !== out[0]) allSame = false;
                }
                return allSame ? out[0] : out;
            }
            if(typeof curPart === 'number' && !isArrayOrTypedArray(curCont)) {
                return undefined;
            }
            curCont = curCont[curPart];
            if(typeof curCont !== 'object' || curCont === null) {
                return undefined;
            }
        }

        // sadece parts.length === 1 ise buraya ulaşır
        if(typeof curCont !== 'object' || curCont === null) return undefined;

        out = curCont[parts[i]];
        if(out === null) return undefined;
        return out;
    };
}

/*
 * Bu değer silinebilir mi? `undefined` ve `null` değerlerini silebiliriz, ancak *args* dizisinin
 * içinde değilse.
 *
 * Daha önce bazı `{}` ve `[]` öğelerini de siliyorduk, set/unset işlemlerini net bir şekilde
 * nötr hale getirmeye çalışmak için; ancak bu, değerinden çok daha fazla karmaşıklığa neden
 * oluyordu ve hala birçok istisna vardı. Bkz: https://github.com/plotly/plotly.js/issues/1410
 *
 * *args* dizileri doğrudan API yöntemlerine geçirilir ve kullanıcı oraya koyduysa null'a
 * saygı göstermeliyiz, ancak aksi takdirde null, "bu değeri sil" anlamında kullanıldığı için
 * silinir, undefined ise "bu düzenlemeyi görmezden gel" anlamına gelir.
 */
var ARGS_PATTERN = /(^|\.)args\[/;
function isDeletable(val, propStr) {
    return (val === undefined) || (val === null && !propStr.match(ARGS_PATTERN));
}

function npSet(cont, parts, propStr) {
    return function(val) {
        var curCont = cont;
        var propPart = '';
        var containerLevels = [[cont, propPart]];
        var toDelete = isDeletable(val, propStr);
        var curPart;
        var i;

        for(i = 0; i < parts.length - 1; i++) {
            curPart = parts[i];

            if(typeof curPart === 'number' && !isArrayOrTypedArray(curCont)) {
                throw 'dizi dizini ama konteyner bir dizi değil';
            }

            // özel -1 dizi dizinini işleyin
            if(curPart === -1) {
                toDelete = !setArrayAll(curCont, parts.slice(i + 1), val, propStr);
                if(toDelete) break;
                else return;
            }

            if(!checkNewContainer(curCont, curPart, parts[i + 1], toDelete)) {
                break;
            }

            curCont = curCont[curPart];

            if(typeof curCont !== 'object' || curCont === null) {
                throw 'konteyner bir nesne değil';
            }

            propPart = joinPropStr(propPart, curPart);

            containerLevels.push([curCont, propPart]);
        }

        if(toDelete) {
            if(i === parts.length - 1) {
                delete curCont[parts[i]];

                // Yaptığımız tek budama: dizilerin sonundan `undefined` öğelerini kaldırmak.
                // Önceki öğeleri zaten kaldırmış olma durumunda, tanımlı olmayan bir değere
                // ulaşana kadar devam edin.
                if(Array.isArray(curCont) && +parts[i] === curCont.length - 1) {
                    while(curCont.length && curCont[curCont.length - 1] === undefined) {
                        curCont.pop();
                    }
                }
            }
        } else curCont[parts[i]] = val;
    };
}

function joinPropStr(propStr, newPart) {
    var toAdd = newPart;
    if(isNumeric(newPart)) toAdd = '[' + newPart + ']';
    else if(propStr) toAdd = '.' + newPart;

    return propStr + toAdd;
}

// özel -1 dizi dizinini işleyin
function setArrayAll(containerArray, innerParts, val, propStr) {
    var arrayVal = isArrayOrTypedArray(val);
    var allSet = true;
    var thisVal = val;
    var thisPropStr = propStr.replace('-1', 0);
    var deleteThis = arrayVal ? false : isDeletable(val, thisPropStr);
    var firstPart = innerParts[0];
    var i;

    for(i = 0; i < containerArray.length; i++) {
        thisPropStr = propStr.replace('-1', i);
        if(arrayVal) {
            thisVal = val[i % val.length];
            deleteThis = isDeletable(thisVal, thisPropStr);
        }
        if(deleteThis) allSet = false;
        if(!checkNewContainer(containerArray, i, firstPart, deleteThis)) {
            continue;
        }
        npSet(containerArray[i], innerParts, propStr.replace('-1', i))(thisVal);
    }
    return allSet;
}

/**
 * Gerektiğinde yeni alt konteyner oluştur.
 * yalnızca bir özniteliği sildiğimiz için konteyner yoksa ve gerek yoksa false döner
 */
function checkNewContainer(container, part, nextPart, toDelete) {
    if(container[part] === undefined) {
        if(toDelete) return false;

        if(typeof nextPart === 'number') container[part] = [];
        else container[part] = {};
    }
    return true;
}

function badContainer(container, propStr, propParts) {
    return {
        set: function() { throw 'geçersiz konteyner'; },
        get: function() {},
        astr: propStr,
        parts: propParts,
        obj: container
    };
}
