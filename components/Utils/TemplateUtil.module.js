/**
 * Created by am.gerasimov on 19.01.2016.
 */
define('js!SBIS3.CONTROLS.Utils.TemplateUtil', [], function() {
   return {
      prepareTemplate: function(tpl) {
         var template;

         switch (typeof tpl) {
            case 'string' :
               template = tpl.indexOf('html!') === 0 ?
                   require(tpl) :
                   doT.template(tpl);
               break;
            case 'function' :
               template = tpl;
               break;
            case 'undefined' :
               template = undefined;
               break;
            default:
               template = null
         }

         return template;
      }
   }
});