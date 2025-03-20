/*global QUnit*/

sap.ui.define([
	"moovi/zmoccompanhiavoo/controller/CompanhiaAereaList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("CompanhiaAereaList Controller");

	QUnit.test("I should test the CompanhiaAereaList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
