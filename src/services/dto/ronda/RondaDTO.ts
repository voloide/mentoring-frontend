import { Expose, Type } from "class-transformer";

export class RondaDTO{

    @Expose({ name: 'uuid' })
    uuid!: string;

    @Expose()
    @Type(() => Date) 
    startDate!: string;
}
