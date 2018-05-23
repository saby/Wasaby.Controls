define(
   [
      'Controls/Utils/Toolbar',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Collection/Factory/RecordSet',
      'WS.Data/Adapter/Json'
   ],
   (ToolbarUtil, RecordSet, recordSetFactory, JsonAdapter) => {
      describe('ToolbarUtil', () => {
         let defaultItems = [
            {
               id: '1',
               title: 'Запись 1',
               showType: 1
            },
            {
               id: '2',
               title: 'Запись 2',
               showType: 1
            },
            {
               id: '3',
               title: 'Запись 3',
               icon: 'icon-medium icon-Doge icon-primary',
               showType: 2
            },
            {
               id: '4',
               title: 'Запись 4',
               showType: 0
            }
         ];
         it('getMenuItems', function() {
            let rawItems = new RecordSet({rawData: defaultItems});
            let filtetedItems = ToolbarUtil.getMenuItems(rawItems).value(recordSetFactory, {
               adapter: new JsonAdapter(),
               idProperty: 'id'
            });
            let hasOnlyToolbarItem = false;
            assert.equal(filtetedItems.getCount(), 3);
            assert.equal(filtetedItems.at(2).get('showType'), ToolbarUtil.showType.MENU);
            filtetedItems.forEach(function(item) {
               if (item.get('showType') ===  ToolbarUtil.showType.TOOLBAR) {
                  hasOnlyToolbarItem = true;
               }
            });
            assert.equal(hasOnlyToolbarItem, false);
         });
      });
   });
