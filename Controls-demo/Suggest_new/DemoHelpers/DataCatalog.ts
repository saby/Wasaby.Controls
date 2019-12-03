import {Memory} from 'Types/source';
import {resourceRoot} from 'Core/constants';
import * as MemorySourceFilter from 'Controls-demo/Utils/MemorySourceFilter';
import * as MemorySourceData from 'Controls-demo/Utils/MemorySourceData';
import * as SearchMemory from 'Controls-demo/Search/SearchMemory';

const _companies = MemorySourceData.companies;
const _departments = MemorySourceData.departments;
const _departmentsDataLong = _departments.concat(getLongData());
const _departmentsWithImges = MemorySourceData.departments;

_departmentsWithImges.forEach(function(department) {
   department.photo = resourceRoot + 'Controls-demo/Suggest_new/resources/images/Novikov.png';
});

_departmentsDataLong.forEach(function(department) {
   department.currentTab = 1;
});
_companies.forEach(function(companie) {
   companie.currentTab = 2;
});

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

function getMaxCountNavigation() {
   return {
      source: 'page',
      view: 'maxCount',
      sourceConfig: {
         pageSize: 2,
         page: 0,
         hasMore: false
      },
      viewConfig: {
         maxCountValue: 4
      }
   };
}

function getSuggestTabSource() {
   return new SearchMemory({
      keyProperty: 'id',
      data: _companies.concat(_departmentsDataLong),
      searchParam: 'title',
      filter: MemorySourceFilter()
   });
}

function getSuggestSourceLong() {
   return new SearchMemory({
      keyProperty: 'id',
      data: _departmentsDataLong,
      searchParam: 'title',
      filter: MemorySourceFilter()
   });
}

function getEmptySource() {
   return new Memory({
      data: []
   });
}

function getSuggestSource() {
   return new SearchMemory({
      keyProperty: 'id',
      data: _departments,
      searchParam: 'title',
      filter: MemorySourceFilter()
   });
}

function getSuggestSourceWithImages() {
   return new SearchMemory({
      keyProperty: 'id',
      data: _departmentsWithImges,
      searchParam: 'title',
      filter: MemorySourceFilter()
   });
}

export {
   getNavigation,
   getMaxCountNavigation,
   getSuggestSource,
   getSuggestTabSource,
   getSuggestSourceLong,
   getEmptySource,
   getSuggestSourceWithImages
}
