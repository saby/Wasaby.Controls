define('Controls/Input/resources/InputRender/InputRender',
   [
      'Core/Control',
      /*'WS.Data/Type/descriptor',*/
      'tmpl!Controls/Input/resources/InputRender/InputRender',
      'Controls/Input/resources/RenderHelper',

      'css!Controls/Input/resources/InputRender/InputRender'
   ],
   function(Control, /*types,*/ template, RenderHelper) {

      'use strict';

      /**
       * @class Controls.Input.resources.InputRender.InputRender
       * @extends Core/Control
       * @mixes Controls/Input/resources/InputRender/InputRenderDocs
       * @control
       * @private
       * @category Input
       * @author Баранов М.А.
       */

      var _private = {

         getSelection: function(self){
            var
               result = self._selection;

            //Если курсор ещё не был поставлен в поле, то поставим его в конец
            if (!result) {
               result = {
                  selectionStart: self._options.value ? self._options.value.length : 0,
                  selectionEnd: self._options.value ? self._options.value.length : 0
               };
            }

            return result;
         },

         getTargetPosition: function(target){
            return target.selectionEnd;
         },

         saveSelection: function(self, target){
            self._selection = _private.getSelection(self);
            self._selection.selectionStart = target.selectionStart;
            self._selection.selectionEnd = target.selectionEnd;
         },

         setTargetData: function(target, data){
            target.value = data.value;
            target.setSelectionRange(data.position, data.position);
         }

      };

      var InputRender = Control.extend({
         
         _controlName: 'Controls/Input/resources/InputRender/InputRender',
         _template: template,
         _value: '',

         constructor: function (options) {
            InputRender.superclass.constructor.apply(this, arguments);

            this._value = options.viewModel.getValueForRender(options.value);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.value !== this._options.value) {
               this._value = newOptions.viewModel.getValueForRender(newOptions.value);
            }
         },

         _inputHandler: function(e) {
            var
               value = this._value,
               newValue = e.target.value,
               selection = _private.getSelection(this),
               position = _private.getTargetPosition(e.target),
               inputType, splitValue, processedData;

            /**
             * У android есть баг/фича: при включённом spellcheck удаление последнего символа в textarea возвращает
             * inputType == 'insertCompositionText', вместо 'deleteContentBackward'.
             * Соответственно доверять ему мы не можем и нужно вызвать метод RenderHelper.getInputType
             */
            inputType = e.nativeEvent.inputType && e.nativeEvent.inputType !== 'insertCompositionText' ?
                  RenderHelper.getAdaptiveInputType(e.nativeEvent.inputType, selection) :
                  RenderHelper.getInputType(value, newValue, position, selection);
            //Подготавливаем объект с разобранным значением
            splitValue = RenderHelper.getSplitInputValue(value, newValue, position, selection, inputType);

            //
            processedData = this._options.viewModel.inputHandler(splitValue, inputType);

            _private.setTargetData(e.target, processedData);
            _private.saveSelection(this, e.target);

            this._notify('valueChanged', [this._options.viewModel.getValueForNotify(processedData.value)]);
         },

         _keyUpHandler: function(e) {
            var keyCode = e.nativeEvent.keyCode;

            // При нажатии стрелок происходит смещение курсора.
            if (keyCode > 36 && keyCode < 41) {
               _private.saveSelection(this, e.target);
            }
         },

         _clickHandler: function(e) {
            _private.saveSelection(this, e.target);
         },

         _selectionHandler: function(e){
            _private.saveSelection(this, e.target);
         },

         _inputCompletedHandler: function(e) {
            this._notify('inputCompleted', [this._options.viewModel.getValueForNotify(e.target.value)]);
         },

         _notifyHandler: function(e, value) {
            this._notify(value);
         },

         _getInputState: function() {
            var
               result;

            if (this._options.validationErrors && this._options.validationErrors.length) {
               result = 'error';
            } else if (this.isEnabled()) {
               result = 'default';
            } else {
               result = 'disabled';
            }

            return result;
         },

         _focusHandler: function(e) {
            if (this._options.selectOnClick) {
               e.target.select();
            }
         },

         /**
          * Метод вставляет строку text вместо текущего выделенного текста в инпуте
          * Если текст не выделен, то просто вставит text на позицию каретки
          * @param text
          * @param selectionStart
          * @param selectionEnd
          * @returns {Number} позиция каретки.
          */
         paste: function(text, selectionStart, selectionEnd) {
            var
               processedData = this._options.viewModel.inputHandler({
                  before: this._value.slice(0, selectionStart),
                  insert: text,
                  after: this._value.slice(selectionEnd, this._value.length)
               }, 'insert');

            if (this._value !== processedData.value) {
               this._notify('valueChanged', [this._options.viewModel.getValueForNotify(processedData.value)]);
            }

            this._selection = {
               selectionStart: selectionStart + text.length,
               selectionEnd: selectionStart + text.length
            };

            //Возвращаем позицию каретки. Она обрабатывается методом pasteHelper
            return processedData.position;
         }
      });

      InputRender.getDefaultOptions = function() {
         return {
            value: '',
            selectOnClick: false
         };
      };

      //TODO расскоментировать этот блок + зависимость types когда полечат https://online.sbis.ru/opendoc.html?guid=e53e46a0-9478-4026-b7d1-75cc5ac0398b
      /*InputRender.getOptionTypes = function() {
         return {
            value: types(String),
            selectOnClick: types(Boolean),
            prepareValue: types(Function).required(),
            tagStyle: types(String).oneOf([
               'primary',
               'done',
               'attention',
               'error',
               'info'
            ])
         };
      };*/

      return InputRender;
   }
);