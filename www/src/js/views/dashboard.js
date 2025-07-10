const ViewDashboard = Backbone.View.extend({
    el: '#app',

    render() {
        if(localStorage.getItem('token')){
            // get account
            $.ajax({
                url: 'http://localhost:8000/api/v1/authentication/account/',
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json; charset=utf-8'
                },
                method: 'GET',
                success: (response) => {
                    // Clear previous
                    this.$('#authorized-as').html(`<span class="uk-text-bold">${response.name}</span> (${response.username})`);
                },
                error: (response) => {
                    window.location.href = '/#login'
                }
            });

            $.get('/src/templates/dashboard.html', (html) => {
                this.$el.html(html);
            });
        } else {
            window.location.href = '/#login'
        }
        return this;
    }
  });
  