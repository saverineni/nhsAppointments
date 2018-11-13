import { Injectable } from '@angular/core';
import {apiwrapper} from '../apis/apiwrapper';
import {CacheService} from '../services/cache.service';
import {getDateFromDDMMYYYY} from '../utiities/datetimeUtility';
import { catchError, retry, map } from 'rxjs/operators';

@Injectable()
export class AppointmentsService {

  constructor(private apiwrapper:apiwrapper, private cacheService:CacheService) { }

  getAppointmentsForUser(userId){

  }

  //only for POC
  createAppointment(userId){
    return this.apiwrapper.createAppointments(userId);
  }

  //only for POC
  deleteAllAppointmentsForUserId(userId){
    return this.apiwrapper.deleteAllAppointmentsForUserId(userId).pipe(
      map(res => res),
      errorModel => errorModel
    );
  }
}
