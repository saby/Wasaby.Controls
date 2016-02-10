define('js!SBIS3.CONTROLS.DEMO.AddInPlaceInTree',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.DEMO.AddInPlaceInTree',
        'js!SBIS3.CONTROLS.Data.Source.SbisService',
        'js!SBIS3.CONTROLS.TreeDataGridView',
        'js!SBIS3.Engine.Browser',
        'js!SBIS3.CONTROLS.OperationsPanelButton',
        'js!SBIS3.CONTROLS.NumberTextBox',
        'js!SBIS3.CONTROLS.TextBox',
        'js!SBIS3.CORE.CoreValidators',
        'html!SBIS3.CONTROLS.DEMO.AddInPlaceInTree/resources/FolderFooterTpl'
    ],
    function(CompoundControl, dotTplFn, SbisService) {
        /**
         * SBIS3.CONTROLS.DEMO.AddInPlaceInTree
         * @class SBIS3.CONTROLS.DEMO.AddInPlaceInTree
         * @extends $ws.proto.CompoundControl
         * @control
         * @public
         */
        var AddInPlaceInTree = CompoundControl.extend(/** @lends SBIS3.CONTROLS.DEMO.AddInPlaceInTree.prototype */{
            _dotTplFn: dotTplFn,
            $protected: {
                _options: {

                }
            },
            $constructor: function() {
            },

            init: function() {
                AddInPlaceInTree.superclass.init.call(this);
                this.getChildControlByName('panelsButton').setLinkedPanel(this.getChildControlByName('browserOperationsPanel'));
                var view = this.getChildControlByName('Browser').getView(),
                // инициализируем источник данных БЛ
                    dataSource = new SbisService({
                        service: 'Product',
                        formatMethodName: 'Создать'
                    });

                view.setDataSource(dataSource); // устанавливаем источник данных для таблицы
            },
            onBeginEdit: function(e, model) {
                if (model.get(this.getHierField() + '@')) {
                    e.setResult(false);
                }
            },
            sendAddItem: function() {
                var
                    nodeType = this.getName().indexOf('Folder') !== -1 ? true : null;
                this.sendCommand('beginAdd', {
                    nodeType: nodeType,
                    initiator: this
                });
            }
        });

        return AddInPlaceInTree;
    });