define('js!SBIS3.CORE.ColorMarkPlugin', [ 'js!SBIS3.CORE.FloatArea', 'js!SBIS3.CORE.TableView' ], function(FloatArea, TableView){

   var BOLD = 0x8000000,
       ITALIC = 0x4000000,
       UNDERLINE = 0x2000000,
       STRIKE = 0x1000000,
       specs = {},
       definedColors = [ '#000000', '#EF463A', '#72BE44', '#0055BB', '#A426D9', '#999999' ],
       ColorizeWindow;

   ColorizeWindow = FloatArea.extend({
      $protected: {
         _spec: false,
         _history: [],
         _options: {
            offset: {
               x: 0,
               y: -4
            },
            browserName: '',
            side: 'right',
            animation: 'fade',
            autoHide: true,
            verticalAlign: 'top',
            direction: 'left',
            fitWindow: true,
            template: 'colorize',
            spec: '',
            fullShadow: true
         }
      },
      $constructor: function() {
         this._publish('onApply');
         this.subscribe('onBeforeShow', function() {
            var self = this;
            if(this._history.length === 0) {
               this._loadHistory().addCallback(function(){
                  self._drawHistory();
               });
            } else {
               this._drawHistory();
            }
         });
         this.subscribe('onReady', function () {
            var colorizeWnd = this,
               colors = this.getChildControlByName('Цвета'),
               styles = this.getChildControlByName('Стили'),
               btnApply = this.getChildControlByName('Пометить'),
               sampleAndHistory = this.getChildControlByName('ПримерИстория');

            colors.setContent(this._createColorsBlockHtml());
            colors.getContainer().find('.ws-colorize-colors').delegate('.ws-colorize-color', 'click', function () {
               var $this = $(this);

               // Снимаем пометку с ранее выбранного цвета
               $('.ws-colorize-active').removeClass('ws-colorize-active');

               // Ставим на текущий
               $this.addClass('ws-colorize-active');

               // Обновляем спецификацию раскраски
               colorizeWnd._spec.color = $this.data('color');

               colorizeWnd._updateSample();
            });

            sampleAndHistory.setContent(this._createSampleBlockHtml());
            sampleAndHistory.getContainer().find('.ws-colorize-history').delegate('.ws-colorize-history-item', 'click', function(){
               colorizeWnd._notify('onApply', specToNumber($(this).data('spec')));
               colorizeWnd.close();
            });

            styles.subscribe('onChange', function (event, record, flagName) {
               colorizeWnd._spec[flagName] = record.get(flagName);
               colorizeWnd._updateSample();
            });

            $ws.helpers.forEach(styles.getChildControls(true), function(checkbox){
               checkbox.getContainer().addClass('ws-colorize-altered-' + checkbox.getName());
            });

            btnApply.subscribe('onActivated', function(){
               var specAsNum = specToNumber(colorizeWnd._spec);
               colorizeWnd._notify('onApply', specAsNum);
               if(specAsNum !== 0 && Array.indexOf(colorizeWnd._history, specAsNum) == -1) {
                  if(colorizeWnd._history.length === 3) {
                     colorizeWnd._history.pop();
                  }
                  colorizeWnd._history.unshift(specAsNum);
                  colorizeWnd._saveHistory();
               }
               colorizeWnd.close();
            });

            if (this._spec === false) {
               this.setSpec(this._options.spec);
            }
         });
      },
      /**
       * Рисует историю выбора расцветок
       * @private
       */
      _drawHistory: function() {
         var self = this;
         this.getChildControlByName('ПримерИстория').editContent(function(ctr){
            var html = '', style = '';
            $ws.helpers.forEach(self._history, function(i, idx){
               var specClassName = hasSpec(i);
               if(!specClassName) {
                  specClassName = appendSpec(i, true);
                  style += specs[specClassName];
               }
               html += '<li data-spec="' + i + '" class="ws-colorize-history-item ' + specClassName + '">Тип ' + (idx + 1) + '</li>';
            });
            if(style) {
               $ws.helpers.insertCss(style);
            }
            ctr.find('.ws-colorize-history').html(html);
         });
      },
      /**
       * Загружает историю выбора расцветок из пользовательских параметров
       *
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _loadHistory: function() {
         var self = this;
         return $ws.single.UserConfig.getParam('colorize-history').addCallback(function(history){
            history = history || '';
            if(history.length) {
               self._history = history.split('|');
            } else {
               self._history = [];
            }
            return self._history;
         });
      },
      /**
       * Сохраняет историю выбора в пользовательских параметрах
       *
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _saveHistory: function() {
         return $ws.single.UserConfig.setParam('colorize-history', this._history.join('|'));
      },
      setSpec: function(spec){
         var style = this.getChildControlByName('Стили'),
             styleRec = style.getValue(),
             currentSpec;
         currentSpec = this._spec = specToObject(spec);
         this._updateSample();
         this.getChildControlByName('Цвета').getContainer()
            .find('.ws-colorize-active').removeClass('ws-colorize-active').end()
            .find('[data-color="' + currentSpec.color + '"]').addClass('ws-colorize-active');

         $ws.helpers.forEach(Object.keys(currentSpec), function(k){
            if(k.substr(0, 2) == 'is') {
               styleRec.set(k, currentSpec[k]);
            }
         });
         style.setValue(styleRec);
      },
      /**
       * Обновляет пример по текущей спецификации расцветки
       *
       * @private
       */
      _updateSample: function() {
         var sampleChunk = this.getChildControlByName('ПримерИстория'),
             self = this;
         sampleChunk.editContent(function(ctr){
            ctr.find('.ws-colorize-sample').removeClass().addClass('ws-colorize-sample ' + appendSpec(self._spec));
         });
      },
      /**
       * Создает HTML-разметку для списка возможных цветов
       *
       * @returns {string}
       * @private
       */
      _createColorsBlockHtml: function() {
         var colorsHtml = '<div class="ws-colorize-colors">';
         $ws.helpers.forEach(definedColors, function(c, idx){
            colorsHtml +=
               '<div class="ws-colorize-color' + (idx ? '' : ' ws-colorize-active') + '" data-color="' + c + '" style="border-color: ' + c + '; background: ' + c + '">' +
                  '<div class="ws-colorize-box" style="background: ' + c + '"></div>' +
                  '</div>';
         });
         colorsHtml += '</div>';
         return colorsHtml;
      },
      /**
       * Создает HTML-разметку для блока с примером и историей
       *
       * @returns {string}
       * @private
       */
      _createSampleBlockHtml: function() {
         return '<div class="ws-colorize-sample-and-history">' +
            '<p class="ws-colorize-sample">Образец</p>' +
            '<ul class="ws-colorize-history">' +
            '</ul>' +
            '</div>';
      }
   });

   /**
    * Добавляет слева нулей до 3 байт в хексе
    * @param {String} s
    * @returns {string}
    */
   function lPad3b(s) {
      var pad = '000000';
      return pad.substr(0, 6 - s.length) + s;
   }

   /**
    * Нормализует спецификацию расцветки. Если передано в виде строки - разбирает в число
    *
    * @param {String|Number|Object} spec
    * @returns {Number}
    */
   function specToNumber(spec) {
      if(!spec) {
         return 0;
      } else if(typeof spec == 'string') {
         spec = Number(spec);
         if(isNaN(spec)) {
            spec = 0;
         }
      } else if(typeof spec == 'object') {
         var rSpec = Number((spec.color || '0').replace('#', '0x'));
         rSpec |= spec.isBold ? BOLD : 0;
         rSpec |= spec.isItalic ? ITALIC : 0;
         rSpec |= spec.isUnderline ? UNDERLINE : 0;
         rSpec |= spec.isStrike ? STRIKE : 0;

         return rSpec;
      }
      return spec;
   }

   /**
    * Превращает спецификацию в объект
    * @param {String|Number|Object} spec
    * @returns {{color: string, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrike: boolean}}
    */
   function specToObject(spec) {
      spec = specToNumber(spec);
      return {
         color: '#' + lPad3b((spec & 0xFFFFFF).toString(16)).toUpperCase(),
         isBold: !!(spec & BOLD),
         isItalic: !!(spec & ITALIC),
         isUnderline: !!(spec & UNDERLINE),
         isStrike: !!(spec & STRIKE)
      };
   }

   /**
    * Превращает спецификацию расцветки в CSS-поравило
    *
    * @param spec
    * @returns {String}
    */
   function specToStyle(spec) {

      var oSpec = specToObject(spec),
          rules;

      rules = [
         'color: ' + oSpec.color + ' !important'
      ];
      if(oSpec.isBold) {
         rules.push('font-weight: bold !important');
      }
      if(oSpec.isItalic) {
         rules.push('font-style: italic !important');
      }
      if(oSpec.isUnderline || oSpec.isStrike) {
         rules.push('text-decoration: ' + [ oSpec.isUnderline ? 'underline' : '', oSpec.isStrike ? 'line-through' : '' ].join(' ') + ' !important');
      }

      return '.ws-colorize-' + spec + '{' + rules.join(';') + '}';

   }

   /**
    * Добавляет стиль по переданной спецификации в документ, возвращает имя класса
    *
    * @param {String|Number|Object} spec
    * @param {Boolean} [noinsert = false]
    * @returns {String} Имя класса для данной спецификации
    */
   function appendSpec(spec, noinsert) {
      spec = specToNumber(spec);
      if(!isNaN(spec)) {
         var specClassName = 'ws-colorize-' + spec;
         if(!specs[specClassName]) {
            specs[specClassName] = specToStyle(spec);
            if(noinsert !== true) {
               $ws.helpers.insertCss(specs[specClassName]);
            }
         }
         return specClassName;
      } else {
         return '';
      }
   }

   function hasSpec(spec) {
      spec = specToNumber(spec);
      if(!isNaN(spec)) {
         var specClassName = 'ws-colorize-' + spec;
         if(specs[specClassName]) {
            return specClassName;
         }
         else {
            return false;
         }
      } else {
         return false;
      }
   }

   /**
    * Плагин "Выделение цветом"
    *
    * @class $ws.proto.TableView.ColorMarkPlugin
    * @extends $ws.proto.TableView
    *
    * @cfgOld {Boolean} colorMark Включает функционал выделения цветом
    * @cfgOld {String} colorDataColumn Колонка записи, в которой содержится информация о стиле отметки. Тип колонки должен быть Строка или Число
    * @cfgOld {Array} colorMarkedColumns Массив имен колонок браузера (! не рекордсета, а именно браузера) для которых нужно применять расцветку
    *
    * @description
    * Позволяет выделять цветом строки браузера основываясь на значении в одной из колонок отображаемой записи.
    *
    * Формат хранения ифнормации о расцветке строки (для числа в шестнадцатеричной записи):
    * 0x[FF][CCCCCC]
    *
    * FF - хранит стиль текста в виде бинарных флагов
    * BOLD      = 0x8000000;
    * ITALIC    = 0x4000000;
    * UNDERLINE = 0x2000000;
    * STRIKE    = 0x1000000;
    *
    * Данные константы экспортированы на классе $ws.proto.TableView.ColorMarkPlugin
    * Например: $ws.proto.TableView.ColorMarkPlugin.BOLD
    *
    * СССССС - цвет
    *
    * Для получения удобного представления информации о расцветке можно использовать статический метод {@see $ws.proto.TableView.ColorMarkPlugin.specToObject}
    * Для превращения объекта обратно в числовую форму используется статический метод {@see $ws.proto.TableView.ColorMarkPlugin.specToNumber}
    */
   $ws.proto.TableView.ColorMarkPlugin = {};
   TableView.extendPlugin(/** @lends $ws.proto.TableView.ColorMarkPlugin.prototype */{
      $protected: {
         _colorizeWindow: '',
         _options: {
            colorMark: false,
            colorDataColumn: '',
            colorMarkedColumns: []
         }
      },
      $constructor: function() {
         this._initPlugin();
      },
      $condition: function(){
         return this._options.colorMark && this._options.colorDataColumn && this._options.colorMarkedColumns && this._options.colorMarkedColumns.length > 0;
      },
      _createColorizeWindow: function(domTarget, row, onColorize) {
         this._colorizeWindow = new ColorizeWindow({
            target: $(domTarget),
            opener: this,
            spec: row.data('current-colorize-spec'),
            handlers: {
               onApply: onColorize
            }
         });
      },
      /**
       * Метод инициализации плагина.
       * Вынесено в отдельный метод потому, что конструктор выполняется всегда, а методы - в зависимости от условия
       * описанного в $condition
       * @private
       */
      _initPlugin: function(){
         var self = this;
         this._wrapRowRender();
         this.addRowOption({
            title: 'Выделение цветом',
            icon: 'sprite:icon-16 icon-Colorize icon-primary',
            name: 'ws-colorize-plugin',
            before: $ws._const.Browser.rowOptionBeforeAll,
            isMainOption: true,
            callback: function(record, row, domTarget) {
               self._createColorizeWindow(domTarget, row, function(event, spec){
                  self._colorize(row, spec, appendSpec(spec));
                  record.set(self._options.colorDataColumn, spec);
                  record.update({ diffOnly: true });
               });
            }
         });
      },
      _isColumnCanMark: function(idx) {
         var columns = (this.getColumns() || []);
         return columns[idx] && Array.indexOf(this._options.colorMarkedColumns, columns[idx].title) != -1;
      },
      /**
       * Расцвечивает строку.
       * Убирает старую расцветку, ставит новую
       *
       * @param {jQuery} row строка таблицы
       * @param spec описание расцветки
       * @param {String} className имя класса который надо повесить на строку
       * @private
       */
      _colorize: function(row, spec, className) {
         var self = this,
             currentSpecClassName = row.data('current-colorize-class');
         row.data({
            'current-colorize-spec': spec,
            'current-colorize-class': className
         });
         row.find('td').each(function(){
            var cell = $(this), idx = cell.attr('coldefindex');
            if(self._isColumnCanMark(idx)) {
               if(currentSpecClassName) {
                  cell.removeClass(currentSpecClassName);
               }
               cell.addClass(className);
            }
         });
      },
      /**
       * Применяте на строку стиль по спецификации
       *
       * @param {$ws.proto.Record} record Запись, по которой нарисована строка
       * @param {jQuery} tr Строка
       * @private
       */
      _rowRenderColorize: function(record, tr) {
         if(record.hasColumn(this._options.colorDataColumn)) {
            var spec = specToNumber(record.get(this._options.colorDataColumn));
            this._colorize(tr, spec, appendSpec(spec));
         }
      },
      /**
       * Оборачивает имеющуюся функцию рендеринга строки для применения расцветки к каждой отрисованной строке
       *
       * @private
       */
      _wrapRowRender: function() {
         var self = this;
         if(!this._options.display.rowRender) {
            this._options.display.rowRender = this._rowRenderColorize.bind(this);
         } else {
            (function(original) {
               self._options.display.rowRender = function(record, tr) {
                  original.apply(self, arguments);
                  self._rowRenderColorize(record, tr);
               };
            })(this._options.display.rowRender);
         }
      },
      setRowRender: function() {
         this._wrapRowRender();
      },
      destroy: function() {
         if(this._colorizeWindow) {
            this._colorizeWindow.destroy();
         }
      }
   });

   $ws.proto.TableView.ColorMarkPlugin.BOLD = BOLD;
   $ws.proto.TableView.ColorMarkPlugin.ITALIC = ITALIC;
   $ws.proto.TableView.ColorMarkPlugin.UNDERLINE = UNDERLINE;
   $ws.proto.TableView.ColorMarkPlugin.STRIKE = STRIKE;

   /**
    * Превращает спецификацию расцветки в объект
    * @param {String|Number|Object} spec
    * @returns {{color: string, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrike: boolean}}
    * @static
    */
   $ws.proto.TableView.ColorMarkPlugin.specToObject = specToObject;

   /**
    * Нормализует спецификацию расцветки. Если передано в виде строки - разбирает в число
    *
    * @param {String|Number|Object} spec спецификация расцветки
    * @returns {Number}
    * @static
    */
   $ws.proto.TableView.ColorMarkPlugin.specToNumber = specToNumber;

   return $ws.proto.TableView.ColorMarkPlugin;

});