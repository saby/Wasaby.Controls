define('js!SBIS3.CONTROLS.Demo.MyTreeDataGridView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.Data.Source.Memory',
        'js!SBIS3.CONTROLS.ComponentBinder',
        'html!SBIS3.CONTROLS.Demo.MyTreeDataGridView',
        'css!SBIS3.CONTROLS.Demo.MyTreeDataGridView',
        'js!SBIS3.CONTROLS.TreeDataGridView',
        'js!SBIS3.CONTROLS.BreadCrumbs',
        'js!SBIS3.CONTROLS.BackButton'
    ], function(CompoundControl, StaticSource, ComponentBinder, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyTreeDataGridView
    * @class SBIS3.CONTROLS.Demo.MyTreeDataGridView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTreeDataGridView.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         
         var items = [{'title': 'Первый',       'id':1,  'parent@': true },
                      {'title': 'Второй',       'id':2,  'parent@': true,  'parent' : 1 },
                      {'title': 'Третий',       'id':3,  'parent@': true,  'parent' : 2 },
                      {'title': 'Четвертый',    'id':4,  'parent@': false, 'parent' : 3 },
                      {'title': 'Пятый',        'id':5,  'parent@': false, 'parent' : 1 },
                      {'title': 'Шестой',       'id':6,  'parent@': true } ,
                      {'title': 'Седьмой',      'id':7,  'parent@': false, 'parent' : 6 },
                      {'title': 'Восьмой',      'id':8,  'parent@': false, 'parent' : 6 },
                      {'title': 'Девятый',      'id':9,  'parent@': false },
                      {'title': 'Десятый',      'id':10, 'parent@': false },
                      {'title': 'Одиннадцатый', 'id':11, 'parent@': false },
                      {'title': 'Двенадцатый',  'id':12, 'parent@': false }];

         var source = new StaticSource({
               data: items,
               keyField: 'id'
            }
         );

         var treeDataGridView = this.getChildControlByName('MyTreeDataGridView'),
            breadCrumbs = this.getChildControlByName('MyBreadCrumbs'),
            backButton = this.getChildControlByName('MyBackButton'),
            componentBinder = new ComponentBinder({
               view: treeDataGridView
            });

         componentBinder.bindBreadCrumbs(breadCrumbs, backButton, treeDataGridView);

         treeDataGridView.setDataSource(source);
      }
   });
   return moduleClass;
});