import * as MemorySourceData from 'Controls-demo/Utils/MemorySourceData';

const _departmentsDataLong = MemorySourceData.departments.concat(getLongData());

function getLongData() {
   const data = [];

   for (var id = 10; id < 100; id++) {
      data.push({id: id, department: 'Разработка', owner: 'Новиков Д.В.', title: 'Разработка'});
   }

   return data;
}
export {
   _departmentsDataLong
}
