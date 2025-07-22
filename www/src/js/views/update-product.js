const ViewUpdateProduct = Backbone.View.extend({
    el: '#app',

    events: {
        'submit #product-form': 'updateProduct'
    },

    initialize: function (options) {
        this.uuid = options.uuid; // From router
        this.product = new Product({ id: this.uuid , uuid: this.uuid});
        this.account = new AccountCollection();

        this.listenTo(this.account, 'sync', this.onAccountSynced);
    },

    onAccountSynced: function () {
        const user = this.account.at(0);
        if (!user || !['manager', 'user'].includes(user.get('roles'))) {
            alert('You do not have permission to update a product.');
            window.location.href = '/';
            return;
        }

        this.currentUserRole = user.get('roles');
        this.$('#product-header').html(
            `Update product. ${user.get('name')} <span class="uk-label">${this.currentUserRole}</span>`
        );
    },

    render: function () {
        if (!localStorage.getItem('token')) {
            window.location.href = '/#login';
            return this;
        }
        $.get('/src/templates/product.html', (html) => {
            this.$el.html(html);
            this.delegateEvents(); // Re-bind form event

            // Render navigation bar globally
            const navView = new ViewNavigation();
            navView.render();
            this.fetchAccountAndProduct();
        });

        return this;
    },

    fetchAccountAndProduct: function () {
        this.account.fetch({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
        });

        // Fetch product and prefill form
        this.product.fetch({
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
            },
            success: () => {
                this.prefillForm();
            },
            error: () => {
                alert('Failed to load product. Redirecting.');
                window.location.href = '/';
            }
        });
    },

    prefillForm: function () {
        this.$('#product-name-input').val(this.product.get('name'));
        this.$('#product-barcode-input').val(this.product.get('barcode'));
        this.$('#product-stock-input').val(this.product.get('stock'));
        this.$('#product-price-input').val(this.product.get('price'));
    },

    updateProduct: function (e) {
        e.preventDefault();

        const $submitBtn = this.$('#product-submit-button');
        $submitBtn.prop('disabled', true).text('Updating...');

        // Clear previous
        this.$('.uk-text-danger').remove();
        this.$('.uk-alert-danger').remove();
        this.$('.uk-alert-success').remove();

        const updatedData = {
            name: this.$('#product-name-input').val(),
            barcode: this.$('#product-barcode-input').val(),
            stock: this.$('#product-stock-input').val(),
            price: this.$('#product-price-input').val()
        };

        this.product.set(updatedData);
        console.log(this.product.url());
        this.product.save(null, {
            put: true, // Use PATCH instead of PUT
            wait: true,
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'));
            },
            success: () => {
                this.$('#product-alert').before(`
                    <div class="uk-alert-success uk-padding-small" uk-alert>
                        <p>Product updated successfully.</p>
                    </div>
                `);
            },
            error: (model, response) => {
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
                $submitBtn.prop('disabled', false).text('Update');
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
