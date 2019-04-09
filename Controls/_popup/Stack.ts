import BaseOpener = require('Controls/Popup/Opener/BaseOpener');
      /**
       * Component that opens the popup to the right of content area at the full height of the screen. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/wasaby/components/openers/#_2 See more}.
       *
       *  <a href="/materials/demo-ws4-stack-dialog">Demo-example</a>.
       * @class Controls/Popup/Opener/Stack
       * @extends Controls/Popup/Opener/BaseOpener
       * @control
       * @author Красильников А.С.
       * @category Popup
       * @mixes Controls/Popup/Opener/Stack/StackStyles
       * @mixes Controls/interface/IOpener
       * @demo Controls-demo/Popup/Opener/StackPG
       * @public
       *
       */

      var _private = {
         getStackConfig: function(config) {
            config = config || {};

            // The stack is isDefaultOpener by default. For more information, see  {@link Controls/interface/ICanBeDefaultOpener}
            config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
            return config;
         }
      };

      var Stack = BaseOpener.extend({

         /**
          * Open stack popup.
          * @function Controls/Popup/Opener/Stack#open
          * @returns {Undefined}
          * @param {PopupOptions[]} popupOptions Stack popup options.
          * @example
          * Open stack with specified configuration.
          * wml
          * <pre>
          *     <Controls.Popup.Opener.Stack name="stack" template="Controls-demo/Popup/TestStack" modal="{{true}}">
          *             <ws:templateOptions key="111"/>
          *     </Controls.Popup.Opener.Stack>
          *
          *     <Controls.Button name="openStackButton" caption="open stack" on:click="_openStack()"/>
          *     <Controls.Button name="closeStackButton" caption="close stack" on:click="_closeStack()"/>
          * </pre>
          * js
          * <pre>
          *     Control.extend({
          *        ...
          *
          *        _openStack() {
          *            var popupOptions = {
          *                autofocus: true
          *            }
          *            this._children.stack.open(popupOptions)
          *        }
          *
          *        _closeStack() {
          *            this._children.stack.close()
          *        }
          *        ...
          *     });
          * </pre>
          * @see close
          */
         open: function(config) {
            config = _private.getStackConfig(config);
            this._setCompatibleConfig(config);
            return BaseOpener.prototype.open.call(this, config, 'Controls/Popup/Opener/Stack/StackController');
         },

         _setCompatibleConfig: function(config) {
            config._type = 'stack'; // for compoundArea
         }
      });

      Stack._private = _private;

      export = Stack;

      /**
       * @typedef {Object} PopupOptions
       * @description Stack popup options.
       * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
       * @property {Boolean} modal Determines whether the window is modal.
       * @property {String} className Class names of popup.
       * @property {Boolean} closeOnOutsideClick Determines whether possibility of closing the popup when clicking past.
       * @property {function|String} template Template inside popup.
       * @property {function|String} templateOptions Template options inside popup.
       * @property {Number} minWidth The minimum width of popup.
       * @property {Number} maxWidth The maximum width of popup.
       * @property {Number} width Width of popup.

       */

   


/**
 * @name Controls/Popup/Opener/Stack#close
 * @description Close Stack Popup.
 * @returns {Undefined}
 * @example
 * wml
 * <pre>
 *     <Controls.Popup.Opener.Stack name="stack" template="Controls-demo/Popup/TestStack" modal="{{true}}">
 *             <ws:templateOptions key="111"/>
 *     </Controls.Popup.Opener.Stack>
 *
 *     <Controls.Button name="openStackButton" caption="open stack" on:click="_openStack()"/>
 *     <Controls.Button name="closeStackButton" caption="close stack" on:click="_closeStack()"/>
 * </pre>
 * js
 * <pre>
 *     Control.extend({
 *        ...
 *
 *        _openStack() {
 *           var popupOptions = {
 *               autofocus: true
 *           }
 *           this._children.stack.open(popupOptions)
 *        }
 *
 *        _closeStack() {
 *           this._children.stack.close()
 *        }
 *        ...
 *    });
 * </pre>
 * @see open
 */

/**
 * @name Controls/Popup/Opener/Stack#minWidth
 * @cfg {Number} The minimum width of popup.
 */

/**
 * @name Controls/Popup/Opener/Stack#maxWidth
 * @cfg {Number} The maximum width of popup.
 */

/**
 * @name Controls/Popup/Opener/Stack#width
 * @cfg {Number} Width of popup.
 */
