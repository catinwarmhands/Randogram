function RandogramViewModel() {
    var self = this;

    self.tags = ko.observable("griddynamics");
    self.areTagsValid = ko.computed (function () {
        return self.tags().length==0;
    });
    self.isSubscribed = ko.observable(false);
    self.isSearchByDate = ko.observable(false);

    self.dateFrom = ko.observable();
    self.dateTo = ko.observable();

    self.images = ko.observableArray([]);
    self.imagesCount = ko.computed (function () {
        return self.images().length==1? "Winner!" :self.images().length+" images found";
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
        var max = self.images().length;
        var min = 0;
        var image = self.images()[Math.floor(Math.random() * (max - min)) + min];
        self.images([image]);
    }

    self.isLuckyButtonEnabled = function () {
        return self.images().length>1;
    }
    self.isSearchButtonEnabled = function () {
        return self.areTagsValid();
    }
};
var randogramViewModel = new RandogramViewModel();
ko.applyBindings(randogramViewModel);