sap.ui.define([
    "moovi/m09a01/controller/BaseController"
],
function (Controller) {
    "use strict";

    return Controller.extend("moovi.m09a01.controller.CompanyDetail", {
        onInit: function () {
            let oRouter = this.getRouter();
            oRouter.getRoute("RouteCompanyDetail").attachMatched(this.onRoutedMatched,this);
        },
        onRoutedMatched: function(oEvent) {
            var oView = this.getView();
            var oArgs = oEvent.getParameters().arguments; 
            oView.bindElement({ 
                path: "/ScarrSet('"+oArgs.carrid+"')",
                events: {
                    change: this._onBindChange.bind(this),
                    dataRequested: function (oEvent) {
                        oView.setBusy(true);
                    },
                    dataReceived: function (oEvent) {
                        oView.setBusy(false);
                    }
                }
            });
        },
        _onBindChange: function(oEvent) {
			let oElementBinding = this.getView().getElementBinding();
            if ((!oElementBinding) || (!oElementBinding.getBoundContext())) {
                this.getRouter().getTargets().display("TargetNotFound");
            }
        }
    });
});
