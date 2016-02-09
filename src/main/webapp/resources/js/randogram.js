ko.applyBindings(new function RandogramViewModel() {

    var self = this;

    self.tags = ko.observable("griddynamics");
    self.areTagsInvalid = ko.computed (function () {
        return self.tags().length == 0;
    });

    self.isSubscribed = ko.observable(false);
    self.isSearchByDate = ko.observable(true);

    self.dateFrom = ko.observable();
    self.dateTo = ko.observable();

    self.images = ko.observableArray([]);
    self.imagesCount = ko.computed (function () {
        return self.images().length==1 ? "Winner!" : self.images().length+" images found";
    });
    self.isLoading = ko.observable(false);

    var pushImages = function (images) {
        self.images(self.images().concat(images));
    };

    self.searchAction = function () {

        self.isLoading(true);
        $.ajax({
            url: "getImagesByTags",
            data: {
                tags: self.tags(),
                dateTimeFrom: !self.dateFrom() ? null : moment(self.dateFrom()).format("MM/DD/YYYY hh:mm A"),
                dateTimeTo: !self.dateTo() ? null : moment(self.dateTo()).format("MM/DD/YYYY hh:mm A")
            },
            dataType: "json",
            success: function (data) {
                self.images([]);
                pushImages(data);
                self.isLoading(false);
            },
            error: function () {
                alert("error");
                self.isLoading(false);
            }
        });
    };

    self.selectAction = function () {
        var max = self.images().length;
        var min = 0;
        var image = self.images()[Math.floor(Math.random() * (max - min)) + min];
        self.images([image]);
    };

    self.isLuckyButtonEnabled = ko.computed (function () {
        return self.images().length>1;
    });
    self.isSearchButtonEnabled = ko.computed (function () {
        return !self.areTagsInvalid() && !self.isLoading();
    });
    self.loginAction = function(){
        //alert("dateFrom: "+self.dateFrom());
        //alert("dateTo: "+self.dateTo());

        //$.ajax({
        //    url: "login",
        //    data: {
        //
        //    },
        //    dataType: "text",
        //    success: function (data) {
        //        alert(data);
        //    },
        //    error: function () {
        //        alert("error");
        //    }
        //});
    };

});

//Activate datetimepickers and make them linked to each other
$(function () {
    $('#dateTimeFrom').datetimepicker();
    $('#dateTimeTo').datetimepicker({
        useCurrent: false //Important! See issue #1075
    });
    $("#dateTimeFrom").on("dp.change", function (e) {
        $('#dateTimeTo').data("DateTimePicker").minDate(e.date);
    });
    $("#dateTimeTo").on("dp.change", function (e) {
        $('#dateTimeFrom').data("DateTimePicker").maxDate(e.date);
    });
});
