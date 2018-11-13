import { ErrorModel } from "./ErrorModel";

export class LoginUserResponseModel extends ErrorModel{
    id:number;
    token:string;
    timeToLive:number
}