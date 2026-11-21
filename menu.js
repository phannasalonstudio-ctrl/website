'use strict';
const categories=[...document.querySelectorAll('.menu-category')];
const search=document.querySelector('#menu-search');
const toggle=document.querySelector('#toggle-menu');
const status=document.querySelector('#menu-status');
const picker=document.querySelector('#language');
const supported=['en','zh-CN','es','ja'];
const dictionary=window.menuTranslations;
let menuLanguage='en';
const ui={
 en:{expand:'Expand all categories',collapse:'Collapse all categories',back:'Browse other categories',placeholder:'Try balayage, manicure, or extensions',count:n=>`${n} service categories`,matches:n=>`${n} matching ${n===1?'category':'categories'}`,language:'Language',menu:'Full service menu',categories:'Service categories',note:'All prices are in US dollars.',description:'Explore the full service menu, prices, appointment estimates, and extension policies at Phanna So Salon Studio.'},
 'zh-CN':{expand:'展开所有分类',collapse:'收起所有分类',back:'浏览其他分类',placeholder:'试试巴黎画染、美甲或接发',count:n=>`${n}个服务分类`,matches:n=>`找到${n}个匹配分类`,language:'语言',menu:'完整服务菜单',categories:'服务分类',note:'所有价格均以美元计价。',description:'查看 Phanna So Salon Studio 的完整服务菜单、价格、预计时长及接发政策。'},
 es:{expand:'Expandir todas las categorías',collapse:'Contraer todas las categorías',back:'Ver otras categorías',placeholder:'Prueba balayage, manicura o extensiones',count:n=>`${n} categorías de servicios`,matches:n=>`${n} ${n===1?'categoría coincidente':'categorías coincidentes'}`,language:'Idioma',menu:'Menú completo de servicios',categories:'Categorías de servicios',note:'Todos los precios están en dólares estadounidenses.',description:'Consulta el menú completo, precios, duración estimada y políticas de extensiones de Phanna So Salon Studio.'},
 ja:{expand:'すべてのカテゴリーを開く',collapse:'すべてのカテゴリーを閉じる',back:'ほかのカテゴリーを見る',placeholder:'バレイヤージュ、ネイル、エクステなど',count:n=>`${n}件のサービスカテゴリー`,matches:n=>`${n}件のカテゴリーが一致`,language:'言語',menu:'全サービスメニュー',categories:'サービスカテゴリー',note:'料金はすべて米ドルです。',description:'Phanna So Salon Studioの全サービス、料金、所要時間の目安、エクステに関するご案内。'}
};
const normalize=s=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase().trim();
// Search every language, so a query remains useful after switching languages.
const searchIndex=new Map(categories.map(category=>{
 const walker=document.createTreeWalker(category,NodeFilter.SHOW_TEXT);let node;const parts=[];
 while(node=walker.nextNode()){const key=node.textContent.trim();parts.push(key,...(dictionary[key]||[]));}
 return [category,normalize(parts.join(' '))];
}));
function updateToggle(){const visible=categories.filter(c=>!c.hidden);toggle.textContent=visible.length&&visible.every(c=>c.open)?ui[menuLanguage].collapse:ui[menuLanguage].expand;toggle.disabled=!visible.length;}
function updateStatus(){const count=categories.filter(c=>!c.hidden).length;status.textContent=search.value.trim()?ui[menuLanguage].matches(count):ui[menuLanguage].count(count);}
function filterMenu(){const query=normalize(search.value);let count=0;for(const category of categories){const match=!query||searchIndex.get(category).includes(query);category.hidden=!match;if(query&&match)category.open=true;if(!query)category.open=category===categories[0];if(match)count++;}document.querySelector('#menu-empty').hidden=count>0;updateStatus();updateToggle();}
search.addEventListener('input',filterMenu);
document.querySelector('#clear-search').addEventListener('click',()=>{search.value='';filterMenu();search.focus();});
toggle.addEventListener('click',()=>{const visible=categories.filter(c=>!c.hidden);const open=!visible.every(c=>c.open);visible.forEach(c=>c.open=open);updateToggle();});
const shortcuts=document.querySelector('#category-shortcuts');
for(const category of categories){
 const button=document.createElement('button');button.type='button';button.className='category-shortcut';
 button.textContent=category.querySelector('.category-label>span').textContent;
 button.setAttribute('aria-controls',category.id);button.setAttribute('aria-expanded',String(category.open));
 button.addEventListener('click',()=>{if(search.value){search.value='';filterMenu();}category.open=true;category.querySelector('summary').focus({preventScroll:true});category.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});});
 category.addEventListener('toggle',()=>{button.setAttribute('aria-expanded',String(category.open));updateToggle();});
 shortcuts.append(button);
 const back=document.createElement('a');back.href='#browse-services';back.className='menu-browse-back';back.textContent=ui.en.back;category.querySelector('.menu-body').append(back);
}
// Translate text nodes in place to preserve price markup, icons and event listeners.
const textRecords=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:node=>node.parentElement.closest('script,style,select,.language-bar')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
let textNode;
while(textNode=walker.nextNode()){const key=textNode.textContent.trim();if(dictionary[key])textRecords.push({node:textNode,original:textNode.textContent,key});}
function setMenuLanguage(lang){
 menuLanguage=supported.includes(lang)?lang:'en';const index=supported.indexOf(menuLanguage)-1;
 for(const {node,original,key} of textRecords)node.textContent=index<0?original:original.replace(key,dictionary[key][index]);
 document.documentElement.lang=menuLanguage;
 document.title=index<0?'Full Service Menu — Phanna So Salon Studio':dictionary['Full Service Menu — Phanna So Salon Studio'][index];
 document.querySelector('meta[name="description"]').content=ui[menuLanguage].description;
 document.querySelector('#menu-language-note').textContent=ui[menuLanguage].note;
 document.querySelectorAll('.menu-browse-back').forEach(a=>a.textContent=ui[menuLanguage].back);
 search.placeholder=ui[menuLanguage].placeholder;
 document.querySelector('#full-menu').setAttribute('aria-label',ui[menuLanguage].menu);
 shortcuts.setAttribute('aria-label',ui[menuLanguage].categories);
 picker.value=menuLanguage;picker.setAttribute('aria-label',ui[menuLanguage].language);
 updateStatus();updateToggle();
 try{localStorage.setItem('phanna-language',menuLanguage);}catch{}
 document.dispatchEvent(new Event('languagechange'));
}
picker.addEventListener('change',()=>setMenuLanguage(picker.value));
filterMenu();
let initialLanguage='en';try{initialLanguage=localStorage.getItem('phanna-language')||'en';}catch{}
setMenuLanguage(initialLanguage);

function openLinkedCategory(){const id=location.hash.slice(1);const category=categories.find(c=>c.id===id);if(category){search.value='';filterMenu();category.open=true;category.scrollIntoView({block:'start'});}}
window.addEventListener('hashchange',openLinkedCategory);openLinkedCategory();
