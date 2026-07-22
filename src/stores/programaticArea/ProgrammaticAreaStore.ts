import { defineStore } from 'pinia'
import ProgrammaticAreaService from '../../services/programaticArea/programmaticAreaService'
import { ProgrammaticArea } from '../../entities/programaticArea/ProgramaticArea'
import { replaceOrInsert } from 'src/utils/storeUtils'
import { paginateArray, flattenPages } from 'src/utils/paginationUtils'

export const useProgrammaticAreaStore = defineStore('programmaticArea', {
  state: () => ({
    // chave = `${page}:${size}` (ver PartnerStore para o porquê)
    areasPages: {} as Record<string, ProgrammaticArea[]>,
    currentPageAreas: [] as ProgrammaticArea[],
    currentArea: null as ProgrammaticArea | null,
    loading: false,
    error: null as string | null,
    pagination: {
      totalSize: 0,
      totalPages: 0,
      currentPage: 0,
      pageSize: 100
    }
  }),

  actions: {
    async fetchAreas(params: {
      page?: number
      size?: number
      sort?: string
      name?: string
      ignoreCache?: boolean
      [key: string]: any
    } = {}) {
      const name = params.name ?? ''
      const ignoreCache = params.ignoreCache ?? false
      const isSearch = name.trim() !== ''
      const usePagination = params.page !== undefined || params.size !== undefined
      const useCache = !ignoreCache && !isSearch && usePagination

      const defaultSize = this.pagination.pageSize
      const page = params.page ?? 0
      const size = params.size ?? defaultSize
      const cacheKey = `${page}:${size}`

      if (useCache && this.areasPages[cacheKey]) {
        this.currentPageAreas = this.areasPages[cacheKey]
        this.pagination.currentPage = page
        this.pagination.pageSize = size
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await ProgrammaticAreaService.getAll({ ...params })
        const areas = (response.content ?? []).map((dto: any) =>
          ProgrammaticArea.fromDTO(dto)
        )

        if (!usePagination) {
          const paged = paginateArray(areas, defaultSize)
          this.areasPages = {}
          for (const p in paged) {
            this.areasPages[`${p}:${defaultSize}`] = paged[p]
          }
          this.currentPageAreas = paged[0] ?? []
          this.pagination = {
            totalSize: areas.length,
            totalPages: Object.keys(paged).length,
            currentPage: 0,
            pageSize: defaultSize
          }
        } else {
          this.areasPages[cacheKey] = areas
          this.currentPageAreas = areas
          this.pagination = {
            totalSize: response.total,
            totalPages: Math.ceil(response.total / size),
            currentPage: response.page,
            pageSize: response.size
          }
        }
      } catch (error: any) {
        this.error = 'Erro ao buscar áreas programáticas'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    getAllAreasAcrossPages(): ProgrammaticArea[] {
      return flattenPages(this.areasPages)
    },

    async getAreaDetails(id: number) {
      this.loading = true
      this.error = null
      try {
        const dto = await ProgrammaticAreaService.getById(id)
        this.currentArea = ProgrammaticArea.fromDTO(dto)
      } catch (error: any) {
        this.error = 'Erro ao buscar detalhes da área programática'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async saveArea(areaData: Partial<ProgrammaticArea>) {
      this.error = null

      try {
        const area = areaData instanceof ProgrammaticArea
          ? areaData
          : new ProgrammaticArea(areaData)

        const dtoToSend = area.toDTO()

        const savedDto = dtoToSend.id
          ? await ProgrammaticAreaService.update(dtoToSend)
          : await ProgrammaticAreaService.save(dtoToSend)

        const saved = ProgrammaticArea.fromDTO(savedDto)
        const cacheKey = `${this.pagination.currentPage}:${this.pagination.pageSize}`

        if (!this.areasPages[cacheKey]) {
          this.areasPages[cacheKey] = []
        }

        this.areasPages[cacheKey] = replaceOrInsert(this.areasPages[cacheKey], saved, 'name')
        this.currentPageAreas = [...this.areasPages[cacheKey]]
        this.currentArea = saved

        return saved
      } catch (error: any) {
        this.error = 'Erro ao salvar área programática'
        console.error(error)
        throw error
      }
    },

    async updateAreaLifeCycleStatus(uuid: string, lifeCycleStatus: string) {
      this.error = null
      try {
        const updatedDto = await ProgrammaticAreaService.updateLifeCycleStatus(uuid, lifeCycleStatus)
        const updatedArea = ProgrammaticArea.fromDTO(updatedDto)

        for (const page in this.areasPages) {
          const index = this.areasPages[page].findIndex(a => a.uuid === uuid)
          if (index !== -1) {
            this.areasPages[page][index] = updatedArea
          }
        }

        this.currentPageAreas = this.areasPages[`${this.pagination.currentPage}:${this.pagination.pageSize}`] ?? []

        if (this.currentArea?.uuid === uuid) {
          this.currentArea = updatedArea
        }

        return updatedArea
      } catch (error: any) {
        this.error = 'Erro ao atualizar status da área programática'
        console.error(error)
        throw error
      }
    },

    async deleteArea(uuid: string) {
      this.error = null
      try {
        await ProgrammaticAreaService.delete(uuid)

        for (const page in this.areasPages) {
          this.areasPages[page] = this.areasPages[page].filter(a => a.uuid !== uuid)
        }

        this.currentPageAreas = this.areasPages[`${this.pagination.currentPage}:${this.pagination.pageSize}`] ?? []

        if (this.currentArea?.uuid === uuid) {
          this.currentArea = null
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Erro ao apagar área programática'
        this.error = msg
        console.error(error)
        throw error
      }
    }
  }
})
