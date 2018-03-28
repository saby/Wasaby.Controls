/**
 * Created by am.gerasimov on 23.01.2017.
 */
define('SBIS3.CONTROLS/Filter/ReportHistory',
   [
      'SBIS3.CONTROLS/Filter/HistoryBase',
      'tmpl!SBIS3.CONTROLS/Filter/ReportHistory/ReportHistory',
      'tmpl!SBIS3.CONTROLS/Filter/ReportHistory/favoriteItemTpl',
      'css!SBIS3.CONTROLS/Filter/ReportHistory/ReportHistory'
   ],

   function(HistoryBase, template, favoriteItemTpl) {

      'use strict';

      var ReportHistory = HistoryBase.extend({
         _dotTplFn: template,
         $protected: {
            _options: {
               _favoriteItemTpl: favoriteItemTpl,
               _filterProperty: 'filter',
               _structureProperty: 'filterPanelItems',
               _filterItemTextProperty: 'textValue',
               _favoriteAction: {
                  command: 'favorite',
                  name: 'favorite',
                  icon: 'icon-24 icon-Unfavourite icon-primary action-hover',
                  isMainAction: true
               },
               _unFavoriteAction: {
                  command: 'unfavorite',
                  name: 'unfavorite',
                  icon: 'icon-24 icon-Favourite icon-primary action-hover',
                  isMainAction: true
               },
               idProperty: 'id',
               displayProperty: 'textValue'
            }
         }
      });

      return ReportHistory;

   });