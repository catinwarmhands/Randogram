ko.applyBindings(new function RandogramViewModel() {

    var self = this;

    self.tags = ko.observable("griddynamicssaratov");
    self.areTagsInvalid = ko.computed (function () {
        //return false;
        return self.tags().length == 0;
    });

    self.isFollowing = ko.observable(false);
    self.isSearchByDate = ko.observable(false);

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
            url: "getImages",
            data: {
                tags: self.tags(),
                following:self.isFollowing(),
                dateTimeFrom: (self.isSearchByDate() && self.dateFrom()) ? moment(self.dateFrom()).format("MM/DD/YYYY hh:mm A") : null,
                dateTimeTo: (self.isSearchByDate() &&  self.dateTo()) ? moment(self.dateTo()).format("MM/DD/YYYY hh:mm A") : null,
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
    self.getMoment = function(unixTime){
        return moment(unixTime, "X").fromNow();
    };
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

    self.getEmbed = function(x){
        //alert("hi");
        return;
        $.ajax({
            url: "getEmbed",
            data: {
                link: x
            },
            dataType: "text",
            success: function (data) {
                alert(data)
            },
            error: function () {
                alert("error");
            }
        });
    };
});

//Activate datetimepickers and make them linked to each other
$('#dateTimeFrom').datetimepicker();
$('#dateTimeTo').datetimepicker({ useCurrent: false });
$("#dateTimeFrom").on("dp.change", function (e) { $('#dateTimeTo').data("DateTimePicker").minDate(e.date); });
$("#dateTimeTo").on("dp.change", function (e) { $('#dateTimeFrom').data("DateTimePicker").maxDate(e.date); });

//$.ajax({
//    url: "login/isLoginned",
//    success: function (data) {
//        if(data == "false"){
//            $.ajax({
//                url: "login/redirect",
//                success: function (data) {
//                    window.location = data;
//                },
//                error: function () {
//                    alert("error");
//                }
//            });
//        }
//    },
//    error: function () {
//        alert("error");
//    }
//});