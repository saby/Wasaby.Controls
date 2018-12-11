/**
 * Created by am.gerasimov on 21.06.2017.
 */
define([
   'Controls/Utils/ToSourceModel',
   'WS.Data/Collection/List',
   'WS.Data/Source/SbisService',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Entity/Model'
], function (ToSourceModel, List, SbisService, RecordSet, Model) {
   'use strict';
   
   /* Сделаем кастомную модель,
      чтобы не совпадал _moduleName */
   let customModel = Model.extend({
      _moduleName: 'customModel',
      _$properties: {
         isCustom: {
            get: function() {
               return true;
            }
         }
      }
   });
   
   let dataSource = new SbisService({model: customModel});
   let list = new List();
   let recordSet = new RecordSet();
   let model = new Model();
   
   list.add(new Model());
   model.set('recordSet', recordSet);
   recordSet._getMediator().addRelationship(model, recordSet, 'customRelationship');
   
   describe('Controls/Utils/ToSourceModel', function () {
   
      describe('check collections', function() {
         
         it('check list', function() {
            var res = true;
            
            try {
               ToSourceModel(list.clone(), dataSource, '', true);
            } catch (e) {
               res = false;
            }
            
            assert.equal(res, true);
         });
   
         it('check recordset', function() {
            var res = true;
   
            try {
               ToSourceModel(recordSet.clone(), dataSource, '', true);
            } catch (e) {
               res = false;
            }
   
            assert.equal(res, true);
         });
         
      });
   
      describe('to source model', function () {
      
         it('check model by step', function() {
            assert.equal(model.isChanged(), true);
            model.acceptChanges();
            assert.equal(model.isChanged(), false);
            assert.equal(list.at(0)._moduleName,  'WS.Data/Entity/Model');
            assert.equal(ToSourceModel(list, dataSource, '', true).at(0)._moduleName, 'customModel');
            assert.equal(model.isChanged(), false);
         });
      
      });
   
   })
});

