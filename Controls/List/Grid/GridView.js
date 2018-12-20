define('Controls/List/Grid/GridView', [
   'Core/Deferred',
   'Controls/List/ListView',
   'wml!Controls/List/Grid/GridViewTemplateChooser',
   'wml!Controls/List/Grid/Item',
   'wml!Controls/List/Grid/Column',
   'wml!Controls/List/Grid/HeaderContent',
   'Core/detection',
   'Core/helpers/Object/isEqual',
   'wml!Controls/List/Grid/GroupTemplate',
   'wml!Controls/List/Grid/OldGridView',
   'wml!Controls/List/Grid/NewGridView',
   'wml!Controls/List/Grid/Header',
   'wml!Controls/List/Grid/Results',
   'wml!Controls/List/Grid/ColGroup',
   'css!theme?Controls/List/Grid/Grid',
   'Controls/List/BaseControl/Scroll/Emitter'
], function(cDeferred, ListView, GridViewTemplateChooser, DefaultItemTpl, ColumnTpl, HeaderContentTpl, cDetection,
   isEqualObject, GroupTemplate, OldGridView, NewGridView) {

   'use strict';

   // todo: removed by task https://online.sbis.ru/opendoc.html?guid=728d200e-ff93-4701-832c-93aad5600ced
   function isEqualWithSkip(obj1, obj2, skipFields) {
      if ((!obj1 && obj2) || (obj1 && !obj2)) {
         return false;
      }
      if (!obj1 && !obj2) {
         return true;
      }
      if (obj1.length !== obj2.length) {
         return false;
      }
      for (var i = 0; i < obj1.length; i++) {
         for (var j in obj1[i]) {
            if (!skipFields[j] && obj1[i].hasOwnProperty(j)) {
               if (!obj2[i].hasOwnProperty(j) || obj1[i][j] !== obj2[i][j]) {
                  return false;
               }
            }
         }
      }
      return true;
   }

   var
      _private = {
         prepareGridTemplateColumns: function(columns, multiselect) {
            var
               result = '';
            if (multiselect === 'visible' || multiselect === 'onhover') {
               result += 'auto ';
            }
            columns.forEach(function(column) {
               result += column.width ? column.width + ' ' : '1fr ';
            });
            return result;
         },
         prepareHeaderAndResultsIfFullGridSupport: function(results, header, container) {
            var
               resultsPadding,
               cells;
            if (results) {
               if (results.position === 'top') {
                  if (header) {
                     resultsPadding = container.getElementsByClassName('controls-Grid__header-cell')[0].getBoundingClientRect().height + 'px';
                  } else {
                     resultsPadding = '0';
                  }
               } else {
                  resultsPadding = 'calc(100% - ' + container.getElementsByClassName('controls-Grid__results-cell')[0].getBoundingClientRect().height + 'px)';
               }
               cells = container.getElementsByClassName('controls-Grid__results-cell');
               Array.prototype.forEach.call(cells, function(elem) {
                  elem.style.top = resultsPadding;
               });
            }
         },
         calcFooterPaddingClass: function(params) {
            var
               result = 'controls-GridView__footer controls-GridView__footer__paddingLeft_';
            if (params.multiSelectVisibility === 'onhover' || params.multiSelectVisibility === 'visible') {
               result += 'withCheckboxes';
            } else {
               result += params.paddingLeft || 'default';
            }
            return result;
         }
      },
      GridView = ListView.extend({
         _gridTemplate: null,
         isNotFullGridSupport: cDetection.isNotFullGridSupport,
         _template: GridViewTemplateChooser,
         _groupTemplate: GroupTemplate,
         _defaultItemTemplate: DefaultItemTpl,
         _headerContentTemplate: HeaderContentTpl,
         _prepareGridTemplateColumns: _private.prepareGridTemplateColumns,

         _beforeMount: function(cfg) {
            var
               requireDeferred = new cDeferred(),
               modules = [];
            this._gridTemplate = cDetection.isNotFullGridSupport ? OldGridView : NewGridView;
            if (cDetection.isNotFullGridSupport) {
               modules.push('css!theme?Controls/List/Grid/OldGrid');
            }
            GridView.superclass._beforeMount.apply(this, arguments);
            this._listModel.setColumnTemplate(ColumnTpl);
            require(modules, function() {
               requireDeferred.callback();
            });
            return requireDeferred;
         },

         _beforeUpdate: function(newCfg) {
            // todo removed by task https://online.sbis.ru/opendoc.html?guid=728d200e-ff93-4701-832c-93aad5600ced
            if (!isEqualWithSkip(this._options.columns, newCfg.columns, { template: true, resultTemplate: true })) {
               this._listModel.setColumns(newCfg.columns);
               if (!cDetection.isNotFullGridSupport) {
                  _private.prepareHeaderAndResultsIfFullGridSupport(this._listModel.getResults(), this._listModel.getHeader(), this._container);
               }
            }
            if (!isEqualWithSkip(this._options.header, newCfg.header, { template: true })) {
               this._listModel.setHeader(newCfg.header);
               if (!cDetection.isNotFullGridSupport) {
                  _private.prepareHeaderAndResultsIfFullGridSupport(this._listModel.getResults(), this._listModel.getHeader(), this._container);
               }
            }
         },

         _calcFooterPaddingClass: function(params) {
            return _private.calcFooterPaddingClass(params);
         },

         _afterMount: function() {
            GridView.superclass._afterMount.apply(this, arguments);
            if (!cDetection.isNotFullGridSupport) {
               _private.prepareHeaderAndResultsIfFullGridSupport(this._listModel.getResults(), this._listModel.getHeader(), this._container);
            }
         }
      });

   GridView._private = _private;

   return GridView;
});
