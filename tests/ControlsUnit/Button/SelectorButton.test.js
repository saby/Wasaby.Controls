define(
   [
      'Controls/_lookup/Button/_SelectorButton',
      'Types/collection',
      'Core/core-clone'
   ],
   function(SelectorButton, collection, Clone) {
      describe('Controls/_lookup/Button/_SelectorButton', function() {
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
            let isShowSelector = false;
            let singleConfig = Clone(config);
            singleConfig.multiSelect = false;
            singleConfig.readOnly = true;
            let button = getButton(singleConfig);
            button._notify = (e) => {
               if (e === 'showSelector') {
                  isShowSelector = true;
               }
            };
            button._children = { 'selectorOpener': { open: setTrue.bind(this, assert) } };
            button._itemClickHandler([]);
            assert.isFalse(isShowSelector);

            button._options.readOnly = false;
            button._itemClickHandler([]);
            assert.isTrue(isShowSelector);
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
