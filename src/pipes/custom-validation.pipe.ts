import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(public options?: { transform: boolean }) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const transformValue = plainToInstance(metadata.metatype!, value);

    const validationErrors: ValidationError[] = await validate(transformValue);

    const errors = validationErrors.reduce(
      (acc: any, error: ValidationError) => {
        const { property, constraints } = error;
        acc[property] = [];
        for (const constraint of Object.values(constraints!)) {
          acc[property].push(constraint);
        }
        return acc;
      },
      {},
    );

    if (validationErrors.length !== 0) {
      throw new UnprocessableEntityException(
        { errors, status: 422 },
        'Invalid Data',
      );
    }

    if (this.options?.transform) {
      return transformValue;
    }

    return value;
  }
}
