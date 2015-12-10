define('js!SBIS3.CONTROLS.Demo.MyTreeView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.StaticSource',
        'js!SBIS3.CONTROLS.ArrayStrategy',
        'js!SBIS3.CONTROLS.ComponentBinder',
        'html!SBIS3.CONTROLS.Demo.MyTreeView',
        'html!SBIS3.CONTROLS.Demo.MyTreeView/resources/listTpl',
        'css!SBIS3.CONTROLS.Demo.MyTreeView',
        'js!SBIS3.CONTROLS.TreeViewDS',
        'js!SBIS3.CONTROLS.BreadCrumbs',
        'js!SBIS3.CONTROLS.BackButton'
    ], function(CompoundControl, StaticSource, ArrayStrategy, ComponentBinder, dotTplFn, listTpl) {
   /**
    * SBIS3.CONTROLS.Demo.MytreeView
    * @class SBIS3.CONTROLS.Demo.MytreeView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MytreeView.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
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

         var treeView = this.getChildControlByName('MyTreeView'),
            breadCrumbs = this.getChildControlByName('MyBreadCrumbs'),
            backButton = this.getChildControlByName('MyBackButton'),
            componentBinder = new ComponentBinder({
               view: treeView
            });

         treeView._options.itemTemplate = listTpl;
         componentBinder.bindBreadCrumbs(breadCrumbs, backButton, treeView);

         treeView.setDataSource(source);
      }
   });
   return moduleClass;
});