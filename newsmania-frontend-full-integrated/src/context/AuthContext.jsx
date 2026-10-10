import {createContext,useContext,useState,useEffect} from "react";
import api from "../api/api";
const AuthContext=createContext(null);
export function AuthProvider({children}){
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem("user")||"null"));
  const [token,setToken]=useState(()=>localStorage.getItem("token"));
  const [loading,setLoading]=useState(false);
  // A token with no cached user cannot tell an admin from a normal
  // user, so the guards must wait for the server to answer before
  // they decide where to send anyone
  const [ready,setReady]=useState(()=>{const t=localStorage.getItem("token");const u=JSON.parse(localStorage.getItem("user")||"null");return!t||Boolean(u&&u.role)});
  // Token is accepted either at the top level or nested in user
  const save=(data)=>{const body=data?.data||data;const t=body?.token||body?.user?.token;const u=body?.user;if(t){localStorage.setItem("token",t);setToken(t)}if(u){const{token:_,...rest}=u;localStorage.setItem("user",JSON.stringify(rest));setUser(rest)}setReady(true)};
  useEffect(()=>{if(!token||(user&&user.role)){setReady(true);return}let cancelled=false;api.get("/auth/me").then(({data})=>{const u=data?.data?.user||data?.user;if(cancelled||!u)return;const{streak,badges,...rest}=u;localStorage.setItem("user",JSON.stringify(rest));setUser(rest)}).catch(()=>{}).finally(()=>{if(!cancelled)setReady(true)});return()=>{cancelled=true}},[token,user]);
  const login=async(email,password)=>{setLoading(true);try{const {data}=await api.post("/auth/login",{email,password});save(data);return data}finally{setLoading(false)}};
  // Registration deliberately gets no token back. The account is
  // created unverified and the caller has to show the code step,
  // so this only resolves once the server has mailed the code.
  const register=async(name,email,password)=>{setLoading(true);try{const {data}=await api.post("/auth/register",{name,email,password});return data}finally{setLoading(false)}};
  // Exchange the emailed code for a session, then persist it
  const verifyEmail=async(email,code)=>{setLoading(true);try{const {data}=await api.post("/auth/verify-email",{email,code});save(data);return data}finally{setLoading(false)}};
  const resendVerification=async(email)=>{const {data}=await api.post("/auth/resend-verification",{email});return data};
  // The Google popup hands back a credential for the backend to verify
  const googleLogin=async(credential)=>{setLoading(true);try{const {data}=await api.post("/auth/google",{credential});save(data);return data}finally{setLoading(false)}};
  const logout=()=>{localStorage.removeItem("token");localStorage.removeItem("user");setToken(null);setUser(null);setReady(true)};
  return <AuthContext.Provider value={{user,token,isAuthenticated:Boolean(token),loading,ready,login,register,verifyEmail,resendVerification,googleLogin,logout}}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
