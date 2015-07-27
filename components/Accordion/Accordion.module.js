/**
 * Created by iv.cheremushkin on 14.08.2014.
 */

define('js!SBIS3.CONTROLS.Accordion', ['js!SBIS3.CONTROLS.SwitchableArea'], function(SwitchableArea) {

   'use strict';

   /**
    * Контрол, содержащий несколько областей содержащих контент.
    * В каждый момент времени отображается только одна область.
    * Отображаемая область может переключаться при клике на корневые пункты аккордеона.
    * @author Крайнов Дмитрий Олегович
    * @class SBIS3.CONTROLS.Accordion
    * @extends SBIS3.CONTROLS.SwitchableArea
    */

   var Accordion = SwitchableArea.extend( /** @lends SBIS3.CONTROLS.Accordion.prototype */ {
      $protected: {
         _options: {

         }
      },

      $constructor: function() {

      }
   });

   return Accordion;

});
