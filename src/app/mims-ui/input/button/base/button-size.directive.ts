import { Directive, ElementRef, Renderer2, Input, OnInit } from "@angular/core";

@Directive({
  standalone: false,
  selector: "[buttonsize]",
})
export class ButtonSizeDirective implements OnInit {
  @Input() public buttonsize: string = "";
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  public ngOnInit(): void {
    switch (this.buttonsize) {
      case "small":
        this.renderer.addClass(this.elementRef.nativeElement, "btn-sm");
        break;
      case "block":
        this.renderer.addClass(this.elementRef.nativeElement, "btn-block");
        break;
      default:
        break;
    }
  }
}
