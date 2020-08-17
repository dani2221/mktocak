import app from 'firebase/app'


const firebaseConfig = {

  };

  class Firebase {
    constructor() {
      app.initializeApp(firebaseConfig);
      app.analytics();
      this.auth = app.auth();
      this.googleProvider = new app.auth.GoogleAuthProvider();
      this.facebookProvider = new app.auth.FacebookAuthProvider();
      this.twitterProvider = new app.auth.TwitterAuthProvider();
      this.phoneNum = new app.auth.PhoneAuthProvider();
    }

    doSignInWithGoogle = () =>
    this.auth.signInWithPopup(this.googleProvider);

    doSignInWithFacebook = () =>
    this.auth.signInWithPopup(this.facebookProvider);

    doSignInWithTwitter = () =>
    this.auth.signInWithPopup(this.twitterProvider);

    doSignInWithPhone = (phoneNumber,verifier)=>
    this.auth.signInWithPhoneNumber(phoneNumber,verifier);
 
    doSignOut = () => this.auth.signOut();
 
  }
  
   
  export default Firebase;
  