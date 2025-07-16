import { Directive, ElementRef, HostBinding, Input ,AfterViewInit, AfterContentInit } from '@angular/core';

@Directive({
  selector: 'img'
})
export class LazyimgDirective implements AfterContentInit{

  @HostBinding('attr.src') srcAttr :any =  null;
  @Input() src: string = '';
   

  constructor(private el: ElementRef) {}

  ngAfterContentInit() {
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }

  private canLazyLoad() {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement);
  }

  private loadImage() {
    this.srcAttr = this.src;
  }

}
