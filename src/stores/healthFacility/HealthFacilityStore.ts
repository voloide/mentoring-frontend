import { defineStore } from 'pinia'
import healthFacilityService from 'src/services/healthFacility/healthFacilityService'
import { HealthFacility } from 'src/entities/healthFacility/HealthFacility'
import { replaceOrInsert } from 'src/utils/storeUtils'
import { paginateArray, flattenPages } from 'src/utils/paginationUtils'

export const useHealthFacilityStore = defineStore('healthFacility', {
  state: () => ({
    // chave = `${page}:${size}` (ver PartnerStore para o porquê)
    healthFacilityPages: {} as Record<string, HealthFacility[]>,
    currentPageHealthFacilities: [] as HealthFacility[],
    currentHealthFacility: null as HealthFacility | null,
    loading: false,
    error: null as string | null,
    pagination: {
      totalSize: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 10
    }
  }),

  actions: {
    async fetchHealthFacilities(params: any = {}) {
      const name = params.name ?? ''
      const ignoreCache = params.ignoreCache ?? false
      const isSearch = name.trim() !== ''
      const usePagination = params.page !== undefined || params.size !== undefined
      const useCache = !ignoreCache && !isSearch && usePagination

      const defaultSize = this.pagination.pageSize
      const page = params.page ?? 0
      const size = params.size ?? defaultSize
      const cacheKey = `${page}:${size}`

      if (useCache && this.healthFacilityPages[cacheKey]) {
        this.currentPageHealthFacilities = this.healthFacilityPages[cacheKey]
        this.pagination.currentPage = page
        this.pagination.pageSize = size
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await healthFacilityService.getAll({ ...params })
        const facilities = (response.content ?? []).map((dto: any) =>
          HealthFacility.fromDTO(dto)
        )

        if (!usePagination) {
          const paged = paginateArray(facilities, defaultSize)
          this.healthFacilityPages = {}
          for (const p in paged) {
            this.healthFacilityPages[`${p}:${defaultSize}`] = paged[p]
          }
          this.currentPageHealthFacilities = paged[0] ?? []
          this.pagination = {
            totalSize: facilities.length,
            totalPages: Object.keys(paged).length,
            currentPage: 0,
            pageSize: defaultSize
          }
        } else {
          this.healthFacilityPages[cacheKey] = facilities
          this.currentPageHealthFacilities = facilities
          this.pagination = {
            totalSize: response.total,
            totalPages: Math.ceil(response.total / size),
            currentPage: response.page,
            pageSize: response.size
          }
        }
      } catch (err: any) {
        this.error = 'Erro ao buscar unidades sanitárias'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    getAllHealthFacilitiesAcrossPages(): HealthFacility[] {
      return flattenPages(this.healthFacilityPages)
    },

    async fetchByDistrictId(districtId: number) {
      this.loading = true
      this.error = null

      try {
        const response = await healthFacilityService.getByDistrictId(districtId)
        const facilities = response.map((dto: any) => HealthFacility.fromDTO(dto))
        this.currentPageHealthFacilities = facilities
      } catch (err: any) {
        this.error = 'Erro ao buscar unidades sanitárias por distrito'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async saveHealthFacility(data: Partial<HealthFacility>) {
      const dtoToSend = data instanceof HealthFacility
        ? data.toDTO()
        : new HealthFacility(data).toDTO()

      const savedDto = dtoToSend.id
        ? await healthFacilityService.update(dtoToSend)
        : await healthFacilityService.save(dtoToSend)

      const saved = HealthFacility.fromDTO(savedDto)
      const cacheKey = `${this.pagination.currentPage}:${this.pagination.pageSize}`

      if (!this.healthFacilityPages[cacheKey]) {
        this.healthFacilityPages[cacheKey] = []
      }

      this.healthFacilityPages[cacheKey] = replaceOrInsert(this.healthFacilityPages[cacheKey], saved, 'healthFacility')
      this.currentPageHealthFacilities = [...this.healthFacilityPages[cacheKey]]
      this.currentHealthFacility = saved

      return saved
    },

    async deleteHealthFacility(uuid: string) {
      await healthFacilityService.delete(uuid)
      for (const page in this.healthFacilityPages) {
        this.healthFacilityPages[page] = this.healthFacilityPages[page].filter(f => f.uuid !== uuid)
      }
      this.currentPageHealthFacilities = this.healthFacilityPages[`${this.pagination.currentPage}:${this.pagination.pageSize}`] ?? []
      if (this.currentHealthFacility?.uuid === uuid) {
        this.currentHealthFacility = null
      }
    },

    async updateHealthFacilityLifeCycleStatus(uuid: string, lifeCycleStatus: string) {
      const updatedDto = await healthFacilityService.updateLifeCycleStatus(uuid, lifeCycleStatus)
      const updated = HealthFacility.fromDTO(updatedDto)

      for (const page in this.healthFacilityPages) {
        const index = this.healthFacilityPages[page].findIndex(f => f.uuid === uuid)
        if (index !== -1) {
          this.healthFacilityPages[page][index] = updated
        }
      }

      this.currentPageHealthFacilities = this.healthFacilityPages[`${this.pagination.currentPage}:${this.pagination.pageSize}`] ?? []
      if (this.currentHealthFacility?.uuid === uuid) {
        this.currentHealthFacility = updated
      }

      return updated
    }
  }
})
