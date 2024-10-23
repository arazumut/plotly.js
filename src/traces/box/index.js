'use strict';

import attributes from './attributes';
import layoutAttributes from './layout_attributes';
import { supplyDefaults, crossTraceDefaults } from './defaults';
import { supplyLayoutDefaults } from './layout_defaults';
import calc from './calc';
import { crossTraceCalc } from './cross_trace_calc';
import { plot } from './plot';
import { style, styleOnSelect } from './style';
import { hoverPoints } from './hover';
import eventData from './event_data';
import selectPoints from './select';
import basePlotModule from '../../plots/cartesian';

export default {
    attributes,
    layoutAttributes,
    supplyDefaults,
    crossTraceDefaults,
    supplyLayoutDefaults,
    calc,
    crossTraceCalc,
    plot,
    style,
    styleOnSelect,
    hoverPoints,
    eventData,
    selectPoints,

    moduleType: 'trace',
    name: 'box',
    basePlotModule,
    categories: ['cartesian', 'svg', 'symbols', 'oriented', 'box-violin', 'showLegend', 'boxLayout', 'zoomScale'],
    meta: {
        description: [
            'Her kutu birinci çeyrekten (Q1) üçüncü çeyreğe (Q3) kadar uzanır.',
            'İkinci çeyrek (Q2, yani medyan) kutunun içinde bir çizgi ile işaretlenmiştir.',
            'Çitler kutuların kenarlarından dışarı doğru büyür,',
            'varsayılan olarak, bunlar interçeyrek aralığının (IQR: Q3-Q1) +/- 1.5 katı kadar uzanır,',
            'Örnek ortalaması ve standart sapma ile çentikler ve',
            'örnek, aykırı ve şüpheli aykırı noktalar kutu grafiğine isteğe bağlı olarak eklenebilir.',

            'Her kutuya karşılık gelen değerler ve pozisyonlar iki imza kullanılarak girilebilir.',

            'İlk imza, kullanıcıların dikey kutular için `y` veri dizisinde (yatay kutular için `x`) örnek değerleri sağlamasını bekler.',
            'Bir `x` (`y`) dizisi sağlayarak, her farklı `x` (`y`) değeri için bir kutu çizilir.',
            'Eğer `x` (`y`) dizisi sağlanmazsa, tek bir kutu çizilir.',
            'Bu durumda, kutu iz adıyla veya sağlanmışsa `x0` (`y0`) ile konumlandırılır.',

            'İkinci imza, kullanıcıların kutulara karşılık gelen Q1, medyan ve Q3 istatistiklerini sırasıyla `q1`, `median` ve `q3` veri dizilerinde sağlamasını bekler.',
            'Diğer kutu özellikleri, yani `lowerfence`, `upperfence`, `notchspan` doğrudan kullanıcılar tarafından ayarlanabilir.',
            'Plotly\'nin bunları hesaplaması veya kutuların yanında örnek noktaları göstermesi için,',
            'kullanıcılar dikey kutular için `y` veri dizisini (yatay kutular için `x`) 2D bir dizi olarak ayarlayabilir,',
            'dış uzunluk izlerdeki kutu sayısına ve iç uzunluk örnek boyutuna karşılık gelir.'
        ].join(' ')
    }
};
