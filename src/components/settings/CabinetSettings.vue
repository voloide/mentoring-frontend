<!-- src/pages/settings/Cabinet.vue (padrão HealthFacility) -->
<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useCabinetStore } from 'src/stores/cabinet/CabinetStore'
import { useApiErrorHandler } from 'src/composables/shared/error/useApiErrorHandler'
import { useSwal } from 'src/composables/shared/dialog/dialog'

const cabinetStore = useCabinetStore()

const { alertError, alertWarningAction } = useSwal()
const { handleApiError } = useApiErrorHandler()

const nameFilter = ref('')

const cabinets = computed({
  get: () => cabinetStore.currentPageCabinets,
  set: (val: any[]) => {
    cabinetStore.cabinetsPages[cabinetStore.pagination.currentPage] = val as any
    cabinetStore.currentPageCabinets = val as any
  }
})

const columns: any[] = [
  {
    name: 'name',
    label: 'Nome',
    align: 'left',
    field: 'name',
    editType: 'text',
    required: true,
    placeholder: 'Digite o nome do sector',
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

onMounted(async () => {
  if (cabinetStore.currentPageCabinets.length === 0) {
    await cabinetStore.fetchCabinets()
  }
})

const onSearch = async (name: string) => {
  nameFilter.value = name
  pagination.value.page = 1

  await cabinetStore.fetchCabinets({
    page: 0,
    size: pagination.value.rowsPerPage,
    name,
    ignoreCache: true
  })

  pagination.value.rowsNumber = cabinetStore.pagination.totalSize
}

watch(
  () => [pagination.value.page, pagination.value.rowsPerPage],
  async ([page, size]) => {
    await cabinetStore.fetchCabinets({
      page: page - 1,
      size,
      name: nameFilter.value,
      ignoreCache: false
    })
    pagination.value.rowsNumber = cabinetStore.pagination.totalSize
  },
  { immediate: true }
)

watch(
  () => cabinetStore.pagination.totalSize,
  (total) => {
    pagination.value.rowsNumber = total
  }
)

const saveCabinetHandler = async (rowData: any) => {
  try {
    const payload: any = { ...rowData }
    delete payload._backup
    delete payload._isNew
    return await cabinetStore.saveCabinet(payload)
  } catch (err: any) {
    handleApiError(err, 'Erro ao salvar sector')
    throw err
  }
}

const deleteCabinetHandler = async (uuid: string) => {
  try {
    await cabinetStore.deleteCabinet(uuid)
  } catch (err: any) {
    handleApiError(err, 'Erro ao apagar sector')
    throw err
  }
}

const toggleStatusHandler = async (row: any) => {
  try {
    const novoStatus = row.lifeCycleStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const confirm = await alertWarningAction(
      `Deseja realmente ${novoStatus === 'ACTIVE' ? 'ativar' : 'desativar'} este sector?`
    )
    if (!confirm) return

    const updated = await cabinetStore.updateCabinetLifeCycleStatus(row.uuid, novoStatus)
    row.lifeCycleStatus = updated.lifeCycleStatus
  } catch (err: any) {
    handleApiError(err, 'Erro ao atualizar estado do sector')
  }
}
</script>

<template>
  <EditableTable
    v-model="cabinets"
    title="Sectores"
    :columns="columns"
    :loading="cabinetStore.loading"
    v-model:pagination="pagination"
    :rows-per-page-options="[10, 20, 50, 100]"
    :confirm-error="alertError"
    :confirm-delete="alertWarningAction"
    @save="(row, { resolve, reject }) => saveCabinetHandler(row).then(resolve).catch(reject)"
    @delete="(row, { resolve, reject }) => deleteCabinetHandler(row.uuid).then(resolve).catch(reject)"
    @search="onSearch"
    @toggle-status="toggleStatusHandler"
  />
</template>