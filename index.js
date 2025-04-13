import{a as m,S as f,i as l}from"./assets/vendor-DSdoZYMr.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=a(e);fetch(e.href,r)}})();const p="49640008-31ceefc585112d8f472f2aefe",y="https://pixabay.com/api/";async function g(o,t=1){const{data:a}=await m.get(y,{params:{key:p,q:o,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:15,page:t}});return a}function h(o){const t=o.map(({webformatURL:s,tags:e})=>`
        <li class="gallery-item">
            <a href="${s}">
            <div class="loader"></div>
                <img src="${s}" alt="${e}" />
            </a>
            <div class="image-info">
                <p class="info-item"><span class="info-value">Likes:</span> ${image.likes}</p>
                <p class="info-item"><span class="info-value">Views:</span> ${image.views}</p>
                <p class="info-item"><span class="info-value">Comments:</span> ${image.comments}</p>
                <p class="info-item"><span class="info-value">Downloads:</span> ${image.downloads}</p>
            </div>
        </li>
    `).join("");document.querySelector(".gallery").innerHTML+=t,new f(".gallery a").refresh()}function v(){document.querySelector(".gallery").innerHTML=""}function L(){document.querySelector(".loader").classList.add("visible")}function u(){document.querySelector(".loader").classList.remove("visible")}function S(){document.querySelector(".load-more").classList.add("visible")}let n="",c=1,d=0;document.querySelector(".js-image-list");document.querySelector(".js-load-more");document.querySelector(".search-form");document.querySelector(".gallery-item");function q(o){console.log("Touch started",o)}document.addEventListener("touchstart",q,{passive:!0});console.log(document.querySelector(".search-form"));document.querySelector(".search-form").addEventListener("submit",async o=>{if(o.preventDefault(),n=o.target.elements.searchQuery.value.trim(),c=1,v(),!!n)try{L();const t=await g(n,c);if(u(),d=t.totalHits,t.hits.length===0){l.error({message:"Нічого не знайдено"});return}h(t.hits),c<Math.ceil(d/15)&&S()}catch{u(),l.error({message:"Помилка завантаження"})}});
//# sourceMappingURL=index.js.map
