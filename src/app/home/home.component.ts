import { Component, computed, effect, signal } from '@angular/core';
import { single } from 'rxjs';

@Component({
  templateUrl: './home.component.html',
  standalone: true,
})
export class HomeComponent {
  public pageTitle = 'Welcome';
  counter = signal(0);
  testCounter = computed(() => this.counter() + 1);
  isZeroCounter = computed(() => this.counter() == 0);
  isZeroColor = computed(() => (this.isZeroCounter() ? 'red' : 'green'));
  constructor() {
    effect(() => {
      console.log(
        '🚀 ~ HomeComponent ~ effect ~ this.testCounter():',
        this.testCounter()
      );
    });
  }
  increaseCounter = () => {
    return this.counter.update((value) => value + 1);
  };
}
