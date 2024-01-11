import { NgtUniversalModule } from "@ng-toolkit/universal";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { TransferHttpCacheModule } from "@nguniversal/common";
import { Inject, NgModule, Optional, PLATFORM_ID } from "@angular/core";

import { AppComponent } from "./app.component";
import { BasicLayoutComponent } from "./layout/basic-layout/basic-layout.component";
import { RoutingModule } from "./routing/routing-module/routing.module";
import { TextsPanelComponent } from "./panels/texts-panel/texts-panel.component";
import { TextItemComponent } from "./items/text-item/text-item.component";
import { HttpClientModule } from "@angular/common/http";
import { interceptorProvider } from "./interceptor";
import { FormsModule } from "@angular/forms";
import { AccessModule } from "./access/access.module";
import { ReportsPanelComponent } from "./panels/reports-panel/reports-panel.component";
import { ReportTextItemComponent } from "./items/report-text-item/report-text-item.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { InfoPanelComponentComponent } from "./layout/info-panel-component/info-panel-component.component";
import { SfxPanelComponent } from "./panels/sfx-panel/sfx-panel.component";
import { SfxItemComponent } from "./items/sfx-item/sfx-item.component";
import { SfxPanelExtendedComponent } from "./panels/sfx-panel-extended/sfx-panel-extended.component";
import { SfxItemExtendedComponent } from "./items/sfx-item-extended/sfx-item-extended.component";
import { TagsComboBoxComponent } from "./layout/tags-combo-box/tags-combo-box.component";
import { VersionsComboBoxComponent } from "./layout/versions-combo-box/versions-combo-box.component";
import { RecordPanelComponent } from "./panels/record-panel/record-panel/record-panel.component";
import { PlayButtonComponent } from "./items/play-button/play-button.component";
import { ComboBoxComponent } from "./layout/combo-box/combo-box.component";

import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    BasicLayoutComponent,
    TextsPanelComponent,
    RecordPanelComponent,
    TextItemComponent,
    ReportsPanelComponent,
    ReportTextItemComponent,
    InfoPanelComponentComponent,
    SfxPanelComponent,
    SfxItemComponent,
    SfxPanelExtendedComponent,
    SfxItemExtendedComponent,
    TagsComboBoxComponent,
    VersionsComboBoxComponent,
    PlayButtonComponent,
    ComboBoxComponent,
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    AccessModule,
    RoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  providers: [
    interceptorProvider,
    {
      provide: "CONFIG",
      useFactory: (platformId: Object, serverConfig: any) => {
        return isPlatformBrowser(platformId) ? (window as any).CONFIG || environment : serverConfig;
      },
      deps: [PLATFORM_ID, [new Optional(), new Inject("SERVER_CONFIG")]],
    }
  ],
})
export class AppModule {}
