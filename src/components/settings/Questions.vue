<!-- src/pages/settings/Questions.vue (padrão HealthFacility + selectOptions) -->
<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useQuestionStore } from 'src/stores/question/QuestionStore'
import { useProgramStore } from 'src/stores/program/ProgramStore'
import { useSwal } from 'src/composables/shared/dialog/dialog'
import { useApiErrorHandler } from 'src/composables/shared/error/useApiErrorHandler'
import { Program } from 'src/entities/program/Program'

const questionStore = useQuestionStore()
const programStore = useProgramStore()

const { alertError, alertWarningAction } = useSwal()
const { handleApiError } = useApiErrorHandler()

const nameFilter = ref('')

const programOptions = computed(() =>
  programStore.currentPagePrograms
    .filter((p: any) => p.lifeCycleStatus === 'ACTIVE')
    .map((p: any) => ({ label: p.name, value: p.id }))
)

const selectOptions = computed(() => ({
  programOptions: programOptions.value
}))

const programLabelById = (id: number | null | undefined) => {
  if (!id) return '—'
  const opt = programOptions.value.find((o: any) => o.value === id)
  return opt?.label ?? String(id)
}

const questions = computed({
  get: () => {
    return questionStore.currentPageQuestions.map((q: any) => {
      const programObj = q.program ?? q.programDTO ?? null
      return {
        ...q,
        programId: q.programId ?? programObj?.id ?? null
      }
    })
  },
  set: (val: any[]) => {
    questionStore.questionsPages[questionStore.pagination.currentPage] = val as any
    questionStore.currentPageQuestions = val as any
  }
})

const columns: any[] = [
  {
    name: 'tableCode',
    label: 'Código',
    align: 'left',
    field: 'tableCode',
    editType: 'text',
    required: true,
    placeholder: 'Código',
    style: 'width: 70px;'
  },
  {
    name: 'question',
    label: 'Competência',
    align: 'left',
    field: 'question',
    editType: 'text',
    required: true,
    placeholder: 'Digite a competência',
    style: 'width: 70%; white-space: normal; word-break: break-word;'
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
  { name: 'actions', label: 'Ações', align: 'center', style: 'width: 120px;' }
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

  if (questionStore.currentPageQuestions.length === 0) {
    await questionStore.fetchQuestions()
  }
})

const onSearch = async (name: string) => {
  nameFilter.value = name
  pagination.value.page = 1

  await questionStore.fetchQuestions({
    page: 0,
    size: pagination.value.rowsPerPage,
    name,
    ignoreCache: true
  })

  pagination.value.rowsNumber = questionStore.pagination.totalSize
}

watch(
  () => [pagination.value.page, pagination.value.rowsPerPage],
  async ([page, size]) => {
    await questionStore.fetchQuestions({
      page: page - 1,
      size,
      name: nameFilter.value,
      ignoreCache: false
    })
    pagination.value.rowsNumber = questionStore.pagination.totalSize
  },
  { immediate: true }
)

watch(
  () => questionStore.pagination.totalSize,
  (total) => {
    pagination.value.rowsNumber = total
  }
)

const saveQuestionHandler = async (rowData: any) => {
  try {
    const selectedProgram = programStore.currentPagePrograms.find((p: any) => p.id === rowData.programId)
    if (!selectedProgram) throw new Error(`Programa com ID ${rowData.programId} não encontrado.`)

    const payload: any = {
      ...rowData,
      program: new Program({ id: selectedProgram.id, uuid: selectedProgram.uuid })
    }

    delete payload._backup
    delete payload._isNew
    delete payload.programDTO

    const saved = await questionStore.saveQuestion(payload)

    // manter UI
    ;(saved as any).program = selectedProgram
    ;(saved as any).programId = selectedProgram.id

    return saved
  } catch (err: any) {
    handleApiError(err, 'Erro ao salvar competência')
    throw err
  }
}

const deleteQuestionHandler = async (uuid: string) => {
  try {
    await questionStore.deleteQuestion(uuid)
  } catch (err: any) {
    handleApiError(err, 'Erro ao apagar competência')
    throw err
  }
}

const toggleStatusHandler = async (row: any) => {
  try {
    const novoStatus = row.lifeCycleStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const confirm = await alertWarningAction(
      `Deseja realmente ${novoStatus === 'ACTIVE' ? 'ativar' : 'desativar'} esta competência?`
    )
    if (!confirm) return

    const updated = await questionStore.updateQuestionLifeCycleStatus(row.uuid, novoStatus)
    row.lifeCycleStatus = updated.lifeCycleStatus
  } catch (err: any) {
    handleApiError(err, 'Erro ao atualizar estado da competência')
  }
}
</script>

<template>
  <EditableTable
    v-model="questions"
    title="Competências"
    :columns="columns"
    :loading="questionStore.loading"
    v-model:pagination="pagination"
    :rows-per-page-options="[10, 20, 50, 100]"
    :select-options="selectOptions"
    :confirm-error="alertError"
    :confirm-delete="alertWarningAction"
    @save="(row, { resolve, reject }) => saveQuestionHandler(row).then(resolve).catch(reject)"
    @delete="(row, { resolve, reject }) => deleteQuestionHandler(row.uuid).then(resolve).catch(reject)"
    @search="onSearch"
    @toggle-status="toggleStatusHandler"
  />
</template>