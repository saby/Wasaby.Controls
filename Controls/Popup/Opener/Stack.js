define('Controls/Popup/Opener/Stack',
   [
      'Controls/Popup/Opener/BaseOpener'
   ],
   function(BaseOpener) {

      /**
       * Component that opens the popup to the right of content area at the full height of the screen. {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/wasaby/components/openers/#_2 See more}.
       *
       * @class Controls/Popup/Opener/Stack
       * @control
       * @public
       * @author Красильников А.С.
       * @category Popup
       * @mixes Controls/interface/IStackOptions
       * @mixes Controls/Popup/Opener/Stack/StackStyles
       */

      var _private = {
         getStackConfig: function(config) {
            config = config || {};

            //The stack is isDefaultOpener by default. For more information, see  {@link Controls/interface/ICanBeDefaultOpener}
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
          * @remark {@link https://wi.sbis.ru/docs/js/Controls/interface/IStackOptions#popupOptions popupOptions}
          * @example
          * Open stack with specified configuration.
          * wml
          * <pre>
          *     <Controls.Popup.Opener.Stack name="stack">
          *         <ws:popupOptions template="Controls-demo/Popup/TestStack" isModal="{{true}}">
          *             <ws:templateOptions key="111"/>
          *         </ws:popupOptions>
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

      return Stack;
   });

/**
 * @name Controls/Popup/Opener/Stack#closePopupBeforeUnmount
 * @cfg {Boolean} Determines whether to close the popup when the component is destroyed.
 */

/**
 * @name Controls/Popup/Opener/Stack#close
 * @description Close Stack Popup.
 * @returns {Undefined}
 * @example
 * wml
 * <pre>
 *     <Controls.Popup.Opener.Stack name="stack">
 *         <ws:popupOptions template="Controls-demo/Popup/TestStack" isModal="{{true}}">
 *             <ws:templateOptions key="111"/>
 *         </ws:popupOptions>
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
 * @name Controls/Popup/Opener/Stack#isOpened
 * @description Popup opened status.
 * @function
 */

/**
 * @typedef {Object} PopupOptions
 * @description Stack popup options.
 * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
 * @property {Boolean} isModal Determines whether the window is modal.
 * @property {String} className Class names of popup.
 * @property {Boolean} closeByExternalClick Determines whether possibility of closing the popup when clicking past.
 * @property {Object} opener Control, which is the logical initiator of popup opening.
 * @property {String|Template} template Template inside popup.
 * @property {String|Template} templateOptions Template options inside popup.
 * @property {Object} eventHandlers Callback functions on popup events.
 * @property {Integer} minWidth The minimum width of popup.
 * @property {Integer} maxWidth The maximum width of popup.
 * @property {Integer} minimizedWidth The width of the panel in a minimized state.
 * @property {Boolean} maximize Determines whether the control is displayed in full screen.
 */
