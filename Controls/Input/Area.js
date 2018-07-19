define('Controls/Input/Area', [
   'Controls/Input/Text',
   'Core/constants',

   'WS.Data/Type/descriptor',
   'Core/detection',
   'tmpl!Controls/Input/Area/Area',
   'Controls/Input/resources/InputHelper',

   'css!Controls/Input/Area/Area'
], function(Text,
   constants,
   types,
   detection,
   template,
   inputHelper) {

   'use strict';

   /**
    * Multiline text input with autoheight.
    * <a href="https://wi.sbis.ru/materials/demo-ws4-input">Демо-пример</a>.
    *
    * @class Controls/Input/Area
    * @extends Controls/Input/Text
    * @control
    * @public
    * @category Input
    * @author Степин Павел Владимирович
    * @demo Controls-demo/Input/Area/Area
    */

   /**
    * @name Controls/Input/Area#minLines
    * @cfg {Number} Minimum number of lines (min height).
    */

   /**
    * @name Controls/Input/Area#maxLines
    * @cfg {Number} Maximum number of lines (max height).
    */

   /**
    * @name Controls/Input/Area#newLineKey
    * @cfg {String} New line key.
    * @variant enter When user presses Enter.
    * @variant ctrlEnter When user presses Ctrl + Enter.
    */

   var _private = {

      setFakeAreaValue: function(self, value) {
         self._children.fakeAreaValue.innerHTML = value;
      },

      /*
       * Обновляет наличие скролла, в зависимости от того, есть ли скролл на фейковой текст арии
       */
      updateHasScroll: function(self) {
         var fakeArea = self._children.fakeArea;
         var needScroll = fakeArea.scrollHeight - fakeArea.clientHeight > 1;

         //Для IE, текст мы показываем из fakeArea, поэтому сдвинем скролл.
         if (needScroll && detection.isIE) {
            fakeArea.scrollTop = self._children.realArea.scrollTop;
         }

         if (needScroll !== self._hasScroll) {
            self._hasScroll = needScroll;
         }
      },

      /*
       * Updates area multiline
       */
      updateMultiline: function(self, minLines) {
         var fakeArea = self._children.fakeArea;
         var fakeAreaWrapper = self._children.fakeAreaWrapper;

         //Will define the number of rows in Area by comparing fakeArea and her wrap heights
         //Смотрим ещё и на minLines, т.к. прикладники могут создавать Area внутри контейнера с display: none.
         self._multiline = fakeArea.clientHeight > fakeAreaWrapper.clientHeight || minLines > 1;
      }
   };

   var Area = Text.extend({

      _template: template,

      _hasScroll: false,

      _caretPosition: null,

      _multiline: undefined,

      constructor: function(options) {
         Area.superclass.constructor.call(this, options);

         //'_multiline' is responsible for adding multi-line field classes to InputRender
         //Should be set before the component is mounted into DOM to avoid content jumps
         this._multiline = options.minLines > 1;
      },

      _afterMount: function() {
         Area.superclass._afterMount.apply(this, arguments);

         //Should calculate area height after mount
         _private.updateHasScroll(this);
         _private.updateMultiline(this, this._options.minLines);
         this._forceUpdate();
      },

      _beforeUpdate: function(newOptions) {
         Area.superclass._beforeUpdate.apply(this, arguments);
         _private.setFakeAreaValue(this, newOptions.value);
         _private.updateHasScroll(this);
         _private.updateMultiline(this, newOptions.minLines);
      },

      _afterUpdate: function(oldOptions) {
         if ((oldOptions.value !== this._options.value) && this._caretPosition) {
            this._children['realArea'].setSelectionRange(this._caretPosition, this._caretPosition);
            this._caretPosition = null;
         }
      },

      _valueChangedHandler: function(e, value) {
         _private.setFakeAreaValue(this, value);
         _private.updateHasScroll(this);
         _private.updateMultiline(this, this._options.minLines);
         this._notify('valueChanged', [value]);
      },

      _keyDownHandler: function(e) {

         //В режиме newLineKey === 'ctrlEnter' будем эмулировать переход на новую строку в ручную
         if (e.nativeEvent.keyCode === constants.key.enter && this._options.newLineKey === 'ctrlEnter') {

            //Обычный enter прерываем
            if (!e.nativeEvent.shiftKey && !e.nativeEvent.ctrlKey) {
               e.preventDefault();
            }

            //Вроде не очень хорошо. Но если хотим перенести на новую строку сами, придется вмешиваться.
            if (e.nativeEvent.ctrlKey) {
               e.target.value += '\n';
               this._children.inputRender._inputHandler(e);
            }
         }

      },

      _scrollHandler: function() {
         _private.updateHasScroll(this);
      },

      paste: function(text) {
         this._caretPosition = inputHelper.pasteHelper(this._children['inputRender'], this._children['realArea'], text);
      }

   });

   Area.getDefaultOptions = function() {
      return {
         newLineKey: 'enter'
      };
   };

   Area.getOptionTypes = function() {
      return {
         minLines: types(Number),
         maxLines: types(Number),
         newLineKey: types(String).oneOf([
            'enter',
            'ctrlEnter'
         ])
      };
   };

   //For unit-tests
   Area._private = _private;

   return Area;

});
