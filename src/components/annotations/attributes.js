'use strict';

var ARROWPATHS = require('./arrow_paths');
var fontAttrs = require('../../plots/font_attributes');
var cartesianConstants = require('../../plots/cartesian/constants');
var templatedArray = require('../../plot_api/plot_template').templatedArray;
var axisPlaceableObjs = require('../../constants/axis_placeable_objects');

function arrowAxisRefDescription(axis) {
    return [
        'Okun mutlak konumlandırılmasının çalışması için, *a' + axis +
        'ref* tam olarak *' + axis + 'ref* ile aynı olmalıdır, aksi takdirde *a' + axis +
        'ref* *pixel* (aşağıda açıklanmıştır) olarak değişir.',
        'Göreceli konumlandırma için, *a' + axis + 'ref* *pixel* olarak ayarlanabilir,',
        'bu durumda *a' + axis + '* değeri, *' + axis + '* ile ilgili olarak piksellerle belirtilir.',
        'Mutlak konumlandırma, trend çizgisi açıklamaları için kullanışlıdır,',
        'bu sayede yakınlaştırıldığında doğru trendi göstermeye devam eder.',
        'Göreceli konumlandırma, açıklanan bir nokta için metin ofsetini belirtmek için kullanışlıdır.'
    ].join(' ');
}

function arrowCoordinateDescription(axis, lower, upper) {
    return [
        'Ok başının ok kuyruğuna göre', axis, 'bileşenini ayarlar.',
        'Eğer `a' + axis + 'ref` `pixel` ise, pozitif (negatif)',
        'bileşen, okun', upper, 'dan', lower, 'a (veya', lower, 'dan', upper, 'a) işaret ettiğini gösterir.',
        'Eğer `a' + axis + 'ref` `pixel` değilse ve tam olarak `' + axis + 'ref` ile aynıysa,',
        'bu, o eksende mutlak bir değerdir,',
        'tıpkı `' + axis + '` gibi, `' + axis + 'ref` ile aynı koordinatlarda belirtilir.'
    ].join(' ');
}

module.exports = templatedArray('annotation', {
    visible: {
        valType: 'boolean',
        dflt: true,
        editType: 'calc+arraydraw',
        description: 'Bu açıklamanın görünür olup olmadığını belirler.'
    },

    text: {
        valType: 'string',
        editType: 'calc+arraydraw',
        description: [
            'Bu açıklama ile ilişkili metni ayarlar.',
            'Plotly, yeni satır (<br>), kalın (<b></b>), italik (<i></i>),',
            'hiperlinkler (<a href=\'...\'></a>) gibi şeyler yapmak için bir HTML etiketleri alt kümesi kullanır.',
            '<em>, <sup>, <sub>, <s>, <u>, <span> etiketleri de desteklenir.'
        ].join(' ')
    },
    textangle: {
        valType: 'angle',
        dflt: 0,
        editType: 'calc+arraydraw',
        description: 'Metnin yatayla olan açısını ayarlar.'
    },
    font: fontAttrs({
        editType: 'calc+arraydraw',
        colorEditType: 'arraydraw',
        description: 'Açıklama metin yazı tipini ayarlar.'
    }),
    width: {
        valType: 'number',
        min: 1,
        dflt: null,
        editType: 'calc+arraydraw',
        description: [
            'Metin kutusu için açık bir genişlik ayarlar. null (varsayılan) metnin kutu genişliğini ayarlamasına izin verir.',
            'Daha geniş metin kesilecektir.',
            'Otomatik sarma yoktur; yeni bir satır başlatmak için <br> kullanın.'
        ].join(' ')
    },
    height: {
        valType: 'number',
        min: 1,
        dflt: null,
        editType: 'calc+arraydraw',
        description: [
            'Metin kutusu için açık bir yükseklik ayarlar. null (varsayılan) metnin kutu yüksekliğini ayarlamasına izin verir.',
            'Daha uzun metin kesilecektir.'
        ].join(' ')
    },
    opacity: {
        valType: 'number',
        min: 0,
        max: 1,
        dflt: 1,
        editType: 'arraydraw',
        description: 'Açıklamanın (metin + ok) opaklığını ayarlar.'
    },
    align: {
        valType: 'enumerated',
        values: ['left', 'center', 'right'],
        dflt: 'center',
        editType: 'arraydraw',
        description: [
            'Metnin kutu içindeki yatay hizalamasını ayarlar.',
            'Yalnızca metin iki veya daha fazla satıra yayılırsa',
            '(yani metin bir veya daha fazla <br> HTML etiketi içeriyorsa) veya',
            'metin genişliğini geçersiz kılmak için açık bir genişlik ayarlanmışsa etkisi vardır.'
        ].join(' ')
    },
    valign: {
        valType: 'enumerated',
        values: ['top', 'middle', 'bottom'],
        dflt: 'middle',
        editType: 'arraydraw',
        description: [
            'Metnin kutu içindeki dikey hizalamasını ayarlar.',
            'Yalnızca metin yüksekliğini geçersiz kılmak için açık bir yükseklik ayarlanmışsa etkisi vardır.'
        ].join(' ')
    },
    bgcolor: {
        valType: 'color',
        dflt: 'rgba(0,0,0,0)',
        editType: 'arraydraw',
        description: 'Açıklamanın arka plan rengini ayarlar.'
    },
    bordercolor: {
        valType: 'color',
        dflt: 'rgba(0,0,0,0)',
        editType: 'arraydraw',
        description: 'Açıklama metnini çevreleyen sınırın rengini ayarlar.'
    },
    borderpad: {
        valType: 'number',
        min: 0,
        dflt: 1,
        editType: 'calc+arraydraw',
        description: 'Metin ile çevreleyen sınır arasındaki dolgu (px cinsinden) ayarlar.'
    },
    borderwidth: {
        valType: 'number',
        min: 0,
        dflt: 1,
        editType: 'calc+arraydraw',
        description: 'Açıklama metnini çevreleyen sınırın genişliğini (px cinsinden) ayarlar.'
    },
    // ok
    showarrow: {
        valType: 'boolean',
        dflt: true,
        editType: 'calc+arraydraw',
        description: [
            'Açıklamanın bir ok ile çizilip çizilmeyeceğini belirler.',
            'Eğer *true* ise, metin okun kuyruğuna yakın yerleştirilir.',
            'Eğer *false* ise, metin sağlanan x ve y ile hizalanır.'
        ].join(' ')
    },
    arrowcolor: {
        valType: 'color',
        editType: 'arraydraw',
        description: 'Açıklama okunun rengini ayarlar.'
    },
    arrowhead: {
        valType: 'integer',
        min: 0,
        max: ARROWPATHS.length,
        dflt: 1,
        editType: 'arraydraw',
        description: 'Son açıklama ok başı stilini ayarlar.'
    },
    startarrowhead: {
        valType: 'integer',
        min: 0,
        max: ARROWPATHS.length,
        dflt: 1,
        editType: 'arraydraw',
        description: 'Başlangıç açıklama ok başı stilini ayarlar.'
    },
    arrowside: {
        valType: 'flaglist',
        flags: ['end', 'start'],
        extras: ['none'],
        dflt: 'end',
        editType: 'arraydraw',
        description: 'Açıklama ok başı konumunu ayarlar.'
    },
    arrowsize: {
        valType: 'number',
        min: 0.3,
        dflt: 1,
        editType: 'calc+arraydraw',
        description: [
            'Son açıklama ok başının boyutunu, `arrowwidth` ile orantılı olarak ayarlar.',
            '1 (varsayılan) değeri, çizginin yaklaşık 3 katı genişliğinde bir baş verir.'
        ].join(' ')
    },
    startarrowsize: {
        valType: 'number',
        min: 0.3,
        dflt: 1,
        editType: 'calc+arraydraw',
        description: [
            'Başlangıç açıklama ok başının boyutunu, `arrowwidth` ile orantılı olarak ayarlar.',
            '1 (varsayılan) değeri, çizginin yaklaşık 3 katı genişliğinde bir baş verir.'
        ].join(' ')
    },
    arrowwidth: {
        valType: 'number',
        min: 0.1,
        editType: 'calc+arraydraw',
        description: 'Açıklama ok çizgisinin genişliğini (px cinsinden) ayarlar.'
    },
    standoff: {
        valType: 'number',
        min: 0,
        dflt: 0,
        editType: 'calc+arraydraw',
        description: [
            'Ok başını işaret ettiği konumdan uzaklaştırmak için bir mesafe (px cinsinden) ayarlar,',
            'örneğin, yakınlaştırmadan bağımsız olarak bir işaretleyicinin kenarını işaret etmek için.',
            'Bu, oku `ax` / `ay` vektöründen kısaltır,',
            'bu, her şeyi bu miktar kadar hareket ettiren `xshift` / `yshift` in aksine.'
        ].join(' ')
    },
    startstandoff: {
        valType: 'number',
        min: 0,
        dflt: 0,
        editType: 'calc+arraydraw',
        description: [
            'Başlangıç ok başını işaret ettiği konumdan uzaklaştırmak için bir mesafe (px cinsinden) ayarlar,',
            'örneğin, yakınlaştırmadan bağımsız olarak bir işaretleyicinin kenarını işaret etmek için.',
            'Bu, oku `ax` / `ay` vektöründen kısaltır,',
            'bu, her şeyi bu miktar kadar hareket ettiren `xshift` / `yshift` in aksine.'
        ].join(' ')
    },
    ax: {
        valType: 'any',
        editType: 'calc+arraydraw',
        description: arrowCoordinateDescription('x', 'sol', 'sağ')
    },
    ay: {
        valType: 'any',
        editType: 'calc+arraydraw',
        description: arrowCoordinateDescription('y', 'üst', 'alt')
    },
    axref: {
        valType: 'enumerated',
        dflt: 'pixel',
        values: [
            'pixel',
            cartesianConstants.idRegex.x.toString()
        ],
        editType: 'calc',
        description: [
            'Açıklamanın (ax,ay) kuyruğunun hangi koordinatlarda belirtildiğini gösterir.',
            axisPlaceableObjs.axisRefDescription('x', 'sol', 'sağ'),
            arrowAxisRefDescription('x')
        ].join(' ')
    },
    ayref: {
        valType: 'enumerated',
        dflt: 'pixel',
        values: [
            'pixel',
            cartesianConstants.idRegex.y.toString()
        ],
        editType: 'calc',
        description: [
            'Açıklamanın (ax,ay) kuyruğunun hangi koordinatlarda belirtildiğini gösterir.',
            axisPlaceableObjs.axisRefDescription('y', 'alt', 'üst'),
            arrowAxisRefDescription('y')
        ].join(' ')
    },
    // konumlandırma
    xref: {
        valType: 'enumerated',
        values: [
            'paper',
            cartesianConstants.idRegex.x.toString()
        ],
        editType: 'calc',
        description: [
            'Açıklamanın x koordinat eksenini ayarlar.',
            axisPlaceableObjs.axisRefDescription('x', 'sol', 'sağ'),
        ].join(' ')
    },
    x: {
        valType: 'any',
        editType: 'calc+arraydraw',
        description: [
            'Açıklamanın x konumunu ayarlar.',
            'Eğer eksen `type` *log* ise, aralığınızın logaritmasını almalısınız.',
            'Eğer eksen `type` *date* ise, tarih verileri gibi tarih dizeleri olmalıdır,',
            'ancak Tarih nesneleri ve unix milisaniyeleri kabul edilir ve dizelere dönüştürülür.',
            'Eğer eksen `type` *category* ise, her kategori sıfırdan başlayarak',
            'göründüğü sıraya göre bir seri numarası atanarak sayılar olmalıdır.'
        ].join(' ')
    },
    xanchor: {
        valType: 'enumerated',
        values: ['auto', 'left', 'center', 'right'],
        dflt: 'auto',
        editType: 'calc+arraydraw',
        description: [
            'Metin kutusunun yatay konum ankarasını ayarlar.',
            'Bu ankara, `x` konumunu açıklamanın *sol*, *orta* veya *sağ* kısmına bağlar.',
            'Örneğin, eğer `x` 1 olarak ayarlanmışsa, `xref` *paper* ve',
            '`xanchor` *right* ise, açıklamanın en sağ kısmı,',
            'çizim alanının en sağ kenarı ile hizalanır.',
            'Eğer *auto* ise, ankara, veri-referanslı açıklamalar veya ok varsa *orta* ile eşdeğerdir,',
            'ancak ok olmayan kağıt-referanslı açıklamalar için, seçilen ankara en yakın kenara karşılık gelir.'
        ].join(' ')
    },
    xshift: {
        valType: 'number',
        dflt: 0,
        editType: 'calc+arraydraw',
        description: [
            'Tüm açıklamanın ve okun konumunu sağa (pozitif) veya sola (negatif) bu kadar piksel kaydırır.'
        ].join(' ')
    },
    yref: {
        valType: 'enumerated',
        values: [
            'paper',
            cartesianConstants.idRegex.y.toString()
        ],
        editType: 'calc',
        description: [
            'Açıklamanın y koordinat eksenini ayarlar.',
            axisPlaceableObjs.axisRefDescription('y', 'alt', 'üst'),
        ].join(' ')
    },
    y: {
        valType: 'any',
        editType: 'calc+arraydraw',
        description: [
            'Açıklamanın y konumunu ayarlar.',
            'Eğer eksen `type` *log* ise, aralığınızın logaritmasını almalısınız.',
            'Eğer eksen `type` *date* ise, tarih verileri gibi tarih dizeleri olmalıdır,',
            'ancak Tarih nesneleri ve unix milisaniyeleri kabul edilir ve dizelere dönüştürülür.',
            'Eğer eksen `type` *category* ise, her kategori sıfırdan başlayarak',
            'göründüğü sıraya göre bir seri numarası atanarak sayılar olmalıdır.'
        ].join(' ')
    },
    yanchor: {
        valType: 'enumerated',
        values: ['auto', 'top', 'middle', 'bottom'],
        dflt: 'auto',
        editType: 'calc+arraydraw',
        description: [
            'Metin kutusunun dikey konum ankarasını ayarlar.',
            'Bu ankara, `y` konumunu açıklamanın *üst*, *orta* veya *alt* kısmına bağlar.',
            'Örneğin, eğer `y` 1 olarak ayarlanmışsa, `yref` *paper* ve',
            '`yanchor` *top* ise, açıklamanın en üst kısmı,',
            'çizim alanının en üst kenarı ile hizalanır.',
            'Eğer *auto* ise, ankara, veri-referanslı açıklamalar veya ok varsa *orta* ile eşdeğerdir,',
            'ancak ok olmayan kağıt-referanslı açıklamalar için, seçilen ankara en yakın kenara karşılık gelir.'
        ].join(' ')
    },
    yshift: {
        valType: 'number',
        dflt: 0,
        editType: 'calc+arraydraw',
        description: [
            'Tüm açıklamanın ve okun konumunu yukarı (pozitif) veya aşağı (negatif) bu kadar piksel kaydırır.'
        ].join(' ')
    },
    clicktoshow: {
        valType: 'enumerated',
        values: [false, 'onoff', 'onout'],
        dflt: false,
        editType: 'arraydraw',
        description: [
            'Bu açıklamanın grafikteki tıklamalara yanıt verip vermeyeceğini belirler.',
            'Eğer `x` ve `y` değerleri bu açıklama ile tam olarak eşleşen bir veri noktasına tıklarsanız ve',
            'gizli ise (visible: false), görünür hale gelir. *onoff* modunda, aynı noktaya tekrar tıklamanız gerekir',
            'bu açıklamayı gizlemek için, bu nedenle birden fazla noktaya tıklarsanız, birden fazla açıklama gösterebilirsiniz.',
            '*onout* modunda, grafikte başka bir yere (başka bir veri noktasına veya değil) tıklamak',
            'bu açıklamayı gizler.',
            'Eğer farklı `x` veya `y` değerlerine yanıt olarak bu açıklamayı gösterip/gizlemeniz gerekiyorsa,',
            '`xclick` ve/veya `yclick` ayarlayabilirsiniz. Bu, örneğin bir çubuğun yanını etiketlemek için kullanışlıdır.',
            'Ancak işaretleyicileri etiketlemek için, `standoff` `xclick` ve `yclick` yerine tercih edilir.'
        ].join(' ')
    },
    xclick: {
        valType: 'any',
        editType: 'arraydraw',
        description: [
            'Bu açıklamayı, `x` değerinden ziyade `xclick` olan bir veri noktasına tıkladığınızda değiştirir.'
        ].join(' ')
    },
    yclick: {
        valType: 'any',
        editType: 'arraydraw',
        description: [
            'Bu açıklamayı, `y` değerinden ziyade `yclick` olan bir veri noktasına tıkladığınızda değiştirir.'
        ].join(' ')
    },
    hovertext: {
        valType: 'string',
        editType: 'arraydraw',
        description: [
            'Bu açıklamanın üzerine gelindiğinde görünen metni ayarlar.',
            'Eğer boş bırakılırsa, hiçbir hover etiketi görünmez.'
        ].join(' ')
    },
    hoverlabel: {
        bgcolor: {
            valType: 'color',
            editType: 'arraydraw',
            description: [
                'Hover etiketinin arka plan rengini ayarlar.',
                'Varsayılan olarak açıklamanın `bgcolor` rengini opak hale getirir,',
                'veya şeffafsa beyaz kullanır.'
            ].join(' ')
        },
        bordercolor: {
            valType: 'color',
            editType: 'arraydraw',
            description: [
                'Hover etiketinin sınır rengini ayarlar.',
                'Varsayılan olarak, `hoverlabel.bgcolor` ile maksimum kontrast için',
                'koyu gri veya beyaz kullanır.'
            ].join(' ')
        },
        font: fontAttrs({
            editType: 'arraydraw',
            description: [
                'Hover etiketi metin yazı tipini ayarlar.',
                'Varsayılan olarak, küresel hover yazı tipi ve boyutunu kullanır,',
                '`hoverlabel.bordercolor` renginden.'
            ].join(' ')
        }),
        editType: 'arraydraw'
    },
        captureevents: {
            valType: 'boolean',
            editType: 'arraydraw',
            description: [
                'Açıklama metin kutusunun fare hareketi ve tıklama olaylarını yakalayıp yakalamayacağını belirler,',
                'veya bu olayların açıklamanın arkasında olabilecek veri noktalarına geçmesine izin verir.',
                'Varsayılan olarak, `captureevents` *false* olur, `hovertext` sağlanmadıkça.',
                'Eğer `hovertext` olmadan `plotly_clickannotation` olayını kullanıyorsanız,',
                '`captureevents` açıkça etkinleştirmeniz gerekir.'
            ].join(' ')
            }
        }
    );
