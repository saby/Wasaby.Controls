var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.CompositeView Online', function () {

    gemini.suite('table', function (test) {

        test.setUrl('/regression_compositeview_online.html')

            .setCaptureElements('.sbis3-TestCompositeViewOnline____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CompositeView 1"]', 40000);
                this.tree_id1 = find('[name="CompositeView 1"] [data-id="1"]');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.tree_id1);
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

        test.setUrl('/regression_compositeview_online.html')

            .setCaptureElements('.sbis3-TestCompositeViewOnline____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CompositeView 1"]', 40000);
                this.tree_id1 = find('[name="CompositeView 1"] [data-id="1"]');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.tree_id1);
            })

            .capture('hovered edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });

    gemini.suite('list', function (test) {

        test.setUrl('/regression_compositeview_online.html')

            .setCaptureElements('.sbis3-TestCompositeViewOnline____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CompositeView 1"]', 40000);
                this.tree_id1 = find('[name="CompositeView 1"] [data-id="1"]');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').setViewMode('list');
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').reload();
                });
                actions.wait(1000);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.tree_id1);
                actions.wait(1000);
            })

            .capture('hovered edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });

    gemini.suite('disabled_list', function (test) {

        test.setUrl('/regression_compositeview_online.html')

            .setCaptureElements('.sbis3-TestCompositeViewOnline____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CompositeView 1"]', 40000);
                this.tree_id1 = find('[name="CompositeView 1"] [data-id="1"]');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').setViewMode('list');
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').reload();
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').setEnabled(false);
                });
                actions.wait(1000);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.tree_id1);
            })

            .capture('hovered edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });

    gemini.suite('tile', function (test) {

        test.setUrl('/regression_compositeview_online.html')

            .setCaptureElements('.sbis3-TestCompositeViewOnline____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CompositeView 1"]', 40000);
                this.tree_id1 = find('[name="CompositeView 1"] [data-id="1"]');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').setViewMode('tile');
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').reload();
                });
                actions.wait(1000);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.tree_id1);
                actions.wait(1000);
            })

            .capture('hovered edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });

    gemini.suite('disabled_tile', function (test) {

        test.setUrl('/regression_compositeview_online.html')

            .setCaptureElements('.sbis3-TestCompositeViewOnline____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CompositeView 1"]', 40000);
                this.tree_id1 = find('[name="CompositeView 1"] [data-id="1"]');
                this.editOption = find('.controls-ItemActions .icon-Edit');
                this.deleteOption = find('.controls-ItemActions .icon-Erase');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').setViewMode('tile');
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').reload();
                    window.$ws.single.ControlStorage.getByName('CompositeView 1').setEnabled(false);
                });
                actions.wait(1000);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.tree_id1);
            })

            .capture('hovered edit-icon', function (actions) {
                actions.mouseMove(this.editOption);
            })

            .capture('hovered delete-icon', function (actions) {
                actions.mouseMove(this.deleteOption);
            })
    });
});