/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 10:29
 * To change this template use File | Settings | File Templates.
 */
define("js!SBIS3.CORE.Master", ["js!SBIS3.CORE.AreaAbstract", "js!SBIS3.CORE.TemplatedArea"], function(AreaAbstract, TemplatedArea) {

   "use strict";

   var MasterArea = TemplatedArea.extend({
      _disableScrollbars: function() {
         this._container.removeClass('ws-master-div-scrolling');
      },

      _enableScrollbars: function() {
         this._container.addClass('ws-master-div-scrolling');
      },

      _beforeChildrenBatchCalc: function() {
         this._disableScrollbars();
      },

      _afterChildrenBatchCalc: function() {
         this._enableScrollbars();
      },

      _onResizeHandler: function(){
         MasterArea.superclass._onResizeHandler.apply(this, arguments);
         // чтобы исчезали скроллы при расширении мастера.
         var container = this._container.get(0),
            scrW = container.scrollWidth,
            scrH = container.scrollHeight,
            cntW = $(container).width(),
            cntH = $(container).height();

         // проверка, нужно ли очищать скроллы внутри области, иначе они начинают моргать при ресайзе браузера.
         if ((scrW <= cntW) && (scrH <= cntH)) {
            this._disableScrollbars();
            setTimeout(this._enableScrollbars.bind(this), 0);
         }
      }
   });

   /**
    * @class $ws.proto.Master
    * @extends $ws.proto.AreaAbstract
    * @control
    * @category Navigation
     */
   $ws.proto.Master = AreaAbstract.extend(/** @lends $ws.proto.Master.prototype */{
      /**
       * @event onStepReady событие при полной загрузке каждого шага
       * Важно: id может быть не равен идентификатору текущего шага
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Number} step номер шага в мастере, нумируются с 1
       * @param {String} id идентификатор шага
       */
      /**
       * @event onComplete событие при успешном завершении работы мастера
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       */
      /**
       * @event onCancel событие при отмене работы мастера
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       */
      /**
       * @event onPrevious событие при переключении на предыдующий шаг.
       * Если вернуть из обработчика другой номер шага, то переключиться на него.
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Number} step номер нового шага
       * @param {String} id идентификатор нового шага
       * @return {undefined|Number} номер нового шага
       */
      /**
       * @event onNext событие при переключении на следующий шаг.
       * Если вернуть из обработчика другой номер шага, то переключиться на него.
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Number} step номер нового шага
       * @param {String} id идентификатор нового шага
       * @return {undefined|Number} номер нового шага
       */
      $protected: {
         _options: {
            /**
             * @cfg {Object} Массив с шагами
             * @example
             * <pre>
             *    steps: [
             *       {
             *          title: 'Шаг 1',            // заголовок шага
             *          id: 'step1',               // идентификатор для внутреннего использования
             *          template: './step1'        // путь к шаблону шага
             *       },
             *       {
             *          title: 'Шаг 2',
             *          id: 'step2',
             *          template: './step2'
             *       }
             *    ]
             * </pre>
             */
            steps: [],
            /**
             * @cfg {Number|String} Ширина контрола
             * 'auto' - автоматически
             */
            width: 'auto',
            /**
             * @cfg {Number|String} Высота контрола
             */
            height: '120px',
            /**
             * @cfg {String|Boolean} Настройки заголовка шага
             * <pre>
             *    false - не отображать заголовок
             *    true - дописывать в заголовок окна
             *    {String} - писать в поле данных
             * </pre>
             */
            showTitle: true
         },
         _steps : {}, //Листы шагов (jQuery обертки, индекс - id шага)
         _controls : {}, //Контрол Area:TemplatedArea для каждого шага
         _loaded : {}, //Флаг, загружен ли темплейт для указанного шага (индекс -  id шага)
         _currStep : undefined, //Номер текущего шага
         _toStep : {}, //Массив соответствия идентификаторов шага их номерам
         _history: [] //История шагов
      },

      $constructor: function(){
         var self = this;
         this._publish('onPrevious','onNext','onStepReady', 'onComplete', 'onCancel');

         $ws.single.CommandDispatcher.declareCommand(this, 'next', this.next);
         $ws.single.CommandDispatcher.declareCommand(this, 'prev', this.prev);
         $ws.single.CommandDispatcher.declareCommand(this, 'complete', this.complete);
         $ws.single.CommandDispatcher.declareCommand(this, 'cancel', this.cancel);

         this._dReady = new $ws.proto.Deferred();

         this._dReady.addCallback(function(){
            self._notify('onReady');
         });
         // сразу заполним массив _toStep, он нам пронадобится в createSteps
         for(var index in this._options.steps){
            if(this._options.steps.hasOwnProperty(index)) {
               var i = parseInt(index,10);
               this._toStep[this._options.steps[i].id] = i + 1;
            }
         }
      },

      init: function(){
         this._createSteps();
         $ws.proto.Master.superclass.init.apply(this, arguments);
      },

      /**
       * Глушим функцию _loadDescendents, поскольку вся инициализация дочерних контролов происходит в конструкторе
       * @private
       */
      _loadDescendents: function() {},

      /**
       * Глушим функцию _childrenLoadCallback, поскольку вся инициализация дочерних контролов происходит в конструкторе
       * @private
       */
      _childrenLoadCallback: function() {},

      getReadyDeferred: function() {
         return this._dReady;
      },

      /**
       * Получить id по номеру шага
       * @param {Number} step номер шага
       */
      _getId : function(step){
         return this._options.steps[step - 1].id ? this._options.steps[step - 1].id : step;
      },
      /**
       * Загружает шаблон для шага
       * Изменяет свойства:
       * _loaded[step]
       * _controls[step]
       * _currStep
       * @param {Number} step номер шага
       */
      _loadContent : function(step){
         return this._runInBatchUpdate('Master._loadContent', function() {
            var
               self = this,
               id = this._getId(step),
               result;

            if(!this._loaded[step]){
               this._loaded[step] = true;
               if(this._options.steps[step - 1].template !== undefined){
                  var readyDeferred = new $ws.proto.Deferred(),
                      instance;
                  instance = new MasterArea({// cfg
                     autoHeight: true,
                     autoWidth: true,
                     template : this._options.steps[step - 1].template,
                     element : this._getBlockId(id),
                     parent : this,
                     keepSize: false,
                     tabindex : 1,
                     name : 'mysteparea' + id,
                     context : this.getLinkedContext(),
                     'isRelative' : this._options.isRelative,
                     handlers: {
                        'onReady' : function(){
                           self._setUpTitle(step);
                           self._currStep = step;
                           if(!self._dReady.isReady())
                              self._dReady.callback();
                           else
                              this.setActive(true);
                           readyDeferred.callback();
                        }
                     }
                  });
                  self._controls[step] = instance;
                  result = readyDeferred;
               }
            }
            else {
               this._setUpTitle(step);
               this._currStep = step;

               result = new $ws.proto.Deferred();
               result.callback();
            }

            result.addCallback(function(){
               var area = self.getChildArea(step);

               area._notifyOnSizeChanged(area, area);
               area._checkDelayedRecalk();

               self._notify('onStepReady', step, id);
            });

            return result;
         });
      },
      /**
       * Создаёт листы шагов
       * Устанавливает свойства:
       * _steps[]
       * _loaded[]
       * _currStep
       */
      _createSteps : function(){
         if(!this._options.steps){
            return;
         }
         // нужно разрешить события, чтоб получить результат сразу
         this._allowEvents();
         var startStep = this._notify('onNext', 1, this._getId(1));
         startStep = this._parseStepValue(startStep) || 1;
         for(var index in this._options.steps){
            if(!this._options.steps.hasOwnProperty(index))
               continue;
            var
                  i = parseInt(index,10) + 1,
                  step = this._options.steps[i - 1],
                  id = (step.id === undefined || step.id === "") ? i: step.id,
                  hiddenClass = (startStep != i) ? ' ws-hidden' : '';

            this._steps[i] = $('<div class="ws-master-div ws-area-height-100-fix' + hiddenClass +
                               '" HorizontalAlignment="Stretch" VerticalAlignment="Stretch" id="'+this._getBlockId(id)+'"></div>')
                  .appendTo(this._container)
                  .css({position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 });

            this._loaded[i] = false;

            if(startStep == i){
               this._currStep = i;
               this._loadContent(i);
            }
         }
      },
      /**
       * Устанавливает заголовок, в зависимости от свойства showTitle
       * @param {Number} step номер Шага
       */
      _setUpTitle : function(step){
         var showTitle = this._options.showTitle;
         if(showTitle === true){
            var parent = this.getParent();
            while(parent && !( $ws.helpers.instanceOfModule(parent, 'SBIS3.CORE.Window'))){
               parent = parent.getParent();
            }
            if(parent instanceof AreaAbstract && !parent.isPage()){
               var windowTitle = parent.getTitle(),
                     currentTitle = this._options.steps[this._currStep - 1].title,
                     newTitle = this._options.steps[step - 1].title,
                     patt = new  RegExp(" "+currentTitle+"$");
               if( patt.test(windowTitle) )
                  parent.setTitle(windowTitle.replace(patt, " " + newTitle));
               else
                  parent.setTitle(windowTitle + " " + newTitle);
            }
         }
         else if(showTitle.length){// {String}
            var controls = this._getControls(step);
            if(controls !== undefined){
               for(var i = 0; i < controls.length; i++){
                  var control = controls[i];
                  if(control instanceof $ws.proto.FieldLabel && control.getName() == showTitle)
                     control.setValue(this._options.steps[step - 1].title);
               }
            }
         }
      },
      /**
       * Переход к следующему шагу, если возможно
       * @command
       */
      next : function(){
         var step = 1 + this._currStep;
         if(step > this._options.steps.length)
            return true;
         if(this.validate(this._currStep)){
            var nextStep = this._notify('onNext', step, this._getId(step));
            step = (nextStep === undefined) ? step :nextStep;
            this.setStep(step);
         }
         return true;
      },
      /**
       * Переход к предыдущему по истории шагу, если возможно
       * @command
       */
      prev : function(){
         var step = this._history.pop();
         if(step === undefined)
            return true;
         var nextStep = this._notify('onPrevious', step, this._getId(step));
         step = (nextStep === undefined) ? step :nextStep;
         this.setStep(step);
         // при переходе назад в историю добавляется предыдущий шаг, что недопустимо
         this._history.pop();
         return true;
      },
      /**
       * Команда завершения мастера
       * @command
       */
      complete : function(){
         if(this.validate(this._currStep)){
            this._notify('onComplete', this._currStep, this._getId(this._currStep));
         }
         return true;
      },
      /**
       * Команда отмены мастера
       * @command
       */
      cancel : function(){
         var record = this.getLinkedContext().getRecord();
         if(record)
            record.rollback();
         this._notify('onCancel');
         return true;
      },
      _parseStepValue : function(id){
         if (id !== undefined) {
            if (!isNaN(parseFloat(id)) && isFinite(id)) { // {Number}
               if (id > 0 && id <= this._options.steps.length) // in range?
                  return id;
            } else
            if (id.length) { // {String}
               return this._toStep[id];
            }
         }
         return undefined;
      },
      /**
       * Установить текущий шаг
       * Изменяет свойства:
       * _history[] (добавляет текущий шаг в историю шагов)
       * _steps (css property "display")
       * @param {Number|String} id - если число, то номер шага, иначе - идентификатор шага
       */
      setStep : function(id){
         var step = this._parseStepValue(id);
         if(step === null || this._currStep === undefined || this._currStep === step || this._steps[step] === undefined)
            return;

         this._steps[step].removeClass('ws-hidden');

         if(this._steps[this._currStep])
            this._steps[this._currStep].addClass('ws-hidden')

         this._history.push(this._currStep);

         this._loadContent(step);
      },

      _resizeChilds: function(){
         var child = (this._currStep !== undefined) && this.getChildArea(this._currStep);
         if (child) {
            child._onResizeHandler();
         }
      },

      /**
       * Получить идентификатор текущего шага
       * @return {String}
       */
      getStepId : function(){
         return this._options.steps[this._currStep - 1].id;
      },
      /**
       * Получить номер текущего шага
       * @return {Number}
       */
      getStep : function(){
         return this._currStep;
      },
      /**
       * Возвращает полное айди блока по короткому
       * @param {String} id
       * @returns {String}
       */
      _getBlockId : function(id){
         return 'ws-master-' + this.getId() + '-' + id;
      },
      /**
       * Возвращает массив контролов, которые находятся внутри шага с заданным идентификатором
       * @param {Number} step номер шага
       * @return {Array} массив контролов текущего шага.
       * При невозможности получить список контролов возвращает пустой массив
       */
      _getControls : function(step){
         return (this._controls[step] && this._controls[step] instanceof AreaAbstract) ?
               this._controls[step].getChildControls() : [];
      },
      /**
       * Получить массив контролов, которые находятся внутри ТЕКУЩЕГО шага
       * @return {Array} массив контролов текущего шага
       */
      getChildControls : function(){
         return this._getControls(this._currStep);
      },
      /**
       * Валидирует контролы, вложенные в заданный шаг. Возвращает результат валидации
       * @param {Number} step номер шага
       * @return {Boolean}
       */
      validate : function(step){
         var stepGood = step ? step : this._currStep, //если валидация пришла сверху, то провалидируем текущий шаг.
             controls = [this._controls[stepGood]] || [];
         if(controls !== undefined){
            var result = true;
            for(var i = 0; i < controls.length; i++){
               var control = controls[i];
               if(control.validate){// или instanceOf FieldAbstract
                  result = (control.validate() === true) && result;
               }
            }
            return result;
         }
         return true;
      },
      /**
       * Возвращает TemplatedArea - шаблон определённого шага мастера
       * @param {Number} step Номер нужного шага
       * @returns {$ws.proto.TemplatedArea}
       */
      getChildArea: function(step){
         return this._controls[step];
      },
      /**
       * Возвращает массив с шагами
       * @return {Object} массив шагов
       */
      getSteps: function(){
         return this._options.steps;
      }
   });

   return $ws.proto.Master;

});
