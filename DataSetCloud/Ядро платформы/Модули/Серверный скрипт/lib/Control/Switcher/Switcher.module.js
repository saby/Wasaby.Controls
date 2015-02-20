/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 19.04.13
 * Time: 14:57
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.Switcher", ["js!SBIS3.CORE.SwitcherAbstract", "html!SBIS3.CORE.Switcher"], function( SwitcherAbstract, dotTplFn ) {

   "use strict";

   /**
    * @class $ws.proto.Switcher
    * @extends $ws.proto.SwitcherAbstract
    * @control
    * @category Select
    * @initial
    * <component data-component='SBIS3.CORE.Switcher' style='width: 100px'>
    *    <option name='textOn'>On</option>
    *    <option name='textOff'>Off</option>
    *    <option name='width'>100px</option>
    * </component>
    * @designTime plugin SBIS3.CORE.Switcher/design/DesignPlugin
    */
   $ws.proto.Switcher = SwitcherAbstract.extend(/** @lends $ws.proto.Switcher.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Внешний вид контрола
             * <wiTag group="Отображение">
             * @variant gray Текст серый в "выключенном" состоянии
             * @variant colored Текст чёрный в обоих состояниях
             */
            colorStyle: 'gray'
         }
         },
      $constructor: function(){
         if( $ws._const.browser.isIE7 ){
            this._container.addClass('ws-switcher-ie7');
         }
      },
      /**
       * Обрабатывает клик
       * @protected
       */
      _onClickHandler: function(){
         $ws.proto.Switcher.superclass._onClickHandler.apply(this, arguments);
         if( this.isEnabled() ){
            this._toggleByUser();
         }
      },
      /**
       * Привязывает блоки из вёрстки к переменным
       * @private
       */
      _bindBlocks: function(){
         this._togglerLeft = this._container.find('.ws-switcher-left');
         this._togglerRight = this._container.find('.ws-switcher-right');
         this._textContainer = this._container.find('.ws-switcher-text');
         this._textOffContainer = this._container.find('.ws-switcher-text-off');
         this._textOnContainer = this._container.find('.ws-switcher-text-on');
      },
      /**
       * Переключает классы в зависимости от состояния
       * @param {Boolean} value Значение переключателя
       * @private
       */
      _toggleClasses: function (value) {
         this._togglerLeft.toggleClass('ws-switcher-left-toggled', value);
         this._togglerRight.toggleClass('ws-switcher-right-toggled', value);
         this._textOffContainer.toggleClass('ws-switcher-text-toggled', value);
      },
      /**
       * Дополнительно вешает свой класс ws-enabled для удобства
       * @see isEnabled
       * @param {Boolean} enable Включён ли контрол
       */
      _setEnabled: function(enable){
         $ws.proto.Switcher.superclass._setEnabled.apply(this, arguments);
         this._togglerLeft.toggleClass('ws-disabled', !enable);
         this._togglerRight.toggleClass('ws-disabled', !enable);
         this._textContainer.toggleClass('ws-disabled', !enable);
         this._textOffContainer.toggleClass('ws-disabled', !enable);
      },
      _dotTplFn: dotTplFn
   });

   return $ws.proto.Switcher;

});