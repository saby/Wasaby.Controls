define('js!SBIS3.CONTROLS.MassSelectionHierarchyController',
    [
        'js!SBIS3.CONTROLS.MassSelectionController',
        'js!SBIS3.CONTROLS.HierarchySelection',
        'js!SBIS3.CONTROLS.ArraySimpleValuesUtil',
        'Core/core-clone'
    ],
    function(MassSelectionController, HierarchySelection, ArraySimpleValuesUtil, cClone) {

       var MassSelectionHierarchyController = MassSelectionController.extend(/** @lends SBIS3.CONTROLS.MassSelectionHierarchyController.prototype */ {
          $constructor: function () {
             var linkedObject = this._options.linkedObject;
             this.subscribeTo(linkedObject, 'onDrawItems', this._redrawPartiallySelection.bind(this));
             this.subscribeTo(linkedObject, 'onSelectedItemsChange', this._redrawPartiallySelection.bind(this));
          },

          _createSelection: function() {
             var root = this._options.linkedObject.getRoot();
             return new HierarchySelection({
                projection: this._getProjection(),
                root: root !== undefined ? root : null
             });
          },

          //При добавлении элементов в проекцию добавляем их в набор выделенных записей, если:
          //1) Они находятся в папке, которая является выделенной
          //2) Родительский элемент не является "частично неполнолностью выделенной" (partiallySelected), т.к. такие элменты
          //так же как и "частично полностью выделенные" находятся в массиве выделенных, но дочерние элементы в них не должны выделяться
          //так как "частично неполнолностью выделенной" папка может стать только если она являлась невыделенной, и выделили её
          //дочерний элемент.
          //3) Запись не находится в наборе исключённых записей
          _onProjectionChangeAdd: function (newItems) {
             var
                itemId,
                addSelection = [],
                selection = this._selection.getSelection(true),
                parentProperty = this._options.linkedObject.getParentProperty();
             newItems.forEach(function (item) {
                itemId = item.getContents().get(this._options.idProperty);
                if (ArraySimpleValuesUtil.hasInArray(selection.marked, item.getContents().get(parentProperty)) &&
                   !ArraySimpleValuesUtil.hasInArray(selection.excluded, itemId)) {
                   addSelection.push(itemId);
                }
             }, this);
             if (addSelection.length) {
                this._options.linkedObject.addItemsSelection(addSelection);
             }
          },

          _redrawPartiallySelection: function () {
             var container = this._options.linkedObject.getContainer();

             $('.controls-ListView__item.controls-ListView__item__partiallySelected', container).removeClass('controls-ListView__item__partiallySelected');

             this._selection.getPartiallySelected().forEach(function (id) {
                $('.controls-ListView__item[data-id="' + id + '"]', container).addClass('controls-ListView__item__partiallySelected');
             }.bind(this));
          },

          //Костыль, чтобы при клике на частично выделенную папку снять выделение.
          //Метод используется в SBIS3.CONTROLS.MultiSelectable
          isItemPartiallySelected: function(key) {
             var item = this._selection._markedTree.getRecordById(key);
             return item && item.get('status') !== HierarchySelection.SELECTION_STATUS.SELECTED;
          }
       });

       return MassSelectionHierarchyController;
    });
