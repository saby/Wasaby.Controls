define('js!SBIS3.CORE.FieldEditAtPlace', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CORE.FieldEditAtPlace',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CORE.FieldString',
   'js!SBIS3.CORE.FieldDropdown',
   'js!SBIS3.CORE.FieldInteger',
   'js!SBIS3.CORE.FieldMoney',
   'js!SBIS3.CORE.FieldText',
   'js!SBIS3.CORE.FieldDate',
   'js!SBIS3.CORE.FieldLink',
   'js!SBIS3.CORE.Button',
   'css!SBIS3.CORE.FieldEditAtPlace'],
   function (compoundControl, dotTplFn, Dialog, fString, fDropDown) {

      'use strict';

      /**
       * @class $ws.proto.FieldEditAtPlace
       * @extends $ws.proto.CompoundControl
       *
       * @control
       * @designTime actions /design/design
       * @designTime plugin /design/DesignPlugin
       * @initial
       * <component data-component='SBIS3.CORE.FieldEditAtPlace' style='width: 100px; height: 40px;'>
       *    <div>ИНН</div><component data-component='SBIS3.CORE.FieldString' name='ИНН'></component>
       * </component>
       * @category Fields
       */
      $ws.proto.FieldEditAtPlace = compoundControl.extend(/** @lends $ws.proto.FieldEditAtPlace.prototype */{
         /**
          * @event onBeforeEdit Событие перед редактированием
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          */
         /**
          * @event onBeforeCreate Событие перед созданием контрола
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          */
         /**
          * @event onAfterCreate Событие после создания контрола
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          */
         /**
          * @event onApply При подтверждении редактирования
          * Событие срабатывает при нажатии:
          * <ol>
          *    <li>на кнопку сохранения,</li>
          *    <li>OK в диалоге подтверждения,</li>
          *    <li>клавиши Tab после обхода всех контролов в шаблоне редактирования заголовка закладки,</li>
          *    <li>клавиши Enter по окончании редактирования в заголовке закладки.</li>
          * </ol>
          * Если обработчик не настроен и включена опция {@link saveOnApply}, то вызовется команда {@link $ws.proto.DialogRecord#save save}.
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} values Хэш-мэп Пары имя-значение из контекста.
          * @example
          * После выбора пользователя по идентификатору получить ФИО:
          * <pre>
          *     control.subscribe('onApply', function (event, values) {
          *        var dRes = new $ws.proto.Deferred();
          *        new $ws.proto.BLObject('Пользователь').call('ПолучитьПоИд', {'Ид': values['ИдПользователя']},$ws.proto.BLObject.RETURN_TYPE_ASIS).addCallback( function (record) {
          *           values['ФИО'] = record.get('ФИО');
          *           dRes.callback(values);
          *        })
          *        event.setResult(dRes);
          *     });
          * @see saveOnApply
          * @see onAfterApply
          */
         /**
          * @event onAfterApply Событие после подтверждения редактирования
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          * @param {Object} values Хэш-мэп Пары имя-значение из контекста (возможно, измененного после вызова события onApply).
          * @see onApply
          */
         /**
          * @event onCancel Событие на отмену редактирования
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          */
         /**
          * @event onAfterCancel Событие после отмены редактирования
          * @param {$ws.proto.EventObject} eventObject Дескриптор события.
          */
         $protected: {
            _options: {
               /**
                * @cfg {Boolean} Режим работы
                * Возможные значения:
                * <ol>
                *    <li>false - без редактирования по месту, обычные поля ввода;</li>
                *    <li>true - с редактированием по месту.</li>
                * </ol>
                */
               inPlaceEditMode: false,
               /**
                * @cfg {Boolean} Режим редактирования заголовка закладки
                * Возможные значения:
                * <ol>
                *    </li>false - обычное редактирование (во всплывающей панели);</li>
                *    <li>true - редактирование закладки по месту.</li>
                * </ol>
                */
               isTabEditor: false,
               /**
                * @cfg {Boolean} Выполнять ли команду save
                * Выполнять ли команду {@link $ws.proto.DialogRecord#save save} при подтверждении редактирования.
                * @see onApply
                */
               saveOnApply: true,
               /**
                * @cfg {Content} Содержимое области
                */
               content: ''
            },
            _undoBuffer: undefined,       // буфер для отмены редактирования
            _controlPanel: undefined,     // область с кнопками ок и отмена
            _dummy: null,                 // заглушка под область
            _editArea: null,              // область для панели редактирования
            _editorWrapper: null,         // область редакторов, внутри области панели редактирования
            _fieldStringArea: null,
            _hideTimeout: null,
            _stringControls: undefined,   // контролы для редактирования
            _$StringControls: undefined,  // jQuery collection
            _state: 'contents',           // 'contents' || 'edit'
            _zIndex: 0
         },

         _dotTplFn: dotTplFn,

         $constructor: function () {
            var self = this;
            self._publish('onBeforeEdit', 'onBeforeCreate', 'onAfterCreate', 'onApply', 'onAfterApply', 'onCancel', 'onAfterCancel');

            self._notify('onBeforeCreate');
            //сделаем контекст "прозрачным", чтобы контролы внутри FieldEditAtPlace работали с контекстом родителя FieldEditAtPlace
            self._craftedContext = false;
            self._context = self._context.getPrevious();
            this._keysWeHandle[$ws._const.key.esc] = true;
         },

         _setStringControlsEditMode: function (mode) {
            if (mode === undefined) {
               mode = true;
            }
            for (var i = 0, l = this._stringControls.length; i < l; i++) {
               if (this._stringControls[i].setEditAtPlace) {
                  this._stringControls[i].setEditAtPlace(mode);
               }
            }
         },

         init: function () {

            $ws.proto.FieldEditAtPlace.superclass.init.call(this);

            var self = this;
            this._undoBuffer = {};
            this._dummy = this._container.find('.ws-FieldEditAtPlace__dummy');
            this._editArea = this._container.find('.ws-FieldEditAtPlace__editArea');
            this._editorWrapper = this._editArea.find('.ws-FieldEditAtPlace__editors');
            this._controlPanel = this._container.find('.ws-FieldEditAtPlace__controlPanel');
            this._fieldStringArea = this._container.find('.ws-FieldEditAtPlace__string');

            this._stringControls = $ws.helpers.filter(self.getChildControls(), function (inst) {
               return (inst instanceof fString || inst instanceof fDropDown) &&
                  inst && inst.getContainer &&
                  inst.getContainer().parents('.ws-FieldEditAtPlace__string').length;
            });
            var $StringControls = $($ws.helpers.map(this._stringControls,
               function (elem) {
                  return elem.getContainer();
               }));
            this._$StringControls = $StringControls.map(function () {
                  return this.toArray();
               });
            try {
               var applyButton = this.getChildControlByName(this.getName() + '_apply');
               applyButton.subscribe('onActivated', function () {
                  if (!self._checkOnEditNewRecordInTabButtons()) {
                     self._finishEdit();
                  }
               });
            } catch (e) {
               $ws.single.ioc.resolve('ILogger')
                  .error('FieldEditAtPlace', 'Произошла ошибка при загрузке дочерних контролов области быстрого редактирования ' + this.getName(), e);
            }
            this._controlPanel.find('.ws-FieldEditAtPlace__cancel').click(function (event) {
               event.stopImmediatePropagation();
               // Перевод фокуса на кнопку, чтобы увести фокус с контролов внутри области редактирования.
               // Фиксит ошибку с выпадающими списками, которые не закрываются при отмене редактирования.
               applyButton.setActive(true);
               self._finishEdit(false, true);
            });

            if (this._options.inPlaceEditMode) {
               this._setStringControlsEditMode(true);
            }

            var subscribeOnClick = function (ctrl) {
               ctrl.subscribe('onClick', function () {
                  if (!self._options.enabled) {
                     return;
                  }
                  if (self._options.isTabEditor &&
                     self.getContainer().parents('.ws-tabs-button-inactive, .ws-TabButtons__button__state-inactive').length) {
                     return;
                  }
                  self._showEditArea(ctrl);
               });
            };
            for (var i = 0, l = this._stringControls.length; i < l; i++) {
               subscribeOnClick(this._stringControls[i]);
            }
            $('.ws-underline', this._container.get(0)).click(function(){
               self._showEditArea(self.getChildControls()[0]);
            });

            this.subscribe('onInit', function () {
               // сохранение первоначальных значений полей в буфер
               self._saveContextTo(self._undoBuffer);
            });
            if (this._options.isTabEditor) {
               this._fieldStringArea.bind('mousedown.' + this.getId() + ' wsmousedown.' + this.getId(), function (e) {
                  e.stopImmediatePropagation();
               });
            } else {
               this._editArea.appendTo($('body'));
               this._editArea.bind('mousedown.' + this.getId() + ' wsmousedown.' + this.getId(), function (e) {
                  e.stopImmediatePropagation();
               });
               $ws.helpers.keyDown(this._editArea, function (e) {
                  var result = self._notify('onKeyPressed', e);
                  if (e.which in self._keysWeHandle && result !== false && self._isAcceptKeyEvents()) {
                     var res = self._keyboardHover(e);
                     if (!res) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                     }
                     return res;
                  }
               });
               // нужно забиндить клик по высплывающей области, чтобы не терять фокус с текущего контрола
               this._editArea.bind('click', this._onClickHandler.bind(this));
            }
            self._notify('onAfterCreate');

            // если область редактирования лежит на окне или плавающей панели,
            // то при клике они помещаются на передний план и перекрывают панель
            var parent = this.getTopParent();
            if (parent && parent.moveToTop && !!$ws.helpers.find($ws._const.WINDOW_CLASSES, $ws.helpers.instanceOfModule.bind(undefined, parent))) {
               parent.moveToTop = parent.moveToTop.callNext(this.moveToTop.bind(this));
            }
            // Блокируем показ нашего диалога подтверждения, если уже показан такой же диалог, но у RecordFloatArea
            if ($ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.RecordFloatArea')) {
               this._recordArea = parent;
               this._recordArea.subscribe('onBeforeShowConfirmDialog', function onBeforeShowConfirmDialog(event, record) {
                  self._confirm = true;
               }).subscribe('onConfirmDialogSelect', function onConfirmDialogSelect(event, result) {
                  if (result && self._state !== 'contents') {
                     self._showContents();
                  }
                  self._confirm = false;
               });
            }
         },
         moveToTop: function () {
            if (this._options.inPlaceEditMode && this._state === 'edit' && !this._confirm) {
               this._movePanelToTop();
            }
         },
         /**
          * Динамически получать zIndex из менеджера окон для панели
          * @private
          */
         _movePanelToTop: function () {
            if (this._options.isTabEditor || !this._options.inPlaceEditMode) {
               return;
            }
            if (this._zIndex) {
               $ws.single.WindowManager.releaseZIndex(this._zIndex);
            }
            this._zIndex = $ws.single.WindowManager.acquireZIndex(true);
            $ws.single.WindowManager.setVisible(this._zIndex);
            $ws.single.ModalOverlay.adjust();
            if (this._editArea) {
               this._editArea.css('z-index', this._zIndex);
            }
         },

         /**
          * Рассчитываем отступ сверху у панели управления редактировнием так,
          * чтобы кнопки располагались напротив самого верхнего поля ввода.
          * @private
          */
         _calcControlPanelMargin: function() {
            if(this._options.isTabEditor || this._controlPanelMarginCalculated) {
               return;
            }
            this._controlPanelMarginCalculated = true;
            var pTop = this._editorWrapper.get(0).getBoundingClientRect().top,
               minTop = Infinity;
            for (var i = 0; i < this._$StringControls.length; i++) {
               var cTop = this._$StringControls.get(i).getBoundingClientRect().top;
               minTop = cTop < minTop ? cTop : minTop;
            }
            if (minTop === Infinity || minTop < pTop) {
               minTop = pTop;
            }
            this._controlPanel.css('margin-top', minTop - pTop);
         },
         /**
          * <wiTag group="Управление">
          * <wiTag class="GroupCheckBox" noShow>
          * Находит следующий активный контрол в зависимости от того как нажат таб
          * @return {Boolean} результат выполнения функции
          */
         detectNextActiveChildControl: function () {
            var res = $ws.proto.FieldEditAtPlace.superclass.detectNextActiveChildControl.apply(this, arguments);
            if (!res) {
               if (!this._finishEdit()) {
                  return this._activeChildControl;
               }
            }
            return res;
         },
         /**
          *  Обработка клавиатурных нажатий
          * @param {Event} e
          * @returns {Boolean}
          * @private
          */
         _keyboardHover: function (e) {
            var key = e.which;
            if (this._options.inPlaceEditMode) {
               if (key === $ws._const.key.enter && this._state === 'edit') {
                  if (!this._checkOnEditNewRecordInTabButtons()) {
                     this._finishEdit();
                  }
                  return false;
               }
               if (key === $ws._const.key.esc && this._state === 'edit') {
                  this._finishEdit(false);
                  return false;
               }
            }
            var res = $ws.proto.FieldEditAtPlace.superclass._keyboardHover.apply(this, arguments);
            if (res === undefined) {
               res = true;
            }
            return res;
         },
         /**
          * Возвращает, может ли область получать фокус
          * @return {Boolean}
          */
         canAcceptFocus: function () {
            var i, child, ln,
                container = this.getContainer();

            var result = this.isVisible() &&
                         (!this._options.inPlaceEditMode || (this._options.inPlaceEditMode && this._state === 'edit')) &&
                         $ws.helpers.isElementVisible(container);

            if (result) {
               for (i = 0, ln = this._childControls.length; i !== ln; ++i) {
                  child = this._childControls[i];
                  if (child && child.canAcceptFocus()) {
                     return true;
                  }
               }
            }
            return false;
         },
         onBringToFront: function () {
            if (!this._options.inPlaceEditMode || (this._options.inPlaceEditMode && this._state === 'edit')) {
               if (!this._confirm) {
                  this.moveToTop();
               }
               $ws.proto.FieldEditAtPlace.superclass.onBringToFront.call(this);
            }
         },
         /**
          * Начать редактирование по месту в контроле
          * @param {Object} [control] контрол для активации
          */
         activateArea: function (control) {
            this._showEditArea(control || this.getChildControls()[0]);
         },
         /**
          * Завершить редактирование области
          * @param {Boolean} [fCancel] Если false - отмена действий пользователя
          * @param {Boolean} [noConfirm] Не выводить диалог подтверждения при отмене действий из кода
          */
         close: function(fCancel, noConfirm) {
            this._finishEdit(fCancel, noConfirm);
         },
         /**
          * Установка режима редактирования области
          * @param mode
          */
         setInPlaceEditMode: function (mode) {
            this._options.inPlaceEditMode = !!mode;
            this._setStringControlsEditMode(mode);
         },

         /**
          * Получение режима редактирования области
          * @returns {Boolean}
          */
         getInPlaceEditMode: function () {
            return this._options.inPlaceEditMode;
         },

         /**
          * Установка контекста из объекта
          * @param obj {Object} объект со значениями (либо контекст), который нужно установить в поля ввода
          * @private
          */
         _setContextFrom: function (obj) {
            for (var i = 0, l = this._stringControls.length; i < l; i++) {
               var cnt = this._stringControls[i],
                  name = cnt.getName();
               if (name && cnt.setValue && cnt.getValue && (cnt.getValue() !== obj[name])) {
                  cnt.setValue(obj[name]); // TODO проверить остальные параметры
               }
            }
         },

         /**
          * Сохранение текущих значений полей ввода (контекста) в объект
          * @param obj {Object} объект, куда сохранить контекст
          * @private
          */
         _saveContextTo: function (obj) {
            for (var i = 0, l = this._stringControls.length; i < l; i++) {
               var cnt = this._stringControls[i],
                  name = cnt.getName();
               if (name && cnt.getValue) {
                  obj[name] = cnt.getValue();
               }
            }
         },

         /**
          * Проверка значений из контекста для полей ввода на изменение
          * @returns {boolean} true - контекст изменился
          * @private
          */
         _isCtxChanged: function () {
            for (var i = 0, l = this._stringControls.length; i < l; i++) {
               var cnt = this._stringControls[i],
                  name = cnt.getName();
               if (name && cnt.getValue) {
                  if (this._undoBuffer[name] !== cnt.getValue()) {
                     return true;
                  }
               }
            }
            return false;
         },

         /**
          * Отмена редактирования, реверт значений в контексте.
          * @private
          */
         _cancelEdit: function () {
            this._notify('onCancel');
            this._setContextFrom(this._undoBuffer);
            this._notify('onAfterCancel');
         },

         /**
          * Установка полей ввода из контекста
          * @private
          */
         _applyValues: function () {
            var values = {},
               res,
               self = this,
               setRes = function (res) {
                  self._setContextFrom(res);
                  self._notify('onAfterApply', res);
               };
            this._saveContextTo(values);

            // нотифаится событие onApply,
            // обработчики события могут изменить результат редактирования,
            // который затем вставляется в контекст и обновит поля ввода
            res = this._notify('onApply', values);
            if (res) {
               if (res instanceof $ws.proto.Deferred) {
                  res.addCallback(setRes);
               } else {
                  setRes(res);
               }
            } else {
               setRes(values);
               // если нет обработчиков события onApply, сохраняем рекорд диалога, где лежит наша область
               if (!this._eventBusChannel.hasEventHandlers('onApply') && this._options.saveOnApply) {
                  $ws.single.CommandDispatcher.sendCommand(this, 'save', undefined, true);
               }
            }
         },

         /**
          * Установка enabled для всех редактируемых контролов
          * @param enabled {Boolean} устанавливаемое состояние контрола
          * @private
          */
         _setEnabledStringControls: function (enabled) {
            for (var i = 0, l = this._stringControls.length; i < l; i++) {
               this._stringControls[i].setEnabled(enabled);
            }
         },
         /**
          * Метод начинает сопровождать контейнер
          * @private
          */
         _startTrackWrapper: function() {
            $ws.helpers.trackElement(this._container).subscribe('onMove', function (event, position) {
               this._editArea.css({
                  top: position.top - 4,
                  left: position.left - 4
               });
            }, this);
         },
         /**
          * Метод перестает сопровождать контейнер
          * @private
          */
         _stopTrackWrapper: function() {
            $ws.helpers.trackElement(this._container, false);
         },

         getZIndex: function() {
            return this._zIndex;
         },

         /**
          * Отображение шаблона редакторов/активация полей ввода для редактирования
          * @param control {$ws.proto.Control} контрол, который начали редактировать
          * @private
          */
         _showEditArea: function (control) {
            if (!this._options.inPlaceEditMode || this._state === 'edit') {
               return;
            }
            var self = this;

            var res = this._notify('onBeforeEdit');
            if (res !== false) { // разрешили редактировать
               this._state = 'edit';
               this._saveContextTo(this._undoBuffer);
               this._setStringControlsEditMode(false);
               this._container.removeClass('ws-FieldEditAtPlace__idle').addClass('ws-FieldEditAtPlace__editing');
               if (this._options.isTabEditor) {
                  this._controlPanel.removeClass('ws-hidden');
               } else {
                  var
                     dummySize = {
                        'width': this._container.width(),
                        'height': this._container.height()
                     },
                     size = {
                        'width': this._options.autoWidth ? 'auto' : dummySize.width,
                        'height': this._options.autoHeight ? 'auto' : dummySize.height
                     };
                  this._dummy.css(dummySize).removeClass('ws-hidden');
                  this._editorWrapper.css(size);
                  this._fieldStringArea.prependTo(this._editorWrapper);
                  this._startTrackWrapper();
                  this._editArea.removeClass('ws-hidden');
               }
               this._calcControlPanelMargin();
               this._movePanelToTop();

               //событие на отмену редактирования от оверлея
               this.subscribeTo($ws.single.ModalOverlay, 'onClick', function(event) {
                  //Если оверлей показан для области редактирования, то нужно её закрыть
                  if ($ws.single.ModalOverlay.isShownForWindow(self) ) {
                     event.setResult(true);
                     self._finishEdit(false);
                  }
               });

               //событие на отмену редактирования от кликов по документу
               $(document).bind('mousedown.' + this.getId() + ' wsmousedown.' + this.getId(), function (e) {
                  // обрабатывать только ЛКМ
                  if (e.which && e.which !== 1) {
                     return;
                  }
                  // клики по простому диалоговому окну, виджету календаря, всплывающей подсказке, заголовку окна
                  // не должны прекращать редактирование в области.
                  var floatElem = $(e.target).parents('.ws-smp-dlg, #ui-datepicker-div, .ws-window-titlebar, .ws-info-box');
                  if (floatElem.length) {
                     return;
                  }
                  // клик по оверлею обрабатывается отдельно (см код выше)
                  var overlay = $(e.target).closest('.ws-window-overlay');
                  if (overlay.length) {
                     return;
                  }
                  // нельзя останавливать редактирование, если контрол, на котором произошёл клик (или его родитель),
                  // открыт из области быстрого редактирования
                  var ctrl = $(e.target).wsControl(),
                     checkOpenerRecursive = function (control) {
                        if (control) {
                           var opener = control.getOpener ?
                                 control.getOpener() : control.getParentByClass($ws.proto.AreaAbstract).getOpener(),
                              topParent = control.getTopParent();
                           if (!opener) {
                              opener = topParent.getOpener ? topParent.getOpener() : null;
                           }
                           if (opener) {
                              var field = opener;
                              // поищем себя среди родителей opener-а
                              while (field && field !== self) {
                                 field = field.getParentByClass($ws.proto.FieldEditAtPlace);
                              }
                              // не нашли - рекурсивно поищем себя у opener-а
                              return (field === self) ? true : checkOpenerRecursive(opener);
                           }
                           return false;
                        }
                     };
                  if (checkOpenerRecursive(ctrl)) {
                     return;
                  }

                  // Костыль! Если мы лежим внутри RecordFloatArea при клике по браузеру не отменять редактирование,
                  // т.к. DataViewAbstract наверняка захочет сменить запись в нашей RecordFloatArea, позволим ему следать это.

                  var setRes = function (res) {
                     self._setContextFrom(res);
                     self._notify('onAfterApply', res);
                  };
                  if (self._checkOnEditNewRecordInTabButtons()) {
                     return;
                  } else if (self._recordArea) {
                     if ($ws.helpers.instanceOfModule(ctrl, 'SBIS3.CORE.DataViewAbstract') && ctrl === self._recordArea.getOpener()) {
                        return;
                     }
                  }
                  self._finishEdit(false);
               });

               control.setActive(true);
               // открыть выпадающий список
               if (control instanceof fDropDown) {
                  control.getContainer().find('.custom-select').trigger('click');
               }

               this._notifyOnSizeChanged(this, this, true);
            }
         },

         /**
          * Функция проверяет родителя FieldEditAtPlace и, если это TabButtons и имеется recordArea с новой записью, то не сохраняем свой value в Record и на БЛ
          * @returns {boolean} Возвращает true, если контрол лежит внутри TabButtons и открыта новая запись
          * @private
          */
         _checkOnEditNewRecordInTabButtons: function() {
            if ($ws.helpers.instanceOfModule(this.getParent(), 'SBIS3.CORE.TabButtons') && this._recordArea && this._recordArea.isNewRecord()) {
               //Возвращаем из "onApply" value - при текущей логике это приводит к отмене сохранения записи на БЛ
               this.once('onApply', function (event, value) {
                  event.setResult(value);
               });
               this._apply();
               return true;
            }
         },

         /**
          * Скрываем панель редактирования, показываем область быстрого редактирования
          * @private
          */
         _showContents: function () {
            this._state = 'contents';
            if (this._options.inPlaceEditMode) {
               this._setStringControlsEditMode(true);
               this._container.addClass('ws-FieldEditAtPlace__idle').removeClass('ws-FieldEditAtPlace__editing');
               this._container.focus(); // IE focus bugfix.
            }
            if (this._options.isTabEditor) {
               this._controlPanel.addClass('ws-hidden');
            } else {
               this._stopTrackWrapper();
               this._dummy.addClass('ws-hidden');
               this._fieldStringArea.appendTo(this._container);
               this._editArea.addClass('ws-hidden');
               $ws.single.WindowManager.setHidden(this._zIndex);
               $ws.single.ModalOverlay.adjust();
            }
            $(document).unbind('.' + this.getId());
            this._notifyOnSizeChanged(this, this, true);
         },

         /**
          * Валидация, применение изменений после редактирования
          * @returns {boolean}
          * @private
          */
         _apply: function () {
            if (this.validate()) {
               this._applyValues();
               this._showContents();
               return true;
            }
            return false;
         },

         /**
          * Отмена редактирования
          * @private
          */
         _cancel: function () {
            this._cancelEdit();
            this._showContents();
         },

         /**
          * Открывает диалог подтверждения при отмене радактирования.
          * @returns {$ws.proto.Deferred} deferred на закрытие модального диалога подтверждения.
          * @private
          */
         _openConfirmDialog: function () {
            var result,
               deferred = new $ws.proto.Deferred();
            this._dialogConfirm = new Dialog({
               opener: this,
               template: 'confirmRecordActionsDialog',
               resizable: false,
               handlers: {
                  onReady: function () {
                     var children = this.getChildControls(),
                        dialog = this,
                        onActivatedHandler = function () {
                           dialog.getLinkedContext().setValue('result', this.getName());
                           dialog.close();
                        };
                     for (var i = 0, len = children.length; i < len; i++) {
                        if (children[i].hasEvent('onActivated')) {
                           children[i].subscribe('onActivated', onActivatedHandler);
                        }
                     }
                  },
                  onKeyPressed: function (event, result) {
                     if (result.keyCode === $ws._const.key.esc) {
                        this.getLinkedContext().setValue('result', 'cancelButton');
                     }
                  },
                  onAfterClose: function () {
                     result = this.getLinkedContext().getValue('result');
                  },
                  onDestroy: function () {
                     deferred.callback(result);
                  }
               }
            });
            return deferred;
         },
         /**
          * Обработка завершения редактирования области
          * @param [fCancel] {Boolean} Если false - отмена действий пользователя
          * @param [force] {Boolean} не выводить диалог подтверждения при отмене
          * @returns {Boolean} действие завершено
          * @private
          */
         _finishEdit: function (fCancel, force) {
            var self = this;
            if (this._state === 'contents') {
               return true;
            }
            if (fCancel !== false) {
               return this._apply();
            }
            if (force || !this._isCtxChanged()) {
               this._cancel();
               return;
            }
            if (this._confirm) {
               return;
            }
            this._confirm = true;

            this._openConfirmDialog().addCallback(function (result) {
               self._movePanelToTop();
               switch (result) {
                  case 'yesButton':
                     self._apply();
                     break;
                  case 'noButton':
                     self._cancel();
                     break;
                  default:
               }
               self._confirm = false;
               self._dialogConfirm = null;
            });
            return true;
         },

         destroy: function () {
            this._stopTrackWrapper();
            this._editArea.remove();
            $ws.single.WindowManager.releaseZIndex(this._zIndex);
            $ws.proto.FieldEditAtPlace.superclass.destroy.call(this);
         }
      });

      return $ws.proto.FieldEditAtPlace;
   });
