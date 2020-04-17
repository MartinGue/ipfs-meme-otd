import { get } from 'lodash'
import { createSelector } from 'reselect'
//import { formatTokens } from '../helpers'
//import moment from 'moment'

// Web3
const web3Connection = state => get(state, 'web3.connection', null)
export const web3ConnectionSelector = createSelector(
  web3Connection, connection => connection
)

const account = state => get(state, 'web3.account', null)
export const accountSelector = createSelector(account, a => a)

const network = state => get(state, 'web3.network', null)
export const networkSelector = createSelector(network, n => n)

