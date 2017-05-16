define('js!SBIS3.CONTROLS.Label',
   [
      'js!WSControls/Buttons/Button',
      'tmpl!SBIS3.CONTROLS.Label',
      'css!SBIS3.CONTROLS.Label'
   ],
   function(Button, ContentTemplate) {

      'use strict';

      /**
       * Метка.
       * @class SBIS3.CONTROLS.Label
       * @extends WSControls/Buttons/Button
       * @demo SBIS3.CONTROLS.Demo.MyLabel
       * @author Крайнов Дмитрий Олегович
       *
       * @control
       * @public
       * @category Buttons
       *  
       * @example
       * <ws:SBIS3.CONTROLS.Label
       *    caption="Метка"
       *    owner="TextBox"               
       * />
       */
      var Label = Button.extend(/** @lends SBIS3.CONTROLS.Label.prototype */{
         $protected: {
            _options: {
               contentTemplate: ContentTemplate
            }
         },

         _onClickHandler: function(event) {
            var owner;
            Label.superclass._onClickHandler.call(this, event);

            if (this.isEnabled() && /js-controls-Button__text/.test(event.target.className) && (owner = this.getOwner())) {
               owner.setActive(true);
            }
         },

         _modifyOptions: function(options) {
            Label.superclass._modifyOptions.call(this, options);
            options.className += ' controls-Label';
            return options;
         }
      });

      return Label;
   }
);