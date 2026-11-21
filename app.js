document.querySelector("#year").textContent=new Date().getFullYear();
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{location.href='appointments.html?service='+encodeURIComponent(button.dataset.service);}));
if(document.querySelector("#booking-form")){
'use strict';
const form=document.querySelector('#booking-form');
const date=document.querySelector('#date');
const today=new Date();
const localDate=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
const t=key=>window.salonI18n.t(key);
date.min=localDate;

let draft='';
function hideDraft(){document.querySelector('#request-result').hidden=true;draft='';}
function validateField(field){
 field.setCustomValidity('');
 if(field.required&&!field.value)field.setCustomValidity(t('required'));
 else if(field.id==='name'&&!field.value.trim())field.setCustomValidity(t('blank'));
 else if(field.id==='date'&&field.value<localDate)field.setCustomValidity(t('past'));
}
form.querySelectorAll('[required]').forEach(field=>{
 field.addEventListener('invalid',()=>validateField(field));
 field.addEventListener('input',()=>field.setCustomValidity(''));
 field.addEventListener('change',()=>field.setCustomValidity(''));
});
function renderDraft(){
 const data=new FormData(form);
 const displayDate=new Intl.DateTimeFormat(window.salonI18n.locale(),{dateStyle:'long'}).format(new Date(date.value+'T12:00:00'));
 draft=`Phanna’s Salon — ${t('draftTitle')}\n\n${t('name')}: ${String(data.get('name')).trim()}\n${t('service')}: ${document.querySelector('#service').selectedOptions[0].textContent}\n${t('date')}: ${displayDate}\n${t('time')}: ${document.querySelector('#time').selectedOptions[0].textContent}\n${t('notes')}: ${String(data.get('notes')).trim()||t('none')}\n\n${t('unconfirmed')}`;
 document.querySelector('#summary').textContent=draft;
 document.querySelector('#request-result').hidden=false;
}
form.addEventListener('submit',event=>{
 event.preventDefault();form.querySelectorAll('[required]').forEach(validateField);if(!form.reportValidity())return;
 renderDraft();document.querySelector('#request-result').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});
form.addEventListener('input',hideDraft);
form.addEventListener('change',hideDraft);
document.addEventListener('languagechange',()=>{
 form.querySelectorAll('[required]').forEach(field=>field.setCustomValidity(''));
 if(draft)renderDraft();
});
document.querySelector('#download').addEventListener('click',()=>{
 if(!draft)return;
 const url=URL.createObjectURL(new Blob(['\uFEFF'+draft],{type:'text/plain;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download=`phannas-salon-${window.salonI18n.locale()}-request.txt`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});

const requested=new URLSearchParams(location.search).get("service");if(requested&&[...document.querySelector("#service").options].some(o=>o.value===requested))document.querySelector("#service").value=requested;
}
