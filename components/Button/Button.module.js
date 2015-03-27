/**
 * Модуль 'Компонент кнопка'.
 * Можно настроить:
 * <ol>
 *    <li>{@link $ws.proto.Control#allowChangeEnable возможность изменения доступности кнопки};</li>
 *    <li>{@link SBIS3.CONTROLS.ButtonBase#caption текст на кнопке};</li>
 *    <li>{@link $ws.proto.Control#enabled возможность взаимодействия с кнопкой};</li>
 *    <li>{@link SBIS3.CONTROLS.IconMixin#icon иконку на кнопке};</li>
 *    <li>{@link primary по умолчанию ли кнопка};</li>
 *    <li>{@link $ws.proto.Control#visible видимость кнопки};</li>
 * </ol>
 * @description
 */
define('js!SBIS3.CONTROLS.Button', ['js!SBIS3.CONTROLS.ButtonBase', 'html!SBIS3.CONTROLS.Button'], function(ButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * @class SBIS3.CONTROLS.Button
    * @extends SBIS3.CONTROLS.ButtonBase
    * @control
	* @demo SBIS3.Demo.Control.MyButton
    * @initial
    * <component data-component='SBIS3.CONTROLS.Button'>
    *    <option name='caption' value='Кнопка'></option>
    * </component>
    * @public
    * @category Buttons
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers parent
    * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner record stateKey
    * @ignoreOptions subcontrol verticalAlignment
    */

   var Button = ButtonBase.extend( /** @lends SBIS3.CONTROLS.Button.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            /**
             * @cfg {Boolean} Кнопка по умолчанию
             * Кнопка будет срабатывать при нажатии клавиши Enter, и будет визуально отличаться от других кнопок.
             * На странице может быть только одна кнопка по умолчанию.
             * Возможные значения:
             * <ul>
             *    <li>true - кнопка является кнопкой по умолчанию;</li>
             *    <li>false - обычная кнопка.</li>
             * </ul>
             * @example
             * <pre>
             *     <option name="primary">true</option>
             * </pre>
             * @see isPrimary
             * @see setPrimary
             */
            primary: false
         }
      },

      $constructor: function() {
         if (this._options.primary == true) {
            this._registerDefaultButton();
         }
      },

      setCaption: function(caption){
         Button.superclass.setCaption.call(this, caption);
         var btnText;
         if (this._options.icon) {
            btnText = $('.js-controls-Button__text', this._container.get(0));
            btnText.toggleClass('controls-Button__emptyCaption', !caption);
         }
         else {
            btnText = this._container;
         }
         btnText.text(caption || '');
      },
       /**
        * Метод установки кнопки по умолчанию.
        * @param flag Признак является ли кнопкой по умолчанию.
        * Возможные значения:
        * <ul>
        *    <li>true - кнопка по умолчанию;</li>
        *    <li>false - обычная кнопка.</li>
        * </ul>
        * @example
        * <pre>
        *    var btn = this.getChildControlByName('myButton')
        *    btn.setPrimary(false);
        * </pre>
        * @see isPrimary
        * @see primary
        */
      setPrimary: function(flag){
         this._options.primary = !!flag;
         this._container.toggleClass('controls-Button__primary', this.isPrimary());
      },
      /**
       * Является ли кнопкой по умолчанию.
       * @returns {Boolean} Возвращает признак является ли кнопкой по умолчанию.
       * Возможные значения:
       * <ul>
       *    <li>true - кнопка по умолчанию;</li>
       *    <li>false - обычная кнопка.</li>
       * </ul>
       * @example
       * <pre>
       *     if (!button.isPrimary()) {
       *        button.setPrimary(true);
       *     }
       * </pre>
       * @see primary
       * @see setPrimary
       */
      isPrimary: function(){
         return this._options.primary;
      },
       /**
        * Метод установки/замены иконки на кнопке.
        * @param icon Иконка из набора {@link http://wi.sbis.ru/docs/3.8.0/#icons общих иконок}. Задаётся через sprite.
        * @example
        * <pre>
        *    var btn = this.getChildControlByName('myButton');
        *    btn.setIcon('sprite:icon16 icon-Alert icon-done');
        * </pre>
        */
      setIcon: function(icon) {
         Button.superclass.setIcon.call(this, icon);
         var caption;
         if (!icon) {
            caption = $(".js-controls-Button__text", this._container.get(0)).html();
            this._container.html(caption).addClass('controls-Button__text');
         } else {
            var iconCont = $('.js-controls-Button__icon', this._container.get(0));
            if (!(iconCont.length)) {
               caption = this._container.html();
               var content = $('<span class="controls-Button__content">\
                  <i class="controls-Button__icon js-controls-Button__icon ' + this._iconClass + '"></i><span class="controls-Button__text js-controls-Button__text">' + caption + '</span>\
               </span>');
               $('.controls-Button__text', content).toggleClass('controls-Button__emptyCaption', !caption);
               this._container.html(content);
            }
            else {
               $('.js-controls-Button__icon', this._container.get(0)).get(0).className = 'controls-Button__icon js-controls-Button__icon ' + this._iconClass;
            }
            this._container.removeClass('controls-Button__text');
         }
      },

      /*TODO методы для поддержки defaultButton*/
       /**
        * @noShow
        * @returns {boolean}
        */
      isDefaultButton: function(){
         return !!this._options.primary;
      },
      _unregisterDefaultButton: function() {
         var parent = this.getParent();
         if(parent && parent.unregisterDefaultButton)
            parent.unregisterDefaultButton(this);
      },
      _registerDefaultButton: function() {
         var parent = this.getParent();
         if(parent && parent.registerDefaultButton)
            parent.registerDefaultButton(this);
      },
       /**
        * @noShow
        * @param isDefault
        */
      setDefaultButton: function(isDefault){
         if(isDefault === undefined)
            isDefault = true;
         this.setPrimary(isDefault);


         if(isDefault) this._registerDefaultButton();
         else this._unregisterDefaultButton();
      }
      /*TODO конец*/
   });

   return Button;

});