import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../lib/UserContext';
import Link from 'next/link'
import { web3 } from '../lib/magic';
import { abi } from '../contracts/abi';
import { abiU } from '../contracts/abiU';
import { TextField, CallToAction, TextButton, MonochromeIcons, useToast, HoverActivatedTooltip } from '@magiclabs/ui';
import { useRouter } from 'next/router'

//types indicates whether or not it is a regular nft card on the index page or owned card on collection
// status refers to whether or not the NFT is for sale

export default function NFTCard({ nft, price, status, types, star, num, check, going, take }) {
  const contractAddress = process.env.NEXT_PUBLIC_COLLECTION_ADDRESS;
  const userAddress = process.env.NEXT_PUBLIC_USER_ADDRESS;
  const contract = new web3.eth.Contract(abi, contractAddress);
  const contractUser = new web3.eth.Contract(abiU, userAddress);

  const [user] = useContext(UserContext);
  const [newPrice, setNewPrice] = useState();
  const [disabled, setDisabled] = useState(false);
  const [msg, setMsg] = useState(false);
  const [msg1, setMsg1] = useState(false);
  const [creator, setCreator] = useState(nft.creator);
  const [changed, setChanged] = useState(false);
  const [userVerify, setUserVerify] = useState(false);
  const { createToast } = useToast();

  var path = '';
  const router = useRouter()

  useEffect(() => {
    getMyNFTs();
  }, [user]);

  const getMyNFTs = async () => {
    const userProfiles = await contractUser.methods.getAllUsers().call();
    var i;
    for (i = 0; i < userProfiles.length; ++i) {
      if ((userProfiles[i].userAddress).toUpperCase() === (nft.creator).toUpperCase()) {
        setCreator(userProfiles[i].username);
        setChanged(true);
        setUserVerify(userProfiles[i].verify)
      }
    }
  }

  const changePrice = async () => {
    setDisabled(true);
    const errorsFound = await checkForErrors(2);
    if (errorsFound) {
      return setDisabled(false);
    }
    try {
      setMsg(true);
      const response = await fetch('https://gasstation-mainnet.matic.network/v2');
      const next = await response.json();
      const receipt = await contract.methods
      .changePrice(parseInt(nft.tokenID), web3.utils.toWei(newPrice), user.publicAddress)
      .send({ 
        from: user.publicAddress,
        gas: 1000000,
        maxPriorityFeePerGas: web3.utils.toWei((parseInt(next.fast.maxPriorityFee)).toString(), "Gwei")
      });
      console.log(receipt)
      setNewPrice('');
      setDisabled(false);
      setMsg(false);
      router.reload(window.location.pathname);
    } 
    catch (error) {
      console.log(error);
      setDisabled(false);
      setMsg(false);
    }
  }

  const changeStatus = async () => {
    setDisabled(true);
    const errorsFound = await checkForErrors(1);
    if (errorsFound) { 
      return setDisabled(false);
    }
    try {
      setMsg1(true);
      const response = await fetch('https://gasstation-mainnet.matic.network/v2');
      const next = await response.json();
      const receipt = await contract.methods
      .changeMarketStatus(parseInt(nft.tokenID), user.publicAddress)
      .send({ 
        from: user.publicAddress,
        gas: 1000000,
        maxPriorityFeePerGas: web3.utils.toWei((parseInt(next.fast.maxPriorityFee)).toString(), "Gwei")
      });
      console.log(receipt)
      setDisabled(false);
      setMsg1(false);
      router.reload(window.location.pathname);
    } 
    catch (error) {
      console.log(error);
      setDisabled(false);
      setMsg1(false);
    }
  }

  const checkForErrors = async (val) => {
    // Throw error if missing input values
    var reason = '';
    if (val === 1) {
      reason = "Take off the Marketplace"
    }
    else if (val === 2) {
      reason = "Change the Price"
    }
    // Throw error if user does not have enough ETH for gas fee
    const weiBalance = await web3.eth.getBalance(user.publicAddress);
    const MaticBalance = web3.utils.fromWei(weiBalance);
    if (MaticBalance < 0.5) {
      createToast({
        message: 'Wallet Balance Too Low to ' + reason + " (gas fees).",
        type: 'error',
        lifespan: 2000,
      });
      return true;
    }
    // No errors found
    return false;
  };

  return (
    <>
      <div className="card">
        <div className="name">
          <Link href={{pathname: '/s/[id]', query: { id: nft.tokenID }}}>
            <CallToAction>
              { star } / 5
            </CallToAction>
          </Link> from { num } ratings
        </div>
        <div className="nft-img-container">
          <Link href={{pathname: '/s/[id]', query: { id: nft.tokenID }}}>
            <img
            src={nft.image}
            width={400}
            className="nft-img"
            onError={(e) => (e.target.src = '/fallback.jpeg')}
            />
          </Link>
        </div>
        {check === '0' || check === '1' ? (
          <div className='name'>
            <Link href={{pathname: '/s/[id]', query: { id: nft.tokenID }}}>
              <TextButton
              color="tertiary"
              outline="none"
              >
                {nft.name} &rarr;
              </TextButton>
            </Link>
          </div>
        ) : check === "2" ? (
          <div className="name">
            <Link href={{pathname: '/s/[id]', query: { id: nft.tokenID }}}>
              <TextButton
              leadingIcon={MonochromeIcons.AsteriskBold}
              color="warning"
              outline="none"
              >
                {nft.name} &rarr;
              </TextButton>
            </Link>
          </div> 
        ) : (
          <div className="name">
            <Link href={{pathname: '/s/[id]', query: { id: nft.tokenID }}}>
              <TextButton
              leadingIcon={MonochromeIcons.Exclaim}
              color="error"
              outline="none"
              >
                {nft.name} &rarr;
              </TextButton>
            </Link>
          </div> 
        )}
        {changed ? (
          <div className="name">
            <Link href={{pathname: '/u/[user]', query: { user: nft.creator }}}>
              <TextButton
              trailingIcon={userVerify && (MonochromeIcons.SuccessFilled)}
              >
                {creator}
              </TextButton>
            </Link>
          </div>
        ) : (
          <div className="name">
            <Link href={{pathname: '/u/[user]', query: { user: nft.creator }}}>
              <TextButton
              trailingIcon={userVerify && (MonochromeIcons.SuccessFilled)}
              >
                {creator.substring(0, 6)}...{creator.substring(38)}
              </TextButton>
            </Link>
          </div>
        )}
        {types ? (
          <>
            {status && (
              <div className="name1">
                <HoverActivatedTooltip>
                  <HoverActivatedTooltip.Anchor>
                    <CallToAction
                    color="primary"
                    size="sm"
                    outline="none"
                    >
                      <img className="image-logo" src="/p2.svg" />
                      { web3.utils.fromWei(price) } MATIC
                    </CallToAction>
                  </HoverActivatedTooltip.Anchor>
                  <HoverActivatedTooltip.Content>
                    <div className='name'>
                      <h6>
                        This NFT is for sale
                      </h6>
                    </div>
                  </HoverActivatedTooltip.Content>
                </HoverActivatedTooltip>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="name3">
              current price: { web3.utils.fromWei(price) } MATIC
            </div>
            <div className="name">
              <TextField
              disabled={disabled}
              placeholder="New Price"
              type="number"
              onChange={(e) => setNewPrice(e.target.value)}
              value={newPrice}
              />
              <div className='name3'>
                <HoverActivatedTooltip>
                  <HoverActivatedTooltip.Anchor>
                    <TextButton
                    disabled={disabled}
                    color="primary"
                    size="sm"
                    onClick={changePrice}
                    >
                      Change Price
                    </TextButton>

                  </HoverActivatedTooltip.Anchor>
                  <HoverActivatedTooltip.Content>
                    <div className='name2'>
                      <h6>
                        Changing the price will reduce the number of MATIC in your account to pay gas fees
                      </h6>
                    </div>
                  </HoverActivatedTooltip.Content>
                </HoverActivatedTooltip>
              </div>
              {msg && (
                <div className='name'>
                  Found the eraser, we'll be back real quick
                </div>
              )}
            </div>
            {price !== '0' && (
              <>
                {status ? (
                  <>
                    <div className="name3">
                      <HoverActivatedTooltip>
                        <HoverActivatedTooltip.Anchor>
                          <CallToAction
                          disabled={disabled}
                          color="primary"
                          size="sm"
                          onClick={changeStatus}
                          >
                            Take Off Market
                          </CallToAction>
                        </HoverActivatedTooltip.Anchor>
                        <HoverActivatedTooltip.Content>
                          <div className='name2'>
                            <h6>
                              This action requires gas fees to perform
                            </h6>
                          </div>
                        </HoverActivatedTooltip.Content>
                      </HoverActivatedTooltip>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="name1">
                      <HoverActivatedTooltip>
                        <HoverActivatedTooltip.Anchor>
                          <CallToAction
                          disabled={disabled}
                          color="primary"
                          size="sm"
                          onClick={changeStatus}
                          >
                            Put On Market
                          </CallToAction>
                        </HoverActivatedTooltip.Anchor>
                        <HoverActivatedTooltip.Content>
                          <div className='name2'>
                            <h6>
                              This action requires gas fees to perform
                            </h6>
                          </div>
                        </HoverActivatedTooltip.Content>
                      </HoverActivatedTooltip>
                    </div>
                  </>
                )}
              </>
            )}
            {msg1 && (
              <div className='name'>
                We're going to the market, need anything?
              </div>
            )}
          </>
        )}
      </div>
      <style>{`
        .image-logo {
          margin-right: 5px;
          max-width: 20px;
        }
        .card {
          border-radius: 20px;
          padding: 10px;
          // box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 16px, rgba(0, 0, 0, 0.05) 0px 0px 16px;
          // transition: 0.2s;
        }

        .nft-img:hover {
          -webkit-filter: brightness(87%);
          box-shadow: rgba(0, 0, 0, 0.29) 0px 0px 16px,
          rgba(0, 0, 0, 0.1) 0px 0px 16px;
          transition: 0.2s;
        }

        .nft-img-container {
          margin-top: 5px;
          min-width: 250px;
          min-height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nft-img {
          max-width: 250px;
          max-height: 250px;
          cursor: pointer;
          border-radius: 15px;
          transition: 0.2s;
        }

        .comms {
          margin-top: 15px;
          margin-bottom: 15px;
          text-align: center;
        }

        .name {
          margin-top: 3px;
          text-align: center;
        }
        .name2 {
          width: 280px;
          text-align: center;
        }
        .name1 {
          margin-top: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .name3 {
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        h6 {
          font-size: 17px;
        }
      `}</style>
    </>
  );
}