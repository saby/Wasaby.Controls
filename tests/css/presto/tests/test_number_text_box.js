var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.NumberTextBox Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_number_text_box_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="NumberTextBox 1"]', 40000);
				this.number_input = find('[name="NumberTextBox 1"] input');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
				actions.sendKeys(this.number_input, '150');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('right_align', function (test) {

        test.setUrl('/regression_number_text_box_online_3.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="NumberTextBox 1"]', 40000);
				this.number_input = find('[name="NumberTextBox 1"] input');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
				actions.sendKeys(this.number_input, '150');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });

    gemini.suite('with_arrows', function (test) {

        test.setUrl('/regression_number_text_box_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="NumberTextBox 1"]', 40000);
                this.box = find('[name="NumberTextBox 1"]');
                this.up = find('.controls-NumberTextBox__arrowUp');
                this.down = find('.controls-NumberTextBox__arrowDown');
				this.number_input = find('[name="NumberTextBox 1"] input');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
				actions.sendKeys(this.number_input, '150');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_up', function (actions) {
                actions.mouseMove(this.up);
            })

            .capture('hovered_down', function (actions) {
                actions.mouseMove(this.down);
            })
    });

    gemini.suite('disabled_with_arrows', function (test) {

        test.setUrl('/regression_number_text_box_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="NumberTextBox 1"]', 40000);
				this.number_input = find('[name="NumberTextBox 1"] input');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input');
				actions.sendKeys(this.number_input, '150');
                actions.executeJS(function (window) {
                    window.$ws.single.ControlStorage.getByName('NumberTextBox 1').setEnabled(false);
                });
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })
    });
});