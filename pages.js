'use strict';
const page=document.body.dataset.page;
const pageNames={gallery:["Gallery","作品集","Galería","ギャラリー"],index:['Home','首页','Inicio','ホーム'],services:['Services','服务项目','Servicios','サービス'],about:['About','关于我们','Acerca de','私たちについて'],contact:['Contact','联系','Contacto','お問い合わせ'],appointments:['Appointment Planner','到店计划','Planificador de citas','ご来店プラン']};
function updatePageTitle(){const locale=['en','zh-CN','es','ja'].indexOf(document.documentElement.lang);document.title=pageNames[page][Math.max(0,locale)]+' — Phanna’s Salon';}
document.addEventListener('languagechange',updatePageTitle);updatePageTitle();
if(page==='index'){const legacy={services:'menu.html',hair:'menu.html#menu-category-1',nails:'menu.html#menu-category-12',massage:'menu.html#menu-category-13',about:'about.html',credentials:'about.html#credentials',booking:'appointments.html'};function redirectLegacy(){const target=legacy[location.hash.slice(1)];if(target)location.replace(target);}window.addEventListener('hashchange',redirectLegacy);redirectLegacy();}
