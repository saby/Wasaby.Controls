/* global define */
define('js!WS.Data/Collection/Comparer', [
   'js!WS.Data/Collection/IBind'
], function (
   IBindCollection
) {
   'use strict';

   /**
    * Позволяет сравнить две коллекции до и после набора изменений
    * @class WS.Data/Collection/Comparer
    * @author Мальцев Алексей
    */

   var _arraySplice = Array.prototype.splice,
      _sessionId = 0;

   return {
      _moduleName: 'WS.Data/Collection/Comparer',

      //region Public methods

      /**
       * Запускает сессию изменений коллекции (фиксирует ее состояние до изменений)
       * @param {WS.Data/Collection/IEnumerable} collection Коллекция
       * @param {String} [contentsWrapper] Название метода, возвращающего содержимое элемента коллекции
       * @return {Object}
       */
      startSession: function (collection, contentsWrapper) {
         var items = this._extractItems(collection, contentsWrapper);

         return {
            id: this._getId(),
            before: items.items,
            beforeContents: items.contents
         };
      },

      /**
       * Завершает сессию изменений коллекции (фиксирует ее состояние после изменений)
       * @param {Object} session Сессия изменений
       * @param {WS.Data/Collection/IEnumerable} collection Коллекция
       * @param {String} [contentsWrapper] Название метода, возвращающего содержимое элемента коллекции
       */
      finishSession: function (session, collection, contentsWrapper) {
         var items = this._extractItems(collection, contentsWrapper);

         session.after = items.items;
         session.afterContents = items.contents;
      },

      /**
       * Анализирует изменения в коллекции по завершенной сессии
       * @param {Object} session Сессия изменений
       * @param {WS.Data/Collection/IEnumerable} collection Коллекция
       * @param {Function} callback Функция обратного вызова для каждой пачки изменений
       */
      analizeSession: function (session, collection, callback) {
         //сначала удаление, потому что в listview при удалении/добалении одного элемента он сначала дублируется потом удаляются оба
         var groups = ['removed', 'added', 'replaced', 'moved'],
            changes,
            maxRepeats = Math.max(
               65535,
               groups.length * session.before.length * session.after.length
            ),
            startFrom,
            offset,
            groupIndex,
            groupName,
            groupAction;

         //Информируем об изменениях по группам
         for (groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            //Собираем изменения в пачки (следующие подряд наборы элементов коллекции)
            startFrom = 0;
            offset = 0;
            groupName = groups[groupIndex];
            while(startFrom !== -1) {
               //Очередная пачка
               changes = this._getGroupChanges(
                  groupName,
                  session,
                  collection,
                  startFrom,
                  offset
               );

               //Есть какие-то изменения
               if (changes.newItems.length || changes.oldItems.length) {
                  //Уведомляем
                  if (callback) {
                     groupAction = '';
                     switch(groupName) {
                        case 'added':
                           groupAction = IBindCollection.ACTION_ADD;
                           break;
                        case 'removed':
                           groupAction = IBindCollection.ACTION_REMOVE;
                           break;
                        case 'replaced':
                           groupAction = IBindCollection.ACTION_REPLACE;
                           break;
                        case 'moved':
                           groupAction = IBindCollection.ACTION_MOVE;
                           break;
                     }
                     callback(groupAction, changes);
                  }

                  //Синхронизируем состояние по пачке
                  this._applyGroupChanges(
                     groupName,
                     changes,
                     session
                  );
               }

               //Проверяем, все ли хорошо
               if (changes.endAt !== -1 && changes.endAt <= startFrom) {
                  maxRepeats--;
                  if (maxRepeats === 0) {
                     throw new Error('Endless cycle detected.');
                  }
               }

               //Запоминаем, на чем остановились
               startFrom = changes.endAt;
               offset = changes.offset;
            }
         }
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает уникальный идентификатор сессии
       * @return {Number}
       * @protected
       */
      _getId: function() {
         if (_sessionId > 65534) {
            _sessionId = 0;
         }
         return _sessionId++;
      },

      /**
       * Извлекает элементы коллекции
       * @param {WS.Data/Collection/IEnumerable} collection Коллекция
       * @param {String} [contentsWrapper] Название метода, возвращающего содержимое элемента коллекции
       * @return {Object}
       * @protected
       */
      _extractItems: function (collection, contentsWrapper) {
         var enumerator = collection.getEnumerator(),
            items = [],
            contents = [],
            item;

         enumerator.reset();
         while (enumerator.moveNext()) {
            item = enumerator.getCurrent();
            items.push(item);
            if (contentsWrapper) {
               contents.push(item[contentsWrapper]());
            }
         }

         return {
            items: items,
            contents: contentsWrapper ? contents : null
         };
      },

      /**
       * Возвращает изменения группы
       * @param {String} groupName Название группы
       * @param {Object} session Сессия изменений
       * @param {WS.Data/Collection/IEnumerable} collection Коллекция
       * @param {Number} [startFrom=0] Начать с элемента номер
       * @param {Number} [offset=0] Смещение элеметов в after относительно before
       * @return {Object}
       * @protected
       */
      _getGroupChanges: function (groupName, session, collection, startFrom, offset) {
         session.addedProcessed = session.addedProcessed || [];
         session.removedProcessed = session.removedProcessed || {};

         var before = session.before,
            after = session.after,
            beforeContents = session.beforeContents,
            afterContents = session.afterContents,
            addedProcessed = session.addedProcessed,//индексы новых элементов, которые уже были найдены
            removedProcessed = session.removedProcessed,//индексы удаленных элементов, которые уже были найдены
            newItems = [],
            newItemsIndex = 0,
            oldItems = [],
            oldItemsIndex = 0,
            beforeItem,//элемент до изменений
            beforeIndex,//индекс элемента до изменений
            afterItem,//элемент после изменений
            afterIndex,//индекс элемента после изменений
            exit = false,
            index,
            count = Math.max(before.length, after.length),
            skip,
            lookUp;

         startFrom = startFrom || 0;
         offset = offset || 0;

         for (index = startFrom; index < count; index++) {
            beforeItem = before[index];
            afterItem = after[index];
            switch(groupName) {
               case 'added':
                  //собираем добавленные элементы
                  if (!afterItem) {
                     continue;
                  }
                  afterIndex = index;

                  //ищем индекс с учетом возможных дубликатов
                  skip = 0;
                  lookUp = true;
                  do {
                     beforeIndex = before.indexOf(afterItem, skip);
                     if (beforeIndex === -1) {
                        lookUp = false;
                     } else if (addedProcessed.indexOf(beforeIndex) > -1) {
                        //этот индекс мы уже находили, значит afterItem - дубль, ищем дальше
                        skip = beforeIndex + 1;
                     } else {
                        if (!newItems.length) {
                           //запомним найденный индекс
                           addedProcessed.push(beforeIndex);
                        }
                        lookUp = false;
                     }
                  } while (lookUp);

                  //если элемента не было - добавим его в список новых,
                  //если был - отдаем накопленный список новых, если там что-то есть
                  if (beforeIndex === -1) {
                     //элемент добавлен
                     newItems.push(afterItem);
                     newItemsIndex = newItems.length === 1 ? afterIndex : newItemsIndex;
                  } else if (newItems.length) {
                     exit = true;
                  }
                  break;

               case 'removed':
                  //собираем удаленные элементы
                  if (!beforeItem) {
                     continue;
                  }
                  beforeIndex = index;

                  //ищем индекс с учетом возможных дубликатов
                  skip = 0;
                  lookUp = true;
                  do {
                     afterIndex = after.indexOf(beforeItem, skip);
                     if (afterIndex === -1) {
                        lookUp = false;
                     } else if (removedProcessed[afterIndex]) {
                        //этот индекс мы уже находили, значит beforeItem - дубль, ищем дальше
                        skip = afterIndex + 1;
                     } else {
                        if (!oldItems.length) {
                           //запомним найденный индекс
                           removedProcessed[afterIndex] = true;
                        }
                        lookUp = false;
                     }
                  } while (lookUp);

                  //если элемента не стало - добавим его в список старых,
                  //если остался - отдаем накопленный список старых, если там что-то есть
                  if (afterIndex === -1) {
                     oldItems.push(beforeItem);
                     oldItemsIndex = oldItems.length === 1 ? beforeIndex : oldItemsIndex;
                  } else if (oldItems.length) {
                     exit = true;
                  }
                  break;

               case 'replaced':
                  //собираем замененные элементы
                  if (!beforeContents) {
                     index = -1;
                     exit = true;
                     break;
                  }
                  if (!afterItem) {
                     continue;
                  }
                  afterIndex = index;
                  beforeIndex = before.indexOf(afterItem);
                  //если элемент на месте, но изменилось его содержимое - добавим новый в список новых, а для старого генерим новую обертку, которую добавим в список старых
                  //если остался - отдаем накопленные списки старых и новых, если в них что-то есть
                  if (
                     beforeIndex === afterIndex &&
                     beforeContents[index] !== afterContents[index]
                  ) {
                     //FIXME: convertToItem
                     oldItems.push(collection._getItemsStrategy().convertToItem(beforeContents[index]));
                     newItems.push(afterItem);
                     oldItemsIndex = newItemsIndex = oldItems.length === 1 ? beforeIndex : oldItemsIndex;
                  } else if (oldItems.length) {
                     exit = true;
                  }
                  break;

               case 'moved':
                  //собираем перемещенные элементы
                  if (before.length !== after.length) {
                     throw new Error('The "before" and "after" arrays are not synchronized by the length - "move" can\'t be applied.');
                  }
                  if (beforeItem === afterItem) {
                     if (oldItems.length === 0) {
                        continue;
                     }
                     exit = true;
                     break;
                  }

                  afterIndex = index;
                  beforeIndex = before.indexOf(afterItem, index);
                  if (beforeIndex !== afterIndex) {
                     if (
                        oldItems.length && beforeIndex !== oldItemsIndex + oldItems.length ||
                        newItems.length && afterIndex !== newItemsIndex + newItems.length
                     ) {
                        exit = true;
                     } else {
                        if (oldItems.length === 0) {
                           oldItemsIndex = beforeIndex;
                        }
                        oldItems.push(afterItem);
                        if (newItems.length === 0) {
                           newItemsIndex = afterIndex;
                        }
                        newItems.push(afterItem);
                     }
                  }
                  break;
            }
            if (exit) {
               break;
            }
         }

         return {
            newItems: newItems,
            newItemsIndex: newItemsIndex,
            oldItems: oldItems,
            oldItemsIndex: oldItemsIndex,
            endAt: exit ? index : -1,
            offset: offset
         };
      },

      /**
       * Применяет изменения группы
       * @param {String} groupName Название группы
       * @param {Object} changes Изменения группы
       * @param {Object} session Сессия изменений
       * @protected
       */
      _applyGroupChanges: function (groupName, changes, session) {
         var before = session.before,
            beforeContents = session.beforeContents,
            afterContents = session.afterContents;

         //Производим с before действия согласно пачке изменений
         switch (groupName) {
            case 'added':
               _arraySplice.apply(before, [changes.newItemsIndex, 0].concat(changes.newItems));

               if (session.addedProcessed) {
                  var count = changes.newItems.length,
                     i;
                  for (i = 0; i < session.addedProcessed.length; i++) {
                     if (session.addedProcessed[i] >= changes.newItemsIndex) {
                        session.addedProcessed[i] += count;
                     }
                  }
                  for (i = 0; i < count; i++) {
                     session.addedProcessed.push(changes.newItemsIndex + i);
                  }
               }

               if (beforeContents !== null) {
                  _arraySplice.apply(beforeContents, [changes.newItemsIndex, 0].concat(
                     afterContents.slice(changes.newItemsIndex, changes.newItemsIndex + changes.newItems.length)
                  ));
               }
               break;

            case 'removed':
               before.splice(changes.oldItemsIndex, changes.oldItems.length);
               if (beforeContents !== null) {
                  beforeContents.splice(changes.oldItemsIndex, changes.oldItems.length);
               }

               if (changes.endAt !== -1) {
                  changes.endAt -= changes.oldItems.length;
               }
               break;

            case 'replaced':
               _arraySplice.apply(before, [changes.oldItemsIndex, changes.oldItems.length].concat(changes.newItems));
               if (beforeContents !== null) {
                  _arraySplice.apply(beforeContents, [changes.oldItemsIndex, changes.oldItems.length].concat(
                     afterContents.slice(changes.newItemsIndex, changes.newItemsIndex + changes.newItems.length)
                  ));
               }
               break;

            case 'moved':
               var afterSpliceIndex = changes.oldItemsIndex + changes.oldItems.length > changes.newItemsIndex ?
                  changes.newItemsIndex :
                  changes.newItemsIndex - changes.oldItems.length + 1;

               before.splice(changes.oldItemsIndex, changes.oldItems.length);
               _arraySplice.apply(before, [afterSpliceIndex, 0].concat(changes.newItems));

               if (beforeContents !== null) {
                  beforeContents.splice(changes.oldItemsIndex, changes.oldItems.length);
                  _arraySplice.apply(beforeContents, [afterSpliceIndex, 0].concat(
                     afterContents.slice(changes.newItemsIndex, changes.newItemsIndex + changes.newItems.length)
                  ));
               }

               if (changes.endAt !== -1 && changes.oldItemsIndex < changes.newItemsIndex) {
                  changes.endAt -= changes.oldItems.length;
               }
               break;
         }
      }

      //endregion Protected methods
   };
});
