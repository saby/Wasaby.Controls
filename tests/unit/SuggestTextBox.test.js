/**
 * Created by as.krasilnikov on 12.07.17.
 */
define(['js!SBIS3.CONTROLS.SuggestTextBox', 'WS.Data/Entity/Record', 'WS.Data/Source/Memory'], function (SuggestTextBox, Record, Memory) {

   'use strict';
   describe('SBIS3.CONTROLS.SuggestTextBox', function () {
      if (typeof window === 'undefined') {
         return;
      }
      let config = {
         historyId: 'suggestTextBoxHistoryId1',
         list: {
            component: 'js!SBIS3.CONTROLS.DataGridView',
            options: {
               columns: [
                  {
                     title: 'id',
                     field: 'id'
                  },
                  {
                     title: 'Название',
                     field: 'name'
                  }
               ],
               idProperty: 'id'
            }
         }
      };
      let SuggestTB = new SuggestTextBox(config);

      before(() => {
         SuggestTB.setText('text');
         SuggestTB._observableControlFocusHandler(); //Для создания historyController'a
         SuggestTB._historyController.clearHistory();
         let dataSource = new Memory({
            endpoint: 'test',
            idProperty: 'id'
         });
         SuggestTB.getList().setDataSource(dataSource);
      });

      describe('History', () => {
         let createRecord = (rawData) => {
            return new Record({
               rawData: rawData,
               format: [
                  {name: 'id', type: 'string'},
                  {name: 'name', type: 'string'}
               ]
            });
         };
         it('Add records', () => {
            SuggestTB._addItemToHistory(createRecord({id: 1, name: 'Название1'}));
            SuggestTB._addItemToHistory(createRecord({id: 2, name: 'Название2'}));
            SuggestTB._addItemToHistory(createRecord({id: 3, name: 'Название3'}));
            assert.isTrue(SuggestTB._historyController.getCount() === 3);
         });

         it('Add existing record', () => {
            SuggestTB._addItemToHistory(createRecord({id: 1, name: 'Название1'}));
            SuggestTB._addItemToHistory(createRecord({id: 2, name: 'Название2'}));
            SuggestTB._addItemToHistory(createRecord({id: 1, name: 'Название1'}));
            assert.isTrue(SuggestTB._historyController.getCount() === 3);
         });

         it('Check history query', () => {
            var query = SuggestTB._getQueryForHistory();
            assert.isTrue(query._where.id.length === 3);
         });
      });

      after(() => {
         if (typeof $ !== 'undefined') {
            SuggestTB.destroy();
         }
         SuggestTB = undefined;
      });
   });
});