define('js!SBIS3.CONTROLS.FilterButton',
    [
       'js!SBIS3.CORE.CompoundControl',
       'html!SBIS3.CONTROLS.FilterButton',
       'html!SBIS3.CONTROLS.FilterButton/FilterAreaTemplate',
       'js!SBIS3.CONTROLS.FilterMixin',
       'js!SBIS3.CONTROLS.PickerMixin',
       'js!SBIS3.CORE.FieldLink',
       'js!SBIS3.CONTROLS.ControlHierarchyManager',
       'js!SBIS3.CONTROLS.Link',
       'js!SBIS3.CONTROLS.Button',
       'js!SBIS3.CONTROLS.FilterButton.FilterLine',
       'js!SBIS3.CONTROLS.FilterHistory'
    ],
    function(CompoundControl, dotTplFn, dotTplForPicker, FilterMixin, PickerMixin, FieldLink, ControlHierarchyManager) {

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
       var filterStructureElementDef = {
          internalValueField: null,
          internalCaptionField: null
          /* По умолчанию их нет
           caption: NonExistentValue,
           value: NonExistentValue,
           resetValue: NonExistentValue,
           resetCaption: NonExistentValue,
           */
       };

       function propertyUpdateWrapper(func) {
          return function() {
             this.runInPropertiesUpdate(func, arguments);
          };
       }

   function isFieldResetValue(element, fieldName, filter) {
      var hasResetValue = 'resetValue' in element;
      return hasResetValue ? $ws.helpers.isEqualObject(filter[fieldName], element.resetValue) : false;
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
                 */
                filterAlign: 'left',
                /**
                 * @сfg {String} template Шаблон для всплывающей панели.
                 * <wiTag group="Данные">
                 * В данной опции задаётся шаблон для всплывающей панели, открываемой нажатием на кнопку фильтров.
                 */
                template: '',
                /**
                 * @cfg {String} Дополнительный CSS-класс для сплывающей панели
                 * @remark
                 * Дополнительный CSS-класс, который будет присвоен всплывающей панели контрола.
                 * Этот класс добавляется при построении всплывающей панели в атрибут class к уже заданным CSS-классам.
                 * <wiTag group="Отображение">
                 */
                pickerClassName: '',
                /**
                 * @cfg {String} Текст, который будет отображаться рядом с иконкой фильтра
                 * <wiTag group="Управление">
                 * Опция устанавливает текст, который будет отображаться рядом с иконкой фильтра
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
             _historyController: null     /* Контроллер для работы с историей */
          },

          $constructor: function() {
             var showButtonEl = this._container.find('.controls__filterButton__filterLine-table, .controls__filterButton-button'),
                 dispatcher = $ws.single.CommandDispatcher,
                 declCmd = dispatcher.declareCommand.bind(dispatcher, this),
                 showPicker = this.showPicker.bind(this);

             this._container.removeClass('ws-area');

             declCmd('apply-filter', this.applyFilter.bind(this));
             declCmd('reset-filter-internal', this._resetFilter.bind(this, true));
             declCmd('reset-filter', this._resetFilter.bind(this, false));
             declCmd('show-filter', showPicker);

             showButtonEl.click(showPicker);
          },

          applyFilter: function() {
             this.hidePicker();
             FilterButton.superclass.applyFilter.call(this);
          },

          _forEachFieldLinks: function(fn) {
             if(this._picker) {
                $ws.helpers.forEach(this._picker.getChildControls(), function (child) {
                   if (child instanceof FieldLink) {
                      fn.call(this, child);
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
             var
                 ctx = new $ws.proto.Context({restriction: 'set'}),
                 btnCtx = this.getLinkedContext(),
                 rootName = this._options.internalContextFilterName,
                 firstTime = true,
                 updatePickerContext = function () {
                    ctx.setValue(rootName, {
                       filterChanged: btnCtx.getValue('filterChanged'),
                       filter: this.getFilter(),
                       caption: this._mapFilterStructureByProp('caption')
                    });
                 }.bind(this),
                 isRightAlign = this._options.filterAlign === 'right';

             this._pickerContext = ctx;

             updatePickerContext();

             ctx.subscribe('onFieldNameResolution', function(event, fieldName) {
                var
                    byFilter = this._findFilterStructureElement(function(element) {
                       return element.internalValueField === fieldName;
                    }),
                    byCaption = !byFilter && this._findFilterStructureElement(function(element) {
                           return element.internalCaptionField === fieldName;
                        });

                if (byFilter) {
                   event.setResult(rootName + '/filter/' + byFilter.internalValueField);
                }

                if (byCaption) {
                   event.setResult(rootName + '/caption/' + byCaption.internalValueField);
                }
             }.bind(this));

             ctx.subscribe('onFieldsChanged', function() {
                var
                    filter = ctx.getValue(rootName + '/filter'),
                    changed = $ws.helpers.reduce(this._filterStructure, function(result, element) {
                       return result || !isFieldResetValue(element, element.internalValueField, filter);
                    }, false, this);
                ctx.setValueSelf(rootName + '/filterChanged', changed);
             }.bind(this));

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
                context: ctx,
                className: 'controls__filterButton__picker',
                template: dotTplForPicker.call(this, {
                   template: this._options.template,
                   historyController: this._historyController
                }),
                handlers: {
                   onClose: function() {
                      this._forEachFieldLinks(function(fieldLink) {
                         fieldLink.getSuggest()._hideMenu();
                      });
                   }.bind(this),

                   onShow: function() {
                      if (!firstTime) {
                         updatePickerContext();
                      }
                      firstTime = false;
                   }.bind(this)
                }
             };
          },

          _getCurrentContext : function(){
             return this._pickerContext;
          },
          _syncContext: function(fromContext) {
             var
                 context = this._getCurrentContext(),
                 pickerVisible = this._picker && this._picker.isVisible(),
                 descrPath = this._options.internalContextFilterName + '/caption',
                 filterPath = this._options.internalContextFilterName + '/filter',
                 toSet;

             if (fromContext) {
                this._updateFilterStructure(undefined, context.getValue(filterPath), context.getValue(descrPath));
             } else if (pickerVisible) {
                toSet = {};
                toSet[filterPath] = this.getFilter();
                toSet[descrPath] = this._mapFilterStructureByProp('caption');
                context.setValueSelf(toSet);
             }
          },
          setResetLinkText: function(text) {
             if (this._options.resetLinkText !== text) {
                this._options.resetLinkText = text;

                this._recalcInternalContext();
                this._notify('onPropertyChanged', 'resetLinkText');
             }
          },

          /**
           * Уста
           * @param controller
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

             FilterButton.superclass.destroy.apply(this, arguments);
          }

       });

       return FilterButton;
    });