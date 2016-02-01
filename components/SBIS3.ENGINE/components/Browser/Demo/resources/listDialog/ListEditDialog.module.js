define('js!SBIS3.Demo.ListEditDialog',
   ['js!SBIS3.CONTROLS.FormController', 
   'html!SBIS3.Demo.ListEditDialog',
   'js!SBIS3.Engine.Demo.MyBrowser/resources/ExampleSource',
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.CheckBox',
   'css!SBIS3.Demo.ListEditDialog'], function(FormController, dotTplFn, ExampleSource) {
   /**
    * SBIS3.Demo.MyDialog
    * @class SBIS3.Demo.MyDialog
    * @extends $ws.proto.CompoundControl
    */
   var moduleClass = FormController.extend(/** @lends SBIS3.Demo.MyDialog.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         this.setDataSource(ExampleSource);
         
         this.getChildControlByName('submit').subscribe('onActivated', function(eventObject) {
            this.sendCommand('submit');
         });
         
      }
   });
   
   moduleClass.dimensions = {
      width: '530px',
      height: '100px',
      title: 'Лист',
      resizeale: false
   };

   return moduleClass;
});