const ViewDashboard = Backbone.View.extend({
    el: '#app',

    initialize: function() {
        this.account = new AccountCollection();
        this.products = new ProductCollection();
    
        this.listenTo(this.account, 'sync', this.onAccountSynced);
        this.listenTo(this.products, 'sync', this.onProductsSynced);
    },
    
    events: {
        'click .link-delete': 'onClickDeleteLink',
        'submit #delete-confirmation': 'onSubmitDeleteProduct'
    },
    
    onAccountSynced: function () {
        const user = this.account.at(0);
        if (!user) return;
    
        this.currentUserRole = user.get('roles');
        this.$('#dashboard-header').html(
            `Welcome! ${user.get('name')} <span class="uk-label">${this.currentUserRole}</span>`
        );
        this.fetchAndRenderProducts();  // No longer pass role — use instance
    },
    
    onProductsSynced: function () {
        this.renderProducts(this.currentUserRole);
    },
    render: function() {
        if (!localStorage.getItem('token')) {
            window.location.href = '/#login';
            return this;
        }

        $.get('/src/templates/dashboard.html', (html) => {
        
            this.$el.html(html);
            this.delegateEvents(); // Fix: Rebind DOM events after rendering HTML
            // Fetch account AFTER the HTML has loaded so we can inject into it
            
            // Render navigation bar globally
            const navView = new ViewNavigation();
            navView.render();
            
            this.fetchAndRenderAccount();
        });

        return this;
    },

    fetchAndRenderAccount: function () {
        this.account.fetch({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            error: () => {
                alert('Failed to load account info. Redirecting to login.');
                window.location.href = '/#login';
            }
        });
    },
    
    fetchAndRenderProducts: function () {
        this.products.fetch({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            error: () => {
                this.$('#product-list-error').html(`
                    <div class="uk-alert-danger" uk-alert>
                        <a class="uk-alert-close" uk-close></a>
                        <p>Failed to load product list.</p>
                    </div>
                `);
            }
        });
    },

    renderProducts: function(role) {
        const tbody = this.$('#dashboard-product-lists');
        tbody.empty();
    
        const canDelete = role === 'manager';
    
        this.products.each((product) => {
            const trashIcon = canDelete
                ? `<li><a href="#" data-id="${product.get('uuid')}" uk-icon="icon: trash" class="link-delete"></a></li>`
                : '';
    
            const actions = `
                <ul class="uk-iconnav">
                    <li><a href="#edit-product/${product.get('uuid')}" uk-icon="icon: file-edit"></a></li>
                    ${trashIcon}
                </ul>
            `;
    
            tbody.append(`
                <tr>
                    <td>${product.get('name')}</td>
                    <td>${product.get('barcode')}</td>
                    <td>${product.get('stock')}</td>
                    <td>${product.get('price')}</td>
                    <td>${actions}</td>
                </tr>
            `);
        });
    },    

    onClickDeleteLink: function (e) {
        e.preventDefault();
    
        const productId = $(e.currentTarget).data('id');
        const product = this.products.findWhere({ uuid: productId });
    
        if (product) {
            this.$('#delete-product-id').val(productId);
            this.$('#confirmation-delete').html(
                `Are you sure you want to delete <strong>${product.get('name')}</strong>?`
            );
            UIkit.modal('#dashboard-delete-product').show();
        }
    },

    onSubmitDeleteProduct: function (e) {
        e.preventDefault(); // Prevent native form submit

        const $submitBtn = this.$('#delete-confirmation button[type=submit]');
        const productId = this.$('#delete-product-id').val();
    
        $submitBtn.prop('disabled', true).text('Deleting...');
    
        $.ajax({
            url: API_PRODUCT_URL + productId + '/',
            method: 'DELETE',
            headers: {
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            success: () => {
                UIkit.modal('#dashboard-delete-product').hide();
                this.render(); // or trigger refresh of product list
            },
            error: () => {
                alert('Failed to delete product');
            },
            complete: () => {
                $submitBtn.prop('disabled', false).text('Delete');
            }
        });
    },
    remove: function () {
        this.undelegateEvents();
        this.$el.empty(); // remove DOM content
        this.stopListening(); // stop all Backbone events
        return this;
    }
});
