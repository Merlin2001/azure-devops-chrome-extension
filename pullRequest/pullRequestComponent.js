(function() {
    angular.module('vstsChrome').component("pullRequest", {
        controller: PullRequestController,
        controllerAs: "prCtrl",
        templateUrl: "pullRequest/pullRequest.html",
        css: "pullRequest/pullRequest.css"
    });

    PullRequestController.$inject=['$q','$http', 'vstsService'];
    function PullRequestController($q, $http, vstsService) {
        var prCtrl = this;
        this.$onInit = function() {
            prCtrl.fillPullRequests = function() {
                prCtrl.pullRequests = prCtrl.allPullRequests;
            };

            prCtrl.fillToApprovePullRequests = function(button) {
                prCtrl.pullRequests = prCtrl.toApprovePullRequests;
                button.disabled=true;
            };

            prCtrl.redirect = function(pr) {
                var href = vstsService.getMainProjectWebUrl() + "/_git/" + pr.repository.id + "/pullrequest/" + pr.pullRequestId; 
                chrome.tabs.create({url: href});
            };

            prCtrl.memberSelected = function(member) {
                getToApprovePullRequests();
                prCtrl.fillToApprovePullRequests();
            }

            prCtrl.membersDisplay = function() {
                prCtrl.pullRequests = [];
            }
        }

        prCtrl.members = vstsService.getTeamMembers();

        vstsService.getPullRequests(prCtrl.currentMember).then(function(pullRequests) {
            prCtrl.allPullRequests = pullRequests.all;
            prCtrl.toApprovePullRequests = pullRequests.toApprove;
            prCtrl.hideLoading = true;
            prCtrl.fillPullRequests();
        });
    }
})();