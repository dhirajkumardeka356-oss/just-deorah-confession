import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
const form=document.querySelector("#confession-form"), box=document.querySelector("#confession"), msg=document.querySelector("#message"), count=document.querySelector("#count");
const configured=!SUPABASE_URL.startsWith("YOUR_")&&!SUPABASE_ANON_KEY.startsWith("YOUR_");
const supabase=configured?createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
box.addEventListener("input",()=>count.textContent=`${box.value.length} / 2000`);
form.addEventListener("submit",async e=>{
 e.preventDefault(); const confession=box.value.trim();
 if(!configured){msg.textContent="This site is not connected yet. Please try again later.";return}
 if(confession.length<5){msg.textContent="Please write a little more.";return}
 const btn=form.querySelector("button");btn.disabled=true;msg.textContent="Sending privately…";
 const {error}=await supabase.from("confessions").insert({body:confession});
 btn.disabled=false;
 if(error){msg.textContent="Could not send right now. Please try again later.";return}
 form.reset();count.textContent="0 / 2000";msg.textContent="Your confession has been sent privately. Thank you.";
});