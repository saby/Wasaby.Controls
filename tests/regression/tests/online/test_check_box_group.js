var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.CheckBoxGroup Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_checkboxgroup_online.html').setCaptureElements('#CheckBoxGroup1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBoxGroup 1"]', 40000);
                this.item1 = find('[name="CheckBoxGroup 1"] [data-id="1"]');
                this.item2 = find('[name="CheckBoxGroup 1"] [data-id="2"]');
            })

            .capture('plain')

            .capture('hovered item1', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('hovered item2', function (actions) {
                actions.mouseMove(this.item2);
            })

            .capture('clicked item1', function (actions) {
                actions.click(this.item1);
                actions.wait(250);
            })

            .capture('clicked item2', function (actions) {
                actions.click(this.item2);
                actions.wait(250);
            })
    });

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_checkboxgroup_online.html').setCaptureElements('#CheckBoxGroup2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBoxGroup 2"]', 40000);
                this.item1 = find('[name="CheckBoxGroup 2"] [data-id="1"]');
                this.item2 = find('[name="CheckBoxGroup 2"] [data-id="2"]');
            })

            .capture('plain')

            .capture('hovered item1', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('hovered item2', function (actions) {
                actions.mouseMove(this.item2);
            })
    });

    gemini.suite('multiselect', function (test) {

        test.setUrl('/regression_checkboxgroup_online.html').setCaptureElements('#CheckBoxGroup3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBoxGroup 3"]', 40000);
                this.item1 = find('[name="CheckBoxGroup 3"] [data-id="1"]');
                this.item2 = find('[name="CheckBoxGroup 3"] [data-id="2"]');
            })

            .capture('plain')

            .capture('hovered item1', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('hovered item2', function (actions) {
                actions.mouseMove(this.item2);
            })

            .capture('clicked item1', function (actions) {
                actions.click(this.item1);
                actions.wait(250);
            })

            .capture('clicked item2', function (actions) {
                actions.click(this.item2);
                actions.wait(250);
            })

    });

    gemini.suite('multiselect_vertical', function (test) {

        test.setUrl('/regression_checkboxgroup_online.html')

            .setCaptureElements('#CheckBoxGroup6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBoxGroup 6"]', 40000);
                this.item1 = find('[name="CheckBoxGroup 6"] [data-id="1"]');
                this.item2 = find('[name="CheckBoxGroup 6"] [data-id="2"]');
            })

            .capture('plain')

            .capture('hovered item1', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('hovered item2', function (actions) {
                actions.mouseMove(this.item2);
            })

            .capture('clicked item1', function (actions) {
                actions.click(this.item1);
                actions.wait(250);
            })

            .capture('clicked item2', function (actions) {
                actions.click(this.item2);
                actions.wait(250);
            })
    });

    gemini.suite('vertical', function (test) {

        test.setUrl('/regression_checkboxgroup_online.html').setCaptureElements('#CheckBoxGroup4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBoxGroup 4"]', 40000);
                this.item1 = find('[name="CheckBoxGroup 4"] [data-id="1"]');
                this.item2 = find('[name="CheckBoxGroup 4"] [data-id="2"]');
            })

            .capture('plain')

            .capture('hovered item1', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('hovered item2', function (actions) {
                actions.mouseMove(this.item2);
            })

            .capture('clicked item1', function (actions) {
                actions.click(this.item1);
                actions.wait(250);
            })

            .capture('clicked item2', function (actions) {
                actions.click(this.item2);
                actions.wait(250);
            })
    });

    gemini.suite('disabled_vertical', function (test) {

        test.setUrl('/regression_checkboxgroup_online.html').setCaptureElements('#CheckBoxGroup5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBoxGroup 5"]', 40000);
                this.item1 = find('[name="CheckBoxGroup 5"] [data-id="1"]');
                this.item2 = find('[name="CheckBoxGroup 5"] [data-id="2"]');
            })

            .capture('plain')

            .capture('hovered item1', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('hovered item2', function (actions) {
                actions.mouseMove(this.item2);
            })
    });

});