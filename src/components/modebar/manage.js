'use strict';

var axisIds = require('../../plots/cartesian/axis_ids');
var scatterSubTypes = require('../../traces/scatter/subtypes');
var Registry = require('../../registry');
var isUnifiedHover = require('../fx/helpers').isUnifiedHover;

var createModeBar = require('./modebar');
var modeBarButtons = require('./buttons');
var DRAW_MODES = require('./constants').DRAW_MODES;
var extendDeep = require('../../lib').extendDeep;

/**
 * ModeBar 'create' ve 'update' işlemlerini saran bir fonksiyon,
 * plot türüne ve plot konfigürasyonuna göre ModeBar constructor'ına
 * geçilecek butonları seçer.
 *
 * @param {object} gd ana plot nesnesi
 *
 */
module.exports = function manageModeBar(gd) {
    var fullLayout = gd._fullLayout;
    var context = gd._context;
    var modeBar = fullLayout._modeBar;

    if(!context.displayModeBar && !context.watermark) {
        if(modeBar) {
            modeBar.destroy();
            delete fullLayout._modeBar;
        }
        return;
    }

    if(!Array.isArray(context.modeBarButtonsToRemove)) {
        throw new Error([
            '*modeBarButtonsToRemove* konfigürasyon seçenekleri',
            'bir dizi olmalıdır.'
        ].join(' '));
    }

    if(!Array.isArray(context.modeBarButtonsToAdd)) {
        throw new Error([
            '*modeBarButtonsToAdd* konfigürasyon seçenekleri',
            'bir dizi olmalıdır.'
        ].join(' '));
    }

    var customButtons = context.modeBarButtons;
    var buttonGroups;

    if(Array.isArray(customButtons) && customButtons.length) {
        buttonGroups = fillCustomButton(customButtons);
    } else if(!context.displayModeBar && context.watermark) {
        buttonGroups = [];
    } else {
        buttonGroups = getButtonGroups(gd);
    }

    if(modeBar) modeBar.update(gd, buttonGroups);
    else fullLayout._modeBar = createModeBar(gd, buttonGroups);
};

// varsayılan olarak hangi butonların gösterileceğine dair mantık
function getButtonGroups(gd) {
    var fullLayout = gd._fullLayout;
    var fullData = gd._fullData;
    var context = gd._context;

    function match(name, B) {
        if(typeof B === 'string') {
            if(B.toLowerCase() === name.toLowerCase()) return true;
        } else {
            var v0 = B.name;
            var v1 = (B._cat || B.name);

            if(v0 === name || v1 === name.toLowerCase()) return true;
        }
        return false;
    }

    var layoutAdd = fullLayout.modebar.add;
    if(typeof layoutAdd === 'string') layoutAdd = [layoutAdd];

    var layoutRemove = fullLayout.modebar.remove;
    if(typeof layoutRemove === 'string') layoutRemove = [layoutRemove];

    var buttonsToAdd = context.modeBarButtonsToAdd.concat(
        layoutAdd.filter(function(e) {
            for(var i = 0; i < context.modeBarButtonsToRemove.length; i++) {
                if(match(e, context.modeBarButtonsToRemove[i])) return false;
            }
            return true;
        })
    );

    var buttonsToRemove = context.modeBarButtonsToRemove.concat(
        layoutRemove.filter(function(e) {
            for(var i = 0; i < context.modeBarButtonsToAdd.length; i++) {
                if(match(e, context.modeBarButtonsToAdd[i])) return false;
            }
            return true;
        })
    );

    var hasCartesian = fullLayout._has('cartesian');
    var hasGL3D = fullLayout._has('gl3d');
    var hasGeo = fullLayout._has('geo');
    var hasPie = fullLayout._has('pie');
    var hasFunnelarea = fullLayout._has('funnelarea');
    var hasTernary = fullLayout._has('ternary');
    var hasMapbox = fullLayout._has('mapbox');
    var hasMap = fullLayout._has('map');
    var hasPolar = fullLayout._has('polar');
    var hasSmith = fullLayout._has('smith');
    var hasSankey = fullLayout._has('sankey');
    var allAxesFixed = areAllAxesFixed(fullLayout);
    var hasUnifiedHoverLabel = isUnifiedHover(fullLayout.hovermode);

    var groups = [];

    function addGroup(newGroup) {
        if(!newGroup.length) return;

        var out = [];

        for(var i = 0; i < newGroup.length; i++) {
            var name = newGroup[i];
            var B = modeBarButtons[name];
            var v0 = B.name.toLowerCase();
            var v1 = (B._cat || B.name).toLowerCase();
            var found = false;
            for(var q = 0; q < buttonsToRemove.length; q++) {
                var t = buttonsToRemove[q].toLowerCase();
                if(t === v0 || t === v1) {
                    found = true;
                    break;
                }
            }
            if(found) continue;
            out.push(modeBarButtons[name]);
        }

        groups.push(out);
    }

    // tüm plot türleri için ortak butonlar
    var commonGroup = ['toImage'];
    if(context.showEditInChartStudio) commonGroup.push('editInChartStudio');
    else if(context.showSendToCloud) commonGroup.push('sendDataToCloud');
    addGroup(commonGroup);

    var zoomGroup = [];
    var hoverGroup = [];
    var resetGroup = [];
    var dragModeGroup = [];

    if((hasCartesian || hasPie || hasFunnelarea || hasTernary) + hasGeo + hasGL3D + hasMapbox + hasMap + hasPolar + hasSmith > 1) {
        // birden fazla plot türü olan grafikler 'birlik butonları' alır
        // bu butonlar tüm alt grafiklerde görünümü sıfırlar veya hover etiketlerini değiştirir.
        hoverGroup = ['toggleHover'];
        resetGroup = ['resetViews'];
    } else if(hasGeo) {
        zoomGroup = ['zoomInGeo', 'zoomOutGeo'];
        hoverGroup = ['hoverClosestGeo'];
        resetGroup = ['resetGeo'];
    } else if(hasGL3D) {
        hoverGroup = ['hoverClosest3d'];
        resetGroup = ['resetCameraDefault3d', 'resetCameraLastSave3d'];
    } else if(hasMapbox) {
        zoomGroup = ['zoomInMapbox', 'zoomOutMapbox'];
        hoverGroup = ['toggleHover'];
        resetGroup = ['resetViewMapbox'];
    } else if(hasMap) {
        zoomGroup = ['zoomInMap', 'zoomOutMap'];
        hoverGroup = ['toggleHover'];
        resetGroup = ['resetViewMap'];
    } else if(hasPie) {
        hoverGroup = ['hoverClosestPie'];
    } else if(hasSankey) {
        hoverGroup = ['hoverClosestCartesian', 'hoverCompareCartesian'];
        resetGroup = ['resetViewSankey'];
    } else { // hasPolar, hasSmith, hasTernary
        // en az bir hover simgesi göster.
        hoverGroup = ['toggleHover'];
    }
    // kartesyen varsa, en yakın ve karşılaştırma arasında geçiş yapmaya izin ver
    // diğer türlerin grafikte olup olmadığına bakılmaksızın, çünkü hepsi herhangi bir doğruluk hovermode'u 'en yakın' olarak kabul eder
    if(hasCartesian) {
        hoverGroup.push('toggleSpikelines', 'hoverClosestCartesian', 'hoverCompareCartesian');
    }
    if(hasNoHover(fullData) || hasUnifiedHoverLabel) {
        hoverGroup = [];
    }

    if(hasCartesian && !allAxesFixed) {
        zoomGroup = ['zoomIn2d', 'zoomOut2d', 'autoScale2d'];
        if(resetGroup[0] !== 'resetViews') resetGroup = ['resetScale2d'];
    }

    if(hasGL3D) {
        dragModeGroup = ['zoom3d', 'pan3d', 'orbitRotation', 'tableRotation'];
    } else if((hasCartesian && !allAxesFixed) || hasTernary) {
        dragModeGroup = ['zoom2d', 'pan2d'];
    } else if(hasMapbox || hasMap || hasGeo) {
        dragModeGroup = ['pan2d'];
    } else if(hasPolar) {
        dragModeGroup = ['zoom2d'];
    }
    if(isSelectable(fullData)) {
        dragModeGroup.push('select2d', 'lasso2d');
    }

    var enabledHoverGroup = [];
    var enableHover = function(a) {
        // zaten eklenmişse geri dön
        if(enabledHoverGroup.indexOf(a) !== -1) return;
        // hoverGroup içinde olmalı
        if(hoverGroup.indexOf(a) !== -1) {
            enabledHoverGroup.push(a);
        }
    };
    if(Array.isArray(buttonsToAdd)) {
        var newList = [];
        for(var i = 0; i < buttonsToAdd.length; i++) {
            var b = buttonsToAdd[i];
            if(typeof b === 'string') {
                b = b.toLowerCase();

                if(DRAW_MODES.indexOf(b) !== -1) {
                    // önceden tanımlanmış sürükleme modlarını kabul et, yani şekil çizim özelliklerini string olarak
                    if(
                        fullLayout._has('mapbox') || fullLayout._has('map') || // şekilleri kağıt koordinatında çiz (gelecekte veri koordinatını desteklemek için geliştirilebilir, eğim olmadığında)
                        fullLayout._has('cartesian') // şekilleri veri koordinatında çiz
                    ) {
                        dragModeGroup.push(b);
                    }
                } else if(b === 'togglespikelines') {
                    enableHover('toggleSpikelines');
                } else if(b === 'togglehover') {
                    enableHover('toggleHover');
                } else if(b === 'hovercompare') {
                    enableHover('hoverCompareCartesian');
                } else if(b === 'hoverclosest') {
                    enableHover('hoverClosestCartesian');
                    enableHover('hoverClosestGeo');
                    enableHover('hoverClosest3d');
                    enableHover('hoverClosestPie');
                } else if(b === 'v1hovermode') {
                    enableHover('hoverClosestCartesian');
                    enableHover('hoverCompareCartesian');
                    enableHover('hoverClosestGeo');
                    enableHover('hoverClosest3d');
                    enableHover('hoverClosestPie');
                }
            } else newList.push(b);
        }
        buttonsToAdd = newList;
    }

    addGroup(dragModeGroup);
    addGroup(zoomGroup.concat(resetGroup));
    addGroup(enabledHoverGroup);

    return appendButtonsToGroups(groups, buttonsToAdd);
}

function areAllAxesFixed(fullLayout) {
    var axList = axisIds.list({_fullLayout: fullLayout}, null, true);

    for(var i = 0; i < axList.length; i++) {
        if(!axList[i].fixedrange) {
            return false;
        }
    }

    return true;
}

// seçim destekleyen izleri ara
// daha fazla selectPoints işleyicisi ekledikçe güncellenecek
function isSelectable(fullData) {
    var selectable = false;

    for(var i = 0; i < fullData.length; i++) {
        if(selectable) break;

        var trace = fullData[i];

        if(!trace._module || !trace._module.selectPoints) continue;

        if(Registry.traceIs(trace, 'scatter-like')) {
            if(scatterSubTypes.hasMarkers(trace) || scatterSubTypes.hasText(trace)) {
                selectable = true;
            }
        } else if(Registry.traceIs(trace, 'box-violin')) {
            if(trace.boxpoints === 'all' || trace.points === 'all') {
                selectable = true;
            }
        } else {
            // genel olarak, iz modülü selectPoints'e sahipse, seçilebilir olduğunu varsay.
            // Scatter bunun bir istisnasıdır çünkü sadece scatter türü olmakla kalmaz, aynı zamanda işaretleyicilere veya metne sahip olmalıdır.

            selectable = true;
        }
    }

    return selectable;
}

// tüm izlerin 'noHover' olup olmadığını kontrol et
function hasNoHover(fullData) {
    for(var i = 0; i < fullData.length; i++) {
        if(!Registry.traceIs(fullData[i], 'noHover')) return false;
    }
    return true;
}

function appendButtonsToGroups(groups, buttons) {
    if(buttons.length) {
        if(Array.isArray(buttons[0])) {
            for(var i = 0; i < buttons.length; i++) {
                groups.push(buttons[i]);
            }
        } else groups.push(buttons);
    }

    return groups;
}

// varsayılan mode bar butonlarına atıfta bulunan özel butonları doldur
function fillCustomButton(originalModeBarButtons) {
    var customButtons = extendDeep([], originalModeBarButtons);

    for(var i = 0; i < customButtons.length; i++) {
        var buttonGroup = customButtons[i];

        for(var j = 0; j < buttonGroup.length; j++) {
            var button = buttonGroup[j];

            if(typeof button === 'string') {
                if(modeBarButtons[button] !== undefined) {
                    customButtons[i][j] = modeBarButtons[button];
                } else {
                    throw new Error([
                        '*modeBarButtons* konfigürasyon seçenekleri',
                        'geçersiz buton adı'
                    ].join(' '));
                }
            }
        }
    }

    return customButtons;
}
