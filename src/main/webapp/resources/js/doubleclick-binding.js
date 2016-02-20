ko.bindingHandlers.singleClick= {
    init: function(element, valueAccessor) {
        var handler = valueAccessor(),
            delay = 400,
            clickTimeout = false;

        $(element).click(function() {
            if(clickTimeout !== false) {
                clearTimeout(clickTimeout);
                clickTimeout = false;
            } else {
                clickTimeout = setTimeout(function() {
                    clickTimeout = false;
                    handler();
                }, delay);
            }
        });
    }
};