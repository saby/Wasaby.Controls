/**
 * Модуль 'Кнопка-иконка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.IconButton', ['js!SBIS3.CORE.Control', 'js!SBIS3.CONTROLS.Clickable', 'js!SBIS3.CONTROLS.IconMixin', 'html!SBIS3.CONTROLS.IconButton'], function(Control, Clickable, IconMixin, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * @class SBIS3.CONTROLS.IconButton
	* @demo SBIS3.CONTROLSs.Demo.MyIconButton
    * @extends $ws.proto.Control
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.IconButton'>
    *    <option name="icon">sprite:icon-16 icon-AddButton icon-primary</option>
    * </component>
    * @public
    * @category Buttons
    * @mixes SBIS3.CONTROLS.IconMixin
    * @mixes SBIS3.CONTROLS.Clickable
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    */

   var IconButton = Control.Control.extend([Clickable, IconMixin], /** @lends SBIS3.CONTROLS.IconButton.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
         }
      },

      setIcon: function(icon){
         IconButton.superclass.setIcon.call(this, icon);
         this._container.removeClass().addClass('controls-IconButton ' + this._iconClass);
      }
   });

   return IconButton;

});