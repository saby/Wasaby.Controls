define('Controls-demo/Input/Mask/Mask',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Mask/Mask',
      'Controls/Input/resources/MaskHelper',
      'Controls/Input/Mask',
      'css!Controls-demo/Input/Mask/Mask'
   ],
   function(Control, template, MaskHelper) {

      'use strict';

      var Mask = Control.extend({
         _template: template,

         _values: {
            example1: '  .  ',

            example2: '  .  .  ',

            example3: '+7',

            example4: '',

            example5: ''
         },

         _exampleDebug: 'example5',

         _debug: true,

         _stringify: JSON.stringify,

         _getClearData: function() {

         },

         _afterMount: function() {
            this._getClearData = MaskHelper.getClearData;
            this._forceUpdate();
         },

         _toggleDebug: function() {
            this._debug = !this._debug;
         }
      });

      return Mask;
   }
);