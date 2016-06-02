/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.BackButton Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_back_button_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
                this.item13 = find('[data-id="13"]');
                this.button = find('.controls-BackButton');
                actions.click(this.item4);
                actions.click(this.item13);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button)
            })
    });

    gemini.suite('with_empty_caption', function (test) {

        test.setUrl('/regression_back_button_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
                this.item4 = find('[data-id="4"]');
                this.item13 = find('[data-id="13"]');
                this.button = find('.controls-BackButton');
                actions.click(this.item4);
                actions.click(this.item13);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('BackButton').setCaption();
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.button)
            })
    });
});*/