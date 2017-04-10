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

      var Button = extend.extend(
         {
            _controlName: 'SBIS3.CONTROLS.Button',
            _template: template,

            __conatiner: null,
            get _container() {
               return this.__conatiner;
            },
            set _container(val) {
               if (this.__conatiner && !this.__conatiner.startTag && typeof(this.__conatiner.unbind) === 'function')
                  this.__conatiner.unbind();

               this.__conatiner = val;

               try{
                  this.__conatiner[0].wsControl = this;
               }catch (e){}

               this._initInnerAction();
            },

            constructor: function(cfg) {

               this._options = cfg;

               this.deprecatedContr.call(this, cfg);

               this._thisIsInstance = true;

               this._publish('onActivated');
            }

         });

      Object.assign(Button.prototype, Compatible);
      return Button;
   });