sap.ui.define([
    "moovi/m10/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
function (Controller,MessageToast,MessageBox) {
    "use strict";

    return Controller.extend("moovi.m10.controller.CompanyDetail", {
        onInit: function () {
            let oRouter = this.getRouter();
            oRouter.getRoute("RouteCompanyDetail").attachMatched(this.onRoutedMatched,this);
        },
        onRoutedMatched: function(oEvent) {
            var oView = this.getView();
            var oArgs = oEvent.getParameters().arguments; 

            var oModelEdit = oView.getModel("companyModelEdit");
            oModelEdit.setProperty("/isNew", false);

            if (oArgs.carrid != "New") {
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
            } else {
                this._initNewCompany();
            }
        },
        _initNewCompany: function (oEvent) {
            var oView = this.getView(), oModel = oView.getModel();

            var oModelEdit =  oView.getModel("companyModelEdit");
            oModelEdit.setProperty("/isNew", true);

            oModel.setDeferredGroups(["creategroupId"]);
            oModel.setChangeGroups({
                "ScarrSet": {
                    groupId: "creategroupId",
                    changeSetId: "Id"
                }
            });
            var oContext = oModel.createEntry("/ScarrSet", {
                groupId: "creategroupId",
                properties: {}
            });
            oView.bindElement( oContext.getPath() );
        },
        _onBindChange: function (oEvent) {
			let oElementBinding = this.getView().getElementBinding();
            if ((!oElementBinding) || (!oElementBinding.getBoundContext())) {
                this.getRouter().getTargets().display("TargetNotFound");
            }
        },
        onButtonSavePress: function (oEvent) {
            var oModel = this.getView().getModel();
            oModel.submitChanges({
                success: this.handleSaveSuccess.bind(this),
                error: this.handleSaveError.bind(this)
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
