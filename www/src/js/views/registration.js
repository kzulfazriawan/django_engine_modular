const ViewRegistration = Backbone.View.extend({
    el: '#app',
    events: {
        'submit #registration-form': 'registration'
    },

    initialize: function() {
        this.registration = '';
        const self = this;

        $.ajax({
            url: 'http://localhost:8000/api/v1/engine/modules/products/',
            method: 'GET',
            content_type: 'application/json',
            success: function(response){
                console.log(response);
            },
            error: function(response){
                window.location.href = '/not_found.html';
            }
        });
    },
  
    registration(e){
        e.preventDefault();
        let first_name = this.$('#first_name').val();
        let last_name = this.$('#last_name').val();
        let username = this.$('#username').val();
        let email = this.$('#email').val();
        let password = this.$('#password').val();
        let password2 = this.$('#password2').val();

        $.ajax({
            url: 'http://localhost:8000/api/v1/authentication/registration/',
            method: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                'first_name': first_name,
                'last_name': last_name,
                'username': username,
                'email': email,
                'password': password,
                'password2': password2
            }),
            success: (response) => {
                // Clear previous
                this.$('.uk-text-danger').remove();
                this.$('.uk-alert-danger').remove();
                this.$('.uk-alert-success').remove();
                localStorage.setItem('token', response.token);
                this.$('#first-name-stack').before(`<div class="uk-alert-success uk-padding-small">Registration success</div>`);
                setTimeout(() => {
                    window.location.href = '/#registration';
                }, 3000);
            },
            error: (response) => {
                let res = response.responseJSON;
                // Clear previous
                this.$('.uk-text-danger').remove();
                this.$('.uk-alert-danger').remove();
                this.$('.uk-alert-success').remove();

                // Field-specific
                if (res.first_name) {
                    this.$('#first_name').after(`<span class="uk-text-danger">${res.first_name[0]}</span>`);
                }

                if (res.last_name) {
                    this.$('#last_name').after(`<span class="uk-text-danger">${res.last_name[0]}</span>`);
                }

                if (res.username) {
                    this.$('#username').after(`<span class="uk-text-danger">${res.username[0]}</span>`);
                }

                if (res.email) {
                    this.$('#email').after(`<span class="uk-text-danger">${res.email[0]}</span>`);
                }

                if (res.password) {
                    this.$('#password').after(`<span class="uk-text-danger">${res.password[0]}</span>`);
                }

                if (res.password2) {
                    this.$('#password2').after(`<span class="uk-text-danger">${res.password2[0]}</span>`);
                }

                // Non Field
                if (res.non_field_errors) {
                    this.$('#first-name-stack').before(`<div class="uk-alert-danger uk-padding-small">${res.non_field_errors[0]}</div>`);
                }
            }
        });
    }, 

    render() {
        $.get('/src/templates/registration.html', (html) => {
            this.$el.html(html);
        });
        return this;
    },
  });
  