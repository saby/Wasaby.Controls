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
   var trim = Tools.trim;
   return Sanitizer = function(settings) {
      this.schema = new Schema(settings);
      this.parser = new DomParser(settings, this.schema);
      this.serializer = new Serializer(this.schema);
      this.clear = function(content) {
         if (!content) {
            return "";
         }
         content = this.serializer.serialize(this.parser.parse(content));
         content = trim(content);
         return content;
      };
   }
});
