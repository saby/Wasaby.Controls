define('Controls/Input/RichArea/resources/TinyMCE', [
   'Core/Control',
   'wml!Controls/Input/RichArea/resources/TinyMCE/TinyMCE',
   'Controls/Input/RichArea/plugins/constants',
   'Controls/Input/RichArea/plugins/content',
   'Controls/Input/RichArea/plugins/config',
   'Controls/Input/RichArea/plugins/text',
   'Controls/Input/RichArea/plugins/placeholder',
   'Controls/Input/RichArea/plugins/handlers',
   'Controls/Input/RichArea/plugins/events',
   'Core/moduleStubs',
   'Core/core-clone',

   'css!theme?WS/css/styles/RichContentStyles',
   'i18n!SBIS3.CONTROLS/RichEditor',
   'css!theme?Controls/Input/RichArea/resources/TinyMCE/TinyMCE'
], function(Control, template, constantsPlugin, contentPlugin, configPlugin, textPlugin, placeholderPlugin, handlersPlugin, eventsPlugin, moduleStubs, cClone) {
   var _private = {
      tinyInit: function(self) {
         self._editorConfig.target = self._children.mceContainer;
         self._editorConfig.setup = self._setupTinyMCECallback.bind(self);
         tinyMCE.init(self._editorConfig);
      }
   };

   var TinyMce = Control.extend({
      _template: template,

      _value: '',

      _placeHolderActive: false,

      _editorConfig: null,

      _clipboardText: '',

      _beforeMount: function(options) {
         this._value = contentPlugin.prepareContent(options.value);
         this._placeHolderActive = placeholderPlugin.isPlaceholderActive(this._value);
         this._editorConfig = cClone(configPlugin.editorConfig);

         // Save context for callbacks
         handlersPlugin.saveContext(this);

         this._sanitizeClasses = textPlugin.sanitizeClasses.bind(this);

         return moduleStubs.require([constantsPlugin.EDITOR_MODULE]);
      },

      _afterMount: function() {
         this._children.mceContainer.innerHTML = this._value;
         _private.tinyInit(this);
      },

      _beforeUpdate: function() {
         this._placeHolderActive = placeholderPlugin.isPlaceholderActive(this._value);
      },

      _beforeUnmount: function() {
         this._editorConfig = null;
         eventsPlugin.offEvents(this);
         this._editor = null;
      },

      getDefaultOptions: function() {
         return {
            placeholder: '',
            value: '',
            sourceMode: false
         };
      },

      _setupTinyMCECallback: function(editor) {
         this._editor = editor;
         eventsPlugin.bindEvents(this);
      }
   });

   return TinyMce;
});
