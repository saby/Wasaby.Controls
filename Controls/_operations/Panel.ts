import Control = require('Core/Control');
import template = require('wml!Controls/_operations/Panel/Panel');
import toolbars = require('Controls/toolbars');
import sourceLib = require('Types/source');
import WidthUtils = require('Controls/_operations/Panel/Utils');
import buttons = require('Controls/buttons');


   var _private = {
      recalculateToolbarItems: function(self, items, toolbarWidth) {
         if (items) {
            self._oldToolbarWidth = toolbarWidth;
            self._toolbarSource = new sourceLib.Memory({
               idProperty: self._options.keyProperty,
               data: WidthUtils.fillItemsType(self._options.keyProperty, self._options.parentProperty, items, toolbarWidth, self._options.theme).getRawData()
            });
            self._forceUpdate();
         }
      },
      checkToolbarWidth: function(self) {
         var newWidth = self._children.toolbarBlock.clientWidth;

         /**
          * Operations panel checks toolbar width on each update because we don't know if the rightTemplate has changed (will be fixed here: https://online.sbis.ru/opendoc.html?guid=b4ed11ba-1e4f-4076-986e-378d2ffce013 ).
          * Because of this the panel gets unnecessary redrawn after the mount. Usually this doesn't cause problems because width of the toolbar doesn't change and update is essentially skipped.
          * But if the panel becomes (or its parent) hidden and then updates, toolbar width is obviously 0 and that causes recalculation of toolbar items.
          * And it's even worse than that - panel can become visible again without updating and the user will get stuck with the wrong UI.
          * For example, this can happen if the user opens the panel and then immediately goes to another tab, making the tab with the panel hidden, and then goes back.
          * The only way to prevent this is to block recalculation of toolbar items if the panel is not visible.
          */
         if (self._oldToolbarWidth !== newWidth && self._container.offsetParent !== null) {
            self._oldToolbarWidth = newWidth;
            _private.recalculateToolbarItems(self, self._items, newWidth);
         }
      },
      loadData: function(self, source) {
         var result;
         if (source) {
            result = source.query().addCallback(function(dataSet) {
               self._items = dataSet.getAll();

               // TODO: убрать когда полностью откажемся от поддержки задавания цвета в опции иконки. icon: icon-error, icon-done и т.д.
               // TODO: https://online.sbis.ru/opendoc.html?guid=05bbeb41-d353-4675-9f73-6bfc654a5f00
               buttons.iconsUtil.itemsSetOldIconStyle(self._items);
               return self._items;
            });
         }
         return result;
      }
   };


   /**
    * Control for grouping operations.
    * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/operations/'>here</a>.
    * <a href="/materials/demo-ws4-operations-panel">Demo</a>.
    *
    * @class Controls/_operations/Panel
    * @extends Core/Control
    * @mixes Controls/interface/ISource
    * @mixes Controls/interface/IItemTemplate
    * @mixes Controls/List/interface/IHierarchy
    * @control
    * @public
    * @author Авраменко А.С.
    * @demo Controls-demo/OperationsPanel/Panel
    *
    * @css @background-color_OperationsPanel Background color of the panel.
    * @css @height_OperationsPanel Height of the panel.
    * @css @spacing_OperationsPanel-between-items Spacing between items.
    * @css @margin_OperationsPanel__rightTemplate Margin of rightTemplate.
    */

   /**
    * @name Controls/_operations/Panel#rightTemplate
    * @cfg {Function} Template displayed on the right side of the panel.
    * @example
    * <pre>
    *    <Controls._operations.Panel rightTemplate="wml!MyModule/OperationsPanelRightTemplate" />
    * </pre>
    */

   /**
    * @event Controls/_operations/Panel#itemClick Occurs when an item was clicked.
    * @param {Core/vdom/Synchronizer/resources/SyntheticEvent} eventObject Descriptor of the event.
    * @param {Types/entity:Record} item Clicked item.
    * @example
    * TMPL:
    * <pre>
    *    <Controls._operations.Panel on:itemClick="onPanelItemClick()" />
    * </pre>
    * JS:
    * <pre>
    *    onPanelItemClick: function(e, selection) {
    *       var itemId = item.get('id');
    *       switch (itemId) {
    *          case 'remove':
    *             this._removeItems();
    *             break;
    *          case 'move':
    *             this._moveItems();
    *             break;
    *    }
    * </pre>
    */

   var Panel = Control.extend({
      _template: template,
      _oldToolbarWidth: 0,
      _initialized: false,

      _beforeMount: function(options) {
         return _private.loadData(this, options.source);
      },

      _afterMount: function() {
         _private.checkToolbarWidth(this);
         this._initialized = true;
         this._notify('operationsPanelOpened');
      },

      _beforeUpdate: function(newOptions) {
         if (newOptions.source !== this._options.source) {
            //TODO: нельзя смотреть на то изменился ли source в _afterUpdate, т.к. в oldOptions приходит одно и то же значение, и _afterUpdate зацикливается
            //TODO: будет исправляться по этой ошибке: https://online.sbis.ru/opendoc.html?guid=a48be8fb-7ee2-429a-ba8e-abd407436554
            this._sourceChanged = true;
         }
      },

      _afterUpdate: function() {
         var self = this;
         if (this._sourceChanged) {
            // We should recalculate the size of the toolbar only when all the children have updated, otherwise available width may be incorrect.
            this._sourceChanged = false;
            _private.loadData(this, this._options.source).addCallback(function() {
               _private.recalculateToolbarItems(self, self._items, self._children.toolbarBlock.clientWidth);
            });
         } else {
            //TODO: размеры пересчитываются после каждого обновления, т.к. иначе нельзя понять что изменился rightTemplate (там каждый раз новая функция)
            //TODO: будет исправляться по этой задаче: https://online.sbis.ru/opendoc.html?guid=b4ed11ba-1e4f-4076-986e-378d2ffce013
            _private.checkToolbarWidth(this);
         }
      },

      _onResize: function() {
         _private.checkToolbarWidth(this);

         // todo зову _forceUpdate потому что нужно отрисовать пересчет, произошедший в checkToolbarWidth. добавляю на всякий случай, возможно это лишний вызов. раньше тут _forceUpdate звался из-за события
         this._forceUpdate();
      },

      _toolbarItemClick: function(event, item) {
         this._notify('itemClick', [item]);
      }
   });

   Panel.getDefaultOptions = function() {
      return {
         itemTemplate: toolbars.ItemTemplate
      };
   };
   Panel._theme = ['Controls/operations', 'Controls/toolbars'];

   export = Panel;

