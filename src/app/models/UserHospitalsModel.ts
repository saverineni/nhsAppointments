import {AppointmentModel} from '../models/AppointmentModel';

export class UserHospitalsModel {
    id:number;
    hospitalId:number;
    hospitalName:string;
    appointments:AppointmentModel[];
}