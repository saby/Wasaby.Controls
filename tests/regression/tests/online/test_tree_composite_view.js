var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.TreeCompositeView Online', function () {

    gemini.suite('table', function (test) {

        test.setUrl('/regression_treecompositeview_online.html')

            .setCaptureElements('.sbis3-TestTreeCompositeView____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
                this.tree = find('[name="TreeCompositeView 1"]');
                this.tree_id1 = find('[name="TreeCompositeView 1"] [data-id="1"]');
                this.arrow1 = find('[name="TreeCompositeView 1"] [data-id="1"] .controls-TreeView__expand');
                this.citroen_arrow = find('[name="TreeCompositeView 1"] [data-id="1"] .icon-View');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
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
                actions.wait(1000);
            })

            .capture('hovered edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });

    gemini.suite('disabled_table', function (test) {

        test.setUrl('/regression_treecompositeview_online.html')

            .setCaptureElements('.sbis3-TestTreeCompositeView____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
                this.tree = find('[name="TreeCompositeView 1"]');
                this.tree_id1 = find('[name="TreeCompositeView 1"] [data-id="1"]');
                this.arrow1 = find('[name="TreeCompositeView 1"] [data-id="1"] .controls-TreeView__expand');
                this.citroen_arrow = find('[name="TreeCompositeView 1"] [data-id="1"] .icon-View');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').setEnabled(false);
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
                actions.wait(1000);
            })

            .capture('hovered edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });

    gemini.suite('list', function (test) {

        test.setUrl('/regression_treecompositeview_online.html')

            .setCaptureElements('.sbis3-TestTreeCompositeView____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
                this.tree = find('[name="TreeCompositeView 1"]');
                this.tree_id1 = find('[name="TreeCompositeView 1"] [data-id="1"]');
                this.tree_id5 = find('.controls-CompositeView__foldersContainer ~ .controls-ListView__item');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').setViewMode('list');
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').reload();
                });
                actions.wait(1000);
            })

            .capture('plain')

            .capture('hovered folder', function (actions) {
                actions.mouseMove(this.tree_id1);
                actions.wait(1000);
            })

            .capture('hovered folder edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered folder delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.tree_id5);
                actions.wait(1000);
            })

            .capture('hovered item edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered item delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });

    gemini.suite('disabled_list', function (test) {

        test.setUrl('/regression_treecompositeview_online.html')

            .setCaptureElements('.sbis3-TestTreeCompositeView____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
                this.tree = find('[name="TreeCompositeView 1"]');
                this.tree_id1 = find('[name="TreeCompositeView 1"] [data-id="1"]');
                this.tree_id5 = find('.controls-CompositeView__foldersContainer ~ .controls-ListView__item');
                this.moveOption = find('.controls-ItemActions .icon-Move');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').setViewMode('list');
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').reload();
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').setEnabled(false);
                });
                actions.wait(1000);
            })

            .capture('plain')

            .capture('hovered folder', function (actions) {
                actions.mouseMove(this.tree_id1);
            })

            .capture('hovered folder edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered folder delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.tree_id5);
                actions.wait(1000);
            })

            .capture('hovered item edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered item delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });

    gemini.suite('tile', function (test) {

        test.setUrl('/regression_treecompositeview_online.html')

            .setCaptureElements('.sbis3-TestTreeCompositeView____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
                this.tree = find('[name="TreeCompositeView 1"]');
                this.tree_id1 = find('[name="TreeCompositeView 1"] [data-id="1"]');
                this.tree_id5 = find('.controls-CompositeView__foldersContainer ~ .controls-ListView__item');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').setViewMode('tile');
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').reload();
                });
                actions.wait(1000);
            })

            .capture('plain')

            .capture('hovered folder', function (actions) {
                actions.mouseMove(this.tree_id1);
                actions.wait(1000);
            })

            .capture('hovered folder edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered folder delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.tree_id5);
                actions.wait(1000);
            })

            .capture('hovered item edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered item delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });

    gemini.suite('disabled_tile', function (test) {

        test.setUrl('/regression_treecompositeview_online.html')

            .setCaptureElements('.sbis3-TestTreeCompositeView____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeCompositeView 1"]', 40000);
                this.tree = find('[name="TreeCompositeView 1"]');
                this.tree_id1 = find('[name="TreeCompositeView 1"] [data-id="1"]');
                this.tree_id5 = find('.controls-CompositeView__foldersContainer ~ .controls-ListView__item');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').setViewMode('tile');
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').reload();
                    window.$ws.single.ControlStorage.getByName('TreeCompositeView 1').setEnabled(false);
                });
                actions.wait(1000);
            })

            .capture('plain')

            .capture('hovered folder', function (actions) {
                actions.mouseMove(this.tree_id1);
            })

            .capture('hovered folder edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered folder delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })

            .capture('hovered item', function (actions) {
                actions.mouseMove(this.tree_id5);
                actions.wait(1000);
            })

            .capture('hovered item edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered item delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });
});