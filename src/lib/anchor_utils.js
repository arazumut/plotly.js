'use strict';

/**
 * x/y xanchor/yanchor bileşenlerinin konumlama sabitleyici (anchor) özelliğini belirleyin.
 *
 * - değerler < 1/3 düşük tarafı o kesirde hizalar,
 * - değerler [1/3, 2/3] merkezi o kesirde hizalar,
 * - değerler > 2/3 sağ tarafı o kesirde hizalar.
 */

exports.solSabitleyiciMi = function solSabitleyiciMi(opts) {
    return (
        opts.xanchor === 'sol' ||
        (opts.xanchor === 'otomatik' && opts.x <= 1 / 3)
    );
};

exports.merkezSabitleyiciMi = function merkezSabitleyiciMi(opts) {
    return (
        opts.xanchor === 'merkez' ||
        (opts.xanchor === 'otomatik' && opts.x > 1 / 3 && opts.x < 2 / 3)
    );
};

exports.sagSabitleyiciMi = function sagSabitleyiciMi(opts) {
    return (
        opts.xanchor === 'sağ' ||
        (opts.xanchor === 'otomatik' && opts.x >= 2 / 3)
    );
};

exports.ustSabitleyiciMi = function ustSabitleyiciMi(opts) {
    return (
        opts.yanchor === 'üst' ||
        (opts.yanchor === 'otomatik' && opts.y >= 2 / 3)
    );
};

exports.ortaSabitleyiciMi = function ortaSabitleyiciMi(opts) {
    return (
        opts.yanchor === 'orta' ||
        (opts.yanchor === 'otomatik' && opts.y > 1 / 3 && opts.y < 2 / 3)
    );
};

exports.altSabitleyiciMi = function altSabitleyiciMi(opts) {
    return (
        opts.yanchor === 'alt' ||
        (opts.yanchor === 'otomatik' && opts.y <= 1 / 3)
    );
};
