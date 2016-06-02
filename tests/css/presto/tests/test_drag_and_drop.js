/*
var gemini = require('gemini');

gemini.suite('SBIS3.CONTROLS.DragAndDrop Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_drag_and_drop_online.html').setCaptureElements('.capture')

            .before(function (actions, find) {
                actions.waitForElementToShow('[name="TreeDataGridView 1"]', 40000);
				actions.waitForElementToShow('[sbisname="TextBox 1"]', 40000);
                this.input = find('[sbisname="TextBox 1"] input');
				this.folder = find('[data-id="4"]');
				this.item = find('[data-id="5"]');
            })

            .capture('mouse_down_item', function (actions) {
                actions.mouseDown(this.item);
            })

            .capture('hovered_folder', function (actions) {
                actions.mouseMove(this.folder);
            })
			
			/*
			.capture('thin_blue_line', function (actions) {
                actions.mouseMove(this.folder, {'x': 400, 'y': -5});
            })
			
			.capture('hovered_item', function (actions) {
                actions.mouseMove(this.item);
            })
			
			.capture('mouse_up_item', function (actions) {
                actions.mouseUp(this.item);
            })
    });
});*/