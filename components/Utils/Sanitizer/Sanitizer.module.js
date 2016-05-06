/**
 * Created by ps.borisov on 18.04.2016.
 */
define('js!SBIS3.CONTROLS.Utils.Sanitizer',
   [
      'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Serializer',
      'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Schema',
      'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/DomParser',
      'js!SBIS3.CONTROLS.Utils.Sanitizer/TinyyMCEClasses/Tools'
   ], function(Serializer,Schema, DomParser, Tools) {
      'use strict';
      /**
       * Утилита для очистки содержимого (string) от xss
       * @class SBIS3.CONTROLS.Utils.Sanitizer
       * @author Авраменко А.С.
       * @public
       * */
   var Sanitizer = function(settings) {
      var
         schema = new Schema(settings),
         parser = new DomParser(settings, schema),
         serializer = new Serializer(schema);
      /**
       * Очищает контент от вредоносных скриптов
       * @param {string} content который необходимо очистить от вредоносных скриптов
       * @returns {string}
       * @example
       * <pre>
       *    require([js!SBIS3.CONTROLS.Utils.Sanitizer'], function(Sanitizer) {
       *       var
       *          dirtyHtml = '<div>content</div><script>alert(1)</script>'
       *          sanitizer = new Sanitizer(),
       *          clearContent = sanitizer.clearContent(dirtyHtml);
       *          //clearContent = '<div>content</div>'
       *    })
       * <pre>
       * */
      this.clearContent = function(content) {
         if (!content) {
            return "";
         }
         content = serializer.serialize(parser.parse(content));
         content = Tools.trim(content);
         return content;
      };
   };
   return Sanitizer;
});
