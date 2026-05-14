import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from "@angular/router";
import { Sidebar } from '../../sidebar/sidebar';
import { Navbar } from "../../navbar/navbar";

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterModule, Sidebar, RouterOutlet, Navbar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout implements OnInit {
  userRole: string = '';
  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
  }
}
