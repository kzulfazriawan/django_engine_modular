const ViewLogin = Backbone.View.extend({
    el: '#app',

    events: {
        'submit #login-form': 'onSubmitLogin'
    },
    
    /**
     * Handles login form submission
     * @param {Event} e 
     */
    onSubmitLogin(e) {
        e.preventDefault();

        // Get credentials
        const username = this.$('#login-username-input').val();
        const password = this.$('#login-password-input').val();

        // Clear any previous alerts/messages
        this.clearAlerts();

        // Send login request
        $.ajax({
            url: 'http://localhost:8000/api/v1/authentication/token/',
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ username, password }),

            success: (response) => {
                localStorage.setItem('token', response.token);

                this.$('#login-alert').html(`
                    <div class="uk-alert-success" uk-alert>
                        <a href class="uk-alert-close" uk-close></a>
                        <p>Authentication success. Redirecting...</p>
                    </div>
                `);

                setTimeout(() => {
                    window.location.href = '/#';  // Redirect to index
                }, 3000);
            },

            error: (xhr) => {
                const res = xhr.responseJSON || {};

                // Field-level validation messages
                if (res.username) {
                    this.$('#login-username-inline').after(
                        `<span class="uk-text-danger">${res.username[0]}</span>`
                    );
                }

                if (res.password) {
                    this.$('#login-password-inline').after(
                        `<span class="uk-text-danger">${res.password[0]}</span>`
                    );
                }

                if (res.non_field_errors || res.detail) {
                    this.$('#login-alert').html(`
                        <div class="uk-alert-danger" uk-alert>
                            <a href class="uk-alert-close" uk-close></a>
                            <p>${(res.non_field_errors && res.non_field_errors[0]) || res.detail || 'Login failed.'}</p>
                        </div>
                    `);
                }
            }
        });
    },

    /**
     * Clears any error or alert messages
     */
    clearAlerts() {
        this.$('.uk-text-danger').remove();
        this.$('.uk-alert-danger').remove();
        this.$('.uk-alert-success').remove();
    },

    /**
     * Loads the login HTML template
     */
    render() {
        $.get('/src/templates/login.html', (html) => {
            this.$el.html(html);
        });
        return this;
    }
});
