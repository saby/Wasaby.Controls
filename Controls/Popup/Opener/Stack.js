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
       * @extends Controls/Popup/Opener/BaseOpener
       * @mixes Controls/interface/IDialogOptions
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
