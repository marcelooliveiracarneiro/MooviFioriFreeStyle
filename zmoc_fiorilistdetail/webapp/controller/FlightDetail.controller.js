sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/library",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
function (Controller, JSONModel, formatter, mobileLibrary, Fragment, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("moovi.zmoc_fiorilistdetail.controller.FlightDetail", {
        onInit: function () {
            let oRouter = this.getRouter();
            oRouter.getRoute("flightDetail").attachMatched(this._onRoutedMatched,this);
        },
        _onRoutedMatched: function(oEvent) {
            var oView = this.getView();
            let oArgs = oEvent.getParameters().arguments; 
        
            let oEditModel = oView.getModel( "editFlightModel" );
            
            if (oArgs.Connid != "New") {
                oEditModel.setProperty( "/isNew", false );
                oView.bindElement({ 
                    path: "/" + this.getModel().createKey( "SpfliSet", { Carrid: oArgs.Carrid, Connid: oArgs.Connid } ),
                    events: {
                        change: this._onBindChange.bind(this),
                        dataRequested: function (oEvent) { oView.setBusy(true); },
                        dataReceived: function (oEvent) { oView.setBusy(false); }
                    }
                });
            } else {
                oEditModel.setProperty( "/isNew", true );
                oView.getModel().setDeferredGroups(["createFlightId"]);
                oView.getModel().setChangeGroups({ "SpfliSet": { groupId: "createFlightId", changeSetId: "ID" } });
                let oContext = oView.getModel().createEntry("/SpfliSet", { groupId: "createFlightId", properties: { Carrid: oArgs.Carrid } });
                oView.bindElement( oContext.getPath() );
            }
        },
        _onBindChange: function (oEvent) {
			let oElementBinding = this.getView().getElementBinding();
            if ((!oElementBinding) || (!oElementBinding.getBoundContext())) {
                this.getRouter().getTargets().display("notFound");
            }
        },
        onButtonSavePress: function (oEvent) {
            var that = this, oModel = this.getView().getModel();
            oModel.submitChanges({
                success: that.handleSaveSuccess.bind(that),
                error: that.handleSaveError.bind(that)
            });
        },
        handleSaveSuccess: function ( oResponse, oData ) {
            let oChangeError = { errorFound: false, errorMessage: "" };
            var oModel = this.getView().getModel();
            if (oResponse.__batchResponses) {
                if (oResponse.__batchResponses[0].response) {
                    var oBatchResponse = oResponse.__batchResponses[0].response;
                    var status = parseInt(oBatchResponse.statusCode);
                    if (status >= 400) {
                        var oResponseBody = JSON.parse(oBatchResponse.body);
                        oChangeError = { errorFound: true, errorMessage: "Erro ao Salvar. ERRO: " +oResponseBody.error.message.value };
                    }
                }
                else if (oResponse.__batchResponses[0].__ChangeResponses) {
                    var aChangeResponse = oResponse.__batchResponses[0].__ChangeResponses[0];
                    var status = parseInt(aChangeResponse.statusCode);
                    if (status >= 400) {
                        oChangeError = { errorFound: true, errorMessage: "Erro ao Salvar." };
                    }
                }
            }

            if (oChangeError.errorFound == true) {
                MessageBox.alert( oChangeError.errorMessage );
                oModel.resetChanges();
                oModel.refresh();
            } else {
                MessageToast.show( "Salvo com sucesso !" );
                this.onNavBack();
            }
            
        },
        handleSaveError: function ( oError ) {
            if (oError) {
                if (oError.responseText) {
                    var oErrorMessage = JSON.parse(oError.responseText);
                    MessageBox.alert( oErrorMessage.error.message.value )
                }
            }
        },
        onButtonDeletePress: function ( oError ) {
            var that = this, oView = this.getView(), oModel = oView.getModel(), oContext = oView.getBindingContext();
            MessageBox.warning( "O Registro será excluido ! Deseja Continuar ?", {
                actions: [MessageBox.Action.OK,MessageBox.Action.CANCEL],
                onClose: function( sAction ) {
                    if (sAction == MessageBox.Action.OK) {
                        oModel.remove( oContext.getPath(), {
                            success: that.handleDeleteSuccess.bind(that),
                            error: that.handleDeleteError.bind(that)
                        } );
                    }
                }
            } );
        },
        handleDeleteSuccess: function ( oResponse, oData ) {
            MessageToast.show( "Registro excluído com sucesso !" );
            this.onNavBack();
        },
        handleDeleteError: function ( oError ) {
            if (oError) {
                if (oError.responseText) {
                    var oErrorMessage = JSON.parse(oError.responseText);
                    MessageBox.alert( oErrorMessage.error.message.value )
                }
            }
        }
    });
});
