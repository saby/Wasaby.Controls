/**
 * Created by kraynovdo on 26.04.2018.
 */
define('Controls-demo/Container/Enum',
   [
      'Core/Control',
      'tmpl!Controls-demo/Container/Enum',
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
               index: 0
            });
         }

      });

      return EnumCont;
   });
