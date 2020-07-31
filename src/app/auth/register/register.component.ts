import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../User';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  formRegister: FormGroup = this.fb.group({
    'firstname': ['', [Validators.required]],
    'lastname': ['', [Validators.required]],
    'address': ['', []],
    'city': ['', []],
    'state': ['',[]],
    'phone': ['', []],
    'mobilephone': ['',[]],
    'email': ['', [Validators.required, Validators.email]],
    'password1': ['', [Validators.required, Validators.minLength(6)]],
    'password2': ['', [Validators.required, Validators.minLength(6)]]
  },
  {validador: this.matchingPassword});

  states = ['MG', 'RS', 'SC', 'SP', 'GO','RJ','BA', 'SE', 'AL'];

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router) { }

  ngOnInit(): void {
    this.states.sort();
  }

  matchingPassword(group: FormGroup){
    if(group){
      const password1 = group.controls['password1'].value;
      const password2 = group.controls['password2'].value;
      if(password1 == password2){
        return null
      }
    }
    return {matching: false};
  }

  onSubmit(){
    const newUser: User = {
      firstname: this.formRegister.value.firstname,
      lastname:  this.formRegister.value.lastname ,
      address: this.formRegister.value.address,
      city: this.formRegister.value.city,
      state: this.formRegister.value.state,
      phone: this.formRegister.value.phone,
      mobilephone: this.formRegister.value.mobilephone,
      email: this.formRegister.value.email,
      password: this.formRegister.value.password1
    };
    this.authService.register(newUser)
         .subscribe(
           (u) => {
              this.snackBar.open(
                'Successfully registered. User your new credentials to sign in.','Ok',{duration: 2000}
              );
              this.router.navigateByUrl('/auth/login');
           },
           (erro) =>{
              this.snackBar.open(
              'Erro. You are not registered.','Ok',{duration: 2000}
              );
           }
         ) 
  }

}
