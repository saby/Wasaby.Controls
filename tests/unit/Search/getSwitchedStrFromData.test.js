define(['Controls/Search/Misspell/getSwitcherStrFromData', 'Types/collection', 'Types/entity'], function(getSwitchedStrFromData, collection, entity) {
   
   describe('Controls.Search.Misspell.getSwitchedStrFromData', function() {
      
      it('getSwitchedStrFromData', function() {
         var rs = new collection.RecordSet({
            rawData: [],
            idProperty: 'id'
         });
         rs.setMetaData({
            results: new entity.Model({
               rawData: {
                  switchedStr: 'testStr'
               }
            })
         });
         assert.equal(getSwitchedStrFromData(rs), 'testStr');
   
         rs.setMetaData({
            switchedStr: 'testStr2'
         });
         assert.equal(getSwitchedStrFromData(rs), 'testStr2');
      });
   });
   
});