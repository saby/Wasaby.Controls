/**
 * Created by am.gerasimov on 19.01.2016.
 */
//Приходится пока что реквайрить dot, потому что очень многие задают шаблоны стркоами
define('js!SBIS3.CONTROLS.Utils.TemplateUtil', ['Core/js-template-doT'], function() {

    /**
     * @class SBIS3.CONTROLS.Utils.TemplateUtil
     * @public
     */
   return /** @lends SBIS3.CONTROLS.Utils.TemplateUtil.prototype */{
       /**
        *
        * @param tpl
        * @returns {*}
        */
      prepareTemplate: function(tpl) {
         var template;

          /**
           * Если это результат функции rk - тогда
           * сделаем из него строку
           * Потому что rkString - это не string
           * typeof rkString === 'object'
           * Далее логика функции такова, что если это не строка - вернем этот объект
           * нужно чтобы код далее работал с результатом функции rk как со строкой
           */
         if (tpl && tpl.toString && tpl.saveToValue) {
            tpl = tpl.toString();
         }

         switch (typeof tpl) {
            case 'string' :
               template = tpl.indexOf('html!') === 0 || tpl.indexOf('tmpl!') === 0 ?
                   global.requirejs(tpl) :
                   doT.template(tpl);
               break;
            case 'function' :
               template = tpl;
               break;
            case 'undefined' :
               template = undefined;
               break;
            case 'object' :
               // Обработка контентной опции массив
               if (Object.prototype.toString.call(tpl) === '[object Array]') {
                  template = function prepareTemplateOnArray() {
                     var fnargs = Array.prototype.slice.call(arguments);
                     return tpl.reduce(function prepareTemplateOnArrayReduce(prevtemplate, nexttemplate) {
                        return prevtemplate + nexttemplate.apply(this, fnargs);
                     }, '');
                  };
               } else {
                  template = null;
               }
               break;
            default:
               template = null;
         }
         return template;
      }
   };
});