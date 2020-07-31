import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from './User';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, throwError, Observable, of } from 'rxjs';
import {switchMap, catchError, map, tap} from 'rxjs/operators';
import {auth} from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private userCollection: AngularFirestoreCollection<User> = this.afs.collection('users');
  
  constructor(private afs: AngularFirestore, 
              private afAuth: AngularFireAuth) { }

  register(user: User): Observable<boolean>{

    return from(this.afAuth.createUserWithEmailAndPassword(user.email, user.password))
               .pipe(
                 switchMap((u: firebase.auth.UserCredential) => 
                     this.userCollection.doc(u.user.uid)
                     .set({...user, id: u.user.uid})       
                     .then(()=> true)
                 ),
                 catchError((err)=> throwError(err))
               )            
  } 

  login(email: string, password: string): Observable<User>{
    return from(this.afAuth.signInWithEmailAndPassword(email, password))
             .pipe(              
               switchMap((u: firebase.auth.UserCredential) => this.userCollection.doc<User>(u.user.uid).valueChanges()),
               catchError(()=> throwError('Invalid credentials or user is not registered'))
             );   
  }

  logOut(){
    this.afAuth.signOut();
  }

  getUser(): Observable<User>{
    return this.afAuth.authState
             .pipe(
               switchMap(u => (u) ? this.userCollection.doc<User>(u.uid).valueChanges() : of(null))
             )
  }

  authenticated(): Observable<boolean>{
    return this.afAuth.authState
             .pipe(
               map(u => (u) ? true : false)
             )
  }

  async updateUserDate(u: auth.UserCredential){
    try{
      const newUser: User = {
        firstname: u.user.displayName, 
        lastname:  '' ,
        address: '',
        city: '',
        state: '',
        phone: '',
        mobilephone: '',
        email:  u.user.email,
        password: '',
        id: u.user.uid
      };
      await this.userCollection.doc(u.user.uid).set(newUser);
      return newUser;      
    }catch(e){
      throw new Error(e);
    }
  }

  async loginWithGoogleAccount(){
    try{
      const provider = new auth.GoogleAuthProvider();
      let credencials: auth.UserCredential = await this.afAuth.signInWithPopup(provider);
      let user: User = await this.updateUserDate(credencials);

      return user;
    }catch(e){
      throw new Error(e);
    }    
  }

  loginGoogle(){
    return from(this.loginWithGoogleAccount());
  }

  OldloginGoogle(): Observable<User>{
      const provider = new auth.GoogleAuthProvider();
      return from(this.afAuth.signInWithPopup(provider))
               .pipe(
                 tap((data) => console.log(data)),
                 switchMap((u: auth.UserCredential) => {
                  const newUser: User = {
                    firstname: u.user.displayName, 
                    lastname:  '' ,
                    address: '',
                    city: '',
                    state: '',
                    phone: '',
                    mobilephone: '',
                    email:  u.user.email,
                    password: '',
                    id: u.user.uid
                  };
                  return this.userCollection.doc(u.user.uid).set(newUser).then(() => newUser);
                 } )
               )
  }

}

