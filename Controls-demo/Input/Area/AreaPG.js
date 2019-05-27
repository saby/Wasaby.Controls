define('Controls-demo/Input/Area/AreaPG',
   [
      'Core/core-merge',
      'Controls-demo/Input/Text/TextPG',
      'json!Controls-demo/Input/Area/Area',

      'css!Controls-demo/Input/Area/AreaPG'
   ],

   function(cMerge, Base, config) {
      'use strict';

      var _private = {
         CONTENT: 'Controls/input:Area'
      };

      var AreaPG = Base.extend({
         _content: _private.CONTENT,

         _beforeMount: function() {
            AreaPG.superclass._beforeMount.apply(this, arguments);

            this._dataObject.newLineKey = {
               placeholder: 'select',
               keyProperty: 'id',
               displayProperty: 'title'
            };

            this._componentOptions.name = 'InputArea';
            this._componentOptions.minLines = 3;
            this._componentOptions.maxLines = 6;

            this._metaData = cMerge(this._metaData, config[_private.CONTENT].properties['ws-config'].options);
         }
      });
      return AreaPG;
   });
