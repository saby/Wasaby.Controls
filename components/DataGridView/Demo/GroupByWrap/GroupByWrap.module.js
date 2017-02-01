define('js!SBIS3.DOCS.GroupByWrap',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.DOCS.GroupByWrap',
      'js!WS.Data/Source/SbisService',
      'html!SBIS3.DOCS.GroupByWrap/resources/groupTemplate', // Подключаем шаблон заголовка группы
      'html!SBIS3.DOCS.GroupByWrap/resources/itemTemplate', // Подключаем шаблон ячейки
      'css!SBIS3.DOCS.GroupByWrap',
      'js!SBIS3.CONTROLS.DataGridView'
   ],
   function(CompoundControl, dotTplFn, SbisService ){
      var moduleClass = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         init: function() {
            moduleClass.superclass.init.call(this);
            var dataSource = new SbisService({
                   endpoint: 'ТелефонныйСправочник3',
                   binding: {
                      format: 'СписокФИОБезПапок'
                   }
                }),
                myView = this.getChildControlByName('ContactsList');
            myView.setDataSource(dataSource);
         }
      });
      return moduleClass;
   }
);