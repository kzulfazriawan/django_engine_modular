const ViewCreateProduct = Backbone.View.extend({
    el: '#app',

    events: {
        'submit #product-form': 'createProduct'
    },

    initialize: function () {
        this.account = new AccountCollection();
        this.listenTo(this.account, 'sync', this.onAccountSynced);
    },

    onAccountSynced: function () {
        const user = this.account.at(0);
        if (!user || !['manager', 'user'].includes(user.get('roles'))) {
            alert('You do not have permission to create a product.');
            window.location.href = '/';
            return;
        }

        this.currentUserRole = user.get('roles');
        this.$('#product-header').html(
            `Create product. ${user.get('name')} <span class="uk-label">${this.currentUserRole}</span>`
        );
    },

    render: function () {
        if (!localStorage.getItem('token')) {
            window.location.href = '/#login';
            return this;
        }

        $.get('/src/templates/product.html', (html) => {
            this.$el.html(html);
            this.delegateEvents(); // Rebind events after template injection

            const navView = new ViewNavigation();
            navView.render();
    
            this.fetchAccount();
        });

        return this;
    },

    fetchAccount: function () {
        this.account.fetch({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
                xhr.setRequestHeader('Content-Type', 'application/json');
            },
            error: () => {
                alert('Failed to verify account. Redirecting...');
                window.location.href = '/#login';
            }
        });
    },
    createProduct: function (e) {
        e.preventDefault();
    
        const $submitBtn = this.$('#product-submit-button');
        $submitBtn.prop('disabled', true).text('Submitting...');
    
        // Clear previous errors
        this.$('.uk-text-danger').remove();
        this.$('.uk-alert-danger').remove();
        this.$('.uk-alert-success').remove();
    
        const payload = {
            name: this.$('#product-name-input').val(),
            barcode: this.$('#product-barcode-input').val(),
            stock: this.$('#product-stock-input').val(),
            price: this.$('#product-price-input').val()
        };
    
        $.ajax({
            url: API_PRODUCT_URL,
            method: 'POST',
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token')
            },
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(payload),
    
            success: () => {
                this.$('#product-alert').before(`
                    <div class="uk-alert-success uk-padding-small" uk-alert>
                        <p>Product created successfully.</p>
                    </div>
                `);
    
                // Clear input fields
                this.$('#product-name-input').val('');
                this.$('#product-barcode-input').val('');
                this.$('#product-stock-input').val('');
                this.$('#product-price-input').val('');
                this.$('#product-name-input').focus();
            },
    
            error: (response) => {
                const res = response.responseJSON || {};
                const fields = ['name', 'barcode', 'stock', 'price'];
    
                fields.forEach((field) => {
                    if (res[field]) {
                        this.$(`#product-${field}-inline`).after(
                            `<span class="uk-text-danger">${res[field][0]}</span>`
                        );
                    }
                });
    
                if (res.non_field_errors) {
                    this.$('#product-alert').before(`
                        <div class="uk-alert-danger uk-padding-small" uk-alert>
                            <p>${res.non_field_errors[0]}</p>
                        </div>
                    `);
                }
            },
    
            complete: () => {
                // Re-enable the submit button
                $submitBtn.prop('disabled', false).text('Submit');
            }
        });
    },

    remove: function () {
        this.stopListening();
        this.undelegateEvents();
        this.$el.empty(); // Clear DOM
        return this;
    }
});
