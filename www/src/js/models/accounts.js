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

var get_account = function(self) {
    self.account = new AccountCollection();
    self.account.fetch({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
            xhr.setRequestHeader('Content-Type', 'application/json');
        },
        success: function() {
            self.render;
        },
        error: function(collection, response) {
            alert('Authorization is not valid');
            window.location.href = '/#login';
        }
    });
    self.listenTo(self.account, 'sync', self.render);
}
