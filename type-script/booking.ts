
class Kalendar {
p_id:string="b"; // počáteční id každého buttonu ke kterému je přiřazeno v HTML číslo 1-31 ... b1.b2->b31
m_a_r_id:string="mesic_a_rok"; // id inputu s měsícem a rokem
den_id:string="d"; // počáteční id každého dne v týdnu v kalendáři <p> Po,Út,St,Čt,Pá,So,Ne
private poloha:number=0; // proměnná určuje polohu kalendáře 0===default, 1-krok o měsíc dále , 2-krok o dva měsíce dále

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

const a_d=datum.den_v_mesici; // aktuální den v měsíci 1-31,1-30,1-28 ...



if(this.poloha===0)
{
// pokud bude poloha uživatel v kalendáři nezměněna
if(a_d!==1)
{
// pokud se právě aktuální den v měsíci !== 1 (tedy to není první den v měsící), budou se odebírat buttony pro objenání

for(let i=1;i<a_d+1;i++)
{
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if(button_i)
{
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).disabled=true; // udělá disabled na buttonu na dny, které už v měsíci uplynuly včetně dnešního
}}
}
else
{
// pokud právě aktuální den v měsíci je prvního - bude se odebírat poze tento den
const button_i=document.getElementById(`${this.p_id}${a_d}`); // konkrétní button s číslem dne v měsíci
if(button_i)
{
(button_i as HTMLButtonElement).disabled=true; // udělá disabled na buttonu 1. v měsíci
}}
}
else
{
// pokud nebude kalendář v poloze===0 budou všechny buttony připravené
for(let i=1;i<32;i++){
const button_i=document.getElementById(`${this.p_id}${i}`); // konkrétní button s číslem dne v měsíci
if (button_i){
// pokud HTML objekt pod Id existuje
(button_i as HTMLButtonElement).disabled = false; // udělá odstraní disabled na všech buttonech
}
}
}


};


odebrat_dny(){
let cmp=datum.mesic_v_roce+this.poloha; // aktuální číslo měsíce vzhledem k poloze uživatele v kalendáři
    
let a_r=datum.aktualni_rok; // datum.aktualni_rok je getter, kde návratová hodnota je aktuální rok: 2024,2025 ...
    
if(cmp>11)
{
// pokud bude aktuální číslo měsíce vzhledem k poloze uživatele v kalendáři více jak 12.měsíc
cmp=datum.mesic_v_roce+this.poloha-datum.mesice.length; // upraví číslo měsíce tak, aby vycházel na následující měsíc v novém roce
a_r++; // přidá se jeden rok
}
const pdva=datum.dnu_v_mesici(a_r,cmp); // funkce vrací počet dní v aktuálním měsíci datum.dnu_v_mesici(rok,měsíc)
    
console.log("Počet dní v aktuálním měsíci:"+ pdva);
    
    
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

const dni_v_tydnu=datum.dny.length; // počet dní v týdnu
const a_d_m=new Date(a_r,a_m,1).getDay(); // první den v měsíci (1. den)

for(let i=0;i<dni_v_tydnu;i++)
{
const dayIndex=(a_d_m+i)%dni_v_tydnu; // modulo
const p_e=document.getElementById(`${this.den_id}${i+1}`); // HTML P elementy zastupující dny v týdnu Po-Ne
if(p_e)
{
// pokud HTML element existuje
(p_e as HTMLElement).innerText=datum.dny[dayIndex]; // změní popisky Po,Út, St, Čt , Pá , So , Ne podle počátku dne v měsíci
}}}


};



const mesic_a_rok={
id_posun:["m_minus","m_plus"], // id šipek s posunem měsíce 0===vzad, 1===vpřed
id_text:"mesic_a_rok", // id inputu s textem měsíc a rok
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

},
handleEvent(e:any){
const k=e.target.id; // id buttonu na který bylo kliknuto

if(k===this.id_posun[0])
{
// kliknuto na button VZAD

console.log("VZAD");
kalendar.posun=-1; // přičte +1 poloze uživatele v kalendáři
kalendar.nazev_mesice(); // upraví název měsíce vzhledem k aktuální poloze uživatele v kalendáři
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dny v aktuálním měsíci
kalendar.odebrat_dny(); // odebere přebytečné dny v konkrétním měsíci
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
}
else if(k===this.id_posun[1])
{
// kliknuto na button VPŘED


console.log("VPŘED");
kalendar.posun=+1; // přičte +1 poloze uživatele v kalendáři, řešeno setterem
kalendar.nazev_mesice(); // upraví název měsíce vzhledem k aktuální poloze uživatele v kalendáři
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dny v aktuálním měsíci
kalendar.odebrat_dny(); // odebere přebytečné dny v konkrétním měsíci
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
}

}

};




class Datum {
readonly mesice:string[]=["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec"]; // měsíce v roce
readonly dny=["Ne","Po","Út","St","Čt","Pá","So"]; // dny v týdnu

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





const form_rezervace=document.getElementById("rez_form"); // HTML element FORM rezervačního systému
if(form_rezervace)
{
// pokud existuje HTML element FORM rezervačního systému
(form_rezervace as HTMLFormElement).addEventListener("submit",(event)=>{
event.preventDefault(); // Zabrání výchozímu chování (odeslání formuláře)
});
}

const datum=new Datum(); // vytvoření objektu datum
const kalendar= new Kalendar(); // pomocí class Kalendar vytvoří objekt kalendar

kalendar.vytvorit(); // vytvoří čísla na buttonu kalendáře
kalendar.nazev_mesice(); // funkce přepíše název měsíce a roku v input měsíc a rok
kalendar.upravit(); // upraví kalendář, tak. aby zobrazoval pouze dne v aktuálním měsíci mimo dnešního dne
kalendar.odebrat_dny(); // odebere přebytečné dny v konkrétním měsíci
kalendar.poradi_dnu(); // funkce upraví v kalendáři počadí dnů (Po,Ut,St,Čt,Pá,So,Ne) podle měsíce
mesic_a_rok.aktivace(); // aktivuje posluchače události click k tlačítkům pro posun měsíce VPŘED a VZAD