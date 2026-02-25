<!-- src/pages/settings/ProgrammaticArea.vue (padrão HealthFacility + selectOptions) -->
<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useProgrammaticAreaStore } from 'src/stores/programaticArea/ProgrammaticAreaStore'
import { useProgramStore } from 'src/stores/program/ProgramStore'
import { useApiErrorHandler } from 'src/composables/shared/error/useApiErrorHandler'
import { useSwal } from 'src/composables/shared/dialog/dialog'
import { Program } from 'src/entities/program/Program'

const areaStore = useProgrammaticAreaStore()
const programStore = useProgramStore()

const { alertError, alertWarningAction } = useSwal()
const { handleApiError } = useApiErrorHandler()

const nameFilter = ref('')

/**
 * v-model do EditableTable
 */
const areas = computed({
  get: () => {
    return areaStore.currentPageAreas.map((a: any) => {
      const programObj = a.program ?? a.programDTO ?? null

      return {
        ...a,
        programId: a.programId ?? programObj?.id ?? null,
        programName: programObj?.name ?? programObj?.designation ?? '' // depende do teu DTO
      }
    })
  },
  set: (val: any[]) => {
    areaStore.areasPages[areaStore.pagination.currentPage] = val as any
    areaStore.currentPageAreas = val as any
  }
})

const programOptions = computed(() => {
  return programStore.currentPagePrograms
    .filter((p: any) => p.lifeCycleStatus === 'ACTIVE')
    .map((p: any) => ({ label: p.name, value: p.id }))
})

const selectOptions = computed(() => ({
  programOptions: programOptions.value
}))

const programLabelById = (id: number | null | undefined) => {
  if (!id) return '—'
  const opt = programOptions.value.find((o: any) => o.value === id)
  return opt?.label ?? String(id)
}

const columns: any[] = [
  {
    name: 'name',
    label: 'Nome',
    align: 'left',
    field: 'name',
    editType: 'text',
    required: true,
    placeholder: 'Digite o nome',
    style: 'width: 60%; white-space: normal; word-break: break-word;'
  },
  {
    name: 'programId',
    label: 'Programa',
    align: 'left',
    field: (row: any) => programLabelById(row.programId),
    editType: 'select',
    editOptionsKey: 'programOptions',
    editValueField: 'programId',
    optionLabelKey: 'label',
    optionValueKey: 'value',
    required: true,
    placeholder: 'Selecione o programa'
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
    await programStore.fetchPrograms({ page: 0, size: 100 })
  }

  if (areaStore.currentPageAreas.length === 0) {
    await areaStore.fetchAreas()
  }
})

const onSearch = async (name: string) => {
  nameFilter.value = name
  pagination.value.page = 1

  await areaStore.fetchAreas({
    page: 0,
    size: pagination.value.rowsPerPage,
    name,
    ignoreCache: true
  })

  pagination.value.rowsNumber = areaStore.pagination.totalSize
}

watch(
  () => [pagination.value.page, pagination.value.rowsPerPage],
  async ([page, size]) => {
    await areaStore.fetchAreas({
      page: page - 1,
      size,
      name: nameFilter.value,
      ignoreCache: false
    })
    pagination.value.rowsNumber = areaStore.pagination.totalSize
  },
  { immediate: true }
)

watch(
  () => areaStore.pagination.totalSize,
  (total) => {
    pagination.value.rowsNumber = total
  }
)

const saveAreaHandler = async (rowData: any) => {
  try {
    const selectedProgram = programStore.currentPagePrograms.find((p: any) => p.id === rowData.programId)
    if (!selectedProgram) throw new Error(`Programa com ID ${rowData.programId} não encontrado.`)

    const payloadToSave: any = {
      ...rowData,
      program: new Program({ id: selectedProgram.id, uuid: selectedProgram.uuid })
    }

    delete payloadToSave._backup
    delete payloadToSave._isNew
    delete payloadToSave.undefined
    delete payloadToSave.programName

    const saved = await areaStore.saveArea(payloadToSave)

    // manter UI
    ;(saved as any).program = selectedProgram
    ;(saved as any).programId = selectedProgram.id

    return saved
  } catch (err: any) {
    handleApiError(err, 'Erro ao salvar área programática')
    throw err
  }
}

const deleteAreaHandler = async (uuid: string) => {
  try {
    await areaStore.deleteArea(uuid)
  } catch (err: any) {
    handleApiError(err, 'Erro ao apagar área programática')
    throw err
  }
}

const toggleStatusHandler = async (row: any) => {
  try {
    const novoStatus = row.lifeCycleStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const confirm = await alertWarningAction(
      `Deseja realmente ${novoStatus === 'ACTIVE' ? 'ativar' : 'desativar'} esta área programática?`
    )
    if (!confirm) return

    const updated = await areaStore.updateAreaLifeCycleStatus(row.uuid, novoStatus)
    row.lifeCycleStatus = updated.lifeCycleStatus
  } catch (err: any) {
    handleApiError(err, 'Erro ao atualizar estado da área programática')
  }
}
</script>

<template>
  <EditableTable
    v-model="areas"
    title="Áreas de Mentoria"
    :columns="columns"
    :loading="areaStore.loading"
    v-model:pagination="pagination"
    :rows-per-page-options="[10, 20, 50, 100]"
    :select-options="selectOptions"
    :confirm-error="alertError"
    :confirm-delete="alertWarningAction"
    @save="(row, { resolve, reject }) => saveAreaHandler(row).then(resolve).catch(reject)"
    @delete="(row, { resolve, reject }) => deleteAreaHandler(row.uuid).then(resolve).catch(reject)"
    @search="onSearch"
    @toggle-status="toggleStatusHandler"
  />
</template>