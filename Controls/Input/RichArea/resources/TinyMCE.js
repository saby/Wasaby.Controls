define('Controls/Input/RichArea/resources/TinyMCE', [
   'Core/Control',
   'wml!Controls/Input/RichArea/resources/TinyMCE/TinyMCE',
   'Controls/Input/RichArea/helpers/constants',
   'Controls/Input/RichArea/helpers/config',
   'Controls/Input/RichArea/helpers/text',
   'Controls/Input/RichArea/helpers/placeholder',
   'Controls/Input/RichArea/helpers/handlers',
   'Controls/Input/RichArea/helpers/events',
   'Controls/Input/RichArea/helpers/editor',
   'Controls/Input/RichArea/helpers/paste',
   'Controls/Input/RichArea/helpers/format',
   'Core/moduleStubs',
   'Core/core-clone',

   'css!WS/css/styles/RichContentStyles',
   'i18n!SBIS3.CONTROLS/RichEditor',
   'css!theme?Controls/Input/RichArea/resources/TinyMCE/TinyMCE'
], function(Control,
   template,
   constantsHelper,
   configHelper,
   textHelper,
   placeholderHelper,
   handlersHelper,
   eventsHelper,
   editorHelper,
   pasteHelper,
   formatHelper,
   moduleStubs,
   cClone) {
   /**
    * Component TinyMCE
    * Private component which works with tinyMCE library.
    * @class Controls/Input/RichTextArea
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var _private = {

      /**
       * Function init tinymce instance
       * @param self
       */
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
         this._value = options.value;
         this._editorConfig = cClone(configHelper.editorConfig);

         formatHelper.initFormats(this, options.additionalFormats || {});

         // Save context for callbacks
         handlersHelper.saveContext(this);

         this._sanitizeClasses = textHelper.sanitizeClasses.bind(this);

         return moduleStubs.require([constantsHelper.EDITOR_MODULE]);
      },

      _afterMount: function() {
         this._children.mceContainer.innerHTML = this._value;

         _private.tinyInit(this);

         this._placeHolderActive = placeholderHelper.isPlaceholderActive(editorHelper.getEditorValue(this));
      },

      _beforeUpdate: function() {
         this._placeHolderActive = placeholderHelper.isPlaceholderActive(this._value);
      },

      _beforeUnmount: function() {
         this._editorConfig = null;
         eventsHelper.offEvents(this);
         this._editor = null;
      },

      /**
       * Function exec command to editor
       * @param command
       * @param userInterface
       * @param properties
       */
      execCommand: function(command, userInterface, properties) {
         editorHelper.execCommand(this, command, userInterface, properties);
      },

      /**
       * Function apply format to selected text
       * @param formatName
       * @param state
       */
      applyFormat: function(formatName, state) {
         editorHelper.applyFormat(this, formatName, state);
      },

      /**
       * Function remove format from selected text
       * @param formatName
       */
      removeFormat: function(formatName) {
         editorHelper.removeFormat(this, formatName);
      },

      getDefaultOptions: function() {
         return {
            placeholder: '',
            value: '',
            sourceMode: false
         };
      },

      _insertLink: function(link, name) {
         editorHelper.insertLink(this, link, name);
      },

      _paste: function(content) {
         pasteHelper.paste(this, content);
      },

      _setupTinyMCECallback: function(editor) {
         this._editor = editor;

         eventsHelper.bindEvents(this);
      }
   });

   return TinyMce;
});
