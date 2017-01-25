define('js!SBIS3.CONTROLS.MenuIcon', ['js!SBIS3.CONTROLS.IconButton', 'js!SBIS3.CONTROLS.ContextMenu', 'js!SBIS3.CONTROLS.PickerMixin', 'js!SBIS3.CONTROLS.DSMixin', 'js!SBIS3.CONTROLS.MenuButtonMixin', 'css!SBIS3.CONTROLS.MenuIcon',    'css!SBIS3.CONTROLS.MenuButton', 'css!SBIS3.CONTROLS.MenuButtonMixin'], function(IconButton, ContextMenu, PickerMixin, DSMixin, MenuButtonMixin) {

   'use strict';

   /**
    * Класс контрола, который предназначен для отображения кнопки в виде иконки с выпадающим меню.
    *
    * @class SBIS3.CONTROLS.MenuIcon
    * @extends SBIS3.CONTROLS.IconButton
    * @control
    * @public
    *
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.MenuButtonMixin
    *
    * @demo SBIS3.CONTROLS.Demo.MyMenuIcon
    *
    * @author Борисов Петр Сергеевич
    *
    * @category Buttons
    *
    * @initial
    * <component data-component='SBIS3.CONTROLS.MenuIcon'>
    *    <option name="icon" value="icon-24 icon-AddButton icon-primary"></option>
    *    <options name="items" type="array">
    *        <options>
    *            <option name="id" value="1"></option>
    *            <option name="title" value="Пункт1"></option>
    *         </options>
    *         <options>
    *            <option name="id" value="2"></option>
    *            <option name="title" value="Пункт2"></option>
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
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.DSMixin
    * @mixes SBIS3.CONTROLS.MenuButtonMixin
    *
    * @cssModifier controls-Menu__hide-menu-header Скрывает из выпадающего меню заголовок, который устанавливают с помощью опции {@link caption}.
    */

   var MenuIcon = IconButton.extend( [PickerMixin, DSMixin, MenuButtonMixin], /** @lends SBIS3.CONTROLS.MenuIcon.prototype */ {
      _hasHeader: false,

      init: function(){
         this._container.addClass('controls-MenuIcon');
         this._options.pickerClassName += ' controls-MenuIcon__Menu';
         !this.getCaption() && this._container.addClass('controls-Button__withoutCaption');

         var cssModificators = [
             'controls-IconButton__round-border',
             'controls-IconButton__round-border-24',
             'controls-Button__withoutCaption'
         ];
         for (var i = 0, l = cssModificators.length; i < l; i++){
            if (this.getContainer().hasClass(cssModificators[i])){
               this._options.pickerClassName += ' ' + cssModificators[i];
            }
         }
         if (this._container.hasClass('icon-24') && !this._container.hasClass('controls-Menu__hide-menu-header')){
            this._options.pickerClassName += ' controls-Menu__big-header';
         }
         this.reload();
         MenuIcon.superclass.init.call(this);
      }
   });

   return MenuIcon;

});