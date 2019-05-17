/**
 * Created by kraynovdo on 07.02.2018.
 */
define([
   'Controls/event'
], function(events){
   describe('Controls.Event.Registrar', function () {
      var evMock, compMock, result = false;
      beforeEach(function() {
         evMock = {
            stopPropagation: function() {
               return 1;
            }
         };
         compMock = {
            getInstanceId: function() {
               return '123abc'
            }
         }

      });

      it('register - unregister', function () {
         var reg = new events.Registrar();

         reg.register(evMock, compMock, function(){
            result = true;
         });

         //проверяем что создалась запись
         assert.isTrue(!!reg._registry['123abc'], 'No records in _registry after register');
         //проверяем что корректный компонент
         assert.deepEqual(compMock, reg._registry['123abc'].component, 'Wrong component in _registry after register');

         reg.unregister(evMock, compMock);
         assert.isTrue(!reg._registry['123abc'], '_registry has records after unregister');

         reg.destroy();
      });

      it('start', function () {
         var reg = new events.Registrar();


         reg.register(evMock, compMock, function(){
            result = true;
         });

         result = false;
         reg.start();
         assert.isTrue(result, 'Callback wasn\' called after start command');

         reg.unregister(evMock, compMock);

         reg.destroy();
      });
   })
});