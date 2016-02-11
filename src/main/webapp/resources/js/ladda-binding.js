ko.bindingHandlers.ladda = {
    init: function(element, valueAccessor) {
        var l = Ladda.create(element);

        ko.computed({
            read: function() {
                var state = ko.unwrap(valueAccessor());
                if (state)
                    l.start();
                else
                    l.stop();
            },
            disposeWhenNodeIsRemoved: element
        });
    }
};