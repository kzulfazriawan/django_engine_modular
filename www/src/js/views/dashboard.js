const ViewDashboard = Backbone.View.extend({
    el: '#app',

    events: {
        'click .link-delete': 'onDelete'
    },
    onDelete(e){
        e.preventDefault();
        if (confirm('Are you sure want to delete this?')){
            let product_id = $(e.currentTarget).attr('data-id');
    
            const product = new Product({ id: product_id + '/'});
        
            product.destroy({
                wait: true,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
                },
                success: function() {
                    UIkit.modal('#modal-example').hide();
                    alert("Product deleted");
                },
                error: function(model, response) {
                    console.error("Failed to delete:", response.responseText);
                }
            });
        }
    },

    initialize: function() {
        this.dashboard = '';
        const self = this;

        $.ajax({
            url: 'http://localhost:8000/api/v1/engine/modules/products/',
            method: 'GET',
            content_type: 'application/json',
            success: function(response){
                console.log(response);

                $.get('/src/templates/dashboard.html', (html) => {
                    self.dashboard = html;
                });

                get_account(self);
                get_products(self);
            },
            error: function(response){
                window.location.href = '/not_found.html';
            }
        });
    },

    render() {
        if(localStorage.getItem('token')){
            var trash = false;
            this.$el.html(this.dashboard);

            // ____Get Account____
            this.account.each(function(item){
                trash = (item.get('roles') == 'manager') ? true : false;
                this.$('#authorized-as').html(`<span class="uk-text-bold">${item.get('name')}</span> (${item.get('username')})`);
            });
            
            // ____Get products____
            this.products.each(function(product) {
                trash = (trash) ? '<li><a href="#" data-id="' + product.get('uuid') + '" uk-icon="icon: trash" class="link-delete"></a></li>' : '';
                let action = '<ul class="uk-iconnav"><li><a href="#" uk-icon="icon: file-edit"></a></li>' + trash + '</ul>';
                this.$('#table-body-products').append(
                    `<tr><td>${product.get('name')}</td><td>${product.get('barcode')}</td><td>${product.get('stock')}</td><td>${product.get('price')}</td><td>${action}</td></tr>`
                );
            });

        } else {
            window.location.href = '/#login'
        }
        return this;
    }
  });
