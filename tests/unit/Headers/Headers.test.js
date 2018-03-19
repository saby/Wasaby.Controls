define(['Controls/Header'], function (Header) {
   'use strict';
   var header, successCountClick;
   describe('Controls.Header', function () {
      beforeEach(function(){
         header = new Header({
            captions: 'capt1',
            style: 'default'
         });
         successCountClick = false;
         //subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
         //(дефолтный метод для vdom компонент который стреляет событием).
         //он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
         //событие и оно полетит с корректными параметрами.
         header._notify = function(event){
            if(event==='countClick'){
               successCountClick = true;
            }
         };
      });

      afterEach(function () {
         header.destroy();
         header = undefined;
      });

      it('click with common click', function () {
         var opt = {
           countClickable: false
         };
         header.saveOptions(opt);
         header.countClickHandler();
         assert(!successCountClick);
      });

      it('click with count click', function () {
         var opt = {
           countClickable: true
         };
         var event = {
            stopPropagation: function(){
               return true;
            }
         };
         header.saveOptions(opt);
         header.countClickHandler(event);
         assert(successCountClick);
      });
   });
});