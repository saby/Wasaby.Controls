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
          * @param {Object} popupOptions Stack popup options.
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
