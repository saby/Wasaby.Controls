(function() {

   "use strict";
   var global = (function() {return this || (0,eval)('this');}()),
       define = global.define || (global.requirejs && global.requirejs.define),
       // На препроцессоре грузим все языки
       loadAllLangs = typeof document == 'undefined';

   define("i18n", {
         load: function(name, require, onLoad/*, conf*/) {
            var names = name.split(';'),
                curLang = $ws.single.i18n.getLang(),
                langToLoad = loadAllLangs ? Object.keys($ws._const.availableLanguage) : [curLang],
                pdef = new $ws.proto.ParallelDeferred();

            // На клиенте, если язык неизвестен, просто вернем rk без загрузки каких-либо словарей
            if (loadAllLangs || $ws.single.i18n.hasLang(curLang)) {
               // На препроцессоре будем загружать нужный словарь для всех языков
               // На клиенте - лишь нужный
               $ws.helpers.forEach(langToLoad, function(curLang){
                  $ws.single.i18n.setLang(curLang);

                  $ws.helpers.forEach(names, function(name) {
                     if ($ws.single.i18n.hasDict(name)) {
                        return;
                     }
                     (function(dictPath, dictName, curLang) {
                        var arr = [],
                            def = new $ws.proto.Deferred();

                        if ($ws._const.jsDictionary[dictName + '.' + curLang + '.json']) {
                           arr.push('json!' + dictPath);
                        }

                        if (!loadAllLangs) {
                           // Грузим только те css, о которых знал Джин при конвертации
                           if ($ws._const.jsDictionary[dictName + '.' + curLang + '.css']) {
                              arr.push('css!' + dictPath.replace('.json', '.css'));
                           }

                           var curCountry = curLang.substr(3, 2);
                           if ($ws._const.jsDictionary[dictName + '.' + curCountry + '.css']) {
                              arr.push('css!' + dictPath.replace(new RegExp(curLang, 'g'), curCountry).replace('.json', '.css'));
                           }
                        }

                        // Грузим только те словари, о которых знал Джин при конвертации
                        if (arr.length) {
                           pdef.push(def);
                           require(arr, function(json) {
                              $ws.single.i18n.setDict(json, dictName, curLang);
                              def.callback();
                           });
                        }
                     })($ws.helpers.requirejsPathResolver(name, 'i18n'), name, curLang);
                  });
               });
            }

            pdef.done().getResult().addBoth(function() {
               onLoad($ws.single.i18n.rk.bind($ws.single.i18n));
            });
         }
   });
}());