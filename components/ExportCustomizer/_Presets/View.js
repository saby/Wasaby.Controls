/**
 * Контрол "Выбор из предустановленных настроек настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_Presets/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Presets/View',
   [
      'Core/core-merge',
      'Core/Deferred',
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Utils/ItemNamer',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/View',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/item',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/footer',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Presets/View'
   ],

   function (cMerge, Deferred, cObjectIsEqual, CompoundControl, ItemNamer, RecordSet, Di, dotTplFn) {
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
         edit: {title:rk('Редактировать', 'НастройщикЭкспорта'), icon:'sprite:icon-16 icon-Edit icon-primary action-hover'},
         clone: {title:rk('Дублировать', 'НастройщикЭкспорта'), icon:'sprite:icon-16 icon-Copy icon-primary action-hover'},
         'delete': {title:rk('Удалить', 'НастройщикЭкспорта'), icon:'sprite:icon-16 icon-Erase icon-error'}
      };

      /**
       * Сообщение об ошибке при редактировании названия пресета
       * @protected
       * @type {string}
       */
      var _TITLE_ERROR = rk('Название шаблона не может быть пустым и должно отличаться от названий других шаблонов', 'НастройщикЭкспорта');



      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/_Presets/View.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок компонента
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {string} Надпись на кнопке добавления нового пресета
                */
               addNewTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Название нового пресета
                */
               newPresetTitle: rk('Новый шаблон', 'НастройщикЭкспорта'),
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
            // Текущий список привязки колонок в экспортируемом файле к полям данных
            _fieldIds: null,
            // Текущий uuid шаблона форматирования эксель-файла
            _fileUuid: null,
            // Контрол выбора пресета
            _selector: null,
            // Контрол редактирования пресета
            _editor: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            options._items = this._makeItems(options);
            this._checkSelectedId(options);
            return options;
         },

         $constructor: function () {
            this.getLinkedContext().setValue('editedTitle', '');
         },

         init: function () {
            View.superclass.init.apply(this, arguments);
            if (Di.isRegistered(_DI_STORAGE_NAME)) {
               this._storage = Di.resolve(_DI_STORAGE_NAME);
            }
            this._selector = this.getChildControlByName('controls-ExportCustomizer-Presets-View__selector');
            if (this._storage) {
               this._editor = this.getChildControlByName('controls-ExportCustomizer-Presets-View__editor');
               this._updateSelectorListOptions('handlers', {
                  onChangeHoveredItem: this._onHoverItem.bind(this)
               });
               this._updateSelectorListOptions('footerTpl', 'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/footer');
               this._updateSelectorListOptions('_footerHandler', this._onAdd.bind(this));
               this._storage.load(this._options.namespace).addCallback(function (presets) {
                  presets.forEach(function (v) { v.isStorable = true; });
                  this._customs = presets;
                  this._updateSelector();
               }.bind(this));
            }
            this._bindEvents();
         },

         _bindEvents: function () {
            this.subscribeTo(this._selector, 'onSelectedItemsChange', function (evtName, ids, changes) {
               var selectedId = ids[0];
               var preset = this._findPresetById(selectedId);
               this._selectPreset(preset);
               this._updateSelectorListOptions('selectedKey', selectedId);
            }.bind(this));

            var editor = this._editor;
            if (editor) {
               this.subscribeTo(editor, 'onApply', function (evtName) {
                  var options = this._options;
                  var preset = this._findPresetById(options.selectedId);
                  preset.title = editor.getText();
                  // TODO: Обособить метод сохранения с пересбором customs
                  this.save()/*this._storage.save(options.namespace, this._customs)*/.addCallback(function (/*isSuccess*/) {
                     /*if (isSuccess) {*/
                        this._switchEditor(false);
                        this._updateSelector();
                     /*}*/
                  }.bind(this));
               }.bind(this));

               this.subscribeTo(editor, 'onCancel', this._switchEditor.bind(this, false));
            }
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
         _checkSelectedId: function (options) {
            var selectedId = options.selectedId;
            var statics = options.statics;
            if (_findIndexById(statics, selectedId) === -1) {
               var customs = this._customs;
               var hasCustoms = !!(customs && customs.length);
               if (!hasCustoms || _findIndexById(customs, selectedId) === -1) {
                  options.selectedId = selectedId = statics && statics.length ? statics[0].id : (hasCustoms ? customs[0].id : undefined);
               }
            }
            return selectedId;
         },

         /**
          * Обработчик события - наведение курсора на элемент списочного контрола
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} item Объект, представляющий информацию об элемент списочного контрола
          */
         _onHoverItem: function (evtName, item) {
            var listView = evtName.getTarget();
            var model = item.record;
            if (model) {
               this._updateItemsActions(listView, this._makeItemsActions(listView, model.get('isStorable')));
            }
         },

         /**
          * Обновить список доступных действий пользователя у списочного контрола
          *
          * @protected
          * @param {object} listView Списочный контрол
          * @param {Array<object>} actions Список объектов, описывающих действия пользователя
          */
         _updateItemsActions: function (listView, actions) {
            var itemsActionsGroup = listView.getItemsActions();
            if (itemsActionsGroup) {
               itemsActionsGroup.setItems(actions);
            }
            else {
               listView.setItemsActions(actions);
            }
         },

         /**
          * Обработчик события - нажатие кнопки добавления нового элемента списочного контрола
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          */
         _onAdd: function (evtName) {
            var listView = evtName.getTarget().getParent();
            this._addPreset().addCallback(function (isSuccess) {
               if (isSuccess) {
                  this._updateListView(listView);
               }
               this._startEditingMode(listView);
            }.bind(this));
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
            var method = {
               'clone': '_clonePreset',
               'edit': '_editPreset',
               'delete': '_deletePreset'
            }[action];
            var promise = this[method](id, listView);
            if (promise) {
               var callbacks = {
                  'clone': function (isSuccess) {
                     if (isSuccess) {
                        this._updateListView(listView);
                     }
                     this._startEditingMode(listView);
                  }.bind(this),
                  'delete': _ifSuccess(this._updateListView.bind(this, listView))
               };
               promise.addCallback(callbacks[action]);
            }
         },

         /**
          * Обновить списочный контрол после изменений
          *
          * @protected
          * @param {object} listView Списочный контрол
          * @param {bolean} isSuccess Сохранение изменений прошло успешно
          */
         _updateListView: function (listView) {
            this._updateSelector();
            var options = this._options;
            listView.setItems(options._items);
            listView.setSelectedKey(options.selectedId);
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
          * Создать новый пресет
          *
          * @protected
          * @return {Core/Deferred}
          */
         _addPreset: function () {
            var options = this._options;
            var customs = this._customs;
            var preset = {
               id: _makeId(),
               title: ItemNamer.make(options.newPresetTitle, [{list:options.statics, property:'title'}, {list:customs, property:'title'}]),
               fieldIds: [],
               fileUuid: null,
               isStorable: true
            };
            customs.push(preset);
            return this._storage.save(options.namespace, customs).addCallback(function (/*isSuccess*/) {
               //if (isSuccess) {
                  this._selectPreset(preset);
               //}
               return true/*isSuccess*/;
            }.bind(this));
         },

         /**
          * Клонировать пресет
          *
          * @protected
          * @param {string|number} id Идентификатор пресета
          * @return {Core/Deferred}
          */
         _clonePreset: function (id) {
            var options = this._options;
            var presetInfo = this._findPresetById(id, true);
            if (presetInfo) {
               var customs = this._customs;
               var preset = cMerge({}, presetInfo.preset);
               preset.isStorable = true;
               preset.id = _makeId();
               preset.title = ItemNamer.make(preset.title, [{list:options.statics, property:'title'}, {list:customs, property:'title'}]);
               customs.splice(!presetInfo.isStorable ? 0 : presetInfo.index + 1, 0, preset);
               return this._storage.save(options.namespace, customs).addCallback(function (/*isSuccess*/) {
                  //if (isSuccess) {
                     this._selectPreset(preset);
                  //}
                  return true/*isSuccess*/;
               }.bind(this));
            }
            else {
               return Deferred.success(false);
            }
         },

         /**
          * Редактировать пресет
          *
          * @protected
          * @param {string|number} id Идентификатор пресета
          * @param {object} listView Списочный контрол
          */
         _editPreset: function (id, listView) {
            var preset = this._findPresetById(id);
            if (preset) {
               var options = this._options;
               if (options.selectedId !== id) {
                  this._selectPreset(preset);
                  this._updateListView(listView);
               }
               this._startEditingMode(listView);
            }
         },

         /**
          * Удалить пресет
          *
          * @protected
          * @param {string|number} id Идентификатор пресета
          * @return {Core/Deferred}
          */
         _deletePreset: function (id) {
            var customs = this._customs;
            var index = _findIndexById(customs, id);
            if (index !== -1) {
               var prevPreset = customs[index];
               customs.splice(index, 1);
               var options = this._options;
               return this._storage.save(options.namespace, customs).addCallback(function (/*isSuccess*/) {
                  //if (isSuccess) {
                     if (options.selectedId === id) {
                        var preset = customs.length ? customs[index < customs.length ? index : index - 1] : null;
                        this._selectPreset(preset, prevPreset);
                     }
                  //}
                  return true/*isSuccess*/;
               }.bind(this));
            }
            else {
               return Deferred.success(false);
            }
         },

         /**
          * Включить моду редактирования
          *
          * @protected
          * @param {object} listView Списочный контрол
          */
         _startEditingMode: function (listView) {
            var options = this._options;
            var preset = this._findPresetById(options.selectedId);
            if (preset && preset.isStorable) {
               var picker = listView.getParent();
               picker.close();
               this._switchEditor(true);
               var editor = this._editor;
               this.getLinkedContext().setValue('editedTitle', preset.title);
               editor._clickHandler();
               var titles = []; options._items.each(function (v) { if (v.getId() !== preset.id) { titles.push(v.get('title')); } });
               editor.setValidators([{
                  option: 'text',
                  validator: function (list, value) {
                     if (value) {
                        var v = value.trim();
                        return !!v && list.indexOf(v) === -1;
                     }
                  }.bind(null, titles),
                  errorMessage: _TITLE_ERROR
               }]);
            }
         },

         /**
          * Переключить видимость редактора
          *
          * @protected
          * @param {boolean} isVisible Редактор будет показывться
          */
         _switchEditor: function (isVisible) {
            this._selector.setVisible(!isVisible);
            this._editor.setVisible(!!isVisible);
         },

         /**
          * Установить пресет в качестве выбранного
          *
          * @protected
          * @param {ExportPreset} preset Новый выбранный пресет
          * @param {ExportPreset} [previous] Предыдущий выбранный пресет (опционально, на случай, когда невозможно его определить, например при удалении)
          */
         _selectPreset: function (preset, previous) {
            var options = this._options;
            if (previous === undefined) {
               var selectedId = options.selectedId;
               previous = selectedId ? this._findPresetById(selectedId) : null;
            }
            options.selectedId = preset ? preset.id : null;
            this._fieldIds = preset ? preset.fieldIds : null;
            this._fileUuid = preset ? preset.fileUuid : null;
            this._sendUpdateCommand(previous, preset);
         },

         /**
          * Послать команду об обновлении, если это актуально
          *
          * @protected
          * @param {ExportPreset} previous Предыдущий выбранный пресет
          * @param {ExportPreset} current Текущий выбранный пресет
          */
         _sendUpdateCommand: function (previous, current) {
            if (!previous || !current || !cObjectIsEqual(previous.fieldIds, current.fieldIds) || previous.fileUuid !== current.fileUuid) {
               this.sendCommand('subviewChanged');
            }
         },

         /**
          * Найти пресет по его идентификатору
          *
          * @protected
          * @param {string|number} id Идентификатор пресета
          * @param {boolean} extendedResult Вернуть результат в расширенном виде
          * @return {ExportPreset|object}
          */
         _findPresetById: function (id, extendedResult) {
            var statics = this._options.statics;
            var index = _findIndexById(statics, id);
            if (index !== -1) {
               return extendedResult ? {preset:statics[index], index:index} : statics[index];
            }
            var customs = this._customs;
            index = _findIndexById(customs, id);
            if (index !== -1) {
               return extendedResult ? {preset:customs[index], index:index, isStorable:true} : customs[index];
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
            var selectedId = this._checkSelectedId(options);
            selector.setSelectedKeys([selectedId]);
            this._updateSelectorListOptions('selectedKey', selectedId);
         },

         /**
          * Сохранить текущий пресет, если это возможно и необходимо
          *
          * @public
          * return {Core/Deferred}
          */
         save: function () {
            if (this._storage) {
               var fieldIds = this._fieldIds;
               var fileUuid = this._fileUuid;
               if (fieldIds && fieldIds.length && fileUuid) {
                  var options = this._options;
                  var customs = this._customs;
                  var selectedId = options.selectedId;
                  var preset; customs.some(function (v) { if (v.id === selectedId) { preset = v; return true; } });
                  if (preset) {
                     var need;
                     if (!cObjectIsEqual(preset.fieldIds, fieldIds)) {
                        preset.fieldIds = fieldIds;
                        need = true;
                     }
                     if (preset.fileUuid !== fileUuid) {
                        preset._fileUuid = fileUuid;
                        need = true;
                     }
                     if (need) {
                        return this._storage.save(options.namespace, customs);
                     }
                  }
               }
            }
            return Deferred.success(null);
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
            if (values.fieldIds && !cObjectIsEqual(values.fieldIds, this._fieldIds)) {
               this._fieldIds = values.fieldIds;
            }
            if (values.fileUuid && values.fileUuid !== this._fileUuid) {
               this._fileUuid = values.fileUuid;
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportPresetsResult}
          */
         getValues: function () {
            var selectedId = this._options.selectedId;
            if (selectedId) {
               var current = this._findPresetById(selectedId);
               return {
                  fieldIds: current.fieldIds,
                  fileUuid: current.fileUuid
               };
            }
            return {};
         }
      });



      // Private methods:

      /**
       * Обернуть указанную функцию новой, которая будет вызывать исходную только при значении аргумента эквивалентном true
       *
       * @private
       * @param {function} func Оборачиваемая функция
       * @return {function}
       */
      var _ifSuccess = function (func) {
         return function (isSuccess) { if (isSuccess) { func.call(); } };
      };

      /**
       * Найти индекс элемента массива по его идентификатору
       *
       * @private
       * @param {Array<object>} list Массив объектов (имеющих свойство "id")
       * @param {string|number} id Идентификатор элемента
       * @return {number}
       */
      var _findIndexById = function (list, id) {
         if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
               var o = list[i];
               if (o.id === id) {
                  return i;
               }
            }
         }
         return -1;
      };

      /**
       * Создать новый идентификатору
       *
       * @private
       * @return {string}
       */
      var _makeId = function () {
         return _uniqueHex(32);
      };

      /**
       * Сгенерировать случайную hex-строку указанной длины
       * @protected
       * @param {number} n Длина строки
       * @return {string}
       */
      var _uniqueHex = function(n){var l=[];for(var i=0;i<n;i++){l[i]=Math.round(15*Math.random()).toString(16)}return l.join('')};



      return View;
   }
);
