const API_MODULE_URL = 'http://localhost:8000/api/v1/engine/modules/products/'

var Module = Backbone.Model.extend({
    urlRoot: API_MODULE_URL,
    defaults: {
        name: '',
        version: '',
        label: '',
        description: ''
    }
});

var ModuleCollection = Backbone.Collection.extend({
    model: Module,
    url: API_MODULE_URL,
    sync: function(method, collection, options) {
        options = options || {};
        options.beforeSend = function(xhr) {
            xhr.setRequestHeader('Content-Type', 'application/json');
        };
        return Backbone.sync(method, collection, options);
    }
});

/**
 * Fetches the module product and triggers rendering on success.
 * @param {Backbone.View} context - The view or controller context (usually 'this').
 */
function getModuleProduct(context) {
    context.module = new ModuleCollection();

    context.listenTo(context.module, 'sync', function() {
        context.render();  // Correctly call render
    });

    context.module.fetch({
        error: function(collection, response) {
            alert('Module product is not available');
            window.location.href = '/activation.html';
        }
    });
}
