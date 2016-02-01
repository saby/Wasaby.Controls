define('js!SBIS3.Engine.Demo.MyBrowserTabs', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.Engine.Demo.MyBrowserTabs',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.ArrayStrategy',
   'js!SBIS3.Engine.BrowserTabs',
   'js!SBIS3.Engine.Browser',
   'js!SBIS3.CONTROLS.FastDataFilter',
   'js!SBIS3.CONTROLS.OperationsPanel',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.TreeCompositeView',
   'js!SBIS3.CONTROLS.Demo.FilterButtonFilterContent'

], function (CompoundControl, dotTplFn, StaticSource, ArrayStrategy) {
   /**
    * RegistryPanelDemo
    * @class SBIS3.CONTROLS.Demo.MyRegistry
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var MyBrowserTabs = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyRegistry.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },

      init: function() {
         MyBrowserTabs.superclass.init.call(this);

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
               keyField: 'id',
               strategy: new ArrayStrategy()
            }
         );

         var treeCompositeView = this.getChildControlByName('MyTreeCompositeView');
         treeCompositeView.setDataSource(source);
      },
      activateItem : function(item, id) {
         this._activateItem(id);
      }
   });
   return MyBrowserTabs;
});