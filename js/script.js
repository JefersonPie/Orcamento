const servicos=[
{id:'site-institucional',nome:'Site Institucional',preco:450,dias:7},
{id:'landing-page',nome:'Landing Page',preco:280,dias:3},
{id:'loja-virtual',nome:'Loja Virtual',preco:850,dias:15},
{id:'cardapio-online',nome:'Cardápio Online',preco:320,dias:5},
{id:'sistema-orcamento',nome:'Sistema de Orçamento',preco:380,dias:7},
{id:'manutencao-sites',nome:'Manutenção de Sites',preco:120,dias:2}
];
const adicionais=[
{id:'design-personalizado',nome:'Design Personalizado',preco:180,dias:3},
{id:'whatsapp-integracao',nome:'Integração com WhatsApp',preco:90,dias:1},
{id:'seo-otimizacao',nome:'Otimização SEO',preco:150,dias:2},
{id:'hospedagem-dominio',nome:'Hospedagem e Domínio',preco:120,dias:1},
{id:'sistema-pagamento',nome:'Sistema de Pagamento',preco:240,dias:4},
{id:'responsividade-premium',nome:'Responsividade Premium',preco:120,dias:2}
];
const WHATSAPP_PHONE='5511999999999';
const servicesList=document.querySelector('.services-list');
const addonsList=document.querySelector('.addons-list');
const totalPriceEl=document.getElementById('total-price');
const estimatedDaysEl=document.getElementById('estimated-days');
const selectedServicesEl=document.getElementById('selected-services');
const shareWhatsappBtn=document.getElementById('share-whatsapp');
const generatePdfBtn=document.getElementById('generate-pdf');
const resetBtn=document.getElementById('reset');
const hamburger=document.getElementById('hamburger');
const navMenu=document.getElementById('nav-menu');

document.addEventListener('DOMContentLoaded',function(){
renderServices();
loadFromLocalStorage();
setupEventListeners();
initScrollAnimations();
});

function renderServices(){
servicos.forEach(s=>servicesList.appendChild(createItem(s)));
adicionais.forEach(a=>addonsList.appendChild(createItem(a)));
}

function createItem(item){
const div=document.createElement('div');
div.className='service-item';
div.innerHTML=`<input type="checkbox" id="${item.id}" data-preco="${item.preco}" data-dias="${item.dias}"><label for="${item.id}">${item.nome}</label>`;
return div;
}

function setupEventListeners(){
document.addEventListener('change',function(e){
if(e.target.matches('input[type="checkbox"]')){updateCalculation();saveToLocalStorage();}
});
shareWhatsappBtn.addEventListener('click',shareWhatsApp);
generatePdfBtn.addEventListener('click',generatePDF);
resetBtn.addEventListener('click',resetSimulator);
hamburger.addEventListener('click',()=>navMenu.classList.toggle('active'));
document.querySelectorAll('a[href^="#"]').forEach(a=>{
a.addEventListener('click',function(e){
e.preventDefault();
const t=document.querySelector(this.getAttribute('href'));
if(t){t.scrollIntoView({behavior:'smooth'});navMenu.classList.remove('active');}
});
});
}

function updateCalculation(){
let total=0,diasMax=0,selected=[];
[...document.querySelectorAll('input[type="checkbox"]:checked')].forEach(cb=>{
const p=parseInt(cb.dataset.preco),d=parseInt(cb.dataset.dias);
total+=p;diasMax=Math.max(diasMax,d);
selected.push(cb.closest('.service-item').querySelector('label').textContent);
});
totalPriceEl.textContent=total.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
estimatedDaysEl.textContent=diasMax?`${diasMax} a ${diasMax+3}`:'0';
renderSelectedServices(selected);
}

function renderSelectedServices(selected){
selectedServicesEl.innerHTML=selected.map(n=>`<div class="selected-item"><span>${n}</span><span class="price-small">${getPrice(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></div>`).join('');
}

function getPrice(nome){
const item=[...servicos,...adicionais].find(i=>i.nome===nome);
return item?item.preco:0;
}

function shareWhatsApp(){
const selected=[...document.querySelectorAll('input[type="checkbox"]:checked')].map(cb=>cb.closest('.service-item').querySelector('label').textContent);
const msg=`Olá! Gostaria de solicitar um orçamento.\n\nServiços selecionados:\n${selected.join('\n')}\n\nTotal: ${totalPriceEl.textContent}\nPrazo estimado: ${estimatedDaysEl.textContent}\n\nAguardo retorno!`;
window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`,'_blank');
}

function generatePDF(){
const{jsPDF}=window.jspdf;
const doc=new jsPDF();
doc.setFont('helvetica','bold');doc.setFontSize(20);
doc.text('Orçamento - Ocean Tech',20,20);
doc.setFontSize(12);
doc.text('Jéferson Piettro | Ocean Tech',20,30);
doc.text('Tecnologia sem limites.',20,38);
doc.text('Serviços Selecionados:',20,60);
doc.setFont('helvetica','normal');
const selected=[...document.querySelectorAll('input[type="checkbox"]:checked')].map(cb=>cb.closest('.service-item').querySelector('label').textContent);
selected.forEach((s,i)=>doc.text(`• ${s}`,20,70+(i*8)));
doc.setFont('helvetica','bold');doc.setFontSize(16);
doc.text(`Total: ${totalPriceEl.textContent}`,20,90+(selected.length*8));
doc.text(`Prazo estimado: ${estimatedDaysEl.textContent} dias`,20,100+(selected.length*8));
doc.setFontSize(10);
doc.text('© 2026 Ocean Tech - Todos os direitos reservados.',20,280);
doc.save('orcamento-oceantech.pdf');
}

function resetSimulator(){
document.querySelectorAll('input[type="checkbox"]').forEach(cb=>cb.checked=false);
updateCalculation();saveToLocalStorage();
}

function saveToLocalStorage(){
const sel={};
document.querySelectorAll('input[type="checkbox"]').forEach(cb=>sel[cb.id]=cb.checked);
localStorage.setItem('orcamentoSelections',JSON.stringify(sel));
}

function loadFromLocalStorage(){
const saved=localStorage.getItem('orcamentoSelections');
if(saved){
const sel=JSON.parse(saved);
Object.keys(sel).forEach(id=>{const cb=document.getElementById(id);if(cb)cb.checked=sel[id];});
updateCalculation();
}
}

function initScrollAnimations(){
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}));
document.querySelectorAll('.service-card,.about,.contact,.portfolio-card').forEach(el=>{el.classList.add('fade-in');obs.observe(el);});
}

window.addEventListener('scroll',()=>{
const h=document.querySelector('.header');
if(window.scrollY>100){
h.style.background='rgba(255,255,255,0.98)';
h.style.boxShadow='0 2px 20px rgba(0,0,0,0.1)';
}else{
h.style.background='rgba(255,255,255,0.95)';
h.style.boxShadow='none';
}
});
