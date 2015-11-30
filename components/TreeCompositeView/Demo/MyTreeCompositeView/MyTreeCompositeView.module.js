define('js!SBIS3.CONTROLS.Demo.MyTreeCompositeView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.StaticSource',
        'js!SBIS3.CONTROLS.ArrayStrategy',
        'js!SBIS3.CONTROLS.ComponentBinder',
        'html!SBIS3.CONTROLS.Demo.MyTreeCompositeView/resources/tileTpl',
        'html!SBIS3.CONTROLS.Demo.MyTreeCompositeView/resources/listTpl',
        'html!SBIS3.CONTROLS.Demo.MyTreeCompositeView/resources/folderTpl',
        'html!SBIS3.CONTROLS.Demo.MyTreeCompositeView',
        'css!SBIS3.CONTROLS.Demo.MyTreeCompositeView',
        'js!SBIS3.CONTROLS.TreeCompositeView',
        'js!SBIS3.CONTROLS.BreadCrumbs',
        'js!SBIS3.CONTROLS.BackButton',
        'js!SBIS3.CONTROLS.RadioGroup'
    ], function(CompoundControl, StaticSource, ArrayStrategy, ComponentBinder, tileTpl, listTpl, folderTpl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyTreeCompositeView
    * @class SBIS3.CONTROLS.Demo.MyTreeCompositeView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTreeCompositeView.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            tileTpl: tileTpl,
            listTpl: listTpl,
            folderTpl: folderTpl
         }
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         
         var items = [{'title': 'Медведь',          'id':1,  'parent@': true,  'image': 'http://amfoot.net/imgcache/1.png'},
                      {'title': 'Кот',              'id':2,  'parent@': true,  'image': 'http://amfoot.net/imgcache/2.png',  'parent' : 1 },
                      {'title': 'Котик', 				 'id':3,  'parent@': true,  'image': 'http://amfoot.net/imgcache/3.png',  'parent' : 2 },
                      {'title': 'Собака с бровями', 'id':4,  'parent@': false, 'image': 'http://amfoot.net/imgcache/5.png',  'parent' : 3 },
                      {'title': 'Собака',           'id':5,  'parent@': false, 'image': 'http://amfoot.net/imgcache/6.png',  'parent' : 1 },
                      {'title': 'Лягушка',          'id':6,  'parent@': true,  'image': 'http://amfoot.net/imgcache/8.png' },
                      {'title': 'Козел', 				 'id':7,  'parent@': false, 'image': 'http://amfoot.net/imgcache/9.png',  'parent' : 6 },
                      {'title': 'Горилла',          'id':8,  'parent@': false, 'image': 'http://amfoot.net/imgcache/10.png', 'parent' : 6 },
                      {'title': 'Панда',            'id':9,  'parent@': false, 'image': 'http://amfoot.net/imgcache/15.png'},
                      {'title': 'Голубь',           'id':10, 'parent@': false, 'image': 'http://amfoot.net/imgcache/16.png'},
                      {'title': 'Мопс',             'id':11, 'parent@': false, 'image': 'http://amfoot.net/imgcache/18.png'},
                      {'title': 'Енотик',           'id':12, 'parent@': false, 'image': 'http://amfoot.net/imgcache/19.png'}];

         var source = new StaticSource({
               data: items,
               keyField: 'id',
               strategy: new ArrayStrategy()
            }
         );

         var treeCompositeView = this.getChildControlByName('MyTreeCompositeView'),
            breadCrumbs = this.getChildControlByName('MyBreadCrumbs'),
            backButton = this.getChildControlByName('MyBackButton'),
            radioGroup = this.getChildControlByName('RadioGroup'),
            componentBinder = new ComponentBinder({
                  view: treeCompositeView
            });

         treeCompositeView._options.tileTemplate = tileTpl;
         treeCompositeView._options.listTemplate = listTpl;
         treeCompositeView._options.folderTemplate = folderTpl;

         componentBinder.bindBreadCrumbs(breadCrumbs, backButton, treeCompositeView);
         treeCompositeView.setDataSource(source);

         radioGroup.subscribe('onSelectedItemChange', function(event, key){
            switch(key) {
               case 1:
                  treeCompositeView.setViewMode('table');
                  treeCompositeView.reload();
                  break;
               case 2:
                  treeCompositeView.setViewMode('tile');
                  treeCompositeView.reload();
                  break;
               case 3:
                  treeCompositeView.setViewMode('list');
                  treeCompositeView.reload();
                  break;
            }
         });
      },

      deleteHandler: function(item){
         this.deleteRecords(item.data('id'));
      }
   });
   return moduleClass;
});