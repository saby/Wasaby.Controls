define('js!SBIS3.CONTROLS.Demo.MyTreeCompositeView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.Data.Source.Memory',
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
    ], function(CompoundControl, StaticSource, ComponentBinder, tileTpl, listTpl, folderTpl, dotTplFn) {
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

         var treeCompositeView = this.getChildControlByName('MyTreeCompositeView'),
            breadCrumbs = this.getChildControlByName('MyBreadCrumbs'),
            backButton = this.getChildControlByName('MyBackButton'),
            radioGroup = this.getChildControlByName('RadioGroup'),
            componentBinder = new ComponentBinder();

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