define(['Controls/_filter/Utils/isEqualItems'],
   function(isEqualItems) {

      it('isEqualItems', () => {
         let filterButtonItem = { id: '1' };
         let fastFilterItem = { id: '1' };
         assert.isTrue(isEqualItems.default(filterButtonItem, fastFilterItem));

         filterButtonItem = {id: '2'};
         assert.isFalse(isEqualItems.default(filterButtonItem, fastFilterItem));

         filterButtonItem = {name: '2'};
         fastFilterItem = {name: '1'};
         assert.isFalse(isEqualItems.default(filterButtonItem, fastFilterItem));

         fastFilterItem = {name: '2'};
         assert.isTrue(isEqualItems.default(filterButtonItem, fastFilterItem));

         filterButtonItem = {id: 'test', name: 'test'};
         fastFilterItem = {name: 'test'};
         assert.isTrue(isEqualItems.default(filterButtonItem, fastFilterItem));
      });
   });
