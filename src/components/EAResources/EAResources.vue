<template>
  <div class="q-pt-sm" style="height: 100%">
    <div class="q-ma-md q-pa-md page-container manage-form ea-resources">
      <div class="row">
        <q-input
          ref="filterRef"
          outlined
          dense
          v-model="filter"
          label="Filtro"
          class="col"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="filter !== ''"
              name="clear"
              class="cursor-pointer"
              @click="resetFilter"
            ></q-icon>
          </template>
        </q-input>
      </div>

      <div class="row q-mt-md">
        <div class="col">
          <q-tree
            :nodes="nodes"
            node-key="label"
            :filter="filter"
            v-model:selected="selectedNode"
          >
            <template #default-header="props">
              <div>
                <q-btn
                  v-if="
                    ['resource', 'subCateg', 'categ', 'program'].includes(
                      props.node.type
                    )
                  "
                  @click="resourceRequest(props.node)"
                  flat
                  dense
                  no-caps
                  rounded
                  size="sm"
                  icon="add"
                  class="add-node-btn"
                >
                  {{ props.node.label }}
                </q-btn>
                <div v-else class="row">
                  <q-icon
                    v-if="props.node.isLink"
                    name="link"
                    class="q-mr-sm text-primary"
                  />

                  <span
                    @click="handleClickResource(props.node)"
                    :class="{
                      'text-blue': props.node.clickable === 2,
                      'q-mt-sm': true,
                    }"
                  >
                    {{ props.node.label }}

                    <!-- Tooltip com a descrição -->
                    <q-tooltip v-if="props.node.description">
                      {{ props.node.description }}
                    </q-tooltip>
                  </span>
                </div>
              </div>
            </template>
          </q-tree>
        </div>
      </div>
    </div>
  </div>

  <q-dialog persistent v-model="showAddResource">
    <q-card style="width: 45vw; max-width: 90vw" class="manage-form">
      <q-card-section>
        <div class="text-h7 bg-primary q-pa-sm text-white section-banner">
          {{ popUpTitle }}
        </div>
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

          <!-- Seleção de tipo de recurso -->
          <div class="col-12 q-mb-sm">
            <q-option-group
              v-if="addingResource"
              v-model="tipoRecurso"
              :options="resourceOptions"
              type="radio"
              inline
            />
          </div>

          <!-- Campos comuns para nome e descrição -->
          <q-input
            v-if="addingResource"
            class="col-12 q-mb-sm"
            dense
            outlined
            ref="descriptionRef"
            v-model="fileDescription"
            label="Descrição"
          />

          <q-input
            v-if="addingResource"
            class="col-12 q-mb-sm"
            dense
            outlined
            ref="fileNameRef"
            v-model="fileName"
            lazy-rules
            :rules="[
              (val) =>
                val.length >= 4 ||
                'O nome do recurso deve ter no mínimo 4 caracteres.',
            ]"
            label="Nome do Recurso"
          />

          <!-- Upload de FICHEIRO -->
          <q-file
            v-if="addingResource && tipoRecurso === 'FICHEIRO'"
            v-model="fileInput"
            outlined
            label="Selecione o Ficheiro. Max (20MB)"
            max-file-size="20000000"
            @rejected="onRejected"
            counter
            dense
            class="col-12"
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

          <!-- Cadastro de Link -->
          <q-input
            v-if="addingResource && tipoRecurso === 'LINK'"
            class="col-12 q-mb-sm"
            dense
            outlined
            v-model="linkUrl"
            label="Link do Recurso"
            type="url"
            :rules="[(val) => !!val || 'Por favor indique o link do recurso.']"
          />
        </div>
      </q-card-section>

      <q-card-actions v-if="doesUserHavePermissions()" align="right">
        <q-btn
          dense
          outline
          rounded
          no-caps
          label="Cancelar"
          color="grey-8"
          v-close-popup
        />
        <q-btn
          dense
          unelevated
          rounded
          no-caps
          class="q-mr-sm"
          type="submit"
          color="primary"
          label="Gravar"
          @click="gravar(actualNode)"
          :disable="isSaveDisabled"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import resourceService from 'src/services/api/resource/resourceService';
import useResource from 'src/composables/resource/resourceMethods';
import moment from 'moment';
import { useSwal } from 'src/composables/shared/dialog/dialog';

const { alertError, alertSucess } = useSwal();

const tipoRecurso = ref('FICHEIRO');
const linkUrl = ref('');
const resourceOptions = ref([
  { label: 'Ficheiro', value: 'FICHEIRO' },
  { label: 'Link', value: 'LINK' },
]);

const filter = ref('');
const filterRef = ref(null);
const showAddResource = ref(false);
const nodeCategory = ref('');

const addingProgram = ref(false);
const addingCateg = ref(false);
const addingSubCateg = ref(false);
const addingResource = ref(false);

const popUpTitle = ref('');
const categoryLabel = ref('Categoria');

const categoryInput = ref('');
const programInput = ref('');
const subCategoryInput = ref('');
const selectedNode = ref(null);
const actualNode = ref(null);
const resourceObj = ref(null);
const fileInput = ref(null);
const fileDescription = ref(null);
const fileName = ref(null);
const fileSelected = ref(false);

const fileNameRef = ref(null);
const fileRef = ref(null);

const timestamp = ref(null);
const fileBeingUploaded = ref(false);
const linkBeingUploaded = ref(false);
const subCategBeingRegistered = ref(false);
const categBeingRegistered = ref(false);
const programBeingRegistered = ref(false);

const nodes = ref([]);
const resetAddingViewForm = () => {
  addingProgram.value = false;
  addingCateg.value = false;
  addingSubCateg.value = false;
  addingResource.value = false;
  fileInput.value = null;
  fileSelected.value = false;
};

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

  if (linkBeingUploaded.value) {
    return !fileDescription.value || !fileName.value || !linkUrl.value;
  }
  return false;
});

const onRejected = (rejectedEntries) => {
  alertError(
    'Ficheiro "' +
      rejectedEntries[0].file.name +
      '", com tamanho ' +
      rejectedEntries[0].file.size +
      'Bytes não suportado.'
  );
};

const resourceRequest = (node) => {
  fileBeingUploaded.value = false;
  linkBeingUploaded.value = false;
  subCategBeingRegistered.value = false;
  categBeingRegistered.value = false;
  programBeingRegistered.value = false;
  actualNode.value = node;
  resetAddingViewForm();
  if (node.clickable === 1 && doesUserHavePermissions()) {
    // Algo sera adicionado [Program/Categoria/Subcategoria/Recurso]
    if (node.type === 'resource') {
      // Vamos adicionar recurso
      fileBeingUploaded.value = true;
      categoryLabel.value = 'Sub Categoria';
      popUpTitle.value = 'Adicionar Recurso de EA';
      addingResource.value = true;
      nodeCategory.value =
        node.program + ' -> ' + node.category + ' -> ' + node.subCategory;
    } else if (node.type === 'subCateg') {
      // Vamos adicionar Sub Categoria
      subCategBeingRegistered.value = true;
      categoryLabel.value = 'Categoria';
      popUpTitle.value = 'Adicionar Sub Categoria';
      addingSubCateg.value = true;
      nodeCategory.value = node.program + ' -> ' + node.category;
    } else if (node.type === 'categ') {
      // Vamos adicionar Categoria
      categBeingRegistered.value = true;
      categoryLabel.value = 'Programa';
      popUpTitle.value = 'Adicionar Categoria';
      addingCateg.value = true;
      nodeCategory.value = node.program;
    } else if (node.type === 'program') {
      // Vamos adicionar Programa
      programBeingRegistered.value = true;
      popUpTitle.value = 'Adicionar Programa';
      addingProgram.value = true;
    }
    showAddResource.value = true; // Abrir PopUp
  } else if (node.clickable === 2) {
    // Um recurso sera carregado no backend e baixado no front
    resourceService.loadFile(node.name).then((respStatus) => {
      if (respStatus === 200 || respStatus === 201) {
        alertSucess(
          'Ficheiro descarregado. Verifique no seu directorio de downloads.'
        );
      } else if (respStatus === 404) {
        alertError('O ficheiro que deseja baixar nao foi encontrado.');
      } else {
        alertError('Ocorreu um erro inesperado.');
      }
    });
  } else if (!doesUserHavePermissions()) {
    alertError('Não tem permissoes para adicionar um Recurso de EA.');
  }
};

const handleClickResource = (node) => {
  if (node.isLink) {
    window.open(node.name, '_blank');
  } else {
    resourceRequest(node); // assume que seja um arquivo ou outro tipo
  }
};

const resetFilter = () => {
  filter.value = '';
  filterRef.value.focus();
};

const newFile = ref(null);

const gravar = async (node) => {
  if (tipoRecurso.value === 'FICHEIRO') {
    if (node.type === 'resource') {
      // Adicionar recurso
      const programNode = nodes.value.find(
        (item) => item.label === node.program
      );
      if (!programNode) {
        alertError('Não foi possível localizar o programa para adicionar o recurso.');
        return;
      }
      const categoryNode = programNode.children.find(
        (item) => item.label === node.category
      );
      if (!categoryNode) {
        alertError('Não foi possível localizar a categoria para adicionar o recurso.');
        return;
      }
      const subCategoryNode = categoryNode.children.find(
        (item) => item.label === node.subCategory
      );
      if (!subCategoryNode) {
        alertError('Não foi possível localizar a sub-categoria para adicionar o recurso.');
        return;
      }
      const now = moment();
      timestamp.value = now.format('YYYYMMDDHHmmss');
      let newFileName = `${fileName.value}_${
        timestamp.value
      }.${fileInput.value.name.split('.').pop()}`;
      newFile.value = new File([fileInput.value], newFileName);
      subCategoryNode.children.unshift({
        label: newFileName,
        clickable: 2,
        description: fileDescription.value,
        name: newFileName,
      });
      fileSelected.value = true;
    } else if (node.type === 'subCateg') {
      // Adicionar Sub Categoria
      const programNode = nodes.value.find(
        (item) => item.label === node.program
      );
      if (!programNode) {
        alertError('Não foi possível localizar o programa para adicionar a sub categoria.');
        return;
      }
      const categoryNode = programNode.children.find(
        (item) => item.label === node.category
      );
      if (!categoryNode) {
        alertError('Não foi possível localizar a categoria para adicionar a sub categoria.');
        return;
      }
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
            type: 'resource',
          },
        ],
      });
    } else if (node.type === 'categ') {
      // Adicionar Categoria
      const programNode = nodes.value.find(
        (item) => item.label === node.program
      );
      if (!programNode) {
        alertError('Não foi possível localizar o programa para adicionar a categoria.');
        return;
      }
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
            type: 'subCateg',
          },
        ],
      });
    } else if (node.type === 'program') {
      // Adicionar Programa
      nodes.value.unshift({
        label: programInput.value,
        clickable: 0,
        children: [
          {
            label: 'Adicionar Categoria',
            clickable: 1,
            icon: 'add',
            program: programInput.value,
            type: 'categ',
          },
        ],
      });
    }
    doPatch(nodes);
  } else if (tipoRecurso.value === 'LINK') {
    // Adicionar link
    // ✅ Validação rápida antes de prosseguir
    if (!fileDescription.value || !fileName.value || !linkUrl.value) {
      alertError('Preencha o Nome, Descrição e Link antes de gravar.');
      return;
    }

    const programNode = nodes.value.find((item) => item.label === node.program);
    if (!programNode) {
      alertError('Não foi possível localizar o programa para adicionar o recurso.');
      return;
    }
    const categoryNode = programNode.children.find(
      (item) => item.label === node.category
    );
    if (!categoryNode) {
      alertError('Não foi possível localizar a categoria para adicionar o recurso.');
      return;
    }
    const subCategoryNode = categoryNode.children.find(
      (item) => item.label === node.subCategory
    );
    if (!subCategoryNode) {
      alertError('Não foi possível localizar a sub-categoria para adicionar o recurso.');
      return;
    }
    subCategoryNode.children.unshift({
      label: fileName.value,
      clickable: 2,
      description: fileDescription.value,
      name: linkUrl.value,
      isLink: true, // opcional: para distinguir no render
    });
    doPatchForFile(nodes);
  }
};

const doPatch = (nodes) => {
  const { createDTOFromResource } = useResource();

  resourceObj.value.resource = JSON.stringify(nodes.value);
  let resource = createDTOFromResource(resourceObj.value);

  if (fileSelected.value) {
    fileNameRef.value.validate();
    fileRef.value.validate();

    if (!fileNameRef.value.hasError && !fileRef.value.hasError) {
      let formData = new FormData();
      formData.append('id', resource.id);
      formData.append('uuid', resource.uuid);
      formData.append('resource', resource.resource);
      formData.append('file', newFile.value);
      resourceService.updateResourceTree(formData).then((res) => {
        if (res && (res.status === 200 || res.status === 201)) {
          loadResources();
        } else {
          alertError('Erro ao gravar o recurso. Tente novamente.');
          loadResources();
        }
      });
    }
  } else {
    resourceService.updateResourceTreeWithoutFile(resource).then((res) => {
      if (res && (res.status === 200 || res.status === 201)) {
        loadResources();
      } else {
        alertError('Erro ao gravar as alterações. Tente novamente.');
        loadResources();
      }
    });
  }
};

const doPatchForFile = async (nodes) => {
  const { createDTOFromResource } = useResource();

  resourceObj.value.resource = JSON.stringify(nodes.value);
  let resource = createDTOFromResource(resourceObj.value);

  resourceService.updateResourceTreeWithoutFile(resource).then((res) => {
    if (res && (res.status === 200 || res.status === 201)) {
      alertSucess('Recurso atualizado com sucesso.');
      loadResources();
    } else {
      alertError('Erro ao atualizar o recurso.');
    }
  });
};

const loadResources = () => {
  resourceService.getAll().then(() => {
    resourceObj.value = resourceService.piniaGetAll()[0];
    nodes.value = JSON.parse(resourceObj.value.resource);
  });
};

// Mesma lista de papéis autorizada no backend (ResourceController: create,
// updateresourcetree). Um utilizador pode ter vários papéis (ex: admin
// nacional que também é mentor de uma unidade sanitária) — basta ter um
// papel elevado para ter permissão, mesmo que também tenha um papel restrito.
const RESOURCE_MANAGEMENT_ROLES = [
  'NATIONAL_ADMINISTRATOR',
  'PROVINCIAL_ADMINISTRATOR',
  'DISTRICT_ADMINISTRATOR',
  'NATIONAL_MENTOR',
  'PROVINCIAL_MENTOR',
  'DISTRICT_MENTOR',
];

const doesUserHavePermissions = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const roles = userData.roles;
  if (!roles || roles.length === 0) {
    return false;
  }
  return roles.some((role) => RESOURCE_MANAGEMENT_ROLES.includes(role));
};

onMounted(() => {
  loadResources();
});

//faz watch do tipoRecurso para mudar os valores de fileBeingUploaded e linkBeingUploaded
watch(tipoRecurso, (newValue) => {
  if (newValue === 'FICHEIRO') {
    fileBeingUploaded.value = true;
    linkBeingUploaded.value = false;
  } else if (newValue === 'LINK') {
    fileBeingUploaded.value = false;
    linkBeingUploaded.value = true;
  }
});
</script>

<style scoped lang="scss">
.ea-resources {
  :deep(.add-node-btn) {
    background: rgba(245, 124, 0, 0.12);
    color: #e65100;
    font-weight: 600;
    padding: 2px 12px;
  }

  :deep(.q-tree__node-header) {
    border-radius: 8px;
    transition: background-color 0.15s ease;

    &:hover {
      background: #f5f8fb;
    }
  }
}
</style>
