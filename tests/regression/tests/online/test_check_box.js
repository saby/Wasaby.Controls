var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.CheckBox Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 1"]', 40000);
                this.checkbox = find('[name="CheckBox 1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })

            .capture('clicked', function (actions) {
                actions.click(this.checkbox);
                actions.wait(250);
            })
    });

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 4"]', 40000);
                this.checkbox = find('[name="CheckBox 4"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })
    });

    gemini.suite('without_text', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 6"]', 40000);
                this.checkbox = find('[name="CheckBox 6"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })

            .capture('clicked', function (actions) {
                actions.click(this.checkbox);
                actions.wait(250);
            })
    });

    gemini.suite('disabled_without_text', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 7"]', 40000);
                this.checkbox = find('[name="CheckBox 7"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })
    });

    gemini.suite('checked_default', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 2"]', 40000);
                this.checkbox = find('[name="CheckBox 2"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })

            .capture('clicked', function (actions) {
                actions.click(this.checkbox);
                actions.wait(250);
            })
    });

    gemini.suite('disabled_checked_default', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 5"]', 40000);
                this.checkbox = find('[name="CheckBox 5"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })
    });

    gemini.suite('checked_without_text', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 8"]', 40000);
                this.checkbox = find('[name="CheckBox 8"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })

            .capture('clicked', function (actions) {
                actions.click(this.checkbox);
                actions.wait(250);
            })
    });

    gemini.suite('disabled_checked_without_text', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox9')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 9"]', 40000);
                this.checkbox = find('[name="CheckBox 9"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })
    });

    gemini.suite('three_state', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 3"]', 40000);
                this.checkbox = find('[name="CheckBox 3"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })

            .capture('checked', function (actions) {
                actions.click(this.checkbox);
                actions.wait(250);
            })

            .capture('middle', function (actions) {
                actions.click(this.checkbox);
                actions.wait(250);
            })
    });

    gemini.suite('disabled_three_state', function (test) {

        test.setUrl('/regression_checkbox_online.html').setCaptureElements('#CheckBox3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="CheckBox 3"]', 40000);
                this.checkbox = find('[name="CheckBox 3"]');
                actions.click(this.checkbox);
                actions.click(this.checkbox);
                actions.wait(250);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('CheckBox 3').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.checkbox);
            })
    });
});