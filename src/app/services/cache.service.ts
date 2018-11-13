import { Injectable } from '@angular/core';

@Injectable()
export class CacheService {
  private UserKey = "user";
  private AuthenticationTokenKey = "authenticationToken";
  private IsUserLoggedOnKey="isUserLoggedOn";
  private TimeToLiveKey = "timeToLive";
  private IdKey = "id";
  private UsernameKey = "username";
  private PasswordKey = "password";

  // private static _currentUser = {
  //   id:2,
  //   username:'',
  //   password:''
  // };
  // private static _authenticationToken = '';
  //private static _isUserLoggedOn = false;
  // private static _timeToLive = 3600;

  constructor() { }

  isUserLoggedOn(){
    let jsonString = sessionStorage.getItem(this.UserKey);
    let user = JSON.parse(jsonString);
    if(!user)
    {
      return false;
    }
    return user.isUserLoggedOn;
  }

  clearCache(){
    let user = {
      isUserLoggedOn:false,
      authenticationToken:'',
      timeToLive:0,
      id:0,
      username:'',
      password:''
    }
    sessionStorage.setItem(this.UserKey, JSON.stringify(user));
  }

  setup(isValid, token, timeToLive, id, username, password){
    let user = {
      isUserLoggedOn:isValid,
      authenticationToken:token,
      timeToLive:timeToLive,
      id:id,
      username:username,
      password:password
    }
    sessionStorage.setItem(this.UserKey, JSON.stringify(user));
  }

  getCurrentUser(){
    let jsonString = sessionStorage.getItem(this.UserKey);
    let user = JSON.parse(jsonString);
    return user;
  }

  getAuthenticationToken(){
    let jsonString = sessionStorage.getItem(this.UserKey);
    let user = JSON.parse(jsonString);
    return user.authenticationToken;
  }
}
