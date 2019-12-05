/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   [
      'Controls/search',
      'Types/source',
      'Core/Deferred',
      'Types/entity',
      'Types/collection'
   ],
   function (searchLib, sourceLib, Deferred) {

      'use strict';

      describe('Controls/search:_Search', function () {
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
            source = new sourceLib.Memory({
               data: data
            }),
            navigation = {
               source: 'page',
               sourceConfig: {
                  pageSize: 10,
                  page: 0,
                  hasMore: false
               }
            },
            navigationSmallPageSize = {
               source: 'page',
               sourceConfig: {
                  pageSize: 1,
                  page: 0,
                  hasMore: false
               }
            },
            sorting = [{name: 'DESC'}];

         describe('.search', function() {
            it('simple search', function() {
               return new Promise(function(resolve) {
                  var searchStarted = false;
                  var search = new searchLib._Search({
                     source: source,
                     searchDelay: 50,
                     navigation: navigation,
                     searchStartCallback: function() {
                        searchStarted = true;
                     }
                  });

                  search.search({name: 'Sasha'}).addCallback(function(result) {
                     assert.equal(result.data.getCount(), 1);
                     assert.equal(result.data.at(0).get('name'), 'Sasha');
                     assert.isTrue(searchStarted);
                     resolve();
                     return result;
                  });
               });
            });

            it('search with sorting', function() {
               return new Promise(function(resolve) {
                  var searchWithSorting = new searchLib._Search({
                     source: source,
                     searchDelay: 50,
                     navigation: navigation,
                     sorting: sorting
                  });

                  searchWithSorting.search().addCallback(function (result) {
                     assert.equal(result.data.getCount(), 4);
                     assert.equal(result.data.at(0).get('name'), 'Sasha');
                     assert.equal(result.data.at(3).get('name'), 'Aleksey');
                     resolve();
                  });
               });
            });

            it('search with prefetch source', function() {
               return new Promise(function(resolve) {
                  var prefetchProxy = new sourceLib.PrefetchProxy({
                     target: source,
                     data: {
                        query: data
                     }
                  });
                  var search = new searchLib._Search({
                     source: prefetchProxy,
                     searchDelay: 50,
                     navigation: navigation
                  });
                  prefetchProxy.query();
                  search.search({name: 'Sasha'}).addCallback(function(result) {
                     assert.equal(result.data.getCount(), 1);
                     assert.equal(result.data.at(0).get('name'), 'Sasha');
                     resolve();
                     return result;
                  });
               });
            });
         });

         it('.search forced', function() {
            var searchStarted = false;
            var search = new searchLib._Search({
               source: source,
               searchDelay: 1000,
               navigation: navigation,
               searchStartCallback: () => {
                  searchStarted = true;
               }
            });


            search.search({}, true);
            assert.isTrue(searchStarted);
         });

         it('abort Search', function() {
            var search = new searchLib._Search(
               {
                  source: source,
                  searchDelay: 50,
                  navigation: navigation
               }
            );
            var searchDef = search.search({ name: 'Sasha' });

            //forced nbort
            search.abort();
            assert.isFalse(search._searchDeferred.isReady());
            assert.isTrue(!!search._searchDelayTimer, 'not forced abort work synchronously');

            return new Promise(function(resolve) {
               searchDef.addErrback(function(err) {
                  searchDef = search.search({ name: 'Sasha' });
                  search.abort(true);
                  assert.isTrue(!search._searchDeferred);
                  assert.equal(search._searchDelayTimer, null, 'forced abort work asynchronously');

                  search.search({ name: 'Sasha' }, true);
                  search.abort(true);
                  assert.isTrue(!!search._searchDeferred);

                  resolve();
                  return err;
               });
            });
         });

         it('double Search', function(done) {
            var search = new searchLib._Search(
               {
                  source: source,
                  searchDelay: 50,
                  navigation: navigation
               }
               ),
               aborted;
            search.search({name: 'Aleksey'}).addErrback(function(result) {
               aborted = true;
               return result;
            });

            search.search({name: 'Sasha'}).addCallback(function(result) {
               assert.equal(result.data.getCount(), 1);
               assert.equal(result.data.at(0).get('name'), 'Sasha');
               assert.equal(aborted, true);
               done();
               return result;
            });
         });

         it('error Search', function(done) {
            var sourceErr = new sourceLib.Memory();
            sourceErr.query = function() {
               return Deferred.fail();
            };
            var search  = new searchLib._Search(
               {
                  source: sourceErr,
                  searchDelay: 50,
                  navigation: navigation
               }
            );
            var searchDef = search.search({name: 'Sasha'});
            searchDef.addErrback(function(err) {
               done();
               return err;
            });

         });

         it('check search navigation', function(done) {
            var search  = new searchLib._Search(
               {
                  source: source,
                  navigation: navigationSmallPageSize,
                  searchDelay: 50
               }
            );
            search.search({name: 'Dmitry'}).addCallback(function(res) {
               assert.equal(res.data.getCount(), 1);
               assert.equal(res.hasMore, true);
               done();
            });

         });

         it('check wrong params', function(done) {
            try {
               new searchLib._Search({});
            } catch (e) {
               done();
            }
         });
      });
   });
