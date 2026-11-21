// Shared, compact labels keep every primary destination on one mobile row.
(()=>{
 const names={en:['Home','Services','Gallery','About','Contact'],'zh-CN':['首页','服务','作品集','关于','联系'],es:['Inicio','Servicios','Galería','Acerca','Contacto'],ja:['ホーム','サービス','作品集','紹介','連絡']};
 function translate(){const labels=names[document.documentElement.lang]||names.en;document.querySelectorAll('.site-nav [data-nav]').forEach((link,i)=>link.textContent=labels[i]);}
 document.addEventListener('languagechange',translate);translate();
})();
