(function (App, Project, Interfaces, Timestamp) {
    'use strict'

    // Firebase connection
    var ref = new Firebase('https://crackling-inferno-3492.firebaseio.com/');

    // Or with an email/password combination
    ref.authWithPassword({
        email: 'eharit@gmail.com',
        password: 'TayJQcePeSUCaQd2'
    }, authHandler);

    // Create a callback to handle the result of the authentication

    function authHandler(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
            
            ref.once("value", function (data) {
                if (data.val()) {
                    var project = new Project(data.val());
                    console.log("Project loaded!");
                } else {
                    console.log("Project not found, initialized a new project!");
                    var project = new Project("myProject");
                }
                // intentiate interfaces
                var interfaces = new Interfaces();
                // init app
                var app = new App(project, interfaces, ref);
                app.init();
            });
        }
    }


})(window.App, window.Project, window.Interfaces, window.Timestamp);
