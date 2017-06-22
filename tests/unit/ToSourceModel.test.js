/**
 * Created by am.gerasimov on 21.06.2017.
 */
define([
   'js!SBIS3.CONTROLS.ToSourceModel',
   'js!WS.Data/Collection/List',
   'js!WS.Data/Source/SbisService',
   'js!WS.Data/Collection/RecordSet'
], function (ToSourceModel, List, SbisService, RecordSet) {
   'use strict';
   
   let dataSource = new SbisService();
   let list = new List();
   let recordSet = new RecordSet();
   
   describe('SBIS3.CONTROLS.ToSourceModel', function () {
   
      describe('check collections', function() {
         
         it('check list', function() {
            var res = true;
            
            try {
               ToSourceModel(list, dataSource, '', true);
            } catch (e) {
               res = false;
            }
            
            assert.equal(res, true);
         });
   
         it('check recordset', function() {
            var res = true;
   
            try {
               ToSourceModel(recordSet, dataSource, '', true);
            } catch (e) {
               res = false;
            }
   
            assert.equal(res, true);
         });
         
      })
   
   })
});

