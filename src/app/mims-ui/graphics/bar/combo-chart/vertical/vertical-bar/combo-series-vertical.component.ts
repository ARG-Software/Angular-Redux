import { animate, style, transition, trigger } from "@angular/animations";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import {
  BarOrientation,
  formatLabel,
  PlacementTypes,
} from "@swimlane/ngx-charts";

@Component({
  standalone: false,
  selector: "g[ngx-combo-charts-series-vertical]",
  templateUrl: "combo-series-vertical.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboSeriesVerticalComponent implements OnChanges {
  @Input() public dims: any;
  @Input() public type = "standard";
  @Input() public series: any;
  @Input() public seriesLine: any;
  @Input() public xScale: any;
  @Input() public yScale: any;
  @Input() public colors: any;
  @Input() public tooltipDisabled: boolean = false;
  @Input() public gradient: any;
  @Input() public activeEntries: any[] = [];
  @Input() public seriesName: string = "";
  @Input() public animations: boolean = true;
  @Input() public orientation: BarOrientation = "vertical" as BarOrientation;
  @Input() public tooltipPlacement: PlacementTypes = "top" as PlacementTypes;
  @Input() public tooltipType: any = "tooltip";
  @Output() public select = new EventEmitter();
  @Output() public activate = new EventEmitter();
  @Output() public deactivate = new EventEmitter();
  @Output() public bandwidth = new EventEmitter();

  public bars: any;
  public x: any;
  public y: any;

  public ngOnChanges(_changes: any): void {
    this.update();
  }

  public update(): void {
    let width: any;
    if (this.series.length) {
      width = this.xScale.bandwidth();
      this.bandwidth.emit(width);
    }

    let d0 = 0;
    let total: any;
    if (this.type === "normalized") {
      total = this.series
        .map((d: any) => d.value)
        .reduce((sum: any, d: any) => sum + d, 0);
    }

    this.bars = this.series.map((d: any, index: any) => {
      let value = d.value;
      const label = d.name;
      const formattedLabel = formatLabel(label);
      const roundEdges = this.type === "standard";

      const bar: any = {
        value,
        label,
        roundEdges,
        data: d,
        width,
        formattedLabel,
        height: 0,
        x: 0,
        y: 0,
      };

      if (this.type === "standard") {
        bar.height = Math.abs(this.yScale(value) - this.yScale(0));
        bar.x = this.xScale(label);

        if (value < 0) {
          bar.y = this.yScale(0);
        } else {
          bar.y = this.yScale(value);
        }
      } else if (this.type === "stacked") {
        const offset0 = d0;
        const offset1 = offset0 + value;
        d0 += value;

        bar.height = this.yScale(offset0) - this.yScale(offset1);
        bar.x = 0;
        bar.y = this.yScale(offset1);
        bar.offset0 = offset0;
        bar.offset1 = offset1;
      } else if (this.type === "normalized") {
        let offset0 = d0;
        let offset1 = offset0 + value;
        d0 += value;

        if (total > 0) {
          offset0 = (offset0 * 100) / total;
          offset1 = (offset1 * 100) / total;
        } else {
          offset0 = 0;
          offset1 = 0;
        }

        bar.height = this.yScale(offset0) - this.yScale(offset1);
        bar.x = 0;
        bar.y = this.yScale(offset1);
        bar.offset0 = offset0;
        bar.offset1 = offset1;
        value = (offset1 - offset0).toFixed(2) + "%";
      }

      if (this.colors.scaleType === "ordinal") {
        bar.color = this.colors.getColor(label);
      } else {
        if (this.type === "standard") {
          bar.color = this.colors.getColor(value);
          bar.gradientStops = this.colors.getLinearGradientStops(value);
        } else {
          bar.color = this.colors.getColor(bar.offset1);
          bar.gradientStops = this.colors.getLinearGradientStops(
            bar.offset1,
            bar.offset0
          );
        }
      }

      let tooltipLabel = formattedLabel;
      if (this.seriesName) {
        tooltipLabel = `${this.seriesName} • ${formattedLabel}`;
      }

      this.getSeriesTooltips(this.seriesLine, index);
      const lineValue = this.seriesLine[0].series[index].value;
      const lineName = this.seriesLine[0].series[index].name;
      bar.tooltipText = `
            <span class="tooltip-label">${tooltipLabel}</span>
            <span class="tooltip-val"> Y1 - ${value.toLocaleString()} • Y2 - ${lineValue.toLocaleString()}%</span>
        `;

      return bar;
    });
  }

  public getSeriesTooltips(seriesLine: any, index: any) {
    return seriesLine.map((d: any) => {
      return d.series[index];
    });
  }

  public isActive(entry: any): boolean {
    if (!this.activeEntries) {
      return false;
    }
    const item = this.activeEntries.find((d) => {
      return entry.name === d.name && entry.series === d.series;
    });
    return item !== undefined;
  }

  public publiconClick(data: any): void {
    this.select.emit(data);
  }

  public trackBy(_index: any, bar: any): string {
    return bar.label;
  }

  public onClick(event: any): void {
    this.select.emit(event);
  }
}
