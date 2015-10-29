define('js!SBIS3.CONTROLS.TreeCompositeView', ['js!SBIS3.CONTROLS.TreeDataGridView', 'js!SBIS3.CONTROLS.CompositeViewMixin', 'html!SBIS3.CONTROLS.TreeCompositeView/resources/CompositeView__folderTpl'], function(TreeDataGridView, CompositeViewMixin, folderTpl) {
   'use strict';

   var TreeCompositeView = TreeDataGridView.extend([CompositeViewMixin],/** @lends SBIS3.CONTROLS.TreeCompositeView.prototype*/ {
      /**
       * Контрол отображающий набор данных, имеющих иерархическую структуру, в виде таблицы, плитки или списка
       * @class SBIS3.CONTROLS.TreeCompositeView
       * @extends SBIS3.CONTROLS.TreeDataGridView
       * @mixes SBIS3.CONTROLS.CompositeViewMixin
       * @public
       * @author Крайнов Дмитрий Олегович
       * @control
       * @initial
       * <component data-component='SBIS3.CONTROLS.TreeCompositeView'>
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
       *
       * @demo SBIS3.CONTROLS.Demo.MyTreeCompositeView
       *
       */

      $protected: {
         _options: {
            /**
             * Шаблон, используемый при отрисовке папки
             */
            folderTemplate: undefined
         }
      },

      _elemClickHandler: function (id, data, target) {
         var $target = $(target),
             nodeID,
             handler = function() {
                this._notify('onItemClick', id, data, target);
                this._options.elemClickHandler && this._options.elemClickHandler.call(this, id, data, target);
                nodeID = $target.closest('.controls-ListView__item').data('id');
                if (this._dataSet.getRecordByKey(nodeID).get(this._options.hierField + '@')) {
                   this.setCurrentRoot(nodeID);
                   this.reload();
                }
                else {
                   this._notify('onItemEdit', id, data);
                }
             }.bind(this);

         if (this._options.viewMode == 'table') {
            TreeCompositeView.superclass._elemClickHandler.call(this, id, data, target);
         }
         else {
            if (this._options.multiselect) {
               if ($target.hasClass('js-controls-ListView__itemCheckBox') || $target.hasClass('controls-ListView__itemCheckBox')) {
                  this.toggleItemsSelection([$target.closest('.controls-ListView__item').data('id')]);
               }
               else {
                  handler();
               }
            } else {
               this.setSelectedKeys([id]);
               handler();
            }
         }
      },
      _getItemTemplate: function(item) {
         var resultTpl, dotTpl;
            switch (this._options.viewMode) {
               case 'table': resultTpl = TreeCompositeView.superclass._getItemTemplate.call(this, item); break;
               case 'list': {
                  if (item.get(this._options.hierField + '@')) {
                     dotTpl = this._options.folderTemplate ? this._options.folderTemplate : folderTpl;
                  } else {
                     if (this._options.listTemplate) {
                        if (this._options.listTemplate instanceof Function) {
                           dotTpl = this._options.listTemplate;
                        } else {
                           dotTpl = doT.template(this._options.listTemplate);
                        }
                     }
                     else {
                        dotTpl = doT.template('<div style="{{=it.decorators.apply(it.color, \'color\')}}">{{=it.decorators.apply($ws.helpers.escapeHtml(it.item.get(it.description)))}}</div>');
                     }
                  }
                  resultTpl = dotTpl({
                     item: item,
                     decorators: this._decorators,
                     color: this._options.colorField ? item.get(this._options.colorField) : '',
                     description: this._options.displayField,
                     image: this._options.imageField
                  });
                  break;
               }
               case 'tile' : {
                  if (item.get(this._options.hierField + '@')) {
                     dotTpl = this._options.folderTemplate ? this._options.folderTemplate : folderTpl;
                  } else {
                     if (this._options.tileTemplate) {
                        if (this._options.tileTemplate instanceof Function) {
                           dotTpl = this._options.tileTemplate;
                        } else {
                           dotTpl = doT.template(this._options.tileTemplate);
                        }
                     }
                     else {
                        var src;
                        if (!item.get(this._options.imageField)) {
                           src = item.get(this._options.hierField + '@') ? $ws._const.resourceRoot + 'SBIS3.CONTROLS/themes/online/img/defaultFolder.png' : $ws._const.resourceRoot + 'SBIS3.CONTROLS/themes/online/img/defaultItem.png';
                        } else {
                           src = '{{=it.item.get(it.image)}}';
                        }
                        dotTpl = doT.template('<div><div class="controls-ListView__itemCheckBox js-controls-ListView__itemCheckBox"></div><img class="controls-CompositeView__tileImg" src="' + src + '"/><div class="controls-CompositeView__tileTitle" style="{{=it.decorators.apply(it.color, \'color\')}}">{{=it.decorators.apply($ws.helpers.escapeHtml(it.item.get(it.description)))}}</div></div>');
                     }
                  }
                  resultTpl = dotTpl({
                     item: item,
                     decorators: this._decorators,
                     color: this._options.colorField ? item.get(this._options.colorField) : '',
                     description: this._options.displayField,
                     image: this._options.imageField
                  });
                  break;
               }

            }
            return resultTpl;
      },
      _updateEditInPlaceDisplay: function() {
         if(this.getViewMode() === 'table') {
            TreeCompositeView.superclass._updateEditInPlaceDisplay.apply(this, arguments);
         }
      },
      _getTargetContainer: function (item) {
         if (this.getViewMode() != 'table' && item.get(this._options.hierField + '@')) {
            return  $('.controls-CompositeView__foldersContainer',this._container);
         }
         return this._getItemsContainer();
      },
      _getItemActionsPosition: function(hoveredItem) {
         var itemActions = this.getItemsActions().getContainer(),
             viewMode = this.getViewMode(),
             //FIXME в версии 3.7.3.20 будет приходить рекорд, надо это использовать
             horAlign = viewMode === 'table' || (!this.getDataSet().getRecordByKey(hoveredItem.key).get(this._options.hierField + '@') && viewMode === 'list'),
             height;

         itemActions[horAlign ? 'removeClass' : 'addClass']('controls-ItemActions-verAlign');
         height = itemActions[0].offsetHeight || itemActions.height();

         return {
            top: horAlign ?
                   hoveredItem.position.top + ((hoveredItem.size.height > height) ? hoveredItem.size.height - height : 0 ) :
                   hoveredItem.position.top,
            right: viewMode === 'table' ? 5 : this._container[0].offsetWidth - (hoveredItem.position.left + hoveredItem.size.width)
         };
      },
      _processPaging: function() {
         TreeCompositeView.superclass._processPaging.call(this);
         this._processPagingStandart();
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
            currentDataSet,
            currentRecord,
            needRedraw,
            parentBranch,
            dependentRecords,
            recordsGroup = {},
            branchesData = {},
            container = this.getContainer(),
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
                     if (result.$row.hasClass('controls-ListView__folder')) {
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
               var record = needRedraw ? dataSet.getRecordByKey(row.key) : false;
               //Если запись найдена в обновленном DataSet, то перерисовываем её
               if (record) {
                  currentDataSet.getRecordByKey(row.key).merge(record);
                  self.redrawRow(record);
               } else { //Иначе - удаляем запись
                  currentDataSet.removeRecord(row.key);
                  self.destroyFolderToolbar(row.key);
                  row.$row.remove();
                  //Если количество записей в текущем DataSet меньше, чем в обновленном, то добавляем в него недостающую запись
                  if (needRedraw && currentDataSet.getCount() < dataSet.getCount()) {
                     record = dataSet.getRecordByKey(dataSet.getRecordKeyByIndex(dataSet.getCount() - recordOffset));
                     currentDataSet.addRecord(record);
                     self._drawItems([record]);
                  }
               }
            },
            //Метод для удаления и перерисовки
            removeAndRedraw = function(row, recordOffset) {
               //Если есть дочерние, то для каждого из них тоже зовем removeAndRedraw
               if (row.childs && row.childs.length) {
                  $ws.helpers.forEach(row.childs, function(childRow, idx) {
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
                  return new $ws.proto.Deferred()
                     .addCallback(function() {
                        return branchesData[branchId];
                     })
                     .callback();
               } else {
                  filter['Раздел'] = branchId === 'null' ? null : branchId;
                  var limit;
                  //проверяем, является ли обновляемый узел корневым, если да, обновляем записи до подгруженной записи (_infiniteScrollOffset)
                  if ( String(self._curRoot) == branchId  &&  self._infiniteScrollOffset) { // т.к. null != "null", _infiniteScrollOffset проверяем на случай, если нет подгрузки по скроллу
                     limit = self._infiniteScrollOffset;
                  } else if (self._limit !== undefined) {
                     limit = (self._folderOffsets.hasOwnProperty(branchId) ? self._folderOffsets[branchId] : 0) + self._limit;
                  }
                  return self._dataSource.query(filter, self._sorting, self._offset, limit)
                     .addCallback(function(dataSet) {
                        branchesData[branchId] = dataSet;
                        return dataSet;
                     });
               }
            };
         $ws.helpers.toggleIndicator(true);
         if (items) {
            currentDataSet = this.getDataSet();
            filter = $ws.core.clone(this._filter);
            //Группируем записи по веткам (чтобы как можно меньше запросов делать)
            $ws.helpers.forEach(items, function(item) {
               //todo Сделать опредение родительского ключа через DataSet
               parentBranch = container.find('[data-id="' + item + '"]').attr('data-parent') || 'null';
               if (!recordsGroup[parentBranch]) {
                  recordsGroup[parentBranch] = [];
               }
               recordsGroup[parentBranch].push(item);
            });
            $ws.helpers.forEach(recordsGroup, function(branch, branchId) {
               //Загружаем содержимое веток
               getBranch(branchId)
                  .addCallback(function(branchDataSet) {
                     $ws.helpers.forEach(branch, function(record, idx) {
                        currentRecord = currentDataSet.getRecordByKey(record);
                        dependentRecords = findDependentRecords(record, branchId);
                        needRedraw = !!branchDataSet.getRecordByKey(record);
                        //Удаляем то, что надо удалить и перерисовываем то, что надо перерисовать
                        removeAndRedraw(dependentRecords, branch.length - idx);
                     })
                  })
                  .addBoth(function() {
                     $ws.helpers.toggleIndicator(false);
                  });
            });
         }
      }

   });

   return TreeCompositeView;

});