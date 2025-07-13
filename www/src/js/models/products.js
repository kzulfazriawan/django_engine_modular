let api_product = 'http://localhost:8000/api/v1/products/product/'

var Product = Backbone.Model.extend({
    urlRoot: api_product,  // for single item fetch
    defaults: {
        name    : '',
        username: '',
        stock   : 0,
        price   : 0
    }
});

var ProductCollection = Backbone.Collection.extend({
    model: Product,
    url: api_product
});

var get_products = function(self){
    self.products = new ProductCollection();
    self.products.fetch({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
            xhr.setRequestHeader('Content-Type', 'application/json');
        },
        success: function() {
            self.render;
        }
    });
    self.listenTo(self.products, 'sync', self.render);
}