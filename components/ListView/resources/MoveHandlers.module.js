/**
 * Created by as.suhoruchkin on 21.07.2015.
 */
define('js!SBIS3.CONTROLS.MoveHandlers', ['js!SBIS3.CONTROLS.MoveDialog'], function(MoveDialog) {
   var MoveHandlers = {
      moveRecordsWithDialog: function(records) {
         records = this._getRecordsForMove(records);
         if (records.length) {
            new MoveDialog({
               linkedView: this,
               records: records
            });
         }
      },
      _getRecordsForMove: function(records) {
         if (!Array.isArray(records) || !records.length) {
            records = this.getSelectedKeys().length ? this.getSelectedKeys() :
               this.getSelectedKey() ? [this.getSelectedKey()] : [];
         }
         return records;
      },
      selectedMoveTo: function(moveTo) {
         this._move(this._selectedRecords, moveTo);
      },
      _move: function(records, moveTo) {
         var
            record,
            self = this,
            /*TODO переделать не на ParallelDeferred*/
            deferred = new $ws.proto.ParallelDeferred();
         if (this._checkRecordsForMove(records, moveTo)) {
            for (var i = 0; i < records.length; i++) {
               record = $ws.helpers.instanceOfModule(records[i], 'SBIS3.CONTROLS.Record') ? records[i] : this._dataSet.getRecordByKey(records[i]);
               deferred.push(this._dataSource.move(record, this._options.hierField, moveTo));
            }
            deferred.done().getResult().addCallback(function() {
               if (deferred.getResult().isSuccessful()) {
                  self.removeItemsSelectionAll();
                  self.setCurrentRoot(moveTo);
                  self.reload();
               }
            });
         }
      },
      _checkRecordsForMove: function(records, moveTo) {
         var
            record,
            toMap = this._getParentsMap(moveTo);
         if (moveTo === undefined) {
            return false;
         }
         for (var i = 0; i < records.length; i++) {
            if (typeof records[i] === 'number' && $.inArray(records[i], toMap) !== -1 ||
                typeof records[i] === 'object' && $.inArray(records[i].getKey(), toMap) !== -1) {
               $ws.helpers.alert('Вы не можете переместить запись саму в себя!', {}, this);
               return false;
            }
         }

         if (moveTo !== null) {
            record = this._dataSet.getRecordByKey(moveTo);
            if (record && !record.get(this._options.hierField + '@')) {
               $ws.helpers.alert('Вы не можете перемещать в лист! Выберите другую запись для перемещения!', {}, this);
               return false;
            }
         }
         return true;
      },
      _getParentsMap: function(parentKey) {
         var
            dataSet = this.getDataSet(),
            hierField = this.getHierField(),
            /*
               TODO: проверяем, что не перемещаем папку саму в себя, либо в одного из своих детей.
               В текущей реализации мы можем всего-лишь из метаданных вытащить путь от корня до текущего открытого раздела.
               Это костыль, т.к. мы расчитываем на то, что БЛ при открытии узла всегда вернет нам путь до корня.
               Решить проблему можно следующими способами:
               1. во первых в каталоге номенклатуры перемещение сделано не по стандарту. при нажатии в операциях над записью кнопки "переместить" всегда должен открываться диалог выбора папки. сейчас же они без открытия диалога сразу что-то перемещают и от этого мы имеем проблемы. Если всегда перемещать через диалог перемещения, то у нас всегда будет полная иерархия, и мы сможем определять зависимость между двумя узлами, просто пройдясь вверх по иерархии.
               2. тем не менее это не отменяет сценария обычного Ctrl+C/Ctrl+V. В таком случае при операции Ctrl+C нам нужно запоминать в метаданные для перемещения текущую позицию иерархии от корня (если это возможно), чтобы в будущем при вставке произвести анализ на корректность операции
               3. это не исключает ситуации, когда БЛ не возвращает иерархию до корня, либо пользователь самостоятельно пытается что-то переместить с помощью интерфейса IDataSource.move. В таком случае мы считаем, что БЛ вне зависимости от возможности проверки на клиенте, всегда должна проверять входные значения при перемещении. В противном случае это приводит к зависанию запроса.
            */
            path = dataSet.getMetaData().path,
            toMap = path ? Array.clone(path.getChildItems()) : [];
         var record = dataSet.getRecordByKey(parentKey);
         while (record) {
            parentKey = record.getKey();
            if (toMap.indexOf(parentKey) < 0) {
               toMap.push(parentKey);
            }
            parentKey = dataSet.getParentKey(record, hierField);
            record = dataSet.getRecordByKey(parentKey);
         }
         return toMap;
      }
   };
   return MoveHandlers;
});