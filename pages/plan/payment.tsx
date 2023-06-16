import React from 'react'
import axios, { AxiosError } from 'axios'
import Head from 'next/head'
import Image from 'next/image'
import { useMutation } from 'react-query'
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING,
} from '@paypal/react-paypal-js'


const payment = () => {
  return (
    <div>payment</div>
  )
}

export default payment