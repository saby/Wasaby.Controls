/**
 * Created by ps.borisov on 29.08.2016.
 */

define('js!SBIS3.CONTROLS.ColorStyle', [
   'js!SBIS3.CONTROLS.RadioGroup',
   'html!SBIS3.CONTROLS.ColorStyle/resources/ItemTemplate',
   'Core/EventBus',
   'js!SBIS3.CONTROLS.ColorRadioButtonNew'
], function(RadioGroup, ItemTemplate, EventBus) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора цвета
    * @class SBIS3.CONTROLS.ColorGroup
    * @extends SBIS3.CONTROLS.RadioGroup
    * @public
    * @author Борисов П.С.
    */

   var ColorGroup = RadioGroup.extend(/** @lends SBIS3.CONTROLS.ColorGroup.prototype */ {
      $protected: {
         _options: {
            items: [
               {color:'#000000'},
               {color:'#EF463A'},
               {color:'#72BE44'},
               {color:'#0055BB'},
               {color:'#A426D9'},
               {color:'#999999'}
            ],
            allowEmptySelection: false,
            _defaultItemTemplate: ItemTemplate
         }
      }
   });
   return ColorGroup;
});