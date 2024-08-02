import LinkRow from "./LinkRow"

const LinkTable = ({links}) => {
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
                        <LinkRow link = {link} key = {link.id} />
                    )
                })}
            </tbody>
        </table>
    )
}
export default LinkTable