gemini.suite('SBIS3.CONTROLS.DragAndDrop Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_drag_and_drop_online.html').setCaptureElements('.capture')

            .before(function (actions) {

				this.tdgv = '[sbisname="TreeDataGridView 1"]';
                this.input = '[name="TextBox 1"] input';
				this.folder = '[data-id="4"]';
				this.item = '[data-id="5"]';
				
				actions.waitForElementToShow(this.tdgv, 40000);
				actions.waitForElementToShow(this.input, 5000);
            })

            .capture('mouse_down_item', function (actions) {
                actions.mouseDown(this.item);
            })

            .capture('hovered_folder', function (actions) {
                actions.mouseMove(this.folder);
				actions.mouseMove(this.folder);
            })
			
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
});