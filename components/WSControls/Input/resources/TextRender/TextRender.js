define('js!WSControls/Input/resources/TextRender/TextRender',
   [
      'Core/Control',
      'tmpl!WSControls/Input/resources/TextRender/TextRender',
      'js!WSControls/Input/resources/SelectionUtil',
      'js!WSControls/Input/resources/CalcInputValue'
   ],
   function(Control, template, SelectionUtil, CalcInputValue) {

      'use strict';

      var TextBoxRender = Control.extend({
         /**
          * @class WSControls.Input.resources.TextRender.TextRender
          * @extends Core/Control
          * @control
          * @private
          * @category Input
          * @author Журавлев Максим Сергеевич
          *
          * @event onTagClick Происходит при клике по тегу.
          * @event onTagHover Происходит когда курсор мыши входит в область тега.
          * @event onChangeValue Происходит при изменении текста в поле ввода.
          * @event onInputFinish Происходит при завершении ввода.
          *
          * @name WSControls.Input.resources.TextRender.TextRender#getInputData
          * @cfg {Function} callback обработчика ввода.
          * @param {Object} Разбиение строки.
          * {
          *    beforeInputValue: Строка до введенной,
          *    inputValue: Введенная строка,
          *    afterInputValue: Строка после введенной
          * }
          * @returns {Object} Данные для поля ввода.
          * {
          *    value: Значение поля.
          *    position: Позиция курсора.
          * }
          *
          *
          * @name WSControls.Input.resources.TextRender.TextRender#value
          * @cfg {String} Значение поля.
          *
          * @name WSControls.Input.resources.TextRender.TextRender#tagStyle
          * @cfg {String} Набор цветов для иконки
          * @variant primary #587AB0.
          * @variant done #72BE44.
          * @variant attention #FEC63F.
          * @variant error #EF463A.
          * @variant info #999999.
          *
          * @name WSControls.Input.resources.TextRender.TextRender#placeholder
          * @cfg {String} Устанавливает текст подсказки внутри поля ввода.
          *
          * @name WSControls.Input.resources.TextRender.TextRender#selectOnClick
          * @cfg {Boolean} Определяет режим выделения текста в поле ввода при получении фокуса.
          * @variant true Выделять текст.
          * @variant false Не выделять текст.
          */
         _controlName: 'WSControls/Input/resources/TextRender/TextRender',

         _template: template,

         constructor: function(options) {
            TextBoxRender.superclass.constructor.call(this, options);

            this._selectionUtil = new SelectionUtil();

            this._publish('onChangeValue', 'onInputFinish', 'onTagClick', 'onTagHover');
         },

         /**
          * Обработчик ввода.
          * @param event
          * @private
          */
         _inputHandler: function(event) {
            var newValue = event.target.value, position = event.target.selectionEnd, splitValue, inputData;

            if (event.nativeEvent.inputType === 'deleteContentBackward') {
               splitValue = {
                  beforeInputValue: newValue.substring(0, position),
                  inputValue: '',
                  afterInputValue: newValue.substring(position)
               };
            } else {
               splitValue = CalcInputValue.getSplitInputValue(this._options.value, newValue, position, this._selectionUtil.selectionEnd - this._selectionUtil.selectionStart);
            }

            inputData = this._options.getInputData(splitValue);

            updateTargetValue.call(this, event.target, inputData.value, inputData.position);

            this._notify('onChangeValue', inputData.value);
         },

         /**
          * Обработчик фокусировки элемента.
          * @param event
          * @private
          */
         _focusHandler: function(event) {
            if (this._options.selectOnClick) {
               event.target.select();
            }
         },

         /**
          * Обработчик поднятия клавиш.
          * @param event
          * @private
          */
         _keyupHandler: function(event) {
            var keyCode = event.nativeEvent.keyCode;

            // При нажатии стрелок происходит смещение курсора.
            if (keyCode > 36 && keyCode < 41) {
               this._selectionUtil.updateSelectionPosition(event.target);
            }
         },

         /**
          * Обработчик обновления выделения.
          * @param event
          * @private
          */
         _updateSelectionHandler: function(event) {
            this._selectionUtil.updateSelectionPosition(event.target);
         },

         _notifyHandler: function(event, value) {
            this._notify(value);
         }
      });

      function updateTargetValue(target, value, position) {
         target.value = value;
         this._selectionUtil.updateSelectionPositionTarget(target, position, position);
         this._selectionUtil.updateSelectionPosition(target);
      }

      return TextBoxRender;
   }
);