/**
 * Модуль "Плагин "Свернутая навигация"".
 *
 * @description
 */
define('js!SBIS3.CORE.CollapsingNavigation',
      ['html!SBIS3.CORE.CollapsingNavigation', 'css!SBIS3.CORE.CollapsingNavigation'],
      function (dotTplFn) {

         'use strict';

         return {
            $protected: {
               _options: {
                  /**
                   * @cfg {Boolean} Сворачивать
                   * <wiTag group="Управление">
                   * Этот параметр дает возможность отображать элемент навигации в свернутом состоянии
                   */
                  isCollapsing: false,
                  /**
                   * @cfg {Function} Функция отрисовки элементов свернутого состояния
                   * <wiTag group="Отображение">
                   * В качестве аргументов функция получает id, отображаемый заголовок и индекс вкладки
                   * Возвращает функция должна следующий объект:
                   * <pre>
                   *    {
                   *       imgClass: 'class-with-background-image-style', // css- класс, в котором должен быть указан единственный стиль - background-image, причем
                   *                                                      // в качестве изображения нужно использовать спрайт 32х86, где должны быть 3 изображения 32х32: сверху-вниз
                   *                                                      // нормальное состояние, при наведении, выбранное состояние (обязательный параметр)
                   *       elementClass: 'my-css-class', // css-класс для приминения каких-либо кастомных стилей к элементу свернутого состояния (не обязательный параметр)
                   *       title: 'my title' // возможность передать произвольный заголовок для элемента (не обязательный параметр)
                   *    }
                   * </pre>
                   */
                  collapsedRender: undefined,
                  showContent: false
               },
               _$collapsedBody: undefined,
               _$expandedBody: undefined,
               _collapsedElements: {},
               _wasClick: false
            },
            $condition: function () {
               return this._options.isCollapsing;
            },
            $constructor: function () {
               if (this._options.isCollapsing) {
                  var self = this;
                  this._publish('onToggleCollapse');
                  this.subscribe('onToggleCollapse', function (e, collapsed) {
                     if (collapsed) {
                        self._selectElement(self._getElementById(self._getActiveLabelId()));
                        self._wasClick = false;
                     }
                     self._$collapsedBody.toggleClass('ws-hidden', !collapsed);
                     self._$expandedBody.toggleClass('ws-hidden', collapsed);
                     $('body').toggleClass('ws-CollapsingNavigation__page-collapsed', collapsed);
                     self._toggleMarker(collapsed);
                  });
                  (this._dReady || new $ws.proto.Deferred().callback()).addCallback(function(){
                     self._initCollapsingNavigation();
                  });
               }
            },
            toggleCollapse: function (toggle) {
               this._container.toggleClass('ws-CollapsingNavigation__container-collapsed', arguments.length ? toggle : undefined);
               this._notify('onToggleCollapse', this._container.hasClass('ws-CollapsingNavigation__container-collapsed'));
            },
            _initCollapsingNavigation: function (data) {
               var self = this;
               this._buildCollapsedBody(data);
               this._container.find('.ws-accordion-wr').wrapAll('<div class="ws-CollapsingNavigation__expanded"></div>');
               this._$collapsedBody = this._container.find('.ws-CollapsingNavigation__collapsed');
               this._$expandedBody = this._container.find('.ws-CollapsingNavigation__expanded');
               this._bindEventListener();
               // работа с шаблоном
               $('.ws-CollapsingNavigation__page__collapseButton')
                     .click(function () {
                        self.toggleCollapse();
                     })
                     .css('display', 'block');
            },
            _buildCollapsedBody: function (data) {
               var self = this;
               this._container.append(dotTplFn({
                  data: data,
                  ctx: self,
                  render: self._options.collapsedRender,
                  opt: self._options
               }));
               $ws.helpers.forEach(data, function(element){
                  var
                        $body = self._container.find('#ws-CollapsingNavigation-' + element.id),
                        elem = {
                           body: $body
                        };
                  if(self._options.showContent) {
                     elem.content = $body.find('.ws-CollapsingNavigation__element__content');
                  }
                  self._collapsedElements[element.id] = elem;
               });
            },
            _bindEventListener: function () {
               var self = this;
               this._$collapsedBody
                     .find('.ws-CollapsingNavigation__element')
                     .click(function () {
                        var id = this.id.replace('ws-CollapsingNavigation-', '');
                        self._selectElement($(this));
                        self._labelClickHandler(id);
                        if(!self._wasClick) {
                           self._wasClick = true;
                        }
                     });
            },
            _toggleMarker: function (collapsed) {
               if ($ws.single.Marker.getTarget().parents('.ws-accordion').length) {
                  if (collapsed) {
                     $ws.single.Marker.hide();
                  }
                  else {
                     if (this._wasClick) {
                        this._positioningMarker();
                     }
                     else {
                        $ws.single.Marker.show();
                     }
                  }
               }
            },
            _selectElement: function (element) {
               this._container
                     .find('.ws-CollapsingNavigation__element-selected')
                     .removeClass('ws-CollapsingNavigation__element-selected');
               element.addClass('ws-CollapsingNavigation__element-selected');
            },
            _getElementById: function (id) {
               return this._collapsedElements[id].body;
            }
         };
      });