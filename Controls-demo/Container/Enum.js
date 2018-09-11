/**
 * Created by kraynovdo on 26.04.2018.
 */
define('Controls-demo/Container/Enum',
   [
      'Core/Control',
      'wml!Controls-demo/Container/Enum',
      'WS.Data/Type/Enum'
   ],

   function(Control, template, Enum) {


      var EnumCont = Control.extend({

         _template: template,
         _enumInst: null,

         constructor: function() {
            EnumCont.superclass.constructor.apply(this, arguments);
            this._enumInst = new Enum({
               dictionary: ['Первый', 'Второй', 'Третий'],
               index: 1
            });
         },
         _changeIndex: function() {
            this._enumInst.set(2);
         }

      });

      return EnumCont;
   });
