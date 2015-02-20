/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 22:48
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FieldAbstract', ['js!SBIS3.CORE.Control', 'js!SBIS3.CORE.Infobox', 'css!SBIS3.CORE.FieldAbstract'], function( Control, Infobox ) {

   "use strict";
   var ie8CutLength = 50;

   /**
    * @class $ws.proto.FieldAbstract
    * @extends $ws.proto.DataBoundControl
    */
   $ws.proto.FieldAbstract = Control.DataBoundControl.extend(/** @lends $ws.proto.FieldAbstract.prototype */{
      /**
       * <wiTag class="FieldCheckbox" noShow>
       * @event onActivated При нажатии клавиши Enter в поле
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * При нажатии клавиши Enter в поле ввода (myField) закрыть окно, если пользователь согласен.
       * <pre>
       *    myField.subscribe('onActivated', function() {
       *       //cохраним ссылку на поле, чтобы использовать его во внутренней функции
       *       var self = this;
       *       $ws.helpers.question('Вы хотите завершить ввод данных?').addCallback(function(result) {
       *          if (result === true) {
       *             //пользователь согласился, закроем окно редактирования
       *             self.getParentWindow().close();
       *          }
       *       });
       *    });
       * </pre>
       */
      $protected : {
         _curval : '',
         _inputControl: null,
         _pasteProcessing: 0,
         _changed: false, // необходимо для (не)вызова валидации при уходе фокуса
         _editAtPlace: false,
         _editAtPlaceElement: null,
         _editAtPlaceElementInner: null,
         _editAtPlaceHasAuto: false,
         _wsField: null,
         _textAlign: null,
         _options : {
            // TODO FieldDropdown ширина в IE с px не поддерживается(падает).
            /**
             * @cfg {Number|String} Ширина
             * <wiTag group="Отображение">
             */
            width : '120px',
            /**
             * @cfg {String} Отступы от контрола
             * Свойство определяет внешние отступы от контейнера контрола.
             * <wiTag group="Отображение">
             * @example
             * <pre>
             *    var dfr = attachInstance('SBIS3.CORE.TemplatedArea', {
             *       autoHeight: true,
             *       element: container,
             *       margin: '0 2px 2px 0',
             *       parent: this.getParent()
             *    });
             * </pre>
             * @noShow
             */
            margin : '',
            /**
             * @cfg {Boolean} Поле только для чтения
             * <wiTag group="Управление">
             * Свойство определяет для поля активность режима "Только для чтения".
             * В этом режиме поле недоступно для взаимодействия с пользователем и выделено серым цветом.
             * @example
             * <pre>
             *    var dfr = attachInstance('SBIS3.CORE.TemplatedArea', {
             *       autoHeight: true,
             *       element: container,
             *       margin: '0 2px 2px 0',
             *       parent: this.getParent(),
             *       readOnly: true
             *    });
             * </pre>
             */
            readOnly: false,
            /**
             * @cfg {Number|null} Максимальная длина текста
             * <wiTag group="Управление">
             * Опция задаёт ограничение длины вводимого в поле текста.
             * Значение данной опции равняется допустимому для ввода количеству символов.
             * При использовании для дробных чисел необходимо учитывать, что запятая будет являться одним символом.
             */
            maxLength: null,
            /**
             * @cfg {String} Тултип в режиме редактирования по месту
             * <wiTag group="Управление">
             * Свойство определяет текст, который будет показан в режиме редактирования по месту, когда в поле отсутствует значение.
             */
            editAtPlaceTooltip: '',
            cssClass: "ws-field-abstract"
         }
      },

      $constructor : function(){
         this._bindInternals();
         this._publish('onActivated');
         this._initEvents();
         this.subscribe("onChange", function() {
            this._changed = true;
         });
      },
      _initEvents: function(){
         var
            self = this,
            name = this.getName(),
            label = this._getLinkedLabel();
         if (typeof self._inputControl !== "undefined") {
            if (label) {
               label.click(function(event) {
                  // Просто мега костыль, пытались уйти от него используя стандартное поведение браузера, но увы (
                  event.preventDefault();
                  self.setActive(true);
               });
            }
            if (name) {
               self._inputControl.attr('id', 'fld-' + name);
            }
         }
         // TODO сделать через KeysWeHandle
         if (this._inputControl  && this._inputControl !== undefined){
            this._passthroughControlButtons();
            // keyup не должен обрабатыватся для FieldDate, в нём валидируем только по focusout и change
            this._inputControl.bind('keyup change blur', function(event){
               if (self._isChangeable()){
                  // Не обновляем значение пока не завершилось действие вставки
                  if (!self._pasteProcessing) {
                     // Передаем вторым параметром, если событие было на keyup (для FieldDate)
                     self._onValueChangeHandler(undefined, event.type === 'keyup'); // после вставки мы тебя всё равно вызовем.
                  }
                  self._fireOnActivated(event);
               }
            });

         }
      },
      _fireOnActivated: function(event) {
         if(event && event.keyCode == $ws._const.key.enter){
            this._notify('onActivated');
         }
      },
      /**
       * Проверяет опции
       * @protected
       */
      _initConfig: function(){
      },
      _bindInternals : function(){},
      /**
       * Считает значение по умолчанию
       * @returns {*}
       * @protected
       */
      _getDefaultValue: function(){
         if(this._options.value !== '' && (typeof this._options.value in {'string':0, 'function': 0}))
            return (typeof this._options.value === 'function' ? this._options.value() : this._options.value);
      },
      /**
       * Функция обработки получения значения из контекста
       * Дочерний класс может перегрузить, если требуется.
       * По дефолту просто выполняет _setValueInternal, если значение не undefined
       * @param ctxVal значение, полученное из контекста.
       * @protected
       */
      _onContextValueReceived: function(ctxVal){
         if (ctxVal !== undefined) {
            if (!$ws.helpers.compareValues(ctxVal, this._notFormatedVal())) {
               this._setValueInternal(ctxVal);
               if (this.isMarked()) {
                  this.validate();
               }
               this._notifyOnValueChange(this._notFormatedVal());
            }
         }
      },
      /**
       * При состоянии контрола, в котором запрещена запись - прокидывать служебные клавиши(tab, esc, ctrl)
       */
      _passthroughControlButtons: function() {
         var self = this;
         this._inputControl.bind('keypress.readonly, change.readonly, keyup.readonly, keydown.readonly', function(event) {
            if ((!self._isChangeable()) && event.which != $ws._const.key.tab && event.which != $ws._const.key.esc && !event.ctrlKey) {
               event.preventDefault();
               event.stopImmediatePropagation();
            }
         });
      },
      _isChangeable: function() {
         return (!this._options.readOnly && this._options.enabled);
      },
      /**
       * <wiTag group="Управление">
       * Возаращает значение опции readOnly
       */
      isReadOnly: function() {
         return this._options.readOnly;
      },
      /**
       * <wiTag group="Управление">
       * Устанавливает опцию readOnly
       * @param readOnly значение опции
       */
      setReadOnly: function(readOnly) {
         this._options.readOnly = readOnly;
         if (readOnly) {
            /*
             * FIXME readonly и ws-enabled и ws-disabled - схожие стилевые оформления...
             */
            this._container.addClass('readonly');
            this._inputControl.attr('readonly', 'readonly');
         } else {
            this._container.removeClass('readonly');
            this._inputControl.removeAttr('readonly');
         }
      },
      /**
       * Данная функция используется для обработки событий изменения данных внутри контрола.
       * Обычно вызывается по change и keyup
       * Дочерний класс может переопределить данную функцию
       * @param noAutoComplete см $ws.proto.FieldDate, там параметры заданы так
       * @param onKeyUp попали сюда по вводу с клавиатуры, нужно в fieldLink, там у input переопределяется _noFormatedVal
       */
      _onValueChangeHandler: function(noAutoComplete, onKeyUp) {
         this._curval = this._curValue();
         var
            notFormattedValue = this._notFormatedVal(undefined, onKeyUp),
            currentContextValue = this.getValue(),
            comparisonResult = notFormattedValue && notFormattedValue.equals
               ? notFormattedValue.equals(currentContextValue)
               : notFormattedValue == currentContextValue;
         if (!comparisonResult){
            this._notifyOnChange(notFormattedValue);
            this.clearMark();
            if(Infobox.hasTarget() && !Infobox.isCurrentTarget(this._getExtendedTooltipTarget())) {
               // если подсказка не на нас, то скрываем её (она может нас перекрывать) 
               Infobox.hide(0);
            }
         }
      },
       /**
        * Извещает об изменении данных внутри контрола.
        * @param notFormattedValue
        * @private
        */
      _notifyOnChange: function(notFormattedValue){
         this._updateSelfContextValue(notFormattedValue);
         this._notify('onChange', notFormattedValue);
         this._notifyOnValueChange(notFormattedValue);
      },
      _setEnabled : function(s){
            this._setDisableAttr(s);
            $ws.proto.FieldAbstract.superclass._setEnabled.apply(this, arguments);
      },
      /**
       * <wiTag group="Управление">
       * Задать режим "Редактирование по месту".
       * Этот режим позволяет локально редактировать и сохранять изменения, внесённые в поле ввода.
       * В режиме редактирования при нажатии кнопки "Сохранить" происходит валидация содержимого поля.
       * Если поле не проходит валидацию, то контрол маркируется красным цветом и остаётся в режиме редактирования.
       * @param {Boolean} [s=true]
       * true - включить для поля ввода режим "Редактирование по месту".
       * false - перевести поле в обычный режим функционирования.
       * @example
       * В зависимости от имени родителя задать режим "Редактирование по месту" для всех полей ввода (fieldString).
       * <pre>
       *    control.subscribe('onReady', function() {
       *       //получаем имя родителя
       *       var name = this.getParent().getName();
       *       //otherName - имя родителя, с которым хотим сравнить
       *       if (name == otherName) {
       *          //array - массив с полями ввода
       *          $ws.helpers.forEach(array, function(element) {
       *             element.setEditAtPlace();
       *          });
       *       }
       *    });
       * </pre>
       */
      setEditAtPlace: function (s) {
         this._editAtPlace = (s !== false);
         var value = this.getStringValue();

         if (!this._editAtPlaceElement) {
            this._initEditAtPlace();
         }

         this._updateInPlaceValue(value);

         this.getContainer().toggleClass('ws-field-underline', this._editAtPlace);
         this._editAtPlaceElement.toggleClass('ws-hidden', !this._editAtPlace);
         this._wsField.toggleClass('ws-hidden', this._editAtPlace);
      },
      /**
       * Установить подсказку в поле в режиме "текст с подчеркиванием", если значение пустое
       * @param tooltip новый тултип при пустом значении в поле
       */
      setEditAtPlaceTooltip: function (tooltip) {
         this._options.editAtPlaceTooltip = tooltip;
         var value = this.getStringValue();
         if (!this._editAtPlaceElement) {
            this._initEditAtPlace();
         }
         this._updateInPlaceValue(value);
      },
      getEditAtPlaceTooltip: function () {
         return this._options.editAtPlaceTooltip;
      },
      /**
       * Обновляет tooltip в радактировании по месту
       * @param {*} value
       * @protected
       */
      _handleInPlaceTooltip: function(value) {
         if (!!value) {
            this._editAtPlaceElement.attr('title', value);
         } else {
            if (!this._options.tooltip) {
               this._editAtPlaceElement.attr('title', '');
            } else {
               this._editAtPlaceElement.attr('title', this._options.tooltip);
            }
         }
      },
      /**
       * Обновление значения в текстовом поле при его изменении извне
       * @param {*} value новое значение
       * @protected
       */
      _updateInPlaceValue: function (value) {
         if (this._editAtPlace) {
            this._handleInPlaceTooltip(value);
            if (this._options.editAtPlaceTooltip && !value) {
               value = this._options.editAtPlaceTooltip;
               this._editAtPlaceElement.addClass('editAtPlace-empty');
            } else {
               this._editAtPlaceElement.removeClass('editAtPlace-empty');
            }
            // В ie8 есть бага, расширяющая все дивы по тексту даже если overflow:hidden 
            if($ws._const.browser.isIE8 && value && value.length > ie8CutLength) {
               value = value.substr(0, ie8CutLength-1) + '…';
            }
            this._editAtPlaceHasAuto = !!value && (this._textAlign !== 'right');
            this.getContainer()
               .toggleClass('ws-editAtPlace-empty', !value)
               .toggleClass('ws-editAtPlace-autowidth', this._editAtPlaceHasAuto);
            this._editAtPlaceElementInner.text(value || '\xA0'); // char 160 - &nbsp;
         }
      },

      _setEditAtPlaceStyles: function() {
         this._editAtPlaceElementInner.css({
            'lineHeight': parseFloat(this._container.innerHeight()) - 2 + 'px'
         });
      },
      /**
       * Инициализация переменных для отображения редактирования по месту в поле ввода.
       * @private
       */
      _initEditAtPlace : function() {
         this._wsField = this.getContainer().find('.ws-field');
         this._editAtPlaceElement = $('<span class="ws-editAtPlace ws-hidden"><span class="ws-editAtPlace-inner"></span></span>');
         this._editAtPlaceElementInner = this._editAtPlaceElement.find('.ws-editAtPlace-inner');

         this._setEditAtPlaceStyles();
         this._wsField.after(this._editAtPlaceElement);
         this._textAlign = this.getContainer().css('textAlign');

         var self = this;
         this._handleInPlaceTooltip(this.getStringValue());
         this.setTooltip = this.setTooltip.callNext(function (tooltip) {
            self._handleInPlaceTooltip(self.getStringValue());
         });
      },

      _setDisableAttr : function(s){
         if (s === false)
            this._inputControl.attr('disabled', 'disabled');
         else
            this._inputControl.removeAttr('disabled');
      },
      /**
       * Получить неформатированное значение
       * @return {string} ставляет в блок переданное значение
       */
      _notFormatedVal : function(){
         return this._curval;
      },
      /**
       * возвращает код нажатой клавиши
       * @param event
       */
      _extractKey : function(event){
         return event.which || event.charCode || event.keyCode;
      },
      /**
       * <wiTag group="Управление">
       * Изменить текущее значение.
       * @param {*} value Новое значение.
       * @param {Boolean} [ignoreReadonly] Игнорировать режим "Только для чтения", определяемый свойством {@link readonly}.
       * Если параметр ignoreReadonly = true, то метод setValue принудительно изменит значение контрола.
       * @param {Boolean} [noRevalidate] true - не проводить валидацию контрола.
       * @see readonly
       */
      setValue : function(value, ignoreReadonly, noRevalidate){
         //TODO: избавиться от ignoreReadonly
         this._setValueInternal(value);
         this._updateSelfContextValue(this._notFormatedVal());
         this._notifyOnValueChange(this.getValue());
         if(noRevalidate !== true)
            this.validate();
      },
      _setValueInternal : function(value) {
         this._updateInPlaceValue(value);
         this._curval = value;
      },
      _curValue: function(){
         return this._curval;
      },
      /*destroy: function() {
         $ws.proto.FieldAbstract.superclass.destroy.apply(this, arguments);
      },*/
      /**
       * <wiTag group="Данные">
       * Получить строковое представление текущего значения контрола.
       * @returns {String} Cтроковое представление значения.
       * @example
       * 1. При клике на кнопку (btn) установить значение поля контекста.
       * В качестве имени поля взять строковое представление текущего значения группы радиокнопок (fieldRadio).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       var value = fieldRadio.getStringValue();
       *       this.getParent().getLinkedContext.setValue(value, true);
       *    });
       * </pre>
       *
       * 2. При готовности контрола проверить строковое представление текущего значения выпадающего списка (fieldDropdown).
       * Если необходимо, то запретить пользователю взаимодействовать с группой флагов (groupCheckbox).
       * <pre>
       *    control.subscribe('onReady', function() {
       *       if (fieldDropdown.getStringValue() == '') {
       *          groupCheckbox.setEnabled(false);
       *       }
       *    });
       * </pre>
       *
       * 3. Для поля ввода (myField) установлена маска на ввод номера телефона.
       * Если поле заполнено, снять отметку об ошибке.
       * <pre>
       *    var strVal = myField.getStringValue();
       *    if (strVal.length == 18) {
       *       myField.clearMark();
       *    }
       * </pre>
       */
      getStringValue : function(){
         return this._curValue();
      },
      setActive: function(active) {
         if(!active && this._changed)
            this.validate();
         $ws.proto.FieldAbstract.superclass.setActive.apply(this, arguments);
      }
   });

   return $ws.proto.FieldAbstract;

});
