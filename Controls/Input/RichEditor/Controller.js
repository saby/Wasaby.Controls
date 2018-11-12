define('Controls/Input/RichEditor/Controller', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Controller/Controller',
   'Controls/Input/RichEditor/Controller/FormatModel'
], function(Control, template, FormatModel) {
   /**
    * Component RichEditor/Controller
    * Controller for custom rich editors. Link toolbar with rich text area.
    * @class Controls/Input/RichEditor/Controller
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   return Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._formatModel = new FormatModel(options.additionalFormats || {});
      },

      _valueChangedHandler: function(event, value) {
         this._notify('valueChanged', [value]);
      },

      _formatChangedHandler: function(event, formats) {
         this._formatModel.updateFormats(formats);
         this._children.formatChanged.start(this._formatModel.getFormats());
      },

      _undoRedoChangedHandler: function(event, undoRedoState) {
         this._children.undoRedoChanged.start(undoRedoState);
      },

      _selectionChangedHandler: function(event, selection, currentNode) {
         this._children.selectionChanged.start(selection, currentNode);
      },

      _insertLinkHandler: function(event, link, caption) {
         this._children.insertLink.start(link, caption);
      },

      _execCommandHandler: function(event, commands) {
         this._children.execCommand.start(commands);
      },

      _applyFormatHandler: function(event, formats) {
         this._children.applyFormat.start(formats);
      },

      _removeFormatHandler: function(event, formats) {
         this._children.removeFormat.start(formats);
      },

      _insertHtmlHandler: function(event, htmlString) {
         this._children.insertHtml.start(htmlString);
      },

      _pasteHandler: function(event, content) {
         this._children.paste.start(content);
      }
   });
});
