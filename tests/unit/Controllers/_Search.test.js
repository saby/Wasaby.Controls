/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   [
      'Controls/Controllers/_Search',
      'WS.Data/Source/Memory',
      'Core/Deferred'
   ],
   function (Search, Memory, Deferred) {
      
      'use strict';
      
      describe('Controls/Controllers/_Search', function () {
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
            },
            navigationSmallPageSize = {
               source: 'page',
               sourceConfig: {
                  pageSize: 1,
                  page: 0,
                  mode: 'totalCount'
               }
            },
            sorting = [{name: 'DESC'}];
   
         it('.search', function(done) {
            var search = new Search({
               source: source,
               searchDelay: 50,
               navigation: navigation
            });
            var searchWithSorting = new Search({
               source: source,
               searchDelay: 50,
               navigation: navigation,
               sorting: sorting
            });
            
            search.search({name: 'Sasha'}).addCallback(function(result) {
               assert.equal(result.data.getCount(), 1);
               assert.equal(result.data.at(0).get('name'), 'Sasha');
   
               searchWithSorting.search().addCallback(function (result) {
                  assert.equal(result.data.getCount(), 4);
                  assert.equal(result.data.at(0).get('name'), 'Sasha');
                  assert.equal(result.data.at(3).get('name'), 'Aleksey');
                  done();
               });
               
               return result;
            });
         });
         
         it('abort Search', function(done) {
            var search  = new Search(
               {
                  source: source,
                  searchDelay: 50,
                  navigation: navigation
               }
            );
            var searchDef = search.search({name: 'Sasha'});
            
            search.abort();
            
            searchDef.addErrback(function(err) {
               done();
               return err;
            });
            
         });
         
         it('double Search', function(done) {
            var search = new Search(
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
            var sourceErr = new Memory();
            sourceErr.query = function() {
               return Deferred.fail();
            };
            var search  = new Search(
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
            var search  = new Search(
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
               new Search({});
            } catch (e) {
               done();
            }
         });
      });
   });