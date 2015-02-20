/**
 * @fileoverview Файл с плагином для Control
 *    - DragAndDropPlugin
 * @author nefedovao
 */

define("js!SBIS3.CORE.DragAndDropPlugin", ["js!SBIS3.CORE.Control"], function(){

   "use strict";

   $ws._const.DragAndDropPlugin = {
      recordsMoveOffset: {
         top: 5,
         left: 5
      }
   };

   /**
    * TODO Переписать документацию по использованию на модули
    * Плагин для работы с драг-н-дропом. НЕ ПОДКЛЮЧАЕТ СЕБЯ САМ! Задумано, что сам разработчик будет расширять с его помощью класс, который захочет.
    * @usage
    * В своём контроле/плагине прежде всего стоит прописать запвисимости:
    * <pre>
    *    $ws.single.DependencyResolver.register('Строка с вашим именем контрола или путём до плагина', function(){
    *       return ['/lib/Control/Plugins/ControlDragAndDrop-plugin.js'];
    *    });
    * </pre>
    * А затем подключить плагин драг-н-дропа после его загрузки:
    * <pre>
    *    $ws.core.attach($ws._const.wsRoot + 'lib/Control/Plugins/ControlDragAndDrop-plugin.js').addCallback(function(){
    *       $ws.proto.DataViewAbstract.extendPlugin($ws.proto.Control.DragAndDropPlugin);
    *    });
    * </pre>
    * Для начала работы дра-н-дропа достаточно одной строки:
    * <pre>
    *    this._addDragContainer('селектор элементов, которые можно тащить', container);
    * </pre>
    * Для работы драг-н-дропа следует переопределить следующие методы:
    * 1) _dragStart
    * 2) _isDragAcceptable
    * 3) _dropBlock
    * 4) _dropTarget
    * 5) _dragIn
    * 6) _drop
    *
    * Остальные защищённые методы сделаны для дополнительных действий, их можно переопределять по своему усмотрению.
    *
    * @class $ws.proto.Control.DragAndDropPlugin
    * @extends $ws.proto.Control
    * @plugin
    */
   $ws.proto.Control.DragAndDropPlugin = /** @lends $ws.proto.Control.DragAndDropPlugin.prototype */{
      /**
       * @event onDragStart Перед началом перемещения
       * Событие, происходящее при начале перемещения записей.
       * <wiTag noShow>
       * <wiTag class=HierarchyView page=3>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} records Перемещаемые записи.
       * @returns Можно вернуть:
       * <ol>
       *    <li>False - отказ от перемещения, прерываем процесс;</li>
       *    <li>Любой другой результат - продолжаем перемещение записей;</li>
       * </ol>
       */
      /**
       * @event onDragMove При перемещения записей в какой-то элемент
       * Событие, происходящее при попытке перемещения записей в какой-то элемент.
       * <wiTag noShow>
       * <wiTag class=TreeView page=1>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} records Перемещаемые записи.
       * @param {$ws.proto.Record} record Запись, в которую пытаются переместить.
       * @param {$ws.proto.Control} [from] Из какого браузера начали перетаскивать записи. Будет присутствовать, если записи были получены из другого браузера
       */
      /**
       * @event onDragStop Перед завершением перемещения
       * Событие, происходящее при окончании перемещения. Происходит как при бросании записей из этого браузера, так и в этот.
       * <wiTag noShow>
       * <wiTag class=HierarchyView page=3>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {Array} records перемещаемые записи
       * @param {$ws.proto.Record} record запись, в которую пытаются переместить
       * @param {Boolean} isCorrect окончился ли перенос позитивно
       * @param {$ws.proto.Control} [from] Из какого браузера начали перетаскивать записи
       * @param {$ws.proto.Control} [to] В какой браузер перетащили записи
       */
      /**
       * @event onDragIn При перемещении записей мышью
       * Событие при перемещении записей мышью в браузер.
       * <wiTag noShow>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Control} from Из какого браузера начали перетаскивать записи.
       * @param {Array} records Перемещаемые записи.
       * @return Если в этот браузер можно перетаскивать записи, то нужно вернуть true в обработчике события.
       */
      /**
       * @event onDragOut При перемещении записей мышью вне браузера
       * Событие при перемещении записей мышью вне браузера.
       * <wiTag noShow>
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {$ws.proto.Control} from Из какого браузера начали перетаскивать записи.
       * @param {Array} records Перемещаемые записи.
       * @return Если из этого браузера можно вытаскивать записи, нужно вернуть true в обработчике события.
       */
      $protected: {
         _drag: {
            data: undefined,
            startPoint: {
               x: 0,
               y: 0
            },
            started: false,
            flowObject: undefined,
            dropContainer: undefined,
            onDroppable: false,
            target: undefined,
            dropBlock: undefined,
            dropCorrect: false
         },
         _dropContainer: undefined,
         _dropped: false
      },
      $constructor: function(){
         this._publish('onDragStart', 'onDragMove', 'onDragIn', 'onDragOut', 'onDragStop');
      },
      /**
       * Указывает, что в указанном контейнере может происходить драг-н-дроп. Вызывает {@link _addDropContainer} самостоятельно
       * @param {String} selector   Селектор элементов, которые можно перемещать
       * @param {jQuery} container  Элемент, в котором находятся перемещаемые элементы
       * @protected
       */
      _addDragContainer: function(selector, container){
         $(selector, container.get(0)).live('mousedown', function(event){
            if( event.which !== 1 || !this.isEnabled() ){
               return true;
            }
            var data = this._dragStart($(event.target));
            if( !data ){
               return true;
            }
            this._drag.data = data;
            if( this._notify('onDragStart', data) === false ){
               return true;
            }
            this._drag.startPoint.x = event.clientX;
            this._drag.startPoint.y = event.clientY;
            this._dragStarted(event);
            $(document)
               .bind('mousemove.wsDragNDrop', this._dragMouseMove.bind(this))
               .bind('mouseup.wsDragNDrop', this._dragMouseUp.bind(this));
            return false;
         }.bind(this));
         container.bind('wsDragIn', this._dragDataIn.bind(this));
         container.bind('wsDragOut', this._dragDataOut.bind(this));
         container.bind('wsDragMove', this._dragDataMove.bind(this));
         container.bind('wsDragStop', this._dropData.bind(this));
         this._addDropContainer(container);
      },
      /**
       * Добавляет элемент, в который можно только бросать данные, но не вытаскивать
       * @param {jQuery} container Элемент
       * @protected
       */
      _addDropContainer: function(container){
         this._dropContainer = container.addClass('ws-dropzone');
      },
      /**
       * Обработчик начала переноса записей, должен вернуть данные, которые переносят или false, если переносить нечего/нелья. Этот метод стоит переопределить в своём классе
       * @param {jQuery} target Элемент, который пытаются перенести
       * @returns {*}
       * @protected
       */
      _dragStart: function(target){
      },
      /**
       * Обрабатывает начало перемещения данных, уже после прохождения всех проверок
       * @param {Object} event jQuery-событие
       * @protected
       */
      _dragStarted: function(event){
      },
      /**
       * Можно ли перенести указанные данные в указанный элемент. Этот метод стоит переопределить в своём классе
       * @param {jQuery}            target      Элемент, в который пытаются перенести данные
       * @param {*}                 data        Данные
       * @param {$ws.proto.Control} from        Из какого контрола переносят данные
       * @param {*}                 dropTarget  В какой элемент данных хотят перенести
       * @protected
       */
      _isDragAcceptable: function(target, data, from, dropTarget){
      },
      /**
       * Обрабатывает "бросание" данных в контроле, в который данные переносят. Этот метод стоит переопределить в своём классе
       * @param {jQuery}            to    Элемент, в который переносят данные
       * @param {*}                 data  Данные
       * @param {$ws.proto.Control} from  Из какого контрола переносят данные
       * @protected
       */
      _drop: function(to, data, from){
      },
      /**
       * Возвращает html-элемент, который олицетворяет собой часть модели, в которую будут вставлены данные. К примеру, строка браузера. Метод нужен для оптимизации + уменьшения количества onDragMove. Этот метод стоит переопределить в своём классе
       * @param {jQuery} target Элемент, на который навели мышь
       * @param {Object} event  Событие
       * @return {jQuery}
       * @protected
       */
      _dropBlock: function(target, event){
      },
      /**
       * Элемент модели, "куда" будут перенесены данные. Метод нужен для извещения событий. В браузере этот метод будет возвращать запись
       * @param {jQuery} target Элемент, на который навели мышь
       * @protected
       */
      _dropTarget: function(target){
      },
      /**
       * Обрабатывает "бросание" данных в контроле, из которого переносят данные. Этот метод стоит переопределить в своём классе
       * @param {*}                 data  Данные
       * @param {$ws.proto.Control} [to]  Контрол, в который переносят данные
       * @protected
       */
      _dragEnd: function(data, to){
      },
      /**
       * Можно ли выносить данные из текущего контрола (или можно перемещать только в нём)
       * @return {Boolean}
       * @protected
       */
      _canDragOut: function(){
      },
      /**
       * Обработчик вноса данных в контрол. Возвращает, можно ли вносить в этот контрол указанные данные
       * @param {*}                 data Данные
       * @param {$ws.proto.Control} from Из какого контрола переносят данные
       * @return {Boolean}
       * @protected
       */
      _dragIn: function(data, from){
         this._drag.target = undefined;
      },
      /**
       * Обрабатывает внесение записей (после извещения события {@link onDragIn}. Здесь можно добавлять на элементы выделение, чтобы показать пользователю, что сюда можно "бросать" данные
       * @param {*}                 data Данные
       * @param {$ws.proto.Control} from Из какого контрола принесли данные
       * @protected
       */
      _draggedIn: function(data, from){
      },
      /**
       * Обработчик уноса данных из контрол. Здесь можно убрать выделение с элементов
       * @param {*}                 data Данные
       * @param {$ws.proto.Control} from Из какого контрола переносят данные
       * @protected
       */
      _draggedOut: function(data, from){
      },
      /**
       * Возвращает количество данных для отображения в элементе (около курсора мыши)
       * @param {*} data Данные
       * @return {Number|String}
       * @protected
       */
      _dragDataCount: function(data){
         if( data instanceof Array ){
            return data.length;
         }
         return '';
      },
      /**
       * Добавляет выделение на выбранный элемент, в который можно "бросить" данные
       * @param {jQuery} target Цель
       * @param {Object} event jQuery-событие
       * @protected
       */
      _dragAddHighlight: function(target, event){
      },
      /**
       * Удаляет выделение на элементе, в который могли положить данные
       * @param {jQuery} target Элемент, в который хотели положить данные
       * @protected
       */
      _dragRemoveHighlight: function(target){
      },

      /**
       * Создаёт элемент, который будет двигаться вслед за мышью
       * @param {Object} event Событие
       * @returns {jQuery}
       * @private
       */
      _createDragObject: function(event){
         var count = this._dragDataCount(this._drag.data);
         return $('<div class="ws-dragged"><span class="ws-dragged-count">' +
            count +
            '</span></div>')
            .appendTo($('body'))
            .css({
               'left': event.clientX + $ws._const.DragAndDropPlugin.recordsMoveOffset.left,
               'top': event.clientY + $ws._const.DragAndDropPlugin.recordsMoveOffset.top
            });
      },
      /**
       * Проверяет, унёс ли пользователь мышь достаточно далеко {@link $ws._const#startDragDistance}. Если унёс, создаёт элемент
       * @param {Object} event Событие
       * @returns {Boolean}
       * @private
       */
      _checkDragDistance: function(event){
         if( !this._drag.started ){
            var changeX = Math.abs(event.clientX - this._drag.startPoint.x),
               changeY = Math.abs(event.clientY - this._drag.startPoint.y);
            if( changeX + changeY > $ws._const.startDragDistance ){
               this._drag.flowObject = this._createDragObject(event);
               this._drag.started = true;
            }
            else{
               return true;
            }
         }
         return false;
      },
      /**
       * Обрабатывает найденный контейнер (или не найденный) - извещает события onDragIn, onDragOut, следит за переменными
       * @param {jQuery} dropContainer Область под курсором
       * @private
       */
      _checkDropContainer: function(dropContainer){
         var data = {};
         if( !dropContainer.is(this._drag.dropContainer) ){ //Вынесли из текущего контейнера
            if( !(this._drag.onDroppable === false && dropContainer.size() === 0) ){
               if( this._drag.dropContainer && this._canDragOut() ){
                  data = {
                     data: this._drag.data,
                     from: this
                  };
                  this._drag.dropContainer.trigger('wsDragOut', data);
               }
               if( !dropContainer.size() ){
                  this._drag.onDroppable = false;
               }
               if( data.correct || !this._drag.dropContainer ){ //Тот контрол позволяет вынести данные из себя или его просто нет
                  this._drag.dropContainer = undefined;
                  if( dropContainer.size() && (dropContainer.is(this._dropContainer) || this._canDragOut()) ){
                     data = {
                        data: this._drag.data,
                        from: this
                     };
                     dropContainer.trigger('wsDragIn', data);
                     if(data.correct){ //Другой контрол позволяет вносить данные в себя
                        this._drag.dropContainer = dropContainer;
                        this._drag.onDroppable = true;
                        if(this._dropContainer.is(dropContainer)){
                           this._drag.flowObject.removeClass('ws-dragged-out ws-drop-over');
                        }
                        else{
                           this._drag.flowObject.removeClass('ws-dragged-out').addClass('ws-drop-over');
                        }
                     }
                  }
                  else{
                     this._drag.flowObject.removeClass('ws-drop-over').addClass('ws-dragged-out');
                  }
               }
            }
         }
         else{
            this._drag.onDroppable = true;
         }
      },
      /**
       * Обрабатывает перемещение мыши
       * @param {Object} event Событие
       * @returns {Boolean}
       * @private
       */
      _dragMouseMove: function(event){
         if( this._checkDragDistance(event) ){
            return true;
         }
         $ws.helpers.clearSelection();
         this._drag.flowObject.css({
            'left': event.pageX + $ws._const.DragAndDropPlugin.recordsMoveOffset.left,
            'top': event.pageY + $ws._const.DragAndDropPlugin.recordsMoveOffset.top
         });
         var target = $(event.target);
         if( target.hasClass('ws-dragged') || target.closest('.ws-dragged').length ){
            return true;
         }
         var dropContainer = target.closest('.ws-dropzone');
         this._checkDropContainer(dropContainer);
         if( !this._drag.dropContainer ){
            return false;
         }
         var data = {
            target: target,
            data: this._drag.data,
            from: this,
            event: event
         };
         this._drag.dropContainer.trigger('wsDragMove', data);
         if(data.correct){
            this._drag.target = target;
         }
         else{
            this._drag.target = undefined;
         }
         return false;
      },
      /**
       * Обрабатывает отпускание мыши
       * @private
       */
      _dragMouseUp: function(event){
         $(document).unbind('.wsDragNDrop');
         if( !this._drag.started ){
            this._dragEnd(this._drag.data);
            return;
         }
         $ws.helpers.clearSelection();
         this._drag.flowObject.remove();
         var to,
            data;
         if( this._drag.onDroppable && this._drag.target ){
            data = {
               data: this._drag.data,
               from: this,
               target: this._drag.target,
               correct: this._drag.onDroppable
            };
            this._drag.dropContainer.trigger('wsDragStop', data);
            if( data.correct && this !== data.to ){
               this._notify('onDragStop', this._drag.data, data.dropTarget, true, this, data.to);
               to = data.to;
               if(data.callback && data.callback instanceof Function){
                  data.callback();
               }
            }
            this._drag.onDroppable = false;
         }
         if( this._drag.dropContainer ){
            data = {
               from: this,
               force: true
            };
            this._drag.dropContainer.trigger('wsDragOut', data);
            this._drag.dropContainer = undefined;
         }
         var toRow = $(event.target).closest('[rowkey]');
         this._dragEnd(this._drag.data, toRow.attr('rowkey'));
         this._drag.started = false;
      },
      /**
       * Обработчик на стороне контрола, в который вносят данные
       * @param {Object}   event Событие
       * @param {*}        data  Данные
       * @private
       */
      _dragDataIn: function(event, data){
         var dragData = data.data,
            from = data.from;
         this._drag.dropBlock = undefined;
         if( this._dragIn(dragData, from) && this._notify('onDragIn', from, dragData) !== false ){
            this._draggedIn(dragData, from);
            data.correct = true;
         }
      },
      /**
       * Обработчик на стороне контрола, из которого выносят данные
       * @param {Object}   event Событие
       * @param {*}        data  Данные
       * @private
       */
      _dragDataOut: function(event, data){
         var dragData = data.data,
            from = data.from;
         this._dragRemoveHighlight(this._drag.dropBlock);
         if( this._notify('onDragOut', from, dragData) !== false || data.force ){
            this._draggedOut(dragData, from);
            data.correct = true;
         }
      },
      /**
       * Обработчик на стороне контрола, над элементами которого проносят данные
       * @param {Object}   event Событие
       * @param {*}        data  Данные
       * @private
       */
      _dragDataMove: function(event, data){
         var target = data.target,
             dropBlock = this._dropBlock(target, data.event);
         if( dropBlock == this._drag.dropBlock || (dropBlock && dropBlock.is(this._drag.dropBlock)) ){
            data.correct = this._drag.dropCorrect;
            return;
         }
         if( this._drag.dropBlock ){
            this._dragRemoveHighlight(this._drag.dropBlock);
         }
         this._drag.dropBlock = dropBlock;
         if( !dropBlock ){
            return;
         }
         this._drag.dropCorrect = this._isCorrectDrop(data);
         if( this._drag.dropCorrect ){
            data.correct = true;
            this._dragAddHighlight(dropBlock, data.event);
         }
      },
      /**
       * Можно ли бросить данные в указанный элемент
       * @param {*} data Данные
       * @return {Boolean}
       * @private
       */
      _isCorrectDrop: function(data) {
         var target = data.target,
             dragData = data.data,
             from = data.from,
             dropTarget = this._dropTarget(target);
         return this._isDragAcceptable(target, dragData, from, dropTarget) && this._notify('onDragMove', dragData, dropTarget, from) !== false;
      },
      /**
       * Обработчик бросания данных на стороне контрола, в который бросают данные
       * @param {Object}   event Событие
       * @param {*}        data  Данные
       * @private
       */
      _dropData: function(event, data){
         var dragData = data.data,
            from = data.from,
            target = data.target;
         data.to = this;
         data.dropTarget = this._dropTarget(target);
         if( this._notify('onDragStop', dragData, data.dropTarget, true, from, this) !== false ){
            this._drop(target, dragData, from);
         }
         this._dropped = true;
         setTimeout(function(){
            this._dropped = false;
         }.bind(this), 0);
      }
   };

   return $ws.proto.Control.DragAndDropPlugin;
});