import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {BasicLayoutComponent} from '../../layout/basic-layout/basic-layout.component';
import {TextsPanelComponent} from '../../panels/texts-panel/texts-panel.component';
import {ReportsPanelComponent} from '../../panels/reports-panel/reports-panel.component';
import {AuthGuard} from '../../access/auth.guard';
import {SfxPanelComponent} from '../../panels/sfx-panel/sfx-panel.component';
import {SfxPanelExtendedComponent} from '../../panels/sfx-panel-extended/sfx-panel-extended.component';

const routes: Routes = [
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: '', component: TextsPanelComponent},
      {path: 'text', component: TextsPanelComponent},
      {path: 'reports', component: ReportsPanelComponent, canActivate: [AuthGuard]},
      {path: 'sfx', component: SfxPanelComponent},
      {path: 'sfx/extended', component: SfxPanelExtendedComponent, canActivate: [AuthGuard]}
    ]
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
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
export class RoutingModule {
}
