/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.TabControl', ['js!SBIS3.CONTROLS.SwitchableArea'], function(SwitchableArea) {

   'use strict';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область. Отображаемая область может переключаться при клике на корешки закладок.
    * @class SBIS3.CONTROLS.TabControl
    * @extends SBIS3.CONTROLS.SwitchableArea
    * @author Крайнов Дмитрий Олегович
    */

   var TabControl = SwitchableArea.extend( /** @lends SBIS3.CONTROLS.TabControl.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return TabControl;

});