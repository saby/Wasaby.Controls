define('File-demo/ResourceGetter/DropArea', [
   'Core/Control',
   'tmpl!File-demo/ResourceGetter/template',
   'File/ResourceGetter/DropArea',

   'css!File-demo/ResourceGetter/style',
   'Controls/Button',
   'Controls/Input/Text'
], function (Control, template, DropArea) {
   'use strict';

   var module = Control.extend({
      _template: template,
      _dragText: 'dragText',
      _dropText: 'dropText',
      _dragSubtitle: 'dragSubtitle',
      _dropSubtitle: 'dropSubtitle',
      _itemsList: ['Picture.jpg', 'Code.js'],
      _afterMount: function () {
         this.applyOptions();
      },
      applyOptions: function () {
         if (this.getter) {
            this.getter.destroy();
         }
         this.getter = new DropArea({
            element: document.getElementById('basket'),
            extensions: this._extensions ? this._extensions.split(', ') : [],
            dragText: this._dragText,
            dropText: this._dropText,
            dragSubtitle: this._dragSubtitle,
            dropSubtitle: this._dropSubtitle,
            maxSize: this._maxFileSize || 0,
            ondrop: this.onDrop.bind(this)
         });
      },
      onDrop: function (files) {
         files.forEach(function (file) {
            this._itemsList.push((file instanceof Error) ? file.fileName + ': ' + file.message + '. ' + file.details : file.getName());
         }, this);
         this._forceUpdate();
      }
   });
   return module;
});