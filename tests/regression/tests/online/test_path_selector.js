var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.PathSelector Online', function () {

    gemini.suite('short', function (test) {

        test.setUrl('/regression_pathselector_online.html').setCaptureElements('.controls-PathSelector')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGrid 1"]', 40000);
                this.tree_id1 = find('[name="TreeDataGrid 1"] [data-id="1"]');
                this.path = find('.controls-PathSelector__title')
            })

            .capture('plain', function (actions) {
                actions.click(this.tree_id1);
                actions.wait(500);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.path);
                actions.wait(500);
            })
    });

    gemini.suite('long', function (test) {

        test.setUrl('/regression_pathselector_online.html').setCaptureElements('.controls-PathSelector')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGrid 1"]', 40000);
                this.tree_id2 = find('[name="TreeDataGrid 1"] [data-id="2"]');
                this.path = find('.controls-PathSelector__title')
            })

            .capture('plain', function (actions) {
                actions.click(this.tree_id2);
                actions.wait(500);
            })

            .capture('hovered', function (actions) {
                actions.mouseMove(this.path);
                actions.wait(500);
            })
    });

    gemini.suite('dotted', function (test) {

        test.setUrl('/regression_pathselector_online.html').setCaptureElements('.sbis3-TestPathSelector____test')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGrid 1"]', 40000);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TreeDataGrid 1').setCurrentRoot(8);
                });
                actions.wait(500);
                this.dots = find('.controls-PathSelector__dots');
            })

            .capture('plain')

            .capture('hovered dots', function (actions) {
                actions.mouseMove(this.dots);
                actions.wait(500);
            })

            .capture('opened dots', function (actions) {
                actions.click(this.dots);
                actions.wait(500);
            })

            .capture('hint hovered', function (actions) {
                actions.mouseMove('.controls-Menu__Popup.controls-PathSelector .controls-MenuItem:nth-child(1)');
                actions.wait(500);
            })

            .capture('hint pressed', function (actions) {
                actions.mouseDown('.controls-Menu__Popup.controls-PathSelector .controls-MenuItem:nth-child(1)');
            })

            .after(function (actions) {
                actions.mouseUp('.controls-Menu__Popup.controls-PathSelector .controls-MenuItem:nth-child(1)');
            })
    });
});