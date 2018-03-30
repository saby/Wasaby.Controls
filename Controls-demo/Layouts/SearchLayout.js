/**
 * Created by am.gerasimov on 26.01.2018.
 */
/**
 * Created by kraynovdo on 01.11.2017.
 */
define('Controls-demo/Layouts/SearchLayout', [
   'Core/Control',
   'tmpl!Controls-demo/Layouts/SearchLayout/SearchLayout',
   'WS.Data/Source/Memory',
   'Controls/Container/FilterButton',
   'Controls/List',
   'css!Controls-demo/Layouts/SearchLayout/SearchLayout',
   'Controls/Input/Text',
   'Controls-demo/Layouts/LayoutFilterComponent',
   'Controls/Container/Filter',
   'Controls/Container/Search',
   'Controls/Filter/Button',
   'Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/FilterButtonTemplate'
], function (BaseControl,
             template,
             MemorySource
) {
   'use strict';
   
   var sourceData = [
      { id: 1, title: 'Sasha' },
      { id: 2, title: 'Dmitry' },
      { id: 3, title: 'Andrey' },
      { id: 4, title: 'Aleksey' },
      { id: 5, title: 'Sasha' },
      { id: 6, title: 'Ivan' },
      { id: 7, title: 'Petr' },
      { id: 8, title: 'Roman' },
      { id: 9, title: 'Maxim' },
      { id: 10, title: 'Andrey' },
      { id: 12, title: 'Sasha' },
      { id: 13, title: 'Sasha' },
      { id: 14, title: 'Sasha' },
      { id: 15, title: 'Sasha' },
      { id: 16, title: 'Sasha' },
      { id: 17, title: 'Sasha' },
      { id: 18, title: 'Dmitry' },
      { id: 19, title: 'Andrey' },
      { id: 20, title: 'Aleksey' },
      { id: 21, title: 'Sasha' },
      { id: 22, title: 'Ivan' },
      { id: 23, title: 'Petr' }
   ];
   
   var filterSourceData = [
      {id: 'title', resetValue: '', value: '', textValue: ''},
      {id: 'id', resetValue: null, value: null, textValue: ''}
   ];
   
   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         _dataSource: new MemorySource({
            idProperty: 'id',
            data: sourceData
         }),
         _filterSource: filterSourceData,
         _switchValue: false
         
      });
   return ModuleClass;
});