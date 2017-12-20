define('js!Controls/Input/resources/InputRender/InputRender',
   [
      'Core/Control',
      /*'WS.Data/Type/descriptor',*/
      'tmpl!Controls/Input/resources/InputRender/InputRender',
      'Controls/Input/resources/RenderHelper',
      'css!SBIS3.CONTROLS/TextBox'
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

         getSelection: function(self){
            return self._selection;
         },

         getTargetPosition: function(target){
            return target.selectionEnd;
         },

         saveSelection: function(self, target){
            self._selection = self._selection || {};
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

         _inputHandler: function(e) {
            var
               value = this._options.value,
               newValue = e.target.value,
               selection = _private.getSelection(this),
               position = _private.getTargetPosition(e.target),
               inputType, splitValue, processedData;

            inputType = e.nativeEvent.inputType ?
                  RenderHelper.getAdaptiveInputType(e.nativeEvent.inputType, selection) :
                  RenderHelper.getInputType(value, newValue, position, selection);
            //Подготавливаем объект с разобранным значением
            splitValue = RenderHelper.getSplitInputValue(value, newValue, position, selection, inputType);

            //
            processedData = this._options.viewModel.prepareData(splitValue, inputType);

            _private.setTargetData(e.target, processedData);
            _private.saveSelection(this, e.target);

            if(value !== processedData.value){
               this._notify('onChangeValue', processedData.value);
            }
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

         _notifyHandler: function(e, value) {
            this._notify(value);
         }
      });

      InputRender.getDefaultOptions = function() {
         return {
            value: '',
            selectOnClick: false,
            viewModel: {
               prepareData: function(splitValue) {
                  return {
                     value: splitValue.before + splitValue.insert + splitValue.after,
                     position: splitValue.before.length + splitValue.insert.length
                  }
               }
            }
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