import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../lib/UserContext';
import { magic, web3 } from '../lib/magic';
import { abiU } from '../contracts/abiU';
import Link from 'next/link';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { CallToAction, TextButton, useToast, HoverActivatedTooltip, MonochromeIcons, Linkable } from '@magiclabs/ui';

const Header = () => {
  const [user, setUser] = useContext(UserContext);
  const [balance, setBalance] = useState('0');
  const [switcher, setSwitcher] = useState(false);
  const [switcher1, setSwitcher1] = useState(false);
  const [switcher2, setSwitcher2] = useState(false);
  const [switcher3, setSwitcher3] = useState(false);
  const [switcher4, setSwitcher4] = useState(false);
  const [dp, setDP] = useState('');
  const [what, setWhat] = useState('Explore')
  const [link, setLink] = useState('/')
  const [whatC, setWhatC] = useState('Community')
  const [linkC, setLinkC] = useState('/community')
  const router = useRouter();
  const { createToast } = useToast();

  const userAddress = process.env.NEXT_PUBLIC_USER_ADDRESS;
  const contractUser = new web3.eth.Contract(abiU, userAddress);

  useEffect(() => {
    if (!user) return;
    getBalance(user.publicAddress);
  }, [user]);

  const logout = () => {
    magic.user.logout().then(() => {
      setUser();
      Router.push('/login');
    });
  };

  const getBalance = async (address) => {
    const balance = await web3.eth.getBalance(address);
    setBalance(web3.utils.fromWei(balance));
    const userProfiles = await contractUser.methods.getAllUsers().call();
    var i;
    for (i = 0; i < userProfiles.length; ++i) {
      if ((userProfiles[i].userAddress).toUpperCase() === (user.publicAddress).toUpperCase()) {
        setDP(userProfiles[i].displayPic);
      }
    }
  };

  const copyAddress = async () => {
    navigator.clipboard.writeText(user.publicAddress);
    createToast({
      message: 'Address Copied!',
      type: 'success',
      lifespan: 2000,
    });
  };

  async function changeDirectionwork(type) {
    setWhat(type)
    if (type === "For You") {
      setLink('/')
    }
    else if (type === "Library") {
      setLink('/library')
    }
  }

  async function changeDirectioncomm(type) {
    setWhatC(type)
    if (type === "Community Leaderboard") {
      setLinkC('/community/')
    }
    else if (type === "All Communities") {
      setLinkC('/community/all')
    }
    else if (type === "Create a Community") {
      setLinkC('/community/create')
    }
  }

  return (
    <header>
      <nav className={user ? 'nv1' : 'nv2'}>
        <ul>
          {!user ? (
            <>
              <div className="nav-container">
                <div className="nav-div">
                  <li>
                    <Link href="/showcase">
                      <img src='/oustro_logo_b.svg' 
                      alt='image of Oustro logo'
                      className='logo' />
                    </Link>
                  </li>
                </div>
                <div className="nav-div">
                  <li>
                    <Link href="/about">
                      <CallToAction
                        color={
                          router.pathname === '/about' ? 'primary' : 'secondary'
                        }
                        size="sm"
                      >
                        About Us
                      </CallToAction>
                    </Link>
                  </li>
                  <li>
                    <HoverActivatedTooltip
                      arrow
                      placement="top"
                      onMouseOver={() => setSwitcher(true)}
                      onMouseLeave={() => setSwitcher(false)}
                    >
                      <HoverActivatedTooltip.Anchor>
                        <CallToAction
                          color='secondary'
                          size="sm"
                          trailingIcon={switcher ? MonochromeIcons.CaretDown : MonochromeIcons.CaretRight}
                          onMouseOver={() => setSwitcher(true)}
                          onMouseLeave={() => setSwitcher(false)}
                        >
                          FAQs
                        </CallToAction>
                      </HoverActivatedTooltip.Anchor>
                      <HoverActivatedTooltip.Content>
                        <div>
                          <Link
                          href="/faq"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.QuestionFilled}
                            >
                              General Questions
                            </TextButton> 
                          </Link>
                          <p>The one-stop shop for all questions regarding Oustro.</p>
                          <br />
                          <Link
                          href="/faq"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.SocialShare}
                            >
                              Blog
                            </TextButton> 
                          </Link>
                          <p>Read about what we're up to and stay updated on all things web3 and NFT.</p>
                          <br />
                          <Link
                          href="/code"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.Document}
                            >
                              Code of Conduct
                            </TextButton> 
                          </Link>
                          <p>Learn the do's and don'ts of Oustro.</p>
                          <br />
                          <Link
                          href="/legal"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.EyeOpen}
                            >
                              Legal
                            </TextButton> 
                          </Link>
                          <p>Somethings our lawyers said we needed to have.</p>
                          <br />
                          <Link
                          href="/trust"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.Profile}
                            >
                              Trust
                            </TextButton> 
                          </Link>
                          <p>Learn what we've done to ensure your experience on Oustro is safe.</p>
                          <br />
                          <Link
                          href="/sustainability"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.Lightbulb}
                            >
                              Sustainability
                            </TextButton> 
                          </Link>
                          <p>Find out how Oustro is pioneering greener NFTs.</p>
                        </div>
                      </HoverActivatedTooltip.Content>
                    </HoverActivatedTooltip>
                  </li>
                  <li>
                    <Link href="/login">
                      <CallToAction
                        outline={
                          router.pathname !== '/login' ? true : false
                        }
                        size="md"
                      >
                        Login / Sign Up
                      </CallToAction>
                    </Link>
                  </li>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="nav-container">
                <div className="nav-div">
                <li>
                  <HoverActivatedTooltip
                    arrow
                    placement="top"
                    onMouseOver={() => setSwitcher(true)}
                    onMouseLeave={() => setSwitcher(false)}
                  >
                    <HoverActivatedTooltip.Anchor>
                      <Link href={link}>
                        <CallToAction
                          color={
                            router.pathname === '/' || router.pathname === '/library'
                              ? 'primary'
                              : 'secondary'
                          }
                          trailingIcon={switcher ? MonochromeIcons.CaretDown : MonochromeIcons.CaretRight}
                          onMouseOver={() => setSwitcher(true)}
                          onMouseLeave={() => setSwitcher(false)}
                          size="sm"
                        >
                          {what}
                        </CallToAction>
                      </Link>
                    </HoverActivatedTooltip.Anchor>
                    <HoverActivatedTooltip.Content>
                      <div>
                        <Link href="/">
                          <TextButton
                            leadingIcon={MonochromeIcons.Profile}
                            size="sm"
                            onClick={() => changeDirectionwork("For You")}
                          >
                            For You
                          </TextButton>
                        </Link>
                        <br />
                        <Link href="/library">
                          <TextButton
                            size="sm"
                            leadingIcon={MonochromeIcons.Lightbulb}
                            onClick={() => changeDirectionwork("Library")}
                          >
                            Library
                          </TextButton>
                        </Link>
                      </div>
                    </HoverActivatedTooltip.Content>
                  </HoverActivatedTooltip>
                  </li>
                  <li>
                    <HoverActivatedTooltip
                      arrow
                      placement="top"
                      onMouseOver={() => setSwitcher1(true)}
                      onMouseLeave={() => setSwitcher1(false)}
                    >
                      <HoverActivatedTooltip.Anchor>
                        <Link href={linkC}>
                          <CallToAction
                            trailingIcon={switcher1 ? MonochromeIcons.CaretDown : MonochromeIcons.CaretRight}
                            onMouseOver={() => setSwitcher1(true)}
                            onMouseLeave={() => setSwitcher1(false)}
                            color={
                              router.pathname === '/community' || 
                              router.pathname === '/community/all' || 
                              router.pathname === '/community/create' ? 'primary' : 'secondary'
                            }
                            size="sm"
                          >
                            {whatC}
                          </CallToAction>
                        </Link>
                      </HoverActivatedTooltip.Anchor>
                      <HoverActivatedTooltip.Content>
                        <div>
                          <Link href="/community/">
                            <TextButton
                              leadingIcon={MonochromeIcons.Comment}
                              size="sm"
                              onClick={() => changeDirectioncomm("Community Leaderboard")}
                            >
                              Community Learderboard
                            </TextButton>
                          </Link>
                          <br />
                          <Link href="/community/all">
                            <TextButton
                              size="sm"
                              leadingIcon={MonochromeIcons.Home}
                              onClick={() => changeDirectioncomm("All Communities")}
                            >
                              All Communities
                            </TextButton>
                          </Link>
                          <br />
                          <Link href="/community/create">
                            <TextButton
                              size="sm"
                              leadingIcon={MonochromeIcons.Add}
                              onClick={() => changeDirectioncomm("Create a Community")}
                            >
                              Create a Community
                            </TextButton>
                          </Link>
                        </div>
                      </HoverActivatedTooltip.Content>
                    </HoverActivatedTooltip>
                  </li>
                  <li>
                    <Link href="/mint">
                      <CallToAction
                        color={
                          router.pathname === '/mint' ? 'primary' : 'secondary'
                        }
                        size="sm"
                      >
                        Publish
                      </CallToAction>
                    </Link>
                  </li>
                  <li>
                    <Link href='/collection'>
                      <CallToAction
                        color={router.pathname === '/collection' ? 'primary' : 'secondary'}
                        size="sm"
                      >
                        Collection
                      </CallToAction>
                    </Link>
                  </li>
                </div>
                <div className="nav-div">
                <li>
                    <HoverActivatedTooltip
                      arrow
                      placement="bottom"
                      onMouseOver={() => setSwitcher2(true)}
                      onMouseLeave={() => setSwitcher2(false)}
                    >
                      <HoverActivatedTooltip.Anchor>
                        <TextButton 
                        size="lg"
                        leadingIcon={MonochromeIcons.Info}
                        trailingIcon={switcher2 ? MonochromeIcons.CaretDown : MonochromeIcons.CaretRight}
                        onMouseOver={() => setSwitcher2(true)}
                        onMouseLeave={() => setSwitcher2(false)}
                        >
                          FAQs
                        </TextButton>
                      </HoverActivatedTooltip.Anchor>
                      <HoverActivatedTooltip.Content>
                      <div>
                          <Link
                          href="/faq"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.QuestionFilled}
                            >
                              General Questions
                            </TextButton> 
                          </Link>
                          <p>The one-stop shop for all questions regarding Oustro.</p>
                          <br />
                          <Link
                          href="/contact"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.SocialShare}
                            >
                              Contact
                            </TextButton> 
                          </Link>
                          <p>Let's work together and make Oustro even better!</p>
                          <br />
                          <Link
                          href="/code"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.Document}
                            >
                              Code of Conduct
                            </TextButton> 
                          </Link>
                          <p>Learn the do's and don'ts of Oustro.</p>
                        </div>
                      </HoverActivatedTooltip.Content>
                    </HoverActivatedTooltip>
                  </li>
                  <li>
                    <HoverActivatedTooltip
                      arrow
                      placement="top"
                      appearance='none'
                      onMouseOver={() => setSwitcher3(true)}
                      onMouseLeave={() => setSwitcher3(false)}
                    >
                      <HoverActivatedTooltip.Anchor>
                        <TextButton 
                        color="tertiary" 
                        size="sm"
                        trailingIcon={switcher3 ? MonochromeIcons.CaretDown : MonochromeIcons.CaretRight}
                        onMouseOver={() => setSwitcher3(true)}
                        onMouseLeave={() => setSwitcher3(false)}
                        >
                            <img className="image-logo" src="/p2.svg" />
                            {balance.substring(0, 6)} MATIC
                        </TextButton>
                      </HoverActivatedTooltip.Anchor>
                      <HoverActivatedTooltip.Content>
                        <div>
                          <iframe
                            src="https://widget.onramper.com?color=266677&apiKey=pk_test_O5oTM6u9D3jXLHpXkPQWK_tD4dClwuplybJk0sZHyQc0"
                            style={{
                              height: 640,
                              width: 300,
                            }}
                          >
                          </iframe>
                        </div>
                      </HoverActivatedTooltip.Content>
                    </HoverActivatedTooltip>
                  </li>
                  <li>
                    <HoverActivatedTooltip
                      arrow
                      placement="top"
                      onMouseOver={() => setSwitcher4(true)}
                      onMouseLeave={() => setSwitcher4(false)}
                    >
                      <HoverActivatedTooltip.Anchor>
                        <CallToAction
                          color="primary"
                          size="sm"
                          outline="none"
                          leadingIcon={MonochromeIcons.Copy}
                          trailingIcon={switcher4 ? MonochromeIcons.CaretDown : MonochromeIcons.CaretRight}
                          onMouseOver={() => setSwitcher4(true)}
                          onMouseLeave={() => setSwitcher4(false)}
                          onPress={copyAddress}
                        >
                          {user.publicAddress.substring(0, 6)}...
                          {user.publicAddress.substring(38)}
                        </CallToAction>
                      </HoverActivatedTooltip.Anchor>
                      <HoverActivatedTooltip.Content>
                        <Linkable>
                          <a 
                          target="_blank"
                          href="https://reveal.magic.link/oustro"
                          >
                            <TextButton
                            leadingIcon={MonochromeIcons.Fingerprint}
                            size='md'>
                              Reveal Secret Key
                            </TextButton>
                          </a>
                        </Linkable>
                      </HoverActivatedTooltip.Content>
                    </HoverActivatedTooltip>
                  </li>
                  <li>
                    <HoverActivatedTooltip
                      arrow
                      placement="bottom"
                    >
                      <HoverActivatedTooltip.Anchor>
                        <img
                        src={dp ? dp : "/default.png"}
                        width={50}
                        height={50}
                        className="nft-img-profile-pic"
                        onError={(e) => (e.target.src = '/fallback.jpeg')}
                        />
                      </HoverActivatedTooltip.Anchor>
                      <HoverActivatedTooltip.Content>
                        <Link href="/profile">
                          <TextButton
                            size="sm"
                          >
                            Profile
                          </TextButton>
                        </Link>
                        <TextButton
                        size="sm" 
                        color='error'
                        onPress={logout}
                        >
                          Logout
                        </TextButton>
                      </HoverActivatedTooltip.Content>
                    </HoverActivatedTooltip>
                  </li>
                </div>
              </div>
            </>
          )}
        </ul>
      </nav>
      <style jsx>{`

        .wha {
          min-width: 570px;
        }
        .nv2 {
          max-width: 80rem;
          margin: 15px auto;
          min-height: 70px;
          border-bottom: 1px solid #f0f0f0;
        }

        .nv1 {
          max-width: 80rem;
          margin: 15px auto;
          min-height: 70px;
        }

        .nft-img-profile-pic {
          border-radius: 25px;
        }

        .image-logo {
          margin-left: 5px;
          margin-right: 5px;
          max-width: 25px;
        }

        .logo {
          max-width: 250px;
        }

        .nav-container,
        .nav-div {
          display: flex;
        }

        .banner {
          min-height: 30px;
          min-width: 10rem;
          text-align: center;
        }

        .nav-container {
          justify-content: space-between;
        }

        .nav-div {
          align-items: center;
        }

        img {
          max-width: 9.5rem;
        }

        li {
          margin: 0 10px;
        }

        @media (max-width: 800px) {
          .nav-container {
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            height: 100px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
