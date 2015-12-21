define('js!SBIS3.CONTROLS.TextBoxBase',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.FormWidgetMixin',
      'js!SBIS3.CONTROLS.DataBindMixin',
      'js!SBIS3.CORE.CompoundActiveFixMixin'
   ], function(CompoundControl, FormWidgetMixin, DataBindMixin, CompoundActiveFixMixin) {

   'use strict';

   /**
    * Базовый класс для текстового поля
    * @class SBIS3.CONTROLS.TextBoxBase
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @public
    * @author Крайнов Дмитрий Олегович
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

   var TextBoxBase = CompoundControl.extend([FormWidgetMixin, DataBindMixin, CompoundActiveFixMixin], /** @lends SBIS3.CONTROLS.TextBoxBase.prototype*/ {

       /**
        * @event onTextChange Срабатывает при изменении текста в поле ввода.
        * @param {$ws.proto.EventObject} eventObject Дескриптор события.
        * @param {String} text Текст в поле ввода.
        * @example
        * <pre>
        *     textBox.subscribe('onTextChange', function(event, text){
        *        if (text == 'Воскресение') {
        *           alert('Такого не может быть')
        *        }
        *     };
        * </pre>
        * @see setText
        * @see setValue
        */

      $protected: {
         _options: {
            /**
             * @cfg {String} Текст в поле ввода
             * @example
             * <pre class="brush:xml">
             *     <option name="text">Какой-то текст, с которым построится поле ввода</option>
             * </pre>
             * @see trim
             * @see maxLength
             * @see setText
             * @see getText
             * @see setValue
             * @see getValue
             */
            text: '',
            /**
             * @cfg {Boolean} Обрезать ли пробелы при вставке
             * @remark
             * При включённой опции обрезаются пробелы в начале и в конце текста.
             * Возможные значения:
             * <ul>
             *    <li>true - обрезать пробелы;</li>
             *    <li>false - не обрезать.</li>
             * </ul>
             * @example
             * <pre class="brush:xml">
             *     <option name="trim">true</option>
             * </pre>
             * @see text
             * @see maxLength
             */
            trim: false,
            /**
             * @cfg {Number} Максимальное количество символов, которое может содержать значение
             * @example
             * <pre class="brush:xml">
             *     <option name="maxLength">40</option>
             * </pre>
             * @remark
             * В случае превышения количества символов ввод не будет осуществлён.
             * @see setMaxLength
             * @see trim
             * @see text
             */
            maxLength: null,
            /**
             * @cfg {Boolean} Устанавливать фокус по активации контрола в мобильных устройствах.
             * Обычное поведение для полей ввода на мобильных устройствах - не устанавливать фокус при вызове
             * setActive(true), поскольку это вызовет появление клавиатуры, что неудобно - она нужна тогда, когда пользователь
             * сам тыкнул в поле ввода, или в исключительных случаях - когда есть какой-то модальный диалог с полем ввода, и
             * ему точно ничего другого, как писать в это поле ввода, не остаётся.
             * <wiTag group="Управление">
             */
            focusOnActivatedOnMobiles: false
         }
      },

      $constructor: function() {
         this._publish('onTextChange');
         this._container.removeClass('ws-area');
         this._options.text = (this._options.text) ? this._options.text.toString() : '';
         /* Выставляем опцию, при включении которой,
            контрол активируется при получении фокуса (нативного браузерного).
            В CompoundControl'e, контрол активируется при клике на него, а в случае с текстбоксом,
            пользователь может ткнуть в поле ввода и увести мышку, тогда контрол не активируется,
            т.к. события click на контроле не произошло. Надо отслеживать событие focusin.*/
         this._options.handleFocusCatch = true;
         this.subscribe('onTextChange', function () {
            //снимаем выделение валидатора на время ввода
            this.clearMark();
         });
      },

      /**
       * Установить текст внутри поля.
       * @param {String} text Текст для установки в поле ввода.
       * @example
       * <pre>
       *     if (control.getText() == "Введите ФИО") {
       *        control.setText("");
       *     }
       * </pre>
       * @see text
       * @see getText
       * @see setValue
       * @see getValue
       */
      setText:function(text){
         text = (text !== null && text !== undefined && text == text) ? text.toString() : '';
         var newText = this._formatText(text);
         if (newText !== this._options.text) {
            this._options.text = newText;
            this._drawText(newText);
            this._notify('onTextChange', newText);
            this._notifyOnPropertyChanged('text');
         }
      },

      /**
       * Получить текст внутри поля.
       * @returns {String} Текст - значение поля ввода.
       * @example
       * <pre>
       *     if (control.getText() == "Введите ФИО") {
       *        control.setText("");
       *     }
       * </pre>
       * @see text
       * @see setText
       * @see setValue
       * @see getValue
       */
      getText:function(){
         return this._options.text;
      },

      /**
       * Установить максимальное количество символов, которое можно ввести.
       * @param {Number} num Количество символов.
       * @example
       * <pre>
       *    if (control.getName() == "Заголовок") {
       *       control.setMaxLength(50);
       *    }
       * </pre>
       * @see maxLength
       */
      setMaxLength: function(num) {
         this._options.maxLength = num;
      },

      _formatText : function(text) {
         text = text || ''; // так как есть датабиндинг может прийти undefined
         if (this._options.trim) {
            text = String.trim(text);
         }
         return text;
      },

      _drawText: function() {

      },

      getValue : function() {
         $ws.single.ioc.resolve('ILogger').log('getValue()', 'getValue is deprecated. Use getText()');
         return this.getText();
      },

      setValue : function(txt) {
         $ws.single.ioc.resolve('ILogger').log('setValue()', 'setValue is deprecated. Use setText()');
         this.setText(txt)
      }
   });

   return TextBoxBase;

});