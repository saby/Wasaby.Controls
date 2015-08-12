define('js!SBIS3.CONTROLS.ComponentBinder', [], function () {
   /*методы для поиска*/
   function startSearch(text, gridView, BreadCrumbs, searchParamName) {
      if (text) {
         var filter = $ws.core.merge(gridView._filter, {
            'Разворот': 'С разворотом',
            'usePages': 'full'
         });
         filter[searchParamName] = text;
         gridView.setHighlightText(text, false);
         gridView.setInfiniteScroll(true, true);
         gridView.setGroupBy(gridView.getSearchGroupBy());

         if (this._firstSearch) {
            this._lastRoot = gridView.getCurrentRoot();
            this._pathDSRawData = $ws.core.clone(BreadCrumbs.getDataSet().getRawData());
         }
         this._firstSearch = false;
         this._searchReload = true;
         // TODO нафиг это надо
         BreadCrumbs.setItems([]);

         gridView.reload(filter, gridView._sorting, 0);
      }
   }
   function resetGroup(gridView, searchParamName, BreadCrumbs) {
      //Если мы ничего не искали, то и сбрасывать нечего
      if (this._firstSearch) {
         return;
      }
      var filter = $ws.core.merge(gridView._filter, {
         'Разворот' : 'Без разворота'
      });
      delete (filter[searchParamName]);

      gridView.setInfiniteScroll(false, true);
      gridView.setGroupBy({});
      gridView.setHighlightText('', false);

      this._firstSearch = true;
      if (this._searchReload ) {
         //Нужно поменять фильтр и загрузить нужный корень.
         //TODO менять фильтр в контексте, когда появятся data-binding'и
         filter[gridView.getHierField()] = this._lastRoot;
         //dataGrid._filter = filter;
         //dataGrid.setCurrentRoot(self._lastRoot); - плохо, потому что ВСЕ крошки на странице получат изменения
         gridView.reload(filter, gridView._sorting, 0);
         BreadCrumbs.getDataSet().setRawData(this._pathDSRawData);
         BreadCrumbs._redraw();
      } else {
         //Очищаем крошки. TODO переделать, когда появятся привзяки по контексту
         gridView._filter = filter;
      }
   }

   function breakSearch(searchForm){
      this._searchReload = false;
      this._firstSearch = true;
      //Если в строке поиска что-то есть, очистим и сбросим Фильтр
      if (searchForm.getText()) {
         searchForm.setText('');
      }
      //
         // TODO нафиг это надо
       //reportController._folderChanged = true;
   }

   function isSearchValid(text, minLength) {
      var checkText = text.replace(/[«»’”@#№$%^&*;:?.,!\/~\]\[{}()|<>=+\-_\s'"]/g, '');
      return [checkText, checkText.length >= minLength];
   }

   /**
    * Контроллер, позволяющий связывать компоненты осуществляя базовое взаимодейтсие между ними
    * @author Крайнов Дмитрий
    * @class SBIS3.CONTROLS.ComponentBinder
    * @extends $ws.proto.Abstract
    * @public
    */
   var ComponentBinder = $ws.proto.Abstract.extend({
      _protected : {
         _searchReload : true,
         _searchForm : undefined,
         _lastRoot : undefined,
         _pathDSRawData : undefined,
         _firstSearch: true,
         _lastViewMode: null
      },
      bindSearchGrid : function(searchForm, gridView, BreadCrumbs, searchParamName) {
         var self = this;
         this._lastRoot = gridView.getCurrentRoot();
         searchForm.subscribe('onTextChange', function(event, text){
            var checkedText = isSearchValid(text, 3);
            if (checkedText[1]) {
               startSearch.call(self, this.getText(), gridView, BreadCrumbs, searchParamName);
            }
            if (!checkedText[0]) {
               resetGroup.call(self, gridView, searchParamName);
            }
         });

         searchForm.subscribe('onSearchStart', function(event, text) {
            var checkedText = isSearchValid(text, 1);
            if (checkedText[1]) {
               startSearch.call(self, this.getText(), gridView, searchParamName);
            }
         });
         //searchForm.subscribe('onReset', resetGroup);
         gridView.subscribe('onSetRoot', breakSearch);
         //Перед переключением в крошках в режиме поиска сбросим фильтр поиска
         gridView.subscribe('onSearchPathClick', breakSearch);
      },
      bindSearchComposite: function(searchForm, compositeView, BreadCrumbs, searchParamName) {
         this.bindSearchGrid.apply(this, arguments);
         var self = this;
         compositeView.subscribe('onDataLoad', function(){
            if (searchForm.getText().length > 2) {
               self._lastViewMode = this.getViewMode();
               this.setViewMode('table');
            } else if (self._lastViewMode) {
               this.setViewMode(self._lastViewMode);
            }
         });
      },

      bindBreadCrumbs: function(breadCrumbs, hierarchyGridView){
         hierarchyGridView.subscribe('onSetRoot', function(event, keys){
            for (var i = keys.length - 1; i >= 0; i--) {
               var key = keys[i];
               if (key){
                  var point = {};
                  point[this._options.displayField] = $ws.helpers.escapeHtml(key.title);
                  point[this._options.keyField] = key.key;
                  point[this._options.colorField] = key.color;
                  point.data = key.data;
                  this._dataSet.push(point);
               }
            }
            this._toggleHomeIcon(this._dataSet.getCount() <= 0);
            this._redraw();
         }.bind(breadCrumbs));

         breadCrumbs.subscribe('onItemClick', function(event, id){
            hierarchyGridView.setCurrentRoot(id);
         });
      }

   });

   return ComponentBinder;
});
