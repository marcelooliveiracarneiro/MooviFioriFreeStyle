sap.ui.define([
    "moovi/m10/controller/BaseController"
],
function (Controller) {
    "use strict";

    return Controller.extend("moovi.m10.controller.Company", {
        onInit: function () {
        },
        onCompanyPress: function ( oEvent ) {
            var oModel =  this.getView().getModel();

            var oItem = oEvent.getSource(); 
            var oCtx = oItem.getBindingContext(); 
            this.getRouter().navTo("RouteCompanyDetail", { carrid: oCtx.getProperty("Carrid") } );
        },
        onButtonCreatePress:  function ( oEvent ) {
            this.getRouter().navTo( "RouteCompanyDetail", { carrid: "New" } );
        }

    });
});
