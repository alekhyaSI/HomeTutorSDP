import axios from 'axios'

export const API_BASE = 'http://localhost:1202'
export const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use(cfg => {
  try{
    const u = JSON.parse(localStorage.getItem('user'))
    if(u?.token){ cfg.headers = cfg.headers || {}; cfg.headers.Authorization = 'Bearer '+u.token }
  }catch(e){}
  return cfg
})

export default api
