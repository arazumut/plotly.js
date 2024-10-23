'use strict';

var d3 = require('@plotly/d3');
var Color = require('../color');

module.exports = function stil(traces) {
    traces.each(function(d) {
        var trace = d[0].trace;
        var yHata = trace.error_y || {};
        var xHata = trace.error_x || {};

        var s = d3.select(this);

        s.selectAll('path.yerror')
            .style('stroke-width', yHata.thickness + 'px')
            .call(Color.stroke, yHata.color);

        if(xHata.copy_ystyle) xHata = yHata;

        s.selectAll('path.xerror')
            .style('stroke-width', xHata.thickness + 'px')
            .call(Color.stroke, xHata.color);
    });
};
