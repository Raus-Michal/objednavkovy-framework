
class Kalendar {
readonly p_id:string="b"; // počáteční id každého buttonu ke kterému je přiřazeno v HTML číslo 1-31 ... b1.b2->b31
readonly m_a_r_id:string="mesic_a_rok"; // id inputu s měsícem a rokem
readonly den_id:string="d"; // počáteční id každého dne v týdnu v kalendáři <p> Po,Út,St,Čt,Pá,So,Ne
private poloha:number=0; // proměnná určuje polohu kalendáře 0===default, 1-krok o měsíc dále , 2-krok o dva měsíce dále
private book_den:number[]=[0,0,0]; // zápis booklého dne uživatelem : rok, měsíc, den
readonly facke_checked_id:string="fake-checked"; // id input type chacked - fake chacked, který nedošle formulář, dokud není od uživatele označený konkrétní den
readonly color_oznacen:string="rgb(87,168,110)"; // barva označeného buttonu s dnem v měsíci zvoleným uživatelem
readonly color_NEoznacen:string="white"; // barva neoznačeného buttonu s dny v měsíci
readonly z_posun_id:string="pb"; // začátek id vyplňovacích bloků pro posun buttonu s čísly dnů v kalendáři (id="pb1" až id="pb6")

get rezervovane_datum()
{
// getter vrací pole s vybraným datumem od uživatele [rok, měsíc(0-11), den]:number[]
if(this.byl_vybran_datum)
{
return this.book_den; // vrací pole s vybraným datumem od uživatele [rok, měsíc(0-11), den]:number[]
}
return [9999,9999,9999]; // uživatel nevybral datum a návratová hodnota je taková, aby bylo možné odfiltrovat nezadání uživatele 
};


get aktualni_poloha(){
// getter slouží k zaslání aktuální polohy uživatele v kalendáři, jetomu poroto, aby private this.poloha mohl měnit použe objekt této třídy
return this.poloha; // getter vrací aktuální polohu uživatele v kalendáři
};

get byl_vybran_datum(){
// getter složí k odpovědi, zda uživatel vybral datum, pokud ano bude TRUE, pokud ne, bude FALSE
if(this.book_den.some(value=>value!==0))
{
// some() - kontroluje, že alespoň jedna hodnota v poli se nerovná 0
return true; // pokud se všechny prvky v poli !==0 uživatel vybral datum
}
return false; // pokud se včechny prvky v poli===0, uživatel nevybral datum
};


set posun(kam:number){
// setter bude nastavovat maximální a minimální hodnotu this.poloha
if(kam===+1)
{
// pokud se přidává poloha o 1 - vpřed
this.poloha++;
if(this.poloha>12)
{
// pokud je posun více jak o 12 měsíců
this.poloha=12; // maximální posun je 12 měsíců
}
}
else if(kam===-1)
{
// pokud se odebírá poloha o 1 - vzad
this.poloha--;
if(this.poloha<0)
{
// pokud je snaha vrátit se datumově zpět
this.poloha=0; // poloha bude 0 - není možné se vrátit zpět
}
}

};


vytvorit(){
// funkce vytvoří k buttonum s daty čísla

const dny:string[]=[]; // pole určuje všechny id buttony pro dny v měsíci

for(let i=1;i<32;i++)
{
let nazev:string=`${this.p_id}${i}`; // k názvu přiřadí odpovídající číslici
dny.push(nazev); // pushne název id buttonu do pole
}



const d=dny.length; // délka pole
for(let i=0;i<d;i++)
{
const button_i=document.getElementById(dny[i]); // konkrétní button s číslem dne v měsíci
if(button_i)
{
// pokud HTML objekt pod Id existuje
const cislo=i+1; // dny začínají od 1, i=0, proto bude číslo dnu vždy +1
const cislo_t=cislo.toString(); // převede proměnou type number na string
(button_i as HTMLButtonElement).innerText=cislo_t; // přepíše text buttonu na konkrétní číslo 1-28,1-30,1-31
}
}

};

upravit(){
// funkce zablokuje pro booking dny které v měsíci už uběhly a den následující

let a_d=datum.den_v_mesici; // aktuální den v měsíci 1-31,1-30,1-28 ...

for(let i=1;i<32;i++)
{
// smyčka povolí posluchače všem buttonům od 1-31
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if(button_i)
{
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).addEventListener("click",this); // přidělí posluchač událostí buttonu
}
}

if(this.poloha===0)
{
// pokud bude poloha uživatel v kalendáři nezměněna
if(a_d!==1)
{
// pokud se právě aktuální den v měsíci !== 1 (tedy to není první den v měsící), budou se odebírat buttony pro objenání do tohoto dne v měsíci
const hours = new Date().getHours(); // Získání aktuální hodiny
if(hours>17)
{
// pokud je po 18 hod - zablokuje se booking i následujícího dne
a_d++; // +1 === blokace ještě dalšího dne
}

for(let i=1;i<a_d+1;i++)
{
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if(button_i)
{
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).disabled=true; // udělá disabled na buttonu na dny, které už v měsíci uplynuly včetně dnešního
(button_i as HTMLButtonElement).removeEventListener("click",this); // odebere posluchač buttonům, které ho nepotřebují
}}
}
else
{
// pokud právě aktuální den v měsíci je prvního - bude se odebírat tento den
const button_i=document.getElementById(`${this.p_id}${a_d}`); // konkrétní button s číslem dne v měsíci
if(button_i)
{
(button_i as HTMLButtonElement).disabled=true; // udělá disabled na buttonu 1. v měsíci
(button_i as HTMLButtonElement).removeEventListener("click",this); // odebere posluchač buttonům, které ho nepotřebují
}

const hours = new Date().getHours(); // Získání aktuální hodiny
if(hours>17)
{
// pokud je po 18 hod - zablokuje se booking i následujícíiho dne
a_d++; // +1 === blokace ještě dalšího dne
const button_i2=document.getElementById(`${this.p_id}${a_d}`); // konkrétní button s číslem dne v měsíci
if(button_i2){
(button_i2 as HTMLButtonElement).disabled=true; // udělá disabled na buttonu 2. v měsíci
(button_i2 as HTMLButtonElement).removeEventListener("click",this); // odebere posluchač buttonům, které ho nepotřebují
}}
}
}
else
{
// pokud nebude kalendář v poloze===0

for(let i=1;i<32;i++){
// pomocí této smičky, budou všechny buttony připravené
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if (button_i){
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).disabled=false; // udělá odstraní disabled na všech buttonech
}
}

if(this.poloha===1)
{
// opatření pokud je další den dnem 1. v měsíci anebo obden je dnem 1. v měsíci a je po 18 hod., provede se opatření při pohybu v kalendáři na další měsíc

const hours=new Date().getHours(); // Získání aktuální hodiny
const today = new Date(); // do proměnné načte objekt Date
const nextDay=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1); // zjistí datum, které je jeden den po dnešním dni

const button_1 = document.getElementById(`${this.p_id}1`); // 1. button s číslem dne v měsíci (tedy 1. den toho měsíce)
const button_2 = document.getElementById(`${this.p_id}2`); // 2. button s číslem dne v měsíci (tedy 2. den toho měsíce)

if(nextDay.getDate()===1)
{
// pokud je datum po dnešním dni === 1, bude zítra 1. dalšího měsíce

if(button_1)
{
// pokud HTML element existuje
(button_1 as HTMLButtonElement).disabled=true; // udělá disabled na buttonu 1. v měsíci
(button_1 as HTMLButtonElement).removeEventListener("click",this); // odebere posluchač buttonu 1. v měsíci
}

if(hours>17){
// pokud je po 18 hod - zablokuje se booking i následujícího dne
(button_2 as HTMLButtonElement).disabled=true; // udělá disabled na buttonu 2. v měsíci
(button_2 as HTMLButtonElement).removeEventListener("click",this); // odebere posluchač buttonu 2. v měsíci
}}

const every_other_day=new Date(today.getFullYear(),today.getMonth(),today.getDate()+2); // zjistí datum, který je dva dny po dnešním dni

if(every_other_day.getDate()===1&&hours>17)
{
// pokud je dva dny po dnešním dni 1. den v měsíci a je po 18 hodině
if(button_1)
{
// pokud HTML element existuje
(button_1 as HTMLButtonElement).disabled=true; // udělá disabled na buttonu 1. v měsíci
(button_1 as HTMLButtonElement).removeEventListener("click",this); // odebere posluchač buttonu 1. v měsíci
}}
}}
};


odebrat_dny(){
// funkce odebre nadbytečné dny v měsíci
let cmp=datum.mesic_v_roce+this.poloha; // aktuální číslo měsíce vzhledem k poloze uživatele v kalendáři
    
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...
    
if(cmp>11)
{
// pokud bude aktuální číslo měsíce vzhledem k poloze uživatele v kalendáři více jak 12.měsíc
cmp=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // přidá se jeden rok
}
const pdva=datum.dnu_v_mesici(a_r,cmp); // funkce vrací počet dní v aktuálním měsíci datum.dnu_v_mesici(rok,měsíc)

for(let i=1;i<32;i++)
{
// smyčka zneviditelní všechny budttony v měsíci
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).style.visibility="hidden"; // zneviditelní button s dnem v měsíci
}}

for(let i=1;i<pdva+1;i++)
{
// smyčka nechá vidět jen počet konkrétních buttonů v měsíci
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).style.visibility="visible"; // zviditelní button s dnem v měsíci
}}

for(let i=pdva+1;i<32;i++)
{
// smyška odebere posluchače všem odebraným buttonům
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).removeEventListener("click",this); // odebere posluchač konkrétnímu buttonu
}
}

};

nazev_mesice(){
// funkce přepíše název měsíce a roku v input měsíc a rok


let a_m=datum.mesic_v_roce+this.poloha; // datum.mesic_v_roce je gettter, kde návratová hodnota je aktuální měsíc v roce, kde leden je 0 a prosinec 11 + this.poloha určuje aktuální polohu uživatele v kalendáři
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...

if(a_m>11)
{
// pokud bude měsíc prosinec, začnou měsíce od ledna a přičte se rok
a_m=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // rok se zvětší o 1
}


const a_m_nazev=datum.mesice[a_m]; // název aktuálního měsíce slovně jako string: leden, únor, březen, duben, květen, červen, červenec, srpen, září, říjen, listopad, prosinec

const text=document.getElementById(this.m_a_r_id); // input s měsícem a rokem
if(text)
{
(text as HTMLInputElement).value=`${a_m_nazev} ${a_r}`; // změní value inputu s měsícem a rokem
}

};
poradi_dnu(){
// funkce upraví v kalendáři pořadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce

let a_m=datum.mesic_v_roce+this.poloha; // datum.mesic_v_roce je gettter, kde návratová hodnota je aktuální měsíc v roce, kde leden je 0 a prosinec 11 + this.poloha určuje aktuální polohu uživatele v kalendáři
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...

if(a_m>11)
{
// pokud bude měsíc prosinec, začnou měsíce od ledna a přičte se rok
a_m=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // rok se zvětší o 1
}

for(let i=0;i<6;i++)
{
// smyčka zruší všechny posouvací bloky: 6 === počet posouvacích bloků (ib1-pb6)
const p_b=document.getElementById(`${this.z_posun_id}${i+1}`); // HTML P element zastupující posun dny v týdnu Po-Ne: id je číslováno od 1 proto i+1
if(p_b)
{
// pokud HTML element existuje
(p_b as HTMLElement).style.display="none"; // schová HTML P element
}
}

const a_d_m = new Date(a_r,a_m,1).getDay(); // první den v měsíci (1. den) - kde 0 je neděle

let posunovaci_bloky=a_d_m-1; // určí celkový počet bloků - jelikož máme v kalendáří Po-Ne a v Javascriptu je Ne-Po je tam -1

if(posunovaci_bloky===-1)
{
// pokud výjde záporné číslo - jedná se o neděli a musí být posun 6
posunovaci_bloky=6; // posun o 6
}

for(let i=0;i<posunovaci_bloky;i++)
{
const p_b=document.getElementById(`${this.z_posun_id}${i+1}`); // HTML P element zastupující posun dny v týdnu Po-Ne
if(p_b)
{
// pokud HTML Element existuje
(p_b as HTMLElement).style.display="flex"; // zobrazí vyplňovací HTML P element
}
}
};



handleEvent(e:any){
const k:string=e.target.id;
const cislo_dne:number=parseInt(`${k[1]}${k[2]}`);

let a_m=datum.mesic_v_roce+this.poloha; // datum.mesic_v_roce je gettter, kde návratová hodnota je aktuální měsíc v roce, kde leden je 0 a prosinec 11 + this.poloha určuje aktuální polohu uživatele v kalendáři
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...

if(a_m>11)
{
// pokud bude měsíc prosinec, začnou měsíce od ledna a přičte se rok
a_m=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // rok se zvětší o 1
}

this.book_den[0]=a_r; // zapíše do pole book_den - rok
this.book_den[1]=a_m; // zapíše do pole book_den - měsíc
this.book_den[2]=cislo_dne; // zapíše do pole book_den - den

const fake_check=document.getElementById(this.facke_checked_id); // HTML input type checked, který se zatrhne, aby se formuzlář mohl odeslat
if(fake_check)
{
// pokud HTML element existuje
(fake_check as HTMLInputElement).checked=true; // zatrhne checked u input type checked - fake checked
}

this.oznacit_den(); // funkce zajišťuje označení konkrétního dne


};
oznacit_den(){
// funkce zajistí označení konkrétního dne uživatelem

let a_m=datum.mesic_v_roce+this.poloha; // datum.mesic_v_roce je gettter, kde návratová hodnota je aktuální měsíc v roce, kde leden je 0 a prosinec 11 + this.poloha určuje aktuální polohu uživatele v kalendáři
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...

if(a_m>11)
{
// pokud bude měsíc prosinec, začnou měsíce od ledna a přičte se rok
a_m=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // rok se zvětší o 1
}

for(let i=1;i<32;i++)
{
// smyčka všechny buttony přebarví na default barvu
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
button_i.style.backgroundColor=this.color_NEoznacen; // přidá buttonu barvu NEoznačeného buttonu
}}

if(a_r===this.book_den[0]&&a_m===this.book_den[1])
{
const button_i=document.getElementById(`${this.p_id}${this.book_den[2]}`); // konkrétní button s číslem dne v měsíci
if(button_i){
// pokud HTML objekt pod Id existuje
button_i.style.backgroundColor=this.color_oznacen; // přidá buttonu barvu označeného buttonu
}
}
}
};



class Mesic_a_rok{
readonly id_posun=["m_minus","m_plus"]; // id šipek s posunem měsíce 0===vzad, 1===vpřed
readonly id_text="mesic_a_rok"; // id inputu s textem měsíc a rok
readonly id_kalendar="plocha_kalendar"; // ide Fielsetu kalendáře, kde jsou dny Po-Pá, dny v měsící 1-31, výplně 1-6
private touchStartX:number=0; // zachycení začátku pohybu uživatele prstem na obrazovce (osa X)
private touchEndX:number=0; // zachycení konce pohybu uživatele prstem na obrazovce (osa X)
private touchStartY:number=0; // zachycení začátku pohybu uživatele prstem na obrazovce (osa Y)
private touchEndY:number=0; // zachycení konce pohybu uživatele prstem na obrazovce (osa Y)
aktivace(){
// funkce aktivuje posluchače šipek měsíc vzad a vpřed

const butt_1=document.getElementById(this.id_posun[0]); // button šipka vzad
const butt_2=document.getElementById(this.id_posun[1]); // button šipka vpřed

if(butt_1)
{
// pokud existuhe HTML objekt button šipka vzad
butt_1.addEventListener("click",this); // posluchač click pro šipku vzad
}

if(butt_2)
{
// pokud existuhe HTML objekt button šipka vpřed
butt_2.addEventListener("click",this); // posluchač click pro šipku vpřed
}
const plocha_dny=document.getElementById(this.id_kalendar); // Fielset - plocha kalendáře

if(plocha_dny)
{
// Posluchač pro začátek dotyku
(plocha_dny as HTMLFieldSetElement).addEventListener("touchstart",(e)=>{
this.touchStartX=e.touches[0].clientX; // počáteční souřadnice pohybu po ose X
this.touchStartY=e.touches[0].clientY; // počáteční souřadnice pohybu po ose Y
},{passive:true}); // Pokud je event listener označen jako pasivní ({ passive: true }), znamená to, že prohlížeč ví, že event handler nebude volat preventDefault(). To umožňuje prohlížeči optimalizovat chování stránky, což může vést ke zvýšení výkonu, zejména při posouvání na dotykových zařízeních. Jinými slovy, pasivní event listener říká prohlížeči: "Nebudu měnit výchozí chování této události, můžeš ji tedy zpracovat okamžitě."

// Posluchač pro pohyb prstu
(plocha_dny as HTMLFieldSetElement).addEventListener("touchmove",(e)=>{
this.touchEndX=e.touches[0].clientX;  // konečné souřadnice pohybu po ose X
this.touchEndY=e.touches[0].clientY; // konečné souřadnice pohybu po ose Y
},{passive:true}); // Pokud je event listener označen jako pasivní ({ passive: true }), znamená to, že prohlížeč ví, že event handler nebude volat preventDefault(). To umožňuje prohlížeči optimalizovat chování stránky, což může vést ke zvýšení výkonu, zejména při posouvání na dotykových zařízeních. Jinými slovy, pasivní event listener říká prohlížeči: "Nebudu měnit výchozí chování této události, můžeš ji tedy zpracovat okamžitě."

// Posluchač pro konec dotyku
(plocha_dny as HTMLFieldSetElement).addEventListener("touchend",(e)=>{
this.handleGesture(e); // funkce vyhodnotí zda uživatel udělal pohyb prstem na obrazovce vpravo nebo vlevo
},{passive:true});} // Pokud je event listener označen jako pasivní ({ passive: true }), znamená to, že prohlížeč ví, že event handler nebude volat preventDefault(). To umožňuje prohlížeči optimalizovat chování stránky, což může vést ke zvýšení výkonu, zejména při posouvání na dotykových zařízeních. Jinými slovy, pasivní event listener říká prohlížeči: "Nebudu měnit výchozí chování této události, můžeš ji tedy zpracovat okamžitě."
};
handleGesture(e:any){
 // funkce vyhodnotí zda uživatel udělal pohyb prstem na obrazovce vpravo nebo vlevo
const diffX=this.touchEndX-this.touchStartX; // rozdíl hodnoty počátečního dotku uživatele plochy a konečného ukončení pohybu (osa X)
const diffY=this.touchEndY-this.touchStartY; // rozdíl hodnoty počátečního dotku uživatele plochy a konečného ukončení pohybu (osa Y)
if(Math.abs(diffX)>50&&Math.abs(diffY)<30){ // Práh pohybu (X:50px,Y:30px)
if(diffX>0){
this.handleEvent(e,1); // tah doprava
}else{
this.handleEvent(e,2); // tah doleva
}}
this.touchStartX=this.touchStartY=this.touchEndX=this.touchEndY=0; // anulace hodnot po vyhodnocení Prahu pohybu
};
handleEvent(e:any,pohyb:number=0){
const k:string=e.currentTarget.id; // id odkazuje na prvek, na který je navázán posluchač události

let problik_posunu=()=>{
// interní funkce zajistí probliknutí plochy kalendáře se dny 1-31, aby uživatele vizuělné upozornil na posun, který nastal
const plocha_kalendare=document.getElementById(mesic_a_rok.id_kalendar); // načte objekt, kde je zobrazena plocha kalendáře dny v měsící 1-31
if(plocha_kalendare)
{
// pokud HTML element existuje
(plocha_kalendare as HTMLElement).style.opacity="0"; // opasity nastaví bez prodlení na 0
setTimeout(()=>{
(plocha_kalendare as HTMLElement).style.opacity="1"; // opacity nastaví s prodlením na 1, aby se zobrazil efekt postuopného transition opacity
},250);
}};

if(k===this.id_posun[0]||(pohyb===1&&k===this.id_kalendar))
{
// kliknuto na button VZAD, nebo tah uživatele prstem po kalendáři doprava
console.log("VZAD");
if(kalendar.aktualni_poloha!==0)
{
// pokud níní poloha kalendáře === 0, protože pozun vzad již není dále možný
problik_posunu(); // interní funkce zajistí probliknutí plochy kalendáře se dny 1-31, aby uživatele vizuělné upozornil na posun, který nastal
}
kalendar.posun=-1; // přičte +1 poloze uživatele v kalendáři
kalendar.nazev_mesice(); // upraví název měsíce vzhledem k aktuální poloze uživatele v kalendáři
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dny v aktuálním měsíci
kalendar.odebrat_dny(); // odebere přebytečné dny v konkrétním měsíci
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
kalendar.oznacit_den(); // funkce zajistí, že bude vždy oznacen den a pouze den, který zadal uživatel
}
else if(k===this.id_posun[1]||(pohyb===2&&k===this.id_kalendar))
{
// kliknuto na button VPŘED, nebo tah uživatele prstem po kalendáři doleva
console.log("VPŘED");
if(kalendar.aktualni_poloha!==12)
{
// pokud uživatel není v poloze kalendáře 12, ta je poslední a další pohyb vpřed, již není možný
problik_posunu(); // interní funkce zajistí probliknutí plochy kalendáře se dny 1-31, aby uživatele vizuělné upozornil na posun, který nastal
}
kalendar.posun=+1; // přičte +1 poloze uživatele v kalendáři, řešeno setterem
kalendar.nazev_mesice(); // upraví název měsíce vzhledem k aktuální poloze uživatele v kalendáři
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dny v aktuálním měsíci
kalendar.odebrat_dny(); // odebere přebytečné dny v konkrétním měsíci
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
kalendar.oznacit_den(); // funkce zajistí, že bude vždy oznacen den a pouze den, který zadal uživatel
}

}

};




class Datum {
readonly mesice:string[]=["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"]; // měsíce v roce

get den_v_tydnu(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getDay(); // vrací den v týdnu, kde 0 je neděle a 1 je pondělí
};

get den_v_mesici(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getDate(); // den v měsíci 1-31,1-30,1-28 ...
};

get mesic_v_roce(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getMonth(); // vrátí měsíc, kde leden je 0 a prosinec 11
};

get aktualni_rok(){
const o_d=new Date(); // načte objekt Date do proměné
return o_d.getFullYear(); // aktuální rok
};

dnu_v_mesici(rok:number,mesic:number){
return new Date(rok,mesic+1,0).getDate(); // vrátí počet dnů v aktuálním měsíci v roce
}


};


class Cas_rezervace
{
// objekt zajišťuje potřebné funkcionality pro volbu času rezervace
readonly id_radio:string="cas"; // počátek ID input type radio cas1-cas14
readonly id_li:string="lic"; // počátek ID li v kterém je input type radio lic1-lic14
private vybrany_cas:number=0; // vybraný čas uživatelem, kde 0 znamená, že čas nebyl vybrán a 1 je první čas
readonly casy:string[]=["9:00-9:30 hod.","9:30-10:00 hod.","10:00-10:30 hod.","10:30-11:00 hod.","11:00-11:30 hod.","11:30-12:00 hod.","12:00-12:30 hod.","12:30-13:00 hod.","13:00-13:30 hod.","13:30-14:00 hod.","14:00-14:30 hod.","14:30-15:00 hod.","15:00-15:30 hod.","15:30-16:00 hod."]; // všechny časy zadané slovně

get cislo_vybraneho_casu()
{
// getter vrací číslo vybraného času 1-14
return this.vybrany_cas; //  vrací číslo vybraného času 1-14
};

get zobrazit_vybrany_cas()
{
// getter pomáhá zasílat čas vybraný uživatelem slovně
if(this.vybrany_cas!==0)
{
// pokud již uživatel vybral nějáký čas, pokud nevybral čas this.vybrany_cas===0
return this.casy[this.vybrany_cas-1]; // vrátí vybraný čas v textu: -1 protože pole je číslováno od 0, kdežto výbšr času je od 1, pokud je u vybraného času 0, znamená to, že čas nebyl uživatelem vybrán
}
return ("Čas nebyl doposud uživatelem vybrán");
};

get byl_vybran_cas()
{
// getter slouží k odpovědi, zda uživatel vybral čas
if(this.vybrany_cas>0&&this.vybrany_cas<=14)
{
// pokud byl vybrán čas uživatelem je jeho výběr v rozmezí 1-14 časových pásem
return true; // true===čas byl uživatelem vybrán
}
return false; // čas nebyl užívatelem vybrán
};

aktivace()
{
const pocet_casu=14; // počet celkových časových rozmezí, které může uživatel zvolit 1-14
for(let i=0;i<pocet_casu;i++)
{
// smička zajistí přidělení posluchačú událostí CLICK všem li elementům s volbou času
const li=document.getElementById(`${this.id_li}${i+1}`); // Element li je číslován od 1 : proto i+1
if(li)
{
// pokud existuje HTML element
li.addEventListener("click", this); // přidělí posluchač událosi elementu li
}}};

handleEvent(e:any)
{
const k:string=e.target.id; // zjistí ID prvku na který byl klik proveden

const number:number=parseInt(k.replace(/\D/g,'')); // .replace(/\D/g, '') odstraní všechny nečíselné znaky (což jsou ty, které nejsou číslice) z řetězce a parseInt() převádí tento řetězec na celé číslo.

const radio=document.getElementById(`${this.id_radio}${number}`); // příslušný input type radio nacházející se v stejnél li elementu na který bylo kliknuto

if(radio)
{
// pokud existuje HTML element
(radio as HTMLInputElement).checked=true; // zatrhne konkrétní input type radio
this.vybrany_cas=number; // do proměnné uloží informaci s číslem, podle které je možné zjistit jaký čas byl uživatelem vybrán (1-14)
}

}

};


interface Dialog_okno
{
// interface pro vytvoření všech parametrů pro správné fungování dialogového okna
id_okna:string; // id dialogového okna
id_buton_pro_zavreni?:string; // id buttonu pro zavření dialogového okna
id_top_kotva?:string; // id horní kotvy dialogového okna, která slouží k scrool po otevření okna
id_button_pro_scroll_bottom?:string; // id buttonu, kterým je možné provést scroll k bottom kotvě
id_bottom_kotva?:string; // id spodní kotva dialogového okna, která slouží k scrool na bottom dialogového okna
};

class Dia
{
// CLASS slouží pro řízení otvírání a zavírání dialogových oken

boundOffs:{[key:string]:any}={}; // objekt, který zajistí správný způsob je skutečně uložit bindovanou funkci do proměnné

dia_zasady:Dialog_okno={
// objekt s id pro dialogové okno: Zásady ochrany osobních údajů
id_okna:"zasady",
id_buton_pro_zavreni:"butt_zasady",
id_top_kotva:"top_kotva_zasady",
id_button_pro_scroll_bottom:"scroll_butt_zasady",
id_bottom_kotva:"bottom_kotva_zasady"
};

get addDia_zasady()
{
// getter vrátí všechny parametry nutné ke spuštění funkcionalit dialogového okna: Zásady ochrany osobních údajů
return Object.values(this.dia_zasady) as [string,string?,string?,string?,string?]; // vrátí všechny hodnoty objektu jednu po druhé, jejich použití je možné pomocí speed operátoru ...
};

on(id_dialog:string,id_button_z:string="",id_kotva_top:string="",id_button_scroll:string="",id_kotva_bottom:string="")
{

const okno=document.getElementById(id_dialog); // načte HTML element dialogového okna
if(okno)
{
// pokud HTML objekt existuje
(okno as HTMLDialogElement).showModal(); // otevře dialogové okno
}

if(id_button_z!=="")
{
// pokud bude zaslán id butonu pro zavření dialogového okna
const button_close=document.getElementById(id_button_z); // načte HTML element buttonu pro zavření dialogového okna
if(button_close)
{
// pokud HTML objekt existuje
const boundOff = this.off.bind(this,id_dialog,id_button_z,id_button_scroll); // proměnná, do které se uloží bind funkce, aby mohla být správně pomocí removeEventlistener odstraněna
this.boundOffs[id_button_z]=boundOff; // proměná bude uložena do globální proměnné pod klíčem id_button_z
(button_close as HTMLButtonElement).addEventListener("click",boundOff); // přidá posluchač buttonu pro zavření dialogového okna
}}

if(id_kotva_top!=="")
{
// pokud byl zaslána id kotvy pro scroll
const kotva=document.getElementById(id_kotva_top); // načte HTML element s kotvou pro sroll

if(kotva)
{
// pokud HTML objekt existuje
setTimeout(()=>{
kotva.scrollIntoView({behavior:"smooth",block:"start"}); // provede scroll TO na HTML kotvu
},100); // Přidání zpoždění pro zajištění posunu
}
}

if(id_button_scroll!==""&&id_kotva_bottom!=="")
{
// pokud byla metoda volána s id_button_scroll a id_kotva_bottom
const butt_kotva=document.getElementById(id_button_scroll); // načte HTML element buttonem pro scroll

if(butt_kotva)
{
// pokud existuje HTML element
const boundOff_k=this.scroll.bind(this,id_kotva_bottom); // vytvoří referenci pro volání a následné odstranění posluchače bind
this.boundOffs[id_button_scroll]=boundOff_k; // zapíše refernci do objektu pod klíčem: d_button_scroll
(butt_kotva as HTMLButtonElement).addEventListener("click",boundOff_k); // přidá posluchač události
}}
console.log("OPEN");
};
off(id_dialog:string,id_button_z:string="",id_button_scroll:string="")
{
// metoda zavře dialogové okno

if(id_button_z!=="")
{
// pokud bude zaslán do funkce parametr s id buttonu pro zavření dialofového okna
const button_close=document.getElementById(id_button_z); // načte HTML element buttonu pro zavření dialogového okna
if(button_close)
{
// pokud HTML objekt existuje
(button_close as HTMLButtonElement).removeEventListener("click",this.boundOffs[id_button_z]); // odebere posluchač buttonu pro zavření dialogového okna
delete this.boundOffs[id_button_z]; // odstraní referenci z objektu
}
}

const okno=document.getElementById(id_dialog); // načte HTML element dialogového okna

if(okno)
{
// pokud HTML objekt existuje
(okno as HTMLDialogElement).style.opacity="0"; // zneviditelní dialogové okno, díky transitions v css vytvoří animaci
(okno as HTMLDialogElement).style.transform="scale(.5)"; // začne dialogové okno zmenšovat, díky transitions v css vytvoří animaci
setTimeout(()=>{
(okno as HTMLDialogElement).close(); // zavře dialogové okno
(okno as HTMLDialogElement).style.opacity="1"; // nastaví hodnotu na default
(okno as HTMLDialogElement).style.transform="scale(1)"; // nastaví hodnotu na default
},200); // zpoždění odpovídá transition 0.2s v CSS
}

if(id_button_scroll!=="")
{
const butt_kotva=document.getElementById(id_button_scroll); // načte HTML element buttonem pro scroll

if(butt_kotva)
{
// pokud existuje HTML element
const boundOff_k=this.boundOffs[id_button_scroll]; // načte referenci, která byla přidána posluchačí funke bind, klíč je: id_button_scroll
(butt_kotva as HTMLButtonElement).removeEventListener("click",boundOff_k); // odebere posluchač události buttonu pro scroll bottom
delete this.boundOffs[id_button_scroll]; // odstraní referenci z objektu
}

}

console.log("CLOSE");
};

scroll(id_kotva_bottom:string)
{
const kotva=document.getElementById(id_kotva_bottom); // načte HTML objekt kotvy
if(kotva)
{
// pokud HTML objekt existuje
(kotva as HTMLElement).scrollIntoView({behavior:"smooth",block:"end"}); // provede scrollTo na HTML kotvu
}
console.log("scroll bottom");
}

};

class Boss
{
// class bude zajišťovat hlavní chod celé aplikace rezervace
readonly id_boss_con="boss_con"; // id hlavního kontejneru aplikace
readonly id_form=["rezervace_form","dokoncit_form"]; // id formulářů
readonly id_button=["zmenit","ukaz_zasady","butt_zavinac"]; // id hlavních buttonů formulářů
readonly id_inputHost=["jmeno","email","phone","predmet"]; // id input, které vyplňoval návštěvník [návštěvník: jméno a příjmení, návštěvník: email, návštěvník: telefon, návštěvník: O čem bude hovor]
readonly id_cas="slovne_cas_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje čas rezervace
readonly id_den="slovne_den_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje den rezervace Pondělí-Neděle
readonly id_den_v_mesici="ciselne_den_v_mesici_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje den v měsíci rezervace 1-31
readonly id_mesic="slone_mesic_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje měsíc rezervace leden-prosinec
readonly id_rok="ciselne_rok_rezervace"; // id SPAN ve formuláři Dokončit rezervaci, kde se zapisuje rok rezervace např. 2024
private slovne_datum=""; // v proměnné je slovně uložené celé datum rezervace
private slovne_cas=""; // v proměnné je uloženo slovně konkrétní čas rezervace

posluchace()
{
// posluchače formulářů a hlavních buttonů formulářů
const d1=this.id_form.length; // délka pole
for(let i=0;i<d1;i++)
{
// smička zajistí blokaci formulářů odesláním submit
const form=document.getElementById(this.id_form[i]); // HTML element FORM
if(form){
// pokud existuje HTML element FORM
(form as HTMLFormElement).addEventListener("submit",this); // přiřadí posluchač k formuláři
};
}

const d2=this.id_button.length; // délka pole
for(let i=0;i<d2;i++)
{
// smička zajistí posluchače pro hlavní butony formulářů: Změnit rezervaci
const button=document.getElementById(this.id_button[i]); // HTML element Button
if(button)
{
(button as HTMLButtonElement).addEventListener("click",this); // přiřadí posluchač click k buttonu na this
}
}


};

zobrazeni_datumu(){
// funkce zajistí správné zobrazení datumu rezervace ve formuláři Dokončit rezervaci

const dny:string[]=["Neděle","Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota"]; // dny v týdnu
const mesice:string[]=["ledna","února","března","dubna","květena","června","července","srpna","září","října","listopadu","prosince"]; // měsíce v roce

const den_rezervace_uzivatel:number[]=kalendar.rezervovane_datum; // getter vrátí datum zadané uživatelem [rok, měsíc(0-11), den]:number[]

if(den_rezervace_uzivatel.every(value=>value===9999))
{
// pokud se návratová hodnota getteru=== [9999,9999,9999], znamená to, že uživatel nevybral datum
alert("Kritická chyba aplikace: uživatel nevybral datum");
return; // funkce bude ukončena
}

const den_v_tydnu=new Date(den_rezervace_uzivatel[0],den_rezervace_uzivatel[1],den_rezervace_uzivatel[2]).getDay(); // den v týdnu v určitém dnu v měsíci a roce, kde 0 je neděle

const den_v_tydnu_slovne:string=dny[den_v_tydnu]; // konkrétní den v roce zadaný uivatelem slovně Neděle až Pátek
const den_v_mesici:string=den_rezervace_uzivatel[2].toString(); // den v měsíci převeden na string
const mesic_v_roce_slovne:string=mesice[den_rezervace_uzivatel[1]]; // měsíc v roce slovně
const rok:string=den_rezervace_uzivatel[0].toString(); // rok převeden na string

const span_den_slovne=document.getElementById(this.id_den);  // HTML SPAN ve formuláři Dokončit rezervaci, kde se zapisuje den rezervace Pondělí-Neděle
const span_cislo_dne=document.getElementById(this.id_den_v_mesici); // HTML SPAN ve formuláři Dokončit rezervaci, kde se zapisuje den v měsíci rezervace 1-31
const span_mesic=document.getElementById(this.id_mesic); // HTML SPAN ve formuláři Dokončit rezervaci, kde se zapisuje měsíc rezervace leden-prosinec
const span_rok=document.getElementById(this.id_rok); //  HTML SPAN ve formuláři Dokončit rezervaci, kde se zapisuje rok rezervace např. 2024

if(span_den_slovne)
{
// pokud HTML objekt existuje
(span_den_slovne as HTMLSpanElement).innerText=den_v_tydnu_slovne; // přepíše den v týdnu
}

if(span_cislo_dne)
{
// pokud HTML objekt existuje
(span_cislo_dne as HTMLSpanElement).innerText=den_v_mesici; // přepíše číslo dne
}

if(span_mesic)
{
// pokud HTML objekt existuje
(span_mesic as HTMLSpanElement).innerText=mesic_v_roce_slovne; // přepíše měsíc v roce
}

if(span_rok)
{
// pokud HTML objekt existuje
(span_rok as HTMLSpanElement).innerText=rok; // přepíše rok
}

this.slovne_datum=`${den_v_tydnu_slovne}, ${den_v_mesici}.${mesic_v_roce_slovne} ${rok}`; // do proměnné bude vložen kompletní datum rezervace

};

zobrazeni_casu(){
// funkce zajistí správné zobrazení času rezervace ve formuláři Dokončit rezervaci
const span_cas=document.getElementById(this.id_cas); // HTML span pro čas rezervace
if(span_cas)
{
(span_cas as HTMLSpanElement).innerText=cas_rezervace.zobrazit_vybrany_cas; // přepíše čas rezervace na čas vybraný uživatelem
}

this.slovne_cas=cas_rezervace.zobrazit_vybrany_cas; // do proměnné zapíše slovně čas rezerace

};
napis_zavinac()
{
// metoda napíše @ do input email
const input_email=document.getElementById(this.id_inputHost[1]); // načete HTML element input email
if(input_email)
{
// pokud HTML element existuje
(input_email as HTMLInputElement).value+="@"; // přidá @ do input email
}
};

handleEvent(e:any)
{
const k=e.target.id; // id buttonu na který bylo kliknuto


if(k===this.id_form[0]||k===this.id_form[1])
{
// pokud jde požadavek od některého z formulářů
e.preventDefault(); // Zabrání výchozímu chování (odeslání formuláře)
}

if(k===this.id_form[0])
{
// pokud byl požadavek uživatele klik na button Rezervovat
if(cas_rezervace.byl_vybran_cas&&kalendar.byl_vybran_datum)
{
// pokud byl vybrán datum a čas rezervace
this.form_posun(this.id_form[0],this.id_form[1]); // metoda zajistí posun formuláře z Rezervovat na Dokončit Rezervaci
this.zobrazeni_casu(); // funkce zajistí správné zobrazení času rezervace ve formuláři Dokončit rezervaci
this.zobrazeni_datumu(); // funkce zajistí správné zobrazení datumu rezervace ve formuláři Dokončit rezervaci
}

}

else if(k===this.id_button[0])
{
// pokud byl požadavek uživatele klik na button Změnit rezervaci
this.form_posun(this.id_form[1],this.id_form[0]);  // metoda zajistí posun formuláře z Rezervovat na Dokončit Rezervaci
}

else if(k===this.id_button[1])
{
// kliknuto na button Zásady ochrany osobních údajů
dia.on(...dia.addDia_zasady); // otevře dialogové okno Zásady ochrany osobních údajů
}

else if(k===this.id_form[1])
{
// pokud byl požadavek uživatele klik na button Dokončit rezervaci
this.rezervovat(); // metoda zajistí plné dokončení rezervace
}

else if(k===this.id_button[2])
{
// pokud byl požadavek uživatele klik na button @
this.napis_zavinac(); // metoda zajistí přidání @ do input pro email
}


};

form_posun(old_form:string,new_form:string)
{
// metoda zajistí posun formuláře z Rezervovat na Dokončit Rezervaci a opačně (old_form=== ID formuláře, který hceme zavřít), (new_form=== ID formuláře,který chceme otevřít)

const form_old=document.getElementById(old_form); // HTML element FORM
const form_new=document.getElementById(new_form); // HTML element FORM

if(form_old&&form_new)
{
(form_old as HTMLFormElement).style.display="none"; /* vypne starý formulář */
(form_new as HTMLFormElement).style.opacity="0"; /* nastavý nový formulář na opacity 0 */
(form_new as HTMLFormElement).style.display="flex"; /* aktivuje na novém formuláři display:flex */
setTimeout(()=>
{
(form_new as HTMLFormElement).style.opacity="1"; // nastavý novému formuláři opacity na 1
const h_c=document.getElementById(this.id_boss_con); // HTML element - hlavní kontejner aplikace
if(h_c)
{
// pokud HTML Element existuje
(h_c as HTMLElement).scrollIntoView({behavior:"smooth",block:"start"}); // v případě pohybu ve formuláři zajistí posun na počátek-top hlavního kontejneru
}
},100); // drobné zpoždění zajistí bezproblémový průběh animace opacity
}};

kontola_verze_javaScript()
{
const id_div="no_es2017"; // id div, který obsahuje informaci o tom, že uživatel nemá alespoň veri Java Scriptu es2017
const error_div=document.getElementById(id_div); // načte HTML element do proměnné
    
let kontrola1=false; // proměnná pro první kontrolu Object.values
let kontrola2=false; // proměnná pro druhou kontrolu (async/await)
    
// podmínka testuje dostupnost funkce Object.values, která je také součástí ES2017.
if(typeof Object.values==="function")
{
kontrola1=true; // ES2017 je podporován
}
else
{
kontrola1=false; // ES2017 není podporován
}

try
{
// použítí vlastnosti ES2017 (async/await)
new Function("async()=>{}")();
kontrola2=true; // ES2017 je podporován
}
catch(e)
{
kontrola2=false; // ES2017 není podporován
}

if(!kontrola1||!kontrola2)
{
// pokud jedna z kontrolovaných proměnných neprošla testem
if(error_div)
{
// pokud HTML element existuje
(error_div as HTMLElement).style.display="flex"; // nastaví DIV, tak aby byl pro uživatele viditelný
}}
};

rezervovat(){
// metoda zajistí plné dokončení rezervace
console.log("Dokončit rezervaci");

const den_rezervace_uzivatel:number[]=kalendar.rezervovane_datum; // getter vrátí datum zadané uživatelem [rok, měsíc(0-11), den]:number[]
const cas_rezervace_uzivatel:number=cas_rezervace.cislo_vybraneho_casu; // getter vrací číslo vybraného času uživatelem 1-14

const cas_rezervace_slovne:string=this.slovne_cas; // slovně zapsaný čas rezervace pro rozesílání emailem (např.:9:00-9:30 hod.)
const datum_rezervace_slovne:string=this.slovne_datum; // slovně zapsaný celé datum rezervace pro zaslání emalem (např.: Úterý, 1. dubna 2025)

console.log("den_rezervace_uzivatel: "+den_rezervace_uzivatel);
console.log("cas_rezervace_uzivatel: "+cas_rezervace_uzivatel);
console.log("cas_rezervace_slovne: "+cas_rezervace_slovne);
console.log("datum_rezervace_slovne "+datum_rezervace_slovne);



const in_jmeno_uzivatel=document.getElementById(this.id_inputHost[0]); // input s jménem a příjmením uživatel
const in_email_uzivatel=document.getElementById(this.id_inputHost[1]); // input s emailem uživatele
const in_phone_uzivatel=document.getElementById(this.id_inputHost[2]); // input s telefonem uživatele
const in_predmet_uzivatel=document.getElementById(this.id_inputHost[3]); // input s předmětem uživatele (O čem bude hovor?)

let jmeno="", // jméno uživatele
email="", // email uživatele
phone="", // telefon uživatele
predmet=""; // předmět uživatele (O čem bude hovor)

if(in_jmeno_uzivatel)
{
// pokud HTML element existuje
jmeno=(in_jmeno_uzivatel as HTMLInputElement).value; // z input načte jméno a příjmení
}

if(in_email_uzivatel)
{
// pokud HTML element existuje
email=(in_email_uzivatel as HTMLInputElement).value; // z input načte email
}

if(in_phone_uzivatel)
{
// pokud HTML element existuje
phone=(in_phone_uzivatel as HTMLInputElement).value; // z input načte telefon
}

if(in_predmet_uzivatel)
{
// pokud HTML element existuje
predmet=(in_predmet_uzivatel as HTMLInputElement).value; // z input načte O čem bude hovor
}

console.log("Jméno: "+jmeno);
console.log("email: "+email);
console.log("Telefon: "+phone);
console.log("O čem bude hovor: "+predmet);

};


spustit_aplikaci()
{
// metoda zajišťuje spuštění základních procesů pro chod aplikace rezervace
this.kontola_verze_javaScript(); // metoda zkontroluje jestli uživatel má alespoň Java Script ES2017, pokud ne, aktivuje DIV s errorem
this.posluchace(); // spustí posluchače formulářů a hlavních buttonů formulářů
kalendar.vytvorit(); // vytvoří čísla na buttonu kalendáře
kalendar.nazev_mesice(); // funkce přepíše název měsíce a roku v input měsíc a rok
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dne v aktuálním měsíci mimo dnešního dne
kalendar.odebrat_dny(); // odebere přebytečné dny v konkrétním měsíci
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
mesic_a_rok.aktivace(); // aktivuje posluchače události click k tlačítkům pro posun měsíce VPŘED a VZAD
cas_rezervace.aktivace(); // aktivuje posluchače pro volbu konkrétního času rezervace uživatelem
}

};

const boss=new Boss; // vytvoří objekt, který má nastarosti hlavní chod aplikace rezervace
const cas_rezervace=new Cas_rezervace(); // vytvoří objekt pro operace kolem volby času k rezervaci uživatelem
const datum = new Datum(); // vytvoření objektu datum
const kalendar = new Kalendar(); // pomocí class Kalendar vytvoří objekt kalendar
const mesic_a_rok = new Mesic_a_rok(); // pomocí class Mesic_a_rok vytvoří objekt mesic_a_rok
const dia=new Dia(); // pomocí class Dia se řídí otevírání a zavírání dialogových oken
boss.spustit_aplikaci(); // metoda zajistí spuštění hlavních funkcí aplikace
