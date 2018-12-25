define(['Controls/Search/Misspell/getSwitcherStrFromData', 'WS.Data/Collection/RecordSet', 'WS.Data/Entity/Model'], function(getSwitchedStrFromData, RecordSet, Model) {
   
   describe('Controls.Search.Misspell.getSwitchedStrFromData', function() {
      
      it('getSwitchedStrFromData', function() {
         var rs = new RecordSet({
            rawData: [],
            idProperty: 'id'
         });
         rs.setMetaData({
            results: new Model({
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