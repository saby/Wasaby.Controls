define('js!SBIS3.CORE.GridLayout', ['js!SBIS3.CORE.CompoundControl', 'is!browser?Core/dt_layout'], function(CompoundControl){

   var GridLayout = CompoundControl.extend({
      $protected: {
         _divTable: null,
         _options: {
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
         if (/MSIE 10.0/.test(navigator.userAgent)) {
            this.getContainer().removeClass('ws-area').addClass('ws-grid');
            return;
         }
         this._options.owner = this;
         if(this._context && this._craftedContext)
            this._context.destroy();
         this._craftedContext = false;
         this._context = this._context.getPrevious();

         this._checkInit();
         this._normalizeOptions();
         var self = this;
         this._dChildReady.getResult().addCallback(function(){
            self._templateInnerCallback();
         });
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
         this._isReady = true;
         this._container.scrollTop(0);
         this._container.scrollLeft(0);
         this._notifyOnSizeChanged(this, this, true);
         this._notify('onReady');
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

            this._resizer.height(maxHeight).width(maxWidth);
            this._divTable.reset({resetResizer: true});
            this._container.css("min-width", maxWidth);
         }
      },
      _skipOnResizeHandler: function() {
         return (!this._isReady || (!this._haveStretch() && !this._needForceOnResizeHandler()));
      },
      _onResizeHandler: function Grid_onResizeHandler(event, initiator){
         if (this._skipOnResizeHandler())
            return;

         var isEmpty = this._options.isEmpty,
            isRefreshed = isEmpty || this._divTable.refresh({resetContainer: true});

         if(isRefreshed || this._needForceOnResizeHandler()) {
            if (!isEmpty)
               this._divTable.reset({resetControls: true});

            if (this !== initiator)
               this._resizeChilds();

            $.dtPostFilter(this._postFilterOptions);

            // центрирование при превышении максимальных размеров.
            this._calcStretchPosition();
         }
      },

      _initLayout: function Grid_initLayout(onlyRefresh, refreshOptions) {
         var isRefreshed = true;
         if (!this._options.isEmpty) {
            if (this._divTable) {
               isRefreshed = this._divTable.refresh(refreshOptions);
            } else if (!onlyRefresh) {
               $.doTable(this._options);
               this._divTable = this.getContainer().data('divTable');
            }
         }
         if (isRefreshed)
            $.dtPostFilter({dom:this._container});
      },

      _onSizeChangedBatch: function() {
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
      },
      registerDefaultButton: function(){
         var parent = this.getParent();
         if(parent && parent.registerDefaultButton)
            parent.registerDefaultButton.apply(parent, arguments);
      }
   });

   $ws.proto.GridLayout = GridLayout;
   return GridLayout;
});
