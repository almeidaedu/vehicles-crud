import { Component } from '@angular/core';
import { VehicleListComponent } from './vehicles-list/vehicles-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VehicleListComponent],
  template: ` <app-vehicle-list></app-vehicle-list> `,
})
export class AppComponent {}
