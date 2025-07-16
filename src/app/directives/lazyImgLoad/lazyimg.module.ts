import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyimgDirective } from './lazyimg.directive';



@NgModule({
  declarations: [LazyimgDirective],
  imports: [
    CommonModule
  ],
  exports : [LazyimgDirective]
})
export class LazyimgModule { }
