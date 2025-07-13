const ViewLogin = Backbone.View.extend({
    el: '#app',

    events: {
      'submit #login-form': 'login'
    },

    initialize: function() {
        this.login = '';
        const self = this;

        $.ajax({
            url: 'http://localhost:8000/api/v1/engine/modules/products/',
            method: 'GET',
            content_type: 'application/json',
            success: function(response){
                console.log(response)
            },
            error: function(response){
                window.location.href = '/not_found.html';
            }
        });
    },

    login(e){
        e.preventDefault();
        let username = this.$('#username').val();
        let password = this.$('#password').val();

        $.ajax({
            url: 'http://localhost:8000/api/v1/authentication/token/',
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({'username': username, 'password': password}),
            success: (response) => {
                // Clear previous
                this.$('.uk-text-danger').remove();
                this.$('.uk-alert-danger').remove();
                this.$('.uk-alert-success').remove();
                localStorage.setItem('token', response.token);
                this.$('#username-stack').before(`<div class="uk-alert-success uk-padding-small">Login success</div>`);
                setTimeout(() => {
                    window.location.href = '/#';
                }, 3000);
            },
            error: (response) => {
                let res = response.responseJSON;
                // Clear previous
                this.$('.uk-text-danger').remove();
                this.$('.uk-alert-danger').remove();
                this.$('.uk-alert-success').remove();

                // Field-specific
                if (res.username) {
                    this.$('#username').after(`<span class="uk-text-danger">${res.username[0]}</span>`);
                }

                if (res.password) {
                    this.$('#password').after(`<span class="uk-text-danger">${res.password[0]}</span>`);
                }

                if (res.non_field_errors) {
                    this.$('#username-stack').before(`<div class="uk-alert-danger uk-padding-small">${res.non_field_errors[0]}</div>`);
                }
            }
        });
    }, 
  
    render() {
        $.get('/src/templates/login.html', (html) => {
            this.$el.html(html);
        });
        return this;
    }
  });
  