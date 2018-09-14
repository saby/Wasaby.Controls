define('SBIS3.CONTROLS/Filter/Button',
    [
   "Core/CommandDispatcher",
   "Lib/Control/CompoundControl/CompoundControl",
   "tmpl!SBIS3.CONTROLS/Filter/Button/FilterButton",
   "tmpl!SBIS3.CONTROLS/Filter/Button/FilterComponentTemplate",
   "tmpl!SBIS3.CONTROLS/Filter/Button/FilterLineTemplate",
   "SBIS3.CONTROLS/Mixins/FilterMixin",
   "SBIS3.CONTROLS/Mixins/PickerMixin",
   "SBIS3.CONTROLS/Filter/Button/Utils/FilterToStringUtil",
   "SBIS3.CONTROLS/Utils/TemplateUtil",
   "Core/IoC",
   "Core/helpers/Function/once",
   'View/Runner/requireHelper',
   "SBIS3.CONTROLS/Utils/FilterPanelUtils",
   "Core/core-clone",
   "SBIS3.CONTROLS/Button/IconButton",
   "SBIS3.CONTROLS/Filter/Button/Line",
   "i18n!SBIS3.CONTROLS/Filter/Button",
   'css!SBIS3.CONTROLS/Filter/Button/FilterButton'
],
    function(
        CommandDispatcher,
        CompoundControl,
        dotTplFn,
        dotTplForComp,
        filterLineTpl,
        FilterMixin,
        PickerMixin,
        FilterToStringUtil,
        TemplateUtil,
        IoC,
        once,
        requireHelper,
        FilterPanelUtils,
        clone
    ) {

       'use strict';
       /**
        * Класс контрола "Кнопка фильтров".
        *
        * Подробнее конфигурирование контрола описано в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/">Панель фильтров</a>.
        * @class SBIS3.CONTROLS/Filter/Button
        * @extends Lib/Control/CompoundControl/CompoundControl
        * @author Герасимов А.М.
        *
        * @mixes SBIS3.CONTROLS/Mixins/FilterMixin
        * @mixes SBIS3.CONTROLS/Mixins/PickerMixin
        *
        * @demo Examples/FilterButton/FilterButton/FilterButton
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

       var FilterButton = CompoundControl.extend([FilterMixin, PickerMixin],/** @lends SBIS3.CONTROLS/Filter/Button.prototype */{
          _dotTplFn: dotTplFn,
          $protected: {
             _options: {
                _filterLineTpl: filterLineTpl,
                _areaTemplate: 'SBIS3.CONTROLS/Filter/Button/Area',
                /**
                 * @cfg {String} Устанавливает направление, в котором будет открываться всплывающая панель кнопки фильтров.
                 * @variant left Панель открывается влево.
                 * @variant right Панель открывается вправо.
                 */
                filterAlign: 'left',
                /**
                 * @сfg {String} Устанавливает шаблон всплывающей панели кнопки фильтров.
                 * @remark
                 * При каждом открытии/закрытии панели происходят события {@link SBIS3.CONTROLS/Mixins/PopupMixin#onShow} и {@link SBIS3.CONTROLS/Mixins/PopupMixin#onClose}.
                 * Подробнее о создании шаблона читайте в разделе <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbpanel/'>Панель фильтрации</a>.
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
                 * Подробнее о создании шаблона читайте в разделе <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbpanel/'>Панель фильтрации</a>.
                 * @example
                 * <pre>
                 *   <option name="topTemplate" value="SBIS3.EDO.CtxFilter"/>
                 * </pre>
                 */
                topTemplate: '',
                /**
                 * @сfg {String} Устанавливает шаблон для блока "Можно отобрать" на всплывающей панели.
                 * @remark
                 * Подробнее о создании шаблона читайте в разделе <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbpanel/'>Панель фильтрации</a>.
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
                 * @cfg {String} Устанавливает отображение кнопки фильтров.
                 * @variant oneColumn Панель строится в одну колонку.
                 * @variant twoColumns Панель строится в две колонки.
                 */
                viewMode: 'oneColumn',
                /**
                 * @cfg {String} Заголовок панели фильтров.
                 */
                areaCaption: '',
                /**
                 * @noshow
                 */
                historyController: undefined,
                 /**
                  * @cfg {String} Устанавливает компонент, который отображает строку применённых фильтров.
                  * @remark
                  * Подробнее читайте в разделе <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbstr/'>Строка примененных фильтров</a>.
                  * @see filterLineTemplate
                  */
                filterLineComponent: 'SBIS3.CONTROLS/Filter/Button/Line',
                 /**
                  * @cfg {*} Устанавливает шаблон, который отображает строку применённых фильтров.
                  * @remark
                  * Подробнее читайте в разделе <a href='/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-filterbutton/fbstr/'>Строка примененных фильтров</a>.
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
                 *    template: 'Examples/MyArea/Info'
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

             if (!this._dTemplatesReady) {
                this._dTemplatesReady = FilterPanelUtils.initTemplates(self, TEMPLATES, function(name) {
                   self._filterTemplates[name] = true;
                });
                if (this._historyController) {
                   this._dTemplatesReady.push(this._historyController.getHistory(true));
                }
             }

             this._dTemplatesReady.done().getResult().addCallback(function(res) {
                FilterButton.superclass.showPicker.call(self);
                return res;
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
                this.getContainer().removeClass('controls__filterButton_withoutLine');
                this.reviveComponents();
                this._options._filterLineInitialized = true;
             }
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

          _hasHistory: function() {
             var
                history,
                result = false;
             if (this._historyController) {
                history = this._historyController.getHistory();
                result = history && !!history.length;
             }

             return result;
          },

          _getAreaOptions: function() {
             var config = {
                    historyController: this._historyController,
                    viewMode: this._options.viewMode,
                    areaCaption: this._options.areaCaption,
                    hasHistory: this._hasHistory(),
                    historyId: this._options.historyId,
                    internalContextFilterName: this._options.internalContextFilterName,
                    componentOptions: this._options.componentOptions,
                    filterStructure: this.getFilterStructure()
                 },
                 self = this,
                 templateProperty;

             for (var key in TEMPLATES) {
                if (TEMPLATES.hasOwnProperty(key)) {
                   templateProperty = self.getProperty(TEMPLATES[key]);
                   config[TEMPLATES[key]] = templateProperty;
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
             var isRightAlign = this._options.filterAlign === 'right',
               self = this;

             this._pickerContext = FilterPanelUtils.createFilterContext(this.getLinkedContext(),
                this._options.internalContextFilterName,
                this._filterStructure,
                self);

             return FilterPanelUtils.getPanelConfig({
                corner: isRightAlign ? 'tl' : 'tr',
                opener: this,
                parent: this,
                target: this.getContainer().find('.controls__filterButton-button'),
                horizontalAlign: {
                   side: isRightAlign ? 'left' : 'right'
                },
                context: this._pickerContext,
                template: 'SBIS3.CONTROLS/Filter/Button/Area',
                componentOptions: this._getAreaOptions(),
                handlers: {
                   onClose: function() {
                      /* Разрушаем панель при закрытии,
                       надо для: сбрасывания валидации, удаления ненужных значений из контролов */
                      if (self._picker) {
                         self._notify('onPickerClose');
                         self._picker.destroy();
                         self._picker = null;
                         self._pickerContext = null;
                      }
                   }
                }
             });
          },

          _getCurrentContext : function(){
             return this._pickerContext;
          },

          _syncContext: function(fromContext) {
             var context = this._getCurrentContext(),
                 pickerVisible = this._picker && this._picker.isVisible(),
                 internalName = this._options.internalContextFilterName,
                 filterPath = internalName + '/filter',
                 descriptionPath = internalName + '/caption',
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
           * @param {SBIS3.CONTROLS/Filter/HistoryController} controller
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
