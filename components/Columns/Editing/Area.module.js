/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.Columns.Editing.Area',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.Columns.Editing.Area/templates/Model',
      'js!SBIS3.CONTROLS.ItemsMoveController',
      'Core/CommandDispatcher',
      'WS.Data/Functor/Compute',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS.Columns.Editing.Area',
      'tmpl!SBIS3.CONTROLS.Columns.Editing.Area/templates/preset',
      'tmpl!SBIS3.CONTROLS.Columns.Editing.Area/templates/presetEdit',
      'tmpl!SBIS3.CONTROLS.Columns.Editing.Area/templates/selectableGroupContent',
      'tmpl!SBIS3.CONTROLS.Columns.Editing.Area/templates/selectableItemContent',
      'css!SBIS3.CONTROLS.Columns.Editing.Area',
      'js!SBIS3.CONTROLS.Button',
      'js!SBIS3.CONTROLS.ListView',
      'js!SBIS3.CONTROLS.CheckBoxGroup',
      'js!SBIS3.CONTROLS.ScrollContainer'
   ],

   function (CompoundControl, AreaSelectableModel, ItemsMoveController, CommandDispatcher, ComputeFunctor, RecordSet, dotTplFn) {
      'use strict';

      /**
       * Класс контрола "Редактор колонок".
       *
       * @author Авраменко Алексей Сергеевич
       * @class SBIS3.CONTROLS.Columns.Editing.Area
       * @public
       * @extends SBIS3.CONTROLS.CompoundControl
       */
      var Area = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Columns.Editing.Area.prototype */ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               title: '',
               applyButtonTitle: rk('Применить'),
               columns: undefined,
               selectedColumns: [],
               moveColumns: true,
               usePresets: true,
               groupField: ''
            },
            _presetView: undefined,
            _fixedView: undefined,
            _selectableView: undefined
         },

         _modifyOptions: function () {
            var cfg = Area.superclass._modifyOptions.apply(this, arguments);
            cfg._optsPreset = {
               items: _makePresetItems(cfg._getPresets(), cfg._getSelectedPreset())
            };
            _prepareChildItemsAndGroups(cfg);
            _prepareGroupCollapsing(cfg);
            cfg.hasGroups = !!cfg._groups && 0 < cfg._groups.length;
            //////////////////////////////////////////////////
            console.log('DBG: CE_Area._modifyOptions: cfg.hasGroups=', cfg.hasGroups, '; cfg._groups=', cfg._groups, '; cfg._optsSelectable.items=', cfg._optsSelectable.items, ';');
            //////////////////////////////////////////////////
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
            this._publish('onComplete'/*^^^'onSelectedColumnsChange'*/);
         },

         init: function () {
            Area.superclass.init.apply(this, arguments);
            this._presetView = _getChildComponent(this, 'controls-Columns-Editing-Area__Preset');
            this._fixedView = this.getChildControlByName('controls-Columns-Editing-Area__FixedList');
            this._selectableView = this.getChildControlByName('controls-Columns-Editing-Area__SelectableList');

            if (this._presetView) {
               if (this._presetView.isInitialized()) {
                  _updatePresetView(this, true);
               }
               else {
                  this.subscribeOnceTo(this._presetView, 'onInit', _updatePresetView.bind(null, this, true));
               }

               //^^^this._presetView.setItemsHover(false);
               //^^^this.subscribeTo(this._presetView, 'onChangeHoveredItem', this._presetView.setItemsHover.bind(this._presetView, false));
               this._presetView.setItemsActions(_makeItemsActions(this));
               this.subscribeTo(this._presetView, 'onAfterBeginEdit', this._presetView.setItemsActions.bind(this._presetView, []));
               this.subscribeTo(this._presetView, 'onEndEdit', function (evtName, model, withSaving) {
                  if (withSaving) {
                     this.sendCommand('changePreset', model.get('title')).addCallback(function (isSuccess) {
                        if (!isSuccess) {
                           // TODO: Изменение не сохранено - откатится назад
                        }
                     });
                  }
               }.bind(this));
               this.subscribeTo(this._presetView, 'onAfterEndEdit', function (evtName, model, $target, withSaving) {
                  this._presetView.setItemsActions(_makeItemsActions(this));
               }.bind(this));
            }

            // В опциях могут быть указаны группы, которые нужно распахнуть при открытии
            _applyGroupCollapsing(this);
            if (this._options.moveColumns) {
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
               //^^^this._options.selectedColumns = selectedColumns;
               //^^^this._notifyOnPropertyChanged('selectedColumns');
               this._notify('onComplete'/*^^^'onSelectedColumnsChange'*/, selectedColumns, _collectExpandedGroups(this));
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

      var _getPresetValue = function (presets, selectedPreset, property) {
         return selectedPreset ? presets.getRecordById(selectedPreset).get(property) : null;
      };

      var _uniqueConcat = function (list1, list2) {
         return list1 && list1.length ? (list2 && list2.length ? list1.concat(list2).reduce(function (r, v) { if (r.indexOf(v) === -1) { r.push(v); }; return r; }, []) : list1) : (list2 && list2.length ? list2 : []);
      };

      var _getSelectedColumns = function (cfg) {
         return _uniqueConcat(_getPresetValue(cfg._getPresets(), cfg._getSelectedPreset(), 'selectedColumns'), cfg.selectedColumns);
      };

      var _prepareChildItemsAndGroups = function (cfg) {
         var
            groupField = cfg.groupField,
            columns = cfg.columns,
            selectedColumns = _getSelectedColumns(cfg),
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
               var group = column.get(groupField) || null;
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

      var _prepareGroupCollapsing = function (cfg) {
         var groups = cfg._groups;
         if (groups && groups.length) {
            var expandedGroups = _uniqueConcat(_getPresetValue(cfg._getPresets(), cfg._getSelectedPreset(), 'expandedGroups'), cfg.expandedGroups);
            var groupCollapsing = {};
            var has = !!(expandedGroups && expandedGroups.length);
            for (var i = 0; i < groups.length; i++) {
               var g = groups[i];
               groupCollapsing[g] = has ? expandedGroups.indexOf(g) === -1 : i !== 0;
            }
            cfg._groupCollapsing = groupCollapsing;
         }
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

      var _makePresetItems = function (presets, selectedPreset) {
         //////////////////////////////////////////////////
         console.log('DBG: CE_Area._makePresetItems: selectedPreset=', selectedPreset, '; presets=', presets, ';');
         //////////////////////////////////////////////////
         var recordset = new RecordSet({idProperty:'title'});
         if (selectedPreset) {
            recordset.add(presets.getRecordById(selectedPreset));
         }
         return recordset;
      };



      var _getChildComponent = function (self, name) {
         if (self.hasChildControlByName(name)) {
            return self.getChildControlByName(name);
         }
      };

      var _updatePresetView = function (self, dontSet) {
         if (!dontSet) {
            self._presetView.setItems(_makePresetItems(self._options._getPresets(), self._options._getSelectedPreset()));
         }
         var dropdown = _getChildComponent(self._presetView, 'controls-controls-Columns-Editing-Area__Preset-item-title');
         if (dropdown) {
            self.subscribeTo(dropdown, 'onSelectedItemsChange', function (evtName, selected, changes) {
               self.sendCommand('selectPreset', selected[0]);
               _updatePresetView(self);
               var cfg = self._options;
               var allSelected = _getSelectedColumns(cfg);
               var selectedColumns = [];
               cfg.columns.each(function (record) {
                  var column = record.getId();
                  if (!record.get('fixed') && allSelected.indexOf(column) !== -1) {
                     selectedColumns.push(column);
                  }
               });
               self._selectableView.setSelectedKeys(selectedColumns);
               _prepareGroupCollapsing(cfg);
               _applyGroupCollapsing(self);
            });
         }
      };

      var _makeItemsActions = function (self) {
         return [
            {name:'edit', title:rk('Редактировать'), icon:'sprite:icon-16 icon-Edit icon-primary action-hover'},
            {name:'clone', title:rk('Дублировать'), icon:'sprite:icon-16 icon-Copy icon-primary action-hover'},
            {name:'delete', title:rk('Удалить'), icon:'sprite:icon-16 icon-Erase icon-error'}
         ].map(function (inf) {
            return {
               name: inf.name,
               icon: inf.icon,
               caption: inf.title,
               tooltip: inf.title,
               isMainAction: true,
               onActivated: function ($item, itemId, itemModel, action) {
                  _applyPresetAction(self, action, itemModel);
               }
            };
         });
      };

      var _applyPresetAction = function (self, action, model) {
         switch (action) {
            case 'edit':
               self._presetView.beginEdit(model, false);
               break;
            case 'clone':
            case 'delete':
               var commands = {'clone':'clonePreset', 'delete':'deletePreset'};
               self.sendCommand(commands[action]).addCallback(function (isSuccess) {
                  if (!isSuccess) {
                     // TODO: Изменение не сохранено - откатится назад
                  }
               });
               _updatePresetView(self);
               break;
         }
      };

      var _applyGroupCollapsing = function (self) {
         var groupCollapsing = self._options._groupCollapsing;
         if (groupCollapsing) {
            for (var group in groupCollapsing) {
               self._selectableView[groupCollapsing[group] ? 'collapseGroup' : 'expandGroup'](group);
            }
         }
      };

      var _collectExpandedGroups = function (self) {
         var groups = self._options._groups;
         if (groups && groups.length) {
            var expandedGroups = [];
            var list = self._selectableView;
            for (var i = 0; i < groups.length; i++) {
               var g = groups[i];
               // В текущей реализации в SBIS3.CONTROLS.ItemsControlMixin нет публичного метода, позволяющего узнать состояние
               // распахнутости/свёрнутости групп, поэтому так. Но хорошо бы там расширить API !
               if (!list._isGroupCollapsed(g)) {
                  expandedGroups.push(g);
               }
            }
            return expandedGroups;
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
