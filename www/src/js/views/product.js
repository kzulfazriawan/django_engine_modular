const ViewProduct = Backbone.View.extend({
    el: '#app',
    events: {
        'submit #create-product-form': 'create'
    },

    initialize: function() {
        this.product = '';
        const self = this;
        $.ajax({
            url: 'http://localhost:8000/api/v1/engine/modules/products/',
            method: 'GET',
            content_type: 'application/json',
            success: function(response){
                console.log(response);
                $.get('/src/templates/product.html', (html) => {
                    self.product = html;
                });

                self.account = new AccountCollection();
                self.account.fetch({
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
                        xhr.setRequestHeader('Content-Type', 'application/json');
                    },
                    success: function() {
                        self.render;
                    },
                    error: function(collection, response) {
                        alert('Authorization is not valid');
                        window.location.href = '/#login';
                    }
                });
                self.listenTo(self.account, 'sync', self.render);
            },
            error: function(response){
                console.log(response);
                window.location.href = '/not_found.html';
            }
        });
    },

    create(e){
        e.preventDefault();
        let name = this.$('#name').val();
        let barcode = this.$('#barcode').val();
        let stock = this.$('#stock').val();
        let price = this.$('#price').val();

        $.ajax({
            url: api_product,
            method: 'POST',
            headers: {Authorization: 'Token ' + localStorage.getItem('token')},
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                'name': name,
                'barcode': barcode,
                'stock': stock,
                'price': price
            }),
            success: (response) => {
                // Clear previous
                this.$('.uk-text-danger').remove();
                this.$('.uk-alert-danger').remove();
                this.$('.uk-alert-success').remove();
                this.$('#first-name-stack').before(`<div class="uk-alert-success uk-padding-small">Create success</div>`);
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            },
            error: (response) => {
                let res = response.responseJSON;
                // Clear previous
                this.$('.uk-text-danger').remove();
                this.$('.uk-alert-danger').remove();
                this.$('.uk-alert-success').remove();

                // Field-specific
                if (res.name) {
                    this.$('#name').after(`<span class="uk-text-danger">${res.name[0]}</span>`);
                }
                if (res.barcode) {
                    this.$('#barcode').after(`<span class="uk-text-danger">${res.barcode[0]}</span>`);
                }
                if (res.stock) {
                    this.$('#stock').after(`<span class="uk-text-danger">${res.stock[0]}</span>`);
                }
                if (res.price) {
                    this.$('#price').after(`<span class="uk-text-danger">${res.price[0]}</span>`);
                }

                // Non Field
                if (res.non_field_errors) {
                    this.$('#first-name-stack').before(`<div class="uk-alert-danger uk-padding-small">${res.non_field_errors[0]}</div>`);
                }
            }
        });
    },

    render() {
        if(localStorage.getItem('token')){
            this.$el.html(this.product);
            // ____Get Account____
            this.account.each(function(item){
                if(item.get('roles') != 'manager' && item.get('roles') != 'user'){
                    alert('You dont have permission to do this');
                    window.location.href = '/';
                }
                this.$('#authorized-as').html(`<span class="uk-text-bold">${item.get('name')}</span> (${item.get('username')})`);
            });
        } else {
            window.location.href = '/#login'
        }
        return this;
    }
  });
  