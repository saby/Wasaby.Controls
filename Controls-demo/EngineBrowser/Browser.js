define('Controls-demo/EngineBrowser/Browser', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'wml!Controls-demo/EngineBrowser/Browser',
   'Controls-demo/Utils/MemorySourceFilter',
   'Controls-demo/Utils/MemorySourceData',
   'css!Controls-demo/EngineBrowser/Browser',
   'Controls/EngineBrowser',
   'wml!Controls-demo/EngineBrowser/resources/filterPanelAddItemsTemplate',
   'wml!Controls-demo/EngineBrowser/resources/filterPanelItemsTemplate',
   'wml!Controls-demo/EngineBrowser/resources/filterButtonEngineTemplate',
   'Controls/Container/List',
   'Controls/Search/Input/Container',
   'Controls/Filter/Button/Container',
   'Controls/Filter/Fast/Container'
], function(Control, Memory, template, MemorySourceFilter, MemorySourceData) {
   'use strict';
   var ModuleClass = Control.extend(
      {
         _template: template,
         _fastFilterSource: null,
         _items: null,
         _source: null,

         _beforeMount: function() {
            this._source = new Memory({
               idProperty: 'id',
               data: MemorySourceData
            });
            this._fastFilterSource = [
               {
                  id: 'owner',
                  resetValue: '0',
                  value: '0',
                  properties: {
                     keyProperty: 'owner',
                     displayProperty: 'title',
                     source: {
                        module: 'WS.Data/Source/Memory',
                        options: {
                           data: [
                              { id: 0, title: 'По ответственному', owner: '0' },
                              { id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.' },
                              { id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.' },
                              { id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.' },
                              { id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.' },
                           ]
                        }
                     }
                  }
               },
               {
                  id: 'department',
                  resetValue: 'По департаменту',
                  value: 'По департаменту',
                  properties: {
                     keyProperty: 'title',
                     displayProperty: 'title',
                     source: {
                        module: 'WS.Data/Source/Memory',
                        options: {
                           data: [
                              { id: 0, title: 'По департаменту' },
                              { id: 1, title: 'Разработка' },
                              { id: 2, title: 'Продвижение СБИС' },
                              { id: 3, title: 'Федеральная клиентская служка' },
                              { id: 4, title: 'Служба эксплуатации' },
                              { id: 5, title: 'Технологии и маркетинг' },
                              { id: 6, title: 'Федеральный центр продаж. Call-центр Ярославль' },
                              { id: 7, title: 'Сопровождение информационных систем' }
                           ]
                        }
                     }
                  }
               }
            ];
            this._items = [{
               id: 'owner',
               resetValue: '0',
               value: '0'
            }];
         },

         _afterMount: function() {
            this._source = new Memory({
               idProperty: 'id',
               data: MemorySourceData,
               filter: MemorySourceFilter('title')
            });
            this._forceUpdate();
         }
      }
   );
   return ModuleClass;
});
