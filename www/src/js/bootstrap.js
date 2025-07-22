function checkModuleActivation(callback) {
    const modules = new ModuleCollection();

    modules.fetch({
        success: function () {
            const productModule = modules.findWhere({ name: 'products' });

            if (!productModule || productModule.get('is_active') === false) {
                window.location.href = '/activation.html';
            } else {
                callback(); // Continue app bootstrapping
            }
        },
        error: function () {
            window.location.href = '/activation.html';
        }
    });
}

$(function () {
    checkModuleActivation(function () {
        new AppRouter();
        Backbone.history.start();
    });
});
