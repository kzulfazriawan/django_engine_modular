const AppRouter = Backbone.Router.extend({
    routes: {
        'login'       : 'viewLogin',
        'registration': 'viewRegistration',
        'logout'      : 'viewLogout',
        'product'     : 'viewProduct',
        ''            : 'viewDashboard'
    },
  
    viewDashboard() {
        const dashboardView = new ViewDashboard();
        dashboardView.render();
    },

    viewProduct() {
        const productView = new ViewProduct();
        productView.render();
    },

    viewLogin() {
        const loginView = new ViewLogin();
        loginView.render();
    },

    viewRegistration() {
        const registrationView = new ViewRegistration();
        registrationView.render();
    },
    viewLogout() {
        const logoutView = new ViewLogout();
        logoutView.render();
    },
});
  