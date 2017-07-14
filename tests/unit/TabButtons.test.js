/**
 * Created by as.krasilnikov on 12.07.17.
 */
define(['js!SBIS3.CONTROLS.TabButtons'], function (TabButtons) {

   'use strict';
   describe('SBIS3.CONTROLS.TabButtons', function () {
      if (typeof window === 'undefined') {
         return;
      }
      let config = {
         idProperty: 'id',
         displayProperty: 'title',
         selectedKey: 'id1',
         items: [
            {
               id: 'id1',
               title: 'Вложения',
               icon: 'icon-16 icon-Alert icon-primary'
            },
            {
               id: 'id2',
               title: 'Лента событий',
               icon: 'icon-16 icon-AnotherSignatureCenter icon-primary'
            },
            {
               id: 'id3',
               title: 'Выполненные',
               align: 'left'
            }
         ]
      };
      let TButtons = new TabButtons(config);

      describe('Check data', () => {
         it('ItemsOrders', () => {
            let isRightOrder = (rs) => {
               return rs.at(0).get('_order') === 30 && rs.at(1).get('_order') === 31 && rs.at(2).get('_order') === 2;
            };
            assert.isTrue(isRightOrder(TButtons.getItems()));
         });
      });

      describe('Check selecting items', () => {
         it('DefaultSelectedKey', () => {
            assert.isTrue(TButtons.getSelectedKey() === config.selectedKey);
         });
         it('ChangeSelectedKey', () => {
            TButtons.setSelectedKey('id3');
            assert.isTrue(TButtons.getSelectedKey() === 'id3');
         });
      });

      after(() => {
         if (typeof $ !== 'undefined') {
            TButtons.destroy();
         }
         TButtons = undefined;
      });
   });
});