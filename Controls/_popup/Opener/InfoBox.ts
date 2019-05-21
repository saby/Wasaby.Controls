import cClone = require('Core/core-clone');
import Env = require('Env/Env');
import Base = require('Controls/_popup/Opener/BaseOpener');
import getZIndex = require('Controls/Utils/getZIndex');


      /**
       * Component that opens a popup that is positioned relative to a specified element. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/infobox/ see more}.
       * @remark
       * Private control. This control uses Popup/Infobox and Application to open popup on openInfobox events
       * @class Controls/_popup/Opener/InfoBox
       * @extends Core/Control
       * @mixes Controls/interface/IInfoboxOptions
       *
       * @private
       * @control
       * @category Popup
       * @author Красильников А.С.
       * @private
       */

      /**
       * @typedef {Object} Config
       * @description Infobox configuration.
       * @property {String|Function} template Template inside popup
       * @property {Object} templateOptions Template options inside popup.
       * @property {domNode} target The target relative to which the popup is positioned.
       * @property {String} position Point positioning of the target relative to infobox.
       * @property {String} message The text in the body popup.
       * @property {Boolean} floatCloseButton Whether the content should wrap around the cross closure.
       * @property {String} style Infobox display style.
       * @property {Number} showDelay Delay before opening.
       */


      /**
       * @name Controls/interface/IInfoboxOptions#config
       * @cfg {Config[]} Infobox options.
       */

      var INFOBOX_HIDE_DELAY = 300;
      var INFOBOX_SHOW_DELAY = 300;

      // Default popup configuration
      var DEFAULT_CONFIG = {
         style: 'default',
         position: 'tl',
         targetSide: 'top',
         alignment: 'start',
         floatCloseButton: false,
         hideDelay: INFOBOX_HIDE_DELAY,
         showDelay: INFOBOX_SHOW_DELAY
      };

      var _private = {
         prepareDisplayStyle: function(color) {
            var resColor = color;
            if (color === 'lite') {
               resColor = 'secondary';
            }
            if (color === 'error') {
               resColor = 'danger';
            }
            if (color === 'help') {
               resColor = 'warning';
            }
            return resColor;
         },
         preparePosition: function(targetSide, alignment) {
            var position = targetSide[0];
            var leftRight = {
               'start': 't',
               'center': 'c',
               'end': 'b'
            };
            var topBottom = {
               'start': 'l',
               'center': 'c',
               'end': 'r'
            };
            if (targetSide === 'left' || targetSide === 'right') {
               position += leftRight[alignment];
            } else {
               position += topBottom[alignment];
            }
            return position;
         },

      };

      var InfoBox = Base.extend({
         _openId: null,
         _closeId: null,
         _style: null,

         /**
          * @name Controls/_popup/Opener/Infobox#isOpened
          * @function
          * @description Popup opened status.
          */

         /**
          * Open popup.
          * @function Controls/_popup/Opener/InfoBox#open
          * @param {Object} Config
          * @returns {undefined}
          * @example
          * js
          * <pre>
          *   Control.extend({
          *      ...
          *
          *      _openInfobox() {
          *          var config= {
          *              message: 'My tooltip'
          *              target: this._children.buttonTarget //dom node
          *          }
          *          this._notify('openInfoBox', [config], {bubbling: true});
          *      }
          *
          *      _closeInfobox() {
          *          this._notify('closeInfoBox', [], {bubbling: true});
          *      }
          *   });
          * </pre>
          */
         _beforeMount: function(options) {
            InfoBox.superclass._beforeMount.apply(this, arguments);
            if (options.float) {
               Env.IoC.resolve('ILogger').error('InfoBox', 'Используется устаревшая опция float, используйте floatCloseButton');
            }
         },

         _beforeUnmount: function() {
            this.close(0);
         },

         open: function(cfg) {
            // Only one popup can be opened
            if (this.isOpened()) {
               this.close(0);
            }
            this._clearTimeout();

            // smart merge of two objects. Standart "core-merge util" will rewrite field value of first object even if value of second object will be undefined
            var newCfg = cClone(DEFAULT_CONFIG);
            for (var i in cfg) {
               if (cfg.hasOwnProperty(i)) {
                  if (cfg[i] !== undefined) {
                     newCfg[i] = cfg[i];
                  }
               }
            }
            if (cfg.float) {
               newCfg.floatCloseButton = cfg.float;
            }
            if (cfg.style === 'error') {
               Env.IoC.resolve('ILogger').error('InfoBox', 'Используется устаревшее значение опции style error, используйте danger');
            }
            if (cfg.position) {
               Env.IoC.resolve('ILogger').error('InfoBox', 'Используется устаревшая опция position, используйте опции targetSide, alignment ');
            }
            newCfg.style = _private.prepareDisplayStyle(cfg.style);

            if (cfg.targetSide || cfg.alignment) {
               newCfg.position = _private.preparePosition(cfg.targetSide, cfg.alignment);
            }

            if (newCfg.showDelay > 0) {
               this._openId = setTimeout(this._open.bind(this, newCfg), newCfg.showDelay);
            } else {
               this._open(newCfg);
            }
         },
         _open: function(cfg) {
            InfoBox.superclass.open.call(this, {
               target: cfg.target,
               position: cfg.position,
               autofocus: false,
               maxWidth: cfg.maxWidth,
               zIndex: cfg.zIndex || getZIndex(this),
               eventHandlers: cfg.eventHandlers,
               closeOnOutsideClick: true,
               opener: cfg.opener,
               templateOptions: { // for template: Opener/InfoBox/resources/template
                  template: cfg.template,
                  templateOptions: cfg.templateOptions, // for user template: cfg.template
                  message: cfg.message,
                  styleType: cfg.styleType || 'marker',
                  style: cfg.style || 'default',
                  floatCloseButton: cfg.floatCloseButton
               },
               template: 'Controls/popupTemplate:templateInfoBox'
            }, 'Controls/popupTemplate:InfoBoxController');
         },

         /**
          * Close popup.
          * @function Controls/_popup/Opener/InfoBox#close
          */
         close: function(delay) {
            delay = delay === undefined ? INFOBOX_HIDE_DELAY : delay;
            this._clearTimeout();
            if (delay > 0) {
               this._closeId = setTimeout(InfoBox.superclass.close.bind(this), delay);
            } else {
               InfoBox.superclass.close.call(this);
            }
         },

         _closeOnTargetScroll: function() {
            this.close(0);
         },

         _clearTimeout: function() {
            clearTimeout(this._openId);
            clearTimeout(this._closeId);
         }
      });

      InfoBox.getDefaultOptions = function() {
         var options = Base.getDefaultOptions();

         options.closeOnTargetScroll = true;
         options._vdomOnOldPage = true; // Open vdom popup in the old environment
         return options;
      };

      export = InfoBox;

