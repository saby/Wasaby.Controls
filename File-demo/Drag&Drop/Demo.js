/**
 * 
 */
define('File-demo/Drag&Drop/Demo',   [
      'Core/Control',
      'tmpl!File-demo/Drag&Drop/template',
      
      'css!File-demo/Drag&Drop/style',
   ],  function(Control, template, ) {
   'use strict';

   var module = Control.extend({
      _template: template
   });
   return module;
});
