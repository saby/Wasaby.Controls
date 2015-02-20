/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 16:10
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.Grid', ['js!SBIS3.CORE.GridAbstract', 'is!browser?Core/dt_layout'], function( GridAbstract ) {

   'use strict';

   /**
    * @class $ws.proto.Grid
    * @extends $ws.proto.GridAbstract
    */
   $ws.proto.Grid = GridAbstract.extend(/** @lends $ws.proto.Grid.prototype */{
      $protected: {
         _divTable: null,
         _options: {
            tabindex : false,
            isEmpty: false,
            rows: [],
            columns: [],
            display: [],
            cells: {},
            firstRender: true,
            minSizes: {}
         },
         _postFilterOptions: {dom: undefined},
         _haveBorders: false
      },

      $constructor : function() {
         this._checkInit();
         this._normalizeOptions();
      },

      _needResizer:function () {
         return !this._options.isEmpty;
      },

      _checkInit: function() {
         if (!this._isCorrectContainer()) {
            $ws.single.ioc.resolve('ILogger').error("$ws.proto.Grid",
               "Внимание! Неправильная вёрстка у старой сетки (id=" + this.getId() + "). Или контейнера нет, или контейнер свёрстан для новой сетки (проверьте конвертор).");
         }
      },

      //TODO: перенести в джынновский конвертор
      _normalizeOptions: function Grid_normalizeOptions() {
         var i, j, ln, ln2,
             ops = this._options || {},
             cols = ops.columns || [],
             col, row, val,
             rows = ops.rows || [],
             minSizes = ops.minSizes || {},
             minCols = minSizes.columns || [],
             minRows = minSizes.rows || [];

         for (i = 0, ln = cols.length; i < ln; i++) {
            col = cols[i] || [];
            if (col === 'auto')
               cols[i] = [0, 0];
            else {
               for (j = 0, ln2 = col.length; j < ln2; j++) {
                  val = col[j];
                  col[j] = parseFloat(val);
                  if (isNaN(col[j]))
                     col[j] = val;
               }
            }
         }

         for (i = 0, ln = rows.length; i < ln; i++) {
            row = rows[i] || [];
            if (row === 'auto')
               rows[i] = [0, 0];
            else {
               for (j = 0, ln2 = row.length; j < ln2; j++) {
                  val = row[j];
                  row[j] = parseFloat(val);
                  if (isNaN(row[j]))
                     row[j] = val;
               }
            }
         }

         for (i = 0, ln = minCols.length; i < ln; i++) {
            minCols[i] = parseFloat(minCols[i]);
         }

         for (i = 0, ln = minRows.length; i < ln; i++) {
            minRows[i] = parseFloat(minRows[i]);
         }
      },

      _templateInnerCallback : function() {
         this._postFilterOptions.dom = this._container;
         this._haveBorders = this._container.hasClass('dt_withBorder');

         this._initLayout(false);
         this._initResizers();
         $ws.proto.Grid.superclass._templateInnerCallback.apply(this, arguments);
      },

      _updateResizer: function Grid_updateResizer(){
         if (this._divTable) {
            var maxWidth = this._divTable.getMaxWidth();
            var maxHeight = this._divTable.getMaxHeight();

            if (maxWidth < this._options.minWidth) {
               maxWidth = this._options.minWidth;
            }

            if (maxHeight < this._options.minHeight) {
               maxHeight = this._options.minHeight;
            }

            $ws.helpers.setElementCachedSize(this._resizer, {width: maxWidth, height: maxHeight});
            this._divTable.reset({resetResizer: true});
         }
      },

      _onResizeHandler: function Grid_onResizeHandler(event, initiator){
         if (this._skipOnResizeHandler()) {
            return;
         }

         if (this._divTable) {
            this._divTable.reset({resetResizer: true});
         }

         var isEmpty = this._options.isEmpty,
             isRefreshed = isEmpty || this._divTable.refresh({resetContainer: true});

         if(isRefreshed || this._needForceOnResizeHandler()) {
            if (!isEmpty)
               this._divTable.reset({resetControls: true});

            this._resizeChilds();

            $.dtPostFilter(this._postFilterOptions);

            // центрирование при превышении максимальных размеров.
            this._calcStretchPosition();

            // убираем двойные границы
            if (this._haveBorders)
               this._correctBorders();
         }
      },

      //TODO: перенести это в dt_layout
      _correctBorders:function Grid_correctBorders () {
         $('#' + this._container.attr('id')).each(function () {
            var e = $(this),
               p = e.parents('.dt_layout.dt_withBorder'),
               frt = false, frl = false, ln = p.length, i;
            for (i = 0; i < ln; i++) {
               $(p[i]).find("> table > tbody > tr > .td_grid,> .dt_cell").each(function () {
                  if (e.parents('#' + $(this).attr('id')).length > 0) {
                     if ($(p[i]).hasClass('dt_withBorder')) {
                        var pbcr = $(this)[0].getBoundingClientRect(),
                           bcr = e[0].getBoundingClientRect();
                        if (bcr.left == pbcr.left)
                           frl = true;
                        if (bcr.top == pbcr.top)
                           frt = true;
                     }
                  }
               });
            }
            if (frt || frl)
               e.find('> table > tbody > tr > .td_grid,> .dt_cell').filter(function () {
                  return this.className.match('dt_grid_cell_.*_1') || this.className.match('dt_grid_cell_1_.*');
               }).each(function () {

                     var x = $(this);
                     if (x[0].className.match('dt_grid_cell_.*_1')) {
                        if (frl) {
                           x.addClass('dt_noleftborder');
                        }
                     }
                    if (x[0].className.match('dt_grid_cell_1_.*')) {
                        if (frt) {
                           x.addClass('dt_notopborder');
                        }
                     }
                  });
         })
      },
      _initLayout: function Grid_initLayout(onlyRefresh, refreshOptions) {
         var isRefreshed = true;
         if (!this._options.isEmpty) {
            if (this._divTable) {
               isRefreshed = this._divTable.refresh(refreshOptions);
            } else if (!onlyRefresh) {
               $.doTable(this, this._options);
               this._divTable = this.getContainer().data('divTable');
            }
         }
         if (isRefreshed)
            $.dtPostFilter({dom:this._container});
      },

      _onSizeChangedBatch: function(controls) {
         if (this._divTable)
            this._divTable.reset({resetControls: true});

         this._updateResizer();
         this._initLayout(true, {resetContainer: true});

         //Могли измениться высоты контролов из-за изменения ширин
         if (this._divTable) {
            if (this._divTable.reset({resetControls: true, resetDependentHeightsOnly: true}))
               this._updateResizer();
         }

         return true;
      },
      /**
       * @param {Boolean} show флаг "скрыть/показать"
       * @private
       */
      _setVisibility: function(show) {
         if(this._isCorrectContainer()){
            this._container.toggleClass('ws-hidden', !show);
            // строка ниже оставлена специально, не надо ее удалять
            //.css('visibility', show ? 'inherit' : 'hidden');
            this._isVisible = show;
            if(show && this._isReady){
               this._initLayout(true);
               this._updateResizer();
            }
            this._notifyOnSizeChanged(this, this);
         }
      },

      destroy: function() {
         this.getContainer().data('divTable', null);
         $ws.proto.Grid.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.Grid;

});