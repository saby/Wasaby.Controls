define('js!SBIS3.CONTROLS.Demo.MyCompositeView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.Data.Source.Memory',
        'js!SBIS3.CONTROLS.ComponentBinder',
        'html!SBIS3.CONTROLS.Demo.MyCompositeView/resources/tileTpl',
        'html!SBIS3.CONTROLS.Demo.MyCompositeView/resources/listTpl',
        'html!SBIS3.CONTROLS.Demo.MyCompositeView',
        'css!SBIS3.CONTROLS.Demo.MyCompositeView',
        'js!SBIS3.CONTROLS.CompositeView',
        'js!SBIS3.CONTROLS.BreadCrumbs',
        'js!SBIS3.CONTROLS.BackButton',
        'js!SBIS3.CONTROLS.RadioGroup'
    ], function(CompoundControl, StaticSource, ComponentBinder, tileTpl, listTpl, dotTplFn) {
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
         
         var items = [{'title': 'Медведь',          'id':1,  'parent@': true,  'image': 'http://amfoot.net/imgcache/1.png'},
                      {'title': 'Кот',              'id':2,  'parent@': true,  'image': 'http://amfoot.net/imgcache/2.png'},
                      {'title': 'Котик', 				 'id':3,  'parent@': true,  'image': 'http://amfoot.net/imgcache/3.png'},
                      {'title': 'Собака с бровями', 'id':4,  'parent@': false, 'image': 'http://amfoot.net/imgcache/5.png'},
                      {'title': 'Собака',           'id':5,  'parent@': false, 'image': 'http://amfoot.net/imgcache/6.png'},
                      {'title': 'Лягушка',          'id':6,  'parent@': true,  'image': 'http://amfoot.net/imgcache/8.png'},
                      {'title': 'Козел', 				 'id':7,  'parent@': false, 'image': 'http://amfoot.net/imgcache/9.png'},
                      {'title': 'Горилла',          'id':8,  'parent@': false, 'image': 'http://amfoot.net/imgcache/10.png'},
                      {'title': 'Панда',            'id':9,  'parent@': false, 'image': 'http://amfoot.net/imgcache/15.png'},
                      {'title': 'Голубь',           'id':10, 'parent@': false, 'image': 'http://amfoot.net/imgcache/16.png'},
                      {'title': 'Мопс',             'id':11, 'parent@': false, 'image': 'http://amfoot.net/imgcache/18.png'},
                      {'title': 'Енотик',           'id':12, 'parent@': false, 'image': 'http://amfoot.net/imgcache/19.png'}];

         var compositeView = this.getChildControlByName('MyCompositeView'),
            radioGroup = this.getChildControlByName('RadioGroup');

         compositeView._options.tileTemplate = tileTpl;
         compositeView._options.listTemplate = listTpl;         
         
         var source = new StaticSource({
               data: items,
               keyField: 'id'
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