define(['Controls/Header'], function (Header) {
   'use strict';
   var header, successCountClick, successIconClick;
   describe('Controls.Header', function () {
      beforeEach(function(){
         header = new Header({
            captions: 'capt1',
            style: 'default'
         });
         successCountClick = false;
         successIconClick = false;
         //subscribe на vdom компонентах не работает, поэтому мы тут переопределяем _notify
         //(дефолтный метод для vdom компонент который стреляет событием).
         //он будет вызван вместо того что стрельнет событием, тем самым мы проверяем что отправили
         //событие и оно полетит с корректными параметрами.
         header._notify = function(event){
            if(event==='countClick'){
               successCountClick = true;
            }
            if(event==='iconClick'){
               successIconClick = true;
            }
         };
      });

      afterEach(function () {
         header.destroy();
         header = undefined;
      });

      it('click counter without countClick', function () {
         var opt = {
           countClickable: false
         };
         header.saveOptions(opt);
         header.countClickHandler();
         assert(!successCountClick);
      });

      it('click icon without iconClick', function () {
         var opt = {
            iconClickable: false
         };
         header.saveOptions(opt);
         header.iconClickHandler();
         assert(!successIconClick);
      });

      it('click counter with iconClick', function () {
         var opt = {
            iconClickable: true
         };
         var event = {
            stopPropagation: function(){
               return true;
            }
         };
         header.saveOptions(opt);
         header.iconClickHandler(event);
         assert(successIconClick);
      });

      it('click counter with countClick', function () {
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

      it('update icon', function () {
         var opt = {
            openIcon: "open",
            closeIcon: "close",
            isIconOpen: false
         };
         header.saveOptions(opt);
         header._beforeUpdate();
         assert(header._icon === "open");
      });

      it('update style', function () {
         var opt = {
            type: "type",
            style: "style",
            size: "size"
         };
         header.saveOptions(opt);
         header._beforeUpdate();
         assert(header._size === "controls-Header__caption_type-type_size-size" && header._style === "controls-Header__caption_type-type_style-style");
      });
   });
});