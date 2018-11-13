import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(private router: Router, private userService:UserService, private snackbar : MatSnackBar) { 

  }
  displaySuccess = false;
  user = {
    firstname:'',
    lastname:'',
    dob:'',
    email:'',
    username:'',
    password:'',
    confirmpassword:''
  }

  ngOnInit() {
  }

  onSubmit(registrationData){    
    //console.log(data);
    //console.log(registrationData.value);
    if(!registrationData.valid){
      console.log('Data is not valid');
      this.snackbar.open('Please enter all mandatory fields', '', {duration:2000, panelClass:['red-snackbar']});
      return;
    }

    let data = Object.assign({},registrationData.value);
    data.dateOfBirth =data.dateOfBirth.toLocaleDateString();

    this.userService.createUser(data)
    .subscribe(response => {
      this.displaySuccess = true;
    }, errorModel => {
      if(errorModel.status == 409){
        this.snackbar.open('Username already exists', '', {duration:2000, panelClass:['red-snackbar']});
      }
      //alert(error.message);
    }, () => {});
  }
}
