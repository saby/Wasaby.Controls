define([
   'js!Controls/Input/Area'
], function(Area){
   describe('Controls.Input.Area', function () {

      $('<div id="areaContainer"></div>').appendTo('#mocha');

      var createControl = function(cfg){
         return Area.createControl(Area, cfg || {}, $('<div></div>').appendTo('#areaContainer'));
      };

      describe('Options', function () {

         it('constraint', function () {
            var area = createControl({
               constraint: '[0-9]'
            });

            assert.equal(area._prepareValue({
               before: '',
               input: 'a',
               after: ''
            }).value, '');

            assert.equal(area._prepareValue({
               before: '',
               input: '1',
               after: ''
            }).value, '1');

         });

         it('maxLength', function () {
            var area = createControl({
               maxLength: '1'
            });

            assert.equal(area._prepareValue({
               before: '',
               input: '1',
               after: ''
            }).value, '1');

            assert.equal(area._prepareValue({
               before: '1',
               input: '2',
               after: ''
            }).value, '1');

            $('#areaContainer').remove();

         });

      });
   })
});