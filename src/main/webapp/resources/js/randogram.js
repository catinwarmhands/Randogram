//arrays helpers

function unique(list) {
    var result = [];
    $.each(list, function(i, e) {
        if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
}

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

function multiply(time, n){
    return time.add(time.millisecond() * n, 'milliseconds')
}

//elements helpers
function collapsible(name, action){
    $(name).collapse(action);
}

function removeTags(name){
    $(name).tagsinput('removeAll');
}

function addTags(name, tags){
    $(name).tagsinput('add', tags);
}
function setTags(name, tags){
    removeTags(name);
    addTags(name, tags);
}

//Knockout
ko.applyBindings(new function RandogramViewModel() {
    var self = this;
    /////////////////////////////////////////////////////tags///////////////////////////////////////////////////////////
    //tags
    self.tags = ko.observable("griddynamicssaratov");

    //tags helpers
    self.areTagsInvalid = ko.computed (function () {
        return self.tags().length == 0;
    });

    //tagsinput fields handler (so bad!)
    // self.tagsFix = ko.observable(true);
    // self.checkedFix = ko.observable(0);
    // self.tagsHandler = ko.pureComputed({
    //     read: function () {
    //         return self.tags();
    //     },
    //     write: function (value) {
    //         self.tags(value);
    //
    //         //мне очень стыдно за этот костыль
    //         //защита от срабатывания при загрузке страницы
    //         if(self.checkedFix() < 2){
    //             self.checkedFix(self.checkedFix()+1);
    //             return;
    //         }
    //         //защита от зацикливания
    //         if(self.tagsFix()){
    //             self.tagsFix(false);
    //             setTags('#tags1', self.tags());
    //             setTags('#tags2', self.tags());
    //             setTimeout(function(){self.tagsFix(true)}, 100);
    //         }
    //     },
    //     owner: this
    // });

    /////////////////////////////////////////////////////dates//////////////////////////////////////////////////////////
    //date filter type
    self.dateFilterSelected = ko.observable("All time");
    self.dateFilterPresets = [
        { statusName: "Today" },
        { statusName: "Last week" },
        { statusName: "Last month" },
        { statusName: "Last 7 days" },
        { statusName: "Last 30 days" },
        { statusName: "All time" },
        { statusName: "Specify day" },
        { statusName: "Specify interval" }
    ];
    self.dateFilterClickHandler = function(){
        self.dateFilterSelected(this.statusName);
        switch(self.dateFilterSelected()){
            case "Specify day":
                collapsible('#DateFrom-collapsible', 'show');
                collapsible('#DateTo-collapsible', 'hide');
                break;
            case "Specify interval":
                collapsible('#DateFrom-collapsible', 'show');
                collapsible('#DateTo-collapsible', 'show');
                break;
            default:
                collapsible('#DateFrom-collapsible', 'hide');
                collapsible('#DateTo-collapsible', 'hide');
        }
    };

    //date fields
    self.dateFrom = ko.observable(moment().format("MM/DD/YYYY"));
    self.dateTo = ko.observable(moment().format("MM/DD/YYYY"));

    self.calculateDateFrom = function(){
        var result;
        switch(self.dateFilterSelected()) {
            case "Today":
                result = moment();
                break;
            case "Last week":
                result = moment().startOf('week');
                break;
            case "Last month":
                result = moment().startOf('month');
                break;
            case "Last 7 days":
                result = moment().subtract(7, 'days');
                break;
            case "Last 30 days":
                result = moment().subtract(30, 'days');
                break;
            case "Specify day":
            case "Specify interval":
                result = self.dateFrom() ? self.dateFrom() : moment();
                break;
            default:
                return null;
        }
        return result.locale('en').startOf('day');
    };
    self.calculateDateTo = function(){
        switch(self.dateFilterSelected()){
            case "Specify day":
                return moment(self.dateFrom() ? self.dateFrom() : moment()).locale('en').endOf('day');
            case "Specify interval":
                return moment(self.dateTo() ? self.dateTo() : moment()).locale('en').endOf('day');
            case "All time":
                return null;
            default:
                return moment().locale('en');
        }
    };

    //unixTimestamp -> "... ago"
    self.getMoment = function(unixTime){
        return moment(unixTime, "X").fromNow();
    };

    /////////////////////////////////////////////////////observables////////////////////////////////////////////////////
    //arrays
    self.usersAndPosts = ko.observableArray([]);
    self.images = ko.observableArray([]);
    self.tempImages = ko.observableArray([]);
    self.preview = ko.observableArray();

    //statements
    self.isSearchDone = ko.observable(false);
    self.isLoading = ko.observable(false);
    self.following = ko.observable("");

    self.isLuckyButtonEnabled = ko.computed (function () {
        return !self.isLoading() && self.images().length>0;
    });

    self.isSearchButtonEnabled = ko.computed (function () {
        return !self.areTagsInvalid() && !self.isLoading();
    });

    /////////////////////////////////////////////////////arrays helpers/////////////////////////////////////////////////
    self.setPreview = function() {
        if (self.isLoading()) {
            return;
        }
        self.preview([this]);
    };

    var setUsersAndPosts = function(){
        var usersArray = unique(self.images().map(function(image){return image.user.username}));

        var usersPairs = usersArray.map(function(x){return {username: x, posts: []}});
        usersPairs.forEach(function(pair){
            pair.posts = self.images().filter(function(image){return image.user.username == pair.username;});
        });

        self.usersAndPosts(usersPairs);
    };

    /////////////////////////////////////////////////////winners////////////////////////////////////////////////////////

    self.winners = ko.observableArray([]);
    self.winnersSelectionType = ko.observable("posts");
    self.winnersAmount = ko.observable(1);
    self.winnersAmountMax = function(){
        return self.winnersSelectionType() === "users" ? self.usersAndPosts().length : self.images().length;
    };

    self.winnersAmountHandler = ko.pureComputed({
        read: function () {
            return self.winnersAmount();
        },
        write: function (value) {
            if(value > self.winnersAmountMax()){
                self.winnersAmount(self.winnersAmountMax());
            }else{
                self.winnersAmount(value);
            }
        },
        owner: this
    });
    //winnersAmount +/- buttons
    self.winnersAmountPlus = function () {
        if(self.winnersAmount() < self.winnersAmountMax()){
            self.winnersAmount(self.winnersAmount()+1);
        }else if(self.winnersAmountMax() != 0){
            self.winnersAmount(self.winnersAmountMax());
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
        if(self.images().length == 0){
            return "Sorry, we didn't find anything. Check your query."
        }
        return "We found " + self.images().length + " posts from " + self.usersAndPosts().length + " users!";
    });

    /////////////////////////////////////////////////////actions////////////////////////////////////////////////////////
    //progressbar time
    self.startTime = ko.observable(moment());
    self.endTime = ko.observable(moment());
    self.progress = function(){
        if(!self.isLoading()){return 1}
        var timeBetweenStartAndEnd = (self.endTime().toDate() - self.startTime().toDate());
        var timeBetweenStartAndToday = (moment().toDate() - self.startTime().toDate());
        var p = timeBetweenStartAndToday / timeBetweenStartAndEnd;
        return p;
    };

    self.totalFound = ko.observable(0);
    self.willBeLoadedInfo = ko.computed (function(){
        return "Only first 1000 of "+self.totalFound()+" photos will be loaded";
    });
    //search
    self.searchAction = function () {
        self.images([]);
        self.tempImages([]);
        self.isLoading(true);

        collapsible('#basicCollapsible', 'hide');
        collapsible('#advancedCollapsible', 'hide');
        collapsible('#chooseLucky-collapsible', 'hide');
        collapsible('#search-info-collapsible', 'hide');
        collapsible('#winners-content-collapsible', 'hide');
        collapsible('#content-collapsible', 'hide');

        //get tag info
        var willBeLoaded = 100;

        $.ajax({
            type: "POST",
            url: "getTagAmount",
            data: {
                tags: self.tags()
            },
            dataType: "json",
            success: function (data) {
                willBeLoaded = data;
                self.totalFound(data);
                if(data > 1000){
                    willBeLoaded = 1000;
                    $("#taginfoModal").modal("show");
                }
                //get first 20 photos
                $.ajax({
                    type: "POST",
                    url: "getFirstImages",
                    data: {
                        accesToken: self.accesToken(),
                        tags: self.tags(),
                        amount: 1
                    },
                    dataType: "json",
                    beforeSend: function(){
                        self.startTime(moment());
                    },
                    success: function (data) {
                        var m = moment();
                        var interval = m.diff(self.startTime(), 'milliseconds');
                        //magic numbers!
                        self.endTime(m.add((35*(willBeLoaded-data.length))^1.2), 'milliseconds');

                        //slideshow
                        if(self.isLoading()) {
                            collapsible('#loading-content-collapsible', 'show');
                        }
                        self.tempImages([data[0]]);
                        var i = 1;
                        var timerId = setInterval(function() {
                            self.tempImages([data[i]]);
                            i = (i >= data.length ? 0 : i+1);

                            if(!self.isLoading()){
                                clearInterval(timerId);
                                collapsible('#loading-content-collapsible', 'hide');
                            }
                        }, 3500);
                    },
                    error: function () {
                        alert("getFirstImages error");
                        self.isLoading(false);
                    }
                });
            },
            error: function () {
                alert("getTagAmount error");
                collapsible('#loading-content-collapsible', 'hide');
            }
        });

        //get images
        $.ajax({
            type: "POST",
            url: "getImages",
            data: {
                accesToken: self.accesToken(),
                tags: self.tags(),
                following: self.following(),
                dateTimeFrom: format(toUTC(self.calculateDateFrom())),
                dateTimeTo: format(toUTC(self.calculateDateTo()))
            },
            dataType: "json",
            success: function (data) {
                self.images(data);
                setUsersAndPosts();

                self.isLoading(false);
                self.isSearchDone(true);
                self.winnersAmount(1);

                collapsible('#loading-content-collapsible', 'hide');
                if(self.images().length > 0){
                    collapsible('#chooseLucky-collapsible', 'show');
                    collapsible('#content-collapsible', 'show');
                }
                collapsible('#search-info-collapsible', 'show');
            },
            error: function () {
                alert("getImages error");
                self.isLoading(false);
                collapsible('#loading-content-collapsible', 'hide');
            },
            timeout: 200000
        });
    };

    //select winners action
    self.selectAction = function () {
        if(self.winnersSelectionType() === "users"){
            var luckyUsers = shuffle(self.usersAndPosts()).slice(0, self.winnersAmount());
            var winnerPosts = luckyUsers.map(function(x){return randomElement(x.posts)});
            self.winners(winnerPosts);
        }else{
            var luckyPosts = shuffle(self.images()).slice(0, self.winnersAmount());
            self.winners(luckyPosts);
        }
        window.scrollTo(0, 0);
        collapsible('#winners-content-collapsible', 'show');
    };

    //acces token
    self.accesToken = ko.observable(null);
    self.handleToken = ko.computed (function() {
        var params = parseParams();

        if(params.isLogin === "false"){
            return;
        }

        if (!params.accesToken) {
            window.location = "/";
        } else {
            self.accesToken(params.accesToken);
        }
    });

    //easter
    self.easterEggEnabled = ko.observable(false);
    self.winnersDbClickHandler = function(){
        self.easterEggEnabled(self.easterEggEnabled() ? false : true);
    }
});

//Activate datetimepickers
$('#DateFrom').datetimepicker();
$('#DateTo').datetimepicker();

Ladda.bind( '#srch-btn', {
    callback: function( instance ) {
        var progress = 0;
        var interval = setInterval( function() {
            progress = randogramViewModel.progress();
            instance.setProgress( progress );
            if( progress === 1 ) {
                instance.stop();
                clearInterval( interval );
            }
        }, 200 );
    }
} );
