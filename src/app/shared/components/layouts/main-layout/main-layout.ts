import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { Navbar } from "../../navbar/navbar";
import { Footer } from '../../footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, Navbar, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
