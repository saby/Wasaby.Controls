define('SBIS3.CONTROLS/Menu/MenuIcon', [
   'SBIS3.CONTROLS/WSControls/Buttons/MenuButton',
   'SBIS3.CONTROLS/Utils/IconButtonUtil',
   'css!SBIS3.CONTROLS/Button/IconButton/IconButton',
   'css!SBIS3.CONTROLS/Menu/MenuIcon/MenuIcon'
], function(WSMenuButton, IconButtonUtil) {

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
    * @demo Examples/MenuIcon/MyMenuIcon/MyMenuIcon
    *
    * @author Герасимов А.М.
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
          _options: {
              size: 'default',
              style: ''
          },
         _zIndex: '',
         _hideHeader: null
      },


      _modifyOptions : function(options, parsedOptions, attrToMerge) {
         var self = this,
             opts = MenuIcon.superclass._modifyOptions.apply(this, arguments),
             className = (attrToMerge && attrToMerge.class) || (opts.element && opts.element.className) || opts.className || '',
             sizes = ['16', '24', '32', 'small', 'medium', 'large'],
             iconSize;

         opts._type = 'IconButton';
         opts.pickerClassName += ' controls-MenuIcon__Menu';
         opts.cssClassName += ' controls-MenuIcon controls-IconButton';
         opts._textClass = ' controls-IconButton__text';
         opts._iconDisabledClass = 'icon-IconButton-disabled';

         IconButtonUtil.setStyleByConfig(opts, attrToMerge);
         opts.cssClassName += IconButtonUtil.getClassState(opts);

         if(opts.style === 'bordered') {
            if(opts.size === 's') {
                opts.pickerClassName += ' controls-IconButton__round-border-24';
            }
            if(opts.size === 'm') {
                opts.pickerClassName += ' controls-IconButton__round-border';
            }
         }

         if(className.indexOf('controls-Menu__hide-menu-header') !== -1 || (opts.pickerClassName || '').indexOf('controls-Menu__hide-menu-header') !== -1) {
             this._hideHeader = true;
             opts.pickerClassName += ' controls-MenuIcon_hideHeader';
         }

         if (opts.icon) {
            sizes.forEach(function(size) {
               if (opts.icon.indexOf('icon-' + size) !== -1) {
                  iconSize = size;
               }
            });
            if (iconSize) {
               opts.pickerClassName += ' controls-Menu_offset_icon-' + iconSize + (self._hideHeader ? '_hideHeader' : '') + (opts.style === 'bordered' ? '_bordered' : '');
            }
            if (iconSize && (opts.style !== 'bordered')) {
               opts.size = iconSize;
            }
         }

         if (!!opts.size) {
            opts.pickerClassName += ' controls-Menu__offset-' + opts.size;
         }

         if (opts.icon && (opts.icon.indexOf('icon-24') !== -1 || opts.icon.indexOf('icon-large') !== -1) && !this._hideHeader){
            opts.pickerClassName += ' controls-Menu__big-header';
         }
         return opts;
      },

      init: function(){
         this.reload();
         MenuIcon.superclass.init.call(this);
      },
      _toggleState: function() {
          var  container = this._container;

          container[0].className = container[0].className.replace(/(^|\s)controls-IconButton_\S+/g, '').replace(/(^|\s)controls-IconButton__\S+/g, '');
          container.addClass(IconButtonUtil.getClassState(this._options));
          MenuIcon.superclass._toggleState.apply(this, arguments);
      },

      _getHeader: function(){
         var header, iconOffsetClass;

         if(this._hideHeader) {
            iconOffsetClass = ' controls-MenuIcon-icon_' + this._options.style + '_offset_' + this._options.size;
            header = $('<div class="controls-MenuIcon-header ' + IconButtonUtil.getClassState(this._options).replace('controls-IconButton__standardBorder', '') + iconOffsetClass + '">');
            header.append('<i class="controls-MenuIcon__header-icon ' + this._iconTemplate(this._options) + '"></i>');

            return header;
         }else {
            return MenuIcon.superclass._getHeader.apply(this, arguments);
         }
      }
   });

   return MenuIcon;

});
