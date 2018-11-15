define('Controls/Input/RichArea', [
   'Core/Control',
   'wml!Controls/Input/RichArea/RichArea',
   'Controls/Input/RichArea/RichAreaModel',
   'Core/helpers/domToJsonML',
   'Core/HtmlJson',
   'css!theme?Controls/Input/RichArea/RichArea'
], function(Control, template, RichModel, domToJson, HtmlJson) {
   'use strict';

   /**
    * Component RichArea
    * @class Controls/Input/RichArea
    * @extends Core/Control
    * @control
    * @public
    * @author Волоцкой В.Д.
    */

   var _private = {

      // TODO: Will be removed https://online.sbis.ru/opendoc.html?guid=7571450e-511e-4e86-897f-e392e53fea68
      updatePreviewContainer: function(self) {
         if (self._options.readOnly) {
            self._children.previewContainer.innerHTML = self._jsonToHtml(self._value);
         }
      }
   };

   var RichTextArea = Control.extend({
      _template: template,
      _htmlJson: undefined,

      _beforeMount: function(opts) {
         this._htmlJson = new HtmlJson();
         this._value = typeof opts.value === 'string' ? JSON.parse(opts.value) : opts.value;
         this._simpleViewModel = new RichModel({
            value: this._value
         });
      },

      _afterMount: function() {
         _private.updatePreviewContainer(this);
         this._notify('register', ['applyFormat', this, this.applyFormat]);
         this._notify('register', ['removeFormat', this, this.removeFormat]);
         this._notify('register', ['insertLink', this, this._insertLink]);
         this._notify('register', ['paste', this, this._paste]);
         this._notify('register', ['insertHtml', this, this.insertHtml]);
         this._notify('register', ['execCommand', this, this.execCommand]);
      },

      _beforeUnmount: function() {
         this._notify('unregister', ['applyFormat', this]);
         this._notify('unregister', ['removeFormat', this]);
         this._notify('unregister', ['insertLink', this]);
         this._notify('unregister', ['paste', this]);
         this._notify('unregister', ['insertHtml', this]);
         this._notify('unregister', ['execCommand', this]);
      },

      _beforeUpdate: function(opts) {
         if (opts.value && opts.value !== this._value) {
            this._value = typeof opts.value === 'string' ? JSON.parse(opts.value) : opts.value;
            this._simpleViewModel.updateOptions({
               value: this._value
            });
         }
      },

      _afterUpdate: function() {
         _private.updatePreviewContainer(this);
      },

      _valueChangedHandler: function(e, value) {
         var newValue = this._valueToJson(value);
         this._simpleViewModel.updateOptions({
            value: newValue
         });
         this._notify('valueChanged', [newValue]);
      },

      _valueToJson: function(newValue) {
         if (newValue[0] !== '<') {
            newValue = '<p>' + newValue + '</p>';
         }
         var span = document.createElement('span');
         span.innerHTML = newValue;
         var json = domToJson(span).slice(1);
         this._htmlJson.setJson(json);
         return json;
      },
      _jsonToHtml: function(json) {
         this._htmlJson.setJson(json);
         return this._htmlJson.render();
      },

      _undoRedoChangedHandler: function(event, state) {
         this._notify('undoRedoChanged', [state]);
      },

      _formatChangedHandler: function(event, formats) {
         this._notify('formatChanged', [formats]);
      },

      /**
       * Function exec list of commands to editor
       * @param commands
       */
      execCommand: function(commands) {
         if (!this._options.readOnly) {
            commands.forEach(function(command) {
               this._children.editor.execCommand(command.command, command.ui, command.properties);
            }, this);
         }
      },

      /**
       * Function apply list of formats to selected text
       * @param formats
       */
      applyFormat: function(formats) {
         if (!this._options.readOnly) {
            formats.forEach(function(format) {
               this._children.editor.applyFormat(format.formatName, format.state);
            }, this);
         }
      },

      /**
       * Function remove list of formats from selected text
       * @param formats
       */
      removeFormat: function(formats) {
         if (!this._options.readOnly) {
            formats.forEach(function(format) {
               this._children.editor.removeFormat(format);
            }, this);
         }
      },

      /**
       * Function insert html-string into current cursor position
       * @param htmlString
       */
      insertHtml: function(htmlString) {
         if (!this._options.readOnly) {
            this._children.editor.insertHtml(htmlString);
         }
      },

      /**
       * Function insert link into current cursor position
       * @param link
       * @param name
       * @private
       */
      _insertLink: function(link, name) {
         if (!this._options.readOnly) {
            this._children.editor._insertLink(link, name);
         }
      },

      /**
       * Function paste content into current cursos position
       * @param content
       * @private
       */
      _paste: function(content) {
         this._children.editor._paste(content);
      },

      _selectionChangedHandler: function(event, selection, node) {
         this._notify('selectionChanged', [selection, node]);
      }
   });
   return RichTextArea;
});
