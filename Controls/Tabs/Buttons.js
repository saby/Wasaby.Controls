/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls/Tabs/Buttons', [
   'Core/Control',
   'Controls/Controllers/SourceController',
   'wml!Controls/Tabs/Buttons/Buttons',
   'wml!Controls/Tabs/Buttons/ItemTemplate',
   'css!Controls/Tabs/Buttons/Buttons'

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
         if (item.get('isMainTab')) {
            classes.push('controls-Tabs__item_canShrink');
         }
         return classes.join(' ');
      }
   };

   /**
    * Controls are designed to give users a choice among two or more tabs.
    *
    * @class Controls/Tabs/Buttons
    * @extends Core/Control
    * @mixes Controls/interface/ISingleSelectable
    * @control
    * @public
    * @category List
    * @demo Controls-demo/Tabs/ButtonsDemoPG
    */

   /**
    * @name Controls/Tabs/Buttons#tabSpaceTemplate
    * @cfg {Content} Contents of the area near the tabs.
    * @default undefined
    * @remark
    * Tab can be left and right aligned, this is determined by the item property 'align'.
    * If control has left and right tabs then  TabSpaceTemplate will be between them.
    * @example
    * Tabs buttons with space template.
    * <pre>
    *    <Controls.Tabs.Buttons
    *       .....
    *       tabSpaceTemplate=".../spaceTemplate'"
    *       .....
    *    />
    * </pre>
    * Bordered icon button with default size.
    * <pre>
    *    <Controls.Button caption="Send document" style="iconButtonBordered"/>
    * </pre>
    * spaceTemplate:
    * <pre>
    *    <div class="additionalContent">
    *       <Controls.Button .../>
    *       <Controls.Button .../>
    *       <Controls.Button .../>
    *    </div>
    * </pre>
    */

   /**
    * @name Controls/Tabs/Buttons#style
    * @cfg {Enum} Tabs buttons display style.
    * @variant default
    * @variant additional
    * @default default
    * @remark
    * If the standard theme does not suit you, you can override the variables:
    * <ul>
    *     <li>@border-color_Tabs-item_selected_default,</li>
    *     <li>@text-color_Tabs-item_selected_default,</li>
    *     <li>@border-color_Tabs-item_selected_additional,</li>
    *     <li>@text-color_Tabs-item_selected_additional</li>
    * </ul>
    * @example
    * Tabs Buttons with additional style.
    * <pre>
    *    <Controls.Tabs.Buttons
    *       bind:selectedKey='_selectedKey'
    *       keyProperty="id"
    *       source="{{_source}}
    *       style="additional"
    *       .....
    *    />
    * </pre>
    * Tabs Buttons with default style
    * <pre>
    *    <Controls.Tabs.Buttons
    *       bind:selectedKey='_selectedKey'
    *       keyProperty="id"
    *       source="{{_source}}
    *    />
    * </pre>
    */

   /**
    * @name Controls/Tabs/Buttons#source
    * @cfg {WS.Data/Source/Base} Object that implements ISource interface for data access.
    * @default undefined
    * @remark
    * The item can have an property 'align'. It's determine align of item tab.
    * @example
    * Tabs buttons will be rendered data from _source. First item render with left align, other items render with defult, right align.
    * <pre>
    *    <Controls.Tabs.Buttons
    *              bind:selectedKey='_selectedKey'
    *              keyProperty="key"
    *              source="{{_source}}"
    *    />
    * </pre>
    * <pre>
    *    _selectedKey: '1',
    *    _source: new Memory({
    *        idProperty: 'key',
    *        data: [
    *        {
    *           key: '1',
    *           title: 'Yaroslavl',
    *           align: 'left'
    *        },
    *        {
    *           key: '2',
    *           title: 'Moscow'
    *        },
    *        {
    *           key: '3',
    *           title: 'St-Petersburg'
    *        }
    *        ]
    *    })
    * </pre>
    */

   /**
    * @name Controls/Tabs/Buttons#itemTemplate
    * @cfg {Function} Template for item render.
    * @default Base template 'wml!Controls/Tabs/Buttons/ItemTemplate'
    * @remark
    * To determine the template, you should call the base template 'wml!Controls/Tabs/Buttons/ItemTemplate'.
    * The template is placed in the component using the ws:partial tag with the template attribute.
    * By default, the base template 'wml!Controls/Tabs/Buttons/ItemTemplate' will display only the 'title' field. You can change the display of records by setting their values for the following options:
    * <ul>
    *    <li>displayProperty - defines the display field of the record.</li>
    * <ul>
    * @example
    * Tabs buttons with item template.
    * <pre>
    *    <Controls.Tabs.Buttons
    *                   bind:selectedKey='SelectedKey3'
    *                   keyProperty="id"
    *                   style="additional"
    *                   source="{{_source3}}">
    *       <ws:itemTemplate>
    *          <ws:partial template="wml!Controls/Tabs/Buttons/ItemTemplate"
    *                      item="{{itemTemplate.item}}"
    *                      displayProperty="caption"/>
    *       </ws:itemTemplate>
    *    </Controls.Tabs.Buttons>
    * </pre>
    */

   /**
    * @name Controls/Tabs/Buttons#itemTemplateProperty
    * @cfg {String} Name of the item property that contains template for item render.
    * @default If not set, itemTemplate is used instead.
    * @remark
    * To determine the template, you should call the base template 'wml!Controls/Tabs/Buttons/ItemTemplate'.
    * The template is placed in the component using the ws:partial tag with the template attribute.
    * By default, the base template 'wml!Controls/Tabs/Buttons/ItemTemplate' will display only the 'title' field. You can change the display of records by setting their values for the following options:
    * <ul>
    *    <li>displayProperty - defines the display field of the record.</li>
    * <ul>
    * @example
    * Tabs buttons with item template.
    * <pre>
    *    <Controls.Tabs.Buttons itemTemplateProperty="myTemplate"
    *                           source="{{_source}}
    *                           ...>
    *    </Controls.Tabs.Buttons>
    * </pre>
    * myTemplate
    * <pre>
    *    <div class="controls-Tabs__item_custom">{{item.get(displayProperty || 'title')}}</div>
    * </pre>
    * <pre>
    *    _source: new Memory({
    *              idProperty: 'id',
    *              data: [
    *                     {id: 1, title: 'I agree'},
    *                     {id: 2, title: 'I not decide'},
    *                     {id: 4, title: 'Will not seem', caption: 'I not agree',  myTemplate: 'wml!.../myTemplate'}
    *              ]
    *    })
    * </pre>
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
