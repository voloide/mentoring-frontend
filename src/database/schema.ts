import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'mentors',
      columns: [
        { name: 'uuid', type: 'string' },
        { name: 'employee_id', type: 'string' },
        { name: 'perfil', type: 'string' },
        { name: 'nivel_de_acesso', type: 'string' }
      ]
    })
  ]
});
