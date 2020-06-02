var pressApp = angular.module("PressReleasesApp", ["formatModule"]);

/*
* PRESS RELEASES CONTROLLER
* Parameters like $scope and $window are injected through the DI of angular
*
* $scope: An object referring to the application model. It is an execution context for expressions
* $sce (Strict Contextual Escaping): A service to bind expressions in a safe context (for example as trusted HTML)
*/
pressApp.controller("PressReleasesController", function ($scope, $window, $sce) {

    // Lists and selected items of the filter boxes
    $scope.FilterCategories = [];
    $scope.FilterCategory = null;

    $scope.FilterLomTitles = [];
    $scope.FilterLomTitle = null;

    $scope.FilterYears = [];
    $scope.FilterYear = null;


    // Opens article details in a lightbox
    $scope.showArticlePreview = function (article) {
        $scope.PreviewArticle = article;
        $.fancybox({
            content: $("#jci-pr-article-preview-" + $scope.ModuleId),
            openEffect: "fade",
            openSpeed: 500,
            closeEffect: "fade",
            closeSpeed: 500,
            autoSize: false,
            height: "90%",
            width: "500px",
            padding: 20
        });
    };


    // Opens a link in a blank window 
    // (The method is required to prevent the lightbox from opening... the click regions 
    // of the lightbox and other links may overlap)
    $scope.openLink = function (link, $event) {
        window.open(link, "_blank");
        if ($event.stopPropagation) {
            $event.stopPropagation();
        }
        if ($event.preventDefault) {
            $event.preventDefault();
        }
        $event.cancelBubble = true;
        $event.returnValue = false;
    };


    // Create the toolbar from the 2sxc controller (only when in edit mode)
    $scope.getArticleToolbar = function (article) {
        var manage = $2sxc($scope.ModuleId).manage;
        if (manage == null) {
            // Manage is null if not logged in an in edit mode
            return $sce.trustAsHtml("");
        }
        return $sce.trustAsHtml(manage.getToolbar({ entityId: article.ID, useModuleList: true, sortOrder: article.SortOrder })); // Toolbar contains HTML, so must be marked as trusted HTML for Angular
    };


    // Initializes the controller (here the controller must know the moduleId)
    $scope.init = function (moduleId) {
        $scope.ModuleId = moduleId;


        // Helper to initialize the filter boxes
        function initFilters() {
            $.each($scope.Articles, function (index, article) {
                var lom = article.Lom;
                if (lom) {
                    $scope.FilterLomTitles.pushUnique(lom.Title, { Name: lom.Title, Value: lom.Title, PriorizedSort: (lom.PriorizedSort ? 0 : 1) });
                }

                var year = article.Year;
                if (year) {
                    $scope.FilterYears.pushUnique(year, { Name: year, Value: year });
                }

                $.each(article.Categories, function (i, category) {
                    $scope.FilterCategories.pushUnique(category, { Name: category, Value: category });
                });
            });
        }


        function onDataLoad(source, data, targetId) {

            // Prepare articles for UI
            var loms = data["in"]["Loms"].List.toHashTable("EntityId");
            var publishers = data["in"]["Publishers"].List.toHashTable("EntityId");
            var articles = data["in"]["Default"].List;

            $scope.Articles = $.map(articles, function (item, index) {
                var date = Date.parseJsonDate(item.Date);
                var lom = loms.getItem(item.LOM[0].EntityId);
                return {
                    ID: item.EntityId,
                    Title: item.Title,
                    Teaser: item.Teaser,
                    Content: $sce.trustAsHtml(item.Content), // Content is HTML, so must be marked as trusted for Angular
                    Thumbnail: item.Thumbnail,
                    File: item.File,
                    LiveArticle: item.LiveArticle,
                    Categories: item.Category.mapValue("EntityTitle"),
                    Publisher: publishers.getItem(item.Publisher[0].EntityId),
                    Lom: lom,
                    LomTitle: lom.Title,
                    Date: date,
                    Year: date.getFullYear(),
                    SortOrder: item._2sxcEditInformation.sortOrder // Special value needed for editing in 2sxc
                };
            });

            initFilters();

            $scope.$apply(); // Notify UI about data updated
        }

        $2sxc(moduleId).data.on("load", onDataLoad).load();
    };
});