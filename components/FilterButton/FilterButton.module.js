define('js!SBIS3.CONTROLS.FilterButton',
    [
       'js!SBIS3.CORE.CompoundControl',
       'html!SBIS3.CONTROLS.FilterButton',
       'html!SBIS3.CONTROLS.FilterButton/FilterAreaTemplate',
       'js!SBIS3.CONTROLS.FilterMixin',
       'js!SBIS3.CONTROLS.PickerMixin',
       'js!SBIS3.CONTROLS.ControlHierarchyManager',
       'js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil',
       'js!SBIS3.CONTROLS.Utils.TemplateUtil',
       'js!SBIS3.CONTROLS.Link',
       'js!SBIS3.CONTROLS.Button',
       'js!SBIS3.CONTROLS.FilterButton.FilterLine',
       'js!SBIS3.CONTROLS.FilterHistory',
       'js!SBIS3.CONTROLS.AdditionalFilterParams',
       'i18n!SBIS3.CONTROLS.FilterButton'
    ],
    function(CompoundControl, dotTplFn, dotTplForPicker, FilterMixin, PickerMixin, ControlHierarchyManager, FilterToStringUtil, TemplateUtil) {

       'use strict';
       /**
        * Кнопка фильтров. Функционал и внешний вид аналогичен $ws.proto.FilterButton, но работа с
        * фильтрами осуществляется только через контекст.
        * Если текст рядом с кнопкой фильтов может иметь большую ширину,
        * то ширину кнопки фильтров надо ограничить, навесив max-width.
        * @class SBIS3.CONTROLS.FilterButton
        * @extends $ws.proto.CompoundControl
        * @author Крайнов Дмитрий Олегович
        * @mixes SBIS3.CONTROLS.FilterMixin
        * @mixes SBIS3.CONTROLS.PickerMixin
        * @demo SBIS3.CONTROLS.Demo.FilterButtonMain Полный функционал кнопки фильтров
        * @control
        * @public
        */

   function isFieldResetValue(element, fieldName, filter) {
      var hasResetValue = 'resetValue' in element,
	      hasValue = fieldName in filter;

      return hasResetValue && hasValue ? FilterToStringUtil.isEqualValues(filter[fieldName], element.resetValue) : !hasValue;
   }

       var FilterButton = CompoundControl.extend([FilterMixin, PickerMixin],/** @lends SBIS3.CONTROLS.FilterButton.prototype */{
          _dotTplFn: dotTplFn,
          _dotTplPicker: dotTplForPicker,
          $protected: {
             _options: {
                /**
                 * @cfg {String} Направление открытия всплывающей панели кнопки фильтров
                 * <wiTag group="Отображение">
                 * Возможные значения:
                 * <ol>
                 *    <li>left - открывается влево;</li>
                 *    <li>right - открывается вправо.</li>
                 * </ol>
                 * @variant 'left'
                 * @variant 'right'
                 */
                filterAlign: 'left',
                /**
                 * @сfg {String} template Шаблон для фильтров всплывающей панели.
                 * @example
                 * <pre>
                 *   <option name="template" value="SBIS3.EDO.CtxFilter"/>
                 * </pre>
                 *
                 * <wiTag group="Данные">
                 * В данной опции задаётся шаблон для всплывающей панели, открываемой нажатием на кнопку фильтров.
                 */
                template: '',
                /**
                 * @сfg {String} additionalFilterTemplate Шаблон для блока "Можно отобрать" на всплывающей панели.
                 * @remark
                 * Для блока дополнительных параметров рекомендуется использовать компоненты:
                 * {@link SBIS3.CONTROLS.FilterLink} - ссылка, умеющая скрываться при клике.
                 * {@link SBIS3.CONTROLS.FilterText} - текст с крестиком, скрытвается при клике на крестик.
                 * @example
                 * <pre>
                 *   <option name="additionalFilterTemplate" value="SBIS3.EDO.additionalFilters"/>
                 * </pre>
                 */
                additionalFilterParamsTemplate: null,
                /**
                 * @cfg {String} Текст, который будет отображаться рядом с иконкой фильтра
                 * <wiTag group="Управление">
                 * Опция устанавливает текст, который будет отображаться рядом с иконкой фильтра
                 * @translatable
                 */
                resetLinkText: '',
                /**
                 * @noshow
                 */
                historyController: undefined,

                // TODO ДОКУМЕНТАЦИЯ
                filterLineComponent: 'SBIS3.CONTROLS.FilterButton.FilterLine',
                filterLineTemplate: undefined,
                independentContext: true,
                internalContextFilterName : 'sbis3-controls-filter-button'
             },

             _pickerContext: null,        /* Контекст пикера */
             _filterStructure: null,      /* Структура фильтра */
             _historyController: null,    /* Контроллер для работы с историей */
             _filterComponent: null,      /* Компонент, который будет отображаться на панели фильтрации */
             _filterAdditional: null
          },

          $constructor: function() {
             var dispatcher = $ws.single.CommandDispatcher,
                 declareCmd = dispatcher.declareCommand.bind(dispatcher, this),
                 showPicker = this.showPicker.bind(this);

             this._container.removeClass('ws-area');

             declareCmd('apply-filter', this.applyFilter.bind(this));
             declareCmd('reset-filter-internal', this._resetFilter.bind(this, true));
             declareCmd('reset-filter', this._resetFilter.bind(this, false));
             declareCmd('show-filter', showPicker);
             declareCmd('change-field-internal', this._changeFieldInternal.bind(this));

             this.getContainer().removeClass('ws-area')
                                .on('click', '.controls__filterButton__filterLine-items, .controls__filterButton-button', showPicker);
          },

          showPicker: function() {
             var self = this,
                 template = this._options.template,
                 additionalTemplate = this._options.additionalFilterParamsTemplate,
                 toLoad = [];

             function templateChecker(template) {
                return /^(js!)?SBIS3.*/.test(template);
             }

             function templatePrepare(template) {
               return (template.indexOf('js!') !== 0 ? 'js!' : '') + template
             }

             function showPicker() {
                FilterButton.superclass.showPicker.call(self);
                /* Если поле открытия фокус не на пикере, то вернём фокус в него.
                 т.к. сам пикер при открытии не переводит на себя фокус, однако активация
                 может вызываться дочериними контролами, то надо проверить на активность */
                if(!self._picker.isActive()) {
                   self._picker.setActive(true);
                }
             }

             /* Не показываем кнопку фильтров, если она выключена */
             if(!this.isEnabled()) return;

             if(!this._picker) {
                /* Если шаблон указали как имя компонента (строки которые начинаются с SBIS3 или js!SBIS3),
                 то перед отображением панели фильтров сначала загрузим компонент. */
                if(template && templateChecker(template)) {
                   toLoad.push(templatePrepare(template));
                }

                if(additionalTemplate && templateChecker(additionalTemplate)) {
                   toLoad.push(templatePrepare(additionalTemplate));
                }

                if(toLoad.length) {
                   $ws.require(toLoad).addCallback(function(ctrls) {
                      self._filterComponent = ctrls[0];
                      self._filterAdditional = ctrls[1];
                      showPicker();
                   });
                } else {
                   showPicker();
                }
             } else {
                showPicker();
             }
          },

          applyFilter: function() {
             if(this._picker.validate()) {
                this.hidePicker();
                FilterButton.superclass.applyFilter.call(this);
             }
          },

          _changeFieldInternal: function(field, val) {
             var pickerContext = this._getCurrentContext();

             if(pickerContext) {
                pickerContext.setValueSelf(field, val);
             }
          },

          _forEachFieldLinks: function(fn) {
             if(this._picker) {
                var fieldLink = require.defined('js!SBIS3.CORE.FieldLink') ? require('js!SBIS3.CORE.FieldLink') : null;
                $ws.helpers.forEach(this._picker.getChildControls(), function (child) {
                   if(fieldLink) {
                      if (child instanceof fieldLink) {
                         fn.call(this, child);
                      }
                   }
                });
             }
          },

          _setPickerContent: function() {
             this._picker.getContainer().addClass('controls__filterButton-' + this._options.filterAlign);
             if(this._historyController) {
                this._picker.getChildControlByName('filterHistory').setHistoryController(this._historyController);
             }

             //FIXME убрать как переведут на новое поле связи
             this._forEachFieldLinks(function(fieldLink) {
                var suggest = fieldLink.getSuggest();
                if(suggest) {
                   ControlHierarchyManager.addNode(suggest);
                }
             });
          },

          _setPickerConfig: function () {
             var context = new $ws.proto.Context({restriction: 'set'}),
                 rootName = this._options.internalContextFilterName,
                 isRightAlign = this._options.filterAlign === 'right',
                 firstTime = true,
                 self = this,
                 byFilter, byCaption, byVisibility;

             function updatePickerContext() {
                context.setValue(rootName, {
                   filterChanged: self.getLinkedContext().getValue('filterChanged'),
                   filter: self.getFilter(),
                   caption: self._mapFilterStructureByProp('caption'),
                   visibility: self._mapFilterStructureByVisibilityField('visibilityValue')
                });
             }

             this._pickerContext = context;
             updatePickerContext();

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
                var field = self._findFilterStructureElement(function(elem) {
                   return elem.internalValueField === fieldChanged;
                });

                if(field && field.internalVisibilityField) {
                   if(FilterToStringUtil.isEqualValues(value, field.resetValue)) {
                      self._changeFieldInternal(rootName + '/visibility/' + field.internalVisibilityField, false);
                   }
                }
             });

             context.subscribe('onFieldsChanged', function() {
                var changed = $ws.helpers.reduce(self._filterStructure, function(result, element) {
                       return result || !isFieldResetValue(element, element.internalValueField, context.getValue(rootName + '/filter'));
                    }, false);
                self._changeFieldInternal(rootName + '/filterChanged', changed);
             });

             return {
                corner: isRightAlign ? 'tl' : 'tr',
                parent: this,
                horizontalAlign: {
                   side: isRightAlign ? 'left' : 'right'
                },
                verticalAlign: {
                   side: 'top'
                },
                closeButton: true,
                closeByExternalClick: true,
                context: context,
                className: 'controls__filterButton__picker',
                template: TemplateUtil.prepareTemplate(dotTplForPicker)({
                   template: this._filterComponent ? null : TemplateUtil.prepareTemplate(this._options.template),
                   additionalFilterParamsTemplate: TemplateUtil.prepareTemplate(this._options.additionalFilterParamsTemplate),
                   historyController: this._historyController
                }),
                handlers: {
                   onClose: function() {
                      self._forEachFieldLinks(function(fieldLink) {
                         fieldLink.getSuggest()._hideMenu();
                      });
                   },

                   onShow: function() {
                      if (!firstTime) {
                         updatePickerContext();
                      }
                      firstTime = false;
                   },
                   //FIXME временное решение, пока пикер не научится работать с фокусом и обрабатывать клавиши
                   onKeyPressed: function(event, e) {
                      if(e.which === $ws._const.key.esc) {
                         this.hide();
                      }
                   },

                   onInit: function() {
                      if(self._filterComponent) {
                         new self._filterComponent({
                            parent: this,
                            element: this._container.find('.controls__filterButton__templatedArea'),
                            context: this.getLinkedContext()
                         })
                      }
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

             if (fromContext) {
                this._updateFilterStructure(
                    undefined,
                    context.getValue(internalName + '/filter'),
                    context.getValue(internalName + '/caption'),
                    context.getValue(internalName + '/visibility')
                );
             } else if (pickerVisible) {
                toSet = {};
                toSet[filterPath] = this.getFilter();
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
             this._forEachFieldLinks(function(fieldLink) {
                var suggest = fieldLink.getSuggest();
                if(suggest) {
                   ControlHierarchyManager.removeNode(suggest);
                }
             });

             if(this._historyController) {
                this._historyController.destroy();
                this._historyController = null;
             }

             FilterButton.superclass.destroy.apply(this, arguments);
          }

       });

       return FilterButton;
    });