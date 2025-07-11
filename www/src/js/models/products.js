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
