define('Controls/EngineBrowser', [
   'Core/Control',
   'tmpl!Controls/EngineBrowser/EngineBrowser',
   'css!Controls/EngineBrowser/EngineBrowser'
], function(BaseControl, template) {

   'use strict';

   var Browser = BaseControl.extend({
      _template: template,
      _compress: 'default',

      onResize: function(event, width) {
         if (width.fastFilter !== undefined) {
            this._widthFastFilter = width.fastFilter;
         }
         if (width.filterButton !== undefined) {
            this._widthFilterButton = width.filterButton;
         }
         if (this._widthFilterButton >=  this._children.filterWrapper.offsetWidth / 2) {
            if (this._widthFastFilter <= this._children.filterWrapper.offsetWidth * (2 / 3)) {
               this._compress = 'autoFast';
            } else if (this._widthFastFilter > this._children.filterWrapper.offsetWidth * (2 / 3)) {
               this._compress = 'maxFast';
            } else {
               this._compress = 'default';
            }
         } else {
            this._compress = 'default';
         }
      }
   });

   return Browser;
});
