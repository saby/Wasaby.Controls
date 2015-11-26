define('js!SBIS3.CONTROLS.Demo.MyMenuButton',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLS.Demo.MyMenuButton', 'js!SBIS3.CONTROLS.Data.Source.Memory',
     'css!SBIS3.CONTROLS.Demo.MyMenuButton',
     'js!SBIS3.CONTROLS.MenuButton',
     'js!SBIS3.CONTROLS.MenuLink',
      'js!SBIS3.CONTROLS.Button'],
    function(CompoundControl, dotTplFn, StaticSource) {
   /**
    * SBIS3.CONTROLS.Demo.MyMenuButton
    * @class SBIS3.CONTROLS.Demo.MyMenuButton
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyMenuButton.prototype */{
      _dotTplFn: dotTplFn,
      _myMenu: null,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         this._myMenu = this.getChildControlByName('MenuButton');
         var self = this;
         this.getChildControlByName('setData').subscribe('onActivated', function(){
            var ds = new StaticSource({
               data: [{
                  'id' : 1,
                  'title' : 'Первый'
               },
               {
                  'id' : 2,
                  'title' : 'Второй'
               },
               {
                  'id': 3,
                  'title' : 'Третий'

               }],
               keyField : 'id'
            });
            self._myMenu.setDataSource(ds);
         });
      }
   });
   return moduleClass;
});