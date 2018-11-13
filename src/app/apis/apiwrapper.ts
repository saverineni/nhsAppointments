import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import * as apiconfig from './apiconfig';
import {ErrorModel} from '../models/ErrorModel';
import {CacheService} from '../services/cache.service';
import {LoginUserResponseModel} from '../models/LoginUserResponseModel';
import { UserAppointmentsResponseModel } from '../models/UserAppointmentsResponseModel';
import { UserHospitalsModel } from '../models/UserHospitalsModel';

@Injectable()
export class apiwrapper{    
    
    constructor(private cacheService:CacheService, private http:HttpClient) {
        
    }    

    // This is for registration / create account
    // data : {firstName:'', lastName:'', dateOfBirth:'dd/MM/yyyy',email:'',username:'',password:''}
    // response: null
    createUser(data) {
        return this.http.post(apiconfig.createUserUrl, data).pipe(
            map(res=> res),
            catchError(this.handleError)
        );
    }

    // This is for registration / create account
    // data : {firstName:'', lastName:'', dateOfBirth:'dd/MM/yyyy',email:''}
    // response: null
    updateUser(userId, data) {
        let url = apiconfig.updateUserUrl.replace(/{userId}/g,userId);
        let httpOptions = this.getHeaderOptions();
        return this.http.put(url, data, httpOptions).pipe(
            map(res=> res),
            catchError(this.handleError)
        );
    }
    
    // This is for login user
    // data : {username:'', password:''}
    // response : token
    loginUser(data){
        return this.http.post<LoginUserResponseModel>(apiconfig.loginUrl, data)
        .pipe(
            map((res) => res),
            catchError(this.handleError)
        );
    }

    //sends a reset password
    resetPassword(username){
        let url = apiconfig.resetPasswordUrl+username;
        return this.http.get(url).pipe(
            map(res => res),
            catchError(this.handleError)
        );
    }

    //get user details for user id
    getUserDetails(userId){
        let url = apiconfig.userDetailsGetUrl.replace(/{userId}/g,userId);
        console.log('Get user details url ' + url);
        let httpOptions = this.getHeaderOptions();
        return this.http.get(url, httpOptions).pipe(
            map(res => res),
            catchError(this.handleError)
        );
    }

    //adds hospital to the user id
    //data : {hospitalId: "33333", hospitalName: "wsss"}
    addHospital(userId, data){
        let url = apiconfig.addHospitalToUserUrl.replace(/{userId}/g,userId);
        let httpOptions = this.getHeaderOptions();
        return this.http.post(url, data, httpOptions).pipe(
            map(res=> res),
            catchError(this.handleError)
        );
    }

    //TODO
    getUserHospitals(userId){
        let url = apiconfig.userHospitalsGetUrl.replace(/{userId}/g,userId);
        console.log('Get user appointments url ' + url);
        let authenticationToken = this.cacheService.getAuthenticationToken();
    }

    //post to create appointments for the userid - only for POC
    createAppointments(userId){
        let url = apiconfig.createUserAppointmentsPostUrl.replace(/{userId}/g,userId);
        let httpOptions = this.getHeaderOptions();
        return this.http.post(url, {}, httpOptions).pipe(
            map(res=> res),
            catchError(this.handleError)
        );
    }

    // TODO
    // get appointments for the user id
    getAppointmentsForUserId(userId){
        let url = apiconfig.userAppointmentsGetUrl.replace(/{userId}/g,userId);
        console.log('Get user appointments url ' + url);
        let authenticationToken = this.cacheService.getAuthenticationToken();
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            // "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': 'Bearer ' + authenticationToken
            })
          };
        return this.http.get<UserAppointmentsResponseModel>(url, httpOptions).pipe(
            map(res => res),
            catchError(this.handleError)
        );
    }

    deleteAllAppointmentsForUserId(userId){
        let url = apiconfig.userAppointmentsDeleteUrl.replace(/{userId}/g,userId);
        console.log('Delete user appointments url ' + url);
        let authenticationToken = this.cacheService.getAuthenticationToken();
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
            // "Content-Type": "application/x-www-form-urlencoded",
              'Authorization': 'Bearer ' + authenticationToken
            })
          };
        return this.http.delete<UserAppointmentsResponseModel>(url, httpOptions).pipe(
            map(res => res),
            catchError(this.handleError)
        );
    }

    private handleError<T extends ErrorModel>(error:any) {
        let errorModel = apiwrapper.getErrorModel(error);
        let item = {} as T;
        item.error = errorModel.error;
        item.errorMessage = errorModel.errorMessage;
        item.status = errorModel.status;
        return throwError(errorModel);
    };

    private static getErrorModel(error:any):ErrorModel{
        let errorModel = new ErrorModel();
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
          errorModel.errorMessage = error.error.message;
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
            errorModel.status = error.status;
            errorModel.errorMessage = error.error
        }
        return errorModel;
    }

    private getHeaderOptions() {
        let authenticationToken = this.cacheService.getAuthenticationToken();
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer ' + authenticationToken
            })
          };
          return httpOptions;
    }
}