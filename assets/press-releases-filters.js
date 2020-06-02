/*
* FORMAT MODULE
* Used to format values in the UI (so we can use a syntax like 
* <div>{{article.Date | formatDate: 'DD.MM.YYYY'}}</div>
*/
var formatModule = angular.module("formatModule", []);

formatModule.filter("formatNumber", function () {
    return function (number, format) {
        return number.toFixed(format);
    };
});

formatModule.filter("formatDate", function () {
    return function (dateString, format) {
        return moment(dateString).format(format);
    };
});

formatModule.filter("formatArray", function () {
    return function (array, separator) {
        var str = "";
        $.each(array, function (index, item) {
            str += item;
            if (index < array.length - 1) {
                str += separator;
            }
        });
        return str;
    };
});

formatModule.filter("formatThumbnail", function () {
    return function (src, size) {
        // Retina optimization: Take the size twice, but the half quality
        return src + "?w=" + (2 * size) + "&h=" + (2 * size) + "&mode=crop&quality=50";
    };
});