sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("moovi.m06a02.controller.View1", {
        onInit: function () {
            let oCompanyInput2 = this.byId("companyInput2");
            oCompanyInput2.bindProperty("value","companyModel>/ScarrSet/Carrname");
        }
    });
});
