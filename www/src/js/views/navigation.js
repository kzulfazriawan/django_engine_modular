const ViewNavigation = Backbone.View.extend({
    el: '#app',

    events: {
        'click #logout-service': 'showLogoutModal',
        'submit #logout-confirmation': 'logout'
    },

    render: function () {
        const token = localStorage.getItem('token');

        if (token) {
            $.get('/src/templates/navigation.html', (html) => {
                this.$('#navigation').html(html);

                // Re-delegate events after dynamic HTML load
                this.delegateEvents();
            });
        } else {
            this.$('#navigation').empty(); // Clear navbar if not logged in
        }

        return this;
    },

    showLogoutModal: function (e) {
        e.preventDefault();
        $('#logout-delete').html('Are you sure you want to logout?');
        UIkit.modal('#logout-page').show();
    },

    logout: function (e) {
        e.preventDefault();

        const $submitBtn = this.$('#logout-confirmation button[type=submit]');
        $submitBtn.prop('disabled', true).text('Logging out...');

        $.ajax({
            url: 'http://localhost:8000/api/v1/authentication/token/',
            method: 'DELETE',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json; charset=utf-8'
            },
            success: () => {
                localStorage.removeItem('token');
                UIkit.modal('#logout-page').hide();
                window.location.href = '/#login';
            },
            error: () => {
                alert('Logout failed. Please try again.');
            },
            complete: () => {
                $submitBtn.prop('disabled', false).text('Logout');
            }
        });
    }
});
