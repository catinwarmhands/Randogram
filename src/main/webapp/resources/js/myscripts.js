function RandogramViewModel() {
     var self = this; 
    self.tags = ko.observable();
    self.isSubscribed=ko.observable(true);
    self.text = ko.observable();
    self.searchAction = function () {
        //alert(""+self.isSubscribed());
        $.ajax({
            url: "test",
            success: function (data) {
                self.text(data);
            },
            dataType: "text"
        });
    }
};
var randogramViewModel = new RandogramViewModel();
ko.applyBindings(randogramViewModel);