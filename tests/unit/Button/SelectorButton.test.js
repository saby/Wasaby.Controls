define(
   [
      'Controls/Selector/Button/_SelectorButton',
      'WS.Data/Collection/List',
      'Core/core-clone'
   ],
   function(SelectorButton, List, Clone) {
      describe('Controls/Selector/Button/_SelectorButton', function() {
         let config = {
            multiSelect: true,
            keyProperty: 'id',
            displayProperty: 'title',
            caption: 'Выберите запись',
            maxVisibleItems: 2
         };

         let getButton = function(config) {
            let selButton = new SelectorButton(config);
            selButton.saveOptions(config);
            return selButton;
         };

         it('_itemClickHandler singleSelect', function() {
            let singleConfig = Clone(config);
            singleConfig.multiSelect = false;
            let button = getButton(singleConfig);
            button._children = { 'selectorOpener': { open: setTrue.bind(this, assert) } };
            button._itemClickHandler([]);
         });

         it('_itemClickHandler multiSelect', function() {
            let button = getButton(config);
            button._notify = (e, data) => {
               if (e === 'itemClick') {
                  assert.deepEqual(data[0], []);
               }
            };
            button._itemClickHandler([]);
         });

         function setTrue(assert) {
            assert.equal(true, true);
         }
      });
   }
);
