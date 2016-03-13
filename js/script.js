(function (App, Project, Interfaces, Timestamp) {
    'use strict'


    // Firebase connection
    var ref = new Firebase('https://crackling-inferno-3492.firebaseio.com/');

    document.getElementById("login-button").addEventListener("click", login, false);
    
    login();

    function login() {

        //    window.localStorage.username = 'eharit@gmail.com'
        //    window.localStorage.password = 'TbVxYLQQeRPD3sFA'

        var username = window.localStorage.username || document.getElementById("username").value;
        var password = window.localStorage.password || document.getElementById("password").value;

        // Or with an email/password combination
        ref.authWithPassword({
            email: username,
            password: password
        }, authHandler);

        // Create a callback to handle the result of the authentication

        function authHandler(error, authData) {
            
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                
                window.localStorage.username = username;
                window.localStorage.password = password;

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
    }


})(window.App, window.Project, window.Interfaces, window.Timestamp);
