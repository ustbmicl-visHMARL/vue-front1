import axios from 'axios'

export const goalApi = (data: any) => {
  return axios.post('/lida/goal', data)
}

export const visualizeApi = (data: any) => {
  return axios.post('/lida/visualize', data)
}

export const editApi = (data: any) => {
  return axios.post('/lida/visualize/edit', data)
}

export const explainApi = (data: any) => {
  return axios.post('/lida/visualize/explain', data)
}

export const recommendApi = (data: any) => {
  return axios.post('/lida/visualize/recommend', data)
}

export const evaluateApi = (data: any) => {
  return axios.post('/lida/visualize/evaluate', data)
}

export const repairApi = (data: any) => {
  return axios.post('/lida/visualize/repair', data)
}
