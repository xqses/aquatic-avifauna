import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  standalone: true,
})
export class FilterInputComponent {
  @Input() placeholder = '';
  @Output() filterSearchStringChange = new EventEmitter<string>();

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.filterSearchStringChange.emit(inputElement.value);
  }
}
