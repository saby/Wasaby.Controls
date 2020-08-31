import {NewControllerClass as ControllerClass} from 'Controls/search';
import {assert} from 'chai';
import {NewSourceController} from 'Controls/dataSource';
import {Memory, QueryWhereExpression} from 'Types/source';
import {createSandbox, SinonStub} from 'sinon';
import {IControllerOptions} from 'Controls/_dataSource/Controller';

const getMemorySource = (): Memory => {
   return new Memory({
      data: [
         {
            id: 0,
            title: 'test'
         },
         {
            id: 1,
            title: 'test1'
         },
         {
            id: 2,
            title: 'test'
         },
         {
            id: 3,
            title: 'test2'
         }
      ]
   });
};

const getSourceController = (options: Partial<IControllerOptions>) => {
   return new NewSourceController({
      dataLoadErrback: () => null,
      parentProperty: null,
      root: null,
      sorting: [],
      filter: {},
      keyProperty: 'id',
      source: getMemorySource(),
      navigation: {
         source: 'page',
         sourceConfig: {
            pageSize: 2,
            page: 0,
            hasMore: false
         }
      },
      ...options
   });
};

const defaultOptionsControllerClass = {
   minSearchLength: 3,
   searchDelay: 50,
   searchParam: 'test',
   searchValue: '',
   searchValueTrim: false,
   sourceController: getSourceController({})
};

const getControllerClass = (options) => {
   return new ControllerClass({
      ...defaultOptionsControllerClass,
      ...options
   });
};

describe('Controls/search:NewControllerClass', () => {
   const sandbox = createSandbox();

   let sourceController: NewSourceController;
   let controllerClass: ControllerClass;
   let getFilterStub: SinonStub;

   beforeEach(() => {
      sourceController = getSourceController({});
      controllerClass = getControllerClass({
         sourceController
      });
      getFilterStub = sandbox.stub(sourceController, 'getFilter');
   });
   afterEach(() => {
      sandbox.restore();
   });

   it('search method', () => {
      const filter: QueryWhereExpression<unknown> = {
         test: 'testValue'
      };
      controllerClass.search('test');

      assert.isTrue(getFilterStub.calledWith(filter));
   });

   it('search and reset', () => {
      const filter: QueryWhereExpression<unknown> = {
         test: 'testValue'
      };
      controllerClass.search('test');

      assert.isTrue(getFilterStub.calledWith(filter));

      controllerClass.reset();

      assert.isTrue(getFilterStub.calledWith({}));
      assert.isEmpty(controllerClass._searchValue);
   });

   it('search and update', () => {
      const filter: QueryWhereExpression<unknown> = {
         test: 'testValue'
      };
      const updatedFilter: QueryWhereExpression<unknown> = {
         test: 'updatedValue'
      };
      controllerClass.search('test');

      assert.isTrue(getFilterStub.calledWith(filter));

      controllerClass.update({
         searchValue: 'updatedValue'
      });

      assert.isTrue(getFilterStub.calledWith(updatedFilter));
   });

   it('search with empty searchValue should reset', () => {
      const filter: QueryWhereExpression<unknown> = {};
      controllerClass.search('');

      assert.isTrue(getFilterStub.calledWith(filter));
   });
});
