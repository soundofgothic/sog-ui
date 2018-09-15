import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BasicLayoutComponent } from '../../layout/basic-layout/basic-layout.component';
import {CollectorComponent} from '../../collector/collector.component';

const routes: Routes = [
  { path: '', component: BasicLayoutComponent, children: [
      {path: '', component: CollectorComponent}
      ]}
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
