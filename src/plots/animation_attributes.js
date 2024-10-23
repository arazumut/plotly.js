'use strict';

module.exports = {
    mod: {
        valType: 'enumerated',
        dflt: 'hepsindenSonra',
        values: ['hemen', 'sonraki', 'hepsindenSonra'],
        description: [
            'Yeni bir animasyon çağrısının mevcut animasyonlarla nasıl etkileşime girdiğini açıklar.',
            'Eğer `hemen` ise, mevcut animasyonlar kesilir ve yeni animasyon başlatılır.',
            'Eğer `sonraki` ise, mevcut kare tamamlanır ve ardından yeni animasyon başlatılır.',
            'Eğer `hepsindenSonra` ise, tüm mevcut kareler tamamlanana kadar yeni animasyon başlatılmaz.'
        ].join(' ')
    },
    yön: {
        valType: 'enumerated',
        values: ['ileri', 'geri'],
        dflt: 'ileri',
        description: [
            'Animasyon çağrısı ile tetiklenen karelerin oynatılma yönü'
        ].join(' ')
    },
    mevcutKareden: {
        valType: 'boolean',
        dflt: false,
        description: [
            'Kareleri baştan başlamak yerine mevcut kareden itibaren oynat.'
        ].join(' ')
    },
    kare: {
        süre: {
            valType: 'number',
            min: 0,
            dflt: 500,
            description: [
                'Her karenin milisaniye cinsinden süresi. Kare süresinden büyükse, kare süresi ile sınırlanır.'
            ].join(' ')
        },
        yenidenÇiz: {
            valType: 'boolean',
            dflt: true,
            description: [
                'Geçiş tamamlandığında grafiği yeniden çiz. Bu, geçiş yapılamayan özellikleri içeren geçişler için istenir,',
                'ancak tam bir yeniden çizim gerektirmeyen güncellemeleri önemli ölçüde yavaşlatabilir.'
            ].join(' ')
        },
    },
    geçiş: {
        süre: {
            valType: 'number',
            min: 0,
            dflt: 500,
            editType: 'none',
            description: [
                'Geçiş süresi, milisaniye cinsinden. Sıfır ise, güncellemeler eşzamanlıdır.'
            ].join(' ')
        },
        yumuşatma: {
            valType: 'enumerated',
            dflt: 'kübik-iç-dış',
            values: [
                'doğrusal',
                'kare',
                'kübik',
                'sinüs',
                'üstel',
                'daire',
                'elastik',
                'geri',
                'zıplama',
                'doğrusal-iç',
                'kare-iç',
                'kübik-iç',
                'sinüs-iç',
                'üstel-iç',
                'daire-iç',
                'elastik-iç',
                'geri-iç',
                'zıplama-iç',
                'doğrusal-dış',
                'kare-dış',
                'kübik-dış',
                'sinüs-dış',
                'üstel-dış',
                'daire-dış',
                'elastik-dış',
                'geri-dış',
                'zıplama-dış',
                'doğrusal-iç-dış',
                'kare-iç-dış',
                'kübik-iç-dış',
                'sinüs-iç-dış',
                'üstel-iç-dış',
                'daire-iç-dış',
                'elastik-iç-dış',
                'geri-iç-dış',
                'zıplama-iç-dış'
            ],
            editType: 'none',
            description: 'Geçiş için kullanılan yumuşatma fonksiyonu'
        },
        sıralama: {
            valType: 'enumerated',
            values: ['düzen önce', 'izler önce'],
            dflt: 'düzen önce',
            editType: 'none',
            description: [
                'Hem izlerin hem de düzenin değiştiği güncellemeler sırasında figürün düzeninin mi yoksa izlerinin mi',
                'daha yumuşak geçiş yapacağını belirler.'
            ].join(' ')
        }
    }
};
