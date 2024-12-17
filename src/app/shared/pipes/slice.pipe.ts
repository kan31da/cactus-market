import { Pipe, PipeTransform } from '@angular/core';
import { MAX_CHAR_COUNT } from '../../utils/constants';

@Pipe({
  name: 'slice',
  standalone: true,
})
export class SlicePipe implements PipeTransform {
  transform(value: string, maxCharCount = MAX_CHAR_COUNT): unknown {
    const dots = value.length > maxCharCount ? '...' : '';
    return `${value.substring(0, maxCharCount)}${dots}`;
  }
}