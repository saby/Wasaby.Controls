/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Data.MoveStrategy.Sbis',
      'js!SBIS3.CONTROLS.Data.Di',
      'js!SBIS3.CONTROLS.Data.Source.Provider.IRpc',
      'js!SBIS3.CONTROLS.Data.Collection.RecordSet'
   ],
   function (SbisMoveStrategy, Di, IRpc, RecordSet) {
      'use strict';
      var SbisBusinessLogic, moveStrategy;
      describe('SBIS3.CONTROLS.Data.MoveStrategy.Sbis', function() {

         beforeEach(function() {
            SbisBusinessLogic = (function() {
               var Mock = $ws.core.extend({}, [IRpc], {
                  _cfg: {},
                  $constructor: function (cfg) {
                     this._cfg = cfg;
                  },
                  call: function (method, args) {
                     var def = new $ws.proto.Deferred();
                     setTimeout(function () {
                        def.callback(true);
                     }.bind(this), 1);
                     Mock.lastRequest = {method:method, args:args};
                     return def;
                  }
               });

               Mock.lastRequest = {};

               return Mock;
            })();

            //Replace of standard with mock
            Di.register('source.provider.sbis-business-logic', SbisBusinessLogic);
            moveStrategy = new SbisMoveStrategy({resource: 'test'});
         });

         describe('move()', function() {
            var  id1 = 1, id2 = 2, rs, rsComplex;
            beforeEach(function(){
               rs = new RecordSet({
                  rawData:[{
                     'id': id1,
                     'name': 'Иванов'
                  }, {
                     'id': id2,
                     'name': 'Петров'
                  }],
                  idProperty: 'id'
               });
               rsComplex = new RecordSet({
                  rawData:[{
                     'id': id1+',A',
                     'name': 'Иванов'
                  }, {
                     'id': id2+',A',
                     'name': 'Петров'
                  }],
                  idProperty: 'id'
               });
            });

            it('should move record to up', function() {
               moveStrategy.move([rs.at(0)], rs.at(1), false);
               assert.equal(SbisBusinessLogic.lastRequest.args.ИдОДо[0], id2);
               assert.equal(SbisBusinessLogic.lastRequest.args.ИдО[0], id1);
            });

            it('should move record to down', function() {
               moveStrategy.move([rs.at(0)], rs.at(1), true);
               assert.equal(SbisBusinessLogic.lastRequest.args.ИдОПосле[0], id2);
               assert.equal(SbisBusinessLogic.lastRequest.args.ИдО[0], id1);
            });

            it('should move record with complex id to up', function() {
               moveStrategy.move([rsComplex.at(0)], rsComplex.at(1), false);
               assert.equal(SbisBusinessLogic.lastRequest.args.ИдОДо[0], id2);
               assert.equal(SbisBusinessLogic.lastRequest.args.ИдО[0], id1);
            });

            it('should move record with complex id to down', function() {
               moveStrategy.move([rsComplex.at(0)], rsComplex.at(1), true);
               assert.equal(SbisBusinessLogic.lastRequest.args.ИдОПосле[0], id2);
               assert.equal(SbisBusinessLogic.lastRequest.args.ИдО[0], id1);
            });
         });
      });
   }
);
