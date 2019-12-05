import Control = require('Core/Control');
import template = require('wml!Controls/_popup/InfoBox/InfoBox');
import InfoBoxOpener from './Opener/InfoBox';
import {TouchContextField} from 'Controls/context';
import getZIndex = require('Controls/Utils/getZIndex');
import Env = require('Env/Env');
import entity = require('Types/entity');

/*
 * Component that opens a popup that is positioned relative to a specified element.
*/
      /**
       * Контрол, отображающий всплывающую подсказку относительно указанного элемента.
       * Всплывающую подсказку вызывает событие, указанное в опции trigger.
       * В один момент времени на странице может отображаться только одна всплывающая подсказка.
       * @remark
       * Подробнее о работе с контролом читайте {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/infobox/ здесь}.
       * См. <a href="/materials/demo-ws4-infobox">демо-пример</a>.
       * @class Controls/_popup/InfoBox
       *
       * @public
       * @author Красильников А.С.
       * @demo Controls-demo/InfoBox/InfoBoxPG
       *
       * @css @spacing_Infobox-between-content-border-top Spacing between content and border-top .
       * @css @spacing_Infobox-between-content-border-right Spacing between content and border-right.
       * @css @spacing_Infobox-between-content-border-bottom Spacing between content and border-bottom.
       * @css @spacing_Infobox-between-content-border-left Spacing between content and border-left.
       *
       * @css @max-width_Infobox Max-width of Infobox.
       * @css @size_Infobox-arrow Size of Infobox arrow.
       * @css @horizontal-offset_Infobox-arrow Spacing between arrow and border-left.
       * @css @vertical-offset_Infobox-arrow  Spacing between arrow and border-top.
       * @css @spacing_Infobox-between-top-close-button Spacing between close-button and border-top.
       * @css @spacing_Infobox-between-right-close-button Spacing between close-button and border-right.
       *
       * @css @color_Infobox-close-button Color of close-button.
       * @css @color_Infobox-close-button_hover Color of close-button in hovered state.
       *
       * @css @background-color_Infobox_default Default background color.
       *
       * @css @border-color_Infobox_default Default border color.
       * @css @border-color_Infobox_danger Border color when option style is set to danger.
       * @css @border-color_Infobox_info Border color when option style is set to info.
       * @css @border-color_Infobox_warning Border color when option style is set to warning.
       * @css @border-color_Infobox_success Border color when option style is set to success.
       * @css @border-color_Infobox_secondary Border color when option style is set to secondary.
       * @css @border-width_Infobox Thickness of border.
       *
       * @css @color_Infobox-shadow_default Default color of shadow.
       * @css @box-shadow_Infobox Size of shadow.
       */

/**
 * @name Controls/_popup/InfoBox#targetSide
 * @cfg {String} Сторона таргета, относительно которой будет позиционнироваться всплывающая подсказка.
 * @variant top Подсказка позиционируется сверху от таргета
 * @variant bottom Подсказка позиционируется снизу от таргета
 * @variant left Подсказка позиционируется слева от таргета
 * @variant right Подсказка позиционируется справа от таргета
 * @default top
 */

      /*
       * @name Controls/_popup/InfoBox#targetSide
       * @cfg {String} Side positioning of the target relative to infobox.
       * Popup displayed on the top of the target.
       * @variant top Popup displayed on the top of the target.
       * @variant bottom Popup displayed on the bottom of the target.
       * @variant left Popup displayed on the left of the target.
       * @variant right Popup displayed on the right of the target.
       * @default top
       */

/**
 * @name Controls/_popup/InfoBox#alignment
 * @cfg {String} Выравнивание всплывающей подсказки относительно вызывающего её элемента.
 * @variant start Подсказка выравнивается по правому краю вызывающего её элемента.
 * @variant center Подсказка выравнивается по центру вызывающего её элемента.
 * @variant end Подсказка выравнивается по левому краю вызывающего её элемента.
 * @default start
 */

      /*
       * @name Controls/_popup/InfoBox#alignment
       * @cfg {String} Alignment of the infobox relative to target
       * Popup aligned by start of the target.
       * @variant start Popup aligned by start of the target.
       * @variant center Popup aligned by center of the target.
       * @variant end Popup aligned by end of the target.
       * @default start
       */

/**
 * @name Controls/_popup/InfoBox#hideDelay
 * @cfg {Number} Определяет задержку перед началом закрытия всплывающей подсказки. 
 * Значение задаётся в миллисекундах.
 * @default 300
 */

      /*
       * @name Controls/_popup/InfoBox#hideDelay
       * @cfg {Number} Delay before closing after mouse leaves. (measured in milliseconds)
       * @default 300
       */

/**
 * @name Controls/_popup/InfoBox#showDelay
 * @cfg {Number} Определяет задержку перед началом открытия всплывающей подсказки.
 * Значение задаётся в миллисекундах.
 * @default 300
 */

      /*
       * @name Controls/_popup/InfoBox#showDelay
       * @cfg {Number} Delay before opening after mouse enters.(measured in milliseconds)
       * @default 300
       */

/**
 * @name Controls/_popup/InfoBox#content
 * @cfg {function|String} Элемент управления, к которому добавляется логика открытия и закрытия всплывающей подсказки.
 */

      /*
       * @name Controls/_popup/InfoBox#content
       * @cfg {function|String} The content to which the logic of opening and closing the template is added.
       */

/**
 * @name Controls/_popup/InfoBox#template
 * @cfg {function|String} Шаблон всплывающей подсказки
 */

      /*
       * @name Controls/_popup/InfoBox#template
       * @cfg {function|String} Popup template.
       */

/**
 * @name Controls/_popup/InfoBox#templateOptions
 * @cfg {Object} Опции для контрола, переданного в {@link template}
 */

      /*
       * @name Controls/_popup/InfoBox#templateOptions
       * @cfg {Object} Popup template options.
       */

/**
 * @name Controls/_popup/InfoBox#trigger
 * @cfg {String} Определяет, какое событие будет иницировать открытие и закрытие всплывающей подсказки.
 * @variant click Открывается по клику на контент. Закрывается по клику вне контента или шаблона.
 * @variant hover Открывается по наведению мыши на контент. Закрывается по уходу мыши с шаблона и контента. Открытие игнорируется на тач - устройствах.
 * @variant hover|touch Открывается по наведению или по тачу на контент. Закрывается по уходу мыши с контента или с шаблона, а также по тачу вне контента или шаблона.
 * @variant demand  Разработчик октрывает и закрывает всплывающее окно вручную. Также подсказка закроется по клику вне шаблона или контента.
 * @default hover
 */

      /*
       * @name Controls/_popup/InfoBox#trigger
       * @cfg {String} Event name trigger the opening or closing of the template.
       * @variant click Opening by click on the content. Closing by click not on the content or template.
       * @variant hover Opening by hover on the content. Closing by hover not on the content or template.
       * Opening is ignored on touch devices.
       * @variant hover|touch Opening by hover or touch on the content. Closing by hover not on the content or template.
       * @variant demand  Developer opens and closes InfoBox manually. Also it will be closed by click not on the content or template.
       * @default hover
       */

/**
 * @name Controls/_popup/InfoBox#floatCloseButton
 * @cfg {Boolean} Определяет, будет ли контент обтекать кнопку закрытия.
 * @default false
 */

      /*
       * @name Controls/_popup/InfoBox#floatCloseButton
       * @cfg {Boolean} Whether the content should wrap around the cross closure.
       * @default false
       */

/**
 * @name Controls/_popup/InfoBox#style
 * @cfg {String} Внешний вид всплывающей подсказки.
 * @variant default
 * @variant danger
 * @variant warning
 * @variant info
 * @variant secondary
 * @variant success
 * @variant primary
 * @default secondary
 */

      /*
       * @name Controls/_popup/InfoBox#style
       * @cfg {String} Infobox display style.
       * @variant default
       * @variant danger
       * @variant warning
       * @variant info
       * @variant secondary
       * @variant success
       * @variant primary
       */
      const CALM_DELAY = 100; // During what time should not move the mouse to start opening the popup.

      var _private = {
         getCfg: function(self) {
            return {
               opener: self,
               target: self._container,
               template: self._options.template,
               position: self._options.position,
               targetSide: self._options.targetSide,
               alignment: self._options.alignment,
               style: self._options.style,
               showDelay: self._options.showDelay,
                //InfoBox close by outside click only if trigger is set to 'demand' or 'click'.
               closeOnOutsideClick: self._options.trigger === 'click' || self._options.trigger === 'demand',
               floatCloseButton: self._options.floatCloseButton,
               eventHandlers: {
                  onResult: self._resultHandler,
                  onClose: self._closeHandler
               },
               templateOptions: self._options.templateOptions
            };
         },
         resetTimeOut: function(self) {
            if (self._openId) {
               clearTimeout(self._openId);
            }
            if (self._closeId) {
               clearTimeout(self._closeId);
            }
            self._openId = null;
            self._closeId = null;
         }
      };

      var InfoBox = Control.extend({
         _template: template,

         _isNewEnvironment: InfoBoxOpener.isNewEnvironment,

         _openId: null,
         _waitTimer: null,
         _closeId: null,

         _beforeMount: function(options) {
            this._resultHandler = this._resultHandler.bind(this);
            this._closeHandler = this._closeHandler.bind(this);
         },

         /**
          * TODO: https://online.sbis.ru/opendoc.html?guid=ed987a67-0d73-4cf6-a55b-306462643982
          * Кто должен закрывать инфобокс после разрушения компонента нужно будет обсудить.
          * Если компонент обрабатывающий openInfoBox и closeInfoBox, то данный код будет удален по ошибке выше.
          */
         _beforeUnmount: function() {
            this._clearWaitTimer();
            if (this._opened) {
               this._close();
            }
            _private.resetTimeOut(this);
         },

         _open: function() {
            var config = _private.getCfg(this);

            if (this._isNewEnvironment()) {
               this._notify('openInfoBox', [config], { bubbling: true });
            } else {
               // To place zIndex in the old environment
               config.zIndex = getZIndex(this._children.infoBoxOpener);
               this._children.infoBoxOpener.open(config);
            }

            _private.resetTimeOut(this);
            this._opened = true;
            this._forceUpdate();
         },

         _close: function(delay) {
            if (this._isNewEnvironment()) {
               this._notify('closeInfoBox', [delay], { bubbling: true });
            } else {
               //todo: will be fixed by https://online.sbis.ru/opendoc.html?guid=e6be2dd9-a47f-424c-a86c-bd6b48b98602
               if(!this._destroyed) {
                  this._children.infoBoxOpener.close(delay)
               }
            }
            _private.resetTimeOut(this);
            this._opened = false;
         },

         _contentMousedownHandler: function(event) {
            if (this._options.trigger === 'click') {
               if (!this._opened) {
                  this._open(event);
               }
               event.stopPropagation();
            }
         },

         _contentMousemoveHandler(): void {
            if (this._options.trigger === 'hover' || this._options.trigger === 'hover|touch') {
               // wait, until user stop mouse on target.
               // Don't open popup, if mouse moves through the target
               // On touch devices there is no real hover, although the events are triggered. Therefore, the opening is not necessary.
               this._clearWaitTimer();
               this._waitTimer = setTimeout(() => {
                  this._waitTimer = null;
                  if (!this._opened && !this._context.isTouch.isTouch) {
                     this._startOpeningPopup();
                  }
               }, CALM_DELAY);
            }
         },

         _clearWaitTimer(): void {
            if (this._waitTimer) {
               clearTimeout(this._waitTimer);
            }
         },

         _contentTouchStartHandler: function() {
            if (this._options.trigger === 'hover|touch') {
               this._startOpeningPopup();
            }
         },

         _startOpeningPopup: function() {
            var self = this;
            //TODO: will be fixed by https://online.sbis.ru/opendoc.html?guid=809254e8-e179-443b-b8b7-f4a37e05f7d8
            _private.resetTimeOut(this);

            this._openId = setTimeout(function() {
               self._openId = null;
               self._open();
               self._forceUpdate();
            }, self._options.showDelay);
         },

         _contentMouseleaveHandler: function() {
            if (this._options.trigger === 'hover' || this._options.trigger === 'hover|touch') {
               this._clearWaitTimer();
               clearTimeout(this._openId);
               this._closeId = setTimeout(() => {
                  this._closeId = null;
                  this._close();
                  this._forceUpdate();
               }, this._options.hideDelay);
            }

         },

         /**
          * Метод открытия всплывающей подсказки.
          * @function Controls/_popup/InfoBox#open
          * @param {PopupOptions} popupOptions Опции всплывающей подсказки.
          * @see close
          */

         /*
          * Open InfoBox
          * @function Controls/_popup/InfoBox#open
          * @param {PopupOptions} popupOptions InfoBox popup options.
          */
         open: function() {
            this._open();
         },

         /**
          * Метод закрытия всплывающей подсказки
          * @function Controls/_popup/InfoBox#close
          * @see open
          */

         /*
          * Сlose InfoBox
          * @function Controls/_popup/InfoBox#close
          */
         close: function() {
            this._close();
         },

         _resultHandler: function(event) {
            switch (event.type) {
               case 'mouseenter':
                  clearTimeout(this._closeId);
                  this._closeId = null;
                  break;
               case 'mouseleave':
                  if (this._options.trigger === 'hover' || this._options.trigger === 'hover|touch') {
                     this._contentMouseleaveHandler();
                  }
                  break;
               case 'mousedown':
                  event.stopPropagation();
                  break;
               case 'close':
                  // todo Для совместимости
                  // Удалить, как будет сделана задача https://online.sbis.ru/opendoc.html?guid=dedf534a-3498-4b93-b09c-0f36f7c91ab5
                  this._opened = false;
            }
         },

         _closeHandler: function() {
            this._opened = false;
         },

         _scrollHandler: function() {
            this._close(0);
         }
      });

      InfoBox.contextTypes = function() {
         return {
            isTouch: TouchContextField
         };
      };
      InfoBox.getOptionTypes = function() {
         return {
            trigger: entity.descriptor(String).oneOf([
               'hover',
               'click',
               'hover|touch',
               'demand'
            ])
         };
      };


InfoBox.getDefaultOptions = function() {
         return {
            targetSide: 'top',
            alignment: 'start',
            style: 'secondary',
            showDelay: 300,
            hideDelay: 300,
            trigger: 'hover'
         };
      };
      InfoBox._private = _private;

      export = InfoBox;

/**
 * @typedef {Object} PopupOptions
 * @description Конфигурация всплывающей подсказки.
 * @property {function|String} template Шаблон всплывающей подсказки
 * @property {Object} templateOptions Опции для контрола, переданного в {@link Controls/_popup/InfoBox#template template}.
 * @property {String} trigger Определяет, какое событие будет иницировать открытие и закрытие всплывающей подсказки.
 * @property {String} targetSide Сторона таргета, относительно которой будет позиционнироваться всплывающая подсказка.
 * @property {String} alignment Выравнивание всплывающей подсказки относительно вызывающего её элемента.
 * @property {Boolean} floatCloseButton  Определяет, будет ли контент обтекать кнопку закрытия.
 * @property {String} style Внешний вид всплывающей подсказки.
 * @property {Number} hideDelay Определяет задержку перед началом закрытия всплывающей подсказки. ( измеряется в миллисекундах)
 * @property {Number} showDelay Определяет задержку перед началом открытия всплывающей подсказки. ( измеряется в миллисекундах)
 */

      /*
       * @typedef {Object} PopupOptions
       * @description InfoBox configuration.
       * @property {function|String} content The content to which the logic of opening and closing the template is added.
       * @property {function|String} template Template inside popup
       * @property {Object} templateOptions Template options inside popup.
       * @property {String} trigger Event name trigger the opening or closing of the template.
       * @property {String} targetSide
       * @property {String} alignment
       * @property {Boolean} floatCloseButton Whether the content should wrap around the cross closure.
       * @property {String} style InfoBox display style.
       * @property {Number} hideDelay Delay before closing.
       * @property {Number} showDelay Delay before opening.
       */


