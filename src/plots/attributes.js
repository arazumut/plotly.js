'use strict';

var fontAttrs = require('./font_attributes');
var fxAttrs = require('../components/fx/attributes');

module.exports = {
    tür: {
        valType: 'enumerated',
        values: [],     // dinamik olarak listelenir
        dflt: 'scatter',
        editType: 'calc+clearAxisTypes',
        _noTemplating: true // bu işlemi daha üst seviyede ele alıyoruz
    },
    görünür: {
        valType: 'enumerated',
        values: [true, false, 'legendonly'],
        dflt: true,
        editType: 'calc',
        description: [
            'Bu izleme öğesinin görünür olup olmadığını belirler.',
            '*legendonly* ise, izleme öğesi çizilmez,',
            'ancak bir efsane öğesi olarak görünebilir',
            '(efsane kendisi görünür olduğu sürece).'
        ].join(' ')
    },
    efsanegöster: {
        valType: 'boolean',
        dflt: true,
        editType: 'style',
        description: [
            'Bu izleme öğesine karşılık gelen bir öğenin',
            'efsane içinde gösterilip gösterilmeyeceğini belirler.'
        ].join(' ')
    },
    efsane: {
        valType: 'subplotid',
        dflt: 'legend',
        editType: 'style',
        description: [
            'Bu izleme öğesini göstermek için bir efsaneye referans ayarlar.',
            'Bu efsanelere referanslar *legend*, *legend2*, *legend3*, vb.',
            'Bu efsaneler için ayarlar, düzen içinde,',
            '`layout.legend`, `layout.legend2`, vb. altında ayarlanır.'
        ].join(' ')
    },
    efsanegrubu: {
        valType: 'string',
        dflt: '',
        editType: 'style',
        description: [
            'Bu izleme öğesi için efsane grubunu ayarlar.',
            'Aynı efsane grubunun parçası olan izleme öğeleri ve şekiller,',
            'efsane öğelerini değiştirirken aynı anda gizlenir/gösterilir.'
        ].join(' ')
    },
    efsanegrububaşlığı: {
        metin: {
            valType: 'string',
            dflt: '',
            editType: 'style',
            description: [
                'Efsane grubunun başlığını ayarlar.'
            ].join(' ')
        },
        yazıtipi: fontAttrs({
            editType: 'style',
            description: [
                'Bu efsane grubunun başlık yazı tipini ayarlar.'
            ].join(' '),
        }),
        editType: 'style',
    },
    efsanesırası: {
        valType: 'number',
        dflt: 1000,
        editType: 'style',
        description: [
            'Bu izleme öğesi için efsane sırasını ayarlar.',
            'Küçük sıralara sahip öğeler ve gruplar üstte/sol tarafta sunulurken,',
            '*ters* `legend.traceorder` ile altta/sağda sunulurlar.',
            'Varsayılan efsane sırası 1000\'dir,',
            'bu nedenle belirli öğeleri tüm sıralanmamış öğelerden önce yerleştirmek için 1000\'den küçük sıralar kullanabilirsiniz,',
            've sıralanmamış öğelerden sonra gitmek için 1000\'den büyük sıralar kullanabilirsiniz.',
            'Sıralanmamış veya eşit sıralı öğeler olduğunda, şekiller izleme öğelerinden sonra görüntülenir,',
            'yani veri ve düzen içindeki sıralarına göre.'
        ].join(' ')
    },
    efsanegenisligi: {
        valType: 'number',
        min: 0,
        editType: 'style',
        description: 'Bu izleme öğesi için efsanenin genişliğini (px veya kesir olarak) ayarlar.',
    },
    opaklık: {
        valType: 'number',
        min: 0,
        max: 1,
        dflt: 1,
        editType: 'style',
        description: 'İzleme öğesinin opaklığını ayarlar.'
    },
    isim: {
        valType: 'string',
        editType: 'style',
        description: [
            'İzleme öğesinin adını ayarlar.',
            'İzleme öğesinin adı efsane öğesi olarak ve üzerine gelindiğinde görünür.'
        ].join(' ')
    },
    uid: {
        valType: 'string',
        editType: 'plot',
        anim: true,
        description: [
            'Bu izleme öğesine bir kimlik atayın,',
            'Bunu, animasyonlar ve geçişler sırasında izleme öğeleri arasında nesne tutarlılığı sağlamak için kullanın.'
        ].join(' ')
    },
    kimlikler: {
        valType: 'data_array',
        editType: 'calc',
        anim: true,
        description: [
            'Her bir veriye kimlik etiketleri atar.',
            'Bu kimlikler, animasyon sırasında veri noktalarının nesne tutarlılığı içindir.',
            'Bir dizi dize olmalıdır, sayı veya başka bir tür değil.'
        ].join(' ')
    },
    özelveri: {
        valType: 'data_array',
        editType: 'calc',
        description: [
            'Her bir veriye ekstra veri atar.',
            'Bu, üzerine gelme, tıklama ve seçim olaylarını dinlerken yararlı olabilir.',
            'Not: *scatter* izleme öğeleri ayrıca özelveri öğelerini işaretleyicilerde ekler',
            'DOM öğeleri'
        ].join(' ')
    },
    meta: {
        valType: 'any',
        arrayOk: true,
        editType: 'plot',
        description: [
            'Bu izleme öğesiyle ilişkili ekstra meta bilgileri atar',
            'bu, çeşitli metin özniteliklerinde kullanılabilir.',
            'İzleme öğesi `isim`, grafik, eksen ve renk çubuğu `başlık.metin`, açıklama `metin`',
            '`aralık seçici`, `güncelleme menüleri` ve `kaydırıcılar` `etiket` metni',
            'hepsi `meta`yı destekler.',
            'Aynı izleme öğesindeki bir öznitelikte izleme öğesi `meta` değerlerine erişmek için,',
            '`%{meta[i]}` kullanın, burada `i` `meta`',
            'öğesinin dizini veya anahtarıdır.',
            'Düzen özniteliklerinde izleme öğesi `meta`ya erişmek için,',
            '`%{data[n[.meta[i]}` kullanın, burada `i` `meta`',
            've `n` izleme öğesi dizinidir.'
        ].join(' ')
    },

    // Not: Bunlar 'data_array' olamaz çünkü diğer veri dizileriyle aynı uzunlukta değiller
    // ve genel olarak arrayOk öznitelikleri
    //
    // Belki başka bir valType ekleyin:
    // https://github.com/plotly/plotly.js/issues/1894
    seçilmişnoktalar: {
        valType: 'any',
        editType: 'calc',
        description: [
            'Seçilen noktaların tamsayı dizinlerini içeren dizi.',
            'Sadece seçimleri destekleyen izleme öğeleri için etkisi vardır.',
            'Boş bir dizi, `seçilmeyen`',
            'tüm noktalar için açıldığında boş bir seçim anlamına gelirken,',
            'herhangi bir başka dizi olmayan değerler,',
            'tüm seçimlerin kapalı olduğu anlamına gelir ve `seçilen` ve `seçilmeyen` stillerinin etkisi yoktur.'
        ].join(' ')
    },

    üzerinegelmebilgisi: {
        valType: 'flaglist',
        flags: ['x', 'y', 'z', 'text', 'name'],
        extras: ['all', 'none', 'skip'],
        arrayOk: true,
        dflt: 'all',
        editType: 'none',
        description: [
            'Üzerine gelindiğinde hangi izleme öğesi bilgilerinin görüneceğini belirler.',
            '`none` veya `skip` ayarlandığında, üzerine gelindiğinde hiçbir bilgi görüntülenmez.',
            'Ancak, `none` ayarlandığında, tıklama ve üzerine gelme olayları yine de tetiklenir.'
        ].join(' ')
    },
    üzerinegelmeetiketi: fxAttrs.hoverlabel,
    akış: {
        token: {
            valType: 'string',
            noBlank: true,
            strict: true,
            editType: 'calc',
            description: [
                'Akış kimlik numarası, bir grafikteki veri izleme öğesini bir akışla bağlar.',
                'Daha fazla ayrıntı için https://chart-studio.plotly.com/settings adresine bakın.'
            ].join(' ')
        },
        maxpoints: {
            valType: 'number',
            min: 0,
            max: 10000,
            dflt: 500,
            editType: 'calc',
            description: [
                'Gelen bir akıştan grafikte tutulacak maksimum nokta sayısını ayarlar.',
                '`maxpoints` *50* olarak ayarlanmışsa, sadece en yeni 50 nokta',
                'grafikte görüntülenecektir.'
            ].join(' ')
        },
        editType: 'calc'
    },
    dönüşümler: {
        _isLinkedToArray: 'transform',
        editType: 'calc',
        description: [
            'UYARI: Tüm dönüşümler kullanımdan kaldırılmıştır ve bir sonraki ana sürümde API\'den kaldırılabilir.',
            'İzleme verilerini manipüle eden işlemler dizisi,',
            'örneğin veri dizilerini filtreleme veya sıralama.'
        ].join(' ')
    },
    uirevision: {
        valType: 'any',
        editType: 'none',
        description: [
            'İzleme öğesine yapılan bazı kullanıcı odaklı değişikliklerin kalıcılığını kontrol eder:',
            '`parcoords` izleme öğelerinde `constraintrange`, ve bazı',
            '`editable: true` değişiklikleri, örneğin `isim` ve `renk çubuğu başlığı`.',
            'Varsayılan olarak `layout.uirevision`.',
            'Diğer kullanıcı odaklı izleme öznitelik değişikliklerinin kontrol edildiğini unutmayın',
            '`layout` öznitelikleri tarafından:',
            '`trace.visible` `layout.legend.uirevision` tarafından kontrol edilir,',
            '`selectedpoints` `layout.selectionrevision` tarafından kontrol edilir,',
            've `colorbar.(x|y)` (erişilebilir `config: {editable: true}` ile)',
            '`layout.editrevision` tarafından kontrol edilir.',
            'İzleme değişiklikleri `uid` ile izlenir, bu yalnızca izleme',
            'dizini yoksa izleme dizinine geri döner. Bu nedenle, uygulamanız',
            'veri dizisinin sonuna izleme öğeleri ekleyip/çıkarabiliyorsa,',
            'aynı izleme öğesinin farklı bir dizine sahip olması durumunda bile,',
            'her izleme öğesine bir `uid` verirseniz kullanıcı odaklı değişiklikleri koruyabilirsiniz.'
        ].join(' ')
    }
};
