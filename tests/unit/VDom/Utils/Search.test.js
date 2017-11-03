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
            it('Search', function(done) {
               var search = new Search(
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
               }).addCallback(function(result) {
                  assert.equal(result.getCount(), 1);
                  assert.equal(result.at(0).get('name'), 'Sasha');
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
   
            it('check wrong params', function(done) {
               try {
                  new Search({searchParam: 'name'});
               } catch (e) {
                  try {
                     new Search({dataSource: source});
                  } catch (e) {
                     done();
                  }
               }
            });
         });
      });
   });