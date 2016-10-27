/**
 * Created by ps.borisov on 29.08.2016.
 */

define('js!SBIS3.CONTROLS.ColorRadioButton', [
   'js!SBIS3.CONTROLS.RadioButtonBase',
   'html!SBIS3.CONTROLS.ColorRadioButton'
], function(RadioButtonBase, dotTplFn) {

   'use strict';

   /**
    * Радиокнопка выбора цвета
    * @class SBIS3.CONTROLS.ColorRadioButton
    * @extends SBIS3.CONTROLS.RadioButtonBase
    * @public
    * @author Борисов П.С.
    */

   var ColorRadioButton = RadioButtonBase.extend(/** @lends SBIS3.CONTROLS.ColorRadioButton.prototype */ {
      _dotTplFn: dotTplFn
   });
   return ColorRadioButton;
});