define('Controls/Input/Area',
   [
      'Core/constants',
      'Controls/Input/Text',
      'WS.Data/Type/descriptor',
      'wml!Controls/Input/Area/Field',

      'css!theme?Controls/Input/Area/Area'
   ],
   function(constants, Text, descriptor, fieldTemplate) {
      'use strict';

      /**
       * A component for entering multi-line text.
       * You can adjust the {@link minLines minimum} and {@link maxLines maximum} number of lines.
       * If the inputed text does not fit on the {@link maxLines number of lines}, a scroll bar appears.
       * You can move the text to the next line using {@link newLineKey hotkeys}.
       * <a href="/materials/demo-ws4-input">Демо-пример</a>.
       *
       * @class Controls/Input/Area
       * @extends Controls/Input/Text
       * @control
       * @public
       * @category Input
       * @demo Controls-demo/Input/Area/Area
       *
       * @author Колесова П.С.
       */

      /**
       * @name Controls/Input/Area#minLines
       * @cfg {Number} Minimum number of lines.
       */

      /**
       * @name Controls/Input/Area#maxLines
       * @cfg {Number} Maximum number of lines.
       */

      /**
       * @name Controls/Input/Area#newLineKey
       * @cfg {String} The behavior of creating a new line.
       * @variant enter When user presses Enter.
       * @variant ctrlEnter When user presses Ctrl + Enter.
       * @default enter
       */
      var _private = {
         calcSizesByMeasuredBlock: function(areaSize) {
            var measuredBlock = document.createElement('div');
            measuredBlock.className = 'controls-Area__measuredBlock controls-Area__measuredBlock_size_' + areaSize;
            document.body.appendChild(measuredBlock);
            var sizes = {
               rowHeight: measuredBlock.clientHeight,
               indents: measuredBlock.offsetHeight - measuredBlock.clientHeight
            };
            document.body.removeChild(measuredBlock);

            return sizes;
         },

         calculateHeightLines: function(sizes, count, hasIndents) {
            var indents = hasIndents ? sizes.indents : 0;

            return sizes.rowHeight * count + indents;
         },

         isPressAdditionalKeys: function(event, ignore) {
            var additionalKeys = ['shiftKey', 'altKey', 'ctrlKey'];

            return additionalKeys.every(function(additionalKey) {
               if (additionalKey === ignore) {
                  return true;
               }

               return event[additionalKey];
            });
         },

         isPressEnter: function(event) {
            return event.keyCode === constants.key.enter;
         }
      };

      var Area = Text.extend({
         _multiline: true,

         _keyDownHandler: function(event) {
            var nativeEvent = event.nativeEvent;

            if (_private.isPressEnter(nativeEvent)) {
               if (this._options.newLineKey === 'enter' && !_private.isPressAdditionalKeys(nativeEvent)) {
                  return;
               }
               if (this._options.newLineKey === 'ctrlEnter' && !_private.isPressAdditionalKeys(nativeEvent, 'ctrlKey')) {
                  this.paste('\n');

                  return;
               }

               event.preventDefault();
            }
         },

         _initProperties: function(options) {
            Area.superclass._initProperties.apply(this, arguments);

            this._field.template = fieldTemplate;

            if (typeof window !== 'undefined') {
               var sizes = _private.calcSizesByMeasuredBlock(options.size);

               this._field.scope.calculateHeightLines = function(count, hasIndents) {
                  return _private.calculateHeightLines(sizes, count, hasIndents);
               };
            }
         }
      });

      Area.getDefaultOptions = function() {
         var defaultOptions = Text.getDefaultOptions();

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
         optionTypes.newLineKey = descriptor(String).oneOf([
            'enter',
            'ctrlEnter'
         ]);

         return optionTypes;
      };

      return Area;
   });
