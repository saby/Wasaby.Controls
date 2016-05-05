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
       * Утилита для очистки содержимого (string) от скриптов
       * @class SBIS3.CONTROLS.Utils.Sanitizer
       * @author Авраменко А.С.
       * @public
       * */
   var Sanitizer = function(settings) {
      this.schema = new Schema(settings);
      this.parser = new DomParser(settings, this.schema);
      this.serializer = new Serializer(this.schema);
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
       *          clearContent = sanitizer.clear(dirtyHtml);
       *          //clearContent = '<div>content</div>'
       *    })
       * <pre>
       * */
      this.clear = function(content) {
         if (!content) {
            return "";
         }
         content = this.serializer.serialize(this.parser.parse(content));
         content = Tools.trim(content);
         return content;
      };
   };
   return Sanitizer;
});
