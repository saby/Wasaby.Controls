import {assert} from 'chai';
import {InputContainer} from 'Controls/search';
import * as sinon from 'sinon';

describe('Controls/_search/Input/Container', () => {

   const sandbox = sinon.createSandbox();

   afterEach(() => sandbox.restore());

   it('_beforeUpdate', () => {
      const cont = new InputContainer({});
      cont.saveOptions({});
      cont._value = '';

      cont._beforeUpdate({inputSearchValue: 'test'});
      assert.equal(cont._value, 'test');
   });

   it('_notifySearch', () => {
      const cont = new InputContainer({});
      const stub = sandbox.stub(cont, '_notify');

      cont._notifySearch('test');
      assert.isTrue(stub.withArgs('search', ['test']).calledOnce);
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

   // it('_keyDown', () => {
   //    var cont = new searchMod.InputContainer();
   //    let propagationStopped = false;
   //    let event = {
   //       stopPropagation: () => {
   //          propagationStopped = true;
   //       },
   //       nativeEvent: {
   //          which: 13 //enter
   //       }
   //    };
   //
   //    cont._keyDown(event);
   //    assert.isTrue(propagationStopped);
   // });

   describe('_valueChanged', () => {
      const cont = new InputContainer({});
      let notified = false;

      const resolveStub = sandbox.stub(cont._searchResolverController, 'resolve');

      cont._value = '';
      cont._notify = (eventName, args) => {
         if (eventName === 'search') {
            notified = true;
         }
      };

      it('new value not equally old value', () => {
         cont._valueChanged(null, 'newValue');

         assert.equal(cont._value, 'newValue');
         assert.isTrue(resolveStub.withArgs('').calledOnce);
         assert.isTrue(notified);

         resolveStub.reset();
      });

      it('new value equally old value', () => {
         notified = false;
         cont._valueChanged(null, 'newValue');

         assert.isTrue(resolveStub.notCalled);
         assert.isFalse(notified);
      });
   });
});
