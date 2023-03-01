import { Modal, Input, useNotification } from "web3uikit"
import {useState} from 'react';
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from '../constants/NftMarketplace.json';
import {ethers} from 'ethers';

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {

    const dispatch = useNotification()

    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const handleUpdateListingSuccess = () => {

        dispatch({
            type: "success",
            message: "Listing Updated successfully",
            title: "Listing Updated - please refresh",
            position: "topR",
        })

        onClose && onClose()
        setPriceToUpdateListingWith("0")

    }

    const { runContractFunction: updateListing} = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),

        }


    })

    // const { runContractFunction: buyItem} = useWeb3Contract({
    //     abi: nftMarketplaceAbi,
    //     contractAddress: marketplaceAddress,
    //     functionName: "buyItem",
    //     msgValue: price,
    //     params: {
    //         nftAddress: nftAddress,
    //         tokenId: tokenId,

    //     }


    // })



    return (
        <Modal 
            isVisible={isVisible} 
            onCancel={onClose} 
            onCloseButtonPressed={onClose}
            onOk={()=> {
                updateListing({
                    onError: (error) => { console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess()
                })
            }}
        >
            <Input 
                label="Update listing price in l1 currency (ETH)" 
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    )
}
