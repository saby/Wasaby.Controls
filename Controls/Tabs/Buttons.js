/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls/Tabs/Buttons', [
    'Core/Control',
    'Controls/Controllers/SourceController',
    'tmpl!Controls/Tabs/Buttons/Buttons',
    'tmpl!Controls/Tabs/Buttons/ItemTemplate',
    'css!Controls/Tabs/Buttons/Buttons'

], function (Control,
             SourceController,
             TabButtonsTpl,
             ItemTemplate
) {
    'use strict';

    var _private = {};

    /**
     * Компонент - корешки закладок
     * @class Controls/Tabs/Buttons
     * @extends Controls/Control
     * @mixes Controls/interface/ISource
     * @mixes Controls/interface/ISingleSelectable
     * @control
     * @public
     * @category List
     */

    /**
     * @name Controls/Tabs/Buttons#tabSpaceTemplate
     * @cfg {Content} Шаблон содержимого области, находящейся на одном уровне с корешками закладок
     */

    var TabsButtons = Control.extend({
        _controlName: 'Controls/Tabs/Buttons',
        _template: TabButtonsTpl,
        items: [],
        _beforeMount: function(options, context, receivedState) {
            var
                self = this;
            this._selectedKey = options.selectedKey;
            if (receivedState) {
                this._items = receivedState;
            }
            if (options.source) {
                return this._sourceController = new SourceController({
                    source: options.source
                }).load().addCallback(function(items){
                    var
                        leftOrder = 1,
                        rightOrder = 30;
                    items.each(function (item) {
                       // item.set('_order', baseOrder + order++);
                        if (item.get('align') === 'left') {
                            //item.set('_extreme' = leftOrder === 1 ? true : false;
                            item.set('_order', leftOrder++);
                        } else {
                            item.set('_order', rightOrder++);
                        }
                    });
                    //save last right order
                    rightOrder--;
                    self._lastRightOrder = rightOrder;
                    self._items = items;
                    return self._items;

                })
            }
        },
        constructor: function (cfg) {
            TabsButtons.superclass.constructor.apply(this, arguments);
            this._publish('selectedKeyChanged');
        },
        _onItemClick: function(event, key) {
            this._selectedKey = key;
            this._notify('selectedKeyChanged', key)
        },
        _prepareItemClass: function(item) {
            var
                classes =['controls-Tabs__item'];
            classes.push('controls-Tabs__item_align_' + ( item.get('align') ? item.get('align') : 'right' ));
            if (item.get('order') === 1 || item.get('order') === this._lastRightOrder ) {
                classes.push('controls-Tabs__item_extreme');
            }
            if (item.get(this._options.keyProperty) === this._selectedKey) {
                classes.push('controls-Tabs_style_' + this._options.style + '__item_state_selected');
                classes.push('controls-Tabs__item_state_selected');
            } else {
                classes.push('controls-Tabs__item_state_default');
            }

            return classes.join(' ');
        }
    });

    TabsButtons.getDefaultOptions = function() {
        return {
            itemTemplate: ItemTemplate,
            style: 'default'
        };
    };
    return TabsButtons;
});