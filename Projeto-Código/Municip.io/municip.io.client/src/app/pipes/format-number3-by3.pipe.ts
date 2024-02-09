import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber3By3Pipe'
})
export class FormatNumber3By3Pipe implements PipeTransform {

  transform(value: string | number): string {
    if (value === null || value === undefined) return ''; // Handle null or undefined values
    const cleaned = String(value).replace(/\s+/g, '').replace(/\D/g, ''); // Convert to string and remove spaces and non-digit characters
    return cleaned.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '); // Format with spaces every three digits
  }

}
