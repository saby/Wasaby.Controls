define(
   [
      'Controls/StickyHeader'
   ],
   function(StickyHeader) {
      'use strict';

      describe('Controls.StickyHeader', function() {
         describe('_listScrollHandler', function() {
            const listScrollHandler = StickyHeader.prototype._listScrollHandler;
            let self;

            beforeEach(function() {
               self = {};
            });

            //TODO: брать skip после https://online.sbis.ru/opendoc.html?guid=e7b57af4-478d-432a-b5c2-b5d2e33d55b2
            it.skip('listTop', function() {
               listScrollHandler.call(self, null, 'listTop', {});
               assert.deepEqual(self, {
                  _listTop: true
               });
            });

            //TODO: брать skip после https://online.sbis.ru/opendoc.html?guid=e7b57af4-478d-432a-b5c2-b5d2e33d55b2
            it.skip('scrollMove', function() {
               listScrollHandler.call(self, null, 'scrollMove');
               assert.deepEqual(self, {
                  _listTop: false
               });
            });


            it('canScroll', function() {
               listScrollHandler.call(self, null, 'canScroll');
               assert.deepEqual(self, {
                  _scrolling: true
               });
            });

            it('cantScroll', function() {
               listScrollHandler.call(self, null, 'cantScroll');
               assert.deepEqual(self, {
                  _scrolling: false
               });
            });

            it('_listScrollHandler https://online.sbis.ru/opendoc.html?guid=e7b57af4-478d-432a-b5c2-b5d2e33d55b2', function() {
               listScrollHandler.call(self, null, 'scrollMove', {scrollTop: -100});
               assert.deepEqual(self, {});

               listScrollHandler.call(self, null, 'scrollMove', {scrollTop: 0});
               assert.deepEqual(self, {});

               listScrollHandler.call(self, null, 'scrollMove', {scrollTop: 100});
               assert.deepEqual(self, {
                  _listTop: false
               });
            });
         });
      });
   }
);
