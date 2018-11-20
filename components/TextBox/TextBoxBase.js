define('SBIS3.CONTROLS/TextBox/TextBoxBase',
   [
   "Core/constants",
   "Core/IoC",
   "Lib/Control/CompoundControl/CompoundControl",
   "SBIS3.CONTROLS/Mixins/FormWidgetMixin",
   "SBIS3.CONTROLS/Mixins/DataBindMixin",
   "Lib/Mixins/CompoundActiveFixMixin",
   "SBIS3.CONTROLS/ControlHierarchyManager"
], function( constants, IoC, CompoundControl, FormWidgetMixin, DataBindMixin, CompoundActiveFixMixin, ControlHierarchyManager) {

   'use strict';

   /**
    * Базовый класс для текстового поля
    * @class SBIS3.CONTROLS/TextBox/TextBoxBase
    * @extends Lib/Control/CompoundControl/CompoundControl
    * @mixes SBIS3.CONTROLS/Mixins/FormWidgetMixin
    * @mixes Controls/Input/resources/InputRender/InputRenderDocs
    * @public
    * @author Крайнов Д.О.
    *
    * @ignoreOptions independentContext contextRestriction isContainerInsideParent owner stateKey subcontrol className
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment verticalAlignment
    * @ignoreOptions extendedTooltip
    *
    * @ignoreMethods applyEmptyState applyState getClassName getEventHandlers getEvents getExtendedTooltip getOwnerId
    * @ignoreMethods getLinkedContext getOwner getStateKey getUserData hasEvent hasEventHandlers makeOwnerName once
    * @ignoreMethods sendCommand setClassName setExtendedTooltip setOpener setStateKey setUserData subscribe unsubscribe
    * @ignoreMethods subscribeOnceTo unbind
    *
    * @ignoreEvents onChange onClick onDragIn onDragMove onDragOut onDragStart onDragStop onKeyPressed onStateChange
    * @ignoreEvents onTooltipContentRequest
    */

   var TextBoxBase = CompoundControl.extend([FormWidgetMixin, DataBindMixin, CompoundActiveFixMixin], /** @lends SBIS3.CONTROLS/TextBox/TextBoxBase.prototype*/ {

       /**
        * @event onTextChange Происходит при изменении текста в поле ввода.
        * @param {Core/EventObject} eventObject Дескриптор события.
        * @param {String} text Текст в поле ввода.
        * @example
        * <pre>
        *     textBox.subscribe('onTextChange', function(event, text){
        *        if (text == 'Воскресение') {
        *           alert('Такого не может быть')
        *        }
        *     });
        * </pre>
        * @see setText
        */

      $protected: {
         _keysWeHandle: [
            constants.key.del,
            constants.key.backspace,
            constants.key.left,
            constants.key.right,
            constants.key.minus,
            constants.key.space,
            constants.key.m,
            constants.key.o
         ],
         /* Флаг, по которому смотрим, надо ли запускать валидацию по уходу фокуса,
            выставляется он методе setText. Если опция забиндена на контекст, то компонент должен создаваться уже проставленой опцией,
            поэтому в методе setText опция должна меняться. */
         _textChanged: false,
          _options: {
             _isMultiline: false,
             _prepareClassesByConfig: function(cfg) {
               var
                  fieldClasses = [],
                  fieldWrapperClasses = [],
                  wrapperClasses = [],
                  containerClasses = [],
                  createNewCssClasses = function (item) {
                     //Метод дублирует классы содержащие в себе 'controls-TextBox_' аналогичными с 'controls-InputRender_'
                     //Необходимо для обратной совместимости
                     if (~item.indexOf('controls-TextBox_')) {
                        item += ' ' + item.replace(/controls-TextBox_/g, 'controls-InputRender_');
                     }

                     return item;
                  };

               containerClasses.push('controls-' + cfg.inputType + '-InputRender');
               containerClasses.push('controls-' + cfg.inputType + '-InputRender_state_' + (cfg.enabled ? 'default' : 'disabled'));
               !cfg.enabled && containerClasses.push('controls-' + cfg.inputType + '-InputRender_state_disabled_' + (cfg._isMultiline ? 'multiLine' : 'singleLine'));
               containerClasses.push('controls-TextBox_size_' + (cfg.size ? cfg.size : 'default') + (cfg._isMultiline ? '_multiLine' : '_singleLine'));
               containerClasses.push('controls-TextBox_text-align_' + cfg.textAlign);
               containerClasses.push(cfg._paddingClass);
               cfg.style && containerClasses.push('controls-' + cfg.inputType + '-InputRender_style_' + cfg.style);
               if (cfg.textTransform) {
                  fieldClasses.push('controls-TextBox__field-' + cfg.textTransform);
               }
               wrapperClasses.push('controls-TextBox__wrapper_' + (cfg._isMultiline ? 'multiLine' : 'singleLine'));
               fieldWrapperClasses.push('controls-InputRender__fieldWrapper_' + (cfg._isMultiline ? 'multiLine' : 'singleLine'));

               return {
                  container: containerClasses.map(createNewCssClasses).join(' '),
                  field: fieldClasses.map(createNewCssClasses).join(' '),
                  wrapper: wrapperClasses.map(createNewCssClasses).join(' '),
                  fieldWrapper: fieldWrapperClasses.join(' ')
               }
            },
            _paddingClass: ' controls-Text-InputRender_paddingBoth controls-TextBox_paddingBoth',
            /**
             * @cfg {String} Устанавливает текстовое значение в поле ввода.
             * @remark
             * Используется, когда необходимо передать в поле ввода определенное текстовое значение.
             * С опцией {@link SBIS3.CONTROLS/Mixins/SuggestMixin#listFilter} используется в настройке параметров фильтрации
             * списка значений для автодополнения. Атрибут bind привязывает значение поля ввода к полю контекста.
             * Длина текста, передаваемого в поле ввода, не зависит от настройки опции {@link maxLength}.
             * Установить или изменить текстовое значение в поле ввода можно с помощью метода {@link setText}.
             * Получить текстовое значение поля ввода можно с помощью метода {@link getText}.
             * @see trim
             * @see maxLength
             * @see setText
             * @see getText
             * @see SBIS3.CONTROLS/Mixins/SuggestMixin#listFilter
             * @translatable
             */
            text: '',
            /**
             * @cfg {Boolean} Устанавливает режим обрезки пробелов в начале и конце добавляемого текста.
             * * true Обрезать пробелы.
             * * false Не обрезать пробелы.
             * @remark
             * Опцию применяют для исключения ситуаций, при которых в начале и конце текста образуются пробелы.
             * При включённом режиме пробелы в начале и конце введенного текста будут обрезаны.
             * Будет возвращена новая, усеченная строка. Это следует учитывать при определении {@link maxLength} -
             * максимального количества символов, которое может содержать текст при вводе.
             * @see text
             * @see maxLength
             * @see setMaxLength
             */
            trim: false,
            /**
             * @cfg {Number} Устанавливает максимальное количество символов, которое может содержать поле ввода.
             * @remark
             * Применяется для ограничения длины вводимого текста. Значение равно допустимому для ввода количеству символов.
             * В случае превышения количества символов ввод не будет осуществлён.
             * Следует учитывать, что при включенной опции {@link trim} длина текста может измениться.
             * Опция не влияет на длину текста, переданного в поле ввода опцией {@link text}.
             * Установить или переопределить максимальное количество символов можно с помощью метода {@link setMaxLength}.
             * @example
             * <pre class="brush:xml">
             *     <option name="maxLength">12</option><!-- Устанавливаем длину для ввода ИНН физического лица -->
             * </pre>
             * @see setMaxLength
             * @see trim
             * @see text
             */
            maxLength: null,
            /**
             * @cfg {Boolean} Определяет поведение приложения на мобильных устройствах, когда фокус по умолчанию при открытии страницы/диалога установлен на поле ввода.
             * * true Установить фокус.
             * * false Не устанавливать фокус.
             * @remark
             * Установленный в поле ввода фокус (курсор) на мобильных устройствах инициирует появление диалога с клавиатурой
             * для ввода значения. Опция позволяет изменить это поведение при открытии новых страниц или диалогов, когда
             * в них фокус установлен на одном из полей ввода.
             * Если полей несколько, то, как правило, появление клавиатуры неуместно. Ожидается, что пользователь сам
             * выберет поле для ввода значения.
             * В других случаях, когда на странице или диалоге всего одно поле ввода, появления клавиатуры считается уместным.
             * Установить или изменить фокус для поля ввода можно с помощью метода {@link Lib/Control/Control#setActive}.
             * @example
             * <pre class="brush:xml">
             *    <option name="focusOnActivatedOnMobiles">true</option>
             * </pre>
             * @see Lib/Control/Control#setActive
             */
            focusOnActivatedOnMobiles: false,
            textAlign: 'left',
             /**
              * @cfg {String} Устанавливает стилевое оформление поля ввода.
              * @variant default по умолчанию
              * @variant header заголовок
              * @variant accentHeader акцентный заголовок
              */
            style: 'default',
            inputType: 'Text',
             /**
              * @cfg {String} Устанавливает размер поля ввода.
              * @remark
              * По умолчанию значение опции "default" и зависит от темы.
              * Значение "m" установит средний размер поля ввода.
              * Значение "l" устaновит большой размер поля ввода.
              * @example
              * Пример 1. Большое поле ввода:
              * фрагмент верстки:
              * <pre class="brush:xml">
              *     <option name="size">l</option>
              * </pre>
              */
            size: 'default',
            autocomplete: true
         }
      },

      $constructor: function() {
         this._publish('onTextChange');

         this._options.text = (this._options.text) ? this._options.text.toString() : '';

         this.subscribe('onFocusOut', this._focusOutHandler.bind(this));
      },

      /**
       * Устанавливает текстовое значение внутри поля ввода.
       * @param {String} text Текстовое значение, которое будет установлено в поле ввода.
       * @example
       * <pre>
       *     if (control.getText() == "Введите ФИО") {
       *        control.setText("");
       *     }
       * </pre>
       * @see text
       * @see getText
       */
      setText: function(text){
         var newTextIsEmpty = this._isEmptyValue(text),
             newText = newTextIsEmpty ? text : this._formatText(text.toString());

         //На андроиде не стреляет событие keyPress, а в нем делался preventDefault для значений, которые не подходят под inputRegExp
         //Чтобы убирать эти значения из поля ввода нужно всегда перерисовывать текст
         if (newText !== this._options.text || constants.browser.isMobileAndroid) {
            if(!this._textChanged && !(newTextIsEmpty && this._isEmptyValue(this._options.text))) {
               this._textChanged = true;
            }
            this._options.text = newText;
            this._drawText(newText);
            //снимаем выделение валидатора на время ввода
            this.clearMark();
            this._notify('onTextChange', newText);
            this._notifyOnPropertyChanged('text');
         }
      },

      //Проверка на пустое значение, их нужно хранить в неизменном виде, но отображать как пустую строку
      _isEmptyValue: function(text){
         return text === null || text === "" || typeof text === "undefined";
      },

      /**
       * Получает текстовое значение поля ввода.
       * @returns {String} Текст - значение поля ввода.
       * @example
       * <pre>
       *     if (control.getText() == "Введите ФИО") {
       *        control.setText("");
       *     }
       * </pre>
       * @see text
       * @see setText
       */
      getText:function(){
         return this._options.text;
      },

      /**
       * Устанавливает максимальное количество символов, которое можно ввести в поле ввода.
       * @param {Number} num Количество символов.
       * @example
       * <pre>
       *    if (control.getName() == "Заголовок") {
       *       control.setMaxLength(50);
       *    }
       * </pre>
       * @see maxLength
       * @see text
       */
      setMaxLength: function(num) {
         this._options.maxLength = num;
      },

      isChanged: function() {
         return this._textChanged
      },

      _formatText : function(text) {
         return text || ''; // так как есть датабиндинг может прийти undefined
      },

      _onClickHandler: function(event){
         var elementToFocus = this._getElementToFocus();
         // т.к. поле ввода находится внутри контейнера, то клик по внешнему контейнеру не ставит курсор в поле
         // поэтому принудительно проставляем фокус в активное поле
         // если фокус уже на поле ввода, то повторно проставлять не нужно
         if (this.isEnabled() && elementToFocus[0] !== document.activeElement && this._shouldFocus(event.target)) {
            elementToFocus.focus();
         }
         TextBoxBase.superclass._onClickHandler.call(this, event);
      },

      _shouldFocus: function(target) {
         var container = this.getContainer()[0];
         return target === container || target === $('.controls-InputRender__wrapper', container)[0] || target === $('.controls-InputRender__fieldWrapper', container)[0];
      },

      _getElementToFocus: function() {
         return this._inputField || TextBoxBase.superclass._getElementToFocus.apply(this, arguments);
      },

      _drawText: function() {

      },

      _focusOutHandler: function(event, isDestroyed, focusedControl) {
         if(this._textChanged && !ControlHierarchyManager.checkInclusion(this, focusedControl && focusedControl.getContainer())) {
            this.validate();
         }
      },

      _keyboardHover: function(event){
         event.stopPropagation();
         return true;
      },

      getValue : function() {
         IoC.resolve('ILogger').log('getValue()', 'getValue is deprecated. Use getText()');
         return this.getText();
      },

      setValue : function(txt) {
         IoC.resolve('ILogger').log('setValue()', 'setValue is deprecated. Use setText()');
         this.setText(txt);
      },
      _setEnabled: function(enabled) {
         TextBoxBase.superclass._setEnabled.apply(this, arguments);
         this._toggleState();
      },
      clearMark: function() {
         TextBoxBase.superclass.clearMark.apply(this, arguments);
         this._toggleState();
      },
      markControl: function() {
         TextBoxBase.superclass.markControl.apply(this, arguments);
         this._toggleState();
      },
      _updateActiveStyles: function() {
         TextBoxBase.superclass._updateActiveStyles.apply(this, arguments);
         this._toggleState();
      },
      _getStateToggleContainer: function(){
         return this._container;
      },
      _toggleState: function() {
         var container = this._getStateToggleContainer()[0];
         container.className = container.className.replace(/(^|\s)controls-TextBox_state_\S+/gi, '');
         container.className = container.className.replace(new RegExp('(^|\\\s)controls-' + this._options.inputType + '-InputRender_state_\\\S+', 'gi'), '');
         this._getStateToggleContainer().addClass(this._getToggleState());
      },
      _getToggleState: function() {
         var
            active = this.isActive(),
            enabled = this.isEnabled(),
            marked = this.isMarked();
         return 'controls-TextBox_state_' +
            (marked ? 'error' : !enabled ? 'disabled' +
            (this._options._isMultiline ? ' controls-TextBox_state_disabled_multiLine' : ' controls-TextBox_state_disabled_singleLine') : active ? 'active' : 'default') +
            ' controls-' + this._options.inputType + '-InputRender_state_' +
            (marked ? 'error' : !enabled ? 'disabled' +
               (this._options._isMultiline ? ' controls-' + this._options.inputType + '-InputRender_state_disabled_multiLine' : ' controls-' + this._options.inputType + '-InputRender_state_disabled_singleLine') : active ? 'active' : 'default');
      }
   });


   TextBoxBase.runDefaultAction = function(event, e) {
      var
         control = event.getTarget(),
         res, parent;
         if (e.which === constants.key.enter) {
            if (!(e.altKey || e.shiftKey || e.ctrlKey || e.metaKey)) {
               parent = control;

               while(parent) {

                  while (parent && !parent._defaultAction) {
                     parent = parent.getParent();
                  }
                  if (!parent) {
                     break;
                  }

                  if (parent._defaultAction) {
                     res = parent._defaultAction(e);
                  }
                  if (res) {
                     parent = parent.getParent();
                  } else {
                     break;
                  }
               }
         }
      }
   };

   return TextBoxBase;

});
