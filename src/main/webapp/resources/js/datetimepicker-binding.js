/**
 * Created by student on 2/9/16.
 */
ko.bindingHandlers.datetimepicker = {
    init: function (element, valueAccessor, allBindings) {
        var options = {
            format: 'MM/DD/YYYY hh:mm A',
            defaultDate: ko.unwrap(valueAccessor())
        };

        ko.utils.extend(options, allBindings.dateTimePickerOptions);

        $(element).datetimepicker(options).on("dp.change", function (evntObj) {
            var observable = valueAccessor();
            if (evntObj.timeStamp !== undefined) {
                var picker = $(this).data("DateTimePicker");
                var d = picker.date();
                observable(d.format(options.format));
            }
        });
    },
    update: function (element, valueAccessor) {
        var value = ko.unwrap(valueAccessor());
        $(element).datetimepicker('date', value || '');
    }
};