/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS.FloatArea', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.PopupMixin',
   'js!SBIS3.CORE.LikeWindowMixin',
   'tmpl!SBIS3.CONTROLS.FloatArea',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'css!SBIS3.CONTROLS.FloatArea'
], function(CompoundControl, PopupMixin, LikeWindowMixin, dotTpl, TemplateUtil) {

   'use strict';
    

   var FloatArea = CompoundControl.extend([PopupMixin, LikeWindowMixin], /** @lends SBIS3.CONTROLS.FloatArea.prototype*/ {
      _dotTplFn : dotTpl,
      $protected: {
         _options: {
            /** @cfg {String} Устанавливает анимацию появления панели.
             * @variant no Без анимации.
             * @variant fade Появление.
             * @variant slide Всплывание.
             */
            animation : 'no',
             /**
              * @cfg {String} Устанавливает имя компонента, который будет открыт на всплывающей панели, или вёрстку всего шаблона.
              * @remark
              * Имя компонента устанавливают в формате "js!SBIS3.MyArea.MyComponent".
              */
            template: null,
            /** @cfg {Object} Опции для компонента, отображаемого внутри {@link template}
             */
            componentOptions: {}
         }
      },

      _modifyOptions: function(options) {
         options = FloatArea.superclass._modifyOptions.apply(this, arguments);
         //В рамках совместимости, делаю функцию, если прислали верстку
         if (typeof options.template == 'string' && options.template.indexOf('js!') !== 0) {
            options.template = TemplateUtil.prepareTemplate(options.template);
         }
         return options;
      },

      $constructor: function() {
         
      },

      //TODO должен быть нормально переписан в новом Control
      toggle: function(){
         if (this.isVisible()){
            this.hide();
         }else {
            this.show();
         }
      }
   });

   return FloatArea;

});