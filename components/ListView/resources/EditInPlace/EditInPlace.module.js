/**
 * Created by as.avramenko on 01.04.2015.
 */

define('js!SBIS3.CONTROLS.EditInPlace',
   [
   "Core/Deferred",
   "js!SBIS3.CORE.CompoundControl",
   "html!SBIS3.CONTROLS.EditInPlace",
   "js!SBIS3.CONTROLS.CompoundFocusMixin",
   'js!WS.Data/Builder',
   "Core/core-instance",
   "Core/helpers/fast-control-helpers"
],
   function(Deferred, Control, dotTplFn, CompoundFocusMixin, DataBuilder, cInstance, fcHelpers) {
      'use strict';

      /**
       * @class SBIS3.CONTROLS.EditInPlace
       * @extends SBIS3.CORE.CompoundControl
       * @control
       * @public
       */

      var
         CONTEXT_RECORD_FIELD = 'sbis3-controls-edit-in-place',
         EditInPlace = Control.extend([CompoundFocusMixin], /** @lends SBIS3.CONTROLS.EditInPlace.prototype */ {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  columns: [],
                  focusCatch: undefined,
                  editingTemplate: undefined,
                  applyOnFieldChange: true,
                  itemsContainer: undefined,
                  visible: false,
                  getEditorOffset: undefined
               },
               _model: undefined,
               _editing: false,
               _editors: [],
               _trackerInterval: undefined,
               _lastHeight: 0,
               _editingModel: undefined,
               _editingDeferred: undefined
            },
            init: function() {
               this._publish('onItemValueChanged', 'onChangeHeight', 'onBeginEdit', 'onEndEdit', 'onKeyPress');
               EditInPlace.superclass.init.apply(this, arguments);
               this._container.bind('keypress keydown', this._onKeyDown)
                              .bind('keyup', this._onKeyUp.bind(this));
               this.subscribe('onChildControlFocusOut', this._onChildControlFocusOut);
               this._editors = this.getContainer().find('.controls-editInPlace__editor');
            },

            _onChildControlFocusOut: function() {
               var
                   result,
                   difference,
                   loadingIndicator;
               // Будем стрелять событие только если запущено редактирование по месту. Это обусловлено тем, что при
               // клике вне области редактирования стрельнет событие onChildFocusOut в контроллере и редактирование начнет
               // завершаться. Завершение редактирования приведет к вызову метода EditInPlace.hide, в котором происходит
               // расфокусировка поля ввода и нельзя допустить изменения рекорда и стрельбы событием onItemValueChanged.
               if (this.isEdit()) {
                  difference = this._getRecordsDifference(); // Получаем разницу
                  if (difference.length) { //Если есть разница, то нотифицируем об этом в событии
                     result = this._notify('onItemValueChanged', difference, this._editingModel);
                     //Результат может быть деферредом (потребуется обработка на бизнес логике)
                     if (result instanceof Deferred) {
                        loadingIndicator = setTimeout(function () { //Если обработка изменения значения поля длится более 100мс, то показываем индикатор
                           fcHelpers.toggleIndicator(true);
                        }, 100);
                        this._editingDeferred = result.addBoth(function () {
                           clearTimeout(loadingIndicator);
                           this._previousModelState = this._cloneWithFormat(this._editingModel);
                           fcHelpers.toggleIndicator(false);
                        }.bind(this));
                     } else {
                        this._previousModelState = this._cloneWithFormat(this._editingModel);
                     }
                  }
               }
            },
            /**
             * TODO Сухоручкин, Авраменко, Мальцев. Функция используется для определения изменившихся полей, скорее всего она тут не нужна (это метод рекорда)
             * @private
             */
            _getRecordsDifference: function() {
               var
                   raw1, raw2,
                   result = [];
               if (cInstance.instanceOfModule(this._editingModel, 'WS.Data/Entity/Model')) {
                  this._editingModel.each(function(field, value) {
                     if (value != this._previousModelState.get(field)) {
                        result.push(field);
                     }
                  }, this);
               } else {
                  raw1 = this._editingModel.getRawData();
                  raw2 = this._previousModelState.getRawData();
                  for (var field in raw1) {
                     if (raw1.hasOwnProperty(field)) {
                        if (raw1[field] != raw2[field]) {
                           result.push(field);
                        }
                     }
                  }
               }
               return result;
            },
            _getElementToFocus: function() {
              return this._container; //Переопределяю метод getElementToFocus для того, чтобы не создавался fake focus div
            },
            _onKeyDown: function(e) {
               e.stopPropagation();
            },
            _onKeyUp: function(e) {
               this._notify('onKeyPress', e);
            },
            /**
             * Заполняем значениями отображаемую editInPlace область
             * @param model Model, из которого будут браться значения полей
             */
            setModel: function(model) {
               this._model = model;
               this._previousModelState = this._cloneWithFormat(model);
               this._editingModel = this._cloneWithFormat(model);
               this.getContext().setValue(CONTEXT_RECORD_FIELD, this._editingModel);
            },
            /**
             * Сохранить значения полей области редактирования по месту
             */
            acceptChanges: function() {
               this._deactivateActiveChildControl();
               return (this._editingDeferred || Deferred.success()).addCallback(function() {
                  this._model.merge(this._editingModel);
               }.bind(this))
            },
            show: function(model, itemProj) {
               this.setModel(model);
               this.getContainer().attr('data-id', model.getId());
               if (itemProj) {
                  this.getContainer().attr('data-hash', itemProj.getHash());
               }
               this.setOffset(model);
               EditInPlace.superclass.show.apply(this, arguments);
               this.updatePosition();
            },
            _beginTrackHeight: function() {
               this._lastHeight = 0;
               // Данный пересчет обязательно нужен, т.к. он синхронно пересчитывает высоту и в каллбеке beginEdit мы получаем элемент с правильной высотой
               this.recalculateHeight();
               this._trackerInterval = setInterval(this.recalculateHeight.bind(this), 50);
            },
            recalculateHeight: function() {
               var
                   newHeight = 0,
                   editorHeight;
               $.each(this._editors, function(id, editor) {
                  editorHeight = $(editor).outerHeight(true);
                  if (editorHeight > newHeight) {
                     newHeight = editorHeight;
                  }
               }.bind(this));
               if (this._lastHeight !== newHeight) {
                  this._lastHeight = newHeight;
                  this.getTarget().height(newHeight);
                  this.updatePosition();
                  this._notify('onChangeHeight', this._model);
               }
            },
            _endTrackHeight: function() {
               clearInterval(this._trackerInterval);
               //Сбросим установленное ранее значение высоты строки
               this.getTarget().height('');
            },
            hide: function() {
               EditInPlace.superclass.hide.apply(this, arguments);
               this.getContainer().removeAttr('data-id');
            },
            edit: function(model, itemProj, withoutActivateFirstControl) {
               if (!this.isVisible()) {
                  this.show(model, itemProj);
               }
               this._beginTrackHeight();
               this._editing = true;
               this.getTarget().addClass('controls-editInPlace__editing');
               if (!withoutActivateFirstControl && !this.hasActiveChildControl()) {
                  this.activateFirstControl();
               }
               this._notify('onBeginEdit');
            },
            isEdit: function() {
               return this._editing;
            },
            endEdit: function() {
               this.getContainer().removeAttr('data-id');
               this._endTrackHeight();
               this.getTarget().removeClass('controls-editInPlace__editing');
               this._editing = false;
               this.hide();
               this._deactivateActiveChildControl();
               //Возможен такой сценарий: начали добавление по месту, не заполнив данные, подтверждают добавление
               //и срабатывает валидация. Валидация помечает невалидные поля. После этого происходит отмена добавления,
               //и редакторы скрываются. При следующем начале добавления по месту редакторы будут показаны, как невалидные.
               //Так что сами принудительно очистим отметку валидации, при завершении редактирования/добавления.
               this.resetValidation();
               this._notify('onEndEdit');
            },
            setOffset: function(model) {
               var container = this.getContainer();
               if (this._options.getEditorOffset) {
                  if (!this._options.editingTemplate) {
                     container = container.children().get(this._options.ignoreFirstColumn ? 1 : 0);
                  }
                  $(container).find('.controls-editInPlace__editor').css('padding-left', this._options.getEditorOffset(model));
               }
            },
            updatePosition: function() {
               var editorTop = this.getTarget().position().top - this.getContainer().position().top;
               $.each(this._editors, function(id, editor) {
                  $(editor).css('top', editorTop);
               });
            },
            getEditingRecord: function() {
               return this._editingModel;
            },
            getOriginalRecord: function() {
               return this._model;
            },
            getTarget: function() {
               var id = this._model.getId();
               return this._options.itemsContainer.find('.js-controls-ListView__item[data-id="' + (id === undefined ? '' : id) + '"]:not(".controls-editInPlace")');
            },
            _deactivateActiveChildControl: function() {
               var activeChild = this.getActiveChildControl(undefined, true);
               activeChild && activeChild.setActive(false);
            },
            focusCatch: function(event) {
               if (typeof this._options.focusCatch === 'function') {
                  this._options.focusCatch(event);
               }
            },
            destroy: function() {
               this._container.unbind('keypress keydown keyup');
               EditInPlace.superclass.destroy.call(this);
            },
            //TODO: метод нужен для того, чтобы подогнать формат рекорда под формат рекордсета.
            //Выписана задача Мальцеву, который должен убрать этот метод отсюда, и предаставить механизм выполняющий необходимую задачу.
            //https://inside.tensor.ru/opendoc.html?guid=85d18197-2094-4797-b823-5406424881e5&description=
            _cloneWithFormat: function(record) {
               var
                  recordSet = this.getParent()._options.items,
                  format = record.getFormat(),
                  clone;
               if (!format.getCount() && recordSet && recordSet.getFormat().getCount()) {
                  format = recordSet.getFormat();
               }
               // Нужно передавать модель, чтобы опредлелять в клоне авторасчётные поля
               clone = DataBuilder.reduceTo(record, format, recordSet && recordSet.getModel());
               clone.setState(record.getState());
               return clone;
            }
         });

      return EditInPlace;
   });
