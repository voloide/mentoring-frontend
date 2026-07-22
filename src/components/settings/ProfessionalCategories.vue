<!-- src/pages/settings/ProfessionalCategory.vue (padrão HealthFacility) -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useProfessionalCategoryStore } from 'src/stores/professionalCategory/ProfessionalCategoryStore'
import { useApiErrorHandler } from 'src/composables/shared/error/useApiErrorHandler'
import { useSwal } from 'src/composables/shared/dialog/dialog'

const categoryStore = useProfessionalCategoryStore()

const { alertError, alertWarningAction } = useSwal()
const { handleApiError } = useApiErrorHandler()

const nameFilter = ref('')

const categories = computed({
  get: () => categoryStore.currentPageCategories,
  set: (val: any[]) => {
    categoryStore.categoriesPages[categoryStore.pagination.currentPage] = val as any
    categoryStore.currentPageCategories = val as any
  }
})

const columns: any[] = [
  {
    name: 'description',
    label: 'Descrição',
    align: 'left',
    field: 'description',
    editType: 'text',
    required: true,
    placeholder: 'Digite a descrição',
    style: 'width: 70%; white-space: normal; word-break: break-word;'
  },
  { name: 'actions', label: 'Acções', align: 'center', style: 'width: 120px;' }
]

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})


const onSearch = async (name: string) => {
  nameFilter.value = name
  pagination.value.page = 1

  await categoryStore.fetchCategories({
    page: 0,
    size: pagination.value.rowsPerPage,
    name,
    ignoreCache: true
  })

  pagination.value.rowsNumber = categoryStore.pagination.totalSize
}

watch(
  () => [pagination.value.page, pagination.value.rowsPerPage],
  async ([page, size]) => {
    await categoryStore.fetchCategories({
      page: page - 1,
      size,
      name: nameFilter.value,
      ignoreCache: false
    })
    pagination.value.rowsNumber = categoryStore.pagination.totalSize
  },
  { immediate: true }
)

watch(
  () => categoryStore.pagination.totalSize,
  (total) => {
    pagination.value.rowsNumber = total
  }
)

const onTableRequest = (req: any) => {
  pagination.value.page = req.pagination.page
  pagination.value.rowsPerPage = req.pagination.rowsPerPage
}

const saveCategoryHandler = async (rowData: any) => {
  try {
    const payload: any = { ...rowData }
    delete payload._backup
    delete payload._isNew
    delete payload.undefined
    return await categoryStore.saveCategory(payload)
  } catch (err: any) {
    handleApiError(err, 'Erro ao salvar categoria profissional')
    throw err
  }
}

const deleteCategoryHandler = async (uuid: string) => {
  try {
    await categoryStore.deleteCategory(uuid)
  } catch (err: any) {
    handleApiError(err, 'Erro ao apagar categoria profissional')
    throw err
  }
}

const toggleStatusHandler = async (row: any) => {
  try {
    const novoStatus = row.lifeCycleStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const confirm = await alertWarningAction(
      `Deseja realmente ${novoStatus === 'ACTIVE' ? 'ativar' : 'desativar'} esta categoria profissional?`
    )
    if (!confirm) return

    const updated = await categoryStore.updateCategoryLifeCycleStatus(row.uuid, novoStatus)
    row.lifeCycleStatus = updated.lifeCycleStatus
  } catch (err: any) {
    handleApiError(err, 'Erro ao atualizar estado da categoria profissional')
  }
}
</script>

<template>
  <EditableTable
    v-model="categories"
    title="Categorias Profissionais"
    :columns="columns"
    :loading="categoryStore.loading"
    v-model:pagination="pagination"
    :rows-per-page-options="[10, 20, 50, 100]"
    :confirm-error="alertError"
    :confirm-delete="alertWarningAction"
    @save="(row, { resolve, reject }) => saveCategoryHandler(row).then(resolve).catch(reject)"
    @delete="(row, { resolve, reject }) => deleteCategoryHandler(row.uuid).then(resolve).catch(reject)"
    @search="onSearch"
    @toggle-status="toggleStatusHandler"
    @request="onTableRequest"
  />
</template>