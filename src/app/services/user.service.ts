import { Injectable } from '@angular/core';
import { UserRegistrationModel } from '../models/UserRegistrationModel';
import {apiwrapper} from '../apis/apiwrapper';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {CacheService} from '../services/cache.service';
import { LoginUserResponseModel } from '../models/LoginUserResponseModel';
import { UserAppointmentsResponseModel } from '../models/UserAppointmentsResponseModel';
import {getDateFromDDMMYYYY} from '../utiities/datetimeUtility';

@Injectable()
export class UserService {  

  constructor(private apiwrapper:apiwrapper, private cacheService:CacheService) { 

  }  
  
  createUser(data){
    return this.apiwrapper.createUser(data);
  }

  updateUser(userId, data){
    return this.apiwrapper.updateUser(userId, data);
  }

  loginUser(data){
      return this.apiwrapper.loginUser(data).pipe(
        map((res:LoginUserResponseModel) => {
          this.cacheService.setup(true, res.token, res.timeToLive, res.id, data.username, data.password);
          return res;
        }),
        error => error
      );
  }

  resetpassword(username){
    return this.apiwrapper.resetPassword(username);
  }

  getUserDetails(userId){
    return this.apiwrapper.getUserDetails(userId);
  }

  addHospital(userId, data){
    return this.apiwrapper.addHospital(userId, data);
  }

  getAppointmentsForUserId(userId){
    return this.apiwrapper.getAppointmentsForUserId(userId).pipe(
      map(res => {
        let hospitals = res.hospitals;
        hospitals.forEach(hospital => {
          hospital.appointments.forEach(appointment => {
            appointment.dateOfAppointmentLong = getDateFromDDMMYYYY(appointment.dateOfAppointment);
          });
        });
        return hospitals;
    }),
      errorModel => errorModel
    );
  }
}
