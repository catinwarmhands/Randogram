function RandogramViewModel() {
     var self = this; 

    self.tags = ko.observable("randogram");
    self.isSubscribed = ko.observable(false);
    self.isSearchByDate = ko.observable(false);
    //self.onSearchByDate = function(){
    //    self.isSearchByDate = document.getElementById("date").checked;
    //
    //    alert(self.isSearchByDate);
    //    if(self.isSearchByDate) {
    //        document.getElementsByClassName("date-fields").style.display = "none";
    //    }else{
    //        document.getElementsByClassName("date-fields").style.display = "block";
    //    }
    //
    //}
    self.dateFrom = ko.observable();
    self.dateTo = ko.observable();

    self.minTagId = ko.observable();
    self.images = ko.observableArray([]);

    self.searchAction = function () {
        $.ajax({
            url: "getImagesByTags",
            data: {
                tags: self.tags(),
                minTagId: self.minTagId()
            },
            success: function (data) {
                for (minTagId in data) {
                    var parsed = data[minTagId];
                    for(var i = 0; i < parsed.length; i++) {
                        self.images.push(parsed[i]);
                    }
                    self.minTagId(minTagId);
                }
            },
            dataType: "json"
        });
    }
    self.moreAction = function () {
        $.ajax({
            url: "getNextPage",
            data: {
                tags: self.tags(),
                minTagId: self.minTagId()
            },
            success: function (data) {
                for (minTagId in data) {
                    var parsed = data[minTagId];
                    for(var i = 0; i < parsed.length; i++) {
                        self.images.push(parsed[i]);
                    }
                    self.minTagId(minTagId);
                }

            },
            dataType: "json"
        });
    }
    self.selectAction = function () {
        alert("selectAction");
    }
};
var randogramViewModel = new RandogramViewModel();
ko.applyBindings(randogramViewModel);