/**
 * Created by iv.cheremushkin on 12.08.2014.
 */

define('js!SBIS3.CONTROLS.FloatArea', ['js!SBIS3.CORE.CompoundControl', 'js!SBIS3.CONTROLS._PopupMixin', 'html!SBIS3.CONTROLS.FloatArea', 'css!SBIS3.CONTROLS.FloatArea'], function(CompoundControl, _PopupMixin, dotTpl) {

   'use strict';

   /**
    * Контрол, отображающий вложенные компоненты в виде диалоговго окна
    * @class SBIS3.CONTROLS.FloatArea
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS._PopupMixin
    */

   var FloatArea = CompoundControl.extend([_PopupMixin], /** @lends SBIS3.CONTROLS.FloatArea.prototype*/ {
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