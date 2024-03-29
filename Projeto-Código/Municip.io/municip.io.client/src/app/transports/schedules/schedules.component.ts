import { Component } from '@angular/core';
import { TransportsService, line, municipalityTransport, pattern, route, stop, stopTime, trip } from '../../services/transports.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { BindQueryParamsFactory } from '@ngneat/bind-query-params';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent {

  constructor(private service: TransportsService, private authService: UserAuthService, private router: Router,
    private routeParams: ActivatedRoute, private factory: BindQueryParamsFactory) { }


  municipality: municipalityTransport | null = null;
  lines: line[] = [];
  routes: route[] = [];
  patterns: pattern[] = [];
  trips: trip[] = [];
  path: stop[] | null = [];
  schedule: stopTime[] | null = [];
  lineSelected : line | null = null;


  scheduleForm = new FormGroup({
    line: new FormControl(""),
    route: new FormControl(""),
    pattern: new FormControl(""),
    trip: new FormControl("" ),
    date: new FormControl("")
  });


  get line() {
    return this.scheduleForm.get('line');
  }

get route() {
    return this.scheduleForm.get('route');
  }

  get pattern() {
return this.scheduleForm.get('pattern');
  }

  get trip () {
    return this.scheduleForm.get('trip');
  }

  get date() {
return this.scheduleForm.get('date');
  }


  bindQueryParamsManager = this.factory
    .create<formSchedule>([
      { queryKey: 'line' },
      { queryKey: 'route' },
      { queryKey: 'pattern' },
      { queryKey: 'trip' },
      { queryKey: 'date' }
    ]).connect(this.scheduleForm);



  ngOnDestroy() {
    this.bindQueryParamsManager.destroy();
  }

  async ngOnInit() {

   
    this.scheduleForm.get('line')?.valueChanges.subscribe(async (value) => {

      await this.getCurrentRoutesAndPatternsAndTrips();
      await this.handleLineChange(value || "");
    });

    this.scheduleForm.get("route")?.valueChanges.subscribe(async (value) => {


      await this.getCurrentRoutesAndPatternsAndTrips();

     await this.handleRouteChange(value || "")

    });


    this.scheduleForm.get("pattern")?.valueChanges.subscribe(async (value) => {


      await this.getCurrentRoutesAndPatternsAndTrips();


      await this.handlePatternChange(value || "");


      this.getCurrentPath(value);




    });


    this.scheduleForm.get("date")?.valueChanges.subscribe(async (value) => {
      await this.getCurrentRoutesAndPatternsAndTrips();

      await this.handleDateChange(value || "");

      
    });

    this.scheduleForm.get("trip")?.valueChanges.subscribe( async (value) => {
      this.getCurrentSchedule(value || "");

    });




    this.handleDateChange(this.scheduleForm.get('date')?.value || "");

    
    await this.getLines();


    if (!this.lines.find(line => line.id === this.scheduleForm.get('line')?.value)) {
      this.scheduleForm.get('line')?.setValue("");
      this.scheduleForm.get('route')?.setValue("");
      this.scheduleForm.get('pattern')?.setValue("");
      this.scheduleForm.get('trip')?.setValue("");
      return;
    } 


    await this.getCurrentRoutesAndPatternsAndTrips();


    this.handleLineChange(this.scheduleForm.get('line')?.value || "");
    

    this.handleRouteChange(this.scheduleForm.get('route')?.value || "");
    

    this.handlePatternChange(this.scheduleForm.get('pattern')?.value || "");

  }




  async handleLineChange(value: string) {
    this.lineSelected = this.lines.find(line => line.id === value) || null;

    if (value === "") {
      //caso o valor seja vazio, então tudo terá que ser resetado
      this.scheduleForm.get("route")?.setValue("");
      this.scheduleForm.get("pattern")?.setValue("");
      this.scheduleForm.get("trip")?.setValue("");
    } else if (!this.isRouteFromLine(this.scheduleForm.get('route')?.value || "")) {
      this.scheduleForm.get('route')?.setValue(this.routes[0].id);
    }
  }

  async handleRouteChange(value: string) {

    if (value === "") {
    this.scheduleForm.get("pattern")?.setValue(this.patterns[0].id || "");
    } else if (!this.patterns.find(pattern => pattern.id === this.scheduleForm.get('pattern')?.value)) {
      this.scheduleForm.get('pattern')?.setValue(this.patterns[0].id || "");
    }



  }

  async handlePatternChange(value: string) {


    if (value === "") {
      this.scheduleForm.get("trip")?.setValue(this.trips[0].id || "");
    } else if (!this.trips.find(trip => trip.id === this.scheduleForm.get('trip')?.value)) {
      this.scheduleForm.get('trip')?.setValue(this.trips[0].id || "");
    }



  }

  async handleDateChange(value: string) {
   

    if (!value || value.length !== 10 || value[4] !== "-" || value[7] !== "-") {
       const currentDate = new Date().toISOString().substring(0, 10);
      this.scheduleForm.get('date')?.setValue(currentDate);
    }


    this.scheduleForm.get('trip')?.setValue(this.trips[0].id || "");
  }







  isRouteFromLine(id: string): boolean{
    if (this.routes.find(route => route.id === id)) {
      return true;
    }
    return false;
  }


  async getCurrentRoutesAndPatternsAndTrips() {
    await this.getCurrentRoutes(this.scheduleForm.get('line')?.value || null);
    await this.getCurrentPatterns(this.scheduleForm.get('route')?.value || null);
    this.getCurrentTrips(this.scheduleForm.get('pattern')?.value || null);
    this.getCurrentPath(this.scheduleForm.get('pattern')?.value || null);
    this.getCurrentSchedule(this.scheduleForm.get('trip')?.value || null);
  }



  
  async getLines() {
    const municipality = await this.authService.getMunicipality().toPromise();
    if (municipality) {
      const municip = await this.service.getMunicipalityByName(municipality).toPromise();
          if (municip) {
            this.municipality = municip;
            const newLines = await this.service.getLinesByMunicipalityId(municip.id).toPromise();
            if (newLines) {
                this.lines = newLines;         
              }
            }
          }
        }
      
    


  async getCurrentRoutes(line: string | null) {
    this.routes = [];
    if (line) {
      const selectedLine = this.lines.find(line => line.id === this.scheduleForm.get('line')?.value);
      if (selectedLine) {
        for (let routeId of selectedLine.routes) {
        let route = await this.service.getRoute(routeId).toPromise();
        if (route && !this.routes.find(r => r.id === route!.id)) {
          this.routes.push(route);

              }
          }
      }
    }
  }


  async getCurrentPatterns(route: string | null) {
this.patterns = [];
    if (route) {
      const selectedRoute = this.routes.find(route => route.id === this.scheduleForm.get('route')?.value);
      if (selectedRoute) {
        for (let patternId of selectedRoute.patterns) {
          let pattern = await this.service.getPattern(patternId).toPromise();
          if (pattern) {
            this.patterns.push(pattern);
          }
        }
      }
    }
  }


  getCurrentTrips(pattern: string | null) {
    this.trips = [];
    if (pattern) {
      const selectedPattern = this.patterns.find(pattern => pattern.id === this.scheduleForm.get('pattern')?.value);
      if (selectedPattern) {
        for (let trip of selectedPattern.trips) {
          if (trip && trip.dates.includes(this.scheduleForm.get('date')?.value?.replace(/-/g, '') || "") && trip.schedule.length > 0) {
            this.trips.push(trip);
          }
        }
        this.trips.sort((a, b) => {
          const arrivalTimeA = a.schedule[0].arrival_time;
          const arrivalTimeB = b.schedule[0].arrival_time;
          return arrivalTimeA.localeCompare(arrivalTimeB);
        });
      }
    }
  }

  getCurrentPath(pattern: string | null) {
    let patternSelected = this.patterns.find(p => p.id === pattern);
    this.path = patternSelected ? patternSelected.path : null;
  }

  getCurrentSchedule(trip : string | null) {
    let tripSelected = this.trips.find(t=> t.id ===  trip);
    this.schedule = tripSelected ? tripSelected.schedule : null;

  }


  formatTime(time: string): string {
    return time.substring(0, 5);
  }


  getNameStopById(id: string): string {
    if (this.path) {
      let stop = this.path.find(stop => stop.stop.id === id);
      return stop ? stop.stop.name : "";
    }
    return "";

  }

  getLocalityStopById(id : string): string {
    if (this.path) {
      let stop = this.path.find(stop => stop.stop.id === id);
      return stop ? stop.stop.municipality_name : "";
    }
    return "";
  }



  iswithoutTrips(): boolean {
    if (this.trips.length === 0 && this.scheduleForm.get('pattern')?.value !== "") {
      return true;
    }
    return false;

  }

}

interface formSchedule {
  line: string;
  route: string;
  pattern: string;
  trip: string;
  date: string;
}
