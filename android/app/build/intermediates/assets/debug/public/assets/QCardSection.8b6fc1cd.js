import{z as r,c as e,h as n}from"./index.8cc0be75.js";import{a as s}from"./QBtn.bc754139.js";var l=r({name:"QCardSection",props:{tag:{type:String,default:"div"},horizontal:Boolean},setup(t,{slots:a}){const o=e(()=>`q-card__section q-card__section--${t.horizontal===!0?"horiz row no-wrap":"vert"}`);return()=>n(t.tag,{class:o.value},s(a.default))}});export{l as Q};