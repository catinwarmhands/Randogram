function RandogramViewModel() {
    var self = this;

    self.tags = ko.observable("griddynamics");
    self.tags.subscribe(function(){
        self.maxTagId(null);
    });
    self.isSubscribed = ko.observable(false);
    self.isSearchByDate = ko.observable(false);

    self.dateFrom = ko.observable(new Date());
    self.dateTo = ko.observable(new Date());

    self.maxTagId = ko.observable();
    self.images = ko.observableArray([]);
    self.isLoading = ko.observable(false);

    var pushImages = function(images){
        for(var i = 0; i < images.length; i++) {
            self.images.push(images[i]);
        }
    };

    var updateSearchResults = function(data){
        for (maxTagId in data) {
            var parsed = data[maxTagId];
            pushImages(parsed);
            self.maxTagId(maxTagId);
        }
    };

    self.searchAction = function () {
        self.isLoading(true);
        $.ajax({
            url: "getImagesByTags",
            data: {
                tags: self.tags(),
                maxTagId: self.maxTagId()
            },
            success: function (data) {
                self.images([]);
                updateSearchResults(data);
                self.isLoading(false);
            },
            error: function () {
                self.isLoading(false);
            },
            dataType: "json"
        });
    };

    self.moreAction = function () {
        self.isLoading(true);
        $.ajax({
            url: "getNextPage",
            data: {
                tags: self.tags(),
                maxTagId: self.maxTagId()
            },
            success: function (data) {
                updateSearchResults(data);
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