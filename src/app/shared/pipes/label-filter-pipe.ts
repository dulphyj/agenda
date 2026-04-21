import { Pipe, PipeTransform } from '@angular/core';
import { Cita } from '../../core/models/cita';

@Pipe({
  name: 'labelFilter',
  standalone: true
})
export class LabelFilter implements PipeTransform {
  transform(citas: Cita[] | null, labelId: string): Cita[] {
    if (!citas || !labelId) return citas || [];
    return citas.filter(c => c.labelId === labelId);
  }
}