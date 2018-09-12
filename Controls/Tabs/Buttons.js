/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls/Tabs/Buttons', [
   'Core/Control',
   'Controls/Controllers/SourceController',
   'tmpl!Controls/Tabs/Buttons/Buttons',
   'tmpl!Controls/Tabs/Buttons/ItemTemplate',
   'css!theme?Controls/Tabs/Buttons/Buttons'

], function(Control,
   SourceController,
   TabButtonsTpl,
   ItemTemplate
) {
   'use strict';

   var _private = {
      initItems: function(source, instance) {
         instance._sourceController = new SourceController({
            source: source
         });
         return instance._sourceController.load().addCallback(function(items) {
            var
               leftOrder = 1,
               rightOrder = 30,
               itemsOrder = [];

            items.each(function(item) {
               if (item.get('align') === 'left') {
                  itemsOrder.push(leftOrder++);
               } else {
                  itemsOrder.push(rightOrder++);
               }
            });

            //save last right order
            rightOrder--;
            instance._lastRightOrder = rightOrder;
            return {
               items: items,
               itemsOrder: itemsOrder
            };
         });
      },
      prepareItemOrder: function(order) {
         return '-ms-flex-order:' + order + '; order:' + order;
      },
      prepareItemClass: function(item, order, options, lastRightOrder) {
         var
            classes = ['controls-Tabs__item'];
         classes.push('controls-Tabs__item_align_' + (item.get('align') ? item.get('align') : 'right'));
         if (order === 1 || order === lastRightOrder) {
            classes.push('controls-Tabs__item_extreme');
         }
         if (item.get(options.keyProperty) === options.selectedKey) {
            classes.push('controls-Tabs_style_' + options.style + '__item_state_selected');
            classes.push('controls-Tabs__item_state_selected');
         } else {
            classes.push('controls-Tabs__item_state_default');
         }
         if (item.get('type')) {
            classes.push('controls-Tabs__item_type_' + item.get('type'));
         }
         return classes.join(' ');
      }
   };

   /**
     * Buttons for tab switching.
     *
     * @class Controls/Tabs/Buttons
     * @extends Core/Control
     * @mixes Controls/interface/ISource
     * @mixes Controls/interface/ISingleSelectable
     * @control
     * @public
     * @category List
    * @demo Controls-demo/Tabs/Buttons
     */

   /**
     * @name Controls/Tabs/Buttons#tabSpaceTemplate
     * @cfg {Content} Contents of the area near the tabs.
     */

   var TabsButtons = Control.extend({
      _template: TabButtonsTpl,
      _items: [],
      _itemsOrder: [],
      _beforeMount: function(options, context, receivedState) {
         if (receivedState) {
            this._items = receivedState.items;
            this._itemsOrder = receivedState.itemsOrder;
         }
         if (options.source) {
            return _private.initItems(options.source, this).addCallback(function(result) {
               this._items = result.items;
               this._itemsOrder = result.itemsOrder;
               return result;
            }.bind(this));
         }
      },
      _beforeUpdate: function(newOptions) {
         if (newOptions.source && newOptions.source !== this._options.source) {
            return _private.initItems(newOptions.source, this).addCallback(function(result) {
               this._items = result.items;
               this._itemsOrder = result.itemsOrder;
               this._forceUpdate();
            }.bind(this));
         }
      },
      _onItemClick: function(event, key) {
         this._notify('selectedKeyChanged', [key]);
      },
      _prepareItemClass: function(item, index) {
         return _private.prepareItemClass(item, this._itemsOrder[index], this._options, this._lastRightOrder);
      },
      _prepareItemOrder: function(index) {
         return _private.prepareItemOrder(this._itemsOrder[index]);
      }
   });

   TabsButtons.getDefaultOptions = function() {
      return {
         itemTemplate: ItemTemplate,
         style: 'default',
         displayProperty: 'title'
      };
   };

   //необходимо для тестов
   TabsButtons._private = _private;
   return TabsButtons;
});
