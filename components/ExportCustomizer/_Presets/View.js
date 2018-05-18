/**
 * Контрол "Выбор из предустановленных настроек настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_Presets/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Presets/View',
   [
      'Core/Deferred',
      'SBIS3.CONTROLS/CompoundControl',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/View',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/item',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/footer',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Presets/View'
   ],

   function (Deferred, CompoundControl, RecordSet, Di, dotTplFn) {
      'use strict';

      /**
       * @typedef {object} ExportPreset Тип, содержащий информацию о предустановленных настройках экспорта
       * @property {string|number} id Идентификатор пресета
       * @property {string} title Отображаемое название пресета
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid шаблона форматирования эксель-файла
       */

      /**
       * @typedef {object} ExportPresetsResult Тип, описывающий возвращаемые настраиваемые значения компонента
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid шаблона форматирования эксель-файла
       */



      /**
       * Имя регистрации объекта, предоставляющего методы загрузки и сохранения пользовательских пресетов, в инжекторе зависимостей
       * @private
       * @type {string}
       */
      var _DI_STORAGE_NAME = 'ExportPresets.Loader';

      /**
       * Список доступных действий пользователя
       * @protected
       * @type {object[]}
       */
      var _ACTIONS = {
         clone: {title:rk('Дублировать', 'НастройщикЭкспорта'), icon:'sprite:icon-16 icon-Copy icon-primary action-hover'},
         edit: {title:rk('Редактировать', 'НастройщикЭкспорта'), icon:'sprite:icon-16 icon-Edit icon-primary action-hover'},
         'delete': {title:rk('Удалить', 'НастройщикЭкспорта'), icon:'sprite:icon-16 icon-Erase icon-error'}
      };


      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/_Presets/View.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок компонента
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {Array<ExportPreset>} Список неизменяемых пресетов
                */
               statics: null,
               /**
                * @cfg {string} Пространство имён для сохранения пользовательских пресетов
                */
               namespace: null,
               /**
                * @cfg {string|number} Идентификатор выбранного пресета
                */
               selectedId: null
            },
            // Объект, предоставляющий методы загрузки и сохранения пользовательских пресетов
            _storage: null,
            // Список пользовательских пресетов
            _customs: null,
            // Контрол выбора пресета
            _selector: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            options._items = this._makeItems(options);
            options._selectedId = this._makeSelectedId(options);
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            if (Di.isRegistered(_DI_STORAGE_NAME)) {
               this._storage = Di.resolve(_DI_STORAGE_NAME);
            }
            this._selector = this.getChildControlByName('controls-ExportCustomizer-Presets-View__button');
            this._bindEvents();
            if (this._storage) {
               this._updateSelectorListOptions('handlers', {
                  onChangeHoveredItem: this._onHoverItem.bind(this)
               });
               this._storage.load(this._options.namespace).addCallback(function (presets) {
                  presets.forEach(function (v) { v.isStorable = true; });
                  this._customs = presets;
                  this._updateSelector();
               }.bind(this));
            }
         },

         _bindEvents: function () {
            this.subscribeTo(this._selector, 'onSelectedItemsChange', function (evtName, ids, changes) {
               var selectedId = ids[0];
               this._options.selectedId = selectedId;
               this._updateSelectorListOptions('selectedKey', selectedId);
               this.sendCommand('subviewChanged');
            }.bind(this));
         },

         /**
          * Приготовить список элементов для списочного контрола
          *
          * @protected
          * @param {object} options Опции компонента
          * @return {Array<object>}
          */
         _makeItems: function (options) {
            var list = [];
            var statics = options.statics;
            if (statics && statics.length) {
               list.push.apply(list, statics);
            }
            var customs = this._customs;
            if (customs && customs.length) {
               list.push.apply(list, customs);
            }
            return !list.length ? null : new RecordSet({
               rawData: list,
               idProperty: 'id'
            });
         },

         /**
          * Приготовить идентификатор выбранного элемента для списочного контрола
          *
          * @protected
          * @param {object} options Опции компонента
          * @return {string|number}
          */
         _makeSelectedId: function (options) {
            var items = options._items;
            if (items && items.getCount()) {
               var selectedId = options.selectedId;
               return selectedId && items.getRecordById(selectedId) ? selectedId : items.at(0).getId();
            }
         },

         /**
          * Обработчик события - наведение курсора на элемент списочного контрола
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} item Объект, представляющий информацию об элемент списочного контрола
          */
         _onHoverItem: function (evtName, item) {
            var model = item.record;
            if (model) {
               var listView = evtName.getTarget();
               var actions = this._makeItemsActions(listView, model.get('isStorable'));
               var itemsActionsGroup = listView.getItemsActions();
               if (itemsActionsGroup) {
                  itemsActionsGroup.setItems(actions);
               }
               else {
                  listView.setItemsActions(actions);
               }
            }
         },

         /**
          * Обработчик события - нажатие на кнопку действия для элемента списочного контрола
          *
          * @protected
          * @param {object} listView Списочный контрол
          * @param {jQuery} itemContainer Контейнер элемента
          * @param {string} id Идентификатор пресета
          * @param {WS.Data/Entity/Model} model Модель пресета
          * @param {string} action Вид действия
          */
         _onItemAction: function (listView, itemContainer, id, model, action) {
            switch (action) {
               case 'clone':
                  this._clonePreset(id, listView);
                  break;
               case 'edit':
                  this._editPreset(id, listView);
                  break;
               case 'delete':
                  this._deletePreset(id, listView);
                  break;
            }
         },

         /**
          * Приготовить список доступных действий пользователя
          *
          * @protected
          * @param {object} listView Списочный контрол
          * @param {boolena} useAllActions Использовать все действия
          * @return {object[]}
          */
         _makeItemsActions: function (listView, useAllActions) {
            return (useAllActions ? Object.keys(_ACTIONS) : ['clone']).map(function (name) {
               var action = _ACTIONS[name];
               return {
                  name: name,
                  icon: action.icon,
                  caption: action.title,
                  tooltip: action.title,
                  isMainAction: true,
                  onActivated: this._onItemAction.bind(this, listView)
               };
            }.bind(this));
         },

         /**
          * Клонировать пресет
          *
          * @protected
          * @param {string|number} id Идентификатор пресета
          * @param {object} listView Списочный контрол
          * @return {Core/Deferred}
          */
         _clonePreset: function (id, listView) {
         },

         /**
          * Редактировать пресет
          *
          * @protected
          * @param {string|number} id Идентификатор пресета
          * @param {object} listView Списочный контрол
          * @return {Core/Deferred}
          */
         _editPreset: function (id, listView) {
         },

         /**
          * Удалить пресет
          *
          * @protected
          * @param {string|number} id Идентификатор пресета
          * @param {object} listView Списочный контрол
          * @return {Core/Deferred}
          */
         _deletePreset: function (id, listView) {
            var customs = this._customs;
            var index;
            var done;
            if (customs && customs.length) {
               for (var i = 0; i < customs.length; i++) {
                  var unit = customs[i];
                  if (unit.id === id) {
                     if (unit.isStorable) {
                        customs.splice(i, 1);
                        index = i;
                        done = true;
                     }
                     break;
                  }
               }
            }
            if (done) {
               var options = this._options;
               return this._storage.save(options.namespace, customs).addCallback(function (/*isSuccess*/) {
                  //if (isSuccess) {
                     if (options.selectedId === id) {
                        options.selectedId = customs.length ? customs[index < customs.length ? index : index - 1].id : null;
                        //this.sendCommand('subviewChanged');
                     }
                     this._updateSelector();
                     listView.setItems(options._items);
                     listView.setSelectedKey(options._selectedId);
                     listView.redraw();
                  //}
                  return true/*isSuccess*/;
               }.bind(this));
            }
            else {
               return Deferred.success(false);
            }
         },

         /**
          * Обновить опцию списочного контрола внутри селектора
          *
          * @protected
          * @param {string} name Имя опции
          * @param {*} value Значение опции
          */
         _updateSelectorListOptions: function (name, value) {
            this._selector.getProperty('dictionaries')[0].componentOptions[name] = value;
         },

         /**
          * Обновить данные селектора
          *
          * @protected
          */
         _updateSelector: function () {
            var options = this._options;
            var selector = this._selector;
            var items = options._items = this._makeItems(options);
            selector.setItems(items);
            this._updateSelectorListOptions('items', items);
            var selectedId = this._makeSelectedId(options);
            options._selectedId = selectedId;
            selector.setSelectedKeys([selectedId]);
            this._updateSelectorListOptions('selectedKey', selectedId);
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var options = this._options;
            /*^^^var waited = {xxx:true, yyy:false};
            var has = {};
            for (var name in values) {
               if (name in waited) {
                  var value = values[name];
                  if (waited[name] ? !cObjectIsEqual(value, options[name]) : value !== options[name]) {
                     has[name] = true;
                     options[name] = value;
                  }
               }
            }
            if (has.xxx) {
            }
            else
            if (has.yyy) {
            }*/
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportPresetsResult}
          */
         getValues: function () {
            var options = this._options;
            var items = options._items;
            var selectedId = options.selectedId;
            if (selectedId && items) {
               var current = items.getRecordById(selectedId).getRawData();
               return {
                  fieldIds: current.fieldIds,
                  fileUuid: current.fileUuid
               };
            }
            return {};
         }
      });

      return View;
   }
);
