import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClarityModule } from "@clr/angular";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { LineChartComponent } from "./graphics/line/line-chart/line-chart.component";

import { ButtonInverseComponent } from "./input/button/inverse/button-inverse.component";
import { ButtonSolidComponent } from "./input/button/solid/button-solid.component";
import { ButtonIconComponent } from "./input/button/icon/button-icon.component";
import { ButtonOutlineComponent } from "./input/button/outline/button-outline.component";
import { InputComponent } from "./input/input/input.component";
import { SelectBoxComponent } from "./input/select-box/select-box.component";
import { DatePickerComponent } from "./input/date-picker/date-picker.component";
import { ButtonSizeDirective } from "./input/button/base/button-size.directive";
import { ButtonTypeDirective } from "./input/button/base/button-type.directive";

import { NavbarComponent } from "./navigation/navbar/navbar.component";
import { CommonNavigationService } from "./navigation/common/services/navigation.service";
import { VerticalNavComponent } from "./navigation/vertical-nav/vertical-nav.component";

import { CardComponent } from "./elements/cards/card/card.component";
import { LabelComponent } from "./elements/label/label.component";
import { IconsComponent } from "./elements/icons/icons.component";
import { IconService } from "./elements//icons/services/icon.service";

import { VerticalChartBarComponent } from "./graphics/bar/vertical-bar/vertical-bar-chart.component";
import { GaugeChartComponent } from "./graphics/gauge/gauge-chart.component";

import { DataGridComponent } from "./tables/data-grid/data-grid.component";
import { TableComponent } from "./tables/table/table.component";

import { MimsUiUtilsService } from "./mims-ui.utils.service";

import { ComboSeriesVerticalComponent } from "./graphics/bar/combo-chart/vertical/vertical-bar/combo-series-vertical.component";
import { ComboChartVerticalComponent } from "./graphics/bar/combo-chart/vertical/combo-chart-vertical.component";

import { StackedHorizontalBarChartComponent } from "./graphics/bar/stacked-horizontal/stacked-horizontal-bar-chart.component";

import { SpinnerComponent } from "./elements/spinner/spinner.component";
import { HeaderComponent } from "./elements/header/header.component";
import { CardImageComponent } from "./elements/cards/card-image/card-image.component";
import { CheckboxComponent } from "./input/checkbox/checkbox.component";
import { AlertComponent } from "./elements/alert/alert.component";
import { MimsFormErrorsService } from "./forms/wizard/services/errors.service";
import { WizardComponent } from "./forms/wizard/wizard.component";
import { PaginationComponent } from "./navigation/pagination/pagination.component";

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
  ],
  declarations: [
    AlertComponent,
    NavbarComponent,
    DataGridComponent,
    VerticalChartBarComponent,
    InputComponent,
    CardComponent,
    LabelComponent,
    SelectBoxComponent,
    IconsComponent,
    DatePickerComponent,
    VerticalNavComponent,
    ButtonSizeDirective,
    ButtonTypeDirective,
    ButtonIconComponent,
    ButtonSolidComponent,
    ButtonInverseComponent,
    LineChartComponent,
    GaugeChartComponent,
    ButtonOutlineComponent,
    PaginationComponent,
    WizardComponent,
    ComboSeriesVerticalComponent,
    ComboChartVerticalComponent,
    StackedHorizontalBarChartComponent,
    SpinnerComponent,
    HeaderComponent,
    CardImageComponent,
    TableComponent,
    CheckboxComponent,
  ],
  providers: [
    CommonNavigationService,
    MimsUiUtilsService,
    IconService,
    MimsFormErrorsService,
  ],
  exports: [
    AlertComponent,
    NavbarComponent,
    VerticalChartBarComponent,
    CardComponent,
    InputComponent,
    DataGridComponent,
    LabelComponent,
    SelectBoxComponent,
    DatePickerComponent,
    VerticalNavComponent,
    ButtonSizeDirective,
    ButtonTypeDirective,
    ButtonIconComponent,
    ButtonSolidComponent,
    ButtonInverseComponent,
    LineChartComponent,
    GaugeChartComponent,
    ButtonOutlineComponent,
    WizardComponent,
    ComboSeriesVerticalComponent,
    ComboChartVerticalComponent,
    StackedHorizontalBarChartComponent,
    SpinnerComponent,
    HeaderComponent,
    CardImageComponent,
    TableComponent,
    CheckboxComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MimsUIModule {
  constructor(private iconService: IconService) {
    this.iconService.loadCustomIcons();
  }
}
