import { defineStore } from 'pinia'
import partnerService from 'src/services/partner/partnerService'
import { Partner } from 'src/entities/partner/Partner'
import { replaceOrInsert } from 'src/utils/storeUtils'
import { paginateArray, flattenPages } from 'src/utils/paginationUtils'

export const usePartnerStore = defineStore('partner', {
  state: () => ({
    // chave = `${page}:${size}` — inclui o size porque este store é usado
    // tanto para a tabela paginada (size pequeno) como para preencher
    // dropdowns noutros ecrãs (size grande); sem o size na chave, um pedido
    // de dropdown para a "página 0" sobrepunha-se ao cache da tabela.
    partnersPages: {} as Record<string, Partner[]>,
    currentPagePartners: [] as Partner[],
    currentPartner: null as Partner | null,
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
    async fetchPartners(params: {
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

      if (useCache && this.partnersPages[cacheKey]) {
        this.currentPagePartners = this.partnersPages[cacheKey]
        this.pagination.currentPage = page
        this.pagination.pageSize = size
        return
      }

      this.loading = true
      this.error = null

      try {
        const response = await partnerService.getAll({ ...params })
        const partners = (response.content ?? []).map((dto: any) =>
          Partner.fromDTO(dto)
        )

        if (!usePagination) {
          const paged = paginateArray(partners, defaultSize)
          this.partnersPages = {}
          for (const p in paged) {
            this.partnersPages[`${p}:${defaultSize}`] = paged[p]
          }
          this.currentPagePartners = paged[0] ?? []
          this.pagination = {
            totalSize: partners.length,
            totalPages: Object.keys(paged).length,
            currentPage: 0,
            pageSize: defaultSize
          }
        } else {
          this.partnersPages[cacheKey] = partners
          this.currentPagePartners = partners
          this.pagination = {
            totalSize: response.total,
            totalPages: Math.ceil(response.total / size),
            currentPage: response.page,
            pageSize: response.size
          }
        }
      } catch (error: any) {
        this.error = 'Erro ao buscar parceiros'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    getAllPartnersAcrossPages(): Partner[] {
      return flattenPages(this.partnersPages)
    },

    async getPartnerDetails(id: number) {
      this.loading = true
      this.error = null
      try {
        const dto = await partnerService.getById(id)
        this.currentPartner = Partner.fromDTO(dto)
      } catch (error: any) {
        this.error = 'Erro ao buscar detalhes do parceiro'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async savePartner(data: Partial<Partner>) {
      this.error = null
      try {
        const partner = data instanceof Partner ? data : new Partner(data)
        const dtoToSend = partner.toDTO()

        const savedDto = dtoToSend.id
          ? await partnerService.update(dtoToSend)
          : await partnerService.save(dtoToSend)

        const saved = Partner.fromDTO(savedDto)
        const cacheKey = `${this.pagination.currentPage}:${this.pagination.pageSize}`

        if (!this.partnersPages[cacheKey]) {
          this.partnersPages[cacheKey] = []
        }

        this.partnersPages[cacheKey] = replaceOrInsert(this.partnersPages[cacheKey], saved, 'name')
        this.currentPagePartners = [...this.partnersPages[cacheKey]]
        this.currentPartner = saved

        return saved
      } catch (error: any) {
        this.error = 'Erro ao salvar parceiro'
        console.error('Erro ao salvar parceiro:', error.response?.data || error.message || error)
        throw error
      }
    },

    async updatePartnerLifeCycleStatus(uuid: string, lifeCycleStatus: string) {
      this.error = null
      try {
        const updatedDto = await partnerService.updateLifeCycleStatus(uuid, lifeCycleStatus)
        const updated = Partner.fromDTO(updatedDto)

        for (const page in this.partnersPages) {
          const index = this.partnersPages[page].findIndex(p => p.uuid === uuid)
          if (index !== -1) {
            this.partnersPages[page][index] = updated
          }
        }

        this.currentPagePartners = this.partnersPages[`${this.pagination.currentPage}:${this.pagination.pageSize}`] ?? []

        if (this.currentPartner?.uuid === uuid) {
          this.currentPartner = updated
        }

        return updated
      } catch (error: any) {
        this.error = 'Erro ao atualizar status do parceiro'
        console.error(error)
        throw error
      }
    },

    async deletePartner(uuid: string) {
      this.error = null
      try {
        await partnerService.delete(uuid)

        for (const page in this.partnersPages) {
          this.partnersPages[page] = this.partnersPages[page].filter(p => p.uuid !== uuid)
        }

        this.currentPagePartners = this.partnersPages[`${this.pagination.currentPage}:${this.pagination.pageSize}`] ?? []

        if (this.currentPartner?.uuid === uuid) {
          this.currentPartner = null
        }
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Erro ao apagar parceiro'
        this.error = msg
        console.error(error)
        throw error
      }
    }
  }
})
