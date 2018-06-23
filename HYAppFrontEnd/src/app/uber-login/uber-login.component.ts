import { Component, OnInit } from '@angular/core';

import { APIService } from '../api.service';


@Component({
  selector: 'app-uber-login',
  templateUrl: './uber-login.component.html',
  styleUrls: ['./uber-login.component.css']
})
export class UberLoginComponent implements OnInit {

  private finalOutput: any = [];
  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.uberLogin();
  }
  public uberLogin() {
    this.apiService.uberLogin().subscribe(function (output) {
      this.finalOutput = output;
      console.log(this.finalOutput);
    });
  }

}
