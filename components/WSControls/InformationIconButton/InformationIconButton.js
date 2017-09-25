define('js!WSControls/InformationIconButton/InformationIconButton',
   [
      'Core/Control',
      'tmpl!WSControls/InformationIconButton/InformationIconButton',
      'css!WSControls/InformationIconButton/InformationIconButton'
   ],
   function(Control, template) {

      'use strict';

      var InformationIconButton = Control.extend({
         _controlName: 'WSControls/InformationIconButton/InformationIconButton',

         _template: template,

         _beforeMount: function(options) {
            var component = options.component;
            component._publish('onInformationIconMouseEnter', 'onInformationIconActivated');
            this._mouseenterInformationIconHandler = this._mouseenterInformationIconHandler.bind(component);
            this._activatedInformationIconHandler = this._activatedInformationIconHandler.bind(component);
         },

         _mouseenterInformationIconHandler: function() {
            this._notify('onInformationIconMouseEnter');
         },

         _activatedInformationIconHandler: function() {
            this._notify('onInformationIconActivated');
         }
      });

      return InformationIconButton;
   }
);