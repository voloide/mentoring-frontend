import{c,d as t}from"./index.806c5219.js";import{D as d,c as u,P as v,d as m,H as p,e as F,f,g as w,h as A,i as E}from"./QSpinnerRings.4e4bdf31.js";const i=c(d),{createDistrictFromDTO:D}=u();var B={async getByProvince(e){return await t().get(`/district/getAllOfProvince/${e}`).then(r=>(this.generateAndSaveEntityFromDTO(r.data),r)).catch(r=>{console.error("Error",r.message)})},async getAll(){return await t().get("/district/getall").then(e=>(this.generateAndSaveEntityFromDTO(e.data),e)).catch(e=>{console.error("Error",e.message)})},generateAndSaveEntityFromDTO(e){e.forEach(r=>{const a=D(r);i.save(a)})},deleteAllFromStorage(){i.flush()},piniaGetAll(){return i.query().orderBy("district","asc").get()},getAllDistrictByProvinceId(e){return i.query().with("province").where("province_id",e).get()},getDistrictByDescription(e){return i.query().where("description",e).first()}};const l=c(v),{createProvinceFromDTO:S}=m();var T={async getAll(){return await t().get("/province/getall").then(e=>(this.generateAndSaveEntityFromDTO(e.data),e)).catch(e=>{console.error("Error",e.message)})},generateAndSaveEntityFromDTO(e){e.forEach(r=>{const a=S(r);l.save(a)})},deleteAllFromStorage(){l.flush()},piniaGetAll(){return l.query().orderBy("designation","asc").get()},getById(e){return l.query().where("id",e).orderBy("designation","asc").first()}};const n=c(p),{createHealthFacilityFromDTO:h}=F();var q={async getByDistrict(e){return await t().get(`/healthFacilities/getAllOfDistrict/${e}`).then(r=>(this.generateAndSaveEntityFromDTO(r.data),r)).catch(r=>{console.error("Error",r.message)})},async getAll(e){return await t().get(`/healthFacilities/getByPageAndSize?${new URLSearchParams(e).toString()}`).then(r=>(this.generateAndSaveEntityFromDTO(r.data.content),r)).catch(r=>{console.error("Error",r.message)})},async getByProvince(e){return await t().get(`/healthFacilities/getAllOfProvince/${e}`).then(r=>(this.generateAndSaveEntityFromDTO(r.data),r)).catch(r=>{console.error("Error",r.message)})},generateAndSaveEntityFromDTO(e){e.forEach(r=>{const a=h(r);n.save(a)})},deleteAllFromStorage(){n.flush()},piniaGetAll(){return n.query().withAllRecursive(3).orderBy("healthFacility","asc").get()},getAllOfDistrict(e){return n.query().with("district").where("districtId",e).get()},getByHealthFacility(e){return n.query().with("district").where("healthFacility",e).first()},async saveHealthFacility(e){return await t().post("/healthFacilities/save",e).then(r=>(n.save(h(r.data)),r)).catch(r=>{console.error("Error",r.message)})},async deleteHealthFacility(e){try{const r=await t().patch(`/healthFacilities/${e}`);return await t().delete(`/healthFacilities/${e}`),n.save(h(r.data)),n.delete(e),r}catch(r){throw console.error("Error",r.message),r}},async updateHealthFacility(e){return await t().patch("/healthFacilities/update",e).then(r=>(n.save(h(r.data)),r)).catch(r=>{console.error("Error",r.message)})}};const s=c(f),{createPartnerFromDTO:g}=w();var $={async getAll(){return await t().get("/partner/getall").then(e=>(this.generateAndSaveEntityFromDTO(e.data),e)).catch(e=>{console.error("Error",e.message)})},generateAndSaveEntityFromDTO(e){e.forEach(r=>{const a=g(r);s.save(a)})},deleteAllFromStorage(){s.flush()},piniaGetAll(){return s.query().where(e=>e.uuid!=="398f0ffeb8fe11edafa10242ac120002").orderBy("description","asc").get()},getByName(e){return s.query().where("name",e).orderBy("description","asc").first()},getById(e){return s.query().where("id",e).orderBy("description","asc").first()},async savePartner(e){return await t().post("/partner",e).then(r=>(s.save(g(r.data)),r)).catch(r=>{console.error("Error",r.message)})},async deletePartner(e){try{const r=await t().patch(`/partner/${e}`);return await t().delete(`/partner/${e}`),s.save(g(r.data)),s.delete(e),r}catch(r){throw console.error("Error",r.message),r}},async updatePartner(e){return await t().patch("/partner",e).then(r=>(s.save(g(r.data)),r)).catch(r=>{console.error("Error",r.message)})}};const o=c(A),{createProfessionalCategoryFromDTO:y}=E();var C={async getAll(){return await t().get("/professionalCategories/getall").then(e=>(this.generateAndSaveEntityFromDTO(e.data),e)).catch(e=>{console.error("Error",e.message)})},generateAndSaveEntityFromDTO(e){e.forEach(r=>{const a=y(r);o.save(a)})},deleteAllFromStorage(){o.flush()},piniaGetAll(){return o.query().orderBy("description","asc").get()},async saveProfessionalCategory(e){return await t().post("/professionalCategories/save",e).then(r=>(o.save(y(r.data)),r)).catch(r=>{console.error("Error",r.message)})},async deleteProfessionalCategory(e){try{const r=await t().patch(`/professionalCategories/${e}`);return await t().delete(`/professionalCategories/${e}`),o.save(y(r.data)),o.delete(e),r}catch(r){throw console.error("Error",r.message),r}},async updateProfessionalCategory(e){return await t().patch("/professionalCategories/update",e).then(r=>(o.save(y(r.data)),r)).catch(r=>{console.error("Error",r.message)})},async getByCode(e){return o.query().withAllRecursive(2).where("code",e).orderBy("id","asc").first()}};export{$ as a,C as b,B as d,q as h,T as p};