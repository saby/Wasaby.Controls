var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.ComboBox Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_combo_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
                this.arrow = find('.controls-ComboBox__arrowDown');
                this.item1 = find('[data-id="1"]');
                actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_arrow', function (actions) {
                actions.mouseMove(this.arrow)
            })

            .capture('opened', function (actions) {
                actions.click(this.arrow);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.sendKeys(this.input, 'test');
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item1)
            })

            .capture('checked_item', function (actions) {
                actions.click(this.item1);
            })
    });
	
	gemini.suite('max_width', function (test) {

        test.setUrl('/regression_combo_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
                this.arrow = find('.controls-ComboBox__arrowDown');
                this.item1 = find('[data-id="1"]');
                actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.arrow);
				actions.executeJS(function (window) {
                    window.$('.controls-FloatArea.controls-ComboBox__picker').css('max-width', 18000);
                });
				actions.click(this.input);
            })

            .capture('opened_with_max_width', function (actions) {
                actions.click(this.arrow);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
				actions.sendKeys(this.input, 'test');
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item1)
            })
    });

    gemini.suite('disabled_base', function (test) {

        test.setUrl('/regression_combo_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('not_editable', function (test) {

        test.setUrl('/regression_combo_box_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
                this.arrow = find('.controls-ComboBox__arrowDown');
                this.item1 = find('[data-id="1"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_arrow', function (actions) {
                actions.mouseMove(this.arrow)
            })

            .capture('opened', function (actions) {
                actions.click(this.arrow);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="2"]', 1000);
            })

            .capture('hovered_item', function (actions) {
                actions.mouseMove(this.item1)
            })

            .capture('checked_item', function (actions) {
                actions.click(this.item1);
            })
    });

    gemini.suite('disabled_not_editable', function (test) {

        test.setUrl('/regression_combo_box_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('ComboBox 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
	
	gemini.suite('with_autocomplete', function (test) {

        test.setUrl('/regression_combo_box_online_4.html').setCaptureElements('html')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="ComboBox 1"]', 40000);
                this.arrow = find('.controls-ComboBox__arrowDown');
                this.item1 = find('[data-id="1"]');
                actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				this.box_input = find('[sbisname="ComboBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
				actions.sendKeys(this.input, 'test');
				actions.sendKeys(this.input, gemini.CONTROL+gemini.SHIFT+gemini.ARROW_LEFT);
            })		

            .capture('opened', function (actions) {
                actions.click(this.arrow);
				actions.waitForElementToShow('[data-id="1"]', 1000);
				actions.waitForElementToShow('[data-id="10"]', 1000);
				actions.waitForElementToShow('[data-id="5"]', 1000);
				actions.waitForElementToShow('[data-id="15"]', 1000);
            })

            .capture('with_autocomplete', function (actions) {
				actions.sendKeys(this.box_input, 'dev');
                actions.wait(1000);
            })
    });
});