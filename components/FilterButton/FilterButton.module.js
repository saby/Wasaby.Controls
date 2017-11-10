define('js!SBIS3.CONTROLS.FilterButton',
    [
   "Core/moduleStubs",
   "Core/Context",
   "Core/CommandDispatcher",
   "Core/constants",
   "js!SBIS3.CORE.CompoundControl",
   "tmpl!SBIS3.CONTROLS.FilterButton",
   "tmpl!SBIS3.CONTROLS.FilterButton/FilterComponentTemplate",
   "tmpl!SBIS3.CONTROLS.FilterButton/FilterLineTemplate",
   "js!SBIS3.CONTROLS.FilterMixin",
   "js!SBIS3.CONTROLS.PickerMixin",
   "js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil",
   "js!SBIS3.CONTROLS.Utils.TemplateUtil",
   "Core/ParallelDeferred",
   "Core/IoC",
   "Core/helpers/Function/once",
   "Core/detection",
   "js!SBIS3.CONTROLS.IconButton",
   "js!SBIS3.CONTROLS.FilterButton.FilterLine",
   "i18n!SBIS3.CONTROLS.FilterButton",
   'css!SBIS3.CONTROLS.FilterButton'
],
    function(
        mStubs,
        cContext,
        CommandDispatcher,
        constants,
        CompoundControl,
        dotTplFn,
        dotTplForComp,
        filterLineTpl,
        FilterMixin,
        PickerMixin,
        FilterToStringUtil,
        TemplateUtil,
        ParallelDeferred,
        IoC,
        once,
        detection
    ) {

       'use strict';
       /**
        * Класс контрола "Кнопка фильтров".
        *
        * Подробнее конфигурирование контрола описано в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/">Панель фильтров</a>.
        * @class SBIS3.CONTROLS.FilterButton
        * @extends SBIS3.CORE.CompoundControl
        * @author Герасимов Александр Максимович
        *
        * @mixes SBIS3.CONTROLS.FilterMixin
        * @mixes SBIS3.CONTROLS.PickerMixin
        *
        * @demo SBIS3.DOCS.FilterButton
        *
        * @control
        * @public
        * @category Filtering
        */

       function isFieldResetValue(element, fieldName, filter) {
          var hasResetValue = 'resetValue' in element,
              hasValue = fieldName in filter;

          return hasResetValue && hasValue ? FilterToStringUtil.isEqualValues(filter[fieldName], element.resetValue) : !hasValue;
       }

       var TEMPLATES = {
          _area: '_areaTemplate',
          main: 'template',
          header: 'topTemplate',
          additional: 'additionalFilterParamsTemplate'
       };

       var FilterButton = CompoundControl.extend([FilterMixin, PickerMixin],/** @lends SBIS3.CONTROLS.FilterButton.prototype */{
          _dotTplFn: dotTplFn,
          $protected: {
             _options: {
                _filterLineTpl: filterLineTpl,
                _areaTemplate: 'js!SBIS3.CONTROLS.FilterButtonArea',
                /**
                 * @cfg {String} Устанавливает направление, в котором будет открываться всплывающая панель кнопки фильтров.
                 * @variant left Панель открывается влево.
                 * @variant right Панель открывается вправо.
                 */
                filterAlign: 'left',
                /**
                 * @сfg {String} Устанавливает шаблон всплывающей панели кнопки фильтров.
                 * @remark
                 * При каждом открытии/закрытии панели происходят события {@link SBIS3.CONTROLS.PopupMixin#onShow} и {@link SBIS3.CONTROLS.PopupMixin#onClose}.
                 * Подробнее о создании шаблона читайте в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbpanel/'>Панель фильтрации</a>.
                 * @example
                 * <pre>
                 *   <option name="template" value="SBIS3.EDO.CtxFilter"/>
                 * </pre>
                 * @see filterAlign
                 * @see additionalFilterParamsTemplate
                 */
                template: '',
                /**
                 * @сfg {String} Устанавливает шаблон заголовка всплывающей панели кнопки фильтров.
                 * @remark
                 * Подробнее о создании шаблона читайте в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbpanel/'>Панель фильтрации</a>.
                 * @example
                 * <pre>
                 *   <option name="topTemplate" value="SBIS3.EDO.CtxFilter"/>
                 * </pre>
                 */
                topTemplate: '',
                /**
                 * @сfg {String} Устанавливает шаблон для блока "Можно отобрать" на всплывающей панели.
                 * @remark
                 * Подробнее о создании шаблона читайте в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbpanel/'>Панель фильтрации</a>.
                 * @example
                 * <pre>
                 *   <option name="additionalFilterTemplate" value="SBIS3.EDO.additionalFilters"/>
                 * </pre>
                 * @see template
                 * @see filterAlign
                 */
                additionalFilterParamsTemplate: null,
                /**
                 * @cfg {String} Устанавливает текст, который будет отображаться рядом с иконкой фильтра.
                 * @translatable
                 */
                resetLinkText: '',
                /**
                 * @noshow
                 */
                historyController: undefined,
                 /**
                  * @cfg {String} Устанавливает компонент, который отображает строку применённых фильтров.
                  * @remark
                  * Подробнее читайте в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbstr/'>Строка примененных фильтров</a>.
                  * @see filterLineTemplate
                  */
                filterLineComponent: 'js!SBIS3.CONTROLS.FilterButton.FilterLine',
                 /**
                  * @cfg {*} Устанавливает шаблон, который отображает строку применённых фильтров.
                  * @remark
                  * Подробнее читайте в разделе <a href='https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbstr/'>Строка примененных фильтров</a>.
                  * @see filterLineComponent
                  */
                filterLineTemplate: undefined,
                /** @cfg {Object.<String, Boolean|Number|String|Function>} Опции для компонента, отображаемом внутри области
                 * <wiTag group="Управление">
                 * Передаем опции для комопнента, которой будем отображать внутри области.
                 * <b>Опция актуальна только если в качестве шаблона выступает компонент</b>
                 *
                 * Пример:
                 * <pre>
                 *    ...
                 *    template: 'js!SBIS3.User.Info'
                 *    componentOptions: {
             *       firstName: 'John',
             *       secondName: 'Snow',
             *       nationality: 'Westerosi'
             *    }
                 *    ...
                 * </pre>
                 */
                componentOptions: {},
                 /**
                  * @cfg {String}
                  */
                internalContextFilterName : 'sbis3-controls-filter-button',
                
                _fastFilterButton: false // FIXME временная опция, позже включить везде
             },

             _pickerContext: null,        /* Контекст пикера */
             _filterStructure: null,      /* Структура фильтра */
             _historyController: null,    /* Контроллер для работы с историей */
             _filterTemplates: {},      /* Компонент, который будет отображаться на панели фильтрации */
             _dTemplatesReady: null,
             _filterLineInitialized: false
          },

          $constructor: function() {
             var dispatcher = CommandDispatcher,
                 declareCmd = dispatcher.declareCommand.bind(dispatcher, this),
                 showPicker = this.showPicker.bind(this);

             declareCmd('apply-filter', this.applyFilter.bind(this));
             declareCmd('reset-filter-internal', this._resetFilter.bind(this, true));
             declareCmd('reset-filter', this._resetFilter.bind(this, false));
             declareCmd('show-filter', showPicker);
             declareCmd('change-field-internal', this._changeFieldInternal.bind(this));

             this._checkPickerContent = once.call(this._checkPickerContent);
          },

          showPicker: function() {
             var self = this;
   
             /* Не показываем кнопку фильтров, если она выключена */
             if(!this.isEnabled()) return;
   
             this._initTemplates().addCallback(function() {
                FilterButton.superclass.showPicker.call(self);
             });
          },
          
          _modifyOptions: function() {
              var opts = FilterButton.superclass._modifyOptions.apply(this, arguments);
              opts._filterLineInitialized = opts.resetLinkText || !opts._fastFilterButton;
              return opts;
          },

          _recalcInternalContext: function () {
             FilterButton.superclass._recalcInternalContext.call(this);
             if(!this._options._filterLineInitialized && this.getLinkedContext().getValue('filterChanged')) {
                this.getContainer().prepend(this._options._filterLineTpl(this._options));
                this.reviveComponents();
                this._options._filterLineInitialized = true;
             }
          },

          _initTemplates: function() {
             if(this._dTemplatesReady) {
                return this._dTemplatesReady.getResult();
             }

             var self = this;

             function processTemplate(template, name) {
                /* Если шаблон указали как имя компонента (строки которые начинаются с js! или SBIS3.),
                   то перед отображением панели фильтров сначала загрузим компонент. */
                if(template && typeof template === 'string' && /^js!*|^SBIS3.*/.test(template)) {
                   self._dTemplatesReady.push(mStubs.require(((template.indexOf('js!') !== 0 ? 'js!' : '') + template)).addCallback(function(comp) {
                      /* Запишем, что в качестве шаблона задали компонент */
                      self._filterTemplates[name] = true;
                      return comp;
                   }));
                }
             }

             this._dTemplatesReady = new ParallelDeferred();

             for (var key in TEMPLATES) {
                if (TEMPLATES.hasOwnProperty(key)) {
                   processTemplate(self.getProperty(TEMPLATES[key]), TEMPLATES[key]);
                }
             }

             return this._dTemplatesReady.done().getResult();
          },

          applyFilter: function() {
             if(this._picker && !this._picker.validate()) {
                return false;
             }
             FilterButton.superclass.applyFilter.call(this);
             this._picker && this.hidePicker();
          },

          _changeFieldInternal: function(field, val) {
             var pickerContext = this._getCurrentContext();

             if(pickerContext) {
                pickerContext.setValueSelf(field, val);
             }
          },

          _checkPickerContent: function() {
             var controls = this._picker.getChildControls(false, true);

             for(var i = 0; i < controls.length; i++) {
                if(/SBIS3.CORE.*/.test(controls[i]._moduleName)) {
                   IoC.resolve('ILogger').info(
                       'Компонент SBIS3.CONTOLS.FilterButton не поддерживает работу с компонентами из пространства имён SBIS3.CORE.' +
                       'Просьба не использовать компонент ' + controls[i]._moduleName + ' с именем ' + controls[i].getName() + ' на панели фильтрации.'
                   )
                }
             }
          },

          _setPickerContent: function() {
             this._picker.getContainer().addClass('controls__filterButton-' + this._options.filterAlign);
             this._checkPickerContent();
             if(this._historyController) {
                this._picker.getChildControlByName('filterHistory').setHistoryController(this._historyController);
             }
          },

          _getAreaOptions: function() {
             var prepTpl = TemplateUtil.prepareTemplate,
                 components = this._filterTemplates,
                 config = {
                    historyController: this._historyController,
                    internalContextFilterName: this._options.internalContextFilterName,
                    componentOptions: this._options.componentOptions
                 },
                 self = this,
                 templateProperty;

             /* Если шаблон указали как имя компонента (SBIS3.* || js!SBIS3.*) */
             function getCompTpl(tpl) {
                return prepTpl(dotTplForComp({component: tpl, componentOptions: self.getProperty('componentOptions')}));
             }

             /* Если в качестве шаблона передали вёрстку */
             function getTpl(tpl) {
                return prepTpl(tpl);
             }

             for (var key in TEMPLATES) {
                if (TEMPLATES.hasOwnProperty(key)) {
                   templateProperty = self.getProperty(TEMPLATES[key]);
                   config[TEMPLATES[key]] = components[TEMPLATES[key]] ? getCompTpl(templateProperty) : getTpl(templateProperty);
                }
             }

             return config;
          },
   
          _onResizeHandler: function() {
             var picker = this._picker;
             
             FilterButton.superclass._onResizeHandler.apply(this, arguments);
      
             if (picker) {
                picker._onResizeHandler();
             }
          },
   
          _setPickerConfig: function () {
             var context = cContext.createContext(this, {restriction: 'set'}),
                 rootName = this._options.internalContextFilterName,
                 isRightAlign = this._options.filterAlign === 'right',
                 self = this,
                 byFilter, byCaption, byVisibility;

             function updatePickerContext() {
                context.setValue(rootName, {
                   filterChanged: self.getLinkedContext().getValue('filterChanged'),
                   filter: self._getFilter(true),
                   caption: self._mapFilterStructureByProp('caption'),
                   visibility: self._mapFilterStructureByVisibilityField('visibilityValue')
                });
             }

             function updatePickerVisibility() {
                var visibility = context.getValue(rootName + '/visibility');

                if(!Object.isEmpty(visibility)) {
                   var showAdditionalBlock = Object.keys(visibility).reduce(function(result, element) {
                      return result || visibility[element] === false;
                   }, false);

                   context.setValue('additionalFilterVisible', showAdditionalBlock);
                }
             }

             this._pickerContext = context;
             updatePickerContext();
             updatePickerVisibility();

             context.subscribe('onFieldNameResolution', function(event, fieldName) {
                byFilter = self._findFilterStructureElement(function(element) {
                   return element.internalValueField === fieldName;
                });
                byCaption = !byFilter && self._findFilterStructureElement(function(element) {
                   return element.internalCaptionField === fieldName;
                });
                byVisibility = !byFilter && !byCaption && self._findFilterStructureElement(function(element) {
                   return element.internalVisibilityField === fieldName;
                });

                if (byFilter) {
                   event.setResult(rootName + '/filter/' + byFilter.internalValueField);
                }

                if (byCaption) {
                   event.setResult(rootName + '/caption/' + byCaption.internalValueField);
                }

                if(byVisibility) {
                   event.setResult(rootName + '/visibility/' + byVisibility.internalVisibilityField);
                }
             });

             context.subscribe('onFieldChange', function(ev, fieldChanged, value) {
                /* Скрытие/отображние блока дополнительных параметров по состоянию видимости, которое пишется в контекст */
                updatePickerVisibility();
             });

             context.subscribe('onFieldsChanged', function() {
                var changed = self._filterStructure.reduce(function(result, element) {
                       return result || !isFieldResetValue(element, element.internalValueField, context.getValue(rootName + '/filter'));
                    }, false);
                self._changeFieldInternal(rootName + '/filterChanged', changed);
             });

             return {
                corner: isRightAlign ? 'tl' : 'tr',
                opener: this,
                parent: this,
                horizontalAlign: {
                   side: isRightAlign ? 'left' : 'right'
                },
                verticalAlign: {
                   side: 'top'
                },
                closeButton: true,
                closeByExternalClick: true,
                closeOnTargetMove: !detection.isMobilePlatform,
                context: context,
                cssClassName: 'controls__filterButton__picker',
                template: 'js!SBIS3.CONTROLS.FilterButtonArea',
                componentOptions: this._getAreaOptions(),
                _canScroll: true,
                activateAfterShow: true,
                handlers: {
                   onClose: function() {
                      /* Разрушаем панель при закрытии,
                         надо для: сбрасывания валидации, удаления ненужных значений из контролов */
                      if(self._picker) {
                         self._picker.destroy();
                         self._picker = null;
                      }
                   },

                   onKeyPressed: function(event, e) {
                      if(e.which === constants.key.esc) {
                         this.hide();
                      }
                   },
                   
                   onResize: function() {
                      /*  В текущем состоянии пикер не пересчитывает свои размеры при изменении внутреннего контента.
                          Для этого есть причины:
                          1) Пикер не знает, что именно в нём изменился контент.
                          2) Если принудительно считать, то все пикеры начнут часто прыгать.
                          Вызвать пересчёт - ответственность того, кто вызвал это изменение.
                          Но в кнопке фильтров контент постоянно меняется динамически (фильтры показываются / скрываются / раскрывается история),
                          и эти изменения вызываются стандартыми средствани (show/hide контролов), которые так же не сообщают,
                          где произошли изменения, а просто вызывают onResize. Для этого пишу обработчик, который замеряет высоту пикера,
                          и при её изменении вызывает необходимые расчеты.
                       */
                      this.recalcPosition(true);
                   }
                }
             };
          },

          _getCurrentContext : function(){
             return this._pickerContext;
          },

          _syncContext: function(fromContext) {
             var context = this._getCurrentContext(),
                 pickerVisible = this._picker && this._picker.isVisible(),
                 internalName = this._options.internalContextFilterName,
                 filterPath = internalName + '/filter',
                 descriptionPath = internalName + '/visibility',
                 toSet;

             if(!this._picker){
                return false;
             }

             if (fromContext) {
                this._updateFilterStructure(
                    undefined,
                    context.getValue(internalName + '/filter'),
                    context.getValue(internalName + '/caption'),
                    context.getValue(internalName + '/visibility')
                );
             } else if (pickerVisible) {
                toSet = {};
                toSet[filterPath] = this._getFilter(true);
                toSet[descriptionPath] = this._mapFilterStructureByProp('caption');
                this._changeFieldInternal(toSet);
             }
          },

          /**
           * Устанавливает текст по-умолчанию (если фильтр не изменён) для строки у кнопки фильтров.
           * @param {String} text
           */
          setResetLinkText: function(text) {
             if (this._options.resetLinkText !== text) {
                this._options.resetLinkText = text;
                this._recalcInternalContext();
                this._notifyOnPropertyChanged('resetLinkText');
             }
          },

          /**
           * Возваращет текст по-умолчанию (если фильтр не изменён) для строки у кнопки фильтров.
           * @returns {String}
           */
          getResetLintText: function() {
             return this._options.resetLinkText;
          },

          /**
           * Устанавливает контроллер для работы с историей
           * @param {SBIS3.CONTROLS.FilterHistoryController} controller
           * @noshow
           */
          setHistoryController: function(controller) {
             this._historyController = controller;
          },

          destroy: function() {
             if(this._historyController) {
                this._historyController.destroy();
                this._historyController = null;
             }

             if(this._dTemplatesReady) {
                this._dTemplatesReady.getResult().cancel();
                this._dTemplatesReady = null;
             }
             
             this._filterTemplates = null;
             this._pickerContext = null;
             
             FilterButton.superclass.destroy.apply(this, arguments);
          }

       });

       return FilterButton;
    });
