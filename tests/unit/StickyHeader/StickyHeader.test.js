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

            it('listTop', function() {
               listScrollHandler.call(self, null, 'listTop', {});
               assert.deepEqual(self, {
                  _listTop: true
               });
            });

            it('scrollMove', function() {
               listScrollHandler.call(self, null, 'scrollMove', {});
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
         });
      });
   }
);
