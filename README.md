# Azure Application insight integration with angular 
[Azure Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) is a tool for monitoring the application Real-time performance, App insight will automatically detect performance anomalies and includes powerful analytics tools to help you diagnose issues and to understand what users do with your app. It is designed to help you continuously improve performance, usability, and security. Furthermore, it works for apps on a wide variety of platforms including .NET, Node.js, Java, and Python hosted on-premises, hybrid, or any public cloud.

## Integration Step
**Prerequisite:** you should have an application insight with the instrumentation key

1. Update the environment file and add the instrumentation key. 
```
        export const environment = {  
            appInsights: {  
                instrumentationKey: 'xxxxxxxxxxxxxx'  
            }  
        };  

```

2. Install the application insight package in your application.
```
        npm install @microsoft/applicationinsights-web –save
```
3. Create a new service. 
```
        ng generate service ApplicationInsights
```
4. Add this code snap in the ApplicationInsightsService
```
        import { Injectable } from '@angular/core';  
        import { filter } from 'rxjs/operators';
        import {  
            ApplicationInsights,  
            IExceptionTelemetry,  
            DistributedTracingModes } from '@microsoft/applicationinsights-web';  
        import {  
            Router,  
            NavigationEnd } from '@angular/router';  
        
        @Injectable({  
            providedIn: 'root',  
        })  
        export class ApplicationInsightsService {  
            private appInsights: ApplicationInsights;  
            constructor(private router: Router) {  
                this.appInsights = new ApplicationInsights({  
                    config: {  
                        instrumentationKey: environment.appInsights.instrumentationKey,        
                    enableCorsCorrelation: true
                    }  
                });  
                this.appInsights.loadAppInsights();  
                this.loadCustomTelemetryProperties();  
                this.createRouterSubscription();  
            }  
            setUserId(userId: string) {  
                this.appInsights.setAuthenticatedUserContext(userId);  
            }  
            clearUserId() {  
                this.appInsights.clearAuthenticatedUserContext();  
            }  
            logPageView(name ? : string, uri ? : string) {  
                this.appInsights.trackPageView({  
                    name,  
                    uri  
                });  
            }  
            logException(error: Error) {  
                let exception: IExceptionTelemetry = {  
                    exception: error  
                };  
                this.appInsights.trackException(exception);  
            }  
            private loadCustomTelemetryProperties() {  
                this.appInsights.addTelemetryInitializer(envelope => {  
                    var item = envelope.baseData;  
                    item.properties = item.properties || {};  
                    item.properties["ApplicationPlatform"] = "Web";  
                    item.properties["ApplicationName"] = "ApplicationName";  
                });  
            }  
            private createRouterSubscription() {  
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {  
            this.logPageView(null, event.urlAfterRedirects);  
        });  
    }  
}  
```

5. Declare ApplicationInsightsService in AppComponent class
```
        export class AppComponent {
          constructor(private ApplicationInsightsService: ApplicationInsightsService) {
            ApplicationInsightsService.logPageView('HomePage');
          }
        }
```
6.  For the error and exception handling we need to create a custom error handler that just sends the error details to application insight. For that create an ApplicationInsightsErrorHandler class
```
        import {  ApplicationInsightsService } from './application-insights.service'; 
        import {  
            ErrorHandler,  
            Injector,  
            Injectable  
        } from '@angular/core';  

        @Injectable()  
        export class ApplicationInsightsErrorHandler implements ErrorHandler {  
            constructor(private injector: Injector) {}  
            handleError(error: any): void {  
                this.injector.get < ApplicationInsightsService >(ApplicationInsightsService).logException(error);  
                console.log(error);  
            }  
        }  
```
7.  Add a provider for our error handler in AppModule class
```
        import { NgModule } from '@angular/core';  
        import { BrowserModule } from '@angular/platform-browser';  
        import { FormsModule } from '@angular/forms';  
        import { AppComponent } from './app.component';  
        @NgModule({  
            imports: [BrowserModule, FormsModule],  
            declarations: [AppComponent],  
            providers: [{  
                provide: ErrorHandler,  
                useClass: ApplicatioInsightsErrorHandler  
            }, ],  
            bootstrap: [AppComponent]  
        })  
        export class AppModule {}

```
## **Note**
After this configuration application is ready to send telemetry data to application insight sometimes it takes time to load data on the app insight dashboard. 

For demonstration, you can execute this sample application on the local environment using below give CMD.
```
npm install
ng serve
```

## Feedback 
Any questions or suggestions?

You are welcome to discuss it on :)

[![Link](https://img.icons8.com/fluent/48/000000/linkedin.png)](https://www.linkedin.com/in/maheshkvis/)

[![Tweet](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2Fer_maheshkvish)](https://twitter.com/maheshkvis)

