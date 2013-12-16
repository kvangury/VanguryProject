var Contacts = Contacts || {};

Contacts.controller = (function ($, dataContext) {
    var contactsListPageId = "contacts-list-page";
    var contactsListSelector = "#contacts-list-content";
    var appStorageKey = "Contacts.ContactsList";
    var contactsEditorPageId = "contact-editor-page";
    var contactFnameEditorSel = "[name=contact-fname-editor]",
        contactLnameEditorSel = "[name=contact-lname-editor]",
		 contactNumberEditorSel = "[name=contact-number-editor]",
		  contactAddressEditorSel = "[name=contact-address-editor]",
		   contactEmailEditorSel = "[name=contact-email-editor]";
    var saveContactButtonSel = "#save-contact-button";
    var invalidContactDlgSel = "#invalid-contact-dialog";
    var defaultDlgTrsn = { transition: "fade" };
    var confirmDeleteContactDlgSel = "#confirm-delete-contact-dialog";
    var deleteContactButtonSel = "#delete-contact-button",
        deleteContactContentPlaceholderSel = "#delete-contact-content-placeholder",
        okToDeleteContactButtonSel = "#ok-to-delete-contact-button";

    var queryStringToObject = function (queryString) {
        var queryStringObj = {};
        var e;
        var a = /\+/g;  
        var r = /([^&;=]+)=?([^&;]*)/g;
        var d = function (s) { return decodeURIComponent(s.replace(a, " ")); };
        e = r.exec(queryString);
        while (e) {
            queryStringObj[d(e[1])] = d(e[2]);
            e = r.exec(queryString);

        }
        return queryStringObj;
    };
    var returnToContactsListPage = function () {

        $.mobile.changePage("#" + contactsListPageId,
        { transition: "fade", reverse: true });
    };
    var resetCurrentContact = function () {
        currentContact = null;
    };
    var renderContactsList = function () {
        var contactsList = dataContext.getContactsList();
        var view = $(contactsListSelector);
        view.empty();

        var liArray = [],
            contactsCount,
            conta,
            i,
            ul,
            liHtml,
            dateGroup,
            contaDate;

        contactsCount = contactsList.length;
        ul = $("<ul id=\"contacts-list\" data-role=\"listview\"></ul>").appendTo(view);

        for (i = 0; i < contactsCount; i += 1) {

            conta = contactsList[i];

            contaDate = (new Date(conta.dateCreated)).toDateString();

            if (dateGroup !== contaDate) {
                liArray.push("<li data-role=\"list-divider\">" + contaDate + "</li>");
                dateGroup = contaDate;
            }

            liHtml = "<li>"
            + "<a data-url=\"default.html#contact-editor-page?contaId=" + conta.id + "\" href=\"default.html#contact-editor-page?contaId=" + conta.id + "\">"
            + "<div class=\"list-item-fname\"> Full Name: &nbsp;" + conta.fname + "&nbsp; " +conta.lname + "</div>"
        
			 + "<div class=\"list-item-number\"> Phone Number: &nbsp;" + conta.number + "</div>"
			  
			  
            + "</a>"
            + "</li>"

            liArray.push(liHtml);

        }
        var listItems = liArray.join("");
        $(listItems).appendTo(ul);
        ul.listview();
    };

    var renderSelectedContact = function (data) {
        var u = $.mobile.path.parseUrl(data.options.fromPage.context.URL);
        var re = "^#" + contactsEditorPageId;
        if (u.hash.search(re) !== -1) {
            var queryStringObj = queryStringToObject(data.options.queryString);
            var fnameEditor = $(contactFnameEditorSel);
            var lnameEditor = $(contactLnameEditorSel);
			var numberEditor = $(contactNumberEditorSel);
			var addressEditor = $(contactAddressEditorSel);
			var emailEditor = $(contactEmailEditorSel);
					
            var contaId = queryStringObj["contaId"];
            if (typeof contaId !== "undefined") {
              
                var contactsList = dataContext.getContactsList();
                var contactsCount = contactsList.length;
                var contact;
                for (var i = 0; i < contactsCount; i++) {
                    contact = contactsList[i];
                    if (contaId === contact.id) {
                        currentContact = contact;
                        fnameEditor.val(currentContact.fname);
                        lnameEditor.val(currentContact.lname);
						numberEditor.val(currentContact.number);
						addressEditor.val(currentContact.address);
						emailEditor.val(currentContact.email);
                    }
                }
            } else {
                
                fnameEditor.val("");
                lnameEditor.val("");
				numberEditor.val("");
				addressEditor.val("");
				addressEditor.val("");
            }
            fnameEditor.focus();
        }
    };
    var onPageBeforeChange = function (event, data) {
        if (typeof data.toPage === "string") {
            var url = $.mobile.path.parseUrl(data.toPage);
            if ($.mobile.path.isEmbeddedPage(url)) {
                data.options.queryString = $.mobile.path.parseUrl(url.hash.replace(/^#/, "")).search.replace("?", "");
            }
        }
    };
    var onPageChange = function (event, data) {
        var toPageId = data.toPage.attr("id");
        var fromPageId = null;
        if (data.options.fromPage) {
            fromPageId = data.options.fromPage.attr("id");
        }
        switch (toPageId) {
            case contactsListPageId:
                resetCurrentContact(); 
                renderContactsList();
                break;
            case contactsEditorPageId:
                if (fromPageId === contactsListPageId) {
                    renderSelectedContact(data);
                }
                break;
        }
    };
    var onSaveContactButtonTapped = function () {
      
        var fnameEditor = $(contactFnameEditorSel);
        var lnameEditor = $(contactLnameEditorSel);
		var numberEditor = $(contactNumberEditorSel);
		var addressEditor = $(contactAddressEditorSel);
		var emailEditor = $(contactEmailEditorSel);
        var tempContact = dataContext.createBlankContact();
        tempContact.fname = fnameEditor.val();
        tempContact.lname = lnameEditor.val();
		tempContact.number = numberEditor.val();
		tempContact.address= addressEditor.val();
		tempContact.email = emailEditor.val();
		
		
        if (tempContact.isValid()) {
            if (null != currentContact) {
                currentContact.fname = tempContact.fname;
				currentContact.lname = tempContact.lname;
				currentContact.number = tempContact.number;
				currentContact.address = tempContact.address;
				currentContact.email = tempContact.email;
            } else {
                currentContact = tempContact;
            }
            dataContext.saveContact(currentContact);
            returnToContactsListPage();
        } else {
            
            $.mobile.changePage(invalidContactDlgSel, defaultDlgTrsn);
        }
    };
    var onDeleteContactButtonTapped = function () {
        if (currentContact) {
            
            var ContactContentPlaceholder = $(deleteContactContentPlaceholderSel);
            ContactContentPlaceholder.empty();
            $("<h3>" + currentContact.fname + "</h3><p>" + currentContact.number + "</p>").appendTo(ContactContentPlaceholder);
            $.mobile.changePage(confirmDeleteContactDlgSel, defaultDlgTrsn);
        }
    };
    var onOKToDeleteContactButtonTapped = function () {
        dataContext.deleteContact(currentContact);
        returnToContactsListPage();
    };
    var init = function () {
        dataContext.init("Contacts.ContactsList");
        var d = $(document);
        d.bind("pagebeforechange", onPageBeforeChange);
        d.bind("pagechange", onPageChange);
        d.delegate(saveContactButtonSel, "tap", onSaveContactButtonTapped);
        d.delegate(deleteContactButtonSel, "tap", onDeleteContactButtonTapped);
        d.delegate(okToDeleteContactButtonSel, "tap", onOKToDeleteContactButtonTapped);
    };
    var public = {
        init: init
    };
    return public;
})(jQuery, Contacts.dataContext);
$(document).bind("mobileinit", function () {
    Contacts.controller.init();
});