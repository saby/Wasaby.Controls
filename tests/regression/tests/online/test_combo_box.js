var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.ComboBox Online', function () {

    gemini.suite('default', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
                this.combobox = find('[name="ComboBox 1"]');
                this.combobox_input = find('[name="ComboBox 1"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 1"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('default_item', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
                this.combobox_input = find('[name="ComboBox 1"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 1"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('default_selected', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 1"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_default', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox1')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
                this.combobox = find('[name="ComboBox 1"]');
                this.combobox_arrow = find('[name="ComboBox 1"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 1').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('not_editable', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 6"]', 40000);
                this.combobox = find('[name="ComboBox 6"]');
                this.combobox_input = find('[name="ComboBox 6"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 6"] .controls-ComboBox__arrowDown');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('not_editable_item', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 6"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 6"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('not_editable_selected', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 6"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 6"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_not_editable', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox6')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 6"]', 40000);
                this.combobox = find('[name="ComboBox 6"]');
                this.combobox_arrow = find('[name="ComboBox 6"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 6').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('not_editable_and_full_width', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 8"]', 40000);
                this.combobox = find('[name="ComboBox 8"]');
                this.combobox_input = find('[name="ComboBox 8"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 8"] .controls-ComboBox__arrowDown');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('not_editable_and_full_width_item', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 8"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 8"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('not_editable_and_full_width_selected', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 8"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 8"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_not_editable_and_full_width', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 8"]', 40000);
                this.combobox = find('[name="ComboBox 8"]');
                this.combobox_arrow = find('[name="ComboBox 8"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 8').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 7"]', 40000);
                this.combobox = find('[name="ComboBox 7"]');
                this.combobox_input = find('[name="ComboBox 7"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 7"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_long_item_text_item', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 7"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 7"] .controls-ComboBox__arrowDown');
                this.combobox_input = find('[name="ComboBox 7"] .controls-ComboBox__field');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_fixed_width_and_long_item_text_selected', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 7"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 7"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_fixed_width_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox7')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 7"]', 40000);
                this.combobox = find('[name="ComboBox 7"]');
                this.combobox_arrow = find('[name="ComboBox 7"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 7').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_not_editable_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_4.html').setCaptureElements('#ComboBox12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 12"]', 40000);
                this.combobox = find('[name="ComboBox 12"]');
                this.combobox_input = find('[name="ComboBox 12"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 12"] .controls-ComboBox__arrowDown');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_not_editable_and_long_item_text_item', function (test) {

        test.setUrl('/regression_combobox_online_4.html').setCaptureElements('#ComboBox12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 12"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 12"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_fixed_width_and_not_editable_and_long_item_text_selected', function (test) {

        test.setUrl('/regression_combobox_online_4.html').setCaptureElements('#ComboBox12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 12"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 12"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_fixed_width_and_not_editable_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_4.html').setCaptureElements('#ComboBox12')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 12"]', 40000);
                this.combobox = find('[name="ComboBox 12"]');
                this.combobox_arrow = find('[name="ComboBox 12"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 12').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_placeholder_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 8"]', 40000);
                this.combobox = find('[name="ComboBox 8"]');
                this.combobox_input = find('[name="ComboBox 8"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 8"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_placeholder_and_long_item_text_item', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 8"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 8"] .controls-ComboBox__arrowDown');
                this.combobox_input = find('[name="ComboBox 8"] .controls-ComboBox__field');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_fixed_width_and_placeholder_and_long_item_text_selected', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 8"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 8"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_fixed_width_and_placeholder_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox8')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 8"]', 40000);
                this.combobox = find('[name="ComboBox 8"]');
                this.combobox_arrow = find('[name="ComboBox 8"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 8').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_text_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox9')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 9"]', 40000);
                this.combobox = find('[name="ComboBox 9"]');
                this.combobox_input = find('[name="ComboBox 9"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 9"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_text_and_long_item_text_item', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox9')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 9"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 9"] .controls-ComboBox__arrowDown');
                this.combobox_input = find('[name="ComboBox 9"] .controls-ComboBox__field');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_fixed_width_and_text_and_long_item_text_selected', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox9')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 9"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 9"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_fixed_width_and_text_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox9')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 9"]', 40000);
                this.combobox = find('[name="ComboBox 9"]');
                this.combobox_arrow = find('[name="ComboBox 9"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 9').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_text_transform_lowercase_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 10"]', 40000);
                this.combobox = find('[name="ComboBox 10"]');
                this.combobox_input = find('[name="ComboBox 10"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 10"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_text_transform_lowercase_and_long_item_text_item', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 10"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 10"] .controls-ComboBox__arrowDown');
                this.combobox_input = find('[name="ComboBox 10"] .controls-ComboBox__field');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_fixed_width_and_text_transform_lowercase_and_long_item_text_selected', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 10"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 10"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_fixed_width_and_text_transform_lowercase_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox10')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 10"]', 40000);
                this.combobox = find('[name="ComboBox 10"]');
                this.combobox_arrow = find('[name="ComboBox 10"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 10').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_text_transform_uppercase_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox11')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 11"]', 40000);
                this.combobox = find('[name="ComboBox 11"]');
                this.combobox_input = find('[name="ComboBox 11"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 11"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_fixed_width_and_text_transform_uppercase_and_long_item_text_item', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox11')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 11"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 11"] .controls-ComboBox__arrowDown');
                this.combobox_input = find('[name="ComboBox 11"] .controls-ComboBox__field');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_fixed_width_and_text_transform_uppercase_and_long_item_text_selected', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox11')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 11"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 11"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_fixed_width_and_text_transform_uppercase_and_long_item_text', function (test) {

        test.setUrl('/regression_combobox_online_2.html').setCaptureElements('#ComboBox11')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 11"]', 40000);
                this.combobox = find('[name="ComboBox 11"]');
                this.combobox_arrow = find('[name="ComboBox 11"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 11').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('with_placehodler', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 2"]', 40000);
                this.combobox = find('[name="ComboBox 2"]');
                this.combobox_input = find('[name="ComboBox 2"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 2"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_placehodler_item', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 2"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 2"] .controls-ComboBox__arrowDown');
                this.combobox_input = find('[name="ComboBox 2"] .controls-ComboBox__field');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_placehodler_selected', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 2"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 2"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_placehodler', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox2')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 2"]', 40000);
                this.combobox = find('[name="ComboBox 2"]');
                this.combobox_arrow = find('[name="ComboBox 2"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 2').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });


    gemini.suite('with_text', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 3"]', 40000);
                this.combobox = find('[name="ComboBox 3"]');
                this.combobox_input = find('[name="ComboBox 3"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 3"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_text_item', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 3"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 3"] .controls-ComboBox__arrowDown');
                this.combobox_input = find('[name="ComboBox 3"] .controls-ComboBox__field');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_text_selected', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 3"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 3"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_text', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox3')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 3"]', 40000);
                this.combobox = find('[name="ComboBox 3"]');
                this.combobox_arrow = find('[name="ComboBox 3"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 3').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('with_text_transform_lowercase', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 4"]', 40000);
                this.combobox = find('[name="ComboBox 4"]');
                this.combobox_input = find('[name="ComboBox 4"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 4"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_text_transform_lowercase_item', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 4"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 4"] .controls-ComboBox__arrowDown');
                this.combobox_input = find('[name="ComboBox 4"] .controls-ComboBox__field');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_text_transform_lowercase_selected', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 4"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 4"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_text_transform_lowercase', function (test) {

        test.setUrl('/regression_combobox_online.html').setCaptureElements('#ComboBox4')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 4"]', 40000);
                this.combobox = find('[name="ComboBox 4"]');
                this.combobox_arrow = find('[name="ComboBox 4"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 4').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });

    gemini.suite('with_text_transform_uppercase', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 5"]', 40000);
                this.combobox = find('[name="ComboBox 5"]');
                this.combobox_input = find('[name="ComboBox 5"] .controls-ComboBox__field');
                this.combobox_arrow = find('[name="ComboBox 5"] .controls-ComboBox__arrowDown');
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })

            .capture('pressed arrow', function (actions) {
                actions.mouseDown(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.combobox_arrow);
            })
    });

    gemini.suite('with_text_transform_uppercase_item', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 5"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 5"] .controls-ComboBox__arrowDown');
                this.combobox_input = find('[name="ComboBox 5"] .controls-ComboBox__field');
                actions.click(this.combobox_arrow);
                actions.sendKeys(this.combobox_input, gemini.TAB);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.item1);
            })

            .capture('pressed', function (actions) {
                actions.mouseDown(this.item1);
            })

            .after(function (actions, find) {
                actions.mouseUp(this.item1);
            })
    });

    gemini.suite('with_text_transform_uppercase_selected', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 5"]', 40000);
                this.combobox_arrow = find('[name="ComboBox 5"] .controls-ComboBox__arrowDown');
                actions.click(this.combobox_arrow);
                actions.waitForElementToShow('[data-id="1"]', 40000);
                this.item1 = find('[data-id="1"]');
                actions.click(this.item1);
            })

            .capture('selected')
    });

    gemini.suite('disabled_with_text_transform_uppercase', function (test) {

        test.setUrl('/regression_combobox_online_3.html').setCaptureElements('#ComboBox5')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 5"]', 40000);
                this.combobox = find('[name="ComboBox 5"]');
                this.combobox_arrow = find('[name="ComboBox 5"] .controls-ComboBox__arrowDown');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 5').setEnabled(false);
                });
            })

            .capture('plain')

            .capture('hovered', function (actions) {
                actions.mouseMove(this.combobox);
            })

            .capture('hovered arrow', function (actions) {
                actions.mouseMove(this.combobox_arrow);
            })
    });
});