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

    self.tags = ko.observable("griddynamicssaratov");

    self.areTagsInvalid = ko.computed (function () {
        //return false;
        return self.tags().length == 0;
    });

    self.isFollowing = ko.observable(false);
    self.isSearchByDate = ko.observable(false);

    self.isSearchDone = ko.observable(false);

    self.dateFrom = ko.observable();
    self.dateTo = ko.observable();

    self.winnersAmount = ko.observable(1);
    self.usersAndPosts = ko.observableArray([]);
    self.winners = ko.observableArray([]);

    self.images = ko.observableArray([]);
    self.searchInfo = ko.computed (function () {
        return "We found " + self.images().length + " posts from " + self.usersAndPosts().length + " users!";
    });
    self.isLoading = ko.observable(false);

    var pushImages = function (images) {
        self.images(self.images().concat(images));
    };

    var setUsers = function(){
        var users = new Set(self.images().map(function(image){return image.user.username}));
        var usersArray = Array.from(users);

        //self.users(usersArray);

        var usersPairs = usersArray.map(function(x){return {username: x, posts: []}});
        usersPairs.forEach(function(pair){
            pair.posts = self.images().filter(function(image){return image.user.username == pair.username;});
        });

        self.usersAndPosts(usersPairs);
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
                setUsers();
                self.isLoading(false);
                self.isSearchDone(true);
            },
            error: function () {
                alert("error");
                self.isLoading(false);
            }
        });
    };

    var shuffle = function (array) {
        var m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    };
    var random = function(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
    var randomElement = function(arr){
        return arr[random(0, arr.length)];
    }
    var selectLuckyUsers = function(){
        return shuffle(self.usersAndPosts()).slice(0, self.winnersAmount());
    };
    self.selectAction = function () {
        var luckyUsers = selectLuckyUsers();

        var winnerPosts = luckyUsers.map(function(x){return randomElement(x.posts)});
        self.winners(winnerPosts);
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

