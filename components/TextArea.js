define('SBIS3.CONTROLS/TextArea', [
   "Core/constants",
   "SBIS3.CONTROLS/TextBox",
   'tmpl!SBIS3.CONTROLS/TextArea/resources/inputField',
   'tmpl!SBIS3.CONTROLS/TextArea/resources/compatiblePlaceholder',
   'Core/helpers/String/escapeHtml',
   'SBIS3.CONTROLS/Utils/LinkWrapUtils',
   "Core/IoC",
   "browser!Lib/Control/Autosize-plugin",
   'css!SBIS3.CONTROLS/TextArea/TextArea'
], function( constants,TextBox, inputField, compatiblePlaceholderTemplate, escapeHtml, LinkWrap, IoC) {

   'use strict';

   function generateClassesName(min, max, size) {
      if (!max || max < min) {
         max = min;
      }
      return 'controls-TextArea__field_size_' + size + '_minheight-' + min + ' controls-TextArea__field_size_' + size + '_maxheight-' + max;
   }

   function modifyHeightClasses(container, addClasses, size) {
      var
         curClasses = container.className,
         maxHeightReg = new RegExp('controls-TextArea__field_size_' + size + '_maxheight-[0-9]*', 'g'),
         minHeightReg = new RegExp('controls-TextArea__field_size_' + size + '_minheight-[0-9]*', 'g'),
         newClasses;
      newClasses = curClasses.replace(maxHeightReg, '');
      newClasses = newClasses.replace(minHeightReg, '');
      newClasses = newClasses + ' ' + addClasses;
      container.className = newClasses;
   }

   var _private = {
      updateHeight: function(self, hClasses) {
         modifyHeightClasses(self._inputField.get(0), hClasses, self._options.size);
         modifyHeightClasses(self._disabledWrapper.get(0), hClasses, self._options.size);
         if (self._options.maxLinesCount !== self._options.minLinesCount) {
            self._autosizeTextArea();
         }
      }
   };

   /**
    * Класс контрола "Многострочное поле ввода". Контрол может автоматически менять высоту в зависимости от количества введённой информации.
    * @class SBIS3.CONTROLS/TextArea
    * @extends SBIS3.CONTROLS/TextBox
    * @author Журавлев М.С.
    * @css controls-TextArea Класс для изменения отображения текста в многострочном поле ввода.
    *
    * @ignoreOptions independentContext contextRestriction className
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents getExtendedTooltip
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe getClassName setClassName
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onTooltipContentRequest onChange
    * @ignoreEvents onReady
    *
    * @demo Examples/TextArea/MyTextArea/MyTextArea
    *
    * @control
    * @public
    * @category Input
    */

   var TextArea = TextBox.extend( /** @lends SBIS3.CONTROLS/TextArea.prototype */ {
      $protected: {
         _inputField: null,
         _cachedW: null,
         _cachedH: null,
         _pasteCommand: 'insertText',
         _autoSizeInitialized: false,
         //TODO надо подумать как работать с автосайзом эрии без плагина, т.к. в VDOM все равно не получится, как вариант contentEditable
         _myResize: false, //флаг нужен для того, чтобы мы могли отличить ресайз, если он был инициирован самим полем, то надо известить родителя, если пришел извне, то не надо
         //флаг что была инициализирован плагин автовысоты. Меняется отображение и поведение текстареи
         _autoHeightInitialized: false,
         _options: {
            _isMultiline: true,
            _paddingClass: ' controls-TextArea_padding',
            compatiblePlaceholderTemplate: compatiblePlaceholderTemplate,
            textFieldWrapper: inputField,
            wrapUrls: LinkWrap.wrapURLs,
            escapeHtml: escapeHtml,
             /**
              * @cfg {String} Текст подсказки внутри поля ввода
              * @remark
              * Заданный в этой опции текст отображается внутри многострочного поля ввода до начала ввода.
              * @example
              * <pre>
              *     <option name="placeholder">Введите ФИО полностью</option>
              * </pre>
              * @see setPlaceholder
              * @translatable
              */
             placeholder: '',
            /**
             * @cfg {Number} Минимальное количество строк
             * @example
             * <pre>
             *     <option name="minLinesCount">2</option>
             * </pre>
             * @remark
             * Многострочное поле ввода построится с указанным в данной опции количеством строк.
             * @see autoResize
             */
            minLinesCount: 0,
            /**
             * @cfg {Number} Максимальное количество строк
             * @example
             * <pre>
             *     <option name="maxLinesCount">4</option>
             * </pre>
             * @remark
             * При несовпадении максимального и минимального количества строк у поля ввода включится автовысота
             * @see minLinesCount
             */
            maxLinesCount: 0,
            /**
             * @cfg {String} Режим перехода на новую строку
             * @variant enter По нажатию клавиши <enter>
             * @variant shiftEnter По сочетанию клавиш <shift> + <enter>
             * <pre>
             *     <opt name="newLineMode">enter</opt>
             * </pre>
             */
            newLineMode: 'enter',
            breakClickBySelect: false,
            //МЕГАкостыль, т.к. один человек, очень быстро нажимает ctr + Enter и отпускаение Enter происходит уже без нажатия ctr
            //Получаем что TextArea думает, что просто отпустили Enter и не пропускает событие. Ошибка обусловлена тем что
            //исторически сложилось так, редактирование по месту обрабатывает нажатия на keyup и от этого нужно уходить.
            //Выписал задачу https://online.sbis.ru/opendoc.html?guid=41cf6afb-ddd1-46b6-9ebf-09dd62e798b5 и надеюсь что
            //в VDOM это заработет само и ни какие костыли с keyup больше не понадобятся.
            _ctrlKeyUpTimestamp: undefined
         }
      },

      _modifyOptions: function(cfg) {
         var newCfg = TextArea.superclass._modifyOptions.apply(this, arguments);
         if (cfg.autoResize && cfg.autoResize.maxLinesCount) {
            cfg.maxLinesCount = cfg.autoResize.maxLinesCount;
            IoC.resolve('ILogger').log('TextArea', 'Опция cfg.autoResize устарела - используйте maxLinesCount');
         }
         if (cfg.autoResize && cfg.autoResize.state && !cfg.maxLinesCount) {
            cfg.maxLinesCount = 10;
         }

         if (cfg.minLinesCount > cfg.maxLinesCount) {
            cfg.maxLinesCount = cfg.minLinesCount;
         }
         newCfg.heightclassName = generateClassesName(cfg.minLinesCount, cfg.maxLinesCount, cfg.size);
         newCfg.cssClassName += ' controls-TextArea';
         return newCfg;
      },

      $constructor: function() {
         var self = this;
         this._inputField = $('.controls-TextArea__field', this._container);
         this._disabledWrapper = $('.controls-TextArea__view', this._container);

         /* В textArea есть баг при вставке в дом, иногда могут теряться переносы строк.
            В этом случае надо обновить текст и отрисовать его заного.
            Перевставка текста произойдёт только если text отличается от значения в textArea .*/
         this._drawText(this.getText());

         // При потере фокуса делаем trim, если нужно
         // TODO Переделать на платформенное событие потери фокуса
         this._inputField.bind('focusout', function () {
            var text = self._inputField.val();
            if (self._options.trim) {
               text = text.trim();
            }
            //Установим текст только если значения различны и оба не пустые
            if (self._isTextChanged(text, self._options.text)){
               self.setText(text);
            }
         });

         this._container.bind('keyup',function(e){
            self._keyUpBind(e);
         });

         this._inputField.bind('keydown', function(event){
            // Если тебя посетило желание добавить ниже в исключения кнопку "shift" - то напиши зачем тебе это и будь готов к тому, что
            // благодаря keyboardHover-у где то перестанут нажиматься клавиши!
            if (!self._processNewLine(event) && !event.altKey && !event.ctrlKey && event.which !== constants.key.esc && event.which !== constants.key.tab) {
               event.stopPropagation();
            }
            self._myResize = true;
         });

         this._inputField.bind('paste', function(){
            self._pasteProcessing++;
            if (!self._myResize) self._myResize = true;
            window.setTimeout(function(){
               self._pasteProcessing--;
               if (!self._pasteProcessing) {

                  self.setText.call(self, self._formatText(self._inputField.val()));
                  self._inputField.val(self._options.text);
               }
            }, 100)
         });
      },

      _isTextChanged: function(oldText, newText) {
         var carriageRegExp = /\r/g;

         /**
          * Если текст в котором есть \r передать в textarea, то textarea вырежет \r.
          * Из-за такого поведения текст переданный в textarea и текст в textarea будут разными, но визуально совпадать. https://jsfiddle.net/o0qpteaj/
          * Поэтому перед сравнением вырезаем \r из обоих текстов, и только потом сравниваем их.
          */
         oldText = oldText.replace(carriageRegExp, '');
         newText = newText.replace(carriageRegExp, '');

         return TextArea.superclass._isTextChanged.call(this, oldText, newText);
      },

      init :function(){
         TextArea.superclass.init.call(this);

         if (this._options.maxLinesCount != this._options.minLinesCount) {

            this._inputField.data('minLinesCount', this._options.minLinesCount);
            this._inputField.data('maxLinesCount', this._options.maxLinesCount);

            if(this.isVisible()){
               /**
                * Кешим размеры только видимого поля. Кеш обновляется при смене видимости.
                */
               this._cachedW = this._inputField.width();
               this._cachedH = this._inputField.height();

               this._autosizeTextArea();
            }

            this.subscribeTo(this, 'onAfterVisibilityChange', function(e, visible){
               if (visible) {
                  this._autosizeOnShow()
               }
            });

         } else {
            if (this._options.minLinesCount) {
               this._inputField.attr('rows', parseInt(this._options.minLinesCount, 10));
            }
            this._removeAutoSizeDognail();
         }
      },

      show: function(){
         TextArea.superclass.show.apply(this, arguments);
         this._autosizeOnShow();
      },

      //Если текстэрея была скрыта, то плагин автосайза не применялся к ней, потому что отработал бы неправильно.
      //так что вызываем его после показа текстэрии
      _autosizeOnShow: function() {
         var w = this._inputField.width();
         var h = this._inputField.height();
         if (w != this._cachedW || h != this._cachedH) {
            this._cachedW = w;
            this._cachedH = h;
            this._autosizeTextArea(true);
         }
      },

      _getCompatiblePlaceholder: function() {
         if (!this._compatPlaceholder) {
            this._compatPlaceholder = this._container.find('.controls-TextArea__placeholder');
         }
         return this._compatPlaceholder;
      },

      _removeAutoSizeDognail: function() {
         //Изначально рассчитываем высоту по view, а на textarea висит position: absolute.
         if (this.isEnabled()) {
            this._disabledWrapper.removeClass('ws-invisible').addClass('ws-hidden');
            this._inputField.removeClass('ws-invisible').removeClass('ws-hidden');
         } else {
            this._inputField.removeClass('ws-hidden').addClass('ws-invisible');
         }
         if (!this._options.text) { //Во view мог находиться плейсхолдер, но после инициализации он нам уже не нужен
            this._disabledWrapper.empty();
            this._disabledWrapper.removeClass('controls-TextArea__view_empty');
         }
         //нельзя классы, ограничивающие высоту ставить сразу в шаблоне, потому что из-за них некорректно считается высота, т.к. оин сразу добавляют скролл, а считать высоту надо без скролла
         var hClasses = generateClassesName(this._options.minLinesCount, this._options.maxLinesCount, this._options.size);
         modifyHeightClasses(this._inputField.get(0), hClasses, this._options.size);
         this._disabledWrapper.addClass('controls-TextArea__view_init');
         this._inputField.addClass('controls-TextArea__field_init');
         this._autoHeightInitialized = true;
      },

      _autosizeTextArea: function(hard){
         var self = this;
         this._inputField.autosize({
            callback: function() {
               if (self._myResize) {
                  self._notifyOnSizeChanged(self, self);
                  self._myResize = false;
               }
            },
            hard : hard
         });


         this._removeAutoSizeDognail();
      },

      _autoSizeRecalc: function() {
         this._inputField.trigger('autosize.resize');
      },

      _setEnabled: function(state){
         TextArea.superclass._setEnabled.call(this, state);
         this._inputField.toggleClass('ws-invisible', !state);
         if (this._autoHeightInitialized) {
            this._disabledWrapper.toggleClass('ws-hidden', state);
         }
         else {
            this._disabledWrapper.toggleClass('ws-invisible', state);
         }
         this._updateDisabledWrapper();
      },

      setText: function(text){
         TextArea.superclass.setText.call(this, text);
         this._updateDisabledWrapper();
      },

      _updateDisabledWrapper: function() {
         if (this._disabledWrapper && !this.isEnabled()) {
            var
               newText = escapeHtml(this.getText());
            //при установке контента через .html() убирается код каретки, поэтому высота в диве отличается от высоты в текстареи
            if (newText) {
               newText = newText.replace(/\n/g, '<br>');
            }
            this._disabledWrapper.html(LinkWrap.wrapURLs(newText));
         }
      },

      _processNewLine: function(event) {
         if (this._options.newLineMode === 'shiftEnter' && event.which === constants.key.enter) {
            if (event.shiftKey) {
               event.stopPropagation();
            } else {
               event.preventDefault();
            }
            return true;
         }
      },

      _keyUpBind: function(event) {
         var
            ctrlKey = event.ctrlKey,
            newText = this._inputField.val(),
            key = event.which || event.keyCode,
            textsEmpty = this._isEmptyValue(this._options.text) && this._isEmptyValue(newText);
         if (newText != this._options.text && !textsEmpty) {
            this.setText.call(this, newText);
         }

         if (event.which === constants.key.enter && !ctrlKey && this._ctrlKeyUpTimestamp) {
            ctrlKey = (new Date() - this._ctrlKeyUpTimestamp) < 100;
         }
         if (event.which === constants.key.ctrl) {
            this._ctrlKeyUpTimestamp = new Date();
         }

         if (!this._processNewLine(event) && ((key === constants.key.enter && !ctrlKey) ||
            Array.indexOf([constants.key.up, constants.key.down], key) >= 0)) {
            event.stopPropagation();
         }
      },
      /**
       * Метод установки минимального количества строк.
       * @param count Количество строк, меньше которого высота не уменьшается.
       * @example
       * <pre>
       *     if (textArea.getText().length > 300) {
        *        textArea.setMinLinesCount(7);
        *     }
       * </pre>
       * @see minLinesCount
       */
      setMinLinesCount: function(count) {
         var cnt = parseInt(count, 10);
         this._options.minLinesCount = cnt;
         this._inputField.attr('rows', cnt);
         this._inputField.data('minLinesCount', count);
         this._inputField.trigger('autosize.resize');
         var hClasses = generateClassesName(cnt, this._options.maxLinesCount, this._options.size);
         _private.updateHeight(this, hClasses);
      },

      /**
       * Метод установки максимального количества строк.
       * @param count Количество строк, больше которого высота не увеличивается.
       * @example
       * <pre>
       *     if (textArea.getText().length > 300) {
        *        textArea.setMaxLinesCount(7);
        *     }
       * </pre>
       * @see maxLinesCount
       */
      setMaxLinesCount: function(count) {
         var cnt = parseInt(count, 10);
         this._options.maxLinesCount = cnt;
         this._inputField.trigger('autosize.resize');
         var hClasses = generateClassesName(this._options.minLinesCount, cnt, this._options.size);
         _private.updateHeight(this, hClasses);
      },

      _drawText: function(text) {
         if (this._inputField.val() != text) {
            this._inputField.val(text || '');
            this._autoSizeRecalc();
         }
      },

      _onResizeHandler : function(){
         this._autoSizeRecalc();
         TextArea.superclass._onResizeHandler.apply(this, arguments);
      },

      destroy: function() {
         this._inputField instanceof $ && this._inputField.trigger('autosize.destroy');
         TextArea.superclass.destroy.apply(this, arguments);
      }
   });

   return TextArea;

});
