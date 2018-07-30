define('SBIS3.CONTROLS/Tree/CompositeView', [
   "Core/core-clone",
   "Core/constants",
   "Core/Deferred",
   "Core/ParallelDeferred",
   "Core/helpers/Object/isEmpty",
   "SBIS3.CONTROLS/Tree/DataGridView",
   "SBIS3.CONTROLS/Mixins/CompositeViewMixin",
   "tmpl!SBIS3.CONTROLS/Tree/CompositeView/resources/CompositeView__folderTpl",
   'tmpl!SBIS3.CONTROLS/Tree/CompositeView/resources/TreeCompositeItemsTemplate',
   'tmpl!SBIS3.CONTROLS/Tree/CompositeView/resources/FolderTemplate',
   'tmpl!SBIS3.CONTROLS/Tree/CompositeView/resources/ListFolderTemplate',
   'tmpl!SBIS3.CONTROLS/Tree/CompositeView/resources/FolderContentTemplate',
   'tmpl!SBIS3.CONTROLS/Tree/CompositeView/resources/StaticFolderContentTemplate',
   "Core/Indicator",
   'SBIS3.CONTROLS/Utils/TemplateUtil',
   'Core/core-merge',
   'Core/core-instance',
   'css!SBIS3.CONTROLS/CompositeView/CompositeView',
   'css!SBIS3.CONTROLS/Tree/CompositeView/TreeCompositeView'
], function(coreClone, constants, Deferred, ParallelDeferred, isEmpty, TreeDataGridView, CompositeViewMixin, folderTpl, TreeCompositeItemsTemplate, FolderTemplate, ListFolderTemplate, FolderContentTemplate, StaticFolderContentTemplate, Indicator, TemplateUtil, cMerge, cInstance) {

   'use strict';

   /**
    * Контрол, отображающий набор данных с иерархической структурой в виде таблицы, плитки или списка.
    * Подробнее о настройке контрола и его окружения вы можете прочитать в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/">Настройка списков</a>.
    * @class SBIS3.CONTROLS/Tree/CompositeView
    * @extends SBIS3.CONTROLS/Tree/DataGridView
    *
    * @mixes SBIS3.CONTROLS/Mixins/CompositeViewMixin
    *
    * @cssModifier controls-TreeView__emptyIconInEmptyNode Изменяет отображение для всех записей с типом "Узел": если нет вложенных записей, треугольник по умолчанию скрыт и отображается только по ховеру. Демо-пример можно найти <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/list-hierarchy/triangle/#_3">здесь</a>.
    *
    * @demo Examples/TreeCompositeView/TreeCompositeView/TreeCompositeView
    *
    * @public
    * @control
    * @author Герасимов А.М.
    * @category Lists
    * @initial
    * <component data-component='SBIS3.CONTROLS/Tree/CompositeView'>
    *    <options name="columns" type="array">
    *       <options>
    *          <option name="title">Поле 1</option>
    *          <option name="width">100</option>
    *       </options>
    *       <options>
    *          <option name="title">Поле 2</option>
    *       </options>
    *    </options>
    * </component>
    */
   var
   TILE_MODE = CompositeViewMixin.TILE_MODE,
   buildTplArgs = function(cfg) {
      var parentOptions = cfg._buildTplArgsTDG(cfg), folderContentTpl, folderTpl, listFolderTpl, listFolderContentTpl;
      var myOptions = cfg._buildTplArgsComposite(cfg);
      cMerge(parentOptions, myOptions);
      if (cfg.folderContentTpl) {
         folderContentTpl = cfg.folderContentTpl;
      }
      else {
         folderContentTpl = cfg.tileMode === TILE_MODE.STATIC && cfg.className.indexOf('controls-CompositeView-tile__static-smallImage') === -1 ? TemplateUtil.prepareTemplate(StaticFolderContentTemplate) : cfg._defaultFolderContentTemplate;
      }
      parentOptions.folderContent = TemplateUtil.prepareTemplate(folderContentTpl);
      if (cfg.folderTpl) {
         folderTpl = cfg.folderTpl;
      }
      else {
         folderTpl = cfg._defaultFolderTemplate;
      }
      parentOptions.folderTpl = TemplateUtil.prepareTemplate(folderTpl);
      parentOptions.defaultFolderTpl = TemplateUtil.prepareTemplate(cfg._defaultFolderTemplate);


      if (cfg.listFolderContentTpl) {
         listFolderContentTpl = cfg.listFolderContentTpl;
      }
      else {
         if (cfg.folderContentTpl) {
            listFolderContentTpl = cfg.folderContentTpl;
         }
         else {
            listFolderContentTpl = cfg._defaultFolderContentTemplate;
         }
      }
      parentOptions.listFolderContent = TemplateUtil.prepareTemplate(listFolderContentTpl);
      if (cfg.listFolderTpl) {
         listFolderTpl = cfg.listFolderTpl;
      }
      else {
         if (cfg.folderTpl) {
            listFolderTpl = cfg.folderTpl;
         }
         else {
            listFolderTpl = cfg._defaultListFolderTemplate;
         }

      }
      parentOptions.listFolderTpl = TemplateUtil.prepareTemplate(listFolderTpl);
      parentOptions._itemsTemplate = cfg._itemsTemplate;
      parentOptions.drawFolders = drawFolders;
      parentOptions.drawLeafs = drawLeafs;
      parentOptions.defaultlistFolderTpl = TemplateUtil.prepareTemplate(cfg._defaultListFolderTemplate);
      return parentOptions;
   },
   drawFolders = function(cfg){
      var stashTpl = cfg.tplData.itemTpl,
          invisibleItemsMarkup = '',
          markup;
      if (cfg.tplData.viewMode == 'list'){
         cfg.tplData.itemTpl = cfg.tplData.listFolderTpl;
      }
      else if (cfg.tplData.viewMode == 'tile'){
         cfg.tplData.itemTpl = cfg.tplData.folderTpl;
         
         if(cfg.tplData.tileMode) {
            invisibleItemsMarkup = cfg.tplData.invisibleItemsTemplate({className: 'controls-ListView__item-type-node'})
         }
      }
      markup = cfg.tplData._itemsTemplate({records : cfg.records.folders || [], tplData : cfg.tplData}) + invisibleItemsMarkup;
      cfg.tplData.itemTpl = stashTpl;
      return markup;
   },
   drawLeafs = function(cfg){
      var stashTpl = cfg.tplData.itemTpl,
          invisibleItemsMarkup = '',
          markup;
      if (cfg.tplData.viewMode == 'list'){
         cfg.tplData.itemTpl = cfg.tplData.listTpl;
      }
      else if (cfg.tplData.viewMode == 'tile'){
         cfg.tplData.itemTpl = cfg.tplData.tileTpl;
         
         if(cfg.tplData.tileMode === 'static') {
            invisibleItemsMarkup = cfg.tplData.invisibleItemsTemplate({})
         }
      }
      markup = cfg.tplData._itemsTemplate({records : cfg.records.leafs || [], tplData : cfg.tplData}) + invisibleItemsMarkup;
      cfg.tplData.itemTpl = stashTpl;
      return markup;
   },
   getRecordsForRedraw = function(projection, cfg, isOld) {
      if (cfg.viewMode == 'table' || isOld) {
         return cfg._getRecordsForRedrawTree.call(this, projection, cfg)
      }
      else {
         var
            records = {
               folders : [],
               leafs : []
            },
            useGroups = !isEmpty(cfg.groupBy) && cfg.easyGroup;
         projection.each(function (item, index, group) {
            if (!cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem')) {
               if (item.isNode()) {
                  records.folders.push(item);
                  cfg._hideEmpty = true;
               }
               else {
                  records.leafs.push(item);
                  cfg._hideEmpty = true;
               }
            }
         });
         return records;
      }
   },
   canServerRenderOther = function(cfg) {
      return !(cfg.itemTemplate || cfg.listTemplate || cfg.tileTemplate || cfg.folderTemplate || cfg.listFolderTemplate)
   };

   var TreeCompositeView = TreeDataGridView.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS/Tree/CompositeView.prototype*/ {

      $protected: {
         _prevMode: null,
         _options: {
            _buildTplArgs : buildTplArgs,
            _getRecordsForRedraw: getRecordsForRedraw,
            /**
             * @cfg {String} Устанавливает шаблон, который используется для отрисовки папки в режимах "Список" и "Плитка"
             * @deprecated Используйте {@link SBIS3.CONTROLS/Tree/CompositeView#folderTpl}.
             * @remark
             * Когда опция не задана, используется стандартный шаблон. Для его работы требуется установить опцию {@link SBIS3.CONTROLS/Mixins/DSMixin#displayProperty}.
             * Для режима отображения "Список" можно переопределить шаблон папки с помощью опции {@link listFolderTemplate}.
             * Кроме шаблона папки, можно установить шаблон отображения элементов коллекции с помощью опций {@link SBIS3.CONTROLS/Columns.typedef cellTemplate}, {@link SBIS3.CONTROLS/ListView#itemTemplate}, {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#listTemplate} и {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#tileTemplate}.
             * @see listFolderTemplate
             * SBIS3.CONTROLS/Mixins/DSMixin#displayProperty
             * @see SBIS3.CONTROLS/Columns.typedef
             * @see SBIS3.CONTROLS/ListView#itemTemplate
             * @see SBIS3.CONTROLS/Mixins/CompositeViewMixin#listTemplate
             * @see SBIS3.CONTROLS/Mixins/CompositeViewMixin#tileTemplate
             * @example
             * <pre>
             *    <div class="controls-ListView__demo-folder">\
             *       {{item['title']}}\
             *    </div>
             * </pre>
             */
            folderTemplate: undefined,
            /**
             * @cfg {String} Устанавливает шаблон, который используется для отрисовки папки в режимах "Список" и "Плитка"
             * @remark
             * Режим отображения определяется опцией {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#viewMode},
             * Когда опция не задана, используется стандартный шаблон. Для его работы требуется установить опцию {@link SBIS3.CONTROLS/Mixins/DSMixin#displayProperty}.
             * Для режима отображения "Список" можно переопределить шаблон папки с помощью опции {@link listFolderTpl}.
             * Кроме шаблона папки, можно установить шаблон отображения элементов коллекции с помощью опций {@link SBIS3.CONTROLS/Columns.typedef cellTemplate}, {@link SBIS3.CONTROLS/ListView#itemTemplate}, {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#listTemplate} и {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#tileTemplate}.
             * @see listFolderTpl
             * @see SBIS3.CONTROLS/Mixins/DSMixin#displayProperty
             * @see SBIS3.CONTROLS/Columns.typedef
             * @see SBIS3.CONTROLS/ListView#itemTemplate
             * @see SBIS3.CONTROLS/Mixins/CompositeViewMixin#listTemplate
             * @see SBIS3.CONTROLS/Mixins/CompositeViewMixin#tileTemplate
             */
            folderTpl: null,
            /**
             * @cfg {String} Задаёт шаблон отображения содержимого каждого элемента коллекции для отрисовки папки в режимах "Список" и "Плитка"
             * @remark
             * Режим отображения определяется опцией {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#viewMode},
             * Подробнее про режимы отображения можно прочитать {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-types/#compositeview здесь}.
             * @see folderTpl
             * @see listFolderTpl
             * @see setListFolderTpl
             */
            folderContentTpl: null,
            /**
             * @cfg {String} Устанавливает шаблон для отрисовки папки в режиме "Список"
             * @deprecated Используйте {@link SBIS3.CONTROLS/Tree/CompositeView#listFolderTpl}.
             * @remark
             * Когда опция не задана, используется стандартный шаблон. Для его работы требуется установить опцию {@link SBIS3.CONTROLS/Mixins/DSMixin#displayProperty}.
             * Для режима отображения "Плитка" можно переопределить шаблон папки с помощью опции {@link folderTemplate}.
             * Кроме шаблона папки, можно установить шаблон отображения элементов коллекции с помощью опций {@link SBIS3.CONTROLS/Columns.typedef cellTemplate}, {@link SBIS3.CONTROLS/ListView#itemTemplate}, {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#listTemplate} и {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#tileTemplate}.
             * @see folderTemplate
             * @see SBIS3.CONTROLS/Mixins/DSMixin#displayProperty
             * @see SBIS3.CONTROLS/Columns.typedef
             * @see SBIS3.CONTROLS/ListView#itemTemplate
             * @see SBIS3.CONTROLS/Mixins/CompositeViewMixin#listTemplate
             * @see SBIS3.CONTROLS/Mixins/CompositeViewMixin#tileTemplate
             * <pre>
             *    <div class="controls-ListView__demo-folder">\
             *       {{=it.item.get("title")}}\
             *    </div>
             * </pre>
             */
            listFolderTemplate: undefined,
            /**
             * @cfg {String} Устанавливает шаблон для отрисовки папки в режиме "Список"
             * @remark
             * Режим отображения определяется опцией {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#viewMode},
             * Опция работает для viewMode = list
             * Подробнее про режимы отображения можно прочитать {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-types/#compositeview здесь}.
             * @see setListFolderTpl
             * @see listFolderContentTpl
             * @see setListFolderContentTpl
             */
            listFolderTpl: null,
            /**
             * @cfg {String} Задаёт шаблон отображения содержимого каждого элемента коллекции для отрисовки папки в режиме "Список"
             * @remark
             * Режим отображения определяется опцией {@link SBIS3.CONTROLS/Mixins/CompositeViewMixin#viewMode},
             * Опция работает для viewMode = list
             * Подробнее про режимы отображения можно прочитать {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/list-types/#compositeview здесь}.
             * @see setListFolderContentTpl
             * @see listFolderTpl
             * @see setListFolderTpl
             */
            listFolderContentTpl: null,
            _defaultFolderTemplate: FolderTemplate,
            _defaultFolderContentTemplate: FolderContentTemplate,
            _defaultListFolderTemplate: ListFolderTemplate,
            _compositeItemsTemplate : TreeCompositeItemsTemplate,
            _canServerRenderOther : canServerRenderOther
         }
      },

      _getInsertMarkupConfig: function() {
         var result = TreeCompositeView.superclass._getInsertMarkupConfig.apply(this, arguments);
         if (this._options.viewMode !== 'table') {
            //При добавлении элементов в начало списка, они добавляются перед FoldersContainer, а должны добавлять после него.
            //В таком случае явно укажем после какого блока вставить элементы.
            if (result.inside && result.prepend) {
               result.inside = false;
               result.prepend = false;
               result.container = this._getFoldersContainer();
            }
         }
         return result;
      },

      _getChildrenDOMItems: function() {
         var
            folders = this._getFoldersContainer().children('.js-controls-ListView__item'),
            items = TreeCompositeView.superclass._getChildrenDOMItems.apply(this, arguments);

         return folders.add(items);
      },

      _getEditArrowPosition: function() {
         if (this._options.viewMode === 'tile') {
            return this._getEditArrowPositionTile.apply(this, arguments);
         } else {
            return TreeCompositeView.superclass._getEditArrowPosition.apply(this, arguments);
         }
      },
   
      _getEditArrowMarker: function() {
         if (this._options.viewMode === 'tile') {
            return this.getHoveredItem().container.find('.js-controls-TreeView__editArrow');
         } else {
            return TreeCompositeView.superclass._getEditArrowMarker.apply(this, arguments);
         }
      },
      
      _modifyOptions: function() {
         var options = TreeCompositeView.superclass._modifyOptions.apply(this, arguments);
         options.className = (options.className || '') + ' controls-TreeDataGridView';
         return options;
      },

      _getEditArrowPositionTile: function() {
         var
            top, left,
            arrowCords, titleCords,
            item = this.getHoveredItem().container,
            folderTitle = item.find('.controls-CompositeView__tileTitle'),
            containerCords = this._container[0].getBoundingClientRect(),
            arrowContainer = folderTitle.find('.js-controls-TreeView__editArrow');

         if(arrowContainer.length) {
            arrowCords = arrowContainer.get(0).getBoundingClientRect();
            titleCords = folderTitle.get(0).getBoundingClientRect();

            if (arrowCords.top > titleCords.top + titleCords.height) {
               arrowCords = arrowContainer.get(1).getBoundingClientRect();
            }
            left = arrowCords.left - containerCords.left;
            top = arrowCords.top - containerCords.top + this._container[0].scrollTop;


            return {
               top: top,
               left: left
            }
         }
      },

      _onChangeHoveredItem: function(hoveredItem) {
         this._setHoveredStyles(hoveredItem.container);
         TreeCompositeView.superclass._onChangeHoveredItem.apply(this, arguments);
      },

      _calculateHoveredStyles: function(item) {
         if (item.hasClass('controls-ListView__item-type-node')) {
            if (this._options.tileMode === TILE_MODE.DYNAMIC) {
               TreeCompositeView.superclass._calculateHoveredStyles.call(this, item, {
                  fixedMode: this._options.fixedMode
               });
            }
         } else {
            TreeCompositeView.superclass._calculateHoveredStyles.apply(this, arguments);
         }
      },

      _elemClickHandlerInternal: function(data, id, target, e) {
         if (this._options.viewMode == 'table') {
            TreeCompositeView.superclass._elemClickHandlerInternal.apply(this, arguments);
         }
         else {
            var nodeID, $target =  $(target);
            /* Не обрабатываем клики по чекбоку и по стрелке редактирования, они обрабатываются в elemClickHandler'e */
            if ($target.hasClass('js-controls-TreeView__editArrow') || $target.hasClass('js-controls-ListView__itemCheckBox')) {
               return;
            }
            nodeID = $target.closest('.controls-ListView__item').data('id');
            if (this.getItems().getRecordById(nodeID).get(this._options.nodeProperty)) {
               this.setCurrentRoot(nodeID);
               this.reload();
            }
            else {
               this._activateItem(id);
            }
         }
      },

      _needShowEmptyData: function(items) {
         var result;
         if (items instanceof Array) {
            result = TreeCompositeView.superclass._needShowEmptyData.apply(this, arguments);
         } else {
            result = !(items && (items.leafs.length || items.folders.length));
         }
         return result;
      },
      
      _getItemTemplate: function(itemProj) {
         var resultTpl, dotTpl, item = itemProj.getContents();
            switch (this._options.viewMode) {
               case 'table': resultTpl = TreeCompositeView.superclass._getItemTemplate.call(this, itemProj); break;
               case 'list': {
                  if (item.get(this._options.nodeProperty)) {
                     dotTpl = this._options.listFolderTemplate || this._options.folderTemplate || folderTpl;
                  } else {
                     if (this._options.listTemplate) {
                        dotTpl = this._options.listTemplate;
                     }
                     else {
                        dotTpl = '<div style="{{=it.decorators.apply(it.color, \'color\')}}">{{=it.decorators.apply(escapeHtml(it.item.get(it.description)))}}</div>';
                     }
                  }
                  resultTpl = dotTpl;
                  break;
               }
               case 'tile' : {
                  if (item.get(this._options.nodeProperty)) {
                     dotTpl = this._options.folderTemplate ? this._options.folderTemplate : folderTpl;
                  } else {
                     if (this._options.tileTemplate) {
                        dotTpl = this._options.tileTemplate;
                     }
                     else {
                        var src;
                        if (!item.get(this._options.imageField)) {
                           src = item.get(this._options.nodeProperty) ? constants.resourceRoot + 'SBIS3.CONTROLS/themes/online/img/defaultFolder.png' : constants.resourceRoot + 'SBIS3.CONTROLS/themes/online/img/defaultItem.png';
                        } else {
                           src = '{{=it.item.get(it.image)}}';
                        }
                        dotTpl = '<div class="controls-CompositeView__verticalItemActions js-controls-CompositeView__verticalItemActions"><div class="controls-ListView__itemCheckBox js-controls-ListView__itemCheckBox"></div><img class="controls-CompositeView__tileImg" src="' + src + '"/><div class="controls-CompositeView__tileTitle" style="{{=it.decorators.apply(it.color, \'color\')}}">{{=it.decorators.apply(escapeHtml(it.item.get(it.description)))}}</div></div>';
                     }
                  }
                  resultTpl = dotTpl;
                  break;
               }

            }
            return resultTpl;
      },

      _isSlowDrawing: function() {
         var flag = TreeCompositeView.superclass._isSlowDrawing.apply(this, arguments);
         if (this._options.viewMode === 'list' && this._options.listFolderTemplate) {
            flag = true;
         }
         return flag;
      },

      _buildTplArgs: function(item) {
         var parentOptions = TreeCompositeView.superclass._buildTplArgs.call(this, item);
         if ((this._options.viewMode == 'list') || (this._options.viewMode == 'tile')) {
            parentOptions.image = this._options.imageField;
            parentOptions.description = this._options.displayProperty;
            parentOptions.color = this._options.colorField ? item.get(this._options.colorField) : '';
         }
         return parentOptions;
      },

      _getTargetContainer: function (item) {
         if (this.getViewMode() != 'table' && item.get(this._options.nodeProperty)) {
            return this._getFoldersContainer();
         }
         return this._getItemsContainer();
      },

      _getFoldersContainer: function() {
         return $('.controls-CompositeView__foldersContainer', this._container);
      },

      //Режим старой отрисовки
      //Переопределяем метод добавления элемента в DOM т.к. в TreeCompositeView в режиме не table для папок есть отдельный
      //контейнер который лежит перед всем листьями, и если происходит добавление элемента на позицую между последней папкой и первым листом,
      //он должен вставляться корректно, в данном случае просто после контейнера всех папок
      //при прочих ситуациях, вставляем контейнер просто перед предыдущим
      _insertItemContainer: function (item, itemContainer, target, at, currentItemAt, flagAfter) {
         var customCompositeInsert = false;
         if (this.getViewMode() != 'table' && !flagAfter && !item.get(this._options.nodeProperty)) {
            if (at === 0) {
               customCompositeInsert = true;
            }
            else {
               var prevItem = this._getItemsProjection().at(at - 1);
               if (prevItem.isNode()) {
                  customCompositeInsert = true;
               }
            }
            if (customCompositeInsert) {
               this._previousGroupBy = undefined;
               itemContainer.insertAfter(this._getFoldersContainer());
            }
            else {
               itemContainer.insertAfter(this._getDomElementByItem(prevItem));
            }
         }

         else {
            TreeCompositeView.superclass._insertItemContainer.apply(this, arguments);
         }
      },

      _processPaging: function() {
         TreeCompositeView.superclass._processPaging.call(this);
         this._processPagingStandart();
      },
      /**
       * Устанавливает шаблон, который используется для отрисовки папки в режимах "Список" и "Плитка"
       * @see folderTemplate
       */
      setFolderTemplate : function(tpl) {
         this._options.folderTemplate = tpl;
      },
      /**
       * Устанавливает шаблон, который используется для отрисовки папки в режимах "Список"
       * @see listFolderTemplate
       */
      setListFolderTemplate : function(tpl) {
         this._options.listFolderTemplate = tpl;
      },
      /**
       * Задаёт шаблон отображения каждого элемента коллекциия для отрисовки папки в режимах "Список"
       * @see listFolderTpl
       */
      setListFolderTpl : function(tpl) {
         this._options.listFolderTpl = tpl;
      },
      /**
       * Задаёт шаблон отображения содержимого каждого элемента коллекциия для отрисовки папки в режимах "Список"
       * @see listFolderContentTpl
       */
      setListFolderContentTpl : function(tpl) {
         this._options.listFolderContentTpl = tpl;
      },

      redraw: function() {
         if (this._options.hierarchyViewMode) {
            if (!this._prevMode) {
               var prevMode = this._options.viewMode;
               this.setViewMode('table');
               this._prevMode = prevMode;
            }
         }
         else {
            if (this._prevMode && this._prevMode !== this._options.viewMode) {
               this.setViewMode(this._prevMode);
            }
            this._prevMode = null;
         }
         TreeCompositeView.superclass.redraw.apply(this, arguments);
      },

      setViewMode: function() {
         this._prevMode = null;
         // Сбрасываем открытые узлы именно через set'тер, т.к. только так можно закрыть узлы и в проекции
         this.setOpenedPath({});
         TreeCompositeView.superclass.setViewMode.apply(this, arguments);
      },

      //TODO для плитки. Надо переопределить шаблоны при отрисовке одного элемента, потому что по умолчанию будет строка таблицы
      //убирается по задаче https://inside.tensor.ru/opendoc.html?guid=4fd56661-ec80-46cd-aca1-bfa3a43337ae&des=

      _calculateDataBeforeRedraw: function(data, projItem) {
         function dataCalc(dataArg, fieldsArr) {
            dataArg.itemTpl = dataArg[fieldsArr[0]];
            dataArg.itemContent = dataArg[fieldsArr[1]];
            dataArg.defaultItemTpl = dataArg[fieldsArr[2]];
         }
         var dataClone = coreClone(data);
         if (this._options.viewMode == 'tile') {
            if (projItem.isNode()) {
               dataCalc(dataClone, ['folderTpl', 'folderContent', 'defaultFolderTpl']);
            }
            else {
               dataCalc(dataClone, ['tileTpl', 'tileContent', 'defaultTileTpl']);
            }
         }
         if (this._options.viewMode == 'list') {
            if (projItem.isNode()) {
               dataCalc(dataClone, ['listFolderTpl', 'listFolderContent', 'defaultListFolderTpl']);
            }
            else {
               dataCalc(dataClone, ['listTpl', 'listContent', 'defaultListTpl']);
            }
         }
         return dataClone;
      },

      /*
       TODO НЕ ИСПОЛЬЗОВАТЬ БЕЗ САМОЙ КРАЙНЕЙ НЕОБХОДИМОСТИ!
       Метод для частичной перезагрузки (обработка только переданных элементов).
       Сделано в качестве временного решения (для номенклатуры).
       При правильном разделении функционала данный метод не нужен (пользователь будет лишь менять данные в DataSet, а View будет сам перерисовываться).
      */
      partialyReload: function(items) {
         var
            self = this,
            filter,
            deferred,
            currentDataSet,
            currentRecord,
            needRedraw,
            item,
            parentBranchId,
            dependentRecords,
            recordsGroup = {},
            branchesData = {},
            container = this.getContainer(),
            // а вдруг будет корень 0 нельзя делать ||
            curRoot = self._options.currentRoot === undefined ? null : self._options.currentRoot,
            //Метод формирования полного списка зависимостей
            findDependentRecords = function(key, parentKey) {
               var
                  findDependents = function(key, parentKey) {
                     var
                        result = {
                           key: key,
                           $row: container.find('[data-id="' + key + '"]'),
                           childs: []
                        };
                     if (parentKey !== undefined) {
                        result.parentKey = parentKey;
                     }
                     if (result.$row.hasClass('controls-ListView__item-type-node') || result.$row.hasClass('controls-ListView__item-type-hidden')) {
                        container.find('.controls-ListView__item[data-parent="' + key + '"]').each(function (idx, row) {
                           var rowKey = row.getAttribute('data-id');
                           result.childs.push(findDependents(rowKey, key));
                        });
                     }
                     return result;
                  };
               return findDependents(key, parentKey);
            },
            //Метод удаляет или перерисовывает переданную строку
            removeOrRedraw = function(dataSet, row, recordOffset) {
               var
                  indexForRemove,
                  record = needRedraw ? dataSet.getRecordById(row.key) : false,
                  environment = [row.$row.prev(), row.$row.next()];

               //Если запись найдена в обновленном DataSet, то перерисовываем её
               if (record) {
                  currentDataSet.getRecordById(row.key).merge(record);
                  self.redrawItem(record);
               } else { //Иначе - удаляем запись
                  indexForRemove = currentDataSet.getIndexByValue(currentDataSet.getIdProperty(), row.key);
                  if (indexForRemove >= 0) {
                     currentDataSet.removeAt(indexForRemove);
                  }
                  self._destroyItemsFolderFooter([row.key]);
                  row.$row.remove();
                  //Если количество записей в текущем DataSet меньше, чем в обновленном, то добавляем в него недостающую запись
                  if (needRedraw && currentDataSet.getCount() < dataSet.getCount()) {
                     record = dataSet.at(dataSet.getCount() - recordOffset);
                     currentDataSet.addRecord(record);
                     self._drawItems([record]);
                  }
               }
            },
            //Метод для удаления и перерисовки
            removeAndRedraw = function(row, recordOffset) {
               //Если есть дочерние, то для каждого из них тоже зовем removeAndRedraw
               if (row.childs && row.childs.length) {
                  row.childs.forEach(function(childRow, idx) {
                     removeAndRedraw(childRow, row.childs.length - idx);
                  });
                  //Если не нужна перерисовка, то просто удалим строку
                  if (!needRedraw) {
                     removeOrRedraw(null, row, recordOffset);
                  } else {
                     getBranch(row.parentKey).addCallback(function(dataSet) {
                        removeOrRedraw(dataSet, row, recordOffset);
                     });
                  }
               } else {
                  getBranch(row.parentKey).addCallback(function(dataSet) {
                     removeOrRedraw(dataSet, row, recordOffset);
                  });
               }
            },
            //Получаем данные ветки (ищем в branchesData или запрашиваем с БЛ)
            getBranch = function(branchId) {
               if (branchesData[branchId]) {
                  return new Deferred()
                     .addCallback(function() {
                        return branchesData[branchId];
                     })
                     .callback();
               } else {
                  filter[self._options.parentProperty] = branchId === 'null' ? null : branchId;
                  var limit;
                  //проверяем, является ли обновляемый узел корневым, если да, обновляем записи до подгруженной записи (_infiniteScrollOffset)
                  if ( String(curRoot) == branchId  &&  self._infiniteScrollOffset) { // т.к. null != "null", _infiniteScrollOffset проверяем на случай, если нет подгрузки по скроллу
                     limit = self._infiniteScrollOffset + self._options.pageSize;
                  } else if (self._limit !== undefined) {
                     limit = (self._options._folderOffsets.hasOwnProperty(branchId) ? self._options._folderOffsets[branchId] : 0) + self._limit;
                  }
                  self._notify('onBeforeDataLoad', filter, self.getSorting(), self._offset, limit);
                  return self._callQuery(filter, self.getSorting(), self._offset, limit)
                     .addCallback(function(dataSet) {
                        branchesData[branchId] = dataSet;
                        return dataSet;
                     }).addErrback(function(error){
                      self._notify('onDataLoadError', error)
                     });
               }
            };
         if (!this._showedLoading) {
            Indicator.setMessage(rk('Пожалуйста, подождите…'));
         }
         if (items) {
            currentDataSet = this.getItems();
            filter = coreClone(this.getFilter());
            //Группируем записи по веткам (чтобы как можно меньше запросов делать)
            items.forEach(function(id) {
               item = this._options._items.getRecordById(id);
               if (item) {
                  parentBranchId = this.getParentKey(undefined, this._options._items.getRecordById(id));
                  if( parentBranchId !== undefined ) {
                     if (!recordsGroup[parentBranchId]) {
                        recordsGroup[parentBranchId] = [];
                     }
                     recordsGroup[parentBranchId].push(id);
                  }
               }
            }, this);
            if (Object.isEmpty(recordsGroup)) {
               if (!this._showedLoading) {
                  Indicator.hide();
               }
            } else {
               deferred = new ParallelDeferred();
               Object.keys(recordsGroup).forEach(function(branchId) {
                  //Загружаем содержимое веток
                  deferred.push(getBranch(branchId)
                     .addCallback(function(branchDataSet) {
                        if (branchDataSet) {
                           recordsGroup[branchId].forEach(function(record, idx) {
                              currentRecord = currentDataSet.getRecordById(record);
                              dependentRecords = findDependentRecords(record, branchId);
                              needRedraw = !!branchDataSet.getRecordById(record);
                              //Удаляем то, что надо удалить и перерисовываем то, что надо перерисовать
                              removeAndRedraw(dependentRecords, recordsGroup[branchId].length - idx);
                           });
                           if(String(curRoot) == branchId)
                              self.getItems().setMetaData(branchDataSet.getMetaData());
                        }
                     })
                     .addBoth(function() {
                        if (!self._showedLoading) {
                           Indicator.hide();
                        }
                     }));
               });
               return deferred.done().getResult();
            }
         }
         return Deferred.success();
      },

      _reloadViewAfterDelete: function(idArray) {
         if (this.getViewMode() === 'table') {
            return this.partialyReload(idArray);
         } else {
            return TreeCompositeView.superclass._reloadViewAfterDelete.apply(this, arguments);
         }
      }

   });

   TreeCompositeView.TILE_MODE = TILE_MODE;
   return TreeCompositeView;

});