/**
 * Модуль 'Кнопка-иконка'.
 *
 * @description
 */
define('js!SBIS3.CONTROLS.IconButton', ['js!SBIS3.CONTROLS.Button',
      'tmpl!SBIS3.CONTROLS.IconButton',
      'Core/constants',
      'css!SBIS3.CONTROLS.IconButton'
], function(WSButton,
            template,
            cConstants) {

   'use strict';

   /**
    * Класс контрола "Кнопка в виде значка".
    *
    * {@link https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/textbox/buttons/button-icon/#icon-button Демонстрационные примеры}.
    * <a href='http://axure.tensor.ru/standarts/v7/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8__%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%8F_07_.html'>Спецификация</a>.
    *
    * @class SBIS3.CONTROLS.IconButton
    * @extends SBIS3.CONTROLS.Button
    *
    * @author Романов Валерий Сергеевич
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
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
    * @ignoreEvents onDragIn onDragStart onDragStop onDragMove onDragOut
    *
    * @cssModifier controls-IconButton__round-border Добавляет круглую границу вокруг иконки. Размер границы подстраивается под размеры иконки.
    * По умолчанию граница серого цвета. При наведении курсора цвет границы изменяется в соответствии с цветом иконки, установленной в опции {@link icon}.
    * @cssModifier controls-IconButton__round-border-24 Устанавливает круглую границу (диаметр в 24 px) вокруг иконки быстрой операции, доступной по наведению курсора. Подробнее о таких типах операций вы можете прочитать <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/items-action/fast/">здесь</a>.
    * Модификатор применяется совместно с иконками 16 px. Цвет границы соответствует цвету иконки, установленной в опции {@link icon}.
    * @cssModifier controls-IconButton__filter-left Устанавливает внешний вид для кнопки открытия/закрытия фильтров слева.
    * @cssModifier controls-IconButton__filter-right Устанавливает внешний вид  для кнопки открытия/закрытия фильтров справа.
    *
    * @category Buttons
    * @control
    * @public
    * @initial
    * <component data-component='SBIS3.CONTROLS.IconButton'>
    *    <option name="icon" value="icon-16 icon-AddButton icon-primary"></option>
    * </component>
    */

   var IconButton = WSButton.extend([], /** @lends SBIS3.CONTROLS.IconButton.prototype */ {
      _template: template,
      _controlName: 'SBIS3.CONTROLS.IconButton',
      _useNativeAsMain: true,
      iWantVDOM: false,
      _doNotSetDirty: true,

      constructor: function(cfg) {
         cfg.tooltip = cfg.tooltip || cfg.caption;
         IconButton.superclass.constructor.call(this, cfg);
      },

      /*TODO: Удалить при переходе на VDOM*/
      _onMouseClick: function(e) {
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
         this._onClickHandler(e);
      },

      _containerReady:function(container){
         if (window) {
            container.on('click', this._onMouseClick.bind(this));
            var self = this;

            container.keydown(function(e) {
               var result = self._notify('onKeyPressed', e);
               if (e.which == cConstants.key.enter && result !== false ) {
                  self._onClickHandler(e);
               }
            });

            // todo временное решение. нужно звать stopPropagation для всех компонентов, как это было раньше
            // останавливаю всплытие, как это было раньше в Control.module.js, сейчас это ломает старую логику.
            // например, при нажатии на кнопку в datepicker-е фокусируется его текстовое поле
            container.on("focusin", function (e) {
               e.stopPropagation();
            });

            container.on("touchstart", function (e) {
               if (self.isEnabled()) {
                  self._container.addClass('controls-Click__active');
                  self._onTouchStart(e);
               }
            });

            container.on("touchmove", function (e) {
               self._onTouchMove(e);
            });

            container.on("touchend", function (e) {
               self._onTouchEnd(e);
            });

            container.on("mousedown", function (e) {
               if (e.which == 1 && self.isEnabled()) {
                  self._container.addClass('controls-Click__active');
               }
            });

            container.on("mouseenter", function (e) {
               self._showExtendedTooltipCompatible();
               //return false;
            });

            container.on("mouseleave", function (e) {
               if(self.isActive()) {
                  self._hideExtendedTooltipCompatible();
               }
               //return false;
            });
         }
         /*TODO оставляем добавку класса через jquery
          * чтобы избавиться - надо убрать зависимость от icons.css
          * в котором прописаны поведение и цвета для иконок по ховеру*/
         var className = (typeof(container.get)==="function") && container.get(0).className;
         if (className && className.indexOf('controls-IconButton__round-border') >= 0) {
            container.removeClass('action-hover');
         }
      }
   });

   return IconButton;

});