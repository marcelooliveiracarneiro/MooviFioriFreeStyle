sap.ui.define([], function() {
	'use strict';
	
	return{
		setIconsStatusFltime: function( fltime ) {
		
			if (fltime < 300) {
				return "sap-icon://message-success";
			}
			else if (fltime < 600) {
				return "sap-icon://alert";
			}
			else if (fltime >= 600) {
				return "sap-icon://error";
			}
			
		}
	};
});
