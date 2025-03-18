sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("moovi.m06a03.controller.View1", {
        onInit: function () {
            let oLayoutJS = this.byId("vLayoutJS");
            oLayoutJS.bindElement("companyModel>/ScarrSet");
        }
    });
});
