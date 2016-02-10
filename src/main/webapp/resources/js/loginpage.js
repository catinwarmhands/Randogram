ko.applyBindings(new function RandogramViewModel() {
    var self = this;

    self.loginAction = function(){

        $.ajax({
            url: "login/redirect",
            success: function (data) {
                window.location = data;
            },
            error: function () {
                alert("error");
            }
        });
    };
});
