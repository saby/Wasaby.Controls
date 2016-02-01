define('js!SBIS3.ENGINE.RecordsMarkPlugin.DialogSelector',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.ENGINE.RecordsMarkPlugin.DialogSelector',
      'js!SBIS3.ENGINE.RecordsMarkPlugin',
      'css!SBIS3.ENGINE.RecordsMarkPlugin.DialogSelector',
      'js!SBIS3.CORE.TableView',
      'js!SBIS3.CORE.Button',
      'js!SBIS3.CORE.AtPlaceEditPlugin', 'js!SBIS3.CORE.LinkButton', 'js!SBIS3.CORE.LadderPlugin', 'js!SBIS3.CORE.ResultsPlugin', 'js!SBIS3.CORE.ScrollPaging'],
   function(CompoundControl, dotTplFn, plugin) {
   /**
    * SBIS3.CORE.RecordsMarkMain
    * @class SBIS3.CORE.RecordsMarkMain
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CORE.RecordsMarkMain.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            autoHeight: true,
            autoWidth: true,
            name: 'DialogSelector',
            allowChange: true,
            filterEdition: false,
            massOperation: false,
            existMarkedRecords: false,
            records: []
         },
         _colorTable: null,
         _linkedBrows: null,
         _opener: null,
         _recordsMarkOptions: null,
         _container: null,
         _marksContainer: null,
         _colorElements: null,
         _fontElements: null,
         _addEmptyMessage: null,
         _openerRecord: null,
         _markSettings: null
      },
      $constructor: function() {
         this._publish('onApply');
      },

      _getLinkedBrowser: function() {
         return this.getTopParent().getOpener();
      },

      _appendUserMark: function(option, result){
         var
            area = this,
            options = area._recordsMarkOptions.userMarks,
            row = $('<div class="recordsMarkPlugin-DialogSelector__userMarkRow ws-customView__element"></div>'),
            icon, title;
         if (result){
            icon = option.iconApply;
            title = option.titleApply;
         }
         else{
            icon = option.iconReset;
            title = option.titleReset;
         }
         if (icon.indexOf('sprite:') > -1) {
            icon = icon.split('sprite:')[1];
         }
         icon = icon.replace('24', '16');
         icon = icon.replace('32', '16');
         row.append('<div class="' + icon + ' recordsMarkPlugin-DialogSelector__userMarkRow_icon"></div>');
         row.append('<div class="recordsMarkPlugin-DialogSelector__userMarkRow_title ellipsis">' + title + '</div>');
         row.bind('click', function () {
            option.setHandler.call(area._linkedBrows, [area._record], result);
            area.getParent().close();
         });
         area._userMarksContainer.append(row);
      },

      _addUserMarks: function(){
         var
            area = this,
            options = area._recordsMarkOptions.userMarks,
            result;
         area._userMarksContainer = this._container.find('.userMarksContainer');
         $ws.helpers.forEach(options, function(option){
            if (!area._options.massOperation) {
               result = option.stateHandler.call(area._linkedBrows, [area._record]);
               if (result || (result === undefined)) {
                  area._appendUserMark(option, true);
               }
               else {
                  area._appendUserMark(option, false);
               }
            }
            else{
               area._appendUserMark(option, true);
               area._appendUserMark(option, false);
            }
         });
      },

      _initTable: function(table) {
         var
            area = this,
            filter = table.getQuery();
         filter['Object'] = area._recordsMarkOptions.object;
         table.setQuery(filter);
         table.getLinkedContext().setValue('Object', area._recordsMarkOptions.object);

         if (area._notReadOnly) {
            table.subscribe('onBeforeSave', function (event, record) {
               var
                  spec = {},
                  coeff = area._colorElements.index(area._colorElements.parent().children('.marked'));
               spec.color = plugin.definedColors[coeff];
               if (area._fontElements.eq(0).hasClass('markedLetter')) {
                  spec.isBold = true;
               }
               if (area._fontElements.eq(1).hasClass('markedLetter')) {
                  spec.isItalic = true;
               }
               if (area._fontElements.eq(2).hasClass('markedLetter')) {
                  spec.isUnderline = true;
               }
               if (area._fontElements.eq(3).hasClass('markedLetter')) {
                  spec.isStrike = true;
               }
               if (coeff === -1 && plugin.specToNumber(spec) === 0){
                  event.setResult(false);
                  $ws.core.alert("Выберите цвет или стиль для вида пометки.");
               }
               else{
                  record.set('Code', plugin.specToNumber(spec));
                  record.set('Object', area._recordsMarkOptions.object);
                  /**
                   * Событие на изменение отметки, можно не перезагружать браузер.
                   * record - измененая отметка
                   */
                  if ( area._linkedBrows._notify('onBeforeEditMark', record, 'edit') === false ) {
                     return;
                  }

                  area._linkedBrows.reload();
               }
            });

            table.subscribe('onAfterLoad', function (event, record) {
               if (table.getRecordSet().getRecordCount() === 0) {
                  area._addEmptyMessage.show();
                  table.hide();
               }
               else {
                  area._markSettings.show();
               }
            });

            table.addRowOption({
               'title': 'Редактировать',
               'name': 'editColorMark',
               'icon': 'sprite:icon-16 icon-Edit icon-primary',
               'callback': function (record, row) {
                  area._dontNeedShowSettings = true;
                  area._addNewRecord = true;
                  if (table._addAtPlaceRecord){
                     table._addAtPlaceCancel();
                  }
                  else{
                     table._editTdCancel();
                     table.refresh();
                  }
                  table.sendCommand('edit', record.getKey());
               },
               'isMainOption': true,
               'weight': 5
            });

            table.subscribe('onBeforeDelete', function(event, records){
               area._dontNeedShowSettings = true;
               area._addNewRecord = false;
               /**
                * Считаем что удаление записи это тоже изменение
                * var eventResult = false - Стандартная логика не требуется
                * ToDo Когда доработаете удаление не задубте завязаться на результат события
                */
               var eventResult = area._linkedBrows._notify('onBeforeEditMark', records, 'delete');
               //if (eventResult === false) {return}
            });

            table.subscribe('onBeforeSave', function(){
               area._dontNeedShowSettings = true;
            });
         }

         table.subscribe('onRowClick', function (event, row, record) {
            event.setResult(false);
            area._notify('onApply', record.getKey());
            area.getTopParent().close();
         });
      },

      _initTableForFilter: function(table){
         var
            area = this,
            fieldLink = area.getParent().getOpener(),
            parent = fieldLink.getTopParent(),
            filter = table.getQuery();
         filter['Object'] = fieldLink._options.object;
         table.setQuery(filter);
         table.subscribe('onRowClick', function (event, row, record) {
            event.setResult(false);
            var
               linkName = parent.getContainer().find('.recordsMarkLinkField__VisualColorLink'),
               nameCod = this.getTopParent().getOpener();
            linkName.text(record.get('Name'));
            nameCod._stringValue = record.get('Name');
            nameCod._value = record.getKey();
            parent.getChildControlByName('ResetButton').show();
            plugin.colorizeElement(record, linkName);
            area.getTopParent().close();
            return false;
         });
      },

      _initDefaultButton: function(){
         var
            area = this,
            defaultButton = area._container.find('.recordsMarkPlugin-DialogSelector__SetDefaultButton');
         if (area._recordsMarkOptions.defaultColorClass){defaultButton.children().addClass(area._recordsMarkOptions.defaultColorClass);}
         defaultButton.show();
         defaultButton.unbind().bind('click', function(){
            area._notify('onApply', null);
            area.getParent().close();
         });
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         var area = this;
         area._colorTable = area.getChildControlByName('ColorTable');
         area._notReadOnly = ($ws.single.RightsManager.checkRights(['Настройка пометок записей'])['Настройка пометок записей'].access === 2);
         if (!area._options.filterEdition) {
            area._linkedBrows = area._getLinkedBrowser();
            area._record = area._linkedBrows.getActiveRecord();
            area._recordsMarkOptions = area._linkedBrows.getRecordsMarkOptions();
            area._container = area.getContainer();
            area._addEmptyMessage = area._container.find('.addEmptyMessage');
            area._linkedBrowsRecord = area._linkedBrows.getActiveRecord();
            area._markSettings = area._notReadOnly ? area.getChildControlByName('MarkSettings') : null;
            area._deleteMark = area.getChildControlByName('DeleteMark');
            area._massRecords = !area._options.massOperation ? [area._record] : area._options.records;

            //добавление пользовательских опций
            if (area._recordsMarkOptions.userMarks.length > 0) {
               area._linkedBrows._notify('onBeforeAppendUserMarks', area._record, area._recordsMarkOptions);
               area._addUserMarks();
               //показываем "снять все пометки", если есть хотя бы одна пользольвательская пометка
               area._deleteMark.show();
               //при нажатии на "снять все пометки" пробегаем по всем пользовательским пометкам
               //и вызываем у них функции "setHandler" с параметром false
               //также сбрасываем отметку цветом
               area._deleteMark.subscribe('onActivated', function () {
                  $ws.helpers.forEach(area._recordsMarkOptions.userMarks, function (option) {
                     option.setHandler.call(area._linkedBrows, [area._record], false);
                     area._notify('onApply', null);
                     area.getParent().close();
                  });
               });
            }

            //инициализация кнопки "цвет по умолчанию"
            if ((area._record.get('ColorMarkCode') || (area._record.get('ColorMarkCode') === 0)) || (area._options.existMarkedRecords)){
               area._initDefaultButton();
            }

            //клик по кнопке "добавить" в тексте при пустом браузере отметок
            area._container.find('.addToEmptyTable').unbind().bind('click', function () {
               var button = $(this);
               button.parent().hide();
               area._colorTable.show();
               area._colorTable.sendCommand('newItem');
            });

            //инициализация таблицы с вариантами отметки
            area._initTable(area._colorTable);

            if (area._notReadOnly){
               area._markSettings.subscribe('onActivated', function(){
                  area._colorTable.sendCommand('newItem');
               });
            }
         }
         else{
            area._initTableForFilter(area._colorTable);
         }
      },

      renderNameColomn: function(record){
         var
            area = this.getParent(),
            res = $('<div class="colorName ellipsis"></div>'),
            spec = plugin.specToNumber(record.get('Code'));
         res.addClass(plugin.appendSpec(spec));
         res.text(record.get('Name'));
         return res;
      }

   });
   moduleClass.dimensions = {
      resizable: false
   };
   return moduleClass;
});