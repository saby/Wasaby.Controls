var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.RadioGroup Online', function () {

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_radiogroup_online.html').setCaptureElements('#RadioGroup2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 2"]', 40000);
                this.radio1 = find('[name="RadioGroup 2"] [data-id="1"] .controls-RadioButton__icon');
                this.radio2 = find('[name="RadioGroup 2"] [data-id="2"] .controls-RadioButton__icon');
            })

            .capture('plain')

            .capture('radio 1 hovered', function (actions) {
                actions.mouseMove(this.radio1);
            })

            .capture('radio 2 hovered', function (actions) {
                actions.mouseMove(this.radio2);
            })
    });

    gemini.suite('disabled_vertical', function (test) {

        test.setUrl('/regression_radiogroup_online.html').setCaptureElements('#RadioGroup6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 6"]', 40000);
                this.radio1 = find('[name="RadioGroup 6"] [data-id="1"] .controls-RadioButton__icon');
                this.radio2 = find('[name="RadioGroup 6"] [data-id="2"] .controls-RadioButton__icon');
            })

            .capture('plain')

            .capture('radio 1 hovered', function (actions) {
                actions.mouseMove(this.radio1);
            })

            .capture('radio 2 hovered', function (actions) {
                actions.mouseMove(this.radio2);
            })
    });

    gemini.suite('default', function (test) {

        test.setUrl('/regression_radiogroup_online.html').setCaptureElements('#RadioGroup1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 1"]', 40000);
                this.radio1 = find('[name="RadioGroup 1"] [data-id="1"] .controls-RadioButton__icon');
                this.radio2 = find('[name="RadioGroup 1"] [data-id="2"] .controls-RadioButton__icon');
            })

            .capture('plain')

            .capture('radio 1 hovered', function (actions) {
                actions.mouseMove(this.radio1);
            })

            .capture('radio 2 hovered', function (actions) {
                actions.mouseMove(this.radio2);
            })

            .capture('radio 1 clicked', function (actions) {
                actions.click(this.radio1);
                actions.wait(250);
            })

            .capture('radio 2 clicked', function (actions) {
                actions.click(this.radio2);
                actions.wait(250);
            })
    });

    gemini.suite('vertical', function (test) {

        test.setUrl('/regression_radiogroup_online.html').setCaptureElements('#RadioGroup5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 5"]', 40000);
                this.radio1 = find('[name="RadioGroup 5"] [data-id="1"] .controls-RadioButton__icon');
                this.radio2 = find('[name="RadioGroup 5"] [data-id="2"] .controls-RadioButton__icon');
            })

            .capture('plain')

            .capture('radio 1 hovered', function (actions) {
                actions.mouseMove(this.radio1);
            })

            .capture('radio 2 hovered', function (actions) {
                actions.mouseMove(this.radio2);
            })

            .capture('radio 1 clicked', function (actions) {
                actions.click(this.radio1);
                actions.wait(250);
            })

            .capture('radio 2 clicked', function (actions) {
                actions.click(this.radio2);
                actions.wait(250);
            })
    });

    gemini.suite('with_extendet_tooltip', function (test) {

        test.setUrl('/regression_radiogroup_online.html').setCaptureElements('#RadioGroup3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 3"]', 40000);
                this.radio1 = find('[name="RadioGroup 3"] [data-id="1"] .controls-RadioButton__icon');
                this.radio2 = find('[name="RadioGroup 3"] [data-id="2"] .controls-RadioButton__icon');
            })

            .capture('plain')

            .capture('radio 1 hovered', function (actions) {
                actions.mouseMove(this.radio1);
            })

            .capture('radio 2 hovered', function (actions) {
                actions.mouseMove(this.radio2);
            })

            .capture('radio 1 clicked', function (actions) {
                actions.click(this.radio1);
                actions.wait(250);
            })

            .capture('radio 2 clicked', function (actions) {
                actions.click(this.radio2);
                actions.wait(250);
            })
    });

    gemini.suite('with_extendet_tooltip_vertical', function (test) {

        test.setUrl('/regression_radiogroup_online.html').setCaptureElements('#RadioGroup7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 7"]', 40000);
                this.radio1 = find('[name="RadioGroup 7"] [data-id="1"] .controls-RadioButton__icon');
                this.radio2 = find('[name="RadioGroup 7"] [data-id="2"] .controls-RadioButton__icon');
            })

            .capture('plain')

            .capture('radio 1 hovered', function (actions) {
                actions.mouseMove(this.radio1);
            })

            .capture('radio 2 hovered', function (actions) {
                actions.mouseMove(this.radio2);
            })

            .capture('radio 1 clicked', function (actions) {
                actions.click(this.radio1);
                actions.wait(250);
            })

            .capture('radio 2 clicked', function (actions) {
                actions.click(this.radio2);
                actions.wait(250);
            })
    });

    gemini.suite('with_tooltip', function (test) {

        test.setUrl('/regression_radiogroup_online.html').setCaptureElements('#RadioGroup4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 4"]', 40000);
                this.radio1 = find('[name="RadioGroup 4"] [data-id="1"] .controls-RadioButton__icon');
                this.radio2 = find('[name="RadioGroup 4"] [data-id="2"] .controls-RadioButton__icon');
            })

            .capture('plain')

            .capture('radio 1 hovered', function (actions) {
                actions.mouseMove(this.radio1);
            })

            .capture('radio 2 hovered', function (actions) {
                actions.mouseMove(this.radio2);
            })

            .capture('radio 1 clicked', function (actions) {
                actions.click(this.radio1);
                actions.wait(250);
            })

            .capture('radio 2 clicked', function (actions) {
                actions.click(this.radio2);
                actions.wait(250);
            })
    });

    gemini.suite('with_tooltip_vertical', function (test) {

        test.setUrl('/regression_radiogroup_online.html').setCaptureElements('#RadioGroup8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 8"]', 40000);
                this.radio1 = find('[name="RadioGroup 8"] [data-id="1"] .controls-RadioButton__icon');
                this.radio2 = find('[name="RadioGroup 8"] [data-id="2"] .controls-RadioButton__icon');
            })

            .capture('plain')

            .capture('radio 1 hovered', function (actions) {
                actions.mouseMove(this.radio1);
            })

            .capture('radio 2 hovered', function (actions) {
                actions.mouseMove(this.radio2);
            })

            .capture('radio 1 clicked', function (actions) {
                actions.click(this.radio1);
                actions.wait(250);
            })

            .capture('radio 2 clicked', function (actions) {
                actions.click(this.radio2);
                actions.wait(250);
            })
    });

    gemini.suite('disabled_default_checked', function (test) {

        test.setUrl('/regression_radiogroup_online.html').setCaptureElements('#RadioGroup1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="RadioGroup 1"]', 40000);
                this.radio1 = find('[name="RadioGroup 1"] [data-id="1"] .controls-RadioButton__icon');
                actions.click(this.radio1);
                actions.wait(250);
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('RadioGroup 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('radio 1 hovered', function (actions) {
                actions.mouseMove(this.radio1);
            })
    });
});