import { Component, OnInit } from '@angular/core';
import {CacheService} from '../../services/cache.service';
import {UserService} from '../../services/user.service';
import { UserAppointmentsResponseModel } from '../../models/UserAppointmentsResponseModel';
import { UserHospitalsModel } from '../../models/UserHospitalsModel';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';
import {ErrorStatus} from '../../apis/apiErrorStatus';
import {concatMap} from 'rxjs/operators';
import {AppointmentsService} from '../../services/appointments.service';
import { AppointmentModel } from '../../models/AppointmentModel';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private cacheService:CacheService, private userService:UserService, private modalService: NgbModal, private snackbar:MatSnackBar, private router:Router, private appointmentsService:AppointmentsService) { }
  username='test';
  fetching=false;
  isNavbarCollapsed=true;
  userHospitalAppointments:UserHospitalsModel[];
  closeResult: string;
  ngOnInit() {
    this.getUserHospitalAppointments();
  }

  getUserHospitalAppointments(){
    let user = this.cacheService.getCurrentUser();
    this.username = user.username;
    this.fetching = true;
    this.userService.getAppointmentsForUserId(user.id)
    .subscribe(
      userHospitalAppointments =>{
        this.userHospitalAppointments = userHospitalAppointments;
        this.fetching = false;
      },
      errorModel => {
        //TODO
        this.fetching = false;
      },
      () => {});
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.onAddHospital(result);
    }, (reason) => {
      
    });
  }

  onAddHospital(addhospitalform){
    console.log(addhospitalform.value);
    console.log(addhospitalform.valid);

    if(!addhospitalform.valid){
      this.snackbar.open('Please provide all mandatory fields','',{duration:2000, panelClass:['red-snackbar']});
      return;
    }
    let data = {
      hospitalId:addhospitalform.value.number,
      hospitalName:addhospitalform.value.name
    };

    let user = this.cacheService.getCurrentUser();    

    this.userService.addHospital(user.id, data)
    .pipe(concatMap(response => this.appointmentsService.createAppointment(user.id)))
    .subscribe(response => {
      this.getUserHospitalAppointments();
    },errorModel => {
    //   if(errorModel.status == ErrorStatus.Unauthorized){
    //     //TODO - nothing
    //   }
    },() => {});
  }

  logout(){
    console.log('calling logout');
    this.cacheService.clearCache();
    this.router.navigate(['/login']);
  }

  deleteAllAppointments(){
    let user = this.cacheService.getCurrentUser();
    this.fetching = true;    
    this.appointmentsService.deleteAllAppointmentsForUserId(user.id)
    .subscribe(response => {
        this.getUserHospitalAppointments();
      },
      errorModel => {
        //TODO
        this.fetching = false;
      },
      () => {});
  }

  print(appointment:AppointmentModel){
    let printContents, popupWin;
    printContents = this.appointmentMockData(appointment);//document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          @page {size: a4; margin: 20mm }
          @media screen { body { margin: 5em }}
          address { white-space: pre; padding: 0 0 1em; font-style: normal }
          aside { float: right; width: 10em }
          footer { float: bottom; text-align: center }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
    return true;
  }

  appointmentMockData(appointment:AppointmentModel){
    return `<aside>
    <address class=from>
    Lancashire Care NHS
    St Ives House
    Accrington Road
    Blackburn
    BB1 2EG
    Tel:(01254)226840
    Fax:(01254)689 179
    </address>
  </aside>
    <br/><br/><br/><br/><br/><br/><br/><br/>` + 
    new Date().toDateString() + `<br/><br/>
    <h4>Counselling appointment</h4>
    <h5>` + appointment.dateOfAppointment + `</h5><br/>
    <p>
      Dear ` + this.username +`<br/><br/>
      I am writing to offer you a first counselling assessment session at ` + appointment.timeOfAppointment +` on `+ appointment.dateOfAppointment +` at St.Ives House.<br/><br/>
      <b>If you can attend</b> you don't need to contact us. We'll presume you can make your appointment.<br/><br/>
      <b>If you can't attend please call us on 01254 226 480</b> so we can arrange another appointment on a different date. We can use your original appointment for someone else.<br/><br/>
      <b>If you don't attend</b> we'll assume you no longer need counselling and will refer you back to GP.<br/><br/>
      If you have any questions or concerns about counselling, please call us on 01254 226 480 and we'll be happy to discuss them with you.<br/><br/>
      Yours sincerely<br/><br/><br/>
      Mrs Jones <br/>
      Counsellor
    </p>`
  }
}
