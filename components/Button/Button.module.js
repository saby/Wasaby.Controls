define('js!SBIS3.CONTROLS.Button',
   [
      'Core/core-extend',
      'js!SBIS3.CONTROLS.Button/Button.compatible',
      'tmpl!SBIS3.CONTROLS.Button',
      'css!SBIS3.CONTROLS.Button',
      'css!WS.Controls.Button/resources/ButtonCommonStyles'
   ],

   function (extend,
             Compatible,
             template) {

      'use strict';

      var Button = extend.extend([Compatible],
         {
            _controlName: 'SBIS3.CONTROLS.Button',
            _template: template,

            _useNativeAsMain: true,

            constructor: function(cfg) {

               this._options = cfg;

               this.deprecatedContr(cfg);

               this._thisIsInstance = true;

               this._publish('onActivated');
            },

            _onClick: function(){
               this._notify("onActivated");
            }

         });

      return Button;
   });