import {assert} from 'chai';
import {InputContainer} from 'Controls/search';
import * as sinon from 'sinon';
import Store from 'Controls/Store';

describe('Controls/_search/Input/Container', () => {

   const sandbox = sinon.createSandbox();

   afterEach(() => sandbox.restore());

   it('_beforeMount', () => {
      const cont = new InputContainer({});
      cont.saveOptions({});
      cont._value = '';

      cont._beforeMount({inputSearchValue: 'test'});
      assert.equal(cont._value, 'test');
   });

   it('_beforeUpdate', () => {
      const cont = new InputContainer({});
      cont.saveOptions({});
      cont._value = '';

      cont._beforeUpdate({inputSearchValue: 'test'});
      assert.equal(cont._value, 'test');
   });

   describe('_resolve', () => {
      it('search: useStore = false', () => {
         const cont = new InputContainer({});
         const stub = sandbox.stub(cont, '_notify');
         const dispatchStub = sandbox.stub(Store, 'dispatch');
         cont._options.useStore = false;

         cont._notifySearch('test');
         assert.isTrue(stub.withArgs('search', ['test']).calledOnce);
         assert.isFalse(dispatchStub.called);
      });

      it('search: useStore = true', () => {
         const cont = new InputContainer({});
         const stub = sandbox.stub(cont, '_notify');
         const dispatchStub = sandbox.stub(Store, 'dispatch');
         cont._options.useStore = true;

         cont._notifySearch('test');
         assert.isFalse(stub.called);
         assert.isTrue(dispatchStub.withArgs('searchValue', 'test').calledOnce);
      });

      it('searchReset: useStore = false', () => {
         const cont = new InputContainer({});
         const stub = sandbox.stub(cont, '_notify');
         const dispatchStub = sandbox.stub(Store, 'dispatch');
         cont._options.useStore = false;

         cont._notifySearchReset();
         assert.isTrue(stub.withArgs('searchReset', ['']).calledOnce);
         assert.isFalse(dispatchStub.called);
      });

      it('searchReset: useStore = true', () => {
         const cont = new InputContainer({});
         const stub = sandbox.stub(cont, '_notify');
         const dispatchStub = sandbox.stub(Store, 'dispatch');
         cont._options.useStore = true;

         cont._notifySearchReset();
         assert.isFalse(stub.called);
         assert.isTrue(dispatchStub.withArgs('searchValue', '').calledOnce);
      });
   });

   it('_searchClick', () => {
      const cont = new InputContainer({});
      cont._value = 'test';
      const stub = sandbox.stub(cont, '_notify');
      cont._searchClick(null);

      assert.isTrue(stub.withArgs('search', ['test']).calledOnce);
      stub.reset();

      cont._value = '';
      cont._searchClick(null);
      assert.isTrue(stub.notCalled);
   });

   it('_keyDown', () => {
      const cont = new InputContainer({});
      let propagationStopped = false;
      const event = {
         stopPropagation: () => {
            propagationStopped = true;
         },
         nativeEvent: {
            which: 13 // enter
         }
      };

      cont._keyDown(event);
      assert.isTrue(propagationStopped);
   });

   describe('_valueChanged', () => {
      const cont = new InputContainer({});
      let called = false;
      cont._searchResolverController = {resolve: (value) => {
         called = true;
      }};

      it('new value not equally old value', () => {
         cont._value = '';
         cont._valueChanged(null, 'newValue');

         assert.equal(cont._value, 'newValue');
         assert.isTrue(called);
      });

      it('new value equally old value', () => {
         called = false;
         cont._valueChanged(null, 'newValue');

         assert.isFalse(called);
      });
   });

   describe('_beforeUnmount', () => {
      let cont;
      beforeEach(() => {
         cont = new InputContainer({});
      });

      it('should clear the timer on searchResolverController', () => {
         cont._searchResolverController = {
            clearTimer: sandbox.stub()
         };

         cont._beforeUnmount();

         sinon.assert.calledOnce(cont._searchResolverController.clearTimer);
      });

      it('should not throw when the _searchResolverController doesn\'t exist', () => {
         assert.doesNotThrow(() => {
            cont._beforeUnmount();
         });
      });
   });
});
