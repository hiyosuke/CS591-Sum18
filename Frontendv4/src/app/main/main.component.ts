import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  output: any;

  constructor(private http: HttpClient) {
    http.get('http://localhost:3000/main')
    // supposed to be http://localhost:3000/uber/v1.2/login but I could not fix cors issue
    // however, the route itself works
    // this route http://localhost:3000/main' skips the login portion (I already have the auth keys to call uber's data endpoint
      .subscribe(
        results => this.output = results.message,
        err => console.log(`Error: ${err.message}`),
        () => console.log(`Completed request`)
      );
  }

  ngOnInit() {
  }

}
