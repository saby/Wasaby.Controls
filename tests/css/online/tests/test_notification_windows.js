gemini.suite('SBIS3.CONTROLS.NotificationWindows Online', function () {

    gemini.suite('base', function (test) {

        test.setUrl('/regression_info_windows_online.html').setCaptureElements('html')

            .before(function (actions) {
                
				this.success = '.butt1';				
                this.error = '.butt2';
                this.custom = '.butt2_cust';
                this.message = '.butt3';
                this.longops = '.butt4';
                this.yes_no = '.butt5';
                this.yes_no_cancel = '.butt6';
                this.green = '.butt7';
                this.red = '.butt8';
				this.caption = '.controls-NotificationPopup__header_caption';
				this.img1 = '.message img';
				this.img2 = '.longops img';
				this.ok = '[sbisname="okButton"]';
				this.pos = '[sbisname="positiveButton"]';
                
				actions.waitForElementToShow(this.success, 40000);
				actions.waitForElementToShow(this.error, 5000);
				actions.waitForElementToShow(this.custom, 5000);
				actions.waitForElementToShow(this.message, 5000);
				actions.waitForElementToShow(this.longops, 5000);
				actions.waitForElementToShow(this.yes_no, 5000);
				actions.waitForElementToShow(this.yes_no_cancel, 5000);
				actions.waitForElementToShow(this.green, 5000);
				actions.waitForElementToShow(this.red, 5000);
            })

            .capture('success_dialog', function (actions) {
				actions.click(this.success)
				actions.waitForElementToShow(this.caption, 5000)
            })
			
			.capture('error_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.error)
				actions.waitForElementToShow(this.caption, 5000)
            })
			
			.capture('custom_icon_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.custom)
				actions.waitForElementToShow(this.caption, 5000)
            })
			
			.capture('message_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.message)
				actions.waitForElementToShow(this.img1, 5000)
            })
			
			.capture('green_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.green)
				actions.waitForElementToShow(this.ok, 5000)

            })
			
			.capture('green_dialog_message', function (actions) {
				actions.click(this.ok)
				actions.waitForElementToShow(this.caption, 5000)
            })

			.capture('red_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.red)
				actions.waitForElementToShow(this.ok, 5000)
            })
			
			.capture('red_dialog_message', function (actions) {
				actions.click(this.ok)
				actions.waitForElementToShow(this.caption, 5000)
            })

			.capture('yes_no_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.yes_no)
				actions.waitForElementToShow(this.pos, 5000)
            })

			.capture('yes_no_dialog_message', function (actions) {
				actions.click(this.pos)
				actions.waitForElementToShow(this.caption, 5000);
            })

			.capture('yes_no_cancel_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.yes_no_cancel)
				actions.waitForElementToShow(this.pos, 5000)
            })

			.capture('yes_no_cancel_dialog_message', function (actions) {
				actions.click(this.pos)
				actions.waitForElementToShow(this.caption, 5000)
            })

			.capture('long_message_dialog', function (actions) {
				actions.wait(5000);
				actions.click(this.longops)
				actions.waitForElementToShow(this.img2, 5000)
            })
    });	
});