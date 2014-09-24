/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS.FloatArea', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS._PopupMixin', 'html!SBIS3.CONTROLS.FloatArea', 'css!SBIS3.CONTROLS.FloatArea'], function(Control, _PopupMixin, dotTpl) {

   'use strict';

   /**
    * Контрол, отображающий вложенные компоненты в виде диалоговго окна
    * @class SBIS3.CONTROLS.FloatArea
    * @extends SBIS3.CORE.Control
    * @mixes SBIS3.CONTROLS._PopupMixin
    * @control
    */

   var FloatArea = Control.Control.extend([_PopupMixin], /** @lends SBIS3.CONTROLS.FloatArea.prototype*/ {
      _dotTplFn : dotTpl,
      $protected: {
         _options: {
            /**
             * @typedef {Object} AnimationEnum
             * @variant no
             * @variant fade
             * @variant slide
             */
            /**
             * @cfg {AnimationEnum} Вид анимации появления
             */
            animation : 'no'
         }
      },

      $constructor: function() {

      },

      show: function(){
         //чтобы визуально представление не дергалось, сначала расчитаем размеры, а затем отобразим
         this._container.addClass('ws-hidden');
         FloatArea.superclass.show.call(this);
         this.recalcPosition();
         this._container.removeClass('ws-hidden');
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