define('js!SBIS3.CONTROLS.Button',
   [
      'Core/core-extend',
      "Core/Abstract.compatible",
      'js!SBIS3.CORE.Control/Control.compatible',
      "js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible",
      'js!SBIS3.CORE.BaseCompatible',
      'js!SBIS3.CORE.BaseCompatible/Mixins/WsCompatibleConstructor',
      'js!SBIS3.CONTROLS.Button/Button.compatible',
      'js!WS.Data/Entity/InstantiableMixin',
      'tmpl!SBIS3.CONTROLS.Button',
      'Core/core-functions',
      'Core/tmpl/tmplstr',
      "js!SBIS3.CORE.Control/ControlGoodCode",
      'css!SBIS3.CONTROLS.Button'
         ],

   function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             WsCompatibleConstructor,
             ButtonCompatible,
             InstantiableMixin,
             template,
             functions,
             tmplstr,
             ControlGoodCode) {

   'use strict';

   /**
    * Контрол, отображающий обычную кнопку
    * Можно настроить:
    * <ol>
    *    <li>{@link SBIS3.CORE.Control#allowChangeEnable возможность изменения доступности кнопки};</li>
    *    <li>{@link WSControls/Buttons/ButtonBase#caption текст на кнопке};</li>
    *    <li>{@link SBIS3.CORE.Control#enabled возможность взаимодействия с кнопкой};</li>
    *    <li>{@link SBIS3.CONTROLS.IconMixin#icon иконку на кнопке};</li>
    *    <li>{@link primary по умолчанию ли кнопка};</li>
    *    <li>{@link SBIS3.CORE.Control#visible видимость кнопки};</li>
    * </ol>
    * @class SBIS3.CONTROLS.Button
    * @extends WSControls/Buttons/ButtonBase
    * @demo SBIS3.CONTROLS.Demo.MyButton
    *
    * @author Романов Валерий Сергеевич
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
   var Button = extend.extend([AbstractCompatible,
         ControlCompatible,
         AreaAbstractCompatible,
         BaseCompatible,
         WsCompatibleConstructor,
         ButtonCompatible,
         InstantiableMixin,
         ControlGoodCode],
      {
         _controlName: 'SBIS3.CONTROLS.Button',
         _template: template,
         iWantVDOM: true,
         _isActiveByClick: false,
         _isWaitingClick: false,
         _isTouchEnded: false,
         _touchMoveCount: 0,

         constructor: function (cfg) {
            if (cfg.hasPartial) {
               if (!cfg.caption) {
                  cfg.caption = '';
               }
               cfg.caption = tmplstr.getFunction(cfg.caption);
            }
            this.deprecatedContr(cfg);
            this._publish('onActivated');
         },

         //<editor-fold desc="Event handlers">

         _onMouseClick: function (e) {
            if (this._isTouchEnded) {
               this._isTouchEnded = false;
               return;
            }
            this._isWaitingClick = false;
            if (!this._options.enabled) {
               return;
            }
            this._onClickHandler(e);
            this._notify("onActivated", e);
         },

         _onMouseDown: function () {
            if (!this._options.enabled) {
               return;
            }
            this._isActiveByClick = true;
         },

         _onMouseUp: function () {
            this._isActiveByClick = false;
         },

         _onTouchStart: function(e) {
            this._touchMoveCount = 0;
            this._isWaitingClick = true;
            this._isActiveByClick = true;
            this._isTouchEnded = false;
         },

         _onTouchMove: function(e) {
            this._touchMoveCount++;
            if(this._touchMoveCount > 1) {
               this._isWaitingClick = false;
            }
         },

         _onTouchEnd: function(e) {
            var self = this;
            this._isActiveByClick = false;
            /**
             * ipad имеет специфическую систему событий связанных с touch
             * onClick может произойти между onTouchStart и onTouchEnd, или
             * в течение 300мс после onTouchEnd, или не произойти вообще
             */
            setTimeout(function() {
               if(self._isWaitingClick) {
                  self._onMouseClick();
                  self._isTouchEnded = true;
               }
            }, 300);
         },

         _onKeyDown: function (e) {
            var result = this._notify('onKeyPressed', e);
            if (e.nativeEvent.key === 'Enter' && result !== false) {
               this._onMouseClick(e);
            }
         },

         _onMouseEnter: function(e){
            this._showExtendedTooltipCompatible();
            this._notify('onMouseEnter', e);
         },

         _onMouseLeave: function(e){
            if(this.isActive()) {
               this._hideExtendedTooltipCompatible();
            }
            this._notify('onMouseLeave', e);
         },

         _onFocusIn: function(e){
            var self = this;
            this._showExtendedTooltipCompatible();
         },

         _onFocusOut: function(e){
            var self = this;
            this._hideExtendedTooltipCompatible();
         }
         //</editor-fold>
      });

      return Button;
   });