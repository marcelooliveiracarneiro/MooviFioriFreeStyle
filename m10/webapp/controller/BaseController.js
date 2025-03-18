sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
],
function (Controller, History, UIComponent) {
    "use strict";

    return Controller.extend("moovi.m10.controller.BaseController", {
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },
        onNavBack: function() {
            
            let vHistory      = History.getInstance();
            let vPreviousHash = vHistory.getPreviousHash();
            if (vPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("RouteCompany", {}, true);
            }
            
        }
    });
});
