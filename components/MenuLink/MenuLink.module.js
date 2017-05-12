define('js!SBIS3.CONTROLS.MenuLink', ['js!WSControls/Buttons/MenuButton', 'css!SBIS3.CONTROLS.Link', 'css!SBIS3.CONTROLS.MenuLink'], function(WSMenuButton) {

   'use strict';

   /**
    * Контрол, отображающий кнопку в виде ссылки и выпадающее из нее меню
    * @class SBIS3.CONTROLS.MenuLink
    * @extends SBIS3.CONTROLS.Link
	*
    * @demo SBIS3.CONTROLS.Demo.MyMenuLink
    *
    * @remark
    * !Важно: Если в меню задан только один пункт, то меню НЕ будет показано, а при нажатии на кнопку будет выполнено действие соответствующее этому пункту.
    * Кнопка с меню - это кнопка с выбором варинта действия, и если возможно только одно действие, то оно и будет выполнено по нажатию.
    *
    * @author Крайнов Дмитрий Олегович
    *
    * @public
    * @category Buttons
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
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.PickerMixin
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