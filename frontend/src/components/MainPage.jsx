import LinkTable from "./LinkTable"
import Header from "./Header"
 const MainPage = ({links}) => {
   return (
    <>
        <Header/>
        <LinkTable links = {links}/>
    </>
   )
}

export default MainPage