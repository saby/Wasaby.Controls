/**
 * Created by am.gerasimov on 19.01.2016.
 */
//Приходится пока что реквайрить dot, потому что очень многие задают шаблоны стркоами
define('SBIS3.CONTROLS/Utils/TemplateUtil', ['Core/js-template-doT', 'View/Runner/requireHelper', 'require'], function(doT, requireHelper, requirejs) {

    /**
     * @class SBIS3.CONTROLS/Utils/TemplateUtil
     * @author Крайнов Дмитрий Олегович
     * @public
     */
   return /** @lends SBIS3.CONTROLS/Utils/TemplateUtil.prototype */{
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
         if (tpl instanceof String) {
            tpl = tpl.toString();
         }

         switch (typeof tpl) {
            case 'string' :
               if (tpl.indexOf('html!') === 0 || tpl.indexOf('tmpl!') === 0) {
                  template = requirejs(tpl);
               } else if (requireHelper.defined(tpl)) {
                  template = requirejs(tpl);
               } else if (tpl.indexOf('{{') === -1 && tpl.indexOf('{[') === -1) {
                  // хак для ускорения работы, делаем проверку, что строка - безопасна и в ней не лежит текст или название шаблона,
                  // и ее не надо никак обрабатывать - ни строить функцию, ни пытаться искать шаблон
                  template = function () {return tpl};
               } else {
                  template = doT.template(tpl);
               }
               break;
            case 'function' :
               template = tpl;
               break;
            case 'undefined' :
               template = undefined;
               break;
            case 'object' :
               if (typeof tpl.func === 'function'){
                  template = tpl.func;
                  return template;
               }
               // Обработка контентной опции массив
               if (Object.prototype.toString.call(tpl) === '[object Array]') {
                  template = function prepareTemplateOnArray() {
                     var fnargs = Array.prototype.slice.call(arguments);
                     return tpl.reduce(function prepareTemplateOnArrayReduce(prevtemplate, nexttemplate) {
                        var nextTpl = nexttemplate;
                        if (typeof nexttemplate === 'function'){
                           nextTpl = nexttemplate;
                        } else if (typeof nexttemplate.func === 'function'){
                           nextTpl = nexttemplate.func;
                        } else {
                           nextTpl = function(){return  '';}
                        }
                        return prevtemplate + nextTpl.apply(this, fnargs);
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
