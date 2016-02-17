//arrays helpers
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function random(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomElement(arr){
    return arr[random(0, arr.length)];
}

//params parser
function parseParams(){
    var params = {};
    if (location.search) {
        var parts = location.search.substring(1).split('&');

        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            params[nv[0]] = nv[1] || true;
        }
    }
    return params;
}

//moment.js helpers
function toUTC(date){
    return date ? date.utc() : null;
}

function format(date){
    return date ? date.format("MM/DD/YYYY hh:mm A") : null;
}

//Knockout
var randogramViewModel = new function RandogramViewModel() {
    var self = this;

    self.alertDate = function(){
        alert($('#dateTimeFrom').data("DateTimePicker").date());
    };
    //tags
    self.tags = ko.observable("griddynamicssaratov");

    //tags helpers
    self.areTagsInvalid = ko.computed (function () {
        return self.tags().length == 0;
    });

    //tagsinput fields handler (so bad!)
    self.tagsFix = ko.observable(true);
    self.checkedFix = ko.observable(0);
    self.tagsHandler = ko.pureComputed({
        read: function () {
            return self.tags();
        },
        write: function (value) {
            self.tags(value);

            //мне очень стыдно за этот костыль
            //защита от срабатывания при загрузке страницы
            if(self.checkedFix() < 2){
                self.checkedFix(self.checkedFix()+1);
                return;
            }
            //защита от зацикливания
            if(self.tagsFix()){
                self.tagsFix(false);
                var tgs = self.tags();
                $('#tags1').tagsinput('removeAll');
                $('#tags2').tagsinput('removeAll');
                $('#tags1').tagsinput('add', tgs);
                $('#tags2').tagsinput('add', tgs);
                setTimeout(function(){self.tagsFix(true)}, 100);
            }
        },
        owner: this
    });

    //checkboxes
    self.isFollowing = ko.observable(false);

    //fields
    self.winnersAmount = ko.observable(1);

    //date filter type
    self.dateFilterSelected = ko.observable("Today");
    self.dateFilterPresetsBasic = [
        { statusName: "Today" },
        { statusName: "Specify day" },
        { statusName: "All time" }
    ];
    self.dateFilterPresetsAdvanced = [
        { statusName: "Today" },
        { statusName: "Last week" },
        { statusName: "Last month" },
        { statusName: "All time" },
        { statusName: "Specify day" },
        { statusName: "Specify interval" }
    ];
    self.dateFilterClickHandler = function(){
        self.dateFilterSelected(this.statusName);
    };

    //date fields

    self.dateFrom = ko.observable(moment().format("MM/DD/YYYY"));
    self.dateTo = ko.observable(moment().format("MM/DD/YYYY"));

    self.calculateDateFrom = function(){
        switch(self.dateFilterSelected()){
            case "Today":
                return moment().startOf('day');
            case "Last week":
                return moment().startOf('week');
            case "Last month":
                return moment().startOf('month');
            case "Specify day":
                return moment(self.dateFrom()).startOf('day');
            case "Specify interval":
                return moment(self.dateFrom()).startOf('day');
            default:
                return null;
        }
    };
    self.calculateDateTo = function(){
        switch(self.dateFilterSelected()){
            case "Specify day":
                return moment(self.dateFrom()).endOf('day');
            case "Specify interval":
                return moment(self.dateTo()).endOf('day');
            case "All time":
                return null;
            default:
                return moment();
        }
    };

    //arrays
    self.usersAndPosts = ko.observableArray([]);
    self.winners = ko.observableArray([]);
    self.images = ko.observableArray([]);
    self.preview = ko.observableArray();

    //statements
    self.isSearchDone = ko.observable(false);
    self.isLoading = ko.observable(false);

    self.isLuckyButtonEnabled = ko.computed (function () {
        return !self.isLoading() && self.images().length>1;
    });

    self.isSearchButtonEnabled = ko.computed (function () {
        return !self.areTagsInvalid() && !self.isLoading();
    });

    //arrays helpers
    self.setPreview = function() {
        if (self.isLoading()) {
            return;
        }
        self.preview([this]);
    };

    var pushImages = function (images) {
        self.images(self.images().concat(images));
    };

    var setUsersAndPosts = function(){
        var users = new Set(self.images().map(function(image){return image.user.username}));
        var usersArray = Array.from(users);

        var usersPairs = usersArray.map(function(x){return {username: x, posts: []}});
        usersPairs.forEach(function(pair){
            pair.posts = self.images().filter(function(image){return image.user.username == pair.username;});
        });

        self.usersAndPosts(usersPairs);
    };

    //winnersAmount +/- buttons
    self.winnersAmountPlus = function () {
        if(self.winnersAmount() < self.usersAndPosts().length){
            self.winnersAmount(self.winnersAmount()+1);
        }else if(self.usersAndPosts().length != 0){
            self.winnersAmount(self.usersAndPosts().length);
        }
    };
    self.winnersAmountMinus = function () {
        if(self.winnersAmount() > 1){
            self.winnersAmount(self.winnersAmount()-1);
        }else{
            self.winnersAmount(1);
        }
    };
    self.searchInfo = ko.computed (function () {
        return "We found " + self.images().length + " posts from " + self.usersAndPosts().length + " users!";
    });

    //actions
    //search
    self.searchAction = function () {
        self.isLoading(true);
        $.ajax({
            url: "getImages",
            data: {
                accesToken: self.accesToken(),
                tags: self.tags(),
                following: self.isFollowing(),
                dateTimeFrom: format(toUTC(self.calculateDateFrom())),
                dateTimeTo: format(toUTC(self.calculateDateTo()))
            },
            dataType: "json",
            success: function (data) {
                self.images([]);
                pushImages(data);
                setUsersAndPosts();
                self.isLoading(false);
                self.isSearchDone(true);
            },
            error: function () {
                alert("error");
                self.isLoading(false);
            }
        });
    };

    //select winners action
    self.selectAction = function () {
        var luckyUsers = shuffle(self.usersAndPosts()).slice(0, self.winnersAmount());

        var winnerPosts = luckyUsers.map(function(x){return randomElement(x.posts)});
        self.winners(winnerPosts);
    };

    //acces token
    self.accesToken = ko.observable();
    self.handleToken = ko.computed (function(){
        var params = parseParams();

        if(!params.accesToken){
            window.location = "/";
        }else{
            self.accesToken(params.accesToken);
        }
    });

    //unixTimestamp -> "... ago"
    self.getMoment = function(unixTime){
        return moment(unixTime, "X").fromNow();
    };
};

ko.applyBindings(randogramViewModel);

//Activate datetimepickers and make them linked to each other
//$('#dateTimeFrom').datetimepicker();
$('#basicDateFrom').datetimepicker();
$('#advancedDateFrom').datetimepicker();
$('#advancedDateTo').datetimepicker();



