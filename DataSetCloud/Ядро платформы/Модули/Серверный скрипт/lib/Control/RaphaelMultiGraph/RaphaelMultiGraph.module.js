define("js!SBIS3.CORE.RaphaelMultiGraph", ["js!SBIS3.CORE.RaphaelChartGraph", "js!SBIS3.CORE.RaphaelPieGraph"], function(RaphaelChartGraph, RaphaelPieGraph) {
   "use strict";

   var RaphaelMultiGraphConst = {
      libMap: {
         'chart': {classProto: RaphaelChartGraph},
         'pie': {classProto: RaphaelPieGraph}
      }
   };

   /**
    * @class $ws.proto.RaphaelMultiGraph
    * @extends $ws.proto.Control
    * @control
    * @category Content
    * @cfgOld {Array}   graphs      Массив с параметрами графиков
    * Например:
    * <pre>
    *    [
    *       {
 *          'graphType': 'chart',                  //Тип графика - 'chart', 'bar' или 'pie'
 *          'dataSource': {                        //Стандартный dataSource
 *             'readerType': 'ReaderUnifiedSBIS',
 *             ...
 *          },
 *          ...                                    //Другие опции - толщина линии, тени, поля из выборки и т д
 *       }
    *    ]
    * </pre>
    * @cfgOld {Object}  margin      Массив с отступами
    * Например:
    * <pre>
    *    {
 *       'top': 0,
 *       'right': 100500,
 *       'bottom': 326,
 *       'left': 8236
 *    }
    **/
   $ws.proto.RaphaelMultiGraph = $ws.proto.Control.extend(/** @lends $ws.proto.RaphaelMultiGraph */ {

      $protected: {
         _graphs: []                   //Массив с объектами графиков
      },

      init: function() {},

      $constructor : function(cfg) {
         var width = this._container.width(),
             height = this._container.height(),
             graphs = cfg.graphs || [];

         for(var i = 0, ln = graphs.length; i < ln; i++){
            var graph = graphs[i],
                classProto = RaphaelMultiGraphConst.libMap[graph['graphType']].classProto;

            graph.raphael = cfg.raphael;
            graph.width = width;
            graph.height = height;
            graph.handlers = graph.handlers || {};
            graph.element = this._isCorrectContainer() ? this._container : this.getId();
            graph.linkedContext = this.getLinkedContext();

            var inst = new classProto(graph);
            this._graphs.push(inst);
         }

         if (width === 0 || height === 0) { //TODO: костыль - разобраться
            this._onResizeHandler.apply(this);
            setTimeout(this._onResizeHandler.bind(this), 200);
         }

         this._notify('onInit');
      },
      /**
       * Возвращает график из набора
       * @param {Number} id Номер графика
       * @returns {$ws.proto.RaphaelAbstractGraph}
       */
      getGraph: function(id) {
         return this._graphs[id];
      },
      /**
       * Обработчик изменения размеров контрола
       */
      _onResizeHandler: function(){
         $ws.helpers.forEach(this._graphs, function(graph) {
            if(graph){
               graph._onResizeHandler();
            }
         });
      },

      /**
       * Вызывается при удалении контрола. Вызывает метод {destroy} у всех диаграмм, которыми владеет.
       */
      destroy: function() {
         $ws.helpers.forEach(this._graphs, function(graph) {
            if (graph)
               graph.destroy();
         });
         $ws.proto.RaphaelMultiGraph.superclass.destroy.call(this);
      }
   });

   return $ws.proto.RaphaelMultiGraph;
});