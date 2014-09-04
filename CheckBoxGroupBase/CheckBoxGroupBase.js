/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('js!SBIS3.CONTROLS.CheckBoxGroupBase', ['js!SBIS3.CORE.Control'], function(Control) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора одного или нескольких значений из набора. Отображения не имеет.
    * @class SBIS3.CONTROLS.CheckBoxGroupBase
    * @mixes SBIS3.CONTROLS._CollectionMixin
    * @mixes SBIS3.CONTROLS._MultiSelectorMixin
    * @extends SBIS3.CORE.Control
    */

   var CheckBoxGroupBase = Control.Control.extend( /** @lends SBIS3.CONTROLS.CheckBoxGroupBase.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }

   });

   return CheckBoxGroupBase;

});