/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS.FloatArea', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CONTROLS.PopupMixin', 'js!SBIS3.CORE.LikeWindowMixin', 'html!SBIS3.CONTROLS.FloatArea', 'css!SBIS3.CONTROLS.FloatArea'], function(CompoundControl, PopupMixin, LikeWindowMixin, dotTpl) {

   'use strict';

   /**
    * Класс контрола "Всплывающая панель". Отображает вложенные компоненты в виде диалогового окна.
    * @class SBIS3.CONTROLS.FloatArea
    * @extends SBIS3.CORE.CompoundControl
    * @public
    *
    * @mixes SBIS3.CONTROLS.PopupMixin
    * @mixes SBIS3.CORE.LikeWindowMixin
    *
    * @author Крайнов Дмитрий Олегович
    */

   var FloatArea = CompoundControl.extend([PopupMixin, LikeWindowMixin], /** @lends SBIS3.CONTROLS.FloatArea.prototype*/ {
      _dotTplFn : dotTpl,
      $protected: {
         _options: {
            /**
             * @cfg {String} Устанавливает анимацию появления панели.
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
            template: null
         }
      },

      _modifyOptions: function(options) {
         options = FloatArea.superclass._modifyOptions.apply(this, arguments);
         if (options.template && options.template.indexOf('js!') === 0) {
            require([options.template], function(){});
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