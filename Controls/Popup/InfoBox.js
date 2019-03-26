define('Controls/Popup/InfoBox',
   [
      'Core/Control',
      'wml!Controls/Popup/InfoBox/InfoBox',
      'Controls/Popup/Previewer/OpenerTemplate',
      'Controls/Popup/Opener/InfoBox',
      'Controls/Context/TouchContextField',
      'Controls/Utils/getZIndex',
      'Env/Env'
   ],
   function(Control, template, OpenerTemplate, InfoBoxOpener, TouchContext, getZIndex, Env) {
      'use strict';

      /**
       * Component that opens a popup that is positioned relative to a specified element. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/wasaby/components/openers/#_4 see more}.
       *
       * <a href="/materials/demo-ws4-infobox">Demo-example</a>.
       * @class Controls/Popup/InfoBox
       * @mixes Controls/Popup/InfoBox/InfoboxStyles
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
       * @name Controls/Popup/InfoBox#targetSide
       * @cfg {String} Side positioning of the target relative to infobox.
       * Popup displayed on the top of the target.
       * @variant top Popup displayed on the top of the target.
       * @variant bottom Popup displayed on the bottom of the target.
       * @variant left Popup displayed on the left of the target.
       * @variant right Popup displayed on the right of the target.
       * @default top
       */

      /**
       * @name Controls/Popup/InfoBox#alignment
       * @cfg {String} Alignment of the infobox relative to target
       * Popup aligned by start of the target.
       * @variant start Popup aligned by start of the target.
       * @variant center Popup aligned by center of the target.
       * @variant end Popup aligned by end of the target.
       * @default start
       */

      /**
       * @name Controls/Popup/InfoBox#hideDelay
       * @cfg {Number} Delay before closing after mouse leaves. (measured in milliseconds)
       * @default 300
       */

      /**
       * @name Controls/Popup/InfoBox#showDelay
       * @cfg {Number} Delay before opening after mouse enters.(measured in milliseconds)
       * @default 300
       */

      /**
       * @name Controls/Popup/InfoBox#content
       * @cfg {function|String} The content to which the logic of opening and closing the template is added.
       */

      /**
       * @name Controls/Popup/InfoBox#template
       * @cfg {function|String} Popup template.
       */

      /**
       * @name Controls/Popup/InfoBox#templateOptions
       * @cfg {Object} Popup template options.
       */

      /**
       * @name Controls/Popup/InfoBox#trigger
       * @cfg {String} Event name trigger the opening or closing of the template.
       * @variant click Opening by click on the content. Closing by click not on the content or template.
       * @variant hover Opening by hover on the content. Closing by hover not on the content or template.
       * Opening is ignored on touch devices.
       * @variant hoverAndTouch Opening by hover or touch on the content. Closing by hover not on the content or template.
       * @default hover
       */

      /**
       * @name Controls/Popup/InfoBox#floatCloseButton
       * @cfg {Boolean} Whether the content should wrap around the cross closure.
       * @default false
       */

      /**
       * @name Controls/Popup/InfoBox#style
       * @cfg {String} Infobox display style.
       * @variant default
       * @variant danger
       * @variant warning
       * @variant info
       * @variant secondary
       * @variant success
       */


      var _private = {
         getCfg: function(self) {
            return {
               opener: self,
               target: self._container,
               template: OpenerTemplate,
               position: self._options.position,
               targetSide: self._options.targetSide,
               alignment: self._options.alignment,
               style: self._options.style,
               floatCloseButton: self._options.floatCloseButton || self._options.float,
               eventHandlers: {
                  onResult: self._resultHandler,
                  onClose: self._closeHandler
               },
               templateOptions: {
                  template: self._options.templateName || self._options.template,
                  templateOptions: self._options.templateOptions,
               }
            };
         }
      };

      var InfoBox = Control.extend({
         _template: template,

         _isNewEnvironment: InfoBoxOpener.isNewEnvironment,

         _openId: null,

         _closeId: null,

         _beforeMount: function(options) {
            this._resultHandler = this._resultHandler.bind(this);
            this._closeHandler = this._closeHandler.bind(this);
            if (options.float) {
               Env.IoC.resolve('ILogger').warn('InfoBox', 'Используется устаревшя опция float, используйте floatCloseButton');
            }
            if (options.templateName) {
               Env.IoC.resolve('ILogger').warn('InfoBox', 'Используется устаревшая опция templateName, используйте опцию template');
            }
         },

         /**
          * TODO: https://online.sbis.ru/opendoc.html?guid=ed987a67-0d73-4cf6-a55b-306462643982
          * Кто должен закрывать инфобокс после разрушения компонента нужно будет обсудить.
          * Если компонент обрабатывающий openInfoBox и closeInfoBox, то данный код будет удален по ошибке выше.
          */
         _beforeUnmount: function() {
            if (this._opened) {
               this._close();
            }
            clearTimeout(this._openId);
         },

         _open: function() {
            var config = _private.getCfg(this);

            if (this._isNewEnvironment()) {
               this._notify('openInfoBox', [config], { bubbling: true });
            } else {

               // https://online.sbis.ru/opendoc.html?guid=24acc0ca-fb04-42b2-baca-4e90debbfefb
               this._notify('openInfoBox', [config]);

               // To place zIndex in the old environment
               config.zIndex = getZIndex(this._children.infoBoxOpener);
               this._children.infoBoxOpener.open(config);
            }

            clearTimeout(this._openId);
            clearTimeout(this._closeId);

            this._openId = null;
            this._closeId = null;
            this._opened = true;
            this._forceUpdate();
         },

         _close: function() {
            if (this._isNewEnvironment()) {
               this._notify('closeInfoBox', [], { bubbling: true });
            } else {

               // https://online.sbis.ru/opendoc.html?guid=24acc0ca-fb04-42b2-baca-4e90debbfefb
               this._notify('closeInfoBox');
               this._children.infoBoxOpener.close();
            }

            clearTimeout(this._openId);
            clearTimeout(this._closeId);

            this._openId = null;
            this._closeId = null;
            this._opened = false;
         },

         _contentMousedownHandler: function(event) {
            if (this._options.trigger !== 'demand') {
               if (!this._opened) {
                  this._open(event);
               }
               event.stopPropagation();
            }
         },

         _contentMouseenterHandler: function() {
            /**
             * On touch devices there is no real hover, although the events are triggered. Therefore, the opening is not necessary.
             */
            if (!this._context.isTouch.isTouch) {
               this._startOpeningPopup();
            }
         },

         _contentTouchStartHandler: function() {
            this._startOpeningPopup();
         },

         _startOpeningPopup: function() {
            var self = this;

            clearTimeout(this._closeId);

            this._openId = setTimeout(function() {
               self._open();
               self._forceUpdate();
            }, self._options.showDelay);
         },

         _contentMouseleaveHandler: function() {
            var self = this;

            clearTimeout(this._openId);

            this._closeId = setTimeout(function() {
               self._close();
               self._forceUpdate();
            }, self._options.hideDelay);
         },

         _mousedownHandler: function() {
            this._close();
         },


         /**
          * Open InfoBox
          * @function Controls/Popup/InfoBox#open
          * @param {PopupOptions[]} popupOptions InfoBox popup options.
          */
         open: function() {
            this._open();
         },

         /**
          * close InfoBox
          * @function Controls/Popup/InfoBox#close
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
            this._close();
         }
      });

      InfoBox.contextTypes = function() {
         return {
            isTouch: TouchContext
         };
      };

      InfoBox.getDefaultOptions = function() {
         return {
            position: 'tl',
            targetSide: 'top',
            alignment: 'start',
            style: 'default',
            showDelay: 300,
            hideDelay: 300,
            trigger: 'hover'
         };
      };
      InfoBox._private = _private;

      return InfoBox;

      /**
       * @typedef {Object} PopupOptions
       * @description Infobox configuration.
       * @property {function|String} content The content to which the logic of opening and closing the template is added.
       * @property {function|String} template Template inside popup
       * @property {Object} templateOptions Template options inside popup.
       * @property {String} trigger Event name trigger the opening or closing of the template.
       * @property {String} position Point positioning of the target relative to infobox.
       * @property {Boolean} floatCloseButton Whether the content should wrap around the cross closure.
       * @property {String} style Infobox display style.
       * @property {Number} showDelay Delay before opening.
       * @property {Number} showDelay Delay before closing.
       */
   });


