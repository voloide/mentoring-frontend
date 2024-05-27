<template>
  <div class="q-pt-sm" style="height: 100%;">
    <div class="q-ma-md q-pa-md page-container">
      <div class="row">
        <q-input ref="filterRef" filled v-model="filter" label="Filtro" class="col">
          <template v-slot:append>
            <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter"></q-icon>
          </template>
        </q-input>
      </div>

      <div class="row q-mt-sm">
        <q-card flat bordered class="my-card col">
          <q-card-section class="">
            <q-tree
                :nodes="nodes"
                node-key="label"
                :filter="filter"
                v-model:selected="selectedNode"
            >
              <template #default-header="props">
                <div @click="newResource(props.node)">
                  {{props.node.label}}
                </div>
              </template>
            </q-tree>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>


  <q-dialog persistent v-model="showAddResource">
    <q-card style="width: 45vw; max-width: 90vw;">
      <q-card-section>
        <div class="text-h7 bg-primary q-pa-sm text-white">{{ popUpTitle }}</div>
      </q-card-section>

      <q-card-section bordered class="q-pt-none">
        <div class="row">
          <q-input
            v-if="addingProgram"
            class="col-12 q-mb-sm"
            dense
            outlined
            ref="programRef"
            v-model="programInput"
            label="Programa"
          />
          <q-input
            v-if="!addingProgram"
            class="col-12 q-mb-sm"
            dense
            outlined
            ref="categoryRef"
            v-model="nodeCategory"
            :label="categoryLabel"
            disable
          />
          <q-input
            v-if="addingCateg"
            class="col-12 q-mb-sm"
            dense
            outlined
            ref="categoryRef"
            v-model="categoryInput"
            label="Categoria"
          />
          <q-input
            v-if="addingSubCateg"
            class="col-12 q-mb-sm"
            dense
            outlined
            ref="subCategoryRef"
            v-model="subCategoryInput"
            label="Sub Categoria"
          />
          <q-input
            v-if="addingResource"
            class="col-12 q-mb-sm"
            dense
            outlined
            ref="descriptionRef"
            v-model="fileDescription"
            label="Descricao"
          />
          <q-input
            v-if="addingResource"
            class="col q-mb-sm q-mr-sm"
            dense
            outlined
            ref="fileNameRef"
            v-model="fileName"
            label="Nome"
            disabled
          />
          <q-file
            v-if="addingResource"
            v-model="fileInput"
            outlined
            label="Selecione o Ficheiro"
            counter
            dense
            class="col"
            ref="fileRef"
            :rules="[(val) => !!val || 'Por favor indicar o ficheiro.']"
            @update:model-value="excelExport"
            :disable="submitSend"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
            <template v-if="fileInput" v-slot:append>
              <q-icon
                  name="cancel"
                  @click.stop.prevent="fileInput = null"
                  class="cursor-pointer"
              />
            </template>
          </q-file>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn dense label="Cancelar" color="red" v-close-popup></q-btn>
        <q-btn dense class="q-mr-sm" type="submit" color="primary" label="Gravar" @click="gravar(actualNode)" v-close-popup></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import resourceService from 'src/services/api/resource/resourceService';
import useResource from 'src/composables/resource/resourceMethods';

const search = ref(null)
const filter = ref('')
const filterRef = ref(null)
const showAddResource = ref(false)
const nodeCategory = ref('')

const addingProgram = ref(false)
const addingCateg = ref(false)
const addingSubCateg = ref(false)
const addingResource = ref(false)

const popUpTitle = ref('')
const categoryLabel = ref('Categoria')

const categoryInput = ref('')
const programInput = ref('')
const subCategoryInput = ref('')
const selectedNode = ref(null)
const actualNode = ref(null)
const resourceObj = ref(null)
const fileInput = ref(null)
const fileDescription = ref(null)
const fileName = ref(null)
const fileSelected = ref(false)

const nodes = ref([])

// const nodes = ref([
//   {
//     label: 'HIV',
//     clickable: 0,
//     children: [
//       {
//         label: 'Directrizes e Guiões Nacionais',
//         clickable: 0,
//         children: [
//           {
//             label: 'ATS e Prevenção',
//             clickable: 0,
//             children: [
//               {
//                 label: 'Adicionar Recurso',
//                 clickable: 1,
//                 icon: 'add',
//                 program: 'HIV',
//                 category: 'Directrizes e Guiões Nacionais',
//                 subCategory: 'ATS e Prevenção',
//                 type: 'resource'
//               }
//             ]
//           },
//           {
//             label: 'Cuidados e Tratamento',
//             children: [
//               {
//                 label: 'Adicionar Recurso',
//                 icon: 'add',
//                 clickable: 1,
//                 program: 'HIV',
//                 category: 'Directrizes e Guiões Nacionais',
//                 subCategory: 'Cuidados e Tratamento',
//                 type: 'resource'
//               }
//             ]
//           },
//           {
//             label: 'Adicionar Sub Categoria',
//             clickable: 1,
//             icon: 'add',
//             program: 'HIV',
//             category: 'Directrizes e Guiões Nacionais',
//             type: 'subCateg'
//           }
//         ]
//       },
//       {
//         label: 'Adicionar Categoria',
//         clickable: 1,
//         icon: 'add',
//         program: 'HIV',
//         type: 'categ'
//       }
//     ]
//   },
//   {
//     label: 'TB',
//     clickable: 0,
//     children: [
//       {
//         label: 'Directrizes e Guiões Nacionais',
//         clickable: 0,
//         children: [
//           {
//             label: 'ATS e Prevenção',
//             children: [
//               {
//                 label: 'Adicionar',
//                 icon: 'add',
//                 program: 'HIV',
//                 category: 'SubCateg',
//                 subCategory: 'SubCateg1',
//                 clickable: 1
//               }
//             ]
//           },
//           {
//             label: 'Cuidados e Tratamento',
//             children: [
//               {
//                 label: 'Adicionar',
//                 icon: 'add'
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   },
//   {
//     label: 'Adicionar Programa',
//     icon: 'add',
//     clickable: 1,
//     type: 'program'
//   }
// ]);

const resetAddingViewForm = () => {
  addingProgram.value = false
  addingCateg.value = false
  addingSubCateg.value = false
  addingResource.value = false
  fileInput.value = null
    fileSelected.value = false
}

const newResource = (node) => {
  actualNode.value = node
  resetAddingViewForm()
  if(node.clickable === 1) {
    if(node.type === 'resource') { // Vamos adicionar recurso
      categoryLabel.value = 'Sub Categoria'
      popUpTitle.value = 'Adicionar Recurso de EA'
      addingResource.value = true
      nodeCategory.value = node.program + ' -> ' + node.category +  ' -> ' + node.subCategory
    } else if(node.type === 'subCateg') {  // Vamos adicionar Sub Categoria
      categoryLabel.value = 'Categoria'
      popUpTitle.value = 'Adicionar Sub Categoria'
      addingSubCateg.value = true
      nodeCategory.value = node.program + ' -> ' + node.category
    } else if(node.type === 'categ') { // Vamos adicionar Categoria
      categoryLabel.value = 'Programa'
      popUpTitle.value = 'Adicionar Categoria'
      addingCateg.value = true
      nodeCategory.value = node.program
    } else if(node.type === 'program') { // Vamos adicionar Programa
      popUpTitle.value = 'Adicionar Programa'
      addingProgram.value = true
    }
    showAddResource.value = true // Abrir PopUp
  }
};

const resetFilter = () => {
  filter.value = ''
  filterRef.value.focus()
}

// const saveFileLocally = (file) => {
//   const url = URL.createObjectURL(file);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = file.name;
//   a.click();
//   URL.revokeObjectURL(url);
// };

const gravar = async (node) => {

  if (node.type === 'resource') { // Adicionar recurso
    const programNode = nodes.value.find(item => item.label === node.program);
    if (programNode) {
      const categoryNode = programNode.children.find(item => item.label === node.category);
      if (categoryNode) {
        const subCategoryNode = categoryNode.children.find(item => item.label === node.subCategory);
        if (subCategoryNode) {
          subCategoryNode.children.unshift({
            label: fileInput.value.name,
            clickable: 2,
            description: fileDescription.value,
            name: fileName.value,
          });
            fileSelected.value = true
        }
      }
    }
  } else if (node.type === 'subCateg') {  // Adicionar Sub Categoria
    const programNode = nodes.value.find(item => item.label === node.program);
    if (programNode) {
      const categoryNode = programNode.children.find(item => item.label === node.category);
      if (categoryNode) {
        categoryNode.children.unshift({
          label: subCategoryInput.value,
          clickable: 0,
          children: [
            {
              label: 'Adicionar Recurso',
              clickable: 1,
              icon: 'add',
              program: node.program,
              category: node.category,
              subCategory: subCategoryInput.value,
              type: 'resource'
            }
          ]
        });
      }
    }
  } else if (node.type === 'categ') { // Adicionar Categoria
    const programNode = nodes.value.find(item => item.label === node.program);
    if (programNode) {
      programNode.children.unshift({
        label: categoryInput.value,
        clickable: 0,
        children: [
          {
            label: 'Adicionar Sub Categoria',
            clickable: 1,
            icon: 'add',
            program: node.program,
            category: categoryInput.value,
            type: 'subCateg'
          }
        ]
      });
    }
  } else if (node.type === 'program') { // Adicionar Programa
    nodes.value.unshift({
      label: programInput.value,
      clickable: 0,
      children: [
        {
          label: 'Adicionar Categoria',
          clickable: 1,
          icon: 'add',
          program: programInput.value,
          type: 'categ'
        }
      ]
    });
  }

  doPatch(nodes);
};


// const doPatch = (nodes) => {
//     const {createDTOFromResource} = useResource()
//     resourceObj.value.resource = JSON.stringify(nodes.value)
//     resourceService.updateResourceTree(createDTOFromResource(resourceObj.value)).then((res) => {
//         console.log(res)
//     })
// }

// const doPatch = (nodes) => {
//   const { createDTOFromResource } = useResource();
//   resourceObj.value.resource = JSON.stringify(nodes.value);
//
//     let resource = createDTOFromResource(resourceObj.value, null);
//     if(fileSelected.value) {
//         let formData = new FormData();
//         formData.append('file', fileInput.value);
//         resource = createDTOFromResource(resourceObj.value, formData);
//     }
//
//   resourceService.updateResourceTree(resource).then((res) => {
//     console.log(res);
//   });
// };

const doPatch = (nodes) => {
    const { createDTOFromResource } = useResource();
    resourceObj.value.resource = JSON.stringify(nodes.value);

    let resource = createDTOFromResource(resourceObj.value);
    let formData = new FormData();

    if (fileSelected.value) {
      formData.append('id', resource.id);
      formData.append('uuid', resource.uuid);
      formData.append('resource', resource.resource);
      formData.append('file', fileInput.value);
    } else {
      formData.append('id', resource.id);
      formData.append('uuid', resource.uuid);
      formData.append('resource', resource.resource);
      formData.append('file', null);
    }

    resourceService.updateResourceTree(formData).then((res) => {
        console.log(res);
    });
};


onMounted(() => {
  //   const resource = new Resource({
  //       resource: JSON.stringify(nodes.value)
  //   })
  // resourceService.save(resource).then((res) => {
  //   console.log(res)
  // })

  resourceService.getAll().then((res) => {
    // console.log(JSON.parse(res.data[0].resource))
    resourceObj.value = resourceService.piniaGetAll()[0]
    nodes.value = JSON.parse(resourceObj.value.resource)
  })
})

</script>

<style scoped lang="scss">

</style>
