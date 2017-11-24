define([
   'js!Controls/Input/Area'
], function(Area){
   describe('Controls.Input.Area', function () {

      var area;

      var create = function(cfg){
         area = Area.createControl(Area, cfg || {}, $('<div></div>').appendTo('#mocha'));
      };

      describe('Options', function () {

         afterEach(function(){
            area.destroy();
         });

         it('constraint', function () {

            create({
               constraint: '[0-9]'
            });

            assert.equal(area._prepareData({
               before: '',
               input: 'a',
               after: ''
            }).value, '');

            assert.equal(area._prepareData({
               before: '',
               input: '1',
               after: ''
            }).value, '1');

         });

         it('maxLength', function () {

            create({
               maxLength: '1'
            });

            assert.equal(area._prepareData({
               before: '',
               input: '1',
               after: ''
            }).value, '1');

            assert.equal(area._prepareData({
               before: '1',
               input: '2',
               after: ''
            }).value, '1');

         });

      });
   })
});