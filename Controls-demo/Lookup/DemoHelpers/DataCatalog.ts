import {Memory} from 'Types/source';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import * as MemorySourceData from 'Controls-demo/Utils/MemorySourceData';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';

const _departmentsDataLong = MemorySourceData.departments.concat(getLongData());

function getLongData() {
   const data = [];

   for (var id = 10; id < 100; id++) {
      data.push({id: id, department: 'Разработка', owner: 'Новиков Д.В.', title: 'Разработка'});
   }

   return data;
}

function getNavigation() {
   return {
      source: 'page',
      view: 'page',
      sourceConfig: {
         pageSize: 2,
         page: 0,
         hasMore: false
      }
   };
}

function getSuggestSourceLong() {
   return new SearchMemory({
      keyProperty: 'id',
      data: _departmentsDataLong,
      searchParam: 'title',
      filter: MemorySourceFilter()
   });
}

export {
   getNavigation,
   getSuggestSourceLong
}
