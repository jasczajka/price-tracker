import LinkTable from "./LinkTable"
import Header from "./Header"
 const MainPage = ({links, setLinks}) => {
   return (
    <>
        <Header setLinks = {setLinks } links = {links}/>
        <LinkTable links = {links} setLinks = {setLinks}/>
    </>
   )
}

export default MainPage