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
                <div>
                  <q-btn
                      v-if="['resource', 'subCateg', 'categ', 'program'].includes(props.node.type)"
                      @click="resourceRequest(props.node)"
                      :class="{
                      'text-orange': ['resource', 'subCateg', 'categ', 'program'].includes(props.node.type)
                    }"
                      dense
                      size="sm"
                  >
                    {{ props.node.label }}
                  </q-btn>
                  <div v-else class="row">
                  <span
                      @click="resourceRequest(props.node)"
                      :class="{'text-blue': props.node.clickable === 2,
                      'q-mt-sm': true}"
                  >
                    {{ props.node.label }}
                  </span>
<!--                  <q-btn-->
<!--                      v-if="props.node.clickable === 2"-->
<!--                      flat-->
<!--                      round-->
<!--                      class="q-ml-md col"-->
<!--                      color="red-8"-->
<!--                      icon="cancel"-->
<!--                      @click="removeResource(props.node)"-->
<!--                  >-->
<!--                    <q-tooltip class="bg-red-5">Remoer Recurso</q-tooltip>-->
<!--                  </q-btn>-->
                  </div>
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
            lazy-rules
            :rules="[(val) => val.length >= 4  || 'O nome que o ficheiro irá assumir deve ter no mínimo 4 caracteres.']"
            label="Nome"
            disabled
          />
          <q-file
            v-if="addingResource"
            v-model="fileInput"
            outlined
            label="Selecione o Ficheiro. Max (2MB)"
            max-file-size="2000048"
            @rejected="onRejected"
            counter
            dense
            class="col"
            ref="fileRef"
            lazy-rules
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
        <q-btn dense class="q-mr-sm" type="submit" color="primary" label="Gravar" @click="gravar(actualNode)" :disable="isSaveDisabled" v-close-popup></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import resourceService from 'src/services/api/resource/resourceService';
import useResource from 'src/composables/resource/resourceMethods';
import moment from 'moment';
import {useSwal} from 'src/composables/shared/dialog/dialog';

const { alertError, alertSucess, alertWarningAction } = useSwal();

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

const fileNameRef = ref(null)
const fileRef = ref(null)

const timestamp = ref(null)
const fileBeingUploaded = ref(false)
const subCategBeingRegistered = ref(false)
const categBeingRegistered = ref(false)
const programBeingRegistered = ref(false)

const nodes = ref([])
const resetAddingViewForm = () => {
  addingProgram.value = false
  addingCateg.value = false
  addingSubCateg.value = false
  addingResource.value = false
  fileInput.value = null
  fileSelected.value = false
}

const isSaveDisabled = computed(() => {
  if (fileBeingUploaded.value) {
    return !fileName.value || fileName.value.length < 4 || !fileInput.value;
  }
  if (subCategBeingRegistered.value) {
    return !subCategoryInput.value || subCategoryInput.value.length < 2;
  }
  if (categBeingRegistered.value) {
    return !categoryInput.value || categoryInput.value.length < 2;
  }
  if (programBeingRegistered.value) {
    return !programInput.value || programInput.value.length < 2;
  }
  return false
})

const onRejected = (rejectedEntries) => {
  alertError('Ficheiro "'+rejectedEntries[0].file.name+'", com tamanho '+rejectedEntries[0].file.size+'Bytes não suportado.')
}

const resourceRequest = (node) => {
  fileBeingUploaded.value = false
  subCategBeingRegistered.value  = false
  categBeingRegistered.value  = false
  programBeingRegistered.value  = false
  actualNode.value = node
  resetAddingViewForm()
  if(node.clickable === 1) { // Algo sera adicionado [Program/Categoria/Subcategoria/Recurso]
    if(node.type === 'resource') { // Vamos adicionar recurso
      fileBeingUploaded.value = true
      categoryLabel.value = 'Sub Categoria'
      popUpTitle.value = 'Adicionar Recurso de EA'
      addingResource.value = true
      nodeCategory.value = node.program + ' -> ' + node.category +  ' -> ' + node.subCategory
    } else if(node.type === 'subCateg') {  // Vamos adicionar Sub Categoria
      subCategBeingRegistered.value = true
      categoryLabel.value = 'Categoria'
      popUpTitle.value = 'Adicionar Sub Categoria'
      addingSubCateg.value = true
      nodeCategory.value = node.program + ' -> ' + node.category
    } else if(node.type === 'categ') { // Vamos adicionar Categoria
      categBeingRegistered.value = true
      categoryLabel.value = 'Programa'
      popUpTitle.value = 'Adicionar Categoria'
      addingCateg.value = true
      nodeCategory.value = node.program
    } else if(node.type === 'program') { // Vamos adicionar Programa
      programBeingRegistered.value = true
      popUpTitle.value = 'Adicionar Programa'
      addingProgram.value = true
    }
    showAddResource.value = true // Abrir PopUp
  } else if(node.clickable === 2) { // Um recurso sera carregado no backend e baixado no front
    resourceService.loadFile(node.name).then((respStatus) => {
      if(respStatus === 200 || respStatus === 201){
        alertSucess('Ficheiro descarregado. Verifique no seu directorio de downloads.')
      } else if(respStatus === 404) {
        alertError('O ficheiro que deseja baixar nao foi encontrado.')
      } else {
        alertError('Ocorreu um erro inesperado.')
      }
    })
  }
};

const resetFilter = () => {
  filter.value = ''
  filterRef.value.focus()
}

const newFile = ref(null)

const gravar = async (node) => {

  if (node.type === 'resource') {
    // Adicionar recurso
    const programNode = nodes.value.find(item => item.label === node.program);
    if (programNode) {
      const categoryNode = programNode.children.find(item => item.label === node.category);
      if (categoryNode) {
        const subCategoryNode = categoryNode.children.find(item => item.label === node.subCategory);
        if (subCategoryNode) {
          const now = moment();
          timestamp.value = now.format('YYYYMMDDHHmmss');
          let newFileName = `${fileName.value}_${timestamp.value}.${fileInput.value.name.split('.').pop()}`;
          newFile.value = new File([fileInput.value], newFileName)
          subCategoryNode.children.unshift({
            label: newFileName,
            clickable: 2,
            description: fileDescription.value,
            name: newFileName,
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

const doPatch = (nodes) => {
    const { createDTOFromResource } = useResource();

    resourceObj.value.resource = JSON.stringify(nodes.value);
    let resource = createDTOFromResource(resourceObj.value);

    if (fileSelected.value) {
      fileNameRef.value.validate();
      fileRef.value.validate();

        if (
            !fileNameRef.value.hasError &&
            !fileRef.value.hasError
        ) {
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const newFileName = `${fileName.value}_${timestamp}.${fileInput.value.name.split('.').pop()}`;

            let formData = new FormData();
            formData.append('id', resource.id);
            formData.append('uuid', resource.uuid);
            formData.append('resource', resource.resource);
            formData.append('file', newFile.value);
            resourceService.updateResourceTree(formData).then((res) => {
              if(res)
                if(res.status === 200 || res.status === 201) {
                  loadResources()
              }
            });
        }
    } else {
        resourceService.updateResourceTreeWithoutFile(resource).then((res) => {
          if(res)
            if(res.status === 200 || res.status === 201) {
              loadResources()
            }
        });
    }
};

const loadResources = () => {
  resourceService.getAll().then((res) => {
    resourceObj.value = resourceService.piniaGetAll()[0]
    nodes.value = JSON.parse(resourceObj.value.resource)
  })
}

onMounted(() => {
  loadResources()
})

</script>

<style scoped lang="scss">

</style>
