/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 10:16
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.FiltersWindow", ["js!SBIS3.CORE.FiltersArea"], function( FiltersArea ) {

   "use strict";


/**
   * Окно фильтров
   *
   * @class $ws.proto.FiltersWindow
   * @extends $ws.proto.FiltersArea
   * @control
   */
  $ws.proto.FiltersWindow = FiltersArea.extend(/** @lends $ws.proto.FiltersWindow.prototype */{
     _loadTemplate: function() {
        // HOTFIX DETECTED - похоже что это можно выровнять не таким хардкорным методом.
        var
              self = this,
              dR = new $ws.proto.Deferred(), // onReady окна
              dC = new $ws.proto.Deferred(), // дети на окне
              pD = new $ws.proto.ParallelDeferred({
                 steps: [ dR, dC ]
              });

        $ws.core.attachInstance('SBIS3.CORE.FiltersDialog', {
           template: this._options.template,
           opener: self,
           parent: self,
           linkedContext: this.getLinkedContext(),
           context: self.getLinkedContext(),
           handlers: {
              onReady: function() {
                 dR.callback();
              },
              onAfterClose: function() {
                 self._childControls = [];
                 self.destroy();
              },
              onAfterLoad: function(){
                 self._childControls = this.getImmediateChildControls();
              }
           }
        }).addCallback(function(instance){
           dC.callback();
           $ws.single.CommandDispatcher.declareCommand(instance, 'applyFilter', function(){
              self.applyFilter();
              instance.close();
              return true;
           });
           $ws.single.CommandDispatcher.declareCommand(instance, 'resetFilter', function(){
              self.resetFilter();
              instance.close();
              return true;
           });
        });

        pD.done().getResult().addCallback(function(){
           self._notify('onReady');
        });

        return new $ws.proto.Deferred().callback();
     }
  });

   return $ws.proto.FiltersWindow;

});
