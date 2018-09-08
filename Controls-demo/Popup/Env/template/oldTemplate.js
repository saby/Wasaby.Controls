/**
 * Created by as.krasilnikov on 13.04.2018.
 */
define('Controls-demo/Popup/Env/template/oldTemplate',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'wml!Controls-demo/Popup/Env/template/oldTemplate'
   ],
   function(CompoundControl, template) {
      var
         oldTemplate = CompoundControl.extend({
            _dotTplFn: template,
            init: function() {
               oldTemplate.superclass.init.apply(this, arguments);
               var btn = this.getChildControlByName('close');
               btn.subscribe('onActivated', function() {
                  this.sendCommand('close');
               });
            }
         });

      oldTemplate.dimensions = {
         minWidth: '800px',
         maxWidth: '900px',
         title: 'Редактирование записи',
         resizable: false
      };

      return oldTemplate;
   }
);
