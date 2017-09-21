define('js!SBIS3.CONTROLS.MenuButton', [
   'js!WSControls/Buttons/MenuButton',
   'css!SBIS3.CONTROLS.Button',
   'css!SBIS3.CONTROLS.MenuButton'
], function(WSMenuButton) {

   'use strict';

   /**
    * Класс контрола "Кнопка-меню".
    *
    * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/textbox/buttons/button-line/#menu-button Демонстрационные примеры}.
    * <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Спецификация</a>.
    *
    * @remark
    * Если в меню задан только один пункт, то меню НЕ будет показано, а при нажатии на кнопку будет выполнено действие, соответствующее этому пункту.
    *
    * @class SBIS3.CONTROLS.MenuButton
    * @extends WSControls/Buttons/MenuButton
    *
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    *
    * @ignoreMethods activate activateFirstControl activateLastControl addPendingOperation changeControlTabIndex
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onBeforeShow onAfterShow onBeforeLoad onAfterLoad onBeforeControlsLoad onKeyPressed onResize
    * @ignoreEvents onFocusIn onFocusOut onReady onDragIn onDragStart onDragStop onDragMove onDragOut
    *
    * @control
    * @public
    * @category Buttons
    * @initial
    * <component data-component='SBIS3.CONTROLS.MenuButton'>
    *    <option name='caption' value='Кнопка с меню'></option>
    *    <options name="items" type="array">
    *        <options>
    *            <option name="id">1</option>
    *            <option name="title">Пункт1</option>
    *        </options>
    *        <options>
    *            <option name="id">2</option>
    *            <option name="title">Пункт2</option>
    *        </options>
    *    </options>
    * </component>
    */

   var MenuButton = WSMenuButton.extend( [], /** @lends SBIS3.CONTROLS.MenuButton.prototype */ {
      _modifyOptions : function() {
         var opts = MenuButton.superclass._modifyOptions.apply(this, arguments);
         opts.cssClassName += ' controls-Button';
         opts.cssClassName += ' controls-Button-size__' + (!!opts.size ? opts.size : 'default');
         opts.cssClassName += ' controls-Button-color__' + (!!opts.primary ? 'primary' : 'default');
         opts.cssClassName += (!!opts.primary ? ' controls-Button__primary' : '');
         opts.pickerClassName += ' controls-MenuButton__Menu';
         return opts;
      }
   });

   return MenuButton;

});