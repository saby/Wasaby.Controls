(function(){

   'use strict';

   var global = (function(){ return this || (0,eval)('this'); }()),
       define = global.define || (global.requirejs && global.requirejs.define);

   function mkTemplate(f, name) {

      var fname = name.replace(/[^a-z0-9]/gi, '_');

      // Это обертка для улучшения логов. Создается именованая функция с понятным названием чтобы из стэка можно было понять битый шаблон
      var factory = new Function('f',
         "return function " + fname + "(){ return f.apply(this, arguments); }"
      );

      var result = factory(f);
      result.toJSON = function() {
         return 'wsFuncDecl::html!' + name;
      };
      return result;
   }

   /**
    * Поддерживаемые форматы запроса
    * - html!SBIS3.CORE.HTMLChunk - подключит шаблон
    * - html!encode=true?SBIS3.CORE.HTMLChunk - подключит шаблон, в котором все {{=it....}} будет делать эскейпинг текста
    */
   define('html', ['Core/js-template-doT'], function(doT){
      return {

         load: function (name, require, load) {

            var
               options = name.split('?'),
               doEncode = false,
               optStr, config;

            if (options.length > 1) {
               optStr = options.shift();
               name = options.join('?');
               doEncode = /\bencode=true\b/.test(optStr);
            } else {
               name = options[0];
            }

            try {
               var path = $ws.helpers.requirejsPathResolver(name, 'html');
               require(["text!" + path], function(html){
                  config = doT.getSettings();
                  config.strip = false;
                  if (doEncode) {
                     config.encode = config.interpolate;
                  }
                  try {
                     load(mkTemplate(doT.template(html, config), name));
                  } catch (e) {
                     e.message = 'Error while creating template ' + name + '\n' + e.message;
                     load.error(e);
                  }
               }, function(e){
                  e.message = 'Error while loading template ' + name + '\n' + e.message;
                  load.error(e);
               });
            } catch(e) {
               e.message = 'Error while resolving template ' + name + '\n' + e.message;
               load.error(e);
            }
         }
      }
   });
})();