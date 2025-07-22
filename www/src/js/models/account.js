const API_ACCOUNT_URL = 'http://localhost:8000/api/v1/authentication/account/';

// Account model for individual account representation
var Account = Backbone.Model.extend({
    urlRoot: API_ACCOUNT_URL,
    defaults: {
        name: '',
        username: '',
        roles: ''
    }
});

// Account collection for multiple accounts (if needed)
var AccountCollection = Backbone.Collection.extend({
    model: Account,
    url: API_ACCOUNT_URL,

    // Ensure all requests include the token automatically
    sync: function(method, collection, options) {
        options = options || {};
        options.beforeSend = function(xhr) {
            xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
            xhr.setRequestHeader('Content-Type', 'application/json');
        };
        return Backbone.sync(method, collection, options);
    }
});

/**
 * Fetches the authenticated account and triggers rendering on success.
 * @param {Backbone.View} context - The view or controller context (usually 'this').
 */
function getAccount(context) {
    context.account = new AccountCollection();

    context.listenTo(context.account, 'sync', function() {
        context.render();  // Correctly call render
    });

    context.account.fetch({
        error: function(collection, response) {
            alert('Authorization is not valid');
            window.location.href = '/#login';
        }
    });
}
