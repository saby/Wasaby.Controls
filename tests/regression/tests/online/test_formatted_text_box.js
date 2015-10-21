var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.FormattedTextBox Online', function () {

    gemini.suite('date', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 3"]', 40000);
                this.text = find('[name="FormattedTextBox 3"]');
                this.text_inpit = find('[name="FormattedTextBox 3"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('with text', function (actions) {
                actions.sendKeys(this.text_inpit, '010170');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })
    });

    gemini.suite('disabled_date', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 3"]', 40000);
                this.text = find('[name="FormattedTextBox 3"]');
                this.text_inpit = find('[name="FormattedTextBox 3"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, '010170');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 3').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('date_and_text_month', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 8"]', 40000);
                this.text = find('[name="FormattedTextBox 8"]');
                this.text_inpit = find('[name="FormattedTextBox 8"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('with text', function (actions) {
                actions.sendKeys(this.text_inpit, '01may1970');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })
    });

    gemini.suite('disabled_date_and_text_month', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 8"]', 40000);
                this.text = find('[name="FormattedTextBox 8"]');
                this.text_inpit = find('[name="FormattedTextBox 8"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, '01may1970');
                actions.executeJS(function () {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 8').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('date_and_text_month_big', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox9')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 9"]', 40000);
                this.text = find('[name="FormattedTextBox 9"]');
                this.text_inpit = find('[name="FormattedTextBox 9"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('with text', function (actions) {
                actions.sendKeys(this.text_inpit, '01may1970');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })
    });

    gemini.suite('disabled_date_and_text_month_big', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox9')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 9"]', 40000);
                this.text = find('[name="FormattedTextBox 9"]');
                this.text_inpit = find('[name="FormattedTextBox 9"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, '01may1970');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 9').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('date_long', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 7"]', 40000);
                this.text = find('[name="FormattedTextBox 7"]');
                this.text_inpit = find('[name="FormattedTextBox 7"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('with text', function (actions) {
                actions.sendKeys(this.text_inpit, '01011970');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })
    });

    gemini.suite('disabled_date_long', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 7"]', 40000);
                this.text = find('[name="FormattedTextBox 7"]');
                this.text_inpit = find('[name="FormattedTextBox 7"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, '01011970');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 7').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('digit', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 6"]', 40000);
                this.text = find('[name="FormattedTextBox 6"]');
                this.text_inpit = find('[name="FormattedTextBox 6"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('with text', function (actions) {
                actions.sendKeys(this.text_inpit, '443556');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })
    });

    gemini.suite('disabled_digit', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 6"]', 40000);
                this.text = find('[name="FormattedTextBox 6"]');
                this.text_inpit = find('[name="FormattedTextBox 6"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, '443556');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 6').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('email', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 2"]', 40000);
                this.text = find('[name="FormattedTextBox 2"]');
                this.text_inpit = find('[name="FormattedTextBox 2"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('with text', function (actions) {
                actions.sendKeys(this.text_inpit, 'tensorusergmail');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })
    });

    gemini.suite('disabled_email', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 2"]', 40000);
                this.text = find('[name="FormattedTextBox 2"]');
                this.text_inpit = find('[name="FormattedTextBox 2"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, 'tensorusergmail');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 2').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('phone', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 1"]', 40000);
                this.text = find('[name="FormattedTextBox 1"]');
                this.text_inpit = find('[name="FormattedTextBox 1"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('with text', function (actions) {
                actions.sendKeys(this.text_inpit, '79092785110');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('with validation error', function (actions) {
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 1').markControl();
                });
                actions.wait(500);
            })
    });

    gemini.suite('disabled_phone', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 1"]', 40000);
                this.text = find('[name="FormattedTextBox 1"]');
                this.text_inpit = find('[name="FormattedTextBox 1"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, '79092785110');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('string', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 5"]', 40000);
                this.text = find('[name="FormattedTextBox 5"]');
                this.text_inpit = find('[name="FormattedTextBox 5"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('with text', function (actions) {
                actions.sendKeys(this.text_inpit, 'hell');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })
    });

    gemini.suite('disabled_string', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 5"]', 40000);
                this.text = find('[name="FormattedTextBox 5"]');
                this.text_inpit = find('[name="FormattedTextBox 5"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, 'hell');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 5').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })
    });

    gemini.suite('time', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 4"]', 40000);
                this.text = find('[name="FormattedTextBox 4"]');
                this.text_inpit = find('[name="FormattedTextBox 4"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })

            .capture('with text', function (actions) {
                actions.sendKeys(this.text_inpit, '060606');
                actions.sendKeys(this.text_inpit, gemini.TAB);
            })
    });

    gemini.suite('disabled_time', function (test) {

        test.setUrl('/regression_formattedtextbox_online.html').setCaptureElements('#FormattedTextBox4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="FormattedTextBox 4"]', 40000);
                this.text = find('[name="FormattedTextBox 4"]');
                this.text_inpit = find('[name="FormattedTextBox 4"] .controls-FormattedTextBox__field');
                actions.sendKeys(this.text_inpit, '060606');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('FormattedTextBox 4').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.text);
            })
    });
});