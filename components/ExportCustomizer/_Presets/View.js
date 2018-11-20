/**
 * Контрол "Выбор из предустановленных настроек настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_Presets/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Presets/View',
   [
      'Core/CommandDispatcher',
      'Core/Deferred',
      'Core/helpers/createGUID',
      'Core/helpers/Object/isEqual',
      'Core/RightsManager',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/ExportCustomizer/Utils/CollectionSelectByIds',
      'SBIS3.CONTROLS/Utils/ItemNamer',
      'SBIS3.CONTROLS/Utils/ObjectChange',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/View',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/item',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/footer',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Presets/View',

      'i18n!SBIS3.CONTROLS/ExportCustomizer/_Presets/View'
   ],

   function (CommandDispatcher, Deferred, createGUID, cObjectIsEqual, RightsManager, CompoundControl, collectionSelectByIds, ItemNamer, objectChange, RecordSet, Di, dotTplFn) {
      'use strict';

      /**
       * @typedef {object} ExportPreset Тип, содержащий информацию о предустановленных настройках экспорта
       * @property {string|number} id Идентификатор пресета
       * @property {string} title Отображаемое название пресета
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {Array<string>} [lastTitles] Список последних известных отображаемых названий полей данных, служит для контроля изменений. Используется только с пользовательскими пресетами (опционально)
       * @property {string} fileUuid Uuid стилевого эксель-файла
       */

      /**
       * @typedef {object} ExportPresetsResult Тип, описывающий возвращаемые настраиваемые значения компонента
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid стилевого эксель-файла
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
                * @cfg {Array<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} Список объектов с информацией о всех колонках в формате, используемом в браузере
                */
               allFields: null,
               /**
                * @cfg {Array<ExportPreset>} Список неизменяемых пресетов
                */
               statics: null,
               /**
                * @cfg {string} Пространство имён для сохранения пользовательских пресетов
                */
               namespace: null,
               /**
                * @cfg {string} Зона доступа пользовательских пресетов (опционально)
                */
               accessZone: null,
               /**
                * @cfg {string|number} Идентификатор выбранного пресета. Если будет указан пустое значение (null или пустая строка), то это будет воспринято как указание создать новый пустой пресет и выбрать его. Если значение не будет указано вовсе (или будет указано значение undefined), то это будет воспринято как указание выбрать пресет, который был выбран в прошлый раз (опционально)
                */
               selectedId: undefined,
               /**
                * @cfg {string} Имя объекта истории (опционально)
                */
               historyTarget: null
            },
            // Объект, предоставляющий методы загрузки и сохранения пользовательских пресетов
            _storage: null,
            // Список пользовательских пресетов
            _customs: null,
            // Текущий список привязки колонок в экспортируемом файле к полям данных
            _fieldIds: null,
            // Транзакционный uuid текущего стилевого эксель-файла (изменяемого)
            _fileUuid: null,
            // Контрол выбора пресета
            _selector: null,
            // Контрол редактирования пресета
            _editor: null,
            // Кнопка удаления пресета
            _delete: null,
            // Кнопка просмотра истории изменений
            _history: null,
            // Идетификатор предыдущего выбранного пресета
            _previousId: null,
            // Компонент находится в моде редактирования
            _isEditMode: null,
            // Нужно добавить новый пресет после первичной загрузки
            _needNewPreset: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            var accessZone = options.accessZone;
            options._canChange = !accessZone || !!(RightsManager.getRights([accessZone])[accessZone] & RightsManager.WRITE_MASK);
            options._items = this._makeItems(options);
            var selectedId = options.selectedId;
            if (selectedId === undefined) {
               options.selectedId = selectedId = this._getStoredSelectedId(options);
            }
            if (selectedId || selectedId === undefined) {
               if (!Di.isRegistered(_DI_STORAGE_NAME)) {
                  this._checkSelectedId(options);
               }
            }
            else
            if (options._canChange) {
               this._needNewPreset = true;
            }
            return options;
         },

         $constructor: function () {
            var options = this._options;
            if (options._canChange) {
               this.getLinkedContext().setValue('editedTitle', '');
               CommandDispatcher.declareCommand(this, 'delete', function () {
                  this._deletePreset(options.selectedId)
                     .addCallback(_ifSuccess(this._updateSelector.bind(this)));
               }.bind(this));
            }
         },

         init: function () {
            View.superclass.init.apply(this, arguments);
            if (Di.isRegistered(_DI_STORAGE_NAME)) {
               this._storage = Di.resolve(_DI_STORAGE_NAME);
            }
            this._selector = this.getChildControlByName('controls-ExportCustomizer-Presets-View__selector');
            var options = this._options;
            if (this._storage && options._canChange) {
               this._editor = this.getChildControlByName('controls-ExportCustomizer-Presets-View__editor');

               this._updateSelectorListOptions('handlers', {
                  onChangeHoveredItem: this._onHoverItem.bind(this)
               });
               this._updateSelectorListOptions('footerTpl', 'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/footer');
               this._updateSelectorListOptions('_footerHandler', this._onAdd.bind(this));
               this._delete = this.getChildControlByName('controls-ExportCustomizer-Presets-View__delete');
            }
            var historyComponentName = 'controls-ExportCustomizer-Presets-View__history';
            if (this.hasChildControlByName(historyComponentName)) {
               this._history = this.getChildControlByName(historyComponentName);
            }
            this._bindEvents();
            if (this._storage) {
               this._loadCustoms().addCallback(function () {
                  var needNewPreset = this._needNewPreset;
                  if (needNewPreset) {
                     var newPreset = this._addPreset();
                     this.sendCommand('subviewChanged', 'create', newPreset);
                     this._startEditingMode();
                     this._needNewPreset = null;
                  }
                  this._updateSelector();
                  if (!needNewPreset) {
                     var preset = this._findPresetById(options.selectedId);
                     this.sendCommand('subviewChanged', 'select', preset);
                  }
               }.bind(this));
            }
            else {
               var preset = this._findPresetById(options.selectedId);
               this.sendCommand('subviewChanged', 'select', preset);
            }
         },

         _bindEvents: function () {
            this.subscribeTo(this._selector, 'onSelectedItemsChange', function (evtName, ids, changes) {
               var selectedId = ids[0];
               var preset = this._findPresetById(selectedId);
               this._selectPreset(preset, true);
               // Даже если fieldIds и fileUuid в предыдущем и текуущем пресетах не отличаются совсем - нужно бросить событие как указание сбросить все несохранённые изменения в других под-компонентах
               this.sendCommand('subviewChanged', 'select', preset, {isChanged:this._isOutdated(preset, true)});
               this._updateSelectorListOptions('selectedKey', selectedId);
            }.bind(this));

            var editor = this._editor;
            if (editor) {
               var options = this._options;
               this.subscribeTo(editor, 'onPropertyChanged', function (evtName, property) {
                  if (property === 'text') {
                     editor.clearMark();
                  }
               });

               this.subscribeTo(editor, 'onApply', function (evtName) {
                  var preset = this._findPresetById(options.selectedId);
                  var isClone = !!preset.patternUuid;
                  var isUpdate = preset.isStorable;// Клонирование - это не update. При клонировании пресет будет isUnreal а не isStorable
                  preset.title = editor.getText();
                  delete preset.isUnreal;
                  delete preset.patternUuid;
                  preset.isStorable = true;
                  this._previousId = null;
                  this.sendCommand('subviewChanged', 'editEnd', true, {id:preset.id, title:preset.title, action:isUpdate ? 'update' : 'create'}, isClone ? {isClone:isClone} : null).addCallback(function (result) {
                     //if (!this._fileUuid) {
                        this._fileUuid = result;
                     //}
                     this._saveSelectedPreset().addCallback(function (/*isSuccess*/) {
                        /*if (isSuccess) {*/
                           this._fileUuid = null;
                           this._endEditingMode();
                           this._updateSelector();
                        /*}*/
                     }.bind(this));
                  }.bind(this));
               }.bind(this));

               this.subscribeTo(editor, 'onCancel', function (evtName) {
                  var presetInfo = this._findPresetById(options.selectedId, true);
                  if (presetInfo) {
                     var preset = presetInfo.preset;
                     this._fileUuid = null;
                     this.sendCommand('subviewChanged', 'editEnd', false, null);
                     if (preset.isUnreal) {
                        this._customs.splice(presetInfo.index, 1);
                        var previousId = this._previousId;
                        var previous = previousId ? this._findPresetById(previousId) : null;
                        this._previousId = null;
                        var nextPreset = previous || this._getFirstPreset(options);
                        this._selectPreset(nextPreset);
                        if (!previous) {
                           this._updateSelector();
                        }
                        this.sendCommand('subviewChanged', 'select', nextPreset, {isChanged:this._isOutdated(nextPreset, true)});
                     }
                     else {
                        this._selectPreset(preset);
                        this.sendCommand('subviewChanged', 'select', preset, false);
                     }
                  }
                  this._endEditingMode();
               }.bind(this));
            }
         },

         /**
          * Переключить доступность компонента
          *
          * @protected
          * @param {boolean} isEnabled Указывает, будет ли компонент доступен
          */
         setEnabled: function (isEnabled) {
            var wasEnabled = this.isEnabled();
            View.superclass.setEnabled.call(this, isEnabled);
            if (isEnabled && !wasEnabled && this._isEditMode) {
               this._initEditor(this._findPresetById(this._options.selectedId));
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
            var customs = this._customs;
            if (customs && customs.length) {
               for (var i = 0; i < customs.length; i++) {
                  var preset = customs[i];
                  if (!preset.isUnreal) {
                     list.push(preset);
                  }
               }
            }
            var statics = options.statics;
            if (statics && statics.length) {
               list.push.apply(list, statics);
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
            if (!selectedId || _findIndexById(statics, selectedId) === -1) {
               var customs = this._customs;
               var hasCustoms = !!(customs && customs.length);
               if (!selectedId || !hasCustoms || _findIndexById(customs, selectedId) === -1) {
                  var first = this._getFirstPreset(options);
                  options.selectedId = selectedId = first ? first.id : undefined;
               }
            }
            return selectedId;
         },

         /**
          * Получить первый по порядку отображения пресет
          *
          * @protected
          * @param {object} options Опции компонента
          * @return {ExportPreset}
          */
         _getFirstPreset: function (options) {
            var customs = this._customs;
            if (customs && customs.length) {
               return customs[0];
            }
            var statics = options.statics;
            if (statics && statics.length) {
               return statics[0];
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
            var preset = this._addPreset();
            this.sendCommand('subviewChanged', 'create', preset);
            this._startEditingMode(listView);
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
            listView.setSelectedKey(this._options.selectedId);
            switch (action) {
               case 'clone':
                  var preset = this._clonePreset(id);
                  this.sendCommand('subviewChanged', 'clone', preset, {isChanged:this._isOutdated(preset, true)});
                  this._startEditingMode(listView);
                  break;
               case 'edit':
                  this._editPreset(id, listView);
                  break;
               case 'delete':
                  this._deletePreset(id)
                     .addCallback(_ifSuccess(this._updateListView.bind(this, listView)));
                  break;
            }
         },

         /**
          * Обновить списочный контрол после изменений
          *
          * @protected
          * @param {object} listView Списочный контрол
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
          * Добавить новый пресет
          *
          * @protected
          * @return {ExportPreset}
          */
         _addPreset: function () {
            var preset = this._createPreset();
            this._customs.push(preset);
            this._previousId = this._options.selectedId;
            this._selectPreset(preset, true);
            return preset;
         },

         /**
          * Клонировать пресет
          *
          * @protected
          * @param {string|number} id Идентификатор пресета
          * @param {boolean} preserveFileUuid Не сбрасывать текщий fileUuid
          * @return {ExportPreset}
          */
         _clonePreset: function (id, preserveFileUuid) {
            var presetInfo = this._findPresetById(id, true);
            if (presetInfo) {
               var pattern = presetInfo.preset;
               var preset = this._createPreset(pattern);
               var customs = this._customs;
               customs.splice(presetInfo.isStatic ? customs.length : presetInfo.index + 1, 0, preset);
               this._previousId = this._options.selectedId;
               this._selectPreset(preset, !preserveFileUuid);
               return preset;
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
                  this.sendCommand('subviewChanged', 'select', preset, {isChanged:this._isOutdated(preset, true)});
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
               return this._saveCustoms().addCallback(function (/*isSuccess*/) {
                  //if (isSuccess) {
                     if (this._options.selectedId === id) {
                        var preset;
                        if (customs.length) {
                           preset = customs[index < customs.length ? index : index - 1];
                        }
                        else {
                           var statics = this._options.statics;
                           if (statics && statics.length) {
                              preset = statics[0];
                           }
                        }
                        this._selectPreset(preset, true);
                        this.sendCommand('subviewChanged', 'select', preset, {isChanged:this._isOutdated(preset, true)});
                     }
                     this.sendCommand('subviewChanged', 'delete', prevPreset.fileUuid, {id:prevPreset.id, title:prevPreset.title, action:'delete'});
                  //}
                  return true/*isSuccess*/;
               }.bind(this));
            }
            else {
               return Deferred.success(false);
            }
         },

         /**
          * Создать новый экземпляр пресета. Если укащан pattern - скопировать с него
          *
          * @protected
          * @param {ExportPreset} pattern Образец для создания
          * @return {ExportPreset}
          */
         _createPreset: function (pattern) {
            var options = this._options;
            var preset = {
               id: createGUID(),
               title: ItemNamer.make(pattern ? pattern.title : options.newPresetTitle, [{list:options.statics, property:'title'}, {list:this._customs, property:'title'}]),
               fieldIds: pattern ? pattern.fieldIds.slice() : [],
               fileUuid: null,
               isStorable: false,
               isUnreal: true
            };
            if (pattern) {
               var fileUuid = pattern.fileUuid;
               if (fileUuid) {
                  preset.patternUuid = fileUuid;
               }
            }
            return preset;
         },

         /**
          * Включить моду редактирования
          *
          * @protected
          * @param {object} [listView] Списочный контрол (опционально)
          */
         _startEditingMode: function (listView) {
            var options = this._options;
            if (!this._isEditMode && options._canChange) {
               var preset = this._findPresetById(options.selectedId);
               if (preset && (preset.isStorable || preset.isUnreal)) {
                  if (listView) {
                     listView.sendCommand('close');
                  }
                  this._isEditMode = true;
                  this._switchActionButtons(false);
                  this._switchEditor();
                  if (this.isEnabled()) {
                     this._initEditor(preset);
                  }
                  this.sendCommand('subviewChanged', 'edit', preset);
               }
            }
         },

         /**
          * Инициализировать редактор
          *
          * @param {ExportPreset} preset Пресет
          * @protected
          */
         _initEditor: function (preset) {
            var editor = this._editor;
            this.getLinkedContext().setValue('editedTitle', preset.title);
            editor._clickHandler();
            var container = editor._cntrlPanel;
            (this._editorOkButton = container.find('.controls-EditAtPlace__okButton')).attr('title', rk('Сохранить шаблон', 'НастройщикЭкспорта'));
            container.find('.controls-EditAtPlace__cancel').attr('title', rk('Отменить изменения', 'НастройщикЭкспорта'));
            this._checkEditorOkButton();
            editor.setValidators([{
               option: 'text',
               validator: function (presetId, value) {
                  var reducer = function (r, v) { if (v.id !== presetId) { r.push(v.title); } return r; };
                  var list = [];
                  var statics = this._options.statics;
                  if (statics && statics.length) {
                     list = statics.reduce(reducer, list);
                  }
                  var customs = this._customs;
                  if (customs && customs.length) {
                     list = customs.reduce(reducer, list);
                  }
                  if (value) {
                     var v = value.trim();
                     return !!v && list.indexOf(v) === -1;
                  }
               }.bind(this, preset.id),
               errorMessage: _TITLE_ERROR
            }]);
            editor._origKeyPressHandler = editor._keyPressHandler;
            editor._setKeyPressHandler(function (evt) {
               if ((evt.key === 'Enter' || evt.keyCode == 13) && !this._canSave()) {
                  evt.preventDefault();
                  evt.stopImmediatePropagation();
                  return;
               }
               editor._origKeyPressHandler(evt);
            }.bind(this));
         },

         /**
          * Выключить моду редактирования
          *
          * @protected
          */
         _endEditingMode: function () {
            this._editorOkButton = null;
            this._isEditMode = false;
            var preset = this._findPresetById(this._options.selectedId);
            this._switchActionButtons(preset && preset.isStorable);
            this._switchEditor();
            var editor = this._editor;
            editor._setKeyPressHandler(editor._origKeyPressHandler);
            editor._origKeyPressHandler = null;
            this._editor.clearMark();
         },

         /**
          * Проверить можно ли сохранять текущий пресет
          *
          * @protected
          * @return {boolean}
          */
         _canSave: function () {
            var fieldIds = this._fieldIds;
            return !!(fieldIds && fieldIds.length);
         },

         /**
          * Проверить доступность кнопки сохранения редактора
          *
          * @protected
          */
         _checkEditorOkButton: function () {
            if (this._isEditMode) {
               var okButton = this._editorOkButton;
               if (okButton) {
                  okButton.toggleClass('ws-hidden', !this._canSave());
               }
            }
         },

         /**
          * Переключить видимость кнопок действий с текущим пресетом
          *
          * @protected
          * @param {boolean} isOn Показать или скрыть
          */
         _switchActionButtons: function (isOn) {
            var isVisible = isOn && !this._isEditMode;
            [this._delete, this._history].forEach(function (button) {
               if (button) {
                  button.setVisible(isVisible);
               }
            });
         },

         /**
          * Переключить видимость редактора
          *
          * @protected
          */
         _switchEditor: function () {
            var isEditing = this._isEditMode;
            this._selector.setVisible(!isEditing);
            this._editor.setVisible(isEditing);
         },

         /**
          * Установить пресет в качестве выбранного
          *
          * @protected
          * @param {ExportPreset} preset Новый выбранный пресет
          * @param {boolean} clearFileUuid Сбросить текущее значение свойства _fileUuid
          */
         _selectPreset: function (preset, clearFileUuid) {
            var options = this._options;
            options.selectedId = preset ? preset.id : null;
            this._fieldIds = preset ? preset.fieldIds.slice() : null;
            if (clearFileUuid) {
               this._fileUuid = null;
            }
            this._storeSelectedId(options);
            this._switchActionButtons(!!preset && preset.isStorable);
            this._checkEditorOkButton();
            var history = this._history;
            if (history) {
               var fileUuid = preset ? preset.fileUuid : null;
               var isEnabled = !!preset && preset.isStorable && !!fileUuid;
               history.setProperty('guid', isEnabled ? fileUuid : null);
               history.setVisible(isEnabled);
            }
         },

         /**
          * Сохранить идентификатор выбранного пресета для дальнейшего использования
          *
          * @protected
          * @param {object} options Опции компонента
          */
         _storeSelectedId: function (options) {
            var selectedId = options.selectedId;
            var key = options.namespace + 'preset';
            if (selectedId) {
               localStorage.setItem(key, selectedId);
            }
            else {
               localStorage.removeItem(key);
            }
         },

         /**
          * Получитиь сохранённый идентификатор выбранного пресета
          *
          * @protected
          * @param {object} options Опции компонента
          * @return {string}
          */
         _getStoredSelectedId: function (options) {
            return localStorage.getItem(options.namespace + 'preset');
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
               return extendedResult ? {preset:statics[index], index:index, isStatic:true} : statics[index];
            }
            var customs = this._customs;
            index = _findIndexById(customs, id);
            if (index !== -1) {
               return extendedResult ? {preset:customs[index], index:index} : customs[index];
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
            this._selector.getProperty('dictionaries')[0].componentOptions.scope[name] = value;
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
          * Определить, не устарели ли отображаемые названия полей в пресете. Актуально только для пользовательских пресетов
          *
          * @protected
          * @param {ExportPreset} preset Пресет
          * @param {boolean} updateAndSave Обновить и сохранить, если устарел
          * @return {boolean}
          */
         _isOutdated: function (preset, updateAndSave) {
            if (preset && preset.isStorable && !preset.isActual) {
               var actualTitles = collectionSelectByIds(this._options.allFields, preset.fieldIds, function (v) { return v.title; }) || [];
               var presetTitles = preset.lastTitles;
               var isOutdated = !presetTitles || (actualTitles.length !== presetTitles.length) || actualTitles.some(function (v, i) { return v !== presetTitles[i]; });
               if (isOutdated) {
                  if (updateAndSave) {
                     preset.lastTitles = actualTitles;
                     preset.isActual = true;
                     this._saveCustoms();
                  }
                  return true;
               }
            }
         },

         /**
          * Загрузить пользовательские пресеты
          *
          * @protected
          * @return {Core/Deferred}
          */
         _loadCustoms: function () {
            var options = this._options;
            return this._storage.load(options.namespace/*, options.accessZone*/).addCallback(function (presets) {
               this._customs = presets;
            }.bind(this));
         },

         /**
          * Сохранить пользовательские пресеты
          *
          * @protected
          * @return {Core/Deferred}
          */
         _saveCustoms: function () {
            var options = this._options;
            return options._canChange ? this._storage.save(options.namespace/*, options.accessZone*/, this._customs.filter(function (v) { return v.isStorable; })) : Deferred.success(false);
         },

         /**
          * Сохранить текущий пресет, если это возможно
          *
          * @protected
          * @return {Core/Deferred}
          */
         _saveSelectedPreset: function () {
            var preset = this._findPresetById(this._options.selectedId);
            if (preset && preset.isStorable) {
               var fieldIds = this._fieldIds || [];
               if (!cObjectIsEqual(preset.fieldIds, fieldIds)) {
                  preset.fieldIds = fieldIds.slice();
               }
               var fileUuid = this._fileUuid;
               if (fileUuid) {
                  preset.fileUuid = fileUuid;
               }
               return this._saveCustoms();
            }
            return Deferred.success(null);
         },

         /**
          * Сохранить данные компонента (вызывается перед закрытием после применения)
          *
          * @public
          * @return {Core/Deferred}
          */
         save: function () {
            return Deferred.success(null);
         },

         /**
          * Обнулить в текущем пресете указанный uuid стилевого эксель-файла (ввиду его отсутствия)
          *
          * @public
          * @param {string} fileUuid Uuid стилевого эксель-файла
          * @return {Core/Deferred}
          */
         nullifyUuid: function (fileUuid) {
            if (fileUuid) {
               var preset = this._findPresetById(this._options.selectedId);
               if (preset && preset.isStorable && preset.fileUuid === fileUuid) {
                  preset.fileUuid = null;
                  if (this._fileUuid === fileUuid) {
                     this._fileUuid = null;
                  }
                  return this._saveCustoms();
               }
            }
            return Deferred.success();
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          * @param {object} meta Дополнительная информация об изменении
          */
         restate: function (values, meta) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var changes = objectChange(this, values, {fieldIds:{target:'_fieldIds', asObject:true}, fileUuid:{target:'_fileUuid'}});
            var isFieldsChanged;
            if (meta.source === 'columnBinder') {
               isFieldsChanged = changes && 'fieldIds' in changes;
            }
            if (!this._isEditMode) {
               var isFormatterOpened;
               if (meta.source === 'formatter') {
                  isFormatterOpened = meta.reason === 'afterOpen';
               }
               if (isFieldsChanged || isFormatterOpened) {
                  var options = this._options;
                  var selectedId = options.selectedId;
                  if (selectedId) {
                     var pattern = this._findPresetById(selectedId);
                     if (pattern && !pattern.isStorable) {
                        var fieldIds = this._fieldIds;
                        var preset = this._clonePreset(pattern.id, isFormatterOpened);
                        if (isFieldsChanged) {
                           preset.fieldIds = fieldIds ? fieldIds.slice() : [];
                           this._fieldIds = fieldIds;
                        }
                        this.sendCommand('subviewChanged', 'clone', preset, {isChanged:isFieldsChanged || this._isOutdated(preset, true)});
                     }
                  }
                  this._startEditingMode();
               }
            }
            else {
               if (isFieldsChanged) {
                  this._checkEditorOkButton();
               }
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
                  fileUuid: this._fileUuid || null
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
               if (o.id ==/*Не ===*/ id) {
                  return i;
               }
            }
         }
         return -1;
      };



      return View;
   }
);
