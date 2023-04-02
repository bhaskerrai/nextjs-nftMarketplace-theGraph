import { Form, useNotification, Button } from "web3uikit"
import {ethers} from "ethers"
import nftAbi from "../constants/BasicNft.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from '../constants/NftMarketplace.json'
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from 'react';



export default function Home() {

  const { chainId, account, isWeb3Enabled } = useMoralis()
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]

  const dispatch = useNotification()
  const [proceeds, setProceeds] = useState("0")

  const { runContractFunction } = useWeb3Contract()

  async function approveAndList(data) {
    console.log("Approving...")
    const nftAddress = data.data[0].inputResult
    const tokenId = data.data[1].inputResult
    const price = ethers.utils.parseUnits(data.data[2].inputResult.toString(), "ether").toString()

  
    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId
      }
    }

    await runContractFunction({
      params: approveOptions,
      onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
      onError: (error) => {
        console.log(error)
      },
    })
  
  }



  async function handleApproveSuccess(nftAddress, tokenId, price) {
    console.log("Ok, now time to list.")

    const listOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price
      },

    }

    await runContractFunction({
      params: listOptions,
      onSuccess: () => handleListSuccess(),
      onError: (error) => {
        console.log(error)
      },
    })

  }

  async function handleListSuccess() {
    dispatch({
      type: "success",
      message: "NFT Listed",
      title: "NFT Listed",
      position: "topR"
    })

  }

  const handleWithdrawSuccess = () => {
    dispatch({
      type: "success",
      message: "Withdrawing proceeds",
      position: "topR",
    })
  }

  async function setupUI() {
    const returnedProceeds = await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getProceeds",
        params: {
          seller: account,
        },
      },
      onError: (error) => console.log(error),
    })

    if (returnedProceeds) {
      setProceeds(returnedProceeds.toString())
    }
  }

  useEffect(() => {
    setupUI()
  }, [proceeds, account, isWeb3Enabled, chainId])

  return (
    <div >

      <div className="w-[1400px] mx-[25%] my-16">
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: "NFT Address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },

          {
            name: "Token ID",
            type: "number",
            inputWidth: "50%",
            value: "",
            key: "tokenId",
          },

          {
            name: "Price",
            type: "number",
            inputWidth: "50%",
            value: "",
            key: "price",
          },
        ]}
        title={<div className="mx-[13%] font-bold lg:text-[35px] md:text-[50px] sm:text-[60px] text-[35px] mb-[46px] uppercase text-black">Sell Your NFT !</div>}
        id="Main Form"
        buttonConfig={{theme:"primary"}}
      />
      </div>

      <div className="py-4 px-4 text-xl text-center">Withdraw {proceeds} proceeds</div>

      {proceeds != "0" ? (

        <div className="py-2 flex justify-center h-14 w-auto ">

        <Button
          onClick={() => {
            runContractFunction({
              params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "withdrawProceeds",
                params: {},
              },
              onError: (error) => console.log(error),
              onSuccess: () => handleWithdrawSuccess(),
            })
          }}
          text="Withdraw"
          type="button"
          theme="secondary"
          />

        </div>
      
      ) : (
        <div className="py-2 px-4 text-center">No proceeds detected</div>
      
      )}

      
    </div>
  )
}





