/**
 * Created by us.fedko on 07.12.2017.
 */
define('SBIS3.CONTROLS/Utils/FilterPanelUtils',
   [
      'Core/Deferred',
      'Core/ParallelDeferred',
      'Core/Context',
      'Core/core-instance',
      'SBIS3.CONTROLS/Filter/Button/Utils/FilterToStringUtil',
      'Core/detection',
      "Core/constants",
      "Core/core-clone",
      "Core/helpers/Object/find",
      'Core/moduleStubs',
      'Core/helpers/Object/isEmpty'
   ], function (Deferred, ParallelDeferred, cContext, cInstance, FilterToStringUtil, detection, constants, coreClone, objectFind, mStubs, isEmptyObject) {

      "use strict";

      /**
       * Создание контекста для открываемой панели фильтров.
       * @param linkedContext {Context} - связанный с компонентой контекст
       * @param internalContextFilterName {String} - именование внутреннего префикса для полей контекста
       * @param filterStructure {Object} - структура фильтров
       */
      function createFilterContext(linkedContext, internalContextFilterName, filterStructure, opener) {
         var defNoOpener = new Deferred();
         var context = cContext.createContext(cInstance.instanceOfModule(opener, 'Lib/Control/CompoundControl/CompoundControl') ? opener : defNoOpener, {restriction: 'set'}),
            rootName =  internalContextFilterName,
            byFilter, byCaption, byVisibility;

         function updatePickerContext() {
            context.setValue(rootName, {
               filterChanged: linkedContext.getValue('filterChanged'),
               filter: _getFilter(true, filterStructure),
               caption: _mapFilterStructureByProp('caption', filterStructure),
               visibility: _mapFilterStructureByVisibilityField('visibilityValue', filterStructure)
            });
         }

         function updatePickerVisibility() {
            var visibility = context.getValue(rootName + '/visibility');
            var showAdditionalBlock = false;

            if (!isEmptyObject(visibility)) {
               showAdditionalBlock = Object.keys(visibility).reduce(function (result, element) {
                  return result || visibility[element] === false;
               }, false);
            }
   
            context.setValue('additionalFilterVisible', showAdditionalBlock);
         }

         updatePickerContext();
         updatePickerVisibility();

         context.subscribe('onFieldNameResolution', function (event, fieldName) {
            byFilter = _findFilterStructureElement(function (element) {
               return element.internalValueField === fieldName;
            }, filterStructure);
            byCaption = !byFilter && _findFilterStructureElement(function (element) {
                  return element.internalCaptionField === fieldName;
               }, filterStructure);
            byVisibility = !byFilter && !byCaption && _findFilterStructureElement(function (element) {
                  return element.internalVisibilityField === fieldName;
               }, filterStructure);

            if (byFilter) {
               event.setResult(rootName + '/filter/' + byFilter.internalValueField);
            }

            if (byCaption) {
               event.setResult(rootName + '/caption/' + byCaption.internalValueField);
            }

            if (byVisibility) {
               event.setResult(rootName + '/visibility/' + byVisibility.internalVisibilityField);
            }
         });

         context.subscribe('onFieldChange', function () {
            /* Скрытие/отображние блока дополнительных параметров по состоянию видимости, которое пишется в контекст */
            updatePickerVisibility();
         });

         context.subscribe('onFieldsChanged', function () {
            var changed = filterStructure.reduce(function (result, element) {
               return result || !isFieldResetValue(element, element.internalValueField, context.getValue(rootName + '/filter'));
            }, false);
            context.setValueSelf(rootName + '/filterChanged', changed);
         });

         return context;
      }

      /**
       * Сравнение значения поля со своим значением по умолчанию
       * @param element - элемент панели фильтров
       * @param fieldName - имя сравниваемого поля
       * @param filter - набор выбранных значений фильтров панели фильтров
       * @returns {boolean}
       */
      function isFieldResetValue(element, fieldName, filter) {
         var hasResetValue = 'resetValue' in element,
            hasValue = fieldName in filter;

         return hasResetValue && hasValue ? FilterToStringUtil.isEqualValues(filter[fieldName], element.resetValue) : !hasValue;
      }

      /**
       * Метод возвращающий конфигурацию панели фильтров, подмешивает к переданному объекту, необходимые для панели фильтров
       * @param addConfig - дополнительный конфиг, к котору подмешается необходимый
       */
      function getPanelConfig(addConfig) {
         var config = {
            verticalAlign: {
               side: 'top'
            },
            handlers: {},
            closeButton: true,
            locationStrategy: detection.isMobilePlatform ? 'dontMove' : null,
            closeByExternalClick: true,
            closeOnTargetMove: !detection.isMobilePlatform,
            recalculateOnKeyboardShow: false,
            cssClassName: 'controls__filterButton__picker',
            _canScroll: true,
            activateAfterShow: true
         };
         Object.assign(config, addConfig);

         config.handlers = config.handlers || {};
         config.handlers.onKeyPressed = function(event, e) {
            if(e.which === constants.key.esc) {
               this.hide();
            }
         };

         config.handlers.onResize = function() {
            /* В текущем состоянии пикер не пересчитывает свои размеры при изменении внутреннего контента.
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
         };

         return config;
      }

      /**
       * Метод получения значения фильтра из структуры фильтров
       * @param byInternal - флажок откуда нужно брать значение, из внутренней структуры или нет
       * @param filterStructure - структура фильтров
       * @returns {*}
       * @private
       */
      function _getFilter(byInternal, filterStructure) {
         return filterStructure.reduce(function(result, element) {
            if (element.hasOwnProperty('value')) {
               /* FIXME для внедрения в задачах используется filterField, т.к. у них internalValueField не совпадает
                с полем фильтра */
               result[byInternal ? element.internalValueField : (element.filterField || element.internalValueField)] = coreClone(element.value); // если не склонировать, кто-то может поменять по ссылке и испортит фильтр
            }
            return result;
         }, {});
      }

      /**
       * Получение всех значений опции из структуры фильтров
       * @param prop - имя опции, откуда берём значения
       * @param filterStructure - структура фильтров
       * @returns {*}
       * @private
       */
      function _mapFilterStructureByProp(prop, filterStructure) {
         return filterStructure.reduce(function(result, element) {
            if (element.hasOwnProperty(prop)) {
               result[element.internalValueField] = element[prop];
            }
            return result;
         }, {});
      }

      /**
       * Получение всех значений опции из отображаемых значений структуры фильтров
       * @param prop - имя опции, откуда берём значения
       * @param filterStructure - структура фильтров
       * @returns {*}
       * @private
       */
      function _mapFilterStructureByVisibilityField(prop, filterStructure) {
         return filterStructure.reduce(function(result, element) {
            if(element.internalVisibilityField) {
               if (element.hasOwnProperty(prop)) {
                  result[element.internalVisibilityField] = element[prop];
               } else {
                  result[element.internalVisibilityField] = element.hasOwnProperty('resetVisibilityValue') ? element.resetVisibilityValue : false;
               }
            }
            return result;
         }, {});
      }

      /**
       * Поиск в структуре фильтров по переданному условию-методу
       * @param func - метод поиска
       * @param filterStructure - структура фильтров
       * @returns {*}
       * @private
       */
      function _findFilterStructureElement(func, filterStructure) {
         return objectFind(filterStructure, function(element) {
            return func(element);
         });
      }

      /**
       * Предварительная загрузка компонентов
       * @param options {Object} - набор опций, среди которых ожидаем увидеть необходимые шаблоны
       * @param templates {Array} - массив шаблонов
       * @param defCallback {Function} - обработчик вызываемый в каждом дефереде, при загрузке шаблона
       * @returns {ParallelDeferred}
       * @private
       */
      function initTemplates(options, templates, defCallback) {
         var dTemplatesReady = new ParallelDeferred();

         function processTemplate(template, name) {
            var isStringTemplate = typeof template === 'string',
                jsModule;
            
            if (isStringTemplate) {
               /* Без проверки на строку упадёт ошибка, если template - это tmpl шаблон,
                  т.к. hasOwnProperty вызывает toString, если туда передать объект, а tmpl шаблон кидает исключение,
                  если у него звать toString. */
               jsModule = constants.jsModules.hasOwnProperty(template);
            }
            /* Если шаблон указали как имя компонента (строки которые начинаются с js! или SBIS3.),
             то перед отображением панели фильтров сначала загрузим компонент. */
            if (template && isStringTemplate && (jsModule || constants.requirejsPaths.hasOwnProperty(template.split('/')[0]) || template.indexOf('js!') === 0)) {

               if (jsModule) {
                  template = 'js!' + template;
               }

               dTemplatesReady.push(mStubs.require(template).addCallback(function(comp) {
                  /* Запишем, что в качестве шаблона задали компонент */
                  defCallback(name);
                  return comp;
               }));
            }
         }

         for (var key in templates) {
            if (templates.hasOwnProperty(key)) {
               processTemplate(options.getProperty(templates[key]), templates[key]);
            }
         }

         return dTemplatesReady;
      }

      return {
         createFilterContext: createFilterContext,
         getPanelConfig: getPanelConfig,
         initTemplates: initTemplates
      };
   });