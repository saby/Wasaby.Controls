define('js!SBIS3.CONTROLS.Button',
   [
      'Core/core-extend',
      "Core/Abstract.compatible",
      'js!SBIS3.CORE.Control/Control.compatible',
      "js!SBIS3.CORE.AreaAbstract/AreaAbstract.compatible",
      'js!SBIS3.CORE.BaseCompatible',
      'js!SBIS3.CONTROLS.Button/Button.compatible',
      'js!WS.Data/Entity/InstantiableMixin',
      'tmpl!SBIS3.CONTROLS.Button',
      'Core/core-functions',
      'css!SBIS3.CONTROLS.Button'
   ],

   function (extend,
             AbstractCompatible,
             ControlCompatible,
             AreaAbstractCompatible,
             BaseCompatible,
             ButtonCompatible,
             InstantiableMixin,
             template,
             functions) {

      'use strict';

      var Button = extend.extend([AbstractCompatible, ControlCompatible, AreaAbstractCompatible, BaseCompatible, ButtonCompatible, InstantiableMixin],
         {
            _controlName: 'SBIS3.CONTROLS.Button',
            _template: template,

            _useNativeAsMain: true,

            constructor: function(cfg) {
               this.deprecatedContr(cfg);
               this._publish('onActivated');
            },

            _onClick: function(){
               this._notify("onActivated");
            }

         });

      return Button;
   });