define('Controls/Input/Area',
   [
      'Env/Env',
      'Types/entity',
      'Controls/Input/Text',
      'Core/Themes/ThemesControllerNew',
      'Core/helpers/Function/runDelayed',

      'wml!Controls/Input/Area/Area',
      'wml!Controls/Input/Area/Field',
      'wml!Controls/Input/Area/ReadOnly',

      'Controls/Decorator/WrapURLs'
   ],
   function(
      Env, entity, Text, ThemesControllerNew, runDelayed,
      template, fieldTemplate, readOnlyFieldTemplate
   ) {
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
       * @demo Controls-demo/Input/Area/AreaPG
       *
       * @author Колесова П.С.
       */

      /**
       * @name Controls/Input/Area#minLines
       * @cfg {Number} Minimum number of lines.
       * @default 1
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
         PATH_TO_THEME_VARIABLES: 'Controls/Input/Area/MeasuredVariables',

         /**
          * @param {String} css
          * @param {Controls/Input/Area#size} size
          * @return {Controls/Input/Area/Types/FieldSizes.typedef}
          */
         calcSizesByCss: function(css, size) {
            var sizes = {
               rowHeight: null,
               indents: null
            };

            /**
             * Get the margin value of css.
             */
            var marginRegExp = /margin: ?((\d+px ?)+)/;
            var margin = marginRegExp.exec(css)[1].split(' ').map(parseFloat);

            /**
             * The indentation is made up of margin-top and margin-bottom.
             * The margin properties has different ways of declaring them.
             * https://developer.mozilla.org/ru/docs/Web/CSS/margin#%D0%A1%D0%B8%D0%BD%D1%82%D0%B0%D0%BA%D1%81%D0%B8%D1%81
             * ALL - when one value is specified, it applies the same margin to all four sides.
             * VERTICAL_HORIZONTAL - when two values are specified, the first margin applies to the top
             * and bottom, the second to the left and right.
             * TOP_HORIZONTAL_BOTTOM - when three values are specified, the first margin applies to the top,
             * the second to the left and right, the third to the bottom
             * TOP_RIGHT_BOTTOM_LEFT - When four values are specified, the margins apply to the top, right,
             * bottom, and left in that order
             */
            var ALL = 1;
            var VERTICAL_HORIZONTAL = 2;
            var TOP_HORIZONTAL_BOTTOM = 3;
            var TOP_RIGHT_BOTTOM_LEFT = 4;

            switch (margin.length) {
               case ALL:
               case VERTICAL_HORIZONTAL:
                  sizes.indents = margin[0] * 2;
                  break;
               case TOP_HORIZONTAL_BOTTOM:
               case TOP_RIGHT_BOTTOM_LEFT:
                  sizes.indents = margin[0] + margin[2];
                  break;
               default:
                  sizes.indents = 0;
                  break;
            }

            /**
             * Get the height value of css for the current field size.
             */
            var heightRegExp = new RegExp('_size_' + size + ' ?{[\\s\\S]*?height: ?(\\d+)');
            sizes.rowHeight = parseFloat(heightRegExp.exec(css)[1]);

            return sizes;
         },

         /**
          * @param {Controls/Input/Area} self
          * @param {Controls/Input/Area#theme} theme
          * @param {Controls/Input/Area#size} areaSize
          * @return {Promise}
          */
         calcSizesByMeasuredBlock: function(self, theme, areaSize) {
            /**
             * Get a controller to make it read the css file.
             */
            var themesController = ThemesControllerNew.getInstance();

            /**
             * TODO: Method customLoadCssAsync falls on the server. Because of this control is not built.
             * Remove after execution: https://online.sbis.ru/opendoc.html?guid=46581472-e279-4786-8e18-7757cc9ba1bb
             */
            if (typeof window === 'undefined') {
               self._sizes = {
                  rowHeight: 0,
                  indents: 0
               };
               return new Promise(function(resolve) {
                  resolve();
               });
            }

            /**
             * Load the css file to read the variable size of the field.
             */
            var loadCss = themesController.customLoadCssAsync(_private.PATH_TO_THEME_VARIABLES, theme);

            /**
             * Process the resulting css file.
             * Get the size of the field on the string content of the css file.
             */
            loadCss.then(function(css) {
               self._sizes = _private.calcSizesByCss(css, areaSize);
            });

            return loadCss;
         },

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
          * @param {Controls/Input/Area/Types/FieldSizes.typedef} sizes
          * @param {Number} count Number of rows in the container.
          * @param {Boolean} [hasIndents] Determine whether to ignore the indents.
          * @return {Number}
          */
         calculateHeightContainer: function(sizes, count, hasIndents) {
            var indents = hasIndents ? sizes.indents : 0;

            return sizes.rowHeight * count + indents;
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
          * @param {Controls/Input/Base} self Control instance.
          * @param {String} value
          * @param {Controls/Input/Base/Types/Selection.typedef} selection
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
                  scroll.scrollTo(positionCursor - sizeVisibleArea / 2);
               });
            }
         },

         validateLines: function(min, max) {
            var validated = true;

            if (min > max) {
               validated = false;
               Env.IoC.resolve('ILogger').error('Controls/Input/Area', 'The minLines and maxLines options are not set correctly. The minLines more than the maxLines.');
            }

            if (min < 1) {
               validated = false;
               Env.IoC.resolve('ILogger').error('Controls/Input/Area', 'The minLines options are not set correctly. The minLines less than one.');
            }

            if (max < 1) {
               validated = false;
               Env.IoC.resolve('ILogger').error('Controls/Input/Area', 'The maxLines options are not set correctly. The maxLines less than one.');
            }

            return validated;
         }
      };

      var Area = Text.extend({
         _template: template,

         _multiline: true,

         constructor: function(cfg) {
            Area.superclass.constructor.call(this, cfg);

            this._calculateHeightContainer = this._calculateHeightContainer.bind(this);
         },

         _beforeMount: function(options) {
            Area.superclass._beforeMount.apply(this, arguments);

            _private.validateLines(options.minLines, options.maxLines);

            return _private.calcSizesByMeasuredBlock(this, options.theme, options.size);
         },

         _beforeUpdate: function(newOptions) {
            Area.superclass._beforeUpdate.apply(this, arguments);

            if (this._options.minLines !== newOptions.minLines || this._options.maxLines !== newOptions.maxLines) {
               _private.validateLines(newOptions.minLines, newOptions.maxLines);
            }
            if (this._options.theme !== newOptions.theme || this._options.size !== newOptions.size) {
               return _private.calcSizesByMeasuredBlock(this, newOptions.theme, newOptions.size);
            }
         },

         _beforeUnmount: function() {
            this._calculateHeightContainer = undefined;
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

         _calculateHeightContainer: function(count, hasIndents) {
            return _private.calculateHeightContainer(this._sizes, count, hasIndents);
         },

         _isTriggeredChangeEventByEnterKey: function() {
            return false;
         }
      });

      Area._theme.push('Controls/Input/Area/Area');

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

      return Area;
   });
