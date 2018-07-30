/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/FilterSearch/FilterSearch', [
   'Core/Control',
   'tmpl!Controls-demo/FilterSearch/FilterSearch',
   'WS.Data/Source/Memory',
   'Controls-demo/Utils/MemorySourceData',
   'Controls-demo/Utils/MemorySourceFilter',
   'css!Controls-demo/FilterSearch/FilterSearch',
   'Controls/Container/List',
   'Controls/Search/Input/Container',
   'Controls/Filter/Button/Container',
   'Controls/Filter/Fast/Container'
], function(Control, template, MemorySource, memorySourceData, memorySourceFilter) {
   
   'use strict';
   
   var filterData = [
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
                     {id: 0, title: 'По ответственному', owner: '0'},
                     {id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.'},
                     {id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.'},
                     {id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.'},
                     {id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.'},
                  ]
               }
            }
         }
      }
   ];
   
   var filterDepData = [
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
                     {id: 0, title: 'По ответственному', owner: '0'},
                     {id: 1, title: 'Новиков Д.В.', owner: 'Новиков Д.В.'},
                     {id: 2, title: 'Кошелев А.Е.', owner: 'Кошелев А.Е.'},
                     {id: 3, title: 'Субботин А.В.', owner: 'Субботин А.В.'},
                     {id: 4, title: 'Чеперегин А.С.', owner: 'Чеперегин А.С.'},
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
                     {id: 0, title: 'По департаменту'},
                     {id: 1, title: 'Разработка'},
                     {id: 2, title: 'Продвижение СБИС'},
                     {id: 3, title: 'Федеральная клиентская служка'},
                     {id: 4, title: 'Служба эксплуатации'},
                     {id: 5, title: 'Технологии и маркетинг'},
                     {id: 6, title: 'Федеральный центр продаж. Call-центр Ярославль'},
                     {id: 7, title: 'Сопровождение информационных систем'}
                  ]
               }
            }
         }
      }
   ]
   
   var filterButtonData = [{
      id: 'owner',
      resetValue: '0',
      value: '0'
   }];
   
   var tabData = [
      {
         id: 'employees',
         title: 'Сотрудники',
         align: 'right'
      }
   ];
   
   var SearchContainer = Control.extend({
      _template: template,
      _navigation: {
         source: 'page',
         view: 'page',
         sourceConfig: {
            pageSize: 20,
            page: 0,
            mode: 'totalCount'
         }
      },
      _filter: {},
      _search: {},
      _filterSearch: {},
      _filterSearchTabs: {},
      _searchValue: '',
      _fastFilterData: filterData,
      _fullFastFilterData: filterDepData,
      _filterButtonData: filterButtonData,
      _tabSelectedKey: 'employees',
      _searchValueWithFilters: '',
      _searchValueWithFiltersTabs: '',
      
      _beforeMount: function() {
         this._source = new MemorySource({
            data: memorySourceData,
            idProperty: 'id'
         });
         
         this._sourceWithoutFilter = new MemorySource({
               data: memorySourceData,
               idProperty: 'id'
            });
   
         this._tabSource = new MemorySource({
            data: tabData,
            idProperty: 'id'
         });
      },
      
      _afterMount: function() {
         this._source = new MemorySource({
            data: memorySourceData,
            filter: memorySourceFilter('firstName'),
            idProperty: 'id'
         });
         this._forceUpdate();
      }
   });
   
   return SearchContainer;
});