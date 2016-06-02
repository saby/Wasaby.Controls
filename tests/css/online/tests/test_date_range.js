var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DateRange Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_date_range_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="DateRange 1"]', 40000);
				actions.waitForElementToShow('[name="DateRange__Button"] .controls-Button__text', 40000);
				this.open_chooser = find('[name="DateRange__Button"] .controls-Button__text');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
            })

            .capture('plain', function (actions) {
                actions.click(this.input);
            })

            .capture('opened_chooser', function (actions) {
                actions.click(this.open_chooser);
				actions.waitForElementToShow('table.ws-date-range-choose-table', 1000);
				actions.waitForElementToShow('[sbisname="apply"] .ws-button-caption', 1000);
				actions.waitForElementToShow('.ws-window-titlebar-action.close', 1000);
            })
			
			.capture('selected_week', function (actions, find) {
				actions.waitForElementToShow('[id="ws-date-range-choose-month-3"]', 1000);
				this.april = find('[id="ws-date-range-choose-month-3"]');
				actions.mouseMove(this.april);
				this.day = find('table tr[week="4"] td:nth-child(3)');
				actions.click(this.day);
            })
			
			.capture('selected_range', function (actions, find) {
				this.check_range = find('[sbisname="date-range-choose-TypeSelection"] div.box');
				actions.click(this.check_range);
				this.day1 = find('table tr[week="2"] td:nth-child(2)');
				actions.click(this.day1);
				this.day2 = find('table tr[week="4"] td:nth-child(5)');
				actions.click(this.day2);
            })
			
			.capture('hovered_to_current_date', function (actions, find) {
				this.to_current_date = find('[sbisname="ws-navigationButton"] a');
				actions.mouseMove(this.to_current_date);
            })
			
			.capture('hovered_select_button', function (actions, find) {
				this.apply = find('[sbisname="apply"] .ws-button-caption');
				actions.mouseMove(this.apply);
            })
			
			.capture('hovered_close', function (actions, find) {
				this.close = find('.ws-window-titlebar-action.close');
				actions.mouseMove(this.close);
            })
    });
});