import { Component, OnInit } from '@angular/core';
import {CacheService} from '../../services/cache.service';
import {UserService} from '../../services/user.service';
import { ErrorModel } from '../../models/ErrorModel';
import { ErrorStatus } from '../../apis/apiErrorStatus';
import { MatSnackBar } from '@angular/material';
import {Router} from '@angular/router';
import {getDateFromDDMMYYYY} from '../../utiities/datetimeUtility';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user={
    firstName:'',
    lastName:'',
    dateOfBirth:'',
    username:'',
    email:''
  };
  constructor(private router: Router, private snackbar:MatSnackBar, private cacheService:CacheService, private userService:UserService) { }

  ngOnInit() {
    let user = this.cacheService.getCurrentUser();
    this.userService.getUserDetails(user.id)
    .subscribe(userDetails => {
      let userTemp:any = {};
      userTemp = userDetails;
      var dt = getDateFromDDMMYYYY(userTemp.dateOfBirth);
      userTemp.dateOfBirth = dt;
      this.user = userTemp;
    },
    (errorModel:ErrorModel) => {
      if(errorModel.status === ErrorStatus.Unauthorized){
        this.snackbar.open('User is not authorized', '', {duration:2000, panelClass:['red-snackbar']});
        return;
      }
      if(errorModel.status === ErrorStatus.Forbidden ){
        this.snackbar.open('User is not allowed', '', {duration:2000, panelClass:['red-snackbar']});
        return;
      }
      if(errorModel.status === ErrorStatus.NotFound){
        this.snackbar.open('Resource is not found', '', {duration:2000, panelClass:['red-snackbar']});
        return;
      }
    })
  }

  onSubmit(settingsData){    
    //console.log(data);
    //console.log(settingsData.value);
    if(!settingsData.valid){
      console.log('Data is not valid');
      this.snackbar.open('Please enter all mandatory fields', '', {duration:2000, panelClass:['red-snackbar']});
      return;
    }

    let data = Object.assign({},settingsData.value);
    data.dateOfBirth =data.dateOfBirth.toLocaleDateString();

    let user= this.cacheService.getCurrentUser();

    this.userService.updateUser(user.id, data)
    .subscribe(response => {
      this.router.navigate(['/main']);
    }, errorModel => {
      if(errorModel.status == 403){
        this.snackbar.open('Forbidden', '', {duration:2000, panelClass:['red-snackbar']});
      }
      if(errorModel.status == 404){
        this.snackbar.open('Not found', '', {duration:2000, panelClass:['red-snackbar']});
      }
      
      //alert(error.message);
    }, () => {});
  }

}
