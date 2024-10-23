'use strict';

var d3 = require('@plotly/d3');
var isNumeric = require('fast-isnumeric');

var Lib = require('../../lib');
var Icons = require('../../fonts/ploticon');
var version = require('../../version').version;

var Parser = new DOMParser();

/**
 * Etkileşimli grafikler için UI kontrolcüsü
 * @Class
 * @Param {object} opts
 * @Param {object} opts.buttons    gruplandırılmış buton yapılandırma nesnelerinin iç içe dizileri
 * @Param {object} opts.container  modeBar'ı eklemek için konteyner div
 * @Param {object} opts.graphInfo  veri ve düzen içeren birincil grafik nesnesi
 */
function ModeBar(opts) {
    this.container = opts.container;
    this.element = document.createElement('div');

    this.update(opts.graphInfo, opts.buttons);

    this.container.appendChild(this.element);
}

var proto = ModeBar.prototype;

/**
 * ModeBar'ı güncelle (butonlar ve logo)
 *
 * @param {object} graphInfo  veri ve düzen içeren birincil grafik nesnesi
 * @param {array of arrays} buttons başlatılacak gruplandırılmış butonların iç içe dizileri
 *
 */
proto.update = function(graphInfo, buttons) {
    this.graphInfo = graphInfo;

    var context = this.graphInfo._context;
    var fullLayout = this.graphInfo._fullLayout;
    var modeBarId = 'modebar-' + fullLayout._uid;

    this.element.setAttribute('id', modeBarId);
    this._uid = modeBarId;

    this.element.className = 'modebar';
    if(context.displayModeBar === 'hover') this.element.className += ' modebar--hover ease-bg';

    if(fullLayout.modebar.orientation === 'v') {
        this.element.className += ' vertical';
        buttons = buttons.reverse();
    }

    var style = fullLayout.modebar;
    var bgSelector = context.displayModeBar === 'hover' ? '.js-plotly-plot .plotly:hover ' : '';

    Lib.deleteRelatedStyleRule(modeBarId);
    Lib.addRelatedStyleRule(modeBarId, bgSelector + '#' + modeBarId + ' .modebar-group', 'background-color: ' + style.bgcolor);
    Lib.addRelatedStyleRule(modeBarId, '#' + modeBarId + ' .modebar-btn .icon path', 'fill: ' + style.color);
    Lib.addRelatedStyleRule(modeBarId, '#' + modeBarId + ' .modebar-btn:hover .icon path', 'fill: ' + style.activecolor);
    Lib.addRelatedStyleRule(modeBarId, '#' + modeBarId + ' .modebar-btn.active .icon path', 'fill: ' + style.activecolor);

    // butonlar veya logo değiştiyse, modebar içeriğini yeniden çiz
    var needsNewButtons = !this.hasButtons(buttons);
    var needsNewLogo = (this.hasLogo !== context.displaylogo);
    var needsNewLocale = (this.locale !== context.locale);

    this.locale = context.locale;

    if(needsNewButtons || needsNewLogo || needsNewLocale) {
        this.removeAllButtons();

        this.updateButtons(buttons);

        if(context.watermark || context.displaylogo) {
            var logoGroup = this.getLogo();
            if(context.watermark) {
                logoGroup.className = logoGroup.className + ' watermark';
            }

            if(fullLayout.modebar.orientation === 'v') {
                this.element.insertBefore(logoGroup, this.element.childNodes[0]);
            } else {
                this.element.appendChild(logoGroup);
            }

            this.hasLogo = true;
        }
    }

    this.updateActiveButton();
};

proto.updateButtons = function(buttons) {
    var _this = this;

    this.buttons = buttons;
    this.buttonElements = [];
    this.buttonsNames = [];

    this.buttons.forEach(function(buttonGroup) {
        var group = _this.createGroup();

        buttonGroup.forEach(function(buttonConfig) {
            var buttonName = buttonConfig.name;
            if(!buttonName) {
                throw new Error('buton yapılandırmasında \'name\' sağlanmalı');
            }
            if(_this.buttonsNames.indexOf(buttonName) !== -1) {
                throw new Error('buton adı \'' + buttonName + '\' zaten kullanılıyor');
            }
            _this.buttonsNames.push(buttonName);

            var button = _this.createButton(buttonConfig);
            _this.buttonElements.push(button);
            group.appendChild(button);
        });

        _this.element.appendChild(group);
    });
};

/**
 * Buton grubu içeren boş div
 * @Return {HTMLelement}
 */
proto.createGroup = function() {
    var group = document.createElement('div');
    group.className = 'modebar-group';
    return group;
};

/**
 * Yeni bir buton div'i oluştur ve sabit ve yapılandırılabilir öznitelikleri ayarla
 * @Param {object} config (daha fazla bilgi için ./buttons.js dosyasına bakın)
 * @Return {HTMLelement}
 */
proto.createButton = function(config) {
    var _this = this;
    var button = document.createElement('a');

    button.setAttribute('rel', 'tooltip');
    button.className = 'modebar-btn';

    var title = config.title;
    if(title === undefined) title = config.name;
    // yerelleştirme için: başlığın gd argümanını alan bir çağrılabilir olmasına izin ver
    else if(typeof title === 'function') title = title(this.graphInfo);

    if(title || title === 0) button.setAttribute('data-title', title);

    if(config.attr !== undefined) button.setAttribute('data-attr', config.attr);

    var val = config.val;
    if(val !== undefined) {
        if(typeof val === 'function') val = val(this.graphInfo);
        button.setAttribute('data-val', val);
    }

    var click = config.click;
    if(typeof click !== 'function') {
        throw new Error('buton yapılandırmasında \'click\' fonksiyonu sağlanmalı');
    } else {
        button.addEventListener('click', function(ev) {
            config.click(_this.graphInfo, ev);

            // sadece 'hoverClosestGeo' için gerekli, çünkü relayout çağrılmaz
            _this.updateActiveButton(ev.currentTarget);
        });
    }

    button.setAttribute('data-toggle', config.toggle || false);
    if(config.toggle) d3.select(button).classed('active', true);

    var icon = config.icon;
    if(typeof icon === 'function') {
        button.appendChild(icon());
    } else {
        button.appendChild(this.createIcon(icon || Icons.question));
    }
    button.setAttribute('data-gravity', config.gravity || 'n');

    return button;
};

/**
 * Bir butona ikon ekle
 * @Param {object} thisIcon
 * @Param {number} thisIcon.width
 * @Param {string} thisIcon.path
 * @Param {string} thisIcon.color
 * @Return {HTMLelement}
 */
proto.createIcon = function(thisIcon) {
    var iconHeight = isNumeric(thisIcon.height) ?
        Number(thisIcon.height) :
        thisIcon.ascent - thisIcon.descent;
    var svgNS = 'http://www.w3.org/2000/svg';
    var icon;

    if(thisIcon.path) {
        icon = document.createElementNS(svgNS, 'svg');
        icon.setAttribute('viewBox', [0, 0, thisIcon.width, iconHeight].join(' '));
        icon.setAttribute('class', 'icon');

        var path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', thisIcon.path);

        if(thisIcon.transform) {
            path.setAttribute('transform', thisIcon.transform);
        } else if(thisIcon.ascent !== undefined) {
            // Eski ikon dönüşüm hesaplaması
            path.setAttribute('transform', 'matrix(1 0 0 -1 0 ' + thisIcon.ascent + ')');
        }

        icon.appendChild(path);
    }

    if(thisIcon.svg) {
        var svgDoc = Parser.parseFromString(thisIcon.svg, 'application/xml');
        icon = svgDoc.childNodes[0];
    }

    icon.setAttribute('height', '1em');
    icon.setAttribute('width', '1em');

    return icon;
};

/**
 * Düzen içinde belirtilen öznitelikle aktif butonu günceller
 * @Param {object} graphInfo veri ve düzen içeren grafik nesnesi
 * @Return {HTMLelement}
 */
proto.updateActiveButton = function(buttonClicked) {
    var fullLayout = this.graphInfo._fullLayout;
    var dataAttrClicked = (buttonClicked !== undefined) ?
        buttonClicked.getAttribute('data-attr') :
        null;

    this.buttonElements.forEach(function(button) {
        var thisval = button.getAttribute('data-val') || true;
        var dataAttr = button.getAttribute('data-attr');
        var isToggleButton = (button.getAttribute('data-toggle') === 'true');
        var button3 = d3.select(button);

        // 'data-toggle' ve 'buttonClicked' kullanarak tam olarak fullLayout'ta karşılığı olmayan butonları değiştir
        if(isToggleButton) {
            if(dataAttr === dataAttrClicked) {
                button3.classed('active', !button3.classed('active'));
            }
        } else {
            var val = (dataAttr === null) ?
                dataAttr :
                Lib.nestedProperty(fullLayout, dataAttr).get();

            button3.classed('active', val === thisval);
        }
    });
};

/**
 * ModeBar'ın buton yapılandırma argümanı olarak yapılandırılıp yapılandırılmadığını kontrol eder
 *
 * @Param {object} buttons gruplandırılmış buton yapılandırma nesnelerinin 2d dizisi
 * @Return {boolean}
 */
proto.hasButtons = function(buttons) {
    var currentButtons = this.buttons;

    if(!currentButtons) return false;

    if(buttons.length !== currentButtons.length) return false;

    for(var i = 0; i < buttons.length; ++i) {
        if(buttons[i].length !== currentButtons[i].length) return false;
        for(var j = 0; j < buttons[i].length; j++) {
            if(buttons[i][j].name !== currentButtons[i][j].name) return false;
        }
    }

    return true;
};

function jsVersion(str) {
    return str + ' (v' + version + ')';
}

/**
 * @return {HTMLDivElement} Grup içinde sarılmış logo resmi
 */
proto.getLogo = function() {
    var group = this.createGroup();
    var a = document.createElement('a');

    a.href = 'https://plotly.com/';
    a.target = '_blank';
    a.setAttribute('data-title', jsVersion(Lib._(this.graphInfo, 'Plotly.js ile Üretildi')));
    a.className = 'modebar-btn plotlyjsicon modebar-btn--logo';

    a.appendChild(this.createIcon(Icons.newplotlylogo));

    group.appendChild(a);
    return group;
};

proto.removeAllButtons = function() {
    while(this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }

    this.hasLogo = false;
};

proto.destroy = function() {
    Lib.removeElement(this.container.querySelector('.modebar'));
    Lib.deleteRelatedStyleRule(this._uid);
};

function createModeBar(gd, buttons) {
    var fullLayout = gd._fullLayout;

    var modeBar = new ModeBar({
        graphInfo: gd,
        container: fullLayout._modebardiv.node(),
        buttons: buttons
    });

    if(fullLayout._privateplot) {
        d3.select(modeBar.element).append('span')
            .classed('badge-private float--left', true)
            .text('ÖZEL');
    }

    return modeBar;
}

module.exports = createModeBar;
