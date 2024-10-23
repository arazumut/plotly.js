# plotly.js Security Policy

Açık kaynak plotly.js kütüphanesi "OLDUĞU GİBİ" sağlanmaktadır ve güvenlik garantisi verilmemektedir. Daha fazla bilgi için lütfen [lisans](https://raw.githubusercontent.com/plotly/plotly.js/master/LICENSE) sayfamıza bakın.

plotly.js'in 1.x sürümlerinde, plotly.js tarafından grafiklenen güvenilmeyen verilerden kaynaklanan XSS saldırılarına (ve benzeri sorunlara) karşı koruma sağlamaya çalışıyoruz. Ancak, XSS veya diğer sorunlar hala mevcut olabilir.

plotly.js'in tipik kullanım durumunun güvenilir kaynaklardan veri görselleştirmek olduğunu unutmayın. Örneğin, plotly.js'i sitenize bir gösterge tablosu eklemek için kullanıyorsanız ve plotly.js'ye gönderilen tüm giriş verilerini kontrol ediyorsanız, XSS koruması için plotly.js'ye bağımlı değilsiniz.

Daha yüksek bir güvence derecesine ihtiyacınız varsa, lütfen [Plotly On-Premise](https://plotly.com/get-pricing/) ürünümüzü satın almayı veya daha fazla seçenek için [Plotly satış ekibi](mailto:sales@plotly.com) ile iletişime geçmeyi düşünün.

## Raporlar

Bir güvenlik açığını bildirmek için lütfen problemi yeniden oluşturma adımlarıyla birlikte security@plotly.com adresine e-posta gönderin. İlk yanıt için lütfen 24 saate kadar bekleyin.

## Ödüller

Bazı durumlarda, güvenlik açıklarının raporları için parasal tazminat (ödüller) sunuyoruz. Daha fazla bilgi için lütfen [Plotly Güvenlik Açığı Ödül Programı](https://plotly.com/chart-studio-help/security/) sayfasına bakın.

## Yayın Süreci

plotly.js güvenlik düzeltmeleri genellikle mevcut plotly.js sürümünün üzerine "yama" sürümleri olarak yayınlanır. Örneğin, mevcut plotly.js sürümü 1.14.0 ise ve bir güvenlik sorununu düzeltirsek, düzeltme ile 1.14.1'i yayınlarız. Alternatif olarak, güvenlik düzeltmeleri normal yayın döngümüzle çakışıyorsa, büyük veya küçük bir plotly.js sürümünün parçası olarak yapılabilir. Örneğin, mevcut plotly.js sürümü 1.14.0 ise, düzeltme ile 1.15.0 sürümünü yayınlayabiliriz.

Güvenlik düzeltmeleri, ödeme yapan Plotly On-Premise veya Plotly Cloud müşterileri tarafından gerekli görüldüğünde eski plotly.js sürümlerine geri taşınır. Bu düzeltmeler "yama" sürümleri olarak yayınlanır ve etkilenen müşteriler yükselttikten sonra topluluğa sunulur. Ayrıca, topluluk üyeleri tarafından katkıda bulunulan eski sürümlere geri taşımaları kabul ediyoruz.

Tipik plotly.js kullanım durumu güvenilir verileri içerdiğinden, eski, potansiyel olarak savunmasız sürümleri GitHub deposundan veya CDN'mizden kaldırmıyoruz.

## Danışmanlıklar

1 Ağustos 2016'dan sonra yayınlanan tüm plotly.js güvenlik danışmanlıkları [Plotly Güvenlik Danışmanlıkları](https://plotly.com/chart-studio-help/security-advisories/) sayfasında mevcuttur.



# plotly.js Security Policy

The open source plotly.js library is provided "AS IS", with no security guarantees.  Please see our
[license](https://raw.githubusercontent.com/plotly/plotly.js/master/LICENSE) for more information.

In the 1.x releases of plotly.js, we attempt to protect against XSS attacks (and similar issues) resulting from
untrusted data being graphed by plotly.js.  However, XSS or other issues may still exist.

Note that the typical use case for plotly.js is for visualizing data from trusted sources.  For example if you use plotly.js to add a dashboard to your site and you control all the input data that's sent to plotly.js, you are not dependent on plotly.js for XSS protection.

If you require a higher degree of assurance, please consider purchasing our
[Plotly On-Premise](https://plotly.com/get-pricing/) product, or [contact the Plotly sales team](mailto:sales@plotly.com)
for more options.

## Reports

To report a security vulnerability, please email security@plotly.com with steps to reproduce the problem. Please allow up to
24 hours for an initial response.

## Bounties

In some cases, we offer monetary compensation (bounties) for reports of security vulnerabilities.  Please see the [Plotly Security Vulnerability Bounty Program](https://plotly.com/chart-studio-help/security/) page for more information.

## Release Process

plotly.js security fixes are normally released as "patch" releases on top of the current plotly.js version.  For example if the current plotly.js version is 1.14.0 and we fix a security issue, we will release 1.14.1 with the fix.  Alternatively, security fixes may be made as part of a major or minor plotly.js release, if the fix coincides with our normal release cycle.  For example if the current plotly.js version is 1.14.0, we may release version 1.15.0 with the fix instead of 1.14.1.

Security fixes are backported to older versions of plotly.js as required by paying Plotly On-Premise or Plotly Cloud customers.  These fixes are released as "patch" releases, and are made available to the community once affected customers have upgraded.  We also accept backports to older versions contributed by community members.

Since the typical plotly.js use case involves trusted data, we do not remove old, potentially vulnerable versions from our GitHub repo or from our CDN.

## Advisories

All plotly.js security advisories released after August 1, 2016 are available at the [Plotly Security Advisories](https://plotly.com/chart-studio-help/security-advisories/) page.
