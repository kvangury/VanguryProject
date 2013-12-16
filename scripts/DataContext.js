var Contacts = Contacts || {};
Contacts.dataContext = (function () {
    var contactsList = [],
        contactsListStorageKey = "Contacts.ContactsList";
    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var getContactsList = function () {
        return contactsList;
    };
    var loadContactsFromLocalStorage = function () {
        var storedContacts = $.jStorage.get(contactsListStorageKey);
        if (storedContacts !== null) {
            contactsList = storedContacts;
        } else {
            contactsList = [];
        }
    };
    var saveContactsToLocalStorage = function () {
        $.jStorage.set(contactsListStorageKey, contactsList);
    };
    var createBlankContact = function () {
        var dateCreated = new Date();
        var id = dateCreated.getTime().toString() + (getRandomInt(0, 100)).toString();
        var contactModel = new Contacts.contactModel({
            id: id,
            dateCreated: dateCreated,
            fname: "",
            lname: "",
			number: "",
			address:""
					
        });
        return contactModel;
    };
    var saveContact = function (contactModel) {
        var fexist = false;
        var i;
        for (i = 0; i < contactsList.length; i += 1) {
            if (contactsList[i].id === contactModel.id) {
                contactsList[i] = contactModel;
                fexist = true;
                i = contactsList.length;
            }
        }
        if (!fexist) {
            contactsList.splice(0, 0, contactModel);
        }
        saveContactsToLocalStorage();
    };
    var deleteContact = function (contactModel) {
        var i;
        for (i = 0; i < contactsList.length; i += 1) {
            if (contactsList[i].id === contactModel.id) {
                contactsList.splice(i, 1);
                i = contactsList.length;
            }
        }
        saveContactsToLocalStorage();
    };
    var init = function (storageKey) {
        contactsListStorageKey = storageKey;
        loadContactsFromLocalStorage();
    };
    var public = {
        init: init,
        getContactsList: getContactsList,
        createBlankContact: createBlankContact,
        saveContact: saveContact,
        deleteContact: deleteContact
    };
    return public;
})();