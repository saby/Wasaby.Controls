define('Controls/Input/RichEditor/Toolbar/Button/Format', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/Format/Format',
   'css!Controls/Input/RichEditor/Toolbar/Button/Format/Format'
], function(Control, template) {
   /**
    * Component Toolbar/Button/Format
    * Format button to activate/deactivate rich formats
    * @class Controls/Input/RichEditor/Toolbar/Button/Format
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   return Control.extend({
      _template: template,
      _isActive: null,

      _beforeMount: function(options) {
         this._format = options.format;
      },

      _afterMount: function() {
         this._notify('register', ['formatChanged', this, this._formatChangedHandler], { bubbling: true });
      },

      _formatChangedHandler: function(formats) {
         this._isActive = formats.getRecordById(this._format).get('state');
         this._forceUpdate();
      },

      _clickHandler: function() {
         // In tinymce blockqoute isn't format, but it work's as other formats buttons
         if (this._format !== 'blockquote') {
            if (this._isActive) {
               this._notify('removeFormat', [[this._format]], { bubbling: true });
            } else {
               this._notify('applyFormat', [[{ formatName: this._format, state: true }]], { bubbling: true });
            }
         } else {
            // TODO Change after solving the task https://online.sbis.ru/opendoc.html?guid=6fdee982-8623-402e-a9dc-0162c337e824
            this._notify('execCommand', [[{ command: 'mceBlockquote' }]], { bubbling: true });
         }
      },

      _beforeUnmount: function() {
         this._notify('unregister', ['formatChanged', this], { bubbling: true });
      }
   });
});
