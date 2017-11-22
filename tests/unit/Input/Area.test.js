define([
   'js!Controls/Input/Area',
   'Core/helpers/Function/runDelayed'
], function(Area, runDelayed){
   describe('Controls.Input.Area', function () {

      var createControl = function(cfg){
         return Area.createControl(Area, cfg, $('<div></div>').appendTo('#mocha'));
      };

      var destroyControl = function(control){
         runDelayed(function(){
            control.destroy();
         });
      };

      describe('Options tests', function () {

         it('value', function () {
            var area = createControl({
               value: 'Test value'
            });

            runDelayed(function(){
               assert.equal(area._value, 'Test value');
               assert.equal(area._container.find('.controls-TextArea__realField').get(0).textContent, 'Test value');
               destroyControl(area);
            });

         });

         it('trim', function () {
            var area = createControl({
               value: ' Test value ',
               trim: true
            });

            runDelayed(function(){
               assert.equal(area._container.find('.controls-TextArea__realField').get(0).textContent, 'Test value');
               destroyControl(area);
            });

         });

         /*it('trim', function () {
            var area = createControl({
               value: '  Test value  '
            });

            area.

            assert.equal(area._value, 'Test value');

            destroyControl(area);
         });*/






         /*it('check in private field', function () {
            runDelayed(function(){
               assert.equal(area._value, 'Test value');
               /!*assert.equal(area._container.find('.controls-TextArea__realField').get(0).textContent, 'Test value');
               assert.equal(area._container.find('.controls-TextArea__fakeField').get(0).textContent, 'Test value');*!/
               area.destroy();
            });
         });

         it('check in container', function () {
            runDelayed(function(){
               assert.equal(area._container.find('.controls-TextArea__realField').get(0).textContent, 'Test value');
               area.destroy();
            });
         });*/

      });

      /*

      describe('Options test: trim', function () {
         area = Area.createControl(Area, {
            value: '  Test value  '
         }, container);

         it('check in real container', function () {
            assert.equal(area._value, 'Test value');
            assert.equal(container.children('.controls-TextArea__realField').textContent, 'Test value');
            assert.equal(container.children('.controls-TextArea__testField').textContent, 'Test value');
         });
      });

      describe('Options test: trim', function () {
         area = Area.createControl(Area, {
            value: '  Test value  '
         }, container);

         it('check in real container', function () {
            assert.equal(area._value, 'Test value');
            assert.equal(container.children('.controls-TextArea__realField').textContent, 'Test value');
            assert.equal(container.children('.controls-TextArea__testField').textContent, 'Test value');
         });
      });*/



   })
});