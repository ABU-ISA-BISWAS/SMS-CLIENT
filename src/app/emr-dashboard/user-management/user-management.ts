import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit, OnDestroy {

  patients = [
    { name: 'A.salam', rank: 'Major', role: 'Medical Stuff', patientId: '1135S', patientType: 'Son', dob: '01-01-2009', gender: 'Male', contact: '01626945079' },
    { name: 'Mst. Rafia', rank: 'Cornel', role: 'Support Stuff', patientId: '113W2', patientType: 'Wife', dob: '01-01-2000', gender: 'Female', contact: '01612345678' },
    { name: 'Mohammad Kawsar', rank: 'General', role: 'Administrator', patientId: '113W2', patientType: 'Son', dob: '22-01-2010', gender: 'Male', contact: '01644534535' },
    { name: 'Syeem', rank: 'Cornel', role: 'Administrator', patientId: 'BA-1000131D3', patientType: 'Son', dob: '01-01-2017', gender: 'Male', contact: '01644534535' },
    { name: 'Sifat Khan', rank: 'Cornel', role: 'Administrator', patientId: 'BA-95122', patientType: 'Son', dob: '01-01-1993', gender: 'Male', contact: '01644534535' },
    { name: 'Md.Faisal Ahmed', rank: 'Cornel', role: 'Administrator', patientId: 'BA-123456', patientType: 'Self (Others)', dob: '01-01-1993', gender: 'Male', contact: '01593658710' },
    { name: 'Sifat Khan', rank: 'Brigadier', role: 'Administrator', patientId: 'BA-BA-987458', patientType: 'Self (Others)', dob: '18-10-1985', gender: 'Male', contact: '01582658485' }
  ];


  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
  }
}