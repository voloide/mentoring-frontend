<!-- src/pages/settings/HealthFacility.vue -->
<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'

import { useHealthFacilityStore } from 'src/stores/healthFacility/HealthFacilityStore'
import { useProvinceStore } from 'src/stores/province/ProvinceStore'
import { useDistrictStore } from 'src/stores/district/DistrictStore'
import { usePartnerStore } from 'src/stores/partner/PartnerStore'

import { useApiErrorHandler } from 'src/composables/shared/error/useApiErrorHandler'
import { useSwal } from 'src/composables/shared/dialog/dialog'

const healthFacilityStore = useHealthFacilityStore()
const provinceStore = useProvinceStore()
const districtStore = useDistrictStore()
const partnerStore = usePartnerStore()

const { handleApiError } = useApiErrorHandler()
const { alertWarningAction, alertError } = useSwal()

const nameFilter = ref('')

/**
 * v-model do EditableTable:
 * - getter expõe provinceId/districtId e labels
 * - setter reconstrói district e aplica regra dos partners
 */
const healthFacilities = computed({
  get: () => {
    return healthFacilityStore.currentPageHealthFacilities.map((hf: any) => {
      const districtObj = hf.district ?? hf.districtDTO ?? null
      const provinceObj = districtObj?.province ?? districtObj?.provinceDTO ?? null

      return {
        ...hf,
        provinceId: provinceObj?.id ?? null,
        districtId: districtObj?.id ?? null,
        provinceName: provinceObj?.designation ?? '',
        districtName: districtObj?.description ?? '',
        clinicalPartnerId: hf.clinicalPartnerId ?? null,
        otherPartnerIds: Array.isArray(hf.otherPartnerIds) ? hf.otherPartnerIds : []
      }
    })
  },
  set: (val: any[]) => {
    val.forEach((v: any) => {
      const district = districtStore.getAllDistrictsAcrossPages().find((d: any) => d.id === v.districtId)
      v.district = district ?? null

      // ✅ regra: outros parceiros não pode conter o parceiro clínico
      if (v.clinicalPartnerId && Array.isArray(v.otherPartnerIds)) {
        v.otherPartnerIds = v.otherPartnerIds.filter((id: number) => id !== v.clinicalPartnerId)
      }
    })

    healthFacilityStore.healthFacilityPages[healthFacilityStore.pagination.currentPage] = val as any
    healthFacilityStore.currentPageHealthFacilities = val as any
  }
})

const provinceOptions = computed(() => {
  return provinceStore.currentPageProvinces
    .filter((p: any) => p.lifeCycleStatus === 'ACTIVE')
    .map((p: any) => ({ label: p.designation, value: p.id }))
})

/**
 * Distrito depende de província:
 * - o EditableTable vai filtrar via dependsOn/matchField
 */
const districtOptions = computed(() => {
  return districtStore.getAllDistrictsAcrossPages().map((d: any) => ({
    label: d.description,
    value: d.id,
    provinceId: d.province?.id ?? d.provinceDTO?.id ?? null
  }))
})

const partnerOptions = computed(() => {
  const all = partnerStore.getAllPartnersAcrossPages?.()?.length
    ? partnerStore.getAllPartnersAcrossPages()
    : (partnerStore.currentPagePartners ?? [])

  return all
    .filter((p: any) => p.lifeCycleStatus === 'ACTIVE')
    .map((p: any) => ({ label: p.name, value: p.id }))
})

const selectOptions = computed(() => ({
  provinceOptions: provinceOptions.value,
  districtOptions: districtOptions.value,
  partnerOptions: partnerOptions.value
}))

const partnerLabelById = (id: number | null | undefined) => {
  if (!id) return '—'
  const opt = partnerOptions.value.find((p: any) => p.value === id)
  return opt?.label ?? String(id)
}

const partnerLabelsByIds = (ids: any) => {
  if (!Array.isArray(ids) || ids.length === 0) return '—'
  return ids.map((id: number) => partnerLabelById(id)).join(', ')
}

/**
 * ✅ options de "Outros Parceiros" excluindo o Parceiro Clínico selecionado
 * (evita o user selecionar o mesmo id nos dois campos)
 */
const otherPartnersOptions = (row: any) => {
  const clinicalId = row?.clinicalPartnerId ?? null
  if (!clinicalId) return partnerOptions.value
  return partnerOptions.value.filter((p: any) => p.value !== clinicalId)
}

const columns: any[] = [
  {
    name: 'healthFacility',
    label: 'Nome da Unidade Sanitária',
    align: 'left',
    field: 'healthFacility',
    editType: 'text',
    required: true,
    placeholder: 'Digite o nome da unidade sanitária'
  },
  {
    name: 'provinceId',
    label: 'Província',
    align: 'left',
    field: 'provinceName',
    editType: 'select',
    editOptionsKey: 'provinceOptions',
    editValueField: 'provinceId',
    optionLabelKey: 'label',
    optionValueKey: 'value',
    required: true,
    placeholder: 'Selecione a província'
  },
  {
    name: 'districtId',
    label: 'Distrito',
    align: 'left',
    field: 'districtName',
    editType: 'select',
    editOptionsKey: 'districtOptions',
    editValueField: 'districtId',
    optionLabelKey: 'label',
    optionValueKey: 'value',
    required: true,
    placeholder: 'Selecione o distrito',
    dependsOn: 'provinceId',
    matchField: 'provinceId'
  },

  // ✅ Parceiro Clínico (single)
  {
    name: 'clinicalPartnerId',
    label: 'Parceiro Clínico',
    align: 'left',
    field: (row: any) => partnerLabelById(row.clinicalPartnerId),
    editType: 'select',
    editOptionsKey: 'partnerOptions',
    editValueField: 'clinicalPartnerId',
    optionLabelKey: 'label',
    optionValueKey: 'value',
    placeholder: 'Selecione o parceiro clínico'
  },

  // ✅ Outros Parceiros (multi)
  {
    name: 'otherPartnerIds',
    label: 'Outros Parceiros',
    align: 'left',
    field: (row: any) => partnerLabelsByIds(row.otherPartnerIds),
    editType: 'select',
    editOptions: ({ row }: any) => otherPartnersOptions(row), // ✅ filtra excluindo clínico
    editValueField: 'otherPartnerIds',
    optionLabelKey: 'label',
    optionValueKey: 'value',
    multiple: true,
    placeholder: 'Selecione outros parceiros',

    // ✅ quando trocar clínico, remove se existir no array
    resetOnChangeOf: 'clinicalPartnerId',
    onReset: ({ row }: any) => {
      if (row?.clinicalPartnerId && Array.isArray(row.otherPartnerIds)) {
        row.otherPartnerIds = row.otherPartnerIds.filter((id: number) => id !== row.clinicalPartnerId)
      }
    }
  },

  { name: 'actions', label: 'Opções', align: 'center' }
]

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0
})

onMounted(async () => {
  if (healthFacilityStore.currentPageHealthFacilities.length === 0) {
    await healthFacilityStore.fetchHealthFacilities()
  }

  if (provinceStore.currentPageProvinces.length === 0) {
    await provinceStore.fetchProvinces({ page: 0, size: 100 })
  }

  if (districtStore.getAllDistrictsAcrossPages().length === 0) {
    await districtStore.fetchDistricts({ page: 0, size: 200 })
  }

  if (
    (partnerStore.getAllPartnersAcrossPages?.() || []).length === 0 &&
    (partnerStore.currentPagePartners || []).length === 0
  ) {
    await partnerStore.fetchPartners({ page: 0, size: 200 })
  }
})

const onSearch = async (name: string) => {
  nameFilter.value = name
  pagination.value.page = 1

  await healthFacilityStore.fetchHealthFacilities({
    page: 0,
    size: pagination.value.rowsPerPage,
    name,
    ignoreCache: true
  })

  pagination.value.rowsNumber = healthFacilityStore.pagination.totalSize
}

watch(
  () => [pagination.value.page, pagination.value.rowsPerPage],
  async ([page, size]) => {
    await healthFacilityStore.fetchHealthFacilities({
      page: page - 1,
      size,
      name: nameFilter.value,
      ignoreCache: false
    })
    pagination.value.rowsNumber = healthFacilityStore.pagination.totalSize
  },
  { immediate: true }
)

watch(
  () => healthFacilityStore.pagination.totalSize,
  (total) => {
    pagination.value.rowsNumber = total
  }
)

const saveHealthFacilityHandler = async (rowData: any) => {
  try {
    const selectedDistrict = districtStore
      .getAllDistrictsAcrossPages()
      .find((d: any) => d.id === rowData.districtId)
    if (!selectedDistrict) throw new Error(`Distrito com ID ${rowData.districtId} não encontrado.`)

    const payloadToSave: any = {
      ...rowData,

      // backend espera district dentro do DTO (no teu padrão)
      district: selectedDistrict,
      districtDTO: selectedDistrict?.toDTO ? selectedDistrict.toDTO() : selectedDistrict,

      // garantir arrays
      otherPartnerIds: Array.isArray(rowData.otherPartnerIds) ? rowData.otherPartnerIds : []
    }

    // ✅ regra final: outros parceiros não pode conter o clínico
    if (payloadToSave.clinicalPartnerId) {
      payloadToSave.otherPartnerIds = payloadToSave.otherPartnerIds.filter(
        (id: number) => id !== payloadToSave.clinicalPartnerId
      )
    }

    delete payloadToSave._backup
    delete payloadToSave._isNew
    delete payloadToSave.provinceName
    delete payloadToSave.districtName
    delete payloadToSave.provinceId
    delete payloadToSave.districtId

    const saved = await healthFacilityStore.saveHealthFacility(payloadToSave)

    // manter labels/UI após salvar
    ;(saved as any).district = selectedDistrict

    return saved
  } catch (err: any) {
    handleApiError(err, 'Erro ao salvar unidade sanitária')
    throw err
  }
}

const deleteHealthFacilityHandler = async (uuid: string) => {
  try {
    await healthFacilityStore.deleteHealthFacility(uuid)
  } catch (err: any) {
    handleApiError(err, 'Erro ao apagar unidade sanitária')
    throw err
  }
}

const toggleStatusHandler = async (row: any) => {
  try {
    const novoStatus = row.lifeCycleStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const confirm = await alertWarningAction(
      `Deseja realmente ${novoStatus === 'ACTIVE' ? 'ativar' : 'desativar'} esta unidade sanitária?`
    )
    if (!confirm) return

    const updated = await healthFacilityStore.updateHealthFacilityLifeCycleStatus(row.uuid, novoStatus)
    row.lifeCycleStatus = updated.lifeCycleStatus
  } catch (err: any) {
    handleApiError(err, 'Erro ao atualizar status da unidade sanitária')
  }
}
</script>

<template>
  <EditableTable
    v-model="healthFacilities"
    title="Unidades Sanitárias"
    :columns="columns"
    :loading="healthFacilityStore.loading"
    v-model:pagination="pagination"
    :rows-per-page-options="[10, 20, 50, 100]"
    :select-options="selectOptions"
    :confirm-error="alertError"
    :confirm-delete="alertWarningAction"
    @save="(row, { resolve, reject }) => saveHealthFacilityHandler(row).then(resolve).catch(reject)"
    @delete="(row, { resolve, reject }) => deleteHealthFacilityHandler(row.uuid).then(resolve).catch(reject)"
    @search="onSearch"
    @toggle-status="toggleStatusHandler"
  />
</template>