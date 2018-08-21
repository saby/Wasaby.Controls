/**
 * Created by ps.borisov on 29.08.2016.
 */

define('SBIS3.CONTROLS/StylesPanelNew/resources/ColorStyle/ColorStyle', [
   'SBIS3.CONTROLS/Radio/Group',
   'tmpl!SBIS3.CONTROLS/StylesPanelNew/resources/ColorStyle/resources/ItemTemplate',
   'SBIS3.CONTROLS/StylesPanelNew/resources/ColorStyle/resources/ColorRadioButton/ColorRadioButtonNew'
], function(RadioGroup, ItemTemplate) {

   'use strict';

   /**
    * Контрол, реализующий поведение выбора цвета
    * @class SBIS3.CONTROLS.ColorGroup
    * @extends SBIS3.CONTROLS/Radio/Group
    * @public
    * @author Авраменко А.С.
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