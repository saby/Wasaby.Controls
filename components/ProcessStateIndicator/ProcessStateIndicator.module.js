define('js!SBIS3.CONTROLS.ProcessStateIndicator', [
   'js!SBIS3.CORE.Control',
   'tmpl!SBIS3.CONTROLS.ProcessStateIndicator',
   'css!SBIS3.CONTROLS.ProcessStateIndicator'
], function(control, tplFn) {

   'use strict';
   
   /**
    * Компонент "Идникатор процесса"
    * @class SBIS3.CONTROLS.ProcessStateIndicator
    * @extends SBIS3.CORE.Control
    * @author Елифантьев Олег Николаевич
    *
    * @ignoreOptions independentContext contextRestriction extendedTooltip validators
    * @ignoreOptions element linkedContext handlers parent autoHeight autoWidth horizontalAlignment
    * @ignoreOptions isContainerInsideParent owner stateKey subcontrol verticalAlignment
    *
    * @ignoreMethods activateFirstControl activateLastControl addPendingOperation applyEmptyState applyState clearMark
    * @ignoreMethods changeControlTabIndex destroyChild detectNextActiveChildControl disableActiveCtrl findParent
    * @ignoreMethods focusCatch getActiveChildControl getChildControlById getChildControlByName getChildControls
    * @ignoreMethods getClassName getContext getEventBusOf getEventHandlers getEvents getExtendedTooltip getOpener
    * @ignoreMethods getImmediateChildControls getLinkedContext getNearestChildControlByName getOwner getOwnerId
    * @ignoreMethods getReadyDeferred getStateKey getTabindex getUserData getValue hasActiveChildControl hasChildControlByName
    * @ignoreMethods hasEventHandlers isActive isAllReady isDestroyed isMarked isReady makeOwnerName setOwner setSize
    * @ignoreMethods markControl moveFocus moveToTop once registerChildControl registerDefaultButton saveToContext
    * @ignoreMethods sendCommand setActive setChildActive setClassName setExtendedTooltip setOpener setStateKey activate
    * @ignoreMethods setTabindex setTooltip setUserData setValidators setValue storeActiveChild subscribe unregisterChildControl
    * @ignoreMethods unregisterDefaultButton unsubscribe validate waitAllPendingOperations waitChildControlById waitChildControlByName
    *
    * @ignoreEvents onActivate onAfterLoad onAfterShow onBeforeControlsLoad onBeforeLoad onBeforeShow onChange onClick
    * @ignoreEvents onFocusIn onFocusOut onKeyPressed onReady onResize onStateChanged onTooltipContentRequest
    * @ignoreEvents onDragIn onDragStart onDragStop onDragMove onDragOut
    * 
    * @ignoreOptions colorState
    *
    * @public
    * @control
    * @initial
    * <component data-component='SBIS3.CONTROLS.ProcessStateIndicator'>
    * </component>
    */
   
   var ProcessStateIndicator;
   
   var defaultColors = [
      'controls-ProcessStateIndicator__sector1', 
      'controls-ProcessStateIndicator__sector2', 
      'controls-ProcessStateIndicator__sector3'
   ];
   
   const DEFAULT_EMPTY_COLOR_CLASS = 'controls-ProcessStateIndicator__emptySector';
   
   
   ProcessStateIndicator = control.Control.extend(/** @lends SBIS3.CONTROLS.ProcessStateIndicator.prototype */ {
      /**
       * @event onItemOver Происходит при наведении мыши на любой из элементов индикатора
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {Number} valueIndex порядковый номер отображаемного значения, за который отвечает сектор под курсором. 
       *                 Если данный элемент не отвечает ни за какое значение, то равен -1 
       * @param {Number} sectorIndex порядковый номер сектора, находящегося подкурсором
       * @example
       * <pre>
       *    indicator.subscribe('onItemOver', function(eventObject, valueIndex, sectorIndex) {
       *
       *       // отмена загрузки изображения
       *       event.setResult(false);
       *    });
       * </pre>
       * 
       */
      $protected: {
         _options: {
            /**
             * @cfg {Number} Количество секторов в диаграмме
             * @example
             * <pre>
             *     <option name="numSectors">12</option>
             * </pre>
             */
            numSectors: 10,
            /**
             * @cfg {Number} Количество значений
             * @example
             * <pre>
             *     <option name="numValues">1</option>
             * </pre>
             */
            numValues: 1,
            /**
             * @cfg {Array.<String>} Цвета элементов индикатора. 
             * Указывается CSS-класс (название, без точки!), который будет установлен на элемент сектора.
             * Для количества элементов от 1 до 3 цвета можно не указывать, будут выбраны автоматически
             * в соответствии со спецификацией. Если требуется задать собственные цвета - перечислите их в данном 
             * массиве. Если требуется указать свой цвет для 4 и далее элемента, а первые три оставить по-умолчанию - 
             * укажите вместо них пустую строку. Если количество элементов превышает количество заданных цветов будет
             * выброшено исключение
             * @example
             * <pre>
             *     <options name="colors" type="array">
             *        <option></option> <!-- цвет по-умолчанию для первого элемента легенды = #72BE44 -->
             *        <option>mySecondIndicator</option> <!-- цвет для второго элемента задается классом mySecondIndicator -->
             *        <option></option> <!-- цвет по-умолчанию для третьего элемента легенды = #EF463A -->
             *        <option>myLastIndicator</option> <!-- цвет для четвертого элемента задается классом myLastIndicator -->
             *     </options>
             * </pre>
             */
            colors: defaultColors.slice(),
            /**
             * @cfg {Array.<Number>} Текущее состояние индикатора. Массив чисел, каждое из которых задает текущий
             * прогресс выполнения процесса
             * @see setState
             * @see getState
             * @example
             * <pre>
             *    <!-- два процесса, один завершен на 10 процентов, второй на 20 -->
             *    <options name="state" type="array">
             *       <option>10</option>
             *       <option>20</option>
             *    </options>   
             * </pre>
             */
            state: [],
            colorState: []
         }
      },
      _dotTplFn: tplFn,
      $constructor: function() {
         this._publish('onItemOver');
      },
      init: function() {
         var self = this;
         
         ProcessStateIndicator.superclass.init.apply(this, arguments);
         
         this.getContainer().delegate('.controls-ProcessStateIndicator--box', 'mouseover', function(e) {
            var itemIndex = self.getContainer().find('.controls-ProcessStateIndicator--box').index(e.target);
            self._notify('onItemOver', +e.target.getAttribute('data-item'), itemIndex)             
         });
      },
      _prepareColors: function(colors) {
         
         colors = colors || [];
         
         colors = colors.concat(defaultColors.slice(colors.length)).map(function(color, idx) {
            return color || defaultColors[idx]; 
         });                 
         
         if (this._options.numValues > this._options.colors.length) {
            throw new Error('Number of values is greater than number of colors');
         }
         
         return colors;
      },
      _modifyOptions: function() {
         var opts = ProcessStateIndicator.superclass._modifyOptions.apply(this, arguments);
         
         opts.colors = this._prepareColors(opts.colors); 
         opts.colorState = this._calculateColorState();
         
         return opts;
      },
      /**
       * Возвращает текущее состочение процесса в виде массива чисел
       * @return {Array.<Number>} 
       */
      getState: function() {
         return this._options.state;   
      },
      /**
       * Устанавливает сотояние индикатора. Передача любого пустого значения полностью сбрасывает состояние
       * Если передать значений больше, чем указано numValues, лишние значения будут проигнорированы
       * @param {Array.<Number>} state Массив чисел - процентов выполнение элементов процесса. 
       * Все не-числа будут преобразованы к числу. Отрицательные превращены в 0. 
       * @see numValues
       */
      setState: function(state) {
         if (!state) {
            state = [];
         }
         if (state instanceof Array) {
            this._options.state = state;
            this._applyState();
         }
      },
      /**
       * По state вычисялет распределение цветов по секторам
       * @return {Array}
       * @private
       */
      _calculateColorState: function(colors) {
         var 
            sectorSize = (100 / this._options.numSectors) >> 0,
            state = this._options.state || [],
            colorValues = [],
            curSector = 0,
            i, j, color, itemValue, itemNumSectors;
         
         colors = colors || this._options.colors;
         
         for(i = 0; i < Math.min(this._options.numValues, state.length); i++) {
            // Больше чем знаем цветов не рисуем
            if (i < colors.length) {
               // Приводим к числу, отрицательные игнорируем 
               itemValue = Math.max(0, +state[i] || 0);
               color = colors[i];
               itemNumSectors = (itemValue / sectorSize) >> 0;
               if (itemValue > 0 && itemNumSectors === 0) {
                  // Если значение элемента не нулевое, 
                  // а количество секторов нулевое (из-за округления) то увеличим до 1 (см. спецификацию)
                  itemNumSectors = 1;
               }
               for(j = 0; j < itemNumSectors; j++) {
                  colorValues[curSector++] = {
                     color: color,
                     item: i
                  };
               }
            }
         }   
         
         return colorValues;
      },
      /**
       * Выполняет частичную перерисовку компонента (раскатывает цвета на уже нарисованные сегменты)
       * @private
       */
      _applyState: function() {
         
         var colorState;
         
         this._options.colorState = colorState = this._calculateColorState();this.getContainer().find('span').each(function(i) {
            $(this)
               .removeClass()
               .addClass(colorState[i] && colorState[i].color || DEFAULT_EMPTY_COLOR_CLASS)
            .attr({
               'data-item': colorState[i] ? colorState[i].item : -1
            });  
         });
      }
   });
   
   return ProcessStateIndicator;
   
});
