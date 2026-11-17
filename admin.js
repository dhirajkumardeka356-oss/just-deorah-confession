import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
const configured=!SUPABASE_URL.startsWith("YOUR_")&&!SUPABASE_ANON_KEY.startsWith("YOUR_");
const sb=configured?createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const loginPanel=document.querySelector("#login-panel"), dashboard=document.querySelector("#dashboard"), inbox=document.querySelector("#inbox"), loginMsg=document.querySelector("#login-message");
async function showDashboard(){
 const {data:{user}}=await sb.auth.getUser();
 if(!user){loginPanel.hidden=false;dashboard.hidden=true;return}
 const {data:profile,error:pe}=await sb.from("admin_users").select("user_id").eq("user_id",user.id).maybeSingle();
 if(pe||!profile){await sb.auth.signOut();loginMsg.textContent="This account is not authorized as an admin.";return}
 loginPanel.hidden=true;dashboard.hidden=false;await loadInbox();
}
async function loadInbox(){
 inbox.innerHTML='<p class="empty">Loading private submissions…</p>';
 const {data,error}=await sb.from("confessions").select("id,body,status,created_at").order("created_at",{ascending:false});
 if(error){inbox.innerHTML='<p class="empty">Unable to load inbox.</p>';return}
 if(!data.length){inbox.innerHTML='<p class="empty">No confessions yet.</p>';return}
 inbox.innerHTML="";
 for(const item of data){
  const card=document.createElement("article");card.className="confession";
  const date=new Date(item.created_at).toLocaleString();
  const meta=document.createElement("div");meta.className="meta";meta.textContent=`${item.status.toUpperCase()} · ${date}`;
  const body=document.createElement("p");body.textContent=item.body;
  const actions=document.createElement("div");actions.className="actions";
  const share=document.createElement("button");share.textContent="Copy for Instagram";
  share.onclick=async()=>{await navigator.clipboard.writeText(item.body);share.textContent="Copied";};
  const reject=document.createElement("button");reject.className="reject";reject.textContent=item.status==="rejected"?"Mark pending":"Reject";
  reject.onclick=()=>update(item.id,{status:item.status==="rejected"?"pending":"rejected"});
  const del=document.createElement("button");del.className="delete";del.textContent="Delete";
  del.onclick=async()=>{if(confirm("Permanently delete this confession?")){await sb.from("confessions").delete().eq("id",item.id);loadInbox()}};
  actions.append(share,reject,del);card.append(meta,body,actions);inbox.append(card);
 }
}
async function update(id,values){await sb.from("confessions").update(values).eq("id",id);loadInbox()}
document.querySelector("#login-form").addEventListener("submit",async e=>{
 e.preventDefault();if(!configured){loginMsg.textContent="Connect Supabase first. See SETUP.md.";return}
 const {error}=await sb.auth.signInWithPassword({email:document.querySelector("#email").value,password:document.querySelector("#password").value});
 if(error){loginMsg.textContent="Sign-in failed. Check your details.";return}await showDashboard();
});
document.querySelector("#logout").onclick=async()=>{await sb.auth.signOut();await showDashboard()};
if(configured){showDashboard()}else{loginMsg.textContent="Admin setup is not complete. Follow SETUP.md."}