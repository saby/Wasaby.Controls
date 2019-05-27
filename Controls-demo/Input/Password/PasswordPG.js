define('Controls-demo/Input/Password/PasswordPG',
   [
      'Core/core-merge',
      'Controls-demo/Input/Base/Base',
      'json!Controls-demo/Input/Password/Password'
   ],

   function(cMerge, Base, config) {
      'use strict';

      var _private = {
         CONTENT: 'Controls/input:Password'
      };

      var PasswordPG = Base.extend({
         _content: _private.CONTENT,

         _beforeMount: function() {
            PasswordPG.superclass._beforeMount.apply(this, arguments);

            this._componentOptions.revealable = true;
            this._componentOptions.name = 'InputPassword';

            this._metaData = cMerge(this._metaData, config[_private.CONTENT].properties['ws-config'].options);
         }
      });
      return PasswordPG;
   });
