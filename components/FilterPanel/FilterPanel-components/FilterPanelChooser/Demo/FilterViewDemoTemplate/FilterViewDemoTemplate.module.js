define('js!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate',
      'js!WS.Data/Adapter/Sbis',
      'js!WS.Data/Source/Memory',
      'js!SBIS3.CONTROLS.SelectorController',
      'js!SBIS3.CONTROLS.DataGridView',
      'js!SBIS3.CONTROLS.Button',
      'css!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate',
      'js!SBIS3.CONTROLS.TabControl',
      /*'js!SBIS3.Engine.SelectorBrowser'*/
   ],
   function(CompoundControl, dotTplFn, AdapterSbis, StaticSource, FormChooseController){
      var moduleClass = FormChooseController.extend({
         _dotTplFn: dotTplFn,
         _modifyOptions: function() {
            var opts = moduleClass.superclass._modifyOptions.apply(this, arguments);
            opts.items = [{id: 1, title: 'ВТБ Капитал, АО', count: 10},
               {id: 2, title: 'НК "Роснефть", ОАО', count: 39},
               {id: 3, title: 'Газпром, ПАО', count: 12},
               {id: 4, title: 'Сбербанк Финанс, ООО', count: 83},
               {id: 5, title: 'РЖД, ОАО', count: 11},
               {id: 6, title: 'Газпром Нефть, ПАО', count: 3}];
            opts.favorites = [{id: 1, title: 'ВТБ Капитал, АО', count: 10},
               {id: 2, title: 'НК "Роснефть", ОАО', count: 39}];
            return opts;
         }
      });
      return moduleClass;
   }
);
