define('js!SBIS3.CONTROLS.TreeViewMixin', [
   "Core/constants",
   'js!SBIS3.CONTROLS.TreePaging',
   "js!SBIS3.CONTROLS.Utils.TemplateUtil",
   "Core/helpers/collection-helpers",
   "Core/core-instance"
], function ( constants, TreePaging, TemplateUtil, colHelpers, cInstance) {


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
         return {
            pageSize: cfg.pageSize,
            hasMore: cfg._hasNextPageInFolder(cfg, cfg._folderHasMore[key], key),
            id: key,
            handlers: {
               'onClick': function () {
                  this.sendCommand('loadNode', key);
               }
            }
         }
      },
      hasFolderFooters = function(cfg) {
         return cfg._footerWrapperTemplate && cfg.folderFooterTpl;
      };

   /**
    * Позволяет контролу отображать данные имеющие иерархическую структуру и работать с ними.
    * @mixin SBIS3.CONTROLS.TreeViewMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    *
    * @cssModifier controls-ListView__item-without-child Класс добавляется к визуальному представлению папки, у которой отсутствуют дочерние элементы.
    * @cssModifier controls-ListView__hideCheckBoxes-leaf Скрывает отображение чекбоксов у листьев. Подробнее о данном типе записей списка читайте в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
    * @cssModifier controls-ListView__hideCheckBoxes-node Скрывает чекбоксы у папок (узлов и скрытых узлов). Подробнее о данном типе записей списка читайте в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/workdata/structure/vocabl/tabl/relations/#hierarchy">Иерархия</a>.
    */

   var TreeViewMixin = /** @lends SBIS3.CONTROLS.TreeViewMixin.prototype */{
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
             * Подробный пример использования футера для решения этой прикладной задачи вы можете найти в разделе {@link /doc/platform/developmentapl/interfacedev/components/list/list-settings/records-editing/edit-in-place/users/add-in-place-hierarchy/ Добавление по месту в иерархическом списке}.
             * @see SBIS3.CONTROLS.List#footerTpl
             */
            folderFooterTpl: undefined,
            /**
             * @cfg {String} Разрешено или нет перемещение элементов "Drag-and-Drop"
             * @variant "" Запрещено
             * @variant allow Разрешено
             * @variant onlyChangeOrder Разрешено только изменение порядка
             * @variant onlyChangeParent Разрешено только перемещение в папку
             * @example
             * <pre>
             *     <option name="itemsDragNDrop">onlyChangeParent</option>
             * </pre>
             */
            itemsDragNDrop: 'allow'
         }
      },
      /**
       * Возвращает id текущей активной ноды по следующему алогоритму:
       * - Если активна открытая папка - возвращает ее id
       * - Если активен элемент, внутри открытой папки, id этой папки
       * - В остальных случаях вернет id текущей папки
       * @returns {Boolean} Возвращает признак является ли кнопкой по умолчанию.*/
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
         this._createFolderFooter(expandedItem.getContents().getId());
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
      _createFolderFooter: function(key) {
         var
            folderFooter,
            cfg = this._options,
            itemProj = this._getItemProjectionByItemId(key),
            position = this._getLastChildByParent(this._getItemsContainer(), itemProj);

         this._destroyItemsFolderFooter(key);
         if (typeof cfg._footerWrapperTemplate === "function" && position) {
            folderFooter = $(cfg._footerWrapperTemplate(cfg._getFolderFooterOptions(cfg, itemProj)));
            folderFooter.insertAfter(position);
            this.reviveComponents();
         }
      },
      /**
       * Удалить футер для веток
       * @param items
       * @private
       */
      _destroyItemsFolderFooter: function(key) {
         var
            inst,
            controls,
            folderFooter = this._getFolderFooter(key);

            if (folderFooter.length) {
               controls = folderFooter.find('.ws-component');
               for (var j = 0; j < controls.length; j++) {
                  inst = controls[j].wsControl;
                  inst.destroy && inst.destroy();
               }
               folderFooter.remove();
            }
      },

      _getFolderFooter: function(id) {
         return $('.controls-TreeDataGridView__folderFooter' + (id ? '[data-parent="' + id + '"]' : ''), this._container);
      },

      _getTreePager: function(id) {
         return $('.controls-TreePager[data-id="' + id + '"]', this._container).wsControl();
      },

      _createAllFolderFooters: function() {
         this._getItemsProjection().each(function(item) {
            if (this._needCreateFolderFooter(item)) {
               this._createFolderFooter(item.getContents().getId());
            }
         }.bind(this));
      },

      _needCreateFolderFooter: function(item) {
         var
             model = item.getContents(),
             id = model && model.get(this._options.idProperty);
         return item.isNode() && item.isExpanded() && (this._options.folderFooterTpl || this._options._folderHasMore[id]);
      },
      //********************************//
      //        FolderFooter_End        //
      //********************************//
      _getLastChildByParent: function(itemsContainer, parent) {
         var
             lastContainer,
             currentContainer;
         currentContainer = $('.controls-ListView__item[data-hash="' + parent.getHash() + '"]', itemsContainer.get(0));
         while (currentContainer.length) {
            lastContainer = currentContainer;
            currentContainer =  $('.controls-ListView__item[data-parent-hash="' + currentContainer.attr('data-hash') + '"]', itemsContainer.get(0)).last();
         }
         return lastContainer;
      },
      instead: {
         _notifyOnDragMove: function(target, insertAfter) {
            //Если происходит изменение порядкового номера и оно разрешено или если происходит смена родителся и она разрешена, стрельнём событием
            if (typeof insertAfter === 'boolean' && this._options.itemsDragNDrop !== 'onlyChangeParent' || insertAfter === undefined && this._options.itemsDragNDrop !== 'onlyChangeOrder') {
               return this._notify('onDragMove', this.getCurrentElement().keys, target.data('id'), insertAfter) !== false;
            }
         }
      },
      around: {
         _onCollectionRemove: function(parentFunc, items, notCollapsed, groupId) {
            var i, item, itemId;
            for (i = 0; i < items.length; i++) {
               item = items[i];
               itemId = item.getContents().getId();
               if (!notCollapsed && item.isExpanded()) {
                  delete this._options.openedPath[itemId];
                  item.setExpanded(false);
                  this._destroyItemsFolderFooter(itemId);
               }
            }
            return parentFunc.call(this, items, notCollapsed, groupId);
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
         },
         _getDirectionOrderChange: function(parentFunc, e, target) {
            if (this._options.itemsDragNDrop !== 'onlyChangeParent') {
               return parentFunc.call(this, e, target);
            }
         }
      },

      before: {
         _clearItems: function(container) {
            if (this._getItemsContainer().get(0) == $(container).get(0) || !container) {
               var self = this;
               this._lastParent = this._options._curRoot;
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
               colHelpers.forEach(openedPath, function (val, key) {
                  this._createFolderFooter(key);
               }.bind(this));
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