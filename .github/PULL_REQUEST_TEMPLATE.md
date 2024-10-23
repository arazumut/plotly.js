Thanks for your interest in plotly.js!

### Translations:

- Please @ mention a few other speakers of this language who can help review your translations.
- If you've omitted any keys from [dist/translation_keys.txt](https://github.com/plotly/plotly.js/blob/master/dist/translation-keys.txt) - which means they will fall back on the US English text - just make a short comment about why in the PR description: the English text works fine in your language, or you would like someone else to help translating those, or whatever the reason.
- You should only update files in `lib/locales/`, not those in `dist/`

### Features, Bug fixes, and others:

Before opening a pull request, developer should:
1. make sure they are not on the `master` branch of their fork as using `master` for a pull request would make it difficult to fetch `upstream` changes.
2. fetch latest changes from `upstream/master` into your fork i.e. `origin/master` then pull `origin/master` from you local `master`.
3. then `git rebase master` their local dev branch off the latest `master` which should be sync with `upstream/master` at this time.
4. make sure to **not** `git add` the `dist/` folder (the `dist/` is updated only on version bumps).
5. make sure to commit changes to the `package-lock.json` file (if any new dependency required).
6. provide a title and write an overview of what the PR attempts to do with a link to the issue they are trying to address.
7. select the _Allow edits from maintainers_ option (see this [article](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/) for more details).

After opening a pull request, developer:
 - should create a new small markdown log file using the PR number e.g. `1010_fix.md` or `1010_add.md` inside `draftlogs` folder as described in this [README](https://github.com/plotly/plotly.js/blob/master/draftlogs/README.md), commit it and push.
 - should **not** force push (i.e. `git push -f`) to remote branches associated with opened pull requests. Force pushes make it hard for maintainers to keep track of updates. Therefore, if required, please fetch `upstream/master` and "merge" with master instead of "rebase".


Thanks for your interest in plotly.js!

### Çeviriler:

- Lütfen çevirilerinizi gözden geçirebilecek bu dili konuşan birkaç kişiyi @ ile etiketleyin.
- [dist/translation_keys.txt](https://github.com/plotly/plotly.js/blob/master/dist/translation-keys.txt) dosyasından herhangi bir anahtarı atladıysanız - bu, ABD İngilizcesi metnine geri dönecekleri anlamına gelir - PR açıklamasında nedenini kısaca belirtin: İngilizce metin dilinizde gayet iyi çalışıyor, ya da bu anahtarları çevirmede başka birinden yardım almak istiyorsunuz, ya da her ne sebeple olursa olsun.
- Sadece `lib/locales/` içindeki dosyaları güncellemelisiniz, `dist/` içindekileri değil.

### Özellikler, Hata düzeltmeleri ve diğerleri:

Bir pull request açmadan önce, geliştirici:
1. forklarının `master` dalında olmadığından emin olmalıdır, çünkü bir pull request için `master` kullanmak `upstream` değişikliklerini almakta zorluk yaratır.
2. `upstream/master`dan en son değişiklikleri forklarına çekmeli, yani `origin/master`a, ardından yerel `master`dan `origin/master`ı çekmelidir.
3. ardından yerel geliştirme dalını en son `master`dan `git rebase master` ile yeniden düzenlemelidir, bu noktada `upstream/master` ile senkronize olmalıdır.
4. `dist/` klasörünü **eklememeye** dikkat etmelidir (`dist/` sadece sürüm artışlarında güncellenir).
5. `package-lock.json` dosyasındaki değişiklikleri (eğer yeni bir bağımlılık gerekiyorsa) commit etmeye dikkat etmelidir.
6. bir başlık sağlamalı ve PR'ın ne yapmaya çalıştığını açıklayan bir genel bakış yazmalı ve çözmeye çalıştıkları soruna bir bağlantı eklemelidir.
7. _Bakımcıların düzenlemelerine izin ver_ seçeneğini seçmelidir (daha fazla bilgi için bu [makaleye](https://help.github.com/articles/allowing-changes-to-a-pull-request-branch-created-from-a-fork/) bakın).

Bir pull request açtıktan sonra, geliştirici:
 - PR numarasını kullanarak `draftlogs` klasörü içinde küçük bir markdown log dosyası oluşturmalı, örneğin `1010_fix.md` veya `1010_add.md`, bu [README](https://github.com/plotly/plotly.js/blob/master/draftlogs/README.md) dosyasında açıklandığı gibi, commit etmeli ve push yapmalıdır.
 - Açılmış pull requestlerle ilişkili uzak dallara zorla push yapmamalıdır (yani `git push -f`). Zorla push yapmak, bakımcıların güncellemeleri takip etmesini zorlaştırır. Bu nedenle, gerekirse `upstream/master`ı çekin ve "rebase" yerine "merge" ile birleştirin.

