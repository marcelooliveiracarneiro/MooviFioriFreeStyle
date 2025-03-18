sap.ui.define([
    "moovi/m09a01/controller/BaseController"
],
function (Controller) {
    "use strict";

    return Controller.extend("moovi.m09a01.controller.Company", {
        onInit: function () {

        },
        onCompanyPress: function ( oControlEvent ) {
            var oItem = oControlEvent.getSource(); 
            var oCtx = oItem.getBindingContext();
            this.getRouter().navTo("RouteCompanyDetail", { 
                carrid: oCtx.getProperty("Carrid")
            } );
        }
    });
});
