/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"moovi/zmoc_fiorilistdetail/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});