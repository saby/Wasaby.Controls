define('SBIS3.CONTROLS/Menu/SbisMenu', [
    'SBIS3.CONTROLS/Menu/ContextMenu',
    'WS.Data/Source/SbisService',
    'WS.Data/Chain',
    'WS.Data/Entity/Model',
    'WS.Data/Collection/RecordSet',
    'WS.Data/Collection/Factory/RecordSet',
    'WS.Data/Adapter/Sbis',
    'Core/core-clone',
    'css!SBIS3.CONTROLS/Menu/SbisMenu/SbisMenu'
], function (ContextMenu, SbisService, Chain, Model, RecordSet, recordSetFactory, SbisAdapter, coreClone) {

    'use strict';

    /**
     * Контрол, отображающий контекстное меню.
     *
     * Стандарт описан <a href='http://axure.tensor.ru/standarts/v7/#p=контекстное_меню__версия_1_'>здесь</a>.
     *
     * @class SBIS3.CONTROLS/Menu/SbisMenu
     * @author Крайнов Д.О.
     * @extends SBIS3.CONTROLS/Menu/ContextMenu
     * @control
     * @public
     * @category Buttons
     */

    var _private = {
        /**
         * Добавляет элемент в сервис истории
         * @param id - идентификатор элемента
         * @private
         */
        addToHistory: function (self, id) {
            _private.getHistoryDataSource(this).call(typeof id === 'string' ? 'Add' : 'AddInt', {
                history_id: self._options.historyId,
                id: id,
                history_context: null
            });
        },

        /**
         * Устанавливает пин элемента
         * @param id - идентификатор элемента
         * @private
         */
        setPin: function (self, id, pin) {
            _private.getHistoryDataSource(self).call(typeof id === 'string' ? 'SetPin' : 'SetIntPin', {
                history_id: self._options.historyId,
                id: id,
                history_context: null,
                pin: pin
            });
        },


        getOriginId: function (id) {
            id = (id + '').replace('pinned-', '').replace('recent-', '').replace('frequent-', '');
            return id;
        },

        getHistoryDataSource: function (self) {
            if (!self._historyDataSource) {
                self._historyDataSource = new SbisService({
                    adapter: 'adapter.json',
                    endpoint: {
                        address: '/input-history/service/',
                        contract: 'InputHistory'
                    }
                });
            }
            return self._historyDataSource;
        },

        getUnionIndexesList: function (self) {
            return _private.getHistoryDataSource(self).call('UnionIndexesList', {
                params: {
                    historyId: self._options.historyId,
                    pinned: {
                        count: self._options.pinned ? 10 : 0
                    },
                    frequent: {
                        count: self._options.frequent ? 7 : 0
                    },
                    recent: {
                        count: 10
                    }
                }
            });
        },

        initRecordSet: function (self, format) {
            self._pinned = _private.getEmptyHistoryRecord(self, format);
            self._recent = _private.getEmptyHistoryRecord(self, format);
            self._frequent = _private.getEmptyHistoryRecord(self, format);
        },

        prepareRecordSet: function (self, record, idPrefix, history) {
            _private.addProperty(self, record, 'visible', 'boolean', true);
            _private.addProperty(self, record, 'pinned', 'boolean', false);
            _private.addProperty(self, record, 'historyItem', 'boolean', history);
            _private.addProperty(self, record, 'historyId', 'string', 'id');
            _private.addProperty(self, record, 'groupSeparator', 'boolean', false);
            if (self._options.additionalProperty === 'additional') {
                _private.addProperty(self, record, 'additional', 'boolean', false);
            }

            record.forEach(function (item) {
                item.set('historyId', idPrefix + item.getId());
            });

            record.setIdProperty('historyId');
        },

        prepareHistoryData: function (self) {
            _private.prepareRecordSet(self, self._oldItems, '', false);
            _private.prepareRecordSet(self, self._pinned, 'pinned-', true);
            _private.prepareRecordSet(self, self._recent, 'recent-', true);
            _private.prepareRecordSet(self, self._frequent, 'frequent-', true);
        },

        addProperty: function (self, record, name, type, defaultValue) {
            if (record.getFormat().getFieldIndex(name) === -1) {
                record.addField({
                    name: name,
                    type: type,
                    defaultValue: defaultValue
                });
            }
        },

        getEmptyHistoryRecord: function (self, format) {
            var newFormat = !Array.isArray(format) ? format.clone() : coreClone(format);

            return new RecordSet({
                format: newFormat,
                adapter: new SbisAdapter(),
                idProperty: self._oldItems.getIdProperty()
            });
        },

        filterFrequent: function (self) {
            var myself = this,
                id;

            // из популярных убираем запиненые
            return Chain(self._frequent).filter(function (item) {
                id = myself.getOriginId(item.getId());
                return !self._pinned.getRecordById('pinned-' + id);
            }).value(recordSetFactory, {
                adapter: new SbisAdapter(),
                idProperty: 'historyId',
                format: self._oldItems.getFormat().clone()
            });
        },

        filterRecent: function (self) {
            var myself = this,
                id;

            // убираем из последних выбранных запиненые и популярные пункты
            return Chain(self._recent).filter(function (item) {
                id = myself.getOriginId(item.getId());
                return !(self._pinned.getRecordById('pinned-' + id) || self._filteredFrequent.getRecordById('frequent-' + id));
            }).value(recordSetFactory, {
                adapter: new SbisAdapter(),
                idProperty: 'historyId',
                format: self._oldItems.getFormat().clone()
            });
        },

        fillPinned: function (self, historyItems) {
            var myself = this,
                id, oldElement;

            self._pinned.forEach(function (item) {
                id = myself.getOriginId(item.getId());
                oldElement = self._oldItems.getRecordById(id);

                if (oldElement && !oldElement.get(self._options.parentProperty) && !self._subContainers[oldElement.getId()]) {
                    oldElement.set('visible', false);
                }

                if (item.get(self._options.parentProperty)) {
                    item.set(self._options.parentProperty, null);
                }

                item.set('visible', true);
                item.set('pinned', true);
                oldElement.set('pinned', true);
                self._count++;
            });

            historyItems.append(self._pinned);
        },

        fillRecent: function (self, filteredRecent) {
            var myself = this,
                items = new RecordSet({
                    adapter: new SbisAdapter(),
                    idProperty: 'historyId',
                    format: self._oldItems.getFormat().clone()
                }),
                i = 0,
                id, oldElement, item, newItem;

            while (self._count < 10 && i < filteredRecent.getCount() && i < 3) {
                item = filteredRecent.at(i);
                id = myself.getOriginId(item.getId());
                oldElement = self._oldItems.getRecordById(id);

                // скрываем старый элемент только в том случае если он не находится в подменю и у него нет детей
                if (oldElement && !oldElement.get(self._options.parentProperty) && !self._subContainers[oldElement.getId()]) {
                    oldElement.set('visible', false);
                }
                newItem = new Model({
                    rawData: item.getRawData(),
                    adapter: item.getAdapter()
                });

                if (newItem.get(self._options.parentProperty)) {
                    newItem.set(self._options.parentProperty, null);
                }
                newItem.set('visible', true);
                items.add(newItem);

                self._count++;
                i++;
            }
            return items;
        },

        fillFrequent: function (self, filteredFrequent) {
            var myself = this,
                // количество популярных равно:
                // максимальное количество истории - количество закрепленных - количество недавних(максимум 3)
                countRecent = self._recent.getCount(),
                maxLength = 10 - self._pinned.getCount() - (countRecent > 3 ? 3 : countRecent),
                i = 0,
                items = new RecordSet({
                    adapter: new SbisAdapter(),
                    idProperty: 'historyId',
                    format: self._oldItems.getFormat().clone()
                }),
                id, oldElement, item, newItem;

            while (self._count < 10 && i < filteredFrequent.getCount() && i < 7 && i < maxLength) {
                item = filteredFrequent.at(i);
                id = myself.getOriginId(item.getId());
                oldElement = self._oldItems.getRecordById(id);

                if (oldElement && !oldElement.get(self._options.parentProperty) && !self._subContainers[oldElement.getId()]) {
                    oldElement.set('visible', false);
                }

                newItem = new Model({
                    rawData: item.getRawData(),
                    adapter: item.getAdapter()
                });

                if (newItem.get(self._options.parentProperty)) {
                    newItem.set(self._options.parentProperty, null);
                }

                newItem.set('visible', true);
                items.add(newItem);

                self._count++;
                i++;
            }
            return items;
        },

        getFrequent: function (self) {
            var frequentItems = new RecordSet({
                    adapter: new SbisAdapter(),
                    idProperty: 'historyId',
                    format: self._oldItems.getFormat().clone()
            }),
                items = [];

            items = _private.filterFrequent(self);
            if (self._options.frequent && items.getCount()) {
                frequentItems = _private.fillFrequent(self, items);
            }
            return frequentItems;
        },

        getRecent: function (self) {
            var recentItems = new RecordSet({
                    adapter: new SbisAdapter(),
                    idProperty: 'historyId',
                    format: self._oldItems.getFormat().clone()
                }),
                items = [];

            items = _private.filterRecent(self);
            if (items.getCount()) {
                recentItems = _private.fillRecent(self, items);
            }
            return recentItems;
        },

        processHistory: function (self) {
            var processedItems = new RecordSet({
                    adapter: new SbisAdapter(),
                    idProperty: 'historyId',
                    model: self._oldItems.getModel()
                }),
                needToDrawSeparate = false,
                itemCount = 0,
                indexLastHistoryItem = null,
                isHistoryFull, recentItems, countOfVisible, isInternalItem;

            self._count = 0;
            self._oldItems.forEach(function (element) {
                element.set('visible', true);
            });

            // запиненые отображаются всегда
            if (self._options.pinned) {
                _private.fillPinned(self, processedItems);
            }

            self._filteredFrequent = _private.getFrequent(self);
            recentItems = _private.getRecent(self);

            processedItems.append(self._filteredFrequent);
            processedItems.append(recentItems);
            if (processedItems.getCount()) {
                indexLastHistoryItem = processedItems.getCount() - 1;
            }
            processedItems.append(self._oldItems);

            // скрываем лишние
            if (processedItems.getCount() > 11) {
                countOfVisible = 0;
                // пробегаемся по всем элементам и показываем только первые 10 видимых элементов, остальные скрываем
                processedItems.forEach(function (item) {
                    isInternalItem = self._options.parentProperty && item.get(self._options.parentProperty);

                    if (countOfVisible < 10) {
                        if (item.get('visible') && !isInternalItem) {
                            countOfVisible++;
                        }
                    } else {
                        if (!isInternalItem && item.get('visible')) {
                            item.set(self._options.additionalProperty, true);
                        }
                    }
                });
                // в истории меню максимум может быть 10 элементов,
                // если меню полностью заполнено, то отображать разделитель в свернутом состоянии не нужно
                isHistoryFull = processedItems.at(9).get('historyItem');
                if (self._container) {
                    self._container.toggleClass('controls-SbisMenu-fullHistory', isHistoryFull);
                }
            }

            // нужно проверять только в случае, когда есть история
            if(indexLastHistoryItem !== null) {
                // если в истории находятся все элементы меню, то показывать разделитель не нужно
                // это может произойти, если меню без подуровней и все элементы запинены
                while (itemCount < self._oldItems.getCount() && !needToDrawSeparate) {
                    if (self._oldItems.at(itemCount).get('visible') ||
                        (self._options.parentProperty && self._oldItems.at(itemCount).get(self._options.parentProperty))) {
                        needToDrawSeparate = true;
                    }
                    itemCount++;
                }

                if (needToDrawSeparate) {
                    processedItems.at(indexLastHistoryItem).set('groupSeparator', true);
                }
            }

            return processedItems;
        },

        fillHistoryRecord: function(self, items, recordSet){
            var oldItem, newItem;
            items.forEach(function(id){
                oldItem = self._oldItems.getRecordById(id);
                if(oldItem){
                    newItem = new Model({
                        rawData: oldItem.getRawData(),
                        adapter: oldItem.getAdapter(),
                        format: oldItem.getFormat()
                    });
                    recordSet.add(newItem);
                }
            });
        },

        parseHistoryData: function(self, data){
            var rows = data.getRow(),
                displayProperty = self._options.displayProperty,
                config = {
                    adapter: new SbisAdapter(),
                    idProperty: self._oldItems.getIdProperty(),
                    format: self._oldItems.getFormat().clone()
                },
                firstName, secondName;

            if (self._options.pinned && rows.get('pinned')) {
                _private.fillHistoryRecord(self, rows.get('pinned'), self._pinned);
            }
            if (rows.get('recent')) {
                _private.fillHistoryRecord(self, rows.get('recent'), self._recent);
            }
            if (self._options.frequent && rows.get('frequent')) {
                _private.fillHistoryRecord(self, rows.get('frequent'), self._frequent);
            }
            // сортируем по алфавиту популярные записи
            self._frequent = Chain(self._frequent).sort(function (first, second) {
                firstName = first.get(displayProperty);
                secondName = second.get(displayProperty);

                return (firstName < secondName) ? -1 : (firstName > secondName) ? 1 : 0;
            }).value(recordSetFactory, config);
        },

        prepareHistory: function (self) {
            var historyItems;

            historyItems = _private.processHistory(self);
            self.setItems(historyItems);
        },


        processPinnedItem: function(self, id, origId, pinItem){
            var pinned = true,
                newItem, oldItem;

            if (!pinItem.get('pinned')) {
                newItem = new Model({
                    rawData: pinItem.getRawData(),
                    adapter: pinItem.getAdapter(),
                    format: pinItem.getFormat()
                });
                if (self._options.parentProperty) {
                    newItem.set(self._options.parentProperty, null);
                }
                newItem.set('historyItem', true);
                newItem.set('historyId', 'pinned-' + origId);
                newItem.set('groupSeparator', false);
                newItem.set(self._options.additionalProperty, false);
                self._pinned.add(newItem);
                self._pinned.setIdProperty('historyId');
                pinItem.set('visible', false);
                pinned = true;
            } else {
                // получаем старый id и восстанавливаем видимость пункта меню
                self._pinned = Chain(self._pinned).filter(function (element) {
                    return _private.getOriginId(element.getId()) !== origId;
                }).value(recordSetFactory, {
                    adapter: new SbisAdapter(),
                    idProperty: 'historyId',
                    format: self._oldItems.getFormat().clone()
                });

                oldItem = self._oldItems.getRecordById(origId);
                oldItem.set('visible', true);
                oldItem.set('pinned', false);

                pinned = false;
            }
            return pinned;
        },

        togglePinnedItem: function (self, id, origId) {
            var pinned,
                menuItem = self._items.getRecordById(id);

            pinned = _private.processPinnedItem(self, id, origId, menuItem);

            _private.prepareHistory(self);
            _private.setPin(self, origId, pinned);
        },

        addToRecent: function (self, origId, newItem) {
            var records;

            self._recent = Chain(self._recent).filter(function (element) {
                return _private.getOriginId(element.getId()) !== origId;
            }).value(recordSetFactory, {
                adapter: new SbisAdapter(),
                idProperty: 'historyId',
                format: self._oldItems.getFormat().clone()
            });

            if (self._options.parentProperty) {
                newItem.set(self._options.parentProperty, null);
            }
            if (self._options.parentProperty) {
                newItem.set('historyItem', true);
            }
            newItem.set('pinned', false);
            newItem.set('groupSeparator', false);
            newItem.set('historyId', 'recent-' + origId);
            newItem.set(self._options.additionalProperty, false);
            records = new RecordSet({
                format: self._oldItems.getFormat(),
                adapter: new SbisAdapter()
            });
            records.add(newItem);
            self._recent.prepend(records);
            self._recent.setIdProperty('historyId');
            self._pinned.setIdProperty('historyId');
        }
    };

    var SbisMenu = ContextMenu.extend(/** @lends SBIS3.CONTROLS/Menu/ContextMenu.prototype */ {
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
                additionalProperty: 'additional'
            },
            _historyDataSource: null,
            _historyDeffered: null,
            _pinned: null,
            _frequent: null,
            _recent: null,
            _oldItems: null,
            _filteredFrequent: null,
            _needToRedrawHistory: false,
            _count: 0
        },

        _modifyOptions: function (cfg) {
            var opts = SbisMenu.superclass._modifyOptions.apply(this, arguments);

            opts.className = cfg.pinned ? opts.className + ' controls-SbisMenu-padding-right' : opts.className;
            opts.additionalProperty = opts.additionalProperty ? opts.additionalProperty : 'additional';

            return opts;
        },

        show: function () {
            var self = this,
                format;

            if (!this._historyDeffered) {
                self._oldItems = coreClone(self._items);
                format = self._oldItems.getFormat();
                _private.initRecordSet(self, format);

                this._historyDeffered = _private.getUnionIndexesList(self).addCallback(function (data) {
                    _private.parseHistoryData(self, data);
                    _private.prepareHistoryData(self);
                    _private.prepareHistory(self);
                    SbisMenu.superclass.show.apply(self, arguments);
                }).addErrback(function (error) {
                    _private.prepareHistoryData(self);
                    _private.prepareHistory(self);
                    SbisMenu.superclass.show.apply(self, arguments);
                });
            } else {
                if (this._historyDeffered.isReady()) {
                    if(this._needToRedrawHistory){
                        _private.prepareHistory(self);
                        this._needToRedrawHistory = false;
                    }
                    SbisMenu.superclass.show.apply(self, arguments);
                }
            }
        },

        _getItemConfig: function (cfg, item) {
            cfg.pinned = this._options.pinned ? !!item.get('pinned') : undefined;
            cfg.historyItem = !!item.get('historyItem');
            cfg.groupSeparator = item.get('groupSeparator');

            return SbisMenu.superclass._getItemConfig.apply(this, arguments);
        },

        _itemActivatedHandler: function (id, event) {
            var targetClassName = event.target.className,
                origId = _private.getOriginId(id),
                menuItem = this._items.getRecordById(id),
                newItem;
            if (!(this._isItemHasChild(id))) {
                if (targetClassName.indexOf('controls-Menu-item-pin') !== -1) { // кликнули по пину
                    _private.togglePinnedItem(this, id, origId);
                    return;
                }
                if (!this._subContainers[origId] && this._recent) {
                    newItem = new Model({
                        rawData: menuItem.getRawData(),
                        adapter: menuItem.getAdapter()
                    });

                    _private.addToRecent(this, origId, newItem);
                    this._needToRedrawHistory = true;
                }
                // стрелять нужно старым id
                _private.addToHistory(this, origId);
            }
            SbisMenu.superclass._itemActivatedHandler.call(this, origId, event);
        }
    });

    SbisMenu._private = _private;

    return SbisMenu;

});