
define('js!SBIS3.CONTROLS.Button', [
   "Core/constants",
   "js!SBIS3.CONTROLS.ButtonBase",
   "html!SBIS3.CONTROLS.Button",
   'css!SBIS3.CONTROLS.Button'
], function( constants,ButtonBase, dotTplFn) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * Можно настроить:
    * <ol>
    *    <li>{@link $ws.proto.Control#allowChangeEnable возможность изменения доступности кнопки};</li>
    *    <li>{@link SBIS3.CONTROLS.ButtonBase#caption текст на кнопке};</li>
    *    <li>{@link $ws.proto.Control#enabled возможность взаимодействия с кнопкой};</li>
    *    <li>{@link SBIS3.CONTROLS.IconMixin#icon иконку на кнопке};</li>
    *    <li>{@link primary по умолчанию ли кнопка};</li>
    *    <li>{@link $ws.proto.Control#visible видимость кнопки};</li>
    * </ol>
    * @class SBIS3.CONTROLS.Button
    * @extends SBIS3.CONTROLS.ButtonBase
	* @demo SBIS3.CONTROLS.Demo.MyButton
    *
    * @author Крайнов Дмитрий Олегович
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip element linkedContext handlers parent
    * @ignoreOptions autoHeight autoWidth context horizontalAlignment isContainerInsideParent modal owner record stateKey
    * @ignoreOptions subcontrol verticalAlignment
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragStart onDragStop onDragMove onDragOut
    *
    * @cssModifier controls-Button__filled непрозрачный фон кнопки
    * @cssModifier controls-Button__big Большая кнопка.
    * @cssModifier controls-Button__ellipsis Кнопка, на которой в тексте появляется многоточие при нехватке ширины.
    * @cssModifier controls-Button__withoutCaption Кнопка, без заголовка
    * !Важно: при добавлении этого класса сломается "Базовая линия".
    *
    * @css controls-Button__icon Класс для изменения отображения иконки кнопки.
    * @css controls-Button__text Класс для изменения отображения текста на кнопке.
    *
    * @control
    * @category Buttons
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.Button'>
    *    <option name='caption' value='Кнопка'></option>
    * </component>
    */

   var Button = ButtonBase.extend( /** @lends SBIS3.CONTROLS.Button.prototype */ {
      _dotTplFn : dotTplFn,
      $protected: {
         _keysWeHandle: [
            constants.key.enter
         ],
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
             * <pre class="brush:xml">
             *     <option name="primary">true</option>
             * </pre>
             * @see isPrimary
             * @see setPrimary
             */
            primary: false
         }
      },

      $constructor: function() {
         if (this._options.primary === true) {
            this._registerDefaultButton();
         }
      },

      init : function() {
         Button.superclass.init.call(this);
         /*Хак чтобы в IE не прыгал тег button при зажатии мышки*/
         this._container.click(function(e){
            e.preventDefault();
         });
      },

      setCaption: function(caption){
         Button.superclass.setCaption.call(this, caption);
         var btnText = $('.js-controls-Button__text', this._container.get(0));
         btnText.toggleClass('controls-Button__emptyCaption', !caption);
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
      _drawIcon: function(icon) {
         var content,
             caption = $('.js-controls-Button__text', this._container.get(0)).html();
         if (!icon) {
             content = $('<span class="controls-Button__text js-controls-Button__text">' + caption + '</span>');
         } else {
             content = $('<i class="controls-Button__icon js-controls-Button__icon ' + this._options._iconClass + '"></i><span class="controls-Button__text js-controls-Button__text">' + caption + '</span>');
         }
         $('.controls-Button__text', content).toggleClass('controls-Button__emptyCaption', !caption);
         this._container.html(content);
      },

      setEnabled: function(enabled){
         Button.superclass.setEnabled.call(this, enabled);
         this._container.attr('disabled', !this.isEnabled());
      },
      _notifyOnActivated: function(originalEvent){
         Button.superclass._notifyOnActivated.apply(this, arguments);
         //preventDefault тоже надо делать, поскольку иначе при нажатии enter на кнопки генерируется click, и onActivated стреляет два раза
         // похоже, что это нативное поведение html у кнопки виновато
         originalEvent.preventDefault();
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
         this.sendCommand('unregisterDefaultButtonAction');
      },
      _registerDefaultButton: function() {
         function defaultAction(e) {
            if (self && self.isEnabled()) {
               self._onClickHandler(e);
               return false;
            } else {
               return true;
            }
         }
         var self = this;

         // регистрироваться имеют права только видимые кнопки. если невидимая кнопка зарегистрируется, мы нажмем enter и произойдет неведомое действие
         if (this.isVisible()) {
            // сначала отменяем регистрацию текущего действия по умолчанию, а потом регистрируем новое действие
            this._unregisterDefaultButton();
            this.sendCommand('registerDefaultButtonAction', defaultAction, this);
         }
      },
       /**
        * @noShow
        * @param isDefault
        */
      setDefaultButton: function(isDefault){
          if (isDefault === undefined)
             isDefault = true;


          if (isDefault) {
             this._registerDefaultButton();
          }
          else {
             this._unregisterDefaultButton();
          }

          this.setPrimary(isDefault);
      },

      destroy: function(){
         this._unregisterDefaultButton();
         Button.superclass.destroy.apply(this, arguments);
      }
      /*TODO конец*/
   });

   return Button;

});