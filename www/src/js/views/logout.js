const ViewLogout = Backbone.View.extend({
    el: '#app',

    render() {
        if(localStorage.getItem('token')){
            $.ajax({
                url: 'http://localhost:8000/api/v1/authentication/token/',
                headers: {
                    'Authorization': 'Token ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json; charset=utf-8'
                },
                method: 'DELETE',
                success: (response) => {
                    // Clear previous
                    localStorage.removeItem('token');
                }
            });
        }
        
        $.get('/src/templates/logout.html', (html) => {
            this.$el.html(html);
        });
        return this;
    }
  });
  