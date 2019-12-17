import rk = require('i18n!Controls');
import Control = require('Core/Control');
import template = require('wml!Controls/_MoveDialog/MoveDialog');
import 'css!theme?Controls/_MoveDialog/MoveDialog';

/**
    * Базовый шаблон диалогового окна, используемый в списках при перемещении элементов для выбора целевой папки.
    * - <a href="/doc/platform/developmentapl/interface-development/controls/list-environment/actions/mover-remover/">См. руководство разработчика</a>
    * - <a href="/materials/demo-ws4-operations-panel">См. демо-пример</a>
    * @class Controls/MoveDialog
    * @extends Core/Control
    * @mixes Controls/_interface/IHierarchy
    * @mixes Controls/_interface/IFilter
    * @mixes Controls/_interface/ISource
    * @mixes Controls/_grid/interface/IGridControl
    * @mixes Controls/_treeGrid/interface/ITreeControl
    * @mixes Controls/_list/interface/IList
    * @mixes Controls/_explorer/interface/IExplorer
    * @mixes Controls/interface/INavigation 
    *
    * @mixes Controls/MoveDialog/Styles
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    */

   /*
    * A standard dialog template for selecting a target item for moving items.
    * <a href="/materials/demo-ws4-operations-panel">Demo examples.</a>.
    * @class Controls/MoveDialog
    * @extends Core/Control
    * @mixes Controls/_interface/IHierarchy
    * @mixes Controls/_interface/IFilter
    * @mixes Controls/_interface/ISource
    * @mixes Controls/_grid/interface/IGridControl
    * @mixes Controls/_treeGrid/interface/ITreeControl
    * @mixes Controls/_list/interface/IList
    * @mixes Controls/_interface/ISorting
    * @mixes Controls/_explorer/interface/IExplorer
    * @mixes Controls/interface/INavigation
    *
    * @mixes Controls/MoveDialog/Styles
    * @control
    * @public
    * @author Авраменко А.С.
    * @category List
    */

   /**
    * @name Controls/MoveDialog#displayProperty
    * @cfg {String} Имя поля элемента, данные которого используются для правильной работы <a href="/doc/platform/developmentapl/interface-development/controls/bread-crumbs/">Хлебных крошек</a>.
    */

   /**
    * @name Controls/MoveDialog#root
    * @cfg {String} Идентификатор корневого узла.
    * @default null
    */

   /*
    * @name Controls/MoveDialog#root
    * @cfg {String} Identifier of the root node.
    * @default null
    */

   /**
    * @name Controls/MoveDialog#searchParam
    * @cfg {String} Имя поля, по данным которого происходит поиск.
    * @remark
    * Настройка нужна для правильной работы строки поиска.
    * Значение опции передаётся в контроллер поиска {@link Controls/search:Controller}.
    * Подробнее о работе поиска и фильтрации в Wasaby читайте в <a href="/doc/platform/developmentapl/interface-development/controls/list-environment/filter-search/">руководстве разработчика</a>.
    */

   /**
    * @name Controls/MoveDialog#showRoot
    * @cfg {Boolean} Разрешить перемещение записей в корень иерархии.
    * @remark
    * - true Отображается кнопка "В корень" над списком. Клик по кнопке перемещает записи в корень иерархии (см. <a href="/materials/demo-ws4-operations-panel">демо-пример</a>).
    * - false Кнопка скрыта.
    */ 

   /**
    * @event Controls/MoveDialog#sendResult Происходит при выборе раздела для перемещения записей.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
    * @param {Types/entity:Model} item Раздел, куда перемещаются выбранные записи.
    * @param {Types/collection:RecordSet} movedItems Перемещаемые записи.
    * @remark
    * Выбор раздела производится кликом по записи, кнопкам "Выбрать" и "В корень" (см. {@link showRoot}).
    * Клик по папке не производит выбора раздела для перемещения.
    * Событие всплываемое (см. <a href="/doc/platform/developmentapl/interface-development/ui-library/events/">Работа с событиями</a>).
    * Событие происходит непосредственно перед событием close.
    * @see close
    */ 

   /**
    * @event Controls/MoveDialog#close Происходит при закрытии диалога перемещения записей.
    * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
    * @remark
    * Событие всплываемое (см. <a href="/doc/platform/developmentapl/interface-development/ui-library/events/">Работа с событиями</a>).
    * Событие происходит непосредственно после события sendResult.
    * @see sendResult
    */ 

let MoveDialog = Control.extend({
      _template: template,
      _itemActions: undefined,

      _beforeMount: function(options) {
         this._itemActions = [{
            id: 1,
            title: rk('Выбрать'),
            showType: 2
         }];
         this._root = options.root;

         // TODO: сейчас прикладной программист передает в MoveDialog опцию columns, что плохо, т.к. он может повлиять на
         // отображение колонки, а диалог во всех реестрах должен выглядеть одинаково. Нужно убрать возможно передавать
         // конфигурации колонки и дать возможность настривать имя поля, из которого необходимо брать название папок.
         // Выписана задача: https://online.sbis.ru/opendoc.html?guid=aeaff20a-ee07-4d1b-8a9d-2528a269bc91
         this._columns = options.columns.slice();
         this._columns[0].textOverflow = 'ellipsis';
         this._onItemClick = this._onItemClick.bind(this);
         this._itemsFilterMethod = this._itemsFilterMethod.bind(this);
         this._itemActionVisibilityCallback = this._itemActionVisibilityCallback.bind(this);
      },

      _itemsFilterMethod: function(item) {
         var result = true;

         if (item.get) {
            result = this._options.movedItems.indexOf(item.get(this._options.keyProperty)) === -1;
         }

         return result;
      },

      _itemActionVisibilityCallback: function(action, item) {
         return item.get(this._options.hasChildrenProperty);
      },

      _onItemClick: function(event, item) {
         if (!item.get(this._options.hasChildrenProperty)) {
            this._applyMove(item);
         }
      },

      _onItemActionsClick: function(event, action, item) {
         this._applyMove(item);
      },

      _applyMove: function(item) {
         this._notify('sendResult', [item], {bubbling: true});
         this._notify('close', [], {bubbling: true});
      }
   });

MoveDialog.getDefaultOptions = (): object => {
   return {
      root: null
   };
};

export = MoveDialog;
