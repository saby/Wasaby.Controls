define('js!SBIS3.CONTROLS.MenuLink', ['js!WSControls/Buttons/MenuButton', 'css!SBIS3.CONTROLS.Link', 'css!SBIS3.CONTROLS.MenuLink'], function(WSMenuButton) {

   'use strict';

   /**
    * Класс контрола "Кнопка в виде ссылки с выпадающим меню".
    *
    * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/textbox/buttons/button-link/#menu-link Демонстрационные примеры}.
    * <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Спецификация</a>.
    *
    * @remark
    * Если в меню задан только один пункт, то меню не будет показано. При нажатии на кнопку будет выполнено действие, соответствующее этому пункту.
    *
    * @class SBIS3.CONTROLS.MenuLink
    * @extends WSControls/Buttons/MenuButton
	*
    * @demo SBIS3.CONTROLS.Demo.MyMenuLink
    *
    * @author Романов Валерий Сергеевич
    *
    * @category Button
    * @public
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.MenuLink'>
    *    <option name='caption' value='Ссылка с меню'></option>
    *    <options name="items" type="array">
    *        <options>
    *            <option name="id">1</option>
    *            <option name="title">Пункт1</option>
    *         </options>
    *         <options>
    *            <option name="id">2</option>
    *            <option name="title">Пункт2</option>
    *         </options>
    *      </options>
    * </component>
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
    * @cssModifier controls-Menu__hide-menu-header Скрывает из выпадающего меню заголовок, который устанавливают с помощью опции {@link caption}.
    */

   var MenuLink = WSMenuButton.extend( [], /** @lends SBIS3.CONTROLS.MenuLink.prototype */ {
      $protected: {
         _zIndex: ''
      },

      _modifyOptions : function() {
         var opts = MenuLink.superclass._modifyOptions.apply(this, arguments);
         opts.pickerClassName += ' controls-MenuLink__Menu';
         opts.cssClassName += ' controls-MenuLink controls-Link';
         opts._textClass = ' controls-Link__field';

         return opts;
      }
   });

   return MenuLink;
});