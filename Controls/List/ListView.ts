/**
 * Created by kraynovdo on 22.09.2017.
 */
import BaseControl = require('Core/Control');
import cDebounce = require('Core/helpers/Function/debounce');
import Env = require('Env/Env');
import ListViewTpl = require('wml!Controls/List/ListView/ListView');
import defaultItemTemplate = require('wml!Controls/List/ItemTemplate');
import GroupTemplate = require('wml!Controls/List/GroupTemplate');
import ItemOutputWrapper = require('wml!Controls/List/resources/ItemOutputWrapper');
require('wml!Controls/List/resources/ItemOutput');
require('css!theme?Controls/List/ListView/ListView');

var
    DEBOUNCE_HOVERED_ITEM_CHANGED = 150;

var _private = {
    checkDeprecated: function (cfg) {
        // TODO: https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
        if (cfg.leftSpacing !== undefined) {
            Env.IoC.resolve('ILogger').warn('IList', 'Option "leftSpacing" is deprecated and will be removed in 19.200. Use option "itemPadding.left".');
        }
        if (cfg.leftPadding !== undefined) {
            Env.IoC.resolve('ILogger').warn('IList', 'Option "leftPadding" is deprecated and will be removed in 19.200. Use option "itemPadding.left".');
        }
        if (cfg.rightSpacing !== undefined) {
            Env.IoC.resolve('ILogger').warn('IList', 'Option "rightSpacing" is deprecated and will be removed in 19.200. Use option "itemPadding.right".');
        }
        if (cfg.rightPadding !== undefined) {
            Env.IoC.resolve('ILogger').warn('IList', 'Option "rightPadding" is deprecated and will be removed in 19.200. Use option "itemPadding.right".');
        }
        if (cfg.rowSpacing !== undefined) {
            Env.IoC.resolve('ILogger').warn('IList', 'Option "rowSpacing" is deprecated and will be removed in 19.200. Use option "itemPadding.top and itemPadding.bottom".');
        }
        if (cfg.contextMenuEnabled !== undefined) {
            Env.IoC.resolve('ILogger').warn('IList', 'Option "contextMenuEnabled" is deprecated and removed in 19.200. Use option "contextMenuVisibility".');
        }
        if (cfg.markerVisibility === 'always') {
            Env.IoC.resolve('ILogger').warn('IList', 'Value "always" for property Controls/List/interface/IList#markerVisibility is deprecated, use value "visible" instead.');
        }
        if (cfg.markerVisibility === 'demand') {
            Env.IoC.resolve('ILogger').warn('IList', 'Value "demand" for property Controls/List/interface/IList#markerVisibility is deprecated, use value "onactivated" instead.');
        }
        if (cfg.results) {
            Env.IoC.resolve('ILogger').warn('IList', 'Option "results" is deprecated and removed in 19.200. Use options "resultsPosition" and "resultsTemplate".');
        }
    },

    onListChange: function (self) {
        self._listChanged = true;
        self._forceUpdate();
    },

    resizeNotifyOnListChanged: function (self) {
        if (self._listChanged) {
            self._listChanged = false;

            //command to scroll watcher
            self._notify('controlResize', [], {bubbling: true});
        }
    },

    setHoveredItem: cDebounce(function (self, item, nativeEvent) {
        if (item !== self._hoveredItem) {
            self._hoveredItem = item;
            var container = nativeEvent ? nativeEvent.target.closest('.controls-ListView__itemV') : null;
            self._notify('hoveredItemChanged', [item, container]);
        }
    }, DEBOUNCE_HOVERED_ITEM_CHANGED)
};

var ListView = BaseControl.extend(
    {
        _listModel: null,
        _lockForUpdate: false,
        _queue: null,
        _hoveredItem: null,
        _template: ListViewTpl,
        _groupTemplate: GroupTemplate,
        _defaultItemTemplate: defaultItemTemplate,
        _listChanged: false,
        _itemOutputWrapper: ItemOutputWrapper,

        constructor: function () {
            ListView.superclass.constructor.apply(this, arguments);
            var self = this;
            this._queue = [];
            this._onListChangeFnc = function (e) {
                if (self._lockForUpdate) {
                    self._queue.push(_private.onListChange.bind(null, self));
                } else {
                    _private.onListChange(self);
                }
            };
        },

        _beforeMount: function (newOptions) {
            _private.checkDeprecated(newOptions);
            if (newOptions.groupTemplate) {
                this._groupTemplate = newOptions.groupTemplate;
            }
            if (newOptions.listModel) {
                this._listModel = newOptions.listModel;
                this._listModel.subscribe('onListChange', this._onListChangeFnc);
                this._listModel.subscribe('onMarkedKeyChanged', this._onMarkedKeyChangedHandler.bind(this));
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
        },

        _beforeUpdate: function (newOptions) {
            if (newOptions.listModel && (this._listModel != newOptions.listModel)) {
                this._listModel = newOptions.listModel;
                this._listModel.subscribe('onListChange', this._onListChangeFnc);
            }
            if (this._options.itemTemplateProperty !== newOptions.itemTemplateProperty) {
                this._listModel.setItemTemplateProperty(newOptions.itemTemplateProperty);
            }
            if (this._options.groupTemplate !== newOptions.groupTemplate) {
                this._groupTemplate = newOptions.groupTemplate;
            }
            if (this._options.itemPadding !== newOptions.itemPadding) {
                this._listModel.setItemPadding(newOptions.itemPadding);
            }

            // TODO https://online.sbis.ru/opendoc.html?guid=837b45bc-b1f0-4bd2-96de-faedf56bc2f6
            if (this._options.leftSpacing !== newOptions.leftSpacing) {
                this._listModel.setLeftSpacing(newOptions.leftSpacing);
            }
            if (this._options.leftPadding !== newOptions.leftPadding) {
                this._listModel.setLeftPadding(newOptions.leftPadding);
            }
            if (this._options.rightSpacing !== newOptions.rightSpacing) {
                this._listModel.setRightSpacing(newOptions.rightSpacing);
            }
            if (this._options.rightPadding !== newOptions.rightPadding) {
                this._listModel.setRightPadding(newOptions.rightPadding);
            }
            if (this._options.rowSpacing !== newOptions.rowSpacing) {
                this._listModel.setRowSpacing(newOptions.rowSpacing);
            }
            this._itemTemplate = newOptions.itemTemplate || this._defaultItemTemplate;
            this._lockForUpdate = true;
        },

        _afterMount: function () {
            _private.resizeNotifyOnListChanged(this);
            if (this._options.markedKey === undefined && (this._options.markerVisibility === 'always' || this._options.markerVisibility === 'visible')) {
                this._notify('markedKeyChanged', [this._listModel.getMarkedKey()]);
            }
        },

        _afterUpdate: function () {
            this._lockForUpdate = false;
            _private.resizeNotifyOnListChanged(this);
            if (this._queue.length > 0) {
                for (var i = 0; i < this._queue.length; i++) {
                    this._queue[i]();
                }
                this._queue = [];
            }
        },

        getItemsContainer: function () {
            return this._children.itemsContainer;
        },

        _onItemClick: function (e, dispItem) {
            var item = dispItem.getContents();
            this._notify('itemClick', [item, e], {bubbling: true});
        },

        _onGroupClick: function (e, dispItem) {
            var
                item = dispItem.getContents();
            this._notify('groupClick', [item, e], {bubbling: true});
        },

        _onItemContextMenu: function (event, itemData) {
            if (this._options.contextMenuEnabled !== false && this._options.contextMenuVisibility !== false) {
                this._notify('itemContextMenu', [itemData, event, true]);
            }
        },

        _onItemSwipe: function (event, itemData) {
            if (event.nativeEvent.direction === 'left' || event.nativeEvent.direction === 'right') {
                event.currentTarget.focus();
            }
            this._notify('itemSwipe', [itemData, event]);
        },

        _onRowDeactivated: function (event, eventOptions) {
            this._notify('rowDeactivated', [eventOptions]);
        },

        _onItemMouseDown: function (event, itemData) {
            this._notify('itemMouseDown', [itemData, event]);
            event.blockUpdate = true;
        },

        _onItemMouseEnter: function (event, itemData) {
            this._notify('itemMouseEnter', [itemData, event]);
            _private.setHoveredItem(this, itemData.item, event);
            event.blockUpdate = true;
        },


        // При перерисовке элемента списка фокус улетает на body. Сейчас так восстаначливаем фокус. Выпилить после решения
        // задачи https://online.sbis.ru/opendoc.html?guid=38315a8d-2006-4eb8-aeb3-05b9447cd629
        _focusInHandler: function (event) {
            // todo: add fakeFocusElement in 19.122
            // var
            //    tag = event.target.tagName.toLowerCase(),
            //    isContentEditable = !!event.target.attributes.contenteditable && event.target.attributes.contenteditable.value !== 'false';
            // if (tag !== 'input' && tag !== 'textarea' && !isContentEditable) {
            //    this._container.focus();
            // }
        },

        //TODO: из-за того что ItemOutput.wml один для всех таблиц, приходится подписываться в нем на события,
        //которые не нужны для ListView. Выписана задача https://online.sbis.ru/opendoc.html?guid=9fd4922f-eb37-46d5-8c39-dfe094605164
        _onItemMouseLeave: function (event) {
            _private.setHoveredItem(this, null);
            event.blockUpdate = true;
        },

        _onItemMouseMove: function (event, itemData) {
            this._notify('itemMouseMove', [itemData, event]);
            event.blockUpdate = true;
        },

        _onItemWheel: function () {
        },

        _onMarkedKeyChangedHandler: function (event, key) {
            this._notify('markedKeyChanged', [key]);
        }
    });

ListView._private = _private;

ListView.getDefaultOptions = function () {
    return {
        contextMenuVisibility: true,
        markerVisibility: 'onactivated'
    };
};

export = ListView;
