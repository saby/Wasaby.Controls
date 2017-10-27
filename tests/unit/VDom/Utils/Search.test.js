/**
 * Created by am.gerasimov on 06.03.2017.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   [
      'js!Controls/List/resources/utils/Search',
      'WS.Data/Source/Memory'
   ],
   function (Search, Memory) {
      
      'use strict';
      
      describe('Controls.Lists.utils.Search', function () {
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
                   name: 'Ыфырф'
                }
             ],
             source = new Memory({
                data: data
             });
         
         describe('search', function() {
            it('Search without kbLayoutRevert', function(done) {
               var search = new Search(
                  {
                     searchParam: 'name',
                     dataSource: source,
                     kbLayoutRevert: false,
                     searchDelay: 50
                  }
               );
               search.search({
                  filter: {
                     name: 'Sasha'
                  },
                  pageSize: 5
               }).addCallback(function(result) {
                  assert.isFalse(result.translated);
                  assert.equal(result.result.getCount(), 1);
                  assert.equal(result.result.at(0).get('name'), 'Sasha');
                  done();
                  return result;
               });
            });
   
            it('Search with kbLayoutRevert', function(done) {
               var search  = new Search(
                  {
                     searchParam: 'name',
                     dataSource: source,
                     kbLayoutRevert: true,
                     searchDelay: 50
                  }
               );
               search.search({
                  filter: {
                     name: 'Sasha'
                  },
                  pageSize: 5
               }).addCallback(function(result) {
                  assert.isTrue(result.translated);
                  assert.equal(result.result.getCount(), 2);
                  assert.equal(result.result.at(0).get('name'), 'Sasha');
                  assert.equal(result.result.at(1).get('name'), 'Ыфырф');
                  done();
                  return result;
               });
            });
   
            it('abort Search', function(done) {
               var search  = new Search(
                  {
                     searchParam: 'name',
                     dataSource: source,
                     searchDelay: 50
                  }
               );
               var searchDef = search.search({
                  filter: {
                     name: 'Sasha'
                  },
                  pageSize: 5
               });
   
               search.abort();
   
               searchDef.addErrback(function(err) {
                  done();
                  return err;
               });
               
            });
   
            it('destroy Search', function() {
               var search  = new Search(
                  {
                     searchParam: 'name',
                     dataSource: source,
                     searchDelay: 50
                  }
               );
               search.search({
                  filter: {
                     name: 'Sasha'
                  },
                  pageSize: 5
               });
   
               search.destroy();
               assert.equal(search._searchDeferred, null);
            });
         });
      });
   });