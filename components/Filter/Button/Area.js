/**
 * Created by am.gerasimov on 05.04.2017.
 */
define('SBIS3.CONTROLS/Filter/Button/Area',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/Filter/Button/Area/FilterButtonArea',
      'SBIS3.CONTROLS/History/HistoryListUtils',
      'SBIS3.CONTROLS/Filter/History',
      'SBIS3.CONTROLS/Link',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/ScrollContainer',
      'SBIS3.CONTROLS/Filter/Button/AdditionalParams',
      'SBIS3.CONTROLS/Filter/Button/History',
      'css!SBIS3.CONTROLS/Filter/Button/Area/FilterButtonArea'
   ], function(CompoundControl, dotTplFn, HistoryListUtils) {
      'use strict';
      
      /**
       * @class SBIS3.CONTROLS/Filter/Button/Area
       * @extends SBIS3.CONTROLS/CompoundControl
       * @author Герасимов А.М.
       * @control
       * @public
       */
      
      var FilterButtonArea = CompoundControl.extend([], /** @lends SBIS3.CONTROLS/Filter/Button/Area.prototype */ {
         _dotTplFn: dotTplFn,
         
         init: function() {
            FilterButtonArea.superclass.init.apply(this, arguments);
            if (this._options.historyId && this._options.viewMode === 'twoColumns') {
               var self = this;
               HistoryListUtils.loadHistoryLists(self, self._options.historyId).addCallback(function(res) {
                  if(HistoryListUtils.hasHistory(self._options.historyId)) {
                     self.getContainer().find('.controls__filterButton__area-secondColumn').removeClass('ws-hidden');
                     self.subscribeTo(self.getChildControlByName('filterHistory'), 'onItemActivate', self._applyFromHistory.bind(self));
                  }
                  self.once('onDestroy', function() {
                     for (var i  in res) {
                        if (res.hasOwnProperty(i)) {
                           res[i].destroy();
                        }
                     }
                  });
                  return res;
               });
            }
         },

         _applyFromHistory: function(event, historyItem, isFavorite, isGlobal) {
            this.sendCommand('applyHistoryFilter', historyItem, isFavorite, isGlobal);
         }

      });

      return FilterButtonArea;
   });