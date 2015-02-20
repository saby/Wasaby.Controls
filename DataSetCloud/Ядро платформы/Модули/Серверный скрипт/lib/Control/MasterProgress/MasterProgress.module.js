/**
 * Модуль "Компонент прогресс прохождения мастера".
 *
 * @description
 */
define("js!SBIS3.CORE.MasterProgress", ["js!SBIS3.CORE.Control", "js!SBIS3.CORE.Marker", "css!SBIS3.CORE.MasterProgress"], function( Control, Marker ) {

   "use strict";

   /**
    * @fileoverview Файл с классом MasterProgress
    *    - MasterProgress
    * @author av.strashkov
    */
   var MIN_WIDTH_MARKER = 160;
   /**
    * Прогресс прохождения мастера
    *
    * @class $ws.proto.MasterProgress
    * @extends $ws.proto.Control
    * @cfgOld {String} masterId идентификатор связного мастера
    * @cfgOld {Boolean} changeMaster изменять ли активный шаг мастера при нажатии на шаг в MasterProgress
    *
    * @control
    * @category Decorate
    */
   $ws.proto.MasterProgress = Control.Control.extend(/** @lends $ws.proto.MasterProgress.prototype */{
      /**
       * @event onStepClick Событие при клике на шаг
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Number} step номер нового шага
       * @param {String} id идентификатор нового шага
       */
      $protected: {
         _options: {
            /**
             * @cfg {String} идентификатор связного мастера
             * @editor InternalComponentChooser
             */
            masterId: '',
            changeMaster: false
         },
         _stepCount: 0,//количество шагов (может менять в функции setSteps)
         _initialStepCount: 0,//начальное количество шагов (всегда постоянно)
         _stepWidth: 0,//ширина ондного шага
         _arrow: undefined,//контейнер стрелки индиватора
         _steps: undefined,//массив шагов, пришедший из мастера
         _master: undefined,// связный мастер
         _changed: false,//вспомогаьельная переменная, помогает избежать повторного установления на шаг мастера
         _alowed: {},//объект, хранящий состояние шага (доступен для клика или нет)
         _complies: {},//объект, хранящий соответствия номеров шагов после использования setSteps
         _topParent: undefined, // самый дальний предок (область по шаблону или окно)
         _onStepReadyHandler: undefined,
         _onBeforeCloseHandler: undefined,
         _onMoveHandler: undefined,
         _onBatchFinishedHandler: undefined,
         _topParentBatchFinished: false
      },
      $constructor: function(){
         var self = this;

         this._topParent = this.getTopParent();
         this._publish('onStepClick');
         $ws.single.ControlStorage.waitWithParentName(this._options.masterId).addCallback(function (inst) {
            self._master = inst;
            self._init(inst.getSteps());
            return inst;
         });
      },

      _init: function(steps){
         var self = this;
         self._steps = steps;
         self._stepCount = self._steps.length;
         self._initialStepCount = self._stepCount;
         self._stepWidth = self._container.width() / self._stepCount;
         self._arrow = $('<div class="ws-master-progress-arrow"></div>');
         var wrap = $('<div class="ws-master-progress"></div>');
         for (var i = 0; i < self._stepCount; i++) {
            var step = '<div class="ws-master-progress-step">' +
                          '<div class="ws-master-progress-markered">' +
                             '<span id="step-' + (i + 1) + '" class="ws-master-progress-title">' + (i + 1) + '. ' + self._steps[i].title + '</span>' +
                          '</div>' +
                       '</div>';
            wrap.append($('<div id="ws-master-progress-' + self._steps[i].id + '" step="' + i + '" class="ws-master-progress-step-container"></div>').append(step).css('width', 100 / self._stepCount + '%'));
            self._alowed[i+1] = false;
            self._complies[i + 1] = i + 1;
         }
         self._container.append(wrap.append($('<div class="ws-master-progress-scale"></div>').append(self._arrow)));
         this._notifyOnSizeChanged(this, this);
         if (self._options.changeMaster)
            self._bindClick();
         else
            this._container.find('.ws-master-progress-step-container')
                           .addClass('ws-master-progress-step-container-disactive');
         self._addEventListener();
         self._setPadding();
         var curStep = self._master.getStepId();
         self.setStepState(curStep, true);
         self._setStep(curStep, false);
      },
      /**
       * Привязка события по клику на шаг индикатора
       * @protected
       */
      _bindClick: function(){
         var self = this;
         this._container.find('.ws-master-progress-step-container')
               .bind('click', function(e){
                  var
                        step = $(this).attr('step'),
                        id;
                  // Имитируем клик по контейнеру чтобы не сбивать активность контролов
                  self._container.click();
                  step = parseInt(step, 10) + 1;
                  id = self._getId(step);
                  if(self._notify('onStepClick', self._getActualStepNumber(step) , id) !== false)
                     self._setStep(id, true);
                  // остановим всплытие чтобы не сбить фокус с чего-то, показанного в обработчиках
                  e.stopPropagation();
               });
      },
      /**
       * Установка шкалы прохождения мастера
       * @param {String|Number} id Идентификатор/Номер шага
       * @protected
       */
      _setWidthScale: function(id){
         var
               step = this._getActualStepNumber(id),
               bool,
               self = this;
         for(var i = 1; i <= this._initialStepCount; i++){
            (function(j){
               j = self._getActualStepNumber(j);
               bool = (j <= step);
               self._container
                     .find('#ws-master-progress-' + self._getId(i))
                     .toggleClass('ws-master-progress-fill', bool)
                     .find('.ws-master-progress-title')
                     .toggleClass('ws-master-progress-title-active', bool);
            }(i));
         }
         if(step !== this._stepCount){
            this._arrow.css({
               'left': Math.floor(this._stepWidth * step - 8),
               'display': 'block'
            });
         }
         else
            this._arrow.hide();
         this._container.find('[step=' + (step - 1) + ']').find('span').addClass('ws-master-progress-passed');
      },
      /**
       * Установка шага мастера
       * @param {String|Number} id Идентификатор/Номер шага
       * @param {Boolean} changeMaster изменять ли шал в мастере
       * @protected
       */
      _setStep: function(id, changeMaster){
         var
               step = this._getInitialStepNumber(id),
               curStep = this._master.getStep();
         if(changeMaster && step !== 1 && (step > curStep) && !this._master.validate(curStep) || !this._alowed[step])
            return;
         this.setStepState(id, true);
         this.openStep(this._getNextVisibleStep(id));
         this._setWidthScale(id);
         this._setMarker(id);
         if(changeMaster)
            this._setStepInMaster(id);
      },
      /**
       * Возвращает id слудующего за данным видимого шага индикатора
       * @param {String|Number} step Идентификатор/Номер шага
       * @return {String}
       * @protected
       */
      _getNextVisibleStep: function(step){
         step = this._getInitialStepNumber(step);
         var
               tmp,
               next;
         this._container.find('.ws-master-progress-step-container:visible').each(function(){
            if(!next && (tmp = parseInt($(this).attr('step'), 10) + 1) > step)
               next = tmp;
         });
         return next ? this._getId(next) : 1;
      },
      /**
       * Делает шаг доступным для клика
       * @param {String|Number} step Идентификатор/Номер шага
       */
      openStep: function(step){
         step = this._getInitialStepNumber(step);
         this._alowed[step]  = true;
         this._container
               .find('[step=' + (step - 1) + ']')
               .css('cursor', 'pointer');
      },
      /**
       * Проверяет, доступен ли для клика шаг
       * @param {String|Number} step Идентификатор/Номер шага
       * @return {Boolean}
       */
      isOpen: function(step){
         return this._alowed[this._getInitialStepNumber(step)];
      },
      /**
       * Возвращает актуальный (действительный) номер шага
       * @param {String|Number} step Идентификатор/Номер шага
       * @return {Number}
       * @protected
       */
      _getActualStepNumber: function(step){
         return typeof step == 'number' ? this._complies[step] : this._getStepNumberById(step);
      },
      /**
       * Возвращает реальный (который был при инициализации) номер шага
       * @param {String|Number} step Идентификатор/Номер шага
       * @return {Number}
       * @protected
       */
      _getInitialStepNumber: function(step){
         var realStepNumber;
         if(typeof step !== 'number')
            step = this._getStepNumberById(step);
         for(var i in this._complies){
            if(this._complies.hasOwnProperty(i) && this._complies[i] == step){
               realStepNumber = i;
               break;
            }
         }
         return parseInt(realStepNumber, 10);
      },
      /**
       * Устанавливает ширину элемента, на который позиционируется маркер
       * @protected
       */
      _setPadding: function(){
         for (var i = 0; i < this._stepCount; i++) {
            var
                  step = this._container.find('#step-'+ (i + 1)),
                  stepMarkered = step.parent(),
                  stepContainer = stepMarkered.parent(),
                  stepCont = stepContainer.parent(),
                  markW = stepCont.width() - step.width() < 10 ? 160 : step.width() + 4;

            markW = markW > MIN_WIDTH_MARKER ? markW : MIN_WIDTH_MARKER;
            stepMarkered.width(markW);
            stepContainer.css('padding-top', step.height() > 20 ? 10 : 17);

         }
      },
      /**
       * Устанавливает маркер
       * @param {String} id Идентификатор шага
       * @protected
       */
      _setMarker: function(id){
         if (this._topParentBatchFinished) {
            var markered = this._container
                  .find('#ws-master-progress-' + id)
                  .find('.ws-master-progress-markered');
            Marker.positionToElement(markered,{
               width: 25,
               left: -11
            });
            Marker.setZIndex(this._topParent.getZIndex() + 1);
         }
      },
      /**
       * Устанавливает шаг в мастере
       * @param {String} id Идентификатор шага
       * @protected
       */
      _setStepInMaster: function(id){
         this._changed = true;
         this._master.setStep(id);
      },
      /**
       * Подписка на события мастера и родительского окна
       * @protected
       */
      _addEventListener: function(){
         var self = this;
         this._master.subscribe('onStepReady', self._onStepReadyHandler = function(e, step, id){
            if(self._changed)
               self._changed = false;
            else
               self._setStep(id, false);
         });
         if($ws.helpers.instanceOfModule(this._topParent, 'SBIS3.CORE.Window'))
            this._topParent
               .subscribe('onBeforeClose', self._onBeforeCloseHandler = function(){
                  Marker.hide();
               })
               .subscribe('onMove', self._onMoveHandler = function(){
                  self._setMarker(self._master.getStepId());
               });

         if(this._topParent.hasEvent('onBatchFinished')) {
            this._topParent.subscribe('onBatchFinished', this._onBatchFinishedHandler = function(){
               self._topParentBatchFinished = true;
               self._setMarker(self._master.getStepId());
            });
         }
         else {
            this._topParentBatchFinished = true;
         }
      },
      /**
       * Возвращает id шага по его номеру
       * @param {Number} step номер шага
       * @return {String}
       * @protected
       */
      _getId: function(step){
         return this._steps[step - 1].id;
      },
      /**
       * Возвращает номер шага по его id
       * @param {String} id Идентификатор шага
       * @return {Number}
       * @protected
       */
      _getStepNumberById: function(id){
         return this._complies[parseInt(this._container.find('#ws-master-progress-' + id).attr('step'), 10) + 1];
      },
      _onResizeHandler: function(){
         if(this._master){
            this._stepWidth = this._container.width() / this._stepCount;
            if (this._stepWidth < 180)
               this._stepWidth = 180;
            this._setPadding();
            this._setStep(this._master.getStepId(), false);
         }
      },
      /**
       * Задает состояние шага
       * @param {Number|String} step Номер/Идентификатор шага
       * @param {Boolean} state состояние шага(true: пройденный (также разрешает клик), false: неактивный(запрещен клик))
       */
      setStepState: function(step, state){
         step = this._getInitialStepNumber(step);
         this._alowed[step]  = state;
         this._container.find('[step=' + (step - 1) + ']')
               .css('cursor', state ? 'pointer' : 'default')
               .toggleClass('ws-master-progress-alow', state);
      },
      /**
       * Задает список шагов
       * @param {Array} steps массив идентификаторов шагов
       */
      setSteps: function(steps){
         this._stepCount = steps.length;
         this._stepWidth = this._container.width() / this._stepCount;
         var
               inArray,
               countVisible = 0;
         for(var i in this._steps){
            if(this._steps.hasOwnProperty(i)){
               inArray = $.inArray(this._steps[i].id, steps) !== -1;
               this._container
                     .find('#ws-master-progress-' + this._steps[i].id)
                     .width(100 / this._stepCount + '%')
                     .toggle(inArray);
               this._complies[parseInt(i, 10) + 1] = inArray ? ++countVisible : -1;
            }
         }
         this._recalcStepNumbers();
         this._notifyOnSizeChanged(this, this);
      },
      /**
       * Пересчитывает номера шагов при их изменении функцией setSteps
       * @protected
       */
      _recalcStepNumbers: function(){
         var i = 0;
         this._container.find('.ws-master-progress-title:visible').each(function(){
            $(this).text($(this).text().replace(/^\d/, ++i));
         });
      },
      destroy: function(){
         if($ws.helpers.instanceOfModule(this._topParent, 'SBIS3.CORE.Window'))
            this._topParent
                  .unsubscribe('onBeforeClose', this._onBeforeCloseHandler)
                  .unsubscribe('onMove', this._onMoveHandler);
         this._master.unsubscribe('onStepReady', this._onStepReadyHandler);
         this._onBatchFinishedHandler && this._topParent.unsubscribe('onBatchFinished', this._onBatchFinishedHandler);
         Marker.hide();
         $ws.proto.MasterProgress.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.MasterProgress;

});
