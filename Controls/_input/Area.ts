import Env = require('Env/Env');
import entity = require('Types/entity');
import Text = require('Controls/_input/Text');
import runDelayed = require('Core/helpers/Function/runDelayed');
import template = require('wml!Controls/_input/Area/Area');
import fieldTemplate = require('wml!Controls/_input/Area/Field');
import readOnlyFieldTemplate = require('wml!Controls/_input/Area/ReadOnly');
import 'Controls/decorator';
      

      /**
       * A component for entering multi-line text.
       * You can adjust the {@link minLines minimum} and {@link maxLines maximum} number of lines.
       * If the inputed text does not fit on the {@link maxLines number of lines}, a scroll bar appears.
       * You can move the text to the next line using {@link newLineKey hotkeys}.
       * <a href="/materials/demo-ws4-input">Демо-пример</a>.
       *
       * @class Controls/_input/Area
       * @extends Controls/_input/Text
       * @mixes Controls/_input/interface/INewLineKey
       *
       * @public
       * @demo Controls-demo/Input/Area/AreaPG
       *
       * @author Журавлев М.С.
       */

      /**
       * @name Controls/_input/Area#minLines
       * @cfg {Number} Minimum number of lines.
       * @remark
       * A value between 1 and 10 is supported.
       * @default 1
       */

      /**
       * @name Controls/_input/Area#maxLines
       * @cfg {Number} Maximum number of lines.
       * @remark
       * A value between 1 and 10 is supported.
       */

      var _private = {
         calcPositionCursor: function(container, textBeforeCursor) {
            var measuredBlock = document.createElement('div');

            /**
             * In order for the block to have the correct height, you need to add an empty character to the end.
             * Without it, the height, in the case of an empty value, will be zero.
             * In the case when at the end of the transition to a new line height will be one line less.
             */
            measuredBlock.innerHTML = textBeforeCursor + '&#65279;';
            container.appendChild(measuredBlock);
            var position = measuredBlock.clientHeight;
            container.removeChild(measuredBlock);

            return position;
         },

         /**
          * @param event
          * @param {String} [key]
          * @variant altKey
          * @variant ctrlKey
          * @variant shiftKey
          * @return {Boolean}
          */
         isPressAdditionalKey: function(event, key) {
            var additionalKeys = ['shiftKey', 'altKey', 'ctrlKey'];

            return additionalKeys.every(function(additionalKey) {
               if (additionalKey === key) {
                  return event[additionalKey];
               }

               return !event[additionalKey];
            });
         },

         isPressEnter: function(event) {
            return event.keyCode === Env.constants.key.enter;
         },

         isPressCtrl: function(event) {
            return _private.isPressAdditionalKey(event, 'ctrlKey');
         },

         isPressAdditionalKeys: function(event) {
            return !_private.isPressAdditionalKey(event);
         },

         /**
          * Change the location of the visible area of the field so that the cursor is visible.
          * If the cursor is visible, the location is not changed. Otherwise, the new location will be such that
          * the cursor is visible in the middle of the area.
          * @param {Controls/_input/Base} self Control instance.
          * @param {String} value
          * @param {Controls/_input/Base/Types/Selection.typedef} selection
          */
         recalculateLocationVisibleArea: function(self, value, selection) {
            var scroll = self._children.scroll;
            var textBeforeCursor = value.substring(0, selection.end);

            var positionCursor = _private.calcPositionCursor(self._children.fieldWrapper, textBeforeCursor);

            /**
             * По другому до clientHeight не достучаться.
             * https://online.sbis.ru/opendoc.html?guid=1d24c04f-73d0-4e0f-9b61-4d0bc9c23e2f
             */
            var sizeVisibleArea = scroll._container.clientHeight;

            // По другому до scrollTop не достучаться.
            // https://online.sbis.ru/opendoc.html?guid=e1770341-9126-4480-8798-45b5c339a294
            var beginningVisibleArea = scroll._children.content.scrollTop;

            var endingVisibleArea = beginningVisibleArea + sizeVisibleArea;

            /**
             * The cursor is visible if its position is between the beginning and the end of the visible area.
             */
            var hasVisibilityCursor = beginningVisibleArea < positionCursor && positionCursor < endingVisibleArea;

            if (!hasVisibilityCursor) {
               /**
                * At the time of the scroll position change, the DOM must be updated.
                * So wait until the control redraws.
                */
               runDelayed(function() {
                  self._getField().scrollTop = 0;
                  scroll.scrollTo(positionCursor - sizeVisibleArea / 2);
               });
            }
         },

         validateLines: function(min, max) {
            var validated = true;

            if (min > max) {
               validated = false;
               Env.IoC.resolve('ILogger').error('Controls/_input/Area', 'The minLines and maxLines options are not set correctly. The minLines more than the maxLines.');
            }

            if (min < 1) {
               validated = false;
               Env.IoC.resolve('ILogger').error('Controls/_input/Area', 'The minLines options are not set correctly. The minLines less than one.');
            }

            if (max < 1) {
               validated = false;
               Env.IoC.resolve('ILogger').error('Controls/_input/Area', 'The maxLines options are not set correctly. The maxLines less than one.');
            }

            if (min > 10 || max > 10) {
               validated = false;
               Env.IoC.resolve('ILogger').error('Controls/_input/Area', 'The minLines and maxLines options are not set correctly. Values greater than 10 are not supported.');
            }

            return validated;
         }
      };

      var Area = Text.extend({
         _template: template,

         _multiline: true,

         _beforeMount: function(options) {
            Area.superclass._beforeMount.apply(this, arguments);

            _private.validateLines(options.minLines, options.maxLines);
         },

         _beforeUpdate: function(newOptions) {
            Area.superclass._beforeUpdate.apply(this, arguments);

            if (this._options.minLines !== newOptions.minLines || this._options.maxLines !== newOptions.maxLines) {
               _private.validateLines(newOptions.minLines, newOptions.maxLines);
            }
         },

         _inputHandler: function() {
            Area.superclass._inputHandler.apply(this, arguments);

            this._recalculateLocationVisibleArea(this._getField(), this._viewModel.displayValue, this._viewModel.selection);
         },

         _keyDownHandler: function(event) {
            var nativeEvent = event.nativeEvent;

            if (_private.isPressEnter(nativeEvent)) {
               if (this._options.newLineKey === 'ctrlEnter' && _private.isPressCtrl(nativeEvent)) {
                  this.paste('\n');
               } else if (this._options.newLineKey !== 'enter' || _private.isPressAdditionalKeys(nativeEvent)) {
                  event.preventDefault();
               }
            }
         },

         _recalculateLocationVisibleArea: function(field, displayValue, selection) {
            _private.recalculateLocationVisibleArea(this, displayValue, selection);
         },

         _initProperties: function(options) {
            Area.superclass._initProperties.apply(this, arguments);

            this._field.template = fieldTemplate;
            this._readOnlyField.template = readOnlyFieldTemplate;
         },

         _isTriggeredChangeEventByEnterKey: function() {
            return false;
         }
      });

      Area._theme.push('Controls/input');

      Area.getDefaultOptions = function() {
         var defaultOptions = Text.getDefaultOptions();

         defaultOptions.minLines = 1;
         defaultOptions.newLineKey = 'enter';

         return defaultOptions;
      };

      Area.getOptionTypes = function() {
         var optionTypes = Text.getOptionTypes();

         /**
          * https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421
          * optionTypes.minLines = descriptor(Number);
          * optionTypes.maxLines = descriptor(Number);
          */
         optionTypes.newLineKey = entity.descriptor(String).oneOf([
            'enter',
            'ctrlEnter'
         ]);

         return optionTypes;
      };

      export = Area;
   
