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
         _keysWeHandle: [
            $ws._const.key.del,
            $ws._const.key.backspace,
            $ws._const.key.left,
            $ws._const.key.right,
            $ws._const.key.minus,
            $ws._const.key.space,
            $ws._const.key.m,
            $ws._const.key.o
         ],
         _options: {
            /**
             * @cfg {String} Устанавливает текст в поле ввода.
             * @remark
             * Используется, когда необходимо передать текст в поле ввода.
             * С опцией {@link SBIS3.CONTROLS.SuggestMixin#listFilter} используется в настройке параметров фильтрации
             * списка значений для автодополнения. Атрибут bind привязывает значение поля ввода к полю контекста.
             * Пример 1. Устанавливаем текст в поле ввода для поля связи:
             * <pre class="brush:xml">
             *    <option name="text">Филиппов Павел</option>
             * </pre>
             * Пример 2. Привязываем значения поля связи к полю myTextField в контексте для настройки фильтрации списка
             * значений автодополнения. В этом примере проиллюстрирована фильтрация списка по переданному тексту в
             * поле связи.
             * ![](/TextBoxBase01.png)
             * <pre class="brush:xml">
             *     <option name="text" bind="myTextField" value="Филиппов Павел"></option>
             *     <options name="listFilter">
             *         <option name="ФИО" bind="myTextField" oneWay="true" value=""></option>
             *     </options>
             * </pre>
             * Длина текста, передаваемого в поле ввода,
             * @see trim
             * @see maxLength
             * @see setText
             * @see getText
             * @see SBIS3.CONTROLS.SuggestMixin#listFilter
             * @translatable
             */
            text: '',
            /**
             * @cfg {Boolean} Устанавливает режим обрезки пробелов в начале и конце добавляемого текста.
             * @remark
             * Для исключения ситуаций, при которых в начале и конце текста образуются пробелы.
             * При включённом режиме пробелы в начале и конце введенного текста будут обрезаны.
             * Будет возвращена новая, усеченная строка. Это следует учитывать при определении {@link maxLength} -
             * максимального количества символов, которое может содержать текст при вводе.
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
             * @cfg {Number} Определяет максимальное количество символов, которое может содержать значение при вводе.
             * @remark
             * Применяется для ограничения длины вводимого текста. Значение равно допустимому для ввода количеству символов.
             * В случае превышения количества символов ввод не будет осуществлён.
             * Следует учитывать, что при включенной опции {@link trim} длина текста может измениться.
             * Установить или переопределить максимальное количество символов можно с помощью метода {@link setMaxLength}
             * @example
             * <pre class="brush:xml">
             *     <option name="maxLength">40</option>
             * </pre>
             * @see setMaxLength
             * @see trim
             * @see text
             */
            maxLength: null,
            /**
             * @cfg {Boolean} Устанавливает фокус по активации контрола в мобильных устройствах.
             * Обычное поведение для полей ввода на мобильных устройствах - не устанавливать фокус при вызове,
             * поскольку это вызовет появление клавиатуры, что неудобно. Клавиатура нужна тогда, когда пользователь
             * сам выбрал поле ввода, или в исключительных случаях - когда есть какой-то модальный диалог с полем ввода,
             * и пользователю ничего другого, как писать в это поле ввода, не остаётся.
             * @example
             * <pre class="brush:xml">
             *    <option name="focusOnActivatedOnMobiles">true</option>
             * </pre>
             */
            focusOnActivatedOnMobiles: false
         }
      },

      $constructor: function() {
         this._publish('onTextChange');
         this._container.removeClass('ws-area');
         this._options.text = (this._options.text) ? this._options.text.toString() : '';
         this.subscribe('onTextChange', function () {
            //снимаем выделение валидатора на время ввода
            this.clearMark();
         });
      },

      /**
       * Устанавливает текст внутри поля ввода.
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
      setText: function(text){
         //null, NaN, undefined оставляем как есть, но выводим их как пустую строку
         var newText = (text === null || text !== text || typeof text === "undefined") ? text : this._formatText(text.toString());
         if (newText !== this._options.text) {
            this._options.text = newText;
            this._drawText(newText);
            this._notify('onTextChange', newText);
            this._notifyOnPropertyChanged('text');
         }
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
       * @see setValue
       * @see getValue
       */
      getText:function(){
         return this._options.text;
      },

      /**
       * Устанавливает максимальное количество символов, которое можно ввести.
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
         return text || ''; // так как есть датабиндинг может прийти undefined
      },

      _drawText: function() {

      },

      _keyboardHover: function(event){
         event.stopPropagation();
         return true;
      },

      getValue : function() {
         $ws.single.ioc.resolve('ILogger').log('getValue()', 'getValue is deprecated. Use getText()');
         return this.getText();
      },

      setValue : function(txt) {
         $ws.single.ioc.resolve('ILogger').log('setValue()', 'setValue is deprecated. Use setText()');
         this.setText(txt);
      }
   });

   return TextBoxBase;

});