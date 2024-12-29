
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
// pokud nebude kalendář v poloze===0 budou všechny buttony připravené
for(let i=1;i<32;i++){
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if (button_i){
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).disabled=false; // udělá odstraní disabled na všech buttonech
}
}
}


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
console.log("posun"+i);
console.log("posun bloku= "+posunovaci_bloky);
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
});

// Posluchač pro pohyb prstu
(plocha_dny as HTMLFieldSetElement).addEventListener("touchmove",(e)=>{
this.touchEndX=e.touches[0].clientX;  // konečné souřadnice pohybu po ose X
this.touchEndY=e.touches[0].clientY; // konečné souřadnice pohybu po ose Y
});

// Posluchač pro konec dotyku
(plocha_dny as HTMLFieldSetElement).addEventListener("touchend",(e)=>{
this.handleGesture(e); // funkce vyhodnotí zda uživatel udělal pohyb prstem na obrazovce vpravo nebo vlevo
});}
};
handleGesture(e:any){
 // funkce vyhodnotí zda uživatel udělal pohyb prstem na obrazovce vpravo nebo vlevo
const diffX=this.touchEndX-this.touchStartX; // rozdíl hodnoty počátečního dotku uživatele plochy a konečného ukončení pohybu (osa X)
const diffY=this.touchEndY-this.touchStartY; // rozdíl hodnoty počátečního dotku uživatele plochy a konečného ukončení pohybu (osa Y)
if(Math.abs(diffX)>50&&Math.abs(diffY)<30){ // Práh pohybu (X:50px,Y:30px)
if(diffX>0){
console.log("Tah doprava");
this.handleEvent(e,1); // tah doprava
}else{
console.log("Tah doleva");
this.handleEvent(e,2); // tah doleva
}}
else
{
console.log("Pohyb nebyl dostatečný");
}
this.touchStartX=0; // anulace hodnoty po vyhodnocení Prahu pohybu
this.touchStartY=0; // anulace hodnoty po vyhodnocení Prahu pohybu
this.touchEndX=0; // anulace hodnoty po vyhodnocení Prahu pohybu
this.touchEndY=0; // anulace hodnoty po vyhodnocení Prahu pohybu
};
handleEvent(e:any,pohyb:number=0){
const k:string=e.currentTarget.id; // id odkazuje na prvek, na který je navázán posluchač události

if(k===this.id_posun[0]||(pohyb===1&&k===this.id_kalendar))
{
// kliknuto na button VZAD, nebo tah uživatele prstem po kalendáři doprava
console.log("VZAD");
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
}

}

};

class Boss
{
// class bude zajišťovat hlavní chod celé aplikace rezervace
readonly id_form=["rezervace_form","dokoncit_form"]; // id formulářů
readonly id_button=["zmenit"]; // id hlavních buttonů formulářů

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
form.addEventListener("submit",this); // přiřadí posluchač k formuláři
};
}

const d2=this.id_button.length; // délka pole
for(let i=0;i<d2;i++)
{
// smička zajistí posluchače pro hlavní butony formulářů: Změnit rezervaci
const button=document.getElementById(this.id_button[i]); // HTML element Button
if(button)
{
button.addEventListener("click",this); // přiřadí posluchač click k buttonu na this
}
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
this.form_posun(this.id_form[0],this.id_form[1]); // metoda zajistí posun formuláře z Rezervovat na Dokončit Rezervaci
}

if(k===this.id_button[0])
{
// pokud byl požadavek uživatele klik na button Změnit rezervaci
this.form_posun(this.id_form[1],this.id_form[0]);  // metoda zajistí posun formuláře z Rezervovat na Dokončit Rezervaci
}

if(k===this.id_form[1])
{
// pokud byl požadavek uživatele klik na button Dokončit rezervaci
this.rezervovat(); // metoda zajistí plné dokončení rezervace
}




};

form_posun(old_form:string,new_form:string)
{
// metoda zajistí posun formuláře z Rezervovat na Dokončit Rezervaci a opačně (old_form=== ID formuláře, který hceme zavřít), (new_form=== ID formuláře,který chceme otevřít)

const form_old=document.getElementById(old_form); // HTML element FORM
const form_new=document.getElementById(new_form); // HTML element FORM

if(form_old&&form_new)
{
form_old.style.display="none";
form_new.style.opacity="0";
form_new.style.display="flex";
setTimeout(()=>
{
form_new.style.opacity="1";
},100); // drobné zpoždění zajistí bezproblémový průběh animace opacity
}};

rezervovat(){
// metoda zajistí plné dokončení rezervace
console.log("Dokončit rezervaci");
};

spustit_aplikaci()
{
// metoda zajišťuje spuštění základních procesů pro chod aplikace rezervace
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
boss.spustit_aplikaci(); // metoda zajistí spuštění hlavních funkcí aplikace
