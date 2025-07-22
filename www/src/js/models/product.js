const API_PRODUCT_URL = 'http://localhost:8000/api/v1/products/product/';

var Product = Backbone.Model.extend({
    urlRoot: API_PRODUCT_URL,
    idAttribute: 'uuid', // <- ADD THIS
    defaults: {
        name: '',
        barcode: '',
        stock: 0,
        price: 0
    },

    url: function () {
        const base = _.result(this, 'urlRoot');
        return this.isNew() ? base : base + encodeURIComponent(this.id) + '/';
    }
});


var ProductCollection = Backbone.Collection.extend({
    model: Product,
    url: API_PRODUCT_URL,

    // Automatically attach headers
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
 * Fetches products and renders them in the given view context.
 * @param {Backbone.View} context - View instance to attach collection and render.
 */
function getProducts(context) {
    context.products = new ProductCollection();

    context.listenTo(context.products, 'sync', () => {
        context.render();  // Ensure render is called properly
    });

    context.products.fetch({
        error: () => {
            alert('Failed to load products. Redirecting to login.');
            window.location.href = '/#login';
        }
    });
}
