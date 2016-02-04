function RandogramViewModel() {
     var self = this; 

    self.tags = ko.observable();
    self.isSubscribed=ko.observable(false);
    self.isSearchByDate = ko.observable(true);
    self.dateFrom = ko.observable();
    self.dateTo = ko.observable();
    self.resp = ko.observable();

    self.searchAction = function () {
        alert("searchAction");
        $.ajax({
            url: "test",
            success: function (data) {
                self.resp(data);
            },
            dataType: "text"
        });
    }
    self.selectAction = function () {
        alert("selectAction");
        //$.ajax({
        //    url: "test",
        //    success: function (data) {
        //        self.text(data);
        //    },
        //    dataType: "text"
        //});
    }
};
var randogramViewModel = new RandogramViewModel();
ko.applyBindings(randogramViewModel);