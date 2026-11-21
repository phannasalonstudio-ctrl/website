'use strict';
const galleryText={
 en:{filters:['All work','Finished looks','Before & after','Videos'],empty:['Our gallery is coming soon.','Finished looks are coming soon.','Transformations are coming soon.','Studio videos are coming soon.'],copy:'Customer photos, transformations, and videos will appear here as they are added.',before:'Before',after:'After',close:'Close photo',view:'View photo',count:n=>`${n} gallery item${n===1?'':'s'}`,description:'Explore finished looks, before-and-after photos, and videos from Phanna So Salon Studio.'},
 'zh-CN':{filters:['全部作品','造型作品','前后对比','视频'],empty:['作品集即将上线。','造型作品即将上线。','前后对比即将上线。','工作室视频即将上线。'],copy:'客户照片、前后对比和视频将在添加后展示于此。',before:'之前',after:'之后',close:'关闭照片',view:'查看照片',count:n=>`${n} 项作品`,description:'探索 Phanna So Salon Studio 的造型作品、前后对比照片和视频。'},
 es:{filters:['Todo','Looks terminados','Antes y después','Videos'],empty:['Nuestra galería estará disponible pronto.','Próximamente: looks terminados.','Próximamente: transformaciones.','Próximamente: videos del estudio.'],copy:'Las fotos de clientes, transformaciones y videos aparecerán aquí a medida que se añadan.',before:'Antes',after:'Después',close:'Cerrar foto',view:'Ver foto',count:n=>`${n} elemento${n===1?'':'s'}`,description:'Descubre looks terminados, fotos de antes y después y videos de Phanna So Salon Studio.'},
 ja:{filters:['すべて','仕上がり','ビフォー＆アフター','動画'],empty:['ギャラリーは近日公開予定です。','仕上がり写真は近日公開予定です。','ビフォー＆アフターは近日公開予定です。','スタジオ動画は近日公開予定です。'],copy:'お客さまの写真、ビフォー＆アフター、動画を順次掲載します。',before:'ビフォー',after:'アフター',close:'写真を閉じる',view:'写真を見る',count:n=>`${n}件の作品`,description:'Phanna So Salon Studioの仕上がり写真、ビフォー＆アフター、動画をご覧ください。'}
};
for(const [lang,labels] of Object.entries({en:['All photos & videos','Meet Phanna','Phanna’s photos are coming soon.'],'zh-CN':['全部照片与视频','认识 Phanna','Phanna 的照片即将上线。'],es:['Todas las fotos y videos','Conoce a Phanna','Próximamente: fotos de Phanna.'],ja:['すべての写真・動画','Phannaについて','Phannaの写真は近日公開予定です。']})){galleryText[lang].filters[0]=labels[0];galleryText[lang].filters.splice(1,0,labels[1]);galleryText[lang].empty.splice(1,0,labels[2]);}
const slideshowText={
 en:{previous:'Previous',next:'Next',thumbnails:'Choose a photo or video',slideshow:'Gallery slideshow',position:(i,n)=>`${i} of ${n}`,video:'Video'},
 'zh-CN':{previous:'上一张',next:'下一张',thumbnails:'选择照片或视频',slideshow:'作品幻灯片',position:(i,n)=>`${i} / ${n}`,video:'视频'},
 es:{previous:'Anterior',next:'Siguiente',thumbnails:'Elegir una foto o video',slideshow:'Presentación de la galería',position:(i,n)=>`${i} de ${n}`,video:'Video'},
 ja:{previous:'前へ',next:'次へ',thumbnails:'写真・動画を選ぶ',slideshow:'ギャラリースライドショー',position:(i,n)=>`${i} / ${n}`,video:'動画'}
};
let galleryFilter='photo',slideIndex=0,items=[];
const filterKeys=['all','portrait','photo','comparison','video'];
const grid=document.querySelector('#gallery-grid'),viewer=document.querySelector('#gallery-viewer');
const locale=()=>document.documentElement.lang;
const localized=value=>typeof value==='string'?value:(value?.[locale()]||value?.en||'');
const ui=()=>slideshowText[locale()]||slideshowText.en;
const copy=()=>galleryText[locale()]||galleryText.en;
function photo(src,alt,lazy=false){const img=document.createElement('img');img.src=src;img.alt=alt;img.loading=lazy?'lazy':'eager';img.decoding='async';return img;}
function arrow(direction){return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction==='previous'?'M15 5 8 12l7 7':'m9 5 7 7-7 7'}"/></svg>`;}
function selectSlide(index){
 if(!items.length)return;
 slideIndex=(index+items.length)%items.length;
 const item=items[slideIndex],title=localized(item.title),alt=localized(item.alt)||title,t=copy();
 const stage=grid.querySelector('.slide-stage');stage.querySelector('video')?.pause();stage.replaceChildren();
 if(item.type==='video'){
  const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.src=item.src;video.ariaLabel=title;
  if(item.poster)video.poster=item.poster;
  if(item.captions){const track=document.createElement('track');track.kind='captions';track.src=item.captions;track.srclang=item.captionLanguage||'en';track.label=item.captionLabel||'English';video.append(track);}
  stage.append(video);
 }else if(item.type==='comparison'){
  const pair=document.createElement('div');pair.className='comparison-images';
  for(const key of ['before','after']){const panel=document.createElement('div');panel.append(photo(item[key],t[key]+': '+alt));const label=document.createElement('span');label.textContent=t[key];panel.append(label);pair.append(panel);}stage.append(pair);
 }else{
  const button=document.createElement('button');button.type='button';button.className='slide-photo';button.ariaLabel=t.view+': '+title;button.append(photo(item.src,alt));
  button.onclick=()=>{viewer.querySelector('img').src=item.src;viewer.querySelector('img').alt=alt;viewer.querySelector('p').textContent=title;viewer.showModal();};stage.append(button);
 }
 grid.querySelector('.slide-caption').textContent=title;
 grid.querySelector('.slide-position').textContent=ui().position(slideIndex+1,items.length);
 grid.querySelectorAll('.gallery-thumbnail').forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===slideIndex));});
 const active=grid.querySelectorAll('.gallery-thumbnail')[slideIndex],rail=grid.querySelector('.gallery-thumbnails');
 if(active){const left=active.offsetLeft-rail.offsetLeft;rail.scrollLeft=Math.max(0,left-(rail.clientWidth-active.clientWidth)/2);}
}
function renderGallery(){
 grid.querySelector('video')?.pause();grid.replaceChildren();
 const t=copy(),u=ui();document.title=({en:'Gallery','zh-CN':'作品集',es:'Galería',ja:'ギャラリー'}[locale()]||'Gallery')+' — Phanna’s Salon';
 document.querySelectorAll('[data-filter]').forEach((b,i)=>{b.textContent=t.filters[i];b.setAttribute('aria-pressed',String(b.dataset.filter===galleryFilter));});
 items=(window.salonGallery||[]).filter(i=>galleryFilter==='all'||i.type===galleryFilter);
 document.querySelector('.gallery-empty').hidden=items.length>0;grid.hidden=!items.length;
 document.querySelector('#gallery-empty-title').textContent=t.empty[filterKeys.indexOf(galleryFilter)];document.querySelector('#gallery-empty-copy').textContent=t.copy;
 document.querySelector('.gallery-status').textContent=items.length?t.count(items.length):'';
 document.querySelector('.gallery-close').ariaLabel=t.close;document.querySelector('meta[name=description]').content=t.description;
 if(!items.length)return;
 grid.setAttribute('role','region');grid.setAttribute('aria-label',u.slideshow);
 const stage=document.createElement('div');stage.className='slide-stage';grid.append(stage);
 const toolbar=document.createElement('div');toolbar.className='slide-toolbar';
 const caption=document.createElement('p');caption.className='slide-caption';toolbar.append(caption);
 const controls=document.createElement('div');controls.className='slide-controls';
 const prev=document.createElement('button');prev.type='button';prev.className='slide-arrow';prev.ariaLabel=u.previous;prev.innerHTML=arrow('previous');prev.disabled=items.length<2;prev.onclick=()=>selectSlide(slideIndex-1);
 const position=document.createElement('span');position.className='slide-position';position.setAttribute('aria-live','polite');position.setAttribute('aria-atomic','true');
 const next=document.createElement('button');next.type='button';next.className='slide-arrow';next.ariaLabel=u.next;next.innerHTML=arrow('next');next.disabled=items.length<2;next.onclick=()=>selectSlide(slideIndex+1);
 controls.append(prev,position,next);toolbar.append(controls);grid.append(toolbar);
 const thumbnails=document.createElement('div');thumbnails.className='gallery-thumbnails';thumbnails.setAttribute('role','group');thumbnails.ariaLabel=u.thumbnails;
 items.forEach((item,i)=>{
  const button=document.createElement('button');button.type='button';button.className='gallery-thumbnail';button.ariaLabel=ui().position(i+1,items.length)+': '+localized(item.title);
  if(item.type==='video'&&!item.poster){const preview=document.createElement('video');preview.src=item.src+'#t=0.1';preview.preload='metadata';preview.muted=true;preview.playsInline=true;preview.tabIndex=-1;preview.setAttribute('aria-hidden','true');button.append(preview);}
  else button.append(photo(item.poster||item.src||item.after,'',true));
  if(item.type==='video'){const badge=document.createElement('span');badge.className='thumbnail-badge';badge.textContent=u.video;button.append(badge);}
  button.onclick=()=>selectSlide(i);thumbnails.append(button);
 });grid.append(thumbnails);selectSlide(Math.min(slideIndex,items.length-1));
}
grid.addEventListener('keydown',e=>{
 if(e.target.closest('video')||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
 e.preventDefault();const index=e.key==='Home'?0:e.key==='End'?items.length-1:slideIndex+(e.key==='ArrowLeft'?-1:1);selectSlide(index);
 if(e.target.closest('.gallery-thumbnail'))grid.querySelectorAll('.gallery-thumbnail')[slideIndex]?.focus({preventScroll:true});
});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{galleryFilter=b.dataset.filter;slideIndex=0;renderGallery();}));
document.querySelector('.gallery-close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close();}});
document.addEventListener('languagechange',renderGallery);renderGallery();
