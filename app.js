// Paste your deployed Google Apps Script Web App URL below.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzaabrwR20kyl_QPner7DBNY4EZAU6T8FDvToVRQxpa7KkTBtZyDno5K7olnnOc1lJE/exec";

const $ = (id) => document.getElementById(id);
const fields = ["productType","otherType","productId","serialNumber","vendorCompany","vendorPerson","destination","purpose","itRep"];
let currentPassNo = "";
let currentDate = new Date();

function value(id){ return $(id).value.trim(); }
function selectedType(){ return value("productType") === "Other" ? value("otherType") : value("productType"); }
function makePassNo(date){
  const stamp = date.getFullYear().toString() + String(date.getMonth()+1).padStart(2,"0") + String(date.getDate()).padStart(2,"0");
  const suffix = Math.random().toString(36).slice(2,6).toUpperCase();
  return `NSU-IT-${stamp}-${suffix}`;
}
function formattedDate(date){ return date.toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}); }
function updatePreview(){
  const mapping = {pType:selectedType(),pId:value("productId"),pSerial:value("serialNumber"),pCompany:value("vendorCompany"),pPerson:value("vendorPerson"),pDestination:value("destination"),pPurpose:value("purpose"),pRep:value("itRep"),pRepName:value("itRep") || "________________",pVendorName:value("vendorPerson") || "________________"};
  Object.entries(mapping).forEach(([id,val])=>$(id).textContent=val || "—");
  $("pPassNo").textContent = currentPassNo || "Will be generated";
  $("pDate").textContent = formattedDate(currentDate);
}
$("productType").addEventListener("change",()=>{
  $("otherWrap").hidden = value("productType") !== "Other";
  $("otherType").required = value("productType") === "Other";
  updatePreview();
});
fields.forEach(id=>$(id).addEventListener("input",updatePreview));
$("printBtn").addEventListener("click",()=>{currentDate=new Date();updatePreview();window.print();});

$("gateForm").addEventListener("submit", async (event)=>{
  event.preventDefault();
  if(!$("gateForm").reportValidity()) return;
  if(value("productType")==="Other" && !value("otherType")) return;
  currentDate = new Date();
  currentPassNo = makePassNo(currentDate);
  updatePreview();

  const record = {
    passNo:currentPassNo, createdAt:currentDate.toISOString(),
    productType:selectedType(), productId:value("productId"), serialNumber:value("serialNumber"),
    vendorCompany:value("vendorCompany"), vendorPerson:value("vendorPerson"),
    destination:value("destination"), purpose:value("purpose"), itRepresentative:value("itRep"),
    createdBy:"NSU IT Gate Pass Web App"
  };
  const status=$("status"), btn=$("saveBtn");
  if(!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/")){
    status.textContent="Pass generated locally. Configure the Google Apps Script URL to save records to Sheets.";
    status.style.color="#a15c00";
    return;
  }
  btn.disabled=true;btn.textContent="Saving...";
  try{
    // Apps Script accepts a simple text/plain POST. no-cors prevents browser CORS blocking;
    // the response is opaque, so the UI cannot verify the row from the browser.
    await fetch(GOOGLE_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(record)});
    status.textContent="Submission sent to Google Sheets. Check the spreadsheet to confirm the new row.";
    status.style.color="#147547";
  }catch(error){
    status.textContent="Could not submit to Google Sheets. Check your internet connection and Apps Script deployment URL.";
    status.style.color="#b42318";
  }finally{btn.disabled=false;btn.textContent="Save record & generate pass";}
});
currentDate=new Date();updatePreview();
