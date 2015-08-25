define('js!SBIS3.CONTROLS.Demo.MyCompositeView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.StaticSource',
        'js!SBIS3.CONTROLS.ArrayStrategy',
        'js!SBIS3.CONTROLS.ComponentBinder',
        'html!SBIS3.CONTROLS.Demo.MyCompositeView/resources/tileTpl',
        'html!SBIS3.CONTROLS.Demo.MyCompositeView/resources/listTpl',
        'html!SBIS3.CONTROLS.Demo.MyCompositeView',
        'css!SBIS3.CONTROLS.Demo.MyCompositeView',
        'js!SBIS3.CONTROLS.CompositeView',
        'js!SBIS3.CONTROLS.BreadCrumbs',
        'js!SBIS3.CONTROLS.BackButton',
        'js!SBIS3.CONTROLS.RadioGroup'
    ], function(CompoundControl, StaticSource, ArrayStrategy, ComponentBinder, tileTpl, listTpl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyCompositeView
    * @class SBIS3.CONTROLS.Demo.MyCompositeView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyCompositeView.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            tileTpl: tileTpl,
            listTpl: listTpl
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

         var compositeView = this.getChildControlByName('MyCompositeView'),
            radioGroup = this.getChildControlByName('RadioGroup');

         compositeView._options.tileTemplate = tileTpl;
         compositeView._options.listTemplate = listTpl;         
         
         var source = new StaticSource({
               data: items,
               keyField: 'id',
               strategy: new ArrayStrategy()
            }
         );

         compositeView.setDataSource(source);
         
         radioGroup.subscribe('onSelectedItemChange', function(event, key){
            switch(key) {
               case 1:
                  compositeView.setViewMode('table');
                  compositeView.reload();
                  break;
               case 2:
                  compositeView.setViewMode('tile');
                  compositeView.reload();
                  break;
               case 3:
                  compositeView.setViewMode('list');
                  compositeView.reload();
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