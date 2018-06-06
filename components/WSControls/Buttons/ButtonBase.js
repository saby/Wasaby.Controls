define('SBIS3.CONTROLS/WSControls/Buttons/ButtonBase', [
   'Lib/Control/CompoundControl/CompoundControl',
   'SBIS3.CONTROLS/Mixins/Clickable',
   'SBIS3.CONTROLS/Mixins/FormWidgetMixin',
   'SBIS3.CONTROLS/Mixins/DataBindMixin',
   'SBIS3.CONTROLS/Mixins/IconMixin',
   'Core/helpers/String/escapeHtml',
   'css!SBIS3.CONTROLS/WSControls/Buttons/resources/ButtonBase'
], function(Control, Clickable, FormWidgetMixin, DataBindMixin, IconMixin, escapeHtml) {

   'use strict';

   /**
    * Класс, задающий базовое поведение кнопки. Основное предназначение - обрабатывать клик.
    * Все контролы-кнопки должны наследоваться от этого класса.
    * Отображение и вёрстка задаются именно в унаследованных классах.
    * @class WSControls/Buttons/ButtonBase
    * @public
    * @extends Lib/Control/CompoundControl/CompoundControl
    *
    * @mixes SBIS3.CONTROLS/Mixins/Clickable
    * @mixes SBIS3.CONTROLS/Mixins/FormWidgetMixin
    * @mixes SBIS3.CONTROLS/Mixins/DataBindMixin
    * @mixes SBIS3.CONTROLS/Mixins/IconMixin
    *
    * @author Крайнов Д.О.
    *
    * @ignoreOptions validators independentContext contextRestriction extendedTooltip
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    */

   var WSButtonBase = Control.extend([Clickable, FormWidgetMixin, DataBindMixin, IconMixin],/** @lends WSControls/Buttons/ButtonBase.prototype*/ {

      $protected: {
         _tooltipSettings: {
            handleFocus: false
         },
         _checkClickByTap: true,
         _maxTouchCount:2,
         _options: {
            /**
             * @cfg {Content} Устанавливает надпись на кнопке.
             * @example
             * <pre class="brush:xml">
             *     <option name="caption">Сохранить</option>
             * </pre>
             * @translatable
             * @content
             * @see setCaption
             * @see getCaption
             */
            caption: undefined,
             /**
              * @cfg {Boolean} Устанавливает признак, от которого зависит будут ли экранированы html-теги в надписи кнопки (см. {@link caption}).
              * @remark
              * По умолчанию значение установлено в true, что означает теги в надписи кнопки экранируются.
              * @example
              * 1) Когда опция `escapeCaptionHtml=true`
              * <pre>
              * myButton.setCaption('<div>Войти</div>');
              * // надпись на кнопке - "<div>Войти</div>"
              * </pre>
              * 2) Когда опция `escapeCaptionHtml=false`
              * <pre>
              * myButton.setCaption('<div>Войти</div>');
              * // надпись на кнопке - "Войти"
              * </pre>
              * @see caption
              * @noShow
              */
            escapeCaptionHtml: true
         }
      },

      _modifyOptions : function() {
         var opts = WSButtonBase.superclass._modifyOptions.apply(this, arguments);

         if (opts.caption && opts.escapeCaptionHtml){
            opts.caption = escapeHtml(opts.caption);
         }
         return opts;
      },

      $constructor: function() {

      },

      init : function() {
         WSButtonBase.superclass.init.call(this);
         /*TODO хак чтоб не срабатывал клик на кнопку при нажатии на дочерние компоненты*/
         $('[data-component]', this._container.get(0)).mousedown(function(e){
            e.stopPropagation();
         });
      },

      /**
       * Установить надпись на кнопке.
       * @param {String} captionTxt
       * @example
       * <pre>
       *     var btn = this.getChildControlByName(("myButton");
       *        btn.setCaption("Применить");
       * </pre>
       * @see caption
       * @see getCaption
       */
      setCaption: function(caption) {
         if (this._options.escapeCaptionHtml){
            caption = escapeHtml(caption);
         }
         this._options.caption = caption || '';
      },

      validate: function() {
         /* Т.к. buttonBase это составной контрол, то он должен валидировать как себя (радиокнопки должны валидировать себя),
            так и детей. */
         return WSButtonBase.superclass.validate.apply(this, arguments) && Control.prototype.validate.apply(this, arguments);
      },
      /**
       * Получить надпись, отображаемую на кнопке.
       * @returns {String}
       * @example
       * <pre>
       *     var btn = this.getChildControlByName("myButton");
       *        btn.getCaption();
       * </pre>
       * @see caption
       * @see setCaption
       */
      getCaption: function() {
         return this._options.caption;
      },
      /**
       * Переопределённый метод из базового Control
       * Нужен, чтобы быстро работало скртие контрола,
       * Не запускались расчёты авторазмеров
       */
      _setVisibility: function(show) {
         if(show !== this._isVisible){
            this._container.toggleClass('ws-hidden', !show);
            this._isVisible = show;
            this._setOption('visible', this._isVisible);
            // кнопка визуально изменилась - нужно вызвать ресайз, потому что эта кнопка могла повлиять на размеры среды, где она находится
            this._notifyOnSizeChanged(true);
            this._notifyOnPropertyChanged('visible');
         }
      },
      _getExtendedTooltipPositionContainer: function() {
         if (this._options.icon || !!this._options.iconClass) {
            return this.getContainer()[0].querySelector('.js-controls-Button__icon');
         }
         return this.getContainer();
      }
   });

   return WSButtonBase;

});
