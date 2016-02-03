/* global define: false, $: false */
define('js!SBIS3.Engine.HintManager', [
   'js!Core/js-template-doT',
   'css!SBIS3.Engine.HintManager'
], function(
   doT
) {
   'use strict';

   var hintManagerQuestionSelector = '.HintManagerQuestion';

   var HintManager = $ws.proto.Abstract.extend({
      $protected: {
         _visible: false, // флаг отображения оверлея
         _$overlay: null, // jQuery объект с оверлеем
         _controlStack: [], // стек контролов
         _hintStore: {} // хранилище подсказок
      },

      $constructor: function() {
      },

      init: function() {
         var self = this;

         this._$overlay = $('<div class="dark-overlay hiddenOver"></div>');
         $('body').append(this._$overlay);

         $('body').delegate('.brickText .close', 'click', function() {
            self.hide();
         });

         $ws.single.EventBus.channel('HintManagerChannel').subscribe('showHint', function (eventObject, controlName) {
            self.addControl(controlName);
            self.show();
         });

         $ws.single.EventBus.channel('HintManagerChannel').subscribe('onClose', function (eventObject, controlName) {
            var pop = self._controlStack.pop();
            if (pop !== controlName) {
               self.addControl(pop);
            }
            self._checkVisible();
         });

         var refreshPosition = function refreshPosition() {
            var howEasyContainer = $('#howEasy'),
               serviceHintHelp = $('.controlWrapper[data-uniquename="serviceHint_Help"], .controlWrapper[data-uniquename="Staff_Help"]'),
               offset = howEasyContainer.offset();

            if (self._visible) {
               //FIXME: жестко завязались к #container, потому что он может выходить за пределы html блока
               var property = self._getLastControl();
               var linkedControl = self._hintStore[property];
               if (linkedControl) {
                  $ws.helpers.forEach(linkedControl, function (value, key) {
                        var styles;
                        if ($(value.selector).length > 0) {
                           styles = self._getStyles($(value.selector));
                           $('[id="controlWrapper_' + property + '_' + key + '"]').css(styles);
                        }
                     }
                  );
               }
            }

            if (howEasyContainer.length) {
               serviceHintHelp.toggleClass('ws-hidden', !howEasyContainer.find('.HintManagerQuestion').is(':visible'));
               serviceHintHelp.css({left: offset.left, top: offset.top});
            }
         };

         $(window).resize(refreshPosition);
         $(window).scroll(refreshPosition);
      },

      /**
       * Отобразить оверлей с подсказками, если нет активных подсказок не отображаем
       * @param {Boolean} force - принудительный показ подсказок, и тех, которых уже показывали
       */
      show: function(force) {
         return this._checkVisible(true, force);
      },

      /**
       * Принудительно меняет видимость оверлея, с отрисовкой внутренних элементов.
       * @param {Boolean} [onlyHide=false] true, если хотим только закрывать оверлей.
       */
      animateToggle: function (onlyHide) {
         onlyHide = onlyHide || false;

         var self = this;
         var offset = $(hintManagerQuestionSelector).offset();
         var delay = 600;

         if (self._visible) {
            var wasClosed = false;
            var showServiceHint = function showServiceHint() {
               // скроем оверлей и покажем подсказку для знака вопроса, затем очистим все данные о ней
               if (wasClosed) {
                  return;
               }

               wasClosed = true;
               self._toggle(false);
               self.addControl('serviceHint');
               self.addHint({
                  uniqueName: 'serviceHint_Help',
                  selector: '#howEasy',
                  hintPosition: {
                     top: '11px',
                     left: '180px'
                  },
                  controlName: 'serviceHint',
                  arrowClass: 'bottom-right',
                  text: 'Развернуть подсказки'
               });

               var showDeferred = self.show(true);
               if (!showDeferred) {
                  return;
               }

               showDeferred.addCallback(function() {
                  self._visible = false;
                  self._controlStack.pop();
               });
            };

            $('.hint,.brickText').css('overflow', 'hidden').animate({top: 0, left: 0, width: 0, height: 0, opacity: 0}, delay);
            $('.controlWrapper').each(function () {
               $(this).animate({top: offset.top, left: offset.left}, delay, function () {
                  showServiceHint();
               });
            });
         } else if (!onlyHide) {
            var showDeferred = self.show(true);
            if (!showDeferred) {
               return;
            }

            showDeferred.addCallback(function() {
               var hintArrayByControlName = [];
               var controlName = self._getLastControl();
               $('.controlWrapper').css({top: offset.top, left: offset.left, opacity: 0});
               hintArrayByControlName = self._hintStore[controlName];
               if (hintArrayByControlName) {
                  $ws.helpers.forEach(hintArrayByControlName, function (value) {
                     var styles = {};
                     if ($(value.selector).length > 0) {
                        styles = self._getStyles($(value.selector));
                        $('.controlWrapper[data-uniquename=' + value.uniqueName + ']').animate({top: styles.top, left: styles.left, opacity: 1}, delay);
                     }
                  });
               }
            });
         }
      },

      /**
       * Метод ручного показа Менеджера подсказок
       * @param control - имя контрола для которого необходимо отобразить подсказки
       * @param force - принудительный показ подсказок
       */
      showImmediatly: function (control, force) {
         this._clearControlStack();
         this.addControl(control);
         this.show(force);
      },

      /**
       * Проверяет наличие активных подсказок в данный момент, при необходимости может показать их
       * @param show - показывать ли оверлей с подсказками
       * @param force - принудительный показ подсказок
       * @private
       */
      _checkVisible: function (show, force) {
         //FIXME: показывать подсказки только на инсайде
         if (!/(inside\.)/.test(window.location.host)) {
            return null;
         }

         var self = this;
         var length = self._controlStack.length;
         var showOverlay = false; // не показываем оверлей если нет активных подскаазок
         var visibleQuestion = false; // отображать вопрос в птичьей подсказке
         var hintArrayByControlName = [];
         var UserConfig = new $ws.proto.Deferred();
         var resultDef = new $ws.proto.Deferred();

         $ws.single.UserConfig.getParam('HintManager').addCallback(function(hintManager) {
            // HintSessionFromUserConfig - чтобы избавить пользователя от повторного просмотра подсказок после чистки кеша и при входе с других устройств
            var HintSessionFromUserConfig = {};
            if (hintManager) {
               HintSessionFromUserConfig = $.parseJSON(hintManager);
            }
            UserConfig.callback(HintSessionFromUserConfig);
         });

         UserConfig.addCallback(function (HintSessionFromUserConfig) {
            self._$overlay.empty();
            if (length) {
               var controlName = self._getLastControl();
               var curTime = (new Date()).getTime();

               hintArrayByControlName = self._hintStore[controlName];
               if (hintArrayByControlName) {
                  $ws.helpers.forEach(hintArrayByControlName, function (value, key) {
                     var extConfig = self._prepareConfigToDraw(value, key);
                     if (!extConfig.uniqueName) {
                        return;
                     }

                     var userConfigArr = extConfig.uniqueName.split('_', 2);
                     var section = userConfigArr[0];
                     var hintUniqueName = userConfigArr[1];
                     HintSessionFromUserConfig[section] = HintSessionFromUserConfig[section] || {};

                     var showByTime = false;
                     var firstShow = false;

                     if (HintSessionFromUserConfig[section][hintUniqueName]) {
                        var aimTime = new Date();
                        aimTime.setTime(HintSessionFromUserConfig[section][hintUniqueName]);
                        aimTime.setMonth(aimTime.getMonth() + 2);
                        if (curTime > aimTime.getTime() && extConfig.arrowClass !== 'brickText' && extConfig.arrowClass !== 'brickNote') {
                           showByTime = true;
                        }
                     } else {
                        firstShow = true;
                     }

                     if ((force === true || firstShow || showByTime) && (extConfig.hidden !== true) && show) {
                        self._drawHint(extConfig);
                        HintSessionFromUserConfig[section][hintUniqueName] = curTime;
                        showOverlay = true;
                     }
                     if (extConfig.hidden !== true) {
                        visibleQuestion = true;
                     }
                  });

                  if (show) {
                     $ws.single.UserConfig.setParam('HintManager', JSON.stringify(HintSessionFromUserConfig));
                  }
               }
            }

            var $hintManagerQuestion = $(hintManagerQuestionSelector);
            if (visibleQuestion) {
               $hintManagerQuestion.show();
            }
            else {
               $hintManagerQuestion.hide();
            }

            if (show) {
               self._toggle(showOverlay);
            }
            resultDef.callback(self._visible);
         });

         return resultDef;
      },

      /**
       * Обновляет время последнего показа подсказки
       * Может принимать как строку с уникальным именем подсказки, так и массив таких имен
       * @param uniqueName String || Array of String
       */
      updateHintTime: function (uniqueName) {
         var UserConfig = new $ws.proto.Deferred();

         $ws.single.UserConfig.getParam('HintManager').addCallback(function(hintManager) {
            var HintSessionFromUserConfig = {};
            if (hintManager) {
               HintSessionFromUserConfig = $.parseJSON(hintManager);
            }
            UserConfig.callback(HintSessionFromUserConfig);
         });

         function updateUserConfig(userConfig, name) {
            var userConfigArr = [];
            userConfigArr = name.split('_', 2);
            var section = userConfigArr[0];
            var hintUniqueName = userConfigArr[1];
            userConfig[section] = userConfig[section] || {};
            userConfig[section][hintUniqueName] = (new Date()).getTime();
         }

         UserConfig.addCallback(function (HintSessionFromUserConfig) {
            if (uniqueName instanceof Array) {
               $ws.helpers.forEach(uniqueName, function (value) {
                  updateUserConfig(HintSessionFromUserConfig, value);
               });
            } else {
               updateUserConfig(HintSessionFromUserConfig, uniqueName);
            }
            $ws.single.UserConfig.setParam('HintManager', JSON.stringify(HintSessionFromUserConfig));
         });

      },
      /**
       * Удаляет подсказку с уникальным именем с оверлея
       * Может принимать как строку с уникальным именем подсказки, так и массив таких имен
       * @param uniqueName
       */
      removeHintFromOverlay: function (uniqueName) {
         var self = this;
         var offset = $(hintManagerQuestionSelector).offset();
         var delay = 600;
         if (uniqueName instanceof Array) {
            $ws.helpers.forEach(uniqueName, function (value) {
               $('.controlWrapper[data-uniqueName="' + value + '"]', self._$overlay).find('.hint').css('overflow', 'hidden').animate({top: 0, left: 0, width: 0, height: 0, opacity: 0}, delay);
               $('.controlWrapper[data-uniqueName="' + value + '"]', self._$overlay).animate({top: offset.top, left: offset.left}, delay, function () {
                  $(this).remove();
                  // закрыли все подсказки вручную
                  if (!self._$overlay.find('.controlWrapper').length) {
                     self._toggle(false);
                  }
               });
            });
         } else {
            $('.controlWrapper[data-uniqueName="' + uniqueName + '"]', self._$overlay).find('.hint').css('overflow', 'hidden').animate({top: 0, left: 0, width: 0, height: 0, opacity: 0}, delay);
            $('.controlWrapper[data-uniqueName="' + uniqueName + '"]', self._$overlay).animate({top: offset.top, left: offset.left}, delay, function () {
               $(this).remove();
               // закрыли все подсказки вручную
               if (!self._$overlay.find('.controlWrapper').length) {
                  self._toggle(false);
               }
            });
         }

      },

      /**
       * Скрыть оверлей
       */
      hide: function () {
         this.animateToggle(true);
      },

      /**
       * Изменяет видимость оверлея, сохраняя елементы которые уже вставлены в него
       * @param state true - показать, false - скрыть; если не определено изменяет видимость оверлея на противоположную
       * @private
       */
      _toggle: function (state) {
         var self = this;
         if (state === undefined) {
            state = !this._visible;
         }

         this._$overlay.toggleClass('hiddenOver', !( this._visible = state));

         if (state) {
            this._$overlay.find('.hint').each(function () {
               var selfEach = $(this);
               selfEach.click(function (e) {
                  if (e.target.nodeName.toLowerCase() !== 'a' && !selfEach.hasClass('brickNote')) {
                     self.removeHintFromOverlay($(this).parent('.controlWrapper').attr('data-uniqueName'));
                  }
               });
               var attr = selfEach.attr('data-arrowClass');
               if (attr == 'bottom-center' || attr == 'bottom-left' || attr == 'bottom-right' || attr == 'brickNote') {
                  selfEach.css({'marginTop': -selfEach.outerHeight()});
               }
               if (attr == 'left-bottom' || attr == 'right-bottom') {
                  selfEach.css({'marginTop': -selfEach.outerHeight() + 15});
               }
            });

            /*FIXME:
             была проблема в служебных записках с открытой панелью операций, которая
             перекрывала область поиска, на которую указывала подсказка. поэтому было решено закрывать
             все панели операций на странице
             */
            $('.ws-operations-panel').each(function () {
               $(this).wsControl().close();
            });

            $('body').on('keyup.darkOverlay', function (event) {
               if (event.which == 27) { // ESC
                  self._toggle(false);
               }
            });
         } else {
            $('body').off('keyup.darkOverlay');
         }
      },

      /**
       * Возвращает jQuery объект оверлея
       * @returns {*|jQuery|HTMLElement|_$overlay}
       */
      getOverlayElement: function () {
         return this._$overlay;
      },

      /**
       * Возвращает строку с атрибутом "style"
       * @param styleObj - объект, определяющий стили элемента
       * @param addPX - флаг добавления "px" в стилях; если установлен, то добавляется ко всем значениям
       * @returns {string}
       * @private
       */
      _prepareStyles: function (styleObj, addPX) {
         if (!styleObj) {
            return '';
         }

         var stringCSS = '';
         for (var property in styleObj) {
            if (styleObj.hasOwnProperty(property)) {
               stringCSS += property + ':' + styleObj[property] + ((addPX && (property !== 'display')) ? 'px' : '') + ';';
            }
         }
         return 'style="' + stringCSS + '"';
      },

      /**
       * Возвращает объект, хранящий размеры и позицию контрола, к которому добавляется всплывающая подсказка
       * @param elem - объект jQuery, стили которого необходимо узнать
       * @returns {{}}
       * @private
       */
      _getStyles: function (elem) {
         var controlOffset, styles = {};
         controlOffset = elem.offset();
         styles.width = elem.outerWidth();
         styles.height = elem.outerHeight();
         // если у элемента высота 0, то скорее всего он не отображается в данный момент
         if (styles.height === 0 || elem.css('display') === 'none') {
            styles.display = 'none';
         }
         // потому что будет перекрытие если не обнулить, ширину не обнуляем чтобы можно было позиционировать с помощью %
         styles.height = 0;
         styles.left = controlOffset.left;
         styles.top = controlOffset.top;
         return styles;
      },

      /**
       * Шаблон вывода подсказки
       */
      _hintTemplate: doT.template('{{? it.controlName }}' +
         '<div class="controlWrapper" {{=it.controlStyles}} id="controlWrapper_{{=it.controlName }}_{{=it.count}}" data-uniqueName="{{=it.uniqueName}}">' +
         '{{?}}' +
         '<div class="hint {{=it.arrowClass}} {{=it.myClass}} {{? it.withNum }}withNum{{?}}" {{=it.hintPosition}} data-arrowClass="{{=it.arrowClass}}">' +
         '<table>' +
         '<tr>' +
         '<td colspan="3" class="header"></td>' +
         '</tr>' +
         '<tr>' +
         '<td class="itTL"></td>' +
         '<td class="wrap">' +
         '<div class="title">{{=it.title}}</div>' +
         '<div class="content">{{=it.text}}</div>' +
         '</td>' +
         '<td class="itTR"></td>' +
         '</tr>' +
         '<tr>' +
         '<td colspan="3" class="footer"></td>' +
         '</tr>' +
         '</table>' +
         '{{? it.withNum }}<div class="number {{=it.withNum}}"></div>{{?}}' +
         '</div>' +
         '{{? it.controlName }}' +
         '</div>' +
         '{{?}}'),

      _hintTemplateBrickText: doT.template('{{? it.controlName }}' +
         '<div class="controlWrapper" {{=it.controlStyles}} id="controlWrapper_{{=it.controlName }}_{{=it.count}}" data-uniqueName="{{=it.uniqueName}}">' +
         '{{?}}' +
         '<div class="brickText {{=it.myClass}}" {{=it.hintPosition}}>' +
         '<div class="title">{{=it.title}}</div>' +
         '<div class="content">{{=it.text}}</div>' +
         '<div class="LShadow"></div>' +
         '<div class="RShadow"></div>' +
         '<div class="close icon-32 icon-Close icon-disabled action-hover"></div>' +
         '</div>' +
         '{{? it.controlName }}' +
         '</div>' +
         '{{?}}'),

      /**
       * Подготавливает конфиг подсказки для ее рисования.
       * @param config
       * @param count - порядковый номер подсказки в контроле. Необходим для правильной перерисовки
       *                позиции подсказки, прикрепленной к контролу, при изменении размеров окна
       * @returns {*}
       * @private
       */
      _prepareConfigToDraw: function(config, count) {
         var newConf = $ws.core.clone(config);
         newConf.count = count;
         newConf.arrowClass = (config.arrowClass) ? config.arrowClass : 'top-left';
         newConf.myClass = (config.myClass) ? config.myClass : '';
         newConf.title = (config.title) ? config.title : '';
         newConf.text = (config.text) ? config.text : '';
         if (newConf.controlName) {
            var styles = {};
            if (!newConf.selector) {
               newConf.selector = 'body';
            }
            if ($(newConf.selector).length > 0) {
               styles = this._getStyles($(newConf.selector));
            } else {
               newConf.hidden = true;
            }
            //FIXME: контрол не отображается в данный момент ? isElementVisible ?
            if (styles.display === 'none' || (styles.left === 0 && styles.top === 0 && newConf.selector !== 'body')) {
               newConf.hidden = true;
            } else {
               newConf.controlStyles = this._prepareStyles(styles, true);
            }
         }
         newConf.hintPosition = (newConf.hintPosition) ? this._prepareStyles(newConf.hintPosition) : '';
         return newConf;
      },

      /**
       * Добавляет контрол на вершину стека активных контролов
       * @param controlName
       */
      addControl: function (controlName) {
         var length = this._controlStack.length;
         if (this._controlStack[length - 1] !== controlName && controlName !== undefined) {
            this._controlStack.push(controlName);
         }
      },

      /**
       * Возващает последний контрол из стека контролов
       * @returns {*}
       */
      _getLastControl: function () {
         return this._controlStack[this._controlStack.length - 1];
      },

      /**
       * Очищает стек контролов
       * @private
       */
      _clearControlStack: function () {
         this._controlStack = [];
      },
      /**
       * Очищает стек контролов и проверяет нужно ли отображать вопрос
       */
      refreshState: function () {
         this._clearControlStack();
         this._checkVisible();
      },

      /**
       * Добавляет подсказку в хранилище подсказок
       * @param config
       */
      addHint: function (config) {
         if (config.controlName !== undefined) {
            var controlName = config.controlName;
            if (this._hintStore[controlName] === undefined) {
               this._hintStore[controlName] = [];
            }
            if (controlName === 'serviceHint') {
               this._hintStore[controlName] = [];
            }
            if (config.arrowClass == 'brickNote' || config.arrowClass == 'brickText') {
               config.selector = '#container';
            }
            this._hintStore[controlName].push(config);
         }
      },

      /**
       * Отрисовка подсказки по ее конфигу
       * @param config - конфиг подсказки
       * @private
       */
      _drawHint: function (config) {
         if (config.arrowClass == 'brickText') {
            this._$overlay.append(this._hintTemplateBrickText(config));
         }
         else {
            this._$overlay.append(this._hintTemplate(config));
         }
      }
   });

   // TODO: remove exporting to $ws.single (use only as requirejs module)
   // Для пакетизации при подключении этого модуля не пишем "is!browser?", а под Node не создаем синглтон.
   if ((this || (0, eval)('this')).document) {
      $ws.single.HintManager = new HintManager();
   } else {
      $ws.single.HintManager = {};
   }
   return $ws.single.HintManager;
});