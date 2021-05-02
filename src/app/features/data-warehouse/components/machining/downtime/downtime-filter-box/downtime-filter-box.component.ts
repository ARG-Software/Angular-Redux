import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MimsSelectBoxModel } from '@mimsUI/input/select-box/models/select-box.model';
import { MachiningFilterModelUI } from '../../../../models/downtime.models';

@Component({
    selector: 'downtime-filter-box',
    styleUrls: ['downtime-filter-box.component.css'],
    templateUrl: 'downtime-filter-box.component.html'
})

export class DowntimeFilterBoxComponent implements OnChanges {

    @Input() public machineSelectBoxData: MimsSelectBoxModel[];
    @Input() public productSelectBoxData: MimsSelectBoxModel[];
    @Input() public defaultFilters: MachiningFilterModelUI;

    @Output() public OnFilterApply: EventEmitter<any> = new EventEmitter();

    protected downtimeForm: FormGroup;

    public constructor(private formbuilder: FormBuilder) {
        this.createForm();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['defaultFilters']) {
            if (changes['defaultFilters'].isFirstChange()) {
                this.downtimeForm = this.formbuilder.group({
                    Machine: new FormControl(''),
                    Product: new FormControl(''),
                    StartDate: new FormControl(this.defaultFilters.StartDate),
                    EndDate: new FormControl(this.defaultFilters.EndDate)
                });
            }
        }
    }

    /**
     * Create the structure for filter Form
     */
    private createForm() {
        this.downtimeForm = this.formbuilder.group({
            Machine: new FormControl(''),
            Product: new FormControl(''),
            StartDate: new FormControl(''),
            EndDate: new FormControl('')
        });
    }

    private submitFilters() {
        this.OnFilterApply.emit(this.downtimeForm.value);
    }
}
