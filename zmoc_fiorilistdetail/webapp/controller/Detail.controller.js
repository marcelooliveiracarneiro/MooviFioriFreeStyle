sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/m/library",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (BaseController, JSONModel, formatter, mobileLibrary, Fragment, MessageToast, MessageBox) {
    "use strict";

    // shortcut for sap.m.URLHelper
    var URLHelper = mobileLibrary.URLHelper;

    return BaseController.extend("moovi.zmoc_fiorilistdetail.controller.Detail", {

        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        onInit: function () {
            // Model used to manipulate control states. The chosen values make sure,
            // detail page is busy indication immediately so there is no break in
            // between the busy indication for loading the view's meta data
            var oViewModel = new JSONModel({
                busy: false,
                delay: 0,
                lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
            });

            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

            this.setModel(oViewModel, "detailView");

            this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Event handler when the share by E-Mail button has been clicked
         * @public
         */
        onSendEmailPress: function () {
            var oViewModel = this.getModel("detailView");

            URLHelper.triggerEmail(
                null,
                oViewModel.getProperty("/shareSendEmailSubject"),
                oViewModel.getProperty("/shareSendEmailMessage")
            );
        },


        /**
         * Updates the item count within the line item table's header
         * @param {object} oEvent an event containing the total number of items in the list
         * @private
         */
        onListUpdateFinished: function (oEvent) {
            var sTitle,
                iTotalItems = oEvent.getParameter("total"),
                oViewModel = this.getModel("detailView");

            // only update the counter if the length is final
            if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
                if (iTotalItems) {
                    sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
                } else {
                    //Display 'Line Items' instead of 'Line items (0)'
                    sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
                }
                oViewModel.setProperty("/lineItemListTitle", sTitle);
            }
        },

        /* =========================================================== */
        /* begin: internal methods                                     */
        /* =========================================================== */

        /**
         * Binds the view to the object path and expands the aggregated line items.
         * @function
         * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
         * @private
         */
        _onObjectMatched: function (oEvent) {
            var sObjectId = oEvent.getParameter("arguments").objectId;
            this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
            this.getModel().metadataLoaded().then(function () {
                var sObjectPath = this.getModel().createKey("ScarrSet", {
                    Carrid: sObjectId
                });
                this._bindView("/" + sObjectPath);
            }.bind(this));
        },

        /**
         * Binds the view to the object path. Makes sure that detail view displays
         * a busy indicator while data for the corresponding element binding is loaded.
         * @function
         * @param {string} sObjectPath path to the object to be bound to the view.
         * @private
         */
        _bindView: function (sObjectPath) {
            // Set busy indicator during view binding
            var oViewModel = this.getModel("detailView");

            // If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
            oViewModel.setProperty("/busy", false);

            this.getView().bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function () {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange: function () {
            var oView = this.getView(),
                oElementBinding = oView.getElementBinding();

            // No data for the binding
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("detailObjectNotFound");
                // if object could not be found, the selection in the list
                // does not make sense anymore.
                this.getOwnerComponent().oListSelector.clearListListSelection();
                return;
            }

            var sPath = oElementBinding.getPath(),
                oResourceBundle = this.getResourceBundle(),
                oObject = oView.getModel().getObject(sPath),
                sObjectId = oObject.Carrid,
                sObjectName = oObject.Carrname,
                oViewModel = this.getModel("detailView");

            this.getOwnerComponent().oListSelector.selectAListItem(sPath);

            oViewModel.setProperty("/shareSendEmailSubject",
                oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
            oViewModel.setProperty("/shareSendEmailMessage",
                oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
        },

        _onMetadataLoaded: function () {
            // Store original busy indicator delay for the detail view
            var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
                oViewModel = this.getModel("detailView"),
                oLineItemTable = this.byId("lineItemsList"),
                iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

            // Make sure busy indicator is displayed immediately when
            // detail view is displayed for the first time
            oViewModel.setProperty("/delay", 0);
            oViewModel.setProperty("/lineItemTableDelay", 0);

            oLineItemTable.attachEventOnce("updateFinished", function () {
                // Restore original busy indicator delay for line item table
                oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
            });

            // Binding the view will set it to not busy - so the view is always busy if it is not bound
            oViewModel.setProperty("/busy", true);
            // Restore original busy indicator delay for the detail view
            oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
        },

        /**
         * Set the full screen mode to false and navigate to list page
         */
        onCloseDetailPress: function () {
            this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);   
            this.getRouter().navTo("list");
        },

        /**
         * Toggle between full and non full screen mode.
         */
        toggleFullScreen: function () {
            var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
            this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
            if (!bFullScreen) {
                // store current layout and go full screen
                this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
                this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
            } else {
                // reset to previous layout
                this.getModel("appView").setProperty("/layout", this.getModel("appView").getProperty("/previousLayout"));
            }
        },

        onCompanyButtonEditPress: function ( oEvent ) {
            var oView = this.getView(), oModel = oView.getModel();

            let oEditModel = oView.getModel("editCompanyModel");
            oEditModel.setProperty("/isNew", true);

            if (!this.oDialogEditCompany) {
                this.oDialogEditCompany = Fragment.load({
                    id: oView.getId(),
                    name: "moovi.zmoc_fiorilistdetail.view.EditCompanyDialog",
                    controller: this
                }).then( function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.addStyleClass( this.getOwnerComponent().getContentDensityClass() );
                    this.oDialogEditCompany = oDialog;
                    this.oDialogEditCompany.open();
                }.bind(this));
            } else {
                this.oDialogEditCompany.open();
            }
        },
        onCompanyButtonSavePress: function ( oEvent ) {
            var that = this; 
            this.getView().getModel().submitChanges({
                success: that.handleSaveSuccess.bind(that),
                error: that.handleSaveError.bind(that)
            });
        },
        onCompanyButtonCancelPress: function ( oEvent ) {
            var oModel = this.getView().getModel();
            oModel.resetChanges();
            this.oDialogEditCompany.close();
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
                this.oDialogEditCompany.close();
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
        onCompanyButtonDeletePress: function ( oEvent ) {
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
        },
        onListItemPressed: function ( oEvent ) {
            var oItem = oEvent.getSource(), oCtx = oItem.getBindingContext();
            this.getRouter().navTo("flightDetail", { Carrid: oCtx.getProperty("Carrid"), Connid: oCtx.getProperty("Connid") });
        },
        onButtonCreatePress: function ( oEvent ) {
            var oView = this.getView(), oCtx = oView.getBindingContext();
            this.getRouter().navTo("flightDetail", { Carrid: oCtx.getProperty("Carrid"), Connid: "New" });
        }

    });


});