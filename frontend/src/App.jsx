import { useState, useEffect } from 'react'
import MainPage from './components/MainPage'
import linkService from '../services/linkService'



function App() {
  const initialLinks = [
    {
      name: 'buty vans',
      link: 'https://www.zalando.pl/vans-authentic-tenisowki-niskie-czarny-va212z002-802.html?size=43',
      regularSelector: 'span.sDq_FX._4sa1cA.dgII7d.HlZ_Tf',
      discountSelector: 'span.sDq_FX._4sa1cA.dgII7d.HlZ_Tf',
      latestPrice: 269,
      isPriceSeen: true,
      createdAt: '2024-07-23T20:05:45.844Z',
      updatedAt: '2024-07-23T20:11:06.023Z',
      id: '66a00d19116272917049f394'
    }
  ]
  const [links, setLinks] = useState([])
  

  useEffect(()=> {
    linkService.getAll().then(receivedLinks => setLinks(receivedLinks))
  }, [])
  return (
    <>
      <MainPage links = {links} setLinks = {setLinks} />
    </>
  )
}

export default App
