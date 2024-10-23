'use strict';

var Lib = require('../../lib');
var Registry = require('../../registry');
var arrayEditor = require('../../plot_api/plot_template').arrayEditor;

module.exports = {
    hasClickToShow: hasClickToShow,
    onClick: onClick
};

/*
 * hasClickToShow: Verilen hoverData herhangi bir anotasyonu açacak mı?
 * (hover olayları tarafından imleci ayarlamak için kullanılır)
 *
 * gd: graphDiv
 * hoverData: *plotly_hover* veya *plotly_click* olaylarında `points` 
 *     özniteliği ile birlikte gelen bir hoverData dizisi
 *
 * dönüş: boolean
 */
function hasClickToShow(gd, hoverData) {
    var sets = getToggleSets(gd, hoverData);
    return sets.on.length > 0 || sets.explicitOff.length > 0;
}

/*
 * onClick: Bu hoverData'ya tıklayarak yapılacak güncellemeleri gerçekleştirir
 * (Plotly.update aracılığıyla)
 *
 * gd: graphDiv
 * hoverData: *plotly_hover* veya *plotly_click* olaylarında `points` 
 *     özniteliği ile birlikte gelen bir hoverData dizisi
 *
 * dönüş: Güncellemenin tamamlandığına dair Promise
 */
function onClick(gd, hoverData) {
    var toggleSets = getToggleSets(gd, hoverData);
    var onSet = toggleSets.on;
    var offSet = toggleSets.off.concat(toggleSets.explicitOff);
    var update = {};
    var annotationsOut = gd._fullLayout.annotations;
    var i, editHelpers;

    if(!(onSet.length || offSet.length)) return;

    for(i = 0; i < onSet.length; i++) {
        editHelpers = arrayEditor(gd.layout, 'annotations', annotationsOut[onSet[i]]);
        editHelpers.modifyItem('visible', true);
        Lib.extendFlat(update, editHelpers.getUpdateObj());
    }

    for(i = 0; i < offSet.length; i++) {
        editHelpers = arrayEditor(gd.layout, 'annotations', annotationsOut[offSet[i]]);
        editHelpers.modifyItem('visible', false);
        Lib.extendFlat(update, editHelpers.getUpdateObj());
    }

    return Registry.call('update', gd, {}, update);
}

/*
 * getToggleSets: Bu hoverData'da açılacak veya kapanacak anotasyonları bulur
 *
 * gd: graphDiv
 * hoverData: *plotly_hover* veya *plotly_click* olaylarında `points` 
 *     özniteliği ile birlikte gelen bir hoverData dizisi
 *
 * dönüş: {
 *   on: Açılacak anotasyonların dizini,
 *   off: Üzerinde gezinmediğiniz için kapanacak olanların dizini,
 *   explicitOff: Üzerinde gezindiğiniz için kapanacak olanların dizini
 * }
 */
function getToggleSets(gd, hoverData) {
    var annotations = gd._fullLayout.annotations;
    var onSet = [];
    var offSet = [];
    var explicitOffSet = [];
    var hoverLen = (hoverData || []).length;

    var i, j, anni, showMode, pointj, xa, ya, toggleType;

    for(i = 0; i < annotations.length; i++) {
        anni = annotations[i];
        showMode = anni.clicktoshow;

        if(showMode) {
            for(j = 0; j < hoverLen; j++) {
                pointj = hoverData[j];
                xa = pointj.xaxis;
                ya = pointj.yaxis;

                if(xa._id === anni.xref &&
                    ya._id === anni.yref &&
                    xa.d2r(pointj.x) === clickData2r(anni._xclick, xa) &&
                    ya.d2r(pointj.y) === clickData2r(anni._yclick, ya)
                ) {
                    // Eşleşme! Bu anotasyonu değiştir
                    // clicktoshow modundan bağımsız olarak
                    // ama eğer 'onout' modundaysa, kapatma işlemi örtük olur
                    if(anni.visible) {
                        if(showMode === 'onout') toggleType = offSet;
                        else toggleType = explicitOffSet;
                    } else {
                        toggleType = onSet;
                    }
                    toggleType.push(i);
                    break;
                }
            }

            if(j === hoverLen) {
                // Eşleşme yok - sadece bu anotasyonu kapat,
                // ve sadece showmode 'onout' ise
                if(anni.visible && showMode === 'onout') offSet.push(i);
            }
        }
    }

    return {on: onSet, off: offSet, explicitOff: explicitOffSet};
}

// log eksenlerini v3'e kadar işlemek için
function clickData2r(d, ax) {
    return ax.type === 'log' ? ax.l2r(d) : ax.d2r(d);
}
