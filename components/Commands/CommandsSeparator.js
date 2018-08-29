/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('SBIS3.CONTROLS/Commands/CommandsSeparator', [
   'SBIS3.CONTROLS/WSControls/Buttons/ButtonBase',
   'SBIS3.CONTROLS/Mixins/Checkable',
   'tmpl!SBIS3.CONTROLS/Commands/CommandsSeparator',
   'css!SBIS3.CONTROLS/Commands/CommandsSeparator'
], function(WSButtonBase, Checkable, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий разделитель.
    * @class SBIS3.CONTROLS/Commands/CommandsSeparator
    * @extends WSControls/Buttons/ButtonBase
    * @author Крайнов Д.О.
    *
    * @mixes SBIS3.CONTROLS/Mixins/Checkable
    *
    * @public
    * @control
    * @category ButtonBase
    * @initial
    * <component data-component='SBIS3.CONTROLS/Commands/CommandsSeparator'>
    *    <option name='command' value='toggleHistory'></option>
    * </component>
    */

   var CommandsSeparator = WSButtonBase.extend([Checkable], /** @lends SBIS3.CONTROLS/Button/ToggleButton.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {

            // CommandsSeparator не должен активироваться по клику так же как MenuItem. Иначе, если открыть меню ->
            // кликнуть по разделителю -> закрыть меню, уничтожается *активный* CommandSeparator, что приводит к
            // восстановлению фокуса, когда это не нужно
            activableByClick: false

         }
      }
   });

   return CommandsSeparator;

});
