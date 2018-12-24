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
               name: 'Sasha',
               id: 0
            },
            {
               name: 'Aleksey',
               id: 1
            },
            {
               name: 'Dmitry',
               id: 2
            },
            {
               name: 'Dmitry',
               id: 3
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
         },
         sorting = [{id: 'DESC'}];
      
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
            var searchStarted = false
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
                  assert.isTrue(searchStarted);
                  assert.isTrue(filter !== resFilter);
                  done();
               },
               abortCallback: function() {
                  aborted = true;
               },
               searchStartCallback: function() {
                  searchStarted = true;
               }
            });
            
            searchController.search('');
            searchController.search('Sasha');
         });
   
         it('search with sorting', function(done) {
            var filter = {};
            var searchController = new Search({
               minSearchLength: 0,
               source: source,
               sorting: sorting,
               navigation: navigation,
               searchDelay: 0,
               searchParam: 'name',
               filter: filter,
               searchCallback: function(res) {
                  assert.equal(res.data.getCount(), 2);
                  assert.equal(res.data.at(0).get('id'), 3);
                  assert.equal(res.data.at(1).get('id'), 2);
                  done();
               }
            });
      
            searchController.search('Dmitry');
         });
         
      });
   });