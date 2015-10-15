/**
 * Created by am.gerasimov on 15.04.2015.
 */
define('js!SBIS3.CONTROLS.FastDataFilter',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.FilterMixin',
      'js!SBIS3.CONTROLS.DropdownList',
      'html!SBIS3.CONTROLS.FastDataFilter'
   ],

   function(CompoundControl, DSMixin, FilterMixin, DropdownList, dotTplFn) {

      'use strict';

      var FastDataFilter = CompoundControl.extend([FilterMixin, DSMixin],{
         $protected: {
            _dotTplFn: dotTplFn,
            _options: {
               mode: 'hover',
               displayField: '',
               /**
                * @cfg {String} Поле в контексте, где будет храниться внутренний фильтр компонента
                * @remark
                * !Важно: Если на одной форме, в одном контексте лежит несколько хлебных фильтров, то только в этом случае стоит менять стандартное имя
                */
               internalContextFilterName : 'sbis3-controls-fast-filter'
            }
         },
         init: function () {
            FastDataFilter.superclass.init.apply(this, arguments);
            //Непонятно, сейчас приходится делать setItems из прикладного кода
            //this.reload();
         },
         _getItemTemplate: function(item) {
            var  cfg = {
               items: item.get('values'),
               keyField: item.get('keyField'),
               mode: this._options.mode,
               multiselect : !!item.get('multiselect'),
               filterName : item.get(this._options.keyField),
               displayField: item.get('displayField')
            };
            return '<component data-component="SBIS3.CONTROLS.DropdownList" config="' + $ws.helpers.encodeCfgAttr(cfg) + '">' +
                        //'<opts name="selectedKeys" type="array" bind="'+ cfg.keyField +'"></opts>' +
                        //'<opt name="caption" type="array" bind="'+ cfg.displayField +'" direction="fromProperty" oneWay="true"></opt>' +
                   '</component>';
         },
         _drawItemsCallback: function(){
            var instances = this.getItemsInstances();
            for (var i in instances) {
               if (instances.hasOwnProperty(i)) {
                  this._subscribeItemToHandlers(instances[i])
               }
            }
         },
         _getCurrentContext : function(){
            return this.getLinkedContext();
         },
         _subscribeItemToHandlers : function(item){
            var self = this;
            item.subscribe('onClickMore', function(){
               self._notify('onClickMore', item);
            });
            item.subscribe('onSelectedItemsChange', function(event, idArray){
               var idx = self._getFilterSctructureItemIndex(this._options.filterName),
               //Если выбрали дефолтное значение, то нужно взять из resetValue
               //TODO может быть всегда отдавать массивом?
                   filterValue =  idArray.length === 1 && idArray[0] === this.getDefaultId() ? self._filterStructure[idx].resetValue :
                         (this._options.multiselect ?  idArray : idArray[0]);

               //TODO Непонятно как это сделать в обратную сторону (когда из контеста кришло значение его нужно поставить в dropdownList)
               //В контексте текуший DropdownList, у него задавали поле с фильтром
               //Если не нашли, значит искать мне это надо как-то по-другому....
               if (idx >= 0) {
                  self._filterStructure[idx].value = filterValue;
                  self._filterStructure[idx].caption = this.getCaption();
                  self.applyFilter();
               }
            });
         },
         _recalcInternalContext: function() {
            var
                  changed = $ws.helpers.reduce(this._filterStructure, function(result, element) {
                     return result || element.resetValue !== element.value;
                  }, false);

            this.getLinkedContext().setValueSelf({
               filterChanged: changed,
               filterStructure: this._filterStructure
            });
         }
      });
      return FastDataFilter;
   });
