define('js!SBIS3.CONTROLS.SbisMenu', [
    'js!SBIS3.CONTROLS.ContextMenu',
    'js!WS.Data/Source/SbisService',
    'WS.Data/Chain',
    'WS.Data/Entity/Model',
    'WS.Data/Collection/RecordSet',
    'WS.Data/Adapter/Sbis',
    'Core/helpers/Object/isEqual',
    'Core/core-clone',
    'css!SBIS3.CONTROLS.SbisMenu'
], function (ContextMenu, SbisService, Chain, Model, RecordSet, SbisAdapter, isEqualObject, coreClone) {

    'use strict';

    /**
     * Контрол, отображающий контекстное меню.
     *
     * Стандарт описан <a href='http://axure.tensor.ru/standarts/v7/#p=контекстное_меню__версия_1_'>здесь</a>.
     *
     * @class SBIS3.CONTROLS.SbisMenu
     * @author Крайнов Дмитрий Олегович
     * @extends SBIS3.CONTROLS.ContextMenu
     * @control
     * @public
     * @category Buttons
     */

    function _getHistoryDataSource() {
        if(this._options.historyId) {
            this._historyDataSource = new SbisService({
                endpoint: {
                    address: '/input-history/service/',
                    contract: 'InputHistory'
                }
            });
        }
    }

    function _getOriginId (id) {
        id = (id + '').replace('pinned-', '').replace('recent-', '').replace('frequent-', '');
        return id;
    }

    /**
     * Добавляет элемент в сервис истории
     * @param id - идентификатор элемента
     * @private
     */
    function _addToHistory (id) {
        this._historyDataSource.call(typeof id === 'string' ? 'Add' : 'AddInt', {
            history_id: this._options.historyId,
            id: id,
            history_context: null
        });
    }
    /**
     * Устанавливает пин элемента
     * @param id - идентификатор элемента
     * @private
     */
    function _setPin (id, pin) {
        this._historyDataSource.call(typeof id === 'string' ? 'SetPin' : 'SetIntPin', {
            history_id: this._options.historyId,
            id: id,
            history_context: null,
            pin: pin
        });
    }


    function _prepareRecordSet (record, idPrefix, history){
        _addProperty.call(this, record, 'visible', 'boolean', true);
        _addProperty.call(this, record, 'pinned', 'boolean', false);
        _addProperty.call(this, record, 'historyItem', 'boolean', history);
        _addProperty.call(this, record, 'historyId', 'string', 'id');
        _addProperty.call(this, record, 'lastHistoryItem', 'boolean', false);

        record.forEach(function(item){
            item.set('historyId', idPrefix + item.getId());
        });

        record.setIdProperty('historyId');
    }

    function _addProperty (record, name, type, defaultValue){
        if(record.getFormat().getFieldIndex(name) === -1) {
            record.addField({
                name: name,
                type: type,
                defaultValue: defaultValue
            });
        }
    }

    function _getUnionList() {
        return this._historyDataSource.call('UnionList', {
            params: {
                blEndpoint: {
                    address: '/service/',
                    contract: this._options.blParams.blEndpoint.contract
                },
                binding: {
                    query: this._options.blParams.binding.query,
                    read: this._options.blParams.binding.read
                },
                historyId: this._options.historyId,
                displayField: this._options.blParams.displayField,
                pinned: {
                    count: this._options.pinned ? 10 : 0
                },
                frequent: {
                    count: this._options.frequent ? 7 : 0
                },
                recent: {
                    count: 10
                }
            }
        });
    }

    function _filterFrequent () {
        var self = this,
            id;

        // из популярных убираем запиненые
        return Chain(this._frequent).filter(function(item){
            id = _getOriginId(item.getId());
            return !self._pinned.getRecordById('pinned-' + id);
        }).value();
    }

    function _filterRecent () {
        var self = this,
            id;

        // убираем из последних выбранных запиненые и популярные пункты
        return Chain(this._recent).filter(function(item){
            id = _getOriginId(item.getId());

            return !(self._pinned.getRecordById('pinned-' + id) || self._frequent.getRecordById('frequent-' + id));
        }).value();
    }


    function _fillPinned (historyItems) {
        var self = this,
            id, oldElement;

        this._pinned.forEach(function(item){
            id = _getOriginId(item.getId());
            oldElement = self._oldItems.getRecordById(id);

            if(oldElement && !oldElement.get(self._options.parentProperty) && !self._subContainers[oldElement.getId()]) {
                oldElement.set('visible', false);
            }
            item.set('pinned', true);
            oldElement.set('pinned', true);
            self._count++;
        });

        historyItems.append(this._pinned);
    }

    function _fillRecent (filteredRecent) {
        var self = this,
            items = [],
            i = 0,
            id, oldElement, item, newItem;

        while(this._count < 10 && i < filteredRecent.length && i < 3){
            item = filteredRecent[i];
            id = _getOriginId(item.getId());
            oldElement = this._oldItems.getRecordById(id);

            // скрываем старый элемент только в том случае если он не находится в подменю и у него нет детей
            if(oldElement && !oldElement.get(self._options.parentProperty) && !self._subContainers[oldElement.getId()]) {
                oldElement.set('visible', false);
            }
            newItem = new Model({
                rawData: item.getRawData(),
                adapter: item.getAdapter()
            });

            items.push(newItem);

            this._count++;
            i++;
        }
        return items;
    }

    function _fillFrequent(filteredFrequent) {
        var self = this,
            i = 0,
            items = [],
            id, oldElement, item, newItem;

        while(this._count < 10 && i < filteredFrequent.length && i < 7){
            item = filteredFrequent[i];
            id = _getOriginId(item.getId());
            oldElement = this._oldItems.getRecordById(id);

            if(oldElement && !oldElement.get(this._options.parentProperty) && !self._subContainers[oldElement.getId()]) {
                oldElement.set('visible', false);
            }

            newItem = new Model({
                rawData: item.getRawData(),
                adapter: item.getAdapter()
            });

            items.push(newItem);

            this._count++;
            i++;
        }
        return items;
    }

    function _getFrequent () {
        var frequentItems = [],
            items = [];

        items = _filterFrequent.call(this);
        if(this._options.frequent && items.length) {
            frequentItems = _fillFrequent.call(this, items);
        }
        return frequentItems;
    }

    function _getRecent () {
        var recentItems = [],
            items = [];

        items = _filterRecent.call(this);
        if(items.length) {
            recentItems =  _fillRecent.call(this, items);
        }
        return recentItems;
    }

    function _prepareHistory () {
        var historyItems = new RecordSet({adapter: new SbisAdapter(), idProperty: 'historyId'}),
            recentItems, frequentItems;

        this._count = 0;

        this._oldItems.forEach(function(element){
            element.set('visible', true);
        });

        // запиненые отображаются всегда
        if(this._options.pinned) {
            _fillPinned.call(this, historyItems);
        }

        recentItems =  _getRecent.call(this);
        frequentItems = _getFrequent.call(this);

        historyItems.append(frequentItems);
        historyItems.append(recentItems);
        if(historyItems.getCount()) {
            historyItems.at(historyItems.getCount() - 1).set('lastHistoryItem', true);
        }
        historyItems.append(this._oldItems);
        this.setItems(historyItems);
    }

    function _togglePinnedItem (item, id, origId) {
        var menuItem = this._items.getRecordById(id),
            pinned = true,
            oldId = _getOriginId(id),
            newItem, oldItem;

        if (!menuItem.get('pinned')) {
            newItem = new Model({
                rawData: menuItem.getRawData(),
                adapter: menuItem.getAdapter()
            });
            if(this._options.parentProperty){
                newItem.set(this._options.parentProperty, null);
            }
            newItem.set('historyItem', true);
            newItem.set('historyId', 'pinned-' + origId);
            newItem.set('lastHistoryItem', false);
            this._pinned.add(newItem);
            menuItem.set('visible', false);
            pinned = true;
        } else {
            // получаем старый id и восстанавливаем видимость пункта меню
            this._pinned = this._pinned.filter(function(element){
                return element.getId() !== item.getId();
            });

            oldItem = this._oldItems.getRecordById(oldId);
            oldItem.set('visible', true);
            oldItem.set('pinned', false);

            pinned = false;
        }

        _prepareHistory.call(this);
        _setPin.call(this, _getOriginId(id));
    }

    var SbisMenu = ContextMenu.extend(/** @lends SBIS3.CONTROLS.ContextMenu.prototype */ {
        $protected: {
            _options: {
                /**
                 * @cfg {String} Идентификатор истории ввода
                 */
                historyId: null,
                /**
                 * @cfg {Boolean} Показывать ли припиненные
                 */
                pinned: false,
                /**
                 * @cfg {Boolean} Показывать ли наиболее частые
                 */
                frequent: false,
                /**
                 * @cfg {Object} Опции БЛ
                 */
                blParams: {
                    blEndpoint: {
                        contract: null
                    },
                    binding: {
                        query: null,
                        read: null
                    },
                    displayField: null
                },
                additionalProperty: 'additional'
            },
            _historyDataSource: null,
            _historyDeffered: null,
            _pinned: null,
            _frequent: null,
            _recent: null,
            _oldItems: null,
            _count: 0
        },

        _modifyOptions : function(cfg) {
            var opts = SbisMenu.superclass._modifyOptions.apply(this, arguments);

            opts.className = cfg.pinned ? opts.className + ' controls-SbisMenu-padding-right': opts.className;

            return opts;
        },

        $constructor: function () {
            _getHistoryDataSource.call(this);
        },

        show: function() {
            var self = this;

            if(!this._historyDeffered) {
                this._historyDeffered = _getUnionList.call(this).addCallback(function (dataSet) {
                    var rows = dataSet.getRow();

                    if (rows) {
                        self._oldItems = coreClone(self._items);

                        self._pinned = self._options.pinned && rows.get('pinned')? rows.get('pinned') : new RecordSet({format: self._oldItems.getFormat(), adapter: new SbisAdapter()});
                        self._recent = rows.get('recent') && rows.get('recent') ? rows.get('recent') : new RecordSet({format: self._oldItems.getFormat(),  adapter: new SbisAdapter()});
                        self._frequent = self._options.frequent && rows.get('frequent') ? rows.get('frequent') : new RecordSet({format: self._oldItems.getFormat(),  adapter: new SbisAdapter()});

                        _prepareRecordSet.call(self, self._oldItems, '', false);
                        _prepareRecordSet.call(self, self._pinned, 'pinned-', true);
                        _prepareRecordSet.call(self, self._recent, 'recent-', true);
                        _prepareRecordSet.call(self, self._frequent, 'frequent-', true);

                        _prepareHistory.call(self);
                        SbisMenu.superclass.show.apply(self, arguments);
                    }
                });
            }else {
                SbisMenu.superclass.show.apply(self, arguments);
            }
        },

        _getItemConfig: function (cfg, item) {
            cfg.pinned = this._options.pinned ? !!item.get('pinned') : undefined;
            cfg.historyItem = !!item.get('historyItem');
            cfg.lastHistoryItem = item.get('lastHistoryItem');

            return SbisMenu.superclass._getItemConfig.apply(this, arguments);
        },

        _itemActivatedHandler: function (id, event) {
            var targetClassName = event.target.className,
                item = this.getItems().getRecordById(id),
                origId = _getOriginId(id),
                menuItem = this._items.getRecordById(id),
                newItem, records;

            if (targetClassName.indexOf('controls-Menu-item-pin') !== -1) { // кликнули по пину
                _togglePinnedItem.call(this, item, id, origId);
                return;
            }
            if(!this._subContainers[origId]) {
                newItem = new Model({
                    rawData: menuItem.getRawData(),
                    adapter: menuItem.getAdapter()
                });

                if (this._recent) {
                    this._recent = this._recent.filter(function (element) {
                        return _getOriginId(element.getId()) != id;
                    });
                    if (this._options.parentProperty) {
                        newItem.set(this._options.parentProperty, null);
                    }
                    if (this._options.parentProperty) {
                        newItem.set('historyItem', true);
                    }
                    records = new RecordSet({format: this._oldItems.getFormat(), adapter: new SbisAdapter()});
                    records.add(newItem);
                    this._recent.prepend(records);

                    _prepareHistory.call(this);
                }
            }

            // стрелять нужно старым id
            _addToHistory.call(this, _getOriginId(id));

            SbisMenu.superclass._itemActivatedHandler.call(this, id, event);
        }
    });

    return SbisMenu;

});