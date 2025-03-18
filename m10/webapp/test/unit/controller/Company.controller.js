/*global QUnit*/

sap.ui.define([
	"moovi/m10/controller/Company.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Company Controller");

	QUnit.test("I should test the Company controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
