/**
 * Модуль 'Компонент кнопка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.ButtonBase', [
   "Core/constants",
   "js!SBIS3.CORE.CompoundControl",
   "js!SBIS3.CONTROLS.Clickable",
   "js!SBIS3.CONTROLS.FormWidgetMixin",
   "js!SBIS3.CONTROLS.DataBindMixin",
   "js!SBIS3.CONTROLS.IconMixin",
   "Core/helpers/string-helpers"
], function( constants,Control, Clickable, FormWidgetMixin, DataBindMixin, IconMixin, strHelpers) {

   'use strict';

   /**
    * Поведенческий класс, задающий базовое поведение кнопки. Основное предназначение - обрабатывать клик.
    * Все контролы-кнопки должны наследоваться от этого класса.
    * Отображение и вёрстка задаются именно в унаследованных классах.
    * @class SBIS3.CONTROLS.ButtonBase
    * @public
    * @extends $ws.proto.CompoundControl
    * @mixes SBIS3.CONTROLS.Clickable
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @mixes SBIS3.CONTROLS.DataBindMixin
    * @mixes SBIS3.CONTROLS.IconMixin
    * @author Крайнов Дмитрий Олегович
    *
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

   var ButtonBase = Control.extend([Clickable, FormWidgetMixin, DataBindMixin, IconMixin],/** @lends SBIS3.CONTROLS.ButtonBase.prototype*/ {

      $protected: {
         _tooltipSettings: {
            handleFocus: false
         },
         _checkClickByTap: true,
         _maxTouchCount:2,
         _options: {
            /**
             * @cfg {String}  Текст на кнопке
             * Данный текст должен отображать смысл действия клика по кнопке или побуждать к действию.
             * @example
             * <pre class="brush:xml">
             *     <option name="caption">Сохранить</option>
             * </pre>
             * @translatable
             * @see setCaption
             * @see getCaption
             */
            caption: undefined,
            escapeCaptionHtml: true
         }
      },

      $constructor: function() {
         
      },

      init : function() {
         ButtonBase.superclass.init.call(this);
         /*TODO хак чтоб не срабатывал клик на кнопку при нажатии на дочерние компоненты*/
         $('[data-component]', this._container.get(0)).mousedown(function(e){
            e.stopPropagation();
         });
      },

      /**
       * Установить текст на кнопке.
       * Метод установки либо замены текста на кнопке, заданного опцией {@link caption}.
       * @param {String} captionTxt Текст на кнопке.
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
            caption = strHelpers.escapeHtml(caption);
         }
         this._options.caption = caption || '';
      },
      _setEnabled: function() {
         ButtonBase.superclass._setEnabled.apply(this, arguments);
         // В IE8 при цвета смене иконки не происходит автоматическая её перерисовка, а вызывается она лишь при смене контента в before
         // http://stackoverflow.com/questions/14227751/ie8-update-inherited-color-of-before-content-based-on-parent-elements-class
         if (constants.browser.isIE8) {
            this._container.addClass('controls-Button__IE8Hack');
            setTimeout(function() {
               this._container.removeClass('controls-Button__IE8Hack')
            }.bind(this), 1);
         }
      },

      validate: function() {
         /* Т.к. buttonBase это составной контрол, то он должен валидировать как себя (радиокнопки должны валидировать себя),
            так и детей. */
         return ButtonBase.superclass.validate.apply(this, arguments) && Control.prototype.validate.apply(this, arguments);
      },
      /**
       * Получить текст на кнопке.
       * Метод получения текста, заданного либо опцией {@link caption}, либо методом {@link setCaption}.
       * @returns {String} Возвращает текст, указанный на кнопке.
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
         this._container.toggleClass('ws-hidden', !show);
         this._isVisible = show;
      }
   });

   return ButtonBase;

});