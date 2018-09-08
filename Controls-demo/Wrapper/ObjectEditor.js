define('Controls-demo/Wrapper/ObjectEditor',
   [
      'Core/Control',
      'wml!Controls-demo/Wrapper/ObjectEditor'

   ],
   function(Control, template) {


      var ObjectEditor = Control.extend({

         _template: template,
         _objectValueChanged: function(ev, name, value) {
            this._options.value[name] = value;
         }

      });

      return ObjectEditor;

   });
