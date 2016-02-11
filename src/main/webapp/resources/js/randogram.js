var test = {
    caption: "#griddynamics #griddynamicssaratov #window #industial #snow #winter #melt #spring #russia #saratov #industial #roof #sunset #twilight #hotline #pink #purple",
    commentsAmount: 0,
    date: {
        date: {
            day: 10,
            month: 2,
            year: 2016
        },
        time: {
            hour: 20,
            minute: 11,
            nano: 0,
            second: 2
        },
    },
    likes: 12,
    link: "https://www.instagram.com/p/BBnmHANp9pp/",
    low: "https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/12717069_1659988850885616_542899499_n.jpg?ig_cache_key=MTE4MjA4MTAzNDI0MDkwNzg4MQ%3D%3D.2",
    standard: "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/12717069_1659988850885616_542899499_n.jpg?ig_cache_key=MTE4MjA4MTAzNDI0MDkwNzg4MQ%3D%3D.2",
    thumbnail: "https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/12717069_1659988850885616_542899499_n.jpg?ig_cache_key=MTE4MjA4MTAzNDI0MDkwNzg4MQ%3D%3D.2",
    unixTime: "1455135062",
    user: {
        full_name: "Sweet Leo",
        id: "2878102549",
        profile_picture: "https://scontent.cdninstagram.com/t51.2885-19/s150x150/12407589_1703043053244781_616590237_a.jpg",
        username: "cjjonny"
    },
    userUrl: "https://www.instagram.com/cjjonny"
};


ko.applyBindings(new function RandogramViewModel() {

    var self = this;

    self.tags = ko.observable("griddynamicssaratov,randogram_test");

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
                accesToken: self.accesToken(),
                tags: self.tags(),
                following: self.isFollowing(),
                dateTimeFrom: (self.isSearchByDate() && self.dateFrom()) ? moment(self.dateFrom()).format("MM/DD/YYYY hh:mm A") : null,
                dateTimeTo: (self.isSearchByDate() &&  self.dateTo()) ? moment(self.dateTo()).format("MM/DD/YYYY hh:mm A") : null
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
        return !self.isLoading() && self.images().length>1;
    });
    self.isSearchButtonEnabled = ko.computed (function () {
        return !self.areTagsInvalid() && !self.isLoading();
    });
    self.getMoment = function(unixTime){
        return moment(unixTime, "X").fromNow();
    };

    self.previews = ko.observableArray([]);

    self.isPreviewsVisible = ko.computed (function () {
        return self.previews().length != 0;
    });
    self.pushToPreviews = function(){
        if(self.isLoading()){
            return;
        }
        self.previews().pushVal(this);
        alert(JSON.stringify(this));
        return;
    };

    self.accesToken = ko.observable();

    self.handleToken = ko.computed (function(){
        var params = {};
        if (location.search) {
            var parts = location.search.substring(1).split('&');

            for (var i = 0; i < parts.length; i++) {
                var nv = parts[i].split('=');
                if (!nv[0]) continue;
                params[nv[0]] = nv[1] || true;
            }
        }
        if(!params.accesToken){
            window.location = "/";
        }else{
            self.accesToken(params.accesToken);
        }
    });
});

//Activate datetimepickers and make them linked to each other
$('#dateTimeFrom').datetimepicker();
$('#dateTimeTo').datetimepicker({ useCurrent: false });
$("#dateTimeFrom").on("dp.change", function (e) { $('#dateTimeTo').data("DateTimePicker").minDate(e.date); });
$("#dateTimeTo").on("dp.change", function (e) { $('#dateTimeFrom').data("DateTimePicker").maxDate(e.date); });

