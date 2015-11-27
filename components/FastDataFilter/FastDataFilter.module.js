/**]
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
      /**
       * Контрол, отображающий набор выпадающих списков SBIS3.CONTROLS.DropdownList и работающий с фильтром в контексте
       * @class SBIS3.CONTROLS.FastDataFilter
       * @extends $ws.proto.Control
       * @author Крайнов Дмитрий Олегович
       * @mixes SBIS3.CONTROLS.DSMixin
       * @mixes SBIS3.CONTROLS.FilterMixin
       * @demo SBIS3.CONTROLS.Demo.MyFastDataFilter Работа с данными
       * @control
       * @public
       */
      var FastDataFilter = CompoundControl.extend([FilterMixin, DSMixin],/** @lends SBIS3.CONTROLS.FastDataFilter.prototype */{
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
               showSelectedInList : !!item.get('multiselect'),
               displayField: item.get('displayField'),
               className: 'controls-DropdownList__linkStyle'
            };
            return '<component data-component="SBIS3.CONTROLS.DropdownList" config="' + $ws.helpers.encodeCfgAttr(cfg) + '">' +
                        //'<opts name="selectedKeys" type="array" bind="' + cfg.filterName +'" ></opts>' + //direction="fromProperty" oneWay="true"
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
               var idx = self._getFilterSctructureItemIndex(this.getContainer().data('id')),
                  text = [], ds,
               //Если выбрали дефолтное значение, то нужно взять из resetValue
               //TODO может быть всегда отдавать массивом?
                   filterValue =  idArray.length === 1 && idArray[0] === this.getDefaultId() ? self._filterStructure[idx].resetValue :
                         (this._options.multiselect ?  idArray : idArray[0]);
               //TODO Непонятно как это сделать в обратную сторону (когда из контекста кришло значение его нужно поставить в dropdownList)
               //В контексте текуший DropdownList, у него задавали поле с фильтром
               //Если не нашли, значит искать мне это надо как-то по-другому....
               if (idx >= 0) {
                  self._filterStructure[idx].value = filterValue;

                  //TODO из-за того, что ТЕПЕРЬ в multiselectable происходит сначала оповещение, а
                  //только потом перерисовка, то пользоваться здесь getText нельзя, смотрим в dataSet
                  ds = this.getDataSet();
                  for (var i = 0; i < idArray.length; i++) {
                     text.push(ds.getRecordByKey(idArray[i]).get(this._options.displayField))
                  }

                  self._filterStructure[idx].caption = text.join(', ');
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
            //TODO Во-первых этого здесь бюыть не должно, но привязки не завелись из-за того, что dropDown не смог связаться по контексту и выставить свое значение
            //TODO во-вторых возможнны проблемы с value array||number. Пока обратим внимание на instances.second._options.multiselect
            var instances = this.getItemsInstances();
            for (var i in instances) {
               if (instances.hasOwnProperty(i)){
                  var fsObject = this._filterStructure[this._getFilterSctructureItemIndex(i)],
                        value = (fsObject.hasOwnProperty('value') && fsObject.value !== undefined) ?  instances[i]._options.multiselect ?  fsObject.value : [fsObject.value]: [instances[i].getDefaultId()];
                  if (!this._isSimilarArrays(instances[i].getSelectedKeys(), value)) {
                     instances[i].setSelectedKeys(value);
                  }
               }
            }
         },
         //TODO это дублЬ! нужно вынести в хелпер!!!
         _isSimilarArrays : function(arr1, arr2){
            if (arr1.length === arr2.length) {
               for (var i = 0; i < arr1.length; i ++) {
                  if (arr1[i] != arr2[i]) {
                     return false;
                  }
               }
               return true;
            }
            return false;
         }
      });
      return FastDataFilter;
   });
