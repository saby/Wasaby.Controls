/**
 * Контрол "Область редактирования редактора колонок"
 *
 * @public
 * @class SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area',
   [
      'Core/CommandDispatcher',
      'Core/Deferred',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Functor/Compute',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/AreaSelectableModel',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Cache',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Controllers/ItemsMoveController',
      'SBIS3.CONTROLS/ListView/resources/EditInPlaceBaseController/EditInPlaceBaseController',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/templates/preset',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/templates/presetEdit',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/templates/selectableGroupContent',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/templates/selectableItemContent',
      'css!SBIS3.CONTROLS/Browser/ColumnsEditor/Editing/Area',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown',
      'SBIS3.CONTROLS/CheckBox/Group',
      'SBIS3.CONTROLS/ListView',
      'SBIS3.CONTROLS/ScrollContainer'
   ],

   function (CommandDispatcher, Deferred, RecordSet, ComputeFunctor, AreaSelectableModel, PresetCache, CompoundControl, ItemsMoveController, EditInPlaceBaseController, dotTplFn) {
      'use strict';



      /**
       * (Как бы) константа списка действий с пресетами
       * @protected
       * @type {object[]}
       */
      var _PRESET_ACTIONS = {
         edit: {title: rk('Редактировать'), icon: 'sprite:icon-16 icon-Edit icon-primary action-hover'},
         clone: {title: rk('Дублировать'), icon: 'sprite:icon-16 icon-Copy icon-primary action-hover'},
         'delete': {title: rk('Удалить'), icon: 'sprite:icon-16 icon-Erase icon-error'}
      };



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
               selectedColumns: [],
               /**
                * @cfg {boolean} Показывает на обязательность использования пресетов (опционально)
                */
               usePresets: true,
               /**
                * @cfg {string} Заголовок дропдауна (опционально)
                */
               presetsTitle: null,
               /**
                * @cfg {SBIS3.CONTROLS.Browser/Browser/ColumnsEditor/Preset/Unit[]} Список объектов статически задаваемых пресетов (опционально)
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
               newPresetTitle: rk('Новый пресет'),
               /**
                * @cfg {boolean} При добавлении новых пользовательских пресетов строить название из предыдущего с добавлением следующего порядкового номера (опционально)
                */
               useNumberedTitle: true,
               /**
                * @cfg {boolean} Указывает на необходимость включить перемещнение пользователем пунктов списка колонок (опционально)
                */
               moveColumns: true
            },
            _childNames: {
               presetView: 'controls-Browser-ColumnsEditor-Editing-Area__Preset',
               fixedView: 'controls-Browser-ColumnsEditor-Editing-Area__FixedList',
               selectableView: 'controls-Browser-ColumnsEditor-Editing-Area__SelectableList',
               presetDropdown: 'controls-Browser-ColumnsEditor-Editing-Area__Preset-item-title'
            },
            _presetView: null,
            _presetDropdown: null,
            _fixedView: null,
            _selectableView: null,
            _currentPreset: null
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
            if (!cfg.moveColumns) {
               // Добавляем автосортировку отмеченных элементов - они должны отображаться перед неотмеченными
               cfg._optsSelectable.itemsSortMethod = _getItemsSortMethod();
               cfg._optsSelectable.onSelectedItemsChange = _onSelectedItemsChange;
            }
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
            this._fixedView = this.getChildControlByName(this._childNames.fixedView);
            this._selectableView = this.getChildControlByName(this._childNames.selectableView);

            if (this._presetView) {
               //PresetCache.subscribe(options.presetNamespace, 'onCacheError', function () {});

               _getPresets(this).addCallback(function (presets) {
                  this._currentPreset = _getPreset(presets, options.selectedPresetId);
                  _updatePresetView(this);

                  this.subscribeTo(this._presetView, 'onAfterBeginEdit', this._presetView.setItemsActions.bind(this._presetView, []));
                  this.subscribeTo(this._presetView, 'onEndEdit', function (evtName, model, withSaving) {
                     if (withSaving) {
                        evtName.setResult(EditInPlaceBaseController.EndEditResult.CUSTOM_LOGIC);
                        this._presetView.getItems().replace(model, 0);
                        _modifyPresets(this, 'change-title', model.get('title'));
                     }
                  }.bind(this));
                  this.subscribeTo(this._presetView, 'onAfterEndEdit', function (evtName, model, $target, withSaving) {
                     _initPresetDropdown(this);
                     this._presetView.setItemsActions(_makePresetItemsActions(this, this._currentPreset.isStorable));
                  }.bind(this));
               }.bind(this));
            }

            // В опциях могут быть указаны группы, которые нужно распахнуть при открытии
            if (options.moveColumns) {
               this._itemsMoveController = new ItemsMoveController({
                  linkedView: this._selectableView
               });
            }
         },

         _commandApplyColumns: function () {
            var selectedColumns = [];
            if (this._fixedView || this._selectableView) {
               if (this._fixedView) {
                  selectedColumns.push.apply(selectedColumns, this._options._optsFixed.markedKeys);
               }
               if (this._selectableView) {
                  var view = this._selectableView;
                  var list = [].concat(view.getSelectedKeys());
                  if (list.length) {
                     var items = view.getItems();
                     // Сортируем выделенные записи согласно их положению в рекордсете
                     list.sort(function (e1, e2) {
                        return items.getIndex(items.getRecordById(e1)) - items.getIndex(items.getRecordById(e2));
                     });
                     selectedColumns.push.apply(selectedColumns, list);
                  }
               }
            }
            if (selectedColumns.length) {
               if (this._options.usePresets) {
                  var namespace = this._options.presetNamespace;
                  var preset = this._currentPreset;
                  if (namespace && preset && preset.isStorable && !_isEqualLists(selectedColumns, preset.selectedColumns)) {
                     preset.selectedColumns = selectedColumns;
                     PresetCache.update(namespace, preset);
                  }
               }
               this._notify('onComplete', selectedColumns);
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

      var _getSelectedColumns = function (cfg, preset, concatAll) {
         var selected = preset ? preset.selectedColumns : null;
         return concatAll ? _uniqueConcat(selected, cfg.selectedColumns) : (selected || []);
      };

      var _prepareChildItemsAndGroups = function (cfg, preset) {
         var
            columns = cfg.columns,
            selectedColumns = _getSelectedColumns(cfg, preset, true),
            moveColumns = cfg.moveColumns;
         var
            preparingItems = [],
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
               if (moveColumns) {
                  selectable.items.push(colData)
               }
               else {
                  // При отключенном перемещении необходимо сформировать рекордсет с собственной моделью.
                  // Подготавливаем для него исходные данные.
                  preparingItems.push(colData);
               }
               if (selectedColumns.indexOf(columnId) !== -1) {
                  selectable.markedKeys.push(columnId);
               }
               var group = column.get('group') || null;
               if (groups.indexOf(group) === -1) {
                  groups.push(group);
               }
            }
         });
         if (moveColumns) {
            // При включенном перемещении сортируем записи, согласно переданному состоянию массива отмеченных записей
            selectable.items.sort(function (el1, el2) {
               var
                  idx1 = selectedColumns.indexOf(el1.id),
                  idx2 = selectedColumns.indexOf(el2.id);
               if (idx1 !== -1) {
                  return idx2 !== -1 ? idx1 - idx2 : -1;
               }
               return idx2 !== -1 ? 1 : -1;
            });
         }
         else {
            // При отключенном перемещении будем использовать рекордсет с собственной моделью
            // для осуществления автосортировки отмеченных записей
            selectable.items = new RecordSet({
               rawData: preparingItems,
               idProperty: 'id',
               model: AreaSelectableModel
            });
            _applySelectedToItems(selectable.markedKeys, selectable.items);
         }
         groups.sort();
         cfg._optsFixed = fixed;
         cfg._optsSelectable = selectable;
         cfg._groups = 1 < groups.length || (groups.length && groups[0] != null) ? groups : null;
      };

      var _applySelectedToItems = function (selectedArray, items) {
         selectedArray.forEach(function (id) {
            items.getRecordById(id).set('selected', true);
         });
      };

      var _getItemsSortMethod = function () {
         return new ComputeFunctor(function (el1, el2) {
            // Смещаем отмеченные элементы в начало списка (учитывая их начальный index)
            if (el1.collectionItem.get('selected')) {
               if (el2.collectionItem.get('selected')) {
                  return el1.index - el2.index;
               }
               return -1;
            }
            if (el2.collectionItem.get('selected')) {
               return 1;
            }
            return el1.index - el2.index;
         }, ['selected']);
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
         self._presetDropdown = _getChildComponent(self._presetView, self._childNames.presetDropdown);
         self.subscribeTo(self._presetDropdown, 'onChange', function (evtName, selectedPresetId) {
            _onPresetDropdownChanged(self);
         });
      };

      var _onPresetDropdownChanged = function (self) {
         _getPresets(self).addCallback(function (presets) {
            self._currentPreset = _getPreset(presets, self._presetDropdown.getSelectedPresetId());
            _updatePresetView(self);
            var cfg = self._options;
            var selectedIds = _getSelectedColumns(cfg, self._currentPreset, false);
            var selectedColumns = [];
            cfg.columns.each(function (record) {
               var column = record.getId();
               if (!record.get('fixed') && selectedIds.indexOf(column) !== -1) {
                  selectedColumns.push(column);
               }
            });
            self._selectableView.setSelectedKeys(selectedColumns);
         });
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
               self._presetView.beginEdit(itemModel, false);
               break;
            case 'clone':
            case 'delete':
               _modifyPresets(self, action);
               _updatePresetView(self);
               break;
         }
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
               preset.title = arg;
               PresetCache.update(namespace, preset);
               break;

            case 'clone':
               var newPreset = PresetCache.create(namespace, {
                  title: self._options.newPresetTitle,// TODO: Возможно, лучше сделать старый заголовок с цифрой в конце - self._options.useNumberedTitle
                  selectedColumns: preset.selectedColumns.slice()
               });
               self._presetDropdown.setSelectedPresetId(newPreset.id);
               self._currentPreset = newPreset;
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

      var _onItemClick = function (e, id) {
         this.toggleItemsSelection([id]);
      };

      var _onSelectedItemsChange = function (e, ids, changes) {
         var items = this.getItems();
         changes.added.forEach(function (id) {
            items.getRecordById(id).set('selected', true);
         });
         changes.removed.forEach(function (id) {
            items.getRecordById(id).set('selected', false);
         });
      };



      return Area;
   }
);
