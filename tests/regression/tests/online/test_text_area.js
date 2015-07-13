var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.TextArea Online', function () {

    gemini.suite('bug906780_test1', function (test) {

        test.setUrl('/integration_textarea.html').setCaptureElements('#test_1')

            .before(function (actions, find) {
                actions.waitForElementToShow('#test_1', 40000);
                this.zone = find('#test_1');
                this.checkbox = find('[name="CheckBox 1"] .controls-CheckBox__icon')
            })

            .capture('plain')

            .capture('opened', function (actions) {
                actions.click(this.checkbox);
            })

            .capture('with text', function (actions) {
                actions.sendKeys('[name="TextArea 1"] .controls-TextArea__inputField', 'ara area');
                actions.sendKeys('[name="TextArea 1"] .controls-TextArea__inputField', gemini.TAB);
            })
    });

    gemini.suite('bug906780_test2', function (test) {

        test.setUrl('/integration_textarea.html').setCaptureElements('#test_2')

            .before(function (actions, find) {
                actions.waitForElementToShow('#test_2', 40000);
                this.zone = find('#test_2');
                this.checkbox2 = find('[name="CheckBox 2"] .controls-CheckBox__icon')
            })

            .capture('plain')

            .capture('with text', function (actions) {
                actions.sendKeys('[name="TextArea 2"] .controls-TextArea__inputField', 'ara area');
                actions.sendKeys('[name="TextArea 2"] .controls-TextArea__inputField', gemini.TAB);
            })

            .capture('hidden', function (actions) {
                actions.click(this.checkbox2);
            })

            .capture('opened', function (actions) {
                actions.click(this.checkbox2);
            })
    });

    gemini.suite('bug909581', function (test) {

        test.setUrl('/integration_textarea.html').setCaptureElements('#test_3')

            .before(function (actions, find) {
                actions.waitForElementToShow('#test_3', 40000);
                this.zone = find('#test_3');
                this.checkbox2 = find('[name="CheckBox 3"] .controls-CheckBox__icon')
            })

            .capture('plain')

            .capture('with text', function (actions) {
                actions.sendKeys('[name="TextArea 3"] .controls-TextArea__inputField', 'ara area');
                actions.sendKeys('[name="TextArea 3"] .controls-TextArea__inputField', gemini.TAB);
            })

            .capture('with validation error', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 3').markControl();
                });
                actions.wait(500);
            })
    });

    gemini.suite('default', function (test) {

        test.setUrl('/regression_textarea_online.html').setCaptureElements('#TextArea1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TextArea 1"]', 40000);
                this.area = find('[name="TextArea 1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.area);
            })

            .capture('with text', function (actions) {
                actions.sendKeys('[name="TextArea 1"] .controls-TextArea__inputField', 'text IN __TEXT AREA');
                actions.sendKeys('[name="TextArea 1"] .controls-TextArea__inputField', gemini.TAB);
            })

            .capture('with validation error', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').markControl();
                });
                actions.wait(500);
            })
    });

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_textarea_online.html').setCaptureElements('#TextArea1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TextArea 1"]', 40000);
                this.area = find('[name="TextArea 1"]');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('TextArea 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.area);
            })
    });
});