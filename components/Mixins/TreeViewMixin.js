define('SBIS3.CONTROLS/Mixins/TreeViewMixin', [
   "Core/constants",
   "SBIS3.CONTROLS/Utils/TemplateUtil",
   "Core/core-instance",
   "Core/helpers/String/format"
], function ( constants, TemplateUtil, cInstance, format) {


   var getFolderFooterOptions = function(cfg, item) {
         var
            model = item.getContents(),
            key = model.get(cfg.idProperty);
         return {
            key: key,
            item: model,
            level: item.getLevel(),
            footerTpl: cfg.folderFooterTpl,
            multiselect: cfg.multiselect,
            pagerOptions: cfg._getFolderPagerOptions(cfg, item, key)
         }
      },
      getFolderPagerOptions = function(cfg, item, key) {
         var
            count,
            result,
            hasMore,
            caption;

         //Проверяем на pageSize, т.к. опция может быть не задана, а в ответе с бл в параметре hasMore может быть число записей в папке.
         if (typeof cfg._folderHasMore[key] === 'number' && cfg.pageSize) {
            count =  cfg._folderHasMore[key] - cfg._folderOffsets[key] - cfg.pageSize;
            hasMore = count <= 0 ? false : count;
         } else if (typeof cfg._folderHasMore[key] === 'boolean') {
            hasMore = !!cfg._folderHasMore[key];
         } else if (typeof cfg._folderHasMore[key] === 'object') {
            hasMore = !!cfg._folderHasMore[key].after;
         }

         if (hasMore) {
            if (typeof hasMore === 'number') {
               caption = format({
                  count: hasMore
               }, rk('Еще $count$s$'));
            } else {
               caption = rk('Еще') + '...';
            }

            result = {
               caption: caption,
               command: 'loadNode',
               commandArgs: [key]
            };
         }
         return result;
      },
      hasFolderFooters = function(cfg) {
         return cfg._footerWrapperTemplate && cfg.folderFooterTpl;
      };

   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS/Mixins/TreeViewMixin
    * @public
    * @author Крайнов Д.О.
    *
    * @cssModifier controls-ListView__item-without-child Класс добавляется к визуальному представлению папки, у которой отсутствуют дочерние элементы.
    * @cssModifier controls-ListView__hideCheckBoxes-leaf Скрывает отображение чекбоксов у листьев. Подробнее о данном типе записей списка читайте в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
    * @cssModifier controls-ListView__hideCheckBoxes-node Скрывает чекбоксы у папок (узлов и скрытых узлов). Подробнее о данном типе записей списка читайте в разделе <a href="/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
    */

   var TreeViewMixin = /** @lends SBIS3.CONTROLS/Mixins/TreeViewMixin.prototype */{
      $protected: {
         _options: {
            _getFolderFooterOptions: getFolderFooterOptions,
            _getFolderFooterOptionsTVM: getFolderFooterOptions,
            _getFolderPagerOptions: getFolderPagerOptions,
            _hasFolderFooters: hasFolderFooters,
            /**
             * @cfg {String} Устанавливает шаблон футера, который отображается в конце каждого узла иерархии.
             * @remark
             * Опция используется только в иерархических представлениях данных для того, чтобы создать футер в каждом узле иерархии.
             * В качестве значения опции можно передавать следующее:
             * <ul>
             *    <li>Вёрстку. Этот способ применяется редко, когда шаблон небольшой по содержимому.</li>
             *    <li>Шаблон. Этот способ применяется значительно чаще, чем передача вёрстки напрямую в опцию. Шаблон представляет собой XHTML-файл, в котором создана вёрстка футера.
             *    Создание отдельного шаблона позволяет использовать его в дальнейшем и в других компонентах. Шаблон должен быть создан внутри компонента в подпапке resources.
             *    Чтобы шаблон можно было использовать в опции, его нужно подключить в массив зависимостей компонента.</li>
             * </ul>
             * @example
             * В частном случае шаблон футера узла иерархии используют для размещения кнопок создания нового листа или папки.
             * ![](/folderFooterTpl.png)
             * Подробный пример использования футера для решения этой прикладной задачи вы можете найти в разделе {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/edit-in-place/add-in-place/#_3 Добавление по месту в иерархическом списке}.
             * @see SBIS3.CONTROLS.List#footerTpl
             */
            folderFooterTpl: undefined,
            /**
             * @cfg {String} Перемещения элементов с помощью курсора мыши.
             * @variant "" Запрещено.
             * @variant allow Разрешено.
             * @variant onlyChangeOrder Разрешено только изменение порядка.
             * @variant onlyChangeParent Разрешено только перемещение в папку.
             * @variant separateParent Нельзя перемещать лист между папками и папку между листами.
             * @remark Дополнительная информация в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/ Типы отношений в таблицах БД}.
             * Для того чтобы добавить возможность перемещать элементы в списке, используйте опцию {@link https://wi.sbis.ru/docs/js/SBIS3/CONTROLS/ListView/options/enabledMove/ enabledMove}.
             * Подробнее о том, как перемещать записи в списках, читайте в статье {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/list-settings/records-editing/items-action/dragndrop/ Перемещение записей в списках}.
             */
            itemsDragNDrop: 'allow'
         }
      },
      /**
       * Возвращает id текущей активной папки (узла/скрытого узла) по следующему алогоритму:
       * - Если активна открытая папка (узел/скрытый узел) - возвращает ее id
       * - Если активен элемент (лист), внутри открытой папки (узла/скрытого узла) - id этой папки
       * - В остальных случаях вернет id текущей папки (узла/скрытого узла)
       *
       * Подробнее о типах данных иерархического списка можно прочитать в разделе {@link https://wi.sbis.ru/doc/platform/developmentapl/service-development/bd-development/vocabl/tabl/relations/ Иерархия}.
       */
      getActiveNodeKey: function() {
         var
            result, selProjItem;
         if (this._options.selectedIndex !== null && this._options.selectedIndex !== undefined && this._options.selectedIndex >= 0) {
            selProjItem = this._getItemsProjection().at(this._options.selectedIndex);
            if (selProjItem) {
               if (selProjItem.isNode() && selProjItem.isExpanded() && cInstance.instanceOfModule(selProjItem.getContents(), 'WS.Data/Entity/Model')) {
                  result = selProjItem.getContents().getId();
               }
               else {
                  var selParentItem = selProjItem.getParent();
                  if (selParentItem && selParentItem.getContents() && cInstance.instanceOfModule(selParentItem.getContents(), 'WS.Data/Entity/Model')) {
                     result = selParentItem.getContents().getId();
                  }
               }
            }
         }
         if (!result) {
            result = this.getCurrentRoot();
         }
         return result;
      },
      /**
       * Разворачиваем элемент
       * @param expandedItem
       * @private
       */
      _onExpandItem: function(expandedItem) {
         this._createFolderFooter(expandedItem);
         this._drawExpandedItem(expandedItem);
      },
      _drawExpandedItem: function(expandedItem) {
         //todo При переходе на Virtual DOM удалить работу с expandedItemContainer
         var expandedItemContainer = this._getItemsContainer().find('[data-hash="'+ expandedItem.getHash() + '"]');
         expandedItemContainer.find('.js-controls-TreeView__expand').addClass('controls-TreeView__expand__open');
         this._notify('onNodeExpand', expandedItem.getContents().getId(), expandedItemContainer);
      },
      /**
       * Сворачиваем элемент, а также всю его структуру
       * @param collapsedItem
       * @private
       */
      _onCollapseItem: function(collapsedItem) {
         var
            itemId = collapsedItem.getContents().getId(),
            collapsedItemContainer = this._getItemsContainer().find('[data-hash="'+ collapsedItem.getHash() + '"]');
         collapsedItemContainer.find('.js-controls-TreeView__expand').removeClass('controls-TreeView__expand__open');
         delete this._options.openedPath[itemId];
         //Уничтожим все дочерние footer'ы и footer узла
         this._destroyItemsFolderFooter(itemId);
         this._notify('onNodeCollapse', itemId, collapsedItemContainer);
      },
      /**
       * Обработка смены у item'a состояния "развернутости"
       * @param item
       * @private
       */
      _onChangeItemExpanded: function(item) {
         this['_' + (item.isExpanded() ? 'onExpandItem' : 'onCollapseItem')](item);
      },
      /**
       * Найти $-элемент, который отвечает за переключение веток (ищет через closest класс js-controls-TreeView__expand). Используется при клике для определения необходимости переключения веток.
       * @param elem
       * @returns {*}
       * @private
       */
      _findExpandByElement: function(elem) {
         var
            closest;
         if (elem.hasClass('js-controls-TreeView__expand')) {
            return elem;
         } else {
            closest = elem.closest('.js-controls-TreeView__expand');
            return closest.length ? closest : elem;
         }
      },

      _loadFullData: function(deepReload) {
         return this.reload(this.getFilter(), this.getSorting(), 0, 1000, deepReload);
      },
      //********************************//
      //       FolderFooter_Start       //
      //********************************//
      /**
       * Создать футер для веток
       * @param key
       * @private
       */
      _createFolderFooter: function(item) {
         var
            position,
            folderFooter,
            cfg = this._options;

         if (!cInstance.instanceOfModule(item, 'WS.Data/Display/CollectionItem')) {
            item = this._getItemProjectionByItemId(item);
         }

         if (cInstance.instanceOfModule(item, 'WS.Data/Display/TreeItem')) {
            this._destroyItemsFolderFooter(item.getContents().getId());

            if (this._needCreateFolderFooter(item)) {
               position = this._getLastChildByParent(this._getItemsContainer(), item);

               if (typeof cfg._footerWrapperTemplate === "function" && position) {
                  folderFooter = $(cfg._footerWrapperTemplate(cfg._getFolderFooterOptions(cfg, item)));
                  folderFooter.insertAfter(position);
                  this.reviveComponents();
               }
            }
         }
      },
      /**
       * Удалить футер для веток
       * @param items
       * @private
       */
      _destroyItemsFolderFooter: function(key) {
         var folderFooter = this._getFolderFooter(key);
         this._destroyControls(folderFooter);
         folderFooter.remove();
      },

      _getFolderFooter: function(id) {
         return $('.controls-TreeDataGridView__folderFooter' + (id ? '[data-parent="' + id + '"]' : ''), this._container);
      },

      _createAllFolderFooters: function() {
         this._getItemsProjection().each(function(item) {
            if (this._needCreateFolderFooter(item)) {
               this._createFolderFooter(item);
            }
         }.bind(this));
      },

      _needCreateFolderFooter: function (item) {
         var
            model, id, nodeType;

         //В режиме поиска никогда не создаём футеры
         if (this._isSearchMode() || cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem')) {
            return false;
         }
         model = item.getContents();
         id = model && model.get(this._options.idProperty);
         nodeType = model && model.get(this._options.nodeProperty);
         //проверяем на true(папка) и false(скрытый узел). Проверять через item.isNode() неверно, т.к. для скрытых узлов вернётся false.
         return (nodeType === true || nodeType === false) && item.isExpanded() && (this._options.folderFooterTpl || this._options._folderHasMore[id]);
      },
      //********************************//
      //        FolderFooter_End        //
      //********************************//
      _getLastChildByParent: function(itemsContainer, currentItem) {
         var
            current,
            level = currentItem.getLevel(),
            enumerator = this._getItemsProjection().getEnumerator();
         enumerator.setCurrent(currentItem);

         while (enumerator.moveNext()) {
            current = enumerator.getCurrent();

            //Останавливаем поиск если упёрлись в элемент, отличный от записи(нет метода getLevel), или вышли из папки
            if (!current.getLevel || current.getLevel() <= level) {
               //Т.к. нам нужно найти последний дочерний элемент, а мы нашли следующий, переместимся на 1 запись назад.
               enumerator.movePrevious();
               break;
            }
         }

         return $('.controls-ListView__item[data-hash="' + enumerator.getCurrent().getHash() + '"]', itemsContainer.get(0));
      },
      around: {
         _onCollectionRemove: function(parentFunc, items, notCollapsed) {
            var i, item, itemId;
            for (i = 0; i < items.length; i++) {
               item = items[i];
               if (!cInstance.instanceOfModule(item, 'WS.Data/Display/GroupItem')) {
                  itemId = item.getContents().getId();
                  if (!notCollapsed && item.isExpanded()) {
                     delete this._options.openedPath[itemId];
                     item.setExpanded(false);
                     this._destroyItemsFolderFooter(itemId);
                  }
               }
            }
            return parentFunc.call(this, items, notCollapsed);
         },
         /**
          * Обработка изменения item property
          * @param item
          * @param property
          * @private
          */
         _onUpdateItemProperty: function(parentFunc, item, property) {
            parentFunc.call(this, item, property);
            if (property === 'expanded') {
               this._onChangeItemExpanded(item);
            }
            if (item.isNode && item.isNode()) {
               this._createFolderFooter(item);
            }
         }
      },

      before: {
         _keyboardHover: function (e) {
            switch (e.which) {
               case constants.key.m:
                  //Метод moveRecordsWithDialog кидает ошибку, если у кого-то экшен создается в обработчике он ее увидит
                  //и не получится так что тупо не показывается диалог.
                  e.ctrlKey && this.moveRecordsWithDialog();
                  break;
            }
         },
         _clearItems: function(container) {
            if (this._getItemsContainer().get(0) == $(container).get(0) || !container) {
               var self = this;
               this._lastParent = this._options.currentRoot;
               this._lastDrawn = undefined;
               this._lastPath = [];

               self._destroyItemsFolderFooter();
            }
         }
      },
      after : {
         _modifyOptions: function (opts) {
            opts.folderFooterTpl = TemplateUtil.prepareTemplate(opts.folderFooterTpl);
            return opts;
         },
         //TODO: после переход на серверную вёрстку фолдерфутера, данный метод не понадобится
         setOpenedPath: function(openedPath) {
            if (this._getItemsProjection()) {
               for (var key in openedPath) {
                  if (openedPath.hasOwnProperty(key)) {
                     this._createFolderFooter(key);

                  }
               }
            }
         },
         _toggleGroup: function(groupId, flag) {
            var
               groupItems,
               self = this;
            if (this._getItemsProjection()) {
               groupItems = this._getGroupItems(groupId);
               groupItems.forEach(function(item) {
                  if (cInstance.instanceOfModule(item, 'WS.Data/Display/TreeItem')) {
                     if (flag) {
                        self._destroyItemsFolderFooter(item.getContents().get(self._options.idProperty));
                     } else {
                        self._createFolderFooter(item);
                     }
                  }
               });
            }
         }
      },
      _elemClickHandlerInternal: function (data, id, target) {
         var $target = $(target),
             closestExpand = this._findExpandByElement($(target));

         if (closestExpand.hasClass('js-controls-TreeView__expand')) {
            this.toggleNode(id);
            /* Не вызываем активацию item'a при клике на чекбокс */
         } else if(!$target.hasClass('js-controls-ListView__itemCheckBox')) {
            if ((this._options.allowEnterToFolder) && ((data.get(this._options.nodeProperty)))){
               this.setCurrentRoot(id);
               this.reload();
            }
            else {
               this._activateItem(id);
            }
         }
      },

      //Переопределяем метод, чтоб передать тип записи
      _activateItem : function(id) {
         var
            item = this.getItems().getRecordById(id),
            meta = {
               id: id,
               item: item,
               hierField : this._options.parentProperty,
               parentProperty: this._options.parentProperty,
               nodeProperty: this._options.nodeProperty
            };

         this._notify('onItemActivate', meta);
      }
   };

   return TreeViewMixin;
});