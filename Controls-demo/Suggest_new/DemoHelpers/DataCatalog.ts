import {resourceRoot} from 'Core/constants';
import * as MemorySourceData from 'Controls-demo/Utils/MemorySourceData';

const _companies = MemorySourceData.companies;
const _departments = MemorySourceData.departments;
const _departmentsDataLong = _departments.concat(getLongData());
const _departmentsWithCompanies = _companies.concat(_departmentsDataLong)
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

export {
   _companies,
   _departments,
   _departmentsWithCompanies,
   _departmentsDataLong,
   _departmentsWithImges
}
