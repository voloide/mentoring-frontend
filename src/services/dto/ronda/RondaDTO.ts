import { Expose } from "class-transformer";

export class RondaDTO{

    @Expose({ name: 'uuid' })
    uuid!: string;
}
