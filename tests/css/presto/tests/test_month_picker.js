var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.MonthPicker Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_month_picker_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MonthPicker 1"]', 40000);
                this.field = find('.controls-MonthPicker__field');
                this.arrow_left = find('.controls-MonthPicker__arrowLeft');
                this.arrow_right = find('.controls-MonthPicker__arrowRight');
                this.september = find('[data-key="8"]')
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('hovered_field', function (actions) {
                actions.mouseMove(this.field);
            })

            .capture('hovered_left_arrow', function (actions) {
                actions.mouseMove(this.arrow_left);
            })

            .capture('hovered_right_arrow', function (actions) {
                actions.mouseMove(this.arrow_right);
            })

            .capture('opened_picker', function (actions) {
                actions.click(this.field);
				actions.mouseMove(this.input);
            })

            .capture('hovered_month', function (actions) {
                actions.mouseMove(this.september);
            })
    });

    gemini.suite('only_year', function (test) {

        test.setUrl('/regression_month_picker_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="MonthPicker 1"]', 40000);
                this.field = find('.controls-MonthPicker__field');
                this.arrow_left = find('.controls-MonthPicker__arrowLeft');
                this.arrow_right = find('.controls-MonthPicker__arrowRight');
                this.september = find('[data-key="8"]')
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
				this.input = find('[sbisname="TextBox 1"] input')
            })

            .capture('plain', function (actions) {
                actions.click(this.field);
				actions.mouseMove(this.input);
            })
    });
});