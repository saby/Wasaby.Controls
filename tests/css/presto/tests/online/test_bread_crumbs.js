/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.BreadCrumbs Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_bread_crumbs_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
                this.item13 = find('[data-id="13"]');
                this.home = find('.icon-Home3');
                this.title = find('.controls-BreadCrumbs__title');
                actions.click(this.item4);
                actions.click(this.item13)
            })

            .capture('plain')

            .capture('hovered_home', function (actions) {
                actions.mouseMove(this.home);
            })

            .capture('hovered_title', function (actions) {
                actions.mouseMove(this.title);
            })
    });

    gemini.suite('small_items', function (test) {

        test.setUrl('/regression_bread_crumbs_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
                this.item13 = find('[data-id="13"]');
                this.home = find('.icon-Home3');
                this.title = find('.controls-BreadCrumbs__title');
                actions.click(this.item4);
                actions.click(this.item13)
            })

            .capture('plain')

            .capture('hovered_home', function (actions) {
                actions.mouseMove(this.home);
            })

            .capture('hovered_title', function (actions) {
                actions.mouseMove(this.title);
            })
    });

    gemini.suite('dots', function (test) {

        test.setUrl('/regression_bread_crumbs_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
                this.item13 = find('[data-id="13"]');
                this.item21 = find('[data-id="21"]');
                this.item22 = find('[data-id="22"]');
                this.home = find('.icon-Home3');
                this.title = find('.controls-BreadCrumbs__title');
                this.dots = find('.controls-BreadCrumbs__dots');
                this.dot_item1 = find('.controls-BreadCrumbs .controls-MenuItem:nth-child(1)')
                actions.click(this.item4);
                actions.click(this.item13);
                actions.click(this.item21);
                actions.click(this.item22)
            })

            .capture('plain')

            .capture('hovered_dot_item', function (actions) {
                actions.click(this.dots);
                actions.mouseMove(this.dot_item1);
            })
    });
});*/