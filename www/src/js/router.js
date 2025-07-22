const AppRouter = Backbone.Router.extend({
    routes: {
        'login'              : 'viewLogin',
        'create-product'     : 'viewCreateProduct',
        'edit-product/:uuid' : 'viewUpdateProduct',
        ''                   : 'viewDashboard'
    },
  
    viewLogin() {
        const loginView = new ViewLogin();
        loginView.render();
    },
    viewDashboard() {
        const dashboardView = new ViewDashboard();
        dashboardView.render();
    },
    viewCreateProduct() {
        // Clean previous view to prevent memory leaks
        if (this.currentView) {
            this.currentView.remove();
            this.currentView = null;
        }

        // Delay render to ensure DOM is ready
        setTimeout(() => {
            const createProductView = new ViewCreateProduct();
            this.currentView = createProductView;
            createProductView.render();
        }, .1);
    },
    viewUpdateProduct(uuid) {
    // Clean previous view to prevent memory leaks
        if (this.currentView) {
            this.currentView.remove();
            this.currentView = null;
        }

        // Delay render to ensure DOM is ready
        setTimeout(() => {
            const updateProductView = new ViewUpdateProduct({ uuid: uuid });
            this.currentView = updateProductView;
            updateProductView.render();
        }, .1);
    },
});
  