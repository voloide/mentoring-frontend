<!-- src/pages/settings/Program.vue (padrão HealthFacility) -->
<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useProgramStore } from 'src/stores/program/ProgramStore'
import { useApiErrorHandler } from 'src/composables/shared/error/useApiErrorHandler'
import { useSwal } from 'src/composables/shared/dialog/dialog'

const programStore = useProgramStore()

const { alertError, alertWarningAction } = useSwal()
const { handleApiError } = useApiErrorHandler()

const nameFilter = ref('')

const programs = computed({
  get: () => programStore.currentPagePrograms,
  set: (val: any[]) => {
    programStore.programsPages[programStore.pagination.currentPage] = val as any
    programStore.currentPagePrograms = val as any
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
    placeholder: 'Digite o nome',
    style: 'width: 30%; white-space: normal; word-break: break-word;'
  },
  {
    name: 'description',
    label: 'Descrição',
    align: 'left',
    field: 'description',
    editType: 'text',
    required: true,
    placeholder: 'Digite a descrição',
    style: 'width: 50%; white-space: normal; word-break: break-word;'
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
  if (programStore.currentPagePrograms.length === 0) {
    await programStore.fetchPrograms()
  }
})

const onSearch = async (name: string) => {
  nameFilter.value = name
  pagination.value.page = 1

  await programStore.fetchPrograms({
    page: 0,
    size: pagination.value.rowsPerPage,
    name,
    ignoreCache: true
  })

  pagination.value.rowsNumber = programStore.pagination.totalSize
}

watch(
  () => [pagination.value.page, pagination.value.rowsPerPage],
  async ([page, size]) => {
    await programStore.fetchPrograms({
      page: page - 1,
      size,
      name: nameFilter.value,
      ignoreCache: false
    })
    pagination.value.rowsNumber = programStore.pagination.totalSize
  },
  { immediate: true }
)

watch(
  () => programStore.pagination.totalSize,
  (total) => {
    pagination.value.rowsNumber = total
  }
)

const saveProgramHandler = async (rowData: any) => {
  try {
    const payload: any = { ...rowData }
    delete payload._backup
    delete payload._isNew
    return await programStore.saveProgram(payload)
  } catch (err: any) {
    handleApiError(err, 'Erro ao salvar programa')
    throw err
  }
}

const deleteProgramHandler = async (uuid: string) => {
  try {
    await programStore.deleteProgram(uuid)
  } catch (err: any) {
    handleApiError(err, 'Erro ao apagar programa')
    throw err
  }
}

const toggleStatusHandler = async (row: any) => {
  try {
    const novoStatus = row.lifeCycleStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const confirm = await alertWarningAction(
      `Deseja realmente ${novoStatus === 'ACTIVE' ? 'ativar' : 'desativar'} este programa?`
    )
    if (!confirm) return

    const updated = await programStore.updateProgramLifeCycleStatus(row.uuid, novoStatus)
    row.lifeCycleStatus = updated.lifeCycleStatus
  } catch (err: any) {
    handleApiError(err, 'Erro ao atualizar estado do programa')
  }
}
</script>

<template>
  <EditableTable
    v-model="programs"
    title="Programas"
    :columns="columns"
    :loading="programStore.loading"
    v-model:pagination="pagination"
    :rows-per-page-options="[10, 20, 50, 100]"
    :confirm-error="alertError"
    :confirm-delete="alertWarningAction"
    @save="(row, { resolve, reject }) => saveProgramHandler(row).then(resolve).catch(reject)"
    @delete="(row, { resolve, reject }) => deleteProgramHandler(row.uuid).then(resolve).catch(reject)"
    @search="onSearch"
    @toggle-status="toggleStatusHandler"
  />
</template>