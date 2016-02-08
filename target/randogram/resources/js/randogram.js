function RandogramViewModel() {
    var self = this;

    self.tags = ko.observable("griddynamics");
    self.isSubscribed = ko.observable(false);
    self.isSearchByDate = ko.observable(false);

    self.dateFrom = ko.observable();
    self.dateTo = ko.observable();

    self.images = ko.observableArray([]);
    self.imagesCount = ko.computed (function () {
        return self.images().length+" images found";
    });
    self.isLoading = ko.observable(false);

    var pushImages = function (images) {
        for (var i = 0; i < images.length; i++) {
            self.images.push(images[i]);
        }
    };

    self.searchAction = function () {
        self.images([]);
        self.isLoading(true);
        $.ajax({
            url: "getImagesByTags",
            data: {
                tags: self.tags(),
                dateTimeFrom: !self.dateFrom() ? null : moment(self.dateFrom()).format("MM/DD/YYYY hh:mm A"),
                dateTimeTo: !self.dateTo() ? null : moment(self.dateTo()).format("MM/DD/YYYY hh:mm A")
            },
            success: function (data) {
                pushImages(data);
                self.isLoading(false);
            },
            error: function () {
                self.isLoading(false);
            },
            dataType: "json"
        });
    };

    self.selectAction = function () {
        alert("selectAction");
    }
};
var randogramViewModel = new RandogramViewModel();
ko.applyBindings(randogramViewModel);