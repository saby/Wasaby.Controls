define("js!SBIS3.Engine.MasterPageController", [], function () {
   return $ws.core.extend({}, {
      $protected: {
         logger: $ws.single.ioc.resolve('ILogger'),
         req: null,
         res: null,
         render: null,
         component: null
      },
      /**
       * Запускает процесс построения страницы
       * @param req
       * @param res
       * @param render
       * @param component
       * */
      init__: function (req, res, render, component) {
         this.render = render;
         this.req = req;
         this.res = res;
         this.component = component;
         this.perform(this.parallelDefWrapper(this.getCells()), req, res)
      },

      /**
       * рендерим собранные данные
       * */

      perform: function (deferred, req, res) {
         var self = this;
         deferred.addCallback(function (result) {
            res.render(self.getTemplate(), result, self.addDeps);
         });
      },

      getTemplate: function () {
         return this.template;
      },

      getCells: function () {
         return this.cells;
      },

      createComponent: function (comp, config) {
         var self = this;
         var constructor = self.component;
         return new constructor(comp, config);
      },

      /**
       * Запускает ParallelDeferred для получения результата
       * всех функций получения значений метки шаблона
       * @param steps Array
       * @result $ws.proto.Deferred
       * */
      parallelDefWrapper: function (steps) {
         var pDeferred = new $ws.proto.ParallelDeferred();
         steps.forEach(function (step) {
            pDeferred.push(this[step](), step);
         }, this);
         return pDeferred.done().getResult();
      },

      /**
       * Рендеринг контента ячейки по шаблону
       * */
      renderCellContent: function (tpl, cells) {
         var
            self = this,
            dDataReady = this.parallelDefWrapper(cells),
            dRenderComplete = new $ws.proto.Deferred();
         dDataReady.addCallback(function (result) {
            self.render(tpl, result, self.addDeps, function (nl, res) { /*первый параметр всегда null*/
               self.logger.info('RenderRes: ' + res);
               dRenderComplete.callback(res);
            });
         });
         return dRenderComplete;
      }
   });
});