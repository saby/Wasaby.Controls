/**
 * Created by as.avramenko on 01.04.2015.
 */

define('SBIS3.CONTROLS/ListView/resources/EditInPlace/EditInPlace',
   [
   "Core/Deferred",
   "Lib/Control/CompoundControl/CompoundControl",
   "tmpl!SBIS3.CONTROLS/ListView/resources/EditInPlace/EditInPlace",
   "Core/constants",
   "SBIS3.CONTROLS/Mixins/CompoundFocusMixin",
   "Core/Indicator",
   'Core/CommandDispatcher',
   'css!SBIS3.CONTROLS/ListView/resources/EditInPlace/EditInPlace'
],
   function(Deferred, Control, dotTplFn, constants, CompoundFocusMixin, Indicator, CommandDispatcher) {
      'use strict';

      /**
       * @class SBIS3.CONTROLS/ListView/resources/EditInPlace/EditInPlace
       * @extends Lib/Control/CompoundControl/CompoundControl
       * @author Авраменко А.С.
       * @control
       * @public
       */

      var
         CONTEXT_RECORD_FIELD = 'sbis3-controls-edit-in-place',
         EditInPlace = Control.extend([CompoundFocusMixin], /** @lends SBIS3.CONTROLS/ListView/resources/EditInPlace/EditInPlace.prototype */ {
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
               _lastHeight: 0,
               _lastWidth: 0,
               _lastVerticalPosition: 0,
               _lastHorizontalPosition: 0,
               _editingModel: undefined,
               _editingDeferred: undefined,
               _keyDownFiredOnEditor: false
            },
            init: function() {
               this._publish('onItemValueChanged', 'onHeightChange', 'onBeginEdit', 'onEndEdit', 'onKeyPress');
               EditInPlace.superclass.init.apply(this, arguments);
               this._container.bind('keypress keydown', this._onKeyDown.bind(this))
                              .bind('keyup', this._onKeyUp.bind(this))
                              .bind('mousedown', this._onMouseDown.bind(this));
               this.subscribe('onChildControlFocusOut', this._onChildControlFocusOut);
               this._editors = this.getContainer().find('.controls-editInPlace__editor');

               //если внутри есть ListView или его наследники, то при помощи такой команды они сообщают об изменении своих размеров.
               //надо пересчитать размер плашки редактирования в таком случае
               CommandDispatcher.declareCommand(this, 'resizeYourself', function() {
                  if (this.isEdit()) {
                     this._targetTracking(this.getTarget().prop('tagName') !== 'TR');
                  }
               }.bind(this));
            },

            _onMouseDown: function(event) {
               // Не даем всплывать событию mousedown выше контейнера редактирования.
               // Это связано с особенностями обработки фокуса родительскими компонентами.
               // todo: можно будет выпилить, когда редактирование по месту будет частью разметки табличных представлений
               event.stopPropagation();
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
                           Indicator.setMessage(rk('Пожалуйста, подождите…'));
                        }, 100);
                        this._editingDeferred = result.addBoth(function () {
                           clearTimeout(loadingIndicator);
                           this._previousModelState = this._editingModel.clone();
                           Indicator.hide();
                        }.bind(this));
                     } else {
                        this._previousModelState = this._editingModel.clone();
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
                   prevValue,
                   result = [];
               this._editingModel.each(function(field, value) {
                  prevValue = this._previousModelState.get(field);
                  //Сложные типы полей(например Enum), нельзя сравнивать поссылочно, иначе будет неверный результат
                  //Такие типы должны обладать методом isEqual, с помощью которого и будем производить сравнение
                  if (value && typeof value.isEqual === 'function' && !value.isEqual(prevValue) || value != prevValue) {
                     result.push(field);
                  }
               }, this);

               return result;
            },
            _getElementToFocus: function() {
              return this._container; //Переопределяю метод getElementToFocus для того, чтобы не создавался fake focus div
            },
            _onKeyDown: function(e) {
                // проверка цикла нажатия на клавишу.
                // т.к. keyDown можно произойти по отличному от EIP элементу, а keyUp уже отработать по EIP
                // при этому по факту на EIP никто не нажимал
               //Проверка на системные клавиши, т.к. при нажатии сочетания клавиш ctrl + enter, и отпускании сначала ctrl затем enter,
               //получится что при отпускании ctrl мы скинем значение переменной _keyDownFiredOnEditor в false.
               //Для таких сценариев, когда нажимаются сочетания клавишь, не будем учитывать системные клавиши.
               //В рамках VDOM такой проблемы не будет, т.к. обработка нажатия клавишь будет по keydown, а не по keyup.
               if (e.which !== constants.key.ctrl) {
                  this._keyDownFiredOnEditor = true;
               }
               // ESC обрабатываем именно на keydown, т.к. все ws-панели и окна работают по keydown.
               // Иначе после нажатия ESC на FloatArea событие keyUp доплывет до редактирования по месту и оно тоже закроется.
               // https://online.sbis.ru/opendoc.html?guid=9558878b-0207-4355-bf9b-2615a9abd58a
               if (e.which === constants.key.esc) {
                  this._notify('onKeyPress', e);
               }
               e.stopPropagation();
            },
            _onKeyUp: function(e) {
               // ESC обрабатываем именно на keydown, т.к. все ws-панели и окна работают по keydown.
               // Иначе после нажатия ESC на FloatArea событие keyUp доплывет до редактирования по месту и оно тоже закроется.
               // https://online.sbis.ru/opendoc.html?guid=9558878b-0207-4355-bf9b-2615a9abd58a
               if (e.which !== constants.key.esc && this._keyDownFiredOnEditor === true) {
                  this._notify('onKeyPress', e);
               }
               if (e.which !== constants.key.ctrl) {
                  this._keyDownFiredOnEditor = false;
               }
            },
            /**
             * Заполняем значениями отображаемую editInPlace область
             * @param model Model, из которого будут браться значения полей
             */
            setModel: function(model) {
               this._model = model;
               this._previousModelState = model.clone();
               this._editingModel = model.clone();
               this.getContext().setValue(CONTEXT_RECORD_FIELD, this._editingModel);
            },
            /**
             * Сохранить значения полей области редактирования по месту
             */
            acceptChanges: function() {
               this._deactivateActiveChildControl();
               return (this._editingDeferred || Deferred.success()).addCallback(function() {
                  this._model.merge(this._editingModel);
                  this._model.acceptChanges();
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
               this._updateVerticalPosition();
               if (this.getTarget().prop('tagName') !== 'TR') {
                  this._updateHorizontalPosition();
               }
            },
            _beginTargetTracking: function() {
               // Сбросим все переменные, используемые при пересчёте
               this._lastVerticalPosition = 0;
               this._lastHorizontalPosition = 0;
               this._lastHeight = 0;
               this._lastWidth = 0;
               // Синхронно пересчитаем позицию, чтобы не было визуальных скачков из-за асинхронного позиционирования
               // Также данный пересчет обязательно нужен, т.к. он синхронно пересчитывает высоту и в каллбеке beginEdit мы получаем элемент с правильной высотой
               this._targetTracking(this.getTarget().prop('tagName') !== 'TR');
            },
            _onResizeHandler: function() {
               EditInPlace.superclass._onResizeHandler.apply(this, arguments);
               if (this.isEdit()) {
                  this._targetTracking(this.getTarget().prop('tagName') !== 'TR');
               }
            },
            _endTargetTracking: function() {
               //Сбросим установленное ранее значение высоты строки
               this.getTarget().height('');
            },
            _targetTracking: function(trackingHorizontalValues) {
               //Сначала нужно пересчитывать высоту редактируемой строки, а затем позицию редактора, так как при изменении
               //высоты меняется и позиция.
               this._recalculateHeight();
               this._updateVerticalPosition();
               if (trackingHorizontalValues) {
                  this._recalculateWidth();
                  this._updateHorizontalPosition();
               }
            },
            _recalculateWidth: function() {
               var
                  newWidth = this.getTarget().outerWidth(true);
               if (this._lastWidth !== newWidth) {
                  this._lastWidth = newWidth;
                  this.getContainer().outerWidth(newWidth);
               }
            },
            _recalculateHeight: function() {
               var
                   newHeight = this._getMaximalEditorHeight(this._editors);
               if (this._lastHeight !== newHeight) {
                  this._lastHeight = newHeight;
                  this._outerHeight(this.getTarget(), newHeight);
                  this._notify('onHeightChange', this._model);
               }
            },
            _getMaximalEditorHeight: function(editors) {
               var
                  height,
                  maximalHeight = 0;
               editors.each(function(id, editor) {
                  height = $(editor).outerHeight(true);
                  if (height > maximalHeight) {
                     maximalHeight = height;
                  }
               });
               return maximalHeight;
            },
            /*
            * jquery ui перебивает стандартный outerHeight каким то нерабочим методом.
            * Причём перебивает только на установку значения.
            * Необходимо обновить версию jquery ui на cdn.
            * */
            _outerHeight: function(target, height) {
               var offsets;

               //Сбрасываем ранее устанавленное значение высоты, чтобы заново пересчитать правильно
               target.height('');

               //Получаем сумму margin + border + padding (top и bottom);
               offsets = target.outerHeight() - target.height();
               target.height(height - offsets);
            },
            hide: function() {
               EditInPlace.superclass.hide.apply(this, arguments);
               this.getContainer().removeAttr('data-id');
            },
            edit: function(model, itemProj, withoutActivateFirstControl) {
               if (!this.isVisible()) {
                  this.show(model, itemProj);
               }
               /*Сначада необходимо повестиь класс что запись реактируется, т.к. это может привести к изменению высоты
                 редактируемой строки, что в свою очередь может привести к смещению редакторов и визуальным скачкам.*/
               this.getTarget().addClass('controls-editInPlace__editing');
               /*Необходимо отслеживать позицию редакторов, т.к. во время редактирования может измениться позиция редакторов,
                 в следствии изменения высоты записей(лежащих выше или ниже редактируемой) или добавления/удаления записей.*/
               this._beginTargetTracking();
               this._editing = true;
               if (!withoutActivateFirstControl) {
                  if(!this.hasActiveChildControl()) {
                     this.activateFirstControl();
                  } else {
                     this.getActiveChildControl(true, true).setActive(true);
                  }
               }
               this._notify('onBeginEdit');
            },
            isEdit: function() {
               return this._editing;
            },
            endEdit: function() {
               this.getContainer().removeAttr('data-id');
               this._endTargetTracking();
               this.getTarget().removeClass('controls-editInPlace__editing');
               this._editing = false;
               this.hide();
               //После завершения редактирования, нужно деактивировать опласть с редакторами, иначе фокус останется на ней
               this.setActive(false);
               //Возможен такой сценарий: начали добавление по месту, не заполнив данные, подтверждают добавление
               //и срабатывает валидация. Валидация помечает невалидные поля. После этого происходит отмена добавления,
               //и редакторы скрываются. При следующем начале добавления по месту редакторы будут показаны, как невалидные.
               //Так что сами принудительно очистим отметку валидации, при завершении редактирования/добавления.
               this.resetValidation();
               this._notify('onEndEdit');
            },
            setOffset: function(model) {
               var
                  container = this.getContainer();
               if (this._options.getEditorOffset) {
                  if (!this._options.editingTemplate) {
                     container = container.children().get(this._options.ignoreFirstColumn ? 1 : 0);
                  }
                  $(container).find('.controls-editInPlace__editor').css('padding-left', this._options.getEditorOffset(model, this.getTarget()));
               }
            },
            _updateHorizontalPosition: function() {
               var
                  editorLeft,
                  target = this.getTarget();
               if (target && target.length) {
                  editorLeft = target.position().left;
                  if (this._lastHorizontalPosition !== editorLeft) {
                     this._lastHorizontalPosition = editorLeft;
                     this.getContainer().css('left', editorLeft);
                  }
               }
            },
            _updateVerticalPosition: function() {
               var
                   editorTop,
                   target = this.getTarget();

               //TODO: Тут необходима проверка на target. При добалении по месту, мы создаём фейковую строку, которая является таргетом.
               //При завршение добавления, мы фейковую строку из DOM удаляем. Для корректной работы редактирования необходимо
               //выполнить по порядку 3 действия: отписаться от изменения высоты, удалить фейковую строку, скрыть редактирование.
               //Такой порядок обязателен т.к. в ховер режиме если сначала скрыть редактирование, то курсор попадёт на фейковую
               //строку и начнётся редактирование для фейковой строки, у которой нет рекорда, что приведёт к ошибкам.
               //Отписка и скрытие происходит внутри метода endEdit у редактирования. А фейковой строкой занимается контроллер,
               //т.к. он её создаёт, а само редактирование разницы между редактированием и добавлением не знает.
               //Получается для корректной работы нужно метод endEdit разбивать на 2 и между вызовами удалять фейковую строку.
               //Но т.к. в скором времени планируется отказаться от hover режима, добавим проверку на наличие таргета,
               //которую можно будет удалить после отказа от hover режима.
               if (target && target.length) {
                  editorTop = target.position().top - this.getContainer().position().top;
                  if (this._lastVerticalPosition !== editorTop) {
                     this._lastVerticalPosition = editorTop;
                     for (var i = 0; i < this._editors.length; i++) {
                        $(this._editors[i]).css('top', editorTop);
                     }
                  }
               }
            },
            getEditingRecord: function() {
               return this._editingModel;
            },
            getOriginalRecord: function() {
               return this._model;
            },
            getTarget: function() {
               var id = this._model.getId();
               return this._options.itemsContainer.find('>.js-controls-ListView__item[data-id="' + (id === undefined ? '' : id) + '"]:not(".controls-editInPlace")');
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
               this._container.unbind('keypress keydown keyup mousedown');
               EditInPlace.superclass.destroy.call(this);
            }
         });

      return EditInPlace;
   });
