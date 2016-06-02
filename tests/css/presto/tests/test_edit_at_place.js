/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DataGridEditAtPlace Online', function () {

    gemini.suite('row_template', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
				actions.sendKeys(gemini.TAB);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
    });
	
	gemini.suite('column_template', function (test) {

        test.setUrl('/regression_data_grid_view_edit_at_place_online_2.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[sbisname="ТипНоменклатуры"]', 40000);
                this.item3 = find('[sbisname="ТипНоменклатуры"] [data-id="3"]');
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[name="TextBox 1"] .controls-TextBox__field');
				this.cancell = find('[title="Отмена"]');
				this.save = find('[title="Сохранить"]');
            })

            .capture('opened_editor', function (actions) {
                actions.click(this.item3);
				actions.waitForElementToShow('[title="Отмена"]', 2000);
				actions.waitForElementToShow('[title="Сохранить"]', 2000);
            })
			
			.capture('hovered_cancell', function (actions) {
                actions.mouseMove(this.cancell);
            })
			
			.capture('hovered_save', function (actions) {
                actions.mouseMove(this.save);
            })
    });
});*/