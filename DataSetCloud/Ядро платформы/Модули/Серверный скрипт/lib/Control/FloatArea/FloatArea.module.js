/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 22.04.13
 * Time: 10:19
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.FloatArea', ['js!SBIS3.CORE.TemplatedArea', 'js!SBIS3.CORE.FloatAreaManager',
                                   'js!SBIS3.CORE.CloseButton', 'js!SBIS3.CORE.ModalOverlay',
                                   'css!SBIS3.CORE.FloatArea', 'is!browser?js!Ext/jquery-ui/jquery-ui-position'], function( TemplatedArea, FloatAreaManager, CloseButton, ModalOverlay ) {

   'use strict';

   var USE_ANIMATION = FloatAreaManager._useAnimation(),
       USE_CSS3 = FloatAreaManager._useCss3(),
       BODY = (typeof window !== 'undefined') && $('body'),
       CHILD_WINDOW_CLASSES = ['SBIS3.CORE.FloatArea', 'SBIS3.CORE.Window'],
       ANIMATION_MAX_WAIT = 700,
       ANIMATION_LENGTH = 150,
       MIN_ANIMATION_LENGTH = 20,
       DEFAULT_SIZE = 200,    //Значение, которое будет использоваться для размеров области по-умолчанию
       HOVER_TIMEOUT = 1000,  //Длительность таймера, по истечении которого панель будет скрыта (при использовании опции {@link $ws.proto.FloatArea#hoverTarget})
       SHOW_DELAY = 300;      //Дефолтная задержка показа панели. Используется это значение, если указана опция {@link $ws.proto.FloatArea#hoverTarget}, иначе - 0


   function getPositionConfig(floatArea, direction, side, valign, offset, fitWindow) {

      function addOffset(offsetSide, offset) {

         var margin = floatArea._getContainerCssIntProp('margin-' + offsetSide),
             sideSigns = {left: -1, right: 1, top: -1, bottom: 1},
             offsetFixed = (offset || 0) + (sideSigns[offsetSide] || 0) * margin,
             offsetStr = offsetFixed ? (offsetFixed > 0 ? '+' : '') + offsetFixed  : '';

         return offsetSide + offsetStr;
      }

      var result = { collision: fitWindow ? 'fit' : 'none' },
          DIR_REVERSE = {
             top: 'bottom',
             bottom: 'top',
             left: 'right',
             right: 'left'
          };

      // jQuery position принимает положение как center а мы храним как middle
      if (valign == 'middle') {
         valign = 'center';
      }

      switch(direction) {
         case 'top':
         case 'bottom':
            result.my = addOffset(side, offset.x)  + ' ' + addOffset(DIR_REVERSE[direction], offset.y);
            result.at = side + ' ' + valign;
            break;

         case 'left':
         case 'right':
            result.my = addOffset(side, offset.x) + ' ' + addOffset('top', offset.y);
            result.at = side + ' ' + valign;
      }

      return result;
   }

   function forStackOnly(func) {
      return function() {
         if (this._options.isStack) {
            return func.apply(this, arguments);
         }
      };
   }

   function forNonStackOnly(func) {
      return function() {
         if (!this._options.isStack) {
            return func.apply(this, arguments);
         }
      };
   }

   var forAliveOnly = $ws.helpers.forAliveOnly;

   function forReadyOnly(func, selfArg) {
      return function() {
         var self = selfArg || this,
             args = arguments;

         return this.getReadyDeferred().addCallback(function() {
            if (!self.isDestroyed()) {
               return func.apply(self, args);
            }
         });
      };
   }

   //ХАК: Исправляем глюк фаерфокса с событием transitionend: оно может не срабатывать почему-то, хотя анимация как бы кончилась.
   //Опрашиваем свойство по таймауту, и сигналим событие вручную.
   function fixCss3TransitionEndEvent(element, prop, endValue, waitStartDelay, maxWait) {
      function propOk(curVal) {
         return (curVal === endValue) || (curVal === 0 && endValue === '0px');
      }

      setTimeout(function() {
         var $element = $(element),
             startTime = +(new Date()),
             intervalId;

         if (propOk($element.css(prop))) {
            $element.trigger('transitionend');
         } else {
            intervalId = setInterval(function() {
               if (propOk($element.css(prop))) {
                  clearInterval(intervalId);
                  $element.trigger('transitionend');
               } else {
                  var time = +(new Date());
                  if (time - startTime > maxWait) {
                     clearInterval(intervalId);
                  }
               }
            }, 50);
         }
      }, waitStartDelay);
   }

   /**
    * Всплывающая панель
    * Панель, которая либо выезжает с левого края, либо появляется с правого края с fadeIn
    *
    * @class $ws.proto.FloatArea
    * @extends $ws.proto.TemplatedAreaAbstract
    * @control
    */
   $ws.proto.FloatArea = TemplatedArea.extend(/** @lends $ws.proto.FloatArea.prototype */{
      /**
       * @event onClose Перед закрытием панели
       * Событие происходит в момент начала анимации закрытия всплывающей панели.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      /**
       * @event onBeforeShow Перед началом показа панели или при первой загрузке шаблона
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * Перед началом анимации открытия панели проверяем отступы - не превышают ли они размеры текущего документа.
       * <pre>
       *     onBeforeShow: function() {
       *        var offSet = this.getOffset();
       *        if (offset.x > $(document).width()) {
       *           offSet.x=0;
       *        }
       *        if (offSet.y > $(document).height()) {
       *           offSet.y=0;
       *        }
       *        this.setOffset(offSet);
       *     }
       * </pre>
       */
      /**
       * @event onAfterShow При показаной панели и готовых контролах
       * Событие срабатывает после выполнения обоих пунктов:
       * <ol>
       *    <li>показа панели,</li>
       *    <li>готовности контролов на этой панели.</li>
       * </ol>
       * Событие наступает на каждый показ панели.
       * @example
       * Устанавливаем значение в поле ввода (Строка 1) после показа всплывающей панели:
       * <pre>
       *    floatArea.subscribe('onAfterShow', function(){
       *       if (this.isVisible()) {
       *          this.getTopParent().getChildControlByName('Строка 1').setValue('какое-то значение');
       *       }
       *    })
       * </pre>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      /**
       * @event onAfterClose После того, как панель закроется
       * Событие срабатывает после окончания анимации закрытия панели, когда её больше не видно.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param [result] Параметр приходит из команды {@link close}, передаётся в обработчик события.
       * @example
       * По окончании анимации закрытия панели откроем другую всплывающую панель:
       * <pre>
       *     floatArea.subscribe('onAfterClose', function(){
       *        //открываем вторую всплывающую панель
       *        $ws.helpers.showFloatArea({
       *           name: this.getName() + '2',
       *           template: "Окно выбора",
       *           //кнопка открытия первой всплывающей панели
       *           target: btn
       *        });
       *     })
       * </pre>
       * @see close
       */
      /**
       * @event onBeforeClose Перед началом закрытия панели
       * Событие срабатывает перед началом анимации закрытия всплывающей панели.
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param [result] Параметр приходит из команды {@link close}, передаётся в обработчик события.
       * @return {Boolean} Можно запретить закрытие панели, если передать false.
       * @see hide
       * @see close
       */
      /**
       * @event onScroll Событие на прокрутку панели из стека
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Object} scrollData Объект с данными прокрутки:
       *  {
       *    element: element,                           //Блок, оборачивающий и прокручивающий содержимое панели
       *    clientHeight: element.height(),             //Клиентская высота (высота видимой области) у блока прокрутки
       *    scrollTop: element.prop('scrollTop'),       //Позиция прокрутки
       *    scrollHeight: element.prop('scrollHeight')  //Высота содержимого панели
       *  }
       *  Если (clientHeight + scrollTop) === scrollHeight, то панель докрутилась до низа
       */
      $protected: {
         _options: {
            /**
             * @cfg {String|jQuery|HTMLElement} Элемент, к углам которого будет прижиматься контрол.
             * <wiTag group="Управление">
             * В случае, если указана опция {@link fixed} === true, опция {@link target} игнорируется,
             * и target-ом считается окно браузера (window), поскольку элемент с фиксированным позиционированием располагается
             * в системе координат окна, а не документа.
             * Подробнее см. описание опции {@link fixed}.
             * Актуально только при использовании {@link isStack} === false (для нестековых панелей), для стековых же эта опция игнорируется.
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          // всплывающая панель привязывается к кнопке, её вызывающей
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see animation
             * @see slide
             * @see verticalAlign
             * @see direction
             * @see isStack
             * @see fixed
             */
            target: '',
            /**
             * @cfg {String} Горизонтальная позиция панели относительно элемента, заданного в опции target
             * <wiTag group="Управление">
             * Позиционирование панели по горизонтали относительно {@link target}'а.
             * Актуально при использовании {@link isStack} === false.
             * Возможные значения:
             * <ol>
             *    <li>'left': панель привязывается с левому краю элемента {@link target}'а,</li>
             *    <li>'right': панель привязывается с правому краю элемента {@link target}'а,</li>
             *    <li>'center': панель привязывается к центру элемента (по горизонтали), выезжает вниз или вверх в зависимости от опции {@link direction},
             *        привязка же к верхнему или нижнему краю элемента определяется опцией {@link verticalAlign}.</li>
             * </ol>
             * Горизонтальный край панели, который привязывается к заданному в этой опции краю элемента, указывается в опции {@link direction} (она же определяет направление анимации).
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          //панель выезжает справа налево
             *          direction: 'left',
             *          //верхний край панели привязан к верхнему краю target
             *          verticalAlign: 'top',
             *          //правый край панели привязан к правому краю target
             *          side: 'right',
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see verticalAlign
             * @see direction
             * @see target
             * @see isStack
             */
            side: 'left',
            /**
             * @cfg {Number|String} Ширина окна
             * <wiTag group="Данные">
             * @see height
             */
            width: 0,
            /**
             * @cfg {Number|String} Высота окна
             * <wiTag group="Данные">
             * @see width
             */
            height: 0,
            /**
             * @cfg {String} Тип анимации
             * <wiTag group="Управление">
             * Возможные значения:
             * <ol>
             *    <li>'slide' - панель выезжает (поведение при выезжании регулируется опциями {@link side} и {@link direction}),</li>
             *    <li>'fade' - панель появляется.</li>
             * </ol>
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          isStack: true,
             *          //задаём тип анимации - панель появится
             *          animation: 'fade',
             *          // всплывающая панель привязывается к кнопке, её вызывающей
             *          target: this.getContainer(),
             *          overlay: false,
             *       });
             *    }
             * </pre>
             * @see target
             * @see direction
             * @see verticalAlign
             * @saa animationLength
             */
            animation: 'slide',
            /**
             * @cfg {Boolean} Будет ли автоматически скрываться панель
             * <wiTag group="Управление">
             * Всплывающая панель может автоматически скрыться, когда активируется какой-то контрол на несвязанной области.
             * Чтобы избежать скрытия панели, нужно передавать параметр "opener" дочерним окнам.
             * При установке этой опции в false закрыть панель можно будет только кликом на крестик или клавишей esc.
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          direction: 'top',
             *          animationLength: 1500,
             *          //задаём отсутствие автоматического скрытия панели
             *          autoHide: false,
             *          verticalAlign: 'bottom',
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see opener
             */
            autoHide: true,
            /**
             * @cfg {Boolean} Будет ли панель автоматически удаляться после скрытия
             * <wiTag group="Управление">
             * То есть, будет ли команда {@link hide} работать так же, как команда {@link close}.
             * По умолчанию этот параметр выключен: команда {@link hide} прячет панель, но не удаляет, а команда {@link close} прячет и удаляет.
             * Если же значение данной опции задать true, то команда {@link hide} работает так же, как и {@link close}, и панель удаляется
             * сразу после закрытия, т.е. удаляется экземпляр класса $ws.proto.FloatArea.
             * Внешне отследить применение этой опции нельзя. Можно проверить методом isDestroyed.
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          //задаём автоматическое удаление вызванной панели
             *          autoCloseOnHide: true,
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see hide
             * @see close
             * @see autoHide
             */
            autoCloseOnHide: false,
            /**
             * @cfg {String} Вертикальная позиция панели относительно элемента, заданного в опции target
             * <wiTag group="Отображение">
             * Актуально при использовании {@link isStack} === false.
             * Возможные значения:
             * <ol>
             *    <li>'top': панель привязывается к верхнему краю {@link target}'а </li>
             *    <li>'middle': панель привязывается к середине {@link target}'а </li>
             *    <li>'bottom': панель привязывается к нижнему краю {@link target}'а </li>
             * </ol>
             * Вертикальный край панели, который привязывается к заданному в этой опции краю элемента, указывается в опции {@link direction} (она же определяет направление анимации).
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          //панель выезжает справа-налево
             *          direction: 'left',
             *          //середина панели по вертикали привязана к середине target по высоте
             *          verticalAlign: 'middle',
             *          //правый край панели привязан к правому краю target
             *          side: 'right',
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see side
             * @see target
             * @see direction
             * @see isStack
             */
            verticalAlign: 'top',
            /**
             * @cfg {String} Направление выезжания панели
             * <wiTag group="Отображение">
             * Актуально при использовании {@link isStack} === false.
             * Возможные значения:
             * <ol>
             *    <li>'' -  в сторону, обратную расположению по горизонтали (side),</li>
             *    <li>'top' - панель выезжает вверх,</li>
             *    <li>'left' - панель выезжает влево,</li>
             *    <li>'right' - панель выезжает вправо,</li>
             *    <li>'bottom' - панель выезжает вниз.</li>
             * </ol>
             * @example
             * Можно расположить панель в верхнем правом углу блока и заставить выезжать вверх.
             * Любое сочетание расположения и направления разрешено.
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          //панель выезжает снизу-вверх
             *          direction: 'top',
             *          //правый край панели привязан к правому краю target
             *          side: 'right',
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see verticalAlign
             * @see side
             * @see target
             * @see isStack
             * @see animation
             */
            direction: '',
            /**
             * @cfg {Number} Длительность анимации
             * <wiTag group="Отображение">
             * Если не указать, то берётся дефолтное (150 мс)
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          direction: 'top',
             *          //задаём скорость анимации открытия/закрытия панели - медленнее дефолтного значения
             *          animationLength: 1500,
             *          verticalAlign: 'bottom',
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see animation
             */
            animationLength: ANIMATION_LENGTH,
            /**
             * @cfg {Number} Стартовая ширина для анимации
             * <wiTag group="Управление">
             * Опция актуальна при типе анимации slide и направлении выезжания влево/вправо.
             * Данной опцией устанавливается начальная ширина анимации открытия панели. По умолчанию панель выезжает с нуля.
             * Можно настроить появление панели, например, с видимой половиной.
             * В случае установки начальных размеров, соответствующих действительным размерам панели, то анимация выезжания
             * будет выглядеть как анимация появления.
             * Если панель выезжает влево, то соответственно задаётся ширина части панели слева, которая будет видна при
             * начале анимации.
             * Если панель выезжает вправо, то соответственно задаётся ширина части панели справа.
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          direction: 'right',
             *          //задаём начальную ширину при анимации открытия в половину панели (ширина панели 500)
             *          startWidth: 250,
             *          animationLength: 2000,
             *          verticalAlign: 'bottom',
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see animation
             * @see target
             * @see startHeight
             * @see side
             */
            startWidth: 0,
            /**
             * @cfg {Number} Стартовая высота для анимации
             * <wiTag group="Управление">
             * Опциия актуальна при типе анимации slide и направлениях выезжания вверх/вниз.
             * Данной опцией устанавливается начальная высота анимации открытия панели. По умолчанию панель выезжает с нуля.
             * Можно настроить появление панели, например, с видимой половиной.
             * В случае установки начальных размеров, соответствующих действительным размерам панели, то анимация выезжания
             * будет выглядеть как анимация появления.
             * Если панель выезжает вверх, то в данной опции задаётся высота верхней части панели, с которой начнётся анимация.
             * Если панель выезжает вниз, то наоборот, задаётся высота нижней части.
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          direction: 'top',
             *          animationLength: 2000,
             *          //панель начнёт выезжать с открытой верхней половиной (высота панели 400)
             *          startHeight: 200,
             *          verticalAlign: 'bottom',
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see animation
             * @see target
             * @see startWidth
             * @see direction
             */
            startHeight: 0,
            /**
             * @cfg {Object} Отступ относительно блока
             * <wiTag group="Отображение">
             * Задаётся объектом {x: number, y: number}.
             * Положительные значения y смещают панель вниз, отрицательные - вверх.
             * Положительные значения x смещают панель вправо, отрицательные - влево.
             * Отступ не зависит от направления показа панели или чего-либо ещё.
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          direction: 'right',
             *          //задаём смещение панели относительно установленных привязок к target - кнопке открытия панели
             *          //смещаем вправо и вниз
             *          offset: {
             *             x: 100,
             *             y: 200
             *          },
             *          animationLength: 2000,
             *          verticalAlign: 'bottom',
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             * @see setOffset
             * @see getOffset
             */
            offset: {
               x: 0,
               y: 0
            },
            /**
             * @cfg {Boolean} Будет ли панель иметь position: fixed. В случае, если указана опция fixed === true, опция {@link target} игнорируется,
             * и target-ом считается окно браузера (window), поскольку элемент с фиксированным позиционированием располагается в системе координат окна, а не документа.
             * <wiTag group="Управление">
             * Не работает, если указать {@link isStack} === true. То есть, для стековых панелей игнорируется.
             * @see isStack
             * @see target
             */
            fixed: false,
            /**
             * @cfg {Boolean} Надо ли показывать панель при создании
             * <wiTag group="Управление">
             * Возможные значения:
             * <ol>
             *    <li>true - надо показывать панель при создании,</li>
             *    <li>false - не надо показывать.</li>
             * </ol>
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Шаблон",
             *          target: this.getContainer(),
             *          //отменяем показ сразу при создании
             *          autoShow: false
             *       });
             *    },
             *    //покажем панель после загрузки - установим соответствующий обработчик на "Шаблон" панели
             *    onAfterLoad: function(){
             *       this.show();
             *    }
             * </pre>
             * @see catchFocus
             */
            autoShow: true,
            /**
             * @cfg {Boolean} Переносить ли фокус на панель при открытии
             * <wiTag group="Управление">
             * Возможные значения:
             * <ol>
             *    <li>true - переносить фокус на панель при открытии,</li>
             *    <li>false - не переносить фокус на панель.</li>
             * </ol>
             * @see autoShow
             */
            catchFocus: true,
            /**
             * @cfg {String|jQuery|HTMLElement} Элемент: при наведении мыши на него панель скроется
             * <wiTag group="Управление">
             * Если будет указано, то при наведении мыши на этот указанный элемент панель будет скрываться, а при уходе
             * выше с элемента и с панели она будет скрываться. Имеет смысл использовать вместе с {@link autoShow} = false.
             * Рекомендуется использовать через {@link $ws.helpers.showHoverFloatArea} ({@link autoShow} тогда будет равно false).
             * @see autoShow
             * @see showDelay
             */
            hoverTarget: undefined,
            /**
             * @cfg {Number} Задержка показа панели
             * <wiTag group="Отображение">
             * Особенно актуально при использовании опции {@link hoverTarget}.
             * Если не указывать, будет 0, если не используется {@link hoverTarget}, или $ws._const.FloatArea.showDelay в противном случае.
             * Опция задаёт задержку (в миллисекундах) между вызовом панени и началом анимации открытия.
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          isStack: false,
             *          direction: 'right',
             *          animationLength: 2000,
             *          //задаём задержку показа
             *          showDelay: 10000,
             *          verticalAlign: 'bottom',
             *          target: this.getContainer(),
             *          overlay: false,
             *       });
             *    }
             * </pre>
             * @see hoverTarget
             */
            showDelay: undefined,
            /**
             * @cfg {Boolean} Нужно ли отображать панель в пределах окна
             * <wiTag group="Отображение">
             */
            fitWindow: false,
            /**
             * @cfg {Boolean} Показывать ли тень от панели целиком
             * <wiTag group="Отображение">
             * Возможные значения:
             * <ol>
             *    <li>true - показывать тень от панели целиком,</li>
             *    <li>false - обрезать тень от панели по краям, к которым привязана панель.</li>
             * </ol>
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          direction: 'right',
             *          animationLength: 2000,
             *          //задаём наличие тени со всех сторон
             *          fullShadow: true,
             *          verticalAlign: 'bottom',
             *          target: this.getContainer()
             *       });
             *    }
             * </pre>
             */
            fullShadow: false,
            /**
             * @cfg {String} Расположение крестика внутри панели
             * <wiTag group="Отображение">
             * Для FilterFloatArea задаёт и расположение тени.
             * Возможные значения:
             * <ol>
             *    <li>right - крестик справа,</li>
             *    <li>left - крестик слева.</li>
             * </ol>
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          isStack: true,
             *          //задаём расположение крестика на панели слева
             *          controlsSide: 'left',
             *          target: this.getContainer(),
             *          overlay: false
             *       });
             *    }
             * </pre>
             * @see direction
             * @see side
             * @see verticalAlign
             */
            controlsSide: 'right',
            /**
             * @cfg {Boolean} Нужно ли использовать поведение "стека всплывающих панелей"
             * <wiTag group="Отображение">
             * Возможные значения:
             * <ol>
             *    <li>true - панель стековая,</li>
             *    <li>false - панель не стековая.</li>
             * </ol>
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          //укажем, что панель стековая
             *          isStack: true,
             *          //зададим наличие оверлея
             *          overlay: true
             *       });
             *    }
             * </pre>
             * @see overlay
             * @see opener
             * @see controlsSide
             * @see hideSideBar
             */
            isStack: false,
            /**
             * @cfg {Boolean} Скрыть ли аккордеон при открытии панели
             * <wiTag group="Управление">
             * Будет ли скрываться боковая панель (если она есть) при открытии данной панели.
             * Только при использовании {@link isStack} === true! То есть актуально для стека панелей.
             * Повлиять на скрытие аккордеона можно только при вызове первой панели.
             * Возможные значения:
             * <ol>
             *    <li>true - скрыть аккордеон,</li>
             *    <li>false - не скрывать.</li>
             * </ol>
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          isStack: true,
             *          //оставляем аккордеон
             *          hideSideBar: false,
             *          overlay: true
             *       });
             *    }
             * </pre>
             * @see isStack
             */
            hideSideBar: true,

            /**
             * @cfg {Boolean} Использовать ли оверлей. Синоним опции modal
             * <wiTag group="Отображение">
             * @deprecated Опция устарела, и значит то же самое, что и опция modal (для унификации с классом Window).
             * Пользуйтесь опцией modal, и смотрите примеры по ней.
             * @see modal
             */
            overlay: false,

            /**
             * @cfg {Boolean} Модальность. Определяет, является ли панель модальной.
             * Опция аналогична опции modal из класса Window.
             * <wiTag group="Отображение">
             * Возможные значения:
             * <ol>
             *    <li>false - панель будет немодальной, то есть, не будет закрывать остальной интерфейс</li>
             *    <li>true - панель будет модальной: всё, кроме панели, скрыто и недоступно для взаимодействия</li>
             * </ol>
             * @example
             * Текст обработчика клика на кнопку:
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Окно всплывающей панели",
             *          isStack: true,
             *          modal: true
             *       });
             *    }
             * </pre>
             */
            modal: false,

            /**
             * @cfg {Boolean} Опция аналогична такой же опции в классе {@link $ws.proto.Window Window}
             * <wiTag group="Отображение">
             * Задаёт наличие кнопки закрытия панели (под "рамкой" подразумеваются стандартные элементы управления окна:
             * заголовок, кнопки закрытия, разворота и т.д.). По умолчанию включена.
             * В отсутствии крестика закрыть панель можно после перевода фокуса на неё нажатием клафиши Esc.
             * @example
             * <pre>
             *    openFloatArea: function(){
             *       $ws.helpers.showFloatArea({
             *          opener: this,
             *          name: this.getName()+'-floatArea',
             *          template: "Шаблон",
             *          target: this.getContainer(),
             *          //убираем кнопку закрытия
             *          border: false
             *       });
             *    }
             * </pre>
             */
            border: true,

            /**
             * @cfg {String} Заголовок плавающей панели
             * <wiTag group="Отображение">
             * Текст, отображаемый в заголовке плавающей панели.
             * @translatable
             */
            caption: undefined
         },
         _horizontalAlignment: 'Left',
         _loaded: false,
         _loadStarted: false,
         _closeButton: undefined,
         _overflow: undefined,
         _containerShadow: undefined,
         _visibleRoot: undefined,
         _visibleRootWrapper: undefined,
         _generatedTitleContainer: undefined,
         _target: undefined,
         _hoverTarget: undefined,
         _state: '',
         _stateStage: '',
         _visible: false,
         _collapsedSides: {},
         _hoverTimer: undefined,
         _locksShowed: 0,
         _childWindows: [],   // Используем массив, на случай одинаковых id. Если когда-то будут обязательно уникальные id, то это можно будет переделать
         _showTimer: undefined,
         _keysWeHandle: [
            $ws._const.key.tab,
            $ws._const.key.enter,
            $ws._const.key.esc
         ],
         _zIndex: 0,
         _caption: undefined,
         _maxWidthSet: undefined,
         _firstSizeCalcOnShow: false,
         _autoShow: false,
         _touchX: 0,
         _touchDistance: 0,
         _addedToStack: false,
         _result: undefined,
         _beforeAnimationTimer: undefined,
         _transitionEndHandler: undefined,
         _showDeferred: undefined,
         _hideFinishFn: undefined,
         _userTitle : undefined,        //jQuery - ссылка на "ручной заголовок" - пользовательский загловок
         _useCss3: false,
         _useAnimation: false,
         _useStackPanelHeightRecalc: false,
         _noStackShadowClassPostfix: 'standart',
         _inApplyBatchUpdateIntermediate: 0,
         _memoizedFuncs: {},
         _childPanelSizes: {}
      },
      $constructor: function(cfg){
         this._isModal = this._isModal || this._options.overlay;

         this._publish('onClose', 'onShow', 'onBeforeClose', 'onAfterClose', 'onScroll', 'onTargetVisibilityChange');

         $ws.single.CommandDispatcher.declareCommand(this, 'show', this.show);
         $ws.single.CommandDispatcher.declareCommand(this, 'hide', this.hide);
         $ws.single.CommandDispatcher.declareCommand(this, 'close', this.close);

         $ws.single.FloatAreaManager._addArea(this);

         this._zIndex = $ws.single.WindowManager.acquireZIndex(false);
         this._visibleRoot.css('z-index', this._zIndex);

         if (this._isModal) {
            this.subscribeTo(ModalOverlay, 'onClick', function(event) {
               //Если оверлей показан для этой панели (она модальная и выше всех других модальных), то нужно закрыться
               if (this.isVisible() && $ws.single.ModalOverlay.isShownForWindow(this)) {
                  event.setResult(true);
                  this.hide();
               }
            }.bind(this));
         }
      },

      /**
       * Возвращает опции для FloatAreaManager'а
       * @returns {Object}
       * @private
       */
      _getManagerOptions: function() {
         return {
            hideSideBar: this._options.hideSideBar
         };
      },
      /**
       * Добавляет себя в FloatAreaManager
       * @private
       */
      _initStack: forStackOnly(function(){
         if(!this._addedToStack){
            this._addedToStack = true;
            $ws.single.FloatAreaManager._setAreaInfo(this, this._getManagerOptions());
         }
      }),
      /**
       * Проверяет, с какой стороны должна быть расположена панель
       * @private
       */
      _prepareSideOptions: function(){
         if(this._options.side !== 'left' && this._options.side !== 'right' && this._options.side !== 'center'){
            this._options.side = 'left';
            $ws.single.ioc.resolve('ILogger').error('FloatArea', 'Incorrect _options.side');
         }
         if(this._options.verticalAlign !== 'top' &&
               this._options.verticalAlign !== 'bottom' &&
               this._options.verticalAlign !== 'middle'){
            this._options.verticalAlign = 'top';
            $ws.single.ioc.resolve('ILogger').error('FloatArea', 'Incorrect _options.verticalAlign');
         }
         if(this._options.animation !== 'slide' && this._options.animation !== 'fade' && this._options.animation !== 'off'){
            this._options.animation = 'slide';
            $ws.single.ioc.resolve('ILogger').error('FloatArea', 'Incorrect _options.animation');
         }
         if (this._options.isStack) {
            this._options.side = 'right';
            this._options.target = BODY;
            this._options.fixed = false;
         } else if (this._options.fixed) {
            this._options.target = $(window);
         } else if (!this._options.target) {
            this._options.target = BODY;
         }
      },
      /**
       * Проверяет, указано ли допустимое направление анимации
       * @private
       */
      _checkDirectionLegalValues: function(){
         if(this._options.direction !== '' &&
            this._options.direction !== 'left' && this._options.direction !== 'right' &&
            this._options.direction !== 'top' && this._options.direction !== 'bottom'){
            this._options.direction = '';
            $ws.single.ioc.resolve('ILogger').error('FloatArea', 'Incorrect direction');
         }
      },
      /**
       * Расчитывает направление для анимации, если это необходимо
       * @private
       */
      _checkAutoDirection: function(){
         if(this._options.direction === ''){
            if(this._options.side === 'left'){
               this._options.direction = 'right';
            }
            else if(this._options.side === 'right'){
               this._options.direction = 'left';
            }
            else if(this._options.verticalAlign === 'top'){
               this._options.direction = 'bottom';
            }
            else if(this._options.verticalAlign === 'bottom'){
               this._options.direction = 'top';
            }
            else{
               this._options.direction = 'left';
               if(this._options.animation === 'slide'){
                  $ws.single.ioc.resolve('ILogger').error('FloatArea', 'Unspecified direction');
               }
            }
         }
      },
      /**
       * Просчитывает стороны, где не должно быть теней
       * @private
       */
      _prepareCollapsedSides: function(){
         var side = this._options.side,
             dir = this._options.direction,
             valign = this._options.verticalAlign,
             isStack = this._options.isStack;

         if (this._options.fullShadow) {
            // Если просят полную тень - все стороны видны
            this._collapsedSides = {'left': false, 'right': false, 'top': false, 'bottom': false};
         } else if (isStack) {
            // В стэке тень видна только слева
            this._collapsedSides = {
               left: false,
               right: true,
               top: true,
               bottom: true
            }
         } else {
            // Во всех остальных случаях смотрим на side, dir, valign
            this._collapsedSides = {
               left: (side === 'left'  && dir !== 'left') || (side === 'right' && dir === 'right'),
               right: (side === 'right' && dir !== 'right') || (side === 'left'  && dir === 'left'),
               top: (valign === 'top' && dir !== 'top') || (valign === 'bottom' && dir === 'bottom'),
               bottom: (valign === 'bottom' && dir !== 'bottom') || (valign === 'top'    && dir === 'top')
            }
         }
      },
      /**
       * Инициализация остальных обычных параметров
       * @private
       */
      _prepareGeneralOptions: function(){
         this._options.width = parseInt(this._options.width, 10);
         if(isNaN(this._options.width)){
            this._options.width = DEFAULT_SIZE;
         }
         this._width = this._options.width;
         this._options.height = parseInt(this._options.height, 10);
         if(isNaN(this._options.height)){
            this._options.height = DEFAULT_SIZE;
         }
         this._height = this._options.height;
         this._autoShow = this._options.autoShow;
         if(this._options.showDelay === undefined){
            if(this._hoverTarget){
               this._options.showDelay = SHOW_DELAY;
            }
            else{
               this._options.showDelay = 0;
            }
         }
      },
      /**
       * Подготавливает элементы
       * @protected
       */
      _prepareElements: function(){
         $ws.proto.FloatArea.superclass._prepareElements.apply(this, arguments);

         this._prepareSideOptions();

         this._checkDirectionLegalValues();
         this._checkAutoDirection();

         this._prepareCollapsedSides();
         this._prepareGeneralOptions();

         this._prepareArea();
         this._prepareHover();

         if (this._options.fixed) {
            this._target = $(this._options.target);
         } else {
            this.setTarget(this._options.target);
         }
      },

      _getAreaType: function(){
         var result;

         if (this._options.isStack) {
            result = 'STACK';
         } else {
            result = 'NO_STACK';
         }

         return result;
      },

      _handleStackScroll: function(event) {
         var element;
         if (this.hasEventHandlers('onScroll')) {
            element = $(event.target);
            this._notify('onScroll', {
               element: element,
               clientHeight: element.height(),
               scrollTop: element.prop('scrollTop'),
               scrollHeight: element.prop('scrollHeight')
            });
         }
      },

      _onChildPanelResize: function(event, size) {
         this._childPanelSizes[size.id] = size.top + size.height;
         if (size.height === 0) {
            delete this._childPanelSizes[size.id];
         }
         this._notifyOnSizeChanged(true);
      },

      /**
       * Создаёт основные области
       * @private
       */
      _prepareArea: function(){
         this._options.animationLength = parseInt(this._options.animationLength, 10) || 0;
         this._useCss3 = USE_CSS3 && (this._options.useCss3 === undefined || this._options.useCss3);
         this._useAnimation = USE_ANIMATION && this._options.animation !== 'off' && (this._options.animationLength > MIN_ANIMATION_LENGTH);
         this._options.startWidth = parseInt(this._options.startWidth, 10) || 0;
         this._options.startHeight = parseInt(this._options.startHeight, 10) || 0;

         var contentRoot = FloatAreaManager._getFloatAreaContentRoot(),
             target = $(this._options.target),
             //Если target лежит в блоке основного содержимого (_getFloatAreaContentRoot), то панель нужно положить туда.
             //Это нужно для того, чтобы панель, привязанная к элементу, лежащему в блоке основного содержимого,
             //анимировалась вместе с этим блоком.
             parentRoot = !this._options.isStack && target.closest(contentRoot).length > 0 ?
                           contentRoot : BODY;

         var areaType = this._getAreaType();
         var blockInit = {
            'STACK': {
               _visibleRoot: function(div) {
                  var clazz = FloatAreaManager._useTouch() ? 'ws-float-area-stack-scroll-wrapper-touch' : 'ws-float-area-stack-scroll-wrapper-notouch';
                  div.css('right', -$ws.helpers.getScrollWidth());
                  div.addClass(clazz);
                  div.bind('scroll', this._handleStackScroll.bind(this));

                  //см. комментарий у класса ws-float-area-no-height-calc
                  this._useStackPanelHeightRecalc = !FloatAreaManager._useTouch();
                  if (!this._useStackPanelHeightRecalc) {
                     div.addClass('ws-float-area-no-height-calc');
                  }
               },

               _visibleRootWrapper: function(div) {
                  div.prependTo(parentRoot);
               },

               _containerShadow: function(div) {
                  div.removeClass('ws-area');
                  div.bind('wsFloatAreaResize', this._onChildPanelResize.bind(this))
               }
            }
         }[areaType];

         var titleBlock = ['ws-window-titlebar radius ws-hidden', '_generatedTitleContainer'];
         var blockProps = {
            'NO_STACK': [parentRoot,
                           ['ws-float-area ws-float-area-panel-overflow', 'ws-float-area-nostack-panel-overflow', 'ws-hidden',
                              (this._options.fixed ? ' ws-float-area-nostack-panel-overflow-fixed' : ''),
                              '_overflow', '_visibleRoot', '_visibleRootWrapper',
                                 ['ws-float-area-nostack-panel-shadow', 'ws-float-area-nostack-panel-shadow-' + this._noStackShadowClassPostfix,
                                    '_containerShadow',
                                    titleBlock, [this._container]]]],

            'STACK': [parentRoot,
                        [ 'ws-float-area-stack-cut-wrapper', '_visibleRootWrapper', 'ws-hidden',
                           ['ws-float-area-stack-scroll-wrapper', '_visibleRoot',
                              ['ws-float-area ws-float-area-panel-overflow', 'ws-float-area-stack-panel-overflow', '_overflow',
                                 ['ws-float-area-stack-panel-shadow', '_containerShadow',
                                    titleBlock, [this._container]]]]]]
         };

         function buildStructure(block) {
            var div, i, blockEl, ln = block.length;
            if (typeof block[0] === 'string') {
               div = $('<div></div>');
               i = 0;
            } else {
               div = block[0];
               i = 1;
            }

            while (i < ln) {
               blockEl = block[i];
               if (typeof blockEl === 'string') {
                  if (blockEl) {
                     if (blockEl.charAt(0) === '_') {
                        this[blockEl] = div;
                     } else {
                        div.addClass(blockEl);
                     }
                  }
               } else {
                  div.append(buildStructure.call(this, blockEl));
               }
               i++;
            }

            return div;
         }

         buildStructure.call(this, blockProps[areaType]);

         $ws.helpers.forEach(blockInit, function(func, fieldName) {
            func.call(this, this[fieldName]);
         }.bind(this));

         var shadowClasses = $ws.helpers.reduce(this._collapsedSides, function(memo, collapsed, side) {
            if (!collapsed) {
               memo.push('ws-float-area-shadow-offset-' + side);
            }
            return memo;
         }, []).join(' ');

         this._containerShadow.addClass(shadowClasses);

         if (this._useCss3 && this._useAnimation) {
            var animLength = this._options.animationLength / 1000 + 's';
            this._containerShadow
               .addClass('ws-float-area-animation-' + this._options.animation)
               .css({
                  '-webkit-transition-duration': animLength,
                  '-moz-transition-duration': animLength,
                  'transition-duration': animLength
               });

            this._containerShadow.bind('transitionend', forAliveOnly(this._transitionEnd, this));
         }
      },

      _transitionEnd: function() {
         if (this._transitionEndHandler) {
            var handler = this._transitionEndHandler;
            this._transitionEndHandler = null;
            handler.call(this);
         }
      },

      _setMinMaxSizes: function(){
         this._container.css({
            'min-width': this._options.minWidth
         })
      },

      _getContainerCssIntProp: function(prop) {
         var self = this,
            funcs = this._memoizedFuncs,
            funcName = 'shadow-' + prop;

         if (!funcs[funcName]) {
            funcs[funcName] = $ws.helpers.memoize(function() {
               return parseInt(self._containerShadow.css(prop), 10) || 0;
            }, funcName);
         }

         return funcs[funcName]();
      },

      /**
       * Создаёт кнопку для закрытия панели
       * @private
       */
      _prepareCloseButton: function(){
         var side = this._options.controlsSide,
             setStyle = function(side, offset) {
               this._closeButton.getContainer().css('margin-' + side, this._getContainerCssIntProp('margin-' + side) + offset);
             }.bind(this);

         if (side === 'center') {
            side = 'right';
         }

         this._closeButton = new CloseButton({
            parent: this,
            title: 'Закрыть панель',
            zIndex: 100,
            element: $('<div class="ws-float-close-' + side + '"></div>'),
            handlers: {
               onActivated: this.hide.bind(this),
               onKeyPressed: function(event, e) {
                  //Кнопка лежит не в контейнере, поэтому нужно
                  //передавать клавиатурные событя от неё в панель. Это
                  //нужно, чтобы работало закрытие панели по эскейпу, когда фокус на кнопке.
                  event.setResult(this._keyboardHover(e));
               }.bind(this),

               onDestroy: function() {
                  this._closeButton = undefined;
               }.bind(this)
            }
         });

         if (this._options.isStack && FloatAreaManager._useTouch()) {
            //Хак нужен для того, чтобы в айпаде кнопка не перекрывалась
            //основным содержимым панели
            this._closeButton.getContainer().css({
               'overflow': 'auto',
               '-webkit-overflow-scrolling': 'touch'
            });
         }

         this._closeButton.setVisible(this.isVisible());
         this._overflow.append(this._closeButton.getContainer());

         setStyle(side, 0);
         setStyle('top', 0);
      },

      /**
       * Стартует таймер, по истечении которго панель закроется
       * @private
       */
      _startHoverTimer: function(){
         this._stopTimer('_hoverTimer');
         this._stopTimer('_showTimer');

         if (this.isOpened()) {
            if (this._stateStage === 'delay') {
               this._cancelShow();
            }
            else {
               this._hoverTimer = setTimeout(forAliveOnly(function(){
                  if (!this.isLockShowed()) {
                     this.hide();
                  }
               }, this), HOVER_TIMEOUT);
            }
         }
      },

      /**
       * Обработчик наведения мыши на элемент
       * @private
       */
      _elementMouseOver: function(){
         this._stopTimer('_hoverTimer');
         this.show();
      },
      /**
       * Возвращает true, если мы считаем указанную область открытой
       * @param {$ws.proto.AreaAbstract} area Указанная область
       * @returns {Boolean}
       * @private
       */
      _hasStoredChildArea: function(area) {
         return Array.indexOf(this._childWindows, area) > -1;
      },
      /**
       * Обработчик закрытия/уничтожения дочернего окна. Ловятся оба события, так как окно могут уничтожить до его закрытия
       * @param {$ws.proto.AreaAbstract} area Дочернее окно
       * @private
       */
      _childWindowClose: function(area) {
         if (this._hasStoredChildArea(area)) {
            this._childWindows.splice(Array.indexOf(this._childWindows, area), 1);
         }
      },

      /**
       * Обрабатывает открытие дочерних окон
       * @param {Object} event jQuery-событие
       * @param {$ws.proto.AreaAbstract} area Область
       * @private
       */
      _childWindowCreate: function (event, area) {
         var classFound = !!$ws.helpers.find(CHILD_WINDOW_CLASSES, $ws.helpers.instanceOfModule.bind(undefined, area));
         if (classFound) {
            var closeHandler = this._childWindowClose.bind(this, area);
            if (!this._hasStoredChildArea(area)) {
               this._childWindows.push(area);
            }
            area.subscribe('onDestroy', forAliveOnly(closeHandler, this));
            if (this._hoverTarget && area.hasEvent('onAfterClose')) {
               area.subscribe('onAfterClose', forAliveOnly(this._startHoverTimer, this));
            }
         }
      },
      /**
       * Подписывается на наведение/уведение мыши с элемента
       * @private
       */
      _bindHoverEvents: function(){
         this._hoverTarget
            .bind('mouseenter.wsFloatAreaHover', forAliveOnly(this._elementMouseOver, this))
            .bind('mouseleave.wsFloatAreaHover', forAliveOnly(this._startHoverTimer, this));
      },
      /**
       * Инициализирует события, связанные с наведением мыши (опция {@link hoverTarget})
       * @private
       */
      _prepareHover: function(){
         this.setHoverTarget(this._options.hoverTarget, false);

         this._overflow.bind('wsWindowOpen', this._childWindowCreate.bind(this));

         if(this._hoverTarget){
            this._overflow.hover(this._stopTimer.bind(this, '_hoverTimer'), forAliveOnly(this._startHoverTimer, this))
                          .bind('wsSubWindowOpen', forAliveOnly(this.lockShowed, this))
                          .bind('wsSubWindowClose', forAliveOnly(this.unlockShowed, this));
         }
      },

      /**
       * Начинает загрузку и показывает контрол
       */
      _loadDescendents: function(){
         return this._loadTemplate();
      },

      /**
       * См. AreaAbstract._templateInnerCallbackBeforeReady
       * Раньше этот код был в обработчике onAfterLoad, что неправильно, поскольку пользовательские обработчики onReady срабатывают раньше и получают неголовую панель
       */
      _templateInnerCallbackBeforeReady: function(){
         this._maxWidthSet = undefined;//Сбрасываем на случай повторного вызова _onLoad

         if(this._closeButton){ //Убиваем кнопку, которую создавали сами - новая пришла
            this._closeButton.destroy();
            this._closeButton = undefined;
         }

         var userTitleContainer = this.getContainer().find('.ws-Window__title-border').first();
         if (userTitleContainer.length !== 0) {
            //Ручной заголовок, сделанный в джинне
            this._userTitle = userTitleContainer.find('[sbisname=windowTitle] span pre').first();
            this._userTitle.empty();
         } else {
            //Ручной заголовок, сделанный в вёрстке, в пользовательском компоненте. На него нужно повесить стандартный класс заголовка
            this._userTitle = this.getContainer().find('.ws-window-titlebar-custom').first();
            this._userTitle.addClass('ws-window-titlebar radius');
         }

         // Если есть опция "border" и нет заголовка вручную, то рисуем крестик
         // В случае с ручным заголовком крестик должен быть свой
         if (this._options.border && userTitleContainer.length === 0) {
            this._prepareCloseButton();
         }

         this._setTitleContainer();

         this._caption = this._options.caption !== undefined ? this._options.caption : this._options.title;
         this.setTitle(this._caption);

         this._loaded = true;

         var css = {};
         if (!this._options.keepSize) {
            if (!this._options.autoWidth) {
               css['width'] = this._options.width + 'px';
            }

            if (!this._options.autoHeight && !this._options.isStack) {
               css['height'] = this._options.height + 'px';
            }
         }

         if (this._options.isStack) {
            //для стековой панели высота, установленная после загрузки шаблона, не нужна
            css['height'] = '';
         }

         if (!Object.isEmpty(css)) {
            this._container.css(css);
         }

         this._initStack();
      },

      _showControls: function() {
         $ws.proto.FloatArea.superclass._showControls.apply(this, arguments);

         if(this._autoShow){
            this._showInternal(false);//При загрузке не надо ждать таймаута перед показом
         }
      },

      /**
       * Пересчитывает позицию области
       * @private
       */
      _recalcPosition: forNonStackOnly(function(offsetHint, forceVisible){ // При использовании стека панелей расположением управляет FloatAreaManager
         function visibleParent(elem) {
            return (elem.parent().length === 0 || elem.css('display') === 'none' || elem.css('visibility') === 'hidden') ?
                   elem : visibleParent(elem.parent());
         }

         function isVisible(elem) {
            return visibleParent(elem).is(document);
         }

         // Если пришел offsetHint значит это извещение от $ws.helpers.trackElement, а значит объект видимый
         if((this.isVisible() || forceVisible) && (this._options.fixed || offsetHint || isVisible(this._target))){
            var config = getPositionConfig(this, this._options.direction,
                                           this._options.side,
                                           this._options.verticalAlign,
                                           this._options.offset,
                                           this._options.fitWindow);
            config.of = this._target;

            this._overflow.position(config);
         }
      }),
      /**
       * Обрабатывает изменения размеров
       * @private
       */
      _onResizeHandler: function(){
         $ws.proto.FloatArea.superclass._onResizeHandler.apply(this, arguments);
         this._recalcPosition();
      },

      _notifyTargetPanelResize: forNonStackOnly(function() {
         var target = this.getTarget();
         if (target && target.length) {
            target.trigger('wsFloatAreaResize', {
               id: this.getId(),
               height: this.isVisible() ? this.getMinHeight() : 0,
               top: parseInt(target.offset().top, 10)
            });
         }
      }),

      /**
       * Обработчик смены размеров детей
       * @private
       */
      _onSizeChangedBatch: function(){
         $ws.proto.FloatArea.superclass._onSizeChangedBatch.apply(this, arguments);
         this._recalcPosition();
         this._sizeUpdated();

         if (this._firstSizeCalcOnShow) {
            this._getScrollContainer().scrollTop(0);
            this._firstSizeCalcOnShow = false;
         }

         this._notifyTargetPanelResize();
      },
      show: function(){
         return this._showInternal(true);
      },
      /**
       * <wiTag group="Управление">
       * Перезагрузить(переустановить) текущий шаблон.
       */
      reload: function() {
         this._loaded = false;
         this.setTemplate(this.getCurrentTemplateName());
      },
      _getScrollContainer: function() {
         return this._visibleRoot;
      },

      _needRecalkInvisible: function() {
         return this._inApplyBatchUpdateIntermediate > 0;
      },

      _applyBatchUpdateIntermediate: function() {
         this._inApplyBatchUpdateIntermediate++;
         try {
            $ws.single.ControlBatchUpdater.applyBatchUpdateIntermediate('FloatArea.' + 'applyBatchUpdateImmediate');
         } finally {
            this._inApplyBatchUpdateIntermediate--;
         }
      },

      /**
       * Показывает контрол
       * @returns {Boolean}
       * @private
       */
      _showInternal: function(withTimeout) {
         this._cancelHide();
         if (this._loaded) {
            if (!this.isOpened()) {
               this._state = 'show';
               this._stateStage = 'delay';

               var doShow = this._createBatchUpdateWrapper('FloatArea._showInternal.doShow', function(){
                  this._stopAnimation();

                  this._stateStage = 'beforeShow';

                  //Тут менеджер перенастроит body (выключит прокрутку и т.п.), если нужно,
                  //И расчёт размеров панели будет правильным
                  FloatAreaManager._beforeShowStarted(this);

                  //Стековой панели нужно поставить начальную мин. высоту, чтобы она не могла оказаться меньше высоты окна в результате
                  //изменения внутренних размеров прикладным кодом без вызова пересчёта (такое тоже бывает)
                  //Также нужно сделать начальную подгонку ширины.
                  this._updateVisibleRootRightPadding();
                  this._updateMinMaxWidthHeight(true, true);

                  //панель должна иметь хоть какие-то размеры перед событием onBeforeShow (окнчательность размеров не гарантируется, но некоторым нужно хотя бы так (см. коммит)
                  if (!this._options.isStack) {
                     //Нестековую панель перед показом надо спозиционировать по таргету
                     //из trackElement по таргету она в недопоказанном состоянии не работает
                     this._visibleRootWrapper.css('visibility', 'hidden');//нужно, чтоб не было "прыжка" у панели - в IE8 может быть заметно
                     this._visibleRootWrapper.removeClass('ws-hidden');
                     this._recalcPosition(undefined, true);
                     this._visibleRootWrapper.css('visibility', '');
                  } else {
                     this._visibleRootWrapper.removeClass('ws-hidden');
                  }

                  this._notify('onBeforeShow');

                  //Обработчик onBeforeShow может закрыть панель, так что нужно проверить её состояние перед началом анимации
                  if (this._state === 'show') {
                     this._stateStage = 'show';
                     this._showDeferred = new $ws.proto.Deferred();

                     this.moveToTop();

                     //Если контрол показывается из невидимого состояния, в котором прошла загрузка (и кончился пакет),
                     // и, из-за загрузки в невидимом состоянии, есть отложенные изменения,
                     // то надо их применить внутри текущего пакета, то есть, добавить их к текущему пакету.
                     // Тогда ранее загруженная невидимая панель пересчитается в конце этого пакета.
                     this._checkDelayedRecalk();
                     this._notifyOnSizeChanged(true);

                     this._firstSizeCalcOnShow = true;

                     if (this._useAnimation) {
                        this._toggleAnimationClasses(true);
                        this._applyBatchUpdateIntermediate();
                        this._recalcPosition(undefined, true);
                        this._getScrollContainer().scrollTop(0);

                        this._doAnimation(this._getAnimationStartValue(), this._getAnimationEndValue(), this._finishShow.bind(this), 0);
                     } else {
                        this._finishShow();
                     }

                     FloatAreaManager._showStarted(this);
                     this._notify('onShow');//TODO: убрать это событие, проверить, не пользуется ли кто им, и убрать остальную связь с FloatAreaManager через события
                  } else {
                     //Если обработчик onBeforeShow закрыл или удалил панель, то надо переключить
                     //обратно состояния менеджера панелей (включить обратно прокрутку в body, если надо)
                     FloatAreaManager._beforeClose(this);
                     FloatAreaManager._afterClose(this);
                     //вообще-то, в этой ветке _showDeferred и так undefined, поскольку в ней панель скрыта из onBeforeShow,
                     //но вдруг чего... лучше обнулим _showDeferred, чтоб гарантировать отсутствие подвисших пакетов
                     this._showDeferred = undefined;
                  }

                  return this._showDeferred;
               });

               if (withTimeout) {
                  this._showTimer = setTimeout(doShow, this._options.showDelay);
               }
               else {
                  doShow();
               }
            }
         }
         else{
            this._autoShow = true;
         }
         return true;
      },
      _setTitleContainer: forAliveOnly(function() {
         this._createTitle();
      }),

      _createTitle: function(){
         var toggleTitleContainer = function (show) {
            this._generatedTitleContainer.toggleClass('ws-hidden', !show);
            this._container.css('margin-top', show ? this._generatedTitleContainer.outerHeight() + 'px' : '');
         }.bind(this);

         if (this._userTitle.length) {
            toggleTitleContainer(false);

            if (this._title.closest(this._userTitle).length === 0) {
               this._userTitle.prepend(this._title);
            }

            this._title.addClass('ws-float-area-title').toggleClass('ws-hidden', !this._caption);
         } else if (this._options.border && this._caption) {
            if (this._title.closest(this._generatedTitleContainer).length === 0) {
               this._generatedTitleContainer.empty().append(this._title);
            }
            this._title.addClass('ws-float-area-title ws-float-area-title-generated');
            toggleTitleContainer(true);
         } else {
            toggleTitleContainer(false);
         }
      },
      /**
       * <wiTag group="Отображение">
       * Установить заголовок панели. только для стековых
       * @param {String} title - новое название заголовка.
       */
      _setTitle: forReadyOnly(function(title){
         // Почему сделал так: TemplatedAreaAbstract меняет document.title, а нам этого делать нельзя
         this._caption = title;
         this._title.text(title);
         this._createTitle();
         this._notifyOnSizeChanged(true);
      }),
      /**
       * <wiTag noShow>
       * Перемещает панель выше открывшей области или выше всех, если её нет.
       * Также перемещает все дочерние панели и окна, которые связаны с этой панелью через опцию opener.
       * @example
       * После панели переместить её выше остальных.
       * <pre>
       *    floatArea.subscribe('onAfterShow', function() {
       *       this.moveToTop();
       *    });
       * </pre>
       */
      moveToTop: function(){
         if (this.isOpened()) {
            $ws.single.WindowManager.releaseZIndex(this._zIndex);

            this._zIndex = $ws.single.WindowManager.acquireZIndex(this._isModal);

            $ws.single.WindowManager.setVisible(this._zIndex);
            this._visibleRoot.css('z-index', this._zIndex);

            //Поднимаем также дочерние панели и окна, чтоб родительская панель их не перекрыла, поднявшись сама.
            $ws.helpers.forEach(this._childWindows, function (area) {
               area.moveToTop();
            });

            ModalOverlay.adjust();
         }
      },
      /**
       * Возвращает z-index области
       * @return {*}
       */
      getZIndex: function(){
         return this._zIndex;
      },

      /**
       * <wiTag group="Управление">
       * Скрыть контрол.
       * Если включена опция {@link autoCloseOnHide}, то ещё и удаляет её после скрытия (с этой опцией метод hide работает так же, как и метод {@link close}).
       * @param {Boolean} [force=true]
       * @returns {Boolean} Удалось ли закрыть панель.
       * Это может не удастся, если:
       * <ol>
       *    <li>обработчик события {@link onBeforeClose} запретил закрывать панель,</li>
       *    <li>есть связанные панели или диалоги, которые не дают закрыть панель,</li>
       *    <li>наследник FloatArea - RecordFloatArea может показывать перед закрытием диалог сохранения, результатом
       *    которого является отмена закрытия панели.</li>
       * </ol>
       * @example
       * При клике на кнопку (btn) скрыть всплывающую панель (floatArea).
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       floatArea.hide();
       *    });
       * </pre>
       * @command
       * @see autoCloseOnHide
       * @see close
       * @see onBeforeClose
       */
      hide: function(force){
         force = force === undefined ? true : force;
         return this._options.autoCloseOnHide ? this.close(undefined, force) : this._hide(force, $ws.helpers.nop);
      },

      _hideInner: function(afterHideFn) {
         //Конец скрывания контрола
         function finishHide(deferred){
            var deactivateFn = function() {
               this._state = '';
               this._visible = false;
               this._stateStage = '';
               $ws.single.WindowManager.setHidden(this._zIndex);
               ModalOverlay.adjust();
            }.bind(this);

            try {
               //скроем панель перед возможным переключением режима body менеджером, иначе в IE9 может вёрстку перекосить на полсекунды
               this._visibleRootWrapper.addClass('ws-hidden');

               //Вызываем это сначала, чтобы у пользовательских обработчиков было бы
               //уже окончательное состояние панели и менеджера
               FloatAreaManager._afterClose(this);

               try
               {
                  $ws.single.WindowManager.deactivateWindow(this, deactivateFn);
               }
               catch (e)
               {
                  deactivateFn();
                  throw e;
               }
            }
            finally {
               this._notifyTargetPanelResize();

               this._notify('onClose');//TODO: убрать это событие, проверить, не пользуется ли кто им, и убрать остальную связь с FloatAreaManager через события

               //onAfterClose должен быть тут самым последним, чтобы активность уже перешла на другой контрол,
               //например, вернулась на браузер, открывший панель, или ушла в тот контрол, на который кликнули,
               //закрыв тем самым панель. Браузер, открывший панель, ловит onAfterClose, и смотрит по своему признаку активности,
               //фокусировать ли активную строку.
               this._notify('onAfterClose', this._result);

               deferred.callback();

               if (!this.isDestroyed()) {
                  //Класс-индикатор успешного окончания скрытия. Нужен для интеграционных тестов, чтоб они отлавливали
                  //момент окончания уезжания (или другого способа показа) панели
                  this._container.addClass('ws-float-area-hide-complete');
                  afterHideFn.call(this);
               }
            }
         }

         var oldShowStage, flag,
             result = !this.isOpened();
         if (!result) {
            //Сюда я могу попасть только если панель уже показана (_state='', _visible=true),
            //или находится в процессе показа (_state='show', _visible=false).
            //Я заканчиваю процесс показа на каком-то этапе, и в зависимости от этого этапа выбираю действия на прятании панели.
            oldShowStage = this._cancelShow();

            this._state = 'hide';

            flag = this._notify('onBeforeClose', this._result);
            result = flag !== false;

            //Обработчик onBeforeClose может отменить закрытие панели, вызвав метод show - тогда панель прятать не нужно.
            //Или же обработчик может удалить панель, при этом метод _cancelHide сбросит состояние _state в '',
            //что опять же означает, что закрытия панели делать не надо (была ошибка - не завершался пакет анимации закрытия панели -
            // потому что был удалён её блок, и события окончания анимации на этом дохлом блоке не происходило).
            //Или же hide может быть вызван тогда, когда анимация показа ещё не началась, оборвавшись на этапе 'delay' или 'beforeShow' -
            // тогда тоже прятать панель не надо, поскольку ничего показано не было.
            if (result && this._state === 'hide' && oldShowStage === 'show') {
               this._runInBatchUpdate('FloatArea.hide.animation - ' + this._id + ' ' + this._options.template, function () {
                  var finishDfr = new $ws.proto.Deferred();
                  try {
                     // Создаем функцию, которая может быть вызвана лишь один раз
                     // Нужно на случай, если, например начали анимацию, затем отменили закрытие после чего анимация закончилась
                     this._hideFinishFn = finishHide.bind(this, finishDfr).once();

                     FloatAreaManager._beforeClose(this);

                     if (this._closeButton) {
                        this._closeButton.setVisible(false);
                     }

                     if (this._useAnimation) {
                        this._doAnimation(null, this._getAnimationStartValue(), this._hideFinishFn, FloatAreaManager._getPanelHideAnimationDelay());
                     } else {
                        this._hideFinishFn();
                     }
                  } catch (e) {
                     finishDfr.errback(e);
                  }
                  return finishDfr;
               });
            } else if (this._state === 'hide') {
               //если обработчик onBeforeClose не поменял состояние, вызвав show или деструктор, то состояние надо сбросить, "закончив" скрытие панели
               //если же поменял, то трогать его не надо
               this._state = '';
            }
         }
         return result;
      },

      /**
       *
       * @param force
       * @param afterHideFn
       * @returns {Boolean|$ws.proto.Deferred}
       * @private
       */
      _hide: function(force, afterHideFn){
         function childAreaCloseInitiator() {
            // Условие выхода из рекурсии
            if(!needToCloseAreas.length) {
               // Если все окна закрыты (или ничего закрывать не надо), то начинаем закрывать себя
               //если окно уже закрывается, то второго закрытия запускать не нужно, а то будут дублироваться события типа onBeforeClose и т.п.
               result = this._hideInner(afterHideFn);
               if(closeDeferred instanceof $ws.proto.Deferred) {
                  // Если мы тут не первый раз и ждём окончания, то сообщим о нём
                  closeDeferred.callback();
               }
               // Мы не ожидаем закрытия других панелей и можем выйти сразу
               return true;
            }
            var
               self = this,
               lastArea = needToCloseAreas[needToCloseAreas.length-1],
               afterCloseOrDestroy = forAliveOnly(function() {
                  unsubscribeAll.call(this);

                  // Уменьшаем "итератор"
                  needToCloseAreas.pop();
                  // Уходим снова в рекурсию
                  childAreaCloseInitiator.apply(self);
               }),
               beforeClose = forAliveOnly(function(eventObject, result) {
                  // Если отменили закрытие окна, то отписываемся от всех наших обработчиков
                  if(eventObject.getResult() === false) {
                     unsubscribeAll.call(this);
                     closeDeferred.errback();
                  }
               }),
               confirmDialog = forAliveOnly(function(eventObject, result) {
                  // Если отменили закрытие RecordFloatArea, то отписываемся от всех наших обработчиков
                  if(result === false) {
                     unsubscribeAll.call(this);
                  }
               });

            function unsubscribeAll() {
               this.unsubscribe('onDestroy', afterCloseOrDestroy);
               this.unsubscribe('onAfterClose', afterCloseOrDestroy);
               this.unsubscribe('onBeforeClose', beforeClose);
               this.unsubscribe('onConfirmDialogSelect', confirmDialog);
            }

            lastArea.once('onDestroy', afterCloseOrDestroy);
            lastArea.once('onAfterClose', afterCloseOrDestroy);
            lastArea.once('onBeforeClose', beforeClose);
            lastArea.once('onConfirmDialogSelect', confirmDialog);

            //Дочерние панели и окна надо закрывать через close, чтобы они не болтались в памяти (всё равно при новом открытии родителя сами не откроются)
            //Ещё это нужно потому, что у окна метод close кидает события, а метод hide - нет, в отличе от панели.
            lastArea.close();

            return false;
         }

         var
            closeDeferred = true,
            result = this._loaded,
            needToCloseAreas = [];

         if(result){
            if(!this.isLockShowed(force, needToCloseAreas) && this._state !== 'hide'){
               result = !(this._state || this._visible);
               if(!result){
                  // Пытаемся рекурсивно цепочкой закрыть окна
                  if(!childAreaCloseInitiator.apply(this)) {
                     // если закроем не сразу, то вернём деферред
                     closeDeferred = new $ws.proto.Deferred();
                  }
               }
            }
         }
         else{
            this._autoShow = false;
         }
         return closeDeferred === true ? result : closeDeferred;
      },

      /**
       * <wiTag group="Управление">
       * Закрыть и уничтожить панель.
       * @param {*} result "Результат" закрытия панели - передаётся в соответствующий паораметр {@link onAfterClose}.
       * @param {Boolean} [force=true] Принудительное закрытие панели:
       * <ul>
       *    <li>true - закрывать панель, даже если есть открытые из неё панели (вместе с этими открытыми панелями);</li>
       *    <li>false - не закрывать панель, если из неё открыты другие панели.</li>
       * </ul>
       * @returns {Boolean} Удалось ли закрыть панель. Это может не удастся, если:
       * <ol>
       *    <li>обработчик события {@link onBeforeClose} запретил закрывать панель,</li>
       *    <li>есть связанные панели или диалоги, которые не дают закрыть панель,</li>
       *    <li>наследник FloatArea - RecordFloatArea может показывать перед закрытием диалог сохранения, результатом
       *    которого является отмена закрытия панели.</li>
       * </ol>
       * @example
       * При клике на кнопку (btn) закрыть всплывающую панель (floatArea) и удалить экземплят класса.
       * <pre>
       *    btn.subscribe('onClick', function() {
       *       floatArea.close();
       *    });
       * </pre>
       * @command
       * @see onBeforeClose
       * @see onAfterClose
       * @see ok
       * @see cancel
       */
      close: function(result, force) {
         force = force === undefined ? true : force;
         var
            tmpResult = this._result,
            hideResult;

         this._result = result;
         hideResult = this._hide(force, this.destroy);
         if(hideResult === true) {
            return true;
         } else {
            this._result = tmpResult;
         }
         return false;
      },
       /**
        * <wiTag group="Управление">
        * Выполнить команду {@link close} с результатом true.
        * При вызове этого метода в {@link onAfterClose} в параметр result придёт true.
        * @returns {Boolean} Удалось ли закрыть панель.
        * @example
        * При клике на кнопку (btn) закрыть всплывающую панель (floatArea) и удалить экземплят класса.
        * <pre>
        *    var floatArea = this.getTopParent();
        *    btn.subscribe('onClick', function() {
        *       floatArea.ok();
        *    });
        * </pre>
        * @see close
        * @see onAfterClose
        * @see onBeforeClose
        * @see cancel
        */
       ok: function() {
           return this.close(true);
       },
       /**
        * <wiTag group="Управление">
        * Выполнить команду {@link close} с результатом false.
        * При вызове этого метода в {@link onAfterClose} в параметр result придёт false.
        * @returns {Boolean} Удалось ли закрыть панель.
        * @example
        * При клике на кнопку (btn) закрыть всплывающую панель (floatArea) и удалить экземплят класса.
        * <pre>
        *     var floatArea = this.getTopParent();
        *     btn.subscribe('onClick', function() {
        *       floatArea.cancel();
        *    });
        * </pre>
        * @see close
        * @see onAfterClose
        * @see onBeforeClose
        * @see ok
        */
       cancel : function() {
           return this.close(false);
       },

      isVisible: function(){
         return !this._state && this._visible;
      },
      /**
       * Показана ли панель (то же самое, что и isVisible. для совместимости) //TODO решить проблему дублирования isVisible и isShow (не только в этом классе)
       * @return {Boolean}
       */
      //TODO решить проблему дублирования isVisible и isShow
      isShow: function(){
         return this.isVisible();
      },
      /**
       * <wiTag group="Отображение">
       * Получить признак открытости панели.
       * @return {Boolean} Возможные значения:
       * <ol>
       *    <li>true - панель сейчас открывается или уже открыта;</li>
       *    <li>false - панель закрывается или закрыта.</li>
       * </ol>
       * @example
       * Устанавливаем значение в поле ввода (Строка 1) после показа всплывающей панели:
       * <pre>
       *    floatArea.subscribe('onAfterShow', function(){
       *       if (this.isOpened()) {
       *          this.getTopParent().getChildControlByName('Строка 1').setValue('какое-то значение');
       *       }
       *    })
       * </pre>
       * @see isVisible
       * @see isCompletelyVisible
       * @see isShow
       */
      isOpened: function(){
         return (this._visible && this._state === '') || this._state === 'show';
      },
      /**
       * Останавливает анимацию, если она была
       * @private
       */
      _stopAnimation: function() {
         if (this._state && this._useAnimation) {
            this._containerShadow.stop(true);
            this._toggleAnimationClasses(false);
         }
      },

      _stopTimer: function(fieldName) {
         if (this[fieldName]) {
            clearTimeout(this[fieldName]);
            this[fieldName] = undefined;
         }
      },

      _getAnimationStartValue: function() {
         var metric = this._options.direction,
            metricFn, startMetric, value,
            result;
         if (this._options.animation === 'slide') {
            if(metric === 'left' || metric === 'right'){
               metricFn = 'outerWidth';
               startMetric = 'startWidth';
            }
            else{
               metricFn = 'outerHeight';
               startMetric = 'startHeight';
            }

            value = this._containerShadow[metricFn](true) - this._options[startMetric];
            result = [metric, value + 'px'];
         } else if (this._options.animation === 'fade') {
            result = ['opacity', 0];
         } else {
            throw new Error('Ошибочная опция animation');
         }

         return result;
      },

      _getAnimationEndValue: function() {
         var metric = this._options.direction,
            result;
         if (this._options.animation === 'slide') {
            result = [metric, '0px'];
         } else if (this._options.animation === 'fade') {
            result = ['opacity', 1];
         } else {
            throw new Error('Ошибочная опция animation');
         }

         return result;
      },

      _toggleAnimationClasses: function(toggle) {
         this._overflow.toggleClass('ws-float-area-animate', toggle);
      },

      /**
       * @private
       */
      _doAnimation: function(startValue, endValue, finishFn, startDelay){
         this._stopAnimation();
         this._toggleAnimationClasses(true);

         var toggleCss3Transition = function(value) {
            if (this._useCss3) {
               this._containerShadow.css({'transition-property': value ? '' : 'none'});
            }
         }.bind(this);

         var finishAnimation = function() {
            this._toggleAnimationClasses(false);
            finishFn();
         }.bind(this);

         if (startValue) {
            toggleCss3Transition(false);
            this._containerShadow.css(startValue[0], startValue[1]);
         }

         var doAnimation = function() {
            var obj;
            if (this._useCss3) {
               toggleCss3Transition(true);
               this._transitionEndHandler = finishAnimation;
               this._containerShadow.css(endValue[0], endValue[1]);

               var animLength = this._options.animationLength;
               fixCss3TransitionEndEvent(this._containerShadow.get(0), endValue[0], endValue[1], animLength, Math.max(animLength * 3, ANIMATION_MAX_WAIT));
            } else {
               obj = {};
               obj[endValue[0]] = endValue[1];
               this._containerShadow.animate(obj, this._options.animationLength, finishAnimation);
            }
         }.bind(this);

         this._stopTimer('_beforeAnimationTimer');

         //тут приходится делать таймаут, чтобы правильно прошло выключение-включение анимации
         this._beforeAnimationTimer = setTimeout(doAnimation, Math.max(startDelay, 10));
      },
      /**
       * Конец показа контрола - активирует контролы, меняет состояние
       * @private
       */
      _finishShow: function(){
         this._state = '';
         this._visible = true;
         try
         {
            if (this._closeButton) {
               this._closeButton.setVisible(true);
            }

            this.moveToTop();

            this._notifyBatchDelayed('onAfterShow');

            if(this._options.catchFocus){
               //Этот хак нужен для мобильных устройств, чтобы убрать виртуальную клавиатуру, лежащую под панелью
               //(если фокус перешёл на какое-то поле ввода сразу перед показом панели - такое бывает)
               this._moveFocusToFakeDiv();

               //Нужно поднять свой индекс активации, чтобы при удалении дочерних контролов фокус не возвращался бы на другую область,
               //лежащую вне панели, и не срабатывало бы автозакрытие панели по уходу фокуса с её контролов
               this.setActivationIndex($ws.single.WindowManager.getMaxActivisionIndex() + 1);
               this.onBringToFront();//onBringToFront сам отложит захват фокуса до конца пакета
            }
         }
         finally
         {
            var dfr = this._showDeferred;
            this._showDeferred = undefined;
            dfr.callback();

            //Класс-индикатор успешного окончания показа. Нужен для интеграционных тестов, чтоб они отлавливали
            //момент окончания выезжания (или другого способа показа) панели
            this._container.addClass('ws-float-area-show-complete');
            this._toggleAnimationClasses(false);
         }
      },

      _stopTimers: function() {
         this._stopTimer('_showTimer');
         this._stopTimer('_beforeAnimationTimer');
         this._stopTimer('_hoverTimer');
      },

      _cancelShow: function() {
         //Убираем класс-индикатор успешного окончания показа.
         this._container.removeClass('ws-float-area-show-complete');

         this._stopTimers();

         var stage = this._stateStage;
         if (this._state === 'show') {
            try {
               this._stopAnimation();

               //Если останавливаем показ на этом этапе, то нужно просто спрятать основной блок,
               // и не заканчивать анимацию, ничего не показывая, как не нужно её заканчивать и на этапе 'delay'
               if (stage === 'beforeShow') {
                  this._visibleRootWrapper.addClass('ws-hidden');
               }

               if (this._showDeferred) {
                  var dfr = this._showDeferred;
                  this._showDeferred = undefined;//страховка на случай, если исключение вылетит в вызове dfr.callback(), и он где-то в коде обработчиков ошибок напорется на старый this._showDeferred
                  dfr.callback();
               }
            } finally {
               this._state = '';
               this._stateStage = '';
            }
         }
         return stage;
      },

      _cancelHide: function() {
         //Убираем класс-индикатор успешного окончания скрытия.
         this._container.removeClass('ws-float-area-hide-complete');
         // Если окно в процессе показа, то думаю не стоит убивать таймеры в функции отмены скрытия
         if (this._state !== 'show') {
            this._stopTimers();
         }

         if (this._state === 'hide') {
            try {
               this._stopAnimation();

               if (this._hideFinishFn) {
                  var fn = this._hideFinishFn;
                  this._hideFinishFn = $ws.helpers.nop;//страховка на случай, если исключение вылетит в вызове _hideFinishFn, и он где-то в коде обработчиков ошибок напорется на старый this._hideFinishFn
                  fn();
               }
            } finally {
               this._state = '';
            }
         }
      },

      /**
       * <wiTag group="Данные">
       * Может ли контрол получать фокус
       * @return {Boolean} Признак может ли контрол получать фокус.
       * Возможные значения:
       * <ol>
       *    <li>true - контрол может получать фокус,</li>
       *    <li>false - не может.</li>
       * </ol>
       * @see catchFocus
       */
      canAcceptFocus: function(){
         return this._visible;
      },
      /**
       * Может ли обрабатывать события клавиш
       * @returns {Boolean}
       * @protected
       */
      _isAcceptKeyEvents: function(){
         return true;
      },
      /**
       * Обрабатывает нажатие клавиш на панели
       * @param {Object} e Объект события
       * @return {Boolean}
       * @private
       */
      _keyboardHover: function(e){
         if(e.which === $ws._const.key.esc){
            e.stopPropagation();
            e.stopImmediatePropagation();
            this.hide();
            return false;
         }
         return $ws.proto.FloatArea.superclass._keyboardHover.apply(this, arguments);
      },
      /**
       * Колбек загрузки дочерних контролов. onBeforeShow и onAfterShow теперь в другом месте
       * @protected
       */
      _childrenLoadCallback: $ws.helpers.nop,

      destroy: function(){
         this._cancelShow();
         this._cancelHide();

         if (!this._options.fixed) {
            $ws.helpers.trackElement(this._target, false);
         }

         $ws.single.WindowManager.releaseZIndex(this._zIndex);
         ModalOverlay.adjust();

         this._notifyTargetPanelResize();

         $ws.single.FloatAreaManager._removeArea(this);
         $ws.proto.FloatArea.superclass.destroy.apply(this, arguments);
         this._visibleRootWrapper.remove();
         if(this._hoverTarget){
            this._hoverTarget.unbind('.wsFloatAreaHover');
         }

         //Дочерние панели и окна, для которых эта панель была не родителем, а opener-ом, тоже нужно прибить.
         //Сами они не убиваются, потому что эта панель у них не родитель, а opener.
         //Массив клонируем, потому что на закрытие панели панель удаляется из this._childWindows
         var childWindows = $ws.helpers.map(this._childWindows, function(child) {
            return child;
         });
         $ws.helpers.forEach(childWindows, function(child) {
            if (!child.isDestroyed()) {
               child.destroy();
            }
         });

         var dummyJq = $();
         this._target = dummyJq;
         this._options.target = dummyJq;
         this._visibleRoot = dummyJq;
         this._visibleRootWrapper = dummyJq;
         this._overflow = dummyJq;
         this._containerShadow = dummyJq;
         this._generatedTitleContainer = dummyJq;
         this._hoverTarget = dummyJq;
      },
      /**
       * <wiTag group="Данные">
       * Признак будет ли скрыта панель при уходе с неё фокуса.
       * @return {Boolean} Возвращает, будет ли автоматически скрываться панель при уходе фокуса на несвязанную область.
       * Возможные значения:
       * <ol>
       *    <li>true - панель будет автоматически скрываться при уходе фокуса,</li>
       *    <li>false - не будет скрываться.</li>
       * </ol>
       * @see autoHide
       * @see autoCloseOnHide
       */
      isAutoHide: function(){
         return this._options.autoHide;
      },

      _updateMinMaxWidthHeight: forStackOnly(function(setMinHeight, setHeight) {
         var containerStyle,
             minWidth = this._options.minWidth,
             maxWidth,
             haveMaxWidth = this._options.maxWidth !== Infinity,
             containerMinHeight, marginLeft, marginRight;

         if (this._options.autoWidth || haveMaxWidth) {
            maxWidth = Math.max(minWidth, FloatAreaManager._getMaxWidthForArea(this, minWidth));
            if (this._maxWidthSet !== maxWidth) {
               containerStyle = this._container.prop('style');

               this._maxWidthSet = maxWidth;

               //в IE8 надо ставить max-width не только блоку с содержимым стек-панели, но и блоку overflow, а то блок содержимого вправо уезжает
               containerStyle.maxWidth = maxWidth + 'px';

               marginLeft = this._getContainerCssIntProp('margin-left');
               marginRight = this._getContainerCssIntProp('margin-right');
               this._overflow.prop('style').maxWidth = (maxWidth + marginLeft + marginRight) + 'px';
               this._getFixedWidth.reset();

               if (haveMaxWidth) {
                  containerStyle.width = Math.max(minWidth, Math.min(this._options.maxWidth, maxWidth)) + 'px';
               }
            }
         }

         //см. комментарий на класс ws-float-area-no-height-calc
         if (this._useStackPanelHeightRecalc && (setMinHeight || setHeight)) {
            containerStyle = containerStyle || this._container.prop('style');
            containerMinHeight = this._getContainerMinHeight() + 'px';
            if (setMinHeight) {
               containerStyle.minHeight = containerMinHeight;
            }
            if (setHeight) {
               containerStyle.height = containerMinHeight;
            }
         }
      }),

      _postUpdateResizer: function() {},

      _updateVisibleRootRightPadding: forStackOnly(function() {
         var offset = FloatAreaManager._getPanelRootPaddingRight();
         if (offset > 0) {
            this._visibleRoot.css('padding-right', offset);
            this._visibleRootWrapper.css('right', 0);
         } else {
            this._visibleRoot.css('padding-right', 0);
            this._visibleRootWrapper.css('right', offset);
         }
      }),

      _getContainerMinHeight: function() {
         var genTitle = this._generatedTitleContainer,
             generatedTitleHeight = genTitle.hasClass('ws-hidden') ? 0 : genTitle.outerHeight();

         return FloatAreaManager._getWindowHeight() - generatedTitleHeight;
      },

      _sizeUpdated: forStackOnly(function(externalChange){
         var containerStyle = this._container.prop('style'),
             childMaxHeight = $ws.helpers.reduce(this._childPanelSizes, function(m, v) {
                return Math.max(m, v);
             }, 0),
             containerMinHeight;

         this._updateMinMaxWidthHeight(true, false);

         //см. комментарий у класса ws-float-area-no-height-calc
         if (this._useStackPanelHeightRecalc) {
            containerMinHeight = Math.max(childMaxHeight, this._getContainerMinHeight());

            if (containerStyle.height !== 'auto') {
               containerStyle.height = 'auto';
            }

            if (this._container.height() <= containerMinHeight) {
               containerStyle.height = containerMinHeight + 'px';//100% ставить нельзя - IE8 хочет, чтобы было абсолютное значение, причём не всегда...
               this._getFixedHeight.reset();
            }
         } else {
            this._overflow.css('min-height', childMaxHeight + 'px');
         }

         if (externalChange) {
            this._updateVisibleRootRightPadding();
            this._onResizeHandler();
         }

         if (this.isVisible()) {
            FloatAreaManager._updateSideBarVisibility();
         }
      }),

      /**
       * Плавающие панели не обрабатывают изменение размеров окна браузера - его обрабатывает FloatAreaManager.
       */
      _subscribeToWindowResize: function() {
      },

      /**
       * Не нужно для всплывающей панели?
       * @private
       */
      _restoreSize: function() {
      },
      /**
       * Пересчитывает отсутпы для нормальных областей. Нам это не нужно
       * @private
       */
      _calculatePositionHorisontal: function(){
      },
      /**
       * Пересчитывает отсутпы для нормальных областей. Нам это не нужно
       * @private
       */
      _calculatePositionVertical: function(){
      },
      /**
       * <wiTag group="Данные">
       * Получить признак корректности области.
       * Противоположно методу isDestroyed: если область разрушена, то она не корректна.
       * @returns {Boolean} Возвращает, является ли текущая область корректной.
       * Возможные значения:
       * <ol>
       *    <li>true - область является корректной, т.е. она не разрушена,</li>
       *    <li>false - область не корректна - разрушена.</li>
       * </ol>
       * @example
       * После показа панели спрячем её, проверим не корректна ли она и откроем с установкой значения в поле ввода (Строка 1):
       * <pre>
       *    floatArea.subscribe('onAfterShow', function(){
       *       if (this.isOpened()){
       *          this.hide();
       *       }
       *       if (this.isCorrect()) {
       *          this.getTopParent().getChildControlByName('Строка 1').setValue('какое-то значение');
       *       }
       *    })
       * </pre>
       * @see autoCloseOnHide
       * @see hide
       * @see close
       * @see isAutoCloseOnHide
       */
      isCorrect: function(){
         return !this._isDestroyed;
      },
      toggle: function(){
         if(this._state == 'show' || this._visible){
            this.hide();
         }
         else{
            this.show();
         }
      },
      /**
       * <wiTag group="Управление">
       * Задать блок, у которого будет показана панель.
       * Актуально для НЕ стека панелей.
       * @param {jQuery} target jQuery-объект, у которого должна быть показана панель
       * @see getTarget
       * @see target
       * @see isStack
       */
      setTarget: forNonStackOnly(function(target){
         if (this._options.fixed) {
            throw new Error('Опция fixed не совместима с заданием target-а - при fixed=true таргетом всегда будет window');
         }

         if (this._target) {
            $ws.helpers.trackElement(this._target, false);
         }

         this._target = $(target);

         if (this._target.length) {
            $ws.helpers.trackElement(this._target)
               .subscribe(
                  'onMove',
                  forAliveOnly(
                     function(event, offset) {
                        this._recalcPosition(offset);
                     },
                     this
                  )
               )
               .subscribe(
                  'onVisible',
                  forAliveOnly(
                     function(event, visibility){
                        this._notify('onTargetVisibilityChange', visibility);
                     },
                     this
                  )
               );
         }

         //Если новый target лежит не в блоке основного содержимого (_getFloatAreaContentRoot), то перетащим
         //панель в body, иначе перетащим её в контейнер содержимого.
         //Это нужно для того, чтобы панель, привязанная к элементу, лежащему в блоке основного содержимого,
         //анимировалась вместе с этим блоком.
         var contentRoot = FloatAreaManager._getFloatAreaContentRoot(),
             wrapper = this._visibleRootWrapper;
         if (this._target.closest(contentRoot).length) {
            if (!wrapper.closest(contentRoot).length) {
               wrapper.appendTo(contentRoot);
            }
         } else {
            if (wrapper.closest(contentRoot).length) {
               wrapper.appendTo(BODY);
            }
         }
      }),
      /**
       * <wiTag group="Отображение">
       * Установить отступ от блока, у которого должна быть показана панель.
       * Положительные значения y смещают панель вниз, отрицательные - вверх.
       * Положительные значения x смещают панель вправо, отрицательные - влево.
       * Отступ не зависит от направления показа панели или чего-либо ещё.
       * @param {Object} offset Отступ в формате: {x: Number, y: Number}.
       * @example
       * Перед началом анимации открытия панели проверяем отступы - не превышают ли они размеры текущего документа.
       * <pre>
       *     onBeforeShow: function() {
       *        var offSet = this.getOffset();
       *        if (offset.x > $(document).width()) {
       *           offSet.x=0;
       *        }
       *        if (offSet.y > $(document).height()) {
       *           offSet.y=0;
       *        }
       *        //устанавливаем отступы после проверки
       *        this.setOffset(offSet);
       *     }
       * </pre>
       * @see offset
       * @see getOffset
       * @see target
       * @see setTarget
       * @see getTarget
       */
      setOffset: function(offset){
         this._options.offset = offset;
         this._recalcPosition();
      },
      /**
       * <wiTag group="Данные">
       * Получить текущий блок, у которого показывается панель.
       * Привязать панель можно только к контролу. Например, нельзя вызвать всплывающую панель с текста.
       * @return {jQuery} Блок, у которого показывается панель.
       * @see setTarget
       * @see target
       */
      getTarget: function(){
         return this._target;
      },
      /**
       * <wiTag group="Данные">
       * Получить отступы панели.
       * Отступ не зависит от направления показа панели или чего-либо ещё.
       * @return {Object} Возвращает объект с отступами панели: {x: Number, y: Number}.
       * @example
       * Перед началом анимации открытия панели проверяем отступы - не превышают ли они размеры текущего документа.
       * <pre>
       *     onBeforeShow: function() {
       *        //получаем текущие отступы
       *        var offSet = this.getOffset();
       *        if (offset.x > $(document).width()) {
       *           offSet.x=0;
       *        }
       *        if (offSet.y > $(document).height()) {
       *           offSet.y=0;
       *        }
       *        this.setOffset(offSet);
       *     }
       * </pre>
       * @see offset
       * @see setOffset
       */
      getOffset: function(){
         return $ws.core.clone(this._options.offset);
      },
      /**
       * <wiTag group="Данные">
       * Сохранить информацию о контроле.
       * О том, что это дочерний контрол, был активен только у себя, чтобы родительские области
       * пытались закрыть панель при возвращении фокуса на родительскую панель.
       * @param {$ws.proto.Control} child Дочерний контрол.
       */
      storeActiveChild: function(child){
         this.setChildActive(child);
      },
      /**
       * <wiTag group="Данные">
       * Получить имя шаблона, установленного в область.
       * @return {String} Имя установленного в данную область шаблона.
       */
      getTemplateName: function(){
         return this._options.template;
      },
      /**
       * <wiTag group="Управление">
       * Заставляет панель быть показанной, несмотря на уведение мыши.
       * Считает количество вызовов, т.е. если вызвать lockShowed два раза, то потребуется вызвать {@link unlockShowed} точно также два раза.
       * Актуально для {@link hoverTarget}.
       * @see unlockShowed
       * @see isLockShowed
       * @see hoverTarget
       */
      lockShowed: function(){
         ++this._locksShowed;
      },
      /**
       * <wiTag group="Данные">
       * "Отвязывает" панель, позволяя ей закрываться, если на ней нет мыши.
       * Актуально при использовании {@link hoverTarget}.
       * @see lockShowed
       * @see isLockShowed
       * @see hoverTarget
       */
      unlockShowed: function(){
         if(--this._locksShowed === 0 && this._hoverTimer){
            this._startHoverTimer();
         }
      },
      /**
       * <wiTag group="Данные">
       * Привязан ли показ панели
       * @param {Boolean} [forceUnlock=false]
       * @param {Array} [childAreas] Массив панелей, которые нужно будет скрыть. 
       * @returns {Boolean}
       * @see lockShowed
       * @see unlockShowed
       */
      isLockShowed: function(forceUnlock, childAreas) {
         childAreas  = childAreas  || [];
         forceUnlock = forceUnlock || false;

         var ffAreasIndex = [],
             i, l, child;
         // Если счетчик не нулевой значит он изменен публичными методами - есть блокировка
         if (this._locksShowed > 0) {
            // если окна все скрыты - считаем что блокирующих нет
            return true;
         } else {
            // Если счетчик нулевой, проверим связанные окна
            for (i = 0, l = this._childWindows.length; i < l; i++) {
               child = this._childWindows[i];
               if ($ws.helpers.instanceOfModule(child, 'SBIS3.CORE.FilterFloatArea')) {
                  ffAreasIndex.push(i);
                  continue;
               }
               // проверим что среди них есть хотябы одно видимое
               if (child.isVisible() || (child instanceof $ws.proto.FloatArea && child.isOpened())) {
                  if(!forceUnlock) {
                     return true;
                  }
                  childAreas.push(this._childWindows[i]);
               }
            }
            //Если есть открытые filterFloatAreas, то закроем сначала их
            if (ffAreasIndex.length) {
               for (i = 0, l = ffAreasIndex.length; i < l; i++) {
                  this._childWindows[ffAreasIndex[i]].hide();
               }
            }
            // если видимых нет
            return false;
         }
      },
      /**
       * <wiTag group="Управление">
       * Задать элемент, при наведении на который будет показана панель.
       * @param {jQuery|undefined} target Элемент
       * @param {Boolean} [stop] Нужно ли останавливать таймер, по окончании которого панель закроется.
       * @see getHoverTarget
       */
      setHoverTarget: function(target, stop){
         if(this._hoverTarget){
            this._hoverTarget.unbind('.wsFloatAreaHover');
         }
         this._options.hoverTarget = target;
         this._hoverTarget = $(this._options.hoverTarget).length ? $(this._options.hoverTarget) : undefined;
         if(this._hoverTarget){
            this._bindHoverEvents();
         }
         if(stop){
            this._stopTimer('_hoverTimer');
         }
      },
      /**
       * <wiTag group="Управление">
       * Получить элемент, при наведении на который будет показана панель.
       * @returns {jQuery|undefined} Элемент, при наведении на который будет показана панель
       * @see setHoverTarget
       */
      getHoverTarget: function(){
         return this._hoverTarget;
      },
      //TODO: убрать, когда у всплывающих панелей не будет родительских контролов
      focusCatch: function(event){
         $ws.single.WindowManager.disableLastActiveControl();
         if(event.shiftKey){
            $ws.single.WindowManager.focusToFirstElement();
         }
         else{
            $ws.single.WindowManager.focusToLastElement();
         }
         return true;
      },
      /**
       * <wiTag group="Управление">
       * Установить скрывать ли аккордеон (боковую панель).
       * Актуально в случае стека панелей, опция {@link isStack} установлена в true.
       * Работает только при вызове первой панели. Т.е. если аккордеон скрыли, то при открытии следующих панелей его уже
       * нельзя вернуть.
       * Возможные значения:
       * <ol>
       *    <li>true - скрывать (по умолчанию),</li>
       *    <li>false - не скрывать аккордеон.</li>
       * </ol>
       * @param {Boolean} hideSideBar Скрыть ли аккордеон.
       * @see hideSideBar
       * @see isStack
       */
      setHideSideBar: function(hideSideBar) {
         this._options.hideSideBar = hideSideBar;
      },
      _templateOptionsFilter: function(){
         var s = $ws.proto.FloatArea.superclass._templateOptionsFilter.apply(this, arguments);
         return s.concat('border', 'caption');
      }
   });

   return $ws.proto.FloatArea;
});
