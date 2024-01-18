import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../access/auth.guard";
import { BasicLayoutComponent } from "../../layout/basic-layout/basic-layout.component";
import { RecordPanelComponent } from "../../panels/record-panel/record-panel/record-panel.component";
import { SfxPanelExtendedComponent } from "../../panels/sfx-panel-extended/sfx-panel-extended.component";
import { SfxPanelComponent } from "../../panels/sfx-panel/sfx-panel.component";
import { TextsPanelComponent } from "../../panels/texts-panel/texts-panel.component";

const routes: Routes = [
  {
    path: "",
    component: BasicLayoutComponent,
    children: [
      { path: "", component: TextsPanelComponent },
      { path: "text", component: TextsPanelComponent },
      { path: "sfx", component: SfxPanelComponent },
      { path: "record/:g/:name", component: RecordPanelComponent },
      {
        path: "reports",
        canActivate: [AuthGuard],
        children: [
          { path: "sfx", component: SfxPanelExtendedComponent },
          { path: "**", redirectTo: "", pathMatch: "full" },
        ],
      },
    ],
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
