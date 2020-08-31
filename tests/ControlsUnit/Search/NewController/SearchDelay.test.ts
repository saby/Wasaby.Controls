import {SearchDelay} from 'Controls/search';
import {assert} from 'chai';
import * as sinon from 'sinon';
import {ISearchDelayOptions} from 'Controls/_search/NewController/SearchDelay';

const defaultOptions = {
   searchCallback: () => null,
   searchResetCallback: () => null
};

const initSearchDelay = (options?: Partial<ISearchDelayOptions>) => {
   const searchCallback = sinon.stub();
   const searchDelay = new SearchDelay({
      ...defaultOptions,
      searchCallback,
      ...options
   });
   return {
      searchDelay, searchCallback
   };
};

describe('Controls/search:SearchDelay', () => {
   const now = new Date().getTime();

   describe('delayTime', () => {
      it('should callback when delay is undefined', () => {
         const {searchDelay, searchCallback} = initSearchDelay({
            minSearchLength: 3
         });

         searchDelay.resolve('test');
         assert.isTrue(searchCallback.called);
      });

      it('should callback when delay is 0', () => {
         const {searchDelay, searchCallback} = initSearchDelay({
            minSearchLength: 3,
            delayTime: 0
         });

         searchDelay.resolve('test');
         assert.isTrue(searchCallback.called);
      });

      it('should callback after delay', () => {
         const clock = sinon.useFakeTimers({
            now, toFake: ['setTimeout', 'clearTimeout']
         });
         const {searchDelay, searchCallback} = initSearchDelay({
            minSearchLength: 3,
            delayTime: 1000
         });

         searchDelay.resolve('test');
         clock.tick(1001);
         assert.isTrue(searchCallback.called);

         clock.restore();
      });
   });

   describe('minSearchValueLength', () => {
      it('should resetCallback when value is empty', () => {
         const clock = sinon.useFakeTimers({
            now, toFake: ['setTimeout', 'clearTimeout']
         });
         const searchResetCallback = sinon.stub();
         const {searchDelay, searchCallback} = initSearchDelay({
            minSearchLength: 3,
            delayTime: 1000,
            searchResetCallback
         });

         searchDelay.resolve('');
         clock.tick(1001);

         assert.isFalse(searchCallback.called);
         assert.isTrue(searchResetCallback.called);

         clock.restore();
      });

      it('should resetCallback when value is null', () => {
         const clock = sinon.useFakeTimers({
            now, toFake: ['setTimeout', 'clearTimeout']
         });
         const searchResetCallback = sinon.stub();
         const {searchDelay, searchCallback} = initSearchDelay({
            minSearchLength: 3,
            delayTime: 1000,
            searchResetCallback
         });

         searchDelay.resolve(null);
         clock.tick(1001);

         assert.isFalse(searchCallback.called);
         assert.isTrue(searchResetCallback.called);

         clock.restore();
      });

      it('shouldn\'t callback when minSearchValueLength is undefined', () => {
         const clock = sinon.useFakeTimers({
            now, toFake: ['setTimeout', 'clearTimeout']
         });
         const {searchDelay, searchCallback} = initSearchDelay({
            delayTime: 1000
         });

         searchDelay.resolve('test');
         clock.tick(1001);
         assert.isFalse(searchCallback.called);

         clock.restore();
      });

      it('shouldn\'t callback when minSearchValueLength is null and valueLength is 0', () => {
         const searchResetCallback = sinon.stub();
         const {searchDelay, searchCallback} = initSearchDelay({
            delayTime: 1000,
            minSearchLength: null,
            searchResetCallback
         });

         searchDelay.resolve('');

         assert.isFalse(searchCallback.called);
         assert.isTrue(searchResetCallback.called);
      });

      it('shouldn\'t callback when minSearchValueLength is null', () => {
         const clock = sinon.useFakeTimers({
            now, toFake: ['setTimeout', 'clearTimeout']
         });
         const searchResetCallback = sinon.stub();
         const {searchDelay, searchCallback} = initSearchDelay({
            delayTime: 1000,
            minSearchLength: null,
            searchResetCallback
         });

         searchDelay.resolve('test');

         clock.tick(1001);
         assert.isFalse(searchCallback.called);
         assert.isFalse(searchResetCallback.called);

         clock.restore();
      });

      it('should callback when minSearchValueLength is 0', () => {
         const clock = sinon.useFakeTimers({
            now, toFake: ['setTimeout', 'clearTimeout']
         });
         const {searchDelay, searchCallback} = initSearchDelay({
            minSearchLength: 0,
            delayTime: 1000
         });

         searchDelay.resolve('t');
         clock.tick(1001);
         assert.isTrue(searchCallback.called);

         clock.restore();
      });
   });
});
