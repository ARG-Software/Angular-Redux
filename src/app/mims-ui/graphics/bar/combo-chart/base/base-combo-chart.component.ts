import {
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  SimpleChanges,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  OnChanges,
} from "@angular/core";
import {
  BaseChartComponent,
  Color,
  LineSeriesComponent,
  Orientation,
  ScaleType,
  ViewDimensions,
} from "@swimlane/ngx-charts";
import { scaleBand, scaleLinear, scalePoint, scaleTime } from "d3-scale";
import { calculateViewDimensions, ColorHelper } from "@swimlane/ngx-charts";
import { curveNatural } from "d3-shape";

// For any doubts, i download the zip file of user 'anishgomez':
// https://github.com/swimlane/ngx-charts/issues/573

@Component({
  template: "",
  encapsulation: ViewEncapsulation.None,
})
export class BaseComboChartComponent
  extends BaseChartComponent
  implements OnChanges
{
  @ViewChild(LineSeriesComponent)
  public lineSeriesComponent: LineSeriesComponent;

  @Input() public curve: any = curveNatural;
  @Input() public legend: boolean = false;
  @Input() public legendTitle: string = "Legend";
  @Input() public xAxis: boolean = true;
  @Input() public yAxis: boolean = true;
  @Input() public showXAxisLabel: boolean = true;
  @Input() public showYAxisLabel: boolean = true;
  @Input() public showRightYAxisLabel: boolean = false;
  @Input() public xAxisLabel = "";
  @Input() public yAxisLabel = "";
  @Input() public yAxisLabelRight = "";
  @Input() public tooltipDisabled: boolean = false;
  @Input() public gradient: boolean = false;
  @Input() public showGridLines: boolean = true;
  @Input() public activeEntries: any[] = [];
  @Input() public override schemeType: ScaleType = ScaleType.Linear;
  @Input() public xAxisTickFormatting: any;
  @Input() public yAxisTickFormatting: any;
  @Input() public yRightAxisTickFormatting: any;
  @Input() public roundDomains: boolean = false;
  @Input() public colorSchemeLine: any[];
  @Input() public autoScale: any;
  @Input() public yLeftAxisScaleFactor: any;
  @Input() public yRightAxisScaleFactor: any;
  @Input() public rangeFillOpacity: number = 0;
  @Input() public clipPath: string = "";

  @Output() public activate: EventEmitter<any> = new EventEmitter();
  @Output() public deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild("tooltipTemplate") public tooltipTemplate: TemplateRef<any>;
  @ContentChild("seriesTooltipTemplate")
  public seriesTooltipTemplate: TemplateRef<any>;

  public dims: ViewDimensions;
  public xScale: any;
  public yScale: any;
  public xDomain: any;
  public yDomain: any;
  public transform: string;
  public colors: ColorHelper;
  public colorsLine: ColorHelper;
  public margin: any[] = [10, 20, 10, 20];
  public xAxisHeight: number = 0;
  public yAxisWidth: number = 0;
  public legendOptions: any;
  public scaleType: ScaleType = ScaleType.Linear;
  public xScaleLine: any;
  public yScaleLine: any;
  public xDomainLine: any;
  public yDomainLine: any;
  public seriesDomain: any;
  public scaledAxis: any;
  public combinedSeries: any;
  public xSet: any;
  public filteredDomain: any;
  public hoveredVertical: any;
  public yOrientLeft: Orientation = Orientation.Left;
  public yOrientRight: Orientation = Orientation.Right;
  public legendSpacing = 0;
  public bandwidth: any;
  public barPadding = 8;
  public hasContent = false;

  public lineData: any = [];
  public barData: any = [];

  public override ngOnChanges(changes: SimpleChanges): void {
    this.lineData = this.results.Line;
    this.barData = this.results.Bar;

    // By default set width and heigth
    if (!this.view) {
      this.width = 1000;
      this.height = 500;
    }

    if (this.lineData.length > 0 && this.barData.length > 0) {
      this.hasContent = true;
    }
    this.update();
  }

  public trackBy(_index: any, item: any): string {
    return item.name;
  }

  public override update(): void {
    super.update();
    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin,
      showXAxis: this.xAxis,
      showYAxis: this.yAxis,
      xAxisHeight: this.xAxisHeight,
      yAxisWidth: this.yAxisWidth,
      showXLabel: this.showXAxisLabel,
      showYLabel: this.showYAxisLabel,
      showLegend: this.legend,
      legendType: this.schemeType,
    });

    if (!this.yAxis) {
      this.legendSpacing = 0;
    } else if (this.showYAxisLabel && this.yAxis) {
      this.legendSpacing = 100;
    } else {
      this.legendSpacing = 40;
    }
    this.xScale = this.getXScale();
    this.yScale = this.getYScale();

    // line chart
    this.xDomainLine = this.getXDomainLine();
    if (this.filteredDomain) {
      this.xDomainLine = this.filteredDomain;
    }

    this.yDomainLine = this.getYDomainLine();
    this.seriesDomain = this.getSeriesDomain();

    this.xScaleLine = this.getXScaleLine(this.xDomainLine, this.dims.width);
    this.yScaleLine = this.getYScaleLine(this.yDomainLine, this.dims.height);

    this.setColors();
    this.legendOptions = this.getLegendOptions();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  public deactivateAll() {
    this.activeEntries = [...this.activeEntries];
    for (const entry of this.activeEntries) {
      this.deactivate.emit({ value: entry, entries: [] });
    }
    this.activeEntries = [];
  }

  @HostListener("mouseleave")
  public hideCircles(): void {
    this.hoveredVertical = null;
    this.deactivateAll();
  }

  public updateHoveredVertical(item: any): void {
    this.hoveredVertical = item.value;
    this.deactivateAll();
  }

  public updateDomain(domain: any): void {
    this.filteredDomain = domain;
    this.xDomainLine = this.filteredDomain;
    this.xScaleLine = this.getXScaleLine(this.xDomainLine, this.dims.width);
  }

  public getSeriesDomain(): any[] {
    this.combinedSeries = this.lineData.slice(0);
    this.combinedSeries.push({
      name: this.yAxisLabel,
      series: this.barData,
    });
    return this.combinedSeries.map((d: any) => d.name);
  }

  public isDate(value: any): boolean {
    if (value instanceof Date) {
      return true;
    }

    return false;
  }

  public getScaleType(values: any): ScaleType {
    let date = true;
    let num = true;

    for (const value of values) {
      if (!this.isDate(value)) {
        date = false;
      }

      if (typeof value !== "number") {
        num = false;
      }
    }

    if (date) {
      return ScaleType.Time;
    }
    if (num) {
      return ScaleType.Linear;
    }
    return ScaleType.Ordinal;
  }

  public getXDomainLine(): any[] {
    let values = [];

    for (const results of this.lineData) {
      for (const d of results.series) {
        if (values.indexOf(d) === -1) {
          values.push(d.name);
        }
      }
    }

    this.scaleType = this.getScaleType(values);
    let domain = [];

    if (this.scaleType === "time") {
      const min = Math.min(...values);
      const max = Math.max(...values);
      domain = [min, max];
    } else if (this.scaleType === "linear") {
      values = values.map((v) => Number(v));
      const min = Math.min(...values);
      const max = Math.max(...values);
      domain = [min, max];
    } else {
      domain = values;
    }

    this.xSet = values;
    return domain;
  }

  public getYDomainLine(): any[] {
    const domain = [];

    for (const results of this.lineData) {
      for (const d of results.series) {
        if (domain.indexOf(d.value) < 0) {
          domain.push(d.value);
        }
        if (d.min !== undefined) {
          if (domain.indexOf(d.min) < 0) {
            domain.push(d.min);
          }
        }
        if (d.max !== undefined) {
          if (domain.indexOf(d.max) < 0) {
            domain.push(d.max);
          }
        }
      }
    }

    let min = Math.min(...domain);
    const max = Math.max(...domain);
    if (this.yRightAxisScaleFactor) {
      const minMax = this.yRightAxisScaleFactor(min, max);
      return [Math.min(0, minMax.min), minMax.max];
    } else {
      min = Math.min(0, min);
      return [min, max];
    }
  }

  public getXScaleLine(domain: any, width: any): any {
    let scale;
    if (this.bandwidth === undefined) {
      this.bandwidth = this.dims.width - this.barPadding;
    }

    if (this.scaleType === "time") {
      scale = scaleTime().range([0, width]).domain(domain);
    } else if (this.scaleType === "linear") {
      scale = scaleLinear().range([0, width]).domain(domain);

      if (this.roundDomains) {
        scale = scale.nice();
      }
    } else if (this.scaleType === "ordinal") {
      scale = scalePoint()
        .range([this.bandwidth / 2, width - this.bandwidth / 2])
        .domain(domain);
    }

    return scale;
  }

  public getYScaleLine(domain: any, height: any): any {
    const scale = scaleLinear().range([height, 0]).domain(domain);

    return this.roundDomains ? scale.nice() : scale;
  }

  public getXScale(): any {
    this.xDomain = this.getXDomain();
    const spacing =
      this.xDomain.length / (this.dims.width / this.barPadding + 1);
    return scaleBand()
      .rangeRound([0, this.dims.width])
      .paddingInner(spacing)
      .domain(this.xDomain);
  }

  public getYScale(): any {
    this.yDomain = this.getYDomain();
    const scale = scaleLinear()
      .range([this.dims.height, 0])
      .domain(this.yDomain);
    return this.roundDomains ? scale.nice() : scale;
  }

  public getXDomain(): any[] {
    return this.barData.map((d: any) => d.name);
  }

  public getYDomain() {
    const values = this.barData.map((d: any) => d.value);
    const min = Math.min(0, ...values);
    const max = Math.max(...values);
    if (this.yLeftAxisScaleFactor) {
      const minMax = this.yLeftAxisScaleFactor(min, max);
      return [Math.min(0, minMax.min), minMax.max];
    } else {
      return [min, max];
    }
  }

  public onClick(data: any, series?: any): void {
    this.select.emit({ data, series });
  }

  public setColors(): void {
    let domain;

    if (this.schemeType === ScaleType.Ordinal) {
      domain = this.xDomain;
    } else {
      domain = this.yDomain;
    }

    const scheme = this.scheme as Color;

    this.colors = new ColorHelper(
      scheme,
      this.schemeType,
      domain,
      this.customColors
    );

    this.colorsLine = new ColorHelper(
      scheme,
      this.schemeType,
      domain,
      this.customColors
    );
  }

  public getLegendOptions() {
    const opts = {
      scaleType: this.schemeType,
      colors: undefined,
      domain: [],
      title: undefined,
    } as any;
    if (opts.scaleType === "ordinal") {
      opts.domain = this.seriesDomain;
      opts.colors = this.colorsLine;
      opts.title = this.legendTitle;
    } else {
      opts.domain = this.seriesDomain;
      opts.colors = this.colors.scale;
    }
    return opts;
  }

  public updateLineWidth(width: any): void {
    this.bandwidth = width;
  }

  public updateYAxisWidth({ width }: { width: any }): void {
    this.yAxisWidth = width + 20;
    this.update();
  }

  public updateXAxisHeight({ height }: { height: any }): void {
    this.xAxisHeight = height;
    this.update();
  }

  public onActivate(item: any) {
    const idx = this.activeEntries.findIndex((d) => {
      return (
        d.name === item.name &&
        d.value === item.value &&
        d.series === item.series
      );
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item, ...this.activeEntries];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  public onDeactivate(item: any) {
    const idx = this.activeEntries.findIndex((d) => {
      return (
        d.name === item.name &&
        d.value === item.value &&
        d.series === item.series
      );
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }
}
