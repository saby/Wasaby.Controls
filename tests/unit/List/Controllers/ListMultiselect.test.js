/**
 * Created by am.gerasimov on 27.07.2017.
 */
define(['js!WSControls/Controllers/ListMultiSelector', 'js!WS.Data/Display/Display'
], function (ListMultiSelector, Display) {
   'use strict';
   
   describe('List multiSelector', function () {
      var multiSelectorMultiSelect, multiSelectorSingleSelect, multiSelectorAllowEmptyFalse;
      
      
      before(function() {
         var getProj = function() {
            return Display.getDefaultDisplay(['кот', 'собака', 'крыса']);
         };
         
         multiSelectorMultiSelect = new ListMultiSelector({
            multiSelect: true,
            projection: getProj()
         });
   
         multiSelectorSingleSelect = new ListMultiSelector({
            multiSelect: false,
            projection: getProj()
         });
   
         multiSelectorAllowEmptyFalse = new ListMultiSelector({
            multiSelect: true,
            allowEmptyMultiSelection: false,
            projection: getProj()
         });
      });
      
      after(function() {
         multiSelectorMultiSelect.destroy();
         multiSelectorMultiSelect = undefined;
   
         multiSelectorSingleSelect.destroy();
         multiSelectorSingleSelect = undefined;
   
         multiSelectorAllowEmptyFalse.destroy();
         multiSelectorAllowEmptyFalse = undefined;
      });
      
      describe('multiSelector multiSelect', function() {
         
         it('check setSelectedKeys', function() {
            multiSelectorMultiSelect.setSelectedKeys(['кот', 'собака']);
            
            assert.deepEqual(multiSelectorMultiSelect.getSelectedKeys(), ['кот', 'собака']);
            multiSelectorMultiSelect.setSelectedKeys(['крыса']);
            assert.deepEqual(multiSelectorMultiSelect.getSelectedKeys(), ['крыса']);
            assert.equal(multiSelectorMultiSelect._options.projection.at(2).isSelected(), true);
            
            multiSelectorMultiSelect.setSelectedKeys([]);
         });
   
         it('check addSelectedKeys', function() {
            multiSelectorMultiSelect.addSelectedKeys(['кот']);
            assert.deepEqual(multiSelectorMultiSelect.getSelectedKeys(), ['кот']);
      
            multiSelectorMultiSelect.addSelectedKeys(['собака']);
            assert.deepEqual(multiSelectorMultiSelect.getSelectedKeys(), ['кот', 'собака']);
      
            assert.equal(multiSelectorMultiSelect._options.projection.at(0).isSelected(), true);
            assert.equal(multiSelectorMultiSelect._options.projection.at(1).isSelected(), true);
   
            multiSelectorMultiSelect.setSelectedKeys([]);
         });
   
         it('check toggleSelectedKeys', function() {
            multiSelectorMultiSelect.setSelectedKeys(['кот', 'собака']);
            multiSelectorMultiSelect.toggleSelectedKeys(['кот']);
            assert.deepEqual(multiSelectorMultiSelect.getSelectedKeys(), ['собака']);
   
            multiSelectorMultiSelect.toggleSelectedKeys(['кот']);
            assert.deepEqual(multiSelectorMultiSelect.getSelectedKeys(), ['собака', 'кот']);
   
            assert.equal(multiSelectorMultiSelect._options.projection.at(0).isSelected(), true);
            assert.equal(multiSelectorMultiSelect._options.projection.at(1).isSelected(), true);
   
            multiSelectorMultiSelect.setSelectedKeys([]);
         });
   
         it('check removeSelectedKeys', function() {
            multiSelectorMultiSelect.setSelectedKeys(['кот', 'собака']);
            multiSelectorMultiSelect.removeSelectedKeys(['кот']);
            assert.deepEqual(multiSelectorMultiSelect.getSelectedKeys(), ['собака']);
            assert.equal(multiSelectorMultiSelect._options.projection.at(0).isSelected(), false);
            assert.equal(multiSelectorMultiSelect._options.projection.at(1).isSelected(), true);
   
            multiSelectorMultiSelect.removeSelectedKeys(['собака']);
            assert.deepEqual(multiSelectorMultiSelect.getSelectedKeys(), []);
   
            multiSelectorMultiSelect.setSelectedKeys(['кот', 'собака']);
            multiSelectorMultiSelect.removeSelectedKeys(['кот', 'собака']);
            assert.deepEqual(multiSelectorMultiSelect.getSelectedKeys(), []);
   
            multiSelectorMultiSelect.setSelectedKeys([]);
         });
   
         it('check wrong keys', function() {
            var result = false;
            
            try {
               multiSelectorMultiSelect.setSelectedKeys(null);
            } catch (e) {
               result = true
            }
            assert.equal(result, true);
         });
         
      });
   
      describe('multiSelector singleSelect', function() {
         it('check setSelectedKeys', function() {
            multiSelectorSingleSelect.setSelectedKeys(['кот', 'собака']);
            assert.deepEqual(multiSelectorSingleSelect.getSelectedKeys(), ['кот']);
            assert.equal(multiSelectorSingleSelect._options.projection.at(0).isSelected(), true);
            assert.equal(multiSelectorSingleSelect._options.projection.at(1).isSelected(), false);
   
            multiSelectorSingleSelect.setSelectedKeys([]);
         });
   
         it('check addSelectedKeys', function() {
            multiSelectorSingleSelect.addSelectedKeys(['кот']);
            assert.deepEqual(multiSelectorSingleSelect.getSelectedKeys(), ['кот']);
   
            multiSelectorSingleSelect.addSelectedKeys(['кот', 'собака']);
            assert.deepEqual(multiSelectorSingleSelect.getSelectedKeys(), ['кот']);
   
            assert.equal(multiSelectorSingleSelect._options.projection.at(0).isSelected(), true);
            assert.equal(multiSelectorSingleSelect._options.projection.at(1).isSelected(), false);
   
            multiSelectorSingleSelect.setSelectedKeys([]);
         });
   
         it('check removeSelectedKeys', function() {
            multiSelectorSingleSelect.setSelectedKeys(['кот', 'собака']);
            assert.deepEqual(multiSelectorSingleSelect.getSelectedKeys(), ['кот']);
   
            multiSelectorSingleSelect.removeSelectedKeys(['собака']);
            assert.deepEqual(multiSelectorSingleSelect.getSelectedKeys(), ['кот']);
   
            multiSelectorSingleSelect.removeSelectedKeys(['кот']);
            assert.deepEqual(multiSelectorSingleSelect.getSelectedKeys(), []);
   
            multiSelectorSingleSelect.setSelectedKeys([]);
         });
      });
   
      describe('multiSelector allowEmptyMultiSelection false', function() {
         
         it('check selectedKeys', function() {
            assert.deepEqual(multiSelectorAllowEmptyFalse.getSelectedKeys(), ['кот']);
            assert.equal(multiSelectorAllowEmptyFalse._options.projection.at(0).isSelected(), true);
         });
   
         it('check selectedKeys after set', function() {
            multiSelectorAllowEmptyFalse.setSelectedKeys([]);
            assert.deepEqual(multiSelectorAllowEmptyFalse.getSelectedKeys(), ['кот']);
            assert.equal(multiSelectorAllowEmptyFalse._options.projection.at(0).isSelected(), true);
         });
         
      });
      
   });
   
});