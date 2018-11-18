define('SBIS3.CONTROLS/TextBox', [
   'Core/EventBus',
   'Core/constants',
   'SBIS3.CONTROLS/TextBox/TextBoxBase',
   'tmpl!SBIS3.CONTROLS/TextBox/TextBox',
   'tmpl!SBIS3.CONTROLS/TextBox/resources/textFieldWrapper',
   'tmpl!SBIS3.CONTROLS/TextBox/resources/compatiblePlaceholder',
   'SBIS3.CONTROLS/Utils/TemplateUtil',
   'SBIS3.CONTROLS/TextBox/resources/TextBoxUtils',
   'SBIS3.CONTROLS/Utils/GetTextWidth',
   'Core/helpers/Function/forAliveOnly',
   'Core/i18n',
   'SBIS3.CONTROLS/ControlHierarchyManager',
   'Core/Sanitize',
   'Core/detection',
   'SBIS3.CONTROLS/Button/IconButton',
   'css!Controls/Input/resources/InputRender/InputRender',
   'css!SBIS3.CONTROLS/TextBox/TextBox'

], function(
   EventBus,
   constants,
   TextBoxBase,
   dotTplFn,
   textFieldWrapper,
   compatiblePlaceholderTemplate,
   TemplateUtil,
   TextBoxUtils,
   getTextWidth,
   forAliveOnly,
   i18n,
   ControlHierarchyManager,
   Sanitize,
   detection
) {
   'use strict';

   /**
    * Однострочное текстовое поле ввода.
    * Специальные поля:
    * <ul>
    *    <li>{@link SBIS3.CONTROLS/NumberTextBox NumberTextBox} - поле ввода числа;</li>
    *    <li>{@link SBIS3.CONTROLS/PasswordTextBox PasswordTextBox} - поле ввода пароля;</li>
    *    <li>{@link SBIS3.CONTROLS/TextArea TextArea} - многострочное поле ввода;</li>
    *    <li>{@link SBIS3.CONTROLS/FormattedTextBox FormattedTextBox} - поле ввода с маской.</li>
    * </ul>
    *
    * Для поля ввода можно задать:
    * <ol>
    *    <li>{@link maxLength} - ограничение количества вводимых символов;</li>
    *    <li>{@link inputRegExp} - фильтр вводимых символов;</li>
    *    <li>{@link trim} - обрезать ли пробелы при вставке текста;</li>
    *    <li>{@link selectOnClick} - выделять ли текст при получении контролом фокуса;</li>
    *    <li>{@link textTransform} - форматирование регистра текста.</li>
    * </ol>
    * @class SBIS3.CONTROLS/TextBox
    * @extends SBIS3.CONTROLS/TextBox/TextBoxBase
    * @author Журавлев М.С.
    * @demo Examples/TextBox/MyTextBox/MyTextBox
    *
    * @ignoreOptions independentContext contextRestriction className horizontalAlignment
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    *
    * @ignoreMethods applyEmptyState applyState findParent getAlignment getEventHandlers getEvents
    * @ignoreMethods getId getLinkedContext getMinHeight getMinSize getMinWidth getOwner getOwnerId getParentByClass
    * @ignoreMethods getParentByName getParentByWindow getStateKey getTopParent getUserData hasEvent hasEventHandlers
    * @ignoreMethods isDestroyed isSubControl makeOwnerName once sendCommand setOwner setStateKey setUserData setValue
    * @ignoreMethods subscribe unbind unsubscribe getClassName setClassName
    *
    * @ignoreEvents onDragIn onDragMove onDragOut onDragStart onDragStop onStateChanged onChange onReady
    *
    * @control
    * @public
    * @category Input
    */

   var _private = {
      prepareInformationIconColor: function(color) {
         var resColor = color;

         // поддержка старых цветов, чтоб не ломать старые контроы
         if (color === 'attention') {
            resColor = 'warning';
         }
         if (color === 'done') {
            resColor = 'success';
         }
         if (color === 'error') {
            resColor = 'danger';
         }
         if (color === 'primary') {
            resColor = 'secondary';
         }
         return resColor;
      }
   };
   var TextBox = TextBoxBase.extend(/** @lends SBIS3.CONTROLS/TextBox.prototype */ {
      _dotTplFn: dotTplFn,

      /**
       * @event onInformationIconMouseEnter Происходит когда курсор мыши входит в область информационной иконки.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @see informationIconColor
       */
      /**
       * @event onInformationIconActivated Происходит при клике по информационной иконке.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @see informationIconColor
       */
      $protected: {
      	_fromTouch: false,
         _pasteProcessing: 0,
         _inputField: null,
         _compatPlaceholder: null,

         // Сделаем значение по умолчанию undefined, т.к. это отсутствие значение, а null может прилететь из контекста.
         _tooltipText: undefined,
         _beforeFieldWrapper: null,
         _afterFieldWrapper: null,
         _textFieldWrapper: null,
         _informationIcon: null,
         _options: {
            _showNativePlaceholder: false,
            compatiblePlaceholderTemplate: compatiblePlaceholderTemplate,
            textFieldWrapper: textFieldWrapper,
            beforeFieldWrapper: null,
            afterFieldWrapper: null,

            /**
             * @cfg {String} Устанавливает форматирование регистра текстового значения в поле ввода.
             * @variant uppercase Все символы верхним регистром.
             * @variant lowercase Все символы нижним регистром.
             * @variant none Без изменений.
             * @remark
             * Опция используется в случаях, когда все символы текста в поле ввода нужно отобразить прописными
             * (верхний регистр) или строчными (нижний регистр).
             * Заменить или установить регистр текста можно при помощи метода {@link setTextTransform}.
             * @example
             * Пример отображения в поле связи всех символов текста прописными
             * для {@link placeholder текста подсказки внутри поля ввода}:
             * ![](/TextBox02.png)
             * фрагмент верстки:
             * <pre class="brush:xml">
             *    <option name="textTransform">uppercase</option>
             * </pre>
             * @see setTextTransform
             * @see placeholder
             *
             */
            textTransform: 'none',

            /**
             * @cfg {Boolean} Определяет режим выделения текста в поле ввода при получении фокуса.
             * * true Выделять текст.
             * * false Не выделять текст.
             * @remark
             * Используется в случаях, когда поле ввода нужно использовать в качестве источника текстовой информации:
             * пользователю требуется скопировать строку в поле для каких-либо дальнейших действий.
             * @example
             * Иллюстрация выделения текста, переданного в поле связи опцией {@link SBIS3.CONTROLS/TextBox/TextBoxBase#text}:
             * ![](/TextBox03.png)
             * фрагмент верстки:
             * <pre class="brush:xml">
             *     <option name="selectOnClick">true</option>
             * </pre>
             * @see SBIS3.CONTROLS/TextBox/TextBoxBase#text
             */
            selectOnClick: false,

            /**
             * @cfg {Content} Устанавливает текст подсказки внутри поля ввода.
             * @remark
             * Данный текст отображается внутри поля ввода до момента получения фокуса.
             * Заменить текст подсказки, заданный опцией, можно при помощи метода {@link setPlaceholder}.
             * @example
             * Пример 1. Текст подсказки в поле связи:
             * ![](/TextBox01.png)
             * фрагмент верстки:
             * <pre class="brush:xml">
             *     <option name="placeholder">ФИО исполнителя или название рабочей зоны</option>
             * </pre>
             * Пример 2. Текст подсказки с {@link textTransform форматированием регистра}:
             * ![](/TextBox02.png)
             * @see setPlaceholder
             * @see textTransform
             * @translatable
             * @content
             */
            placeholder: '',

            /**
             * @cfg {String} Устанавливает регулярное выражение, в соответствии с которым будет осуществляться валидация вводимых символов.
             * @remark
             * Служит для фильтрации вводимых символов в поле ввода по условию, установленному регулярным выражением.
             * Каждый вводимый символ будет проверяться на соответствие указанному в этой опции регулярному выражению;
             * несоответствующие символы ввести будет невозможно.
             */
            inputRegExp: '',

            /**
             * @cfg {Boolean} Включает отображение информационной иконки в поле ввода.
             * @remark
             * Для взаимодействия с информационной иконкой используются два события (@see onInformationIconMouseEnter) и (@see onInformationIconActivated)
             * по умолчанию опция выключена
             * @example
             * Пример показа всплывающей подсказки для поля ввода по наведению курсора на информационную иконку
             * <pre>
             *    myTextBox.subscribe('onInformationIconMouseEnter', function() {
             *       CInfobox.show({
             *         control: myTextBox.getContainer(),
             *         message: "<p><span style='color: red;'>Внимание:</span> Текст всплывающей подсказки</p>",
             *         width: 400,
             *         delay: 1000,
             *         hideDelay: 2000
             *       });
             *    });
             * </pre>
             * Цвета доступные для установки:
             * <ol>
             *    <li>done</li>
             *    <li>attention</li>
             *    <li>disabled</li>
             *    <li>error</li>
             *    <li>primary</li>
             * </ol>
             * @see setInformationIconColor
             * @see informationIconColor
             */
            informationIconColor: '',

            /**
             * @cfg {Boolean} Включает нативное автодополнение в поле.
             */
            autocomplete: false
         }
      },

      $constructor: function() {
         this._publish('onPaste', 'onInformationIconMouseEnter', 'onInformationIconActivated');
         var self = this;
         this._inputField = this._getInputField();

         // В Safari и на iOS если во flex-контейнере лежит пустая textarea или input, то базовая линия высчитывается неправильно,
         // но если задать пробел в качестве плейсхолдера, то она встаёт на место https://jsfiddle.net/5mk21u7L/
         // Так что в Safari тоже нельзя убирать плейсхолдер
         if (!constants.browser.chrome && !constants.browser.safari) {
            /*
             В IE есть баг что при установке фокуса в поле ввода, в котором есть плейсхолдер, стреляет событие input:
             https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/274987/
             Нативным плейсхолдером мы пользуемся, чтобы хром навешивал псевдокласс :placeholder-shown, так что
             лучше буду навешивать плейсхолдер только в хроме
             */
            // Плейсхолдер навешивается в шаблоне, иначе он будет моргать
            if (constants.browser.IEVersion < 12) {
               // Оказывается, в IE до 11 версии событие input стреляет даже при снятии аттрибута placeholder. Поэтому первое событие input там просто стопим
               this._inputField.one('input', function(e) {
                  e.preventDefault();
                  e.stopImmediatePropagation();
               });
            }
            this._inputField.removeAttr('placeholder');
         }
         // На старом вебките любое значение аттрибута required интерпретируется как значение true.
         // Для того, чтобы отключить поведение, задающееся аттрибутом required (показ нативных тултипов в ie), удаляем аттрибут с контейнера.
         if (constants.browser.retailOffline) {
            this._inputField.removeAttr('required');
         }
         this._inputField
            .on('paste', function(event) {
               var userPasteResult = self._notify('onPaste', TextBoxUtils.getTextFromPasteEvent(event));

               if (userPasteResult !== false) {
                  self._pasteProcessing++;
                  self._inputField.addClass('controls-InputRender__field_pasteProcessing');

                  /* зачем делаем setTimeout?
                     в момент события в поле ввода нет перенесенных данных,
                     поэтому вставка выполняется с задержкой, чтобы браузер самостоятельно обработал данные из буфера обмена(изображение, верстка)
                   */
                  window.setTimeout(function() {
                     self._pasteProcessing--;
                     if (!self._pasteProcessing) {
                        self._inputField.removeClass('controls-InputRender__field_pasteProcessing');
                        self._pasteHandler(event);
                     }
                  }, 100);
               } else {
                  event.preventDefault();
               }
            })
            .on('drop', function(event) {
               self._isDropped = true;

               window.setTimeout(function() {
                  self._pasteHandler(event);
               }, 100);
            })
            .on('change', function() {
               var newText = $(this).val(),
                  inputRegExp = self._options.inputRegExp;

               if (newText != self._options.text) {
                  if (inputRegExp) {
                     newText = self._checkRegExp(newText, inputRegExp);
                  }
                  self.setText(newText);
               }
            })
            .on('mousedown', this._inputMousedownHandler.bind(this))
            .on('click', this._inputClickHandler.bind(this))
            .on('focusin', this._inputFocusInHandler.bind(this));

         /* На Ipad'e при вставке текста из т9/autocorrect'a стреляет только событие input.
            Проверить, что это была вставка, можно по опции текст, т.к. в остальных случаях,
            мы обновляем опцию, раньше наступления события input. */
         if (constants.browser.isMobileSafari) {
            this._inputField.on('input', function(event) {
               if (self._getInputValue() !== self.getText()) {
                  /* У текста при вставке нельзя обрезать пробелы, иначе слово вставленное из autocorrecta,
                     вставится без пробела */
                  self._pasteHandler(event, true);
               }
            });
         }

         this._container
            .on('keypress keydown keyup', this._keyboardDispatcher.bind(this))
            .on('keyup mouseenter', function() {
               self._applyTooltip();
            })
            .on('touchstart', function() {
               self._fromTouch = true;
            });
      },

      _modifyOptions: function() {
         var cfg = TextBox.superclass._modifyOptions.apply(this, arguments);

         /* Надо подготовить шаблоны beforeFieldWrapper и afterFieldWrapper,
            чтобы у них был __vStorage, для возможности обращаться к опциям по ссылке (ref) */
         cfg.beforeFieldWrapper = TemplateUtil.prepareTemplate(cfg.beforeFieldWrapper);
         cfg.afterFieldWrapper = TemplateUtil.prepareTemplate(cfg.afterFieldWrapper);
         if (cfg.placeholder) {
            cfg._isSimplePlaceholder = cfg.placeholder instanceof i18n._rkString || (typeof cfg.placeholder === 'string' && cfg.placeholder.indexOf('data-component') === -1);
            if (cfg._isSimplePlaceholder) {
               cfg.placeholder = Sanitize(cfg.placeholder);
            }
         }
         cfg._informationIconColor = _private.prepareInformationIconColor(cfg.informationIconColor);
         return cfg;
      },


      _checkRegExp: function(text, regExp) {
         var newText = '',
            inputRegExp = new RegExp(regExp);
         for (var i = 0; i < text.length; i++) {
            if (inputRegExp.test(text[i])) {
               newText = newText + text[i];
            }
         }
         return newText;
      },

      init: function() {
         var self = this;
         TextBox.superclass.init.apply(this, arguments);

         if (this._options.informationIconColor) {
            this._informationIcon = $('.controls-TextBox__informationIcon', this.getContainer());
         }

         if (this._options.maxLength) {
            this.setMaxLength(this._options.maxLength);
         }

         this._container.on('mouseenter', '.controls-TextBox__informationIcon', function(e) {
            self._notify('onInformationIconMouseEnter');
         });
         this._container.on('click', function(e) {
            if ($(e.target).hasClass('controls-TextBox__informationIcon')) {
               self._notify('onInformationIconActivated');
            }
         });

         this._compatPlaceholder = this._getCompatiblePlaceholder();
         this._initPlaceholderEvents(this._compatPlaceholder);

         /* Надо проверить значение input'a, т.к. при дублировании вкладки там уже может быть что-то написано */
         this._checkInputVal(true);
      },

      /**
       * Устанавливает цвет информационной иконки.
       * Цвета доступные для установки:
       * <ol>
       *    <li>done</li>
       *    <li>attention</li>
       *    <li>disabled</li>
       *    <li>error</li>
       *    <li>primary</li>
       * </ol>
       * @see informationIcon
       * @see informationIconColor
       */
      setInformationIconColor: function(color) {
         if (!color) {
            this._options.informationIconColor = color;
            this._options._informationIconColor = _private.prepareInformationIconColor(this._options.informationIconColor);
            this._destroyInformationIcon();
            return;
         }

         if (!this._informationIcon) {
            this._createInformationIcon(this._options._informationIconColor);
         }

         this._informationIcon.removeClass('controls-TextBox__informationIcon-' + this._options._informationIconColor);
         this._informationIcon.removeClass('controls-InputRender__tagStyle-' + this._options._informationIconColor);
         this._options.informationIconColor = color;
         this._options._informationIconColor = _private.prepareInformationIconColor(this._options.informationIconColor);
         this._informationIcon.addClass('controls-TextBox__informationIcon-' + this._options._informationIconColor);
         this._informationIcon.addClass('controls-InputRender__tagStyle-' + this._options._informationIconColor);
      },

      _createInformationIcon: function(color) {
         this._informationIcon = $('<div class="controls-InputRender__tagStyle controls-TextBox__informationIcon controls-TextBox__informationIcon-' + color + ' controls-InputRender__tagStyle-' + color + '"></div>');
         this.getContainer().append(this._informationIcon);
      },

      _getCompatiblePlaceholder: function() {
         if (!this._compatPlaceholder) {
            this._compatPlaceholder = this._container.find('.controls-TextBox__placeholder');
         }
         return this._compatPlaceholder;
      },

      _destroyInformationIcon: function() {
         if (this._informationIcon) {
            this._informationIcon.remove();
            this._informationIcon = undefined;
         }
      },

      _keyboardDispatcher: function(event) {
         return forAliveOnly(function(event) {
            var result = true;
            switch (event.type) {
               case 'keydown':
                  result = this._keyDownBind.call(this, event);
                  break;
               case 'keyup':
                  result = this._keyUpBind.call(this, event);
                  break;
               case 'keypress':
                  result = this._keyPressBind.call(this, event);
                  break;
            }
            return result;
         }).call(this, event);
      },

      _checkInputVal: function(fromInit) {
         var text = this._getInputValue();

         // При ините не должен вызываться trim, поэтому будем проверять по этому флагу попали в checkInputVal из init или нет
         if (this._options.trim && !fromInit) {
            text = text.trim();
         }

         // Установим текст только если значения различны и оба не пустые
         if (text !== this._options.text && !(this._isEmptyValue(this._options.text) && !(text || '').length)) {
            this.setText(text);
         }
      },

      /**
       * Применить tooltip
       * Если текст не умещается в поле по ширине, то показываем подсказку с полным текстом
       * Если текст умещается, то показываем из опции tooltip
       */
      _applyTooltip: function() {
         var field = this._getFieldForTooltip();
         if (this._tooltipText !== this._options.text) {
            var scrollWidth;
            if (constants.browser.isIE) {
               scrollWidth = getTextWidth(this._options.text);
            } else {
               scrollWidth = field[0].scrollWidth;
            }

            // для случая, когда текст не умещается в поле ввода по ширине, показываем всплывающую подсказку с полным текстом
            if (scrollWidth > field[0].clientWidth) {
               this._container.attr('title', this._options.text);
               if (constants.browser.isIE) {
                  field.attr('title', this._options.text);
               }
            } else if (this._options.tooltip) {
               this.setTooltip(this._options.tooltip);
            } else {
               this._container.attr('title', '');

               // Для работы плейсхолдеров в IE на поля ввода навешивается аттрибут required.
               // При наведении курсора на такие поля, браузеры показывают всплывающую подсказку "Это обязательное поле."
               // Чтобы её скрыть в IE нужно в аттрибут title поставить пустую строку.
               if (constants.browser.isIE) {
                  field.attr('title', '');
               }
            }
            this._tooltipText = this._options.text;
         }
      },

      _getFieldForTooltip: function() {
         return this._inputField;
      },

      /**
       * Устанавливает режим выделения текста в поле ввода при получении фокуса.
       * @param {Boolean} flag
       */
      setSelectOnClick: function(flag) {
         this._options.selectOnClick = flag;
      },

      setTooltip: function(tooltip) {
         this._getFieldForTooltip().attr('title', tooltip);
         TextBox.superclass.setTooltip.apply(this, arguments);
      },

      _drawText: function(text) {
         if (this._getInputValue() != text) {
            this._setInputValue(text || '');
         }
      },

      setMaxLength: function(num) {
         TextBox.superclass.setMaxLength.call(this, num);

         // IE - единственный браузер, который навешивает :invalid, если через js поставить текст, превышаюший maxLength
         // Т.к. мы показываем плейсхолдер, если на поле ввода висит :invalid, то он не скрывается.
         // Поэтому для IE просто не будем навешивать аттрибут maxLength
         this._inputField.attr('maxlength', constants.browser.isIE && !constants.browser.isIE12 ? null : num);
      },

      /**
       * Устанавливает подсказку, отображаемую внутри поля ввода.
       * @param {String} text Текст подсказки.
       * @example
       * <pre>
       *     if (control.getText() == '') {
       *        control.setPlaceholder("Введите ФИО полностью");
       *     }
       * </pre>
       * @see placeholder
       */
      setPlaceholder: function(text) {
         this._options.placeholder = text;
         this._setPlaceholder(text);
      },

      _setPlaceholder: function() {
         this._destroyCompatPlaceholder();

         if (this.isEnabled()) {
            this._createCompatiblePlaceholder();
         }
      },

      /**
       * Устанавливает форматирование регистра текста в поле ввода.
       * @param {String} textTransform Необходимое форматирование регистра текста.
       * @variant uppercase Все символы текста становятся прописными (верхний регистр).
       * @variant lowercase Все символы текста становятся строчными (нижний регистр).
       * @variant none Текст не меняется.
       * @example
       * <pre>
       *    control.setTextTransform("lowercase");
       * </pre>
       * @see textTransform
       */
      setTextTransform: function(textTransform) {
         switch (textTransform) {
            case 'uppercase':
               this._inputField.removeClass('controls-TextBox__field-lowercase')
                  .addClass('controls-TextBox__field-uppercase');
               break;
            case 'lowercase':
               this._inputField.removeClass('controls-TextBox__field-uppercase')
                  .addClass('controls-TextBox__field-lowercase');
               break;
            default:
               this._inputField.removeClass('controls-TextBox__field-uppercase')
                  .removeClass('controls-TextBox__field-lowercase');
         }
      },

      _keyDownBind: function(event) {
         if (event.which == 13) {
            this._checkInputVal();
         }
      },

      _keyUpBind: function(event) {
         var newText = this._getInputValue(),
            textsEmpty = this._isEmptyValue(this._options.text) && this._isEmptyValue(newText);
         if (this._options.text !== newText && !textsEmpty) {
            if (this._options.inputRegExp) {
               newText = this._checkRegExp(newText, this._options.inputRegExp);
            }
            this._setTextByKeyboard(newText);
         }
         var key = event.which || event.keyCode;
         if ([constants.key.up, constants.key.down].indexOf(key) >= 0) {
            event.stopPropagation();
         }
      },

      _setTextByKeyboard: function(newText) {
         this.setText(newText);
      },

      _getInputValue: function() {
         return this._inputField && this._inputField.val();
      },
      _setInputValue: function(value) {
         this._inputField && this._inputField.val(value);
      },
      _getInputField: function() {
         return $('.js-controls-TextBox__field', this.getContainer().get(0));
      },

      _keyPressBind: function(event) {
         if (this._options.inputRegExp && !event.ctrlKey) {
            return this._inputRegExp(event, new RegExp(this._options.inputRegExp));
         }
      },

      _getElementToFocus: function() {
         return this._inputField;
      },

      _setEnabled: function(enabled) {
         TextBox.superclass._setEnabled.call(this, enabled);

         /* Когда дизейблят поле ввода, ставлю placeholder в виде пробела, в старом webkit'e есть баг,
            из-за коготорого, если во flex контейнере лежит input без placeholder'a ломается базовая линия.
            placeholder с пустой строкой и так будет не виден, т.ч. проблем быть не должно */
         if (enabled) {
            this._createCompatiblePlaceholder();
         } else {
            this._destroyCompatPlaceholder();
         }

         // FIXME Шаблонизатор сейчас не позволяет навешивать одиночные атрибуты, у Зуева Димы в планах на сентябрь
         // сделать возможность вешать через префикс attr-
         this._inputField.prop('readonly', !enabled);
      },
      _inputRegExp: function(e, regexp) {
         var keyCode = e.which || e.keyCode;

         // Клавиши стрелок, delete, backspace и тд
         if (!e.charCode) {
            return true;
         }
         if (keyCode < 32 || e.ctrlKey || e.altKey) {
            return false;
         }
         if (!regexp.test(String.fromCharCode(keyCode))) {
            return false;
         }
         return true;
      },

      _pasteHandler: function(event, noTrimText) {
         var text = this._getInputValue(),
            inputRegExp = this._options.inputRegExp;
         if (inputRegExp) {
            text = this._checkRegExp(text, inputRegExp);
         }
         if (this._options.trim && noTrimText !== true) {
            text = text.trim();
         }
         text = this._formatText(text);
         this._drawText(text);

         /* Событие paste может срабатывать:
           1) При нажатии горячих клавиш
           2) При вставке из котекстного меню.

           Если текст вставлют через контекстное меню, то нет никакой возможности отловить это,
           но событие paste гарантированно срабатывает после действий пользователя. Поэтому мы
           можем предполагать, что это ввод с клавиатуры, чтобы правильно работали методы,
           которые на это рассчитывают.
           */
         this._setTextByKeyboard(text);
      },

      _focusOutHandler: function(event, isDestroyed, focusedControl) {
         if (!isDestroyed && (!focusedControl || !ControlHierarchyManager.checkInclusion(this, focusedControl.getContainer()[0]))) {
            this._checkInputVal();
         }

         if (this._fromTouch) {
            EventBus.globalChannel().notify('MobileInputFocusOut');
            this._fromTouch = false;
         }
         this._clicked = false;

         TextBox.superclass._focusOutHandler.apply(this, arguments);
      },

      _inputMousedownHandler: function() {
         this._clicked = true;
      },

      _moveCursorAfterActivation: function() {
         this._inputField[0].setSelectionRange(this._inputField.val().length, this._inputField.val().length);
         this._inputField[0].scrollTop = 99999;
         this._inputField[0].scrollLeft = 99999;
      },

      _inputClickHandler: function(e) {

      },

      _inputFocusInHandler: function(e) {
         var self = this;
         if (this._fromTouch) {
            EventBus.globalChannel().notify('MobileInputFocus');
         }
         if (this._options.selectOnClick) {
            // IE теряет выделение, если select вызывается из обработчика focusin, так что обернём в setTimeout.
            // https://codepen.io/anon/pen/LBYLpJ
            if (detection.isIE) {
               setTimeout(function() {
                  if (self.isActive()) {
                     self._selectText();
                  }
               }, 0);
            } else {
               self._selectText();
            }
         } else if (this.isEnabled() && !this._clicked) {
            /**
                * Нельзя перемещать курсор, если фокус перешел по средствам перетаскивания значения в поле.
                */
            if (this._isDropped) {
               this._isDropped = false;
            } else {
               this._moveCursorAfterActivation();
            }
         }

         /* При получении фокуса полем ввода, сделаем контрол активным.
          *  Делать контрол надо активным по фокусу, т.к. при клике и уведении мыши,
          *  кусор поставится в поле ввода, но соыбтие click не произойдёт и контрол актвным не станет, а должен бы. */
         if (!this.isActive()) {
            this.setActive(true, false, true);
            e.stopPropagation();
         }

         // убираем курсор на ipad'e при нажатии на readonly поле ввода
         if (!this.isEnabled() && constants.browser.isMobilePlatform) {
            this._inputField.blur();
         }
      },

      _destroyCompatPlaceholder: function() {
         if (this._compatPlaceholder) {
            this._compatPlaceholder.off('*');
            this._compatPlaceholder.remove();
            this._compatPlaceholder = undefined;
         }
      },

      _initPlaceholderEvents: function(placeholder) {
         var self = this;
         placeholder.on('click', function() {
            self._getInputField().focus();
            self._inputClickHandler();
         });
      },

      _createCompatiblePlaceholder: function() {
         if (!this._compatPlaceholder) {
            this._options._isSimplePlaceholder = typeof this._options.placeholder === 'string' && this._options.placeholder.indexOf('data-component') === -1;
            if (this._options._isSimplePlaceholder) {
               this._options.placeholder = Sanitize(this._options.placeholder);
            }
            this._compatPlaceholder = $(this._options.compatiblePlaceholderTemplate(this._options));
            this._inputField.after(this._compatPlaceholder);
            this.reviveComponents();
            this._initPlaceholderEvents(this._compatPlaceholder);
         }
      },

      _getAfterFieldWrapper: function() {

      },

      _getBeforeFieldWrapper: function() {

      },

      destroy: function() {
         this._afterFieldWrapper = undefined;
         this._beforeFieldWrapper = undefined;
         this._inputField.off('*');
         this._inputField = undefined;
         this._destroyCompatPlaceholder();
         this._destroyInformationIcon();
         TextBox.superclass.destroy.apply(this, arguments);
      },

      _selectText: function() {
         var
            selection,
            range;

         if (this._inputField[0].select) {
            this._inputField[0].select();
         } else {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(this._inputField[0]);
            selection.removeAllRanges();
            selection.addRange(range);
         }
      }
   });

   return TextBox;
});
