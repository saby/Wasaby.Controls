import CommandDispatcher = require('Core/CommandDispatcher');
import CompoundControl = require('Lib/Control/CompoundControl/CompoundControl');
import Utils = require('View/Executor/Utils');
import dotTplForComp = require('tmpl!SBIS3.CONTROLS/Filter/Button/FilterComponentTemplate');
import FilterMixin = require('SBIS3.CONTROLS/Mixins/FilterMixin');
import PickerMixin = require('SBIS3.CONTROLS/Mixins/PickerMixin');
import TemplateUtil = require('SBIS3.CONTROLS/Utils/TemplateUtil');
import FilterPanelUtils = require('SBIS3.CONTROLS/Utils/FilterPanelUtils');
import converterFilterStructure = require('Controls/_filterPopup/converterFilterStructure');
import 'SBIS3.CONTROLS/Button/IconButton';
import 'i18n!SBIS3.CONTROLS/Filter/Button';
import 'css!SBIS3.CONTROLS/Filter/Button/FilterButton';



      /**
       * Класс контрола "Кнопка фильтров".
       *
       * Подробнее конфигурирование контрола описано в разделе <a href="/doc/platform/developmentapl/interface-development/ws3/components/list/list-settings/filtering/list-filterbutton/">Панель фильтров</a>.
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
       * @author Герасимов А.М.
       * @category Filtering
       */

      var TEMPLATES = {
         _area: '_areaTemplate',
         main: 'template',
         header: 'topTemplate',
         additional: 'additionalFilterParamsTemplate'
      };

      var OldPanelOpener = CompoundControl.extend([FilterMixin, PickerMixin], /** @lends SBIS3.CONTROLS/Filter/Button.prototype */{
         $protected: {
            _options: {
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
                * Подробнее о создании шаблона читайте в разделе <a href='/doc/platform/developmentapl/interface-development/ws3/components/list/list-settings/filtering/list-filterbutton/fbpanel/'>Панель фильтрации</a>.
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
                * Подробнее о создании шаблона читайте в разделе <a href='/doc/platform/developmentapl/interface-development/ws3/components/list/list-settings/filtering/list-filterbutton/fbpanel/'>Панель фильтрации</a>.
                * @example
                * <pre>
                *   <option name="topTemplate" value="SBIS3.EDO.CtxFilter"/>
                * </pre>
                */
               topTemplate: '',

               /**
                * @сfg {String} Устанавливает шаблон для блока "Можно отобрать" на всплывающей панели.
                * @remark
                * Подробнее о создании шаблона читайте в разделе <a href='/doc/platform/developmentapl/interface-development/ws3/components/list/list-settings/filtering/list-filterbutton/fbpanel/'>Панель фильтрации</a>.
                * @example
                * <pre>
                *   <option name="additionalFilterTemplate" value="SBIS3.EDO.additionalFilters"/>
                * </pre>
                * @see template
                * @see filterAlign
                */
               additionalFilterParamsTemplate: null,

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

               /** @cfg {Object.<String, Boolean|Number|String|Function>} Опции для компонента, отображаемом внутри области
                * <wiTag group="Управление">
                * Передаем опции для комопнента, которой будем отображать внутри области.
                * <b>Опция актуальна только если в качестве шаблона выступает компонент</b>
                *
                * Пример:
                * <pre>
                *    ...
                *    template: 'js!SBIS3.User.Info'
                *    templateOptions: {
                *       firstName: 'John',
                *       secondName: 'Snow',
                *       nationality: 'Westerosi'
                *    }
                *    ...
                * </pre>
                */
               templateOptions: {},

               /**
                * @cfg {String}
                */
               internalContextFilterName: 'sbis3-controls-filter-button'
            },

            _pickerContext: null,        /* Контекст пикера */
            _filterStructure: null,      /* Структура фильтра */
            _filterTemplates: {},      /* Компонент, который будет отображаться на панели фильтрации */
            _dTemplatesReady: null
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
            declareCmd('close', this.hidePicker.bind(this));
         },

         _modifyOptions: function() {
            var opts = OldPanelOpener.superclass._modifyOptions.apply(this, arguments);
            opts.filterStructure = opts.items ? converterFilterStructure.convertToFilterStructure(opts.items) : opts.filterStructure;
            return opts;
         },

         showPicker: function() {
            var self = this;

            /* Не показываем кнопку фильтров, если она выключена */
            if (this._options.readOnly) {
               return;
            }

            if (!this._dTemplatesReady) {
               this._dTemplatesReady = FilterPanelUtils.initTemplates(self, TEMPLATES, function(name) {
                  self._filterTemplates[name] = true;
               });
            }

            this._dTemplatesReady.done().getResult().addCallback(function() {
               OldPanelOpener.superclass.showPicker.call(self);
            });
         },

         applyFilter: function() {
            if (this._picker && !this._picker.validate()) {
               return false;
            }
            OldPanelOpener.superclass.applyFilter.call(this);
            this._picker && this.hidePicker();
         },

         _changeFieldInternal: function(field, val) {
            var pickerContext = this._getCurrentContext();

            if (pickerContext) {
               pickerContext.setValueSelf(field, val);
            }
         },

         _getAreaOptions: function() {
            var prepTpl = TemplateUtil.prepareTemplate,
               components = this._filterTemplates,
               config = {
                  historyController: this._historyController,
                  viewMode: this._options.viewMode,
                  areaCaption: this._options.areaCaption,
                  internalContextFilterName: this._options.internalContextFilterName,
                  templateOptions: this._options.templateOptions,
                  componentOptions: this._options.componentOptions
               },
               self = this,
               templateProperty;

            /* Если шаблон указали как имя компонента (SBIS3.* || js!SBIS3.*) */
            function getCompTpl(tpl) {
               return prepTpl(dotTplForComp({component: (Utils.RequireHelper.defined(tpl) ? tpl : 'js!' + tpl), componentOptions: self.getProperty('componentOptions')}));
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

         _setPickerConfig: function() {
            var isRightAlign = this._options.filterAlign === 'right',
               self = this;

            this._pickerContext = FilterPanelUtils.createFilterContext(this.getLinkedContext(),
               this._options.internalContextFilterName,
               this._filterStructure,
               self);

            return FilterPanelUtils.getPanelConfig({
               className: 'controls-FilterButton__popup-index',
               corner: isRightAlign ? 'tl' : 'tr',
               opener: this,
               parent: this,
               direction: {
                  horizontal: isRightAlign ? 'left' : 'right'
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
                     }
                  },
                  onCommandCatch: function(event, commandName) {
                     if (commandName === 'resizeYourself' && self._picker) {
                        //PopupMixin при пересчете размеров убирает style.height, чтобы получить размеры контента
                        //В этом случае скролл пропадает (т.к. высота по контенту). Восстанавливаем скролл после перепозиционирования
                        var scroll = self._picker.getChildControlByName('FilterButtonScroll');
                        var scrollTop = scroll._getScrollTop();
                        self._picker.recalcPosition(true);
                        scroll._scrollTo(scrollTop);
                     }
                  }
               }
            });
         },

         _getCurrentContext: function() {
            return this._pickerContext;
         },

         _syncContext: function(fromContext) {
            var context = this._getCurrentContext(),
               pickerVisible = this._picker && this._picker.isVisible(),
               internalName = this._options.internalContextFilterName,
               filterPath = internalName + '/filter',
               descriptionPath = internalName + '/visibility',
               toSet;

            if (!this._picker) {
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


         /* Заглушка для resetLinkText */
         getResetLinkText: function() {},

         destroy: function() {
            if (this._dTemplatesReady) {
               this._dTemplatesReady.getResult().cancel();
               this._dTemplatesReady = null;
            }

            this._filterTemplates = null;
            this._pickerContext = null;

            OldPanelOpener.superclass.destroy.apply(this, arguments);
         }

      });

      export = OldPanelOpener;

