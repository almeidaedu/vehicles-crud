/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

interface Vehicle {
  id: number;
  plate: string;
  chassis: string;
  renavam: string;
  model: string;
  brand: string;
  year: number;
}

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.scss'],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  standalone: true,
})
export class VehicleListComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  vehicles: Vehicle[] = [];
  showCreate = false;
  editId: number | null = null;
  vehicleForm!: FormGroup;

  ngOnInit(): void {
    this.loadVehicles();
    this.initForm();
  }

  initForm(vehicle?: Vehicle): void {
    this.vehicleForm = this.fb.group({
      plate: [vehicle?.plate || '', Validators.required],
      chassis: [vehicle?.chassis || '', Validators.required],
      renavam: [vehicle?.renavam || '', Validators.required],
      model: [vehicle?.model || '', Validators.required],
      brand: [vehicle?.brand || '', Validators.required],
      year: [vehicle?.year || '', Validators.required],
    });
  }

  loadVehicles(): void {
    this.http
      .get<Vehicle[]>('http://localhost:3000/vehicles')
      .subscribe((data) => {
        this.vehicles = data;
      });
  }

  onCreate(): void {
    if (this.vehicleForm.invalid) return;

    const newVehicle = this.vehicleForm.value as Vehicle;
    this.http
      .post<Vehicle>('http://localhost:3000/vehicles', newVehicle)
      .subscribe(() => {
        this.loadVehicles();
        this.showCreate = false;
        this.vehicleForm.reset();
      });
  }

  startEdit(vehicle: Vehicle): void {
    this.editId = vehicle.id;
    this.initForm(vehicle);
  }

  cancelEdit(): void {
    this.editId = null;
    this.vehicleForm.reset();
  }

  onUpdate(id: number): void {
    if (this.vehicleForm.invalid) return;

    const updatedVehicle = this.vehicleForm.value as Vehicle;
    this.http
      .patch(`http://localhost:3000/vehicles/${id}`, updatedVehicle)
      .subscribe(() => {
        this.loadVehicles();
        this.editId = null;
        this.vehicleForm.reset();
      });
  }

  onDelete(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este veículo?')) return;

    this.http.delete(`http://localhost:3000/vehicles/${id}`).subscribe(() => {
      this.vehicles = this.vehicles.filter((v) => v.id !== id);
    });
  }
}
