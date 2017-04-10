define('js!SBIS3.CONTROLS.MenuIcon', ['js!WS.Controls.MenuButton', 'css!SBIS3.CONTROLS.IconButton', 'css!SBIS3.CONTROLS.MenuIcon'], function(WSMenuButton) {

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
    *
    * @cssModifier controls-Menu__hide-menu-header Скрывает из выпадающего меню заголовок, который устанавливают с помощью опции {@link caption}.
    */

   var MenuIcon = WSMenuButton.extend( [], /** @lends SBIS3.CONTROLS.MenuIcon.prototype */ {
      _hasHeader: false,
      $protected: {
         _zIndex: '',
         _options: {
            buttonTypeClass: ' controls-IconButton'
         }
      },

      _modifyOptions : function() {
         var opts = MenuIcon.superclass._modifyOptions.apply(this, arguments);
         opts.pickerClassName += ' controls-MenuIcon__Menu';
         opts.cssClassName += ' controls-MenuIcon controls-IconButton';

         opts.cssClassName += opts.caption ? '' : ' controls-Button__withoutCaption';

         var cssModificators = [
            'controls-IconButton__round-border',
            'controls-IconButton__round-border-24'
         ];
         for (var i = 0, l = cssModificators.length; i < l; i++){
            if (opts.className.indexOf(cssModificators[i]) !== -1){
               opts.pickerClassName += ' ' + cssModificators[i];
            }
         }
         if (opts._iconClass.indexOf('icon-24') !== -1 && opts.className.indexOf('controls-Menu__hide-menu-header') === -1){
            opts.pickerClassName += ' controls-Menu__big-header';
         }
         return opts;
      },

      init: function(){
         this.reload();
         MenuIcon.superclass.init.call(this);
      }
   });

   return MenuIcon;

});