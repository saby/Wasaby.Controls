define([
   'Controls/List/Controllers/ScrollController'
], function(ScrollController) {

   var currentTriggers, currentScrollTop;

   function createScrollContainer() {
      return {
         //Подписка на событие в ScrollController, сохраняем тут обработчик scrollHandler
         addEventListener: function(eventName, scrollHandler, options) {
            this.scrollHandler = scrollHandler;
         },

         //Вызов обработчика scrollHandler из тестов с нужными параметрами
         onScroll: function(scrollTop, scrollHeight, clientHeight) {
            this.scrollHandler({
               target: {
                  scrollTop: scrollTop,
                  scrollHeight: scrollHeight,
                  clientHeight: clientHeight
               }
            });
         },

         scrollHeight: 1000,
         clientHeight: 300,
         scrollTop: null
      };
   }

   function getEventHandlers() {
      return {
         onLoadTriggerTop: function() {assert.include(currentTriggers, 1, 'Incorrect callback 1, must be [' + currentTriggers.join(', ') + ']');},
         onLoadTriggerBottom: function() {assert.include(currentTriggers, 2, 'Incorrect callback 2, must be [' + currentTriggers.join(', ') + ']');},
         onListTop: function() {assert.include(currentTriggers, 3, 'Incorrect callback 3, must be [' + currentTriggers.join(', ') + ']');},
         onListBottom: function() {assert.include(currentTriggers, 4, 'Incorrect callback 4, must be [' + currentTriggers.join(', ') + ']');},

         onListScroll: function(st) {assert.equal(st, currentScrollTop, 'Incorrect current scrollTop ' + currentScrollTop + ', must be ' + st);}
      };
   }

   // Тестирование при доступном в браузере IntersectionObserver'е.
   // Все происходит синхронно, можно не создавать на каждый тест свой ScrollController
   describe('Controls/List/Controllers/ScrollControllerWithObserver', function() {
      var triggers, eventHandlers, scrollContainer, originalIntersectionObserver;

      //триггеры для IntersectionObserver
      triggers = {
         topLoadTrigger: 'topLoadTrigger',
         bottomLoadTrigger: 'bottomLoadTrigger',
         topListTrigger: 'topListTrigger',
         bottomListTrigger: 'bottomListTrigger'
      };

      eventHandlers = getEventHandlers();
      scrollContainer = createScrollContainer();

      //Подменяем реализацию IntersectionObserver для тестирования
      originalIntersectionObserver = global.IntersectionObserver;
      global.IntersectionObserver = function(callback){
         return {
            observe: function() {},
            fire: function(elements) {callback(elements);}
         }
      };

      var sw = new ScrollController ({
         triggers : triggers,
         scrollContainer: scrollContainer,
         loadOffset: 100,
         eventHandlers: eventHandlers
      });

      it('onLoadTriggerTop', function() {
         currentTriggers = [1];
         sw._observer.fire([{isIntersecting: true, target: 'topLoadTrigger'}]);
      });

      it('onLoadTriggerBottom', function() {
         currentTriggers = [2];
         sw._observer.fire([{isIntersecting: true, target: 'bottomLoadTrigger'}]);
      });

      it('onTopList', function() {
         currentTriggers = [3];
         sw._observer.fire([{isIntersecting: true, target: 'topListTrigger'}]);
      });
      it('onBottomList', function() {
         currentTriggers = [4];
         sw._observer.fire([{isIntersecting: true, target: 'bottomListTrigger'}]);
      });

      it('onListScroll', function() {
         currentScrollTop = 200;
         scrollContainer.onScroll(currentScrollTop);
      });

      //Возвращаем оригинальную реализацию IntersectionObserver
      global.IntersectionObserver = originalIntersectionObserver;
   });

   // Тестирование работы без IntersectionObserver
   // Из-за того, что ScrollController без IntersectionObserver'a работает через throttle, нужно
   // перед каждым тестом создавать свой ScrollController, иначе получается каша из событий, тесты путаются
   describe('Controls/List/Controllers/ScrollController', function() {
      var scrollController, eventHandlers, scrollContainer, originalIntersectionObserver;
      beforeEach(function() {
         //удаляем IntersectionObserver, если он вдруг есть
         originalIntersectionObserver = global.IntersectionObserver;
         global.IntersectionObserver = undefined;

         eventHandlers = getEventHandlers();
         scrollContainer = createScrollContainer();

         scrollController = new ScrollController ({
            triggers : {},
            scrollContainer: scrollContainer,
            loadOffset: 100,
            eventHandlers: eventHandlers
         })
      });

      it('onLoadTriggerTop', function() {
         currentTriggers = [1];
         currentScrollTop = 30;
         scrollContainer.onScroll(currentScrollTop, 1000, 400);
      });

      it('onLoadTriggerBottom', function() {
         currentTriggers = [2];
         currentScrollTop = 5050;
         scrollContainer.onScroll(currentScrollTop, 5500, 400);
      });

      it('onTopList', function() {
         currentTriggers = [1, 3];  //Одновременно сработают события onTopList и onLoadTriggerTop
         currentScrollTop = 0;
         scrollContainer.onScroll(currentScrollTop, 1000, 400);
      });

      it('onBottomList', function() {
         currentTriggers = [2, 4]; //Одновременно сработают события onBottomList и onLoadTriggerBottom
         currentScrollTop = 5100;
         scrollContainer.onScroll(currentScrollTop, 5500, 400);
      });

      it('onListScroll', function() {
         currentScrollTop = 200;
         scrollContainer.onScroll(currentScrollTop);
      });

      it('Scroll to [top, bottom, pageUp, pageDown]', function() {
         scrollController.scrollToTop();
         assert.equal(scrollController._options.scrollContainer.scrollTop, 0, 'Incorrect current scrollTop');

         scrollController.scrollToBottom();
         assert.equal(scrollController._options.scrollContainer.scrollTop, 1000, 'Incorrect current scrollTop');

         scrollController.scrollPageUp();
         assert.equal(scrollController._options.scrollContainer.scrollTop, 700, 'Incorrect current scrollTop after scrollPageUp');

         scrollController.scrollPageDown();
         assert.equal(scrollController._options.scrollContainer.scrollTop, 1000, 'Incorrect current scrollTop after scrollPageDown');
      });

      it('checkBoundaryContainer', function() {
         //достигнут и верх, и низ
         scrollController._options.scrollContainer.clientHeight = 1200;
         currentTriggers = [1, 2];
         scrollController.checkBoundaryContainer();

         //ничего не достигнуто
         scrollController._options.scrollContainer.clientHeight = 900;
         scrollController._options.scrollContainer.scrollTop = 50;
         currentTriggers = [];
         scrollController.checkBoundaryContainer();

         //досигнут низ
         scrollController._options.scrollContainer.scrollTop = 100;
         currentTriggers = [2];
         scrollController.checkBoundaryContainer();

         //досигнут верх
         scrollController._options.scrollContainer.scrollTop = 0;
         currentTriggers = [1];
         scrollController.checkBoundaryContainer();
      });

      afterEach(function() {
         //Возвращаем оригинальную реализацию IntersectionObserver
         global.IntersectionObserver = originalIntersectionObserver;
      });

   })
});