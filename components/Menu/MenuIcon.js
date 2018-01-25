define('SBIS3.CONTROLS/Menu/MenuIcon', [
   'js!WSControls/Buttons/MenuButton',
   'css!SBIS3.CONTROLS/Button/IconButton/IconButton',
   'css!SBIS3.CONTROLS/Menu/MenuIcon/MenuIcon'
], function(WSMenuButton) {

   'use strict';

   /**
    * Класс контрола "Кнопка в виде значка с выпадающим меню".
    *
    * <a href='/doc/platform/developmentapl/interface-development/components/textbox/buttons/button-icon/#menu-icon'>Демонстрационные примеры</a>.
    * <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Спецификация</a>.
    *
    * @class SBIS3.CONTROLS/Menu/MenuIcon
    * @extends WSControls/Buttons/MenuButton
    *
    * @demo SBIS3.CONTROLS.Demo.MyMenuIcon
    *
    * @author Романов В.С.
    *
    * @category Button
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS/Menu/MenuIcon'>
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
    * @cssModifier controls-Menu__hide-menu-header Скрывает из выпадающего меню заголовок, который устанавливают с помощью опции {@link caption}.
    */

   var MenuIcon = WSMenuButton.extend( [], /** @lends SBIS3.CONTROLS/Menu/MenuIcon.prototype */ {
      _hasHeader: false,
      $protected: {
         _zIndex: ''
      },

      _modifyOptions : function(options, parsedOptions, attrToMerge) {
         var opts = MenuIcon.superclass._modifyOptions.apply(this, arguments),
             className = (attrToMerge && attrToMerge.class) || (opts.element && opts.element.className) || opts.className || '',
             sizes = ['16', '24', '32', 'small', 'medium', 'large'];
         opts.pickerClassName += ' controls-MenuIcon__Menu';
         opts.cssClassName += ' controls-MenuIcon controls-IconButton';

         opts.cssClassName += opts.caption ? '' : ' controls-Button__withoutCaption';

         if(!opts.tooltip && opts.caption){
            opts.tooltip = opts.caption;
         }

         if(className && className.indexOf('controls-IconButton__round-border') !== -1){
            if(className.indexOf('controls-IconButton__round-border-24') !== -1){
                opts.pickerClassName += ' controls-IconButton__round-border-24';
            }else {
                opts.pickerClassName += ' controls-IconButton__round-border';
            }
         }

         if(opts.icon){
             sizes.forEach(function(size){
                if(opts.icon.indexOf('icon-' + size) !== -1) {
                    opts.pickerClassName += ' controls-Menu_offset_icon-' + size;
                }
             });
         }
         opts.cssClassName += ' controls-IconButton-size__' + (!!opts.size ? opts.size : 'default');
         if(!!opts.size) {
             opts.pickerClassName += ' controls-Menu__offset-' + opts.size;
         }

         if (opts.icon && (opts.icon.indexOf('icon-24') !== -1 || opts.icon.indexOf('icon-large') !== -1) && className('controls-Menu__hide-menu-header') === -1){
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