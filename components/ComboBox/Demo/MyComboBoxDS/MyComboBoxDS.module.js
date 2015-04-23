define('js!SBIS3.Demo.Control.MyComboBoxDS', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyComboBoxDS', 'js!SBIS3.CONTROLS.ArrayStrategy', 'js!SBIS3.CONTROLS.StaticSource', 'css!SBIS3.Demo.Control.MyComboBoxDS', 'js!SBIS3.CONTROLS.ComboBox' ], function(CompoundControl, dotTplFn, ArrayStrategy, StaticSource) {
   /**
    * SBIS3.Demo.Control.MyComboBoxDS
    * @class SBIS3.Demo.Control.MyComboBoxDS
    * @extends $ws.proto.CompoundControl
    * @control
    */
   
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyComboBoxDS.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },
      
      init: function() {
         moduleClass.superclass.init.call(this);
         var arrayOfObj = [
                  {'@Заметка': 1, 'Содержимое': 'Заказать торт', 'Завершена': false},
                  {'@Заметка': 2, 'Содержимое': 'Украсить комнату', 'Завершена': false},
                  {'@Заметка': 3, 'Содержимое': 'Купить подарок', 'Завершена': true}
               ];   
         var ds1 = new StaticSource({
            data: arrayOfObj,
            keyField: '@Заметка',
            strategy: new ArrayStrategy()
            });
         this.getChildControlByName("ComboBox 1").setDataSource(ds1);
      }
   });
   return moduleClass;
});