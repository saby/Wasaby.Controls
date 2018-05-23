define('Controls/List/Grid/GridView', [
   'Controls/List/ListView',
   'tmpl!Controls/List/Grid/GridView',
   'tmpl!Controls/List/Grid/Item',
   'tmpl!Controls/List/Grid/Column',
   'tmpl!Controls/List/Grid/HeaderContent',
   'Core/detection',
   'tmpl!Controls/List/Grid/Header',
   'tmpl!Controls/List/Grid/Results',
   'tmpl!Controls/List/Grid/ColGroup',
   'css!Controls/List/Grid/Grid',
   'css!Controls/List/Grid/OldGrid',
   'Controls/List/BaseControl/Scroll/Emitter'
], function(ListView, GridTpl, DefaultItemTpl, ColumnTpl, HeaderContentTpl, cDetection) {

   'use strict';

   var
      _private = {
         prepareGridTemplateColumns: function(columns, multiselect) {
            var
               result = '';
            if (multiselect) {
               result += 'auto ';
            }
            columns.forEach(function(column) {
               result += column.width ? column.width + ' ' : '1fr ';
            });
            return result;
         }
      },
      GridView = ListView.extend({
         _template: GridTpl,
         _defaultItemTemplate: DefaultItemTpl,
         _headerContentTemplate: HeaderContentTpl,
         _prepareGridTemplateColumns: _private.prepareGridTemplateColumns,
         isNotFullGridSupport: cDetection.isNotFullGridSupport,
         isIE: cDetection.isIE,
         isSafari11: cDetection.safari11,

         _beforeMount: function(cfg) {
            GridView.superclass._beforeMount.apply(this, arguments);
            this._listModel.setColumnTemplate(ColumnTpl);

            if (cDetection.isNotFullGridSupport || cDetection.isIE) {
               var tmp = cfg.columns,
                  temp = function(tmp) {
                     var tmps = tmp;
                     var i;
                     for (i = 0; i < tmps.length; i++) {
                        if (tmps[i].width == '1fr') {
                           tmps[i].width = 'auto';
                        } else {
                           if (tmps[i].width == 'auto') {
                              tmps[i].width = '1px';
                           }
                        }
                     }
                     return tmps;
                  };
               temp(tmp);
            }
         },

         _afterMount: function() {
            var
               results = this._listModel.getResults(),
               header = this._listModel.getHeader();
            GridView.superclass._afterMount.apply(this, arguments);
            if (!cDetection.isNotFullGridSupport) {
               if (results) {
                  var
                     resultsPadding = '';
                  if (results.position === 'top') {
                     if (header) {
                        resultsPadding = this._container.getElementsByClassName('controls-Grid__header-cell')[0].getBoundingClientRect().height + 'px';
                     } else {
                        resultsPadding = '0';
                     }
                  } else {
                     resultsPadding = 'calc(100% - ' + this._container.getElementsByClassName('controls-Grid__results-cell')[0].getBoundingClientRect().height + 'px)';
                  }
                  $(this._container).find('.controls-Grid__results-cell').css('top', resultsPadding);
               }
            }
         },
         
         __onEmitScroll: function(e, type, params) {
            if (!cDetection.isNotFullGridSupport && type === 'scrollMove') {
               this._listModel.setCellBottomShadowVisibly(params.scrollTop !== 0);
            }
         }
      });

   GridView._private = _private;

   return GridView;
});
