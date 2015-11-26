define('js!SBIS3.CONTROLS.Demo.MyTreeView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.Data.Source.Memory',
        'js!SBIS3.CONTROLS.ComponentBinder',
        'html!SBIS3.CONTROLS.Demo.MyTreeView',
        'html!SBIS3.CONTROLS.Demo.MyTreeView/resources/listTpl',
        'css!SBIS3.CONTROLS.Demo.MyTreeView',
        'js!SBIS3.CONTROLS.TreeViewDS',
        'js!SBIS3.CONTROLS.BreadCrumbs',
        'js!SBIS3.CONTROLS.BackButton'
    ], function(CompoundControl, StaticSource, ComponentBinder, dotTplFn, listTpl) {
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

         var items = [{'title': 'Медведь',          'id':1,  'parent@': true,  'image': 'https://tlgrm.ru/files/stickers/animals/bear.png'},
            {'title': 'Кот',              'id':2,  'parent@': true,  'image': 'https://tlgrm.ru/files/stickers/animals/cat.png',    'parent' : 1 },
            {'title': 'Собака с бровями', 'id':3,  'parent@': true,  'image': 'https://tlgrm.ru/files/stickers/animals/dog.png',    'parent' : 2 },
            {'title': 'Собака',           'id':4,  'parent@': false, 'image': 'https://tlgrm.ru/files/stickers/animals/doge.png',   'parent' : 3 },
            {'title': 'Козел',            'id':5,  'parent@': false, 'image': 'https://tlgrm.ru/files/stickers/animals/goat.png',   'parent' : 1 },
            {'title': 'Горилла',          'id':6,  'parent@': true,  'image': 'https://tlgrm.ru/files/stickers/animals/gorilla.png' },
            {'title': 'Грустный кот',     'id':7,  'parent@': false, 'image': 'https://tlgrm.ru/files/stickers/animals/grumpy.png', 'parent' : 6 },
            {'title': 'Коала',            'id':8,  'parent@': false, 'image': 'https://tlgrm.ru/files/stickers/animals/koala.png',  'parent' : 6 },
            {'title': 'Панда',            'id':9,  'parent@': false, 'image': 'https://tlgrm.ru/files/stickers/animals/panda.png'},
            {'title': 'Голубь',           'id':10, 'parent@': false, 'image': 'https://tlgrm.ru/files/stickers/animals/pidgeon.png'},
            {'title': 'Мопс',             'id':11, 'parent@': false, 'image': 'https://tlgrm.ru/files/stickers/animals/pug.png'},
            {'title': 'Енотик',           'id':12, 'parent@': false, 'image': 'https://tlgrm.ru/files/stickers/animals/raccoon.png'}];

         var source = new StaticSource({
               data: items,
               keyField: 'id'
            }
         );

         var treeView = this.getChildControlByName('MyTreeView'),
            breadCrumbs = this.getChildControlByName('MyBreadCrumbs'),
            backButton = this.getChildControlByName('MyBackButton'),
            componentBinder = new ComponentBinder();

         treeView._options.itemTemplate = listTpl;
         componentBinder.bindBreadCrumbs(breadCrumbs, backButton, treeView);

         treeView.setDataSource(source);
      }
   });
   return moduleClass;
});