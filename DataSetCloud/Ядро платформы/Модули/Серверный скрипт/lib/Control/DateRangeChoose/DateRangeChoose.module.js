/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 16:17
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.DateRangeChoose', ['js!SBIS3.CORE.Control', 'js!SBIS3.CORE.FieldDate', 'js!SBIS3.CORE.Button', 'js!SBIS3.CORE.LinkButton', 'js!SBIS3.CORE.FieldCheckbox', 'js!SBIS3.CORE.Menu', 'css!SBIS3.CORE.DateRangeChoose', 'css!SBIS3.CORE.LinkButton'], function( Control, FieldDate, Button, LinkButton, FieldCheckbox, Menu ) {

   'use strict';

   $ws._const.DateRangeChoose = {
      rowHeight: 24,
      containerSpace: 12,
      startOffset: 0,
      startYearOffset: 0,
      scrollCount: 30,
      yearOffset: 3,
      menuOffset: {'top': -5, 'left': -5},
      separatorWidth: 24,
      quarter: [{'title': 'Первый квартал' , 'rec': 'I квартал'}, {'title': 'Второй квартал' , 'rec': 'II квартал'},
               {'title': 'Третий квартал' , 'rec': 'III квартал'}, {'title': 'Четвёртый квартал' , 'rec': 'IV квартал'}]
   };

   /**
    * Контрол - диапазон дат
    *
    * @class $ws.proto.DateRangeChoose
    * @extends $ws.proto.DataBoundControl
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.DateRange'>
    * </component>
    * @category Date/Time
    * @designTime plugin /design/DesignPlugin
    * @ignoreOptions value
    *
    */
   $ws.proto.DateRangeChoose = Control.DataBoundControl.extend(/** @lends $ws.proto.DateRangeChoose.prototype */{
      /**
       * @event onChange Смена выбранного диапазона дат
       * @param {$ws.proto.EventObject} eventObject Объект события
       * @param {Date}        date0       Начало диапазона
       * @param {Date}        date1       Конец диапазона
       * @example
       * <pre>
       *    control.subscribe('onChange', function(event, start, end){
       *       if(start && end){
       *          chart.setRange(start, end);
       *          title.setText('Отображается график за период: ' + this.getStringValue());
       *       }
       *    });
       * </pre>
       */
      /**
       * @event onMenuHide Закрытие меню
       * Не рекоммендуется использовать это событие вместо onChange!
       * @param {$ws.proto.EventObject} eventObject Объект события
       * @example
       * <pre>
       *    control.subscribe('onMenuHide', function(){
       *       floatAreaLocked = false; //Теперь панель при уведении мыши можно закрывать
       *    });
       * </pre>
       */
      /**
       * @event onVisualize Смена текста в блоке отображения выбранного периода при renderStyle = asLink
       * @param {$ws.proto.EventObject} eventObject Объект события
       * @param {Date}        date0       Начало диапазона
       * @param {Date}        date1       Конец диапазона
       * @example
       * <pre>
       *    control.subscribe('onVisualize', function(event, start, end){
       *       if(start.getMonth() == 11){
       *          event.setResult('Декабрь - мой любимый месяц!');
       *       }
       *    });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {String} Имя контрола, который отображает дату "с"
             * Влияет на запись и чтение данных из контекста, а также на связанную по смыслу функциональность.
             * Должно отличаться от {@link dateToName}
             * <wiTag group="Управление">
             */
            dateFromName: '',
            /**
             * @cfg {String} Имя контрола, который отображает дату "по"
             * Влияет на запись и чтение данных из контекста, а также на связанную по смыслу функциональность.
             * Должно отличаться от {@link dateFromName}
             * <wiTag group="Управление">
             */
            dateToName: '',
            /**
             * @cfg {String|Date} Начальное значение даты начала интервала
             * Формат данных (строка): "03/11/2011"
             * Должно быть меньше {@link dateToValue}
             * <wiTag group="Данные">
             */
            dateFromValue: '',
            /**
             * @cfg {String|Date} Начальное значение даты конца интервала
             * Формат данных (строка): "03/11/2011"
             * Должно быть меньше {@link dateFromValue}
             * <wiTag group="Данные">
             */
            dateToValue: '',
            /**
             * @cfg {Boolean} Отображать ли поле в виде текста
             * Будет выведен текст вместо полей ввода. Однако при клике всё равно будет отображено меню, аналогичное
             * стандартному.
             * Текст будет равен значению {@link getStringValue}
             * <wiTag group="Отображение" page=1>
             */
            textView: false,
            /**
             * @cfg {String} Формат отображения даты
             * <wiTag group="Отображение" page=1>
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM'
             * @variant 'DD.MM.YY'
             * @variant 'YY-MM-DD'
             * @variant 'YYYY-MM-DD'
             * @variant 'MM/YYYY'
             * @variant 'YYYY'
             * @variant 'HH:II'
             * @variant 'HH:II:SS'
             * @variant 'HH:II:SS.UUU'
             * @variant 'HH:II:SS.UUUUUU'
             * @variant 'DD.MM.YYYY HH:II'
             * @variant 'DD.MM.YYYY HH:II:SS'
             * @variant 'DD.MM.YYYY HH:II:SS.UUU'
             * @variant 'DD.MM.YYYY HH:II:SS.UUUUUU'
             * @variant 'DD.MM HH:II'
             * @variant 'DD.MM HH:II:SS'
             * @variant 'DD.MM HH:II:SS.UUU'
             * @variant 'DD.MM HH:II:SS.UUUUUU'
             * @variant 'DD.MM.YY HH:II'
             * @variant 'DD.MM.YY HH:II:SS'
             * @variant 'DD.MM.YY HH:II:SS.UUU'
             * @variant 'DD.MM.YY HH:II:SS.UUUUUU'
             * @variant 'YY-MM-DD HH:II'
             * @variant 'YY-MM-DD HH:II:SS'
             * @variant 'YY-MM-DD HH:II:SS.UUU'
             * @variant 'YY-MM-DD HH:II:SS.UUUUUU'
             * @variant 'YYYY-MM-DD HH:II'
             * @variant 'YYYY-MM-DD HH:II:SS'
             * @variant 'YYYY-MM-DD HH:II:SS.UUU'
             * @variant 'YYYY-MM-DD HH:II:SS.UUUUUU'
             */
            mask: 'DD.MM.YYYY',
            /**
             * @cfg {String} Формат начального отображения
             * <wiTag group="Отображение" page=1>
             * @variant 'classic'
             * @variant 'asLink'
             */
            renderStyle: 'asLink',
            /**
             * @cfg {Boolean} Отображать ли выбор квартала
             * <wiTag group="Отображение" page=1>
             */
            showQuarter: true,
            /**
             * @cfg {Boolean} Отображать ли выбор произвольного периода
             * <wiTag group="Отображение" page=1>
             */
            showCustomPeriod: true,
            /**
             * @cfg {Boolean} Отображать ли стрелочки для быстрого выбора периода
             * <wiTag group="Отображение" page=1>
             */
            fastSelectionPeriod: false
         },
         _fieldsTabindex: undefined,      //Табиндекс дочерних полей
         _dateControls: [],               //Контролы FieldDate, 2 штуки
         _datesDeferred: undefined,       //Деферред готовности полей дат
         _menuBlock: undefined,           //Блок с меню
         _menuShowed: false,              //Показывается ли меню
         _calendarBlock: undefined,       //Блок с календярём
         _currentDate: undefined,         //Текущая дата
         _currentMonth: 0,                //Выбранный месяц
         _currentYear: undefined,         //Текущий отображаемый год
         _yearBlock: undefined,           //Блок, в котором содержатся номер года и стрелочки
         _yearScrollerBlock: undefined,   //Блок для выбора текущего года, изначально скрыт, показывается при клике по _yearBlock
         _yearScroller: undefined,        //Объект, который возвращается методом _createScroller, повзоляет выбрать текущий год
         _yearScrollerShowed: false,      //Показано ли сейчас меню для выбора года
         _daysScroller: undefined,        //Объект, который возвращается методом _createScroller, повзоляет выбрать дни
         _state: 0,                       //Текущиее состояние выбора диапазона: 0 - не выбрано, 1 - выбрана первая дата, 2 - выбран диапазон
         _stateType: 0,                   //Тип выбранного диапазона: 0 - произвольный период, 1 - месяц, 2 - квартал, 3 - год 4 - неделя 5 - день
         _selectionType: "week",          //Тип выбираемого периода( week - недел, period - произвольный период)
         _stateSelectId: -1,              //ID элемента, который выбран пользователем(для квартала и месяца)
         _stateOld: -1,                   //Старое состоянее выбора диапазона
         _range: [null, null],            //Массив с объектами Date, которые ограничивают выбранный диапазон
         _rangeOld: [null, null],         //Массив с объектами Date, которые ограничивают диапазон, выбранный ранее
         _selectionSlider: undefined,     //Объект, подсвечивающий выбранный диапазон дат
         _tipSlider: undefined,           //Объект, подсвечивающий будущее выделение диапазона (при наведении на кнопку полугодий, кварталов)
         _rangeEndAt: 1,                  //В каком элементе массива _range лежит последняя выбранная дата
         _menuControlsRow: undefined,     //Блок, куда будут вставляться контролы FieldDate после показа меню
         _movingControlsBlock: undefined, //Блок, в котором лежат контролы FieldDate
         _months: [],                     //Массив с контейнерами месяцев
         _prevMonth: undefined,           //Номер предыдущего выделенного месяца
         _daysCells: [],                  //Ячейки с днями - концоом и началом выделения
         _rangeMarks: [],                 //Массив с уголком и звёздочкой - началом и концом промежутка
         _monthSelection: undefined,      //Элемент с фоном для выбранного месяца
         _toggledButtons: [],             //Массив с зажимаемыми кнопками (кварталы, полугодия)
         _selectionMarker: undefined,     //Маркеры того, что выделение в следующем / предыдущем году
         _errorMarker: undefined,         //Маркер ошибки, при наведении на него мышью будет показан текст ошибки
         _errorMessage: '',               //Сохранённое сообщение об ошибке для последующего отображения в меню
         _rangeTitle: undefined,          //Блок с текстом описания выделения
         _validationErrors: [0, 0],       //Имеется ли ошибка полей ввода даты, если есть, то маркер не убироть
         _textField: undefined,           //Блок для отображения поля в виде текста (_options.textView)
         _captionAsLinkBlock: undefined,   //Блок для отображение выбранного месяца при renderStyle = asLink
         _confirmButtonContainer: undefined,//Блок для отображения кнопки подтверждения выбора периода
         _choosePeriod: undefined           //чекбокс произвольного периода
      },
      $constructor: function(){
         this._publish('onChange', 'onMenuHide', 'onVisualize');
         this._datesDeferred = new $ws.proto.Deferred();
         if (!this._options.dateFromValue && !this._options.dateToValue) {
            this._options.dateFromValue = this._options.dateToValue = new Date();
         }
         this._container.addClass('clearfix').addClass('ws-date-range-choose' + (this._options.textView ? ' ws-date-range-choose-text-view' : ''));
         this._currentDate = new Date(this._getDefaultValue()[0]);
         if (this._currentDate.toString() === 'Invalid Date') {
            this._currentDate = new Date();
         }
         this._currentMonth = this._selectMonth = this._currentDate.getMonth();
         this._currentYear = this._currentDate.getFullYear();
         this._container.removeAttr('tabindex');
         this._initValidation();

         var parent = this;
      },
      /**
       * Добавляет свой собственный валидатор - для проверки корректности периода
       * @private
       */
      _initValidation: function(){
         this._options.validators.push({
            validator: function(){
               return !this._range[0] || !this._range[1] || this._range[0] <= this._range[1];
            }.bind(this),
            errorMessage: 'Дата начала периода не может быть больше даты окончания'
         });
      },
      /**
       * Считает дефолтное значение контрола
       * @returns {Array}
       * @private
       */
      _getDefaultValue: function(){
         var parseString = function(text, endDay){
               var values;
               if($ws.helpers.isISODate(text)) {
                  return $ws.helpers.dateFromISO(text);
               }
               if(!text.split || (values = text.split('/')).length !== 3){
                  $ws.single.ioc.resolve('ILogger').log("DateRange", 'Incorrect date format');
                  return new Date();
               }
               if(endDay){
                  return new Date(values[2], values[1] - 1, values[0], 23, 59, 59, 999);
               }
               return new Date(values[2], values[1] - 1, values[0]);
            },
            parseDate = function(textDate, endDay){
               if(typeof(textDate) === 'function'){
                  textDate = textDate();
                  if(textDate instanceof Date){
                     return textDate;
                  }
               }
               if(!textDate){
                  return null;
               }
               return parseString(textDate, endDay);
         };
         return [parseDate(this._options.dateFromValue, false), parseDate(this._options.dateToValue, true)];
      },
      /**
       * Обрабатывает пришедшее значение из контекста
       * @param {*} ctxVal Пришедшее значение
       * @private
       */
      _onContextValueReceived: function(ctxVal){
         if(ctxVal !== undefined) {
            this.setValue(ctxVal);
         }
      },
      /**
       * Обработчик смены значения в контексте
       * @param {Object} [event] Событие
       * @param {String} [field] Название изменившегося поля
       * @param {*} [value] Новое значение в контексте
       * @private
       */
      _contextUpdateHandler: function(event, field, value, initiator) {
         if(initiator === this) {
            return;
         }
         var
            name = this._options.name,
            self = this,
            checkDate = function(date){
               if(date instanceof Date){
                  return date;
               }
               else if(typeof(date) === 'string'){
                  return self._dateControls[0] ? self._dateControls[0].strToDate(date) : Date.fromSQL(date);
               }
               return date;
            },
            date0 = checkDate(this._context.getValue(this.getDateFromName())),
            date1 = checkDate(this._context.getValue(this.getDateToName()));
         if(name !== '' && this._context) {
            // Если нам пришел field - значит это onFieldChange
            if(field) {
               value = checkDate(value);
               if(field === name){ // Если это наше поле - обновимся
                  this._onContextValueReceived(value);
               }
               else if(field === this.getDateFromName()){
                  this._setRange(value, date1);
               }
               else if(field === this.getDateToName()){
                  this._setRange(date0, value);
               }
            }
            else{
               var mainValue = this._context.getValue(name);
               if(mainValue !== undefined){
                  this._onContextValueReceived(mainValue);
               }
               else{
                  if(date0 !== undefined || date1 !== undefined){
                     this._onContextValueReceived([date0, date1]);
                  }
               }
            }
         }
      },
      /**
       * Инициализирует контрол
       */
      init: function(){
         $ws.proto.DateRangeChoose.superclass.init.apply(this, arguments);
         this._initDateContainer();
      },
      setDateFromValue: function(dateFromValue){
         this.setRange(dateFromValue, this._range[1]);
      },
      setDateToValue: function(dateToValue){
         this.setRange(this._range[0], dateToValue);
      },
      _createTextField: function() {
         var self = this,
            text = '<диапазон дат не установлен>';
         if(this._options.dateFromValue && this._options.dateToValue){
            this._state = 2;
            text = this._getRangeTitle();
         }
         this._container.append(this._textField = $('<div class="ws-date-range-choose-text">' + text + '</div>')
            .bind('click', function(){
               if(self._options.enabled){
                  self._showMenu(0);
               }
            }));
         this._textField.addClass(this._options.enabled ? 'ws-enabled' : 'ws-disabled');
      },
      /**
       * Инициализирует контейнер - или создаёт нужный текст, или начинает создавать контролы ввода даты
       * @private
       */
      _initDateContainer: function(){
         if(this._options.textView){
            this._createTextField();
         }
         else {
            this._createControlsBlock();
         }
      },
      /**
       * Регистрируется у родителя. В данном случае также очищает табиндекс, так как не нужен он тут, нужен на полях ввода даты
       * @param {$ws.proto.AreaAbstract} parent Родитель контрола
       * @private
       */
      _registerToParent: function(parent){
         if(this._options.tabindex){
            this._options.tabindex = parseInt(this._options.tabindex, 10);
         }
         if(!this._options.textView){
            this._fieldsTabindex = this._options.tabindex;
            this.setTabindex(false, true);
         }
         $ws.proto.DateRangeChoose.superclass._registerToParent.apply(this, arguments);
      },
      _changeWidthMovingControlsBlock: function(){
         this._movingControlsBlock.width(this._dateControls[0].getContainer().find('.ws-field').outerWidth()
            + $ws._const.DateRangeChoose.separatorWidth
            + this._dateControls[1].getContainer().find('.ws-field').outerWidth());
      },

      /**
       * Создаёт блок с полями даты
       */
      _createControlsBlock: function(){
         if(this._movingControlsBlock) {
            return;
         }
         var self = this,
             inputBlock = this._container.find('.ws-date-range-choose-input-block');
         if (inputBlock.length === 0){
         this._container.append(this._movingControlsBlock = $('<div class="ws-date-range-choose-input-block ws-' +
            (this._options.enabled ? 'enabled' : 'disabled') + '"></div>'));
         }
         else{
            this._movingControlsBlock = inputBlock;
         }

         var parent = this.getParent();
         if(parent){
            this._movingControlsBlock.bind('keydown', function(e){
               if(self._menuShowed && e.which === $ws._const.key.tab){
                  return parent.moveFocus(e);
               }
               else if(e.which === $ws._const.key.f7 && self._options.enabled){
                  e.preventDefault();
                  self._toggleMenu(0);
                  return false;
               }
               else if(e.which === $ws._const.key.esc && self._menuShowed){
                  self._hideMenuAndMoveFocus(0);
               }
               return self._options.enabled;
            });
         }

         var block = $('<div class="ws-date-range-choose-block"></div>').appendTo(self._movingControlsBlock);

         //TODO: переделать на родителя - DateRange, а то приходится извратами заниматься, чтоб isVisible у FieldDate этого
         //правильно работало и учитывало видимость родителя (DateRange)
         if (this._options.renderStyle === 'classic'){
            for(var i = 0; i < 2; ++i){
               this._rangeMarks.push($('<div class="ws-date-range-choose-' + (i === 0 ? 'start' : 'end') + '-selection"></div>'));
               (function(j){
                  var instance = new FieldDate({
                     mask: self._options.mask,
                     parent: self.getParent(),
                     calendar: false,
                     width: 'auto',
                     element: block,
                     tabindex: self._fieldsTabindex ? self._fieldsTabindex + j : false,
                     name: self._options[j === 0 ? 'dateFromName' : 'dateToName'],
                     value: self._range[j] ? new Date(self._range[j]) : null,
                     enabled: self._options.enabled,
                     linkedContext: self.getLinkedContext(),
                     subcontrol: true,
                     handlers: {
                        'onChange': function(eventState, date){
                           if(date !== null && self._range[j] !== null){
                              if(self._range[j].getTime() === date) {
                                 return;
                              }
                           }

                           var wasNull = self._range[j] === null;
                           self._range[j] = date;
                           if(date === null && !wasNull){
                              --self._state;
                              if(self._state < 0){
                                 self._state = 0;
                              }
                              self._rangeEndAt = j;
                           }
                           else{
                              if(self._range[0] && self._range[1]) {
                                 self._state = self._range[0] <= self._range[1] ? 2 : 0;
                              } else if(self._range[0] || self._range[1]){
                                 self._state = 1;
                                 self._rangeEndAt = self._range[j] === null ? j : 1 - j;
                              } else{
                                 self._state = 0;
                              }
                           }
                           self._updateRange();
                           self._updateSelection();
                           self._rangeReady();
                        },
                        'onActivated': function(){
                           if(self._options.enabled){
                              self._toggleMenu(j);
                           }
                        },
                        'onFocusIn': function(){
                           self._movingControlsBlock.addClass('has-focused-children');
                        },
                        'onFocusOut': function(event, destroyed, focused){
                           self._movingControlsBlock.removeClass('has-focused-children');
                           if(self._menuShowed && focused !== self._dateControls[0] && focused !== self._dateControls[1]){
                              self._hideMenu();
                           }
                        }
                     }
                  });

                  var lastSetActive = instance.setActive;
                  instance.setActive = function(enabled) {
                     if(!enabled) {
                        self.validate();
                     }
                     lastSetActive.apply(this, arguments);
                  };
                  instance.validate = function(){
                     var vRes = $ws.proto.FieldDate.prototype._invokeValidation.apply(this, arguments);
                     self._validationErrors[j] = !vRes.result;
                     if(vRes.errors.length > 0){
                        self._toggleError(true, vRes.errors);
                     }
                     return vRes.result;
                  };
                  var previous = instance._notFormatedVal;
                  // Не понимаю пока как по-другому впихнуть поддержку времени в поле, которое отображается без времени.
                  instance._notFormatedVal = function(getFull) {
                     var
                        res = previous.apply(instance, arguments);
                     if(j==1 && res instanceof Date) {
                        res.setHours(23, 59, 59, 999);
                     }
                     return res;
                  };

                  // Подменяем методы markControl и clearMark у инстансов FieldDate'ов DateRange'а, чтобы вызвать соответствующие методы себе
                  var previousMC = instance.markControl;
                  instance.markControl = function() {
                     previousMC.apply(this, arguments);
                     self._movingControlsBlock.addClass('ws-validation-error');
                     self._container.addClass('ws-validation-error');
                  };
                  var previousCM = instance.clearMark;
                  instance.clearMark = function() {
                     previousCM.apply(this, arguments);
                     self._movingControlsBlock.removeClass('ws-validation-error');
                     self._container.removeClass('ws-validation-error');
                  };
                  self._dateControls.push(instance);
                  self.getLinkedContext().setValue(self._options[j === 0 ? 'dateFromName' : 'dateToName'], self._range[j], undefined, this);
                  if(j === 1){
                     self._notifyOnSizeChanged(true);
                     self._datesDeferred.callback();
                     if(self._range[0] && self._range[1]){
                        self._state = 2;
                     }
                     self._notify('onReady');
                  }

                  if(j === 0){
                     self._movingControlsBlock.append('<div class="ws-date-range-choose-block delimeter"></div>')
                        .bind('click', function(){
                           if(self._options.enabled){
                              self._toggleMenu(0);
                           }
                        });
                  }
               })(i);
            }
         }

         if(this._options.renderStyle === 'asLink'){
            if (self._options.fastSelectionPeriod){
               self._movingControlsBlock.append($('<div class="icon-16 icon-DayBackward icon-primary action-hover ws-date-range-choose-fastPeriod-leftIcon ws-date-range-choose-fastPeriod"></div>')
                  .bind('click', null, function(e){
                     self._fastPeriodSelection("Back");
                  }));
            }
            var instance = $('<div></div>').addClass('ws-date-range-choose-block').appendTo(self._movingControlsBlock),
               asLinkButton = new Button({
                  element: instance,
                  className: 'ws-date-range-choose-asLink',
                  name: 'asLinkButton',
                  renderStyle: 'asLink',
                  tooltip: 'Выбрать период',
                  caption: 'Выбрать период',
                  handlers: {
                     'onActivated': function() {
                        if(self._options.enabled){
                           self._toggleMenu(0);
                        }
                     }
                  }
               });
            self._captionAsLinkBlock = asLinkButton.getContainer().find('.ws-button-caption');
            if (self._options.fastSelectionPeriod){
               self._movingControlsBlock.append($('<div class="icon-16 icon-DayForward icon-primary action-hover ws-date-range-choose-fastPeriod-rightIcon ws-date-range-choose-fastPeriod"></div>')
               .bind('click', null, function(e){
                  self._fastPeriodSelection("Forwards");
               }));
               self._captionAsLinkBlock.addClass('ws-date-range-bold-text');
               self._createMenu();
            }
            self._setStateType(self._range[0], self._range[1]);
            self._movingControlsBlock.find('.ws-date-range-choose-fastPeriod').toggleClass('ws-hidden', self._stateType === 0);
            self._changeTextForAsLinkStyle();
         }

         self._movingControlsBlock.append("<div class='ws-date-range-choose-input-block-text ws-hidden'>Выбор периода</div>");
      },
      _fastPeriodSelection: function(direction){
         var quarterIndex,
            firstDate,
            lastDate,
            moveFirstDate,//Вспомогательная переменная для расчета изменения недели
            moveLastDate;//Вспомогательная переменная для расчета изменения недели
         //Тип выбранного диапазона: 0 - произвольный период, 1 - месяц, 2 - квартал, 3 - год 4 - неделя 5 - день
         switch (this._stateType){
            case 1:
               this._currentMonth += direction === "Forwards" ? 1 : -1;
               this._pickMonth();
              break;
            case 2:
               if (direction === "Forwards"){
                  quarterIndex = ((this._range[1].getMonth() / 3) | 0) + 2; //+1 - индексация id месяцев начинается с 1, +1 - берем следующий квартал для выделения, а не текущий. Итог: +2
                  quarterIndex = quarterIndex > 4 ? 1 : quarterIndex;
                  this._currentMonth += 3;
                  this._isWrongMonth();
               }
               else{
                  quarterIndex = ((this._range[0].getMonth() / 3) | 0); //+1 - индексация id месяцев начинается с 1, -1 - берем предыдущий квартал для выделения, а не текущий. Итог: +0
                  quarterIndex = quarterIndex < 1 ? 4 : quarterIndex;
                  this._currentMonth -= 3;
                  if (this._isWrongMonth())
                  {
                     this._currentMonth = 9;
                  }
               }
               this._pickQuarter(this._currentMonth, "quarter" + quarterIndex);
               break;
            case 3:
               this._currentYear += direction === "Forwards" ? 1 : -1;
               this._pickYear();
               break;
            case 4:
               if (direction === "Forwards"){
                  //При перемещении вперед на неделю, в сравнении с текущим _range[1] первая дата увеличивается на 1 день, вторая на 7
                  moveFirstDate = 1;
                  moveLastDate = 7;
               }
               else{
                  //При перемещении назад на неделю, в сравнении с текущим _range[1] первая дата уменьшается на 13 дней, вторая на 7
                  moveFirstDate = -13;
                  moveLastDate = -7;
               }
               firstDate = new Date(this._range[1].getFullYear(), this._range[1].getMonth(), (this._range[1].getDate() + moveFirstDate));
               lastDate = new Date(this._range[1].getFullYear(), this._range[1].getMonth(), (this._range[1].getDate() + moveLastDate));
               this.setRange(firstDate, lastDate);
               this._notify('onChange', firstDate, lastDate);
               this._setSelectionMonth();//Это должно быть не здесь
               break;
            case 5:
               moveFirstDate = direction === "Forwards" ? 1 : -1;
               firstDate = new Date(this._range[1].getFullYear(),this._range[1].getMonth(), (this._range[1].getDate() + moveFirstDate));
               this.setRange(firstDate, firstDate);
               this._notify('onChange', firstDate, firstDate);
               this._setSelectionMonth();//Это должно быть не здесь
               break;
         }
      },
      _storeOldRange: function() {
         this._stateOld = this._state;
         this._rangeOld[0] = this._range[0];
         this._rangeOld[1] = this._range[1];
      },
      _applyCurrentRange: function() {
         this._stateOld = -1;
      },
      _restoreOldRange: function() {
         if(this._stateOld == -1) {
            // nothing to restore
            return;
         }
         this._state = this._stateOld;
         this._range[0] = this._rangeOld[0];
         this._range[1] = this._rangeOld[1];
         this._updateContextValues(this._range[0], this._range[1]);
         this._stateOld = -1;
      },
      _pickMonth: function(){
         $ws.helpers.clearSelection();
         this._stateType = 1;
         this._selectMonths(this._currentMonth, this._currentMonth + 1);
         this._stateSelectId = 'ws-date-range-choose-month-' + this._currentMonth;
         this._setSelection();
         this._confirm.apply(this, arguments);
      },
      _pickQuarter: function(firstMonth, quarterId){
         this._currentMonth = firstMonth;
         this._setMonth();
         this._selectMonths(firstMonth, firstMonth + 3);
         this._stateType = 2;
         this._stateSelectId = quarterId;
         this._setSelection();
         this._confirm.apply(this, arguments);
      },
      _pickYear: function(){
         this._selectMonths(0, 12);
         this._stateType = 3;
         this._setSelection();
         this._confirm.apply(this, arguments);
      },
      _isWrongMonth: function(){
         if (this._currentMonth > 11)
         {
            this._currentMonth = 0;
            this._currentYear++;
            return true;
         }
         else if (this._currentMonth < 0){
            this._currentMonth = 11;
            this._currentYear--;
            return true;
         }
         return false;
      },
      _showMonth: function(month){
         var tempDate = new Date(this._currentYear, month, 1, 12);
         this._currentMonth = month;
         this._setMonth();
         this._setMonday(tempDate);
      },
      _createMenu: function(){
         if(!this._menuBlock){
            if(this._options.textView){
               this._createControlsBlock();
            }
            this._buildMenu();
         }
      },
      /**
       * Строит меню с календарём, выбором месяцев и т д
       */
      _buildMenu: function(){
         var
            block,
            table,
            row,
            i,
            leftColumn,
            rightColumn,
            columns,
            choosePeriod,
            self = this,
            tableSelector = '<table class="ws-date-range-choose-table-days" border="0" width="100%" cellpadding="0" cellspacing="0"></table>',
            rowSelector = '<tr></tr>';
         this._menuBlock = $('<div class="ws-date-range-choose-menu-block clearfix ws-date-range-choose-choose"></div>')
            .appendTo($('body'))
            .hide();

         //Creating row for date controls
         this._menuControlsRow = $('<div class="ws-date-range-choose-menu-dates"></div>').appendTo(this._menuBlock);

         //Navigation button
         var navigationBtnBlock = $('<div class="ws-date-range-choose-navigation"></div>')
            .appendTo(this._menuControlsRow);
         var navigationButton = new Button ({
            element: navigationBtnBlock,
            name: 'ws-navigationButton',
            tooltip: "Вернуться к текущей дате",
            image: 'sprite:icon-16 icon-Home icon-primary',
            renderStyle: 'asLink',
            menuName: 'ws-navMenu',
            handlers: {
               'onActivated': function() {
                  var tempDate;
                  self._currentDate = new Date();
                  tempDate = new Date(self._currentDate);
                  tempDate.setDate(1);
                  self._currentMonth = self._currentDate.getMonth();
                  self._setMonday(tempDate);
                  self._setMonthAndYear(self._currentDate.getFullYear());
               }
            }
         });

         //Confirm button
         this._confirmButtonContainer = $('<div class="ws-date-range-choose-confirm" title="Подтвердить выбор"></div>')
               .appendTo(this._menuControlsRow);
         var confirmButton = new Button ({
            element: this._confirmButtonContainer,
            className: 'ws-date-range-choose-confirm-button',
            name: 'apply',
            defaultButton: 'true',
            tooltip: "Подтвердить выбор",
            caption: 'Выбрать',
            handlers: {
               'onActivated': function() {
                  self._confirm.apply(self, arguments);
               }
            }
         });
         //Close button
         $('<div class="ws-date-range-choose-close ws-window-titlebar-action close" title="Закрыть"></div>')
               .appendTo(this._menuControlsRow)
               .bind('click', function(){
                  self._hideMenuAndMoveFocus(0);
            });
         //Columns
         columns = $('<div class="ws-date-range-choose-menu-bot"></div>').appendTo(this._menuBlock);

         //Left column
         columns.append(leftColumn = $('<div class="ws-date-range-choose-menu-left"></div>'));

         //Year
         var year;
         leftColumn.append(year = $('<div class="ws-date-range-choose-year"></div>'));
         year.prepend($('<div class="icon-24 icon-DayBackward icon-primary action-hover ws-date-range-choose-leftIcon"></div>')
            .bind('click', null, function(e){
               self._setMonthAndYear(self._currentYear - 1);
            }));
         year.append($('<div class="ws-date-range-choose-current-year">' + this._currentYear + '</div>')
            .bind('click', null, function(e){
               self._pickYear();
               return false;
            }));
         year.prepend($('<div class="icon-24 icon-DayForward icon-primary action-hover ws-date-range-choose-rightIcon"></div>')
            .bind('click', null, function(e){
               self._setMonthAndYear(self._currentYear + 1);
            }));

         //Quarter
         for(i = 0; i < 4; ++i){
            this._toggledButtons.push($('<div class="ws-date-range-choose-menu-quarter" id="quarter' + (i+1) + '" title="' + $ws._const.DateRangeChoose.quarter[i].title + '">' +
               '<div class="ws-date-range-choose-quarter">' + $ws._const.DateRangeChoose.quarter[i].rec + '</div></div>')
               .appendTo(leftColumn)
               .bind('click mouseover', {'month': 3*i}, function(e){
                  if(e.type === 'mouseover'){
                     self._showMonth(e.data.month);
                  }
                  else{
                     self._pickQuarter(e.data.month,this.id);
                     return false;
                  }
               }));
         }

         //Months
         for(i = 0; i < 12; ++i){
            this._toggledButtons.push($('<div class="ws-date-range-choose-month" id="ws-date-range-choose-month-' + i + '">'+ $ws._const.Date.longMonths[i] +'</div>')
               .appendTo(leftColumn)
               .bind('click mouseover', {'month': i}, function(e){
                  if(e.type === 'mouseover'){
                     self._showMonth(e.data.month);
                  }
                  else{
                     self._pickMonth.apply(self, arguments);
                  }
                  return false;
               }));
         }

         //Right Column
         rightColumn = $('<div class="ws-date-range-choose-menu-right"></div>')
            .appendTo(columns);

         //Month
         var month;
         rightColumn.append(month = $('<div class="ws-date-range-choose-monthSelector"></div>'));
         month.prepend($('<div class="icon-24 icon-DayBackward icon-primary action-hover ws-date-range-choose-leftIcon"></div>')
            .bind('click', null, function(e){
               self._currentMonth--;
               if (self._isWrongMonth()){
                  self._setYear(self._currentYear);
                  self._setSelection();
               }
               self._setMonth();
            }));
         month.append($('<div class="ws-date-range-choose-current-month">' + $ws._const.Date.longMonths[this._currentMonth] + '\' ' + this._currentYear % 100 + '</div>')
            .bind('click', null, function(){
               self._pickMonth.apply(self , arguments);
            }));
         month.prepend($('<div class="icon-24 icon-DayForward icon-primary action-hover ws-date-range-choose-rightIcon"></div>')
            .bind('click', null, function(e){
               self._currentMonth++;
               if (self._isWrongMonth()){
                  self._setYear(self._currentYear);
                  self._setSelection();
               }
               self._setMonth();
            }));

         //Days of week
         rightColumn.append(block = $('<div class="ws-date-range-choose-days"></div>'));
         block.append(table = $(tableSelector));
         table.append(row = $(rowSelector));
         for(i = 0; i < 7; ++i){
            row.append('<td class="ws-date-range-choose-day">' + $ws._const.Date.daysSmall[(i + 1) % 7] + '</td>');
         }
         //Calendar
         rightColumn.append(this._calendarBlock = $('<div class="ws-date-range-choose-calendar"></div>'));
         var tempDate = new Date();
         tempDate.setDate(1);
         this._setMonday(tempDate);
         this._daysScroller = this._createScroller(this._calendarBlock, false, tempDate);

         //ChoosePeriodButton
         $('<div class="ws-date-range-choose-TypeSelection" title="Выбрать произвольный период"></div>')
            .appendTo(rightColumn);
         this._choosePeriod = new FieldCheckbox({
            element: rightColumn.find('.ws-date-range-choose-TypeSelection'),
            name: 'date-range-choose-TypeSelection',
            cssClassName: 'classic',
            tabindex: 3,
            caption: 'Произвольный период',
            value: false,
            handlers: {
               onValueChange: function(event, value){
                  self._selectionType = value ? 'period' : 'week';
                  self._state = 2;
                  //Возможно тут еще нужно стереть то, что выбрал пользователем от первого клика...
               }
            }
         });

         //Хак из-за того, что currentYear может меняться, если начальная дата была не в текущем году
         self._currentDate = new Date();

         if (!this._options.showQuarter){
            this.toggleQuarter(false);
         }

         if (!this._options.showCustomPeriod){
            this.toggleCustomPeriod(false);
         }
      },
      /**
       * Отображаем/Скрываем кнопку подтверждения выбора
       * @param {Boolean} toggle
       */
      _toggleConfirmButton: function(toggle){
//         Пока это не нужно
//         this._confirmButtonContainer.toggleClass('ws-hidden',toggle);
      },
      /**
       * Сохраняем выбор
       * @param {Object} self
       */
      _confirm: function(){
         this._applyCurrentRange();
         // Если была выбрана лишь одна дата, то вторая выбирается без клика по дню
         this._state = 2;
         this._updateContextValues(this._range[0], this._range[1]);
         this._hideMenuAndMoveFocus(0);
         this._notify('onChange', this._range[0], this._range[1]);
         this._notifyOnValueChange([this.getValue()]);
      },
      /**
       * Показывает меню. Требует номер инпута, так как из-за перестройки фокус уходит и его нужно вернуть
       * @param {Number} controlNumber Номер контрола FieldDate, который сейчас является текущим
       */
      _showMenu: function(controlNumber){
         if (!this._options.fastSelectionPeriod){
            this._createMenu();
         }
         if(!this._menuShowed){
            this._storeOldRange();
            if(this._state === 2){
               var tempDate = new Date(this._range[0]);
               this._currentMonth = tempDate.getMonth();
               this._currentYear = tempDate.getFullYear();
               this._setYear(this._currentYear);
               tempDate.setDate('1'); //Устанавливаем 1 число, чтобы  показ календаря начинался с начала месяца
               tempDate = this._setMonday(tempDate);
               this._daysScroller.setDate(tempDate);
            }
            this._menuBlock.show();
            this._setMenuPosition();
            this._prevMonth = undefined;
            this._daysScroller.drawCalendar();
            if (this._stateType < 2){
               this._daysScroller._selectMonthPeriod();
            }
            this._movingControlsBlock.prependTo(this._menuControlsRow);
            this._menuShowed = true;
            if (this._options.renderStyle === 'classic'){
               this._dateControls[controlNumber].setActive(true);
            }
            //this._updateRangeTitle();
            this.clearMark();
            if(this._errorMessage){
               this._toggleError(true, this._errorMessage);
            }
            this._container.trigger('wsSubWindowOpen');
            this._setMonth();
            this._changeCaption(true);
         }
      },
      /**
       * Устанавливает позицию меню так, как будет хорошо
       */
      _setMenuPosition: function(){
         var offset = this._container.offset(),
            menuWidth = this._menuBlock.outerWidth(),
            menuHeight = this._menuBlock.outerHeight();
         offset.left -= $ws._const.DateRangeChoose.containerSpace;
         for(var c in offset){
            if(offset.hasOwnProperty(c)){
               offset[c] += $ws._const.DateRangeChoose.menuOffset[c];
            }
         }
         $ws.helpers.positionInWindow(offset, menuWidth, menuHeight);
         this._menuBlock.css(offset);
      },
      /**
       * Скрывает меню
       */
      _hideMenu: function(){
         this._changeCaption(false);
         this._toggleConfirmButton(true);
         this._movingControlsBlock.find('.ws-date-range-choose-fastPeriod').toggleClass('ws-hidden', this._stateType === 0);

         if(this._menuBlock){
            this._menuBlock.hide();
            this._restoreOldRange();
            if(!this._options.textView){
               this._movingControlsBlock.prependTo(this._container);
            }
            else{
               this._textField.html(this._state > 0 ? this._getRangeTitle() : '<' + 'диапазон дат не установлен>');
            }
            this._menuShowed = false;
            if(this._daysScroller){
               this._daysScroller.stopTimers();
            }
            if(this._yearScroller){
               this._yearScroller.stopTimers();
            }
            this.validate();
            this._notify('onMenuHide');
            this._container.trigger('wsSubWindowClose');
         }
      },
      /**
       * Скрывает меню и перемещает фокус в одно из полей ввода
       * @param {Number} controlNumber Номер поля ввода, 0 или 1
       * @private
       */
      _hideMenuAndMoveFocus: function(controlNumber){
         this._hideMenu();
         if(this._dateControls[controlNumber]){
            this._dateControls[controlNumber].setActive(true);
         }
      },
      /**
       * В зависимости от текущего состояния, скрывает/показывает меню
       * @param {Number} controlNumber Номер активного контрола FieldDate
       */
      _toggleMenu: function(controlNumber){
         if(this._menuShowed){
            this._updateContextValues(this._range[0], this._range[1]);
            this._hideMenu();
         }
         else{
            this._showMenu(controlNumber);
         }
      },
      /**
       * Меняет заголовок
       * @param {Boolean} show  true - показать заголовок для открытого календаря | false - для закрытого
       */
      _changeCaption: function(show){
         $.each(this._movingControlsBlock.children(), function(index, child) {
            $(child).toggleClass('ws-hidden', show);
         });
         this._movingControlsBlock.find(".ws-date-range-choose-input-block-text").toggleClass('ws-hidden', !show);
         this._changeTextForAsLinkStyle();
      },
      _changeTextForAsLinkStyle: function(){
         if (this._options.renderStyle === 'asLink'){
            if (this._state === 1){
               return;
            }
            var startDate = {
                  year : this._range[0].strftime('%y'),
                  month :this._range[0].strftime('%b').toLowerCase() + ".",
                  day: this._range[0].strftime('%d')
               },
               endDate = {
                  year : this._range[1].strftime('%y'),
                  month : this._range[1].strftime('%b').toLowerCase() + ".",
                  day: this._range[1].strftime('%d')
               },
               text;
            var result = this._notify('onVisualize', this._range[0], this._range[1]);
            if (result && (typeof result === 'string')) {
               text = result;
            } else {
               //_stateType Тип выбранного диапазона: 0 - произвольный период, 1 - месяц, 2 - квартал, 3 - год 4 - неделя 5 - день
               switch (this._stateType){
                  case 1:
                     text = this._range[1].strftime('%B') + " '" + endDate.year;
                     break;
                  case 2:
                     text = this._range[1].strftime('%Q') + " квартал '" + endDate.year;
                     break;
                  case 3:
                     text = this._range[1].strftime('%Y');
                     break;
                  default:
                     if (startDate.year === endDate.year){
                        if (startDate.month === endDate.month){
                           if (startDate.day === endDate.day){
                              text = startDate.day + " " + startDate.month + " '" + startDate.year;
                           }
                           else{
                              text = startDate.day + " - " + endDate.day + " " + startDate.month + " '" + startDate.year;
                           }
                        }
                        else{
                           text = startDate.day + " " + startDate.month + " - " + endDate.day + " " + endDate.month + " '" + startDate.year;
                        }
                     }
                     else{
                        text = startDate.day + " " + startDate.month + " '" + startDate.year + " - " + endDate.day + " " + endDate.month + " '" + endDate.year;
                     }
               }
            }
            this._setCaptionForAsLinkStyle(text);
         }
      },
      _setCaptionForAsLinkStyle: function(text){
        if (this._captionAsLinkBlock){
           this._captionAsLinkBlock.text(text);
        }
      },
      /**
       * <wiTag group="Управление">
       * Переводит фокус на контрол. Переопределён из-за наличия дочерних контролов
       * @param {Boolean} active
       */
      setActive: function(active){
   //      $ws.proto.DateRangeChoose.superclass.setActive.apply(this, arguments);
         this._container.removeClass('ws-has-focus');
         var self = this;
         this._datesDeferred.addCallback(function(){
            self._dateControls[0].setActive(active);
         });
      },
      /**
       * Меняет дату, чтобы она стала первым понедельником, который меньше или равен указанной даты
       * @param {Date} date
       * @returns {Date}
       */
      _setMonday: function(date){
         var offset = date.getDay();
         if(offset === 0){
            offset = 7;
         }
         if(offset > 1){
            date.setDate(date.getDate() - offset + 1);
         }
         return date;
      },
      _onSizeChangedBatch: function() {
         this._dateControls[0]._onSizeChangedBatch();
         this._dateControls[1]._onSizeChangedBatch();
         this._changeWidthMovingControlsBlock();
         return true;
      },
      /**
       * Выделяет месяцы текущего года
       * @param {Number} month0  Номер месяца - начало выделения
       * @param {Number} month1  Номер месяца, следующего после конца выделения
       * @param {jQuery} event   Событие - берём из него ctrlKey и shiftKey, если они есть, то выделение добавляется
       */
      _selectMonths: function(month0, month1){
         var tempDates = [new Date(this._currentYear, month0, 1, 12), new Date(this._currentYear, month1, 0, 12)],
               funcs = ['getYear', 'getMonth', 'getDate'],
               equal = true;
         this._currentYear = tempDates[0].getFullYear();
         this._currentMonth = tempDates[0].getMonth();
         for(var j = 0; j < 2; ++j){
            for(var i = 0; i < funcs.length; ++i){
               if(!this._range[j] || this._range[j][funcs[i]]() !== tempDates[j][funcs[i]]()){
                  equal = false;
                  j = 2;
                  break;
               }
            }
         }
         this._range[0] = tempDates[0];
         this._range[1] = tempDates[1];

         this._state = 2;
         this._updateRange();
         this._updateSelectionAndFocus();
         this._setSelection();
      },
      /**
       * Обновляет выделение
       */
      _updateSelection: function(){
         if(this._yearScroller){
            this._yearScroller.clearSelection();
            this._yearScroller.updateSelection();
         }
         if(this._daysScroller){
            this._daysScroller.clearSelection();

            this._daysScroller.updateSelection();
         }
      },
      _updateContextValues: function(from, to) {
         var obj = {};
         obj[this._options.dateFromName] = from;
         obj[this._options.dateToName] = to;
         this.getLinkedContext().setValue(obj, undefined, this);
      },
      /**
       * Обновляет значения в контролах выбора даты
       * @private
       */
      _updateDatesValues: function(){
         var val, from, to;
         if(this._state > 0){
            val = this._range[0];
         }
         else{
            val = null;
         }
         from = val;
         if(this._state > 0){
            val = this._range[1];
         }
         else{
            val = null;
         }
         to = val;
         this._updateContextValues(from, to);
      },
      /**
       * Обновляет выделение и перемещает фокус
       * @param {Boolean} [noInputs] Если установлен, то контролы для ввода данных обновляться не будут
       * @protected
       */
      _updateSelectionAndFocus: function(noInputs){
         this._updateSelection();
         if(!noInputs){
            this._updateDatesValues();
         }
         if(!noInputs && this._dateControls[0]){
            var active = this._dateControls[0].isActive();
            this._dateControls[active ? 0 : 1].setActive(true);
         }
      },
      /**
       * Проверяет диапазон на упорядоченность, если нет - переворачивает даты наоборот
       */
      _checkRange: function(){
         if(this._range[1] < this._range[0]){
            var tempDate = this._range[1];
            this._range[1] = this._range[0];
            this._range[0] = tempDate;
         }
      },
      /**
       * Обновляет интервал, чтобы он соответствовал концу дня и началу дня, и записывает всё это в контекст
       * @protected
       */
      _updateRange: function(){
         if(this._range[0]){
            this._range[0].setHours(12, 0, 0, 0);
         }
         if(this._range[1]){
            this._range[1].setHours(23, 59, 59, 999);
         }
         var context = this.getLinkedContext();
         this._updateContextValues(this._range[0], this._range[1]);
      },
      /**
       * Срабатывает при готовности двух дат. Валидирует значения, оповещает о смене значения
       */
      _rangeReady: function() {
         this._notify('onChange', this._range[0], this._range[1]);
         this._notifyOnValueChange([this.getValue()]);
      },
      /**
       * <wiTag group="Данные">
       * Валидирует контрол
       * @returns {Boolean}
       */
      validate: function(){
         var previousStatus = this._prevValidationResult;
         if(this._datesDeferred.isSuccessful()){
            this._dateControls[0].validate();
            this._dateControls[1].validate();
            var vRes = $ws.proto.DateRangeChoose.prototype._invokeValidation.apply(this, arguments);
            this._toggleError(vRes.errors.length > 0, vRes.errors);
            this._notify('onValidate', !!vRes.result, vRes.errors, previousStatus);
            this._prevValidationResult = !!vRes.result;
            return vRes.result;
         }
         else{
            return 'Контрол не готов!';
         }
      },
      /**
       * Возвращает строку с текстовым описанием выбранного диапазона
       * @returns {String}
       */
      _getRangeTitle: function(){
         var title = '';
         if(this._range[0] && this._range[1]){
            var dates = [this._range[0].getDate(), this._range[1].getDate()],
                  months = [this._range[0].getMonth(), this._range[1].getMonth()],
                  years = [this._range[0].getFullYear(), this._range[1].getFullYear()],
                  tempDate = new Date(this._range[1]);
            tempDate.setDate(tempDate.getDate() + 1);
            if(years[0] !== years[1]){
               if(months[0] === 0 && months[1] === 11 &&
                     dates[0] === 1 && dates[1] === 31){
                  title = years[0] + " - " + years[1];
               }
               else if(dates[0] === 1 && (new Date(years[1], months[1], dates[1] + 1, 12)).getMonth() !== months[1]){
                  title = $ws._const.Date.longMonthsSmall[months[0]] + " " + years[0] + " - " +
                        $ws._const.Date.longMonthsSmall[months[1]] + " " + years[1];
               }
               else{
                  title = dates[0] + " " + $ws._const.Date.monthsWithDays[months[0]] + " " + years[0] + " - " +
                        dates[1] + " " + $ws._const.Date.monthsWithDays[months[1]] + " " + years[1];
               }
            }
            else if(this._range[1].getMonth() != this._range[0].getMonth()){
               if(dates[0] === 1 && tempDate.getDate() === 1){
                  var nextMonth = tempDate.getMonth();
                  if(months[0] % 3 === 0 && nextMonth % 3 === 0){
                     if(nextMonth === 0){
                        nextMonth = 12;
                     }
                     if(nextMonth - months[0] === 12){
                        title = years[0];
                     }
                     else if((nextMonth - months[0]) === 6 && months[0] % 6 === 0){
                        title = (nextMonth / 6) + " полугодие " + years[0];
                     }
                     else{
                        var numbers = ['I', 'II', 'III', 'IV'];
                        if(nextMonth - months[0] > 3){
                           title = numbers[months[0] / 3] + " - " + numbers[(nextMonth / 3) - 1] + " квартал " +
                                 years[0];
                        }
                        else{
                           title = numbers[months[0] / 3] + " квартал " + years[0];
                        }
                     }
                  }
                  else{
                     title = $ws._const.Date.longMonthsSmall[months[0]] + " - " +
                           $ws._const.Date.longMonthsSmall[months[1]] + " " + years[0];
                  }
               }
               else{
                  title = dates[0] + " " + $ws._const.Date.monthsWithDays[months[0]] + " - " +
                        dates[1] + " " + $ws._const.Date.monthsWithDays[months[1]] + " " +
                        years[0];
               }
            }
            else if(this._range[1].getDate() != this._range[0].getDate()){
               if(dates[0] === 1 && tempDate.getDate() === 1){
                  title = $ws._const.Date.longMonthsSmall[months[0]] + " " + years[0];
               }
               else{
                  title = dates[0] + " - " + dates[1] + " " + $ws._const.Date.monthsWithDays[months[0]] + " " +
                        years[0];
               }
            }
            else{
               title = dates[0] + " " + $ws._const.Date.monthsWithDays[months[0]] + " " + years[0];
            }
         }
         else if(this._range[0]){
            title = 'C ' + this._range[0].strftime('%e %q %Y года');
         }
         else if(this._range[1]){
            title = 'По ' + this._range[1].strftime('%e %q %Y года');
         }
         return title;
      },
      /**
       * Обновляет заголовок менюшки
       */
      _updateRangeTitle: function(){
         if(this._rangeTitle){
            this._rangeTitle.html(this._getRangeTitle());
         }
      },
      /**
       * Меняет состояние показа ошибки
       * @param {Boolean}        hasError       Есть ошибка/нет ошибки
       * @param {String|Array}   [errorMessage] Сообщение об ошибке, если есть ошибка
       */
      _toggleError: function(hasError, errorMessage){
         if(hasError || this._validationErrors[0] || this._validationErrors[1]){
            var message = hasError ? errorMessage : this._errorMessage;
            if(this._menuShowed){
               // Делаем то, что должно происходить в markControl(). Может стоит перегрузить его тут?
               this._calcValidationErrorCount(message);
               this._calcPrevValidationResult();
               this._setErrorMarker(message);
            }
            else{
               this.markControl(message);
            }
            if(hasError){
               this._errorMessage = errorMessage;
            }
         }
         else{
            this._errorMessage = '';
            this.clearMark();
            if(this._errorMarker){
               this._errorMarker.hide();
            }
         }
      },
      /**
       * Устанавливает подсказку для картинки-ошибки
       * @param {String|Array} errorMessage Текст ошибки
       */
      _setErrorMarker: function(errorMessage){
         if(this._errorMarker){
            var message = errorMessage && (typeof errorMessage == 'string' || errorMessage instanceof Array) ?
                  errorMessage :
                  this._options.errorMessageFilling;
            this._createErrorMessage(message);
            this._errorMarker.show();
         }
      },
      /**
       * Просчитывает позицию дня года в блоке для выбора месяцев
       * @param {Date} date Дата, для которой нужен просчёт
       */
      _getDatePosition: function(date){
         var year = date.getFullYear(),
               tempDate = new Date(year, 0, 1, 12),
               days = ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365);
         return (date - tempDate) / (1000 * 60 * 60 * 24 * days);
      },
      /**
       * Просчитывает номер даты, которая сейчас преобладает в календаре (если календарь отображает один год, то без разницы что, иначе - нужно посчитать число дней, которые приходятся на соответствующие года)
       * @returns {Number}
       */
      _intervalNumber: function(){
         var drawedDays = this._daysScroller.drawedDays;
         if(drawedDays[0].getYear() != drawedDays[1].getYear()){
            var times = [0, 0];
            var tempDate = new Date(drawedDays[0].getFullYear(), 11, 31);
            times[0] = tempDate - drawedDays[0];
            tempDate = new Date(drawedDays[1].getFullYear(), 0, 1);
            times[1] = drawedDays[1] - tempDate;
            return (times[0] < times[1] ? 1 : 0);
         }
         return 0;
      },
      /**
       * Устанавливает текущий год и месяц
       * @param {Number} year Номер нового года
       */
      _setMonthAndYear: function(year){
         $ws.helpers.clearSelection();
         this._setYear(year);
         this._setMonth();
         this._setSelection();
      },
      /**
       * Устанавливает текущий год
       * @param {Number} year Номер нового года
       */
      _setYear: function(year){
         var diff = year - this._currentYear,
               drawedDays = this._daysScroller.drawedDays;
         this._currentYear = year;
         drawedDays[0].setFullYear(drawedDays[0].getFullYear() + diff);
         if (this._menuBlock) {
            this._menuBlock.find('.ws-date-range-choose-current-year').text(year);
         }
         var tempDate = new Date(this._currentYear, this._currentMonth, 1, 12);
         this._setMonday(tempDate);
         this._daysScroller.setDate(tempDate);
      },
      /**
       * Устанавливает текущий месяц
       * * @param {Boolean} selectMonth Выделять ли месяц в левом меню
       */
      _setMonth: function(selectMonth){
         this._stateType = selectMonth ? 1 : this._stateType;
         var tempDate = new Date(this._currentYear, this._currentMonth, 1, 12);
         this._setMonday(tempDate);
         this._daysScroller.setDate(tempDate);
         if (this._menuBlock) {
            this._menuBlock.find('.ws-date-range-choose-current-month').text($ws._const.Date.longMonths[this._currentMonth] + ' \'' + (this._currentYear % 100 < 10 ? '0' + this._currentYear % 100 : this._currentYear % 100));
         }
      },
      _setSelectionMonth: function(){
         this._stateSelectId = 'ws-date-range-choose-month-' + this._currentMonth;
         this._setSelection();
      },
      /**
       * Устанавливает текущий месяц
       * * @param {Boolean} selectMonth Выделять ли месяц в левом меню
       */
      _setSelection: function(){
         $ws.helpers.clearSelection();
         if (this._menuBlock) {
            this._menuBlock.find('.ws-date-range-choose-select').removeClass('ws-date-range-choose-select');

            //Если мы выбранный и текущий просматриваемый год различны, то выходим
            if (this._stateType === 4 && this._range[0] && this._range[1] &&
                  this._range[0].getFullYear() !== this._currentYear &&
                  this._range[1].getFullYear() !== this._currentYear) {
               return;
            }

            if (this._stateType === 3){ //Если был выбран год
                  this._menuBlock.find('.ws-date-range-choose-current-year').addClass('ws-date-range-choose-select');
            }
            else if (this._stateType === 2) { //Если был выбран квартал
               this._menuBlock.find('#' + this._stateSelectId).addClass('ws-date-range-choose-select');
            }
            else{
               this._daysScroller._selectMonthPeriod();
            }
         }
      },
      /**
       * Обновляет отображение текущего года
       */
      _updateYear: function(){
         //this._yearBlock.html(this._currentYear);
      },
      /**
       * Функция сравнения дат без учёта времени. Вовзвращает true, если первая дата меньше второй
       * @param {Date}     date0    Первая дата
       * @param {Date}     date1    Вторая дата
       * @param {Boolean}  [withDays] Учитывать ли дни
       * @param {Boolean}  [equals]   Нужно ли учитывать равенство
       * @returns {Boolean}
       */
      _dateLesser: function(date0, date1, withDays, equals){
         if(date0.getYear() > date1.getYear()){
            return false;
         }
         else if(date0.getYear() < date1.getYear()){
            return true;
         }
         if(date0.getMonth() > date1.getMonth()){
            return false;
         }
         else if(date0.getMonth() < date1.getMonth()){
            return true;
         }
         return !withDays || (date0.getDate() < date1.getDate()) || (equals && date0.getDate() == date1.getDate());
      },
      /**
       * Создаёт большой объект, который отображает дни/года в строках, может быть прокручен вверх и вниз "бесконечно"
       * @param {jQuery}   container   Объект, внутри которого будет рисовать данные
       * @param {Boolean}  isYear      Будут ли отображаться года, иначе - дни
       * @param {Date}     startDate   Дата, отображаемая при первом показе
       */
      _createScroller: function(container, isYear, startDate){
         var self = this,
            result = {
               rows: [],                                                                     //Строки с данными, соответствуют отображаемым строкам + данные
               drawedDays: [new Date(startDate), new Date(startDate)],                       //Даты, ограничивающие текущее отображение данных
               offset: $ws._const.DateRangeChoose[isYear ? 'startYearOffset' : 'startOffset'],     //Текущий отступ сверху
               table: $('<table class="ws-date-range-choose-table' + (isYear ? ' year' : '') +
                  '" border="0" cellpadding="0" cellspacing="0"></table>')
                     .appendTo(container),                                                   //Таблица, в которой будут строки
               redraw: false,                                                                //Была ли первая торисовка
               clickY: undefined,                                                            //Координата клика мышью
               lastMove: undefined,                                                          //Последнее изменение координаты y
               moveTimer: undefined,                                                         //Если пройдёт время таймера, то считается, что скролла не было
               scrollTimer: undefined,                                                       //Таймер, по которому смещается объект (потянули и отпустили, скролл идёт)
               scrollingOnClick: undefined,                                                  //Скроллился ли календарь при touchstart, если да, то не обрабатываем клик - просто останавливаем сколл
               /**
                * Устанавливает отображаемую дату для скроллера
                * @param {Date} date
                */
               setDate: function(date){
                  for(var i = 0; i < result.rows.length; ++i){
                     result.rows[i].row.remove();
                  }
                  result.drawedDays[0] = new Date(date);
                  result.drawedDays[1] = new Date(date);
                  result.offset = 0;
                  result.rows = [];
                  result.drawCalendar(true);
                  result.stopTimers();
               },
               /**
                * Добавляет к ячейке таблицы (вариант скроллера - года) выделение
                * @param {jQuery}   cell Ячейка
                * @param {Date}     date Дата ячейки
                */
               addYearSelection: function(cell, date){
                  if(self._state === 2){
                     if(date.getYear() >= self._range[0].getYear() && date.getYear() <= self._range[1].getYear()){
                        cell.addClass('selected');
                     }
                  }
               },
               /**
                * Добавляет к ячейке таблицы (варианта скроллера - дни) выделение
                * @param {jQuery}   cell Ячейка
                * @param {Date}     date Дата ячейки
                */
               addCellSelection: function(cell, date){
                  if(self._state === 0 || !self._range[0] || !self._range[1]){
                     return;
                  }
                  if(self._dateLesser(self._range[0], date, true) && self._dateLesser(date, self._range[1], true)){
                     cell.addClass(self._state === 2 ? 'selected' : 'preselected');
                  }
                  for(var i = 0; i < 2; ++i){
                     if(date.getDate() == self._range[i].getDate() && date.getMonth() == self._range[i].getMonth() &&
                           date.getYear() == self._range[i].getYear()){
                        var block = cell.children().eq(0);
                        cell.addClass(self._state === 2 ? 'selected' : 'preselected');
                        block.addClass(i === 0 ? 'start' : 'end');
                        if (self._options.renderStyle === 'classic'){
                           block.prepend(self._rangeMarks[i].show());
                        }
                        self._daysCells.push(block);
                        break;
                     }
                  }
               },
               /**
                * Обновляет выделение в скроллере, перед этим его очищая
                */
               updateSelection: function(){
                  result.clearSelection();
                  while(self._daysCells.length){
                     self._daysCells.pop().removeClass('start end')
                        .find('.ws-date-range-choose-end-selection, .ws-date-range-choose-start-selection')
                        .hide();
                  }
                  if(self._state === 0){
                     return;
                  }
                  for(var i = 0; i < result.rows.length; ++i){
                     var rowContainer = result.rows[i];
                     for(var j = 0; j < rowContainer.cells.length; ++j){
                        var cell = rowContainer.cells[j];
                        if(isYear){
                           result.addYearSelection(cell.element, cell.date);
                        }
                        else{
                           result.addCellSelection(cell.element, cell.date);
                        }
                     }
                  }
               },
               /**
                * Чистит выделение в скроллере
                */
               clearSelection: function(){
                  for(var i = 0; i < result.rows.length; ++i){
                     var rowContainer = result.rows[i];
                     for(var j = 0; j < rowContainer.cells.length; ++j){
                        var cell = rowContainer.cells[j];
                        cell.element.removeClass('selected preselected');
                     }
                  }
               },
               /**
                * Создаёт одну ячейку таблицы (вариант скроллера - дни)
                * @param {Date} date Дата ячейки
                * @returns {jQuery}
                */
               drawDay: function(date){
                  var cell = $('<td class="ws-date-range-choose-date"></td>'),
                        block = $('<div class="ws-date-range-choose-date-block"></div>').appendTo(cell);
                  if(date.getMonth() === self._currentMonth){
                     cell.addClass('month-even');
                  }
                  if(date.getDate() === self._currentDate.getDate() && date.getMonth() === self._currentDate.getMonth() &&
                          date.getYear() === self._currentDate.getYear()){
                     cell.addClass('current');
                  }
                  result.addCellSelection(cell, date);
                  cell.bind('mouseover mouseout mousedown click', {'date': date.getTime()}, function(e){
                     if(e.type === 'mouseover' || e.type === 'mouseout'){
                        $(this).toggleClass('hover', e.type === 'mouseover');
                        if(self._state === 1 && e.type === 'mouseover'){
                           var date1 = new Date(e.data.date),
                              date0 = self._range[1 - self._rangeEndAt];
                           if(date1 < date0){
                              self._rangeEndAt = 0;
                              self._range[1] = date0;
                           }
                           else{
                              self._rangeEndAt = 1;
                              self._range[0] = date0;
                           }
                           self._range[self._rangeEndAt] = date1;
                           result.updateSelection();
                        }
                     }
                     else if (e.type === 'mousedown'){
                        if(self._selectionType === "week"){
                           if (self._stateType === 4 && $(this).hasClass('selected')){
                              result._startPeriodSelection(e.data.date);
                              self._stateType = 5;
                              self._toggleConfirmButton(false);
                           }
                           else{
                              result._selectWeek($(this).parent(2).attr('week'));
                           }
                           result._endSelectionPeriod(e.data.date);
                           result._selectMonthPeriod();
                           result.updateSelection();
                        }
                     }
                     else if (e.type === 'click'){
                        if (self._selectionType === "period"){
                           if (self._state !== 1){
                              result._startPeriodSelection(e.data.date);
                           }
                           else{
                              result._endSelectionPeriod(e.data.date);
                           }
                        }
                     }
                  });

                  block.append('<div class="ws-date-range-choose-date-number">' + date.getDate() + '</div>');
                  var hasMonth = date.getDate() === 1;
                  if(self._state >= 1){
                     for(var i = 0; i < 2; ++i){
                        if(self._range[i] && date.getDate() == self._range[i].getDate() &&
                           self._range[i].getMonth() == date.getMonth() && self._range[i].getYear() == date.getYear()){
                           block.addClass(i === 0 ? 'start' : 'end');
                           if (self._options.renderStyle === 'classic'){
                              block.prepend(self._rangeMarks[i].show());
                           }
                           self._daysCells.push(block);
                           break;
                        }
                     }
                  }
                  return cell;
               },
               _startPeriodSelection: function(eDate){
                  if(!result.scrollingOnClick){
                     self._stateType = 0;
                     self._toggleConfirmButton(false);
                     if(self._state % 2 === 0){
                        self._range[0] = new Date(eDate);
                        self._range[1] = null;
                        self._state = 1;
                        self._rangeEndAt = 1;
                     }
                     self._updateRange();
                     self._updateSelectionAndFocus();
                  }
                  $(this).addClass('ws-date-range-choose-date-number-active');
                  self._menuBlock.find('.ws-date-range-choose-select').removeClass('ws-date-range-choose-select');
                  return false;
               },
               _endSelectionPeriod: function(eDate){
                  if(self._state === 1){
                     //Если вторая граница диапазона не задана, то устанавливаем её
                     if (self._range[1] === null) {
                        self._range[1] = new Date(eDate);
                     }
                     self._state = 2;
                     self._rangeEndAt = 1;
                  }
                  self._updateRange();
                  self._updateSelectionAndFocus();
                  result._selectMonthPeriod();
               },
               _selectMonthPeriod: function(){
                  self._menuBlock.find(".ws-date-range-choose-select").removeClass("ws-date-range-choose-select");
                  self._stateSelectId = this.id;
                  if (!self._range[1]) {
                     return;
                  }
                  for (var i = self._range[0].getMonth(); i <= self._range[1].getMonth(); i++){
                     self._menuBlock.find("#ws-date-range-choose-month-" + i).addClass("ws-date-range-choose-select");
                  }
                  if (self._stateType === 4) {
                     // выделяем месяц январь-декабрь при выборе пограничной недели (1ая и последняя неделя в году)
                     if (self._range[1].getMonth() === 0 && self._currentYear === self._range[1].getFullYear()) {
                        self._menuBlock.find("#ws-date-range-choose-month-" + 0).addClass("ws-date-range-choose-select");
                     }
                     if  (self._range[0].getMonth() === 11 && self._currentYear === self._range[0].getFullYear()) {
                        self._menuBlock.find("#ws-date-range-choose-month-" + 11).addClass("ws-date-range-choose-select");
                     }
                  }
               },
               /**
                * Выделяем целую неделю при наведении на 1 из дней этой недели
                * @param {numberOfWeek} Номер недели
                * @param {toggle} Ставим ли класс hover
                * @returns {Object}
                */
               _hoverWeek: function(numberOfWeek, toggle){
                  self._menuBlock.find('[week=' + numberOfWeek + ']').find('.ws-date-range-choose-date').toggleClass('hover', toggle);
               },
               /**
                * Выбираем целую неделю при наведении на 1 из дней этой недели
                * @param {numberOfWeek} Номер недели
                * @param {toggle} Ставим ли класс hover
                * @returns {Object}
                */
               _selectWeek: function(numberOfWeek){
                  var days = self._menuBlock.find('[week=' + numberOfWeek + ']').find('.ws-date-range-choose-date-number'),
                     fday = parseInt($(days[0]).text(), 10),
                     lday = parseInt($(days[days.length - 1]).text(), 10),
                     fmonth = self._currentMonth,
                     lmonth = self._currentMonth,
                     fyear = self._currentYear,
                     lyear = self._currentYear;

                  self._stateType = 4;
                  self._toggleConfirmButton(false);

                  if(numberOfWeek == 1){
                     if (fday > 1){
                        fmonth--;
                     }
                     if (fmonth < 0){
                        fmonth = 11;
                        fyear--;
                     }
                  }

                  if(numberOfWeek  > 4){
                     if (fday > lday){
                        lmonth ++;
                        if(lmonth > 11){
                           lmonth = 0;
                           lyear++;
                        }
                     }
                  }
                  self._range[0] = new Date(fyear, fmonth, fday, 12);
                  self._range[1] = new Date(lyear, lmonth, lday, 12);
               },
               /**
                * Рисует одну строку с данными (варианот скроллера - дни). Возвращает объект {row: объект с строкой, cells: {element: объект ячейки, date: дата ячейки}}
                * @param {Date} date Дата первого дня в строке
                * @param {numberOfWeek} Номер недели
                * @returns {Object}
                */
               drawMonthRow: function(date,numberOfWeek){
                  var row = $('<tr></tr>'),
                     tempDate = new Date(date),
                     cells = [];

                  row.attr('week',numberOfWeek);
                  for(var i = 0; i < 7; ++i, tempDate.setDate(tempDate.getDate() + 1)){
                     var cell = result.drawDay(tempDate);
                     row.append(cell);
                     cells.push({'element': cell, 'date': new Date(tempDate)});
                  }
                  return {'row': row, 'cells': cells};
               },
               /**
                * Рисует строчку с одним годом (вариант скроллера - года)
                * @param {Date} date Дата года
                */
               drawYearRow: function(date){
                  var row = $('<tr></tr>'),
                     tempDate = new Date(date),
                     cells = [],
                     cell = result.drawYear(tempDate);
                  row.append(cell);
                  cells.push({'element': cell, 'date': new Date(tempDate)});
                  return {'row': row, 'cells': cells};
               },
               _setDateToDrawed: function(indexDrawed, isYear, plus){
                  if(!isYear){
                     result.drawedDays[indexDrawed].setDate(result.drawedDays[indexDrawed].getDate() + plus);
                  }
                  else{
                     result.drawedDays[indexDrawed].setFullYear(result.drawedDays[indexDrawed].getFullYear() + plus / 7);
                  }
               },
               /**
                * Обновляет отрисовку скроллера
                * @param {Boolean} [noAnimation] Не использовать анимацию
                */
               drawCalendar: function(noAnimation){
                  var calendarHeight = container.height(),
                      insertedBefore = 0,
                      rowContainer,
                      drawRow = (isYear ? result.drawYearRow : result.drawMonthRow);

                  //prepending result.rows
                  while(result.offset > 0){
                     ++insertedBefore;
                     result._setDateToDrawed(0, isYear, -7);
                     rowContainer = drawRow(result.drawedDays[0]);
                     result.rows.unshift(rowContainer);
                     result.table.prepend(rowContainer.row);
                     result.offset -= $ws._const.DateRangeChoose.rowHeight;
                  }
                  //appending result.rows
                  var numberOfWeek = 0; //Для выделения недели
                  var hideLastWeek = false;
                  while((result.offset + result.rows.length * $ws._const.DateRangeChoose.rowHeight < calendarHeight) && (numberOfWeek < 6)){
                     numberOfWeek++;
                     //Если в 6-ой неделе дни только следующего месяца, то не рисуем эту неделю]
                     if ((numberOfWeek == 6) && (result.drawedDays[1].getDate() < 7)){
                        hideLastWeek = true;
                     }

                     //Если неделя уже отрисована, но не рисуем ее заново
                     if (self._menuBlock.find('[week='+ numberOfWeek + ']').text()){
                        return;
                     }
                     rowContainer = drawRow(result.drawedDays[1],numberOfWeek);
                     result.rows.push(rowContainer);
                     result.table.append(rowContainer.row);
                     result._setDateToDrawed(1, isYear, +7);
                  }
                  hideLastWeek = numberOfWeek === 0 ? true : hideLastWeek;
                  //removing unused result.rows at bottom
                  while(result.offset + (result.rows.length - 3) * $ws._const.DateRangeChoose.rowHeight > calendarHeight){
                     result.rows.pop().row.remove();
                     result._setDateToDrawed(1, isYear, -7);
                  }
                  //removing unused result.rows at top
                  while(result.offset + $ws._const.DateRangeChoose.rowHeight * 2 < 0){
                     --insertedBefore;
                     result.rows.shift().row.remove();
                     result.offset += $ws._const.DateRangeChoose.rowHeight;
                     result._setDateToDrawed(0, isYear, +7);
                  }

                  //Анимация только после первой отрисоки - дефолтный скролл не требует анимации
                  if(result.redraw){
                     //animate
                     if(insertedBefore){
                        //Если Мы насоздавали записей в начале, то фактический отступ не поменялся
                        result.table.css('margin-top', (result.offset - insertedBefore * $ws._const.DateRangeChoose.rowHeight) + 'px');
                     }
                     if(noAnimation){
                        result.table.stop().css({'margin-top': result.offset + 'px'});
                     }
                     else{
                        result.table.stop().animate({'margin-top': result.offset + 'px'}, 'fast', 'linear');
                     }
                  }

                  if(!isYear){
                     result.updateSelectionMarker();
                     //Updating current month tab
                     var monthsDays = 0,
                        monthIndex = 0,
                        tempDate2 = new Date(result.drawedDays[0]),
                        tempDate = new Date(result.drawedDays[0]);
                     for(var i = tempDate.getMonth(), len = result.drawedDays[1].getMonth(); i != len; i = (i + 1) % 12){
                        var month = tempDate.getMonth();
                        if(month == result.drawedDays[1].getMonth()){
                           tempDate.setDate(result.drawedDays[1].getDate());
                        }
                        else{
                           tempDate.setMonth(month + 1);
                           tempDate.setDate(0);
                        }
                        var days = tempDate.getDate() - tempDate2.getDate();
                        if(days > monthsDays && tempDate.getFullYear() == self._currentYear){
                           monthsDays = days;
                           monthIndex = i;
                        }
                        tempDate2.setMonth(month + 1);
                        tempDate2.setDate(1);
                        tempDate.setDate(tempDate.getDate() + 1);
                     }
                     //self._currentMonth(monthIndex);
                  }

                  //Установка флага - с ним начинает работать анимация, просчитываться год, и т д
                  if(!result.redraw){
                     result.redraw = true;
                  }

                  if (hideLastWeek){
                     self._menuBlock.find('[week=6]').addClass('ws-hidden');
                     self._menuBlock.find('.ws-date-range-choose-calendar').css('height','127px');
                  }
                  else{
                     self._menuBlock.find('.ws-date-range-choose-calendar').css('height','151px');
                  }
               },
               /**
                * Инициализирует события
                */
               initEvents: function(){
                  container.bind(/*'mousedown */'touchstart', function(event){
   //                  event.preventDefault();
                     var coords = $ws.helpers.getTouchEventCoords(event),
                        move = false;
                     result.clickY = coords.y;
                     result.lastMove = 0;
                     result.scrollingOnClick = !!result.scrollTimer;
                     result.stopTimers();
                     $(document).bind(/*'mousemove mouseup */'touchmove touchend', function(event){
                        if(/*event.type === 'mousemove' || */event.type === 'touchmove'){
                           var coords = $ws.helpers.getTouchEventCoords(event);
                           result.lastMove = coords.y - result.clickY;
                           result.offset += result.lastMove;
                           if(result.clickY !== coords.y){
                              move = true;
                           }
                           result.clickY = coords.y;
                           result.drawCalendar(true);
                           if(result.moveTimer){
                              clearTimeout(result.moveTimer);
                           }
                           result.moveTimer = setTimeout(function(){
                              result.lastMove = 0;
                           }, 140);
                           return false;
                        }
                        else{
                           result.stopTimers();
                           if(Math.abs(result.lastMove) > 0){
                              result.scrollTimer = setInterval(function(){
                                 result.offset += result.lastMove / 2;
                                 result.drawCalendar(true);
                              }, 30);
                           }
                           if(move){
                              return false;
                           }
                        }
                        event.stopImmediatePropagation();
   //                     return false;
                     });
                  })
               },
               /**
                * Останавливает таймеры движения
                */
               stopTimers: function(){
                  if(result.moveTimer){
                     clearTimeout(result.moveTimer);
                     result.moveTimer = undefined;
                     $(document).unbind(/*'mousemove mouseup */'touchmove touchend');
                  }
                  if(result.scrollTimer){
                     clearInterval(result.scrollTimer);
                     result.scrollTimer = undefined;
                  }
               },
               /**
                * Обновляет маркер выделения: дальше/раньше
                */
               updateSelectionMarker: function(){
                  if(self._selectionMarker){
                     //Updating selection marker
                     var marker = 0;
                     if(self._state === 2){
                        if(self._range[1] < result.drawedDays[0]){
                           marker = 1;
                        }
                        else if(self._range[0] > result.drawedDays[1]){
                           marker = 2;
                        }
                     }
                     self._selectionMarker.toggle(marker > 0).toggleClass('bottom', marker === 2);
                  }
               }
            };
         result.drawCalendar(true);
         result.initEvents();
         return result;
      },
      /**
       * Деструктор
       * <wiTag noShow>
       */
      destroy: function(){
         if(this._menuBlock){
            if(this._daysScroller){
               this._daysScroller.stopTimers();
            }
            if(this._yearScroller){
               this._yearScroller.stopTimers();
            }
            this._menuBlock.empty().remove();
         }
         for(var i = 0; i < 2; ++i){
            if(this._dateControls[i]){
               this._dateControls[i].destroy();
            }
         }
         if(this._menuShowed){
            this._container.trigger('wsSubWindowClose');
         }
         $(document).unbind('mousedown.' + this.getId(),'mouseup.' + this.getId(),'mouseover.' + this.getId(),'mouseout.' + this.getId());
         $ws.proto.DateRangeChoose.superclass.destroy.apply(this, arguments);
      },
      /**
       * <wiTag group="Данные">
       * Возвращает начало выделения
       * @returns {Date}
       * @see getRangeEnd
       * @see getValue
       */
      getRangeStart: function(){
         return this._range[0];
      },
      /**
       * <wiTag group="Данные">
       * Возвращает конец выделения
       * @returns {Date}
       * @see getRangeStart
       * @see getValue
       */
      getRangeEnd: function(){
         return this._range[1];
      },
      /**
       * <wiTag group="Данные">
       * Возвращает значение контрола в виде массив [дата начала, дата конца]
       * @return {Array|undefined}
       * @see getRangeStart
       * @see getRangeEnd
       * @see getStringValue
       */
      getValue: function() {
         if(this._state === 0){
            return undefined;
         }
         return [ this.getRangeStart(), this.getRangeEnd() ];
      },
      /**
       * <wiTag group="Данные">
       * Возвращает значение контрола в виде строки
       * @return {String}
       * @see getValue
       */
      getStringValue: function() {
         return this._getRangeTitle();
      },
      /**
       * <wiTag group="Управление">
       * Возвращает имя контрола, содержащего начало периода. По этому же имени хранится значение в контексте
       * @return {string}
       * @see getDateToName
       * @example
       * <pre>
       *    filter[dateRange.getDateFromName()] = dateRange.getRangeStart();
       * </pre>
       */
      getDateFromName: function(){
         return this._options.dateFromName;
      },
      /**
       * <wiTag group="Управление">
       * Возвращает имя контрола, содержащего конец периода. По этому же имени хранится значение в контексте
       * @return {string}
       * @see getDateFromName
       * @example
       * <pre>
       *    filter[dateRange.getDateToName()] = dateRange.getRangeEnd();
       * </pre>
       */
      getDateToName: function(){
         return this._options.dateToName;
      },
      /**
       * Устанавливает значение диапазона. Не меняет значения в контролах выбора даты
       * @param {Date|null} date0 Начало диапазона
       * @param {Date|null} date1 Конец диапазона
       * @private
       */
      _setRange: function(date0, date1){
         if (date0 < date1){
            this._range[0] = date0;
            this._range[1] = date1;
         }
         else{
            this._range[0] = date1;
            this._range[1] = date0;
         }

         if(this._range[0] && this._range[1]){
            this._state = 2;
         }
         else if(this._range[0] || this._range[1]){
            this._state = 1;
         }
         else{
            this._state = 0;
         }
         this._updateSelection();
         this._changeTextForAsLinkStyle();
         this.validate();
         this._notifyOnValueChange([this.getValue()]);
      },
      /**
       * <wiTag group="Данные">
       * Устанавливает диапазон дат
       * @param {Date|null} date0 Начало выделения
       * @param {Date|null} date1 Конец выделения
       */
      setRange: function(date0, date1){
         if( ($ws.helpers.type(date0) === 'date'  || date0 === null) || ($ws.helpers.type(date1) === 'date' || date1 === null)){
            this._setRange(date0, date1);
            this._updateDatesValues();
         }
         else{
            $ws.single.ioc.resolve('ILogger').error("DateRange::setRange", "Incorrect value " + date0 + ", " + date1);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Включаем-выключаем отображение выбора квартала
       * @param {Boolean} toggle Скрываем\Отображаем выбор квартала
       */
      toggleQuarter: function(toggle){
         this._options.showQuarter = !!toggle;
         if (this._menuBlock){
            this._menuBlock.toggleClass('ws-date-range-choose-options-no-quarter', !toggle);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Включаем-выключаем отображение выбора произвольного периода
       * @param {Boolean} toggle Скрываем\Отображаем выбор произвольного периода
       */
      toggleCustomPeriod: function(toggle){
         this._options.showCustomPeriod = !!toggle;
         if (this._menuBlock){
            this._menuBlock.find('.ws-date-range-choose-TypeSelection').toggleClass('ws-hidden', !toggle);
         }
      },
      /**
       * <wiTag group="Данные">
       * Устанавливает значение контрола
       * @param {Array|undefined} value Массив из двух дат (аналогично getValue())
       */
      setValue: function(value){
         if(value instanceof Array && value.length === 2){
            this._setStateType(value[0], value[1]);
            this.setRange(value[0], value[1]);
            this._setSelection();
         }
         else if(value !== undefined){
            $ws.single.ioc.resolve('ILogger').error("DateRange::setValue", "Incorrect value " + value);
         }
      },
      _setStateType: function(dateStart, dateEnd){
         var startDate = {
               year : dateStart.getFullYear(),
               month : dateStart.getMonth(),
               day: dateStart.getDate()
            },
            endDate = {
               year : dateEnd.getFullYear(),
               month : dateEnd.getMonth(),
               day: dateEnd.getDate()
            },
            firstDate,
            lastDate;
         this._stateType = 0;
         if (startDate.year === endDate.year){
            this._currentYear = startDate.year;
            if ((startDate.month === 0) && (endDate.month === 11) && (startDate.day === 1) && (endDate.day === 31)){
               //Год
               this._stateType = 3;
            }
            else if ((startDate.day === 1) && (endDate.day === this._getDaysInMonth(dateEnd)) && ((endDate.month - startDate.month) === 2))
            {
               //Квартал
               this._stateType = 2;
               this._currentMonth = startDate.month;
               this._stateSelectId = 'quarter' + ((startDate.month + 1) % 3);
            }
            else if ((startDate.month === endDate.month) && (startDate.day === 1) && (endDate.day === this._getDaysInMonth(dateEnd))){
               //Месяц
               this._stateType = 1;
               this._currentMonth = startDate.month;
            }
            else if ((startDate.month === endDate.month) && (startDate.day === endDate.day)){
               //День
               this._stateType = 5;
            }
            else{
               this._checkStateWeek(startDate, endDate);
            }
         } else {
            this._checkStateWeek(startDate, endDate);
         }
      },
      _checkStateWeek: function(startDate, endDate){
         var
            firstDate = new Date(startDate.year, startDate.month, startDate.day),
            lastDate = new Date(endDate.year, endDate.month, endDate.day);
         //Проверяем, есть ли разница в 7 дней и является первый день понедельником
         if (((lastDate.getTime() - firstDate.getTime()) === 518400000) && (firstDate.strftime('%w') === "1")){
            //Неделя
            this._stateType = 4;
         }
      },
      /**
       * Возвращает количество дней в месяце
       * @return {jQuery|undefined}
       */
      _getDaysInMonth: function(date){
         //Если установить несуществующую дату для какого-либо месяца, то в результате в нашем объекте будет сохранено соответствующее число следующего месяца.
         //Таким образом, для того, чтобы получить количество дней в указанном месяце, необходимо отнять результат вышеописанной операции к примеру из числа 32.
         //Из-за особенности работы браузера Сафари, для корректной работы нужно взять число больше 32, к примеру 33.
         return 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
      },
      /**
       * <wiTag group="Управление">
       * Включает-выключает контрол. В выключенном состоянии не реагирует на пользователя
       * @param {Boolean} enable Включён ли контрол
       */
      _setEnabled: function(enable){
         $ws.proto.DateRangeChoose.superclass._setEnabled.apply(this, arguments);
         if(this._movingControlsBlock){
            this._movingControlsBlock.toggleClass('ws-enabled', enable).toggleClass('ws-disabled', !enable);
         }
         if(this._textField){
            this._textField.toggleClass('ws-enabled', enable).toggleClass('ws-disabled', !enable);
         }
         var self = this;
         this._datesDeferred.addCallback(function(){
            self._dateControls[0].setEnabled(enable);
            self._dateControls[1].setEnabled(enable);
         });
         if(this._menuShowed){
            this._hideMenu();
         }
      },
      /**
       * Возвращает элемент, на который можно положить фокус
       * @return {jQuery|undefined}
       */
      _getElementToFocus: function(){
         return undefined;
      },
      /**
       * <wiTag group="Управление">
       * Отображает диалог выбора диапазона дат
       */
      showMenu: function() {
         this._showMenu(0);
      },
      /**
       * <wiTag group="Управление">
       * Скрывает диалог выбора диапазона дат
       */
      hideMenu: function() {
         this._hideMenu();
      },
      /**
       * <wiTag group="Управление">
       * Возвращает true/false, если диалог выбора диапазона дат отображен/скрыт
       * @returns {Boolean}
       */
      isMenuShowed: function() {
         return this._menuShowed;
      }
   });

   return $ws.proto.DateRangeChoose;

});
