<!-- src/pages/settings/Partner.vue (padrão HealthFacility) -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePartnerStore } from 'src/stores/partner/PartnerStore'
import { useApiErrorHandler } from 'src/composables/shared/error/useApiErrorHandler'
import { useSwal } from 'src/composables/shared/dialog/dialog'

const partnerStore = usePartnerStore()

const { alertError, alertWarningAction } = useSwal()
const { handleApiError } = useApiErrorHandler()

const nameFilter = ref('')

const partners = computed({
  get: () => partnerStore.currentPagePartners,
  set: (val: any[]) => {
    partnerStore.partnersPages[partnerStore.pagination.currentPage] = val as any
    partnerStore.currentPagePartners = val as any
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
    style: 'width: 35%'
  },
  {
    name: 'description',
    label: 'Descrição',
    align: 'left',
    field: 'description',
    editType: 'text',
    required: true,
    placeholder: 'Digite a descrição',
    style: 'width: 55%'
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


const onSearch = async (name: string) => {
  nameFilter.value = name
  pagination.value.page = 1

  await partnerStore.fetchPartners({
    page: 0,
    size: pagination.value.rowsPerPage,
    name,
    ignoreCache: true
  })

  pagination.value.rowsNumber = partnerStore.pagination.totalSize
}

watch(
  () => [pagination.value.page, pagination.value.rowsPerPage],
  async ([page, size]) => {
    await partnerStore.fetchPartners({
      page: page - 1,
      size,
      name: nameFilter.value,
      ignoreCache: false
    })
    pagination.value.rowsNumber = partnerStore.pagination.totalSize
  },
  { immediate: true }
)

watch(
  () => partnerStore.pagination.totalSize,
  (total) => {
    pagination.value.rowsNumber = total
  }
)

const onTableRequest = (req: any) => {
  pagination.value.page = req.pagination.page
  pagination.value.rowsPerPage = req.pagination.rowsPerPage
}

const savePartnerHandler = async (rowData: any) => {
  try {
    const payload: any = { ...rowData }
    delete payload._backup
    delete payload._isNew
    delete payload.undefined
    return await partnerStore.savePartner(payload)
  } catch (err: any) {
    handleApiError(err, 'Erro ao salvar parceiro')
    throw err
  }
}

const deletePartnerHandler = async (uuid: string) => {
  try {
    await partnerStore.deletePartner(uuid)
  } catch (err: any) {
    handleApiError(err, 'Erro ao apagar parceiro')
    throw err
  }
}

const toggleStatusHandler = async (row: any) => {
  try {
    const novoStatus = row.lifeCycleStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const confirm = await alertWarningAction(
      `Deseja realmente ${novoStatus === 'ACTIVE' ? 'ativar' : 'desativar'} este parceiro?`
    )
    if (!confirm) return

    const updated = await partnerStore.updatePartnerLifeCycleStatus(row.uuid, novoStatus)
    row.lifeCycleStatus = updated.lifeCycleStatus
  } catch (err: any) {
    handleApiError(err, 'Erro ao atualizar estado do parceiro')
  }
}
</script>

<template>
  <EditableTable
    v-model="partners"
    title="Instituições"
    :columns="columns"
    :loading="partnerStore.loading"
    v-model:pagination="pagination"
    :rows-per-page-options="[10, 20, 50, 100]"
    :confirm-error="alertError"
    :confirm-delete="alertWarningAction"
    @save="(row, { resolve, reject }) => savePartnerHandler(row).then(resolve).catch(reject)"
    @delete="(row, { resolve, reject }) => deletePartnerHandler(row.uuid).then(resolve).catch(reject)"
    @search="onSearch"
    @toggle-status="toggleStatusHandler"
    @request="onTableRequest"
  />
</template>