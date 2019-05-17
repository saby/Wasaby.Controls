define(
   [
      'Controls/suggest',
      'Types/entity',
      'Types/collection',
      'Types/source'
   ], function (suggest, entity, collection, sourceLib) {
      describe('Suggest/Input', function() {

         let getSuggest = function(config) {
            let suggestInput = new suggest.Input();
            suggestInput.saveOptions(config);
            return suggestInput;
         };

         it('_clearClick', function() {
            let activated, value;
            let input = getSuggest({autoDropDown: true});
            input._suggestState = true;
            input.activate = function() {activated = true;};
            input._notify = function(event, data) {
               if (event === 'valueChanged') {
                  value = data[0];
               }
            };

            input._clearClick();
            assert.isTrue(input._suggestState);
            assert.isTrue(activated);
            assert.strictEqual(value, '');

            input._options.autoDropDown = false;
            activated = false;
            value = null;
            input._clearClick();
            assert.isFalse(input._suggestState);
            assert.isTrue(activated);
            assert.strictEqual(value, '');
         });
      });
});
