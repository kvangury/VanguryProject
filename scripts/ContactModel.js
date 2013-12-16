var Contacts = Contacts || {};
        Contacts.contactModel = function (config) {
            this.id = config.id;
            this.dateCreated = config.dateCreated;
            this.fname = config.fname;
            this.lname = config.lname;
			this.number = config.number;
			this.address = config.address;
			this.email = config.email;
								
        };
        Contacts.contactModel.prototype.isValid = function () {
            "use strict";
            if (this.fname && this.fname.length > 0 ) {
                if (this.number && this.number.length > 0)
				return true;
            }
            return false;
        };

