var lt=Object.defineProperty;var ht=(n,e,t)=>e in n?lt(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var c=(n,e,t)=>(ht(n,typeof e!="symbol"?e+"":e,t),t);import{M as _,c as mt,d as T}from"./index.806c5219.js";import{z as yt,a8 as St,a9 as gt,h as vt}from"./index.8cc0be75.js";var d;(function(n){n[n.PLAIN_TO_CLASS=0]="PLAIN_TO_CLASS",n[n.CLASS_TO_PLAIN=1]="CLASS_TO_PLAIN",n[n.CLASS_TO_CLASS=2]="CLASS_TO_CLASS"})(d||(d={}));var At=function(){function n(){this._typeMetadatas=new Map,this._transformMetadatas=new Map,this._exposeMetadatas=new Map,this._excludeMetadatas=new Map,this._ancestorsMap=new Map}return n.prototype.addTypeMetadata=function(e){this._typeMetadatas.has(e.target)||this._typeMetadatas.set(e.target,new Map),this._typeMetadatas.get(e.target).set(e.propertyName,e)},n.prototype.addTransformMetadata=function(e){this._transformMetadatas.has(e.target)||this._transformMetadatas.set(e.target,new Map),this._transformMetadatas.get(e.target).has(e.propertyName)||this._transformMetadatas.get(e.target).set(e.propertyName,[]),this._transformMetadatas.get(e.target).get(e.propertyName).push(e)},n.prototype.addExposeMetadata=function(e){this._exposeMetadatas.has(e.target)||this._exposeMetadatas.set(e.target,new Map),this._exposeMetadatas.get(e.target).set(e.propertyName,e)},n.prototype.addExcludeMetadata=function(e){this._excludeMetadatas.has(e.target)||this._excludeMetadatas.set(e.target,new Map),this._excludeMetadatas.get(e.target).set(e.propertyName,e)},n.prototype.findTransformMetadatas=function(e,t,r){return this.findMetadatas(this._transformMetadatas,e,t).filter(function(o){return!o.options||o.options.toClassOnly===!0&&o.options.toPlainOnly===!0?!0:o.options.toClassOnly===!0?r===d.CLASS_TO_CLASS||r===d.PLAIN_TO_CLASS:o.options.toPlainOnly===!0?r===d.CLASS_TO_PLAIN:!0})},n.prototype.findExcludeMetadata=function(e,t){return this.findMetadata(this._excludeMetadatas,e,t)},n.prototype.findExposeMetadata=function(e,t){return this.findMetadata(this._exposeMetadatas,e,t)},n.prototype.findExposeMetadataByCustomName=function(e,t){return this.getExposedMetadatas(e).find(function(r){return r.options&&r.options.name===t})},n.prototype.findTypeMetadata=function(e,t){return this.findMetadata(this._typeMetadatas,e,t)},n.prototype.getStrategy=function(e){var t=this._excludeMetadatas.get(e),r=t&&t.get(void 0),o=this._exposeMetadatas.get(e),i=o&&o.get(void 0);return r&&i||!r&&!i?"none":r?"excludeAll":"exposeAll"},n.prototype.getExposedMetadatas=function(e){return this.getMetadata(this._exposeMetadatas,e)},n.prototype.getExcludedMetadatas=function(e){return this.getMetadata(this._excludeMetadatas,e)},n.prototype.getExposedProperties=function(e,t){return this.getExposedMetadatas(e).filter(function(r){return!r.options||r.options.toClassOnly===!0&&r.options.toPlainOnly===!0?!0:r.options.toClassOnly===!0?t===d.CLASS_TO_CLASS||t===d.PLAIN_TO_CLASS:r.options.toPlainOnly===!0?t===d.CLASS_TO_PLAIN:!0}).map(function(r){return r.propertyName})},n.prototype.getExcludedProperties=function(e,t){return this.getExcludedMetadatas(e).filter(function(r){return!r.options||r.options.toClassOnly===!0&&r.options.toPlainOnly===!0?!0:r.options.toClassOnly===!0?t===d.CLASS_TO_CLASS||t===d.PLAIN_TO_CLASS:r.options.toPlainOnly===!0?t===d.CLASS_TO_PLAIN:!0}).map(function(r){return r.propertyName})},n.prototype.clear=function(){this._typeMetadatas.clear(),this._exposeMetadatas.clear(),this._excludeMetadatas.clear(),this._ancestorsMap.clear()},n.prototype.getMetadata=function(e,t){var r=e.get(t),o;r&&(o=Array.from(r.values()).filter(function(m){return m.propertyName!==void 0}));for(var i=[],s=0,u=this.getAncestors(t);s<u.length;s++){var f=u[s],x=e.get(f);if(x){var p=Array.from(x.values()).filter(function(m){return m.propertyName!==void 0});i.push.apply(i,p)}}return i.concat(o||[])},n.prototype.findMetadata=function(e,t,r){var o=e.get(t);if(o){var i=o.get(r);if(i)return i}for(var s=0,u=this.getAncestors(t);s<u.length;s++){var f=u[s],x=e.get(f);if(x){var p=x.get(r);if(p)return p}}},n.prototype.findMetadatas=function(e,t,r){var o=e.get(t),i;o&&(i=o.get(r));for(var s=[],u=0,f=this.getAncestors(t);u<f.length;u++){var x=f[u],p=e.get(x);p&&p.has(r)&&s.push.apply(s,p.get(r))}return s.slice().reverse().concat((i||[]).slice().reverse())},n.prototype.getAncestors=function(e){if(!e)return[];if(!this._ancestorsMap.has(e)){for(var t=[],r=Object.getPrototypeOf(e.prototype.constructor);typeof r.prototype!="undefined";r=Object.getPrototypeOf(r.prototype.constructor))t.push(r);this._ancestorsMap.set(e,t)}return this._ancestorsMap.get(e)},n}(),A=new At;function Ot(){if(typeof globalThis!="undefined")return globalThis;if(typeof global!="undefined")return global;if(typeof window!="undefined")return window;if(typeof self!="undefined")return self}function Ct(n){return n!==null&&typeof n=="object"&&typeof n.then=="function"}var ot=globalThis&&globalThis.__spreadArray||function(n,e,t){if(t||arguments.length===2)for(var r=0,o=e.length,i;r<o;r++)(i||!(r in e))&&(i||(i=Array.prototype.slice.call(e,0,r)),i[r]=e[r]);return n.concat(i||Array.prototype.slice.call(e))};function xt(n){var e=new n;return!(e instanceof Set)&&!("push"in e)?[]:e}var N=function(){function n(e,t){this.transformationType=e,this.options=t,this.recursionStack=new Set}return n.prototype.transform=function(e,t,r,o,i,s){var u=this;if(s===void 0&&(s=0),Array.isArray(t)||t instanceof Set){var f=o&&this.transformationType===d.PLAIN_TO_CLASS?xt(o):[];return t.forEach(function(h,L){var O=e?e[L]:void 0;if(!u.options.enableCircularCheck||!u.isCircular(h)){var g=void 0;if(typeof r!="function"&&r&&r.options&&r.options.discriminator&&r.options.discriminator.property&&r.options.discriminator.subTypes){if(u.transformationType===d.PLAIN_TO_CLASS){g=r.options.discriminator.subTypes.find(function(P){return P.name===h[r.options.discriminator.property]});var M={newObject:f,object:h,property:void 0},l=r.typeFunction(M);g===void 0?g=l:g=g.value,r.options.keepDiscriminatorProperty||delete h[r.options.discriminator.property]}u.transformationType===d.CLASS_TO_CLASS&&(g=h.constructor),u.transformationType===d.CLASS_TO_PLAIN&&(h[r.options.discriminator.property]=r.options.discriminator.subTypes.find(function(P){return P.value===h.constructor}).name)}else g=r;var v=u.transform(O,h,g,void 0,h instanceof Map,s+1);f instanceof Set?f.add(v):f.push(v)}else u.transformationType===d.CLASS_TO_CLASS&&(f instanceof Set?f.add(h):f.push(h))}),f}else{if(r===String&&!i)return t==null?t:String(t);if(r===Number&&!i)return t==null?t:Number(t);if(r===Boolean&&!i)return t==null?t:Boolean(t);if((r===Date||t instanceof Date)&&!i)return t instanceof Date?new Date(t.valueOf()):t==null?t:new Date(t);if(!!Ot().Buffer&&(r===Buffer||t instanceof Buffer)&&!i)return t==null?t:Buffer.from(t);if(Ct(t)&&!i)return new Promise(function(h,L){t.then(function(O){return h(u.transform(void 0,O,r,void 0,void 0,s+1))},L)});if(!i&&t!==null&&typeof t=="object"&&typeof t.then=="function")return t;if(typeof t=="object"&&t!==null){!r&&t.constructor!==Object&&(!Array.isArray(t)&&t.constructor===Array||(r=t.constructor)),!r&&e&&(r=e.constructor),this.options.enableCircularCheck&&this.recursionStack.add(t);var x=this.getKeys(r,t,i),p=e||{};!e&&(this.transformationType===d.PLAIN_TO_CLASS||this.transformationType===d.CLASS_TO_CLASS)&&(i?p=new Map:r?p=new r:p={});for(var m=function(h){if(h==="__proto__"||h==="constructor")return"continue";var L=h,O=h,g=h;if(!a.options.ignoreDecorators&&r){if(a.transformationType===d.PLAIN_TO_CLASS){var M=A.findExposeMetadataByCustomName(r,h);M&&(g=M.propertyName,O=M.propertyName)}else if(a.transformationType===d.CLASS_TO_PLAIN||a.transformationType===d.CLASS_TO_CLASS){var M=A.findExposeMetadata(r,h);M&&M.options&&M.options.name&&(O=M.options.name)}}var l=void 0;a.transformationType===d.PLAIN_TO_CLASS?l=t[L]:t instanceof Map?l=t.get(L):t[L]instanceof Function?l=t[L]():l=t[L];var v=void 0,P=l instanceof Map;if(r&&i)v=r;else if(r){var S=A.findTypeMetadata(r,g);if(S){var pt={newObject:p,object:t,property:g},tt=S.typeFunction?S.typeFunction(pt):S.reflectedType;S.options&&S.options.discriminator&&S.options.discriminator.property&&S.options.discriminator.subTypes?t[L]instanceof Array?v=S:(a.transformationType===d.PLAIN_TO_CLASS&&(v=S.options.discriminator.subTypes.find(function(b){if(l&&l instanceof Object&&S.options.discriminator.property in l)return b.name===l[S.options.discriminator.property]}),v===void 0?v=tt:v=v.value,S.options.keepDiscriminatorProperty||l&&l instanceof Object&&S.options.discriminator.property in l&&delete l[S.options.discriminator.property]),a.transformationType===d.CLASS_TO_CLASS&&(v=l.constructor),a.transformationType===d.CLASS_TO_PLAIN&&l&&(l[S.options.discriminator.property]=S.options.discriminator.subTypes.find(function(b){return b.value===l.constructor}).name)):v=tt,P=P||S.reflectedType===Map}else if(a.options.targetMaps)a.options.targetMaps.filter(function(b){return b.target===r&&!!b.properties[g]}).forEach(function(b){return v=b.properties[g]});else if(a.options.enableImplicitConversion&&a.transformationType===d.PLAIN_TO_CLASS){var et=Reflect.getMetadata("design:type",r.prototype,g);et&&(v=et)}}var rt=Array.isArray(t[L])?a.getReflectedType(r,g):void 0,nt=e?e[L]:void 0;if(p.constructor.prototype){var it=Object.getOwnPropertyDescriptor(p.constructor.prototype,O);if((a.transformationType===d.PLAIN_TO_CLASS||a.transformationType===d.CLASS_TO_CLASS)&&(it&&!it.set||p[O]instanceof Function))return"continue"}if(!a.options.enableCircularCheck||!a.isCircular(l)){var Q=a.transformationType===d.PLAIN_TO_CLASS?O:h,y=void 0;a.transformationType===d.CLASS_TO_PLAIN?(y=t[Q],y=a.applyCustomTransformations(y,r,Q,t,a.transformationType),y=t[Q]===y?l:y,y=a.transform(nt,y,v,rt,P,s+1)):l===void 0&&a.options.exposeDefaultValues?y=p[O]:(y=a.transform(nt,l,v,rt,P,s+1),y=a.applyCustomTransformations(y,r,Q,t,a.transformationType)),(y!==void 0||a.options.exposeUnsetFields)&&(p instanceof Map?p.set(O,y):p[O]=y)}else if(a.transformationType===d.CLASS_TO_CLASS){var y=l;y=a.applyCustomTransformations(y,r,h,t,a.transformationType),(y!==void 0||a.options.exposeUnsetFields)&&(p instanceof Map?p.set(O,y):p[O]=y)}},a=this,Z=0,V=x;Z<V.length;Z++){var ft=V[Z];m(ft)}return this.options.enableCircularCheck&&this.recursionStack.delete(t),p}else return t}},n.prototype.applyCustomTransformations=function(e,t,r,o,i){var s=this,u=A.findTransformMetadatas(t,r,this.transformationType);return this.options.version!==void 0&&(u=u.filter(function(f){return f.options?s.checkVersion(f.options.since,f.options.until):!0})),this.options.groups&&this.options.groups.length?u=u.filter(function(f){return f.options?s.checkGroups(f.options.groups):!0}):u=u.filter(function(f){return!f.options||!f.options.groups||!f.options.groups.length}),u.forEach(function(f){e=f.transformFn({value:e,key:r,obj:o,type:i,options:s.options})}),e},n.prototype.isCircular=function(e){return this.recursionStack.has(e)},n.prototype.getReflectedType=function(e,t){if(!!e){var r=A.findTypeMetadata(e,t);return r?r.reflectedType:void 0}},n.prototype.getKeys=function(e,t,r){var o=this,i=A.getStrategy(e);i==="none"&&(i=this.options.strategy||"exposeAll");var s=[];if((i==="exposeAll"||r)&&(t instanceof Map?s=Array.from(t.keys()):s=Object.keys(t)),r)return s;if(this.options.ignoreDecorators&&this.options.excludeExtraneousValues&&e){var u=A.getExposedProperties(e,this.transformationType),f=A.getExcludedProperties(e,this.transformationType);s=ot(ot([],u,!0),f,!0)}if(!this.options.ignoreDecorators&&e){var u=A.getExposedProperties(e,this.transformationType);this.transformationType===d.PLAIN_TO_CLASS&&(u=u.map(function(m){var a=A.findExposeMetadata(e,m);return a&&a.options&&a.options.name?a.options.name:m})),this.options.excludeExtraneousValues?s=u:s=s.concat(u);var x=A.getExcludedProperties(e,this.transformationType);x.length>0&&(s=s.filter(function(m){return!x.includes(m)})),this.options.version!==void 0&&(s=s.filter(function(m){var a=A.findExposeMetadata(e,m);return!a||!a.options?!0:o.checkVersion(a.options.since,a.options.until)})),this.options.groups&&this.options.groups.length?s=s.filter(function(m){var a=A.findExposeMetadata(e,m);return!a||!a.options?!0:o.checkGroups(a.options.groups)}):s=s.filter(function(m){var a=A.findExposeMetadata(e,m);return!a||!a.options||!a.options.groups||!a.options.groups.length})}return this.options.excludePrefixes&&this.options.excludePrefixes.length&&(s=s.filter(function(p){return o.options.excludePrefixes.every(function(m){return p.substr(0,m.length)!==m})})),s=s.filter(function(p,m,a){return a.indexOf(p)===m}),s},n.prototype.checkVersion=function(e,t){var r=!0;return r&&e&&(r=this.options.version>=e),r&&t&&(r=this.options.version<t),r},n.prototype.checkGroups=function(e){return e?this.options.groups.some(function(t){return e.includes(t)}):!0},n}(),E={enableCircularCheck:!1,enableImplicitConversion:!1,excludeExtraneousValues:!1,excludePrefixes:void 0,exposeDefaultValues:!1,exposeUnsetFields:!0,groups:void 0,ignoreDecorators:!1,strategy:void 0,targetMaps:void 0,version:void 0},C=globalThis&&globalThis.__assign||function(){return C=Object.assign||function(n){for(var e,t=1,r=arguments.length;t<r;t++){e=arguments[t];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o])}return n},C.apply(this,arguments)},Lt=function(){function n(){}return n.prototype.instanceToPlain=function(e,t){var r=new N(d.CLASS_TO_PLAIN,C(C({},E),t));return r.transform(void 0,e,void 0,void 0,void 0,void 0)},n.prototype.classToPlainFromExist=function(e,t,r){var o=new N(d.CLASS_TO_PLAIN,C(C({},E),r));return o.transform(t,e,void 0,void 0,void 0,void 0)},n.prototype.plainToInstance=function(e,t,r){var o=new N(d.PLAIN_TO_CLASS,C(C({},E),r));return o.transform(void 0,t,e,void 0,void 0,void 0)},n.prototype.plainToClassFromExist=function(e,t,r){var o=new N(d.PLAIN_TO_CLASS,C(C({},E),r));return o.transform(e,t,void 0,void 0,void 0,void 0)},n.prototype.instanceToInstance=function(e,t){var r=new N(d.CLASS_TO_CLASS,C(C({},E),t));return r.transform(void 0,e,void 0,void 0,void 0,void 0)},n.prototype.classToClassFromExist=function(e,t,r){var o=new N(d.CLASS_TO_CLASS,C(C({},E),r));return o.transform(t,e,void 0,void 0,void 0,void 0)},n.prototype.serialize=function(e,t){return JSON.stringify(this.instanceToPlain(e,t))},n.prototype.deserialize=function(e,t,r){var o=JSON.parse(t);return this.plainToInstance(e,o,r)},n.prototype.deserializeArray=function(e,t,r){var o=JSON.parse(t);return this.plainToInstance(e,o,r)},n}();function _t(n){return n===void 0&&(n={}),function(e,t){A.addExcludeMetadata({target:e instanceof Function?e:e.constructor,propertyName:t,options:n})}}function X(n){return n===void 0&&(n={}),function(e,t){A.addExposeMetadata({target:e instanceof Function?e:e.constructor,propertyName:t,options:n})}}var Mt=new Lt;function Tt(n,e,t){return Mt.plainToInstance(n,e,t)}var Ft=Object.defineProperty,Pt=Object.getOwnPropertyDescriptor,J=(n,e,t,r)=>{for(var o=r>1?void 0:r?Pt(e,t):e,i=n.length-1,s;i>=0;i--)(s=n[i])&&(o=(r?s(e,t,o):s(o))||o);return r&&o&&Ft(e,t,o),o};class k{constructor(){c(this,"firstName");c(this,"lastName");c(this,"email");c(this,"age");c(this,"password")}}J([X()],k.prototype,"firstName",2);J([X()],k.prototype,"lastName",2);J([X()],k.prototype,"email",2);J([X()],k.prototype,"age",2);J([_t()],k.prototype,"password",2);class K extends _{static fields(){return{id:this.number(()=>0),uuid:this.attr(""),code:this.attr(""),description:this.attr(""),lifeCycleStatus:this.attr("")}}}c(K,"entity","professionalCategorys"),c(K,"primaryKey","id"),c(K,"piniaOptions",{persist:!0});class B extends _{static fields(){return{id:this.attr(null),uuid:this.attr(""),name:this.attr(""),description:this.attr(""),lifeCycleStatus:this.attr("")}}}c(B,"entity","partners"),c(B,"primaryKey","id"),c(B,"piniaOptions",{persist:!0});class D extends _{static fields(){return{id:this.attr(null),uuid:this.attr(""),designation:this.attr("")}}}c(D,"entity","provinces"),c(D,"primaryKey","id"),c(D,"piniaOptions",{persist:!0});class I extends _{static fields(){return{id:this.attr(null),uuid:this.attr(""),description:this.attr(""),province_id:this.attr(""),province:this.belongsTo(D,"province_id")}}}c(I,"entity","districts"),c(I,"primaryKey","id"),c(I,"piniaOptions",{persist:!0});class $ extends _{static fields(){return{id:this.attr(null),uuid:this.attr(""),healthFacility:this.attr(""),districtId:this.attr(""),district:this.belongsTo(I,"districtId")}}}c($,"entity","health_facilities"),c($,"primaryKey","id"),c($,"piniaOptions",{persist:!0});class z extends _{static fields(){return{id:this.attr(null),uuid:this.attr(""),locationLevel:this.attr(""),district_id:this.attr(""),province_id:this.attr(""),employee_id:this.attr(""),healthFacility_id:this.attr(""),province:this.belongsTo(D,"province_id"),district:this.belongsTo(I,"district_id"),employee:this.belongsTo(j,"employee_id"),healthFacility:this.belongsTo($,"healthFacility_id")}}}c(z,"entity","locations"),c(z,"primaryKey","id"),c(z,"piniaOptions",{persist:!0});class j extends _{static fields(){return{id:this.attr(null),uuid:this.attr(""),name:this.attr(""),surname:this.attr(""),nuit:this.attr(""),trainingYear:this.attr(""),phoneNumber:this.attr(""),email:this.attr(""),category_id:this.attr(""),partner_id:this.attr(""),professionalCategory:this.belongsTo(K,"category_id"),partner:this.belongsTo(B,"partner_id"),locations:this.hasMany(z,"employee_id")}}}c(j,"entity","employees"),c(j,"primaryKey","id"),c(j,"piniaOptions",{persist:!0});function st(){function n(t){return new K({id:t.id,uuid:t.uuid,code:t.code,description:t.description,lifeCycleStatus:t.lifeCycleStatus})}function e(t){return{id:t.id,uuid:t.uuid,code:t.code,description:t.description,lifeCycleStatus:t.lifeCycleStatus}}return{createProfessionalCategoryFromDTO:n,createDTOFromProfessionalCategory:e}}function q(){function n(t){return new D({id:t.id,uuid:t.uuid,designation:t.designation})}function e(t){return{id:t.id,uuid:t.uuid,designation:t.designation}}return{createProvinceFromDTO:n,createDTOFromProvince:e}}function W(){function n(t){const{createProvinceFromDTO:r}=q();return new I({id:t.id,uuid:t.uuid,description:t.description,province:t.provinceDTO!==void 0&&t.provinceDTO!==null?r(t.provinceDTO):null})}function e(t){const{createDTOFromProvince:r}=q();return{id:t==null?void 0:t.id,uuid:t==null?void 0:t.uuid,description:t==null?void 0:t.description,provinceDTO:(t==null?void 0:t.province)!==void 0&&(t==null?void 0:t.province)!==null?r(t==null?void 0:t.province):null}}return{createDistrictFromDTO:n,createDTOFromDistrict:e}}function at(){function n(t){const{createDistrictFromDTO:r}=W();return new $({id:t.id,uuid:t.uuid,healthFacility:t.healthFacility,district:t.districtDTO?r(t.districtDTO):null})}function e(t){const{createDTOFromDistrict:r}=W();return{id:t.id,uuid:t.uuid,healthFacility:t.healthFacility,districtDTO:r(t.district)}}return{createHealthFacilityFromDTO:n,createDTOFromHealthFacility:e}}function ut(){function n(t){const{createDistrictFromDTO:r}=W(),{createProvinceFromDTO:o}=q(),{createHealthFacilityFromDTO:i}=at();return new z({id:t.id,uuid:t.uuid,locationLevel:t.locationLevel,district:t.districtDTO?r(t.districtDTO):"",healthFacility:t.healthFacilityDTO?i(t.healthFacilityDTO):"",province:t.provinceDTO?o(t.provinceDTO):""})}function e(t){const{createDTOFromDistrict:r}=W(),{createDTOFromProvince:o}=q(),{createDTOFromHealthFacility:i}=at();return{id:t.id,uuid:t.uuid,locationLevel:t.locationLevel,districtDTO:t.district?r(t.district):void 0,healthFacilityDTO:t.healthFacility?i(t.healthFacility):void 0,provinceDTO:t.province?o(t==null?void 0:t.province):void 0}}return{createLocationFromDTO:n,createDTOFromLocation:e}}function ct(){function n(t){return new B({id:t.id,uuid:t.uuid,description:t.description,name:t.name,lifeCycleStatus:t.lifeCycleStatus})}function e(t){return{id:t.id,uuid:t.uuid,description:t.description,name:t.name,lifeCycleStatus:t.lifeCycleStatus}}return{createPartnerFromDTO:n,createDTOFromPartner:e}}function dt(){function n(i){return`${i.name} ${i.surname}`}function e(i){const{createProfessionalCategoryFromDTO:s}=st(),{createPartnerFromDTO:u}=ct();return new j({id:i.id,uuid:i.uuid,name:i.name,surname:i.surname,nuit:i.nuit,email:i.email,trainingYear:i.trainingYear,phoneNumber:i.phoneNumber,locations:r(i.locationDTOSet),professionalCategory:s(i.professionalCategoryDTO),partner:u(i.partnerDTO),createdBy:i.createdBy,createdAt:i.createdAt})}function t(i){const{createDTOFromProfessionalCategory:s}=st(),{createDTOFromPartner:u}=ct();return{id:i.id,uuid:i.uuid,name:i.name,surname:i.surname,nuit:i.nuit,email:i.email,trainingYear:i.trainingYear,phoneNumber:i.phoneNumber,locationDTOSet:o(i.locations),partnerDTO:u(i.partner),professionalCategoryDTO:s(i.professionalCategory)}}function r(i){if(i==null)return null;const{createLocationFromDTO:s}=ut(),u=[];return i==null||i.forEach(f=>{u.push(s(f))}),u}function o(i){const{createDTOFromLocation:s}=ut(),u=[];return i==null||i.forEach(f=>{u.push(s(f))}),u}return{fullName:n,createEmployeeFromDTO:e,createDTOFromEmployee:t}}class G extends _{static fields(){return{id:this.attr(null),uuid:this.attr(""),code:this.attr(""),module:this.attr(""),description:this.attr("")}}}c(G,"entity","authoritys"),c(G,"primaryKey","id"),c(G,"piniaOptions",{persist:!0});function bt(){function n(e){return new G({id:e.id,uuid:e.uuid,code:e.code,description:e.description,module:e.module})}return{createAuthorityFromDTO:n}}class U extends _{static fields(){return{id:this.number(()=>0),uuid:this.attr(""),code:this.attr(""),description:this.attr(""),level:this.attr(""),roleAuthorities:this.hasMany(H,"role_id")}}}c(U,"entity","roles"),c(U,"primaryKey","id"),c(U,"piniaOptions",{persist:!0});class H extends _{static fields(){return{id:this.number(()=>0),uuid:this.attr(""),role_id:this.attr(""),authority_id:this.attr(""),role:this.belongsTo(U,"role_id"),authority:this.belongsTo(G,"authority_id")}}}c(H,"entity","roleAuthoritys"),c(H,"primaryKey","id"),c(H,"piniaOptions",{persist:!0});function Nt(){function n(e){const{createAuthorityFromDTO:t}=bt();return new H({id:e.id,uuid:e.uuid,authority:t(e.authorityDTO)})}return{createRoleAuthorityFromDTO:n}}function Et(){function n(t){return new U({id:t.id,uuid:t.uuid,description:t.description,code:t.code,level:t.level,hierarchyLevel:t.hierarchyLevel,roleAuthorities:e(t.roleAuthorityDTOS)})}function e(t){const{createRoleAuthorityFromDTO:r}=Nt(),o=[];return t==null||t.forEach(i=>{o.push(r(i))}),o}return{createRoleFromDTO:n}}class R extends _{static fields(){return{id:this.number(()=>0),uuid:this.attr(""),salt:this.attr(""),employee_id:this.attr(""),username:this.attr(""),password:this.attr(""),shouldResetPassword:this.attr(""),employee:this.belongsTo(j,"employee_id"),userRoles:this.hasMany(Y,"user_id"),lifeCycleStatus:this.attr("")}}}c(R,"entity","users"),c(R,"primaryKey","id"),c(R,"piniaOptions",{persist:!0});class Y extends _{static fields(){return{id:this.number(()=>0),uuid:this.attr(""),role_id:this.attr(""),user_id:this.attr(""),role:this.belongsTo(U,"role_id"),user:this.belongsTo(R,"user_id")}}}c(Y,"entity","userRoles"),c(Y,"primaryKey","id"),c(Y,"piniaOptions",{persist:!0});function wt(){function n(e){const{createRoleFromDTO:t}=Et();return new Y({id:e.id,uuid:e.uuid,role:t(e.roleDTO)})}return{createUserRoleFromDTO:n}}function Dt(){function n(r){const{createEmployeeFromDTO:o}=dt();return new R({id:r.id,uuid:r.uuid,salt:r.salt,username:r.username,employee:o(r.employeeDTO),userRoles:r.userRoleDTOS?e(r.userRoleDTOS):[],lifeCycleStatus:r.lifeCycleStatus})}function e(r){const{createUserRoleFromDTO:o}=wt(),i=[];return r==null||r.forEach(s=>{i.push(o(s))}),i}function t(r){const{createDTOFromEmployee:o}=dt();return{id:r.id,username:r.username,password:r.password,shouldResetPassword:r.shouldResetPassword,employeeDTO:o(r.employee),lifeCycleStatus:r.lifeCycleStatus}}return{createUserFromDTO:n,createDTOFromUser:t}}const F=mt(R),{createUserFromDTO:w}=Dt();var kt={async post(n){try{const e=await T().post("user",Tt(k,n,{excludeExtraneousValues:!0}))}catch(e){console.error(e)}},async login(n){return T().post("/login",n).then(e=>(e.status===200&&this.convertUserFromDTO(e.data.userInfo),e)).catch(e=>e)},logout(){localStorage.removeItem("access_token"),localStorage.removeItem("refresh_token"),localStorage.removeItem("username"),localStorage.removeItem("userInfo"),localStorage.removeItem("tokenExpiration")},convertUserFromDTO(n){const e=w(n);F.save(e)},getLogedUser(){return JSON.stringify(localStorage.getItem("username")),F.query().withAll().first()},piniaSave(n){return F.save(n)},async getAll(){return await T().get("/user/getAll").then(n=>(this.generateAndSaveEntityFromDTO(n.data),n)).catch(n=>{console.error(n),console.error("Error",n.message)})},piniaGetAll(){return F.query().withAllRecursive(2).orderBy("username","asc").get()},async saveUser(n){return await T().post("/user/save",n).then(e=>(F.save(w(e.data)),e)).catch(e=>{console.error("Error",e.message)})},async deleteUser(n){try{const e=await T().patch(`/user/${n}`);return await T().delete(`/user/${n}`),F.save(w(e.data)),e}catch(e){throw console.error("Error",e.message),e}},generateAndSaveEntityFromDTO(n){n.forEach(e=>{const t=w(e);F.save(t)})},async resetPassword(n){return await T().patch("/user/password-reset",n).then(e=>(F.save(w(e.data)),e)).catch(e=>{console.error("Error",e.message)})},async updateUser(n){return await T().patch("/user/update",n).then(e=>(F.save(w(e.data)),e)).catch(e=>{console.error("Error",e.message)})},async search(n){return await T().get(`/user/search?${new URLSearchParams(n).toString()}`).then(e=>(this.generateAndSaveEntityFromDTO(e.data.content),e)).catch(e=>{console.error(e),console.error("Error",e.message)})},async fetchPage(n){return await T().get(`/user/getAll?${new URLSearchParams(n).toString()}`).then(e=>(this.generateAndSaveEntityFromDTO(e.data.content),e)).catch(e=>{console.error(e),console.error("Error",e.message)})}};const It='<g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2"><circle cx="22" cy="22" r="6"><animate attributeName="r" begin="1.5s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" begin="1.5s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-width" begin="1.5s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="22" cy="22" r="6"><animate attributeName="r" begin="3s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" begin="3s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"></animate><animate attributeName="stroke-width" begin="3s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"></animate></circle><circle cx="22" cy="22" r="8"><animate attributeName="r" begin="0s" dur="1.5s" values="6;1;2;3;4;5;6" calcMode="linear" repeatCount="indefinite"></animate></circle></g>';var Kt=yt({name:"QSpinnerRings",props:St,setup(n){const{cSize:e,classes:t}=gt(n);return()=>vt("svg",{class:t.value,stroke:"currentColor",width:e.value,height:e.value,viewBox:"0 0 45 45",xmlns:"http://www.w3.org/2000/svg",innerHTML:It})}});export{I as D,j as E,$ as H,z as L,D as P,Kt as Q,U as R,kt as U,dt as a,R as b,W as c,q as d,at as e,B as f,ct as g,K as h,st as i,k as j,Y as k,wt as l,Et as m,Tt as p,Dt as u};