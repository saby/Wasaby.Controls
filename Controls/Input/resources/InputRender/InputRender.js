define('js!Controls/Input/resources/InputRender/InputRender',
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
       * @control
       * @private
       * @category Input
       * @author Журавлев Максим Сергеевич
       */

      var _private = {

         getSelection: function(){
            return this._selection;
         },

         getTargetPosition: function(target){
            return target.selectionEnd;
         },

         saveSelection: function(target){
            this._selection = this._selection || {};
            this._selection.selectionStart = target.selectionStart;
            this._selection.selectionEnd = target.selectionEnd;
         },

         setTargetData: function(target, data){
            target.value = data.value;
            target.setSelectionRange(data.position, data.position);
         }

      };

      var InputRender = Control.extend({
         
         _controlName: 'Controls/Input/resources/InputRender/InputRender',
         _template: template,

         constructor: function() {
            InputRender.superclass.constructor.apply(this, arguments);

            this._prepareClassesByConfig = function() {
               var
                  fieldClasses = [],
                  wrapperClasses = [],
                  containerClasses = [],
                  isEnabled = this.isEnabled();

               containerClasses.push('controls-InputRender_state_' + (isEnabled ? 'default' : 'disabled'));
               !isEnabled && containerClasses.push('controls-InputRender_state_disabled_' + (this._isMultiline ? 'multiLine' : 'singleLine'));
               containerClasses.push('controls-InputRender_size_' + (this._options.size ? this._options.size : 'm'));
               containerClasses.push('controls-InputRender_padding' + (this._options.sidePadding ? this._options.sidePadding : 'Both'));
               if (this.textTransform) {
                  fieldClasses.push('controls-InputRender__field-' + this.textTransform);
               }
               //В новой престо в больших полях ввода будет отступ снизу
               if (this.size === 'l') {
                  fieldClasses.push('controls-InputRender__field_size_l');
               }
               wrapperClasses.push('controls-InputRender__wrapper_' + (this._isMultiline ? 'multiLine' : 'singleLine'));

               return {
                  container: containerClasses.join(' '),
                  field: fieldClasses.join(' '),
                  wrapper: wrapperClasses.join(' ')
               }
            };
         },

         _inputHandler: function(e) {
            var
               value = this._options.value,
               newValue = e.target.value,
               selection = _private.getSelection.call(this),
               position = _private.getTargetPosition.call(this, e.target),
               inputType, splitValue, processedData;

            inputType = e.nativeEvent.inputType ?
                  RenderHelper.getAdaptiveInputType(e.nativeEvent.inputType, selection) :
                  RenderHelper.getInputType(value, newValue, position, selection);
            //Подготавливаем объект с разобранным значением
            splitValue = RenderHelper.getSplitInputValue(value, newValue, position, selection, inputType);

            //
            processedData = this._options.viewModel.prepareData(splitValue, inputType);

            _private.setTargetData.call(this, e.target, processedData);
            _private.saveSelection.call(this, e.target);

            if(value !== processedData.value){
               this._notify('onChangeValue', processedData.value);
            }
         },

         _keyUpHandler: function(e) {
            var keyCode = e.nativeEvent.keyCode;

            // При нажатии стрелок происходит смещение курсора.
            if (keyCode > 36 && keyCode < 41) {
               _private.saveSelection.call(this, e.target);
            }
         },

         _clickHandler: function(e) {
            _private.saveSelection.call(this, e.target);
         },

         _selectionHandler: function(e){
            _private.saveSelection.call(this, e.target);
         },

         _notifyHandler: function(e, value) {
            this._notify(value);
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