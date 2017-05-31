define('js!SBIS3.CONTROLS.Label',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.Clickable',
      'Core/Sanitize',
      'tmpl!SBIS3.CONTROLS.Label',
      'css!SBIS3.CONTROLS.Label'
   ],
   function(CompoundControl, Clickable, Sanitize, template) {

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
      var Label = CompoundControl.extend([Clickable], /** @lends SBIS3.CONTROLS.Label.prototype */{
         _dotTplFn: template,

         $protected: {
            _options: {
               caption: null
            },
            _caption: null
         },

         init: function() {
            Label.superclass.init.call(this);

            this._caption = this.getContainer().find('.js-controls-Label__text');
         },

         getCaption: function() {
            return this._getOption('caption');
         },

         setCaption: function(caption) {
            this._setOption('caption', caption);
            this._caption.html(Sanitize(caption));
         },

         _onClickHandler: function(event) {
            var owner;
            Label.superclass._onClickHandler.call(this, event);

            if (this.isEnabled() && /js-controls-Label__text/.test(event.target.className) && (owner = this.getOwner())) {
               owner.setActive(true);
            }
         }
      });

      return Label;
   }
);