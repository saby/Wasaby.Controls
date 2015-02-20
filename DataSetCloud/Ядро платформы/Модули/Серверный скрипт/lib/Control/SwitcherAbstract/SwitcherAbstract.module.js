define("js!SBIS3.CORE.SwitcherAbstract", ["js!SBIS3.CORE.Control", "css!SBIS3.CORE.SwitcherAbstract"], function( Control ) {

   "use strict";

   /**
    * Базовый класс для переключателя
    *
    * @class $ws.proto.SwitcherAbstract
    * @extends $ws.proto.DataBoundControl
    *
    * @cfgOld {Boolean|Function} value    Начальное значение. Если передать функцию, то будет использовать возвращаемое из функции значение как начальное.
    * @cfgOld {String} textOff            Текст в "выключенном" состоянии.
    * @cfgOld {String} textOn             Текст в "включённом" состоянии.
    */
   $ws.proto.SwitcherAbstract = Control.DataBoundControl.extend(/** @lends $ws.proto.SwitcherAbstract.prototype */{
      /**
       * @event onChange Событие при переключении контрола
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Boolean} value Новое значение
       */
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Значение переключателя
             */
            value: false,
            /**
             * @translatable
             */
            textOff: '',
            /**
             * @translatable
             */
            textOn: '',
            cssClass: "ws-switcher ws-no-select"
         },
         _toggler: undefined,
         _togglerLeft: undefined,
         _togglerRight: undefined,
         _textContainer: undefined,
         _textOffContainer: undefined,
         _textOnContainer: undefined,
         _textOff: undefined,
         _textOn: undefined,
         _value: false,
         _keysCallbackMap: {},
         _keysWeHandle: [
            $ws._const.key.space,
            $ws._const.key.left,
            $ws._const.key.right
         ]
      },
      $constructor: function(){
         this._initValues();
         this._createContainer();
         this._initKeys();
         this._initSaveState();
      },
      /**
       * Инициализирует работу с saveState
       * @private
       */
      _initSaveState: function(){
         if( this._options.saveState ){
            this.once('onInit', function(){
               //обеспечиваем поднятие события строго после подписки на него NavigationController'ом
               this._notify('onStateChanged');
            }.bind(this));
         }
      },
      /**
       * Применяет сохранённое состояние
       * @param {String} state Состояние
       */
      applyState: function(state){
         this.setValue(state === 'true');
      },
      /**
       * Инициализирует начальные значения
       * @private
       */
      _initValues: function(){
         this._textOff = this._options.textOff;
         this._textOn = this._options.textOn;
      },
      /**
       * Инициализирует контейнер
       * @private
       */
      _createContainer: function(){
         this._container
            .attr('unselectable', 'on')
            .bind('selectstart', false);     //disable text selection
         this._redraw(true);
      },
      /**
       * Устанавливает значение из-за действий пользователя. Сигналит onChange, onStateChanged, меняет контекст, своё значение и визуальное представление
       * @param {Boolean} value
       * @protected
       */
      _setValueByUser: function(value){
         var prevValue = this._value;
         this.setValue(value);
         if( prevValue !== this._value ){
            this._notify('onChange', value);
         }
      },
      /**
       * Переключает в противоположное состояние
       * @see setValue
       * @see getValue
       */
      toggle: function(){
         this.setValue(!this._value);
      },
      /**
       * Установить видимость контрола.
       * @param visible
       * @example
       * <pre>
       *    control.setVisible(!control.isVisible());
       * </pre>
       */
      setVisible: function(visible){
         this._container.toggle(visible);
      },
      /**
       * Обрабатывает действие пользователя, предотвращает изменения на выключенном контроле
       * @param {Function} callback Функция, которую необходимо выполнить
       * @private
       */
      _userAction: function(callback){
         if( this.isEnabled() ){
            callback.call(this);
         }
      },
      /**
       * Переключает в противоположное состояние, сигналит onChange
       * @protected
       */
      _toggleByUser: function(){
         this._setValueByUser(!this._value);
      },
      /**
       * Привязывает блоки из вёрстки к переменным
       * @protected
       */
      _bindBlocks: function(){
      },
      /**
       * Устанавливает значение
       * @see getValue
       * @see toggle
       * @param {Boolean} value Новое значение
       */
      setValue: function(value){
         if( typeof(value) === 'boolean' ){
            this._setValueInternal(value);
            this._updateSelfContextValue(this._value);
         }
      },
      /**
       * Переключает классы в зависимости от состояния
       * @param {Boolean} value Значение переключателя
       * @protected
       */
      _toggleClasses: function(value){
      },
      /**
       * Запоминает значение, начинает анимацию
       * @param {Boolean|null|undefined} value Новое значение
       * @private
       */
      _setValueInternal: function(value){
         if( value === null || value === undefined ){
            value = false;
         }
         var prevValue = this._value;
         if( typeof(value) === 'boolean' ){
            this._value = value;
            this._toggleClasses(value);
            if( prevValue !== value ){
               this._notify('onStateChanged', value);
               this._notifyOnValueChange(value);
            }
         }
      },
      /**
       * Функция обработки получения значения из контекста
       * @param {*} value значение, полученное из контекста
       */
      _onContextValueReceived: function(value){
         if( value !== undefined ){
            this._setValueInternal(value);
         }
      },
      /**
       * Устанавливает текст для обоих состояний
       * @see setTextOff
       * @see setTextOn
       * @param {String} textOff Текст для выключенного состояния
       * @param {String} textOn Текст для включённого состояния
       */
      setText: function(textOff, textOn){
         this._textOffContainer.text(this._textOff = textOff);
         this._textOnContainer.text(this._textOn = textOn);
      },
      /**
       * Устанавливает текст для выключенного состояния
       * @see setText
       * @see setTextOn
       * @see getTextOff
       * @param {String} text
       */
      setTextOff: function(text){
         this._textOffContainer.text(this._textOff = text);
      },
      /**
       * Возвращает текст в выключенном состоянии
       * @see setTextOff
       * @see getStringValue
       * @returns {String}
       */
      getTextOff: function(){
         return this._textOff;
      },
      /**
       * Устанавливает текст для включенного состояния
       * @see setText
       * @see setTextOff
       * @see getTextOn
       * @param {String} text
       */
      setTextOn: function(text){
         this._textOnContainer.text(this._textOn = text);
      },
      /**
       * Возвращает текст в включенном состоянии
       * @see setTextOn
       * @see getStringValue
       * @returns {String}
       */
      getTextOn: function(){
         return this._textOn;
      },
      /**
       * Возвращает строковое представление переключателя. Если включен - возвращает "включенный" текст, иначе - "выключенныей"
       */
      getStringValue: function(){
         if( this.getValue() ){
            return this.getTextOn();
         }
         return this.getTextOff();
      },
      /**
       * Дополнительно вешает свой класс ws-enabled для удобства
       * @see isEnabled
       * @param {Boolean} enable Включён ли контрол
       */
      _setEnabled: function(enable){
         $ws.proto.SwitcherAbstract.superclass._setEnabled.apply(this, arguments);
      },
      /**
       * Возвращает начальное значение
       * @return {Boolean}
       * @protected
       */
      _getDefaultValue: function(){
         var valueChecker = function(value){
            return !!value;
         };
         if( typeof(this._options.value) === 'function' ){
            return valueChecker(this._options.value());
         }
         return valueChecker(this._options.value);
      },
      /**
       * Обрабатывает клавишу "влево"
       * @protected
       */
      _keyLeft: function(){
         if( this._value === true ){
            this._setValueByUser(false);
         }
      },
      /**
       * Обрабатывает клавишу "вправо"
       * @protected
       */
      _keyRight: function(){
         if( this._value === false ){
            this._setValueByUser(true);
         }
      },
      /**
       * Запоминает, какие колбеки на какую клавишу требуются
       * @private
       */
      _initKeys: function(){
         this._keysCallbackMap[$ws._const.key.space] = this._toggleByUser;
         this._keysCallbackMap[$ws._const.key.left] = this._keyLeft;
         this._keysCallbackMap[$ws._const.key.right] = this._keyRight;
      },
      /**
       * Обрабатывает нажатия клавиш
       * @param {Object} event Событие
       * @protected
       */
      _keyboardHover: function(event){
         var key = event.which;
         if( key in this._keysCallbackMap ){
            this._keysCallbackMap[key].call(this);
         }
      },
      /**
       * Пересоздаёт блоки контрола
       * @param {Boolean} from_constructor Звался ли метод из конструктора
       * @protected
       */
      _redraw: function(from_constructor){
         this._bindBlocks();
         if(!from_constructor){
            this.setEnabled(this._options.enabled);
         }
      }
   });

   return $ws.proto.SwitcherAbstract;

});