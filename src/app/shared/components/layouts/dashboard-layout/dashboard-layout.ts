import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterModule, Sidebar, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}
