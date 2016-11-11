/**
 * Created by ps.borisov on 29.08.2016.
 */

define('js!SBIS3.CONTROLS.ColorRadioButtonNew', [
   'js!SBIS3.CONTROLS.RadioButtonBase',
   'html!SBIS3.CONTROLS.ColorRadioButtonNew'
], function(RadioButtonBase, dotTplFn) {

   'use strict';

   /**
    * Радиокнопка выбора цвета
    * @class SBIS3.CONTROLS.ColorRadioButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @public
    * @author Борисов П.С.
    */

   var ColorRadioButtonNew = RadioButtonBase.extend(/** @lends SBIS3.CONTROLS.ColorRadioButton.prototype */ {
      _dotTplFn: dotTplFn
   });
   return ColorRadioButtonNew;
});