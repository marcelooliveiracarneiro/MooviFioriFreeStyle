sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("moovi.m06a04.controller.View1", {
        onInit: function () {
            let oList = this.byId("companyListJS");
            let oObjectListItem = new sap.m.ObjectListItem({ title: "{Carrname}", type: "Active" });
            oObjectListItem.addAttribute( new sap.m.ObjectAttribute({ text: "{Url}" }) );
            oObjectListItem.addAttribute( new sap.m.ObjectAttribute({ text: "{Currcode}" }) );
            oList.bindAggregation("items","/ScarrSet",oObjectListItem);
        }
    });
});
