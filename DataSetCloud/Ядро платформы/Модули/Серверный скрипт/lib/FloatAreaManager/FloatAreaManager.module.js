/**
 * Класс по работе со всплывающими панелями, имеющими флаг isStack. Организует их взаимное расположение, размеры, взаимодействие
 * @author NefedovAO
 */
define('js!SBIS3.CORE.FloatAreaManager', [], function() {
   'use strict';

   //TODO Надо починить анимацию в IE9. Причина неработоспособности - переход на jQuery Position
   var
       USE_ANIMATION = $ws._const.browser.chrome, //В IE8 анимация сильно тормозит - выключаем.
       MINIMUM_DISTANCE_MULTIPLIER = 0.1,
       MINIMAL_PANEL_DISTANCE      = 50,
       MINIMAL_PANEL_WIDTH         = 50,
       MINIMAL_PANEL_DISTANCE2     = 10,
       MIN_CONTENT_WIDTH           = 1000,
       USE_CSS3 = USE_ANIMATION &&
                  !$ws._const.browser.isMobileSafari && //на айпаде анимация через css3 при выдвижении панели глючит (сначала реестр выезжает, потом панель, а надо одновременно),
                                                        // хотя в конечную точку приходит правильно.
                                                        //выключаем до лучших времён - когда дойдут руки отладить эту анимацию на айпаде.
                  $ws._const.compatibility.cssTransform && $ws._const.compatibility.cssAnimations,
       BODY = (typeof window !== 'undefined') && $('body'),
       MINWIDTH = (typeof window !== 'undefined') && $('#min-width');



   /**
    * Возвращает значение, которое не меньше минимума и не больше максимума (мин < макс, иначе возьмёт макс)
    * @param {Number} value Значение
    * @param {Number} min Минимум
    * @param {Number} max Максимум
    * @returns {Number}
    */
   function clamp(value, min, max) {
      if (value < min) {
         value = min;
      }
      if (value > max) {
         value = max;
      }
      return value;
   }

   /**
    * Информация о панели
    */
   var AreaInfo = function() {
      this.size = {
         width: 0,
         height: 0
      };
   };

   AreaInfo.prototype = {
      control: undefined,          //Сам контрол
      right: 0,                  //Правая координата
      methods: undefined,        //Объект с дополнительными методами от всплывающей панели (недоступны снаружи класса)
      hideSideBar: true,        //Нужно ли скрывать боковую панель при открытии данной панели
      id: '',                    //Идентификатор панели. "content" в случае главной панели
      scrollTop: 0,              //Вертикальный скролл самой панели
      preparedToShow: false
   };

   AreaInfo.prototype.width = function() {
      return this.control._containerShadow.width();
   };

   /**
    * @singleton
    * @class $ws.single.FloatAreaManager
    */
   $ws.single.FloatAreaManager = {
      /**
       * Объект со всеми простыми панелями
       */
      _areas: {},
      /**
       * Объект вида "идентификатор панели" => "информация о панели"
       */
      _areaInfos: {},
      /**
       * jQuery-объект, в котором содержится основное содержимое страницы
       */
      _$content: undefined,
      /**
       * Родительский элемент содержимого
       */
      _$contentParent: undefined,
      /**
       * Боковая панель
       */
      _$sideBar: undefined,
      /**
       * Видна ли боковая панель
       */
      _sideBarVisible: true,
      /**
       * Ширина боковой панели. Если её нет, возвращает 0
       */
      _sideBarWidth: 0,
      /**
       * Стек из AreaInfo - открытые панели
       */
      _stack: [],
      /**
       * Контейнер, в котором будут лежать все панели
       */
      _$floatAreaContainer: undefined,
      /**
       * Ширина контейнера со всплывающими панелями
       */
      _floatAreaContainerWidth: 0,
      /**
       * Флаг того, что в данный момент ставится размер панели данным контролом
       */
      _settingAreaSize: false,
      /**
       * Правая тень. Передвигаем её, чтобы была корректная высота блока и она не анимировалась
       */
      _$rightShadow: undefined,

      /**
       * Максимальная ширина блока с панелями
       * Если мы на обычном сайте - MAX_CONTENT_WIDTH
       * Иначе не ограничено
       */
      _maxContentWidth: 0,

      _havePanelsInStack: false,

      /**
       * Кеш для позиции прокрутки окна - нужен, чтобы не запрашивать её лишний раз при показе первой панели
       */
      _winScrollTop: 0,

      /**
       * Кеш для позиции прокрутки панели с осн. содержимым - нужен, чтобы не запрашивать её лишний раз при прятании последней
       */
      _contentScrollTop: undefined,

      _animationLength: 0,
      _panelHideAnimationDelay: 0,
      _minContentWidth: MIN_CONTENT_WIDTH,

      /**
       * Корневой блок, в котором лежит содержимое страницы.
       * Поверх этого содержимого будет показываться стек плавающих панелей.
       * Этот блок должен быть помечен в html-шаблоне страницы классом ws-float-area-stack-root, и лежать в блоке,
       * растянутом на 100% высоты экрана, чтобы была возможной его прокрутка при показанном стеке панелей.
       * @returns {jQuery}
       * @private
       */
      _getFloatAreaContentRoot: function() {
         var root = $('.ws-float-area-stack-root:first');
         if (root.length === 0) {
            root = $('body');
         }
         return root;
      },

      /**
       * <wiTag noShow>
       * Инициализирует важные штуки
       */
      _init: function() {
         this._$content = this._getFloatAreaContentRoot();
         // Вычисляем реальную максимально возможную ширину контента
         this._maxContentWidth = $ws.helpers.reduce(this._$content.parents(), function(maxWidth, element){
            var elemMaxWidth = parseInt($(element).css('max-width'), 10);
            if (!isNaN(elemMaxWidth) && elemMaxWidth > 0) {
               if (elemMaxWidth < maxWidth) {
                  maxWidth = elemMaxWidth;
               }
            }
            return maxWidth;
         }, parseInt(this._$content.css('max-width'), 10) || Infinity);
         this._$contentParent = this._$content.parent();
         this._$sideBar = $('.ws-float-area-stack-sidebar');
         this._sideBarWidth = this._$sideBar.width();
         this._$rightShadow = $('.ws-float-area-stack-right-shadow');
         $ws.helpers.wheel($('html'), this._wheelHandler.bind(this));
         $ws._const.$win.bind('resize.wsFloatAreaManager', this._resize.bind(this));
         $ws.single.WindowManager.subscribe('onAreaFocus', this._focusMoved.bind(this));

         //Нужно для того, чтобы не запрашивать $win.scrollTop при показе первой панели
         $ws._const.$win.bind('scroll', function() {
            this._winScrollTop = $ws._const.$win.scrollTop();
         }.bind(this));
      },

      _wheelHandler: function(event) {
         var $target = $(event.target),
            hasScrollable,
            scrollTop,
            scrollHeight,
            clientHeight,
            scrollContainer;

         //Не крутим панель, если курсор находится над каким-то элементом с прокрутками - иначе его крутить не получится
         hasScrollable = $target.parents().filter(function() {
            return this.scrollHeight > this.offsetHeight && /auto|scroll/.test($(this).css('overflow-y'));
         }).length;

         if (!hasScrollable) {
            if ($target.closest(this._$contentParent).length > 0) { //курсор над осн. содержимым страницы
               scrollContainer = this._$contentParent;
            } else {
               scrollContainer = null;//курсор хз над кем. а вдруг...
            }

            if (scrollContainer) {
               scrollTop = scrollContainer.scrollTop();
               scrollHeight = scrollContainer.prop('scrollHeight');
               clientHeight = scrollContainer.prop('clientHeight');

               scrollTop = clamp(scrollTop - event.wheelDelta, 0, scrollHeight - clientHeight);
               scrollContainer.scrollTop(scrollTop);

               //Запомним позицию осн. содержимого, чтобы не спрашивать при закрытии последней панели
               this._contentScrollTop = scrollTop;
            }
         }
      },

      _getPanelHideAnimationDelay: function() {
         return this._stack.length === 1 ? this._panelHideAnimationDelay : 0;
      },

      _getFloatAreaContainer: function() {
         if (!this._$floatAreaContainer) {
            this._$floatAreaContainer = $('<div>', {'class': 'ws-float-area-stack-container'});
            BODY.prepend(this._$floatAreaContainer);
         } else if (!BODY.children(':first-child').is(this._$floatAreaContainer)) {
            BODY.prepend(this._$floatAreaContainer);
         }

         return this._$floatAreaContainer;
      },

      _useAnimation: function() {
         return USE_ANIMATION;
      },

      _useCss3: function() {
         return USE_CSS3;
      },

      /**
       * Подгоняет плавающие панели, привязанные к своим блокам, после прокрутки родительских стековых панелей или области основного содержимого,
       * в режиме выдвинутых стековых панелей.
       * @private
       */
      _updateAreaPositions: function() {
         if (this._havePanelsInStack) {
            $ws.helpers.forEach(this._areas, function(area) {
               if (area.isVisible() && !area._options.isStack) {
                  area._recalcPosition();
               }
            });
         }
      },

      _resetWindowSizes: function() {
         this._getWindowHeight.reset();
         this._calcSizeParams.reset();
         this._getPanelRootPaddingRight.reset();
      },
      /**
       * Обработчик изменения размеров окна
       * @private
       */
      _resize: function() {
         var resize = function() {
            this._resetWindowSizes();

            if (this._stack.length > 0) {
               $ws.helpers.forEach(this._stack, function(info) {
                  info.control._sizeUpdated(true);
               });
               this._updateSideBarVisibility();
            }
         }.bind(this);

         //TODO: странное поведение с получением $(window).height() при ужатии окна. появляется как-бы гориз. скролл, после первой корректировки
         // (первого resize) он пропадает, и во втором resize уже идёт правильный $(window).height(), без гориз. скролла.
         resize();
         resize();
      },

      _getWindowHeight: $ws.helpers.memoize(function() {
         return $ws._const.$win.height();
      }, '_getWindowHeight'),

      setContentMinWidth: function(minWidth) {
         // TODO 16 - magic number? Отступы от контента справа и слева
         this._minContentWidth = (minWidth + this._sideBarWidth + 16) || MIN_CONTENT_WIDTH;
         MINWIDTH.css('min-width', this._minContentWidth);
         this._resize();
      },

      _getPanelRootPaddingRight: $ws.helpers.memoize(function() {
         var bodyRight = BODY.get(0).getBoundingClientRect().right,
             contentParentRight = this._$contentParent.get(0).getBoundingClientRect().right;

         return bodyRight - contentParentRight;
      }, '_getPanelRootPaddingRight'),

      _calcSizeParams: $ws.helpers.memoize(function() {
         var winWidth = $ws._const.$win.width() - $ws.helpers.getScrollWidth(),
             contentWidth = clamp(winWidth, this._minContentWidth, this._maxContentWidth),
             minimumPanelDistance = Math.floor(contentWidth * MINIMUM_DISTANCE_MULTIPLIER + this._sideBarWidth);

         return {
            contentWidth: contentWidth,
            minimumPanelDistance: minimumPanelDistance,
            minimumPanelDistanceNoAcc: Math.floor(contentWidth * MINIMUM_DISTANCE_MULTIPLIER)
         };
      }, '_calcSizeParams'),

      _canHideSidebar: function() {
         return $ws.helpers.reduce(this._stack, function(result, info) {
            return result && info.hideSideBar;
         }, true);
      },
      /**
       * Обновляет видимость боковой панели
       * @param {Boolean} isVisible Должна ли быть видна боковая панель в данный момент
       * @private
       */
      _updateSideBarVisibility: function() {
         var
            widthParams, maxWidth, isVisible, sideBarWidth, animationFunc, delay;

         if (this._canHideSidebar()) {
            widthParams = this._calcSizeParams();
            maxWidth = $ws.helpers.reduce(this._stack, function(max, info) {
               return Math.max(max, info.width());
            }, 0);
            isVisible = (widthParams.contentWidth - maxWidth >= widthParams.minimumPanelDistance);

            if (isVisible !== this._sideBarVisible) {
               this._sideBarVisible = isVisible;

               //Показывает/скрывает боковую панель, используя наложение _$content поверх неё
               sideBarWidth = (this._sideBarVisible ? 0 : (-this._sideBarWidth));

               if (!USE_ANIMATION) {
                  animationFunc = function() {
                     this._$content.css({ left: sideBarWidth });
                  };
               } else if (USE_CSS3) {
                  animationFunc = function() {
                     var animLength = this._animationLength / 1000 + 's';
                     this._$content.css({
                        '-webkit-transition-duration': animLength,
                        '-moz-transition-duration': animLength,
                        'transition-duration': animLength
                     });

                     this._$content.css('transform', 'translateX(' + sideBarWidth + 'px)');
                  };
               } else {
                  animationFunc = function() {
                     this._$content.stop().animate({
                        left: sideBarWidth
                     }, this._animationLength);
                  };
               }

               delay = this._getPanelHideAnimationDelay();
               if (this._sideBarVisible || delay === 0) {
                  animationFunc.call(this);
               } else {
                  setTimeout(animationFunc.bind(this), delay);
               }
            }
         }
      },

      _getMaxWidthForArea: function(area, minWidth) {
         var
             widthParams = this._calcSizeParams(),
             areaIdx = $ws.helpers.findIdx(this._stack, function(info) {
               return info.control === area;
             }),
             prevAreaIdx = areaIdx !== -1 ? areaIdx - 1 : this._stack.length - 1,
             prevWidth = prevAreaIdx !== -1 ? this._stack[prevAreaIdx].width() : widthParams.contentWidth,
             panelOffset,
             result;

         switch (prevAreaIdx) {
            case -1: panelOffset = widthParams.minimumPanelDistance; break;
            case 0: panelOffset = MINIMAL_PANEL_DISTANCE; break;
            default: panelOffset = MINIMAL_PANEL_DISTANCE2;
         }

         result = Math.max(prevWidth - panelOffset, MINIMAL_PANEL_WIDTH);
         if (prevAreaIdx === -1 && result < minWidth) {
            result = Math.max(prevWidth - widthParams.minimumPanelDistanceNoAcc, MINIMAL_PANEL_WIDTH);
         }

         return result;
      },

      /**
       * Скрывает панели, которые должны быть скрыты из-за того, что фокус перешёл
       * @param {$ws.proto.FloatArea} area Панель, которую нужно закрыть
       * @param {Object} hiddenAreas Объект с идентификаторами панелей, которые нужно закрыть
       * @private
       */
      _hideAreaWithParents: function(area, hiddenAreas) {
         var opener;

         // Скрываем панель только в том случае, если она польностью видна (т.е. не находится в состоянии анимации)
         if (area.isVisible()) {
            area.hide(true);
            opener = area.getOpener();
            if (opener) {
               opener = opener.getParentByClass($ws.proto.FloatArea);
            } else {
               opener = area.getParentByClass($ws.proto.FloatArea);
            }
            if (opener && opener.isVisible() && opener.isAutoHide() && !opener.isLockShowed() && opener.getId() in hiddenAreas) {
               this._hideAreaWithParents(opener, hiddenAreas);
            }
         }
      },
      /**
       * Скрывает области, которые должны закрыться после перехода фокуса
       * @param {$ws.proto.AreaAbstract} area Область, на которую перешёл фокус
       * @private
       */
      _hideUnnecessaryAreas: function(area) {
         var hiddenAreas = {};
         $ws.helpers.forEach(this._areas, function(panel) {
            var temp = area,
               found = false;
            if (!panel || !panel.isVisible() || !panel.isAutoHide()) {
               return;
            }
            do {
               if (temp === panel) {
                  found = true;
                  break;
               }
               temp = temp.getParent() || (temp.getOpener && temp.getOpener());
            }
            while(temp);
            if (!found) {
               hiddenAreas[panel.getId()] = true;
            }
         }, this);

         $ws.helpers.forEach(hiddenAreas, function(_, areaId) {
            this._hideAreaWithParents(this._areas[areaId], hiddenAreas);
         }.bind(this));
      },
      /**
       * Обрабатывает переход фокуса в другую область
       * @param {$ws.proto.EventObject} event Событие
       * @param {$ws.proto.AreaAbstract} area Область, в которую перешёл фокус
       * @private
       */
      _focusMoved: function(event, area) {
         // если фокус перешел на индикатор загрузку, то не будем скрывать панели
         // FIXME Переделать (как-то)
         if (!$ws.helpers.instanceOfModule(area.getOpener(), 'SBIS3.CORE.LoadingIndicator')) {
            this._hideUnnecessaryAreas(area);
         }
      },

      /**
       * Вызывается перед показом панели, до её отображения на экране.
       * Нужно, чтобы при показе первой панели менеджер панелей убрал прокрутку с body и включил margin,
       * тем самым обеспечив правильный начальный расчёт размеров панели.
       * @param {$ws.proto.FloatArea} area Панель
       */
      _beforeShowStarted: function(area) {
         if (area._options.isStack) {
            var id = area.getId(),
                info = this._areaInfos[id];

            info.preparedToShow = false;
            this._hideUnnecessaryAreas(info.control);

            this._stack.push(info);
            this._checkToggleContentScroll();
         }
      },

      /**
       * Вызывается после начала показа панели, когда она показана на экрана и начала выезжать.
       * Тут на основе уже правильных начальных размеров панели рассчитывается размер оверлея, а также сдвигается боковуха, если нужно.
       * @param {$ws.proto.FloatArea} area Панель
       */
      _showStarted: function(area) {
         if (area._options.isStack) {
            var id = area.getId(),
               info = this._areaInfos[id];

            if (this._stack.length === 1) {
               this._animationLength = info.control._options.animationLength;
               this._panelHideAnimationDelay = USE_ANIMATION ? Math.max(10, this._animationLength * 0.1) : 0;
            }

            //Если есть анимация, то нужно сделать два просчёта видимости боковухи: первый в начале анимации, а второй в конце после расчёта авторазмеров выехавшей панели
            //Если анимации нет, то нужен только второй расчёт
            if (USE_ANIMATION) {
               this._updateSideBarVisibility();
            }
            info.preparedToShow = true;
         }
      },

      _beforeClose: function(area) {
         if (area._options.isStack) {
            var id = area.getId(),
                info = this._areaInfos[id];

            this._removeAreaFromStack(info, false);
         }
      },

      _afterClose: function(area) {
         if (area._options.isStack) {
            this._checkToggleContentScroll();
         }
      },

      _getLastAreaInfo: function() {
         var ln = this._stack.length;
         return ln > 0 ? this._stack[ln - 1] : 0;
      },

      /**
       * Добавляет панель в обработку стек-панелей
       * @param {$ws.proto.FloatArea} area Панель
       * @param {Object} options Опции панели, необходмые менеджеру
       */
      _setAreaInfo: function(area, options) {
         var id = area.getId(),
             info = new AreaInfo();

         info.control = area;
         info.hideSideBar = options.hideSideBar;
         info.id = id;

         this._areaInfos[id] = info;
      },
      /**
       * <wiTag group="Данные">
       * Добавить панель в список всех панелей.
       * @param {$ws.proto.FloatArea} area Добавляемая панель.
       */
      _addArea: function(area) {
         this._areas[area.getId()] = area;
      },
      /**
       * <wiTag group="Управление">
       * Перестать обрабатывать указанную панель.
       * @param {$ws.proto.FloatArea} area Панель
       */
      _removeArea: function(area) {
         var id = area.getId(),
            info = this._areaInfos[id];
         if (info) {
            delete this._areaInfos[id];

            this._removeAreaFromStack(info, true);
         }
         delete this._areas[id];
      },

      _useTouch: function() {
         return $ws._const.compatibility.touch &&
                $ws.helpers.getScrollWidth() === 0;
      },

      /**
       * Переключает скролл на основном содержимом по необходимости
       * @private
       */
      _checkToggleContentScroll: function () {
         var classList = ['ws-float-area-content-scroll'],
            toggle = this._stack.length > 0,//псевдоскролл нужен тогда, когда в стеке есть какие-то панели
            scrollWidth;

         if (toggle !== this._havePanelsInStack) {
            try {
               var changeEventArg = {
                  floatAreaStack: toggle,
                  contentScrollBlock: this._$contentParent
               },
               globalChannel = $ws.single.EventBus.globalChannel();

               globalChannel.notify('onBeforeBodyMarkupChanged', changeEventArg);

               this._resetWindowSizes();
               if (toggle) {
                  this._contentScrollTop = this._winScrollTop;

                  BODY.css('overflow-y', 'hidden');
                  if ($ws._const.browser.chrome) {
                     //ХАК - для Хрома нужно явно вызвать пересчёт ширины, а то
                     // последующий this._$scrollElement.css иногда вызывает ненужные скроллы в документе,
                     // думая, что ширины не хватает.
                     BODY.width();
               }
               }

               if (!this._useTouch()) {
                  classList.push('ws-float-area-content-scroll-touch');
                  //При наличии панелей в стеке прячем родной скролл в
                  //body, вместо него делаем margin, и помещаем туда (в margin) псевдоскролл
                  //через отрицательное смещение.
                  //Тут важен порядок включения маржина и помещения туда скролла, а также порядок их убирания -
                  // - чтобы не появлялся горизонтальный скролл у body
                  if (toggle) {
                     scrollWidth = $ws.helpers.getScrollWidth();
                     BODY.css('margin-right', scrollWidth);
                  } else {
                     BODY.css('margin-right', 0);
               }
               }
               this._$contentParent.toggleClass(classList.join(' '), toggle);
               if (!toggle) {
                  BODY.css('overflow-y', '');
               }
               if (toggle) {
                  $ws._const.$win.scrollTop(0);
                  this._$contentParent.scrollTop(this._winScrollTop);
                  this._$rightShadow.prependTo(this._$contentParent.parent());
               } else {
                  $ws._const.$win.scrollTop(this._contentScrollTop);
                  this._winScrollTop = this._contentScrollTop;
                  this._$rightShadow.prependTo(this._$content);
               }
               this._updateAreaPositions();

               //Нужно принудительно обновить позиции отслеживаемых элементов,
               //чтобы они не "прыгали" из-за того, что у body пропала прокрутка
               $ws.helpers.updateTrackedElements();
               globalChannel.notify('onBodyMarkupChanged', changeEventArg);
            }
            finally {
               this._havePanelsInStack = toggle;
            }
         }
      },

      _removeAreaFromStack: function(info, checkToggleContentScroll) {
         var index = Array.indexOf(this._stack, info),
             result = index !== -1;

         if (result) {
            this._stack.splice(index, 1);
            if (checkToggleContentScroll) {
               this._checkToggleContentScroll();
            }

            if (this._canHideSidebar()) {
               this._updateSideBarVisibility();
            }
         }
         return result;
      }
   };

   // При выполнении на сервере не делаем инициализацию
   if (typeof window !== 'undefined') {
      $ws.single.FloatAreaManager._init();
   }

   return $ws.single.FloatAreaManager;
});