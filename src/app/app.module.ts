import { CommonModule, isPlatformBrowser } from "@angular/common";
import { Inject, NgModule, Optional, PLATFORM_ID } from "@angular/core";
import { NgtUniversalModule } from "@ng-toolkit/universal";
import { TransferHttpCacheModule } from "@nguniversal/common";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AccessModule } from "./access/access.module";
import { AppComponent } from "./app.component";
import { interceptorProvider } from "./interceptor";
import { PlayButtonComponent } from "./items/play-button/play-button.component";
import { SfxItemExtendedComponent } from "./items/sfx-item-extended/sfx-item-extended.component";
import { SfxItemComponent } from "./items/sfx-item/sfx-item.component";
import { TextItemComponent } from "./items/text-item/text-item.component";
import { BasicLayoutComponent } from "./layout/basic-layout/basic-layout.component";
import { ComboBoxComponent } from "./layout/combo-box/combo-box.component";
import { InfoPanelComponentComponent } from "./layout/info-panel-component/info-panel-component.component";
import { TagsComboBoxComponent } from "./layout/tags-combo-box/tags-combo-box.component";
import { VersionsComboBoxComponent } from "./layout/versions-combo-box/versions-combo-box.component";
import { RecordPanelComponent } from "./panels/record-panel/record-panel/record-panel.component";
import { SfxPanelExtendedComponent } from "./panels/sfx-panel-extended/sfx-panel-extended.component";
import { SfxPanelComponent } from "./panels/sfx-panel/sfx-panel.component";
import { TextsPanelComponent } from "./panels/texts-panel/texts-panel.component";
import { RoutingModule } from "./routing/routing-module/routing.module";

import { environment } from "../environments/environment";
import { FilterDescriptorComponent } from "./items/filter-descriptor/filter-descriptor.component";

@NgModule({
  declarations: [
    AppComponent,
    BasicLayoutComponent,
    TextsPanelComponent,
    RecordPanelComponent,
    TextItemComponent,
    InfoPanelComponentComponent,
    SfxPanelComponent,
    SfxItemComponent,
    SfxPanelExtendedComponent,
    SfxItemExtendedComponent,
    TagsComboBoxComponent,
    VersionsComboBoxComponent,
    PlayButtonComponent,
    ComboBoxComponent,
    FilterDescriptorComponent,
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
        return isPlatformBrowser(platformId)
          ? (window as any).CONFIG || environment
          : serverConfig;
      },
      deps: [PLATFORM_ID, [new Optional(), new Inject("SERVER_CONFIG")]],
    },
  ],
})
export class AppModule {}