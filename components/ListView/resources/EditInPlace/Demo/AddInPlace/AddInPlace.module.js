define('js!SBIS3.CONTROLS.DEMO.AddInPlace',
   [
      'js!SBIS3.CORE.CompoundControl', 
      'html!SBIS3.CONTROLS.DEMO.AddInPlace',
      'js!SBIS3.CONTROLS.Data.Source.SbisService',
      'js!SBIS3.CONTROLS.DataGridView', 
      'js!SBIS3.CONTROLS.Button',
      'js!SBIS3.CONTROLS.TextBox',
      'js!SBIS3.CONTROLS.NumberTextBox',
      'html!SBIS3.CONTROLS.DEMO.AddInPlace/resources/AddButtonsTpl'
   ], 
   function(CompoundControl, dotTplFn, SbisService) {
   /**
    * SBIS3.DOCS.AddInPlace
    * @class SBIS3.DOCS.AddInPlace
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.DOCS.AddInPlace.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         
         var view = this.getChildControlByName('ДобавлениеПоМесту'),
             // инициализируем источник данных БЛ
             dataSource = new SbisService({
                 service: 'Ноутбуки',
                 formatMethodName: 'Создать'
             });
         
         view.setDataSource(dataSource); // устанавливаем источник данных для таблицы
         
         // подписываем кнопку на добавление новой записи представлению данных
         this.getChildControlByName('СоздатьЗапись').subscribe('onActivated', function(){
            view.sendCommand('beginAdd');
         }.bind(this));
      },
      sendAddItem: function() {
         this.sendCommand('beginAdd');
      }
   });

   return moduleClass;
});