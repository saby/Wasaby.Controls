import Control = require('Core/Control');
import template = require('wml!Controls/_toolbars/View');
import toolbarItemTemplate = require('wml!Controls/_toolbars/ItemTemplate');
import {Controller as SourceController} from 'Controls/source';
import {factory} from 'Types/collection';
import {getMenuItems, showType} from 'Controls/Utils/Toolbar';
import {ActualApi as ButtonActualApi, ButtonTemplate, cssStyleGeneration} from 'Controls/buttons';

/**
 * Графический контрол, отображаемый в виде панели с размещенными на ней кнопками, клик по которым вызывает соответствующие им команды.
 * <a href="/materials/demo/demo-ws4-toolbar">Демо-пример</a>.
 *
 * @class Controls/_toolbars/View
 * @extends Core/Control
 * @mixes Controls/_interface/ITooltip
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/_interface/IHierarchy
 * @mixes Controls/interface/IIconSize
 * @mixes Controls/_toolbars/IToolbarSource
 * @control
 * @public
 * @category Toolbar
 * @author Красильников А.С.
 * @demo Controls-demo/Toolbar/ToolbarPG
 */

/*
 * Graphical control element on which buttons, menu and other input or output elements are placed.
 * <a href="/materials/demo/demo-ws4-toolbar">Demo-example</a>.
 *
 * @class Controls/_toolbars/View
 * @extends Core/Control
 * @mixes Controls/_interface/ITooltip
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/_interface/IHierarchy
 * @mixes Controls/interface/IIconSize
 * @control
 * @public
 * @category Toolbar
 * @author Красильников А.С.
 * @demo Controls-demo/Toolbar/ToolbarPG
 */

/**
 * @name Controls/_toolbars/View#itemsSpacing
 * @cfg {String} Тип интервала между элементами.
 * @default medium
 * @example
 * Кнопки будут отображены из источника _source. Первый элемент выравнен по левому краю, другие элементы выравнены по правому краю по умолчанию.
 * <pre>
 *    <Controls.toolbars:View
 *              keyProperty="key"
 *              source="{{_source}}"
 *              itemsSpacing="big"
 *    />
 * </pre>
 */

/*
 * @name Controls/_toolbars/View#itemsSpacing
 * @cfg {String} Type of spacing between items.
 * @default medium
 * @example
 * Tabs buttons will be rendered data from _source. First item render with left align, other items render with defult, right align.
 * <pre>
 *    <Controls.toolbars:View
 *              keyProperty="key"
 *              source="{{_source}}"
 *              itemsSpacing="big"
 *    />
 * </pre>
 */

/**
 * @event Controls/_toolbars/View#itemClick Происходит при клике по элементу.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому производим клик.
 * @example
 * TMPL:
 * <pre>
 *    <Controls.toolbars:View on:itemClick="onToolbarItemClick()" />
 * </pre>
 * JS:
 * <pre>
 *    onToolbarItemClick: function(e, selectedItem) {
 *       var itemId = selectedItem.get('id');
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

/*
 * @event Controls/_toolbars/View#itemClick Происходит при клике по элементу.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому произвели клик.
 * @example
 * WML
 * <pre>
 *    <Controls.toolbars:View on:itemClick="onToolbarItemClick()" />
 * </pre>
 * JavaScript
 * <pre>
 *    onToolbarItemClick: function(e, selectedItem) {
 *       var itemId = selectedItem.get('id');
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
/*
 * @event Controls/_toolbars/View#itemClick Occurs when item was clicked.
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Descriptor of the event.
 * @param {Types/entity:Record} item Clicked item.
 * @example
 * TMPL:
 * <pre>
 *    <Controls.toolbars:View on:itemClick="onToolbarItemClick()" />
 * </pre>
 * JS:
 * <pre>
 *    onToolbarItemClick: function(e, selectedItem) {
 *       var itemId = selectedItem.get('id');
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

/**
 * @name Controls/_toolbars/View#itemTemplate
 * @cfg {Function} Шаблон отображения элементов.
 * @remark
 * Для определения шаблона вызовите базовый шаблон 'Controls/toolbars:ItemTemplate'.
 * Шаблон помещается в компонент с помощью тега ws:partial с атрибутом template.
 * Вы можете изменить формат отображение записей, настроив параметры кнопки:
 * <ul>
 *    <li>buttonReadOnly</li>
 *    <li>buttonTransparent</li>
 *    <li>buttonStyle</li>
 *    <li>buttonCaption</li>
 *    <li>buttonViewMode</li>
 *    <li>displayProperty - имя отображаемого текстового поля, значение по умолчанию - "title" </li>
 * <ul>
 * @example
 * <pre>
 *    <Controls.toolbars:View
 *       source="{{_source}}"
 *       on:itemClick="_itemClick()"
 *    >
 *       <ws:itemTemplate>
 *          <ws:partial
 *             template="Controls/toolbars:ItemTemplate"
 *             buttonStyle="{{myStyle}}"
 *             buttonReadOnly="{{readOnlyButton}}"
 *             buttonTransparent="{{myButtonTransparent}}"
 *             buttonViewMode="{{myButtonViewMode}}"
 *             displayProperty="title"
 *             iconStyleProperty="iconStyle"
 *             iconProperty="icon"
 *          />
 *      </ws:itemTemplate>
 * </pre>
 */

/*
 * @name Controls/_toolbars/View#itemTemplate
 * @cfg {Function} Template for item render.
 * @remark
 * To determine the template, you should call the base template 'Controls/toolbars:ItemTemplate'.
 * The template is placed in the component using the ws:partial tag with the template attribute.
 * You can change the display of records by setting button options values:
 * <ul>
 *    <li>buttonReadOnly</li>
 *    <li>buttonTransparent</li>
 *    <li>buttonStyle</li>
 *    <li>buttonCaption</li>
 *    <li>buttonViewMode</li>
 *    <li>displayProperty - name of displaying text field, default value "tittle"</li>
 * <ul>
 * @example
 * <pre>
 *    <Controls.toolbars:View
 *       source="{{_source}}"
 *       on:itemClick="_itemClick()"
 *    >
 *       <ws:itemTemplate>
 *          <ws:partial
 *             template="Controls/toolbars:ItemTemplate"
 *             buttonStyle="{{myStyle}}"
 *             buttonReadOnly="{{readOnlyButton}}"
 *             buttonTransparent="{{myButtonTransparent}}"
 *             buttonViewMode="{{myButtonViewMode}}"
 *             displayProperty="title"
 *             iconStyleProperty="iconStyle"
 *             iconProperty="icon"
 *          />
 *      </ws:itemTemplate>
 * </pre>
 */

/**
 * @name Controls/_toolbars/View#popupClassName
 * @cfg {String} Класс для выпадающего списка в меню тулбара.
 * @example
 * <pre>
 *    <Controls.toolbars:View
 *       popupClassName="your-custom-class"
 *       source="{{_source}}"
 *       on:itemClick="_itemClick()"/>
 * </pre>
 */
/*
 * @name Controls/_toolbars/View#popupClassName
 * @cfg {String} Class for drop-down list in toolbar menu.
 * @example
 * <pre>
 *    <Controls.toolbars:View
 *       popupClassName="your-custom-class"
 *       source="{{_source}}"
 *       on:itemClick="_itemClick()"/>
 * </pre>
 */

/*
 * @name Controls/_toolbars/View#popupClassName
 * @cfg {String} Класс для выпадающего списка в меню тулбара.
 * @example
 * <pre>
 *    <Controls.toolbars:View
 *       popupClassName="your-custom-class"
 *       source="{{_source}}"
 *       on:itemClick="_itemClick()"/>
 * </pre>
 */

/**
 * @name Controls/_toolbars/View#additionalProperty
 * @cfg {String} Позволяет отобразить дополнительные элементы в меню.
 * @example
 * Дополнительные элементы конфигурируются с помощью опции additionalProperty и дополнительного свойства additional в объекте конфигурации элементов меню.
 *<pre>
 * <Controls.toolbars:View
 *           keyProperty="key"
 *           source="{{_source}}"
 *           additionalProperty="additional"
 * />
 * </pre>
 * <pre>
 *    _source: new source.Memory({
 *        keyProperty: 'key',
 *        data: [
 *        {
 *           id: '1',
 *           showType: 0,
 *           icon: 'icon-Time',
 *        },
 *        {
 *           id: '2',
 *           showType: 0,
 *           title: 'Moscow',
 *        },
 *        {
 *           id: '3',
 *           showType: 0,
 *           title: 'St-Petersburg',
 *           additional: true
 *        }
 *        ]
 *    })
 * </pre>
 */

var _private = {
    loadItems: function (instance, source) {
        var self = this;

        instance._sourceController = new SourceController({
            source: source
        });
        return instance._sourceController.load().addCallback(function (items) {
            instance._items = items;

            // TODO: убрать когда полностью откажемся от поддержки задавания цвета в опции иконки. icon: icon-error, icon-done и т.д.
            // TODO: https://online.sbis.ru/opendoc.html?guid=05bbeb41-d353-4675-9f73-6bfc654a5f00
           ButtonActualApi.itemsSetOldIconStyle(instance._items);
            instance._menuItems = self.getMenuItems(instance._items);
            instance._needShowMenu = instance._menuItems && instance._menuItems.getCount();
            return items;
        });
    },

    getMenuItems: function (items) {
        return getMenuItems(items).value(factory.recordSet, {
            adapter: items.getAdapter(),
            keyProperty: items.getKeyProperty(),
            format: items.getFormat()
        });
    },

    setPopupOptions: function (self, newOptions) {
        self._popupOptions = {
            className: (newOptions.popupClassName || '') + ' controls-Toolbar__popup__list_theme-' + self._options.theme,
            targetPoint: {vertical: 'top', horizontal: 'right'},
            direction: {horizontal: 'left'},
            eventHandlers: {
                onResult: self._onResult,
                onClose: self._closeHandler
            },
            opener: self,
            templateOptions: {
                keyProperty: newOptions.keyProperty,
                parentProperty: newOptions.parentProperty,
                nodeProperty: newOptions.nodeProperty,
                iconSize: newOptions.iconSize,
                showClose: true
            }
        };
    },

    generateItemPopupConfig: function (item, event, self) {
        var itemConfig = '', _icon = '';
        if (item.get('icon') !== undefined && item.get('tittle') === undefined) {
            itemConfig += 'icon';
        }
        if (item.get('buttonViewMode') === 'toolButton') {
            itemConfig += 'toolButton';
        }
        //TODO: перевести вместе с кнопками на icon-size https://online.sbis.ru/opendoc.html?guid=af44769b-82b0-4b4a-a288-93706eb0a50d
        if (typeof item.get('icon') === 'string') {
            if (item.get('icon').split(' ').length === 1) {
                _icon = item.get('icon') + ' icon-medium';
            } else {
                _icon = item.get('icon');
            }
        }
        return {
            opener: self,
            targetPoint: {vertical: 'top', horizontal: 'left'},
            direction: {horizontal: 'right'},
            className: 'controls-Toolbar__popup__' + (itemConfig || 'link') + '_theme-' + self._options.theme + ' ' + (item.get('popupClassName') || ''),
            templateOptions: {
                items: self._items,
                rootKey: item.get(self._options.keyProperty),
                groupTemplate: self._options.groupTemplate,
                groupingKeyCallback: self._options.groupingKeyCallback,
                showHeader: item.get('showHeader'),
                headConfig: {
                    icon: _icon,
                    caption: item.get('title'),
                    iconStyle: item.get('iconStyle')
                }
            },
            target: event.currentTarget
        };
    },

    generateMenuConfig: function (self) {
        //Todo: https://online.sbis.ru/opendoc.html?guid=c010823c-cdd7-4f1c-8d3a-25b0e711ecea
        self._menuItems.each((item) => {
            item.set('icon', item.get('icon') || item.get('buttonIcon'));
            item.set('iconStyle', item.get('iconStyle') || item.get('buttonIconStyle'));
        });
        return {
            className: 'controls-Toolbar__popup__list_theme-' + self._options.theme + ' ' + (self._options.popupClassName || ''),
            templateOptions: {
                items: self._menuItems,
                additionalProperty: self._options.additionalProperty,
                itemTemplateProperty: self._options.itemTemplateProperty,
                groupTemplate: self._options.groupTemplate,
                groupingKeyCallback: self._options.groupingKeyCallback
            },
            target: self._children.popupTarget
        };
    },
    openPopup: function (config, self) {
        self._children.menuOpener.open(config, self);
    }
};

var Toolbar = Control.extend({
    showType: showType,
    _template: template,
    _defaultItemTemplate: toolbarItemTemplate,
    _buttonTemplate: ButtonTemplate,
    _needShowMenu: null,
    _menuItems: null,
    _parentProperty: null,
    _nodeProperty: null,
    _items: null,
    _popupOptions: null,

    constructor: function () {
        this._onResult = this._onResult.bind(this);
        this._closeHandler = this._closeHandler.bind(this);
        Toolbar.superclass.constructor.apply(this, arguments);
    },
    _beforeMount: function (options, context, receivedState) {
        this._parentProperty = options.parentProperty;
        this._nodeProperty = options.nodeProperty;

        _private.setPopupOptions(this, options);
        if (receivedState) {
            this._items = receivedState;

            // TODO: убрать когда полностью откажемся от поддержки задавания цвета в опции иконки. icon: icon-error, icon-done и т.д.
            // TODO: https://online.sbis.ru/opendoc.html?guid=05bbeb41-d353-4675-9f73-6bfc654a5f00
           ButtonActualApi.itemsSetOldIconStyle(this._items);
            this._menuItems = _private.getMenuItems(this._items);
            this._needShowMenu = this._menuItems && this._menuItems.getCount();
        } else if (options.source) {
            return _private.loadItems(this, options.source);
        }
    },
    _beforeUpdate: function (newOptions) {
        if (newOptions.keyProperty !== this._options.keyProperty ||
            this._options.parentProperty !== newOptions.parentProperty ||
            this._options.nodeProperty !== newOptions.nodeProperty ||
            this._options.popupClassName !== newOptions.popupClassName) {
            _private.setPopupOptions(this, newOptions);
        }
        if (newOptions.source && newOptions.source !== this._options.source) {
            _private.loadItems(this, newOptions.source).addCallback(function () {
                this._forceUpdate();
            }.bind(this));
        }
        this._nodeProperty = newOptions.nodeProperty;
        this._parentProperty = newOptions.parentProperty;
    },
    _onItemClick: function (event, item) {
        if (item.get('readOnly')) {
            event.stopPropagation();
        } else {
            if (item.get(this._nodeProperty)) {
                var config = _private.generateItemPopupConfig(item, event, this);
                _private.openPopup(config, this);

                // TODO нотифай событий menuOpened и menuClosed нужен для работы механизма корректного закрытия превьювера переделать
                // TODO по задаче https://online.sbis.ru/opendoc.html?guid=76ed6751-9f8c-43d7-b305-bde84c1e8cd7

                this._notify('menuOpened', [], {bubbling: true});
            }
            event.stopPropagation();
            this._notify('itemClick', [item, event.nativeEvent]);
            item.handler && item.handler(item);
        }
    },

    _isShowToolbar: function(item, parentProperty) {
        const itemShowType = item.get('showType');
        if (itemShowType === showType.MENU) {
            return false;
        }
        const itemHasParentProperty = item.has(parentProperty) && item.get(parentProperty) !== null;

        if (itemHasParentProperty) {
            return itemShowType === showType.MENU_TOOLBAR;
        }

        return true;
    },

    _showMenu: function (event) {
        var config = _private.generateMenuConfig(this);
        this._notify('menuOpened', [], {bubbling: true});
        _private.openPopup(config, this);
        event.stopPropagation(); // Stop bubbling of 'click' after opening the menu.
        // Nobody should have to catch the 'click'', if toolbar handled it.
        // For example, list can catch this event and generate 'itemClick'.
    },

    _onResult: function (result) {
        if (result.action === 'itemClick') {
            var item = result.data[0];
            this._notify('itemClick', [item]);

            // menuOpener may not exist because toolbar can be closed by toolbar parent in item click handler
            if (this._children.menuOpener && !item.get(this._nodeProperty)) {
                this._children.menuOpener.close();
            }
        }
    },

    _closeHandler: function () {
        this._notify('menuClosed', [], {bubbling: true});
    },

    _getButtonConfig: function(item) {
        const size = 'm';
        const icon = item.get('buttonIcon') || item.get('icon');
        const style = item.get('buttonStyle');
        const viewMode = item.get('buttonViewMode');
        const iconStyle = item.get('buttonIconStyle') || item.get('iconStyle');
        const transparent = item.get('buttonTransparent');
        const caption = item.get('displayProperty') || item.get('buttonCaption');
        const readOnly = item.get('buttonReadOnly') || item.get('readOnly');
        const cfg = {};
        cssStyleGeneration.call(cfg, {
            size, icon, style, viewMode, iconStyle, transparent, caption, readOnly
        });
        return cfg
    }
});

Toolbar.getDefaultOptions = function() {
    return {
        itemsSpacing: 'medium'
    };
};
//TODO: Пока не добавлена возможность загружать темизированную css-ку, загружаю ToolbarPopup статически.
//TODO: https://online.sbis.ru/opendoc.html?guid=b963cb6d-f640-45a9-acdc-aab887ea2f4a
Toolbar._theme = ['Controls/buttons', 'Controls/Classes', 'Controls/toolbars'];
Toolbar._private = _private;

export default Toolbar;
