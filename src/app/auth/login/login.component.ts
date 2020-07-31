import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../User';
import { UserAutenticated } from '../UserAutenticated';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required, Validators.minLength(6)]]
  });

  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    this.loading = false;
  }

  private loginOkNotification(u: User){
    this.snackBar.open('Logged in successfully, Welcome ' + u.firstname + '!','Ok', {duration: 2000});
  }

  private loginErrorNotification(err){
    this.snackBar.open(err,'Ok', {duration: 2000});
  }


  onSubmit(){
    this.loading = false;
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;

    this.authService.login(email, password)
           .subscribe((u) => {          
              this.loginOkNotification(u)
              this.router.navigateByUrl('/'); 
              this.loading = false;
           },
           (err) => {
             this.loginErrorNotification(err);   
             this.loading = false;
           });
  }

  loginGoogle(){
    this.loading  = true;
    this.authService.loginGoogle()
           .subscribe(
            (u) => {
              this.loginOkNotification(u);
              this.router.navigateByUrl('/');
              this.loading = false;
            },
            (err) => {
              this.loginErrorNotification(err);
              this.loading = false;
            }
           );
  }

}
