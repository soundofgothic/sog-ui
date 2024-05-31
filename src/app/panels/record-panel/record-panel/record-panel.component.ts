import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { URLParamsService } from "@app/services/urlparams.service";
import { Environment } from "@env/environment.type";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import {
  CollectorService,
  SearchType,
} from "../../../services/collector.service";
import { Recording } from "../../../services/domain";

@Component({
  selector: "app-record-panel",
  templateUrl: "./record-panel.component.html",
  styleUrls: ["./record-panel.component.css"],
  providers: [URLParamsService],
})
export class RecordPanelComponent implements OnInit, OnDestroy {
  private subs: Array<Subscription> = [];
  public name: string;
  public g: number;
  public record: Recording;
  public recordLoading: boolean;

  public records: any;
  public loading: boolean;

  public page = 0;
  public backDisplay = false;
  public forwardDisplay = false;
  public recordCount: number;
  public totalRecordCount: number;
  public upTo: number;
  public pageSizeSelected: number;
  public pageSizeOptions: number[] = [10, 50, 100];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private collectorService: CollectorService,
    private meta: Meta,
    private title: Title,
    private urlParamsService: URLParamsService,
    @Inject("CONFIG") private config: Environment
  ) {}

  ngOnInit() {
    this.collectorService.recordLoading.subscribe(
      (v) => (this.recordLoading = v)
    );
    this.collectorService.observedRecords.subscribe((data) => {
      this.records = data.results;
    });
    this.collectorService.loading
      .pipe(first())
      .subscribe((v) => (this.loading = v));

    const urlSub = this.urlParamsService.current.subscribe((params) => {
      this.name = params.recordingName;
      this.g = params.recordingGame;

      this.subs.push(
        this.collectorService.record.pipe(first()).subscribe((v) => {
          this.record = v;
          if (v) {
            this.meta.updateTag({
              name: "description",
              content: this.record.transcript,
            });

            this.meta.addTag({
              property: "og:description",
              content: this.record.transcript,
            });

            this.meta.addTag({
              property: "og:title",
              content: this.record.transcript,
            });

            this.title.setTitle(this.record.transcript);
          }
          // tslint:disable-next-line:no-unused-expression
          const metadata = this.collectorService.observedMetadata.getValue();

          if (
            this.g < 3 &&
            this.record &&
            (!metadata ||
              metadata.lastSearchType !== SearchType.SOURCE ||
              metadata.filter !== this.record.sourceFile.name ||
              metadata.pageNumber !== this.page ||
              metadata.pageSize !== 10)
          ) {
            this.page = 1;
            this.collectorService.loadFamiliarRecordings(this.record);
          }
        })
      );
      this.collectorService.getGNameRecord(this.g, this.name);
    });

    this.subs.push(urlSub);

    this.collectorService.observedMetadata.subscribe((data) => {
      if (data) {
        this.recordCount = data.recordCount;
        this.totalRecordCount = data.totalRecordCount;
        this.upTo = data.upToIndex;
        this.page = data.pageNumber;
        this.backDisplay = data.backOption;
        this.forwardDisplay = data.forwardOption;
        this.pageSizeSelected = data.pageSize;
      }
    });

    this.collectorService.setRecordMode(true);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.collectorService.setRecordMode(false);
  }

  back() {
    this.collectorService.previousPage();
  }

  forward() {
    this.collectorService.nextPage();
  }

  selectVoice() {
    this.collectorService.filterVoices([this.record.voiceID], false);
  }

  selectScript() {
    this.collectorService.filterScripts([this.record.sourceFileID], false);
  }

  selectGuild() {
    this.collectorService.filterGuilds([this.record.guildID], false);
  }

  selectNPC() {
    this.collectorService.filterNPCs([this.record.npcID], false);
  }

  onPageSizeChange(pageSize) {
    this.page = Math.floor((this.page * this.pageSizeSelected) / pageSize);
    this.pageSizeSelected = pageSize;
    this.collectorService.getFilteredRecords({
      filter: this.record.sourceFile.name,
      type: SearchType.SOURCE,
      page: this.page,
      pageSize: pageSize,
    });
  }

  filename(): String {
    if (this.record.gameID) {
      return (
        this.config.soundsAssetsUrl +
        `/assets/g${this.record.gameID}/` +
        this.record.wave.toUpperCase() +
        ".m4a"
      )
    }
  }

  share() {
    window.prompt("Skopiuj do schowka: Ctrl+C, Enter", window.location.href);
  }
}
