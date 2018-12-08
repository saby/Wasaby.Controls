define('Controls/Input/resources/InputRender/InputRender',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'Controls/Utils/tmplNotify',
      'wml!Controls/Input/resources/InputRender/InputRender',
      'Controls/Input/resources/RenderHelper',
      'Core/detection',
      'Controls/Utils/getWidth',
      'Core/EventBus',
      'css!theme?Controls/Input/resources/InputRender/InputRender'
   ],
   function(Control, types, tmplNotify, template, RenderHelper, cDetection, getWidthUtils, EventBus) {
      'use strict';

      /**
       * @class Controls/Input/resources/InputRender/InputRender
       * @extends Core/Control
       * @mixes Controls/Input/resources/InputRender/InputRenderStyles
       * @control
       * @private
       * @category Input
       * @author Журавлев М.С.
       */

      var _private = {

         getSelection: function(self) {
            var
               result = self._selection,
               val = self._options.viewModel.getDisplayValue();

            // Если курсор ещё не был поставлен в поле, то поставим его в конец
            if (!result) {
               result = {
                  selectionStart: val ? val.length : 0,
                  selectionEnd: val ? val.length : 0
               };
            }

            return result;
         },
         isRequired: function() {
            return cDetection.isIE;
         },

         getTargetPosition: function(target) {
            return target.selectionEnd;
         },

         saveSelection: function(self, target) {
            self._selection = _private.getSelection(self);
            self._selection.selectionStart = target.selectionStart;
            self._selection.selectionEnd = target.selectionEnd;
         },

         setTargetData: function(target, data) {
            target.value = data.value;
            target.setSelectionRange(data.position, data.position);
         },

         getTooltip: function(text, tooltip, hasHorizontalScroll) {
            // In order to hide a browser tooltip (something like "Please fill out this field.") title attribute must be
            // set to empty string in  IE. But this method doesn't work if input is inside a <form> element,
            // so if someone wants to use forms they should specify a tooltip.
            return hasHorizontalScroll ? text : '';
         },

         /**
          * Returns the current input state, depending on the control config
          * @param self
          * @param options
          * @return {String}
          */
         getInputState: function(self, options) {
            if (options.validationErrors && options.validationErrors.length) {
               return 'error';
            } if (options.readOnly) {
               return 'disabled';
            } if (self._inputActive) {
               return 'active';
            }
            return 'default';
         },

         getInputValueForTooltip: function(inputType, inputValue) {
            // FIXME будет решаться по ошибке, путём выделения подсказики в HOC https://online.sbis.ru/opendoc.html?guid=6239c863-53dc-4cda-90a1-d2ad96979c80
            return inputType === 'password' ? '' : inputValue;
         },

         hasHorizontalScroll: function(target, text) {
            if (!text) {
               return false;
            }
            return getWidthUtils.getWidth(text) > target.clientWidth;
         },

         getInput: function(self) {
            // TODO: убрать querySelector после исправления https://online.sbis.ru/opendoc.html?guid=403837db-4075-4080-8317-5a37fa71b64a
            return self._children.divinput.querySelector('.controls-InputRender__field');
         },

         hasSelectionChanged: function(field, selection) {
            return field.selectionStart !== selection.selectionStart || field.selectionEnd !== selection.selectionEnd;
         },

         initSelection: function(self) {
            var input = _private.getInput(self);

            if (input) {
               var selection = self._selection;
               var end = self._options.viewModel.getDisplayValue().length;
               var newSelection = {
                  selectionStart: end,
                  selectionEnd: end
               };

               if (!selection && _private.hasSelectionChanged(input, newSelection)) {
                  input.selectionStart = newSelection.selectionStart;
                  input.selectionEnd = newSelection.selectionEnd;
               }
            }
         }
      };

      var InputRender = Control.extend({

         _template: template,

         _notifyHandler: tmplNotify,
         _tooltip: '',
         _required: false,

         // Current state of input. Could be: 'default', 'disabled', 'active', 'error'
         _inputState: undefined,

         // text field has focus
         _inputActive: false,

         _beforeMount: function(options) {
            this._inputState = _private.getInputState(this, options);
            this._required = _private.isRequired();
         },

         _afterMount: function() {
            /**
             * The cursor should be at the end until the user changes it.
             * But setting the value in the field through the value attribute the cursor is at the beginning.
             * https://jsfiddle.net/yc9f5oad/
             * Therefore, we will install it ourselves.
             */
            _private.initSelection(this);
         },


         _beforeUpdate: function(newOptions) {
            this._inputState = _private.getInputState(this, newOptions);
         },

         _afterUpdate: function() {
            _private.initSelection(this);
         },

         _mouseEnterHandler: function() {
            var input = _private.getInput(this);
            var tooltipInputValue = _private.getInputValueForTooltip(input.getAttribute('type'), this._options.viewModel.getDisplayValue());

            this._tooltip = _private.getTooltip(tooltipInputValue, this._options.tooltip, _private.hasHorizontalScroll(input, tooltipInputValue));
         },

         _inputHandler: function(e) {
            var
               value = this._options.viewModel.getDisplayValue(),
               newValue = e.target.value,
               selection = _private.getSelection(this),
               position = _private.getTargetPosition(e.target),
               inputType, splitValue, processedData;

            /**
             * No need to process the input if the value has not changed.
             * The input event can be triggered when the ie focus goes out, if placeholder is set.
             * This is done every time the template is redrawn.
             * https://www.carsonshold.com/2013/12/js-bug-ie-10-and-11-oninput-event-with-placeholder-set/
             */
            if (value === newValue) {
               return;
            }

            /**
             * У android есть баг/фича: при включённом spellcheck удаление последнего символа в textarea возвращает
             * inputType == 'insertCompositionText', вместо 'deleteContentBackward'.
             * Соответственно доверять ему мы не можем и нужно вызвать метод RenderHelper.getInputType
             */
            inputType = e.nativeEvent.inputType && e.nativeEvent.inputType !== 'insertCompositionText'
               ? RenderHelper.getAdaptiveInputType(e.nativeEvent.inputType, selection)
               : RenderHelper.getInputType(value, newValue, position, selection);

            // Подготавливаем объект с разобранным значением
            splitValue = RenderHelper.getSplitInputValue(value, newValue, position, selection, inputType);

            //
            processedData = this._options.viewModel.handleInput(splitValue, inputType);

            _private.setTargetData(e.target, processedData);
            _private.saveSelection(this, e.target);

            if (value !== processedData.value) {
               this._notify('valueChanged', [this._options.viewModel.getValue()]);
            }

            this._tooltip = _private.getTooltip(this._options.viewModel.getDisplayValue(), this._options.tooltip,
               _private.hasHorizontalScroll(_private.getInput(this), this._options.viewModel.getDisplayValue()));
         },

         _keyUpHandler: function(e) {
            var keyCode = e.nativeEvent.keyCode;

            // При нажатии стрелок происходит смещение курсора.
            if (keyCode > 36 && keyCode < 41) {
               _private.saveSelection(this, e.target);
            }
         },

         _clickHandler: function(e) {
            var self = this;

            // When you click on selected text, input's selection updates after this handler,
            // thus we need to delay saving selection until it is updated.
            setTimeout(function() {
               _private.saveSelection(self, e.target);
            });
         },

         _clickPlaceholderHandler: function() {
            /**
             * Placeholder is positioned above the input field. When clicking, the cursor should stand in the input field.
             * To do this, we ignore placeholder using the pointer-events property with none value.
             * The property is not supported in ie lower version 11. In ie 11, you sometimes need to switch versions in emulation to work.
             * Therefore, we ourselves will focus the field on click.
             * https://caniuse.com/#search=pointer-events
             */
            if (cDetection.IEVersion < 12) {
               this.activate();
            }
         },

         _selectionHandler: function(e) {
            _private.saveSelection(this, e.target);
         },

         _inputCompletedHandler: function(e) {
            this._notify('inputCompleted', [this._options.viewModel.getValue()]);
         },

         _focusinHandler: function(e) {
            this._inputActive = true;

            if (cDetection.isMobileIOS) {
               EventBus.globalChannel().notify('MobileInputFocus');
            }

            if (!this._options.readOnly && this._options.selectOnClick) {
               // In IE, the focus event happens earlier than the selection event, so we should use setTimeout
               if (cDetection.isIE) {
                  setTimeout(function() {
                     e.target.select();
                  });
               } else {
                  e.target.select();
               }
            }
         },

         _focusoutHandler: function(e) {
            this._inputActive = false;

            if (cDetection.isMobileIOS) {
               EventBus.globalChannel().notify('MobileInputFocusOut');
            }

            e.target.scrollLeft = 0;
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
               displayValue = this._options.viewModel.getDisplayValue(),
               processedData = this._options.viewModel.handleInput({
                  before: displayValue.slice(0, selectionStart),
                  insert: text,
                  after: displayValue.slice(selectionEnd, displayValue.length)
               }, 'insert');

            if (displayValue !== this._options.viewModel.getValue()) {
               this._notify('valueChanged', [this._options.viewModel.getValue()]);
            }

            this._selection = {
               selectionStart: selectionStart + text.length,
               selectionEnd: selectionStart + text.length
            };

            // Возвращаем позицию каретки. Она обрабатывается методом pasteHelper
            return processedData.position;
         }
      });

      InputRender.getDefaultOptions = function() {
         return {
            value: '',
            selectOnClick: false,
            style: 'default',
            inputType: 'Text',
            autocomplete: true,
            tooltip: ''
         };
      };

      InputRender.getOptionTypes = function() {
         return {
            value: types(String),
            selectOnClick: types(Boolean),
            tagStyle: types(String).oneOf([
               'secondary',
               'success',
               'primary',
               'danger',
               'info',
               'warning'
            ]),
            autocomplete: types(Boolean),
            tooltip: types(String)
         };
      };

      InputRender._private = _private;

      return InputRender;
   });
