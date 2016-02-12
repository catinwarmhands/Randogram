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

    self.winnersAmountPlus = function () {
        //self.winnersAmount(self.winnersAmount().replace(/\D/g,''));
        if(self.winnersAmount() < self.usersAndPosts().length){
            self.winnersAmount(self.winnersAmount()+1);
        }else if(self.usersAndPosts().length != 0){
            self.winnersAmount(self.usersAndPosts().length);
        }
    };
    self.winnersAmountMinus = function () {
        //self.winnersAmount(self.winnersAmount().replace(/\D/g,''));
        if(self.winnersAmount() > 1){
            self.winnersAmount(self.winnersAmount()-1);
        }else{
            self.winnersAmount(1);
        }
    };
    self.searchInfo = ko.computed (function () {
        return "We found " + self.images().length + " posts from " + self.usersAndPosts().length + " users!";
    });
    self.isLoading = ko.observable(false);

    self.fixRange = function(){
        if(self.winnersAmount() < 0){
            self.winnersAmount(1);
        }
        if(self.winnersAmount() > self.usersAndPosts().length){
            self.winnersAmount(self.usersAndPosts().length);
        }
    };

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
        //self.winnersAmount(self.winnersAmount().replace(/\D/g,''));
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
$("#dateTimeFrom").on("dp.change", function (e) { $('#dateTimeTo').data("DateTimePicker").minDate(e.date);});
$("#dateTimeTo").on("dp.change", function (e) { $('#dateTimeFrom').data("DateTimePicker").maxDate(e.date);});


