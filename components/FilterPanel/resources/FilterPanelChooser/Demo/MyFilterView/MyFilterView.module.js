define('js!SBIS3.CONTROLS.Demo.MyFilterView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.MyFilterView',
        'js!WS.Data/Source/Memory',
        'css!SBIS3.CONTROLS.Demo.MyFilterView',
        'js!SBIS3.CONTROLS.FilterPanelChooser'
    ], function(CompoundControl, dotTplFn, StaticSource) {
   /**
    * SBIS3.CONTROLS.Demo.MyFilterView
    * @class SBIS3.CONTROLS.Demo.MyFilterView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyFilterView.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
         }
      },

      init: function() {
         moduleClass.superclass.init.call(this);

      },
       _modifyOptions: function(cfg) {
           cfg.items1 = [{'title': 'Краснодарский край', 'id': 1, count: 11},
               {'title': 'Владимирская область', 'id': 2, count: 12},
               {'title': 'Нижегородская область', 'id': 3,count: 13},
               {'title': 'Астраханская область', 'id': 4,  count: 14},
               {'title': 'Белгородская область', 'id': 5, count: 15},
               {'title': 'Вологодская область', 'id': 6, count: 16},
               {'title': 'Псковская область', 'id': 7, count: 17},
               {'title': 'Самарская область', 'id': 8, count: 18},
               {'title': 'Ярославская область', 'id': 9, count: 19},
               {'title': 'Московская область', 'id': 10, count: 10},
               {'title': 'Калужская область', 'id': 11, count: 20},
               {'title': 'Республика Крым', 'id': 12, count: 21}];
           cfg.items2 = [{'title': 'Краснодарский край', 'id': 1, count: 11},
               {'title': 'Владимирская область', 'id': 2, count: 12},
               {'title': 'Нижегородская область', 'id': 3,count: 13},
               {'title': 'Астраханская область', 'id': 4,  count: 14},
               {'title': 'Белгородская область', 'id': 5, count: 15},
               {'title': 'Вологодская область', 'id': 6, count: 16}];
           cfg.items3 = [{'title': 'Краснодарский край', 'id': 1, count: 11},
               {'title': 'Владимирская область', 'id': 2, count: 12},
               {'title': 'Нижегородская область', 'id': 3,count: 13}];
           cfg.items4 = [{'title': 'Краснодарский край', 'id': 1, count: 11},
               {'title': 'Владимирская область', 'id': 2, count: 12}];
           cfg.items5 = [];
           cfg.items6 = [{title: 'ВТБ Капитал, АО', id: 1, count: 10},
               {title: 'НК "Роснефть", ОАО', id: 2, count: 39},
               {title: 'Газпром, ПАО', id: 3, count: 12}];
           return cfg;
       }
   });
   return moduleClass;
});