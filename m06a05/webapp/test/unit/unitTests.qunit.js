/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"moovi/m06a05/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
