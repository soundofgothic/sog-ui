import { Component, Inject, Input, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment";
import { CollectorService, SearchType } from "../../services/collector.service";
import { Router } from "@angular/router";
import { LOCAL_STORAGE } from "@ng-toolkit/universal";
import { MatSnackBar } from "@angular/material";
import { ReportService } from "../../services/report.service";
import { Recording } from "../../services/domain";

@Component({
  selector: "app-item",
  templateUrl: "./text-item.component.html",
  styleUrls: ["./text-item.component.css"],
})
export class TextItemComponent implements OnInit {
  @Input() record: Recording;

  @Input() filename: string;
  @Input() text: string;
  @Input() filesource: string;
  @Input() version: any;
  @Input() id: string;

  reportMode = false;
  loading = false;
  reportDetails: string;
  reportSent = false;

  romanNumerals = ["I", "II", "III"];

  constructor(
    protected collectorService: CollectorService,
    protected reportService: ReportService,
    @Inject(LOCAL_STORAGE) private local_storage: any,
    private router: Router,
    protected snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  parseFilename(filename: String): String {
    if (this.version < 3) {
      filename = filename.toUpperCase() + ".WAV";
      return environment.soundsAssetsUrl + "/assets/gsounds/" + filename;
    } else {
      return environment.soundsAssetsUrl + "/assets/g3sounds/" + filename;
    }
  }

  searchBySource() {
    if (this.filesource) {
      this.collectorService.searchBySource(this.filesource);
    }
  }

  openReport() {
    this.reportMode = !this.reportMode;
  }

  commitReport() {
    this.loading = true;
    this.reportService
      .reportRecord(this.id, this.reportDetails)
      .subscribe((data) => {
        this.reportMode = false;
        this.loading = false;
        this.reportSent = true;
        this.snackBar.open("Dziekuję za zgłoszenie!", ":)", { duration: 3000 });
      });
  }
}
