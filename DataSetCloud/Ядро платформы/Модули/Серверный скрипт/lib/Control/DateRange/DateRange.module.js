/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 16:17
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.DateRange', ['js!SBIS3.CORE.Control', 'js!SBIS3.CORE.FieldDate', 'js!SBIS3.CORE.Button',  'css!SBIS3.CORE.DateRange', 'css!SBIS3.CORE.LinkButton'], function( Control, FieldDate, Button ) {

   'use strict';

   $ws._const.DateRange = {
      rowHeight: 30,
      startOffset: 0,
      startYearOffset: 0,
      scrollCount: 30,
      yearOffset: 3,
      menuOffset: {'top': -5, 'left': -5},
      separatorWidth: 24
   };

   /**
    * Контрол - диапазон дат
    *
    * @class $ws.proto.DateRange
    * @extends $ws.proto.DataBoundControl
    * @control
    * @initial
    * <component data-component='SBIS3.CORE.DateRange'>
    *     <option name="dateFromName">dateFromName</option>
    *     <option name="dateToName">dateToName</option>
    * </component>
    * @category Date/Time
    * @designTime plugin /design/DesignPlugin
    * @ignoreOptions value
    *
    */
   $ws.proto.DateRange = Control.DataBoundControl.extend(/** @lends $ws.proto.DateRange.prototype */{
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
      $protected: {
         _options: {
            /**
             * @cfg {String} Имя контрола, который отображает дату "с"
             * <wiTag group="Управление">
             * Влияет на запись и чтение данных из контекста, а также на связанную по смыслу функциональность.
             * Должно отличаться от {@link dateToName}.
             * Опция обязательна к заполнению!
             * В случае, если дата начала диапазона берётся не с контрола, то в данной опции необходимо указать произвольное
             * имя, с которым значение данной опции диапазона запишется в контекст.
             * @see dateToName
             * @see dateToValue
             * @see dateFromValue
             */
            dateFromName: '',
            /**
             * @cfg {String} Имя контрола, который отображает дату "по"
             * <wiTag group="Управление">
             * Влияет на запись и чтение данных из контекста, а также на связанную по смыслу функциональность.
             * Должно отличаться от {@link dateFromName}.
             * Опция обязательна к заполнению!
             * В случае, если дата окончания диапазона берётся не с контрола, то в данной опции необходимо указать произвольное
             * имя, с которым значение данной опции запишется в контекст.
             * @see dateFromName
             * @see dateToValue
             * @see dateFromValue
             */
            dateToName: '',
            /**
             * @cfg {String|Date} Начальное значение даты начала интервала
             * <wiTag group="Данные">
             * Формат данных (строка): "03/11/2011".
             * Должно быть меньше {@link dateToValue}.
             * Задание опции осуществляется выбором из календаря, открываемого нажатием на соответствующую иконку.
             * @see dateFromName
             * @see dateToValue
             * @see dateToName
             */
            dateFromValue: '',
            /**
             * @cfg {String|Date} Начальное значение даты конца интервала
             * <wiTag group="Данные">
             * Формат данных (строка): "03/11/2011".
             * Должно быть меньше {@link dateFromValue}.
             * Задание опции осуществляется выбором из календаря, открываемого нажатием на соответствующую иконку.
             * @see dateFromName
             * @see dateToValue
             * @see dateToName
             */
            dateToValue: '',
            /**
             * @cfg {Boolean} Отображать ли поле в виде текста
             * <wiTag group="Отображение" page=1>
             * Будет выведен текст вместо полей ввода. Однако при клике всё равно будет отображено меню, аналогичное
             * стандартному.
             * Текст будет равен значению {@link getStringValue}.
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
             * @variant 'DD.MM.YYYY HH:II'
             * @variant 'DD.MM.YYYY HH:II:SS'
             * @variant 'DD.MM.YYYY HH:II:SS.UUU'
             * @variant 'DD.MM HH:II'
             * @variant 'DD.MM HH:II:SS'
             * @variant 'DD.MM HH:II:SS.UUU'
             * @variant 'DD.MM.YY HH:II'
             * @variant 'DD.MM.YY HH:II:SS'
             * @variant 'DD.MM.YY HH:II:SS.UUU'
             * @variant 'YY-MM-DD HH:II'
             * @variant 'YY-MM-DD HH:II:SS'
             * @variant 'YY-MM-DD HH:II:SS.UUU'
             * @variant 'YYYY-MM-DD HH:II'
             * @variant 'YYYY-MM-DD HH:II:SS'
             * @variant 'YYYY-MM-DD HH:II:SS.UUU'
             */
            mask: 'DD.MM.YYYY'
         },
         _fieldsTabindex: undefined,      //Табиндекс дочерних полей
         _dateControls: [],               //Контролы FieldDate, 2 штуки
         _datesDeferred: undefined,       //Деферред готовности полей дат
         _menuBlock: undefined,           //Блок с меню
         _menuShowed: false,              //Показывается ли меню
         _calendarBlock: undefined,       //Блок с календярём
         _currentDate: undefined,         //Текущая дата
         _currentYear: undefined,         //Текущий отображаемый год
         _yearBlock: undefined,           //Блок, в котором содержатся номер года и стрелочки
         _yearScrollerBlock: undefined,   //Блок для выбора текущего года, изначально скрыт, показывается при клике по _yearBlock
         _yearScroller: undefined,        //Объект, который возвращается методом _createScroller, повзоляет выбрать текущий год
         _yearScrollerShowed: false,      //Показано ли сейчас меню для выбора года
         _daysScroller: undefined,        //Объект, который возвращается методом _createScroller, повзоляет выбрать дни
         _state: 0,                       //Текущиее состояние выбора диапазона: 0 - не выбрано, 1 - выбрана первая дата, 2 - выбран диапазон
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
         _textField: undefined            //Блок для отображения поля в виде текста (_options.textView)
      },
      $constructor: function(){
         this._publish('onChange', 'onMenuHide');
         this._datesDeferred = new $ws.proto.Deferred();
         this._container.addClass('clearfix').addClass('ws-date-range' + (this._options.textView ? ' ws-date-range-text-view' : ''));
         this._currentDate = new Date();
         this._currentYear = this._currentDate.getFullYear();
         this._container.removeAttr('tabindex');
         this._initValidation();

         var parent = this;
         this._childIsVisible = function() {
            return $ws.proto.FieldDate.prototype.isVisible.apply(this) && (parent.isVisible() || parent._menuShowed);
         };
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

      _childIsVisible: null,
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
            date0, date1,
            name = this._options.name,
            nameFrom = this.getDateFromName(),
            nameTo = this.getDateToName(),
            self = this,
            checkDate = function(date){
               if(date === undefined) {
                  return null;
               }
               if(date instanceof Date){
                  return date;
               }
               else if(typeof(date) === 'string'){
                  return self._dateControls[0] ? self._dateControls[0].strToDate(date) : Date.fromSQL(date);
               }
               return date;
            },
            getDateFromContext = function(name) {
               return checkDate(self._context.getValue(name));
            };
         if(name !== '' && this._context) {
            // Если нам пришел field - значит это onFieldChange
            if(field) {
               if(field === name){ // Если это наше поле - обновимся
                  this._onContextValueReceived(value);
               }
               else if(field === nameFrom){
                  this._setRange(checkDate(value), getDateFromContext(nameTo));
               }
               else if(field === nameTo){
                  this._setRange(getDateFromContext(nameFrom), checkDate(value));
               }
            }
            else{
               var mainValue = this._context.getValue(name);
               if(mainValue !== undefined){
                  this._onContextValueReceived(mainValue);
               }
               else{
                  date0 = getDateFromContext(nameFrom);
                  date1 = getDateFromContext(nameTo);
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
         $ws.proto.DateRange.superclass.init.apply(this, arguments);
         this._initDateContainer();
      },
      setDateFromValue: function(dateFromValue){
         this.setRange(dateFromValue, this._range[1]);
      },
      setDateToValue: function(dateToValue){
         this.setRange(this._range[0], dateToValue);
      },
      _createTextField: function() {
         var self = this;
         var text = '<диапазон дат не установлен>';
         if(this._options.dateFromValue && this._options.dateToValue){
            this._state = 2;
            text = this._getRangeTitle();
         }
         this._container.append(this._textField = $('<div class="ws-date-range-text">' + text + '</div>')
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
         $ws.proto.DateRange.superclass._registerToParent.apply(this, arguments);
      },
      _changeWidthMovingControlsBlock: function(){
         //Берем чистую ширину (а не min-width) и через js (chrome размеры контролов FieldDate выставляет дробными пикселями)
         var
            firstContainer = this._dateControls[0].getContainer(),
            lastContainer = this._dateControls[1].getContainer(),
            firstClientRect = firstContainer[0].getBoundingClientRect(),
            lastClientRect = lastContainer[0].getBoundingClientRect(),
            widthDateControls = (firstClientRect.width !== undefined ? firstClientRect.width : firstContainer.width()) +
                                (lastClientRect.width !== undefined ? lastClientRect.width : lastContainer.width());
         this._movingControlsBlock.width(Math.ceil(widthDateControls) + $ws._const.DateRange.separatorWidth);
      },

      _onSizeChangedBatch: function() {
         this._dateControls[0]._onSizeChangedBatch();
         this._dateControls[1]._onSizeChangedBatch();
         this._changeWidthMovingControlsBlock();
         return true;
      },

      _setVisibility: function(show){
         this._runInBatchUpdate('DateRange._setVisibility', function() {
            if (show) {
               var updater = $ws.single.ControlBatchUpdater;
               $ws.helpers.forEach([0, 1], function (idx) {
                  if (updater._needDelayedRecalk(this._dateControls[idx])) {
                     updater._doDelayedRecalk(this._dateControls[idx]);
                  }
               }, this);
            }

            $ws.proto.DateRange.superclass._setVisibility.apply(this, arguments);
         }, arguments);
      },

      /**
       * Создаёт блок с полями даты
       */
      _createControlsBlock: function(){
         if(this._movingControlsBlock) {
            return;
         }
         var self = this;
         this._container.append(this._movingControlsBlock = $('<div class="ws-date-range-input-block ws-' +
            (this._options.enabled ? 'enabled' : 'disabled') + '"></div>'));

         var parent = this.getParent();
         if(parent){
            this._movingControlsBlock.bind('keydown', function(e){
               if(e.which === $ws._const.key.tab){
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
         //TODO: переделать на родителя - DateRange, а то приходится извратами заниматься, чтоб isVisible у FieldDate этого
         //правильно работало и учитывало видимость родителя (DateRange)
         for(var i = 0; i < 2; ++i){
            this._rangeMarks.push($('<div class="ws-date-range-' + (i === 0 ? 'start' : 'end') + '-selection"></div>'));
            (function(j){

               var instance = new FieldDate({
                  mask: self._options.mask,
                  horizontalAlignment: 'Left',
                  autoWidth: true,
                  parent: self.getParent(),
                  calendar: false,
                  element: $('<div class="ws-date-range-block"></div>').appendTo(self._movingControlsBlock),
                  tabindex: self._fieldsTabindex > 0 ? self._fieldsTabindex + j : -1,
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
                        self._updateSelectionSlider();
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

               instance.isVisible = self._childIsVisible;
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
                  self._movingControlsBlock.append('<div class="ws-date-range-block delimeter"></div>')
                     .bind('click', function(){
                        if(self._options.enabled){
                           self._toggleMenu(0);
                        }
                     });
               }
            })(i);
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
      /**
       * Строит меню с календарём, выбором месяцев и т д
       */
      _buildMenu: function(){
         var block,
               table,
               row,
               i,
               leftColumn,
               rightColumn,
               columns,
               self = this,
            tableSelector = '<table border="0" width="100%" cellpadding="0" cellspacing="0"></table>',
            rowSelector = '<tr></tr>';
         this._menuBlock = $('<div class="ws-date-range-menu-block clearfix"></div>')
            .appendTo($('body'))
            .hide();

         //Creating row for date controls
         this._menuControlsRow = $('<div class="ws-date-range-menu-dates"></div>').appendTo(this._menuBlock);
         //Error block
         this._errorMarker = $('<img class="ws-date-range-error-marker" width="22" height="22" src="' +
               $ws._const.wsRoot +
               ($ws._const.theme === '' || $ws._const.theme === 'wi' ?
                     'img/daterange' :
                     'img/themes/' + $ws._const.theme) + '/validation_error.png' + '">')
               .appendTo(this._menuControlsRow);

         //Confirm button
         var option = $('<span class="ws-browser-edit-button-element ws-browser-edit-button-apply"></span>'),
             button = $('<span class="ws-browser-edit-button" title="Подтвердить выбор"></span>')
                .appendTo(this._menuControlsRow)
                .append(option);
         var confirmButton = new Button ({
            element: option,
            name: 'apply',
            tooltip: "Подтвердить выбор",
            image: 'sprite:icon-16 icon-Successful icon-done action-hover',
            handlers: {
               'onActivated': function() {
                  self._applyCurrentRange();
                  
                  // Если была выбрана лишь одна дата, то вторая дата была левой (менялась по наведению мыши)  
                  if(self._state == 1) {
                     self._range[self._rangeEndAt] = null;
                  }
                  self._updateContextValues(self._range[0], self._range[1]);
                  self._hideMenuAndMoveFocus(0);
                  self._notify('onChange', self._range[0], self._range[1]);
                  self._notifyOnValueChange([self.getValue()]);
               }
            }
         });
         //Close button
         $('<div class="ws-date-range-close ws-window-titlebar-action close" title="Закрыть"></div>')
               .appendTo(this._menuControlsRow)
               .bind('click', function(){
                  self._hideMenuAndMoveFocus(0);
               });
         //Range title
         this._rangeTitle = $('<div class="ws-date-range-title asLink" title="Очистить выделение">Сбросить</div>')
               .appendTo(this._menuControlsRow)
               .bind('click', function(){
                  self._range[0] = self._range[1] = null;
                  self._state = 0;
                  self._updateRange();
                  self._updateSelectionAndFocus();
                  self._updateSelectionSlider();
                  self._prepareTitle();
               });

         //Columns
         columns = $('<div class="ws-date-range-menu-bot"></div>').appendTo(this._menuBlock);
         //Left Column
         leftColumn = $('<div class="ws-date-range-menu-left"></div>')
            .appendTo(columns);
         leftColumn.append(block = $('<div class="ws-date-range-months"></div>'));
         //Months bg
         block.append('<div class="ws-date-range-months-bg"></div>');
         block.append(this._monthSelection = $('<div class="ws-date-range-month-selection"></div>'));
         //Selection slider
         block.append(this._selectionSlider = $('<div class="ws-date-range-slider left right">' +
            '<div class="ws-date-range-slider-bg"></div></div>').hide());
         //Tip for quarters/half year buttons
         block.append(this._tipSlider = $('<div class="ws-date-range-slider preselected left right">' +
            '<div class="ws-date-range-slider-bg"></div></div>').hide());
         //Months
         block.append(table = $(tableSelector));
         table.append(row = $(rowSelector));
         for(i = 0; i < 12; ++i){
            this._months.push(
               $('<td class="ws-date-range-month" title="Показать ' + $ws._const.Date.longMonthsSmall[i] +
                  ', либо выбрать/снять выделение (при двойном клике)">' +
                  '<div class="ws-date-range-month-text"><div class="ws-date-range-month-selection2"></div>' +
                  $ws._const.Date.monthsBig[i] + '</div></td>')
               .appendTo(row)
               .bind('click dblclick', {'month': i}, function(e){
                  if(e.type === 'click'){
                     var tempDate = new Date(self._currentYear, e.data.month, 1);
                     self._setMonday(tempDate);
                     self._daysScroller.setDate(tempDate);
                  }
                  else{
                     $ws.helpers.clearSelection();
                     self._selectMonths(e.data.month, e.data.month + 1, e);
                  }
                  return false;
               }));
         }
         //Days of week
         leftColumn.append(block = $('<div class="ws-date-range-days"></div>'));
         block.append(table = $(tableSelector));
         table.append(row = $(rowSelector));
         for(i = 0; i < 7; ++i){
            row.append('<td class="ws-date-range-day">' + $ws._const.Date.daysSmall[(i + 1) % 7] + '</td>');
         }
         //Calendar
         leftColumn.append(this._calendarBlock = $('<div class="ws-date-range-calendar"></div>'));
         var tempDate = new Date();
         tempDate.setDate(1);
         this._setMonday(tempDate);
         this._daysScroller = this._createScroller(this._calendarBlock, false, tempDate);

         //Right column
         columns.append(rightColumn = $('<div class="ws-date-range-menu-right"></div>'));
         this._yearScrollerBlock = $('<div class="ws-date-range-year-scroller"></div>').appendTo(rightColumn);
         this._yearBlock = $('<div class="ws-date-range-menu-year" title="Выбрать текущий год">' + this._currentYear + '</div>')
               .appendTo(rightColumn)
               .bind('click dblclick', function(e){
                     if(e.type === 'click'){
                     if(!self._yearScrollerShowed){
                        self._yearScrollerBlock.fadeIn('fast');
                        var date = new Date(self._currentYear - $ws._const.DateRange.yearOffset, 0, 1);
                        //Если у нас ещё нет скроллера, то нужно создать. При создании сразу устанавливается нужная дата
                        if(!self._yearScroller){
                           self._yearScroller = self._createScroller(self._yearScrollerBlock, true, date);
                        }
                        //Иначе, нам нужно обновить скроллинг
                        else{
                           self._yearScroller.setDate(date);
                        }
                     }
                     else{
                        self._yearScrollerBlock.fadeOut('fast');
                     }
                     self._yearScrollerShowed ^= true;
                  }
                  else{
                     self._selectMonths(0, 12, e);
                  }
                  return false;
               });
         this._toggledButtons.push($('<div class="ws-date-range-menu-halfyear" title="Первое полугодие">1</div>')
               .appendTo(rightColumn)
               .bind('click mouseover mouseout', {'months': [0, 6]}, $.proxy(this._buttonsHandler, this)));
         this._toggledButtons.push($('<div class="ws-date-range-menu-halfyear last" title="Второе полугодие">2</div>')
               .appendTo(rightColumn)
               .bind('click mouseover mouseout', {'months': [6, 12]}, $.proxy(this._buttonsHandler, this)));
         this._toggledButtons.push($('<div class="ws-date-range-menu-quarter" title="Первый квартал">I</div>')
               .appendTo(rightColumn)
               .bind('click mouseover mouseout', {'months': [0, 3]}, $.proxy(this._buttonsHandler, this)));
         this._toggledButtons.push($('<div class="ws-date-range-menu-quarter" title="Второй квартал">II</div>')
               .appendTo(rightColumn)
               .bind('click mouseover mouseout', {'months': [3, 6]}, $.proxy(this._buttonsHandler, this)));
         this._toggledButtons.push($('<div class="ws-date-range-menu-quarter" title="Третий квартал">III</div>')
               .appendTo(rightColumn)
               .bind('click mouseover mouseout', {'months': [6, 9]}, $.proxy(this._buttonsHandler, this)));
         this._toggledButtons.push($('<div class="ws-date-range-menu-quarter last" title="Четвёртый квартал">IV</div>')
               .appendTo(rightColumn)
               .bind('click mouseover mouseout', {'months': [9, 12]}, $.proxy(this._buttonsHandler, this)));

         this._selectionMarker = $('<div class="ws-date-range-selection-marker" ' +
                 'title="Показать начало выделения"></div>')
                 .appendTo(rightColumn)
                 .bind('click', function(){
                    var tempDate = new Date(self._range[0]);
                    self._setMonday(tempDate);
                    self._daysScroller.setDate(tempDate);
                 });

         $('<div class="ws-date-range-today">' + this._currentDate.strftime("%d %q %Y") + '</div>')
            .appendTo(rightColumn);

         $('<div class="ws-date-range-today-button" title="Показать на календаре сегодняшний день">Сегодня</div>')
               .appendTo(rightColumn)
               .bind('click dblclick', function(event){
                  if(event.type === 'dblclick'){
                     var equal;
                     if((equal = (self._state === 2))){
                        for(var i = 0; i < 2; ++i){
                           if(self._range[i].getDate() !== self._currentDate.getDate() ||
                                 self._range[i].getMonth() !== self._currentDate.getMonth() ||
                                 self._range[i].getYear() !== self._currentDate.getYear()){
                              equal = false;
                              break;
                           }
                        }
                     }
                     if(equal){
                        self._state = 0;
                     }
                     else{
                        self._state = 2;
                        self._range[0] = new Date(self._currentDate);
                        self._range[1] = new Date(self._currentDate);
                     }
                     self._updateRange();
                     self._updateSelectionAndFocus();
                     self._updateSelectionSlider();
                     $ws.helpers.clearSelection();
                     self._prepareTitle();
                  }
                  else{
                     self._currentYear = self._currentDate.getFullYear();
                     self._updateYear();
                     var tempDate = new Date(self._currentDate);
                     tempDate.setDate(1);
                     self._setMonday(tempDate);
                     self._daysScroller.setDate(tempDate);
                  }
                  return false;
               });

         $(document).bind('mousedown.' + this.getId() , function() {
            if (self._menuBlock) {
               if (/block/.test(self._menuBlock.css('display'))) {
                  self._hideMenu();
               }
            }
         });
         this._menuBlock.bind('mousedown', function(e){
            e.stopImmediatePropagation();
         });
      },
      /**
       * Выделяет указанный месяц как текущий
       * @param {Number} monthNumber Номер нужного месяца
       */
      _selectMonth: function(monthNumber){
         if(this._prevMonth != monthNumber){
            if(this._prevMonth !== undefined){
               this._months[this._prevMonth].removeClass('selected');
            }
            this._prevMonth = monthNumber;
            this._months[monthNumber].addClass('selected');
            this._monthSelection.css('left', this._months[monthNumber].position()['left'] + 'px');
         }
      },
      /**
       * Показывает меню. Требует номер инпута, так как из-за перестройки фокус уходит и его нужно вернуть
       * @param {Number} controlNumber Номер контрола FieldDate, который сейчас является текущим
       */
      _showMenu: function(controlNumber){
         if(!this._menuBlock){
            if(this._options.textView){
               this._createControlsBlock();
            }
            this._buildMenu();
         }
         if(!this._menuShowed){
            this._storeOldRange();
            if(this._state === 2){
               var tempDate = new Date(this._range[0]);
               tempDate = this._setMonday(tempDate);
               this._daysScroller.setDate(tempDate);
            }
            this._menuBlock.show();
            this._setMenuPosition();
            this._prevMonth = undefined;
            this._daysScroller.drawCalendar();
            this._movingControlsBlock.prependTo(this._menuControlsRow);
            this._menuShowed = true;
            this._dateControls[controlNumber].setActive(true);
            this._updateSelectionSlider();
            //this._updateRangeTitle();
            this.clearMark();
            if(this._errorMessage){
               this._toggleError(true, this._errorMessage);
            }
            this._container.trigger('wsSubWindowOpen');
         }
      },
      /**
       * Устанавливает позицию меню так, как будет хорошо
       */
      _setMenuPosition: function(){
         var offset = this._container.offset(),
            menuWidth = this._menuBlock.outerWidth(),
            menuHeight = this._menuBlock.outerHeight();
         for(var c in offset){
            if(offset.hasOwnProperty(c)){
               offset[c] += $ws._const.DateRange.menuOffset[c];
            }
         }
         $ws.helpers.positionInWindow(offset, menuWidth, menuHeight);
         this._menuBlock.css(offset);
      },
      /**
       * Скрывает меню
       */
      _hideMenu: function(){
         if(this._menuBlock){
            this._menuBlock.hide();
            this._restoreOldRange();
            if(!this._options.textView){
               this._movingControlsBlock.prependTo(this._container);
            }
            else{
               this._textField.html(this._state > 0 ? this._getRangeTitle() : '<' + 'Диапазон дат не установлен>');
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
         this._notify('onChange', this._range[0], this._range[1]);
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
            this._updateSelectionSlider();
            this._prepareTitle();
            this._showMenu(controlNumber);
         }
      },
      /**
       * <wiTag group="Управление">
       * Переводит фокус на контрол. Переопределён из-за наличия дочерних контролов
       * @param {Boolean} active
       */
      setActive: function(active){
   //      $ws.proto.DateRange.superclass.setActive.apply(this, arguments);
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
      /**
       * Обработчик клавиш. Обрабатываемые события: 'click', 'mouseover', 'mouseout'. По клику выделяет/снимает выделение, по mouseover'у показывает будущее выделение, по mouseout убирает его
       * @param {jQuery} e Объект события
       */
      _buttonsHandler: function(e){
         if(e.type === 'click'){
            this._selectMonths(e.data.months[0], e.data.months[1], e);
         }
         else if(e.type === 'mouseover'){
            this._updateSlider(this._tipSlider, new Date(this._currentYear, e.data.months[0], 1),
                  new Date(this._currentYear, e.data.months[1], 0));
         }
         else{
            this._tipSlider.hide();
         }
      },
      /**
       * Выделяет месяцы текущего года
       * @param {Number} month0  Номер месяца - начало выделения
       * @param {Number} month1  Номер месяца, следующего после конца выделения
       * @param {jQuery} event   Событие - берём из него ctrlKey и shiftKey, если они есть, то выделение добавляется
       */
      _selectMonths: function(month0, month1, event){
         var
            mayBeBug = $ws._const.compatibility.dateBug && this._currentYear === 2014,
            tempDates = [ new Date(this._currentYear, month0, 1, mayBeBug && month0 === 0 ? 1 : 0),
                          new Date(this._currentYear, month1, 0, mayBeBug && month1 === 0 ? 1 : 0) ],
            funcs = ['getYear', 'getMonth', 'getDate'],
            equal = true,
            append = event.shiftKey || event.ctrlKey;
         for(var j = 0; j < 2; ++j){
            for(var i = 0; i < funcs.length; ++i){
               if(!this._range[j] || this._range[j][funcs[i]]() !== tempDates[j][funcs[i]]()){
                  equal = false;
                  j = 2;
                  break;
               }
            }
         }
         if(equal && this._state !== 0){
            this._state = 0;
            this._range[0] = null;
            this._range[1] = null;
         }
         else{
            if(append){
               if(tempDates[0] < this._range[0]){
                  this._range[0] = tempDates[0];
               }
               if(tempDates[1] > this._range[1]){
                  this._range[1] = tempDates[1];
               }
            }
            else{
               this._range[0] = tempDates[0];
               this._range[1] = tempDates[1];
            }
            this._state = 2;
         }
         this._updateRange();
         this._updateSelectionSlider();
         this._updateSelectionAndFocus();
         this._prepareTitle();
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
         this._updateContextValues(this._state > 0 ? this._range[0] : null, this._state > 0 ? this._range[1] : null);
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
            if ($ws._const.compatibility.dateBug && this._range[0].getDate() === 1 && this._range[0].getMonth() === 0 && this._range[0].getYear() === 114) {
               this._range[0].setHours(1, 0, 0, 0);
            } else {
               this._range[0].setHours(0, 0, 0, 0);
            }
         }
         if(this._range[1]){
            this._range[1].setHours(23, 59, 59, 999);
         }
         var context = this.getLinkedContext();
         this._updateContextValues(this._range[0], this._range[1]);
      },
      /**
       * Скрывает/отображает заголовок окна выбора диапазона дат
       */
      _prepareTitle: function() {
         if (this._rangeTitle) {
            this._rangeTitle.toggleClass('ws-hidden', this._range[0] === null && this._range[1] === null);
         }
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
            if (!this.isVisible()) {
               return true;
            } else {
               this._dateControls[0].validate();
               this._dateControls[1].validate();
               var vRes = $ws.proto.DateRange.prototype._invokeValidation.apply(this, arguments);
               this._toggleError(vRes.errors.length > 0, vRes.errors);
               this._notify('onValidate', !!vRes.result, vRes.errors, previousStatus);
               this._prevValidationResult = !!vRes.result;
               return vRes.result;
            }
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
               else if(dates[0] === 1 && (new Date(years[1], months[1], dates[1] + 1)).getMonth() !== months[1]){
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
               tempDate = new Date(year, 0, 1),
               days = ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365);
         return (date - tempDate) / (1000 * 60 * 60 * 24 * days);
      },
      /**
       * Обновляет объект, отображающий различную информацию (выделение, область видимости, будущее выделение) в блоке для выбора месяцев
       * @param {jQuery}   slider   Объект, который будем перемещать
       * @param {Date}     date0    Дата начала
       * @param {Date}     date1    Дата конца
       */
      _updateSlider: function(slider, date0, date1){
         var left, right,
               blockWidth = this._calendarBlock.width() - 1;
         slider.stop();
         if(this._currentYear === date0.getFullYear()){
            left = Math.round(this._getDatePosition(date0) * blockWidth);
         }
         if(this._currentYear === date1.getFullYear()){
            right = Math.round(this._getDatePosition(date1) * blockWidth);
         }
         slider.toggleClass('left', left !== undefined);
         slider.toggleClass('right', right !== undefined);
         if(left !== undefined || right !== undefined){
            left = (left !== undefined ? left : 0);
            right = (right !== undefined ? right : blockWidth);
            if(right - left <= 0){
               if(left === blockWidth){
                  --left;
               }
               else{
                  ++right;
               }
            }
            slider.animate({'left': left + 'px', 'width': (right - left)}, 'fast').show();
         }
         else if(date0.getFullYear() < this._currentYear && this._currentYear < date1.getFullYear()){
            slider.animate({'left': '0px', 'width': blockWidth}, 'fast').show();
         }
         else{
            slider.hide();
         }
      },
      /**
       * Обновляет блок, отображающий текущее выделение
       */
      _updateSelectionSlider: function(){
         if(this._yearBlock){
            var toggledClasses = {},
                  i;
            if(this._state === 2){
               var tempDate = new Date(this._range[1]);
               tempDate.setDate(tempDate.getDate() + 1);
               if(tempDate.getDate() === 1 && this._range[0].getDate() === 1){
                  var months = [this._range[0].getMonth(), tempDate.getMonth()];
                  if(months[1] === 0){
                     months[1] = 12;
                  }
                  if(months[0] === 0 && months[1] === 12){
                     toggledClasses[0] = true;
                  }
                  else if((months[1] - months[0]) === 6 && months[0] % 6 === 0){
                     toggledClasses[1 + (months[0] / 6)] = true;
                  }
                  else if(months[0] % 3 === 0 && months[1] % 3 === 0){
                     for(i = 0; i < 4; ++i){
                        if(i * 3 >= months[0] && (i + 1) * 3 <= months[1]){
                           toggledClasses[3 + i] = true;
                        }
                     }
                  }
               }
            }
            this._yearBlock.toggleClass('toggle', toggledClasses[0] !== undefined);
            for(i = 1; i < 7; ++i){
               this._toggledButtons[i - 1].toggleClass('toggle', (toggledClasses[i] !== undefined));
            }
            this._daysScroller.updateSelectionMarker();
         }
         if(this._selectionSlider){
            if(this._state > 0 && this._range[0] && this._range[1]){
               this._selectionSlider.toggleClass('preselected', this._state === 1)
                                    .toggleClass('selected', this._state === 2);
               this._updateSlider(this._selectionSlider, this._range[0], this._range[1]);
            }
            else{
               this._selectionSlider.hide();
            }
         }
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
       * Устанавливает текущий год
       * @param {Number} year Номер нового года
       */
      _setYear: function(year){
         var diff = year - this._currentYear,
               drawedDays = this._daysScroller.drawedDays;
         this._currentYear = year;
         drawedDays[0].setFullYear(drawedDays[0].getFullYear() + diff);
         this._setMonday(drawedDays[0]);
         this._daysScroller.setDate(drawedDays[0]);
         this._updateSelectionSlider();
      },
      /**
       * Обновляет отображение текущего года
       */
      _updateYear: function(){
         this._yearBlock.html(this._currentYear);
         this._updateSelectionSlider();
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
               offset: $ws._const.DateRange[isYear ? 'startYearOffset' : 'startOffset'],//Текущий отступ сверху
               table: $('<table class="ws-date-range-table' + (isYear ? ' year' : '') +
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
                        block.addClass(i === 0 ? 'start' : 'end');
                        block.prepend(self._rangeMarks[i].show());
                        self._daysCells.push(block);
                        break;
                     }
                  }
               },
               /**
                * Обновляет выделение в скроллере, перед этим его очищая
                */
               updateSelection: function(){
                  while(self._daysCells.length){
                     self._daysCells.pop().removeClass('start end')
                        .find('.ws-date-range-end-selection, .ws-date-range-start-selection')
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
                  var cell = $('<td class="ws-date-range-date"></td>'),
                        block = $('<div class="ws-date-range-date-block"></div>').appendTo(cell);
                  if(date.getMonth() % 2 === 0){
                     cell.addClass('month-even');
                  }
                  if(date.getDate() === self._currentDate.getDate() && date.getMonth() === self._currentDate.getMonth() &&
                          date.getYear() === self._currentDate.getYear()){
                     cell.addClass('current');
                  }
                  result.addCellSelection(cell, date);
                  cell.bind('mouseover mouseout click', {'date': date.getTime()}, function(e){
                     if(e.type === 'mouseover' || e.type === 'mouseout'){
                        cell.toggleClass('hover', e.type === 'mouseover');
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
                           result.clearSelection();
                           result.updateSelection();
                           self._updateSelectionSlider();
                        }
                     }
                     else if(e.type === 'click'){
                        if(!result.scrollingOnClick){
                           if(self._state === 2 && (e.ctrlKey || e.shiftKey || e.altKey)){
                              var tempDate = new Date(e.data.date);
                              if(e.altKey !=
                                      (tempDate.getTime() > (self._range[1].getTime() + self._range[0].getTime()) / 2)){
                                 self._range[1] = tempDate;
                              }
                              else{
                                 self._range[0] = tempDate;
                              }
                              self._checkRange();
                           }
                           else if(self._state % 2 === 0){
                              self._range[0] = new Date(e.data.date);
                              self._range[1] = null;
                              self._state = 1;
                              self._rangeEndAt = 1;
                           }
                           else if(self._state === 1){
                              //Если вторая граница диапазона не задана, то устанавливаем её
                              if (self._range[1] === null) {
                                 self._range[1] = new Date(e.data.date);
                              }
                              self._state = 2;
                              self._rangeEndAt = 1;
                           }
                           self._updateRange();
                           self._updateSelectionAndFocus();
                           self._updateSelectionSlider();
                           if(self._state !== 1){
                              self._prepareTitle();
                           }
                        }
                        return false;
                     }
                  });
                  block.append('<div class="ws-date-range-date-number">' + date.getDate() + '</div>');
                  var hasMonth = date.getDate() === 1;
                  if(self._state >= 1){
                     for(var i = 0; i < 2; ++i){
                        if(self._range[i] && date.getDate() == self._range[i].getDate() &&
                           self._range[i].getMonth() == date.getMonth() && self._range[i].getYear() == date.getYear()){
                           block.addClass(i === 0 ? 'start' : 'end');
                           block.prepend(self._rangeMarks[i].show());
                           self._daysCells.push(block);
                           break;
                        }
                     }
                  }
                  var month;
                  block.append(month = $('<div class="ws-date-range-date-month">' +
                     $ws._const.Date.monthsWithDays[date.getMonth()] + '</div>'));
                  if(hasMonth){
                     month.css('display', 'block');
                  }
                  return cell;
               },
               /**
                * Создаёт ячейку таблицы (вариант скроллера - года)
                * @param {Date} date Дата ячейки
                * @returns {jQuery}
                */
               drawYear: function(date){
                  var cell = $('<td class="ws-date-range-date year"></td>'),
                        block = $('<div class="ws-date-range-date-block"></div>').appendTo(cell);
                  result.addYearSelection(cell, date);
                  if(date.getYear() == self._currentDate.getYear()){
                     cell.addClass("current");
                     block.attr('title', 'Текущий год');
                  }
                  else if(date.getFullYear() == self._currentYear){
                     block.addClass('visible');
                     block.attr('title', 'Просматриваемый год');
                  }
                  cell.bind('click dblclick', {'year': date.getFullYear()}, function(e){
                     if(e.type === 'click'){
                        self._setYear(e.data.year);
                        self._yearScrollerBlock.fadeOut('fast');
                        self._yearBlock.html(e.data.year);
                        self._yearScrollerShowed = false;
                     }
                     else{
                        self._setYear(e.data.year);
                        self._selectMonths(0, 12, e);
                     }
                  });
                  block.append(date.getFullYear());
                  return cell;
               },
               /**
                * Рисует одну строку с данными (варианот скроллера - дни). Возвращает объект {row: объект с строкой, cells: {element: объект ячейки, date: дата ячейки}}
                * @param {Date} date Дата первого дня в строке
                * @returns {Object}
                */
               drawMonthRow: function(date){
                  var row = $('<tr></tr>'),
                     tempDate = new Date(date),
                     cells = [];
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
               /**
                * Обновляет отрисовку скроллера
                * @param {Boolean} [noAnimation] Не использовать анимацию
                */
               drawCalendar: function(noAnimation){
                  var calendarHeight = container.height(),
                      insertedBefore = 0,
                      rowContainer,
                      drawRow = (isYear ? result.drawYearRow : result.drawMonthRow),
                      curYear;
                  //prepending result.rows
                  while(result.offset > 0){
                     ++insertedBefore;
                     if(!isYear){
                        result.drawedDays[0].setDate(result.drawedDays[0].getDate() - 7);
                     }
                     else{
                        result.drawedDays[0].setFullYear(result.drawedDays[0].getFullYear() - 1);
                     }
                     rowContainer = drawRow(result.drawedDays[0]);
                     result.rows.unshift(rowContainer);
                     result.table.prepend(rowContainer.row);
                     result.offset -= $ws._const.DateRange.rowHeight;
                  }
                  //appending result.rows
                  while(result.offset + result.rows.length * $ws._const.DateRange.rowHeight < calendarHeight){
                     rowContainer = drawRow(result.drawedDays[1]);
                     result.rows.push(rowContainer);
                     result.table.append(rowContainer.row);
                     if(!isYear){
                        result.drawedDays[1].setDate(result.drawedDays[1].getDate() + 7);
                     }
                     else{
                        curYear = result.drawedDays[1].getFullYear();
                        if ($ws._const.compatibility.dateBug && curYear === 2013) {
                           result.drawedDays[1].setHours(1);
                        }
                        result.drawedDays[1].setFullYear(curYear + 1);
                     }
                  }
                  //removing unused result.rows at bottom
                  while(result.offset + (result.rows.length - 3) * $ws._const.DateRange.rowHeight > calendarHeight){
                     result.rows.pop().row.remove();
                     if(!isYear){
                        result.drawedDays[1].setDate(result.drawedDays[1].getDate() - 7);
                     }
                     else{
                        result.drawedDays[1].setFullYear(result.drawedDays[1].getFullYear() - 1);
                     }
                  }
                  //removing unused result.rows at top
                  while(result.offset + $ws._const.DateRange.rowHeight * 2 < 0){
                     --insertedBefore;
                     result.rows.shift().row.remove();
                     result.offset += $ws._const.DateRange.rowHeight;
                     if(!isYear){
                        result.drawedDays[0].setDate(result.drawedDays[0].getDate() + 7);
                     }
                     else{
                        result.drawedDays[0].setFullYear(result.drawedDays[0].getFullYear() + 1);
                     }
                  }

                  //Анимация только после первой отрисоки - дефолтный скролл не требует анимации
                  if(result.redraw){
                     //animate
                     if(insertedBefore){
                        //Если Мы насоздавали записей в начале, то фактический отступ не поменялся
                        result.table.css('margin-top', (result.offset - insertedBefore * $ws._const.DateRange.rowHeight) + 'px');
                     }
                     if(noAnimation){
                        result.table.stop().css({'margin-top': result.offset + 'px'});
                     }
                     else{
                        result.table.stop().animate({'margin-top': result.offset + 'px'}, 'fast', 'linear');
                     }
                  }

                  if(!isYear && result.redraw){
                     //Updating year
                     var prevYear = self._currentYear;
                     self._currentYear = result.drawedDays[self._intervalNumber()].getFullYear();
                     if(prevYear !== self._currentYear){
                        self._updateYear();
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
                     self._selectMonth(monthIndex);
                  }

                  //Установка флага - с ним начинает работать анимация, просчитываться год, и т д
                  if(!result.redraw){
                     result.redraw = true;
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
         //Подписывается на событие вращения колеса мыши
         //Существует много проблем:
         // - Для файерфокса используется событие DOMMouseScroll
         // - Может отдаваться два вида значений - количество прокрученных строк или это же число, умноженную на константу (высота строки?)
         // - Разные браузеры под разными операционками могут отдавать инвертированные значения
         container.bind('mousewheel DOMMouseScroll', function(e){
            if(e.wheelDelta === undefined){
               e.wheelDelta = e.detail;
            }
            if($.browser.mozilla){
               e.wheelDelta *= -1;
            }
            var sign = (e.wheelDelta > 0 ? 1 : -1);
            result.offset += sign * $ws._const.DateRange.scrollCount;
            result.drawCalendar();
            return false;
         });
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
         $(document).unbind('mousedown.' + this.getId());
         $ws.proto.DateRange.superclass.destroy.apply(this, arguments);
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
         this._range[0] = date0;
         this._range[1] = date1;
         if(this._range[0] && this._range[1]){
            this._state = 2;
         }
         else if(this._range[0] || this._range[1]){
            this._state = 1;
         }
         else{
            this._state = 0;
         }
         //this._updateRangeTitle();
         this._updateSelection();
         this._updateSelectionSlider();
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
       * <wiTag group="Данные">
       * Устанавливает значение контрола
       * @param {Array|undefined} value Массив из двух дат (аналогично getValue())
       */
      setValue: function(value){
         if(value instanceof Array && value.length === 2){
            this.setRange(value[0], value[1]);
         }
         else if(value !== undefined){
            $ws.single.ioc.resolve('ILogger').error("DateRange::setValue", "Incorrect value " + value);
         }
      },
      /**
       * <wiTag group="Управление">
       * Включает-выключает контрол. В выключенном состоянии не реагирует на пользователя
       * @param {Boolean} enable Включён ли контрол
       */
      _setEnabled: function(enable){
         $ws.proto.DateRange.superclass._setEnabled.apply(this, arguments);
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

   return $ws.proto.DateRange;

});
