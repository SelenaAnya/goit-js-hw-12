import{S as g,i as d}from"./assets/vendor-BrddEoy-.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&c(a)}).observe(document,{childList:!0,subtree:!0});function o(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(t){if(t.ep)return;t.ep=!0;const r=o(t);fetch(t.href,r)}})();const h="49640008-31ceefc585112d8f472f2aefe",L="https://pixabay.com/api/";async function w(e=1,s){try{return(await axios(`${L}`,{params:{key:h,q:s,image_type:"photo",orientation:"horizontal",safesearch:!0,page:e,per_page:15}})).data}catch(o){console.error("Помилка запиту:",o)}}const u=document.querySelector(".js-image-list"),f=document.querySelector(".js-loader"),m=document.querySelector(".js-load-more");let b=new g(".gallery a");function v(e){const s=e.map(o=>`
        <li class="gallery-item">
            <a href="${o.largeImageURL}">
                <div class="image-container">
                    <span class="loader"></span>
                    <img src="${o.webformatURL}" alt="${o.tags}" loading="lazy">
                </div>
            </a>
            <div class="image-info">
                <p><strong>Likes:</strong> ${o.likes}</p>
                <p><strong>Views:</strong> ${o.views}</p>
                <p><strong>Comments:</strong> ${o.comments}</p>
                <p><strong>Downloads:</strong> ${o.downloads}</p>
            </div>
        </li>
    `).join("");u.insertAdjacentHTML("beforeend",s),b.refresh(),p()}function S(){u.innerHTML=""}function $(){f.style.display="block"}function p(){f.style.display="none"}function q(){m.style.display="block"}function i(){m.style.display="none"}const I=document.querySelector("#search-form"),B=document.querySelector(".js-load-more");let l="",n=1;I.addEventListener("submit",async e=>{e.preventDefault(),l=e.target.elements.search.value.trim(),l&&(n=1,S(),i(),y())});B.addEventListener("click",()=>{n++,y()});async function y(){$();const e=await w(n,l);if(p(),!e||!e.hits.length){d.error({title:"Oops!",message:"No images found."}),i();return}v(e.hits),n*15>=e.totalHits?(i(),d.info({title:"End of results",message:"We're sorry, but you've reached the end of search results."})):q(),M()}function M(){const e=document.querySelectorAll(".gallery-item");if(e.length>0){const o=e[e.length-1].getBoundingClientRect().height;window.scrollBy({top:o*2,behavior:"smooth"})}}
//# sourceMappingURL=index.js.map
