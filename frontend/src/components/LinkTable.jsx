import LinkRow from "./LinkRow"
import linkService from "../../services/linkService"
const LinkTable = ({links, setLinks}) => {


    const handleDelete = (id) => {
        const linkToDelete = links.find(link => link.id === id)
        console.log('link to delete: ', linkToDelete)
        if(confirm(`delete ${linkToDelete.name} ?`)){
            linkService.deleteLink(id)
            .then(setLinks(links.filter(link => link.id !== id)))
        }
    }

    return(
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Link</th>
                    <th>Latest price</th>
                    <th>Price updated</th>
                    <th>Created</th>
                    <th>Delete</th> 
                </tr>
            </thead>
            <tbody>
                {links.map(link => {
                    return (
                        <LinkRow link = {link} key = {link.id} handleDelete = {handleDelete} />
                    )
                })}
            </tbody>
        </table>
    )
}
export default LinkTable