var body = document.body;
const firebaseConfig = {
    apiKey: "AIzaSyCyRsqtO1dO21c6iBEmtsdBfA7J-3TpsTI",
    authDomain: "flex-coders.firebaseapp.com",
    projectId: "flex-coders",
    storageBucket: "flex-coders.appspot.com",
    messagingSenderId: "768618908733",
    appId: "1:768618908733:web:d2c9f9e52aede0febbae54",
    measurementId: "G-7XCKQFGJSM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function signUp() {
    const pop = document.createElement("div"),
        popSt = document.createElement("style"),
        popI = document.createElement("div"),
        popT = document.createElement("div"),
        popS = document.createElement("div"),
        popB = document.createElement("div"),
        popBt = document.createElement("input"),
        popCl = document.createElement("label");
    popBt.type = "submit";
    popBt.setAttribute("form", "signUp-widget");
    popCl.onclick = function() {
        pop.remove()
    };
    pop.classList.add("pop"),
        popI.classList.add("popI"),
        popT.classList.add("popT"),
        popS.classList.add("popS"),
        popB.classList.add("popB"),
        popBt.classList.add("popBt"),
        popCl.classList.add("fCls"),
        pop.appendChild(popI),
        pop.appendChild(popCl),
        popI.appendChild(popT),
        popI.appendChild(popS),
        popI.appendChild(popB),
        popB.appendChild(popBt),
        popCl.style = "visibility:visible;opacity:1;background:rgb(0 0 0 / 20%)";
    popT.innerHTML = "<h3>Create New Account!</h3>", popS.innerHTML = `<form id="signUp-widget" class="widget"><div class="cArea"><label><input required id="name" type="text"/><span class="n">Name</span></label><label><input required id="email" type="email"/><span class="n">Email</span></label><label><input required type="password" id="pw"/><span class="n">Password</span></label></div></form>`, popBt.id = "submit",
        body.appendChild(pop);
    var signUpW = document.querySelector("#signUp-widget");
    signUpW.onsubmit = function(event, name, email, password) {
        name = document.querySelector("#name").value;
        email = document.querySelector("#email").value;
        password = document.querySelector("#pw").value;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                createToast("success", "Your Account was successfuly created!");
                // Signed in 
                var user = userCredential.user;
                user.updateProfile({
                    displayName: name
                });
                console.log("worked? maybe");
                firebase.firestore().collection('lic-sys-01').add({
                        name: name,
                        email: email,
                        uid: user.uid
                    })
                    .then((docRef) => {
                        docRf = docRef.id;
                        firebase.database().ref('users/' + user.uid).set({
                            username: name,
                            email: email,
                            userId: user.uid,
                            docRef: docRf
                        }).then(() => {
                            pop.remove();
                            popB.remove();
                            popT.remove();
                            popS.innerHTML = "<p>Successfully Created Account!</p>";
                            body.appendChild(pop);
                            setTimeout(function() {
                                document.location.reload()
                            }, 3000)
                        })
                    })
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("error code:" + error.code + "n/error message:" + error.message)
            })
        event.preventDefault();
    }
}

function signIn() {
    const pop = document.createElement("div"),
        popSt = document.createElement("style"),
        popI = document.createElement("div"),
        popT = document.createElement("div"),
        popS = document.createElement("div"),
        popB = document.createElement("div"),
        popBt = document.createElement("input"),
        popCl = document.createElement("label");
    popBt.type = "submit";
    popBt.setAttribute("form", "signUp-widget");
    popCl.onclick = function() {
        pop.remove()
    };
    pop.classList.add("pop"),
        popI.classList.add("popI"),
        popT.classList.add("popT"),
        popS.classList.add("popS"),
        popB.classList.add("popB"),
        popBt.classList.add("popBt"),
        popCl.classList.add("fCls"),
        pop.appendChild(popI),
        pop.appendChild(popCl),
        popI.appendChild(popT),
        popI.appendChild(popS),
        popI.appendChild(popB),
        popB.appendChild(popBt),
        popCl.style = "visibility:visible;opacity:1;background:rgb(0 0 0 / 20%)";
    popT.innerHTML = "<h3>Login to Your Account</h3>", popS.innerHTML = `<form id="signUp-widget" class="widget"><div class="cArea"><label><input id="email" type="email"/><span class="n">Email</span></label><label><input type="password" id="pw"/><span class="n">Password</span></label></div></form>`, popBt.id = "submit",

        body.appendChild(pop);
    var signUpW = document.querySelector("#signUp-widget");
    signUpW.onsubmit = function(event, email, password) {
        email = document.querySelector("#email").value;
        password = document.querySelector("#pw").value;
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in 
                var user = userCredential.user;
                pop.remove();
                popB.remove();
                popT.remove();
                popS.innerHTML = "<h4>Signed In!</h4>";
                body.appendChild(pop);
                setTimeout(function() {
                    document.location.reload()
                }, 3000);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("error code:" + error.code + "n/error message:" + error.message)
            });
        event.preventDefault();
    }
}

function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful
        document.location.reload()
    }).catch((error) => {
        // An error happened.
    });
}

function removeAccount() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            var ref = firebase.database().ref("users/" + user.uid);
            firebase.database().ref().child("users").child(uid).get().then((snapshot) => {
                var dbRf = snapshot.val().docRef;
                console.log(dbRf);
                var db = firebase.firestore().collection('lic-sys-01').doc(dbRf);
                Promise.resolve(db.delete());
            }).then(ref.remove())

            firebase.auth().currentUser.delete().then(function() {
                if (alert('Your Account was successfuly removed!')) {
                    setTimeOut(function() {
                        location.reload()
                    }, 3000)
                }

            }).catch((error) => {
                if (error.code == "auth/requires-recent-login") {
                    const pop = document.createElement("div"),
                        popSt = document.createElement("style"),
                        popI = document.createElement("div"),
                        popT = document.createElement("div"),
                        popS = document.createElement("div"),
                        popB = document.createElement("div"),
                        popBt = document.createElement("input"),
                        popCl = document.createElement("label");
                    popBt.type = "submit";
                    popBt.setAttribute("form", "signUp-widget");
                    popCl.onclick = function() {
                        pop.remove()
                    };
                    pop.classList.add("pop"),
                        popI.classList.add("popI"),
                        popT.classList.add("popT"),
                        popS.classList.add("popS"),
                        popB.classList.add("popB"),
                        popBt.classList.add("popBt"),
                        popCl.classList.add("fCls"),
                        pop.appendChild(popI),
                        pop.appendChild(popCl),
                        popI.appendChild(popT),
                        popI.appendChild(popS),
                        popI.appendChild(popB),
                        popB.appendChild(popBt),
                        popCl.style = "visibility:visible;opacity:1;background:rgb(0 0 0 / 20%)",
                        popT.innerHTML = "<h3>Re-authentication is Required</h3>", popS.innerHTML = `<form id="signUp-widget" class="widget"><div class="cArea"><label><input id="email" type="email"/><span class="n">Email</span></label><label><input type="password" id="pw"/><span class="n">Password</span></label></div></form>`, popBt.id = "submit",
                        body.appendChild(pop);
                    var signUpW = document.querySelector("#signUp-widget");
                    signUpW.onsubmit = function(event, email, password) {
                        email = document.querySelector("#email").value;
                        password = document.querySelector("#pw").value;
                        var user = firebase.auth().currentUser;
                        var credentials = firebase.auth.EmailAuthProvider.credential(email, password);
                        user.reauthenticateWithCredential(credentials).then((userCredential) => {
                            // Signed in 
                            var user = userCredential.user;
                            pop.remove();
                            popB.remove();
                            popT.remove();
                            popS.innerHTML = "<h4>Your Account was successfuly removed!</h4>";
                            body.appendChild(pop);
                            setTimeout(function() {
                                document.location.reload()
                            }, 3000);
                        }).then(() => {

                            var ref = firebase.database().ref("users/" + user.uid);
                            firebase.database().ref().child("users").child(uid).get().then((snapshot) => {
                                var dbRf = snapshot.val().docRef;
                                console.log(dbRf);
                                var db = firebase.firestore().collection('lic-sys-01').doc(dbRf);
                                Promise.resolve(db.delete());
                            }).then(ref.remove())

                            firebase.auth().currentUser.delete().then(function() {
                                // User deleted.
                            })
                        })
                    }
                    console.log(error.message + "\n" + error.code + error.name)
                }
            })
        }
    });
}

let user_info = null;
let flexAuth = null;
window.onload = function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            user_info = user;
            flexAuth = true;
            console.log(user);
            if (firebase.auth().currentUser.emailVerified !== true) {
                firebase.auth().currentUser.sendEmailVerification();
            }

            const dbRef = firebase.database().ref();
            const prF = `<div class="wPrf sl">
   <div class="prfS fixLs">
      <div class="prfH fixH fixT" data-text="Contributors">
         <label aria-label="Close" class="c cl" for="offPrf"></label>
      </div>
      <div class="prfC">
         <div class="sImg">
            <div class="im">
               <svg class="line" viewBox="0 0 24 24">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"></path>
                  <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"></path>
               </svg>
            </div>
         </div>
         <dl class="sInf">
            <dt class="sDt">
               <bdi>${user.displayName}</bdi>
            </dt>
            <dt class="sDt">
               <a class='button l ln' onclick='signOut()'><bdi>Sign Out</bdi></a> <a class='button' href='${location.protocol}//${location.hostname}/p/profile.html'><bdi>Profile</bdi></a>
            </dt>
         </dl>
      </div>
   </div>
</div>`
            var profE = document.querySelector("#Profile1");
            if (profE !== null && profE !== undefined) {
                profE.innerHTML = prF;
            }
        } else {
            const prF = `<div class="wPrf sl">
   <div class="prfS fixLs">
      <div class="prfH fixH fixT">
         <label aria-label="Close" class="c cl" for="offPrf"></label>
      </div>
      <div class="prfC">
         <div class="sImg">
            <div class="im">
               <svg class="line" viewBox="0 0 24 24">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"></path>
                  <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"></path>
               </svg>
            </div>
         </div>
         <dl class="sInf">
            <dt class="sDt">
               <a class='button l' href='#' onclick='signUp()'><bdi>Sign Up</bdi></a>
            </dt>
            <dt class="sDt">
               Have an Account? <a class='l' href='#' onclick='signIn()'><bdi>Sign In</bdi></a>
            </dt>
         </dl>
      </div>
   </div>
</div>`
            var profE = document.querySelector("#Profile1");
            if (profE !== null && profE !== undefined) {
                profE.innerHTML = prF;
            }
        }
    });
}
