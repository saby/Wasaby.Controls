define('js!SBIS3.CONTROLS.Button',
   [
      'Core/Control',
      'is!compatibleLayer?js!SBIS3.CONTROLS.Button/Button.compatible',
      'tmpl!SBIS3.CONTROLS.Button',
      'is',
      'is!compatibleLayer?js!SBIS3.CORE.BaseCompatible/Mixins/WsCompatibleConstructor',
      'is!compatibleLayer?js!SBIS3.CORE.Control/ControlGoodCode',
      'css!SBIS3.CONTROLS.Button',
      'css!WSControls/Buttons/resources/ButtonBase'
         ],

   function (Base,
             ButtonCompatible,
             template,
             isJs,
             WsCompatibleConstructor,
             ControlGoodCode) {

   'use strict';

   // почему нельзя сделать единый шаблон на <button - не работает клик по ссылке в ФФ
   // почему нельзя сделать единый шаблона на <a - нельзя положить <a внутрь <a, в верстке получится два рядом лежащих тега <a

   /**
    * Класс контрола "Обычная кнопка".
    *
    * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/textbox/buttons/button-line/#button Демонстрационные примеры}.
    * <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Спецификация</a>.
    *
    * @class SBIS3.CONTROLS.Button
    * @extends WSControls/Buttons/ButtonBase
    *
    * @mixes SBIS3.CONTROLS.Button/Button.compatible
    * @mixes SBIS3.CORE.BaseCompatible/Mixins/WsCompatibleConstructor
    * @mixes SBIS3.CORE.Control/ControlGoodCode
    *
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
    * @cssModifier controls-Button__withoutCaption Кнопка, без заголовка !Важно: при добавлении этого класса сломается "Базовая линия".
    *
    * @css controls-Button__icon Класс для изменения отображения иконки кнопки.
    * @css controls-Button__text Класс для изменения отображения текста на кнопке.
    *
    * @control
    * @category Buttons
    * @public
    * @initial
    * <ws:SBIS3.CONTROLS.Button caption="Кнопка" />
    */
   var Button = Base.extend([
         ButtonCompatible,
         WsCompatibleConstructor,
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
            Button.superclass.constructor.call(this, cfg);
            this._publish('onActivated');
         },

         //<editor-fold desc="Event handlers">

         _onMouseClick: function (e) {
            if (this._isTouchEnded) {
               this._isTouchEnded = false;
               /**
                * Если клик обработали на touchend - надо его стопнуть
                */
               if (e && e.stopImmediatePropagation) {
                  // если не остановить, будет долетать до области, а у нее обработчик на клик - onBringToFront. фокус будет улетать не туда
                  e.stopImmediatePropagation();
               }
               return;
            }
            this._isWaitingClick = false;
            if (!this.isEnabled()) {
               return;
            }
            if (isJs.features.compatibleLayer) {
               this._onClickHandler(e);
            }
            this._notify("onActivated", e);
            this._forceUpdate();
         },

         _onMouseDown: function () {
            if (!this.isEnabled()) {
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
            /**
             * ipad имеет специфическую систему событий связанных с touch
             * onClick может произойти между onTouchStart и onTouchEnd, или
             * в течение 1000мс после onTouchEnd, или не произойти вообще
             * + передаем контекст в setTimeout
             */
            setTimeout(function() {
               if(this._isWaitingClick) {
                  this._onMouseClick();
                  this._isTouchEnded = true;
               }
               this._isActiveByClick = false;
               //т.к. появилась асинхронность, руками дернем флаг о перерисовке, чтобы кнопка
               //не осталась "подвисшей"
               if (this.iWantVDOM) {
                  this._forceUpdate();
               }
            }.bind(this), 1000);
         },

         _onKeyDown: function (e) {
            var result = this._notify('onKeyPressed', e);
            if (e.nativeEvent.key === 'Enter' && result !== false) {
               this._onMouseClick(e);
            }
         },

         _onMouseEnter: function(e){
            if (isJs.features.compatibleLayer) {
               this._showExtendedTooltipCompatible();
            }
            this._notify('onMouseEnter', e);
         },

         _onMouseLeave: function(e){
            if (isJs.features.compatibleLayer) {
               if (this.isActive()) {
                  this._hideExtendedTooltipCompatible();
               }
            }
            this._notify('onMouseLeave', e);
         },

         _onFocusIn: function(e){
            var self = this;
            if (isJs.features.compatibleLayer) {
               this._showExtendedTooltipCompatible();
            }
         },

         _onFocusOut: function(e){
            var self = this;
            if (isJs.features.compatibleLayer) {
               this._hideExtendedTooltipCompatible();
            }
         },

         destroy: function() {
            if (isJs.features.compatibleLayer) {
               if (this.isPrimary()) {
                  this._unregisterDefaultButton();
               }
            }
            Button.superclass.destroy.call(this);
         }
         //</editor-fold>
      });

      return Button;
   });