import Control = require('Core/Control');
import Env = require('Env/Env');
import MenuItemsTpl = require('wml!Controls/_dropdownPopup/DropdownList');
import DropdownViewModel = require('Controls/_dropdownPopup/DropdownViewModel');
import groupTemplate = require('wml!Controls/_dropdownPopup/defaultGroupTemplate');
import {ItemTemplate as itemTemplate} from 'Controls/dropdown';
import defaultHeadTemplate = require('wml!Controls/_dropdownPopup/defaultHeadTemplate');
import debounce = require('Core/helpers/Function/debounce');
import isEqual = require('Core/helpers/Object/isEqual');
import Clone = require('Core/core-clone');
import collection = require('Types/collection');
import Merge = require('Core/core-merge');
import chain = require('Types/chain');
import scheduleCallbackAfterRedraw from 'Controls/Utils/scheduleCallbackAfterRedraw';

      //need to open subdropdowns with a delay
      //otherwise, the interface will slow down.
      //Popup/Opener method "open" is called on every "mouseenter" event on item with hierarchy.
      var SUB_DROPDOWN_OPEN_DELAY = 100;
      var _private = {
         checkDeprecated: function(cfg) {
            if (cfg.groupMethod) {
               Env.IoC.resolve('ILogger').warn('IGrouped', 'Option "groupMethod" is deprecated and removed in 19.200. Use option "groupingKeyCallback".');
            }
         },
         setPopupOptions: function(self, horizontalAlign, theme) {
            var align = horizontalAlign || 'right';
            self._popupOptions = {
               className: 'controls-DropdownList__subMenu controls-DropdownList__subMenu_margin theme_' + theme,

               // submenu doesn't catch focus, because parent menu can accept click => submenu will deactivating and closing
               autofocus: false,
               horizontalAlign: {
                  side: align
               },
               corner: {
                  horizontal: align
               },
               eventHandlers: {
                  onResult: self._resultHandler,
                  onClose: self._subDropdownClose
               }
            };
         },

         getDropdownClass: function(verticalAlign, typeShadow) {
            return 'controls-DropdownList__popup-' + verticalAlign.side +
               ' controls-DropdownList__popup-shadow-' + typeShadow;
         },

         getSubMenuPosition: function(options, popupOptions) {
            // The first level of the popup is always positioned on the right by standard
            if (!options.rootKey) {
               return {
                  corner: {
                     horizontal: 'right'
                  },
                  horizontalAlign: {
                     side: 'right'
                  }
               };
            }

            // The others child menu levels are positioned in the same direction as the parent.
            return popupOptions;
         },

         getSubMenuOptions: function(options, popupOptions, event, item) {
            var subMenuPosition = _private.getSubMenuPosition(options, popupOptions);
            return {
               templateOptions: {
                  items: options.items,
                  itemTemplate: options.itemTemplate,
                  itemTemplateProperty: options.itemTemplateProperty,
                  keyProperty: options.keyProperty,
                  displayProperty: options.displayProperty,
                  parentProperty: options.parentProperty,
                  nodeProperty: options.nodeProperty,
                  selectedKeys: options.selectedKeys,
                  rootKey: item.get(options.keyProperty),
                  iconSize: options.iconSize,
                  showHeader: false,
                  dropdownClassName: options.dropdownClassName,
                  defaultItemTemplate: options.defaultItemTemplate
               },
               corner: subMenuPosition.corner,
               horizontalAlign: subMenuPosition.horizontalAlign,
               target: event.target
            };
         },

         needShowApplyButton: function(newKeys, oldKeys) {
            return !isEqual(newKeys, oldKeys);
         },

         getResult: function(self, event, action) {
            var result = {
               action: action,
               event: event
            };
            var selectedItems = [];
            chain.factory(self._listModel.getSelectedKeys()).each(function(key) {
               selectedItems.push(self._options.items.getRecordById(key));
            });
            result.data = selectedItems;
            return result;
         },

         isNeedUpdateSelectedKeys: function(self, target, item) {
            var clickOnEmptyItem = item.get(self._options.keyProperty) === null,
               clickOnCheckBox = target.closest('.controls-DropdownList__row-checkbox'),
               hasSelection = self._listModel.getSelectedKeys().length && self._listModel.getSelectedKeys()[0] !== null;
            return self._options.multiSelect && !clickOnEmptyItem && (hasSelection || clickOnCheckBox);
         },

         getRootKey: function(key) {
            return key === undefined ? null : key;
         }

      };

      /**
       *
       * Template for controls, that opens dropdown list.
       * @control
       * @mixes Controls/_dropdownPopup/DropdownListStyles
       * @public
       * @category Popup
       */

      var DropdownList = Control.extend([], {
         _template: MenuItemsTpl,
         _expanded: false,
         _groupTemplate: groupTemplate,
         _defaultItemTemplate: itemTemplate,
         _defaultHeadTemplate: defaultHeadTemplate,
         _hasHierarchy: false,
         _listModel: null,
         _subDropdownOpened: false,

         constructor: function(config) {
            if (config.defaultItemTemplate) {
               this._defaultItemTemplate = config.defaultItemTemplate;
            }
            if (config.groupTemplate) {
               this._groupTemplate = config.groupTemplate;
            }

            if (config.showHeader) {
               this._headConfig = config.headConfig || {};
               this._headConfig.caption = this._headConfig.caption || config.caption;
               this._headConfig.icon = this._headConfig.icon || config.icon || '';
               this._headConfig.menuStyle = this._headConfig.menuStyle || 'defaultHead';

               var rootKey = config.parentProperty ? config.rootKey : config.parentProperty,
                  iconSizes = /small|medium|large/g,
                  iconSize;

               if (this._headConfig.icon && this._headConfig.icon.match(iconSizes)) {
                  iconSize = this._headConfig.icon.match(iconSizes)[0];
               } else if (config.iconPadding && config.iconPadding[rootKey]) {
                  this._headConfig.icon += ' ' + config.iconPadding[rootKey][1];
               }
               if (this._headConfig.menuStyle === 'duplicateHead') {
                  this._duplicateHeadClassName = 'control-MenuButton-duplicate-head_' + iconSize;
               }
            }
            DropdownList.superclass.constructor.apply(this, arguments);
            this._resultHandler = this._resultHandler.bind(this);
            this._subDropdownClose = this._subDropdownClose.bind(this);
            this._mousemoveHandler = this._mousemoveHandler.bind(this);
            this._openSubDropdown = debounce(this._openSubDropdown.bind(this), SUB_DROPDOWN_OPEN_DELAY);
         },
         _beforeMount: function(newOptions) {
            _private.checkDeprecated(newOptions);
            if (newOptions.items) {
               this._listModel = new DropdownViewModel({
                  items: newOptions.items,
                  rootKey: _private.getRootKey(newOptions.rootKey),
                  selectedKeys: Clone(newOptions.selectedKeys),
                  keyProperty: newOptions.keyProperty,
                  additionalProperty: newOptions.additionalProperty,
                  itemTemplateProperty: newOptions.itemTemplateProperty,
                  displayProperty: newOptions.displayProperty,
                  nodeProperty: newOptions.nodeProperty,
                  parentProperty: newOptions.parentProperty,
                  emptyText: newOptions.emptyText,
                  multiSelect: newOptions.multiSelect,
                  groupTemplate: newOptions.groupTemplate,
                  groupingKeyCallback: newOptions.groupingKeyCallback,
                  groupMethod: newOptions.groupMethod
               });
               this._hasHierarchy = this._listModel.hasHierarchy();
               this._hasAdditional = this._listModel.hasAdditional();
               _private.setPopupOptions(this);
            }
         },

         _beforeUpdate: function(newOptions) {
            var rootChanged = newOptions.rootKey !== this._options.rootKey,
               itemsChanged = newOptions.items !== this._options.items;

            if (rootChanged) {
               this._listModel.setRootKey(_private.getRootKey(newOptions.rootKey));
            }

            if (itemsChanged) {
               this._listModel.setItems(newOptions);
               if (this._hasHierarchy) {
                  this._children.subDropdownOpener.close();
               }
            }

            if (rootChanged || itemsChanged) {
               this._hasHierarchy = this._listModel.hasHierarchy();
               this._hasAdditional = this._listModel.hasAdditional();
            }

            if (newOptions.stickyPosition.horizontalAlign &&
               (!this._popupOptions || this._popupOptions.horizontalAlign !== newOptions.stickyPosition.horizontalAlign)) {
               this._dropdownClass = _private.getDropdownClass(newOptions.stickyPosition.verticalAlign, newOptions.typeShadow);
               _private.setPopupOptions(this, newOptions.stickyPosition.horizontalAlign.side, newOptions.theme);
            }
         },

         _itemMouseEnter: function(event, item, hasChildren) {
            // Close the already opened sub menu. Installation of new data sets new size of the container.
            // If you change the size of the update, you will see the container twitch.
            if (this._hasHierarchy && this._subDropdownOpened) {
               this._children.subDropdownOpener.close();
               this._subDropdownOpened = false;
            }

            if (hasChildren && !item.get('readOnly')) {
               this._subDropdownOpened = true;
               this._openSubDropdown(event, item);
            }
         },

         _openSubDropdown: function(event, item) {
            var config;

            // _openSubDropdown is called by debounce and a function call can occur when the control is destroyed,
            // just check _children to make sure, that the control isnt destroyed
            if (this._subDropdownOpened && this._children.subDropdownOpener) {
               config = _private.getSubMenuOptions(this._options, this._popupOptions, event, item);
               this._children.subDropdownOpener.open(config, this);
            }
         },

         _subDropdownClose: function() {
            this._subDropdownOpened = false;
         },

         //TODO FOR COMPATIBLE. для чистого вдома этот метод излишен, но логику не ломает
         _mouseOutHandler: function(event) {
            //todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            var container = this._container.get ? this._container.get(0) : this._container;
            if (!event.target.closest('.controls-DropdownList__popup') && container.closest('.controls-DropdownList__subMenu')) {
               this._children.subDropdownOpener.close();
            }
         },

         _mouseenterHandler: function() {
            if (this._hasHierarchy) {
               this._children.subDropdownOpener.close();
            }
         },

         _resultHandler: function(result) {
            switch (result.action) {
               case 'itemClick':
                  if (!result.data[0].get(this._options.nodeProperty)) {
                     this._children.subDropdownOpener.close();
                  }
               case 'pinClicked':
                  this._notify('sendResult', [result]);
            }
         },

         _onItemSwipe: function(event, itemData) {
            if (event.nativeEvent.direction === 'left') {
               this._listModel.setSwipeItem(itemData);
            }
            if (event.nativeEvent.direction === 'right') {
               this._listModel.setSwipeItem(null);
            }
         },

         _itemClickHandler: function(event, item, pinClicked) { // todo нужно обсудить
            if (item.get('readOnly')) {
               return;
            }
            if (this._listModel.getSelectedKeys() && _private.isNeedUpdateSelectedKeys(this, event.target, item)) {
               let isApplyButtonVisible = this._needShowApplyButton;
               let self = this;

               this._listModel.updateSelection(item);
               this._needShowApplyButton = _private.needShowApplyButton(this._listModel.getSelectedKeys(), this._options.selectedKeys);

               if (this._needShowApplyButton !== isApplyButtonVisible) {
                  scheduleCallbackAfterRedraw(this, () => {
                     self._notify('controlResize', [], {bubbling: true});
                  });
               }
            } else {
               var result = {
                  action: pinClicked ? 'pinClicked' : 'itemClick',
                  event: event,
                  data: [item]
               };

               // means that pin button was clicked
               if (pinClicked) {
                  event.stopPropagation();
               }
               this._notify('sendResult', [result]);
            }
         },
         _applySelection: function(event) {
            var result = _private.getResult(this, event, 'applyClick');
            this._notify('sendResult', [result]);
         },
         _footerClick: function(event) {
            var result = {
               action: 'footerClick',
               event: event
            };
            this._notify('sendResult', [result]);
         },
         _headerClick: function() {
            this._notify('close');
         },
         _closeClick: function() {
            this._notify('close');
         },
         _mousemoveHandler: function(emitterEvent, event) {
            //todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
            var container = this._container.get ? this._container.get(0) : this._container;
            if (!event.target.closest('.controls-DropdownList__popup') && container.closest('.controls-DropdownList__subMenu')) {
               this._notify('close');
            }
         },
         _toggleExpanded: function() {
            this._listModel.toggleExpanded(this._expanded);
            this._hasHierarchy = this._listModel.hasHierarchy();
            this._forceUpdate();
         },

         _selectorDialogResult: function(event, result) {
            this._notify('sendResult', [result]);
         },

         _beforeUnmount: function() {
            if (this._listModel) {
               this._listModel.destroy();
               this._listModel = null;
            }
            this._resultHandler = null;
            this._subDropdownClose = null;
            this._mousemoveHandler = null;
            this._openSubDropdown = null;
            this._headConfig = null;
         }
      });

      DropdownList._private = _private;

      DropdownList.getDefaultOptions = function() {
         return {
            menuStyle: 'defaultHead',
            typeShadow: 'default',
            moreButtonCaption: rk('Еще') + '...'
         };
      };

      DropdownList._theme = ['Controls/dropdownPopup'];

      export = DropdownList;

