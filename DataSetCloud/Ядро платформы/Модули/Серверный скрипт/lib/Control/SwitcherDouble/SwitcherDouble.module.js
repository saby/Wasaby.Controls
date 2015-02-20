define("js!SBIS3.CORE.SwitcherDouble", ["js!SBIS3.CORE.SwitcherAbstract", "html!SBIS3.CORE.SwitcherDouble", "css!SBIS3.CORE.SwitcherAbstract"], function( SwitcherAbstract, dotTplFn ) {

   "use strict";

   var buttonWidth = 24;

   /**
    * Двухпозиционный переключатель.
    *
    * @class $ws.proto.SwitcherDouble
    * @extends $ws.proto.SwitcherAbstract
    *
    * @control
    * @category Select
    * @initial
    * <component data-component='SBIS3.CORE.SwitcherDouble'>
    *    <option name='textOn'>On</option>
    *    <option name='textOff'>Off</option>
    * </component>
    */
   $ws.proto.SwitcherDouble = SwitcherAbstract.extend(/** @lends $ws.proto.SwitcherDouble.prototype */{
      $protected: {
         _options: {
            value: false,
            /**
             * @cfg {String} Текст при выключенном состоянии
             * @translatable
             */
            textOff: '',
            /**
             * @cfg {String} Текст при включённом состоянии
             * @translatable
             */
            textOn: '',
             /**
              * @cfg {String} Делает цвет текста как у метки
              */
            colorStyle: 'gray',
            /**
             * @typedef {string} DispositionType
             * @variant horizontal горизонтальное
             * @variant vertical вертикальное
             */
            /**
             * @cfg {DispositionType} Расположение двухпозиционного переключателя
             */
            disposition: 'horizontal'
         },
         _toggler: undefined,
         _textContainer: undefined
      },
      $constructor: function(){
         this._initEvents();
         if (this._options.disposition === 'vertical') {
            var textWidth = this._container.width() - buttonWidth;
            if (textWidth) {
               this._container.find('.ws-switcher-double-text').width(textWidth);
            }
         }
      },
      /**
       * Подписывается на события
       * @protected
       */
      _initEvents: function(){
         this._toggler.bind('click', this._userAction.bind(this, this._toggleByUser));
         this._textOffContainer.bind('click', this._userAction.bind(this, this._keyLeft));
         this._textOnContainer.bind('click', this._userAction.bind(this, this._keyRight));
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
       * Привязывает блоки из вёрстки к переменным
       * @private
       */
      _bindBlocks: function(){
         this._toggler = this._container.find('.ws-switcher-toggler');
         this._textOffContainer = this._container.find('.ws-switcher-text-off');
         this._textOnContainer = this._container.find('.ws-switcher-text-on');
      },
      /**
       * Переключает классы в зависимости от состояния
       * @param {Boolean} value Значение переключателя
       * @private
       */
      _toggleClasses: function(value){
         this._textOffContainer.toggleClass('ws-switcher-double-text-off', value);
         this._textOnContainer.toggleClass('ws-switcher-double-text-off', !value);
         this._toggler.toggleClass('ws-switcher-toggler-on', value);
      },
      /**
       * Дополнительно вешает свой класс ws-enabled для удобства
       * @see isEnabled
       * @param {Boolean} enable Включён ли контрол
       */
      _setEnabled: function(enable){
         $ws.proto.SwitcherDouble.superclass._setEnabled.apply(this, arguments);
         this._textOffContainer.toggleClass('ws-disabled', !enable);
         this._textOnContainer.toggleClass('ws-disabled', !enable);
         this._toggler.toggleClass('ws-disabled', !enable);
      },
      _dotTplFn: dotTplFn
   });

   return $ws.proto.SwitcherDouble;

});