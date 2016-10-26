/**
 * Created by ps.borisov on 29.08.2016.
 */

define('js!SBIS3.CONTROLS.ColorGroup', [
   'js!SBIS3.CONTROLS.RadioGroup',
   'html!SBIS3.CONTROLS.ColorGroup/resources/ItemTemplate',
   'js!SBIS3.CONTROLS.ColorRadioButton'
], function(RadioGroup, ItemTemplate) {

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
               {id: 'black'},
               {id: 'red'},
               {id: 'green'},
               {id: 'blue'},
               {id: 'purple'},
               {id: 'grey'}
            ],
            _defaultItemTemplate: ItemTemplate
         }
      }
   });
   return ColorGroup;
});