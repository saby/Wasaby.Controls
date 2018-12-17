define('Controls/Input/Area',
   [
      'Core/constants',
      'Controls/Input/Text',
      'WS.Data/Type/descriptor',
      'wml!Controls/Input/Area/Field',
      'Core/helpers/Function/runDelayed',

      'css!theme?Controls/Input/Area/Area'
   ],
   function(constants, Text, descriptor, fieldTemplate, runDelayed) {
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

         calcPositionCursor: function(container, textBeforeCursor) {
            var measuredBlock = document.createElement('div');
            measuredBlock.innerHTML = '&#65279;' + textBeforeCursor + '&#65279;';
            container.appendChild(measuredBlock);
            var position = measuredBlock.clientHeight;
            container.removeChild(measuredBlock);

            return position;
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
         },

         /**
          * Change the location of the visible area of the field so that the cursor is visible.
          * If the cursor is visible, the location is not changed. Otherwise, the new location will be such that
          * the cursor is visible in the middle of the area.
          * @param {Controls/Input/Base} self Control instance.
          * @param {String} value
          * @param {Controls/Input/Base/Types/Selection.typedef} selection
          */
         recalculateLocationVisibleArea: function(self, value, selection) {
            var scroll = self._children.scroll;
            var textBeforeCursor = value.substring(0, selection.end);

            var positionCursor = _private.calcPositionCursor(self._children.fieldWrapper, textBeforeCursor);
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
                  scroll.scrollTo(positionCursor - sizeVisibleArea / 2);
               });
            }
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

         _recalculateLocationVisibleArea: function(field, displayValue, selection) {
            _private.recalculateLocationVisibleArea(this, displayValue, selection);
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
