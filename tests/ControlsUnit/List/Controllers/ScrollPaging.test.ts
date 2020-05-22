import { assert } from 'chai';
import {default as ScrollPaging} from 'Controls/_list/Controllers/ScrollPaging';
 describe('Controls.Controllers.ScrollPaging', function () {
   describe('constructor', function () {
      it('top position', () => {
         var result;
         var spInstance = new ScrollPaging({
            scrollParams: {
               scrollTop: 0,
               scrollHeight: 150,
               clientHeight: 50
            },
            pagingCfgTrigger: function(cfg) {
               result = cfg;
            }
         });
         assert.equal('top', spInstance._curState, 'Wrong curState after ctor');

         assert.deepEqual({
            backwardEnabled: false,
            forwardEnabled: true,
         }, result, 'Wrong pagingCfg after ctor');
      });
      it('middle position', () => {
         var result;
         var spInstance = new ScrollPaging({
            scrollParams: {
               scrollTop: 50,
               scrollHeight: 150,
               clientHeight: 50
            },
            pagingCfgTrigger: function(cfg) {
               result = cfg;
            }
         });
         assert.equal('middle', spInstance._curState, 'Wrong curState after ctor');

         assert.deepEqual({
            backwardEnabled: true,
            forwardEnabled: true,
         }, result, 'Wrong pagingCfg after ctor');
      });it('top position', () => {
         var result;
         var spInstance = new ScrollPaging({
            scrollParams: {
               scrollTop: 100,
               scrollHeight: 150,
               clientHeight: 50
            },
            pagingCfgTrigger: function(cfg) {
               result = cfg;
            }
         });
         assert.equal('bottom', spInstance._curState, 'Wrong curState after ctor');

         assert.deepEqual({
            backwardEnabled: true,
            forwardEnabled: false,
         }, result, 'Wrong pagingCfg after ctor');
      });
   });
   describe('scroll', function () {
      var result;
      var spInstance = new ScrollPaging({
         scrollParams: {
            scrollTop: 0,
            scrollHeight: 150,
            clientHeight: 50
         },
         pagingCfgTrigger: function(cfg) {
            result = cfg;
         }
      });
      it('middle', () => {
         spInstance.handleScroll('middle');
         assert.equal('middle', spInstance._curState, 'Wrong curState after scroll');
         assert.deepEqual({
            backwardEnabled: true,
            forwardEnabled: true,
         }, result, 'Wrong pagingCfg after scroll');
      });
      it('top', () => {
         spInstance.handleScroll('up');
         assert.equal('top', spInstance._curState, 'Wrong curState after scroll to top');
         assert.deepEqual({
            backwardEnabled: false,
            forwardEnabled: true,
         }, result, 'Wrong pagingCfg after scroll');
      });
      it('bottom', () => {
         spInstance.handleScroll('down');
         assert.equal('bottom', spInstance._curState, 'Wrong curState after scroll to bottom');
         assert.deepEqual({
            backwardEnabled: true,
            forwardEnabled: false,
         }, result, 'Wrong pagingCfg after scroll');
      });
   });
   describe('updateScrollParams', () => {
      var result;
      var spInstance = new ScrollPaging({
         scrollParams: {
            scrollTop: 150,
            scrollHeight: 250,
            clientHeight: 50
         },
         pagingCfgTrigger: function(cfg) {
            result = cfg;
         }
      });
      it('make big window and reach bottom', () => {
         spInstance.updateScrollParams({
            scrollTop: 150,
            scrollHeight: 250,
            clientHeight: 100
         });
         assert.equal('bottom', spInstance._curState, 'Wrong curState after updateScrollParams');
         assert.deepEqual({
            backwardEnabled: true,
            forwardEnabled: false,
         }, result, 'Wrong pagingCfg after scroll');
      });
   });
});
