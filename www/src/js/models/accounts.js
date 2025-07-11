let api_account = 'http://localhost:8000/api/v1/authentication/account/'

var Account = Backbone.Model.extend({
    urlRoot: api_account,  // for single item fetch
    defaults: {
        name    : '',
        username: '',
        roles   : ''
    }
});

var AccountCollection = Backbone.Collection.extend({
    model: Account,
    url: api_account
});
