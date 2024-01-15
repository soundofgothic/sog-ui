import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { LOCAL_STORAGE } from "@ng-toolkit/universal";
import { environment } from "../../../environments/environment";
import { CollectorService } from "../../services/collector.service";
import { Recording } from "../../services/domain";
import { ReportService } from "../../services/report.service";

@Component({
  selector: "app-item",
  templateUrl: "./text-item.component.html",
  styleUrls: ["./text-item.component.css"],
})
export class TextItemComponent implements OnInit {
  @Input() record: Recording;

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

  wavePath(): String {
    return (
      environment.soundsAssetsUrl +
      "/assets/gsounds/" +
      this.record.wave.toUpperCase() +
      ".WAV"
    );
  }

  searchBySource() {
    this.collectorService.filterScripts([this.record.sourceFileID], false);
  }

  searchByGuild() {
    this.collectorService.filterGuilds([this.record.guildID], false);
  }

  searchByVoice() {
    this.collectorService.filterVoices([this.record.voiceID], false);
  }

  searchByNPC() {
    this.collectorService.filterNPCs([this.record.npcID], false);
  }

  openReport() {
    this.reportMode = !this.reportMode;
  }

  commitReport() {
    this.loading = true;
    this.reportService
      .reportRecord(this.record.id, this.reportDetails)
      .subscribe((data) => {
        this.reportMode = false;
        this.loading = false;
        this.reportSent = true;
        this.snackBar.open("Dziekuję za zgłoszenie!", ":)", { duration: 3000 });
      });
  }
}
