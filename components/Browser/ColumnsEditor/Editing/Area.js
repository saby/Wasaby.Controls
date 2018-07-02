/**
 * Контрол "Область редактирования редактора колонок"
 *
 * @class SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area
 * @extends SBIS3.CONTROLS/CompoundControl
 * @author Спирин В.А.
 * @public
 */
define('SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area',
   [
      'Core/CommandDispatcher',
      'Core/Deferred',
      'WS.Data/Collection/RecordSet',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Cache',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Controllers/ItemsMoveController',
      'SBIS3.CONTROLS/ListView/resources/EditInPlaceBaseController/EditInPlaceBaseController',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/templates/preset',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/templates/presetEdit',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/templates/selectableGroupContent',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/templates/selectableItemContent',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/templates/selectableItem',
      'tmpl!SBIS3.CONTROLS/ListView/resources/ItemTemplate',
      'css!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown',
      'SBIS3.CONTROLS/CheckBox/Group',
      'SBIS3.CONTROLS/ListView',
      'SBIS3.CONTROLS/ScrollContainer',
      'SBIS3.CONTROLS/OperationsPanel/Mark'
   ],

   function (CommandDispatcher, Deferred, RecordSet, PresetCache, PresetDropdown, CompoundControl, ItemsMoveController, EditInPlaceBaseController, dotTplFn) {
      'use strict';



      /**
       * (Как бы) константа списка действий с пресетами
       * @protected
       * @type {object[]}
       */
      var _PRESET_ACTIONS = {
         edit: {title: rk('Редактировать'), icon: 'sprite:icon-16 icon-Edit icon-primary action-hover'},
         clone: {title: rk('Дублировать', 'РедакторКолонок'), icon: 'sprite:icon-16 icon-Copy icon-primary action-hover'},
         'delete': {title: rk('Удалить'), icon: 'sprite:icon-16 icon-Erase icon-error'}
      };

      /**
       * (Как бы) константа сообщения об ошибке при редактировании
       * @protected
       * @type {string}
       */
      var _PRESET_TITLE_ERROR = rk('Название шаблона не может быть пустым и должно отличаться от названий других шаблонов', 'РедакторКолонок');



      var Area = CompoundControl.extend(/**@lends SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок редактора колонок (опционально)
                */
               title: null,
               /**
                * @cfg {string} Название кнопки применения результата редактирования (опционально)
                */
               applyButtonTitle: null,//Определено в шаблоне
               /**
                * @cfg {WS.Data/Collection/RecordSet} Список колнок
                */
               columns: null,
               /**
                * @cfg {(string|number)[]} Список идентификаторов выбранных колонок
                */
               // TODO: Обратить внимание на суммирование с пресетами
               selectedColumns: [],
               /**
                * @cfg {boolean} Показывает на обязательность использования пресетов (опционально)
                */
               // TODO: Обратить внимание на суммирование с selectedColumns
               usePresets: true,
               /**
                * @cfg {string} Заголовок дропдауна (опционально)
                */
               presetsTitle: null,
               /**
                * @cfg {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit[]} Список объектов статически задаваемых пресетов (опционально)
                */
               staticPresets: null,
               /**
                * @cfg {string} Пространство имён для сохранения пользовательских пресетов (опционально)
                */
               presetNamespace: null,
               /**
                * @cfg {string|number} Идентификатор первоначально выбранного пресета в дропдауне (опционально)
                */
               selectedPresetId: null,
               /**
                * @cfg {string} Начальное название нового пользовательского пресета (опционально)
                */
               // TODO: Обратить внимание на связь с useOriginPresetTitle
               newPresetTitle: rk('Новый шаблон', 'РедакторКолонок'),
               /**
                * @cfg {boolean} При клонировании новых пользовательских пресетов строить название из исходного с добавлением следующего порядкового номера (опционально)
                */
               // TODO: Обратить внимание на связь с newPresetTitle
               useOriginPresetTitle: true,
               /**
                * @cfg {boolean} Указывает на необходимость включить перемещнение пользователем пунктов списка колонок (опционально)
                */
               moveColumns: true,
               /**
                * @cfg {boolean} Указывает на необходимость сохранять порядок следования колонок таким, каким он был передан в опциях columns и selectedColumns. В отстутствии этой опции выбранные колонки будут подняты вверх, не выбранные - уйдут вниз. Опция действует только при выключенном перемещнении пользователем пунктов списка колонок (moveolumns==false) (опционально)
                */
               preserveOrder: false,
               /**
                * @cfg {boolean} Разрешён ли множественный выбор колонок (опционально)
                */
               multiselect: true,
               /**
                * @cfg {boolean} При выборе колонки применение выбора (и закрытие диалога) происходит автоматически, без нажатия кнопки "Применить". При этом кнопка "Применить" не отображается. Применимо только при выключенном множественном выборе (multiselect == false) (опционально)
                */
               autoApply: false
            },
            _childNames: {
               presetView: 'controls-Browser-ColumnsEditor-Editing-Area__Preset',
               fixedView: 'controls-Browser-ColumnsEditor-Editing-Area__FixedList',
               selectableView: 'controls-Browser-ColumnsEditor-Editing-Area__SelectableList',
               presetDropdown: 'controls-Browser-ColumnsEditor-Editing-Area__Preset-item-title',
               presetInput: 'controls-Browser-ColumnsEditor-Editing-Area__Preset-input',
               operationsMark: 'controls-Browser-ColumnsEditor-Editing-Area__OperationsMark',
               applyColumnsButton: 'controls-Browser-ColumnsEditor-Editing-Area__ApplyColumnsButton'
            },
            _presetView: null,
            _presetDropdown: null,
            _fixedView: null,
            _selectableView: null,
            _currentPreset: null,
            _operationsMark: null,
            _applyColumnsButton: null,
            _presetValidator: null
         },

         _modifyOptions: function () {
            var cfg = Area.superclass._modifyOptions.apply(this, arguments);
            var preset = cfg.usePresets ? _getPreset(cfg.staticPresets, cfg.selectedPresetId) : null;
            cfg._optsPreset = cfg.usePresets ? {
               items: _makePresetViewItems(preset)
            } : null;
            _prepareChildItemsAndGroups(cfg, preset);
            cfg.hasGroups = !!cfg._groups && 0 < cfg._groups.length;
            cfg._optsSelectable.onItemClick = _onItemClick;
            cfg._optsSelectable.onSelectedItemsChange = _onSelectedItemsChange;
            cfg._optsSelectable.multiselect = !!cfg.multiselect;
            return cfg;
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'applyColumns', this._commandApplyColumns);
            this._publish('onComplete');
         },

         init: function () {
            Area.superclass.init.apply(this, arguments);
            var options = this._options;
            this._presetView = options.usePresets ? _getChildComponent(this, this._childNames.presetView) : null;
            this._fixedView = _getChildComponent(this, this._childNames.fixedView);
            this._selectableView = this.getChildControlByName(this._childNames.selectableView);
            this._operationsMark = _getChildComponent(this, this._childNames.operationsMark);
            this._applyColumnsButton = this.getChildControlByName(this._childNames.applyColumnsButton);

            if (this._operationsMark) {
               this._operationsMark.setLinkedView(this._selectableView);
            }

            if (this._presetView) {
               //PresetCache.subscribe(options.presetNamespace, 'onCacheError', function () {});

               _getPresets(this).addCallback(function (presets) {
                  this._currentPreset = _getPreset(presets, options.selectedPresetId || PresetDropdown.getLastSelected(options.presetNamespace));
                  _updatePresetView(this);
                  _updateSelectableViewByPreset(this);

                  this.subscribeTo(this._presetView, 'onAfterBeginEdit', function () {
                     this._presetView.setItemsActions([]);
                     this._presetView._editInPlace.getChildControlByName(this._childNames.presetInput).setValidators([this._presetValidator]);
                  }.bind(this));
                  this.subscribeTo(this._presetView, 'onEndEdit', function (evtName, model, withSaving) {
                     if (withSaving) {
                        var isValid = this._presetView._editInPlace.isValidChanges();
                        evtName.setResult(EditInPlaceBaseController.EndEditResult[isValid ? 'CUSTOM_LOGIC' : 'CANCEL']);
                        if (isValid) {
                           this._presetView.getItems().replace(model, 0);
                           _modifyPresets(this, 'change-title', model.get('title'));
                        }
                     }
                  }.bind(this));
                  this.subscribeTo(this._presetView, 'onAfterEndEdit', function (evtName, model, $target, withSaving) {
                     this._presetValidator = null;
                     if (withSaving) {
                        _initPresetDropdown(this);
                     }
                     this._presetView.setItemsActions(_makePresetItemsActions(this, this._currentPreset.isStorable));
                  }.bind(this));
               }.bind(this));
            }

            if (options.moveColumns) {
               this._itemsMoveController = new ItemsMoveController({
                  linkedView: this._selectableView
               });
            }

            if (!this._fixedView) {
               this.subscribeTo(this._selectableView, 'onSelectedItemsChange', function (e, selectedIds, changes) {
                  this._applyColumnsButton.setVisible(!!(selectedIds && selectedIds.length));
               }.bind(this));
            }

            if (!options.multiselect && options.autoApply) {
               this.subscribeTo(this._selectableView, 'onItemActivate', this.sendCommand.bind(this, 'applyColumns'));
            }
         },

         _commandApplyColumns: function () {
            var selectedColumns = [];
            var options = this._options;
            if (this._fixedView || this._selectableView) {
               if (this._fixedView) {
                  selectedColumns.push.apply(selectedColumns, options._optsFixed.markedKeys);
               }
               if (this._selectableView) {
                  var view = this._selectableView;
                  var list = view.getSelectedKeys();
                  if (list.length) {
                     list = list.slice();
                     var items = view.getItems();
                     var groups = options._groups;
                     // Сортируем выделенные записи согласно их положению в рекордсете и c учётом их групп
                     list.sort(function (e1, e2) {
                        var v1 = items.getRecordById(e1);
                        var v2 = items.getRecordById(e2);
                        if (groups) {
                           var gi1 = groups.indexOf(v1.get('group'));
                           var gi2 = groups.indexOf(v2.get('group'));
                           if (gi1 !== gi2) {
                              return gi1 - gi2;
                           }
                        }
                        return items.getIndex(v1) - items.getIndex(v2);
                     });
                     selectedColumns.push.apply(selectedColumns, list);
                  }
               }
            }
            if (selectedColumns.length) {
               if (options.usePresets) {
                  var namespace = options.presetNamespace;
                  var preset = this._currentPreset;
                  if (namespace && preset && preset.isStorable && !_isEqualLists(selectedColumns, preset.selectedColumns)) {
                     preset.selectedColumns = selectedColumns;
                     PresetCache.update(namespace, preset);
                  }
               }
               this._notify('onComplete', options.columns, selectedColumns);
            }
            else {
               this._notify('onClose');
            }
         },

         destroy: function () {
            if (this._itemsMoveController) {
               this._itemsMoveController.destroy();
            }
            Area.superclass.destroy.apply(this, arguments);
         }
      });



      // Private methods:

      var _getPreset = function (presets, selectedPresetId) {
         if (presets && presets.length) {
            var i = selectedPresetId ? presets.map(function (v) { return v.id; }).indexOf(selectedPresetId) : -1;
            return presets[i !== -1 ? i : 0];
         }
      };

      var _uniqueConcat = function (list1, list2) {
         return list1 && list1.length ? (list2 && list2.length ? list1.concat(list2).reduce(function (r, v) { if (r.indexOf(v) === -1) { r.push(v); }; return r; }, []) : list1) : (list2 && list2.length ? list2 : []);
      };

      var _prepareChildItemsAndGroups = function (cfg, preset) {
         var
            columns = cfg.columns,
            selectedColumns = _uniqueConcat(preset ? preset.selectedColumns : null, cfg.selectedColumns);
         var
            fixed = {
               items: [],
               markedKeys: []
            },
            selectable = {
               items: [],
               markedKeys: []
            },
            groups = [];
         columns.each(function (column) {
            var columnId = column.getId();
            var colData = column.getRawData();
            if (column.get('fixed')) {
               fixed.items.push(colData);
               fixed.markedKeys.push(columnId);
            }
            else {
               selectable.items.push(colData);
               if (selectedColumns.indexOf(columnId) !== -1) {
                  selectable.markedKeys.push(columnId);
               }
               var group = column.get('group') || null;
               if (groups.indexOf(group) === -1) {
                  groups.push(group);
               }
            }
         });
         // Если группы не содержательны - сбросить их
         if (!groups.length || (groups.length === 1 && groups[0] == null)) {
            groups = null;
         }
         // Если группы есть - отсортировать их
         if (groups) {
            var groupTitles = cfg.groupTitles;
            if (groupTitles && typeof groupTitles === 'object') {
               // Если задан список заголовков групп - сохранить порядок следования групп точно таким, как в этом списке
               var gIds = Object.keys(groupTitles);
               groups.sort(function (v1, v2) {
                  return gIds.indexOf(v1) - gIds.indexOf(v2);
               });
            }
            else {
               groups.sort();
            }
         }
         // Отсортировать записи согласно порядку в списке выбранных колонок и с учётом порядка групп
         selectable.items.sort(_selectableItemsSorter.bind(null,
            cfg.moveColumns || !cfg.preserveOrder ? selectedColumns : null,
            groups,
            selectable.items.map(function (v) { return v.id; })
         ));
         selectable.items = new RecordSet({rawData:selectable.items, idProperty:'id'});
         cfg._optsFixed = fixed;
         cfg._optsSelectable = selectable;
         cfg._groups = groups;
      };

      var _selectableItemsSorter = function (selectedIds, groups, columnIds, c1, c2) {
         if (selectedIds) {
            // Сначала смотрим на прядок в selectedIds
            var i1 = selectedIds.indexOf(c1.id);
            var i2 = selectedIds.indexOf(c2.id);
            if (i1 !== -1 && i2 !== -1) {
               return i1 - i2;
            }
         }
         // Далее - на порядок групп
         if (groups) {
            var gi1 = groups.indexOf(c1.group);
            var gi2 = groups.indexOf(c2.group);
            if (gi1 !== gi2) {
               return gi1 - gi2;
            }
         }
         if (selectedIds) {
            // Если хотя бы один - выбран
            if (i1 !== i2) {
               return i1 === -1 ? +1 : -1;
            }
         }
         // Иначе - сохранить исходный порядок
         return columnIds.indexOf(c1.id) - columnIds.indexOf(c2.id);
      };

      var _makePresetViewItems = function (preset) {
         return new RecordSet({idProperty:'id', rawData:preset ? [{id:preset.id, title:preset.title}] : []});
      };

      var _isEqualLists = function (list1, list2) {
         var len = list1 ? list1.length : 0;
         if (len !== (list2 ? list2.length : 0)) {
            return false;
         }
         for (var i = 0; i < len; i++) {
            if (list1[i] !== list2[i]) {
               return false;
            }
         }
         return true;
      };

      var _validatePresetTitle = function (list, value) {
         if (value) {
            var v = value.trim();
            return !!v && list.indexOf(v) === -1;
         }
      };



      /**
       * Получить общий список пресетов (и заданных статически, и сохраняемых пользовательских)
       * @private
       * @param {object} self "Этот" объект
       * @return {Core/Deferred<SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit>}
       */
      var _getPresets = function (self) {
         var presets = self._options.staticPresets || [];
         var namespace = self._options.presetNamespace;
         if (namespace) {
            return PresetCache.list(namespace).addCallback(function (units) {
               if (units && units.length) {
                  presets = presets.concat(units);
                  // TODO: Нужна ли общая сортировка ? Если да, то как пользователь будет различить статические и пользовательские пресеты ?
               }
               return presets;
            });
         }
         else {
            return Deferred.success(presets);
         }
      };

      var _getChildComponent = function (self, name) {
         if (self.hasChildControlByName(name)) {
            return self.getChildControlByName(name);
         }
      };

      var _updatePresetView = function (self) {
         self._presetDropdown = null;
         var presetView = self._presetView;
         var preset = self._currentPreset;
         self.subscribeOnceTo(presetView, 'onDrawItems'/*onItemsReady*/, _initPresetDropdown.bind(null, self));
         presetView.setItems(_makePresetViewItems(preset));
         presetView.setItemsActions(_makePresetItemsActions(self, preset.isStorable));
      };

      var _initPresetDropdown = function (self) {
         var dropdown = self._presetDropdown = _getChildComponent(self._presetView, self._childNames.presetDropdown);
         var preset = self._currentPreset;
         if (preset) {
            dropdown.setSelectedPresetId(preset.id);
         }
         self.subscribeTo(dropdown, 'onChange', function (evtName, selectedPresetId) {
            _onPresetDropdownChanged(self);
         });
      };

      var _onPresetDropdownChanged = function (self) {
         _getPresets(self).addCallback(function (presets) {
            self._currentPreset = _getPreset(presets, self._presetDropdown.getSelectedPresetId());
            _updatePresetView(self);
            _updateSelectableViewByPreset(self);
         });
      };

      var _updateSelectableViewByPreset = function (self) {
         var selectedIds = self._currentPreset ? self._currentPreset.selectedColumns : [];
         var selectedColumns = [];
         if (selectedIds.length) {
            var options = self._options;
            var columns = options.columns.getRawData();
            for (var i = 0; i < columns.length; i++) {
               var column = columns[i];
               if (!column.fixed && selectedIds.indexOf(column.id) !== -1) {
                  selectedColumns.push(column.id);
               }
            }
            var newColumns = columns.reduce(function (r, v) { if (!v.fixed) { r.push(v); } return r; }, []);
            newColumns.sort(_selectableItemsSorter.bind(null,
               options.moveColumns || !options.preserveOrder ? selectedIds : null,
               options._groups,
               columns.map(function (v) { return v.id; })
            ));
            self._selectableView.setItems(new RecordSet({rawData:newColumns, idProperty:'id'}));
         }
         self._selectableView.setSelectedKeys(selectedColumns);
      };

      var _makePresetItemsActions = function (self, useAllActions) {
         return (useAllActions ? Object.keys(_PRESET_ACTIONS) : ['clone']).map(function (action) {
            var inf = _PRESET_ACTIONS[action];
            return {
               name: action,
               icon: inf.icon,
               caption: inf.title,
               tooltip: inf.title,
               isMainAction: true,
               onActivated: _applyPresetAction.bind(null, self, action)
            };
         });
      };

      var _applyPresetAction = function (self, action, $item, itemId, itemModel) {
         switch (action) {
            case 'edit':
               _startPresetEditing(self);
               break;
            case 'clone':
            case 'delete':
               _modifyPresets(self, action);
               _updatePresetView(self);
               _updateSelectableViewByPreset(self);
               break;
         }
      };

      var _startPresetEditing = function (self) {
         _getPresets(self).addCallback(function (presets) {
            var titles = presets.map(function (v) { return v.title; });
            titles.splice(titles.indexOf(self._currentPreset.title), 1);
            self._presetValidator = {
               option: 'text',
               validator: _validatePresetTitle.bind(null, titles),
               errorMessage: _PRESET_TITLE_ERROR
            };
            self._presetView.beginEdit(self._presetView.getItems().at(0), false);
         });
      };

      var _fitPresetTitle = function (self, title) {
         var promise = new Deferred();
         _getPresets(self).addCallback(function (presets) {
            var reEnd = /\s+\(([0-9]+)\)\s*$/;
            var pattern = title.replace(reEnd, '');
            var previous = presets.reduce(function (result, item) {
               var value = item.title;
               if (value.indexOf(pattern) === 0) {
                  if (value.length === pattern.length) {
                     result.push(1);
                  }
                  else {
                     var ms = value.substring(pattern.length).match(reEnd);
                     if (ms) {
                        result.push(parseInt(ms[1]));
                     }
                  }
               };
               return result;
            }, []);
            promise.callback(previous.length ? pattern + ' (' + (Math.max.apply(Math, previous) + 1) + ')' : pattern);
         });
         return promise;
      };

      var _modifyPresets = function (self, action, arg) {
         var namespace = self._options.presetNamespace;
         var preset = self._currentPreset;
         if (!namespace || !preset) {
            throw new Error('Nothing to modify');
         }
         if (!preset.isStorable && action !== 'clone') {
            return;
         }
         switch (action) {
            case 'change-title':
               preset.title = arg.trim();
               PresetCache.update(namespace, preset);
               break;

            case 'clone':
               _fitPresetTitle(self, self._options.useOriginPresetTitle ? preset.title : self._options.newPresetTitle).addCallback(function (title) {
                  var newPreset = PresetCache.create(namespace, {
                     title: title,
                     selectedColumns: preset.selectedColumns.slice()
                  });
                  self._presetDropdown.setSelectedPresetId(newPreset.id);
                  self._currentPreset = newPreset;
                  setTimeout(_startPresetEditing.bind(null, self), 1);
               });
               break;

            case 'delete':
               var presets, index;
               if (self._presetDropdown) {
                  presets = self._presetDropdown.getPresets();
                  index = presets && presets.length ? presets.map(function (v) { return v.id; }).indexOf(preset.id) : -1;
               }
               var nextPreset = index !== -1 && 1 < presets.length ? presets[index !== presets.length - 1 ? index + 1 : index - 1] : null;
               if (nextPreset) {
                  self._presetDropdown.setSelectedPresetId(nextPreset.id);
               }
               self._currentPreset = nextPreset;
               PresetCache.delete(namespace, preset);
               break;
         }
      };



      // ListView event handlers:

      var _onItemClick = function (e, id, model, itemContent) {
         this.toggleItemsSelection([id]);
      };

      var _onSelectedItemsChange = function (e, selectedIds, changes) {
         var handler = function (id) {
            this.redrawItem(this.getItems().getRecordById(id));
         }.bind(this);
         changes.added.forEach(handler);
         changes.removed.forEach(handler);
      };



      return Area;
   }
);
