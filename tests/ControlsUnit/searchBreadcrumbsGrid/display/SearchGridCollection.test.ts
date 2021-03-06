import { BreadcrumbsItemRow, SearchGridCollection, SearchSeparatorRow } from 'Controls/searchBreadcrumbsGrid';
import { assert } from 'chai';
import getRecordSet from './getRecordSet';

describe('Controls/_searchBreadcrumbsGrid/display/SearchGridCollection', () => {
   const searchGridCollection = new SearchGridCollection({
      collection: getRecordSet(),
      root: null,
      keyProperty: 'id',
      parentProperty: 'parent',
      nodeProperty: 'node',
      columns: [{
         displayProperty: 'title',
         width: '300px',
         template: 'wml!template1'
      }, {
         displayProperty: 'taxBase',
         width: '200px',
         template: 'wml!template1'
      }]
   });

   describe('getSearchBreadcrumbsItemTemplate', () => {
      it('return default value', () => {
         assert.equal(
            searchGridCollection.getSearchBreadcrumbsItemTemplate(),
            'Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate'
         );
      });
   });

   describe('createBreadcrumbsItem', () => {
      it('createBreadcrumbsItem', () => {
         const item = searchGridCollection.createBreadcrumbsItem({});
         assert.instanceOf(item, BreadcrumbsItemRow);
      });
   });

   describe('createSearchSeparator', () => {
      it('createSearchSeparator', () => {
         const item = searchGridCollection.createSearchSeparator({});
         assert.instanceOf(item, SearchSeparatorRow);
      });
   });
});
