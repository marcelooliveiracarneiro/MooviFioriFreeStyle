sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller,Filter,FilterOperator) {
    "use strict";

    return Controller.extend("moovi.m07a01.controller.View1", {
        onInit: function () {

        },
        onSearchFieldCompany: function( oEvent ) {
            let filterArray = [];
            let vQuery = oEvent.getParameter("query");
            if (vQuery) {
                filterArray.push( new Filter( "Carrid", FilterOperator.EQ, vQuery ) );
            }
            let oList = this.byId("companyList");
            let oBinding = oList.getBinding("items");
            oBinding.filter( filterArray ); 
        }
    });
});
