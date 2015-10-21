var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.TreeDataGrid Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_treedatagrid_online.html').setCaptureElements('.sbis3-TestTreeDataGrid____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGrid 1"]', 40000);
                this.tree = find('[name="TreeDataGrid 1"]');
                this.tree_id1 = find('[name="TreeDataGrid 1"] [data-id="1"]');
                this.arrow1 = find('[name="TreeDataGrid 1"] [data-id="1"] .controls-TreeView__expand');
                this.citroen_arrow = find('[name="TreeDataGrid 1"] [data-id="1"] .icon-View');
                this.tree_id1 = find('[name="TreeDataGrid 1"] [data-id="1"]');
                this.editOption = find('.controls-ItemActions .icon-Edit')
                this.deleteOption = find('.controls-ItemActions .icon-Erase')
                this.path = find('.controls-PathSelector__title')
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.tree_id1);
                actions.wait(1000);
            })

			/*
            .capture('hovered citroen arrow', function (actions) {
                actions.mouseMove(this.citroen_arrow);
            })*/

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.arrow1);
            })

            .capture('hovered edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })

            .capture('clicked arrow', function (actions) {
                actions.click(this.arrow1);
            })
    });

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_treedatagrid_online.html').setCaptureElements('.sbis3-TestTreeDataGrid____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGrid 1"]', 40000);
                this.tree = find('[name="TreeDataGrid 1"]');
                this.tree_id1 = find('[name="TreeDataGrid 1"] [data-id="1"]');
                this.arrow1 = find('[name="TreeDataGrid 1"] [data-id="1"] .controls-TreeView__expand');
                this.citroen_arrow = find('[name="TreeDataGrid 1"] [data-id="1"] .icon-View');
                this.editOption = find('.controls-ItemActions .icon-Edit')
                this.deleteOption = find('.controls-ItemActions .icon-Erase')
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeDataGrid 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.tree_id1);
            })

			/*
            .capture('hovered citroen arrow', function (actions) {
                actions.mouseMove(this.citroen_arrow);
            })*/

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.arrow1);
            })

            .capture('hovered edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });
});