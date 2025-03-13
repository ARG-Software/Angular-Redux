import { Directive, ElementRef, Renderer2, Input, OnInit } from "@angular/core";

@Directive({
  standalone: false,
  selector: "[buttontype]",
})
export class ButtonTypeDirective implements OnInit {
  @Input() public buttontype: string = "";
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  public ngOnInit(): void {
    switch (this.buttontype) {
      case "success":
        this.renderer.addClass(this.elementRef.nativeElement, "btn-success");
        break;
      case "danger":
        this.renderer.addClass(this.elementRef.nativeElement, "btn-danger");
        break;
      case "warning":
        this.renderer.addClass(this.elementRef.nativeElement, "btn-warning");
        break;
      case "info":
        this.renderer.addClass(this.elementRef.nativeElement, "btn-info");
        break;
      default:
        break;
    }
  }
}
