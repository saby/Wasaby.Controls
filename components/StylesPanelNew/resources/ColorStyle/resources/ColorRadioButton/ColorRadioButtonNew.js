/**
 * Created by ps.borisov on 29.08.2016.
 */

define('SBIS3.CONTROLS/StylesPanelNew/resources/ColorStyle/resources/ColorRadioButton/ColorRadioButtonNew', [
   'SBIS3.CONTROLS/Radio/Button/RadioButtonBase',
   'tmpl!SBIS3.CONTROLS/StylesPanelNew/resources/ColorStyle/resources/ColorRadioButton/ColorRadioButtonNew'
], function(RadioButtonBase, dotTplFn) {

   'use strict';

   /**
    * Радиокнопка выбора цвета
    * @class SBIS3.CONTROLS.ColorRadioButton
    * @extends SBIS3.CONTROLS/Radio/Button/RadioButtonBase
    * @public
    * @author Авраменко А.С.
    */

   var ColorRadioButtonNew = RadioButtonBase.extend(/** @lends SBIS3.CONTROLS.ColorRadioButton.prototype */ {
      _dotTplFn: dotTplFn
   });
   return ColorRadioButtonNew;
});