const ViewDashboard = Backbone.View.extend({
    el: '#app',
    
    initialize: function() {
        this.dashboard = ''
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

                self.products = new ProductCollection();
                self.products.fetch({
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
                        xhr.setRequestHeader('Content-Type', 'application/json');
                    },
                    success: function() {
                        self.render;
                    },
                    error: function(collection, response) {
                        alert('Service unavailable');
                        window.location.href = '/not_found.html';
                    }
                });
                self.listenTo(self.products, 'sync', self.render);
        
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
                //window.location.href = '/not_found.html';
            }
        });
    },

    render() {
        if(localStorage.getItem('token')){
            var trash = '';
            this.$el.html(this.dashboard);
            // ____Get Account____
            this.account.each(function(item){
                trash = (item.get('roles') == 'manager') ? '<li><a href="#" uk-icon="icon: trash"></a></li>' : '';
                this.$('#authorized-as').html(`<span class="uk-text-bold">${item.get('name')}</span> (${item.get('username')})`);
            });
            
            this.products.each(function(product) {
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
  