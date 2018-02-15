/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls/Tabs/Buttons', [
    'Core/Control',
    'tmpl!Controls/Tabs/Buttons/Buttons',
    'tmpl!Controls/Tabs/Buttons/ItemTemplate',
    'css!Controls/Tabs/Buttons/Buttons'

], function (Control,
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
                leftOrder = 1,
                rightOrder = 30,
                lastRightItem;
            this.selectedKey = options.selectedKey;
            this.items =  options.source; //todo: волт тут нужно внедрить модель или я хз что
            for (var index in this.items) {
                var item = this.items[index];
                if (item.align === 'left') {
                    item._extreme = leftOrder === 1 ? true : false;
                    item._order = leftOrder++;
                } else {
                    lastRightItem = item;
                    item.align= 'right';
                    item._order = rightOrder++;
                }
            }
            if (lastRightItem) {
                lastRightItem._extreme = true;
            }
        },
        constructor: function (cfg) {
            TabsButtons.superclass.constructor.apply(this, arguments);
            this._publish('selectedKeyChanged');
        },
        _onItemClick: function(event, key) {
            this.selectedKey = key;
            this._notify('selectedKeyChanged', key)
        },
        _prepareItemClass: function(item) {
            var
                classes =['controls-Tabs__item'];
            classes.push('controls-Tabs__item_align_' + item.align);
            if (item._extreme) {
                classes.push('controls-Tabs__item_extreme');
            }
            if (item[this._options.keyProperty] === this.selectedKey) {
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