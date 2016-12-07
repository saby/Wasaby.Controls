/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   ['js!SBIS3.CONTROLS.Action.Action', 'Core/Deferred'],
   function (ActionBase, Deferred) {
      'use strict';

      describe('SBIS3.CONTROLS.Action.Action', function () {
         var actionBase;

         beforeEach(function () {
            actionBase = new ActionBase();
         });

         describe('.execute()', function () {
            it('should return deffered', function () {
               var def = actionBase.execute();
               assert.isTrue((def instanceof Deferred));
            });

            it('should notify onExecuted', function (done) {
               var params = {'test': '1'};
               actionBase.subscribe('onExecuted', function (e, meta) {
                  try {
                     assert.equal(meta, params);
                  } catch (error) {
                     done(error);
                  }
                  done();
               });
               actionBase.execute(params);
            });

            it('should notify onExecute', function (done) {
               var params = {'test': '1'};
               actionBase.subscribe('onExecute', function (e, meta) {
                  try {
                     assert.equal(meta, params);
                  } catch (error) {
                     done(error);
                  }
                  done();
               });
               actionBase.execute(params);
            });

            it('should call _doExecute', function (done){
               var params = {'test': '1'},
                  myAction = new (ActionBase.extend({
                     _doExecute: function (meta) {
                        try {
                           assert.equal(meta, params);
                        } catch (e) {
                           done(e);
                        }
                        done();
                     }
                  }));
               myAction.execute(params);
            });

            it('should notify onError', function (done) {
               var myAction = new (ActionBase.extend({
                  _doExecute: function () {
                     return Deferred.fail(new Error());
                  }
               }));
               myAction.subscribe('onError', function () {
                  done();
               });
               myAction.execute();
            });
         });

         describe('.setCanExecute', function(){
            it('should set CanExecute', function () {
               actionBase.setCanExecute(true);
               assert.equal(actionBase.isCanExecute(), true);
               actionBase.setCanExecute(false);
               assert.equal(actionBase.isCanExecute(), false);
            });

            it('should notify onChangeCanExecute', function (done) {
               actionBase.subscribe('onChangeCanExecute', function(){
                  done();
               });
               actionBase.setCanExecute(false);
            });
         });

         describe('._callHandlerMethod', function(){
            it('should execute got method', function (done) {
               var myAct = new (ActionBase.extend({
                  _exec:function(){
                     done();
                  }
               }));
               myAct._callHandlerMethod({}, 'onExecute', '_exec');
            });

            it('should notify got events', function (done) {
               actionBase.subscribe('onExecuted', function(){
                  done();
               });
               actionBase._callHandlerMethod({}, 'onExecuted');
            });

            it('should not execute method when event return false', function (done) {
               var myAct = new (ActionBase.extend({
                  _exec:function(){
                     done(new Error());
                  }
               }));
               myAct.subscribe('onExecute', function(e){
                  e.setResult(false);
               });
               myAct._callHandlerMethod({}, 'onExecute', '_exec').addCallback(function(){
                  done();
               });
            });

            it('should not execute method when event return custom', function (done) {
               var myAct = new (ActionBase.extend({
                  _exec:function(){
                     done(new Error());
                  }
               }));
               myAct.subscribe('onExecute', function(e) {
                  e.setResult(ActionBase.ACTION_CUSTOM);
               });
               myAct._callHandlerMethod({}, 'onExecute', '_exec').addCallback(function(){
                  done();
               });
            });

            it('should execute method which will return from event', function (done) {
               var myAct = new (ActionBase.extend({
                  _exec:function(){
                     done(new Error());
                  },
                  _exec2:function(){
                     done();
                  }
               }));
               myAct.subscribe('onExecute', function(e) {
                  e.setResult('_exec2');
               });
               myAct._callHandlerMethod({}, 'onExecute', '_exec');
            });

            it('should execute method which will return deffered which will have returned event', function (done) {
               var myAct = new (ActionBase.extend({
                  _exec:function(){
                     done(new Error());
                  },
                  _exec2:function(){
                     done();
                  }
               }));
               myAct.subscribe('onExecute', function(e) {
                  var def = new Deferred();
                  def.addCallback(function(){
                     return '_exec2';
                  });
                  window.setTimeout(function(){
                     def.callback(true);
                  },0);
                  return e.setResult(def);
               });
               myAct._callHandlerMethod({}, 'onExecute', '_exec');
            });

            it('should not execute method if will event returns deffered which will have returned false', function (done) {
               var myAct = new (ActionBase.extend({
                  _exec:function(){
                     done(new Error());
                  }
               }));
               myAct.subscribe('onExecute', function(e) {
                  var def = new Deferred();
                  def.addCallback(function(){
                     return false;
                  });
                  window.setTimeout(function(){
                     def.callback(true);
                  },0);
                  return e.setResult(def);
               });
               myAct._callHandlerMethod({}, 'onExecute', '_exec').addCallback(function(){
                  done();
               });
            });

            it('should not execute method if will event returns deffered which will have returned custom', function (done) {
               var myAct = new (ActionBase.extend({
                  _exec:function() {
                     done(new Error());
                  }
               }));
               myAct.subscribe('onExecute', function(e) {
                  var def = new Deferred();
                  def.addCallback(function(){
                     return ActionBase.ACTION_CUSTOM;
                  });
                  window.setTimeout(function(){
                     def.callback(true);
                  },0);
                  return e.setResult(def);
               });
               myAct._callHandlerMethod({}, 'onExecute', '_exec').addCallback(function(){
                  done();
               });
            });
         });


      });
   }
);
