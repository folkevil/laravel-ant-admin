import request from '@/utils/request'

const api = {
    Admin: '/user'
}

export function fetchAccount() {
  return request({
    url: api.Admin + '/list',
    method: 'get'
  })
}

export function fetchData() {
  return request({
    url: `${api.Admin}/data`,
    method: 'get'
  })
}

export function getAccount(id) {
  return request({
    url: `${api.Admin}/${id}`,
    method: 'get'
  })
}

export function createAccount(data) {
  return request({
    url: api.Admin,
    method: 'post',
    data
  })
}

export function updateAccount(id, data) {
  return request({
    url: `${api.Admin}/${id}`,
    method: 'put',
    data
  })
}

export function deleteAccount(id) {
  return request({
    url: `${api.Admin}/${id}`,
    method: 'delete'
  })
}

export function modifyProfile(data) {
    return request({
        url: `${api.Admin}`,
        method: 'put',
        data: data
    })
}
