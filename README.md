<a href="https://plotly.com/javascript/"><img src="https://images.plot.ly/logo/plotlyjs-logo@2x.png" height="70"></a>

[![npm version](https://badge.fury.io/js/plotly.js.svg)](https://badge.fury.io/js/plotly.js)
[![circle ci](https://circleci.com/gh/plotly/plotly.js.png?&style=shield&circle-token=1f42a03b242bd969756fc3e53ede204af9b507c0)](https://circleci.com/gh/plotly/plotly.js)
[![MIT License](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://github.com/plotly/plotly.js/blob/master/LICENSE)

[Plotly.js](https://plotly.com/javascript) is a standalone Javascript data visualization library, and it also powers the Python and R modules named `plotly` in those respective ecosystems (referred to as [Plotly.py](https://plotly.com/python) and [Plotly.R](http://plotly.com/r)).

Plotly.js can be used to produce dozens of chart types and visualizations, including statistical charts, 3D graphs, scientific charts, SVG and tile maps, financial charts and more.

<p align="center">
    <a href="https://plotly.com/javascript/" target="_blank">
        <img src="https://raw.githubusercontent.com/cldougl/plot_images/add_r_img/plotly_2017.png">
    </a>
</p>

[Contact us](https://plotly.com/products/consulting-and-oem/) for Plotly.js consulting, dashboard development, application integration, and feature additions.

<div align="center">
  <a href="https://dash.plotly.com/project-maintenance">
    <img src="https://dash.plotly.com/assets/images/maintained-by-plotly.png" width="400px" alt="Maintained by Plotly">
  </a>
</div>


## Table of contents

* [Load as a node module](#load-as-a-node-module)
* [Load via script tag](#load-via-script-tag)
* [Bundles](#bundles)
* [Alternative ways to load and build plotly.js](#alternative-ways-to-load-and-build-plotlyjs)
* [Documentation](#documentation)
* [Bugs and feature requests](#bugs-and-feature-requests)
* [Contributing](#contributing)
* [Notable contributors](#notable-contributors)
* [Copyright and license](#copyright-and-license)
* [Community](#community)

---
## Load as a node module
Install [a ready-to-use distributed bundle](https://github.com/plotly/plotly.js/blob/master/dist/README.md)
```sh
npm i --save plotly.js-dist-min
```

and use import or require in node.js
```js
// ES6 module
import Plotly from 'plotly.js-dist-min'

// CommonJS
var Plotly = require('plotly.js-dist-min')
```

You may also consider using [`plotly.js-dist`](https://www.npmjs.com/package/plotly.js-dist) if you prefer using an unminified package.

---
## Load via script tag

### The script HTML element
> In the examples below `Plotly` object is added to the window scope by `script`. The `newPlot` method is then used to draw an interactive figure as described by `data` and `layout` into the desired `div` here named `gd`. As demonstrated in the example above basic knowledge of `html` and [JSON](https://en.wikipedia.org/wiki/JSON) syntax is enough to get started i.e. with/without JavaScript! To learn and build more with plotly.js please visit [plotly.js documentation](https://plotly.com/javascript).

```html
<head>
    <script src="https://cdn.plot.ly/plotly-2.35.2.min.js" charset="utf-8"></script>
</head>
<body>
    <div id="gd"></div>

    <script>
        Plotly.newPlot("gd", /* JSON object */ {
            "data": [{ "y": [1, 2, 3] }],
            "layout": { "width": 600, "height": 400}
        })
    </script>
</body>
```

Alternatively you may consider using [native ES6 import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) in the script tag.
```html
<script type="module">
    import "https://cdn.plot.ly/plotly-2.35.2.min.js"
    Plotly.newPlot("gd", [{ y: [1, 2, 3] }])
</script>
```

Fastly supports Plotly.js with free CDN service. Read more at <https://www.fastly.com/open-source>.

### Un-minified versions are also available on CDN
While non-minified source files may contain characters outside UTF-8, it is recommended that you specify the `charset` when loading those bundles.
```html
<script src="https://cdn.plot.ly/plotly-2.35.2.js" charset="utf-8"></script>
```

> Please note that as of v2 the "plotly-latest" outputs (e.g. https://cdn.plot.ly/plotly-latest.min.js) will no longer be updated on the CDN, and will stay at the last v1 patch v1.58.5. Therefore, to use the CDN with plotly.js v2 and higher, you must specify an exact plotly.js version.

### MathJax
You could load either version two or version three of MathJax files, for example:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_SVG.js"></script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"></script>
```

> When using MathJax version 3, it is also possible to use `chtml` output on the other parts of the page in addition to `svg` output for the plotly graph.
Please refer to `devtools/test_dashboard/index-mathjax3chtml.html` to see an example.

### Need to have several WebGL graphs on a page?
You may simply load [virtual-webgl](https://github.com/greggman/virtual-webgl) script for WebGL 1 (not WebGL 2) before loading other scripts.
```html
<script src="https://unpkg.com/virtual-webgl@1.0.6/src/virtual-webgl.js"></script>
```

## Bundles
There are two kinds of plotly.js bundles:
1. Complete and partial official bundles that are distributed to `npm` and the `CDN`, described in [the dist README](https://github.com/plotly/plotly.js/blob/master/dist/README.md).
2. Custom bundles you can create yourself to optimize the size of bundle depending on your needs. Please visit [CUSTOM_BUNDLE](https://github.com/plotly/plotly.js/blob/master/CUSTOM_BUNDLE.md) for more information.

---
## Alternative ways to load and build plotly.js
If your library needs to bundle or directly load [plotly.js/lib/index.js](https://github.com/plotly/plotly.js/blob/master/lib/index.js) or parts of its modules similar to [index-basic](https://github.com/plotly/plotly.js/blob/master/lib/index-basic.js) in some other way than via an official or a custom bundle, or in case you want to tweak the default build configurations, then please visit [`BUILDING.md`](https://github.com/plotly/plotly.js/blob/master/BUILDING.md).

---
## Documentation

Official plotly.js documentation is hosted at [https://plotly.com/javascript](https://plotly.com/javascript).

These pages are generated by the Plotly [graphing-library-docs repo](https://github.com/plotly/graphing-library-docs) built with [Jekyll](https://jekyllrb.com/) and publicly hosted on GitHub Pages.
For more info about contributing to Plotly documentation, please read through [contributing guidelines](https://github.com/plotly/graphing-library-docs/blob/master/README.md).

---
## Bugs and feature requests

Have a bug or a feature request? Please [open a Github issue](https://github.com/plotly/plotly.js/issues/new) keeping in mind the [issue guidelines](https://github.com/plotly/plotly.js/blob/master/.github/ISSUE_TEMPLATE.md). You may also want to read about [how changes get made to Plotly.js](https://github.com/plotly/plotly.js/blob/master/CONTRIBUTING.md)

---
## Contributing

Please read through our [contributing guidelines](https://github.com/plotly/plotly.js/blob/master/CONTRIBUTING.md). Included are directions for opening issues, using plotly.js in your project and notes on development.

---
## Notable contributors

Plotly.js is at the core of a large and dynamic ecosystem with many contributors who file issues, reproduce bugs, suggest improvements, write code in this repo (and other upstream or downstream ones) and help users in the Plotly community forum. The following people deserve special recognition for their outsized contributions to this ecosystem:

|   | GitHub | Twitter | Status |
|---|--------|---------|--------|
|**Alex C. Johnson**| [@alexcjohnson](https://github.com/alexcjohnson) | | Active, Maintainer |
|**Mojtaba Samimi** | [@archmoj](https://github.com/archmoj) | [@solarchvision](https://twitter.com/solarchvision) | Active, Maintainer |
|**Emily Kellison-Linn** | [@emilykl](https://github.com/emilykl) | | Active, Maintainer |
|**My-Tien Nguyen**| [@my-tien](https://github.com/my-tien) | | Active, Community Contributor |
|**Birk Skyum**| [@birkskyum](https://github.com/birkskyum) | | Active, Community Contributor |
|**Étienne Tétreault-Pinard**| [@etpinard](https://github.com/etpinard) | [@etpinard](https://twitter.com/etpinard) | Hall of Fame |
|**Antoine Roy-Gobeil** | [@antoinerg](https://github.com/antoinerg) | | Hall of Fame |
|**Jack Parmer**| [@jackparmer](https://github.com/jackparmer) | | Hall of Fame |
|**Nicolas Kruchten** | [@nicolaskruchten](https://github.com/nicolaskruchten) | [@nicolaskruchten](https://twitter.com/nicolaskruchten) | Hall of Fame |
|**Mikola Lysenko**| [@mikolalysenko](https://github.com/mikolalysenko) | [@MikolaLysenko](https://twitter.com/MikolaLysenko) | Hall of Fame |
|**Ricky Reusser**| [@rreusser](https://github.com/rreusser) | [@rickyreusser](https://twitter.com/rickyreusser) | Hall of Fame |
|**Dmitry Yv.** | [@dy](https://github.com/dy) | [@DimaYv](https://twitter.com/dimayv)| Hall of Fame |
|**Jon Mease** | [@jonmmease](https://github.com/jonmmease) | [@jonmmease](https://twitter.com/jonmmease) | Hall of Fame |
|**Robert Monfera**| [@monfera](https://github.com/monfera) | [@monfera](https://twitter.com/monfera) | Hall of Fame |
|**Robert Möstl** | [@rmoestl](https://github.com/rmoestl) | [@rmoestl](https://twitter.com/rmoestl) | Hall of Fame |
|**Nicolas Riesco**| [@n-riesco](https://github.com/n-riesco) | | Hall of Fame |
|**Miklós Tusz**| [@mdtusz](https://github.com/mdtusz) | [@mdtusz](https://twitter.com/mdtusz)| Hall of Fame |
|**Chelsea Douglas**| [@cldougl](https://github.com/cldougl) | | Hall of Fame |
|**Ben Postlethwaite**| [@bpostlethwaite](https://github.com/bpostlethwaite) | | Hall of Fame |
|**Hannah Ker** | [@hannahker](https://github.com/hannahker) | [@hannahker11](https://twitter.com/hannahker11)| Hall of Fame |
|**Chris Parmer**| [@chriddyp](https://github.com/chriddyp) | | Hall of Fame |
|**Alex Vados**| [@alexander-daniel](https://github.com/alexander-daniel) | | Hall of Fame |

---
## Copyright and license

Code and documentation copyright 2021 Plotly, Inc.

Code released under the [MIT license](https://github.com/plotly/plotly.js/blob/master/LICENSE).

### Versioning

This project is maintained under the [Semantic Versioning guidelines](https://semver.org/).

See the [Releases section](https://github.com/plotly/plotly.js/releases) of our GitHub project for changelogs for each release version of plotly.js.

---
## Community

* Follow [@plotlygraphs](https://twitter.com/plotlygraphs) on Twitter for the latest Plotly news.
* Implementation help may be found on community.plot.com (tagged [`plotly-js`](https://community.plotly.com/c/plotly-js)) or
  on Stack Overflow (tagged [`plotly`](https://stackoverflow.com/questions/tagged/plotly)).
* Developers should use the keyword `plotly` on packages which modify or add to the functionality of plotly.js when distributing through [npm](https://www.npmjs.com/browse/keyword/plotly).
* 


Turkish

<a href="https://plotly.com/javascript/"><img src="https://images.plot.ly/logo/plotlyjs-logo@2x.png" height="70"></a>



Plotly.js, bağımsız bir JavaScript veri görselleştirme kütüphanesidir. Aynı zamanda, Python ve R ekosistemlerinde "plotly" olarak adlandırılan Plotly.py ve Plotly.R modüllerini de destekler.

Plotly.js, istatistiksel grafikler, 3D grafikler, bilimsel grafikler, SVG ve döşeme haritaları, finansal grafikler ve daha fazlasını üretmek için kullanılabilir.

<p align="center"> <a href="https://plotly.com/javascript/" target="_blank"> <img src="https://raw.githubusercontent.com/cldougl/plot_images/add_r_img/plotly_2017.png"> </a> </p>
Plotly.js danışmanlığı, gösterge paneli geliştirme, uygulama entegrasyonu ve özellik ekleme konularında bize ulaşın.

<div align="center"> <a href="https://dash.plotly.com/project-maintenance"> <img src="https://dash.plotly.com/assets/images/maintained-by-plotly.png" width="400px" alt="Plotly Tarafından Korunmaktadır"> </a> </div>
İçindekiler
Node Modülü Olarak Yükleyin
Script Etiketi ile Yükleyin
Paketler
Plotly.js'i Yüklemek ve İnşa Etmek İçin Alternatif Yollar
Dokümantasyon
Hatalar ve Özellik Talepleri
Katkıda Bulunma
Önemli Katkıda Bulunanlar
Telif Hakkı ve Lisans
Topluluk
Node Modülü Olarak Yükleyin
Hazır kullanıma uygun dağıtılmış bir paketi kurun:

npm i --save plotly.js-dist-min
ve node.js içinde import veya require ile kullanın:


// ES6 modülü
import Plotly from 'plotly.js-dist-min'

// CommonJS
var Plotly = require('plotly.js-dist-min')
Minify edilmemiş bir paket tercih ediyorsanız, plotly.js-dist kullanmayı düşünebilirsiniz.

Script Etiketi ile Yükleyin
Script HTML Elemanı
Aşağıdaki örneklerde Plotly nesnesi script tarafından window kapsamına eklenir. newPlot metodu daha sonra data ve layout tarafından tanımlanan etkileşimli bir şekli istenilen div içine çizer. Burada gd adı verilmiştir. Yukarıdaki örnekte gösterildiği gibi, temel html ve JSON sözdizimi bilgisi yeterlidir. Daha fazlasını öğrenmek ve inşa etmek için plotly.js dokümantasyonuna göz atın.


<head>
    <script src="https://cdn.plot.ly/plotly-2.35.2.min.js" charset="utf-8"></script>
</head>
<body>
    <div id="gd"></div>

    <script>
        Plotly.newPlot("gd", /* JSON objesi */ {
            "data": [{ "y": [1, 2, 3] }],
            "layout": { "width": 600, "height": 400 }
        })
    </script>
</body>
Alternatif olarak, yerel ES6 import komutunu script etiketi içinde kullanabilirsiniz.


<script type="module">
    import "https://cdn.plot.ly/plotly-2.35.2.min.js"
    Plotly.newPlot("gd", [{ y: [1, 2, 3] }])
</script>
Fastly, Plotly.js'i ücretsiz CDN hizmetiyle destekler. Daha fazla bilgi için https://www.fastly.com/open-source.

CDN'de Minify Edilmemiş Sürümler
Minify edilmemiş kaynak dosyalar UTF-8 dışında karakterler içerebilir, bu nedenle bu paketleri yüklerken charset belirtmeniz önerilir.


<script src="https://cdn.plot.ly/plotly-2.35.2.js" charset="utf-8"></script>
v2'den itibaren "plotly-latest" çıktıları (örneğin https://cdn.plot.ly/plotly-latest.min.js) artık güncellenmeyecektir. v1'in son yaması olan v1.58.5'te kalacaktır. Bu nedenle, plotly.js v2 ve üzeri bir sürümü kullanmak için CDN'de kesin bir sürüm belirtmeniz gerekir.

MathJax
MathJax dosyalarının ikinci veya üçüncü sürümlerini yükleyebilirsiniz, örneğin:


<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS-MML_SVG.js"></script>

<script src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"></script>
MathJax sürüm 3 kullanılırken, plotly grafiği dışında chtml çıktısını kullanmak da mümkündür. Bir örnek görmek için devtools/test_dashboard/index-mathjax3chtml.html dosyasına göz atın.

Sayfada Birden Fazla WebGL Grafiği Kullanmak İster misiniz?
WebGL 1 (WebGL 2 değil) için virtual-webgl betiğini diğer betiklerden önce yükleyebilirsiniz.


<script src="https://unpkg.com/virtual-webgl@1.0.6/src/virtual-webgl.js"></script>
Paketler
Plotly.js için iki tür paket vardır:

Resmi olarak npm ve CDN üzerinden dağıtılan tam ve kısmi paketler, dist README dosyasında açıklanmıştır.
Kendi ihtiyaçlarınıza göre optimize edebileceğiniz özel paketler. Daha fazla bilgi için CUSTOM_BUNDLE dosyasına göz atın.
Plotly.js'i Yüklemek ve İnşa Etmek İçin Alternatif Yollar
Kitaplığınızın, plotly.js/lib/index.js veya index-basic gibi modülleri doğrudan veya parçalar halinde yüklemesi gerekiyorsa, veya varsayılan yapı yapılandırmalarını değiştirmek istiyorsanız, lütfen BUILDING.md dosyasını ziyaret edin.

Dokümantasyon
Resmi plotly.js dokümantasyonu https://plotly.com/javascript adresinde barındırılmaktadır.

Bu sayfalar, Jekyll ile oluşturulmuş Plotly graphing-library-docs deposu tarafından üretilir ve GitHub Pages'de barındırılır. Plotly dokümantasyonuna katkıda bulunmak hakkında daha fazla bilgi için lütfen katkı yönergelerini okuyun.

Hatalar ve Özellik Talepleri
Bir hata mı buldunuz veya yeni bir özellik mi istiyorsunuz? Lütfen GitHub sorunları üzerinden bir rapor oluşturun.

Katkıda Bulunma
Katkıda bulunmak isterseniz, lütfen katkı yönergelerini gözden geçirin.

Önemli Katkıda Bulunanlar
Bu projeye katkıda bulunanlar, projeyi sürdürülebilir ve geliştirilebilir kılmak için emek veren gönüllülerdir. Onlara teşekkür ediyoruz. Tüm katkıda bulunanları GitHub sayfamızda görebilirsiniz.

Telif Hakkı ve Lisans
Plotly.js, MIT Lisansı kapsamında lisanslanmıştır.

Topluluk
Plotly topluluğuna katılmak ve daha fazla bilgi edinmek için:

Plotly'nin forumuna katılın
Plotly blogunu okuyun






