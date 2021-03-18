import { Component } from '@angular/core';
import { ApplicationInsightsService } from './application-insights.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private ApplicationInsightsService: ApplicationInsightsService) {
    ApplicationInsightsService.logPageView('HomePage');
  }
  title = 'newUser';
}
