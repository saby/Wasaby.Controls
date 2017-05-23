/**
 * Created by dv.zuev on 23.05.2017.
 */
define('js!SBIS3.CONTROLS.ListView/ListViewHelpers',
   [
      "js!WS.Data/Display/Display",
      "js!WS.Data/Utils",
      "Core/helpers/Object/isEmpty",
      "Core/core-functions",
      "js!SBIS3.CONTROLS.Utils.TemplateUtil",
      'Core/helpers/string-helpers',
      "js!WS.Data/Collection/RecordSet",
      "Core/ParserUtilities",
      "Core/Sanitize"
   ],
   function (Projection,
             Utils,
             isEmpty,
             cFunctions,
             TemplateUtil,
             strHelpers,
             RecordSet,
             ParserUtilities,
             Sanitize
      ) {

      var objFunc = {
         propertyUpdateWrapper: function (func) {
            return function () {
               return this.runInPropertiesUpdate(func, arguments);
            };
         },

         createDefaultProjection: function (items, cfg) {
            var proj, projCfg = {};
            projCfg.idProperty = cfg.idProperty || ((cfg.dataSource && typeof cfg.dataSource.getIdProperty === 'function') ? cfg.dataSource.getIdProperty() : '');
            if (cfg.itemsSortMethod) {
               projCfg.sort = cfg.itemsSortMethod;
            }
            if (cfg.itemsFilterMethod) {
               projCfg.filter = cfg.itemsFilterMethod;
            }
            if (cfg.loadItemsStrategy == 'merge') {
               projCfg.unique = true;
            }
            proj = Projection.getDefaultDisplay(items, projCfg);
            return proj;
         },

         applyGroupingToProjection: function (projection, cfg) {
            if (cfg.groupBy && cfg.easyGroup) {
               var method;
               if (!cfg.groupBy.method) {
                  var field = cfg.groupBy.field;
                  method = function (item, index, projItem) {
                     //делаем id группы строкой всегда, чтоб потом при обращении к id из верстки не ошибаться
                     return item.get(field) + '';
                  }
               }
               else {
                  method = cfg.groupBy.method
               }
               projection.setGroup(method);
            }
            else {
               projection.setGroup(null);
            }
            return projection;
         },
         applyFilterToProjection: function (projection, cfg) {
            if (cfg.itemsFilterMethod) {
               projection.setFilter(cfg.itemsFilterMethod);
            }
         },

         _oldGroupByDefaultMethod: function (record, at, last, item) {
            var curField = record.get(this._options.groupBy.field),
               result = curField !== this._previousGroupBy;
            this._previousGroupBy = curField;
            return result;
         },

         /*TODO метод нужен потому, что Лехина утилита не умеет работать с перечисляемым где contents имеет тип string*/
         getPropertyValue: function (itemContents, field) {
            if (typeof itemContents == 'string') {
               return itemContents;
            }
            else {
               return Utils.getItemPropertyValue(itemContents, field);
            }
         },

         canApplyGrouping: function (projItem, cfg) {
            var
               itemParent = projItem.getParent && projItem.getParent();
            return !isEmpty(cfg.groupBy) && (!itemParent || itemParent.isRoot());
         },

         groupItemProcessing: function (groupId, records, item, cfg) {
            if (cfg._canApplyGrouping(item, cfg)) {
               var groupBy = cfg.groupBy;

               if (cfg._groupTemplate) {
                  var
                     tplOptions = {
                        columns: cFunctions.clone(cfg.columns || []),
                        multiselect: cfg.multiselect,
                        hierField: cfg.hierField + '@',
                        parentProperty: cfg.parentProperty,
                        nodeProperty: cfg.nodeProperty,
                        item: item.getContents(),
                        groupContentTemplate: TemplateUtil.prepareTemplate(groupBy.contentTemplate || ''),
                        groupId: groupId
                     },
                     groupTemplateFnc;
                  tplOptions.colspan = tplOptions.columns.length + cfg.multiselect;


                  groupTemplateFnc = TemplateUtil.prepareTemplate(cfg._groupTemplate);

                  records.push({
                     tpl: groupTemplateFnc,
                     data: tplOptions
                  })
               }
            }
         },

         getRecordsForRedraw: function (projection, cfg) {
            var
               records = [];
            if (projection) {     //У таблицы могут позвать перерисовку, когда данных еще нет
               var prevGroupId = undefined;
               projection.each(function (item, index, group) {
                  if (!isEmpty(cfg.groupBy) && cfg.easyGroup) {
                     if (prevGroupId != group) {
                        cfg._groupItemProcessing(group, records, item, cfg);
                        prevGroupId = group;
                     }
                  }
                  records.push(item);
               });
            }
            return records;
         },
         buildTplArgs: function (cfg) {
            var tplOptions = {}, itemTpl, itemContentTpl;

            tplOptions.escapeHtml = strHelpers.escapeHtml;
            tplOptions.Sanitize = Sanitize;
            tplOptions.idProperty = cfg.idProperty;
            tplOptions.displayField = cfg.displayProperty;
            tplOptions.displayProperty = cfg.displayProperty;
            tplOptions.templateBinding = cfg.templateBinding;
            tplOptions.getPropertyValue = objFunc.getPropertyValue;

            if (cfg.itemContentTpl) {
               itemContentTpl = cfg.itemContentTpl;
            }
            else {
               itemContentTpl = this._defaultItemContentTemplate || cfg._defaultItemContentTemplate;
            }
            tplOptions.itemContent = TemplateUtil.prepareTemplate(itemContentTpl);
            if (cfg.itemTpl) {
               itemTpl = cfg.itemTpl;
            }
            else {
               itemTpl = this._defaultItemTemplate || cfg._defaultItemTemplate;
            }
            tplOptions.itemTpl = TemplateUtil.prepareTemplate(itemTpl);
            tplOptions.defaultItemTpl = TemplateUtil.prepareTemplate(cfg._defaultItemTemplate);

            if (cfg.includedTemplates) {
               var tpls = cfg.includedTemplates;
               tplOptions.included = {};
               for (var j in tpls) {
                  if (tpls.hasOwnProperty(j)) {
                     tplOptions.included[j] = TemplateUtil.prepareTemplate(tpls[j]);
                  }
               }
            }
            return tplOptions;
         },
         canServerRenderOther: function (cfg) {
            return !cfg.itemTemplate;
         },
         findIdProperty: function (json) {
            var itemFirst = json[0];
            if (itemFirst) {
               return Object.keys(json[0])[0];
            }
         },
         JSONToRecordset: function (json, idProperty) {
            return new RecordSet({
               rawData: json,
               idProperty: idProperty
            })
         },
         extendedMarkupCalculate: function (markup, cfg) {
            return ParserUtilities.buildInnerComponentsExtended(markup, cfg);
         }
      };

      return objFunc;
   });