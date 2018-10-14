/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   [
      'Controls/Controllers/_SearchController',
      'WS.Data/Source/Memory'
   ],
   function(Search, Memory) {
      
      'use strict';
      
      var data = [
            {
               name: 'Sasha'
            },
            {
               name: 'Aleksey'
            },
            {
               name: 'Dmitry'
            },
            {
               name: 'Dmitry'
            }
         ],
         source = new Memory({
            data: data
         }),
         navigation = {
            source: 'page',
            sourceConfig: {
               pageSize: 10,
               page: 0,
               mode: 'totalCount'
            }
         };
      
      describe('Controls/Controllers/_SearchController', function() {
         
         it('setFilter', function() {
            var filter = {test: 'test'};
            var searchController = new Search({});
            
            searchController.setFilter(filter);
            assert.deepEqual(filter, {test: 'test'});
         });
         
         
         it('getFilter', function() {
            var filter = {test: 'test'};
            var searchController = new Search({});
            
            searchController.setFilter(filter);
            assert.deepEqual(searchController.getFilter(), {test: 'test'});
         });
         
         it('search', function(done) {
            var filter = {};
            var aborted = false;
            var searchController = new Search({
               minSearchLength: 3,
               source: source,
               navigation: navigation,
               searchDelay: 0,
               searchParam: 'name',
               filter: filter,
               searchCallback: function(res, resFilter) {
                  assert.equal(res.data.getCount(), 1);
                  assert.equal(res.data.at(0).get('name'), 'Sasha');
                  assert.isTrue(aborted);
                  assert.isTrue(filter !== resFilter);
                  done();
               },
               abortCallback: function() {
                  aborted = true;
               }
            });
            
            searchController.search('');
            searchController.search('Sasha');
         });
         
      });
   });